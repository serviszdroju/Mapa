const EMPTY_DETAIL_CACHE={sites:0,processed:0,protocols:0,serviceRecords:0,photos:0,attachments:0,media:0,skipped:0,changedSites:0};

export function createOfflineAppPrepareHelpers({
  appBuildVersion="",
  cacheAppShellForOffline=async()=>0,
  cacheCurrentRowsForOffline=()=>0,
  czechOfflineMapReady=()=>false,
  getButton=()=>null,
  getSyncText=()=>null,
  getWindowRows=()=>[],
  incrementalSafetyMs=0,
  isOnline=()=>true,
  loadFirebaseSitesUnified=()=>null,
  openAppToolsPanel=()=>{},
  prefetchOfflineDetailData=async()=>EMPTY_DETAIL_CACHE,
  readCachedFirebaseSiteCount=()=>0,
  readOfflineReadyState=()=>({}),
  requestPersistentStorage=async()=>({}),
  rowsForPrefetch=()=>[],
  scheduleOfflineAppStatus=()=>{},
  setDisabledIfChanged=()=>{},
  setTextIfChanged=()=>{},
  showFirebaseMapRowsCache=()=>null,
  showSaveConfirmation=()=>{},
  storageEstimate=async()=>null,
  syncOfflineMapRowDeltas=async()=>[],
  writeOfflineReadyState=update=>update
}={}){
  async function prepareOfflineAppData(options={}){
    const silent=options.silent===true;
    if(!silent) openAppToolsPanel();
    const button=getButton();
    const syncText=getSyncText();
    if(button){
      setDisabledIfChanged(button,true);
      setTextIfChanged(button,"Připravuji offline...");
    }
    setTextIfChanged(syncText,"Ukládám aplikaci a servisní data do telefonu.");
    try{
      const storage=await requestPersistentStorage({request:true});
      let shellCount=0;
      try{
        if(window.registerSzzServiceWorker) await window.registerSzzServiceWorker();
        shellCount=await cacheAppShellForOffline();
      }catch(e){
        console.warn("Offline shell se nepodařilo připravit",e);
      }
      let loadedRows=null;
      let changedRows=[];
      const readyBefore=readOfflineReadyState();
      const cachedRowsBefore=readCachedFirebaseSiteCount();
      const firstRun=options.forceFull===true || !cachedRowsBefore || !readyBefore.rowsSyncedAtMs;
      if(cachedRowsBefore && (!Array.isArray(getWindowRows()) || !getWindowRows().length)){
        try{
          setTextIfChanged(syncText,"Načítám uložené body z telefonu.");
          await showFirebaseMapRowsCache(null,{offlineBoot:true});
        }catch(e){
          console.warn("Lokální cache bodů se nepodařila načíst před synchronizací",e);
        }
      }
      if(isOnline() && typeof loadFirebaseSitesUnified==="function"){
        try{
          if(firstRun){
            setTextIfChanged(syncText,"První příprava: stahuji body z Firebase do telefonu.");
            loadedRows=await loadFirebaseSitesUnified(null,{force:true,skipLocalCache:true});
          }else{
            setTextIfChanged(syncText,"Kontroluji změny v bodech od poslední synchronizace.");
            const sinceMs=Number(readyBefore.rowsSyncedAtMs || Date.parse(readyBefore.preparedAt || "") || 0);
            changedRows=await syncOfflineMapRowDeltas(sinceMs);
            loadedRows=changedRows;
          }
        }catch(e){
          console.warn(firstRun ? "Servisní data se nepodařilo přednačíst" : "Rozdílová synchronizace bodů selhala",e);
        }
      }
      const cachedRows=cacheCurrentRowsForOffline();
      let detailCache={...EMPTY_DETAIL_CACHE};
      if(isOnline() && cachedRows){
        const rowsForDetails=firstRun
          ? (Array.isArray(loadedRows) && loadedRows.length ? loadedRows : rowsForPrefetch())
          : changedRows;
        if(rowsForDetails.length){
          setTextIfChanged(syncText,firstRun
            ? `Ukládám protokoly a galerie k bodům: 0 / ${rowsForDetails.length}.`
            : `Kontroluji rozdíly u změněných bodů: 0 / ${rowsForDetails.length}.`);
          try{
            detailCache=await prefetchOfflineDetailData(rowsForDetails,{
              incremental:!firstRun,
              forceFull:options.forceFull===true,
              onProgress:progress=>{
                setTextIfChanged(syncText,firstRun
                  ? `Ukládám protokoly a galerie k bodům: ${progress.processed} / ${progress.sites}.`
                  : `Kontroluji rozdíly u změněných bodů: ${progress.processed} / ${progress.sites}, změny: ${progress.changedSites}.`);
              }
            });
          }catch(e){
            console.warn("Přednačtení detailů pro offline režim selhalo",e);
          }
        }else if(!firstRun){
          setTextIfChanged(syncText,"Žádné nové nebo změněné body od poslední synchronizace.");
        }
      }
      const cachedOfflineMap=czechOfflineMapReady();
      if(isOnline() && !cachedOfflineMap && options.skipOfflineMap!==true){
        setTextIfChanged(syncText,"Offline mapa se ukládá jen pro aktuálně zobrazenou oblast. Celou ČR z OSM nestahuji.");
      }
      const estimate=await storageEstimate();
      const nowMs=Date.now();
      const ready=writeOfflineReadyState({
        appBuildVersion,
        preparedAt:new Date().toISOString(),
        rowsSyncedAtMs:isOnline() ? Math.max(0,nowMs-incrementalSafetyMs) : (readyBefore.rowsSyncedAtMs || 0),
        incremental:!firstRun,
        persistentStorage:!!storage.persisted,
        persistentStorageSupported:!!storage.supported,
        shellCount,
        cachedRows,
        loadedRows:Array.isArray(loadedRows) ? loadedRows.length : null,
        changedRows:Array.isArray(changedRows) ? changedRows.length : 0,
        cachedDetailSites:detailCache.processed || 0,
        changedDetailSites:detailCache.changedSites || 0,
        skippedDetailSites:!firstRun && !detailCache.processed ? cachedRows : (detailCache.skipped || 0),
        cachedProtocols:detailCache.protocols || 0,
        cachedServiceRecords:detailCache.serviceRecords || 0,
        cachedPhotos:detailCache.photos || 0,
        cachedAttachments:detailCache.attachments || 0,
        cachedPhotoFiles:detailCache.media || 0,
        cachedOfflineMap,
        offlineMapPolicy:"visible-tiles-only",
        storageUsage:estimate ? estimate.usage : 0,
        storageQuota:estimate ? estimate.quota : 0
      });
      if(!silent) showSaveConfirmation("Offline data připravena.");
      const changedRecordCount=(detailCache.protocols || 0) + (detailCache.serviceRecords || 0);
      const attachmentSummary=detailCache.attachments ? `, ${detailCache.attachments} příloh` : "";
      const detailSummary=(changedRecordCount || detailCache.photos || detailCache.attachments)
        ? `, ${detailCache.protocols + detailCache.serviceRecords} záznamů, ${detailCache.photos} fotek${attachmentSummary}`
        : "";
      const mapSummary=cachedOfflineMap ? ", mapa ČR" : "";
      if(!firstRun && cachedRows){
        const skippedSites=!detailCache.processed ? cachedRows : (detailCache.skipped || 0);
        setTextIfChanged(syncText,`Synchronizace hotová: ${changedRows.length} změněných bodů${detailSummary}, přeskočeno ${skippedSites} beze změny${mapSummary}.`);
      }else{
        setTextIfChanged(syncText,cachedRows
          ? `Offline připraveno: ${cachedRows} bodů${detailSummary}${mapSummary} v telefonu.`
          : "Aplikace je připravená pro offline otevření, body se uloží po načtení z Firebase.");
      }
      scheduleOfflineAppStatus(80);
      return ready;
    }finally{
      if(button){
        setDisabledIfChanged(button,false);
        setTextIfChanged(button,"Připravit offline data");
      }
    }
  }

  return {
    prepareOfflineAppData
  };
}
