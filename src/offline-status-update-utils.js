export function createOfflineStatusUpdateHelpers({
  collectSzzOfflineCounts,
  invalidateSzzOfflineCountsCache,
  renderSzzOfflineAppStatus
}){
  let szzOfflineStatusTimer=0;
  let szzOfflineStatusRun=0;

  async function updateSzzOfflineAppStatus(options={}){
    if(options && options.force) invalidateSzzOfflineCountsCache();
    const runId=++szzOfflineStatusRun;
    const counts=await collectSzzOfflineCounts();
    if(runId!==szzOfflineStatusRun) return counts;
    window.__szzOfflineCounts=counts;
    renderSzzOfflineAppStatus(counts);
    return counts;
  }

  function scheduleSzzOfflineAppStatus(delay=120){
    clearTimeout(szzOfflineStatusTimer);
    szzOfflineStatusTimer=setTimeout(()=>updateSzzOfflineAppStatus().catch(e=>console.warn("Offline stav se nepodařilo obnovit",e)),delay);
  }

  return {
    scheduleSzzOfflineAppStatus,
    updateSzzOfflineAppStatus
  };
}
