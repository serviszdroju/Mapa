function setAttributeIfChanged(el,name,value){
  if(el && el.getAttribute(name)!==String(value)) el.setAttribute(name,String(value));
}

function setTextIfChanged(el,value){
  if(el && el.textContent!==String(value)) el.textContent=String(value);
}

function setSourceAttributeIfChanged(el,value){
  if(el && el.getAttribute("src")!==value) el.setAttribute("src",value);
}

function setHrefAttributeIfChanged(el,value){
  if(el && el.getAttribute("href")!==value) el.setAttribute("href",value);
}

function openAppToolsPanel(){
  const appToolsPanel=document.getElementById("appToolsPanel");
  const appToolsToggle=document.getElementById("appToolsToggle");
  if(appToolsPanel) appToolsPanel.classList.add("open");
  setAttributeIfChanged(appToolsToggle,"aria-expanded","true");
}

function bindAppToolsPanel(){
  const appToolsToggle=document.getElementById("appToolsToggle");
  const appToolsPanel=document.getElementById("appToolsPanel");
  if(appToolsToggle && appToolsPanel && !appToolsToggle.__appToolsBound){
    appToolsToggle.__appToolsBound=true;
    appToolsToggle.addEventListener("click",()=>{
      const open=!appToolsPanel.classList.contains("open");
      appToolsPanel.classList.toggle("open",open);
      setAttributeIfChanged(appToolsToggle,"aria-expanded",open ? "true" : "false");
    });
  }
}

window.openAppToolsPanel=openAppToolsPanel;
let szzDeferredInstallPrompt=null;
let szzInstallPromptWaiters=[];
let szzInstallWarmupPromise=null;
let szzInstallBusy=false;
const SZZ_INSTALL_PROMPT_WAIT_MS=15000;
const SZZ_INSTALL_SW_CONTROL_WAIT_MS=7000;
const SZZ_INSTALL_SW_UPDATE_WAIT_MS=6000;
const SZZ_ANDROID_APK_URL="./downloads/szz-servis-zdroju-android.apk?v=login-popup-wait-v610";

function isSzzStandaloneApp(){
  try{
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }catch(e){
    return false;
  }
}

function isSzzIosDevice(){
  try{
    const ua=navigator.userAgent || "";
    return /iPad|iPhone|iPod/i.test(ua) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
  }catch(e){
    return false;
  }
}

function isSzzAndroidDevice(){
  try{
    const ua=navigator.userAgent || "";
    const platform=navigator.userAgentData && navigator.userAgentData.platform;
    return /Android/i.test(ua) || /Android/i.test(platform || "");
  }catch(e){
    return false;
  }
}

function isSzzChromeBrowser(){
  try{
    const ua=navigator.userAgent || "";
    return /Chrome|CriOS/i.test(ua) && !/Edg|OPR|SamsungBrowser/i.test(ua);
  }catch(e){
    return false;
  }
}

function szzInstallUnavailableMessage(){
  if(location.protocol!=="https:" && location.hostname!=="localhost"){
    return "Instalace aplikace je dostupná jen z webové adresy https.";
  }
  if(isSzzIosDevice()){
    return "Chrome na iPadu instalační dialog pro webové aplikace nepovoluje. Otevři web v Safari a použij Sdílet -> Přidat na plochu.";
  }
  if(navigator.onLine===false){
    return "Jsi offline. Připoj tablet k internetu a klikni na Instalovat aplikaci znovu.";
  }
  if(isSzzChromeBrowser()){
    return "Chrome teď instalační dialog ještě neuvolnil. Obnov stránku a klikni znovu; když se dialog neukáže, použij v Chrome menu ⋮ -> Instalovat aplikaci.";
  }
  return "Prohlížeč teď instalační dialog nepovolil. Otevři web v Chrome a použij Instalovat aplikaci.";
}

function setSzzInstallStatus(message="",state="info",toast=false){
  const status=document.getElementById("installAppStatus");
  if(status){
    status.hidden=!message;
    status.className=`small app-install-status ${state}`.trim();
    setTextIfChanged(status,message);
  }
  if(toast && message && typeof window.showSaveConfirmation==="function"){
    window.showSaveConfirmation(message);
  }
}

