export function createLegacyEditLoadHelpers({
  applyEditToRow,
  clearEditCache,
  getDb,
  getFirestoreModule,
  getRowsSourceState,
  getStatusNode,
  isFirebaseReady,
  isFirebaseUnifiedPrimary,
  render,
  setLegacyEditCacheEntry,
  setRows
}){
  async function loadEdits(options={}){
    const renderAfter=options.renderAfter!==false;
    if(!isFirebaseReady() || !getDb()) return;
    if(isFirebaseUnifiedPrimary()){
      clearEditCache();
      const st=getStatusNode();
      if(st && /Úpravy se nepodařilo|Uložené úpravy/.test(st.textContent || "")) st.textContent="";
      return;
    }
    try{
      const firestoreModule=getFirestoreModule();
      const db=getDb();
      const {collection,getDocs}=firestoreModule;
      const snap=await getDocs(collection(db,"siteEdits"));
      clearEditCache();
      snap.forEach(d=>setLegacyEditCacheEntry(d.id,d.data()));
      const {csvRows,extraSites,deletedSiteIds}=getRowsSourceState();
      const nextRows=csvRows.concat(extraSites).map(applyEditToRow).filter(r=>!deletedSiteIds.has(r.id));
      setRows(nextRows);
      if(renderAfter) render();
      const st=getStatusNode();
      if(st) st.textContent="Uložené úpravy načteny.";
    }catch(e){
      console.warn("Úpravy se nepodařilo načíst",e);
      const st=getStatusNode();
      if(st) st.textContent="";
    }
  }

  return {loadEdits};
}
