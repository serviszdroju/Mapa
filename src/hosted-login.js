import {
  AUTH_LOADING,
  AUTH_LOGGED_IN,
  AUTH_LOGGED_OUT,
  GOOGLE_WEB_CLIENT_ID,
  firebaseConfig,
  loadGoogleIdentityServices
} from "./firebase-auth.js";

const HOSTED_APP_URL="https://serviszdroju.github.io/Mapa/";
const EMAIL_LOGIN_BUILD_VERSION="login-popup-wait-v610";
window.__firebaseConfig=window.__firebaseConfig || firebaseConfig;

const authUiState={
  mode:AUTH_LOADING,
  message:""
};
let pendingGoogleLoginRequested=false;
let pendingGoogleLoginTimer=null;
let lastGoogleLoginInteractionAt=0;
let compatGoogleLoginInProgress=false;
const GOOGLE_LOGIN_INTERACTION_MAX_AGE_MS=15000;
const AUTH_RESUME_VISIBILITY_MS=15000;
let authResumeReleaseTimer=null;

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

function activeUserGesture(){
  try{
    return !!(navigator.userActivation && navigator.userActivation.isActive);
  }catch(e){
    return false;
  }
}

function rememberGoogleLoginInteraction(event){
  if(event && typeof event.preventDefault==="function"){
    event.preventDefault();
    lastGoogleLoginInteractionAt=Date.now();
    try{window.__szzGoogleLoginInteractionAt=lastGoogleLoginInteractionAt;}catch(e){}
    return true;
  }
  return false;
}

function hasRecentGoogleLoginInteraction(){
  const globalAt=Number(window.__szzGoogleLoginInteractionAt || 0);
  const at=Math.max(lastGoogleLoginInteractionAt,Number.isFinite(globalAt) ? globalAt : 0);
  return at>0 && Date.now()-at<GOOGLE_LOGIN_INTERACTION_MAX_AGE_MS;
}