function startSzzApkFallbackDownload(){
  if(!isSzzAndroidDevice()) return false;
  setSzzInstallStatus("Chrome instalační dialog nepustil, stahuji instalační APK. Po stažení otevři stažený soubor a potvrď instalaci.","ok",true);
  try{
    const link=document.createElement("a");
    link.href=SZZ_ANDROID_APK_URL;
    link.download="szz-servis-zdroju-android.apk";
    link.rel="noopener";
    link.style.display="none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }catch(e){
    try{ window.location.href=SZZ_ANDROID_APK_URL; }catch(err){}
  }
  return true;
}

function updateSzzInstallButtons(){
  const button=document.getElementById("appDownloadLink");
  if(!button) return;
  if(button.dataset.directDownload==="apk"){
    setHrefAttributeIfChanged(button,SZZ_ANDROID_APK_URL);
    button.setAttribute("download","szz-servis-zdroju-android.apk");
    button.removeAttribute("disabled");
    setAttributeIfChanged(button,"aria-disabled","false");
    setTextIfChanged(button,"Stáhnout aplikaci");
    button.classList.remove("install-ready");
    return;
  }
  const installed=isSzzStandaloneApp();
  button.disabled=installed || szzInstallBusy;
  button.setAttribute("aria-disabled",installed || szzInstallBusy ? "true" : "false");
  setTextIfChanged(button,installed ? "Aplikace je nainstalovaná" : (szzInstallBusy ? "Připravuji instalaci..." : "Instalovat aplikaci"));
  button.classList.toggle("install-ready",!!szzDeferredInstallPrompt && !installed);
}

function resolveSzzInstallPromptWaiters(promptEvent=null){
  const waiters=szzInstallPromptWaiters;
  szzInstallPromptWaiters=[];
  waiters.forEach(resolve=>resolve(promptEvent || szzDeferredInstallPrompt || null));
}

function waitForSzzInstallPrompt(timeout=2500){
  if(szzDeferredInstallPrompt) return Promise.resolve(szzDeferredInstallPrompt);
  return new Promise(resolve=>{
    const timer=setTimeout(()=>{
      const index=szzInstallPromptWaiters.indexOf(done);
      if(index>=0) szzInstallPromptWaiters.splice(index,1);
      resolve(szzDeferredInstallPrompt || null);
    },timeout);
    const done=promptEvent=>{
      clearTimeout(timer);
      resolve(promptEvent || szzDeferredInstallPrompt || null);
    };
    szzInstallPromptWaiters.push(done);
  });
}

function waitForSzzServiceWorkerControl(timeout=SZZ_INSTALL_SW_CONTROL_WAIT_MS){
  if(!("serviceWorker" in navigator)) return Promise.resolve(false);
  if(navigator.serviceWorker.controller) return Promise.resolve(true);
  return new Promise(resolve=>{
    let done=false;
    const finish=value=>{
      if(done) return;
      done=true;
      clearTimeout(timer);
      navigator.serviceWorker.removeEventListener("controllerchange",onControllerChange);
      resolve(value);
    };
    const onControllerChange=()=>finish(true);
    const timer=setTimeout(()=>finish(!!navigator.serviceWorker.controller),timeout);
    navigator.serviceWorker.addEventListener("controllerchange",onControllerChange);
  });
}

function waitForSzzServiceWorkerControllerChange(timeout=SZZ_INSTALL_SW_CONTROL_WAIT_MS){
  if(!("serviceWorker" in navigator)) return Promise.resolve(false);
  return new Promise(resolve=>{
    let done=false;
    const finish=value=>{
      if(done) return;
      done=true;
      clearTimeout(timer);
      navigator.serviceWorker.removeEventListener("controllerchange",onControllerChange);
      resolve(value);
    };
    const onControllerChange=()=>finish(true);
    const timer=setTimeout(()=>finish(false),timeout);
    navigator.serviceWorker.addEventListener("controllerchange",onControllerChange);
  });
}

function waitForSzzWorkerInstalled(worker,timeout=SZZ_INSTALL_SW_UPDATE_WAIT_MS){
  if(!worker) return Promise.resolve(false);
  if(["installed","activated","redundant"].includes(worker.state)) return Promise.resolve(true);
  return new Promise(resolve=>{
    let done=false;
    const finish=value=>{
      if(done) return;
      done=true;
      clearTimeout(timer);
      worker.removeEventListener("statechange",onStateChange);
      resolve(value);
    };
    const onStateChange=()=>{
      if(["installed","activated","redundant"].includes(worker.state)) finish(true);
    };
    const timer=setTimeout(()=>finish(false),timeout);
    worker.addEventListener("statechange",onStateChange);
  });
}

