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

export function createAutomaticConnectivityRefreshScheduler({
  clearTimer=clearTimeout,
  minIntervalMs=60000,
  now=Date.now,
  run,
  setTimer=setTimeout
}){
  let automaticRefreshTimer=0;
  let lastAutomaticRefreshAt=0;
  let pendingForce=false;
  let pendingReason="";

  function schedule(reason,delay=500,{force=false}={}){
    const currentTime=Number(now()) || Date.now();
    if(!force && lastAutomaticRefreshAt && currentTime-lastAutomaticRefreshAt<minIntervalMs) return false;
    pendingReason=reason || pendingReason || "visible";
    pendingForce=pendingForce || force;
    clearTimer(automaticRefreshTimer);
    automaticRefreshTimer=setTimer(()=>{
      automaticRefreshTimer=0;
      const runTime=Number(now()) || Date.now();
      const shouldForce=pendingForce;
      const nextReason=pendingReason || "visible";
      pendingForce=false;
      pendingReason="";
      if(!shouldForce && lastAutomaticRefreshAt && runTime-lastAutomaticRefreshAt<minIntervalMs) return;
      lastAutomaticRefreshAt=runTime;
      if(typeof run==="function") run(nextReason);
    },delay);
    return true;
  }

  return {schedule};
}

export function bindOfflineConnectivityListeners({
  registerSzzBackgroundSync,
  runWhenIdle,
  scheduleSzzOfflineAppStatus,
  showSaveConfirmation,
  triggerSzzSync
}){
  const automaticRefresh=createAutomaticConnectivityRefreshScheduler({
    run:nextReason=>{
      scheduleSzzOfflineAppStatus(20);
      runWhenIdle(()=>triggerSzzSync(nextReason,true).catch(()=>{}),150);
    }
  });
  window.addEventListener("online",()=>{
    registerSzzBackgroundSync("online");
    automaticRefresh.schedule("online",120,{force:true});
  });
  window.addEventListener("offline",()=>{
    scheduleSzzOfflineAppStatus(20);
    if(typeof showSaveConfirmation==="function") showSaveConfirmation("Offline režim. Změny se uloží lokálně.");
  });
  document.addEventListener("visibilitychange",()=>{
    if(document.visibilityState==="visible"){
      automaticRefresh.schedule("visible",500);
    }
  });
  window.addEventListener("focus",()=>{
    automaticRefresh.schedule("focus",500);
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
