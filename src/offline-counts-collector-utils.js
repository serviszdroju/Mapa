export function createOfflineCountsCollectorHelpers({
  readAndroidOfflineCounts,
  readCachedFirebaseSiteCount,
  readPendingOfflinePhotoCount,
  readPendingOfflineProtocolCount,
  readPendingOfflineSitesCount,
  readProtocolDraftCount,
  readSzzOfflineCountsCache,
  readSzzOfflineReadyState,
  requestSzzPersistentStorage,
  szzStorageEstimate,
  writeSzzOfflineCountsCache
}){
  async function collectSzzOfflineCounts(){
    const cached=readSzzOfflineCountsCache();
    if(cached) return cached;
    const ready=readSzzOfflineReadyState();
    const [sites,protocols,photos,drafts,storage,estimate,androidCounts]=await Promise.all([
      readPendingOfflineSitesCount(),
      readPendingOfflineProtocolCount(),
      readPendingOfflinePhotoCount(),
      readProtocolDraftCount(),
      requestSzzPersistentStorage({request:false}),
      szzStorageEstimate(),
      Promise.resolve(readAndroidOfflineCounts())
    ]);
    const androidPending=Math.max(0,Number(androidCounts?.pendingOutbox) || 0);
    const androidPhotos=Math.max(0,Number(androidCounts?.pendingPhotos) || 0);
    const androidAttachments=Math.max(0,Number(androidCounts?.pendingAttachments) || 0);
    const nativeVisiblePending=Math.max(androidPending,androidPhotos+androidAttachments);
    const counts={
      sites,
      protocols,
      photos:Math.max(photos,androidPhotos),
      attachments:androidAttachments,
      drafts,
      cachedRows:Math.max(readCachedFirebaseSiteCount(),Number(androidCounts?.cachedSites) || 0),
      persistentStorage:!!(storage.persisted || ready.persistentStorage),
      storageSupported:!!(storage.supported || ready.persistentStorageSupported),
      storageUsage:estimate ? estimate.usage : (Number(ready.storageUsage) || 0),
      storageQuota:estimate ? estimate.quota : (Number(ready.storageQuota) || 0),
      preparedAt:ready.preparedAt || "",
      androidPending,
      pending:Math.max(sites+protocols+photos,nativeVisiblePending)
    };
    return writeSzzOfflineCountsCache(counts);
  }

  return { collectSzzOfflineCounts };
}
