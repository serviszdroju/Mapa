export const firebaseConfig = {
  apiKey: "AIzaSyDPXDtM0NH0H2p_gT5KsRPyxhCotBTcq88",
  authDomain: "astip---servis.firebaseapp.com",
  projectId: "astip---servis",
  storageBucket: "astip---servis.firebasestorage.app",
  messagingSenderId: "304123957651",
  appId: "1:304123957651:web:3d837eb57957d18b17d866",
  measurementId: "G-EL8BSFYFDN"
};

export const GOOGLE_WEB_CLIENT_ID="304123957651-8nnf5s40h56r63uiqddooioiu7fqh8pk.apps.googleusercontent.com";
export const GOOGLE_IDENTITY_SCRIPT_URL="https://accounts.google.com/gsi/client";
export const AUTH_LOADING="loading";
export const AUTH_LOGGED_IN="logged-in";
export const AUTH_LOGGED_OUT="logged-out";

export const CLOUDINARY_PHOTOS = {
  cloudName:"dnxjc6ixi",
  uploadPreset:"astip_mapy",
  fallbackUploadPresets:[],
  folder:"astip-servis"
};

const AUTH_KNOWN_SIGNED_IN_KEY="astipFirebaseKnownSignedIn";
const AUTH_EXPLICIT_SIGN_OUT_KEY="astipFirebaseExplicitSignOut";
const AUTH_LAST_EMAIL_KEY="astipFirebaseLastEmail";
export const AUTH_RESTORE_GRACE_MS=12000;
export const authBootStartedAt=Date.now();

let compatAuthClient=null;
let compatAuthPersistencePromise=null;
let compatFirebaseAppCache={namespace:null,value:null};
let googleIdentityScriptPromise=null;
const FIREBASE_COMPAT_SCRIPT_URLS=[
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"
];
const firebaseCompatScriptPromiseCache=new Map();

function safeText(value){
  return String(value ?? "").trim();
}

function setTextIfChangedLocal(el,value){
  if(el && el.textContent!==String(value)) el.textContent=String(value);
}

function setDisplayIfChangedLocal(el,value){
  if(el && el.style.display!==value) el.style.display=value;
}

function googleIdentityReady(){
  return !!(
    window.google &&
    window.google.accounts &&
    window.google.accounts.oauth2 &&
    typeof window.google.accounts.oauth2.initTokenClient==="function"
  );
}

export function loadGoogleIdentityServices(){
  if(googleIdentityReady()) return Promise.resolve(window.google);
  if(googleIdentityScriptPromise) return googleIdentityScriptPromise;
  googleIdentityScriptPromise=new Promise((resolve,reject)=>{
    const absolute=new URL(GOOGLE_IDENTITY_SCRIPT_URL,document.baseURI).href;
    const finish=()=>{
      if(googleIdentityReady()) resolve(window.google);
      else reject(new Error("Google přihlášení se nepodařilo načíst."));
    };
    const existing=Array.from(document.scripts).find(script=>script.src===absolute);
    if(existing){
      if(googleIdentityReady() || existing.dataset.loaded==="1" || existing.readyState==="loaded" || existing.readyState==="complete"){
        finish();
        return;
      }
      existing.addEventListener("load",finish,{once:true});
      existing.addEventListener("error",()=>reject(new Error("Google přihlášení se nepodařilo načíst.")),{once:true});
      return;
    }
    const script=document.createElement("script");
    script.src=GOOGLE_IDENTITY_SCRIPT_URL;
    script.async=true;
    script.defer=true;
    script.addEventListener("load",()=>{
      script.dataset.loaded="1";
      finish();
    },{once:true});
    script.addEventListener("error",()=>reject(new Error("Google přihlášení se nepodařilo načíst.")),{once:true});
    document.head.appendChild(script);
  }).catch(error=>{
    googleIdentityScriptPromise=null;
    throw error;
  });
  return googleIdentityScriptPromise;
}

export function knownSignedIn(){
  try{return localStorage.getItem(AUTH_KNOWN_SIGNED_IN_KEY)==="1";}catch(e){return false;}
}

export function lastKnownUserEmail(){
  try{return safeText(localStorage.getItem(AUTH_LAST_EMAIL_KEY)).toLowerCase();}catch(e){return "";}
}

