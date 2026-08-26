import {
  GOOGLE_WEB_CLIENT_ID,
  firebaseConfig,
  loadGoogleIdentityServices
} from "./firebase-auth.js";

const HOSTED_APP_URL="https://serviszdroju.github.io/Mapa/";
const EMAIL_LOGIN_BUILD_VERSION="map-focus-module-v534";
window.__firebaseConfig=window.__firebaseConfig || firebaseConfig;

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

function firstInputValue(){
  for(const id of arguments){
    const el=document.getElementById(id);
    const value=String(el && el.value || "").trim();
    if(value) return value;
  }
  return "";
}

function focusFirstEmptyLoginField(){
  for(const id of ["startupEmail","startupPassword"]){
    const el=document.getElementById(id);
    if(el && !String(el.value || "").trim()){
      try{el.focus();}catch(e){}
      return;
    }
  }
}

function cleanAuthResumeState(clearKnown=false){
  try{sessionStorage.removeItem("astipFirebaseRedirectPending");}catch(e){}
  if(clearKnown){
    try{localStorage.removeItem("astipFirebaseKnownSignedIn");}catch(e){}
    try{localStorage.removeItem("astipFirebaseLastEmail");}catch(e){}
  }
  try{document.documentElement.classList.remove("auth-resume");}catch(e){}
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
  const startupEmail=document.getElementById("startupEmailLogin");
  const intro=document.getElementById("startupIntro");
  const loginRow=document.getElementById("mainLoginRow");
  const topLogout=document.getElementById("topLogoutBtn");

  display(startup,loggedIn ? "none" : "flex");
  display(app,loggedIn ? "grid" : "none");
  display(loginRow,"none");
  display(topLogout,loggedIn ? "block" : "none");

  if(startup) startup.classList.toggle("auth-checking",normalized==="checking" || normalized==="logging-in");
  display(startupLogin,"none");
  display(startupEmail,loggedIn ? "none" : "grid");
  disabled(startupLogin,normalized==="checking" || normalized==="logging-in");

  const introText=options.intro ||
    (normalized==="checking" ? "Kontroluji přihlášení..." :
      normalized==="logging-in" ? "Připravuji přihlášení..." :
        "Přihlas se e-mailem a heslem.");
  text(intro,introText);
  status(options.message || "");
  setTopAuthButtonMode(loggedIn ? "logout" : "login");
  if(typeof window.updateAdminAppControls==="function") window.updateAdminAppControls();
}

function startLogin(event){
  if(event && typeof event.preventDefault==="function") event.preventDefault();
  if(isLocalFileApp()){
    openHostedApp();
    return;
  }
  showAuthState("logged-out",{message:"Vyplň e-mail a heslo na úvodní obrazovce.",intro:"Přihlas se e-mailem a heslem."});
  setTimeout(focusFirstEmptyLoginField,0);
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
      showAuthState("logged-out",{message:"Firebase přihlášení ještě není načtené. Zkontroluj internet a zkus to znovu."});
      return;
    }
    if(!firebase.apps || !firebase.apps.length) firebase.initializeApp(window.__firebaseConfig);
    try{sessionStorage.removeItem("astipFirebaseExplicitSignOut");}catch(e){}
    cleanAuthResumeState(false);
    const auth=firebase.auth();
    try{auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(()=>{});}catch(e){}
    status("Otevírám Google přihlášení...");
    signInWithGoogleNoRedirectCompat(auth).then(result=>{
      if(result && result.user){
        try{localStorage.setItem("astipFirebaseKnownSignedIn","1");}catch(e){}
        if(result.user.email) try{localStorage.setItem("astipFirebaseLastEmail",String(result.user.email).toLowerCase());}catch(e){}
        status("Přihlášení dokončeno. Načítám mapu...");
        setTimeout(()=>location.reload(),400);
      }
    }).catch(err=>{
      cleanAuthResumeState(true);
      showAuthState("logged-out",{message:"Přihlášení selhalo: " + authErrorText(err)});
    });
  }catch(err){
    cleanAuthResumeState(true);
    showAuthState("logged-out",{message:"Přihlášení selhalo: " + authErrorText(err)});
  }
}

