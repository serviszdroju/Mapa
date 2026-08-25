import {
  SZZ_OFFLINE_SITE_QUEUE_STORE,
  withSzzOfflineQueueStore
} from "./offline-queue-db-utils.js";

export function createOfflineSiteQueueHelpers({
  invalidateOfflineSiteCountCache,
  safeValue=value=>String(value ?? "").trim()
}={}){
  const OFFLINE_SITE_QUEUE_READ_CACHE_MS=1200;
  let offlineSiteQueueReadCache={savedAt:0,items:null,promise:null};

  function safeLocal(value){
    return safeValue(value);
  }

  function cloneOfflineSiteQueueItems(items=[]){
    const source=Array.isArray(items) ? items : [];
    const out=[];
    for(const item of source){
      if(!item) continue;
      out.push(typeof item==="object" ? {...item} : item);
    }
    return out;
  }

  function isOfflineSiteQueueItem(item){
    return !!(item && item.docId && item.raw);
  }

  function offlineSiteQueueItems(items=[]){
    const out=[];
    const source=Array.isArray(items) ? items : [];
    for(const item of source){
      if(isOfflineSiteQueueItem(item)) out.push(item);
    }
    return out;
  }

  function countOfflineSiteQueueItems(items=[]){
    const source=Array.isArray(items) ? items : [];
    let count=0;
    for(const item of source){
      if(isOfflineSiteQueueItem(item)) count++;
    }
    return count;
  }

  function clearOfflineSiteQueueReadCache(){
    offlineSiteQueueReadCache={savedAt:0,items:null,promise:null};
  }

  function invalidateSiteCounts(){
    if(typeof invalidateOfflineSiteCountCache==="function") invalidateOfflineSiteCountCache();
  }

  async function saveOfflineSiteQueueItem(item){
    if(!item || !safeLocal(item.docId)) return null;
    try{
      await withSzzOfflineQueueStore(SZZ_OFFLINE_SITE_QUEUE_STORE,"readwrite",(store)=>{store.put({...item});});
      invalidateSiteCounts();
      return item;
    }catch(e){
      console.warn("IndexedDB frontu bodů se nepodařilo uložit",e);
      return null;
    }
  }

  async function computeOfflineSiteQueueItems(){
    try{
      const items=await withSzzOfflineQueueStore(SZZ_OFFLINE_SITE_QUEUE_STORE,"readonly",(store,setResult)=>{
        const req=store.getAll();
        req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
        req.onerror=()=>setResult([]);
      });
      return offlineSiteQueueItems(items);
    }catch(e){
      return [];
    }
  }

  async function readOfflineSiteQueueItems(){
    const now=Date.now();
    if(Array.isArray(offlineSiteQueueReadCache.items) && now-offlineSiteQueueReadCache.savedAt<OFFLINE_SITE_QUEUE_READ_CACHE_MS){
      return cloneOfflineSiteQueueItems(offlineSiteQueueReadCache.items);
    }
    if(offlineSiteQueueReadCache.promise){
      return cloneOfflineSiteQueueItems(await offlineSiteQueueReadCache.promise);
    }
    offlineSiteQueueReadCache.promise=computeOfflineSiteQueueItems()
      .then(items=>{
        const cloned=cloneOfflineSiteQueueItems(items);
        offlineSiteQueueReadCache={savedAt:Date.now(),items:cloned,promise:null};
        return cloned;
      })
      .catch(e=>{
        offlineSiteQueueReadCache={savedAt:0,items:null,promise:null};
        throw e;
      });
    return cloneOfflineSiteQueueItems(await offlineSiteQueueReadCache.promise);
  }

  async function removeOfflineSiteQueueItem(docId){
    const id=safeLocal(docId);
    if(!id) return;
    try{
      await withSzzOfflineQueueStore(SZZ_OFFLINE_SITE_QUEUE_STORE,"readwrite",(store)=>{store.delete(id);});
    }catch(e){}
    invalidateSiteCounts();
  }

  return {
    clearOfflineSiteQueueReadCache,
    countOfflineSiteQueueItems,
    isOfflineSiteQueueItem,
    readOfflineSiteQueueItems,
    removeOfflineSiteQueueItem,
    saveOfflineSiteQueueItem
  };
}
