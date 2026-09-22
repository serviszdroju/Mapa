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
  showSaveConfirmation,
  triggerSzzSync
}){
  let automaticRefreshTimer=0;
  let pendingReason="";
  function scheduleAutomaticRefresh(reason,delay=500){
    pendingReason=reason || pendingReason || "visible";
    clearTimeout(automaticRefreshTimer);
    automaticRefreshTimer=setTimeout(()=>{
      automaticRefreshTimer=0;
      const nextReason=pendingReason || "visible";
      pendingReason="";
      scheduleSzzOfflineAppStatus(20);
      runWhenIdle(()=>triggerSzzSync(nextReason,true).catch(()=>{}),150);
    },delay);
  }
  window.addEventListener("online",()=>{
    registerSzzBackgroundSync("online");
    scheduleAutomaticRefresh("online",120);
  });
  window.addEventListener("offline",()=>{
    scheduleSzzOfflineAppStatus(20);
    if(typeof showSaveConfirmation==="function") showSaveConfirmation("Offline režim. Změny se uloží lokálně.");
  });
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"){
      scheduleAutomaticRefresh("visible",500);
    }
  });
  window.addEventListener("focus",()=>{
    scheduleAutomaticRefresh("focus",500);
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
