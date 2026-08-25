export function createOfflineRowSelectHelpers({
  getRows,
  getRowsIndexVersion,
  isPrimaryRows,
  safeValue=value=>String(value ?? "").trim()
}={}){
  let firebaseRowsForOfflineCache={source:null,length:-1,indexVersion:-1,rows:[]};
  let szzOfflineRowsForPrefetchCache={source:null,length:-1,indexVersion:-1,rows:[]};

  function rowsSource(){
    const rows=typeof getRows==="function" ? getRows() : [];
    return Array.isArray(rows) ? rows : [];
  }

  function indexVersionFor(current){
    return typeof isPrimaryRows==="function" && isPrimaryRows(current)
      ? Number(typeof getRowsIndexVersion==="function" ? getRowsIndexVersion() : -1)
      : -1;
  }

  function firebaseRowsForOffline(source=null){
    const currentRows=Array.isArray(source) ? source : rowsSource();
    const current=Array.isArray(currentRows) ? currentRows : [];
    const indexVersion=indexVersionFor(current);
    if(
      firebaseRowsForOfflineCache.source===current &&
      firebaseRowsForOfflineCache.length===current.length &&
      firebaseRowsForOfflineCache.indexVersion===indexVersion
    ){
      return firebaseRowsForOfflineCache.rows;
    }
    const firebaseRows=current.filter(row=>row && (row.firebaseDocId || (row.raw && row.raw["Firebase_doc_id"])));
    firebaseRowsForOfflineCache={source:current,length:current.length,indexVersion,rows:firebaseRows};
    return firebaseRows;
  }

  function szzOfflineRowsForPrefetch(inputRows=null){
    const source=Array.isArray(inputRows) && inputRows.length ? inputRows : rowsSource();
    const current=Array.isArray(source) ? source : [];
    const indexVersion=indexVersionFor(current);
    if(
      szzOfflineRowsForPrefetchCache.source===current &&
      szzOfflineRowsForPrefetchCache.length===current.length &&
      szzOfflineRowsForPrefetchCache.indexVersion===indexVersion
    ){
      return szzOfflineRowsForPrefetchCache.rows;
    }
    const seen=new Set();
    const prefetchRows=[];
    for(const row of current){
      const id=safeValue(row && (row.firebaseDocId || row.raw?.["Firebase_doc_id"] || row.id));
      if(!id || seen.has(id)) continue;
      seen.add(id);
      prefetchRows.push(row);
    }
    szzOfflineRowsForPrefetchCache={source:current,length:current.length,indexVersion,rows:prefetchRows};
    return prefetchRows;
  }

  return {
    firebaseRowsForOffline,
    szzOfflineRowsForPrefetch
  };
}
