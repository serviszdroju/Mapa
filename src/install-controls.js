let deferredSzzInstallPrompt=window.__szzDeferredInstallPrompt || null;
const SZZ_ANDROID_APK_URL="./downloads/szz-mapa-tablet-1.0.2.apk";
let szzApkAvailabilityPromise=null;

function setTextIfChanged(el,value){
  if(el && el.textContent!==String(value)) el.textContent=String(value);
}

function setDisplayIfChanged(el,value){
  if(el && el.style.display!==value) el.style.display=value;
}

function setDisabledIfChanged(el,value){
  if(el && el.disabled!==!!value) el.disabled=!!value;
}

function setClassNameIfChanged(el,value){
  if(el && el.className!==value) el.className=value;
}

function setAttributeIfChanged(el,name,value){
  if(el && el.getAttribute(name)!==String(value)) el.setAttribute(name,String(value));
}

function currentSzzInstallPrompt(){
  return deferredSzzInstallPrompt || window.__szzDeferredInstallPrompt || null;
}

function isSzzAppInstalledView(){
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

function canShowSzzInstallButton(){
  return !isSzzAppInstalledView();
}

function updateSzzInstallButtons(){
  const show=canShowSzzInstallButton();
  document.querySelectorAll(".install-app-btn").forEach(button=>{
    setDisplayIfChanged(button,show ? "" : "none");
  });
  renderSzzInstallGuide();
}

function setSzzInstallStatus(message="",state="info"){
  const panel=document.getElementById("appInstallStatus");
  if(panel){
    setDisplayIfChanged(panel,message ? "block" : "none");
    setClassNameIfChanged(panel,`notice offline-map-status ${state==="error" ? "err" : state==="ok" ? "ok" : ""}`.trim());
    setTextIfChanged(panel,message);
  }
  const startup=document.getElementById("startupStatus");
  const startupVisible=!!(startup && document.getElementById("startupScreen")?.style.display!=="none");
  if(startupVisible && message) setTextIfChanged(startup,message);
  renderSzzInstallGuide();
}

function szzInstallEnvironment(){
  const ua=navigator.userAgent || "";
  const android=/android/i.test(ua);
  const firefox=/firefox|fxios/i.test(ua);
  const samsung=/samsungbrowser/i.test(ua);
  const chrome=/chrome|crios/i.test(ua) && !/edg|opr|opera|samsungbrowser|firefox|fxios/i.test(ua);
  const secure=location.protocol==="https:" || location.hostname==="localhost" || location.hostname==="127.0.0.1";
  return {
    android,
    chrome,
    samsung,
    firefox,
    secure,
    installed:isSzzAppInstalledView(),
    serviceWorker:"serviceWorker" in navigator,
    hasPrompt:!!currentSzzInstallPrompt(),
    online:navigator.onLine!==false
  };
}

function szzInstallReadiness(env=szzInstallEnvironment()){
  if(env.installed) return "ready";
  if(!env.secure || !env.serviceWorker) return "error";
  if(env.hasPrompt) return "ready";
  if(env.android && (env.chrome || env.samsung)) return "warn";
  return "warn";
}

function szzInstallCheck(el,ok,warn=false){
  if(!el) return;
  el.classList.toggle("ok",!!ok);
  el.classList.toggle("warn",!ok && !!warn);
  el.classList.toggle("err",!ok && !warn);
}

function renderSzzInstallGuide(){
  const card=document.getElementById("installGuideCard");
  if(!card) return;
  const env=szzInstallEnvironment();
  const readiness=szzInstallReadiness(env);
  const badge=document.getElementById("installGuideBadge");
  const state=document.getElementById("installGuideState");
  if(card.dataset.state!==readiness) card.dataset.state=readiness;
  if(badge){
    setTextIfChanged(badge,env.installed
      ? "Hotovo"
      : readiness==="ready"
        ? "Připraveno"
        : readiness==="error"
          ? "Blokováno"
          : "Čeká na tablet");
  }
  szzInstallCheck(document.getElementById("installCheckChrome"),env.chrome || env.samsung,env.android);
  szzInstallCheck(document.getElementById("installCheckSecure"),env.secure,false);
  szzInstallCheck(document.getElementById("installCheckWorker"),env.serviceWorker,false);
  szzInstallCheck(document.getElementById("installCheckPrompt"),env.hasPrompt,env.android && (env.chrome || env.samsung));
  if(state){
    let stateText="Na Androidu otevři stejnou adresu v Chromu. Odkaz si můžeš zkopírovat tlačítkem níže.";
    if(env.installed) stateText="Aplikace už běží jako nainstalovaná. Offline data připravíš tlačítkem níže.";
    else if(!env.secure) stateText="Instalace funguje jen přes zabezpečený web HTTPS. Otevři publikovanou adresu aplikace, ne lokální soubor.";
    else if(!env.serviceWorker) stateText="Tento prohlížeč nepodporuje offline instalaci. Použij Android Chrome.";
    else if(env.hasPrompt) stateText="Tablet je připravený. Klepni na Stáhnout aplikaci, potvrď otázku a ikona se po instalaci objeví mezi aplikacemi.";
    else if(env.android && (env.chrome || env.samsung)) stateText="Tablet zatím neposlal stránce instalační okno. Bez systémového okna Android aplikaci do menu nepřidá; obnov stránku a klepni znovu.";
    else if(env.android) stateText="Otevři tuto adresu v Android Chromu. Některé prohlížeče přímé stažení aplikace nenabízejí.";
    setTextIfChanged(state,stateText);
  }
}

function androidInstallHelpText(){
  const env=szzInstallEnvironment();
  const ua=navigator.userAgent || "";
  if(env.installed){
    return "Aplikace už je nainstalovaná. Otevři ji ikonou mezi aplikacemi v tabletu.";
  }
  if(!env.secure){
    return "Instalace je dostupná jen přes HTTPS. Otevři publikovanou webovou adresu aplikace.";
  }
  if(!env.serviceWorker){
    return "Tento prohlížeč neumí offline instalaci aplikace. Otevři stránku v Android Chromu.";
  }
  if(/firefox/i.test(ua)){
    return "Firefox na Androidu neumí spustit přímou instalaci tímto tlačítkem. Otevři stránku v Android Chromu a klikni znovu; po instalaci bude ikona mezi aplikacemi v tabletu.";
  }
  if(/android/i.test(ua)){
    return "Tablet zatím nepřipravil instalační okno pro toto tlačítko. Bez toho se aplikace v menu tabletu neobjeví. Obnov stránku v Android Chromu a klikni znovu.";
  }
  return "Instalační okno je dostupné hlavně v Android Chromu. Bez systémového instalačního okna se ikona v menu tabletu nevytvoří.";
}

async function copySzzInstallUrl(){
  const url=location.href.split("#")[0];
  try{
    await navigator.clipboard.writeText(url);
    setSzzInstallStatus("Odkaz na aplikaci zkopírován. Pošli ho do telefonu a otevři v Android Chromu.","ok");
    if(window.showSaveConfirmation) window.showSaveConfirmation("Odkaz zkopírován.");
  }catch(e){
    setSzzInstallStatus("Odkaz pro telefon: " + url,"info");
  }
}

function openAppToolsPanel(){
  const appToolsPanel=document.getElementById("appToolsPanel");
  const appToolsToggle=document.getElementById("appToolsToggle");
  if(appToolsPanel) appToolsPanel.classList.add("open");
  setAttributeIfChanged(appToolsToggle,"aria-expanded","true");
}

function setSzzInstallBusy(busy=false,text="Stáhnout aplikaci"){
  document.querySelectorAll(".install-app-btn").forEach(button=>{
    setDisabledIfChanged(button,busy);
    setTextIfChanged(button,text);
  });
}

async function isSzzAndroidApkAvailable(force=false){
  if(force) szzApkAvailabilityPromise=null;
  if(!szzApkAvailabilityPromise){
    szzApkAvailabilityPromise=fetch(SZZ_ANDROID_APK_URL,{method:"HEAD",cache:"no-store"})
      .then(response=>response && response.ok)
      .catch(()=>false);
  }
  return await szzApkAvailabilityPromise;
}

async function updateSzzApkLinkState(force=false){
  const links=Array.from(document.querySelectorAll(".apk-install-link"));
  if(!links.length) return false;
  links.forEach(link=>{ link.href=SZZ_ANDROID_APK_URL; });
  const available=await isSzzAndroidApkAvailable(force);
  links.forEach(link=>{
    setAttributeIfChanged(link,"aria-disabled",available ? "false" : "true");
    setTextIfChanged(link,available ? (link.classList.contains("direct-apk-link") ? "Stáhnout instalační APK přímo" : "Stáhnout APK") : "APK se připravuje");
  });
  return available;
}

async function downloadSzzAndroidApk(){
  const available=await updateSzzApkLinkState(true);
  if(!available){
    setSzzInstallStatus("APK instalátor se ještě připravuje. Zkus to za pár minut tlačítkem Stáhnout APK.","info");
    if(window.showSaveConfirmation) window.showSaveConfirmation("APK se ještě připravuje.");
    return false;
  }
  setSzzInstallStatus("Stahuji APK instalátor. Po stažení ho v tabletu otevři a potvrď instalaci.","ok");
  if(window.showSaveConfirmation) window.showSaveConfirmation("Stahuji APK instalátor.");
  window.location.href=SZZ_ANDROID_APK_URL;
  return true;
}

function closeSzzInstallConfirm(){
  const dialog=document.getElementById("installConfirmDialog");
  if(dialog) dialog.hidden=true;
}

function showSzzInstallConfirm(){
  const dialog=document.getElementById("installConfirmDialog");
  if(!dialog){
    performSzzInstallFromPage().catch(error=>{
      console.warn("Instalaci aplikace se nepodařilo spustit",error);
      setSzzInstallStatus("Instalaci se nepodařilo spustit: " + (error?.message || error),"error");
    });
    return;
  }
  dialog.hidden=false;
  setSzzInstallStatus("Potvrď instalaci aplikace v okně na obrazovce.","info");
  setTimeout(()=>document.getElementById("confirmInstallBtn")?.focus(),0);
}

async function prepareSzzInstallOfflineShell(){
  if(window.registerSzzServiceWorker) await window.registerSzzServiceWorker();
  if(window.requestSzzPersistentStorage) await window.requestSzzPersistentStorage({request:true});
  if(window.cacheAppShellForOffline) return await window.cacheAppShellForOffline();
  return 0;
}

async function runSzzBrowserInstallPrompt(){
  const promptEvent=currentSzzInstallPrompt();
  if(!promptEvent) return null;
  deferredSzzInstallPrompt=null;
  window.__szzDeferredInstallPrompt=null;
  updateSzzInstallButtons();
  promptEvent.prompt();
  try{
    return await promptEvent.userChoice;
  }catch(error){
    console.warn("Instalační volba nebyla dostupná",error);
    return null;
  }
}

async function performSzzInstallFromPage(){
  openAppToolsPanel();
  if(isSzzAppInstalledView()){
    setSzzInstallStatus("Aplikace už běží jako nainstalovaná.","ok");
    if(window.showSaveConfirmation) window.showSaveConfirmation("Aplikace už je nainstalovaná.");
    return;
  }
  setSzzInstallBusy(true,"Instaluji...");
  if(currentSzzInstallPrompt()){
    setSzzInstallStatus("Otevírám instalační okno telefonu...","ok");
    const choice=await runSzzBrowserInstallPrompt();
    if(choice?.outcome==="accepted"){
      setSzzInstallStatus("Instalace aplikace spuštěna. Ikonu otevři mezi aplikacemi v tabletu.","ok");
      if(window.showSaveConfirmation) window.showSaveConfirmation("Instalace aplikace spuštěna.");
      prepareSzzInstallOfflineShell().catch(e=>{
        console.warn("Příprava instalačního shellu po instalaci selhala",e);
      });
    }else{
      setSzzInstallStatus("Instalace byla zrušena nebo ji telefon nedokončil. Zkus tlačítko Stáhnout aplikaci znovu.","error");
      if(window.showSaveConfirmation) window.showSaveConfirmation("Instalace zrušena.");
    }
    setSzzInstallBusy(false);
    return;
  }
  setSzzInstallStatus("Připravuji aplikaci pro offline otevření...");
  try{
    const count=await prepareSzzInstallOfflineShell();
    setSzzInstallStatus(`Aplikace připravena pro offline otevření (${count} souborů).`,"ok");
  }catch(e){
    console.warn("Příprava aplikace pro instalaci selhala",e);
    setSzzInstallStatus("Aplikaci se nepodařilo připravit pro offline režim: " + (e?.message || e),"error");
  }finally{
    setSzzInstallBusy(false);
  }
  if(currentSzzInstallPrompt()){
    renderSzzInstallGuide();
    setSzzInstallStatus("Telefon teď instalační dialog připravil. Klepni znovu na Stáhnout aplikaci a potvrď instalaci.","ok");
    if(window.showSaveConfirmation) window.showSaveConfirmation("Instalace je připravená.");
    return;
  }
  const help=androidInstallHelpText();
  renderSzzInstallGuide();
  setSzzInstallStatus(help,szzInstallReadiness()==="error" ? "error" : "info");
  if(window.showSaveConfirmation) window.showSaveConfirmation("Instalaci nabízí Android Chrome.");
}

function installSzzAppFromPage(){
  openAppToolsPanel();
  if(isSzzAppInstalledView()){
    setSzzInstallStatus("Aplikace už běží jako nainstalovaná.","ok");
    if(window.showSaveConfirmation) window.showSaveConfirmation("Aplikace už je nainstalovaná.");
    return;
  }
  performSzzInstallFromPage().catch(error=>{
    console.warn("Instalaci aplikace se nepodařilo spustit",error);
    setSzzInstallBusy(false);
    setSzzInstallStatus("Instalaci se nepodařilo spustit: " + (error?.message || error),"error");
  });
}

window.updateSzzInstallButtons=updateSzzInstallButtons;
window.installSzzAppFromPage=installSzzAppFromPage;
window.setSzzInstallStatus=setSzzInstallStatus;
window.renderSzzInstallGuide=renderSzzInstallGuide;
window.openAppToolsPanel=openAppToolsPanel;

window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  deferredSzzInstallPrompt=event;
  window.__szzDeferredInstallPrompt=event;
  updateSzzInstallButtons();
  setSzzInstallStatus("Telefon je připravený k instalaci. Klepni na Stáhnout aplikaci.","ok");
});

