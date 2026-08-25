const HOSTED_APP_URL="https://serviszdroju.github.io/Mapa/";

function setTextIfChanged(el,value){
  if(el && el.textContent!==String(value)) el.textContent=String(value);
}

function setDisplayIfChanged(el,value){
  if(el && el.style.display!==value) el.style.display=value;
}

function setHandlerIfChanged(el,handler){
  if(el && typeof handler==="function" && el.onclick!==handler) el.onclick=handler;
}

function isLocalFileApp(){
  return window.location.protocol==="file:";
}

function status(message){
  const startupStatus=document.getElementById("startupStatus");
  setTextIfChanged(startupStatus,message || "");
  const progress=document.getElementById("progress");
  if(message) setTextIfChanged(progress,message);
}

function showStartupLogin(message=""){
  const startup=document.getElementById("startupScreen");
  const app=document.getElementById("mainApp");
  const button=document.getElementById("startupLoginBtn");
  const logout=document.getElementById("startupLogoutBtn");
  setDisplayIfChanged(startup,"flex");
  setDisplayIfChanged(app,"none");
  setDisplayIfChanged(button,"");
  setDisplayIfChanged(logout,"");
  if(message) status(message);
}

function openHostedApp(){
  status("Přihlášení přes otevřený soubor nejde. Otevírám webovou verzi...");
  window.location.href=HOSTED_APP_URL;
}

function startLogin(event){
  if(event && typeof event.preventDefault==="function") event.preventDefault();
  if(isLocalFileApp()){
    openHostedApp();
    return;
  }
  window.__loginRequested=true;
  showStartupLogin("Připravuji Google přihlášení...");
  const fn=window.__startFirebaseGoogleLogin;
  if(typeof fn==="function"){
    Promise.resolve(fn()).catch(err=>{
      status("Přihlášení se nepodařilo spustit: " + ((err && (err.code || err.message)) || err || ""));
    });
    return;
  }
  status("Firebase přihlášení se ještě načítá. Zkus tlačítko znovu za pár sekund.");
}

function signOutAndReload(){
  if(typeof window.__signOutFirebase==="function") window.__signOutFirebase({stayOnLogin:true});
  else if(typeof window.clearStartupAuthState==="function") window.clearStartupAuthState();
  else location.reload();
}

function setTopAuthButtonMode(mode){
  const topLogout=document.getElementById("topLogoutBtn");
  if(!topLogout) return;
  const loginMode=mode==="login";
  const authMode=loginMode ? "login" : "logout";
  if(topLogout.dataset.authMode!==authMode) topLogout.dataset.authMode=authMode;
  setTextIfChanged(topLogout,loginMode ? "Přihlásit technika" : "Odhlásit technika");
  topLogout.classList.toggle("primary",loginMode);
  topLogout.classList.toggle("secondary",!loginMode);
  setHandlerIfChanged(topLogout,loginMode ? startLogin : signOutAndReload);
}

function bindLoginButtons(){
  setHandlerIfChanged(document.getElementById("startupLoginBtn"),startLogin);
  setHandlerIfChanged(document.getElementById("startupLogoutBtn"),signOutAndReload);
  setHandlerIfChanged(document.getElementById("loginBtn"),startLogin);
  setHandlerIfChanged(document.getElementById("logoutBtn"),signOutAndReload);
  const hasUser=!!(window.currentUser || window.__authReadyUser);
  setTopAuthButtonMode(hasUser ? "logout" : "login");
}

if(!document.__szzLoginClickDelegationBound){
  document.__szzLoginClickDelegationBound=true;
  document.addEventListener("click",event=>{
    const target=event.target && event.target.closest && event.target.closest("#startupLoginBtn,#startupLogoutBtn,#loginBtn,#topLogoutBtn");
    if(!target) return;
    if(target.id==="startupLogoutBtn" || (target.id==="topLogoutBtn" && target.dataset.authMode==="logout")){
      event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation) event.stopImmediatePropagation();
      signOutAndReload();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation) event.stopImmediatePropagation();
    startLogin(event);
  },true);
}

window.loginPopup=startLogin;
window.startGoogleLogin=startLogin;
window.bindLoginButtons=bindLoginButtons;
window.setTopAuthButtonMode=setTopAuthButtonMode;
window.showStartupLogin=showStartupLogin;

bindLoginButtons();
window.addEventListener("DOMContentLoaded",()=>{
  bindLoginButtons();
  if(!(window.currentUser || window.__authReadyUser)) showStartupLogin("Přihlaste se Google účtem @astip.cz.");
});
window.addEventListener("load",bindLoginButtons);