export function explicitSignOutPending(){
  try{return sessionStorage.getItem(AUTH_EXPLICIT_SIGN_OUT_KEY)==="1";}catch(e){return false;}
}

export function markExplicitSignOut(){
  try{sessionStorage.setItem(AUTH_EXPLICIT_SIGN_OUT_KEY,"1");}catch(e){}
}

export function clearExplicitSignOut(){
  try{sessionStorage.removeItem(AUTH_EXPLICIT_SIGN_OUT_KEY);}catch(e){}
}

export function compatFirebaseReady(){
  const compat=window.firebase;
  return !!(compat && compat.initializeApp && compat.auth && compat.firestore);
}

function loadScriptOnce(src){
  const absolute=new URL(src,document.baseURI).href;
  if(firebaseCompatScriptPromiseCache.has(absolute)) return firebaseCompatScriptPromiseCache.get(absolute);
  const promise=new Promise((resolve,reject)=>{
    const existing=Array.from(document.scripts).find(script=>script.src===absolute);
    if(existing){
      if(existing.dataset.loaded==="1" || compatFirebaseReady() || existing.readyState==="loaded" || existing.readyState==="complete"){
        resolve();
        return;
      }
      existing.addEventListener("load",()=>resolve(),{once:true});
      existing.addEventListener("error",()=>reject(new Error("Firebase compat script se nepodařilo načíst: " + src)),{once:true});
      return;
    }
    const script=document.createElement("script");
    script.src=src;
    script.async=false;
    script.defer=true;
    script.dataset.firebaseCompatDynamic="1";
    script.addEventListener("load",()=>{
      script.dataset.loaded="1";
      resolve();
    },{once:true});
    script.addEventListener("error",()=>reject(new Error("Firebase compat script se nepodařilo načíst: " + src)),{once:true});
    document.head.appendChild(script);
  }).catch(error=>{
    firebaseCompatScriptPromiseCache.delete(absolute);
    throw error;
  });
  firebaseCompatScriptPromiseCache.set(absolute,promise);
  return promise;
}

export function loadCompatFirebaseScripts(){
  if(compatFirebaseReady()) return Promise.resolve(window.firebase);
  if(window.__firebaseCompatLoadingPromise) return window.__firebaseCompatLoadingPromise;
  const htmlLoader=window.__loadFirebaseCompatScripts;
  if(typeof htmlLoader==="function" && htmlLoader!==loadCompatFirebaseScripts){
    window.__firebaseCompatLoadingPromise=Promise.resolve(htmlLoader()).then(()=>window.firebase);
    return window.__firebaseCompatLoadingPromise;
  }
  window.__firebaseCompatLoadingPromise=FIREBASE_COMPAT_SCRIPT_URLS
    .reduce((promise,src)=>promise.then(()=>loadScriptOnce(src)),Promise.resolve())
    .then(()=>window.firebase);
  return window.__firebaseCompatLoadingPromise;
}

export function ensureCompatFirebaseApp(){
  const compat=window.firebase;
  if(!compat || !compat.initializeApp) return null;
  if(compatFirebaseAppCache.namespace===compat && compatFirebaseAppCache.value) return compatFirebaseAppCache.value;
  try{
    if((!compat.apps || !compat.apps.length) && window.__firebaseConfig){
      compat.initializeApp(window.__firebaseConfig);
    }
    const value=compat.apps && compat.apps.length ? compat : null;
    if(value) compatFirebaseAppCache={namespace:compat,value};
    return value;
  }catch(e){
    console.warn("Firebase compat aplikace se nepodařila připravit",e);
    return null;
  }
}

export function getCompatAuthClient(){
  if(compatAuthClient) return compatAuthClient;
  const compat=ensureCompatFirebaseApp();
  if(!compat || !compat.auth) return null;
  try{
    compatAuthClient=compat.auth();
    return compatAuthClient;
  }catch(e){
    console.warn("Firebase compat auth se nepodařilo připravit",e);
    return null;
  }
}

