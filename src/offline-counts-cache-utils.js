export function createOfflineCountsCacheHelpers({
  cacheMs=1200
}={}){
  let szzOfflineCountsCache=null;
  let szzOfflineCountsCacheAt=0;

  function cloneSzzOfflineCounts(counts){
    return counts ? {...counts} : counts;
  }

  function invalidateSzzOfflineCountsCache(){
    szzOfflineCountsCache=null;
    szzOfflineCountsCacheAt=0;
  }

  function readSzzOfflineCountsCache(){
    if(szzOfflineCountsCache && Date.now()-szzOfflineCountsCacheAt<cacheMs){
      return cloneSzzOfflineCounts(szzOfflineCountsCache);
    }
    return null;
  }

  function writeSzzOfflineCountsCache(counts){
    szzOfflineCountsCache=counts;
    szzOfflineCountsCacheAt=Date.now();
    return cloneSzzOfflineCounts(counts);
  }

  return {
    cloneSzzOfflineCounts,
    invalidateSzzOfflineCountsCache,
    readSzzOfflineCountsCache,
    writeSzzOfflineCountsCache
  };
}
