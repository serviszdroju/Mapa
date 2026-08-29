export function bindLegacyOfflineSyncListeners({
  getSelectedSite,
  refreshLoadedDetailTabs,
  runOfflineSync,
  showSaveConfirmation
}){
  window.addEventListener("online",()=>{
    runOfflineSync("online").then(count=>{
      const selectedSite=getSelectedSite();
      if(count && selectedSite && typeof refreshLoadedDetailTabs==="function"){
        refreshLoadedDetailTabs(selectedSite);
      }
    });
  });

  window.addEventListener("offline",()=>{
    if(typeof showSaveConfirmation==="function") showSaveConfirmation("Offline režim. Změny se uloží lokálně.");
  });

  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible") runOfflineSync("visible",true);
  });

  window.addEventListener("focus",()=>runOfflineSync("focus",true));
}

export function bindOfflineConnectivityListeners({
  registerSzzBackgroundSync,
  runWhenIdle,
  scheduleSzzOfflineAppStatus,
  triggerSzzSync
}){
  window.addEventListener("online",()=>{
    scheduleSzzOfflineAppStatus(20);
    registerSzzBackgroundSync("online");
    runWhenIdle(()=>triggerSzzSync("online",true).catch(()=>{}),1200);
  });
  window.addEventListener("offline",()=>scheduleSzzOfflineAppStatus(20));
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"){
      scheduleSzzOfflineAppStatus(80);
      runWhenIdle(()=>triggerSzzSync("visible",true).catch(()=>{}),1200);
    }
  });
  window.addEventListener("focus",()=>{
    scheduleSzzOfflineAppStatus(80);
    runWhenIdle(()=>triggerSzzSync("focus",true).catch(()=>{}),1200);
  });
  window.addEventListener("storage",event=>{
    if(event.key && /^astip(Map|Szz)/.test(event.key)) scheduleSzzOfflineAppStatus(80);
  });
  if("serviceWorker" in navigator){
    navigator.serviceWorker.addEventListener("message",event=>{
      if(event.data && event.data.type==="SZZ_SYNC_REQUEST"){
        triggerSzzSync(event.data.reason || "background-sync",true).catch(()=>{});
      }
    });
  }
}