function authMessage(error){
  const code=String(error && error.code || "").trim();
  if(code==="auth/operation-not-allowed") return "E-mailové přihlášení není ve Firebase zapnuté.";
  if(code==="auth/invalid-credential" || code==="auth/wrong-password") return "E-mail nebo heslo není správné.";
  if(code==="auth/user-not-found") return "Účet ve Firebase neexistuje.";
  if(code==="auth/network-request-failed") return "Tablet nemá spojení pro Firebase přihlášení.";
  return String(error && error.message || "").trim() || "Přihlášení se nepodařilo.";
}

async function emergencyEmailLogin(event){
  if(event){
    event.preventDefault();
    event.stopPropagation();
    if(event.stopImmediatePropagation) event.stopImmediatePropagation();
  }
  startLogin();
  const email=firstInputValue("startupEmail").toLowerCase();
  const password=String(firstInputValue("startupPassword") || "");
  if(!email || !password){
    status("Vyplň e-mail a heslo.");
    return;
  }
  if(!email.endsWith("@astip.cz")){
    status("Přihlášení je povoleno jen pro účet @astip.cz.");
    return;
  }
  status("Přihlašuji e-mailem...");
  try{
    const appMod=await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
    const authMod=await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
    const app=appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(firebaseConfig);
    const auth=authMod.getAuth(app);
    try{authMod.setPersistence && await authMod.setPersistence(auth,authMod.indexedDBLocalPersistence);}catch(e){
      try{authMod.setPersistence && await authMod.setPersistence(auth,authMod.browserLocalPersistence);}catch(_){}
    }
    const result=await authMod.signInWithEmailAndPassword(auth,email,password);
    const user=result && result.user;
    try{
      localStorage.setItem("astipFirebaseKnownSignedIn","1");
      if(user && user.email) localStorage.setItem("astipFirebaseLastEmail",user.email);
      sessionStorage.removeItem("astipFirebaseRedirectPending");
    }catch(e){}
    window.currentUser=user || null;
    window.__authReadyUser=user || null;
    status("Přihlášení potvrzeno. Otevírám servisní mapu...");
    const target=new URL(".",location.href);
    target.searchParams.set("v",EMAIL_LOGIN_BUILD_VERSION);
    target.searchParams.set("login","email");
    setTimeout(()=>location.replace(target.href),350);
  }catch(error){
    status("E-mailové přihlášení selhalo: " + authMessage(error));
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
  const startupEmail=document.getElementById("startupEmailLoginBtn");
  const login=document.getElementById("loginBtn");
  const logout=document.getElementById("logoutBtn");
  const topLogout=document.getElementById("topLogoutBtn");
  if(startup) startup.onclick=startGoogleLogin;
  if(startupEmail && typeof window.szzEmergencyEmailLogin==="function") startupEmail.onclick=window.szzEmergencyEmailLogin;
  if(login && typeof handler==="function") login.onclick=handler;
  if(logout) logout.onclick=signOutAndReload;
  if(topLogout) setTopAuthButtonMode(topLogout.dataset.authMode || (knownUser() ? "logout" : "login"));
}

window.__szzSetAuthState=showAuthState;
window.__szzShowStartupChecking=(message="Kontroluji přihlášení...")=>showAuthState("checking",{message,intro:"Kontroluji přihlášení..."});
window.__szzShowAuthenticatedApp=(message="")=>showAuthState("logged-in",{message});
window.__szzGetAuthState=()=>({...authUiState});
window.__startCompatGoogleLoginFallback=startCompatGoogleLoginFallback;
window.szzEmergencyEmailLogin=emergencyEmailLogin;
window.loginEmail=emergencyEmailLogin;
window.loginPopup=startLogin;
window.startGoogleLogin=startLogin;
window.startFirebaseGoogleLogin=startGoogleLogin;
window.bindLoginButtons=bindLoginButtons;
window.setTopAuthButtonMode=setTopAuthButtonMode;
window.showStartupLogin=(message="")=>showAuthState("logged-out",{message:message || "",intro:"Přihlas se e-mailem a heslem."});

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
