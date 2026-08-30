export function createDetailHistoryDeleteHelpers({
  detailHistoryNode,
  getCurrentHistoryItem,
  getDb,
  getFsMod,
  getSelectedSite,
  isHistoryAdmin,
  loadHistory,
  removeSiteLocalItem,
  selectedSiteDocId,
  showSaveConfirmation
}){
  function prependHistoryNotice(message){
    const history=detailHistoryNode();
    if(!history) return;
    const note=document.createElement("p");
    note.className="small";
    note.textContent=message;
    history.prepend(note);
  }

  async function deleteCurrentHistoryProtocol(){
    const item=getCurrentHistoryItem();
    if(!item || item._type!=="Protokol" || !item._id) return;
    if(!isHistoryAdmin()){
      prependHistoryNotice("Mazat protokoly může jen správce.");
      return;
    }
    if(!confirm("Opravdu smazat tento uložený protokol z historie?")) return;
    try{
      const {doc,deleteDoc,setDoc,serverTimestamp}=getFsMod();
      const db=getDb();
      const selectedSite=getSelectedSite();
      try{ await deleteDoc(doc(db,"protocols",item._id)); }catch(e){ console.warn("Samostatný protokol se nepodařilo smazat",e); }
      const docId=selectedSiteDocId(selectedSite);
      if(docId){
        try{ await deleteDoc(doc(db,"sitesUnified",docId,"protocols",item._id)); }catch(e){ console.warn("Protokol pod bodem se nepodařilo smazat",e); }
        const currentData=selectedSite?.firebaseData || {};
        const protocolHistory=Array.isArray(currentData.protocolHistory) ? currentData.protocolHistory.filter(p=>String(p?._id || "")!==String(item._id)) : [];
        const protocolRefs=Array.isArray(currentData.protocolRefs) ? currentData.protocolRefs.filter(p=>String(p?._id || "")!==String(item._id)) : [];
        await setDoc(doc(db,"sitesUnified",docId),{
          protocolHistory,
          protocolRefs,
          updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
        },{merge:true});
        selectedSite.firebaseData={...currentData,protocolHistory,protocolRefs};
      }
      removeSiteLocalItem("protocolHistory",item._id,selectedSite);
      showSaveConfirmation("Protokol smazán.");
      await loadHistory(selectedSite?.id || item.siteId);
    }catch(e){
      prependHistoryNotice(`Chyba mazání protokolu: ${e.message}`);
    }
  }

  return { deleteCurrentHistoryProtocol, prependHistoryNotice };
}
