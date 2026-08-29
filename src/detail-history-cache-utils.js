export function createDetailHistoryCacheHelpers({
  currentUserEmail,
  detailLazyKey,
  getSelectedSite,
  selectedSiteDocId,
  siteRecordKeys,
  clearLocalDetailReadCacheForKind,
  clearAllLocalProtocolHistoryReadCache,
  resetDetailHistoryRenderSignature,
  resetMainProtocolHistoryRenderSignature
}){
  const DETAIL_HISTORY_CACHE_MS=45000;
  const DETAIL_HISTORY_MUTATION_KINDS=new Set(["protocolHistory","serviceHistory","protocols","serviceRecords"]);
  const detailHistoryCache=new Map();
  const LAST_PROTOCOL_CACHE_MS=45000;
  const lastProtocolCache=new Map();
  const MAIN_PROTOCOL_HISTORY_CACHE_MS=45000;
  let mainProtocolHistoryCache={key:"",savedAt:0,items:null};

  function detailHistoryCacheKey(site=getSelectedSite()){
    if(!site) return "";
    const keys=[detailLazyKey(site), selectedSiteDocId(site), ...siteRecordKeys(site), currentUserEmail()]
      .map(x=>String(x || "").trim())
      .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
    return keys.join("|");
  }

  function cloneDetailHistoryItem(item){
    return item && typeof item==="object" ? {...item} : item;
  }

  function cloneDetailHistoryItems(items=[]){
    const source=Array.isArray(items) ? items : [];
    const out=[];
    for(const item of source){
      out.push(cloneDetailHistoryItem(item));
    }
    return out;
  }

  function readLastProtocolCache(site=getSelectedSite()){
    const key=detailHistoryCacheKey(site);
    if(!key) return undefined;
    const cached=lastProtocolCache.get(key);
    if(!cached) return undefined;
    if(Date.now()-cached.savedAt>LAST_PROTOCOL_CACHE_MS){
      lastProtocolCache.delete(key);
      return undefined;
    }
    return cloneDetailHistoryItem(cached.item) || null;
  }

  function writeLastProtocolCache(site=getSelectedSite(),item=null){
    const key=detailHistoryCacheKey(site);
    if(!key) return;
    lastProtocolCache.set(key,{
      savedAt:Date.now(),
      item:cloneDetailHistoryItem(item) || null
    });
  }

  function clearLastProtocolCache(site=getSelectedSite()){
    if(!site){
      lastProtocolCache.clear();
      return;
    }
    const key=detailHistoryCacheKey(site);
    if(key) lastProtocolCache.delete(key);
    else lastProtocolCache.clear();
  }

  function readDetailHistoryCache(site=getSelectedSite()){
    const key=detailHistoryCacheKey(site);
    if(!key) return null;
    const cached=detailHistoryCache.get(key);
    if(!cached) return null;
    if(Date.now()-cached.savedAt>DETAIL_HISTORY_CACHE_MS){
      detailHistoryCache.delete(key);
      return null;
    }
    return cloneDetailHistoryItems(cached.items);
  }

  function writeDetailHistoryCache(site=getSelectedSite(),items=[]){
    const key=detailHistoryCacheKey(site);
    if(!key) return;
    detailHistoryCache.set(key,{
      savedAt:Date.now(),
      items:cloneDetailHistoryItems(items)
    });
  }

  function clearDetailHistoryCache(site=getSelectedSite()){
    resetDetailHistoryRenderSignature();
    if(!site){
      detailHistoryCache.clear();
      lastProtocolCache.clear();
      return;
    }
    const key=detailHistoryCacheKey(site);
    if(key) detailHistoryCache.delete(key);
    else detailHistoryCache.clear();
    clearLastProtocolCache(site);
  }

  function mainProtocolHistoryCacheKey(){
    return currentUserEmail() || "anonymous";
  }

  function readMainProtocolHistoryCache(){
    const key=mainProtocolHistoryCacheKey();
    if(!mainProtocolHistoryCache.items || mainProtocolHistoryCache.key!==key) return null;
    if(Date.now()-mainProtocolHistoryCache.savedAt>MAIN_PROTOCOL_HISTORY_CACHE_MS){
      mainProtocolHistoryCache={key:"",savedAt:0,items:null};
      return null;
    }
    return cloneDetailHistoryItems(mainProtocolHistoryCache.items);
  }

  function writeMainProtocolHistoryCache(items=[]){
    mainProtocolHistoryCache={
      key:mainProtocolHistoryCacheKey(),
      savedAt:Date.now(),
      items:cloneDetailHistoryItems(items)
    };
  }

  function clearMainProtocolHistoryCache(){
    mainProtocolHistoryCache={key:"",savedAt:0,items:null};
    resetMainProtocolHistoryRenderSignature();
    clearAllLocalProtocolHistoryReadCache();
  }

  function patchMainProtocolHistoryCacheItems(patchItems){
    if(!Array.isArray(mainProtocolHistoryCache.items) || typeof patchItems!=="function") return false;
    mainProtocolHistoryCache.items=patchItems(mainProtocolHistoryCache.items);
    mainProtocolHistoryCache.savedAt=Date.now();
    return true;
  }

  function clearDetailHistoryCacheForKind(kind,site=getSelectedSite()){
    const cleanKind=String(kind || "");
    clearLocalDetailReadCacheForKind(cleanKind,site);
    if(DETAIL_HISTORY_MUTATION_KINDS.has(cleanKind)) clearDetailHistoryCache(site);
    if(cleanKind==="protocolHistory" || cleanKind==="protocols") clearLastProtocolCache(site);
    if(cleanKind==="protocolHistory" || cleanKind==="protocols") clearMainProtocolHistoryCache();
  }

  return {
    clearDetailHistoryCache,
    clearDetailHistoryCacheForKind,
    clearLastProtocolCache,
    clearMainProtocolHistoryCache,
    cloneDetailHistoryItem,
    cloneDetailHistoryItems,
    detailHistoryCacheKey,
    mainProtocolHistoryCacheKey,
    patchMainProtocolHistoryCacheItems,
    readDetailHistoryCache,
    readLastProtocolCache,
    readMainProtocolHistoryCache,
    writeDetailHistoryCache,
    writeLastProtocolCache,
    writeMainProtocolHistoryCache
  };
}
