export function createLegacyDeletedSiteHelpers({
  applyEditToRow,
  getAuthClient,
  getCsvRows,
  getCurrentUser,
  getDb,
  getExtraSites,
  getFirestoreModule,
  isFirebaseReady,
  isFirebaseUnifiedPrimary,
  setDeletedSiteIds,
  setDeletedSiteRecords=()=>{},
  setRows,
  syncCurrentUserFromCompat
}){
  async function loadDeletedSites(){
    const nextDeletedSiteIds=new Set();
    const nextDeletedSiteRecords=[];
    setDeletedSiteIds(nextDeletedSiteIds);
    setDeletedSiteRecords(nextDeletedSiteRecords);
    if(!isFirebaseReady() || !getDb()) return;
    const auth=getAuthClient();
    const signedUser=getCurrentUser() || (auth && auth.currentUser) || syncCurrentUserFromCompat();
    if(!signedUser) return;
    try{
      const {collection,getDocs}=getFirestoreModule();
      const db=getDb();
      const snap=await getDocs(collection(db,"deletedSites"));
      snap.forEach(d=>{
        const data=typeof d.data==="function" ? (d.data() || {}) : {};
        const record={id:d.id,...data};
        nextDeletedSiteRecords.push(record);
        [
          d.id,
          data.siteId,
          data.legacyId,
          data.firebaseDocId,
          data.siteDocId,
          data.rawFirebaseDocId,
          data.addressKey,
          data.placeId,
          ...(Array.isArray(data.aliases) ? data.aliases : [])
        ].forEach(value=>{
          const clean=String(value || "").trim();
          if(clean) nextDeletedSiteIds.add(clean);
        });
      });
      setDeletedSiteIds(nextDeletedSiteIds);
      setDeletedSiteRecords(nextDeletedSiteRecords);
      if(!isFirebaseUnifiedPrimary()){
        const nextRows=getCsvRows().concat(getExtraSites()).map(applyEditToRow).filter(r=>!nextDeletedSiteIds.has(r.id));
        setRows(nextRows);
      }
    }catch(e){
      console.warn("Nepodařilo se načíst smazaná místa",e);
    }
  }

  return {loadDeletedSites};
}
