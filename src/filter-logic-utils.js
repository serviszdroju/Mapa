export function createFilterLogicHelpers({
  filterControls,
  getFilteredRowsCache,
  getRows,
  getRowsIndexVersion,
  isNoOrderSite,
  regionTextNorm,
  rowRegion,
  rowSearchText,
  safe,
  searchNorm,
  setFilteredRowsCache,
  statusText,
  ensureRowFastIndexes
}){
  function rowMatchesSearch(r,normalizedQuery,compactQuery=null){
    if(r && (r._searchRawRef!==r.raw || !r._searchText)) ensureRowFastIndexes(r,Number.isFinite(r.i) ? r.i : 0);
    const hay=(r && r._searchText) || searchNorm(rowSearchText(r));
    if(hay.includes(normalizedQuery)) return true;
    const compactHay=(r && r._compactSearchText) || hay.replace(/\s+/g,"");
    const compact=compactQuery==null ? normalizedQuery.replace(/\s+/g,"") : compactQuery;
    return compact.length>=3 && compactHay.includes(compact);
  }

  function filtered(){
    const {search,status,region}=filterControls();
    const rows=getRows();
    const q=safe(search && search.value);
    const s=safe(status && status.value);
    const k=safe(region && region.value);
    const qn=searchNorm(q);
    const kn=regionTextNorm(k);
    const signature=`${getRowsIndexVersion()}\u001f${qn}\u001f${s}\u001f${kn}`;
    const cache=getFilteredRowsCache();
    if(cache.signature===signature) return cache.rows;
    if(!qn && !s && !kn){
      setFilteredRowsCache({signature,rows});
      return rows;
    }
    const compactQuery=qn ? qn.replace(/\s+/g,"") : "";

    const result=rows.filter(r=>{
      const st=s ? statusText(r) : (r._statusText || statusText(r));

      const okQ = !qn || rowMatchesSearch(r,qn,compactQuery);
      const okK = !kn || (r._regionNorm || regionTextNorm(rowRegion(r))) === kn;

      let okS = true;
      if(s === "Hlídáme termín sami"){
        okS = isNoOrderSite(r);
      }else if(s){
        okS = st === s;
      }

      return okQ && okK && okS;
    });
    setFilteredRowsCache({signature,rows:result});
    return result;
  }

  return {
    filtered,
    rowMatchesSearch
  };
}