async function activateSzzWaitingServiceWorker(registration){
  if(!registration || !("serviceWorker" in navigator)) return false;
  const worker=registration.waiting || window.__szzWaitingServiceWorker || registration.installing;
  if(!worker) return false;
  const hadController=!!navigator.serviceWorker.controller;
  try{
    if(typeof window.activateSzzServiceWorkerUpdate==="function"){
      window.activateSzzServiceWorkerUpdate();
    }else{
      worker.postMessage({type:"SKIP_WAITING"});
    }
  }catch(e){}
  if(hadController){
    return waitForSzzServiceWorkerControllerChange();
  }
  return waitForSzzServiceWorkerControl();
}

async function warmUpSzzPwaInstall(options={}){
  if(isSzzStandaloneApp()) return null;
  if(szzInstallWarmupPromise && !options.force) return szzInstallWarmupPromise;
  szzInstallWarmupPromise=(async()=>{
    let registration=null;
    try{
      if(typeof window.registerSzzServiceWorker==="function"){
        registration=await window.registerSzzServiceWorker();
      }else if("serviceWorker" in navigator){
        registration=await navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"});
      }
      if(registration && typeof registration.update==="function"){
        try{
          await registration.update();
          await waitForSzzWorkerInstalled(registration.installing);
        }catch(e){}
      }
      if(registration && (registration.waiting || window.__szzWaitingServiceWorker || registration.installing)){
        await activateSzzWaitingServiceWorker(registration);
      }
      if(navigator.serviceWorker && navigator.serviceWorker.ready){
        const readyRegistration=await navigator.serviceWorker.ready.catch(()=>registration);
        if(readyRegistration) registration=readyRegistration;
      }
      await waitForSzzServiceWorkerControl();
    }catch(error){
      console.warn("Příprava instalace PWA selhala",error);
    }
    try{
      await fetch("./manifest.webmanifest",{cache:"reload",credentials:"same-origin"});
    }catch(e){}
    try{
      if(typeof window.requestSzzPersistentStorage==="function"){
        await window.requestSzzPersistentStorage({request:false});
      }
      if(typeof window.cacheAppShellForOffline==="function"){
        await window.cacheAppShellForOffline();
      }
    }catch(error){
      console.warn("Zahřátí offline cache před instalací selhalo",error);
    }
    return registration;
  })().finally(()=>{
    if(options.force) szzInstallWarmupPromise=null;
  });
  return szzInstallWarmupPromise;
}

async function startSzzPwaInstall(event){
  if(event && typeof event.preventDefault==="function") event.preventDefault();
  if(szzInstallBusy){
    setSzzInstallStatus("Instalace se připravuje, počkej prosím na dialog Chromu.","info",true);
    return;
  }
  if(isSzzStandaloneApp()){
    setSzzInstallStatus("Aplikace už je v tabletu nainstalovaná.","ok",true);
    updateSzzInstallButtons();
    return;
  }
  szzInstallBusy=true;
  updateSzzInstallButtons();
  if(!szzDeferredInstallPrompt){
    if(startSzzApkFallbackDownload()){
      szzInstallBusy=false;
      updateSzzInstallButtons();
      warmUpSzzPwaInstall({force:true}).catch(()=>{});
      return;
    }
    setSzzInstallStatus("Připravuji instalační dialog v Chrome...","info",true);
    await warmUpSzzPwaInstall({force:true});
    await waitForSzzInstallPrompt(SZZ_INSTALL_PROMPT_WAIT_MS);
    if(!szzDeferredInstallPrompt){
      szzInstallBusy=false;
      setSzzInstallStatus(szzInstallUnavailableMessage(),"error",true);
      updateSzzInstallButtons();
      return;
    }
  }
  const promptEvent=szzDeferredInstallPrompt;
  szzDeferredInstallPrompt=null;
  updateSzzInstallButtons();
  try{
    await promptEvent.prompt();
    const choice=await promptEvent.userChoice.catch(()=>null);
    if(choice && choice.outcome==="accepted"){
      setSzzInstallStatus("Aplikace se instaluje.","ok",true);
      return;
    }
    setSzzInstallStatus("Instalace byla zrušená.","info",true);
  }catch(error){
    console.warn("Instalační dialog PWA se nepodařilo otevřít",error);
    setSzzInstallStatus("Instalační dialog se nepodařilo otevřít. Zkus stránku obnovit.","error",true);
  }finally{
    szzInstallBusy=false;
    updateSzzInstallButtons();
  }
}

