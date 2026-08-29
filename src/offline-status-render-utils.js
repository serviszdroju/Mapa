export function createOfflineStatusRenderHelpers({
  isOnline,
  readSzzSyncState,
  safeValue,
  setTextIfChanged,
  szzBytesLabel,
  szzSyncTimeLabel
}){
  const szzOfflineStatusNodeCache={};
  const safe=safeValue;

  function szzOfflineStatusNode(id){
    const cached=szzOfflineStatusNodeCache[id];
    if(cached && cached.isConnected) return cached;
    const el=document.getElementById(id);
    if(el) szzOfflineStatusNodeCache[id]=el;
    return el;
  }

  function renderSzzOfflineAppStatus(counts){
    const card=szzOfflineStatusNode("appSyncCard");
    if(!card) return;
    const state=readSzzSyncState();
    const online=isOnline();
    const pending=Number(counts?.pending) || 0;
    const drafts=Number(counts?.drafts) || 0;
    const syncing=state.status==="syncing" && Date.now()-new Date(state.syncStartedAt || 0).getTime()<45000;
    const dot=szzOfflineStatusNode("appConnectionDot");
    const label=szzOfflineStatusNode("appConnectionLabel");
    const text=szzOfflineStatusNode("appSyncText");
    const meta=szzOfflineStatusNode("appSyncMeta");
    const syncBtn=szzOfflineStatusNode("syncNowBtn");
    const setCount=(id,value)=>{
      setTextIfChanged(szzOfflineStatusNode(id),String(value || 0));
    };
    setCount("pendingSitesCount",counts?.sites);
    setCount("pendingProtocolsCount",counts?.protocols);
    setCount("pendingPhotosCount",counts?.photos);
    setCount("pendingDraftsCount",drafts);
    if(dot){
      dot.classList.toggle("offline",!online || pending>0);
      dot.classList.toggle("error",state.status==="error" && pending>0 && online);
    }
    if(card) card.classList.toggle("syncing",syncing);
    if(label){
      const message=!online
        ? "Offline režim"
        : syncing
          ? "Synchronizuji změny"
          : pending
            ? "Čeká na synchronizaci"
            : drafts
              ? "Jsou uložené koncepty"
              : "Synchronizováno";
      setTextIfChanged(label,message);
    }
    if(text){
      const message=!online
        ? "Práce se ukládá do telefonu. Po připojení se odešle do webu."
        : syncing
          ? "Odesílám lokální změny do Firebase a Cloudinary."
          : pending
            ? `V telefonu čeká ${pending} změn k odeslání.`
            : drafts
              ? "Rozepsané protokoly jsou uložené lokálně, odešlou se po uložení formuláře."
              : "Všechny uložené změny jsou spárované s webem.";
      setTextIfChanged(text,message);
    }
    if(meta){
      const last=szzSyncTimeLabel(state.lastSyncedAt);
      const lastCount=Number(state.lastCount) || 0;
      const error=safe(state.lastError);
      const cachedRows=Number(counts?.cachedRows) || 0;
      const usageLabel=szzBytesLabel(counts?.storageUsage);
      const storageLabel=counts?.persistentStorage ? "úložiště trvalé" : (counts?.storageSupported ? "úložiště běžné" : "úložiště nezjištěno");
      const offlineLabel=cachedRows ? `Offline data: ${cachedRows} bodů, ${storageLabel}${usageLabel ? `, ${usageLabel}` : ""}.` : `Offline data: ${storageLabel}.`;
      const message=error && pending
        ? `Poslední chyba: ${error}`
        : `Poslední synchronizace: ${last}${lastCount ? `, odesláno ${lastCount}` : ""}. ${offlineLabel}`;
      setTextIfChanged(meta,message);
    }
    if(syncBtn){
      const disabled=syncing || !online || !pending;
      if(syncBtn.disabled!==disabled) syncBtn.disabled=disabled;
      setTextIfChanged(syncBtn,syncing ? "Synchronizuji..." : "Synchronizovat teď");
    }
  }

  return {
    renderSzzOfflineAppStatus,
    szzOfflineStatusNode
  };
}
