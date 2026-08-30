export function createHistoryMatchHelpers({
  getSelectedSite,
  protocolTimeValue,
  recordMatchesSite
}){
  function matchingHistoryItemsForSite(items=[],site=getSelectedSite()){
    const matched=[];
    const source=Array.isArray(items) ? items : [];
    for(const item of source){
      if(recordMatchesSite(item,site)) matched.push(item);
    }
    return matched;
  }

  function hasMatchingHistoryItemForSite(items=[],site=getSelectedSite()){
    const source=Array.isArray(items) ? items : [];
    for(const item of source){
      if(recordMatchesSite(item,site)) return true;
    }
    return false;
  }

  function sortedMatchingHistoryItemsForSite(items=[],site=getSelectedSite()){
    const matched=matchingHistoryItemsForSite(items,site);
    matched.sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a));
    return matched;
  }

  function firstProtocolHistoryItem(items=[]){
    const source=Array.isArray(items) ? items : [];
    for(const item of source){
      if(item && item._type==="Protokol") return item;
    }
    return null;
  }

  function latestMatchingHistoryItemForSite(items=[],site=getSelectedSite()){
    const source=Array.isArray(items) ? items : [];
    let latest=null;
    let latestTime=0;
    for(const item of source){
      if(!recordMatchesSite(item,site)) continue;
      const time=protocolTimeValue(item);
      if(!latest || time>latestTime){
        latest=item;
        latestTime=time;
      }
    }
    return latest;
  }

  return {
    firstProtocolHistoryItem,
    hasMatchingHistoryItemForSite,
    latestMatchingHistoryItemForSite,
    matchingHistoryItemsForSite,
    sortedMatchingHistoryItemsForSite
  };
}
