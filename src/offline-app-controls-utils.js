export function createOfflineAppControlsHelpers({
  prepareSzzOfflineAppData,
  scheduleSzzOfflineAppStatus,
  showSaveConfirmation,
  triggerSzzSync,
  updateSzzOfflineAppStatus
}){
  let initialStatusScheduled=false;

  function bindSzzOfflineAppControls(){
    const syncBtn=document.getElementById("syncNowBtn");
    const refreshBtn=document.getElementById("refreshOfflineStateBtn");
    const prepareBtn=document.getElementById("prepareOfflineAppBtn");
    const forceFullBtn=document.getElementById("forceFullDataSyncBtn");
    if(prepareBtn && !prepareBtn.__szzPrepareBound){
      prepareBtn.__szzPrepareBound=true;
      prepareBtn.addEventListener("click",()=>prepareSzzOfflineAppData({reason:"manual"}).catch(e=>{
        if(showSaveConfirmation) showSaveConfirmation("Offline příprava se nepodařila.");
        console.warn("Offline příprava selhala",e);
      }));
    }
    if(syncBtn && !syncBtn.__szzSyncBound){
      syncBtn.__szzSyncBound=true;
      syncBtn.addEventListener("click",()=>triggerSzzSync("manual",false).catch(e=>{
        if(showSaveConfirmation) showSaveConfirmation("Synchronizace se nepodařila.");
        console.warn("Ruční synchronizace selhala",e);
      }));
    }
    if(refreshBtn && !refreshBtn.__szzRefreshBound){
      refreshBtn.__szzRefreshBound=true;
      refreshBtn.addEventListener("click",()=>updateSzzOfflineAppStatus());
    }
    if(forceFullBtn && !forceFullBtn.__szzFullSyncBound){
      forceFullBtn.__szzFullSyncBound=true;
      forceFullBtn.addEventListener("click",()=>prepareSzzOfflineAppData({
        reason:"manual-full",
        forceFull:true,
        skipOfflineMap:true
      }).catch(e=>{
        if(showSaveConfirmation) showSaveConfirmation("Úplné stažení dat se nepodařilo.");
        console.warn("Ruční úplné stažení dat selhalo",e);
      }));
    }
    if(!initialStatusScheduled){
      initialStatusScheduled=true;
      scheduleSzzOfflineAppStatus(1200);
    }
  }

  return {
    bindSzzOfflineAppControls
  };
}