function clearPendingGoogleLogin(){
  pendingGoogleLoginRequested=false;
  if(pendingGoogleLoginTimer){
    clearTimeout(pendingGoogleLoginTimer);
    pendingGoogleLoginTimer=null;
  }
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

function cleanAuthResumeState(clearKnown=false){
  try{sessionStorage.removeItem("astipFirebaseRedirectPending");}catch(e){}
  if(clearKnown){
    try{localStorage.removeItem("astipFirebaseKnownSignedIn");}catch(e){}
    try{localStorage.removeItem("astipFirebaseLastEmail");}catch(e){}
  }
  try{document.documentElement.classList.remove("auth-resume");}catch(e){}
}

function appVisibleForAuthResume(){
  const app=document.getElementById("mainApp");
  const visibleApp=!!(app && app.style.display && app.style.display!=="none");
  const loadedRows=Array.isArray(window.rows) && window.rows.length;
  return !!(window.__mapAppUnlocked || window.__firebaseUnifiedRowsLoaded || visibleApp || loadedRows);
}

function isAndroidTransientAuthError(error){
  const message=String(error && (error.message || error.code) || error || "");
  return /Android Google přihlášení nevrátilo výsledek včas|Tiché obnovení Android přihlášení|native-resume|auth-null/i.test(message);
}

function shouldKeepMapOpenOnLoginError(error){
  let explicitSignOut=false;
  try{explicitSignOut=sessionStorage.getItem("astipFirebaseExplicitSignOut")==="1";}catch(e){}
  return !explicitSignOut && isAndroidTransientAuthError(error) && (appVisibleForAuthResume() || knownUser());
}

function isHardLoginRejection(error){
  const code=String(error && error.code || "").trim();
  const message=String(error && error.message || "").trim();
  return /auth\/user-disabled|auth\/invalid-user-token|auth\/user-token-expired|refresh token.*(invalid|revoked|expired)|token.*(revoked|disabled)|account.*disabled/i.test(`${code} ${message}`);
}

function clearAuthResumeAfterLoginError(error){
  cleanAuthResumeState(isHardLoginRejection(error));
}

function clearAuthStatusNotice(){
  text(document.getElementById("startupStatus"),"");
  const gps=document.getElementById("gpsBox");
  if(gps && /Přihlášení selhalo|Android Google/i.test(gps.textContent || "")){
    gps.textContent="";
    gps.style.display="none";
  }
  const progress=document.getElementById("progress");
  if(progress && /Přihlášení selhalo|Android Google/i.test(progress.textContent || "")) progress.textContent="";
}

function googleIdentityLoginError(error){
  const raw=error || {};
  const code=String(raw.code || raw.type || raw.error || "").trim();
  const message=String(raw.message || raw.error_description || raw.details || raw || "").trim();
  const err=new Error(message || code || "Google přihlášení bylo přerušené.");
  if(code) err.code=code;
  return err;
}

function popupShouldNotFallback(error){
  const code=String(error && error.code || "").trim();
  const message=String(error && error.message || "").trim();
  return /popup-closed-by-user|cancelled-popup-request|access_denied|cancel/i.test(`${code} ${message}`);
}

function authErrorText(error){
  const code=String(error && error.code || "").trim();
  const message=String(error && error.message || "").trim();
  if(/Android Google|Google odmítl konfiguraci APK|RESULT_CANCELED|APK\s+\d|kód\s+\d+/i.test(message)){
    return message;
  }
  if(/popup_failed_to_open|popup_blocked|auth\/popup-blocked/i.test(`${code} ${message}`)){
    return "Prohlížeč zablokoval Google přihlašovací okno. Povol popup okna pro tento web a zkus tlačítko znovu.";
  }
  if(/popup_closed|access_denied|cancel/i.test(`${code} ${message}`)){
    return "Google přihlášení bylo zavřené nebo přerušené před dokončením. Zkus tlačítko znovu a vyber účet @astip.cz.";
  }
  if(/idpiframe_initialization_failed|google identity/i.test(`${code} ${message}`)){
    return "Google přihlášení se v prohlížeči nepodařilo připravit. Zkontroluj blokování cookies/pop-up oken a zkus stránku znovu načíst.";
  }
  if(code==="auth/unauthorized-domain"){
    return `Doména ${location.hostname || "serviszdroju.github.io"} není povolená ve Firebase Authentication > Settings > Authorized domains.`;
  }
  return [code,message].filter(Boolean).join(" ") || "Google účet se nepodařilo načíst. Zkus přihlášení znovu.";
}

function signInWithFirebasePopupCompat(auth){
  if(!auth || !window.firebase || !firebase.auth || !firebase.auth.GoogleAuthProvider){
    return Promise.reject(new Error("Firebase popup přihlášení není dostupné."));
  }
  const provider=new firebase.auth.GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  provider.setCustomParameters({prompt:"select_account",hd:"astip.cz"});
  return auth.signInWithPopup(provider);
}

function signInWithGoogleIdentityCompat(auth){
  return loadGoogleIdentityServices().then(google=>new Promise((resolve,reject)=>{
    const oauth2=google && google.accounts && google.accounts.oauth2;
    if(!oauth2 || typeof oauth2.initTokenClient!=="function"){
      reject(new Error("Google Identity Services nejsou dostupné."));
      return;
    }
    let done=false;
    const finish=(fn,value)=>{
      if(done) return;
      done=true;
      fn(value);
    };
    try{
      const client=oauth2.initTokenClient({
        client_id:GOOGLE_WEB_CLIENT_ID,
        scope:"openid email profile",
        prompt:"select_account",
        hosted_domain:"astip.cz",
        callback:response=>{
          if(response && (response.error || response.error_description)){
            finish(reject,googleIdentityLoginError(response));
            return;
          }
          const accessToken=String(response && response.access_token || "").trim();
          if(!accessToken){
            finish(reject,new Error("Google nevrátil přihlašovací token."));
            return;
          }
          try{
            const credential=firebase.auth.GoogleAuthProvider.credential(null,accessToken);
            auth.signInWithCredential(credential)
              .then(result=>finish(resolve,result))
              .catch(err=>finish(reject,err));
          }catch(err){
            finish(reject,err);
          }
        },
        error_callback:error=>finish(reject,googleIdentityLoginError(error))
      });
      client.requestAccessToken({prompt:"select_account"});
    }catch(err){
      finish(reject,err);
    }
    setTimeout(()=>{
      finish(reject,new Error("Google přihlášení nevrátilo výsledek včas. Zkus tlačítko znovu."));
    },90000);
  }));
}

async function signInWithGoogleNoRedirectCompat(auth){
  const bridge=androidAuthBridge();
  if(bridge) return signInWithAndroidGoogleCompat(auth,bridge);
  try{
    return await signInWithFirebasePopupCompat(auth);
  }catch(error){
    if(popupShouldNotFallback(error)) throw error;
    console.warn("Firebase popup přihlášení selhalo, zkouším Google token bez redirectu",error);
    return signInWithGoogleIdentityCompat(auth);
  }
}

function isPopupClosedAuthError(error){
  const code=String(error && error.code || "").trim();
  const message=String(error && error.message || "").trim();
  return /popup-closed-by-user|popup_closed/i.test(`${code} ${message}`);
}

function androidAuthBridge(){
  const bridge=window.SzzAndroidAuth;
  if(!bridge || typeof bridge.startGoogleSignIn!=="function") return null;
  try{
    if(typeof bridge.isGoogleSignInConfigured==="function" && !bridge.isGoogleSignInConfigured()) return null;
  }catch(error){
    return null;
  }
  return bridge;
}

function signInWithAndroidGoogleCompat(auth,bridge){
  return new Promise((resolve,reject)=>{
    let done=false;
    const finish=(fn,value)=>{
      if(done) return;
      done=true;
      window.__szzAndroidSignInWithGoogleIdToken=null;
      window.__szzAndroidSignInError=null;
      fn(value);
    };
    window.__szzAndroidSignInWithGoogleIdToken=idToken=>{
      try{
        const token=String(idToken || "").trim();
        if(!token) throw new Error("Google nevrátil přihlašovací token.");
        const credential=firebase.auth.GoogleAuthProvider.credential(token,null);
        auth.signInWithCredential(credential)
          .then(result=>finish(resolve,result))
          .catch(error=>finish(reject,error));
      }catch(error){
        finish(reject,error);
      }
    };
    window.__szzAndroidSignInError=message=>{
      finish(reject,new Error(String(message || "").trim() || "Android Google přihlášení se nepodařilo."));
    };
    try{
      bridge.startGoogleSignIn();
    }catch(error){
      finish(reject,error);
    }
    setTimeout(()=>{
      finish(reject,new Error("Android Google přihlášení nevrátilo výsledek včas. Zkus tlačítko znovu."));
    },90000);
  });
}

function openHostedApp(){
  status("Lokální soubor neumí Firebase přihlášení. Otevírám webovou verzi...");
  window.location.href=HOSTED_APP_URL;
}

function showAuthState(mode,options={}){
  const normalized=[AUTH_LOGGED_OUT,AUTH_LOADING,"checking","logging-in",AUTH_LOGGED_IN].includes(mode) ? mode : AUTH_LOGGED_OUT;
  authUiState.mode=normalized;
  authUiState.message=Object.prototype.hasOwnProperty.call(options,"message") ? (options.message || "") : (authUiState.message || "");

  const startup=document.getElementById("startupScreen");
  const app=document.getElementById("mainApp");
  const startupLogin=document.getElementById("startupLoginBtn");
  const intro=document.getElementById("startupIntro");
  const loginRow=document.getElementById("mainLoginRow");
  const topLogout=document.getElementById("topLogoutBtn");
  let explicitlySignedOut=false;
  try{explicitlySignedOut=sessionStorage.getItem("astipFirebaseExplicitSignOut")==="1";}catch(e){}
  const runtimeAuthorized=Number(window.__szzLastAuthorizedUserAt || 0)>0;
  const appVisible=!!(app && app.style.display && app.style.display!=="none");
  const resumeStartedAt=Number(window.__szzAuthResumeStartedAt || 0);
  const resumeAge=resumeStartedAt>0 ? Date.now()-resumeStartedAt : Infinity;
  const offline=navigator.onLine===false;
  const keepOpenForRuntimeAuth=normalized===AUTH_LOGGED_OUT && runtimeAuthorized && appVisible && !explicitlySignedOut;
  const keepOpenForKnownResume=normalized===AUTH_LOGGED_OUT && knownUser() && appVisible && !explicitlySignedOut && (offline || resumeAge<AUTH_RESUME_VISIBILITY_MS);
  const loggedIn=normalized===AUTH_LOGGED_IN || keepOpenForRuntimeAuth || keepOpenForKnownResume;
  const loading=normalized===AUTH_LOADING || normalized==="checking" || normalized==="logging-in";
  if(authResumeReleaseTimer){
    clearTimeout(authResumeReleaseTimer);
    authResumeReleaseTimer=null;
  }
  if(keepOpenForKnownResume && !offline){
    authResumeReleaseTimer=setTimeout(()=>{
      authResumeReleaseTimer=null;
      const hasUser=!!(window.currentUser || window.__authReadyUser);
      let signedOut=false;
      try{signedOut=sessionStorage.getItem("astipFirebaseExplicitSignOut")==="1";}catch(e){}
      if(!hasUser && !signedOut) showAuthState(AUTH_LOGGED_OUT,{message:""});
    },Math.max(250,AUTH_RESUME_VISIBILITY_MS-resumeAge+50));
  }
  try{
    document.documentElement.classList.toggle("auth-resume",loggedIn);
  }catch(e){}

  display(startup,loggedIn ? "none" : "flex");
  display(app,loggedIn ? "grid" : "none");
  display(loginRow,"none");
  display(topLogout,loggedIn ? "block" : "none");

  if(startup){
    startup.classList.toggle("auth-checking",loading);
    startup.classList.toggle("auth-loading",loading);
  }
  display(startupLogin,loggedIn || loading ? "none" : "");
  disabled(startupLogin,loading);

  const introText=options.intro ||
    (loading ? "Načítám aplikaci" :
        "Přihlaste se Google účtem @astip.cz.");
  text(intro,introText);
  status(keepOpenForRuntimeAuth || keepOpenForKnownResume ? "" : (options.message || ""));
  setTopAuthButtonMode(knownUser() ? "logout" : "login");
  if(typeof window.updateAdminAppControls==="function") window.updateAdminAppControls();
}

function startLogin(event){
  if(isLocalFileApp()){
    openHostedApp();
    return;
  }
  return startGoogleLogin(event);
}

function runReadyGoogleLogin(options={}){
  const explicit=options.explicit===true || hasRecentGoogleLoginInteraction();
  if(navigator.onLine===false){
    if(explicit && !knownUser()) showAuthState(AUTH_LOGGED_OUT,{message:"Jsi offline. Přihlášení přes Google půjde znovu po připojení k internetu."});
    return false;
  }
  if(!explicit && !pendingGoogleLoginRequested) return false;
  if(!explicit){
    clearPendingGoogleLogin();
    return false;
  }
  if(typeof window.__startFirebaseRedirectLogin==="function"){
    clearPendingGoogleLogin();
    Promise.resolve(window.__startFirebaseRedirectLogin({explicit:true})).catch(err=>{
      if(shouldKeepMapOpenOnLoginError(err)){
        clearAuthStatusNotice();
        showAuthState(AUTH_LOGGED_IN,{message:""});
        return;
      }
      showAuthState(AUTH_LOGGED_OUT,{
        message:"Přihlášení se nepodařilo spustit: " + ((err && (err.code || err.message)) || err || "")
      });
    });
    return true;
  }
  if(typeof window.__startCompatGoogleLoginFallback==="function"){
    clearPendingGoogleLogin();
    window.__startCompatGoogleLoginFallback({explicit:true});
    return true;
  }
  return false;
}

function queueGoogleLoginUntilReady(options={}){
  const explicit=options.explicit===true || hasRecentGoogleLoginInteraction();
  if(!explicit) return false;
  if(navigator.onLine===false){
    if(!knownUser()) showAuthState(AUTH_LOGGED_OUT,{message:"Jsi offline. Přihlášení přes Google půjde znovu po připojení k internetu."});
    return false;
  }
  pendingGoogleLoginRequested=true;
  showAuthState("logging-in",{message:"Připravuji přihlášení..."});
  if(runReadyGoogleLogin({explicit:true})) return true;
  const started=Date.now();
  const tick=()=>{
    if(!pendingGoogleLoginRequested) return;
    if(runReadyGoogleLogin({explicit:true})) return;
    if(Date.now()-started<10000){
      pendingGoogleLoginTimer=setTimeout(tick,150);
      return;
    }
    pendingGoogleLoginRequested=false;
    pendingGoogleLoginTimer=null;
    showAuthState(AUTH_LOGGED_OUT,{message:"Firebase přihlášení ještě není načtené. Zkontroluj internet a zkus to znovu."});
  };
  if(pendingGoogleLoginTimer) clearTimeout(pendingGoogleLoginTimer);
  pendingGoogleLoginTimer=setTimeout(tick,150);
  return true;
}

function startGoogleLogin(event){
  const explicit=rememberGoogleLoginInteraction(event) || hasRecentGoogleLoginInteraction();
  if(isLocalFileApp()){
    openHostedApp();
    return;
  }
  if(!explicit) return false;
  if(navigator.onLine===false){
    if(!knownUser()) showAuthState(AUTH_LOGGED_OUT,{message:"Jsi offline. Přihlášení přes Google půjde znovu po připojení k internetu."});
    return false;
  }
  window.__loginRequested=true;
  showAuthState("logging-in",{message:"Připravuji přihlášení..."});
  if(runReadyGoogleLogin({explicit:true})) return true;
  return queueGoogleLoginUntilReady({explicit:true});
}

function startCompatGoogleLoginFallback(options={}){
  if(!(options.explicit===true || hasRecentGoogleLoginInteraction())) return false;
  if(compatGoogleLoginInProgress){
    showAuthState("logging-in",{
      intro:"Dokonči Google přihlášení v otevřeném okně.",
      message:"Google přihlášení už běží."
    });
    return true;
  }
  try{
    if(!window.firebase || !firebase.auth || !window.__firebaseConfig){
      showAuthState(AUTH_LOGGED_OUT,{message:"Firebase přihlášení ještě není načtené. Zkontroluj internet a zkus to znovu."});
      return;
    }
    if(!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.__firebaseConfig);
    try{sessionStorage.removeItem("astipFirebaseExplicitSignOut");}catch(e){}
    cleanAuthResumeState(false);
    const auth=firebase.auth();
    try{auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});}catch(e){}
    status("Otevírám Google přihlášení...");
    compatGoogleLoginInProgress=true;
    let keepLoginWaiting=false;
    signInWithGoogleNoRedirectCompat(auth).then(result=>{
      if(result && result.user){
        try{localStorage.setItem("astipFirebaseKnownSignedIn","1");}catch(e){}
        if(result.user.email) try{localStorage.setItem("astipFirebaseLastEmail",String(result.user.email).toLowerCase());}catch(e){}
        status("Přihlášení dokončeno. Načítám mapu...");
        setTimeout(()=>location.reload(),400);
      }
    }).catch(err=>{
      if(shouldKeepMapOpenOnLoginError(err)){
        cleanAuthResumeState(false);
        clearAuthStatusNotice();
        showAuthState(AUTH_LOGGED_IN,{message:""});
        return;
      }
      if(isPopupClosedAuthError(err)){
        keepLoginWaiting=true;
        showAuthState("logging-in",{
          intro:"Dokonči Google přihlášení v otevřeném okně.",
          message:"Čekám na dokončení Google přihlášení."
        });
        setTimeout(()=>{
          if(knownUser()) return;
          compatGoogleLoginInProgress=false;
          showAuthState(AUTH_LOGGED_OUT,{
            message:"Google přihlášení se nedokončilo. Zkus tlačítko znovu a vyber účet @astip.cz."
          });
        },90000);
        return;
      }
      clearAuthResumeAfterLoginError(err);
      showAuthState(AUTH_LOGGED_OUT,{message:"Přihlášení selhalo: " + authErrorText(err)});
    }).finally(()=>{
      if(!keepLoginWaiting && !knownUser()) compatGoogleLoginInProgress=false;
    });
  }catch(err){
    compatGoogleLoginInProgress=false;
    if(shouldKeepMapOpenOnLoginError(err)){
      cleanAuthResumeState(false);
      clearAuthStatusNotice();
      showAuthState(AUTH_LOGGED_IN,{message:""});
      return;
    }
    clearAuthResumeAfterLoginError(err);
    showAuthState(AUTH_LOGGED_OUT,{message:"Přihlášení selhalo: " + authErrorText(err)});
  }
}

