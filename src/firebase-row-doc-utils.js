export function createFirebaseRowDocHelpers({
  applyLatestProtocolDateToRaw=raw=>raw,
  applySiteEditToRow=row=>row,
  normalizeSiteRows=()=>[],
  safeValue=value=>String(value ?? "").trim()
}={}){
  function firebaseRowFromDocSnap(docSnap){
    if(!docSnap || !docSnap.id || typeof docSnap.data!=="function") return null;
    const normalizeRows=normalizeSiteRows();
    if(typeof normalizeRows!=="function") return null;
    const applyRowEdit=applySiteEditToRow();
    const data=docSnap.data() || {};
    let raw={...(data.raw || {})};
    const applyLatest=applyLatestProtocolDateToRaw();
    if(typeof applyLatest==="function"){
      raw=applyLatest(raw,data || {});
    }
    raw["Firebase_doc_id"]=docSnap.id;
    if(!raw["Klíč_adresy"]) raw["Klíč_adresy"]="firebase_"+docSnap.id;
    const row=normalizeRows([raw])[0];
    if(!row) return null;
    row.id=raw["Klíč_adresy"];
    row.raw=raw;
    row.firebaseDocId=docSnap.id;
    row.firebaseData=data;
    return typeof applyRowEdit==="function" ? applyRowEdit(row) : row;
  }

  function firebaseRowKey(row){
    return safeValue(row && (row.firebaseDocId || row.id));
  }

  return {
    firebaseRowFromDocSnap,
    firebaseRowKey
  };
}
