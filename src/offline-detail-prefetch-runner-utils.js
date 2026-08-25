export function createOfflineDetailPrefetchRunner({
  getRowsForPrefetch=()=>[],
  isReady=()=>false,
  isOnline=()=>true,
  isPageVisible=()=>true,
  prefetchOfflineDetailsForSite=async()=>({}),
  runBoundedFirestoreTasks=async tasks=>Promise.allSettled(tasks.map(task=>task())),
  runWhenIdle=callback=>setTimeout(callback,0),
  safeValue=value=>String(value ?? "").trim(),
  scheduleOfflineAppStatus=()=>{},
  waitForFirebaseUser=async()=>null,
  writeOfflineReadyState=()=>{}
}={}){
  const DETAIL_PREFETCH_CONCURRENCY=3;
  let backgroundDetailPrefetchPromise=null;
  let backgroundDetailPrefetchTimer=0;

  function isConstrainedDevice(){
    try{
      return (window.matchMedia && window.matchMedia("(max-width: 900px)").matches) ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency<=4);
    }catch(e){
      return false;
    }
  }

  function detailPrefetchConcurrency(){
    return isConstrainedDevice() ? 1 : DETAIL_PREFETCH_CONCURRENCY;
  }

  async function prefetchOfflineDetailData(inputRows=null,options={}){
    const rowsForPrefetch=getRowsForPrefetch(inputRows);
    const totals={sites:rowsForPrefetch.length,processed:0,protocols:0,serviceRecords:0,photos:0,attachments:0,media:0,skipped:0,changedSites:0};
    if(!rowsForPrefetch.length || !isOnline() || !isReady()) return totals;
    const signedUser=await waitForFirebaseUser();
    if(!signedUser) return totals;
    const tasks=rowsForPrefetch.map(site=>async()=>{
      const item=await prefetchOfflineDetailsForSite(site,options);
      totals.processed++;
      totals.protocols+=Number(item.protocols) || 0;
      totals.serviceRecords+=Number(item.serviceRecords) || 0;
      totals.photos+=Number(item.photos) || 0;
      totals.attachments+=Number(item.attachments) || 0;
      totals.media+=Number(item.media) || 0;
      if(item.skipped) totals.skipped++;
      if(item.changed) totals.changedSites++;
      if(typeof options.onProgress==="function") options.onProgress({...totals});
    });
    await runBoundedFirestoreTasks(tasks,detailPrefetchConcurrency(),{
      yieldEvery:1,
      yieldTimeout:isConstrainedDevice() ? 220 : 140
    });
    return totals;
  }

  function scheduleBackgroundDetailPrefetch(inputRows=null,options={}){
    clearTimeout(backgroundDetailPrefetchTimer);
    if(!isOnline() || !isPageVisible()) return false;
    const rowsForPrefetch=getRowsForPrefetch(inputRows);
    if(!rowsForPrefetch.length) return false;
    const delayMs=Math.max(0,Number(options.delayMs) || 0);
    backgroundDetailPrefetchTimer=setTimeout(()=>{
      runWhenIdle(()=>{
        if(backgroundDetailPrefetchPromise || !isOnline() || !isPageVisible()) return;
        backgroundDetailPrefetchPromise=(async()=>{
          const totals=await prefetchOfflineDetailData(rowsForPrefetch,{
            incremental:options.incremental!==false,
            forceFull:options.forceFull===true
          });
          writeOfflineReadyState({
            lastDetailPrefetchAt:new Date().toISOString(),
            lastDetailPrefetchReason:safeValue(options.reason || "background"),
            cachedDetailSites:totals.processed || 0,
            changedDetailSites:totals.changedSites || 0,
            skippedDetailSites:totals.skipped || 0,
            cachedProtocols:totals.protocols || 0,
            cachedServiceRecords:totals.serviceRecords || 0,
            cachedPhotos:totals.photos || 0,
            cachedAttachments:totals.attachments || 0,
            cachedPhotoFiles:totals.media || 0
          });
          scheduleOfflineAppStatus(180);
          return totals;
        })().catch(e=>{
          console.warn("Přednačtení offline detailů na pozadí selhalo",e);
          return null;
        }).finally(()=>{
          backgroundDetailPrefetchPromise=null;
        });
      },1200);
    },delayMs);
    return true;
  }

  return {
    isConstrainedDevice,
    prefetchOfflineDetailData,
    scheduleBackgroundDetailPrefetch
  };
}