function signOutAndReload(event){
  if(event && typeof event.preventDefault==="function") event.preventDefault();
  try{
    const bridge=window.SzzAndroidAuth;
    if(bridge && typeof bridge.signOut==="function") bridge.signOut();
  }catch(error){}
  if(typeof window.__signOutFirebase==="function") window.__signOutFirebase();
  else location.reload();
}

function setTopAuthButtonMode(mode){
  const topLogout=document.getElementById("topLogoutBtn");
  if(!topLogout) return;
  const loginMode=mode==="login";
  const handler=isLocalFileApp() ? openHostedApp : (window.loginPopup || window.startGoogleLogin);
  topLogout.dataset.authMode=loginMode ? "login" : "logout";
  text(topLogout,loginMode ? "Přihlásit technika" : "Odhlásit technika");
  topLogout.classList.toggle("primary",loginMode);
  topLogout.classList.toggle("secondary",!loginMode);
  topLogout.onclick=loginMode ? handler : signOutAndReload;
}

function bindLoginButtons(){
  const handler=isLocalFileApp() ? openHostedApp : (window.loginPopup || window.startGoogleLogin);
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
window.__szzShowStartupChecking=(message="Načítám aplikaci")=>showAuthState(AUTH_LOADING,{message,intro:"Načítám aplikaci"});
window.__szzShowAuthenticatedApp=(message="")=>showAuthState(AUTH_LOGGED_IN,{message});
window.__szzGetAuthState=()=>({...authUiState});
window.__startCompatGoogleLoginFallback=startCompatGoogleLoginFallback;
window.__szzRunPendingLogin=()=>runReadyGoogleLogin({explicit:hasRecentGoogleLoginInteraction()});
window.szzEmergencyEmailLogin=event=>startGoogleLogin(event);
window.loginEmail=window.szzEmergencyEmailLogin;
window.loginPopup=startGoogleLogin;
window.startGoogleLogin=startGoogleLogin;
window.startFirebaseGoogleLogin=startGoogleLogin;
window.bindLoginButtons=bindLoginButtons;
window.setTopAuthButtonMode=setTopAuthButtonMode;
window.showStartupLogin=(message="")=>showAuthState(AUTH_LOGGED_OUT,{message:message || "",intro:"Přihlaste se Google účtem @astip.cz."});

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
