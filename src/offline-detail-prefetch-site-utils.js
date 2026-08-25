export function createOfflineDetailPrefetchSiteHelpers({
  appendOfflineChildItemsWithMeta=()=>{},
  appendOfflineItems=()=>{},
  cacheOfflineMediaUrls=async()=>0,
  detailMetaChanged=()=>false,
  embeddedItemsForOffline=()=>[],
  getFsMod=()=>null,
  getDb=()=>null,
  isFirebaseReady=()=>false,
  isOnline=()=>true,
  loadSiteChildItemsForOffline=async()=>[],
  localOfflineDetailMeta=()=>({protocols:{},serviceRecords:{},photos:{},attachments:{}}),
  mergeSiteLocalArray=()=>{},
  offlinePhotoUrls=()=>[],
  offlineRowFingerprint=()=>"",
  readOfflineSiteMeta=()=>null,
  readOfflineStandaloneHistoryCollection=async()=>[],
  refreshSiteDataFromFirebase=async()=>{},
  writeOfflineSiteMeta=()=>{}
}={}){
  async function prefetchOfflineDetailsForSite(site,options={}){
    const result={sites:1,protocols:0,serviceRecords:0,photos:0,attachments:0,media:0,skipped:false,changed:false,full:false};
    if(!site || !isOnline() || !isFirebaseReady() || !getDb() || !getFsMod()) return result;
    const previousMeta=readOfflineSiteMeta(site);
    const localBefore=localOfflineDetailMeta(site);
    const incremental=options.incremental!==false && options.forceFull!==true && !!(previousMeta && previousMeta.syncedAtMs);
    const sinceMs=incremental ? Number(previousMeta.syncedAtMs) || 0 : 0;
    const rowFingerprintBefore=offlineRowFingerprint(site);
    const rowChanged=!previousMeta || previousMeta.rowFingerprint!==rowFingerprintBefore;
    result.full=!incremental;
    if((!site.firebaseData || !site.firebaseData.raw) && (!incremental || rowChanged)){
      try{ await refreshSiteDataFromFirebase(site); }catch(e){}
    }
    const includeLegacyStandalone=!incremental || (!localBefore.protocols.count && !localBefore.serviceRecords.count);
    const [childProtocols,childRecords,childPhotos,childAttachments,standaloneProtocols,standaloneRecords]=await Promise.all([
      loadSiteChildItemsForOffline("protocols",site,sinceMs),
      loadSiteChildItemsForOffline("serviceRecords",site,sinceMs),
      loadSiteChildItemsForOffline("photos",site,sinceMs),
      loadSiteChildItemsForOffline("attachments",site,sinceMs),
      includeLegacyStandalone ? readOfflineStandaloneHistoryCollection(site,"protocols","Protokol") : Promise.resolve([]),
      includeLegacyStandalone ? readOfflineStandaloneHistoryCollection(site,"serviceRecords","Servisní záznam") : Promise.resolve([])
    ]);
    const includeEmbedded=!incremental || rowChanged;
    const embeddedProtocols=includeEmbedded ? embeddedItemsForOffline(site,"protocolHistory","Protokol","embeddedProtocols","embedded_protocol") : [];
    const embeddedRecords=includeEmbedded ? embeddedItemsForOffline(site,"serviceHistory","Servisní záznam","embeddedServiceRecords","embedded_service") : [];
    const embeddedPhotos=includeEmbedded ? embeddedItemsForOffline(site,"photos","","embeddedPhotos","embedded_photo") : [];
    const embeddedAttachments=includeEmbedded ? embeddedItemsForOffline(site,"attachments","Příloha","embeddedAttachments","embedded_attachment") : [];
    const protocols=[];
    appendOfflineChildItemsWithMeta(protocols,childProtocols,"Protokol","siteProtocols");
    appendOfflineItems(protocols,embeddedProtocols);
    appendOfflineItems(protocols,standaloneProtocols);
    const serviceRecords=[];
    appendOfflineChildItemsWithMeta(serviceRecords,childRecords,"Servisní záznam","siteServiceRecords");
    appendOfflineItems(serviceRecords,embeddedRecords);
    appendOfflineItems(serviceRecords,standaloneRecords);
    const photos=[];
    appendOfflineItems(photos,childPhotos);
    appendOfflineItems(photos,embeddedPhotos);
    const attachments=[];
    appendOfflineItems(attachments,childAttachments);
    appendOfflineItems(attachments,embeddedAttachments);
    if(protocols.length) mergeSiteLocalArray("protocolHistory",protocols,site,180);
    if(serviceRecords.length) mergeSiteLocalArray("serviceHistory",serviceRecords,site,180);
    if(photos.length) mergeSiteLocalArray("photos",photos,site,180);
    if(attachments.length) mergeSiteLocalArray("attachments",attachments,site,180);
    result.protocols=protocols.length;
    result.serviceRecords=serviceRecords.length;
    result.photos=photos.length;
    result.attachments=attachments.length;
    result.media=await cacheOfflineMediaUrls(offlinePhotoUrls(photos));
    const localAfter=localOfflineDetailMeta(site);
    const rowFingerprint=offlineRowFingerprint(site);
    result.changed=!!(
      rowChanged ||
      result.protocols ||
      result.serviceRecords ||
      result.photos ||
      result.attachments ||
      result.media ||
      detailMetaChanged(localBefore.protocols,localAfter.protocols) ||
      detailMetaChanged(localBefore.serviceRecords,localAfter.serviceRecords) ||
      detailMetaChanged(localBefore.photos,localAfter.photos) ||
      detailMetaChanged(localBefore.attachments,localAfter.attachments)
    );
    result.skipped=incremental && !result.changed;
    writeOfflineSiteMeta(site,{
      rowFingerprint,
      syncedAtMs:Date.now(),
      protocols:localAfter.protocols,
      serviceRecords:localAfter.serviceRecords,
      photos:localAfter.photos,
      attachments:localAfter.attachments
    });
    return result;
  }

  return {
    prefetchOfflineDetailsForSite
  };
}
