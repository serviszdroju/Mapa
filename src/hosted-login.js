const HOSTED_APP_URL="https://serviszdroju.github.io/Mapa/";

function isLocalFileApp(){
  return window.location.protocol==="file:";
}

function setTextIfChanged(el,value){
  if(el && el.textContent!==String(value)) el.textContent=String(value);
}

function setDisplayIfChanged(el,value){
  if(el && el.style.display!==value) el.style.display=value;
}

function setClassNameIfChanged(el,value){
  if(el && el.className!==value) el.className=value;
}

function setHandlerIfChanged(el,handler){
  if(el && typeof handler==="function" && el.onclick!==handler) el.onclick=handler;
}

function status(message){
  const el=document.getElementById("startupStatus");
  setTextIfChanged(el,message);
  const gps=document.getElementById("gpsBox");
  if(gps && message){
    setDisplayIfChanged(gps,"block");
    setClassNameIfChanged(gps,"notice");
    setTextIfChanged(gps,message);
  }
  const progress=document.getElementById("progress");
  if(message) setTextIfChanged(progress,message);
}

function openHostedApp(){
  status("Lokální soubor neumí Firebase přihlášení. Otevírám webovou verzi...");
  window.location.href=HOSTED_APP_URL;
}

function runAfterHostedLoginPaint(fn){
  if(typeof window.requestAnimationFrame==="function"){
    window.requestAnimationFrame(()=>window.requestAnimationFrame(fn));
    return;
  }
  Promise.resolve().then(fn);
}

window.loginPopup=function(){
  if(isLocalFileApp()){
    openHostedApp();
    return;
  }
  window.__loginRequested=true;
  status("Připravuji přihlášení...");
  if(typeof window.__startFirebaseRedirectLogin==="function"){
    Promise.resolve(window.__startFirebaseRedirectLogin()).catch(err=>{
      status("Přihlášení se nepodařilo spustit: " + ((err && (err.code || err.message)) || err || ""));
    });
    return;
  }
  status("Přihlášení ještě není připravené. Zkus tlačítko znovu za pár sekund.");
};

function signOutAndReload(){
  if(typeof window.__signOutFirebase==="function") window.__signOutFirebase();
  else location.reload();
}

function setTopAuthButtonMode(mode){
  const topLogout=document.getElementById("topLogoutBtn");
  if(!topLogout) return;
  const loginMode=mode==="login";
  const handler=isLocalFileApp() ? openHostedApp : (window.startGoogleLogin || window.loginPopup);
  const authMode=loginMode ? "login" : "logout";
  if(topLogout.dataset.authMode!==authMode) topLogout.dataset.authMode=authMode;
  setTextIfChanged(topLogout,loginMode ? "Přihlásit technika" : "Odhlásit technika");
  if(topLogout.classList.contains("primary")!==loginMode) topLogout.classList.toggle("primary",loginMode);
  if(topLogout.classList.contains("secondary")!==(!loginMode)) topLogout.classList.toggle("secondary",!loginMode);
  setHandlerIfChanged(topLogout,loginMode ? handler : signOutAndReload);
}

function bindLoginButtons(){
  const handler=isLocalFileApp() ? openHostedApp : (window.startGoogleLogin || window.loginPopup);
  const startup=document.getElementById("startupLoginBtn");
  const login=document.getElementById("loginBtn");
  const logout=document.getElementById("logoutBtn");
  const topLogout=document.getElementById("topLogoutBtn");
  setHandlerIfChanged(startup,handler);
  setHandlerIfChanged(login,handler);
  setHandlerIfChanged(logout,signOutAndReload);
  if(topLogout) setTopAuthButtonMode(topLogout.dataset.authMode || (window.currentUser || window.__authReadyUser ? "logout" : "login"));
}

window.startGoogleLogin=window.loginPopup;
window.bindLoginButtons=bindLoginButtons;
window.setTopAuthButtonMode=setTopAuthButtonMode;
bindLoginButtons();
window.addEventListener("DOMContentLoaded",bindLoginButtons);
window.addEventListener("load",bindLoginButtons);

window.addEventListener("load",()=>{
  if(isLocalFileApp()){
    status("Přihlášení přes otevřený soubor nejde. Přesměrovávám na webovou verzi...");
    runAfterHostedLoginPaint(openHostedApp);
    return;
  }
  bindLoginButtons();
});
