const HOSTED_APP_URL="https://serviszdroju.github.io/Mapa/";

function isLocalFileApp(){
  return window.location.protocol==="file:";
}

function status(message){
  const el=document.getElementById("startupStatus");
  if(el) el.textContent=message;
  const gps=document.getElementById("gpsBox");
  if(gps && message){
    gps.style.display="block";
    gps.className="notice";
    gps.textContent=message;
  }
  const progress=document.getElementById("progress");
  if(progress && message) progress.textContent=message;
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
  topLogout.dataset.authMode=loginMode ? "login" : "logout";
  topLogout.textContent=loginMode ? "Přihlásit technika" : "Odhlásit technika";
  topLogout.classList.toggle("primary",loginMode);
  topLogout.classList.toggle("secondary",!loginMode);
  topLogout.onclick=loginMode ? handler : signOutAndReload;
}

function bindLoginButtons(){
  const handler=isLocalFileApp() ? openHostedApp : (window.startGoogleLogin || window.loginPopup);
  const startup=document.getElementById("startupLoginBtn");
  const login=document.getElementById("loginBtn");
  const logout=document.getElementById("logoutBtn");
  const topLogout=document.getElementById("topLogoutBtn");
  if(startup && typeof handler==="function") startup.onclick=handler;
  if(login && typeof handler==="function") login.onclick=handler;
  if(logout) logout.onclick=signOutAndReload;
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
