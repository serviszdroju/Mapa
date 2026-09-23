export function createFirebaseRowDocHelpers({
  applyLatestProtocolDateToRaw=raw=>raw,
  applySiteEditToRow=row=>row,
  normalizeSiteRows=()=>[],
  safeValue=value=>String(value ?? "").trim()
}={}){
  const deferredDetailFields=new Set([
    "attachments",
    "photos",
    "protocolHistory",
    "serviceHistory",
    "sitePhotosEmbedded",
    "sitePhotoRefs"
  ]);

  function mapRowFirebaseData(data={},raw={}){
    const mapped={raw};
    for(const [key,value] of Object.entries(data || {})){
      if(key!=="raw" && !deferredDetailFields.has(key)) mapped[key]=value;
    }
    return mapped;
  }

  function releaseRowDetailData(row){
    const data=row?.firebaseData;
    if(!data || typeof data!=="object") return false;
    let changed=false;
    for(const key of deferredDetailFields){
      if(Object.hasOwn(data,key)){
        delete data[key];
        changed=true;
      }
    }
    return changed;
  }

  function hasEmbeddedProtocolDateData(data={}){
    return (
      (Array.isArray(data.protocolHistory) && data.protocolHistory.length>0) ||
      !!safeValue(data.latestProtocolDate)
    );
  }

  function firebaseRowFromDocSnap(docSnap){
    if(!docSnap || !docSnap.id || typeof docSnap.data!=="function") return null;
    const normalizeRows=normalizeSiteRows();
    if(typeof normalizeRows!=="function") return null;
    const applyRowEdit=applySiteEditToRow();
    const data=docSnap.data() || {};
    const sourceRaw=data.raw || {};
    const applyLatest=hasEmbeddedProtocolDateData(data) ? applyLatestProtocolDateToRaw() : null;
    const mergedRaw=typeof applyLatest==="function" ? applyLatest(sourceRaw,data) : sourceRaw;
    const raw=mergedRaw && mergedRaw!==sourceRaw ? mergedRaw : {...(mergedRaw || sourceRaw)};
    raw["Firebase_doc_id"]=docSnap.id;
    if(!raw["Klíč_adresy"]) raw["Klíč_adresy"]="firebase_"+docSnap.id;
    const row=normalizeRows([raw])[0];
    if(!row) return null;
    row.id=raw["Klíč_adresy"];
    row.raw=raw;
    row.firebaseDocId=docSnap.id;
    row.firebaseData=mapRowFirebaseData(data,raw);
    return typeof applyRowEdit==="function" ? applyRowEdit(row) : row;
  }

  function firebaseRowKey(row){
    return safeValue(row && (row.firebaseDocId || row.id));
  }

  return {
    firebaseRowFromDocSnap,
    firebaseRowKey,
    hasEmbeddedProtocolDateData,
    mapRowFirebaseData,
    releaseRowDetailData
  };
}
