export function createFirebaseLoadReportHelpers({
  getDeletedSiteIds,
  getRows,
  setLastFirebaseLoadReport
}){
  function isFirebaseRowHidden(row,openedDocId=""){
    const deletedSiteIds=getDeletedSiteIds();
    if(!row || !deletedSiteIds || !deletedSiteIds.has(row.id)) return false;
    return !(openedDocId && String(row.firebaseDocId || "")===openedDocId);
  }

  function hiddenFirebaseRowInfo(row){
    return {
      id:String(row && row.id || ""),
      docId:String(row && row.firebaseDocId || ""),
      title:String((row && row.raw && (row.raw["Název"] || row.raw["Adresa / umístění"] || row.raw["Adresa_GPS"])) || (row && row.adresa) || "")
    };
  }

  function updateFirebaseLoadReport(firebaseRows,dedupedRows,hiddenRows=[],duplicateRows=[]){
    setLastFirebaseLoadReport({
      docs:Array.isArray(firebaseRows)?firebaseRows.length:0,
      afterDedupe:Array.isArray(dedupedRows)?dedupedRows.length:0,
      shown:(getRows() || []).length,
      duplicateCount:Array.isArray(duplicateRows)?duplicateRows.length:0,
      duplicateRows:Array.isArray(duplicateRows)?duplicateRows:[],
      hiddenCount:Array.isArray(hiddenRows)?hiddenRows.length:0,
      hiddenRows:Array.isArray(hiddenRows)?hiddenRows:[]
    });
  }

  return {
    hiddenFirebaseRowInfo,
    isFirebaseRowHidden,
    updateFirebaseLoadReport
  };
}
