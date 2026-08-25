export function createPlaceGroupHelpers({
  color,
  daysToComputedNext,
  ensureRowScheduleCache,
  getPlaceGroupCache,
  getRows,
  getRowsIndexDirty,
  getRowsIndexVersion,
  setPlaceGroupCache,
  sitePlaceGroupKey,
  siteSourceLabel,
  szzCompareCsBase
}){
  function sortedRowsBySourceLabel(items=[]){
    return (items || []).slice().sort((a,b)=>szzCompareCsBase(siteSourceLabel(a),siteSourceLabel(b)));
  }

  function cachedRowsByPlaceGroup(key,pool=getRows()){
    const rows=getRows();
    const sourceRows=Array.isArray(pool) ? pool : [];
    if(!key) return [];
    if(sourceRows!==rows){
      const matches=[];
      for(const row of sourceRows){
        if(sitePlaceGroupKey(row)===key) matches.push(row);
      }
      return sortedRowsBySourceLabel(matches);
    }
    const cache=getPlaceGroupCache();
    if(
      !cache
      || cache.rowsRef!==rows
      || cache.version!==getRowsIndexVersion()
    ){
      const map=new Map();
      for(const row of rows){
        const groupKey=sitePlaceGroupKey(row);
        if(!map.has(groupKey)) map.set(groupKey,[]);
        map.get(groupKey).push(row);
      }
      for(const [groupKey,items] of map){
        map.set(groupKey,sortedRowsBySourceLabel(items));
      }
      setPlaceGroupCache({rowsRef:rows,version:getRowsIndexVersion(),map});
    }
    return getPlaceGroupCache().map.get(key) || [];
  }

  function siteSiblingRows(site,pool=getRows()){
    const key=sitePlaceGroupKey(site);
    return cachedRowsByPlaceGroup(key,pool);
  }

  function uncachedHasMultipleSourcesForKey(key){
    if(!key) return false;
    let count=0;
    for(const row of getRows()){
      if(sitePlaceGroupKey(row)===key && ++count>1) return true;
    }
    return false;
  }

  function siteHasMultipleSources(site){
    const key=sitePlaceGroupKey(site);
    if(!site || typeof site!=="object"){
      return cachedRowsByPlaceGroup(key).length>1;
    }
    if(
      !getRowsIndexDirty()
      && site._multiSourceVersion===getRowsIndexVersion()
      && site._multiSourcePlaceKey===key
      && typeof site._multiSourceCache==="boolean"
    ){
      return site._multiSourceCache;
    }
    const hasMultiple=getRowsIndexDirty()
      ? uncachedHasMultipleSourcesForKey(key)
      : cachedRowsByPlaceGroup(key).length>1;
    if(!getRowsIndexDirty()){
      site._multiSourceVersion=getRowsIndexVersion();
      site._multiSourcePlaceKey=key;
      site._multiSourceCache=hasMultiple;
    }
    return hasMultiple;
  }

  function statusPriority(r){
    const cached=ensureRowScheduleCache(r);
    return cached ? cached.priority : 10;
  }

  function groupRepresentative(groupRows){
    const rowsList=groupRows || [];
    if(rowsList._szzRepresentativeRow) return rowsList._szzRepresentativeRow;
    const representative=rowsList.slice().sort((a,b)=>{
      const pa=statusPriority(a), pb=statusPriority(b);
      if(pb!==pa) return pb-pa;
      return (daysToComputedNext(a)??999999)-(daysToComputedNext(b)??999999);
    })[0];
    if(representative){
      try{
        Object.defineProperty(rowsList,"_szzRepresentativeRow",{value:representative,configurable:true});
      }catch(e){
        rowsList._szzRepresentativeRow=representative;
      }
    }
    return representative;
  }

  function groupColor(groupRows){
    const rep=groupRepresentative(groupRows);
    return rep ? color(rep) : "#16a34a";
  }

  return {
    cachedRowsByPlaceGroup,
    groupColor,
    groupRepresentative,
    siteHasMultipleSources,
    siteSiblingRows,
    sortedRowsBySourceLabel,
    statusPriority,
    uncachedHasMultipleSourcesForKey
  };
}
