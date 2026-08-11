function reportSzzServiceWorkerError(err){
  console.warn("Service worker se nepodarilo spustit",err);
  try{
    if(typeof window.setSzzInstallStatus==="function"){
      window.setSzzInstallStatus("Offline aplikaci se nepodařilo připravit. Zkus obnovit stránku nebo zkontroluj připojení.","error");
    }
  }catch(e){}
}

function registerSzzServiceWorker(){
  if(!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return Promise.resolve(null);
  if(window.__szzServiceWorkerRegistrationPromise) return window.__szzServiceWorkerRegistrationPromise;
  const serviceWorkerBuildVersion="2026-08-11-reuse-offline-shell-v234";
  const activatedKey=`astipSzzSwActivated:${serviceWorkerBuildVersion}`;
  if(!window.__szzSwControllerChangeBound){
    window.__szzSwControllerChangeBound=true;
    navigator.serviceWorker.addEventListener("controllerchange",()=>{
      try{
        if(sessionStorage.getItem(activatedKey)==="1") return;
        sessionStorage.setItem(activatedKey,"1");
      }catch(e){
        // sessionStorage can be blocked in private modes; the new worker is still active.
      }
      window.__szzServiceWorkerActivated=true;
      if(typeof window.scheduleSzzOfflineAppStatus==="function") window.scheduleSzzOfflineAppStatus(250);
    });
  }
  window.__szzServiceWorkerRegistrationPromise=navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"})
    .then(registration=>{
      if(registration.waiting) registration.waiting.postMessage({type:"SKIP_WAITING"});
      registration.addEventListener("updatefound",()=>{
        const worker=registration.installing;
        if(!worker) return;
        worker.addEventListener("statechange",()=>{
          if(worker.state==="installed" && navigator.serviceWorker.controller){
            worker.postMessage({type:"SKIP_WAITING"});
          }
        });
      });
      try{ registration.update(); }catch(e){}
      return navigator.serviceWorker.ready.catch(()=>registration);
    })
    .catch(err=>{
      console.warn("Service worker se nepodarilo registrovat",err);
      window.__szzServiceWorkerRegistrationPromise=null;
      throw err;
    });
  return window.__szzServiceWorkerRegistrationPromise;
}

window.reportSzzServiceWorkerError=reportSzzServiceWorkerError;
window.registerSzzServiceWorker=registerSzzServiceWorker;
registerSzzServiceWorker().catch(reportSzzServiceWorkerError);
window.addEventListener("load",()=>registerSzzServiceWorker().catch(reportSzzServiceWorkerError));

export { registerSzzServiceWorker, reportSzzServiceWorkerError };
