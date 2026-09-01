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
  selectedSiteDocId=()=>"",
  setSelectedSite,
  siteDedupKeysFromRaw=()=>[],
  showSaveConfirmation,
  drawerNode
}){
  function uniqueClean(values=[]){
    const out=[];
    const seen=new Set();
    values.forEach(value=>{
      const clean=safe(value);
      if(!clean || seen.has(clean)) return;
      seen.add(clean);
      out.push(clean);
    });
    return out;
  }

  function deletedSitePayload(site,currentUser){
    const raw=(site && site.raw) || {};
    const docId=safe(selectedSiteDocId(site) || site?.firebaseDocId || raw["Firebase_doc_id"]);
    const aliases=uniqueClean([
      site?.id,
      site?.firebaseDocId,
      raw["Firebase_doc_id"],
      raw["Klíč_adresy"],
      raw["ID_mista"]
    ]);
    let dedupKeys=[];
    try{ dedupKeys=uniqueClean(siteDedupKeysFromRaw(raw)); }catch(_e){}
    return {
      siteId:safe(site?.id),
      legacyId:safe(site?.id),
      siteName:safe(site?.adresa || raw["Název"] || raw["Adresa / umístění"] || raw["Adresa_GPS"]),
      firebaseDocId:docId,
      siteDocId:docId,
      rawFirebaseDocId:safe(raw["Firebase_doc_id"]),
      addressKey:safe(raw["Klíč_adresy"]),
      placeId:safe(raw["ID_mista"]),
      aliases,
      dedupKeys,
      deletedBy:safe(currentUser?.email),
      deletedAt:new Date().toISOString()
    };
  }

  function deletedSiteDocId(payload={}){
    const base=safe(payload.siteId || payload.firebaseDocId || payload.siteDocId || payload.aliases?.[0] || `deleted_${Date.now()}`);
    return base.replace(/[/?#[\]]+/g,"_").slice(0,140) || `deleted_${Date.now()}`;
  }

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
      const deletePayload=deletedSitePayload(selectedSite,currentUser);
      const unifiedDocId=safe(deletePayload.firebaseDocId || deletePayload.siteDocId);
      const tombstoneId=deletedSiteDocId(deletePayload);

      await setDoc(doc(db,"deletedSites",tombstoneId),deletePayload,{merge:true});

      if(unifiedDocId){
        try{ await deleteDoc(doc(db,"sitesUnified",unifiedDocId)); }catch(e){ console.warn("Mazání sitesUnified selhalo",unifiedDocId,e); }
      }
      if(selectedSite.isNewSite && selectedSite.raw && selectedSite.raw["Firebase_doc_id"]){
        const legacyDocId=selectedSite.raw["Firebase_doc_id"];
        try{ await deleteDoc(doc(db,"sites",legacyDocId)); }catch(e){ console.warn("Mazání legacy sites selhalo",legacyDocId,e); }
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
        deletePayload.aliases.forEach(addDeletedSiteId);
        if(deletePayload.firebaseDocId) addDeletedSiteId(deletePayload.firebaseDocId);
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
