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
  setRows,
  syncCurrentUserFromCompat
}){
  async function loadDeletedSites(){
    const nextDeletedSiteIds=new Set();
    setDeletedSiteIds(nextDeletedSiteIds);
    if(!isFirebaseReady() || !getDb()) return;
    const auth=getAuthClient();
    const signedUser=getCurrentUser() || (auth && auth.currentUser) || syncCurrentUserFromCompat();
    if(!signedUser) return;
    try{
      const {collection,getDocs}=getFirestoreModule();
      const db=getDb();
      const snap=await getDocs(collection(db,"deletedSites"));
      snap.forEach(d=>nextDeletedSiteIds.add(d.id));
      setDeletedSiteIds(nextDeletedSiteIds);
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
