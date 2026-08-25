export function createOfflineIdHelpers({
  safeValue=value=>String(value ?? "").trim()
}={}){
  function safeLocal(value){
    return safeValue(value);
  }

  function uniqueByOfflineId(items=[],idKey="_id"){
    return uniqueByOfflineIdFromLists([items],idKey);
  }

  function countUniqueOfflineItems(items=[],idKey="_id",predicate=null){
    const source=Array.isArray(items) ? items : [];
    const byId=new Set();
    let withoutId=0;
    for(const item of source){
      if(!item || (predicate && !predicate(item))) continue;
      const id=safeLocal(item && item[idKey]);
      if(id) byId.add(id);
      else withoutId++;
    }
    return byId.size+withoutId;
  }

  function uniqueByOfflineIdFromLists(lists=[],idKey="_id"){
    const byId=new Map();
    const withoutId=[];
    const sourceLists=Array.isArray(lists) ? lists : [];
    for(const list of sourceLists){
      const source=Array.isArray(list) ? list : [];
      for(const item of source){
        if(!item) continue;
        const id=safeLocal(item && item[idKey]);
        if(!id){
          withoutId.push(item);
          continue;
        }
        byId.set(id,item);
      }
    }
    const out=withoutId.slice();
    byId.forEach(item=>out.push(item));
    return out;
  }

  return {
    countUniqueOfflineItems,
    uniqueByOfflineId,
    uniqueByOfflineIdFromLists
  };
}
