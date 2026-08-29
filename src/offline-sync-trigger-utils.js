export function createOfflineSyncTriggerHelpers({
  noteSzzSyncState,
  openAppToolsPanel,
  registerServiceWorker,
  scheduleSzzOfflineAppStatus,
  showSaveConfirmation,
  syncOfflineChanges,
  updateSzzOfflineAppStatus
}){
  let lastAutomaticSzzSyncTriggerAt=0;
  const automaticSzzSyncTriggerMinMs=60000;

  async function triggerSzzSync(reason="manual",silent=false){
    const isAutomatic=reason!=="manual" && silent;
    if(isAutomatic){
      const now=Date.now();
      if(now-lastAutomaticSzzSyncTriggerAt<automaticSzzSyncTriggerMinMs) return 0;
      lastAutomaticSzzSyncTriggerAt=now;
    }
    if(!silent && typeof openAppToolsPanel==="function") openAppToolsPanel();
    if(navigator.onLine===false){
      if(!silent && typeof showSaveConfirmation==="function") showSaveConfirmation("Jsi offline. Změny zůstanou uložené v telefonu.");
      scheduleSzzOfflineAppStatus(20);
      return 0;
    }
    noteSzzSyncState("syncing",{reason});
    scheduleSzzOfflineAppStatus(20);
    try{
      const synced=typeof syncOfflineChanges==="function"
        ? await syncOfflineChanges({reason,force:!silent,silent})
        : 0;
      noteSzzSyncState("ok",{reason,lastCount:synced});
      const counts=await updateSzzOfflineAppStatus({force:true});
      if(!silent && !synced && !(counts && counts.pending) && typeof showSaveConfirmation==="function"){
        showSaveConfirmation("Vše je synchronizované.");
      }
      return synced;
    }catch(e){
      noteSzzSyncState("error",{reason,lastError:e && (e.message || e.code) || String(e)});
      scheduleSzzOfflineAppStatus(20);
      throw e;
    }
  }

  async function registerSzzBackgroundSync(reason="change"){
    if(!("serviceWorker" in navigator) || navigator.onLine===false) return false;
    try{
      const registration=typeof registerServiceWorker==="function"
        ? await registerServiceWorker()
        : await navigator.serviceWorker.ready;
      if(registration && "sync" in registration){
        await registration.sync.register("astip-szz-offline-sync");
        return true;
      }
    }catch(e){
      console.warn("Background sync se nepodařilo naplánovat",reason,e);
    }
    return false;
  }

  return { registerSzzBackgroundSync, triggerSzzSync };
}
