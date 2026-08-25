export function createPlaceGroupHelpers({
  color,
  daysToComputedNext,
  detailKey,
  ensureRowScheduleCache,
  getFilteredRowsSignature,
  getPlaceGroupCache,
  getPlaceGroupsCache,
  getRows,
  getRowsIndexDirty,
  getRowsIndexVersion,
  setPlaceGroupCache,
  setPlaceGroupsCache,
  sitePlaceGroupKey,
  sitePlaceLabel,
  siteSourceLabel,
  stableSignature,
  statusText,
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

  function markerRowSignature(row){
    if(!row) return "";
    const detail=detailKey(row);
    const source=siteSourceLabel(row);
    const status=statusText(row);
    if(
      row._markerSignatureDetail===detail &&
      row._markerSignatureSource===source &&
      row._markerSignatureStatus===status &&
      row._markerSignatureValue
    ){
      return row._markerSignatureValue;
    }
    const value=stableSignature([detail,source,status]);
    row._markerSignatureDetail=detail;
    row._markerSignatureSource=source;
    row._markerSignatureStatus=status;
    row._markerSignatureValue=value;
    return value;
  }

  function markerRowsSignature(rowsList){
    let signature="";
    const list=Array.isArray(rowsList) ? rowsList : [];
    for(let i=0;i<list.length;i++){
      if(i) signature+="\u001e";
      signature+=markerRowSignature(list[i]);
    }
    return signature;
  }

  function groupRowsByPlace(inputRows){
    const mapByKey=new Map();
    const sourceRows=Array.isArray(inputRows) ? inputRows : [];
    for(const r of sourceRows){
      const key=sitePlaceGroupKey(r);
      if(!mapByKey.has(key)){
        mapByKey.set(key,{key,rows:[],lat:null,lon:null,label:sitePlaceLabel(r)});
      }
      const group=mapByKey.get(key);
      group.rows.push(r);
      if(!group.label) group.label=sitePlaceLabel(r);
      if(!Number.isFinite(group.lat) && Number.isFinite(r.lat) && Number.isFinite(r.lon)){
        group.lat=r.lat;
        group.lon=r.lon;
      }
    }
    const groups=[];
    for(const group of mapByKey.values()){
      group.rows=group.rows.sort((a,b)=>szzCompareCsBase(siteSourceLabel(a),siteSourceLabel(b)));
      group._markerRowsSignature=markerRowsSignature(group.rows);
      const representative=groupRepresentative(group.rows) || group.rows[0] || null;
      group._representativeRow=representative;
      group._nextSortValue=representative ? (daysToComputedNext(representative) ?? 999999) : 999999;
      groups.push(group);
    }
    return groups;
  }

  function groupPrimaryRow(group){
    return (group && group._representativeRow) || groupRepresentative(group && group.rows) || (group && group.rows && group.rows[0]) || null;
  }

  function cachedPlaceGroups(inputRows){
    const signature=`${getRowsIndexVersion()}\u001f${getFilteredRowsSignature() || ""}\u001f${inputRows ? inputRows.length : 0}`;
    const cache=getPlaceGroupsCache();
    if(cache.sourceRows===inputRows && cache.signature===signature) return cache.groups;
    const groups=groupRowsByPlace(inputRows);
    setPlaceGroupsCache({sourceRows:inputRows,signature,groups});
    return groups;
  }

  return {
    cachedPlaceGroups,
    cachedRowsByPlaceGroup,
    groupColor,
    groupPrimaryRow,
    groupRepresentative,
    groupRowsByPlace,
    markerRowsSignature,
    siteHasMultipleSources,
    siteSiblingRows,
    sortedRowsBySourceLabel,
    statusPriority,
    uncachedHasMultipleSourcesForKey
  };
}
