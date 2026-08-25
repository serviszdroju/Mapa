export function createDeleteSiteHelpers({
  addDeletedSiteId,
  getCurrentUser,
  getDb,
  getEditStatusNode,
  getFirestoreModule,
  getLoadFirebaseSitesUnified,
  getRemoveFirebaseSiteRow,
  getSelectedSite,
  isAppAdmin,
  isFirebaseReady,
  isFirebaseUnifiedPrimary,
  loadDeletedSites,
  loadExtraSites,
  render,
  saveFirebaseRowsCacheForRows,
  safe,
  setSelectedSite,
  showSaveConfirmation,
  drawerNode
}){
  async function deleteSelectedSite(){
    const st=getEditStatusNode();
    const selectedSite=getSelectedSite();
    if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }
    if(!isFirebaseReady()){ if(st) st.textContent="Firebase není nastavený."; return; }
    const currentUser=getCurrentUser();
    if(!currentUser){ if(st) st.textContent="Nejdřív se přihlaš."; return; }
    if(!isAppAdmin()){ if(st) st.textContent="Mazat body může jen správce."; return; }

    const ok=confirm("Opravdu smazat toto místo i jeho uložené údaje z Firebase?\\n\\nU původně importovaných míst se uloží také skrytý záznam, aby se bod po obnově znovu nezobrazil.");
    if(!ok) return;

    try{
      const db=getDb();
      const {doc,setDoc,deleteDoc,collection,query,where,getDocs}=getFirestoreModule();

      if(selectedSite.isNewSite && selectedSite.raw && selectedSite.raw["Firebase_doc_id"]){
        const docId=selectedSite.raw["Firebase_doc_id"];
        await deleteDoc(doc(db,"sites",docId));
      }else{
        await setDoc(doc(db,"deletedSites",selectedSite.id),{
          siteId:selectedSite.id,
          siteName:selectedSite.adresa || "",
          deletedBy:currentUser.email,
          deletedAt:new Date().toISOString()
        },{merge:true});
      }

      try{ await deleteDoc(doc(db,"siteEdits",selectedSite.id)); }catch(e){}

      for(const colName of ["protocols","serviceRecords"]){
        try{
          const q=query(collection(db,colName),where("siteId","==",selectedSite.id));
          const snap=await getDocs(q);
          for(const d of snap.docs){ await deleteDoc(d.ref); }
        }catch(e){ console.warn("Mazání kolekce selhalo",colName,e); }
      }

      if(st) st.textContent="Místo bylo smazáno/skryto.";
      drawerNode()?.classList.remove("open");
      const loadFirebaseSitesUnified=getLoadFirebaseSitesUnified();
      if(isFirebaseUnifiedPrimary() && typeof loadFirebaseSitesUnified==="function"){
        const deletedId=safe(selectedSite && selectedSite.id);
        if(deletedId) addDeletedSiteId(deletedId);
        const removeFirebaseSiteRow=getRemoveFirebaseSiteRow();
        const removedRows=typeof removeFirebaseSiteRow==="function" ? removeFirebaseSiteRow(selectedSite) : null;
        if(removedRows){
          setSelectedSite(null);
          saveFirebaseRowsCacheForRows(removedRows);
        }else{
          await loadDeletedSites();
          await loadFirebaseSitesUnified();
        }
      }else{
        await loadDeletedSites();
        const rendered=await loadExtraSites();
        if(!rendered) render();
      }
      showSaveConfirmation("Bod smazán.");
    }catch(e){
      if(st) st.textContent="Chyba při mazání: "+e.message;
    }
  }

  return {deleteSelectedSite};
}
