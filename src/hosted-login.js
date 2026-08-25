const HOSTED_APP_URL="https://serviszdroju.github.io/Mapa/";

const authUiState={
  mode:"checking",
  message:""
};

function isLocalFileApp(){
  return window.location.protocol==="file:";
}

function text(el,value){
  if(el && el.textContent!==String(value)) el.textContent=String(value);
}

function display(el,value){
  if(el && el.style.display!==value) el.style.display=value;
}

function disabled(el,value){
  if(!el) return;
  const next=!!value;
  if(el.disabled!==next) el.disabled=next;
  const aria=next ? "true" : "false";
  if(el.getAttribute("aria-disabled")!==aria) el.setAttribute("aria-disabled",aria);
}

function knownUser(){
  return window.currentUser || window.__authReadyUser || (window.auth && window.auth.currentUser) || null;
}

function status(msg){
  const message=msg || "";
  text(document.getElementById("startupStatus"),message);
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

function showAuthState(mode,options={}){
  const normalized=["logged-out","checking","logging-in","logged-in"].includes(mode) ? mode : "logged-out";
  authUiState.mode=normalized;
  authUiState.message=options.message || authUiState.message || "";

  const loggedIn=normalized==="logged-in";
  try{
    document.documentElement.classList.toggle("auth-resume",loggedIn);
  }catch(e){}
  const startup=document.getElementById("startupScreen");
  const app=document.getElementById("mainApp");
  const startupLogin=document.getElementById("startupLoginBtn");
  const intro=document.getElementById("startupIntro");
  const loginRow=document.getElementById("mainLoginRow");
  const topLogout=document.getElementById("topLogoutBtn");

  display(startup,loggedIn ? "none" : "flex");
  display(app,loggedIn ? "grid" : "none");
  display(loginRow,"none");
  display(topLogout,loggedIn ? "block" : "none");

  if(startup) startup.classList.toggle("auth-checking",normalized==="checking" || normalized==="logging-in");
  display(startupLogin,loggedIn || normalized==="checking" || normalized==="logging-in" ? "none" : "");
  disabled(startupLogin,normalized==="checking" || normalized==="logging-in");

  const introText=options.intro ||
    (normalized==="checking" ? "Kontroluji přihlášení..." :
      normalized==="logging-in" ? "Připravuji přihlášení..." :
        "Přihlaste se Google účtem @astip.cz.");
  text(intro,introText);
  status(options.message || "");
  setTopAuthButtonMode(loggedIn ? "logout" : "login");
  if(typeof window.updateAdminAppControls==="function") window.updateAdminAppControls();
}

function startLogin(event){
  return startGoogleLogin(event);
}

function startGoogleLogin(event){
  if(event && typeof event.preventDefault==="function") event.preventDefault();
  if(isLocalFileApp()){
    openHostedApp();
    return;
  }
  window.__loginRequested=true;
  showAuthState("logging-in",{message:"Připravuji přihlášení..."});
  if(typeof window.__startFirebaseRedirectLogin==="function"){
    Promise.resolve(window.__startFirebaseRedirectLogin()).catch(err=>{
      showAuthState("logged-out",{
        message:"Přihlášení se nepodařilo spustit: " + ((err && (err.code || err.message)) || err || "")
      });
    });
    return;
  }
  if(typeof window.__startCompatGoogleLoginFallback==="function"){
    window.__startCompatGoogleLoginFallback();
    return;
  }
  showAuthState("logged-out",{message:"Přihlášení ještě není připravené. Zkus tlačítko znovu za pár sekund."});
}

function startCompatGoogleLoginFallback(){
  try{
    if(!window.firebase || !firebase.auth || !window.__firebaseConfig){
      status("Firebase přihlášení ještě není načtené. Zkontroluj internet a zkus to znovu.");
      return;
    }
    if(!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.__firebaseConfig);
    try{sessionStorage.removeItem("astipFirebaseExplicitSignOut");}catch(e){}
    try{sessionStorage.setItem("astipFirebaseRedirectPending","login");}catch(e){}
    try{document.documentElement.classList.add("auth-resume");}catch(e){}
    const auth=firebase.auth();
    try{auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});}catch(e){}
    const provider=new firebase.auth.GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    provider.setCustomParameters({prompt:"select_account",hd:"astip.cz"});
    status("Otevírám Google přihlášení...");
    auth.signInWithPopup(provider).then(result=>{
      if(result && result.user){
        try{localStorage.setItem("astipFirebaseKnownSignedIn","1");}catch(e){}
        if(result.user.email) try{localStorage.setItem("astipFirebaseLastEmail",String(result.user.email).toLowerCase());}catch(e){}
        status("Přihlášení dokončeno. Načítám mapu...");
        setTimeout(()=>location.reload(),400);
      }
    }).catch(err=>{
      const code=String(err && err.code || "");
      if(["auth/popup-blocked","auth/cancelled-popup-request","auth/operation-not-supported-in-this-environment","auth/popup-closed-by-user"].includes(code)){
        try{sessionStorage.setItem("astipFirebaseRedirectPending","redirect");}catch(e){}
        status("Popup nešel dokončit. Přesměrovávám na Google přihlášení...");
        return auth.signInWithRedirect(provider);
      }
      try{sessionStorage.removeItem("astipFirebaseRedirectPending");}catch(e){}
      try{
        if(localStorage.getItem("astipFirebaseKnownSignedIn")!=="1") document.documentElement.classList.remove("auth-resume");
      }catch(e){}
      status("Přihlášení selhalo: " + (code || (err && err.message) || err || ""));
    });
  }catch(err){
    try{sessionStorage.removeItem("astipFirebaseRedirectPending");}catch(e){}
    try{
      if(localStorage.getItem("astipFirebaseKnownSignedIn")!=="1") document.documentElement.classList.remove("auth-resume");
    }catch(e){}
    status("Přihlášení selhalo: " + ((err && (err.code || err.message)) || err || ""));
  }
}

