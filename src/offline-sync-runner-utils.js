export function createLegacyOfflineSyncRunner({
  getSelectedSite,
  syncOfflineChanges,
  syncOfflineProtocolsForSite
}){
  let offlineSyncInFlight=null;
  let lastAutomaticOfflineSyncAt=0;
  const automaticOfflineSyncMinMs=60000;

  function runOfflineSync(reason="manual",silent=false){
    if(navigator.onLine===false) return Promise.resolve(0);
    if(offlineSyncInFlight) return offlineSyncInFlight;
    const isAutomatic=reason!=="manual" && silent;
    if(isAutomatic){
      const now=Date.now();
      if(now-lastAutomaticOfflineSyncAt<automaticOfflineSyncMinMs) return Promise.resolve(0);
      lastAutomaticOfflineSyncAt=now;
    }
    if(typeof syncOfflineChanges==="function"){
      offlineSyncInFlight=syncOfflineChanges({reason,silent}).finally(()=>{offlineSyncInFlight=null;});
      return offlineSyncInFlight;
    }
    const selectedSite=getSelectedSite();
    if(selectedSite && typeof syncOfflineProtocolsForSite==="function"){
      offlineSyncInFlight=syncOfflineProtocolsForSite(selectedSite).finally(()=>{offlineSyncInFlight=null;});
      return offlineSyncInFlight;
    }
    return Promise.resolve(0);
  }

  return { runOfflineSync };
}
