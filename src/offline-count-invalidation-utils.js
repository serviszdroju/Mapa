export function createOfflineCountInvalidationHelpers({
  clearOfflinePhotoAllReadCache,
  clearOfflineSiteQueueReadCache,
  invalidateSzzOfflineCountsCache,
  legacyOfflineSiteQueueKey,
  resetLegacyOfflineSiteCountCache,
  resetOfflinePhotoCountCache,
  resetOfflineSiteCountCache
}){
  function invalidateOfflineSiteCountCache(){
    resetOfflineSiteCountCache();
    resetLegacyOfflineSiteCountCache();
    clearOfflineSiteQueueReadCache();
    invalidateSzzOfflineCountsCache();
  }

  function invalidateOfflinePhotoCountCache(){
    resetOfflinePhotoCountCache();
    clearOfflinePhotoAllReadCache();
    invalidateSzzOfflineCountsCache();
  }

  function bindOfflineCountStorageInvalidation(){
    window.addEventListener("storage",event=>{
      if(!event.key || event.key===legacyOfflineSiteQueueKey){
        invalidateOfflineSiteCountCache();
      }
      if(!event.key || event.key.startsWith("astipMap:offlinePhotos:")){
        invalidateOfflinePhotoCountCache();
      }
    });
  }

  return {
    bindOfflineCountStorageInvalidation,
    invalidateOfflinePhotoCountCache,
    invalidateOfflineSiteCountCache
  };
}