function signOutAndReload(event){
  if(event && typeof event.preventDefault==="function") event.preventDefault();
  if(typeof window.__signOutFirebase==="function") window.__signOutFirebase();
  else location.reload();
}

function setTopAuthButtonMode(mode){
  const topLogout=document.getElementById("topLogoutBtn");
  if(!topLogout) return;
  const loginMode=mode==="login";
  const handler=isLocalFileApp() ? openHostedApp : (window.startGoogleLogin || window.loginPopup);
  topLogout.dataset.authMode=loginMode ? "login" : "logout";
  text(topLogout,loginMode ? "Přihlásit technika" : "Odhlásit technika");
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
  if(startup) startup.onclick=startGoogleLogin;
  if(login && typeof handler==="function") login.onclick=handler;
  if(logout) logout.onclick=signOutAndReload;
  if(topLogout) setTopAuthButtonMode(topLogout.dataset.authMode || (knownUser() ? "logout" : "login"));
}

window.__szzSetAuthState=showAuthState;
window.__szzShowStartupChecking=(message="Kontroluji přihlášení...")=>showAuthState("checking",{message,intro:"Kontroluji přihlášení..."});
window.__szzShowAuthenticatedApp=(message="")=>showAuthState("logged-in",{message});
window.__szzGetAuthState=()=>({...authUiState});
window.__startCompatGoogleLoginFallback=startCompatGoogleLoginFallback;
window.loginPopup=startGoogleLogin;
window.startGoogleLogin=startGoogleLogin;
window.startFirebaseGoogleLogin=startGoogleLogin;
window.bindLoginButtons=bindLoginButtons;
window.setTopAuthButtonMode=setTopAuthButtonMode;
window.showStartupLogin=(message="")=>showAuthState("logged-out",{message:message || "",intro:"Přihlaste se Google účtem @astip.cz."});

bindLoginButtons();
window.addEventListener("DOMContentLoaded",bindLoginButtons);
window.addEventListener("load",bindLoginButtons);
window.addEventListener("load",function(){
  if(isLocalFileApp()){
    status("Přihlášení přes otevřený soubor nejde. Přesměrovávám na webovou verzi...");
    setTimeout(openHostedApp,1200);
    return;
  }
  bindLoginButtons();
});