window.addEventListener("szzinstallpromptready",()=>{
  deferredSzzInstallPrompt=window.__szzDeferredInstallPrompt || deferredSzzInstallPrompt;
  updateSzzInstallButtons();
});

window.addEventListener("appinstalled",()=>{
  deferredSzzInstallPrompt=null;
  window.__szzDeferredInstallPrompt=null;
  updateSzzInstallButtons();
  setSzzInstallStatus("Aplikace nainstalována. Ikonu najdeš mezi aplikacemi v tabletu; potom připrav offline data.","ok");
  if(window.showSaveConfirmation) window.showSaveConfirmation("Ikona je v menu tabletu.");
});

function bindSzzInstallControls(){
  const appToolsToggle=document.getElementById("appToolsToggle");
  const appToolsPanel=document.getElementById("appToolsPanel");
  if(appToolsToggle && appToolsPanel && !appToolsToggle.__appToolsBound){
    appToolsToggle.__appToolsBound=true;
    appToolsToggle.addEventListener("click",()=>{
      const open=!appToolsPanel.classList.contains("open");
      appToolsPanel.classList.toggle("open",open);
      setAttributeIfChanged(appToolsToggle,"aria-expanded",open ? "true" : "false");
      if(open) renderSzzInstallGuide();
    });
  }
  document.querySelectorAll(".install-app-btn").forEach(button=>{
    if(button.__szzInstallBound) return;
    button.__szzInstallBound=true;
    button.addEventListener("click",installSzzAppFromPage);
  });
  const installConfirmDialog=document.getElementById("installConfirmDialog");
  const confirmInstallBtn=document.getElementById("confirmInstallBtn");
  const cancelInstallConfirmBtn=document.getElementById("cancelInstallConfirmBtn");
  if(confirmInstallBtn && !confirmInstallBtn.__szzInstallConfirmBound){
    confirmInstallBtn.__szzInstallConfirmBound=true;
    confirmInstallBtn.addEventListener("click",()=>{
      closeSzzInstallConfirm();
      performSzzInstallFromPage().catch(error=>{
        console.warn("Instalaci aplikace se nepodařilo spustit",error);
        setSzzInstallBusy(false);
        setSzzInstallStatus("Instalaci se nepodařilo spustit: " + (error?.message || error),"error");
      });
    });
  }
  if(cancelInstallConfirmBtn && !cancelInstallConfirmBtn.__szzInstallCancelBound){
    cancelInstallConfirmBtn.__szzInstallCancelBound=true;
    cancelInstallConfirmBtn.addEventListener("click",()=>{
      closeSzzInstallConfirm();
      setSzzInstallStatus("Instalace zrušena. Tlačítkem Stáhnout aplikaci ji můžeš spustit znovu.","info");
    });
  }
  if(installConfirmDialog && !installConfirmDialog.__szzInstallDialogBound){
    installConfirmDialog.__szzInstallDialogBound=true;
    installConfirmDialog.addEventListener("click",event=>{
      if(event.target===installConfirmDialog){
        closeSzzInstallConfirm();
        setSzzInstallStatus("Instalace zrušena. Tlačítkem Stáhnout aplikaci ji můžeš spustit znovu.","info");
      }
    });
    document.addEventListener("keydown",event=>{
      if(event.key==="Escape" && !installConfirmDialog.hidden){
        closeSzzInstallConfirm();
        setSzzInstallStatus("Instalace zrušena. Tlačítkem Stáhnout aplikaci ji můžeš spustit znovu.","info");
      }
    });
  }
  const prepareOfflineBtn=document.getElementById("prepareOfflineAppBtn");
  if(prepareOfflineBtn && !prepareOfflineBtn.__szzPrepareBound && !prepareOfflineBtn.__szzInstallPrepareBound){
    prepareOfflineBtn.__szzInstallPrepareBound=true;
    prepareOfflineBtn.addEventListener("click",()=>window.prepareSzzOfflineAppData?.({reason:"manual"}).catch(e=>{
      if(window.showSaveConfirmation) window.showSaveConfirmation("Offline příprava se nepodařila.");
      console.warn("Offline příprava selhala",e);
    }));
  }
  const copyInstallUrlBtn=document.getElementById("copyInstallUrlBtn");
  if(copyInstallUrlBtn && !copyInstallUrlBtn.__szzInstallCopyBound){
    copyInstallUrlBtn.__szzInstallCopyBound=true;
    copyInstallUrlBtn.addEventListener("click",copySzzInstallUrl);
  }
  const refreshInstallGuideBtn=document.getElementById("refreshInstallGuideBtn");
  if(refreshInstallGuideBtn && !refreshInstallGuideBtn.__szzInstallRefreshBound){
    refreshInstallGuideBtn.__szzInstallRefreshBound=true;
    refreshInstallGuideBtn.addEventListener("click",()=>{
      renderSzzInstallGuide();
      setSzzInstallStatus(androidInstallHelpText(),szzInstallReadiness()==="error" ? "error" : "info");
      updateSzzApkLinkState(true);
    });
  }
  document.querySelectorAll(".apk-install-link").forEach(link=>{
    if(link.__szzApkBound) return;
    link.__szzApkBound=true;
    link.addEventListener("click",event=>{
      event.preventDefault();
      downloadSzzAndroidApk();
    });
  });
  updateSzzInstallButtons();
  renderSzzInstallGuide();
  updateSzzApkLinkState();
}
document.addEventListener("DOMContentLoaded",bindSzzInstallControls);
bindSzzInstallControls();

export { bindSzzInstallControls, renderSzzInstallGuide, updateSzzInstallButtons, installSzzAppFromPage, openAppToolsPanel };
