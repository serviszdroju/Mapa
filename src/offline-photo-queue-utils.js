import {
  withLocalPhotoStore
} from "./offline-photo-db-utils.js";

export function createOfflinePhotoQueueHelpers({
  appendSiteLocalArray,
  clearLocalDetailReadCacheForKind,
  cloneOfflinePhotoItems,
  collectDisplayablePhotoItemsFromLists,
  collectPendingOfflinePhotoItems,
  displayablePhotoItems,
  getDefaultSite,
  invalidateOfflinePhotoCountCache,
  localStorageArrayEntries,
  readCachedLocalDetailItems,
  readSiteLocalArray,
  removeLocalStorageArrayItemByKey,
  removeSiteLocalItem,
  safeValue=value=>String(value ?? "").trim(),
  siteLocalCacheKey,
  siteLocalDetailReadCacheKey,
  siteOfflinePhotoReadCache
}={}){
  const OFFLINE_PHOTO_ALL_READ_CACHE_MS=1200;
  let offlinePhotoAllReadCache={savedAt:0,items:null,promise:null};

  function defaultSite(){
    return typeof getDefaultSite==="function" ? getDefaultSite() : undefined;
  }

  function safeLocal(value){
    return safeValue(value);
  }

  function photoCacheKey(site){
    return typeof siteLocalCacheKey==="function" ? siteLocalCacheKey("photos",site) : "";
  }

  function scheduleOfflineStatus(delay=80){
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(delay);
  }

  function registerPhotoSync(){
    if(window.registerSzzBackgroundSync) window.registerSzzBackgroundSync("photo");
  }

  function invalidatePhotoCounts(){
    if(typeof invalidateOfflinePhotoCountCache==="function") invalidateOfflinePhotoCountCache();
  }

  async function saveOfflinePhotoItem(item,site=defaultSite()){
    const payload={...item,siteCacheKey:photoCacheKey(site)};
    try{
      await withLocalPhotoStore("readwrite",(store)=>{store.put(payload);});
    }catch(e){
      if(typeof appendSiteLocalArray==="function") appendSiteLocalArray("offlinePhotos",payload,site,50);
    }
    if(typeof clearLocalDetailReadCacheForKind==="function") clearLocalDetailReadCacheForKind("photos",site);
    invalidatePhotoCounts();
    scheduleOfflineStatus(80);
    registerPhotoSync();
    return payload;
  }

  async function computeOfflinePhotoItems(site=defaultSite()){
    const cacheKey=photoCacheKey(site);
    const fallback=typeof readSiteLocalArray==="function" ? readSiteLocalArray("offlinePhotos",site) : [];
    try{
      const items=await withLocalPhotoStore("readonly",(store,setResult)=>{
        const req=store.index("siteCacheKey").getAll(cacheKey);
        req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
        req.onerror=()=>setResult([]);
      });
      return collectDisplayablePhotoItemsFromLists([items,fallback]);
    }catch(e){
      return displayablePhotoItems(fallback);
    }
  }

  async function readOfflinePhotoItems(site=defaultSite()){
    const cacheKey=typeof siteLocalDetailReadCacheKey==="function" ? siteLocalDetailReadCacheKey("photos",site) : photoCacheKey(site);
    if(typeof readCachedLocalDetailItems==="function"){
      return readCachedLocalDetailItems(siteOfflinePhotoReadCache,cacheKey,()=>computeOfflinePhotoItems(site));
    }
    return computeOfflinePhotoItems(site);
  }

  function clearOfflinePhotoAllReadCache(){
    offlinePhotoAllReadCache={savedAt:0,items:null,promise:null};
  }

  async function removeOfflinePhotoItem(id,site=defaultSite(),sourceItem=null){
    const cleanId=safeLocal(id);
    if(!cleanId) return;
    try{
      await withLocalPhotoStore("readwrite",(store)=>{store.delete(cleanId);});
    }catch(e){}
    if(typeof removeSiteLocalItem==="function") removeSiteLocalItem("offlinePhotos",cleanId,site);
    const explicitCacheKey=safeLocal(sourceItem && sourceItem.siteCacheKey);
    if(explicitCacheKey && typeof removeLocalStorageArrayItemByKey==="function"){
      removeLocalStorageArrayItemByKey(explicitCacheKey.replace("astipMap:photos:","astipMap:offlinePhotos:"),cleanId);
    }
    if(typeof clearLocalDetailReadCacheForKind==="function") clearLocalDetailReadCacheForKind("photos",site);
    invalidatePhotoCounts();
    scheduleOfflineStatus(80);
  }

  async function computeAllOfflinePhotoItems(){
    const fallback=[];
    const entries=typeof localStorageArrayEntries==="function" ? localStorageArrayEntries("astipMap:offlinePhotos:") : [];
    for(const entry of entries){
      const siteCacheKey=entry.key.replace("astipMap:offlinePhotos:","astipMap:photos:");
      const items=Array.isArray(entry.items) ? entry.items : [];
      for(const item of items){
        if(item) fallback.push({...item,siteCacheKey:item.siteCacheKey || siteCacheKey});
      }
    }
    let indexed=[];
    try{
      indexed=await withLocalPhotoStore("readonly",(store,setResult)=>{
        const req=store.getAll();
        req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
        req.onerror=()=>setResult([]);
      });
    }catch(e){}
    return collectPendingOfflinePhotoItems([indexed,fallback]);
  }

  async function readAllOfflinePhotoItems(){
    const now=Date.now();
    if(Array.isArray(offlinePhotoAllReadCache.items) && now-offlinePhotoAllReadCache.savedAt<OFFLINE_PHOTO_ALL_READ_CACHE_MS){
      return cloneOfflinePhotoItems(offlinePhotoAllReadCache.items);
    }
    if(offlinePhotoAllReadCache.promise){
      return cloneOfflinePhotoItems(await offlinePhotoAllReadCache.promise);
    }
    offlinePhotoAllReadCache.promise=computeAllOfflinePhotoItems()
      .then(items=>{
        const cloned=cloneOfflinePhotoItems(items);
        offlinePhotoAllReadCache={savedAt:Date.now(),items:cloned,promise:null};
        return cloned;
      })
      .catch(e=>{
        offlinePhotoAllReadCache={savedAt:0,items:null,promise:null};
        throw e;
      });
    return cloneOfflinePhotoItems(await offlinePhotoAllReadCache.promise);
  }

  return {
    clearOfflinePhotoAllReadCache,
    readAllOfflinePhotoItems,
    readOfflinePhotoItems,
    removeOfflinePhotoItem,
    saveOfflinePhotoItem
  };
}