export async function ensureCompatAuthPersistence(options={}){
  if(options.load && !compatFirebaseReady()){
    try{ await loadCompatFirebaseScripts(); }catch(e){ console.warn("Firebase compat SDK se nepodařilo donačíst",e); }
  }
  const client=getCompatAuthClient();
  const compat=window.firebase;
  if(!client || !compat || !compat.auth || !compat.auth.Auth) return client;
  try{
    await client.setPersistence(compat.auth.Auth.Persistence.LOCAL);
  }catch(e){
    try{ await client.setPersistence(compat.auth.Auth.Persistence.SESSION); }catch(err){}
  }
  return client;
}

export function primeCompatAuthPersistence(options={}){
  const shouldLoad=!!options.load;
  if(!shouldLoad && !compatFirebaseReady()) return Promise.resolve(getCompatAuthClient());
  if(!compatAuthPersistencePromise || shouldLoad){
    compatAuthPersistencePromise=ensureCompatAuthPersistence({load:shouldLoad}).catch(e=>{
      console.warn("Firebase compat persistence se nepodařila připravit",e);
      return getCompatAuthClient();
    });
  }
  return compatAuthPersistencePromise;
}

export function compatGoogleProvider(){
  const compat=window.firebase;
  if(!compat || !compat.auth || !compat.auth.GoogleAuthProvider) return null;
  const provider=new compat.auth.GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  provider.setCustomParameters({prompt:"select_account",hd:"astip.cz"});
  return provider;
}

export function rememberKnownSignedIn(user=null){
  try{localStorage.setItem(AUTH_KNOWN_SIGNED_IN_KEY,"1");}catch(e){}
  const email=safeText(user && user.email).toLowerCase();
  if(email) try{localStorage.setItem(AUTH_LAST_EMAIL_KEY,email);}catch(e){}
  clearExplicitSignOut();
  try{document.documentElement.classList.add("auth-resume");}catch(e){}
}

export function forgetKnownSignedIn(){
  try{localStorage.removeItem(AUTH_KNOWN_SIGNED_IN_KEY);}catch(e){}
  try{localStorage.removeItem(AUTH_LAST_EMAIL_KEY);}catch(e){}
  try{document.documentElement.classList.remove("auth-resume");}catch(e){}
}

export function setStartupAuthChecking(checking){
  const startup=document.getElementById("startupScreen");
  const btn=document.getElementById("startupLoginBtn");
  const intro=document.getElementById("startupIntro");
  if(startup){
    startup.classList.toggle("auth-checking",!!checking);
    startup.classList.toggle("auth-loading",!!checking);
  }
  setDisplayIfChangedLocal(btn,checking ? "none" : "");
  if(btn){
    btn.disabled=!!checking;
    if(checking) btn.setAttribute("aria-disabled","true");
    else btn.removeAttribute("aria-disabled");
  }
  setTextIfChangedLocal(intro,checking ? "Načítám aplikaci" : "Přihlaste se pro otevření servisní mapy a úprav.");
}

function emailSet(values=[]){
  return new Set((Array.isArray(values) ? values : []).map(email=>safeText(email).toLowerCase()).filter(Boolean));
}