function bindSzzPwaInstallButton(){
  const button=document.getElementById("appDownloadLink");
  if(button && button.dataset.directDownload==="apk"){
    setHrefAttributeIfChanged(button,SZZ_ANDROID_APK_URL);
    button.setAttribute("download","szz-servis-zdroju-android.apk");
    return;
  }
  if(button && !button.__szzPwaInstallBound){
    button.__szzPwaInstallBound=true;
    button.removeAttribute("href");
    button.removeAttribute("download");
    button.addEventListener("click",startSzzPwaInstall);
  }
  updateSzzInstallButtons();
}

window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  szzDeferredInstallPrompt=event;
  resolveSzzInstallPromptWaiters(event);
  if(!szzInstallBusy) setSzzInstallStatus("Instalace je připravená.","ok",false);
  updateSzzInstallButtons();
});
window.addEventListener("appinstalled",()=>{
  szzDeferredInstallPrompt=null;
  resolveSzzInstallPromptWaiters(null);
  setSzzInstallStatus("Aplikace je nainstalovaná.","ok",true);
  updateSzzInstallButtons();
});
window.updateSzzInstallButtons=updateSzzInstallButtons;
window.setSzzInstallStatus=setSzzInstallStatus;
window.startSzzPwaInstall=startSzzPwaInstall;
document.addEventListener("DOMContentLoaded",bindSzzPwaInstallButton);
window.addEventListener("load",bindSzzPwaInstallButton);
bindSzzPwaInstallButton();
document.addEventListener("DOMContentLoaded",bindAppToolsPanel);
bindAppToolsPanel();
document.addEventListener("DOMContentLoaded",()=>warmUpSzzPwaInstall().catch(()=>{}));
window.addEventListener("load",()=>warmUpSzzPwaInstall().catch(()=>{}));

const SZZ_LOGO_URL="./szz-logo-display.png";
const SZZ_APP_ICON_URL="./szz-app-icon-192.png";

function installSzzLogoAssets(){
  try{
    const logo=document.querySelector(".startup-card .logo-img");
    if(logo && !logo.dataset.logoFileApplied){
      setSourceAttributeIfChanged(logo,SZZ_LOGO_URL);
      logo.dataset.logoFileApplied="1";
    }
    document.querySelectorAll("[data-szz-logo-copy]").forEach(img=>{
      setSourceAttributeIfChanged(img,SZZ_LOGO_URL);
    });
    let icon=document.querySelector('link[rel="icon"]');
    if(!icon){
      icon=document.createElement("link");
      icon.rel="icon";
      document.head.appendChild(icon);
    }
    setAttributeIfChanged(icon,"type","image/png");
    setHrefAttributeIfChanged(icon,SZZ_APP_ICON_URL);
    let apple=document.querySelector('link[rel="apple-touch-icon"]');
    if(!apple){
      apple=document.createElement("link");
      apple.rel="apple-touch-icon";
      document.head.appendChild(apple);
    }
    setHrefAttributeIfChanged(apple,SZZ_APP_ICON_URL);
  }catch(e){}
}

window.installSzzLogoAssets=installSzzLogoAssets;
document.addEventListener("DOMContentLoaded",installSzzLogoAssets);
window.addEventListener("load",installSzzLogoAssets);

window.addEventListener("DOMContentLoaded",()=>{
  const startup=document.getElementById("startupLoginBtn");
  if(startup) startup.addEventListener("click",event=>{
    if(typeof window.startGoogleLogin==="function") window.startGoogleLogin(event);
  });
  const login=document.getElementById("loginBtn");
  if(login) login.addEventListener("click",event=>{
    if(typeof window.startGoogleLogin==="function") window.startGoogleLogin(event);
  });
});

let mobileFixMapTimer=0;
function runMobileFixMap(){
  try{
    if(window.map && window.map.invalidateSize){
      window.map.invalidateSize(true);
      if(typeof window.fit==="function"){
        window.fit();
      }
    }
  }catch(e){}
}

function mobileFixMap(){
  if(mobileFixMapTimer) cancelAnimationFrame(mobileFixMapTimer);
  mobileFixMapTimer=requestAnimationFrame(()=>{
    mobileFixMapTimer=0;
    runMobileFixMap();
  });
}

window.runMobileFixMap=runMobileFixMap;
window.mobileFixMap=mobileFixMap;
window.addEventListener("resize",mobileFixMap);
window.addEventListener("orientationchange",mobileFixMap);
window.addEventListener("pageshow",mobileFixMap);
