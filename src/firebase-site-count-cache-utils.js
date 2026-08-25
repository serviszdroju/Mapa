export function createFirebaseSiteCountCacheHelpers({
  cacheKey,
  countOfflineSiteQueueItems,
  maxAgeMs=1800
}={}){
  let cachedFirebaseSiteCount={raw:null,count:0,savedAt:0};

  function clearCachedFirebaseSiteCount(){
    cachedFirebaseSiteCount={raw:null,count:0,savedAt:0};
  }

  function readCachedFirebaseSiteCount(){
    try{
      const raw=localStorage.getItem(cacheKey) || "";
      if(cachedFirebaseSiteCount.raw===raw && Date.now()-cachedFirebaseSiteCount.savedAt<maxAgeMs){
        return cachedFirebaseSiteCount.count;
      }
      const parsed=JSON.parse(raw || "null");
      const count=Number(parsed && parsed.count);
      if(Number.isFinite(count) && count>0){
        cachedFirebaseSiteCount={raw,count,savedAt:Date.now()};
        return count;
      }
      const items=Array.isArray(parsed && parsed.items) ? parsed.items : [];
      const fallbackCount=typeof countOfflineSiteQueueItems==="function" ? countOfflineSiteQueueItems(items) : 0;
      cachedFirebaseSiteCount={raw,count:fallbackCount,savedAt:Date.now()};
      return fallbackCount;
    }catch(e){
      return 0;
    }
  }

  return {
    clearCachedFirebaseSiteCount,
    readCachedFirebaseSiteCount
  };
}