export function createAuthAccessHelpers(options={}){
  const adminEmailSet=emailSet(options.adminEmails);
  const allowedEmailSet=emailSet(options.allowedEmails);
  const protocolHistoryEmailSet=emailSet(options.protocolHistoryEmails);
  const getCurrentUser=typeof options.getCurrentUser==="function" ? options.getCurrentUser : ()=>null;
  const setCurrentUser=typeof options.setCurrentUser==="function" ? options.setCurrentUser : ()=>{};
  const getFirebaseReady=typeof options.getFirebaseReady==="function" ? options.getFirebaseReady : ()=>false;
  const getAuthClient=typeof options.getAuthClient==="function" ? options.getAuthClient : ()=>null;
  const getAuthModule=typeof options.getAuthModule==="function" ? options.getAuthModule : ()=>null;
  const compatAuthGetter=typeof options.getCompatAuthClient==="function" ? options.getCompatAuthClient : getCompatAuthClient;
  const updateInstallButtons=typeof options.updateInstallButtons==="function" ? options.updateInstallButtons : ()=>{};

  function compatAuthCurrentUser(){
    try{
      const client=compatAuthGetter();
      return client && client.currentUser ? client.currentUser : null;
    }catch(e){}
    return null;
  }

  function syncCurrentUserFromCompat(){
    const user=compatAuthCurrentUser();
    if(user) setCurrentUser(user);
    return user;
  }

  function currentUserEmail(){
    const user=getCurrentUser() || syncCurrentUserFromCompat();
    return safeText(user && user.email).toLowerCase() || lastKnownUserEmail();
  }

  function isAllowedLoginEmail(email){
    const normalized=safeText(email).toLowerCase();
    return normalized.endsWith("@astip.cz") || allowedEmailSet.has(normalized);
  }

  function isAppAdmin(){
    const email=currentUserEmail();
    return !!email && adminEmailSet.has(email);
  }

  function canViewProtocolHistory(){
    const email=currentUserEmail();
    if(!email) return false;
    return isAllowedLoginEmail(email) || protocolHistoryEmailSet.has(email);
  }

  function canViewMainProtocolHistory(){
    const email=currentUserEmail();
    if(!email) return false;
    return isAllowedLoginEmail(email) || protocolHistoryEmailSet.has(email);
  }

  function canViewAllMainProtocolHistory(){
    const email=currentUserEmail();
    if(!email) return false;
    return isAppAdmin() || protocolHistoryEmailSet.has(email);
  }

  function updateProtocolHistoryVisibility(){
    const showDetail=canViewProtocolHistory();
    const showMain=canViewMainProtocolHistory();
    document.querySelectorAll(".protocol-history-private").forEach(el=>{
      setDisplayIfChangedLocal(el,showDetail ? "" : "none");
    });
    document.querySelectorAll(".main-protocol-history-private").forEach(el=>{
      setDisplayIfChangedLocal(el,showMain ? "" : "none");
    });
  }

  function updateAdminAppControls(){
    updateProtocolHistoryVisibility();
    updateInstallButtons();
  }

  function waitForFirebaseUser(timeoutMs=8000){
    const authClient=getAuthClient();
    if(!getFirebaseReady() || (!authClient && !compatAuthGetter())) return Promise.resolve(getCurrentUser() || null);
    const existing=getCurrentUser() || syncCurrentUserFromCompat();
    if(existing) return Promise.resolve(existing);
    return new Promise(resolve=>{
      let done=false;
      let unsub=null;
      const finish=user=>{
        if(done) return;
        done=true;
        if(unsub) try{unsub();}catch(e){}
        const nextUser=user || syncCurrentUserFromCompat() || getCurrentUser() || (authClient && authClient.currentUser) || null;
        setCurrentUser(nextUser);
        resolve(nextUser);
      };
      const timer=setTimeout(()=>finish(syncCurrentUserFromCompat() || getCurrentUser() || (authClient && authClient.currentUser) || null),timeoutMs);
      try{
        const compatClient=compatAuthGetter();
        if(compatClient && compatClient.onAuthStateChanged){
          unsub=compatClient.onAuthStateChanged(user=>{
            if(!user && !explicitSignOutPending()) return;
            clearTimeout(timer);
            finish(user || syncCurrentUserFromCompat());
          });
        }else{
          const authModule=getAuthModule();
          unsub=authModule.onAuthStateChanged(authClient,user=>{
            if(!user && !explicitSignOutPending()) return;
            clearTimeout(timer);
            finish(user || syncCurrentUserFromCompat());
          });
        }
      }catch(e){
        clearTimeout(timer);
        finish(syncCurrentUserFromCompat() || getCurrentUser() || (authClient && authClient.currentUser) || null);
      }
    });
  }

  return {
    compatAuthCurrentUser,
    syncCurrentUserFromCompat,
    currentUserEmail,
    isAllowedLoginEmail,
    isAppAdmin,
    canViewProtocolHistory,
    canViewMainProtocolHistory,
    canViewAllMainProtocolHistory,
    updateProtocolHistoryVisibility,
    updateAdminAppControls,
    waitForFirebaseUser
  };
}

window.__loadFirebaseCompatScripts=window.__loadFirebaseCompatScripts || loadCompatFirebaseScripts;
window.rememberKnownSignedIn=rememberKnownSignedIn;
window.forgetKnownSignedIn=forgetKnownSignedIn;
window.lastKnownUserEmail=lastKnownUserEmail;
window.setStartupAuthChecking=setStartupAuthChecking;
window.knownSignedIn=knownSignedIn;
