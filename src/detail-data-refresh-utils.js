export function createDetailDataRefreshHelpers({
  applyLatestProtocolDateToRaw,
  detailKey,
  detailSubNode,
  detailTableNode,
  getDb,
  getFbFsMod,
  getFirebaseReady,
  getSelectedSite,
  normalize,
  renderDetailTable,
  selectedSiteDocId,
  setSelectedSite,
  showControlDateDisplay,
  siteSourceLabel,
  syncOpenProtocolContactFromDetail,
  syncOpenProtocolDeviceTypeFromDetail
}){
  function refreshSelectedDetailDataView(){
    const selectedSite=getSelectedSite();
    if(!selectedSite) return;
    const table=detailTableNode();
    if(table && !table.classList.contains("data-edit-table")){
      renderDetailTable(table,selectedSite);
    }
    showControlDateDisplay(selectedSite);
    const sub=detailSubNode();
    if(sub) sub.textContent=siteSourceLabel(selectedSite) || "";
    syncOpenProtocolContactFromDetail(selectedSite);
    syncOpenProtocolDeviceTypeFromDetail(selectedSite);
  }

  async function refreshSiteDataFromFirebase(site=getSelectedSite()){
    const docId=selectedSiteDocId(site);
    const fsMod=getFbFsMod();
    const db=getDb();
    if(!docId || !getFirebaseReady() || !db || !fsMod) return null;
    try{
      const {doc,getDoc}=fsMod;
      const snap=await getDoc(doc(db,"sitesUnified",docId));
      if(!snap.exists()) return null;
      const data=snap.data() || {};
      const mergedRaw=applyLatestProtocolDateToRaw({...(site?.raw||{}), ...(data.raw||{})}, data);
      const mergedData={...data,raw:mergedRaw};
      if(site){
        site.firebaseData=mergedData;
        site.raw=mergedRaw;
        const refreshed=normalize([mergedRaw])[0];
        Object.assign(site, refreshed, {
          id:site.id,
          i:site.i,
          firebaseDocId:docId,
          firebaseData:mergedData
        });
      }
      const selectedSite=getSelectedSite();
      if(selectedSite && detailKey(selectedSite)===detailKey(site)){
        setSelectedSite(site);
      }
      return mergedData;
    }catch(e){
      console.warn("Čerstvé načtení dat bodu selhalo",e);
      return null;
    }
  }

  return {
    refreshSelectedDetailDataView,
    refreshSiteDataFromFirebase
  };
}
