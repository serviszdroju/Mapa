import {
  SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,
  withSzzOfflineQueueStore
} from "./offline-queue-db-utils.js";

export function createOfflineProtocolQueueHelpers({
  clearLocalDetailReadCacheForKind,
  detailLazyKey,
  getDefaultSite,
  invalidateOfflineProtocolCountCache,
  recordMatchesSite,
  safeValue=value=>String(value ?? "").trim(),
  siteLocalCacheKey
}={}){
  const OFFLINE_PROTOCOL_QUEUE_READ_CACHE_MS=1200;
  let offlineProtocolQueueAllReadCache={savedAt:0,items:null,promise:null};
  const offlineProtocolQueueSiteReadCache=new Map();

  function defaultSite(){
    return typeof getDefaultSite==="function" ? getDefaultSite() : undefined;
  }

  function safeLocal(value){
    return safeValue(value);
  }

  function siteCacheKey(site){
    return typeof siteLocalCacheKey==="function" ? siteLocalCacheKey("protocolHistory",site) : "";
  }

  function cloneOfflineProtocolQueueItems(items=[]){
    const source=Array.isArray(items) ? items : [];
    const out=[];
    for(const item of source){
      if(!item) continue;
      out.push(typeof item==="object" ? {...item} : item);
    }
    return out;
  }

  function clearOfflineProtocolQueueReadCache(){
    offlineProtocolQueueAllReadCache={savedAt:0,items:null,promise:null};
    offlineProtocolQueueSiteReadCache.clear();
  }

  function isPendingOfflineProtocolItem(item){
    return !!(item && item._offline && item._syncStatus!=="online");
  }

  function pendingOfflineProtocolItems(items=[]){
    const out=[];
    const source=Array.isArray(items) ? items : [];
    for(const item of source){
      if(isPendingOfflineProtocolItem(item)) out.push(item);
    }
    return out;
  }

  function invalidateProtocolCounts(){
    if(typeof invalidateOfflineProtocolCountCache==="function") invalidateOfflineProtocolCountCache();
  }

  async function saveOfflineProtocolQueueItem(item,site=defaultSite()){
    if(!item || !safeLocal(item._id)) return null;
    const payload={...item,siteCacheKey:siteCacheKey(site)};
    try{
      await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readwrite",(store)=>{store.put(payload);});
      if(typeof clearLocalDetailReadCacheForKind==="function") clearLocalDetailReadCacheForKind("protocolHistory",site);
      invalidateProtocolCounts();
      return payload;
    }catch(e){
      console.warn("IndexedDB frontu protokolů se nepodařilo uložit",e);
      return null;
    }
  }

  async function computeAllOfflineProtocolQueueItems(){
    try{
      const items=await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readonly",(store,setResult)=>{
        const req=store.getAll();
        req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
        req.onerror=()=>setResult([]);
      });
      return pendingOfflineProtocolItems(items);
    }catch(e){
      return [];
    }
  }

  async function readAllOfflineProtocolQueueItems(){
    const now=Date.now();
    if(Array.isArray(offlineProtocolQueueAllReadCache.items) && now-offlineProtocolQueueAllReadCache.savedAt<OFFLINE_PROTOCOL_QUEUE_READ_CACHE_MS){
      return cloneOfflineProtocolQueueItems(offlineProtocolQueueAllReadCache.items);
    }
    if(offlineProtocolQueueAllReadCache.promise){
      return cloneOfflineProtocolQueueItems(await offlineProtocolQueueAllReadCache.promise);
    }
    offlineProtocolQueueAllReadCache.promise=computeAllOfflineProtocolQueueItems()
      .then(items=>{
        const cloned=cloneOfflineProtocolQueueItems(items);
        offlineProtocolQueueAllReadCache={savedAt:Date.now(),items:cloned,promise:null};
        return cloned;
      })
      .catch(e=>{
        offlineProtocolQueueAllReadCache={savedAt:0,items:null,promise:null};
        throw e;
      });
    return cloneOfflineProtocolQueueItems(await offlineProtocolQueueAllReadCache.promise);
  }

  async function computeOfflineProtocolQueueItems(site=defaultSite()){
    const cacheKey=siteCacheKey(site);
    let indexed=[];
    try{
      indexed=await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readonly",(store,setResult)=>{
        const req=store.index("siteCacheKey").getAll(cacheKey);
        req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
        req.onerror=()=>setResult([]);
      });
    }catch(e){}
    if(!indexed.length){
      indexed=(await readAllOfflineProtocolQueueItems()).filter(item=>{
        try{return typeof recordMatchesSite==="function" && recordMatchesSite(item,site);}catch(e){return false;}
      });
    }
    return pendingOfflineProtocolItems(indexed);
  }

  async function readOfflineProtocolQueueItems(site=defaultSite()){
    const cacheKey=siteCacheKey(site) || (typeof detailLazyKey==="function" ? detailLazyKey(site) : "");
    if(!cacheKey) return computeOfflineProtocolQueueItems(site);
    const now=Date.now();
    const cached=offlineProtocolQueueSiteReadCache.get(cacheKey);
    if(cached && Array.isArray(cached.items) && now-cached.savedAt<OFFLINE_PROTOCOL_QUEUE_READ_CACHE_MS){
      return cloneOfflineProtocolQueueItems(cached.items);
    }
    if(cached && cached.promise){
      return cloneOfflineProtocolQueueItems(await cached.promise);
    }
    const promise=computeOfflineProtocolQueueItems(site)
      .then(items=>{
        const cloned=cloneOfflineProtocolQueueItems(items);
        offlineProtocolQueueSiteReadCache.set(cacheKey,{savedAt:Date.now(),items:cloned,promise:null});
        return cloned;
      })
      .catch(e=>{
        offlineProtocolQueueSiteReadCache.delete(cacheKey);
        throw e;
      });
    offlineProtocolQueueSiteReadCache.set(cacheKey,{savedAt:0,items:null,promise});
    return cloneOfflineProtocolQueueItems(await promise);
  }

  async function removeOfflineProtocolQueueItem(id){
    const cleanId=safeLocal(id);
    if(!cleanId) return;
    try{
      await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readwrite",(store)=>{store.delete(cleanId);});
    }catch(e){}
    if(typeof clearLocalDetailReadCacheForKind==="function") clearLocalDetailReadCacheForKind("protocolHistory",null);
    invalidateProtocolCounts();
  }

  return {
    clearOfflineProtocolQueueReadCache,
    isPendingOfflineProtocolItem,
    pendingOfflineProtocolItems,
    readAllOfflineProtocolQueueItems,
    readOfflineProtocolQueueItems,
    removeOfflineProtocolQueueItem,
    saveOfflineProtocolQueueItem
  };
}
