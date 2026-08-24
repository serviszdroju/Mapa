function reportSzzServiceWorkerError(err){
  console.warn("Service worker se nepodarilo spustit",err);
  try{
    if(typeof window.setSzzInstallStatus==="function"){
      window.setSzzInstallStatus("Aplikaci se nepodařilo připravit. Zkus obnovit stránku nebo zkontroluj připojení.","error");
    }
  }catch(e){}
}

function registerSzzServiceWorker(){
  if(!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return Promise.resolve(null);
  if(window.__szzServiceWorkerRegistrationPromise) return window.__szzServiceWorkerRegistrationPromise;
  const serviceWorkerBuildVersion="2026-08-24-map-status-module-v414";
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
      function announceWaitingWorker(worker){
        if(!worker) return;
        window.__szzWaitingServiceWorker=worker;
        try{
          if(typeof window.setSzzInstallStatus==="function"){
            window.setSzzInstallStatus("Je dostupná nová verze aplikace. Dokonči rozpracovaný protokol a potom obnov stránku.","ok");
          }
        }catch(e){}
      }
      window.activateSzzServiceWorkerUpdate=function(){
        const worker=window.__szzWaitingServiceWorker || registration.waiting || registration.installing;
        if(worker) worker.postMessage({type:"SKIP_WAITING"});
      };
      if(registration.waiting) announceWaitingWorker(registration.waiting);
      registration.addEventListener("updatefound",()=>{
        const worker=registration.installing;
        if(!worker) return;
        worker.addEventListener("statechange",()=>{
          if(worker.state==="installed" && navigator.serviceWorker.controller){
            announceWaitingWorker(worker);
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
