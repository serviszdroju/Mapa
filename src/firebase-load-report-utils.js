export function createFirebaseLoadReportHelpers({
  getDeletedSiteIds,
  getDeletedSiteRecords=()=>[],
  getRows,
  safeValue=value=>String(value || "").trim(),
  siteDedupKeysFromRaw=()=>[],
  setLastFirebaseLoadReport
}){
  function deletedRecordValues(record={}){
    const values=[
      record.id,
      record.siteId,
      record.legacyId,
      record.firebaseDocId,
      record.siteDocId,
      record.rawFirebaseDocId,
      record.addressKey,
      record.placeId
    ];
    if(Array.isArray(record.aliases)) values.push(...record.aliases);
    return values.map(safeValue).filter(Boolean);
  }

  function rowDeletedMatchValues(row={}){
    const raw=row.raw || {};
    return [
      row.id,
      row.firebaseDocId,
      raw["Firebase_doc_id"],
      raw["Klíč_adresy"],
      raw["ID_mista"]
    ].map(safeValue).filter(Boolean);
  }

  function rowDeletedDedupKeys(row={}){
    try{
      const raw=row.raw || {};
      return siteDedupKeysFromRaw(raw).map(safeValue).filter(Boolean);
    }catch(_e){
      return [];
    }
  }

  function deletedRecordMatchesRow(record,row){
    if(!record || !row) return false;
    const rowValues=new Set(rowDeletedMatchValues(row));
    if(deletedRecordValues(record).some(value=>rowValues.has(value))) return true;
    const deletedKeys=Array.isArray(record.dedupKeys) ? record.dedupKeys.map(safeValue).filter(Boolean) : [];
    if(!deletedKeys.length) return false;
    const rowKeys=new Set(rowDeletedDedupKeys(row));
    return deletedKeys.some(key=>rowKeys.has(key));
  }

  function isFirebaseRowHidden(row,openedDocId=""){
    const deletedSiteIds=getDeletedSiteIds();
    if(!row) return false;
    const rowDocId=safeValue(row.firebaseDocId || row.raw?.["Firebase_doc_id"]);
    if(openedDocId && rowDocId===String(openedDocId)) return false;
    if(deletedSiteIds && rowDeletedMatchValues(row).some(value=>deletedSiteIds.has(value))) return true;
    return (getDeletedSiteRecords() || []).some(record=>deletedRecordMatchesRow(record,row));
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
