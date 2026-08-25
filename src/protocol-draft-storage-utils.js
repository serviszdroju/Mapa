import {
  SZZ_PROTOCOL_DRAFT_STORE,
  withSzzOfflineQueueStore
} from "./offline-queue-db-utils.js";

export function createProtocolDraftStorageHelpers({
  getDefaultSite,
  siteLocalCacheKey
}={}){
  function defaultSite(){
    return typeof getDefaultSite==="function" ? getDefaultSite() : undefined;
  }

  function protocolDraftKey(site=defaultSite()){
    return typeof siteLocalCacheKey==="function" ? siteLocalCacheKey("protocolDraft",site) : "";
  }

  async function saveProtocolDraftToIndexedDb(site,draft){
    const siteCacheKey=protocolDraftKey(site);
    if(!siteCacheKey || !draft || !draft.payload) return null;
    try{
      const item={...draft,siteCacheKey};
      await withSzzOfflineQueueStore(SZZ_PROTOCOL_DRAFT_STORE,"readwrite",(store)=>{store.put(item);});
      return item;
    }catch(e){
      console.warn("IndexedDB koncept protokolu se nepodařilo uložit",e);
      return null;
    }
  }

  async function readProtocolDraftFromIndexedDb(site=defaultSite()){
    const siteCacheKey=protocolDraftKey(site);
    if(!siteCacheKey) return null;
    try{
      const item=await withSzzOfflineQueueStore(SZZ_PROTOCOL_DRAFT_STORE,"readonly",(store,setResult)=>{
        const req=store.get(siteCacheKey);
        req.onsuccess=()=>setResult(req.result || null);
        req.onerror=()=>setResult(null);
      });
      return item && item.payload ? item : null;
    }catch(e){
      return null;
    }
  }

  async function deleteProtocolDraftFromIndexedDb(site=defaultSite()){
    const siteCacheKey=protocolDraftKey(site);
    if(!siteCacheKey) return;
    try{
      await withSzzOfflineQueueStore(SZZ_PROTOCOL_DRAFT_STORE,"readwrite",(store)=>{store.delete(siteCacheKey);});
    }catch(e){}
  }

  return {
    deleteProtocolDraftFromIndexedDb,
    protocolDraftKey,
    readProtocolDraftFromIndexedDb,
    saveProtocolDraftToIndexedDb
  };
}
