export function createOfflineMapTileCacheHelpers({
  cacheAppShellForOffline=async()=>0,
  cacheName="",
  fetchRequest=request=>fetch(request),
  getNavigator=()=>navigator,
  getRunning=()=>false,
  hasCaches=()=>typeof window!=="undefined" && "caches" in window,
  markCzechReady=()=>{},
  openCache=name=>caches.open(name),
  reportServiceWorkerError=()=>{},
  requestPersistentStorage=async()=>{},
  setButtonState=()=>{},
  setRunning=()=>{},
  setStatus=()=>{},
  showSaveConfirmation=()=>{}
}={}){
  async function cacheMapTileUrls(urls,options={}){
    const nav=getNavigator();
    if(getRunning()) return;
    if(!hasCaches()){
      setStatus("Offline cache mapy není v tomto prohlížeči dostupná.","error");
      return;
    }
    if(nav.onLine===false){
      setStatus("Jsi offline. Mapu stáhni, až bude internet.","error");
      return;
    }
    if(!urls.length){
      setStatus(options.emptyMessage || "Nejdřív zobraz oblast mapy, kterou chceš uložit.","error");
      return;
    }
    const unique=[...new Set(urls)];
    const label=options.label || "mapu";
    let index=0, done=0, ok=0, failed=0;
    setRunning(true);
    setButtonState(true,options.buttonText || "Stahuji mapu...");
    setStatus(options.startMessage || "Připravuji aplikaci pro offline otevření...");
    try{
      if("serviceWorker" in nav && window.registerSzzServiceWorker){
        try{ await window.registerSzzServiceWorker(); }catch(e){ reportServiceWorkerError(e); }
      }
      await requestPersistentStorage({request:true});
      const shellCount=await cacheAppShellForOffline();
      if(nav.storage && typeof nav.storage.estimate==="function"){
        try{
          const estimate=await nav.storage.estimate();
          const quota=Number(estimate && estimate.quota) || 0;
          const usage=Number(estimate && estimate.usage) || 0;
          const expectedBytes=unique.length*18000;
          if(quota && usage+expectedBytes>quota*0.92){
            throw Object.assign(new Error(`V zařízení není dost volného místa pro offline ${label}. Odhad: ${Math.ceil(expectedBytes/1048576)} MB.`),{offlineQuota:true});
          }
        }catch(e){
          if(e && e.offlineQuota) throw e;
        }
      }
      setStatus(`Aplikace offline připravena (${shellCount} souborů). Stahuji ${label}: 0 / ${unique.length} dlaždic...`);
      const cache=await openCache(cacheName);
      async function worker(){
        while(index<unique.length){
          const url=unique[index++];
          try{
            const request=new Request(url,{mode:"no-cors",credentials:"omit",cache:"reload"});
            const response=await fetchRequest(request);
            if(response && (response.ok || response.type==="opaque")){
              await cache.put(request,response.clone());
              ok++;
            }else{
              failed++;
            }
          }catch(e){
            failed++;
          }finally{
            done++;
            if(done===unique.length || done%24===0){
              setStatus(`Stahuji ${label} do offline cache: ${done} / ${unique.length} dlaždic...`);
              setButtonState(true,`Stahuji ${done}/${unique.length}`);
            }
          }
        }
      }
      await Promise.all(Array.from({length:Math.min(6,unique.length)},()=>worker()));
      const message=failed
        ? `${options.donePrefix || "Mapa"} uložena částečně: ${ok} dlaždic, ${failed} se nepodařilo.`
        : `${options.donePrefix || "Mapa"} uložena offline: ${ok} dlaždic.`;
      if(!failed && options.markCzechReady) markCzechReady();
      setStatus(message,failed ? "error" : "ok");
      showSaveConfirmation(message);
    }catch(e){
      console.warn("Offline mapa se nepodařila uložit",e);
      setStatus("Mapu se nepodařilo uložit offline: " + (e && e.message ? e.message : e),"error");
    }finally{
      setRunning(false);
      setButtonState(false);
    }
  }

  return {
    cacheMapTileUrls
  };
}
