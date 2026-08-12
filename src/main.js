/* Firebase config vložen níže */
const firebaseConfig = {
  apiKey: "AIzaSyDPXDtM0NH0H2p_gT5KsRPyxhCotBTcq88",
  authDomain: "astip---servis.firebaseapp.com",
  projectId: "astip---servis",
  storageBucket: "astip---servis.firebasestorage.app",
  messagingSenderId: "304123957651",
  appId: "1:304123957651:web:3d837eb57957d18b17d866",
  measurementId: "G-EL8BSFYFDN"
};
window.__firebaseConfig = firebaseConfig;

const CSV_FILE="";
const PUBLIC_CSV_DATA_ENABLED=false;
let firebaseReady = !firebaseConfig.apiKey.includes("VLOZIT");
const firebaseConfigured = firebaseReady;
const CLOUDINARY_PHOTOS = {
  cloudName:"dnxjc6ixi",
  uploadPreset:"astip_mapy",
  fallbackUploadPresets:[],
  folder:"astip-servis"
};
let app, auth, db, mailFunctions=null, mailFunctionsPromise=null, fb={}, currentUser=null;
let rows=[], csvRows=[], originalCsvRows=[], extraSites=[], selectedSite=null, addSourceBaseSite=null, editCache={};
let firebaseUnifiedPrimary = firebaseReady;
let map=null, layer=null;
window.firebaseReady = firebaseReady;
window.__firebaseConfigured = firebaseConfigured;
window.firebaseUnifiedPrimary = firebaseUnifiedPrimary;
window.__firebaseUnifiedPrimary = firebaseUnifiedPrimary;
window.cloudinaryPhotoConfig = CLOUDINARY_PHOTOS;
window.rows = rows;
const AUTH_KNOWN_SIGNED_IN_KEY="astipFirebaseKnownSignedIn";
const AUTH_EXPLICIT_SIGN_OUT_KEY="astipFirebaseExplicitSignOut";
const AUTH_LAST_EMAIL_KEY="astipFirebaseLastEmail";
const AUTH_RESTORE_GRACE_MS=12000;
const authBootStartedAt=Date.now();
function knownSignedIn(){
  try{return localStorage.getItem(AUTH_KNOWN_SIGNED_IN_KEY)==="1";}catch(e){return false;}
}
function lastKnownUserEmail(){
  try{return safe(localStorage.getItem(AUTH_LAST_EMAIL_KEY)).toLowerCase();}catch(e){return "";}
}
function explicitSignOutPending(){
  try{return sessionStorage.getItem(AUTH_EXPLICIT_SIGN_OUT_KEY)==="1";}catch(e){return false;}
}
function markExplicitSignOut(){
  try{sessionStorage.setItem(AUTH_EXPLICIT_SIGN_OUT_KEY,"1");}catch(e){}
}
function clearExplicitSignOut(){
  try{sessionStorage.removeItem(AUTH_EXPLICIT_SIGN_OUT_KEY);}catch(e){}
}
let compatAuthClient=null;
let compatAuthPersistencePromise=null;
let compatFirebaseAppCache={namespace:null,value:null};
const FIREBASE_COMPAT_SCRIPT_URLS=[
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js"
];
const firebaseCompatScriptPromiseCache=new Map();
function compatFirebaseReady(){
  return !!(window.firebase && firebase.initializeApp && firebase.auth && firebase.firestore);
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
function loadCompatFirebaseScripts(){
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
window.__loadFirebaseCompatScripts=window.__loadFirebaseCompatScripts || loadCompatFirebaseScripts;
function ensureCompatFirebaseApp(){
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
function getCompatAuthClient(){
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
async function ensureCompatAuthPersistence(options={}){
  if(options.load && !compatFirebaseReady()){
    try{ await loadCompatFirebaseScripts(); }catch(e){ console.warn("Firebase compat SDK se nepodařilo donačíst",e); }
  }
  const client=getCompatAuthClient();
  if(!client || !window.firebase || !firebase.auth || !firebase.auth.Auth) return client;
  try{
    await client.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }catch(e){
    try{ await client.setPersistence(firebase.auth.Auth.Persistence.SESSION); }catch(err){}
  }
  return client;
}
function primeCompatAuthPersistence(options={}){
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
function compatGoogleProvider(){
  if(!window.firebase || !firebase.auth || !firebase.auth.GoogleAuthProvider) return null;
  const provider=new firebase.auth.GoogleAuthProvider();
  provider.addScope("email");
  provider.addScope("profile");
  provider.setCustomParameters({prompt:"select_account",hd:"astip.cz"});
  return provider;
}
function rememberKnownSignedIn(user=null){
  try{localStorage.setItem(AUTH_KNOWN_SIGNED_IN_KEY,"1");}catch(e){}
  const email=safe(user && user.email).toLowerCase();
  if(email) try{localStorage.setItem(AUTH_LAST_EMAIL_KEY,email);}catch(e){}
  clearExplicitSignOut();
  try{document.documentElement.classList.add("auth-resume");}catch(e){}
}
function forgetKnownSignedIn(){
  try{localStorage.removeItem(AUTH_KNOWN_SIGNED_IN_KEY);}catch(e){}
  try{localStorage.removeItem(AUTH_LAST_EMAIL_KEY);}catch(e){}
  try{document.documentElement.classList.remove("auth-resume");}catch(e){}
}
function setStartupAuthChecking(checking){
  const startup=document.getElementById("startupScreen");
  const btn=document.getElementById("startupLoginBtn");
  const intro=document.getElementById("startupIntro");
  if(startup) startup.classList.toggle("auth-checking",!!checking);
  setDisplayIfChanged(btn,checking ? "none" : "");
  setTextIfChanged(intro,checking ? "Kontroluji přihlášení..." : "Přihlaste se pro otevření servisní mapy a úprav.");
}
window.rememberKnownSignedIn=rememberKnownSignedIn;
window.forgetKnownSignedIn=forgetKnownSignedIn;
window.lastKnownUserEmail=lastKnownUserEmail;
window.setStartupAuthChecking=setStartupAuthChecking;
window.knownSignedIn=knownSignedIn;
const ORIGINAL_PINK_PLACE_SIGNATURES = [
  ["6vrmki",["1e6czpv","cr7vq4","yu2gnx"]],
  ["higs6y",["1j9lg23","nfilqo","1b7yg2j","14kyml8","1aa9uym","1faa9l8"]],
  ["1s03s0l",["1u7m7c8","1g22zp4","w65g5a"]],
  ["1efrdsi",["176i0pa","od9cga","1hh4ahk","10nzhrc","14pohr8"]],
  ["18h2ule",["176i0pa","1lstc6x","1lp6mx5","16mgxvl","zybcnz","y2ofdq"]],
  ["lm0fak",["176i0pa","1l5y5td","iwee0x","1nsvkdj"]],
  ["b51m4l",["lhw3ca","ehkfsp"]],
  ["dy93se",["lhw3ca","1s8tv0v","wivq38","9ygcft","15zb019"]],
  ["1hjlzw1",["lhw3ca","xtqkvi"]],
  ["h8gz3x",["lhw3ca","14g8vl1"]],
  ["9rmeig",["lhw3ca","ezwic3","2yu6tf"]],
  ["2zhzhk",["lhw3ca","1avwabv"]],
  ["4am6y2",["lhw3ca","sb4pit"]],
  ["a7dg1o",["lhw3ca","6rk1oh"]],
  ["w7ljts",["lhw3ca","myg6ry"]],
  ["gavtle",["lhw3ca","10sqgf2"]],
  ["1h724e0",["lhw3ca","1q6slpq","w7toxf","1i7y2b8"]],
  ["yuyqmg",["1l4fkd3","f0x6ue","1w5y23g","hj0i8j","4cuscl","1nliijn"]],
  ["3ygyub",["f6r7xv","j11nzl","d3n3um"]],
  ["1wy8y7l",["wfeom3","16aetmf","a31zoh"]],
  ["1h6jzed",["1k57qej","mj7kgp"]],
  ["4we63n",["1vwvt4s","3ihptp","1rar0hm","10o9acx"]],
  ["19uf2fe",["8tsfs","13n73r4","4dz2ww","1tyauuk"]],
  ["u8zx48",["8tsfs","13n73r4","13p18i2","wsa76l"]],
  ["1bjc8i7",["52sgxi","nzpd32","2grid5","1oekbmc"]],
  ["edil9r",["19eotm","1wra6dj","6rbfzx","rx07jb","1xktyys","1rirt7k","1d7ro4e"]],
  ["flomx7",["1hdn7vg","1hganrp","1xu8g25","1ddi60u"]],
  ["1t5gs8",["fdr91f","af5v5o","8v165","1aovow0"]],
  ["ze38vb",["x42rmd","1c5wgpg","zcszi0"]],
  ["1719v4j",["10mu7op","72t3ir","gtg5hx"]],
  ["1jkul9k",["t7jo1n","af5v5o","awerna","65wfw7","cx2aef"]],
  ["1lko6z7",["x275p4","1in443b","17vdzxo","eiinb"]],
  ["1mm4mm4",["tie0vw","15cbzkf","sgv8lg","v6rih0"]],
  ["1mbmohv",["np884z","1wog1by","1jpvanj"]],
  ["1cwxsub",["1o7hwae","cc0474","3nb4bb"]],
  ["113ke6",["19masxz","vkdgkh","m436rx","lu3l2y"]],
  ["1bjmspd",["19masxz","pwbbjb","1pnmdj5","oscwrf","1mcyjpz"]],
  ["3nazi1",["1veon3y","zv4u8w","hkthcs"]],
  ["is8s17",["z6uabh","oq2eya","1jv24h8"]],
  ["171jmzh",["583z67","1smu937","1h60fkq","14ku3yu","1ff95z3"]],
  ["a81hrh",["x4usxh","11ymqgz","1bwywao","elfvki"]],
  ["19tclqq",["169ur0f","1mtg2ub","1gehror"]],
  ["p2r0or",["169ur0f","8j03r7"]],
  ["pfojsd",["169ur0f","2sq1rg"]],
  ["19o01c6",["6bleu1","af5v5o","1w54qy2","3tk6mr","10dc24q"]],
  ["17kb978",["1boa2rw","1sq0pcb","1c4uwe0","1au2yy9"]],
  ["hbc9tk",["1boa2rw","1hd3mzr"]],
  ["k4ie5p",["1boa2rw","15x4orr","13vwpcg","1gsez7d"]],
  ["12cmhj1",["1boa2rw","4cjpu8"]],
  ["626ggt",["yc1wgi","s6ky9g"]],
  ["1fzswca",["1dr35gp","j10qav","i0tgik","3lo2u3"]],
  ["b16fwv",["ks4ha","14lc1of","56h7bg"]],
  ["1b9nk9v",["yhjxbb","j781kc","y4flug","1iekoig","9v0mz7","1m2yy10"]],
  ["m1zx9i",["2tdlaj","3ysiw2","1987r0f","18e8xxi"]],
  ["1qg0w9r",["2tdlaj","3ysiw2","18o8jmh","17u9qjk"]],
  ["59o2s",["nmic5s","19hwwhd","rkryn1","18gt4ix"]],
  ["1y1o8n1",["1qg1jpq","1mx48wc","1cku7mf"]],
  ["2t6ryi",["1qg1jpq","18klsyp","19k21tn","1pj9dj2"]],
  ["13dfsrn",["1qg1jpq","13vjk9e"]],
  ["zfggna",["qqyvyr","1s5b7tk","18bqfj4","1pkj6of","10ayd74"]],
  ["15flziq",["taf3cp","af5v5o","t99sum","tth9ht","1y8gvq5","1nb1hqp"]],
  ["187yc68",["1atpxi5","1hvljlw"]],
  ["1jsvvg0",["1atpxi5","fzcife","1rnewwu","1diwk9p"]],
  ["1tovic5",["1atpxi5","oyisx1","iarna","1s9y1ty","emyv0h"]],
  ["1uyjn1r",["1atpxi5","1ysu37f"]],
  ["25gy73",["1atpxi5","1hcq5pd","1e44sy1","9rpksm"]],
  ["1i3hb5p",["1atpxi5","wuhtnk","16no619","1n2kfoz","i0tstb"]],
  ["mgb5z9",["1atpxi5","bm8oi3","1k7n7e9","1b834te","bcqho"]],
  ["e3dzgl",["1atpxi5","1ccgwrb","yu2gnx"]],
  ["v11sz2",["1atpxi5","1r2ulbu"]],
  ["3tql97",["1atpxi5","1fuw726"]],
  ["502vi3",["1atpxi5","1lml086","e9x7dy","10mx5gy","wwp5vg"]],
  ["mf2o2t",["1atpxi5","1lml086","izk56j","10mx5gy","wwp5vg"]],
  ["jttefr",["1atpxi5","1k79mk6","16617g6","179d3gw"]],
  ["19669yg",["1atpxi5","1gevc2r"]],
  ["1d06c24",["1atpxi5","4hkefu","yv2vks","1wog1by","billhk"]],
  ["8r5zw4",["1atpxi5","508upz","553fn7"]],
  ["1frn4g0",["1atpxi5","sggs01","osvryw","1gouza0"]],
  ["1krnsn6",["1atpxi5","ah6gry"]],
  ["ol88fc",["1atpxi5","1ur02ay","euzlyi"]],
  ["ldaybi",["1atpxi5","taf3cp","byipny"]],
  ["39621j",["1atpxi5","zwg0bi","1ndbn4f"]],
  ["1j6vl7y",["1atpxi5","af5v5o","1quojj7"]],
  ["1j8gzq6",["1atpxi5","9cp1m9"]],
  ["yng5ta",["1atpxi5","ccd3qy","yu2gnx","1tlcmtv","gj5lef"]],
  ["jpb6d7",["1atpxi5","1fmu9ut","xbj2dt","f3w0gv","10mx5gy","wwp5vg"]],
  ["stou4z",["1atpxi5","1f0ig44","1fzvyv7"]],
  ["liw9gm",["1atpxi5","1x0vjcv","yu2gnx"]],
  ["mjnncs",["1atpxi5","e6zsgv","nmetue"]],
  ["1fjmozl",["1atpxi5","dtplis","ebdrgo"]],
  ["1mxg13j",["1atpxi5","fr1m2v","1xzrbod","e1k0pi"]],
  ["1mthen3",["1atpxi5","1n4vjcb"]],
  ["l71hwi",["1atpxi5","12rt4bu","1du6z5e","hqxnnk"]],
  ["114c8sm",["1atpxi5","10mx5gy","1jhus6u","1lml086","1f6mnn7","1fmu9ut","xbj2dt","1ewn1y8","1j2h3ct","1ishhnu"]],
  ["fiq4hb",["1atpxi5","1xjjm43","1ms7fpk","1s986n3","yu2gnx"]],
  ["11s8dek",["1atpxi5","1lljptl","h30xl8","1bqndnf","10ayd74","m12k7"]],
  ["1gltufv",["1mwy3ml","18klsyp"]],
  ["9yi602",["vaqzh7","ojv55g"]],
  ["1iate7r",["mvkhd7","hm1nmo","3go7xx","13lvowj","186wwln"]],
  ["1mgwp",["1cqfti6","fkxzq","75bjuj","rkryn1"]],
  ["lthffx",["1pyczks","p6t4lu","4m7eaj"]],
  ["axwpn",["1b53jar","1ofk8k4","mlr1h0","14xq0oz","j6bit9","1aeum0w","1plyc2m"]],
  ["sydbyw",["1jhk2p0","ikunwf","1jztqk9"]],
  ["1hxhtzk",["xesj0l","cx2aef","1ibm8mx","1e0f8io"]],
  ["132n0uf",["1m5olmv","1a1z82d"]],
  ["cngtbf",["13byjt8","nzpd32","1ewdlsk","17a7dnn","1ksj7ug","zv7yst"]],
  ["bsat19",["xg1nmt","hhg0ej","153d5we","io9x11","10vk0pg"]],
  ["1xuht7a",["h7xn2z","1vii903","1r1oe1n","qbhib7"]],
  ["1ft45aa",["1jij3ac","1vl06rf","1q09z76"]],
  ["zjds1p",["rietxk","1yv7jrw","17cvsnz","1i05jnl","ovs0ti","1keqkdf"]],
  ["1k4c8q1",["rietxk","17cvsnz","1sfacrc"]],
  ["60wkg7",["1jj252e","lqbnc0","jtc860","cg20tx","gmu7wx"]],
  ["scd46t",["1lz3k94","3tk6mr","10dc24q"]],
];

const MAP_TILE_URL_TEMPLATE="https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const MAP_TILE_CACHE_NAME="astip-szz-map-tiles-v1";
const APP_BUILD_VERSION="2026-08-12-cache-protocol-panel-nodes-v306";
const SZZ_OFFLINE_READY_KEY="astipSzzOfflineReady:v1";
const SZZ_OFFLINE_DETAIL_META_KEY="astipSzzOfflineDetailMeta:v1";
const SZZ_FIREBASE_SITE_CACHE_KEY="astipFirebaseSitesMapCacheV2";
const SZZ_OFFLINE_INCREMENTAL_SAFETY_MS=10000;
const CZECH_OFFLINE_TILE_VERSION="cz-v1-z6-11";
const CZECH_OFFLINE_DONE_KEY="astipCzechOfflineMapVersion";
const CZECH_OFFLINE_BOUNDS={west:12.05,south:48.45,east:18.95,north:51.15};
const CZECH_OFFLINE_ZOOMS=[6,7,8,9,10,11];
const APP_SHELL_URLS=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw.js",
  "./szz-logo-display.png",
  "./szz-app-icon-192.png",
  "./szz-app-icon-512.png",
  "./szz-app-icon-maskable-192.png",
  "./szz-app-icon-maskable-512.png",
  "./podpis-tipek.png",
  "./podpis-tipek.jpg",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];
const SZZ_STORAGE_META_CACHE_MS=5000;
let szzStorageEstimateCache=null;
let szzStorageEstimateCacheAt=0;
let szzPersistentStorageCache=null;
let szzPersistentStorageCacheAt=0;

function currentAppShellUrls(baseUrls=APP_SHELL_URLS){
  const urls=[...(baseUrls || [])];
  try{
    document.querySelectorAll('script[src],link[rel="stylesheet"][href],link[rel="modulepreload"][href],link[rel="preload"][href],link[rel="manifest"][href],link[rel~="icon"][href],link[rel="apple-touch-icon"][href]').forEach(el=>{
      if(el.rel==="preload" && !["script","style","fetch"].includes(el.as || "")) return;
      const url=el.src || el.href;
      if(url) urls.push(url);
    });
  }catch(e){}
  try{
    if(performance && typeof performance.getEntriesByType==="function"){
      performance.getEntriesByType("resource").forEach(entry=>{
        const url=entry && entry.name;
        if(isSzzAppShellResourceUrl(url)) urls.push(url);
      });
    }
  }catch(e){}
  return urls
    .map(normalizeSzzAppShellUrl)
    .filter((url,idx,arr)=>url && arr.indexOf(url)===idx);
}

function normalizeSzzAppShellUrl(url){
  try{
    const absolute=new URL(url,document.baseURI);
    if(!/^https?:$/.test(absolute.protocol)) return "";
    return absolute.href;
  }catch(e){
    return "";
  }
}

function isSzzAppShellResourceUrl(url){
  try{
    const absolute=new URL(url,document.baseURI);
    const path=absolute.pathname;
    if(absolute.origin===location.origin){
      return path.includes("/assets/") ||
        /\/(index\.html|app\.css|late\.js|manifest\.webmanifest|sw\.js|szz-icon(?:-\d+)?\.png|szz-app-icon(?:-maskable)?-\d+\.png|szz-logo(?:-display)?\.png|podpis-tipek\.(?:png|jpg))$/.test(path);
    }
    return absolute.hostname==="unpkg.com" &&
      /^\/leaflet@1\.9\.4\/dist\/leaflet\.(?:css|js)$/.test(path);
  }catch(e){
    return false;
  }
}

function postAppShellUrlsToServiceWorker(registration,urls){
  const worker=(navigator.serviceWorker && navigator.serviceWorker.controller) ||
    (registration && (registration.active || registration.waiting || registration.installing));
  if(!worker || !urls.length) return Promise.resolve(urls.length);
  if(typeof MessageChannel==="undefined"){
    try{ worker.postMessage({type:"SZZ_CACHE_APP_SHELL",urls}); }catch(e){}
    return Promise.resolve(urls.length);
  }
  return new Promise(resolve=>{
    const channel=new MessageChannel();
    const timer=setTimeout(()=>resolve(urls.length),3500);
    channel.port1.onmessage=event=>{
      clearTimeout(timer);
      const count=Number(event && event.data && event.data.count);
      resolve(Number.isFinite(count) && count>=0 ? count : urls.length);
    };
    try{
      worker.postMessage({type:"SZZ_CACHE_APP_SHELL",urls},[channel.port2]);
    }catch(e){
      clearTimeout(timer);
      resolve(urls.length);
    }
  });
}

const APP_SHELL_POST_CACHE_MS=30000;
let appShellPostCache={signature:"",savedAt:0,count:null,promise:null};
function cachedPostAppShellUrlsToServiceWorker(registration,urls){
  const signature=(urls || []).join("\n");
  const now=Date.now();
  if(
    signature
    && appShellPostCache.signature===signature
    && now-appShellPostCache.savedAt<APP_SHELL_POST_CACHE_MS
  ){
    if(appShellPostCache.promise) return appShellPostCache.promise;
    if(Number.isFinite(appShellPostCache.count)) return Promise.resolve(appShellPostCache.count);
  }
  const promise=postAppShellUrlsToServiceWorker(registration,urls).then(count=>{
    appShellPostCache={signature,savedAt:Date.now(),count:Number(count) || 0,promise:null};
    return appShellPostCache.count;
  });
  appShellPostCache={signature,savedAt:now,count:null,promise};
  return promise;
}

function showAppShellFast(message=""){
  if(window.__szzFastShellShown) return;
  window.__szzFastShellShown=true;
  window.__mapAppUnlocked=true;
  try{ if(window.setStartupAuthChecking) window.setStartupAuthChecking(false); }catch(e){}
  const startup=document.getElementById("startupScreen");
  const appEl=document.getElementById("mainApp");
  const loginRow=document.getElementById("mainLoginRow");
  const topLogout=document.getElementById("topLogoutBtn");
  const progress=document.getElementById("progress");
  setDisplayIfChanged(startup,"none");
  setDisplayIfChanged(appEl,"grid");
  setDisplayIfChanged(loginRow,"none");
  setDisplayIfChanged(topLogout,"block");
  if(message) setTextIfChanged(progress,message);
}

function loadOfflineRowsFromLocalCacheWhenAvailable(message="",timeoutMs=8000){
  if(window.__szzOfflineBootCacheLoadStarted) return;
  window.__szzOfflineBootCacheLoadStarted=true;
  const started=Date.now();
  const progress=document.getElementById("progress");
  const run=()=>{
    const directLoader=window.showFirebaseMapRowsCache;
    const unifiedLoader=window.loadFirebaseSitesUnified;
    const done=loadedRows=>{
      const count=Array.isArray(loadedRows) ? loadedRows.length : 0;
      setTextIfChanged(progress,count
        ? `Offline režim. Načteno ${count} bodů z telefonu.`
        : (message || "Offline režim. Uložená data zatím nejsou v tomto zařízení připravená."));
    };
    if(typeof directLoader==="function"){
      Promise.resolve(directLoader(null,{offlineBoot:true})).then(done).catch(e=>console.warn("Offline cache bodů se nepodařila načíst",e));
      return;
    }
    if(typeof unifiedLoader==="function"){
      Promise.resolve(unifiedLoader(null,{offlineCacheOnly:true,skipFirestoreCache:true})).then(done).catch(e=>console.warn("Offline cache bodů se nepodařila načíst",e));
      return;
    }
    if(Date.now()-started<timeoutMs){
      setTimeout(run,150);
      return;
    }
    setTextIfChanged(progress,message || "Offline režim. Uložená data zatím nejsou v tomto zařízení připravená.");
  };
  if(message) setTextIfChanged(progress,message);
  run();
}
window.loadOfflineRowsFromLocalCacheWhenAvailable=loadOfflineRowsFromLocalCacheWhenAvailable;

function runAfterPaint(fn){
  requestAnimationFrame(()=>{
    try{ fn(); }catch(e){}
  });
}

function runAfterTwoPaints(fn){
  requestAnimationFrame(()=>runAfterPaint(fn));
}

function runWhenIdle(fn,timeout=1000){
  const run=()=>{
    Promise.resolve()
      .then(fn)
      .catch(e=>console.warn("Odložená úloha selhala",e));
  };
  if(typeof requestIdleCallback==="function"){
    requestIdleCallback(run,{timeout});
  }else{
    runAfterTwoPaints(run);
  }
}

function invalidateMapAfterPaint(){
  runAfterPaint(()=>{ if(window.map) window.map.invalidateSize(true); });
  runAfterTwoPaints(()=>{ if(window.map) window.map.invalidateSize(true); });
}

function initMapShell(){
  if(window.map && window.map.invalidateSize && window.L){
    map=window.map;
    if(!layer) layer=L.layerGroup().addTo(map);
    return map;
  }
  if(!window.L){
    runAfterPaint(initMapShell);
    return null;
  }
  showAppShellFast("Připravuji mapu. Servisní data se načtou po přihlášení.");
  window.map=L.map("map").setView([49.9,15.5],7);
  map=window.map;
  L.tileLayer(MAP_TILE_URL_TEMPLATE,{maxZoom:19,attribution:"&copy; OpenStreetMap"}).addTo(map);
  layer=L.layerGroup().addTo(map);
  invalidateMapAfterPaint();
  return map;
}

showAppShellFast("Připravuji mapu. Servisní data se načtou po přihlášení.");
initMapShell();
window.cacheAppShellForOffline=cacheAppShellForOffline;

async function ensureMailFunctions(){
  if(!firebaseReady || !app) return false;
  if(fb.fnMod && mailFunctions) return true;
  if(!mailFunctionsPromise){
    mailFunctionsPromise=(async()=>{
      try{
        const fnMod=await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js");
        fb.fnMod=fnMod;
        mailFunctions=fnMod.getFunctions(app,"europe-west1");
        window.mailFunctions=mailFunctions;
        return true;
      }catch(e){
        console.warn("Firebase Functions se nepodařilo připravit",e);
        return false;
      }
    })();
  }
  const ready=await mailFunctionsPromise;
  if(!ready) mailFunctionsPromise=null;
  return ready;
}

window.addEventListener("load",()=>{
  if(!firebaseReady){
    const st=document.getElementById("startupStatus");
    const message=firebaseConfigured
      ? "Firebase se zatím nepodařilo načíst. Servisní data se z bezpečnostních důvodů načtou až po přihlášení."
      : "Firebase není nastavený – servisní data nejsou v této veřejné verzi dostupná.";
    setTextIfChanged(st,message);
    const box=document.getElementById("firebaseBox");
    if(box){
      setDisplayIfChanged(box,"block");
      setClassNameIfChanged(box,firebaseConfigured ? "notice" : "notice err");
      setTextIfChanged(box,message);
    }
    runAfterTwoPaints(()=>showApp());
  }
});


if(firebaseReady){
  let appMod=null;
  let authMod=null;
  let fsMod=null;
  try{
    [appMod,authMod,fsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
    ]);
  }catch(e){
    console.warn("Firebase modulární knihovny nejsou dostupné, zkouším záložní režim",e);
    const compatAvailable=!!(ensureCompatFirebaseApp() && window.firebase && firebase.auth);
    if(compatAvailable){
      firebaseReady=true;
      firebaseUnifiedPrimary=true;
      window.firebaseReady=true;
      window.firebaseUnifiedPrimary=true;
      window.__firebaseUnifiedPrimary=true;
      const box=document.getElementById("firebaseBox");
      if(box){
        setDisplayIfChanged(box,"block");
        setClassNameIfChanged(box,"notice");
        setTextIfChanged(box,"Firebase běží v záložním režimu. Pro úpravy se přihlaš tlačítkem Přihlásit technika.");
      }
    }else{
      firebaseReady=false;
      firebaseUnifiedPrimary=false;
      window.firebaseReady=false;
      window.firebaseUnifiedPrimary=false;
      window.__firebaseUnifiedPrimary=false;
      const box=document.getElementById("firebaseBox");
      if(box){
        setDisplayIfChanged(box,"block");
        setClassNameIfChanged(box,"notice err");
        setTextIfChanged(box,"Firebase knihovny se nepodařilo načíst. Přihlášení zatím není dostupné a veřejný CSV export už není součástí produkčního webu.");
      }
    }
    const st=document.getElementById("startupStatus");
    setTextIfChanged(st,compatAvailable
      ? "Firebase modul se načetl v záložním režimu. Otevírám mapu."
      : "Firebase není dostupný. Servisní data se načtou po obnovení přihlášení nebo připojení.");
    runAfterTwoPaints(()=>{
      try{showApp();}catch(err){}
      if(!compatAvailable || navigator.onLine===false){
        loadOfflineRowsFromLocalCacheWhenAvailable("Offline režim. Hledám uložené body, mapu a protokoly v telefonu.");
      }
    });
  }
  if(firebaseReady && appMod && authMod && fsMod){
  fb={appMod,authMod,fsMod,fnMod:null};
  app=appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(firebaseConfig);
  auth=authMod.getAuth(app);
  window.auth=auth;
  try{
    if(authMod.useDeviceLanguage) authMod.useDeviceLanguage(auth);
    else if(auth.useDeviceLanguage) auth.useDeviceLanguage();
  }catch(e){}
  try{
    const persistenceChoices=[
      authMod.indexedDBLocalPersistence,
      authMod.browserLocalPersistence,
      authMod.browserSessionPersistence
    ].filter(Boolean);
    let persistenceSet=false;
    for(const persistence of persistenceChoices){
      try{
        await authMod.setPersistence(auth,persistence);
        persistenceSet=true;
        break;
      }catch(e){
        console.warn("Firebase persistence varianta selhala",e);
      }
    }
    if(!persistenceSet) console.warn("Firebase persistence nejde nastavit");
  }catch(e){
    console.warn("Firebase persistence nejde nastavit",e);
  }
  try{
    if(fsMod.initializeFirestore && fsMod.persistentLocalCache){
      const cacheOptions={};
      if(fsMod.persistentMultipleTabManager) cacheOptions.tabManager=fsMod.persistentMultipleTabManager();
      db=fsMod.initializeFirestore(app,{localCache:fsMod.persistentLocalCache(cacheOptions)});
    }else{
      db=fsMod.getFirestore(app);
    }
  }catch(e){
    db=fsMod.getFirestore(app);
  }
  window.fb=fb;
  window.db=db;
  try{ ensureCompatFirebaseApp(); }catch(e){ console.warn("Compat Firebase se nepodařilo inicializovat",e); }
  const firebaseBox=document.getElementById("firebaseBox");
  setDisplayIfChanged(firebaseBox,"none");

  const AUTH_REDIRECT_PENDING_KEY="astipFirebaseRedirectPending";
  let lastAuthMessage="";
  function authPending(){
    try{return safe(sessionStorage.getItem(AUTH_REDIRECT_PENDING_KEY));}catch(e){return "";}
  }
  function setAuthPending(reason="redirect"){
    try{sessionStorage.setItem(AUTH_REDIRECT_PENDING_KEY,reason);}catch(e){}
  }
  function clearAuthPending(){
    try{sessionStorage.removeItem(AUTH_REDIRECT_PENDING_KEY);}catch(e){}
  }
  function setStartupStatus(message){
    lastAuthMessage=message || "";
    const st=document.getElementById("startupStatus");
    setTextIfChanged(st,message || "");
    const appEl=document.getElementById("mainApp");
    const appVisible=!!(appEl && appEl.style.display && appEl.style.display!=="none");
    if(appVisible && typeof setProgressStatus==="function") setProgressStatus(message || "");
  }
  function authErrorText(e){
    const code=safe(e && e.code);
    const message=safe(e && e.message);
    if(/missing initial state|sessionstorage|storage-partitioned/i.test(message)){
      return "Prohlížeč neudržel návrat z Google přihlášení. Zkus tlačítko znovu; pokud se to opakuje, otevři stránku v Android Chromu a povol úložiště/cookies pro tento web.";
    }
    if(code==="auth/unauthorized-domain"){
      const domain=location.hostname || "serviszdroju.github.io";
      return `Doména ${domain} není povolená ve Firebase Authentication > Settings > Authorized domains.`;
    }
    if(code==="auth/operation-not-supported-in-this-environment"){
      return "Firebase přihlášení v tomto prostředí nefunguje. Otevři web přes https://serviszdroju.github.io/Mapa/.";
    }
    if(code==="auth/popup-blocked"){
      return "Prohlížeč zablokoval přihlašovací okno. Povol popup okno pro tento web nebo zkus tlačítko znovu.";
    }
    if(code==="auth/popup-closed-by-user"){
      return "Přihlašovací okno bylo zavřené před dokončením. Zkus tlačítko znovu a vyber účet @astip.cz.";
    }
    if(code==="auth/cancelled-popup-request"){
      return "Přihlášení bylo přerušeno dalším pokusem. Zkus tlačítko znovu.";
    }
    if(code==="auth/network-request-failed"){
      return "Firebase přihlášení nemá spojení. Zkontroluj internet nebo blokování v prohlížeči.";
    }
    if(code==="auth/account-exists-with-different-credential"){
      return "Tento e-mail je ve Firebase vedený pod jiným způsobem přihlášení.";
    }
    return [code,message].filter(Boolean).join(" ") || "Google účet se nepodařilo načíst. Zkus přihlášení znovu.";
  }
  function redirectResolver(){
    return authMod.browserPopupRedirectResolver || undefined;
  }
  function signInWithGooglePopup(provider){
    if(auth && authMod.signInWithPopup){
      const resolver=redirectResolver();
      if(resolver) return authMod.signInWithPopup(auth,provider,resolver);
      return authMod.signInWithPopup(auth,provider);
    }
    const compatClient=getCompatAuthClient();
    if(compatClient && provider && compatClient.signInWithPopup) return compatClient.signInWithPopup(provider);
    return Promise.reject(new Error("Firebase Auth není dostupný."));
  }
  function signInWithGoogleRedirect(provider){
    if(auth && authMod.signInWithRedirect){
      const resolver=redirectResolver();
      if(resolver) return authMod.signInWithRedirect(auth,provider,resolver);
      return authMod.signInWithRedirect(auth,provider);
    }
    const compatClient=getCompatAuthClient();
    if(compatClient && provider && compatClient.signInWithRedirect) return compatClient.signInWithRedirect(provider);
    return Promise.reject(new Error("Firebase Auth není dostupný."));
  }
  async function googleRedirectResultUser(){
    await primeCompatAuthPersistence();
    if(authMod.getRedirectResult && auth){
      try{
        const resolver=redirectResolver();
        const result=resolver ? await authMod.getRedirectResult(auth,resolver) : await authMod.getRedirectResult(auth);
        if(result && result.user) return result.user;
      }catch(e){
        console.warn("Redirect výsledek přihlášení se nepodařilo načíst",e);
      }
    }
    const compatClient=getCompatAuthClient();
    if(compatClient && compatClient.getRedirectResult){
      try{
        const result=await compatClient.getRedirectResult();
        if(result && result.user) return result.user;
      }catch(e){
        console.warn("Compat redirect výsledek přihlášení se nepodařilo načíst",e);
      }
    }
    return currentAuthCandidate();
  }
  function setProgressStatus(message){
    const p=document.getElementById("progress");
    setTextIfChanged(p,message || "");
    const gps=document.getElementById("gpsBox");
    if(gps && message){
      setDisplayIfChanged(gps,"block");
      setClassNameIfChanged(gps,"notice");
      setTextIfChanged(gps,message);
    }else if(gps && !message && gps.className==="notice"){
      setDisplayIfChanged(gps,"none");
      setTextIfChanged(gps,"");
    }
  }
  function googleRedirectProvider(){
    if(authMod && authMod.GoogleAuthProvider){
      const provider=new authMod.GoogleAuthProvider();
      provider.addScope("email");
      provider.addScope("profile");
      provider.setCustomParameters({prompt:"select_account",hd:"astip.cz"});
      return provider;
    }
    const compatProvider=compatGoogleProvider();
    if(compatProvider) return compatProvider;
    return null;
  }
  function setSignedUser(user){
    currentUser=user;
    window.currentUser=user;
    window.__authReadyUser=user;
    const userBox=document.getElementById("userBox");
    setTextIfChanged(userBox,user?`Přihlášen: ${user.email}`:"Nepřihlášeno");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode(user ? "logout" : "login");
    if(typeof updateAdminAppControls==="function") updateAdminAppControls();
  }
  function clearSignedUser(){
    currentUser=null;
    window.currentUser=null;
    window.__authReadyUser=null;
    const userBox=document.getElementById("userBox");
    setTextIfChanged(userBox,"Nepřihlášeno");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    if(typeof updateAdminAppControls==="function") updateAdminAppControls();
  }
  async function startFirebaseRedirectLogin(){
    if(!firebaseReady || (!auth && !getCompatAuthClient())) return;
    clearExplicitSignOut();
    primeCompatAuthPersistence();
    const provider=googleRedirectProvider();
    try{
      clearAuthPending();
      window.__loginRequested=true;
      setStartupStatus("Otevírám Google přihlášení...");
      const activeEmail=String(currentAuthCandidate()?.email || "").toLowerCase();
      if(activeEmail && !isAllowedLoginEmail(activeEmail)){
        setStartupStatus("Otevírám Google přihlášení, vyber účet @astip.cz...");
      }
      const popupResult=await signInWithGooglePopup(provider);
      if(popupResult && popupResult.user){
        await handleAuthorizedUser(popupResult.user);
      }else{
        const restored=await waitForAuthCandidate(5000);
        if(restored) await handleAuthorizedUser(restored);
        else{
          setStartupAuthChecking(false);
          setStartupStatus("Google přihlášení se zavřelo bez dokončení. Zkus tlačítko znovu a vyber účet @astip.cz.");
        }
      }
    }catch(e){
      const code=safe(e && e.code);
      const browserPopupIssue=[
        "auth/popup-blocked",
        "auth/cancelled-popup-request",
        "auth/popup-closed-by-user",
        "auth/operation-not-supported-in-this-environment"
      ].includes(code);
      if(browserPopupIssue){
        try{
          setAuthPending("redirect");
          setStartupAuthChecking(true);
          setStartupStatus("Popup okno nejde otevřít. Přesměrovávám na Google přihlášení...");
          await signInWithGoogleRedirect(provider);
          return;
        }catch(redirectError){
          clearAuthPending();
          setStartupAuthChecking(false);
          setStartupStatus("Přihlášení selhalo: " + authErrorText(redirectError));
          return;
        }
      }
      clearAuthPending();
      setStartupAuthChecking(false);
      setStartupStatus("Přihlášení selhalo: " + authErrorText(e));
    }
  }
  async function signOutFirebase(){
    try{
      markExplicitSignOut();
      forgetKnownSignedIn();
      clearSignedUser();
      const compatClient=getCompatAuthClient();
      await Promise.allSettled([
        compatClient && compatClient.signOut ? compatClient.signOut() : Promise.resolve(),
        auth && authMod.signOut ? authMod.signOut(auth) : Promise.resolve()
      ]);
    }catch(e){
      setStartupStatus("Odhlášení selhalo: " + (e.code || "") + " " + (e.message || e));
    }finally{
      location.reload();
    }
  }
  function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
  }
  let backgroundAuthRetryTimer=null;
  function currentAuthCandidate(){
    return syncCurrentUserFromCompat() || window.__authReadyUser || window.currentUser || (auth && auth.currentUser) || null;
  }
  function appIsOpenOrHasRows(){
    const appEl=document.getElementById("mainApp");
    const visibleApp=!!(appEl && appEl.style.display && appEl.style.display!=="none");
    const resumed=!!(document.documentElement && document.documentElement.classList.contains("auth-resume"));
    const loadedRows=(Array.isArray(rows) && rows.length) || (Array.isArray(window.rows) && window.rows.length);
    return !!(window.__mapAppUnlocked || visibleApp || resumed || loadedRows || window.__firebaseUnifiedRowsLoaded);
  }
  function shouldKeepAppOpenOnAuthNull(){
    return !explicitSignOutPending() && (knownSignedIn() || appIsOpenOrHasRows());
  }
  async function waitForAuthCandidate(timeoutMs=3500){
    const started=Date.now();
    while(Date.now()-started<timeoutMs){
      const user=currentAuthCandidate();
      if(user) return user;
      await delay(250);
    }
    return currentAuthCandidate();
  }
  async function tryRestoreAuthCandidate(timeoutMs=4500){
    await ensureCompatAuthPersistence();
    if(auth && auth.authStateReady){
      await Promise.race([
        auth.authStateReady(),
        delay(timeoutMs)
      ]).catch(()=>{});
    }
    return currentAuthCandidate() || await waitForAuthCandidate(timeoutMs);
  }
  function clearBackgroundAuthRetry(){
    if(backgroundAuthRetryTimer){
      clearTimeout(backgroundAuthRetryTimer);
      backgroundAuthRetryTimer=null;
    }
  }
  function scheduleBackgroundAuthRetry(delayMs=2500){
    if(backgroundAuthRetryTimer || explicitSignOutPending()) return;
    backgroundAuthRetryTimer=setTimeout(async()=>{
      backgroundAuthRetryTimer=null;
      const restored=await tryRestoreAuthCandidate(3500);
      if(restored){
        handleAuthorizedUser(restored);
      }
    },delayMs);
  }
  function keepAppOpenDuringAuthRestore(message){
    if(explicitSignOutPending()) return false;
    setStartupAuthChecking(false);
    try{document.documentElement.classList.add("auth-resume");}catch(e){}
    showApp();
    const topLogoutBtn=document.getElementById("topLogoutBtn");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    setDisplayIfChanged(topLogoutBtn,"block");
    setProgressStatus(message || "Přihlášení se obnovuje na pozadí. Pokud je dostupná lokální Firebase cache, mapa zůstane dočasně otevřená z ní.");
    runWhenIdle(()=>{
      try{
        if(typeof window.loadFirebaseSitesUnified==="function"){
          window.loadFirebaseSitesUnified(null,{offlineCacheOnly:true});
        }
      }catch(e){}
    },700);
    scheduleBackgroundAuthRetry();
    return true;
  }
  async function finishRedirectLoginIfPending(){
    if(!authPending()) return false;
    clearAuthPending();
    try{
      const user=await googleRedirectResultUser() || await tryRestoreAuthCandidate(2500);
      if(user){
        await handleAuthorizedUser(user);
        return true;
      }
    }catch(e){
      console.warn("Obnova přihlášení po starém redirectu selhala",e);
    }
    return false;
  }
  async function waitForFirebaseRowsLoader(timeoutMs=5000){
    const started=Date.now();
    while(typeof window.loadFirebaseSitesUnified!=="function" && Date.now()-started<timeoutMs){
      await delay(100);
    }
    return typeof window.loadFirebaseSitesUnified==="function";
  }
  let postLoginLoadToken=0;
  let postLoginLoadPromise=null;
  async function loadFirebaseRowsAfterAuth(reason="auth"){
    if(postLoginLoadPromise) return postLoginLoadPromise;
    postLoginLoadPromise=loadFirebaseRowsAfterAuthInner(reason).finally(()=>{postLoginLoadPromise=null;});
    return postLoginLoadPromise;
  }
  async function loadFirebaseRowsAfterAuthInner(reason="auth"){
    if(!firebaseUnifiedPrimary) return true;
    const token=++postLoginLoadToken;
    const loaderReady=await waitForFirebaseRowsLoader();
    if(token!==postLoginLoadToken) return false;
    if(!loaderReady){
      setProgressStatus("Firebase načítání bodů ještě není připravené, zkusím to znovu bez obnovení stránky...");
      if(typeof scheduleFirebaseRowsAutoReload==="function") scheduleFirebaseRowsAutoReload(2500);
      return false;
    }
    for(let attempt=1; attempt<=4; attempt++){
      if(Array.isArray(rows) && rows.length){
        resetFirebaseRowsAutoReload();
        setProgressStatus("");
        return true;
      }
      setProgressStatus(`Načítám body z Firebase (${attempt}/4)...`);
      try{
        const loaded=await window.loadFirebaseSitesUnified();
        if(token!==postLoginLoadToken) return false;
        if((Array.isArray(loaded) && loaded.length) || (Array.isArray(rows) && rows.length)){
          resetFirebaseRowsAutoReload();
          setProgressStatus("");
          try{fit();}catch(e){}
          return true;
        }
        const loadError=String(window.__lastFirebaseLoadError || "");
        if(/permission|insufficient/i.test(loadError)){
          setProgressStatus("Chyba načtení z Firebase: " + loadError);
          return false;
        }
      }catch(e){
        console.warn("Načtení Firebase bodů po přihlášení selhalo",e);
      }
      await delay(350 + attempt*250);
    }
    setProgressStatus("Body se zatím nenačetly. Zkouším další načtení na pozadí bez obnovení stránky.");
    if(typeof scheduleFirebaseRowsAutoReload==="function") scheduleFirebaseRowsAutoReload(2500);
    return false;
  }
  async function handleAuthorizedUser(user){
    clearBackgroundAuthRetry();
    clearAuthPending();
    clearExplicitSignOut();
    setSignedUser(user);
    const email=String(user.email || "").toLowerCase();
    if(!isAllowedLoginEmail(email)){
      setStartupStatus("Přihlášení je povoleno jen pro @astip.cz. Přihlášený účet: " + (email || "bez e-mailu"));
      markExplicitSignOut();
      forgetKnownSignedIn();
      const compatClient=getCompatAuthClient();
      await Promise.allSettled([
        compatClient && compatClient.signOut ? compatClient.signOut() : Promise.resolve(),
        auth && authMod.signOut ? authMod.signOut(auth) : Promise.resolve()
      ]);
      clearSignedUser();
      showLogin();
      return;
    }
    rememberKnownSignedIn(user);
    setStartupAuthChecking(false);
    const topLogoutBtn=document.getElementById("topLogoutBtn");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("logout");
    setDisplayIfChanged(topLogoutBtn,"block");
    showApp();
    setProgressStatus("Přihlášení potvrzeno. Načítám body...");
    await loadFirebaseRowsAfterAuth("login");
    if(typeof window.syncOfflineChanges==="function"){
      runWhenIdle(()=>window.syncOfflineChanges({reason:"login",silent:true}),1800);
    }
    if(selectedSite){
      runWhenIdle(()=>{
        try{ window.refreshLoadedDetailTabs?.(selectedSite); }catch(e){}
      },900);
    }
  }
  function handleSignedOut(){
    if(authPending()){
      setStartupAuthChecking(true);
      try{document.documentElement.classList.add("auth-resume");}catch(e){}
      setStartupStatus("Kontroluji přihlášení...");
      finishRedirectLoginIfPending().then(done=>{
        if(done) return;
        const restored=currentAuthCandidate();
        if(restored){
          handleAuthorizedUser(restored);
          return;
        }
        clearAuthPending();
        if(shouldKeepAppOpenOnAuthNull()){
          keepAppOpenDuringAuthRestore("Přihlášení se obnovuje na pozadí. Pokud je dostupná lokální Firebase cache, mapa zůstane dočasně otevřená z ní.");
          return;
        }
        if(!explicitSignOutPending()){
          clearSignedUser();
          keepAppOpenDuringAuthRestore("Přihlášení se nepodařilo obnovit. Mapa zůstává otevřená, pro úpravy klikni na Přihlásit technika.");
          return;
        }
        forgetKnownSignedIn();
        setStartupAuthChecking(false);
        clearSignedUser();
        const topLogoutBtn=document.getElementById("topLogoutBtn");
        setDisplayIfChanged(topLogoutBtn,"none");
        showLogin();
        setStartupStatus("");
      });
      return;
    }
    const knownSession=knownSignedIn() && !explicitSignOutPending();
    if(knownSession && navigator.onLine===false){
      keepAppOpenDuringAuthRestore("Offline režim. Používám lokálně uložené body, protokoly a fotky.");
      return;
    }
    const restoringKnownSession=knownSession && Date.now()-authBootStartedAt<AUTH_RESTORE_GRACE_MS;
    if(restoringKnownSession){
      setStartupAuthChecking(true);
      try{document.documentElement.classList.add("auth-resume");}catch(e){}
      setProgressStatus("Obnovuji přihlášení...");
      setTimeout(()=>{
        const restored=auth.currentUser || window.__authReadyUser || window.currentUser || syncCurrentUserFromCompat();
        if(restored){
          handleAuthorizedUser(restored);
          return;
        }
        if(Date.now()-authBootStartedAt<AUTH_RESTORE_GRACE_MS){
          handleSignedOut();
          return;
        }
        if(Date.now()-authBootStartedAt>=AUTH_RESTORE_GRACE_MS){
          keepAppOpenDuringAuthRestore("Přihlášení se zatím nepodařilo obnovit. Pokud je dostupná lokální Firebase cache, mapa zůstane dočasně otevřená z ní a přihlášení zkusím obnovit na pozadí.");
        }
      },600);
      return;
    }
    if(knownSession || appIsOpenOrHasRows()){
      keepAppOpenDuringAuthRestore("Přihlášení se obnovuje na pozadí. Pokud je dostupná lokální Firebase cache, mapa zůstane dočasně otevřená z ní.");
      return;
    }
    if(explicitSignOutPending()){
      forgetKnownSignedIn();
      setStartupAuthChecking(false);
      clearSignedUser();
      const topLogoutBtn=document.getElementById("topLogoutBtn");
      setDisplayIfChanged(topLogoutBtn,"none");
      showLogin();
      if(lastAuthMessage && lastAuthMessage!=="Kontroluji přihlášení..."){
        setStartupStatus(lastAuthMessage);
      }else{
        setStartupStatus("");
      }
      return;
    }
    clearSignedUser();
    keepAppOpenDuringAuthRestore("Nejsi přihlášený k Firebase. Servisní data se načtou po přihlášení; případná lokální cache se použije jen pro dříve přihlášené zařízení.");
  }

  window.__startFirebaseRedirectLogin=startFirebaseRedirectLogin;
  window.__signOutFirebase=signOutFirebase;
  window.startGoogleLogin=startFirebaseRedirectLogin;
  window.loginPopup=startFirebaseRedirectLogin;
  if(typeof window.bindLoginButtons==="function") window.bindLoginButtons();

  try{
    setStartupStatus("Kontroluji přihlášení...");
    await primeCompatAuthPersistence();
    if(authPending()){
      await finishRedirectLoginIfPending();
    }else{
      const restored=await googleRedirectResultUser() || await tryRestoreAuthCandidate(2500);
      if(restored) setSignedUser(restored);
    }
  }catch(e){
    clearAuthPending();
    setStartupStatus("Chyba kontroly přihlášení: " + authErrorText(e));
  }

  let modularAuthListenerBound=false;
  if(auth && authMod.onAuthStateChanged){
    authMod.onAuthStateChanged(auth,user=>{
      if(user) handleAuthorizedUser(user);
      else handleSignedOut();
    });
    modularAuthListenerBound=true;
  }
  const compatAuthForListener=await primeCompatAuthPersistence();
  if(compatAuthForListener && compatAuthForListener.onAuthStateChanged){
    compatAuthForListener.onAuthStateChanged(user=>{
      if(user) handleAuthorizedUser(user);
      else if(!modularAuthListenerBound) handleSignedOut();
    });
  }
  if(!modularAuthListenerBound){
    console.warn("Modulární Firebase Auth listener není dostupný; používám pouze záložní compat listener.");
  }
  }
}

function setOfflineMapStatus(message="",state="info"){
  const el=document.getElementById("offlineMapStatus");
  if(!el) return;
  setDisplayIfChanged(el,message ? "block" : "none");
  setClassNameIfChanged(el,`notice offline-map-status ${state==="error" ? "err" : state==="ok" ? "ok" : ""}`.trim());
  setTextIfChanged(el,message);
}

function setOfflineMapButtonState(busy=false,text="Stáhnout mapu do telefonu"){
  const button=document.getElementById("cacheMapTilesBtn");
  if(!button) return;
  if(czechOfflineMapReady()){
    setDisplayIfChanged(button,"none");
    setDisabledIfChanged(button,false);
    setTextIfChanged(button,"Mapa je uložená");
    return;
  }
  setDisplayIfChanged(button,"");
  setDisabledIfChanged(button,busy);
  setTextIfChanged(button,text);
}

async function cachedAppShellCountIfCurrent(signature){
  try{
    const ready=readSzzOfflineReadyState();
    const count=Number(ready && ready.shellCount);
    if(
      ready.appBuildVersion!==APP_BUILD_VERSION ||
      ready.appShellSignature!==signature ||
      !Number.isFinite(count) ||
      count<=0 ||
      !("caches" in window)
    ){
      return 0;
    }
    const cachedShell=
      await caches.match(new URL("./index.html",document.baseURI).href) ||
      await caches.match(new URL("./sw.js",document.baseURI).href) ||
      await caches.match("./");
    return cachedShell ? count : 0;
  }catch(e){
    return 0;
  }
}

async function cacheAppShellForOffline(options={}){
  if(!("serviceWorker" in navigator)) return 0;
  try{
    const registration=window.registerSzzServiceWorker
      ? await window.registerSzzServiceWorker()
      : await navigator.serviceWorker.register("./sw.js");
    await navigator.serviceWorker.ready;
    const urls=currentAppShellUrls();
    const signature=urls.join("\n");
    const reusable=options.force===true ? 0 : await cachedAppShellCountIfCurrent(signature);
    if(reusable) return reusable;
    const count=await cachedPostAppShellUrlsToServiceWorker(registration,urls);
    writeSzzOfflineReadyState({
      appBuildVersion:APP_BUILD_VERSION,
      appShellSignature:signature,
      shellCachedAt:new Date().toISOString(),
      shellCount:count
    });
    return count;
  }catch(e){
    console.warn("Service worker pro offline aplikaci se nepodařilo připravit",e);
    return 0;
  }
}

function szzBytesLabel(value){
  const bytes=Number(value) || 0;
  if(!bytes) return "";
  if(bytes<1024) return `${bytes} B`;
  if(bytes<1048576) return `${Math.round(bytes/1024)} kB`;
  if(bytes<1073741824) return `${Math.round(bytes/104857.6)/10} MB`;
  return `${Math.round(bytes/107374182.4)/10} GB`;
}

async function szzStorageEstimate(){
  if(!navigator.storage || typeof navigator.storage.estimate!=="function") return null;
  const now=Date.now();
  if(szzStorageEstimateCache && now-szzStorageEstimateCacheAt<SZZ_STORAGE_META_CACHE_MS){
    return {...szzStorageEstimateCache};
  }
  try{
    const estimate=await navigator.storage.estimate();
    const next={
      usage:Number(estimate && estimate.usage) || 0,
      quota:Number(estimate && estimate.quota) || 0
    };
    szzStorageEstimateCache=next;
    szzStorageEstimateCacheAt=Date.now();
    return {...next};
  }catch(e){
    return null;
  }
}

async function requestSzzPersistentStorage(options={}){
  const request=!!(options && options.request);
  const now=Date.now();
  if(!request && szzPersistentStorageCache && now-szzPersistentStorageCacheAt<SZZ_STORAGE_META_CACHE_MS){
    return {...szzPersistentStorageCache};
  }
  const result={supported:false,persisted:false,requested:false,granted:false};
  if(!navigator.storage) return result;
  result.supported=typeof navigator.storage.persisted==="function" || typeof navigator.storage.persist==="function";
  try{
    if(typeof navigator.storage.persisted==="function"){
      result.persisted=await navigator.storage.persisted();
    }
    if(!result.persisted && options.request && typeof navigator.storage.persist==="function"){
      result.requested=true;
      result.granted=await navigator.storage.persist();
      result.persisted=result.granted || (typeof navigator.storage.persisted==="function" ? await navigator.storage.persisted() : false);
    }
  }catch(e){
    result.error=e && (e.message || e.code) || String(e);
  }
  szzPersistentStorageCache={...result};
  szzPersistentStorageCacheAt=Date.now();
  return result;
}
window.requestSzzPersistentStorage=requestSzzPersistentStorage;

const SZZ_FIREBASE_SITE_COUNT_CACHE_MS=1800;
let szzCachedFirebaseSiteCountCache={raw:null,count:0,savedAt:0};
window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_FIREBASE_SITE_CACHE_KEY){
    szzCachedFirebaseSiteCountCache={raw:null,count:0,savedAt:0};
  }
});
function readCachedFirebaseSiteCount(){
  try{
    const raw=localStorage.getItem(SZZ_FIREBASE_SITE_CACHE_KEY) || "";
    if(szzCachedFirebaseSiteCountCache.raw===raw && Date.now()-szzCachedFirebaseSiteCountCache.savedAt<SZZ_FIREBASE_SITE_COUNT_CACHE_MS){
      return szzCachedFirebaseSiteCountCache.count;
    }
    const parsed=JSON.parse(raw || "null");
    const count=Number(parsed && parsed.count);
    if(Number.isFinite(count) && count>0){
      szzCachedFirebaseSiteCountCache={raw,count,savedAt:Date.now()};
      return count;
    }
    const items=Array.isArray(parsed && parsed.items) ? parsed.items : [];
    const fallbackCount=items.filter(item=>item && item.docId && item.raw).length;
    szzCachedFirebaseSiteCountCache={raw,count:fallbackCount,savedAt:Date.now()};
    return fallbackCount;
  }catch(e){
    return 0;
  }
}

let firebaseRowsForOfflineCache={source:null,length:-1,indexVersion:-1,rows:[]};
function firebaseRowsForOffline(source=null){
  const currentRows=Array.isArray(source) ? source : (Array.isArray(window.rows) ? window.rows : rows);
  const current=Array.isArray(currentRows) ? currentRows : [];
  const indexVersion=current===rows ? rowsIndexVersion : -1;
  if(
    firebaseRowsForOfflineCache.source===current &&
    firebaseRowsForOfflineCache.length===current.length &&
    firebaseRowsForOfflineCache.indexVersion===indexVersion
  ){
    return firebaseRowsForOfflineCache.rows;
  }
  const firebaseRows=current.filter(row=>row && (row.firebaseDocId || (row.raw && row.raw["Firebase_doc_id"])));
  firebaseRowsForOfflineCache={source:current,length:current.length,indexVersion,rows:firebaseRows};
  return firebaseRows;
}

function saveFirebaseRowsCacheForRows(source=null){
  const firebaseRows=firebaseRowsForOffline(source);
  if(firebaseRows.length && typeof window.saveFirebaseMapRowsCache==="function"){
    try{ window.saveFirebaseMapRowsCache(firebaseRows); }catch(e){}
  }
  return firebaseRows.length || readCachedFirebaseSiteCount();
}

function cacheCurrentFirebaseRowsForOffline(){
  return saveFirebaseRowsCacheForRows();
}

const SZZ_OFFLINE_DETAIL_PREFETCH_CONCURRENCY=3;
const SZZ_OFFLINE_MEDIA_FETCH_CONCURRENCY=4;
const SZZ_RUNTIME_CACHE_NAME="astip-szz-v306-runtime";

let szzOfflineRowsForPrefetchCache={source:null,length:-1,indexVersion:-1,rows:[]};
function szzOfflineRowsForPrefetch(inputRows=null){
  const source=Array.isArray(inputRows) && inputRows.length ? inputRows : (Array.isArray(window.rows) ? window.rows : rows);
  const current=Array.isArray(source) ? source : [];
  const indexVersion=current===rows ? rowsIndexVersion : -1;
  if(
    szzOfflineRowsForPrefetchCache.source===current &&
    szzOfflineRowsForPrefetchCache.length===current.length &&
    szzOfflineRowsForPrefetchCache.indexVersion===indexVersion
  ){
    return szzOfflineRowsForPrefetchCache.rows;
  }
  const seen=new Set();
  const prefetchRows=current.filter(row=>{
    const id=safe(row && (row.firebaseDocId || row.raw?.["Firebase_doc_id"] || row.id));
    if(!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  szzOfflineRowsForPrefetchCache={source:current,length:current.length,indexVersion,rows:prefetchRows};
  return prefetchRows;
}

function szzEmbeddedItemsForOffline(site,field,typeLabel,collectionLabel,idPrefix){
  const items=Array.isArray(site?.firebaseData?.[field]) ? site.firebaseData[field] : [];
  return items.map((item,idx)=>({
    ...item,
    _type:item?._type || typeLabel || "",
    _collection:item?._collection || collectionLabel || field,
    _id:item?._id || `${idPrefix || field}_${idx}`
  }));
}

function szzOfflinePhotoUrls(items=[]){
  const urls=[];
  const seen=new Set();
  (Array.isArray(items) ? items : []).forEach(item=>{
    try{
      [photoDisplayUrl(item),photoThumbUrl(item),photoFullUrl(item)].forEach(url=>{
        const clean=safe(url);
        if(clean && /^https?:\/\//i.test(clean) && !seen.has(clean)){
          seen.add(clean);
          urls.push(clean);
        }
      });
    }catch(e){}
  });
  return urls;
}

async function cacheSzzOfflineMediaUrls(urls=[]){
  if(!("caches" in window)) return 0;
  const seen=new Set();
  const unique=[];
  (Array.isArray(urls) ? urls : []).forEach(url=>{
    const clean=safe(url);
    if(clean && /^https?:\/\//i.test(clean) && !seen.has(clean)){
      seen.add(clean);
      unique.push(clean);
    }
  });
  if(!unique.length) return 0;
  const cache=await caches.open(SZZ_RUNTIME_CACHE_NAME);
  let done=0;
  let index=0;
  const sameOrigin=url=>{
    try{return new URL(url,location.href).origin===location.origin;}catch(e){return false;}
  };
  const worker=async()=>{
    while(index<unique.length){
      const url=unique[index++];
      try{
        const local=sameOrigin(url);
        const request=new Request(url,{
          cache:"reload",
          mode:local ? "same-origin" : "no-cors",
          credentials:local ? "same-origin" : "omit"
        });
        const cached=await cache.match(request) || await cache.match(url);
        if(cached){
          done++;
          continue;
        }
        const response=await fetch(request);
        if(response && (response.ok || response.type==="opaque")){
          await cache.put(request,response.clone());
          done++;
        }
      }catch(e){
        console.warn("Offline media cache: soubor se nepodařilo uložit",url,e);
      }
    }
  };
  await Promise.allSettled(Array.from({length:Math.min(SZZ_OFFLINE_MEDIA_FETCH_CONCURRENCY,unique.length)},()=>worker()));
  return done;
}

const SZZ_OFFLINE_DETAIL_META_CACHE_MS=1800;
let szzOfflineDetailMetaCache={raw:null,meta:null,savedAt:0};
function cloneSzzOfflineDetailMeta(meta={}){
  const source=meta && typeof meta==="object" && !Array.isArray(meta) ? meta : {};
  return {
    ...source,
    sites:source.sites && typeof source.sites==="object" && !Array.isArray(source.sites) ? {...source.sites} : source.sites
  };
}
function clearSzzOfflineDetailMetaCache(){
  szzOfflineDetailMetaCache={raw:null,meta:null,savedAt:0};
}
window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_OFFLINE_DETAIL_META_KEY) clearSzzOfflineDetailMetaCache();
});
function readSzzOfflineDetailMeta(){
  try{
    const raw=localStorage.getItem(SZZ_OFFLINE_DETAIL_META_KEY) || "";
    if(
      szzOfflineDetailMetaCache.raw===raw &&
      szzOfflineDetailMetaCache.meta &&
      Date.now()-szzOfflineDetailMetaCache.savedAt<SZZ_OFFLINE_DETAIL_META_CACHE_MS
    ){
      return cloneSzzOfflineDetailMeta(szzOfflineDetailMetaCache.meta);
    }
    const parsed=JSON.parse(raw || "{}");
    const meta=parsed && typeof parsed==="object" ? parsed : {};
    szzOfflineDetailMetaCache={raw,meta:cloneSzzOfflineDetailMeta(meta),savedAt:Date.now()};
    return meta;
  }catch(e){
    return {};
  }
}

function writeSzzOfflineDetailMeta(update={}){
  try{
    const next={...readSzzOfflineDetailMeta(),...update,updatedAt:new Date().toISOString()};
    const raw=JSON.stringify(next);
    localStorage.setItem(SZZ_OFFLINE_DETAIL_META_KEY,raw);
    szzOfflineDetailMetaCache={raw,meta:cloneSzzOfflineDetailMeta(next),savedAt:Date.now()};
    return next;
  }catch(e){
    return {...update};
  }
}

function szzOfflineSiteMetaKey(site){
  return selectedSiteDocId(site) || detailKey(site) || safe(site?.id);
}

function readSzzOfflineSiteMeta(site){
  const key=szzOfflineSiteMetaKey(site);
  const meta=readSzzOfflineDetailMeta();
  return key && meta.sites && meta.sites[key] && typeof meta.sites[key]==="object" ? meta.sites[key] : null;
}

function writeSzzOfflineSiteMeta(site,siteMeta={}){
  const key=szzOfflineSiteMetaKey(site);
  if(!key) return null;
  const meta=readSzzOfflineDetailMeta();
  const sites=meta.sites && typeof meta.sites==="object" ? {...meta.sites} : {};
  sites[key]={...(sites[key] || {}),...siteMeta,updatedAt:new Date().toISOString()};
  return writeSzzOfflineDetailMeta({sites});
}

function szzTimeMsFromAny(value){
  if(value && typeof value.toDate==="function") return value.toDate().getTime();
  if(value && typeof value.seconds==="number") return Number(value.seconds)*1000 + Math.round((Number(value.nanoseconds) || 0)/1000000);
  const fromHelper=typeof timeValueFromAny==="function" ? timeValueFromAny(value) : 0;
  if(Number.isFinite(fromHelper) && fromHelper>0) return fromHelper;
  const parsed=Date.parse(safe(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function szzRecordUpdatedMs(item={}){
  return Math.max(
    szzTimeMsFromAny(item.updatedAt),
    szzTimeMsFromAny(item.syncedAt),
    szzTimeMsFromAny(item.uploadedAt),
    szzTimeMsFromAny(item.savedAt),
    szzTimeMsFromAny(item.createdAt),
    szzTimeMsFromAny(item.date),
    szzTimeMsFromAny(item.checkDate),
    szzTimeMsFromAny(item.cloudinaryVersion ? Number(item.cloudinaryVersion)*1000 : 0)
  );
}

const szzRawFingerprintCache=new WeakMap();
const szzOfflineRowFingerprintCache=new WeakMap();
function szzCachedObjectValuesMatch(keys=[],values=[],source={},currentKeys=[]){
  const compareKeys=Array.isArray(currentKeys) ? currentKeys : Object.keys(source || {}).sort((a,b)=>a.localeCompare(b,"cs",{sensitivity:"base"}));
  if(!sameArrayValues(keys,compareKeys)) return false;
  for(let i=0;i<keys.length;i++){
    if(values[i]!==source[keys[i]]) return false;
  }
  return true;
}
function szzStableRawFingerprint(raw={}){
  const source=raw || {};
  const keys=Object.keys(source).sort((a,b)=>a.localeCompare(b,"cs",{sensitivity:"base"}));
  const cacheable=source && (typeof source==="object" || typeof source==="function");
  if(cacheable){
    const cached=szzRawFingerprintCache.get(source);
    if(cached && szzCachedObjectValuesMatch(cached.keys,cached.values,source,keys)) return cached.fingerprint;
  }
  const values=keys.map(key=>source[key]);
  const fingerprint=keys.map((key,idx)=>stableSignature([key,values[idx]])).join("\u001e");
  if(cacheable) szzRawFingerprintCache.set(source,{keys,values,fingerprint});
  return fingerprint;
}

function szzOfflineRowFingerprint(row){
  const raw=row?.raw || {};
  const data=row?.firebaseData || {};
  const rawFingerprint=szzStableRawFingerprint(raw);
  if(row && (typeof row==="object" || typeof row==="function")){
    const cached=szzOfflineRowFingerprintCache.get(row);
    if(
      cached &&
      cached.firebaseDocId===row.firebaseDocId &&
      cached.id===row.id &&
      cached.updatedAt===data.updatedAt &&
      cached.createdAt===data.createdAt &&
      cached.latestProtocolDate===data.latestProtocolDate &&
      cached.rawFingerprint===rawFingerprint
    ){
      return cached.fingerprint;
    }
    const fingerprint=stableSignature([
      row?.firebaseDocId,
      row?.id,
      data.updatedAt,
      data.createdAt,
      data.latestProtocolDate,
      rawFingerprint
    ]);
    szzOfflineRowFingerprintCache.set(row,{
      firebaseDocId:row.firebaseDocId,
      id:row.id,
      updatedAt:data.updatedAt,
      createdAt:data.createdAt,
      latestProtocolDate:data.latestProtocolDate,
      rawFingerprint,
      fingerprint
    });
    return fingerprint;
  }
  return stableSignature([
    row?.firebaseDocId,
    row?.id,
    data.updatedAt,
    data.createdAt,
    data.latestProtocolDate,
    rawFingerprint
  ]);
}

function szzItemsMeta(items=[]){
  const list=Array.isArray(items) ? items : [];
  let latestMs=0;
  const ids=[];
  list.forEach((item,idx)=>{
    latestMs=Math.max(latestMs,szzRecordUpdatedMs(item));
    ids.push(safe(item?._id || item?.id || `${idx}`));
  });
  return {
    count:list.length,
    latestMs,
    signature:ids.sort().join("|")
  };
}

function cloneSzzItemsMeta(meta={}){
  return {
    count:Number(meta.count) || 0,
    latestMs:Number(meta.latestMs) || 0,
    signature:safe(meta.signature)
  };
}

function readSiteLocalArrayMeta(kind,site=selectedSite){
  try{
    const key=siteLocalCacheKey(kind,site);
    const raw=localStorage.getItem(key);
    const cached=siteLocalArrayReadCache.get(key);
    if(cached && cached.raw===raw && Date.now()-cached.savedAt<LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS){
      if(!cached.meta) cached.meta=szzItemsMeta(cached.items);
      return cloneSzzItemsMeta(cached.meta);
    }
    const items=readSiteLocalArray(kind,site);
    const meta=szzItemsMeta(items);
    const fresh=siteLocalArrayReadCache.get(key);
    if(fresh && fresh.raw===raw) fresh.meta=cloneSzzItemsMeta(meta);
    return meta;
  }catch(e){
    return szzItemsMeta([]);
  }
}

function szzDetailMetaChanged(before=null,after=null){
  if(!before || !after) return true;
  return before.count!==after.count || before.latestMs!==after.latestMs || before.signature!==after.signature;
}

function szzLocalOfflineDetailMeta(site){
  return {
    protocols:readSiteLocalArrayMeta("protocolHistory",site),
    serviceRecords:readSiteLocalArrayMeta("serviceHistory",site),
    photos:readSiteLocalArrayMeta("photos",site)
  };
}

async function readFirestoreDocsUpdatedSince(collectionFactory,fields=[],sinceMs=0,addDocSnap=null,warnLabel="Rozdílový Firestore dotaz"){
  if(!firebaseReady || !db || !fb.fsMod || navigator.onLine===false || !sinceMs || typeof addDocSnap!=="function") return 0;
  const {query,where,getDocs,Timestamp}=fb.fsMod;
  if(!query || !where || !getDocs) return 0;
  const cutoffMs=Math.max(0,Number(sinceMs) - SZZ_OFFLINE_INCREMENTAL_SAFETY_MS);
  const cutoffValues=[];
  if(Timestamp && typeof Timestamp.fromMillis==="function") cutoffValues.push(Timestamp.fromMillis(cutoffMs));
  cutoffValues.push(new Date(cutoffMs).toISOString());
  let count=0;
  const tasks=[];
  uniqueNonEmptyStrings(fields).forEach(field=>{
    cutoffValues.forEach(cutoff=>{
      tasks.push(async()=>{
        try{
          const snap=await getDocs(query(collectionFactory(),where(field,">",cutoff)));
          snap.forEach(docSnap=>{
            count++;
            addDocSnap(docSnap);
          });
        }catch(e){
          console.warn(warnLabel,field,e);
        }
      });
    });
  });
  await runBoundedFirestoreTasks(tasks,4);
  return count;
}

function szzFirebaseRowFromDocSnap(docSnap){
  if(!docSnap || !docSnap.id || typeof docSnap.data!=="function") return null;
  const normalizeRows=window.normalizeSiteRows || window.normalize;
  if(typeof normalizeRows!=="function") return null;
  const applyRowEdit=window.applySiteEditToRow || window.applyEditToRow || (row=>row);
  const data=docSnap.data() || {};
  let raw={...(data.raw || {})};
  if(typeof window.applyLatestProtocolDateToRaw==="function"){
    raw=window.applyLatestProtocolDateToRaw(raw,data || {});
  }
  raw["Firebase_doc_id"]=docSnap.id;
  if(!raw["Klíč_adresy"]) raw["Klíč_adresy"]="firebase_"+docSnap.id;
  const row=normalizeRows([raw])[0];
  if(!row) return null;
  row.id=raw["Klíč_adresy"];
  row.raw=raw;
  row.firebaseDocId=docSnap.id;
  row.firebaseData=data;
  return applyRowEdit(row);
}

async function syncSzzOfflineMapRowDeltas(sinceMs=0){
  if(!sinceMs || !firebaseReady || !db || !fb.fsMod || navigator.onLine===false) return [];
  const signedUser=await waitForFirebaseUser(3000);
  if(!signedUser) return [];
  const {collection}=fb.fsMod;
  const rowsById=new Map();
  await readFirestoreDocsUpdatedSince(
    ()=>collection(db,"sitesUnified"),
    ["updatedAt","createdAt"],
    sinceMs,
    docSnap=>{
      const row=szzFirebaseRowFromDocSnap(docSnap);
      if(row) rowsById.set(safe(row.firebaseDocId || row.id),row);
    },
    "Rozdílové načtení bodů selhalo"
  );
  const changedRows=[...rowsById.values()];
  if(!changedRows.length) return [];
  if(typeof window.upsertFirebaseSiteRow==="function"){
    changedRows.forEach(row=>{
      try{ window.upsertFirebaseSiteRow(row,false); }catch(e){}
    });
  }
  cacheCurrentFirebaseRowsForOffline();
  return changedRows;
}

function siteChildLocalKind(kind){
  return kind==="protocols" ? "protocolHistory" : kind==="serviceRecords" ? "serviceHistory" : kind==="photos" ? "photos" : "";
}

function siteChildTypeLabel(kind){
  return kind==="protocols" ? "Protokol" : kind==="serviceRecords" ? "Servisní záznam" : "";
}

function siteChildDeltaFields(kind){
  if(kind==="photos") return ["updatedAt","uploadedAt","createdAt","savedAt"];
  return ["updatedAt","syncedAt","savedAt","createdAt","date"];
}

async function readOfflineStandaloneHistoryCollection(site,colName,typeLabel){
  if(!firebaseReady || !db || !fb.fsMod || !site || navigator.onLine===false) return [];
  const items=[];
  const itemDedupe=createRecordIdDedupe(items);
  const addDocSnap=docSnap=>{
    const id=safe(docSnap && docSnap.id);
    const data=docSnap.data ? docSnap.data() : {};
    itemDedupe.add({...data,_type:typeLabel,_collection:colName,_id:id});
  };
  const keys=siteRecordKeys(site);
  const siteKeysBatchOk=await readFirestoreArrayContainsAny(
    fb.fsMod,
    db,
    colName,
    "siteKeys",
    keys,
    addDocSnap,
    `Offline historie dávkový dotaz selhal ${colName}`
  );
  const tasks=[];
  for(const field of ["siteId","siteKey","firebaseDocId"]){
    tasks.push(()=>readFirestoreEqualsAny(
      fb.fsMod,
      db,
      colName,
      field,
      keys,
      addDocSnap,
      `Offline historie rovnostní dotaz selhal ${colName}`
    ));
  }
  if(!siteKeysBatchOk){
    const {collection,query,where,getDocs}=fb.fsMod;
    keys.forEach(id=>{
      tasks.push(async()=>{
        try{
          const snap=await getDocs(query(collection(db,colName),where("siteKeys","array-contains",id)));
          snap.forEach(addDocSnap);
        }catch(e){
          console.warn("Offline historie dotaz selhal",colName,e);
        }
      });
    });
  }
  await runBoundedFirestoreTasks(tasks,6);
  if(!items.some(item=>recordMatchesSite(item,site))){
    const {collection,query,where,getDocs}=fb.fsMod;
    const textTasks=[];
    siteRecordTextKeys(site).slice(0,6).forEach(value=>{
      ["siteName","siteAddress","place"].forEach(field=>{
        textTasks.push(async()=>{
          try{
            const snap=await getDocs(query(collection(db,colName),where(field,"==",value)));
            snap.forEach(addDocSnap);
          }catch(e){
            console.warn("Offline historie textový dotaz selhal",colName,field,e);
          }
        });
      });
    });
    await runBoundedFirestoreTasks(textTasks,4);
  }
  return items.filter(item=>recordMatchesSite(item,site));
}

async function prefetchOfflineDetailsForSite(site,options={}){
  const result={sites:1,protocols:0,serviceRecords:0,photos:0,media:0,skipped:false,changed:false,full:false};
  if(!site || navigator.onLine===false || !firebaseReady || !db || !fb.fsMod) return result;
  const previousMeta=readSzzOfflineSiteMeta(site);
  const localBefore=szzLocalOfflineDetailMeta(site);
  const incremental=options.incremental!==false && options.forceFull!==true && !!(previousMeta && previousMeta.syncedAtMs);
  const sinceMs=incremental ? Number(previousMeta.syncedAtMs) || 0 : 0;
  const rowFingerprintBefore=szzOfflineRowFingerprint(site);
  const rowChanged=!previousMeta || previousMeta.rowFingerprint!==rowFingerprintBefore;
  result.full=!incremental;
  if((!site.firebaseData || !site.firebaseData.raw) && (!incremental || rowChanged)){
    try{ await refreshSiteDataFromFirebase(site); }catch(e){}
  }
  const includeLegacyStandalone=!incremental || (!localBefore.protocols.count && !localBefore.serviceRecords.count);
  const [childProtocols,childRecords,childPhotos,standaloneProtocols,standaloneRecords]=await Promise.all([
    loadSiteChildItemsForOffline("protocols",site,sinceMs),
    loadSiteChildItemsForOffline("serviceRecords",site,sinceMs),
    loadSiteChildItemsForOffline("photos",site,sinceMs),
    includeLegacyStandalone ? readOfflineStandaloneHistoryCollection(site,"protocols","Protokol") : Promise.resolve([]),
    includeLegacyStandalone ? readOfflineStandaloneHistoryCollection(site,"serviceRecords","Servisní záznam") : Promise.resolve([])
  ]);
  const includeEmbedded=!incremental || rowChanged;
  const embeddedProtocols=includeEmbedded ? szzEmbeddedItemsForOffline(site,"protocolHistory","Protokol","embeddedProtocols","embedded_protocol") : [];
  const embeddedRecords=includeEmbedded ? szzEmbeddedItemsForOffline(site,"serviceHistory","Servisní záznam","embeddedServiceRecords","embedded_service") : [];
  const embeddedPhotos=includeEmbedded ? szzEmbeddedItemsForOffline(site,"photos","","embeddedPhotos","embedded_photo") : [];
  const protocols=[...childProtocols.map(item=>({...item,_type:item._type || "Protokol",_collection:item._collection || "siteProtocols"})),...embeddedProtocols,...standaloneProtocols];
  const serviceRecords=[...childRecords.map(item=>({...item,_type:item._type || "Servisní záznam",_collection:item._collection || "siteServiceRecords"})),...embeddedRecords,...standaloneRecords];
  const photos=[...childPhotos,...embeddedPhotos];
  if(protocols.length) mergeSiteLocalArray("protocolHistory",protocols,site,180);
  if(serviceRecords.length) mergeSiteLocalArray("serviceHistory",serviceRecords,site,180);
  if(photos.length) mergeSiteLocalArray("photos",photos,site,180);
  result.protocols=protocols.length;
  result.serviceRecords=serviceRecords.length;
  result.photos=photos.length;
  result.media=await cacheSzzOfflineMediaUrls(szzOfflinePhotoUrls(photos));
  const localAfter=szzLocalOfflineDetailMeta(site);
  const rowFingerprint=szzOfflineRowFingerprint(site);
  result.changed=!!(
    rowChanged ||
    result.protocols ||
    result.serviceRecords ||
    result.photos ||
    result.media ||
    szzDetailMetaChanged(localBefore.protocols,localAfter.protocols) ||
    szzDetailMetaChanged(localBefore.serviceRecords,localAfter.serviceRecords) ||
    szzDetailMetaChanged(localBefore.photos,localAfter.photos)
  );
  result.skipped=incremental && !result.changed;
  writeSzzOfflineSiteMeta(site,{
    rowFingerprint,
    syncedAtMs:Date.now(),
    protocols:localAfter.protocols,
    serviceRecords:localAfter.serviceRecords,
    photos:localAfter.photos
  });
  return result;
}

async function prefetchSzzOfflineDetailData(inputRows=null,options={}){
  const rowsForPrefetch=szzOfflineRowsForPrefetch(inputRows);
  const totals={sites:rowsForPrefetch.length,processed:0,protocols:0,serviceRecords:0,photos:0,media:0,skipped:0,changedSites:0};
  if(!rowsForPrefetch.length || navigator.onLine===false || !firebaseReady || !db || !fb.fsMod) return totals;
  const signedUser=await waitForFirebaseUser();
  if(!signedUser) return totals;
  const tasks=rowsForPrefetch.map(site=>async()=>{
    const item=await prefetchOfflineDetailsForSite(site,options);
    totals.processed++;
    totals.protocols+=Number(item.protocols) || 0;
    totals.serviceRecords+=Number(item.serviceRecords) || 0;
    totals.photos+=Number(item.photos) || 0;
    totals.media+=Number(item.media) || 0;
    if(item.skipped) totals.skipped++;
    if(item.changed) totals.changedSites++;
    if(typeof options.onProgress==="function") options.onProgress({...totals});
  });
  await runBoundedFirestoreTasks(tasks,SZZ_OFFLINE_DETAIL_PREFETCH_CONCURRENCY);
  return totals;
}

const SZZ_LOCAL_STATE_CACHE_MS=1800;
const szzLocalStateObjectCache=new Map();
function cloneSzzLocalStateObject(value={}){
  return value && typeof value==="object" && !Array.isArray(value) ? {...value} : {};
}
function clearSzzLocalStateObjectCache(key=""){
  const clean=safe(key);
  if(!clean){
    szzLocalStateObjectCache.clear();
    return;
  }
  szzLocalStateObjectCache.delete(clean);
}
window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_OFFLINE_READY_KEY || event.key===SZZ_SYNC_STATE_KEY){
    clearSzzLocalStateObjectCache(event.key || "");
  }
});
function readSzzLocalStateObject(key){
  try{
    const cleanKey=safe(key);
    if(!cleanKey) return {};
    const raw=localStorage.getItem(cleanKey) || "";
    const cached=szzLocalStateObjectCache.get(cleanKey);
    if(cached && cached.raw===raw && Date.now()-cached.savedAt<SZZ_LOCAL_STATE_CACHE_MS){
      return cloneSzzLocalStateObject(cached.item);
    }
    const parsed=JSON.parse(raw || "{}");
    const item=parsed && typeof parsed==="object" ? parsed : {};
    szzLocalStateObjectCache.set(cleanKey,{raw,item:cloneSzzLocalStateObject(item),savedAt:Date.now()});
    return item;
  }catch(e){
    return {};
  }
}
function writeSzzLocalStateObject(key,item={}){
  const cleanKey=safe(key);
  if(!cleanKey) return cloneSzzLocalStateObject(item);
  const next=cloneSzzLocalStateObject(item);
  const raw=JSON.stringify(next);
  localStorage.setItem(cleanKey,raw);
  szzLocalStateObjectCache.set(cleanKey,{raw,item:cloneSzzLocalStateObject(next),savedAt:Date.now()});
  return next;
}

function readSzzOfflineReadyState(){
  return readSzzLocalStateObject(SZZ_OFFLINE_READY_KEY);
}

function writeSzzOfflineReadyState(update={}){
  try{
    const next={...readSzzOfflineReadyState(),...update,updatedAt:new Date().toISOString()};
    return writeSzzLocalStateObject(SZZ_OFFLINE_READY_KEY,next);
  }catch(e){
    return {...update};
  }
}

async function prepareSzzOfflineAppData(options={}){
  if(window.openAppToolsPanel) window.openAppToolsPanel();
  const button=document.getElementById("prepareOfflineAppBtn");
  const syncText=document.getElementById("appSyncText");
  if(button){
    setDisabledIfChanged(button,true);
    setTextIfChanged(button,"Připravuji offline...");
  }
  setTextIfChanged(syncText,"Ukládám aplikaci a servisní data do telefonu.");
  try{
    const storage=await requestSzzPersistentStorage({request:true});
    let shellCount=0;
    try{
      if(window.registerSzzServiceWorker) await window.registerSzzServiceWorker();
      shellCount=await cacheAppShellForOffline();
    }catch(e){
      console.warn("Offline shell se nepodařilo připravit",e);
    }
    let loadedRows=null;
    let changedRows=[];
    const readyBefore=readSzzOfflineReadyState();
    const cachedRowsBefore=readCachedFirebaseSiteCount();
    const firstRun=options.forceFull===true || !cachedRowsBefore || !readyBefore.rowsSyncedAtMs;
    if(cachedRowsBefore && (!Array.isArray(window.rows) || !window.rows.length) && typeof window.showFirebaseMapRowsCache==="function"){
      try{
        setTextIfChanged(syncText,"Načítám uložené body z telefonu.");
        await window.showFirebaseMapRowsCache(null,{offlineBoot:true});
      }catch(e){
        console.warn("Lokální cache bodů se nepodařila načíst před synchronizací",e);
      }
    }
    if(navigator.onLine!==false && typeof window.loadFirebaseSitesUnified==="function"){
      try{
        if(firstRun){
          setTextIfChanged(syncText,"První příprava: stahuji body z Firebase do telefonu.");
          loadedRows=await window.loadFirebaseSitesUnified(null,{force:true,skipLocalCache:true});
        }else{
          setTextIfChanged(syncText,"Kontroluji změny v bodech od poslední synchronizace.");
          const sinceMs=Number(readyBefore.rowsSyncedAtMs || Date.parse(readyBefore.preparedAt || "") || 0);
          changedRows=await syncSzzOfflineMapRowDeltas(sinceMs);
          loadedRows=changedRows;
        }
      }catch(e){
        console.warn(firstRun ? "Servisní data se nepodařilo přednačíst" : "Rozdílová synchronizace bodů selhala",e);
      }
    }
    const cachedRows=cacheCurrentFirebaseRowsForOffline();
    let detailCache={sites:0,processed:0,protocols:0,serviceRecords:0,photos:0,media:0,skipped:0,changedSites:0};
    if(navigator.onLine!==false && cachedRows){
      const rowsForDetails=firstRun
        ? (Array.isArray(loadedRows) && loadedRows.length ? loadedRows : szzOfflineRowsForPrefetch())
        : changedRows;
      if(rowsForDetails.length){
        setTextIfChanged(syncText,firstRun
          ? `Ukládám protokoly a galerie k bodům: 0 / ${rowsForDetails.length}.`
          : `Kontroluji rozdíly u změněných bodů: 0 / ${rowsForDetails.length}.`);
        try{
          detailCache=await prefetchSzzOfflineDetailData(rowsForDetails,{
            incremental:!firstRun,
            forceFull:options.forceFull===true,
            onProgress:progress=>{
              setTextIfChanged(syncText,firstRun
                ? `Ukládám protokoly a galerie k bodům: ${progress.processed} / ${progress.sites}.`
                : `Kontroluji rozdíly u změněných bodů: ${progress.processed} / ${progress.sites}, změny: ${progress.changedSites}.`);
            }
          });
        }catch(e){
          console.warn("Přednačtení detailů pro offline režim selhalo",e);
        }
      }else if(!firstRun){
        setTextIfChanged(syncText,"Žádné nové nebo změněné body od poslední synchronizace.");
      }
    }
    let cachedOfflineMap=czechOfflineMapReady();
    if(navigator.onLine!==false && !cachedOfflineMap && options.skipOfflineMap!==true){
      setTextIfChanged(syncText,"Ukládám mapový podklad ČR pro první offline otevření.");
      try{
        await cacheCzechOfflineMap({reason:options.reason || "offline"});
      }catch(e){
        console.warn("Offline mapa ČR se nepodařila přednačíst",e);
      }
      cachedOfflineMap=czechOfflineMapReady();
    }
    const estimate=await szzStorageEstimate();
    const nowMs=Date.now();
    const ready=writeSzzOfflineReadyState({
      appBuildVersion:APP_BUILD_VERSION,
      preparedAt:new Date().toISOString(),
      rowsSyncedAtMs:navigator.onLine!==false ? Math.max(0,nowMs-SZZ_OFFLINE_INCREMENTAL_SAFETY_MS) : (readyBefore.rowsSyncedAtMs || 0),
      incremental:!firstRun,
      persistentStorage:!!storage.persisted,
      persistentStorageSupported:!!storage.supported,
      shellCount,
      cachedRows,
      loadedRows:Array.isArray(loadedRows) ? loadedRows.length : null,
      changedRows:Array.isArray(changedRows) ? changedRows.length : 0,
      cachedDetailSites:detailCache.processed || 0,
      changedDetailSites:detailCache.changedSites || 0,
      skippedDetailSites:!firstRun && !detailCache.processed ? cachedRows : (detailCache.skipped || 0),
      cachedProtocols:detailCache.protocols || 0,
      cachedServiceRecords:detailCache.serviceRecords || 0,
      cachedPhotos:detailCache.photos || 0,
      cachedPhotoFiles:detailCache.media || 0,
      cachedOfflineMap,
      storageUsage:estimate ? estimate.usage : 0,
      storageQuota:estimate ? estimate.quota : 0
    });
    if(window.showSaveConfirmation) window.showSaveConfirmation("Offline data připravena.");
    const changedRecordCount=(detailCache.protocols || 0) + (detailCache.serviceRecords || 0);
    const detailSummary=(changedRecordCount || detailCache.photos)
      ? `, ${detailCache.protocols + detailCache.serviceRecords} záznamů, ${detailCache.photos} fotek`
      : "";
    const mapSummary=cachedOfflineMap ? ", mapa ČR" : "";
    if(!firstRun && cachedRows){
        const skippedSites=!detailCache.processed ? cachedRows : (detailCache.skipped || 0);
      setTextIfChanged(syncText,`Synchronizace hotová: ${changedRows.length} změněných bodů${detailSummary}, přeskočeno ${skippedSites} beze změny${mapSummary}.`);
    }else{
      setTextIfChanged(syncText,cachedRows
        ? `Offline připraveno: ${cachedRows} bodů${detailSummary}${mapSummary} v telefonu.`
        : "Aplikace je připravená pro offline otevření, body se uloží po načtení z Firebase.");
    }
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
    return ready;
  }finally{
    if(button){
      setDisabledIfChanged(button,false);
      setTextIfChanged(button,"Připravit offline data");
    }
  }
}
window.prepareSzzOfflineAppData=prepareSzzOfflineAppData;

function clampTile(value,z){
  const max=Math.pow(2,z)-1;
  return Math.max(0,Math.min(max,value));
}

function lonToTileX(lon,z){
  return clampTile(Math.floor((Number(lon)+180)/360*Math.pow(2,z)),z);
}

function latToTileY(lat,z){
  const limited=Math.max(-85.05112878,Math.min(85.05112878,Number(lat)));
  const rad=limited*Math.PI/180;
  return clampTile(Math.floor((1-Math.log(Math.tan(rad)+1/Math.cos(rad))/Math.PI)/2*Math.pow(2,z)),z);
}

function mapTileUrl(z,x,y){
  return MAP_TILE_URL_TEMPLATE
    .replace("{z}",String(z))
    .replace("{x}",String(x))
    .replace("{y}",String(y));
}

function boundsValue(bounds,key){
  const method="get"+key.charAt(0).toUpperCase()+key.slice(1);
  if(bounds && typeof bounds[method]==="function") return bounds[method]();
  return Number(bounds && bounds[key]);
}

function mapTileUrlsForBounds(bounds,zooms,maxTiles=Infinity){
  const west=boundsValue(bounds,"west");
  const east=boundsValue(bounds,"east");
  const north=boundsValue(bounds,"north");
  const south=boundsValue(bounds,"south");
  if(![west,east,north,south].every(Number.isFinite)) return [];
  const urls=[];
  for(const zRaw of zooms){
    const z=Math.max(3,Math.min(17,Number(zRaw)));
    if(!Number.isFinite(z)) continue;
    const x1=lonToTileX(west,z);
    const x2=lonToTileX(east,z);
    const y1=latToTileY(north,z);
    const y2=latToTileY(south,z);
    const xStart=Math.min(x1,x2), xEnd=Math.max(x1,x2);
    const yStart=Math.min(y1,y2), yEnd=Math.max(y1,y2);
    for(let x=xStart;x<=xEnd;x++){
      for(let y=yStart;y<=yEnd;y++){
        urls.push(mapTileUrl(z,x,y));
        if(urls.length>=maxTiles) return urls;
      }
    }
  }
  return urls;
}

function visibleMapTileUrls(maxTiles=650){
  if(!map || typeof map.getBounds!=="function") return [];
  const bounds=map.getBounds().pad(0.15);
  const zoom=Math.max(3,Math.min(17,Math.round(map.getZoom() || 7)));
  const zooms=[];
  for(let z=zoom;z<=Math.min(17,zoom+2);z++) zooms.push(z);
  return mapTileUrlsForBounds(bounds,zooms,maxTiles);
}

function czechOfflineMapTileUrls(){
  return mapTileUrlsForBounds(CZECH_OFFLINE_BOUNDS,CZECH_OFFLINE_ZOOMS,Infinity);
}

function czechOfflineMapReady(){
  try{return localStorage.getItem(CZECH_OFFLINE_DONE_KEY)===CZECH_OFFLINE_TILE_VERSION;}catch(e){return false;}
}

function markCzechOfflineMapReady(){
  try{localStorage.setItem(CZECH_OFFLINE_DONE_KEY,CZECH_OFFLINE_TILE_VERSION);}catch(e){}
}

async function cacheMapTileUrls(urls,options={}){
  if(window.__mapTileCacheRunning) return;
  if(!("caches" in window)){
    setOfflineMapStatus("Offline cache mapy není v tomto prohlížeči dostupná.","error");
    return;
  }
  if(navigator.onLine===false){
    setOfflineMapStatus("Jsi offline. Mapu stáhni, až bude internet.","error");
    return;
  }
  if(!urls.length){
    setOfflineMapStatus(options.emptyMessage || "Nejdřív zobraz oblast mapy, kterou chceš uložit.","error");
    return;
  }
  const unique=[...new Set(urls)];
  const label=options.label || "mapu";
  let index=0, done=0, ok=0, failed=0;
  window.__mapTileCacheRunning=true;
  setOfflineMapButtonState(true,options.buttonText || "Stahuji mapu...");
  setOfflineMapStatus(options.startMessage || "Připravuji aplikaci pro offline otevření...");
  try{
    if("serviceWorker" in navigator && window.registerSzzServiceWorker){
      try{ await window.registerSzzServiceWorker(); }catch(e){ if(typeof window.reportSzzServiceWorkerError==="function") window.reportSzzServiceWorkerError(e); }
    }
    await requestSzzPersistentStorage({request:true});
    const shellCount=await cacheAppShellForOffline();
    if(navigator.storage && typeof navigator.storage.estimate==="function"){
      try{
        const estimate=await navigator.storage.estimate();
        const quota=Number(estimate && estimate.quota) || 0;
        const usage=Number(estimate && estimate.usage) || 0;
        const expectedBytes=unique.length*18000;
        if(quota && usage+expectedBytes>quota*0.92){
          throw Object.assign(new Error(`V zařízení není dost volného místa pro offline ${label}. Odhad: ${Math.ceil(expectedBytes/1048576)} MB.`),{offlineQuota:true});
        }
      }catch(e){
        if(e && e.offlineQuota) throw e;
      }
    }
    setOfflineMapStatus(`Aplikace offline připravena (${shellCount} souborů). Stahuji ${label}: 0 / ${unique.length} dlaždic...`);
    const cache=await caches.open(MAP_TILE_CACHE_NAME);
    async function worker(){
      while(index<unique.length){
        const url=unique[index++];
        try{
          const request=new Request(url,{mode:"no-cors",credentials:"omit",cache:"reload"});
          const response=await fetch(request);
          if(response && (response.ok || response.type==="opaque")){
            await cache.put(request,response.clone());
            ok++;
          }else{
            failed++;
          }
        }catch(e){
          failed++;
        }finally{
          done++;
          if(done===unique.length || done%24===0){
            setOfflineMapStatus(`Stahuji ${label} do offline cache: ${done} / ${unique.length} dlaždic...`);
            setOfflineMapButtonState(true,`Stahuji ${done}/${unique.length}`);
          }
        }
      }
    }
    await Promise.all(Array.from({length:Math.min(6,unique.length)},()=>worker()));
    const message=failed
      ? `${options.donePrefix || "Mapa"} uložena částečně: ${ok} dlaždic, ${failed} se nepodařilo.`
      : `${options.donePrefix || "Mapa"} uložena offline: ${ok} dlaždic.`;
    if(!failed && options.markCzechReady) markCzechOfflineMapReady();
    setOfflineMapStatus(message,failed ? "error" : "ok");
    if(window.showSaveConfirmation) window.showSaveConfirmation(message);
  }catch(e){
    console.warn("Offline mapa se nepodařila uložit",e);
    setOfflineMapStatus("Mapu se nepodařilo uložit offline: " + (e && e.message ? e.message : e),"error");
  }finally{
    window.__mapTileCacheRunning=false;
    setOfflineMapButtonState(false);
  }
}

async function cacheVisibleMapTiles(){
  return cacheMapTileUrls(visibleMapTileUrls(),{
    label:"aktuální výřez mapy",
    donePrefix:"Mapa"
  });
}

async function cacheCzechOfflineMap(options={}){
  if(czechOfflineMapReady()){
    setOfflineMapButtonState(false,"Mapa je uložená");
    setOfflineMapStatus("Offline mapa ČR už je v tomto zařízení připravená.","ok");
    return;
  }
  return cacheMapTileUrls(czechOfflineMapTileUrls(),{
    label:"mapu ČR",
    buttonText:"Stahuji ČR...",
    startMessage:"Připravuji aplikaci a mapu ČR pro offline režim...",
    emptyMessage:"Mapu ČR se nepodařilo připravit.",
    donePrefix:"Mapa ČR",
    markCzechReady:true
  });
}

function bindOfflineMapCacheButton(){
  const button=document.getElementById("cacheMapTilesBtn");
  if(button && !button.__offlineMapBound){
    button.addEventListener("click",()=>cacheCzechOfflineMap());
    button.__offlineMapBound=true;
  }
  setOfflineMapButtonState(false);
  if(czechOfflineMapReady()){
    setOfflineMapStatus("Offline mapa ČR je v tomto zařízení připravená.","ok");
  }
}
document.addEventListener("DOMContentLoaded",bindOfflineMapCacheButton);
bindOfflineMapCacheButton();
window.cacheVisibleMapTiles=cacheVisibleMapTiles;
window.cacheCzechOfflineMap=cacheCzechOfflineMap;

function safe(v){return String(v??"").trim()}
function esc(s){return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}
function num(v){if(v===null||v===undefined||v==="")return null;const n=Number(String(v).trim().replace(",","."));return Number.isFinite(n)?n:null}
function stableSignaturePart(value){const text=String(value??"");return `${text.length}:${text}`}
function stableSignature(parts=[]){return (Array.isArray(parts)?parts:[]).map(stableSignaturePart).join("\u001f")}
function sameArrayValues(a=[],b=[]){
  if(a===b) return true;
  if(!Array.isArray(a) || !Array.isArray(b) || a.length!==b.length) return false;
  for(let i=0;i<a.length;i++){
    if(a[i]!==b[i]) return false;
  }
  return true;
}
const rowKeyLookupCache=new WeakMap();
function normalizedRowKeyName(n){return String(n).replace(/^\uFEFF/,"").trim().toLowerCase()}
function normalizedRowKeyLookup(r){
  if(!r || (typeof r!=="object" && typeof r!=="function")) return null;
  const keys=Object.keys(r);
  const signature=keys.join("\u001f");
  const cached=rowKeyLookupCache.get(r);
  if(cached && cached.signature===signature) return cached.map;
  const map=new Map();
  for(const k of keys){
    const normalized=normalizedRowKeyName(k);
    if(!map.has(normalized)) map.set(normalized,k);
  }
  rowKeyLookupCache.set(r,{signature,map});
  return map;
}
function get(r,n){if(!r)return"";if(r[n]!==undefined)return r[n];const lookup=normalizedRowKeyLookup(r);if(!lookup)return"";const k=lookup.get(normalizedRowKeyName(n));return k!==undefined?r[k]:""}
function first(r,a){for(const n of a){const v=safe(get(r,n));if(v)return v}return""}
function simpleNorm(v){
  return String(v||"").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\s+/g," ")
    .trim();
}
const rowSimpleKeyLookupCache=new WeakMap();
function simpleRowKeyLookup(r){
  if(!r || (typeof r!=="object" && typeof r!=="function")) return null;
  const keys=Object.keys(r);
  const signature=keys.join("\u001f");
  const cached=rowSimpleKeyLookupCache.get(r);
  if(cached && cached.signature===signature) return cached.map;
  const map=new Map();
  for(const k of keys){
    const normalized=simpleNorm(k);
    if(!map.has(normalized)) map.set(normalized,[]);
    map.get(normalized).push(k);
  }
  rowSimpleKeyLookupCache.set(r,{signature,map});
  return map;
}
function yesNoBool(v){
  const n=simpleNorm(v);
  if(["ano","yes","true","1","aktivni"].includes(n)) return true;
  if(["ne","no","false","0",""].includes(n)) return false;
  return n.includes("ano") || n.includes("aktivni");
}
function yesNoFlagFromRaw(raw,keys){
  for(const k of keys){
    const v=get(raw||{},k);
    if(!safe(v)) continue;
    const n=simpleNorm(v);
    if(["ano","yes","true","1","aktivni"].includes(n)) return true;
    if(["ne","no","false","0"].includes(n)) return false;
    if(n.includes("ano") || n.includes("aktivni")) return true;
    if(n.includes("ne") || n.includes("false")) return false;
  }
  return null;
}
const WATCH_SELF_PRIMARY_KEYS=[
  "Hlídáme sami termín",
  "Hlídáme kontroly sami",
  "Hlídáme termín sami",
  "Hlídat termín sami",
  "Hlidame kontroly sami",
  "Hlidat termin sami",
  "Jezdit hlídáme termín sami"
];
const WATCH_SELF_LEGACY_FLAG_KEYS=[
  "Jezdit bez objednávky",
  "Jezdit bez objednavky",
  "Bez objednávky",
  "Bez objednavky",
  "Růžová",
  "Ruzova"
];
const WATCH_SELF_RAW_KEYS=[...WATCH_SELF_PRIMARY_KEYS,...WATCH_SELF_LEGACY_FLAG_KEYS];
window.WATCH_SELF_RAW_KEYS=WATCH_SELF_RAW_KEYS;
function watchRawValue(raw,key){
  const source=raw || {};
  const direct=get(source,key);
  if(safe(direct)) return direct;
  const wanted=simpleNorm(key);
  const lookup=simpleRowKeyLookup(source);
  const keys=lookup ? (lookup.get(wanted) || []) : [];
  for(const existingKey of keys){
    if(safe(source[existingKey])) return source[existingKey];
  }
  return "";
}
function yesNoExplicitValue(v){
  const n=simpleNorm(v);
  if(["ano","yes","true","1","aktivni"].includes(n)) return true;
  if(["ne","no","false","0",""].includes(n)) return false;
  if(n.includes("ano") || n.includes("aktivni")) return true;
  if(n.includes("ne") || n.includes("false")) return false;
  return null;
}
function explicitFlagFromKeys(raw,keys){
  let foundYes=false;
  for(const key of keys){
    const value=watchRawValue(raw,key);
    if(!safe(value)) continue;
    const flag=yesNoExplicitValue(value);
    if(flag===false) return false;
    if(flag===true) foundYes=true;
  }
  return foundYes ? true : null;
}
function explicitWatchSelfFromRaw(raw){
  const primary=explicitFlagFromKeys(raw,WATCH_SELF_PRIMARY_KEYS);
  if(primary!==null) return primary;
  return explicitFlagFromKeys(raw,WATCH_SELF_LEGACY_FLAG_KEYS);
}
function canonicalWatchSelfValue(raw){
  return explicitWatchSelfFromRaw(raw)===true ? "ano" : "ne";
}
function applyWatchSelfAliases(raw,value){
  const target=raw || {};
  let flag=yesNoExplicitValue(value);
  if(flag===null) flag=explicitWatchSelfFromRaw(target);
  const yes=flag===true;
  target["Hlídáme sami termín"]=yes ? "ano" : "ne";
  target["Hlídáme kontroly sami"]=yes ? "ano" : "ne";
  target["Hlídáme termín sami"]=yes ? "ano" : "ne";
  target["Hlídat termín sami"]=yes ? "ano" : "ne";
  target["Jezdit bez objednávky"]=yes ? "ANO" : "NE";
  target["Jezdit bez objednavky"]=yes ? "ANO" : "NE";
  target["Bez objednávky"]=yes ? "ANO" : "NE";
  target["Bez objednavky"]=yes ? "ANO" : "NE";
  target["Růžová"]=yes ? "ANO" : "NE";
  target["Ruzova"]=yes ? "ANO" : "NE";
  return target;
}
window.explicitWatchSelfFromRaw=explicitWatchSelfFromRaw;
window.canonicalWatchSelfValue=canonicalWatchSelfValue;
window.applyWatchSelfAliases=applyWatchSelfAliases;
function stopFlagFromRaw(raw){
  const keys=["Stop Stav","Stop stav","Stop_stav","Stop","Zdroj ve Stop Stavu","Odstaveno","Mimo provoz"];
  for(const k of keys){
    const v=get(raw||{},k);
    if(safe(v)) return yesNoBool(v) || simpleNorm(v).includes("stop") || simpleNorm(v).includes("mimo provoz");
  }
  const stav=first(raw||{},["Stav","Stav_kontroly","Stav pro mapu","Status"]);
  return simpleNorm(stav).includes("stop") || simpleNorm(stav).includes("mimo provoz");
}
function repairOrderFlagFromRaw(raw){
  const keys=["Objednaná oprava","Objednana oprava","Oprava objednaná","Oprava objednana","Objednáno oprava","Objednano oprava","Repair ordered"];
  for(const k of keys){
    const v=get(raw||{},k);
    if(safe(v)) return yesNoBool(v) || simpleNorm(v).includes("objednan");
  }
  const stav=first(raw||{},["Stav","Stav_kontroly","Stav kontroly","Stav pro mapu","Status"]);
  const text=[
    stav,
    get(raw||{},"Poznámky"),
    get(raw||{},"Poznámky_mapy")
  ].map(simpleNorm).join(" | ");
  return text.includes("objednana oprava") || text.includes("objednana servisni oprava") || text.includes("oprava objednana");
}
const APP_REGION_OPTIONS = [
  "Hlavní město Praha","Středočeský kraj","Jihočeský kraj","Plzeňský kraj","Karlovarský kraj",
  "Ústecký kraj","Liberecký kraj","Královéhradecký kraj","Pardubický kraj","Kraj Vysočina",
  "Jihomoravský kraj","Olomoucký kraj","Moravskoslezský kraj","Zlínský kraj","Slovensko"
];
const APP_STATUS_FILTER_OPTIONS = [
  "Propadlá kontrola",
  "Kontrola objednaná",
  "Objednaná oprava",
  "1–30 dní k termínu",
  "Stop Stav",
  "OK / ostatní",
  "Hlídáme termín sami"
];
const APP_ADMIN_EMAILS = [
  "jan.soldan@astip.cz",
  "jansoldan@astip.cz"
];
const APP_ALLOWED_EMAILS = [
  "iva.glozova@astip.cz"
];
const APP_PROTOCOL_HISTORY_EMAILS = [
  "iva.glozova@astip.cz"
];
const APP_ADMIN_EMAIL_SET = new Set(APP_ADMIN_EMAILS.map(e=>safe(e).toLowerCase()).filter(Boolean));
const APP_ALLOWED_EMAIL_SET = new Set(APP_ALLOWED_EMAILS.map(e=>safe(e).toLowerCase()).filter(Boolean));
const APP_PROTOCOL_HISTORY_EMAIL_SET = new Set(APP_PROTOCOL_HISTORY_EMAILS.map(e=>safe(e).toLowerCase()).filter(Boolean));
window.appRegionOptions = () => APP_REGION_OPTIONS.slice();
function compatAuthCurrentUser(){
  try{
    const client=getCompatAuthClient();
    return client && client.currentUser ? client.currentUser : null;
  }catch(e){}
  return null;
}
function syncCurrentUserFromCompat(){
  const u=compatAuthCurrentUser();
  if(u){
    currentUser=u;
    window.currentUser=u;
    window.__authReadyUser=u;
  }
  return u;
}
function currentUserEmail(){
  const u=currentUser || window.currentUser || window.__authReadyUser || syncCurrentUserFromCompat();
  return safe(u && u.email).toLowerCase() || lastKnownUserEmail();
}
function isAllowedLoginEmail(email){
  const e=safe(email).toLowerCase();
  return e.endsWith("@astip.cz") || APP_ALLOWED_EMAIL_SET.has(e);
}
function isAppAdmin(){
  const email=currentUserEmail();
  return !!email && APP_ADMIN_EMAIL_SET.has(email);
}
function canViewProtocolHistory(){
  const email=currentUserEmail();
  if(!email) return false;
  return isAllowedLoginEmail(email) || APP_PROTOCOL_HISTORY_EMAIL_SET.has(email);
}
function canViewMainProtocolHistory(){
  const email=currentUserEmail();
  if(!email) return false;
  return isAppAdmin() || APP_PROTOCOL_HISTORY_EMAIL_SET.has(email);
}
function updateProtocolHistoryVisibility(){
  const showDetail=canViewProtocolHistory();
  const showMain=canViewMainProtocolHistory();
  document.querySelectorAll(".protocol-history-private").forEach(el=>{
    setDisplayIfChanged(el,showDetail ? "" : "none");
  });
  document.querySelectorAll(".main-protocol-history-private").forEach(el=>{
    setDisplayIfChanged(el,showMain ? "" : "none");
  });
}
function updateAdminAppControls(){
  updateProtocolHistoryVisibility();
  if(typeof window.updateSzzInstallButtons==="function") window.updateSzzInstallButtons();
}
window.isAppAdmin=isAppAdmin;
window.canViewProtocolHistory=canViewProtocolHistory;
window.canViewMainProtocolHistory=canViewMainProtocolHistory;
window.updateAdminAppControls=updateAdminAppControls;
document.addEventListener("DOMContentLoaded",updateAdminAppControls);
(window.queueMicrotask || (fn=>Promise.resolve().then(fn)))(updateAdminAppControls);
function waitForFirebaseUser(timeoutMs=8000){
  if(!firebaseReady || (!auth && !getCompatAuthClient())) return Promise.resolve(currentUser || window.currentUser || null);
  const existing=currentUser || window.currentUser || window.__authReadyUser || syncCurrentUserFromCompat();
  if(existing) return Promise.resolve(existing);
  return new Promise(resolve=>{
    let done=false;
    let unsub=null;
    const finish=user=>{
      if(done) return;
      done=true;
      if(unsub) try{unsub();}catch(e){}
      currentUser=user || syncCurrentUserFromCompat() || currentUser || window.currentUser || window.__authReadyUser || null;
      window.currentUser=currentUser;
      resolve(currentUser);
    };
    const timer=setTimeout(()=>finish(syncCurrentUserFromCompat() || currentUser || window.currentUser || (auth && auth.currentUser) || null),timeoutMs);
    try{
      const compatClient=getCompatAuthClient();
      if(compatClient && compatClient.onAuthStateChanged){
        unsub=compatClient.onAuthStateChanged(user=>{
          if(!user && !explicitSignOutPending()) return;
          clearTimeout(timer);
          finish(user || syncCurrentUserFromCompat());
        });
      }else{
        unsub=fb.authMod.onAuthStateChanged(auth,user=>{
          if(!user && !explicitSignOutPending()) return;
          clearTimeout(timer);
          finish(user || syncCurrentUserFromCompat());
        });
      }
    }catch(e){
      clearTimeout(timer);
      finish(syncCurrentUserFromCompat() || currentUser || window.currentUser || (auth && auth.currentUser) || null);
    }
  });
}
function siteId(raw,i){return first(raw,["Klíč_adresy","ID_mista","Název","Adresa_GPS","Adresa / umístění","Umístění"]) || String(i)}
function rawGps(r){return Number.isFinite(r.lat)&&Number.isFinite(r.lon)}
function inCzSk(r){return rawGps(r)&&r.lat>=47&&r.lat<=51.5&&r.lon>=12&&r.lon<=23}

const PARSE_DATE_VALUE_CACHE_MAX=8000;
const parseDateValueCache=new Map();
function rememberParsedDateValue(key,time){
  parseDateValueCache.set(key,time);
  if(parseDateValueCache.size>PARSE_DATE_VALUE_CACHE_MAX){
    const firstKey=parseDateValueCache.keys().next().value;
    parseDateValueCache.delete(firstKey);
  }
}
function parseDateValue(v){
  const s=safe(v);
  if(!s) return null;
  if(parseDateValueCache.has(s)){
    const time=parseDateValueCache.get(s);
    return Number.isFinite(time) ? new Date(time) : null;
  }
  let m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if(m){
    const d=new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
    const time=isNaN(d.getTime()) ? null : d.getTime();
    rememberParsedDateValue(s,time);
    return Number.isFinite(time) ? new Date(time) : null;
  }
  m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if(m){
    const d=new Date(Number(m[3]), Number(m[2])-1, Number(m[1]));
    const time=isNaN(d.getTime()) ? null : d.getTime();
    rememberParsedDateValue(s,time);
    return Number.isFinite(time) ? new Date(time) : null;
  }
  const d=new Date(s);
  const time=isNaN(d.getTime()) ? null : d.getTime();
  rememberParsedDateValue(s,time);
  return Number.isFinite(time) ? new Date(time) : null;
}
function formatDateCz(dateObj){
  if(!dateObj || isNaN(dateObj.getTime())) return "";
  return `${dateObj.getDate()}.${dateObj.getMonth()+1}.${dateObj.getFullYear()}`;
}
function formatDateTimeCz(dateObj){
  if(!dateObj || isNaN(dateObj.getTime())) return "";
  const pad=n=>String(n).padStart(2,"0");
  return `${dateObj.getDate()}.${dateObj.getMonth()+1}.${dateObj.getFullYear()} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
}
function addMonths(dateObj, months){
  const d=new Date(dateObj.getTime());
  const day=d.getDate();
  d.setMonth(d.getMonth()+months);
  if(d.getDate()!==day) d.setDate(0);
  return d;
}
const LAST_CHECK_KEYS=["Poslední_kontrola","Poslední proběhlá kontrola","Poslední kontrola","Upravená poslední kontrola"];
const NEXT_CHECK_KEYS=["Příští_kontrola","Příští plánovaná kontrola","Příští kontrola","Upravená další kontrola"];
function dateDistanceDays(a,b){
  return Math.abs(a.getTime()-b.getTime())/86400000;
}
function inferControlPeriodMonthsFromDateValues(lastValue,nextValue){
  const last=parseDateValue(lastValue);
  const next=parseDateValue(nextValue);
  if(!last || !next || isNaN(last.getTime()) || isNaN(next.getTime()) || next<=last) return null;
  const sixDiff=dateDistanceDays(addMonths(last,6),next);
  const twelveDiff=dateDistanceDays(addMonths(last,12),next);
  if(sixDiff<=45 && sixDiff<=twelveDiff) return 6;
  if(twelveDiff<=60) return 12;
  const diffDays=(next.getTime()-last.getTime())/86400000;
  if(diffDays>=135 && diffDays<=230) return 6;
  if(diffDays>=300 && diffDays<=430) return 12;
  return null;
}
function inferControlPeriodMonthsFromDates(raw={}, row={}){
  const last=safe(row && row.posledni) || first(raw,LAST_CHECK_KEYS);
  const next=safe(row && row.pristi) || first(raw,NEXT_CHECK_KEYS);
  return inferControlPeriodMonthsFromDateValues(last,next);
}
function periodMonths(r){
  const raw=(r && r.raw) || {};
  const dateMonths=inferControlPeriodMonthsFromDates(raw,r || {});
  if(dateMonths) return dateMonths;
  const text=[raw["Zdrojový_soubor"], raw["Zdrojovy_soubor"], raw["Zdroj_dat"], raw["Perioda"], raw["period"], raw["Perioda kontrol"], raw["Perioda_kontrol"], raw["Četnost kontrol"], raw["Perioda zkoušky provozuschopnosti"]].join(" ").toLowerCase();
  if(text.includes("12")) return 12;
  if(text.includes("6")) return 6;
  return 6;
}
function computedNextDate(r){
  const cached=ensureRowScheduleCache(r);
  if(cached) return Number.isFinite(cached.nextTime) ? new Date(cached.nextTime) : null;
  return computeComputedNextDate(r);
}
function computeComputedNextDate(r){
  const last=parseDateValue(r.posledni);
  if(last) return addMonths(last, periodMonths(r));
  const next=parseDateValue(r.pristi);
  return next;
}
function computeDaysFromDate(next){
  if(!next) return null;
  const today=new Date(); today.setHours(0,0,0,0);
  next.setHours(0,0,0,0);
  return Math.round((next.getTime()-today.getTime())/86400000);
}
function computeDaysToComputedNext(r){
  return computeDaysFromDate(computeComputedNextDate(r));
}
function rowScheduleFingerprint(r){
  const raw=(r && r.raw) || {};
  return [
    r && r.posledni,
    r && r.pristi,
    r && r.ordered,
    r && r.repairOrdered,
    r && r.stopped,
    r && r.noOrder,
    first(raw,LAST_CHECK_KEYS),
    first(raw,NEXT_CHECK_KEYS),
    raw["Hlídáme sami termín"],
    raw["Hlídáme kontroly sami"],
    raw["Hlídáme termín sami"],
    raw["Růžová"],
    raw["Ruzova"],
    raw["Typ"],
    raw["Kategorie"],
    raw["Poznámky"],
    raw["Poznámky_mapy"],
    raw["DŮLEŽITÁ POZNÁMKA"],
    raw["Zdrojový_soubor"],
    raw["Zdrojovy_soubor"],
    raw["Zdroj_dat"],
    raw["Perioda"],
    raw["period"],
    raw["Perioda kontrol"],
    raw["Perioda_kontrol"],
    raw["Četnost kontrol"],
    raw["Perioda zkoušky provozuschopnosti"]
  ].map(v=>String(v ?? "")).join("|");
}
function ensureRowScheduleCache(r){
  if(!r) return null;
  const fingerprint=rowScheduleFingerprint(r);
  if(r._scheduleCache && r._scheduleFingerprint===fingerprint) return r._scheduleCache;
  const next=computeComputedNextDate(r);
  const days=computeDaysFromDate(next ? new Date(next.getTime()) : null);
  let status="OK / ostatní";
  let markerColor="#16a34a";
  let priority=10;
  if(r.repairOrdered === true){
    status="Objednaná oprava";
    markerColor="#2563eb";
    priority=45;
  }else if(r.ordered === true){
    status="Kontrola objednaná";
    markerColor="#eab308";
    priority=50;
  }else if(r.stopped === true){
    status="Stop Stav";
    markerColor="#64748b";
    priority=30;
  }else if(Number.isFinite(days) && days < 0){
    status="Propadlá kontrola";
    markerColor="#dc2626";
    priority=70;
  }else if(Number.isFinite(days) && days >= 1 && days <= 30){
    status="1–30 dní k termínu";
    markerColor="#f97316";
    priority=60;
  }else if(isNoOrderSite(r)){
    priority=20;
  }
  const pillClass=markerColor==="#dc2626"?"red":markerColor==="#f97316"?"orange":markerColor==="#eab308"?"yellow":markerColor==="#2563eb"?"blue":markerColor==="#64748b"?"gray":"green";
  const cache={
    nextTime:next ? next.getTime() : NaN,
    days,
    display:next ? formatDateCz(next) : (r.pristi || ""),
    color:markerColor,
    status,
    pill:pillClass,
    priority
  };
  r._scheduleFingerprint=fingerprint;
  r._scheduleCache=cache;
  return cache;
}
function daysToComputedNext(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.days : null;
}
function displayNext(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.display : (r && r.pristi || "");
}
function color(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.color : "#16a34a";
}
function statusText(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.status : "OK / ostatní";
}
function pill(r){const cached=ensureRowScheduleCache(r);return cached ? cached.pill : "green"}

function normPinkText(s){
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\b(ceska republika|slovensko|cr|sr|okres|kraj|budova|objekt|areal|cp|c p|z s|m s)\b/g," ")
    .replace(/\s+/g," ")
    .trim();
}

function meaningfulTokens(s){
  return normPinkText(s)
    .split(" ")
    .filter(t => t.length >= 3 && !["dps","ldn","ups","astip","strong","minut","min","bud"].includes(t));
}

function pinkHashValue(value){
  let h=2166136261;
  for(const ch of String(value || "")){
    h^=ch.charCodeAt(0);
    h=Math.imul(h,16777619)>>>0;
  }
  return h.toString(36);
}

function pinkSignatureMatch(place, signature){
  const a=normPinkText(place);
  if(!a || !Array.isArray(signature)) return false;
  if(pinkHashValue(a)===signature[0]) return true;
  const at=new Set(meaningfulTokens(a).map(pinkHashValue));
  const bt=Array.isArray(signature[1]) ? signature[1] : [];
  if(!at.size || !bt.length) return false;
  let common=0;
  for(const tokenHash of bt){
    if(at.has(tokenHash)) common++;
  }
  return common>=2 || (bt.length===1 && common===1);
}

function isNoOrderSite(r){
  const raw=r.raw || {};
  const explicit=explicitWatchSelfFromRaw(raw);
  if(explicit !== null) return explicit === true;

  if(r.noOrder === true) return true;

  const place = [
    r.adresa,
    raw["Název"],
    raw["Adresa_GPS"],
    raw["Adresa / umístění"],
    raw["Umístění"],
    raw["Umístění zdroje"],
    raw["Původní adresa / umístění"]
  ].map(v=>safe(v)).filter(Boolean).join(" | ");

  if(ORIGINAL_PINK_PLACE_SIGNATURES.some(signature => pinkSignatureMatch(place,signature))) return true;

  const text=[
    raw["Růžová"],
    raw["Ruzova"],
    raw["Typ"],
    raw["Kategorie"],
    raw["Poznámky"],
    raw["Poznámky_mapy"],
    raw["DŮLEŽITÁ POZNÁMKA"]
  ].map(v=>safe(v).toLowerCase()).join(" | ");

  return (
    text.includes("bez objednáv") ||
    text.includes("jezdit bez objednáv") ||
    text.includes("jezdit bez objednav") ||
    text.includes("růžov") ||
    text.includes("ruzov")
  );
}


function editCacheKeyForRow(r){
  return String((r && (r.firebaseDocId || (r.raw && r.raw["Firebase_doc_id"]) || r.id)) || "");
}

function applyEditToRow(r){
  const cacheKey=editCacheKeyForRow(r);
  const e=editCache[cacheKey] || editCache[r.id];
  if(!e) return r;

  const rawEdits = e.rawEdits || {};
  const hasRawEdit=(key)=>Object.prototype.hasOwnProperty.call(rawEdits,key);
  const importantNoteAliases=["Důležitá poznámka","DŮLEŽITÁ POZNÁMKA","Důležité poznámky","dulezita poznamka"];
  const editedImportantNoteKey=importantNoteAliases.find(hasRawEdit);
  const lat = num(e.gpsLat) ?? num((e.rawEdits||{})["GPS_lat"]);
  const lon = num(e.gpsLon) ?? num((e.rawEdits||{})["GPS_lon"]);
  const updatedRaw = {...r.raw, ...rawEdits};
  const rawWatch = explicitWatchSelfFromRaw(rawEdits);
  if(rawWatch !== null) applyWatchSelfAliases(updatedRaw, rawWatch ? "ano" : "ne");

  if(e.name) updatedRaw["Upravený název"] = e.name;
  if(e.contact) updatedRaw["Upravený kontakt"] = e.contact;
  if(e.source) updatedRaw["Upravený zdroj"] = e.source;
  if(hasRawEdit("Poznámky")) updatedRaw["Upravené poznámky"] = rawEdits["Poznámky"];
  else if(e.notes) updatedRaw["Upravené poznámky"] = e.notes;
  if(e.gpsAddress) updatedRaw["Upravená Adresa_GPS"] = e.gpsAddress;
  if(e.lastCheck) updatedRaw["Upravená poslední kontrola"] = e.lastCheck;
  if(e.nextCheck) updatedRaw["Upravená další kontrola"] = e.nextCheck;
  if(e.ordered !== undefined) updatedRaw["Kontrola objednaná"] = e.ordered ? "ANO" : "NE";
  if(e.repairOrdered !== undefined) updatedRaw["Objednaná oprava"] = e.repairOrdered ? "ANO" : "NE";
  if(e.stopped !== undefined) updatedRaw["Stop Stav"] = e.stopped ? "ANO" : "NE";
  if(Number.isFinite(lat)) updatedRaw["Upravené GPS_lat"] = String(lat);
  if(Number.isFinite(lon)) updatedRaw["Upravené GPS_lon"] = String(lon);
  const regionValue=canonicalRegionValue(rawEdits["Kraj"] || r.kraj) || inferRegionFromAddressText([
    rawEdits["Kraj"],
    updatedRaw["Kraj"],
    updatedRaw["Název"],
    updatedRaw["Adresa / umístění"],
    updatedRaw["Adresa_GPS"],
    updatedRaw["Umístění zdroje"],
    r.adresa
  ].filter(Boolean).join(" "));

  const editedNotes=hasRawEdit("Poznámky")
    ? rawEdits["Poznámky"]
    : editedImportantNoteKey
      ? rawEdits[editedImportantNoteKey]
      : e.notes || r.poznamky;

  return {...r,
    raw: updatedRaw,
    adresa:e.name || rawEdits["Název"] || rawEdits["Adresa / umístění"] || rawEdits["Umístění zdroje"] || r.adresa,
    kontakt:e.contact || rawEdits["Kontakt"] || r.kontakt,
    zdroj:e.source || rawEdits["Popis_zdroje"] || r.zdroj,
    poznamky:editedNotes,
    kraj:regionValue || rawEdits["Kraj"] || r.kraj,
    posledni:e.lastCheck || r.posledni,
    pristi:e.nextCheck || r.pristi,
    lat:Number.isFinite(lat) ? lat : r.lat,
    lon:Number.isFinite(lon) ? lon : r.lon,
    gpsAddress:e.gpsAddress || r.gpsAddress,
    ordered:e.ordered !== undefined ? e.ordered === true : r.ordered,
    repairOrdered:e.repairOrdered !== undefined ? e.repairOrdered === true : repairOrderFlagFromRaw(updatedRaw),
    stopped:e.stopped !== undefined ? e.stopped === true : stopFlagFromRaw(updatedRaw),
    noOrder:rawWatch !== null ? rawWatch === true : (e.noOrder === true ? true : e.noOrder === false ? false : isNoOrderSite({...r, raw:updatedRaw})),
    edit:e
  };
}
function normalize(data){
  return data.map((raw,i)=>{
    const lat=num(get(raw,"GPS_lat")), lon=num(get(raw,"GPS_lon"));
    const adresa=first(raw,["Název","Adresa / umístění","Adresa_GPS","Umístění","Umístění zdroje","Původní adresa / umístění"]);
    const zdroj=first(raw,["Popis_zdroje","Zdroj","Jaký zdroj"]);
    const kontakt=first(raw,["Kontakt_mapy","Kontakt","Hlavní kontakt"]);
    const rawLast=first(raw,LAST_CHECK_KEYS);
    const rawNext=first(raw,NEXT_CHECK_KEYS);
    const inferredPeriod=inferControlPeriodMonthsFromDateValues(rawLast,rawNext);
    if(inferredPeriod) raw["Perioda kontrol"]=String(inferredPeriod);
    const rawRegion=first(raw,["Kraj","Region","Kraj / oblast"]);
    const region=canonicalRegionValue(rawRegion) || inferRegionFromAddressText([
      rawRegion,
      adresa,
      first(raw,["Adresa / umístění","Adresa_GPS","Umístění","Umístění zdroje","Původní adresa / umístění"])
    ].filter(Boolean).join(" "));
    const r={
      id:siteId(raw,i), i, raw, lat, lon,
      gpsAddress:first(raw,["Adresa_GPS","Adresa / umístění","Umístění"]),
      adresa, zdroj, kontakt,
      kraj:region || rawRegion,
      poznamky:first(raw,["Poznámky_mapy","Poznámky","DŮLEŽITÁ POZNÁMKA"]),
      pristi:first(raw,["Příští_kontrola","Příští plánovaná kontrola","Příští kontrola"]),
      posledni:first(raw,["Poslední_kontrola","Poslední proběhlá kontrola","Poslední kontrola"]),
      dni:first(raw,["Dní do kontroly","Dní_do_kontroly"]),
      stav:first(raw,["Stav_kontroly","Stav pro mapu"]),
      barva:first(raw,["Barva bodu","Barva_bodu"]),
      ordered:(first(raw,["Kontrola objednaná","Kontrola_objednaná","Objednáno","Objednano"]).toLowerCase()==="ano" || (first(raw,["Stav pro mapu"]).toLowerCase().includes("objednan") && !simpleNorm(first(raw,["Stav pro mapu"])).includes("oprava"))),
      repairOrdered:repairOrderFlagFromRaw(raw),
      stopped:stopFlagFromRaw(raw),
      noOrder:explicitWatchSelfFromRaw(raw)===true
    };
    return applyEditToRow(r);
  });
}

window.normalizeSiteRows = normalize;
window.applySiteEditToRow = applyEditToRow;

async function loadEdits(){
  if(!firebaseReady || !db) return;
  if(firebaseUnifiedPrimary){
    editCache={};
    const st=document.getElementById("editStatus");
    if(st && /Úpravy se nepodařilo|Uložené úpravy/.test(st.textContent || "")) st.textContent="";
    return;
  }
  try{
    const {collection,getDocs}=fb.fsMod;
    const snap=await getDocs(collection(db,"siteEdits"));
    editCache={};
    snap.forEach(d=>editCache[d.id]=d.data());
    if(!firebaseUnifiedPrimary){
      rows=csvRows.concat(extraSites).map(applyEditToRow).filter(r=>!deletedSiteIds.has(r.id));
      render();
    }
    document.getElementById("editStatus").textContent="Uložené úpravy načteny.";
  }catch(e){
    console.warn("Úpravy se nepodařilo načíst",e);
    const st=document.getElementById("editStatus");
    if(st) st.textContent="";
  }
}


function daysBetweenToday(dateStr){
  const s=safe(dateStr);
  if(!s) return "";
  const d=new Date(s+"T00:00:00");
  if(isNaN(d.getTime())) return "";
  const today=new Date();
  today.setHours(0,0,0,0);
  return Math.round((d.getTime()-today.getTime())/86400000);
}


function newSiteFieldNorm(k){
  return String(k||"").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/_/g," ")
    .replace(/\s+/g," ")
    .trim();
}

function shouldSkipNewSiteField(k){
  const n=newSiteFieldNorm(k);
  if(!n) return true;
  if(n.includes("gps") && n!=="adresa gps") return true;
  if(n==="firebase doc id" || n==="id mista" || n==="klic adresy") return true;
  if(n==="barva bodu" || n==="dni do kontroly" || n==="stav pro mapu" || n==="stav kontroly") return true;
  if(n==="faktura na") return true;
  if(n==="pristi kontrola" || n==="posledni kontrola" || n==="pristi planovana kontrola" || n==="posledni probehla kontrola") return true;
  if(n==="zdrojovy soubor" || n==="zdrojovy radek" || n==="pocet terminu" || n==="vsechny terminy") return true;
  if(/^mesic\s*\d*$/.test(n) || /^month\s*\d*$/.test(n) || /^\d{1,2}$/.test(n)) return true;
  return false;
}

function newSiteFieldLabel(k){
  const n=newSiteFieldNorm(k);
  if(n==="adresa gps") return "Umístění zdroje";
  if(n==="zdroj") return "Výrobní číslo";
  return k;
}

function getAllKnownDataKeys(){
  const keys=[];
  const seen=new Set();

  (rows||[]).forEach(r=>{
    const raw=r.raw || {};
    Object.keys(raw).forEach(k=>{
      if(shouldSkipNewSiteField(k)) return;
      const label=newSiteFieldLabel(k);
      const norm=newSiteFieldNorm(label);
      if(seen.has(norm)) return;
      seen.add(norm);
      keys.push(k);
    });
  });

  const required=[
    "Název","Adresa_GPS","Kraj","Popis_zdroje","Zdroj",
    "Historie oprav","Postup testování","Jistič UPS",
    "Perioda kontrol","Hlídáme kontroly sami","Důležitá poznámka",
    "Serviska","Smlouva ano/ne","Rok výroby","Poznámky"
  ];

  required.forEach(k=>{
    const label=newSiteFieldLabel(k);
    const norm=newSiteFieldNorm(label);
    if(!seen.has(norm) && !shouldSkipNewSiteField(k)){
      seen.add(norm);
      keys.push(k);
    }
  });

  return keys;
}




function bindDrawerCloseButton(){
  const close=document.getElementById("closeDrawer");
  const drawer=document.getElementById("drawer");
  if(close && drawer) close.onclick=()=>drawer.classList.remove("open");
}

function dedupeDetailTabs(drawer=document.getElementById("drawer")){
  if(!drawer) return;
  const tabBars=Array.from(drawer.querySelectorAll(".detail-tabs"));
  if(!tabBars.length) return;
  const keep=tabBars.find(el=>el.id==="detailTabs") || tabBars[0];
  keep.id="detailTabs";
  tabBars.forEach(el=>{ if(el!==keep) el.remove(); });
  const seenTabs=new Set();
  keep.querySelectorAll(".detail-tab[data-detail-tab]").forEach(btn=>{
    const key=btn.getAttribute("data-detail-tab");
    if(seenTabs.has(key)){
      btn.remove();
      return;
    }
    seenTabs.add(key);
  });
}

function drawerNodesHaveDetailShell(nodes=[]){
  return (nodes || []).some(node=>{
    if(!node || node.nodeType!==1) return false;
    return node.id==="detailTable"
      || node.id==="detailTabs"
      || !!(node.querySelector && (node.querySelector("#detailTable") || node.querySelector("#detailTabs")));
  });
}

function cloneDrawerNodes(nodes=[]){
  return (nodes || []).map(node=>node && node.cloneNode ? node.cloneNode(true) : null).filter(Boolean);
}

function captureNormalDetailDrawerShell(drawer=document.getElementById("drawer")){
  if(!drawer || !(drawer.querySelector("#detailTable") && drawer.querySelector("#detailTabs"))) return;
  dedupeDetailTabs(drawer);
  const nodes=Array.from(drawer.childNodes);
  window.__normalDrawerNodes=nodes;
  window.__normalDrawerNodeClones=cloneDrawerNodes(nodes);
}

function restoreNormalDetailDrawerShell(){
  const drawer=document.getElementById("drawer");
  if(!drawer) return null;
  const hasDetailShell=!!(drawer.querySelector("#detailTable") && drawer.querySelector("#detailTabs"));
  if(!hasDetailShell){
    if(drawerNodesHaveDetailShell(window.__normalDrawerNodes)){
      drawer.replaceChildren(...window.__normalDrawerNodes);
    }else if(drawerNodesHaveDetailShell(window.__normalDrawerNodeClones)){
      drawer.replaceChildren(...cloneDrawerNodes(window.__normalDrawerNodeClones));
    }
  }
  dedupeDetailTabs(drawer);
  captureNormalDetailDrawerShell(drawer);
  bindDrawerCloseButton();
  return drawer;
}
window.captureNormalDetailDrawerShell=captureNormalDetailDrawerShell;
window.restoreNormalDetailDrawerShell=restoreNormalDetailDrawerShell;

function setNewSiteModeTitle(){
  const title=document.getElementById("drawerTitle");
  const sub=document.getElementById("drawerSub");
  if(title) title.textContent="Přidat nové místo";
  if(sub) sub.textContent="Vyplň údaje a ulož místo.";
}
function clearNewSiteMode(){
  const drawerEl=document.getElementById("drawer");
  if(drawerEl) drawerEl.classList.remove("adding-new-site");
  addSourceBaseSite=null;
  const chooser=document.getElementById("sourceChooser");
  if(chooser){
    chooser.style.display="none";
    chooser.replaceChildren();
    chooser.dataset.renderSignature="";
  }
}


const NEW_SITE_FIELD_SPECS=[
  {label:"Název",key:"Název"},
  {label:"Adresa / umístění",key:"Adresa / umístění"},
  {label:"Umístění zdroje",key:"Adresa_GPS",full:true},
  {label:"Historie oprav",key:"Historie oprav",type:"textarea",full:true},
  {label:"Postup testování",key:"Postup testování",type:"textarea",full:true},
  {label:"Jistič UPS",key:"Jistič UPS",full:true},
  {label:"Popis_zdroje",forceLabel:"Popis zdroje",key:"Popis_zdroje",full:true},
  {label:"Výrobní číslo",key:"Zdroj",full:true},
  {label:"Kontakt",key:"Kontakt"},
  {label:"Kraj",key:"Kraj"},
  {label:"Poznámky",key:"Poznámky",full:true},
  {label:"Rok výroby",key:"Rok výroby"},
  {label:"Serviska",key:"Serviska",type:"select",options:[["",""],["ano","ano"],["ne","ne"]]},
  {label:"Smlouva",key:"Smlouva ano/ne",type:"select",options:[["ne","ne"],["ano","ano"]],value:"ne"},
  {label:"Cena FZ",key:"Cena FZ"},
  {label:"Perioda kontrol",key:"Perioda kontrol",type:"select",options:[["6","6 měsíců"],["12","12 měsíců"]],value:"12"},
  {label:"Hlídáme kontroly sami",key:"Hlídáme kontroly sami",type:"select",options:[["ne","ne"],["ano","ano"]],value:"ne",full:true,special:"watch-self"},
  {label:"Důležité poznámky",key:"Důležitá poznámka",type:"textarea",full:true,className:"notes-red-row",style:"padding:10px;border-radius:12px;"}
];

function createNewSiteFieldControl(spec){
  if(spec.type==="textarea"){
    return document.createElement("textarea");
  }
  if(spec.type==="select"){
    const select=document.createElement("select");
    (spec.options || []).forEach(([value,label])=>{
      const option=document.createElement("option");
      option.value=value;
      option.textContent=label;
      select.appendChild(option);
    });
    if(spec.value!==undefined) select.value=spec.value;
    return select;
  }
  return document.createElement("input");
}

function createNewSiteField(spec,options={}){
  const field=document.createElement("div");
  if(spec.full) field.classList.add("full");
  if(spec.className) field.classList.add(...spec.className.split(/\s+/).filter(Boolean));
  if(spec.style) field.setAttribute("style",spec.style);
  const label=document.createElement("label");
  label.textContent=options.forceLabels && spec.forceLabel ? spec.forceLabel : spec.label;
  const control=createNewSiteFieldControl(spec);
  control.dataset.newKey=spec.key;
  if(spec.special) control.dataset.special=spec.special;
  field.append(label,control);
  return field;
}

let newSiteFieldElementMap=null;
function invalidateNewSiteFieldElementMap(){
  newSiteFieldElementMap=null;
}
function newSiteFieldElementsByKey(){
  const box=document.getElementById("newAllFieldsBox");
  if(newSiteFieldElementMap && box){
    let current=true;
    newSiteFieldElementMap.forEach(elements=>{
      (elements || []).forEach(el=>{
        if(!box.contains(el)) current=false;
      });
    });
    if(current) return newSiteFieldElementMap;
  }
  const map=new Map();
  if(!box){
    newSiteFieldElementMap=map;
    return map;
  }
  box.querySelectorAll("[data-new-key]").forEach(el=>{
    const key=el.dataset.newKey;
    if(!key) return;
    if(!map.has(key)) map.set(key,[]);
    map.get(key).push(el);
  });
  newSiteFieldElementMap=map;
  return map;
}

function renderNewSiteFields(options={}){
  const box=document.getElementById("newAllFieldsBox");
  if(!box) return;
  const fragment=document.createDocumentFragment();
  NEW_SITE_FIELD_SPECS.forEach(spec=>fragment.appendChild(createNewSiteField(spec,options)));
  if(options.wrapGrid){
    const grid=document.createElement("div");
    grid.className="new-data-grid";
    grid.appendChild(fragment);
    box.replaceChildren(grid);
    invalidateNewSiteFieldElementMap();
    return;
  }
  box.replaceChildren(fragment);
  invalidateNewSiteFieldElementMap();
}

function forceRenderNewSiteForm(){
  renderNewSiteFields({wrapGrid:true,forceLabels:true});
}

function renderNewSiteAllFields(){
  renderNewSiteFields();
}



function collectNewSiteAllFields(){
  const raw={};
  newSiteFieldElementsByKey().forEach(elements=>{
    (elements || []).forEach(el=>{
      const key=el.dataset.newKey;
      const val=String(el.value||"").trim();
      if(!key || !val) return;
      raw[key]=val;

      const n=newSiteFieldNorm(key);
      if(n==="perioda kontrol"){
        raw["Perioda kontrol"]=val;
      }
    });
  });
  if(typeof window.applyWatchSelfAliases==="function"){
    window.applyWatchSelfAliases(raw, raw["Hlídáme sami termín"] || raw["Hlídáme kontroly sami"] || "ne");
  }
  return raw;
}

function clearNewSiteAllFields(){
  newSiteFieldElementsByKey().forEach(elements=>{
    (elements || []).forEach(el=>{
      if(el.value!=="") el.value="";
    });
  });
}

function newSiteToRow(docId, d){
  const days = d.nextCheck ? daysBetweenToday(d.nextCheck) : "";
  const raw = {
    "Název": d.name || "",
    "Adresa_GPS": d.gpsAddress || "",
    "Kraj": d.region || "",
    "Popis_zdroje": d.source || "",
    "Kontakt_mapy": d.contact || "",
    "Poznámky_mapy": d.notes || "",
    "Další informace": d.extra || "",
    "Vlastní data": d.allData || "",
    "Příští_kontrola": d.nextCheck || "",
    "Poslední_kontrola": d.lastCheck || "",
    "Dní_do_kontroly": days,
    "Kontrola objednaná": d.ordered ? "ANO" : "NE",
    "Objednaná oprava": d.repairOrdered ? "ANO" : "NE",
    "Hlídáme termín sami": d.noOrder ? "ANO" : "NE",
    "Stav_kontroly": d.repairOrdered ? "Objednaná oprava" : (d.ordered ? "Kontrola objednaná" : (days === "" ? "OK / ostatní" : (days < 0 ? "Propadlá kontrola" : (days <= 30 ? "1–30 dní k termínu" : "OK / ostatní")))),
    "GPS_lat": d.gpsLat || "",
    "GPS_lon": d.gpsLon || "",
    "Zdroj_dat": "Firebase nové místo",
    "Firebase_doc_id": docId
  };
  applyWatchSelfAliases(raw, d.noOrder ? "ano" : raw["Hlídáme termín sami"] || "ne");
  const r = normalize([raw])[0];
  r.id = "firebase_site_" + docId;
  r.isNewSite = true;
  return applyEditToRow(r);
}

async function loadExtraSites(){
  extraSites = [];
  if(firebaseUnifiedPrimary) return;
  if(!firebaseReady || !db) return;
  try{
    const {collection,getDocs}=fb.fsMod;
    const snap=await getDocs(collection(db,"sites"));
    snap.forEach(docSnap => extraSites.push(newSiteToRow(docSnap.id, docSnap.data())));
    rows = csvRows.concat(extraSites).map(applyEditToRow).filter(r=>!deletedSiteIds.has(r.id));
    filters();
    render();
  }catch(e){
    document.getElementById("newSiteStatus").textContent = "Nová místa se nepodařilo načíst: " + e.message;
  }
}


function populateNewRegionOptions(){
  const el=document.getElementById("newRegion");
  if(!el) return;
  const current=el.value;
  const regions=typeof window.appRegionOptions==="function" ? window.appRegionOptions() : APP_REGION_OPTIONS.slice();
  const fragment=document.createDocumentFragment();
  const placeholder=document.createElement("option");
  placeholder.value="";
  placeholder.textContent="Vyber kraj";
  fragment.appendChild(placeholder);
  regions.forEach(v=>{
    const o=document.createElement("option");
    o.value=v;
    o.textContent=v;
    fragment.appendChild(o);
  });
  el.replaceChildren(fragment);
  if(current && regions.includes(current)) el.value=current;
}

function openNewSiteForm(){
  restoreNormalDetailDrawerShell();
  selectedSite=null;
  addSourceBaseSite=null;
  const chooser=document.getElementById("sourceChooser");
  if(chooser){chooser.style.display="none";chooser.replaceChildren();chooser.dataset.renderSignature="";}
  populateNewRegionOptions();
  document.getElementById("drawer").classList.add("open"); document.getElementById("drawer").scrollTop=0;
  document.getElementById("newSiteCard").style.display="block";
  forceRenderNewSiteForm();
  const drawerEl=document.getElementById("drawer");
  if(drawerEl) drawerEl.classList.add("adding-new-site");
  renderNewSiteAllFields();
  setNewSiteModeTitle();
  clearNewSiteAllFields();
  
["newName","newAddress","newRegion","newSource","newSerial","newBatteries","newCapacity","newSets","newExtra","newAllData"].forEach(id=>{
  const el=document.getElementById(id);
  if(el) el.value="";
});

runAfterPaint(()=>{const n=document.getElementById("newName"); if(n){n.focus(); n.scrollIntoView({behavior:"smooth",block:"start"});}});
  document.getElementById("editCard").style.display="none";
  document.getElementById("detailTitle").textContent="Přidat nové místo";
  document.getElementById("detailSub").textContent="Vyplň údaje a ulož místo.";
  const detailTable=document.getElementById("detailTable");
  if(detailTable){
    detailTable.dataset.detailTableMode="new";
    delete detailTable.dataset.detailSignature;
    const row=document.createElement("tr");
    const label=document.createElement("td");
    label.textContent="Nové místo";
    const value=document.createElement("td");
    value.textContent="Po uložení se zobrazí v mapě.";
    row.append(label,value);
    detailTable.replaceChildren(row);
  }
  document.getElementById("newSiteStatus").textContent="";
}


function regionTextNorm(v){
  return safe(v)
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^\p{L}\p{N}]+/gu," ")
    .replace(/\s+/g," ")
    .trim();
}

const REGION_ALIAS_SPECS=[
  ["Hlavní město Praha",["praha","hlavni mesto praha","prague"]],
  ["Středočeský kraj",["stredocesky","stredocesky kraj","central bohemian"]],
  ["Jihočeský kraj",["jihocesky","jihocesky kraj","south bohemian"]],
  ["Plzeňský kraj",["plzensky","plzensky kraj","pilsen"]],
  ["Karlovarský kraj",["karlovarsky","karlovarsky kraj"]],
  ["Ústecký kraj",["ustecky","ustecky kraj"]],
  ["Liberecký kraj",["liberecky","liberecky kraj"]],
  ["Královéhradecký kraj",["kralovehradecky","kralovehradecky kraj"]],
  ["Pardubický kraj",["pardubicky","pardubicky kraj"]],
  ["Kraj Vysočina",["vysocina","kraj vysocina"]],
  ["Jihomoravský kraj",["jihomoravsky","jihomoravsky kraj","south moravian"]],
  ["Olomoucký kraj",["olomoucky","olomoucky kraj"]],
  ["Moravskoslezský kraj",["moravskoslezsky","moravskoslezsky kraj"]],
  ["Zlínský kraj",["zlinsky","zlinsky kraj"]],
  ["Slovensko",["slovensko","slovakia","sk","slovenska republika"]]
];
let normalizedRegionOptionsCache=null;
let normalizedRegionAliasesCache=null;
function normalizedRegionOptions(){
  if(!normalizedRegionOptionsCache){
    normalizedRegionOptionsCache=APP_REGION_OPTIONS.map(region=>({region,norm:regionTextNorm(region)}));
  }
  return normalizedRegionOptionsCache;
}
function normalizedRegionAliases(){
  if(!normalizedRegionAliasesCache){
    normalizedRegionAliasesCache=REGION_ALIAS_SPECS.map(([region,words])=>({
      region,
      words:words
        .map(word=>regionTextNorm(word))
        .filter(Boolean)
        .map(norm=>({norm,boundary:norm.length<=2 ? new RegExp(`(^|\\s)${norm}(\\s|$)`) : null}))
    }));
  }
  return normalizedRegionAliasesCache;
}

function canonicalRegionValue(value){
  const n=regionTextNorm(value);
  if(!n) return "";
  for(const {region,norm} of normalizedRegionOptions()){
    if(n===norm || n.includes(norm)) return region;
  }
  for(const {region,words} of normalizedRegionAliases()){
    if(words.some(({norm,boundary})=>{
      if(n===norm) return true;
      if(boundary) return boundary.test(n);
      return n.includes(norm);
    })) return region;
  }
  return "";
}

function inferRegionFromAddressText(text, addressObj={}){
  const combined=regionTextNorm([
    text,
    addressObj.state,
    addressObj.region,
    addressObj.county,
    addressObj.city,
    addressObj.town,
    addressObj.village,
    addressObj.country,
    addressObj.country_code
  ].filter(Boolean).join(" "));
  if(!combined) return "";

  const fromAddress=canonicalRegionValue([
    addressObj.state,
    addressObj.region,
    addressObj.county,
    addressObj.country,
    addressObj.country_code
  ].filter(Boolean).join(" "));
  if(fromAddress) return fromAddress;

  if(/\b(sk|slovensko|slovakia|bratislava|trnava|poprad|zilina|zvolen|banska bystrica|nitra|kosice)\b/.test(combined)) return "Slovensko";

  const direct=canonicalRegionValue(combined);
  if(direct) return direct;

  const hints=[
    ["Hlavní město Praha",["praha","prague"]],
    ["Jihomoravský kraj",["brno","brno venkov","blansko","breclav","hodonin","vyskov","znojmo"]],
    ["Středočeský kraj",["kladno","kralupy","melnik","nymburk","benesov","kolin","kutna hora","pribram","rakovnik","beroun","mlada boleslav"]],
    ["Jihočeský kraj",["ceske budejovice","cesky krumlov","jindrichuv hradec","pisek","prachatice","strakonice","tabor","cimelice"]],
    ["Plzeňský kraj",["plzen","klatovy","rokycany","tachov","domazlice","plzen sever","plzen jih"]],
    ["Karlovarský kraj",["karlovy vary","cheb","sokolov","vejprty"]],
    ["Ústecký kraj",["usti nad labem","decin","chomutov","litomerice","louny","most","teplice"]],
    ["Liberecký kraj",["liberec","jablonec","semily","ceska lipa","turnov"]],
    ["Královéhradecký kraj",["hradec kralove","jicin","nachod","trutnov","rychnov","vrchlabi","pec pod snezkou"]],
    ["Pardubický kraj",["pardubice","chrudim","svitavy","usti nad orlici","chocen","vamberk"]],
    ["Kraj Vysočina",["jihlava","havlickuv brod","pelhrimov","trebic","zdar nad sazavou","humpolec","pacov","velke mezirici"]],
    ["Olomoucký kraj",["olomouc","prostejov","prerov","sumperk","jesenik","slatinice"]],
    ["Moravskoslezský kraj",["ostrava","opava","frydek mistek","karvina","novy jicin","bruntal","cesky tesin"]],
    ["Zlínský kraj",["zlin","kromeriz","uherske hradiste","uhersky brod","vsetin","slusovice","luhacovice"]]
  ];
  for(const [region,words] of hints){
    if(words.some(word=>combined.includes(word))) return region;
  }
  return "";
}

function geocodeCountryVariants(text){
  const n=regionTextNorm(text);
  const hasSk=/(^|\s)(sk|sr)(\s|$)/.test(n) || /\b(slovensko|slovakia|slovenska republika)\b/.test(n);
  const hasCz=/(^|\s)(cz|cr|ceska republika|cesko|czechia|czech republic)(\s|$)/.test(n);
  return hasSk
    ? ["Slovensko","Slovakia"]
    : hasCz
      ? ["Česko","Česká republika","Czechia"]
      : ["Česko","Česká republika","Czechia","Slovensko","Slovakia"];
}

function geocodeCandidateQueries(address){
  const clean=safe(address).replace(/\s+/g," ").trim();
  if(!clean) return [];
  const countryVariants=geocodeCountryVariants(clean);
  const noParen=clean.replace(/\([^)]*\)/g," ").replace(/\s+/g," ").trim();
  const noCountry=noParen
    .replace(/\b(CZ|CR|ČR|SK|SR|Česko|Cesko|Česká republika|Ceska republika|Czechia|Slovensko|Slovakia)\b/gi," ")
    .replace(/\s+/g," ")
    .replace(/\s*,\s*$/,"")
    .trim();
  const base=[
    clean,
    noParen,
    noCountry,
    clean.replace(/\s+-.*$/,"").trim()
  ].filter(Boolean);
  const out=[];
  const push=q=>{
    const cleanQ=safe(q).replace(/\s+/g," ").replace(/\s*,\s*/g,", ").replace(/^,\s*|\s*,$/g,"").trim();
    if(cleanQ && !out.includes(cleanQ)) out.push(cleanQ);
  };
  const commaVariants=q=>{
    const parts=q.split(",").map(part=>safe(part)).filter(Boolean);
    const variants=[];
    if(parts.length>=2){
      const first=parts[0];
      const second=parts[1];
      const rest=parts.slice(2);
      variants.push([second,first,...rest].join(", "));
      variants.push([second,first].join(", "));
      variants.push(parts.slice(0,2).join(", "));
    }
    return variants;
  };
  const expanded=[];
  base.forEach(q=>{
    expanded.push(q);
    commaVariants(q).forEach(v=>expanded.push(v));
  });
  expanded.forEach(q=>{
    push(q);
    countryVariants.forEach(country=>push(`${q}, ${country}`));
  });
  return out.filter((q,idx,arr)=>q && arr.indexOf(q)===idx).slice(0,42);
}

function geocodeCandidateStructured(address){
  const clean=safe(address).replace(/\([^)]*\)/g," ").replace(/\s+/g," ").trim();
  const parts=clean.split(",").map(part=>safe(part)).filter(Boolean);
  if(parts.length<2) return [];
  const countries=geocodeCountryVariants(clean).map(country=>country.includes("Sloven") || country==="Slovakia" ? "Slovensko" : "Česko")
    .filter((country,idx,arr)=>arr.indexOf(country)===idx);
  const variants=[];
  const add=(street,city,country)=>{
    street=safe(street); city=safe(city); country=safe(country);
    if(street && city) variants.push({street,city,country});
  };
  countries.forEach(country=>{
    add(parts[0],parts[1],country);
    add(parts[1],parts[0],country);
  });
  return variants.filter((item,idx,arr)=>idx===arr.findIndex(other=>other.street===item.street && other.city===item.city && other.country===item.country));
}

function normalizeHouseNumberToken(v){
  return simpleNorm(v).replace(/\s+/g,"").replace(/[^0-9a-z/]/g,"");
}

function houseNumberVariants(v){
  const base=normalizeHouseNumberToken(v);
  if(!base) return [];
  const out=[base];
  if(base.includes("/")){
    const parts=base.split("/").filter(Boolean);
    parts.forEach(part=>out.push(part));
    if(parts.length===2) out.push(`${parts[1]}/${parts[0]}`);
  }
  const letter=base.match(/^(\d+)([a-z])$/);
  if(letter) out.push(letter[1]);
  return out.filter((item,idx,arr)=>item && arr.indexOf(item)===idx);
}

function shouldSkipHouseNumberToken(text,index,token){
  const after=text[index+token.length] || "";
  if(after===".") return true;
  const before=simpleNorm(text.slice(Math.max(0,index-28),index));
  if(/\b(praha|brno|ostrava|plzen|plzeň)\s*$/.test(before)) return true;
  if(/\b(praha|brno|ostrava|plzen|plzeň)\s+\d+\s*$/.test(simpleNorm(text.slice(Math.max(0,index-35),index+token.length)))) return true;
  return false;
}

function geocodeRequestedHouseNumbers(text){
  const clean=safe(text).replace(/\b\d{3}\s?\d{2}\b/g," ");
  const out=[];
  const re=/\b\d{1,5}(?:\s*\/\s*\d{1,5})?[a-zA-Z]?\b/g;
  let m;
  while((m=re.exec(clean))){
    const token=m[0];
    if(shouldSkipHouseNumberToken(clean,m.index,token)) continue;
    const normalized=normalizeHouseNumberToken(token);
    if(!normalized) continue;
    if(/^\d{5}$/.test(normalized)) continue;
    out.push(normalized);
  }
  return out.filter((item,idx,arr)=>item && arr.indexOf(item)===idx);
}

function geocodeReturnedHouseNumbers(item){
  const address=(item && item.address) || {};
  return [
    address.house_number,
    address.housenumber,
    address["addr:housenumber"],
    item && item.housenumber
  ].map(normalizeHouseNumberToken).filter(Boolean);
}

function geocodeHouseNumberMatches(requestedNumbers,item){
  if(!requestedNumbers.length) return true;
  const requested=new Set(requestedNumbers.flatMap(houseNumberVariants));
  const returned=geocodeReturnedHouseNumbers(item);
  const displayNumbers=geocodeRequestedHouseNumbers((item && (item.display_name || item.display)) || "");
  for(const number of [...returned,...displayNumbers]){
    for(const variant of houseNumberVariants(number)){
      if(requested.has(variant)) return true;
    }
  }
  return false;
}

function setGeocodeMessage(message){
  window.lastGeocodeMessage=safe(message);
}

function houseNumberNotVerifiedMessage(address){
  const numbers=geocodeRequestedHouseNumbers(address);
  return numbers.length
    ? `Našel jsem jen ulici/obec, ale neověřil číslo domu ${numbers.join(", ")}. Upřesni adresu nebo zadej GPS ručně.`
    : "";
}

async function geocodeNominatimParams(params,sourceAddress=""){
  try{
    const res=await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`,{headers:{"Accept":"application/json"}});
    if(!res.ok) throw new Error("Geokódování selhalo");
    return geocodePickResult(await res.json(),sourceAddress);
  }catch(e){
    throw e;
  }
}

async function geocodeAddressGeneric(address){
  setGeocodeMessage("");
  const queries=geocodeCandidateQueries(address);
  if(!queries.length) return null;
  let lastError=null;
  const structured=geocodeCandidateStructured(address);
  for(const item of structured){
    const params=new URLSearchParams({
      format:"jsonv2",
      addressdetails:"1",
      limit:"5",
      "accept-language":"cs,sk,en",
      street:item.street,
      city:item.city
    });
    if(item.country) params.set("country",item.country);
    try{
      const picked=await geocodeNominatimParams(params,address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  for(const qText of queries){
    for(const countrycodes of ["cz,sk",""]){
      const params=new URLSearchParams({
        format:"jsonv2",
        addressdetails:"1",
        limit:"5",
        "accept-language":"cs,sk,en",
        q:qText
      });
      if(countrycodes) params.set("countrycodes",countrycodes);
      try{
        const picked=await geocodeNominatimParams(params,address);
        if(picked) return picked;
      }catch(e){
        lastError=e;
      }
    }
  }
  for(const qText of queries.slice(0,10)){
    try{
      const params=new URLSearchParams({q:qText,limit:"5"});
      const res=await fetch(`https://photon.komoot.io/api/?${params.toString()}`,{headers:{"Accept":"application/json"}});
      if(!res.ok){lastError=new Error("Geokódování selhalo");continue;}
      const picked=geocodePickPhoton(await res.json(),address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  if(lastError) console.warn("Geokódování adresy nenašlo výsledek",lastError);
  return null;
}

async function geocodeAddressFast(address){
  setGeocodeMessage("");
  const queries=geocodeCandidateQueries(address).slice(0,12);
  if(!queries.length) return null;
  let lastError=null;
  for(const item of geocodeCandidateStructured(address).slice(0,4)){
    const params=new URLSearchParams({
      format:"jsonv2",
      addressdetails:"1",
      limit:"3",
      "accept-language":"cs,sk,en",
      street:item.street,
      city:item.city
    });
    if(item.country) params.set("country",item.country);
    try{
      const picked=await geocodeNominatimParams(params,address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  for(const qText of queries){
    const params=new URLSearchParams({
      format:"jsonv2",
      addressdetails:"1",
      limit:"3",
      "accept-language":"cs,sk,en",
      countrycodes:"cz,sk",
      q:qText
    });
    try{
      const picked=await geocodeNominatimParams(params,address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  for(const qText of queries.slice(0,4)){
    try{
      const params=new URLSearchParams({q:qText,limit:"3"});
      const res=await fetch(`https://photon.komoot.io/api/?${params.toString()}`,{headers:{"Accept":"application/json"}});
      if(!res.ok){lastError=new Error("Geokódování selhalo");continue;}
      const picked=geocodePickPhoton(await res.json(),address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  if(lastError) console.warn("Rychlé geokódování adresy nenašlo výsledek",lastError);
  return null;
}

function geocodePickResult(data,sourceAddress=""){
  if(!Array.isArray(data) || !data.length) return null;
  const requestedNumbers=geocodeRequestedHouseNumbers(sourceAddress);
  const usable=data
    .map(item=>({item,lat:Number(item.lat),lon:Number(item.lon)}))
    .filter(x=>Number.isFinite(x.lat) && Number.isFinite(x.lon));
  if(!usable.length) return null;
  const scored=usable.map(x=>({
    ...x,
    czSk:x.lat>=47 && x.lat<=51.5 && x.lon>=12 && x.lon<=23,
    houseMatch:geocodeHouseNumberMatches(requestedNumbers,x.item)
  }));
  let czSk=scored.find(x=>x.czSk && x.houseMatch) || scored.find(x=>x.houseMatch);
  if(!czSk && requestedNumbers.length){
    setGeocodeMessage(houseNumberNotVerifiedMessage(sourceAddress));
    return null;
  }
  czSk=czSk || scored.find(x=>x.czSk) || scored[0];
  return {
    lat:String(czSk.item.lat),
    lon:String(czSk.item.lon),
    display:czSk.item.display_name || "",
    address:czSk.item.address || {},
    houseNumberMatched:requestedNumbers.length ? true : undefined
  };
}

function geocodePickPhoton(data,sourceAddress=""){
  const features=Array.isArray(data?.features) ? data.features : [];
  const requestedNumbers=geocodeRequestedHouseNumbers(sourceAddress);
  const usable=features.map(feature=>{
    const coords=feature?.geometry?.coordinates || [];
    const lon=Number(coords[0]);
    const lat=Number(coords[1]);
    const props=feature.properties || {};
    return {
      feature,
      lat,
      lon,
      czSk:lat>=47 && lat<=51.5 && lon>=12 && lon<=23,
      houseMatch:geocodeHouseNumberMatches(requestedNumbers,{
        display:[
          props.name,
          props.street,
          props.housenumber,
          props.city || props.town || props.village,
          props.state,
          props.country
        ].filter(Boolean).join(", "),
        housenumber:props.housenumber,
        address:{house_number:props.housenumber}
      })
    };
  }).filter(x=>Number.isFinite(x.lat) && Number.isFinite(x.lon));
  if(!usable.length) return null;
  let czSk=usable.find(x=>x.czSk && x.houseMatch) || usable.find(x=>x.houseMatch);
  if(!czSk && requestedNumbers.length){
    setGeocodeMessage(houseNumberNotVerifiedMessage(sourceAddress));
    return null;
  }
  czSk=czSk || usable.find(x=>x.czSk) || usable[0];
  const p=czSk.feature.properties || {};
  const display=[
    p.name,
    p.street,
    p.housenumber,
    p.city || p.town || p.village,
    p.state,
    p.country
  ].filter(Boolean).join(", ");
  return {
    lat:String(czSk.lat),
    lon:String(czSk.lon),
    display,
    address:{
      house_number:p.housenumber || "",
      state:p.state || "",
      county:p.county || "",
      city:p.city || p.town || p.village || "",
      country:p.country || "",
      country_code:p.countrycode || ""
    }
  };
}

function setRegionFieldValue(selector,region){
  const clean=safe(region);
  if(!clean) return;
  const el=document.querySelector(selector);
  if(!el || safe(el.value)) return;
  el.value=clean;
}

function isoDateFromAny(v){
  const d=parseDateValue(v);
  if(!d) return "";
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function recalcEditNextCheck(){
  const last=isoDateFromAny(document.getElementById("editLastCheck")?.value);
  const out=document.getElementById("editNextCheck");
  if(!out) return;
  if(!last || !selectedSite){out.value="";return;}
  const d=parseDateValue(last);
  const next=addMonths(d, periodMonths(selectedSite));
  out.value=formatDateCz(next);
}

async function recalcGpsForEditedAddress(){
  const st=document.getElementById("editStatus");
  const address=document.getElementById("editGpsAddress").value.trim();
  if(!address){
    st.textContent="Nejdřív vyplň adresu pro GPS.";
    document.getElementById("editGpsAddress").focus();
    return;
  }
  try{
    st.textContent="Dopočítávám GPS podle adresy...";
    const result=await geocodeAddressGeneric(address);
    if(!result){
      st.textContent=window.lastGeocodeMessage || "Adresa nebyla nalezena.";
      return;
    }
    document.getElementById("editGpsLat").value=result.lat;
    document.getElementById("editGpsLon").value=result.lon;
    st.textContent="GPS doplněno podle adresy.";
  }catch(e){
    st.textContent="Chyba při dopočítání GPS: "+e.message;
  }
}

async function deleteSelectedSite(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){st.textContent="Není vybrané místo.";return;}
  if(!firebaseReady){st.textContent="Firebase není nastavený.";return;}
  if(!currentUser){st.textContent="Nejdřív se přihlaš.";return;}
  if(!isAppAdmin()){st.textContent="Mazat body může jen správce.";return;}

  const ok=confirm("Opravdu smazat toto místo i jeho uložené údaje z Firebase?\\n\\nU původně importovaných míst se uloží také skrytý záznam, aby se bod po obnově znovu nezobrazil.");
  if(!ok) return;

  try{
    const {doc,setDoc,deleteDoc,collection,query,where,getDocs}=fb.fsMod;

    if(selectedSite.isNewSite && selectedSite.raw && selectedSite.raw["Firebase_doc_id"]){
      const docId=selectedSite.raw["Firebase_doc_id"];
      await deleteDoc(doc(db,"sites",docId));
    }else{
      await setDoc(doc(db,"deletedSites",selectedSite.id),{
        siteId:selectedSite.id,
        siteName:selectedSite.adresa || "",
        deletedBy:currentUser.email,
        deletedAt:new Date().toISOString()
      },{merge:true});
    }

    // smaž editaci místa, pokud existuje
    try{ await deleteDoc(doc(db,"siteEdits",selectedSite.id)); }catch(e){}

    // volitelně smaž protokoly a servisní záznamy k místu
    for(const colName of ["protocols","serviceRecords"]){
      try{
        const q=query(collection(db,colName),where("siteId","==",selectedSite.id));
        const snap=await getDocs(q);
        for(const d of snap.docs){ await deleteDoc(d.ref); }
      }catch(e){ console.warn("Mazání kolekce selhalo",colName,e); }
    }

    st.textContent="Místo bylo smazáno/skryto.";
    document.getElementById("drawer").classList.remove("open");
    if(firebaseUnifiedPrimary && typeof window.loadFirebaseSitesUnified==="function"){
      const deletedId=safe(selectedSite && selectedSite.id);
      if(deletedId) deletedSiteIds.add(deletedId);
      const removedRows=typeof window.removeFirebaseSiteRow==="function" ? window.removeFirebaseSiteRow(selectedSite) : null;
      if(removedRows){
        selectedSite=null;
        saveFirebaseRowsCacheForRows(removedRows);
      }else{
        await loadDeletedSites();
        await window.loadFirebaseSitesUnified();
      }
    }else{
      await loadDeletedSites();
      await loadExtraSites();
      render();
    }
    showSaveConfirmation("Bod smazán.");
  }catch(e){
    st.textContent="Chyba při mazání: "+e.message;
  }
}

let deletedSiteIds=new Set();
async function loadDeletedSites(){
  deletedSiteIds=new Set();
  if(!firebaseReady || !db) return;
  const signedUser=currentUser || window.currentUser || window.__authReadyUser || (auth && auth.currentUser) || syncCurrentUserFromCompat();
  if(!signedUser) return;
  try{
    const {collection,getDocs}=fb.fsMod;
    const snap=await getDocs(collection(db,"deletedSites"));
    snap.forEach(d=>deletedSiteIds.add(d.id));
    if(!firebaseUnifiedPrimary){
      rows=csvRows.concat(extraSites).map(applyEditToRow).filter(r=>!deletedSiteIds.has(r.id));
    }
  }catch(e){
    console.warn("Nepodařilo se načíst smazaná místa",e);
  }
}

function filtered(){
  const {search,status,region}=filterControls();
  const q=safe(search && search.value);
  const s=safe(status && status.value);
  const k=safe(region && region.value);
  const qn=searchNorm(q);
  const kn=regionTextNorm(k);
  const signature=`${rowsIndexVersion}\u001f${qn}\u001f${s}\u001f${kn}`;
  if(filteredRowsCache.signature===signature) return filteredRowsCache.rows;
  if(!qn && !s && !kn){
    filteredRowsCache={signature,rows};
    return rows;
  }
  const compactQuery=qn ? qn.replace(/\s+/g,"") : "";

  const result=rows.filter(r=>{
    const st=r._statusText || statusText(r);

    const okQ = !qn || rowMatchesSearch(r,qn,compactQuery);
    const okK = !kn || (r._regionNorm || regionTextNorm(rowRegion(r))) === kn;

    // Růžová je nezávislý příznak z původního Excelu.
    // Proto se filtruje samostatně přes isNoOrderSite(r).
    let okS = true;
    if(s === "Hlídáme termín sami"){
      okS = isNoOrderSite(r);
    }else if(s){
      okS = st === s;
    }

    return okQ && okK && okS;
  });
  filteredRowsCache={signature,rows:result};
  return result;
}
function searchNorm(v){
  return safe(v)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\s+/g," ")
    .trim();
}
const rawSearchTextCache=new WeakMap();
function rawSearchText(raw={}){
  const source=raw || {};
  if(!source || (typeof source!=="object" && typeof source!=="function")) return String(source ?? "");
  const keys=Object.keys(source);
  const cached=rawSearchTextCache.get(source);
  if(cached && sameArrayValues(cached.keys,keys)){
    let same=true;
    for(let i=0;i<keys.length;i++){
      if(cached.values[i]!==source[keys[i]]){
        same=false;
        break;
      }
    }
    if(same) return cached.text;
  }
  const values=keys.map(key=>source[key]);
  const text=keys.concat(values).join(" ");
  rawSearchTextCache.set(source,{keys,values,text});
  return text;
}
function rowSearchText(r){
  const raw=(r&&r.raw)||{};
  return [
    r&&r.adresa,
    r&&r.gpsAddress,
    r&&r.zdroj,
    r&&r.kontakt,
    r&&r.kraj,
    r&&r.poznamky,
    r&&r.id,
    r&&r.firebaseDocId,
    rawSearchText(raw)
  ].join(" ");
}
function rowMatchesSearch(r,normalizedQuery,compactQuery=null){
  if(r && (r._searchRawRef!==r.raw || !r._searchText)) ensureRowFastIndexes(r,Number.isFinite(r.i) ? r.i : 0);
  const hay=(r && r._searchText) || searchNorm(rowSearchText(r));
  if(hay.includes(normalizedQuery)) return true;
  const compactHay=(r && r._compactSearchText) || hay.replace(/\s+/g,"");
  const compact=compactQuery==null ? normalizedQuery.replace(/\s+/g,"") : compactQuery;
  return compact.length>=3 && compactHay.includes(compact);
}
const PLACE_LABEL_RAW_KEYS=["Adresa / umístění","Adresa_GPS","Umístění","Umístění zdroje","Původní adresa / umístění"];
const SOURCE_TYPE_RAW_KEYS=[
  "Popis_zdroje","Zdroj","Jaký zdroj","Kontrolované zařízení","Typ zařízení","Zařízení","Zarizeni",
  "Upravený zdroj"
];
const SOURCE_SERIAL_RAW_KEYS=[
  "Výrobní číslo","Vyrobni cislo","Výrobní_číslo","Vyrobní_číslo","Sériové číslo","Seriove cislo",
  "Serial","Serial number","Zdroj"
];
function rawValueForAny(raw,keys){
  for(const k of keys){
    const v=raw && raw[k];
    const text=safe(v);
    if(text) return text;
  }
  return "";
}
function sitePlaceLabel(site){
  const cached=ensureRowPlaceCache(site);
  return cached ? cached.label : computeSitePlaceLabel(site);
}
function sitePlaceParts(site){
  const raw=(site && site.raw) || {};
  const rawPlace=rawValueForAny(raw,PLACE_LABEL_RAW_KEYS);
  const gpsAddress=safe(site && site.gpsAddress);
  const address=safe(site && site.adresa);
  const rawName=safe(raw["Název"]);
  const lat=Number(site && site.lat);
  const lon=Number(site && site.lon);
  const fallback=detailKey(site) || (site && site.id) || "";
  return {
    label:safe(rawPlace || gpsAddress || address || rawName),
    lat,
    lon,
    fallback,
    fingerprint:[
      rawPlace,
      gpsAddress,
      address,
      rawName,
      Number.isFinite(lat) ? lat.toFixed(5) : "",
      Number.isFinite(lon) ? lon.toFixed(5) : "",
      fallback
    ].join("\u001f")
  };
}
function computeSitePlaceLabel(site,parts=sitePlaceParts(site)){
  return parts.label;
}
function computeSitePlaceGroupKey(site,parts=sitePlaceParts(site)){
  const place=siteDedupValue(parts.label);
  if(place && place.length>=3) return "addr:"+place;
  if(Number.isFinite(parts.lat) && Number.isFinite(parts.lon)) return `gps:${parts.lat.toFixed(5)},${parts.lon.toFixed(5)}`;
  return "single:"+(parts.fallback || "");
}
function ensureRowPlaceCache(site){
  if(!site || typeof site!=="object") return null;
  const raw=(site && site.raw) || {};
  const parts=sitePlaceParts(site);
  if(site._placeRawRef===raw && site._placeFingerprint===parts.fingerprint && site._placeGroupKey){
    return {label:site._placeLabel || "",groupKey:site._placeGroupKey};
  }
  const label=computeSitePlaceLabel(site,parts);
  const groupKey=computeSitePlaceGroupKey(site,parts);
  site._placeRawRef=raw;
  site._placeFingerprint=parts.fingerprint;
  site._placeLabel=label;
  site._placeGroupKey=groupKey;
  return {label,groupKey};
}
function sourceTypeTextFromRaw(raw){
  return rawValueForAny(raw,SOURCE_TYPE_RAW_KEYS);
}
function sourceSerialTextFromRaw(raw){
  return rawValueForAny(raw,SOURCE_SERIAL_RAW_KEYS);
}
function siteSourceParts(site){
  const raw=(site && site.raw) || {};
  const siteType=safe(site && site.zdroj);
  const rawType=sourceTypeTextFromRaw(raw);
  const serial=sourceSerialTextFromRaw(raw);
  return {
    siteType,
    rawType,
    serial,
    fingerprint:[siteType,rawType,serial].join("\u001f")
  };
}
function computeSiteSourceLabel(site,parts=siteSourceParts(site)){
  const type=safe(parts.siteType || parts.rawType);
  const serial=parts.serial;
  if(type && serial && !searchNorm(type).includes(searchNorm(serial))) return `${type} · v.č. ${serial}`;
  return type || (serial ? `Výr. č. ${serial}` : "Zdroj");
}
function computeSiteSourceIdentity(site,parts=siteSourceParts(site)){
  const type=parts.rawType || parts.siteType;
  const serial=parts.serial;
  return searchNorm([type,serial].filter(Boolean).join(" "));
}
function ensureRowSourceCache(site){
  if(!site || typeof site!=="object") return null;
  const raw=(site && site.raw) || {};
  const parts=siteSourceParts(site);
  if(site._sourceRawRef===raw && site._sourceFingerprint===parts.fingerprint && site._sourceLabel){
    return {label:site._sourceLabel,identity:site._sourceIdentity || ""};
  }
  const label=computeSiteSourceLabel(site,parts);
  const identity=computeSiteSourceIdentity(site,parts);
  site._sourceRawRef=raw;
  site._sourceFingerprint=parts.fingerprint;
  site._sourceLabel=label;
  site._sourceIdentity=identity;
  return {label,identity};
}
function siteSourceLabel(site){
  const cached=ensureRowSourceCache(site);
  return cached ? cached.label : computeSiteSourceLabel(site);
}
function siteSourceIdentity(site){
  const cached=ensureRowSourceCache(site);
  return cached ? cached.identity : computeSiteSourceIdentity(site);
}
function sitePlaceGroupKey(site){
  const cached=ensureRowPlaceCache(site);
  return cached ? cached.groupKey : computeSitePlaceGroupKey(site);
}
function sortedRowsBySourceLabel(items=[]){
  return (items || []).slice().sort((a,b)=>siteSourceLabel(a).localeCompare(siteSourceLabel(b),"cs",{sensitivity:"base"}));
}
function cachedRowsByPlaceGroup(key,pool=rows){
  const sourceRows=Array.isArray(pool) ? pool : [];
  if(!key) return [];
  if(sourceRows!==rows){
    return sortedRowsBySourceLabel(sourceRows.filter(r=>sitePlaceGroupKey(r)===key));
  }
  if(
    !siteRowsByPlaceGroupCache
    || siteRowsByPlaceGroupCache.rowsRef!==rows
    || siteRowsByPlaceGroupCache.version!==rowsIndexVersion
  ){
    const map=new Map();
    rows.forEach(row=>{
      const groupKey=sitePlaceGroupKey(row);
      if(!map.has(groupKey)) map.set(groupKey,[]);
      map.get(groupKey).push(row);
    });
    map.forEach((items,groupKey)=>map.set(groupKey,sortedRowsBySourceLabel(items)));
    siteRowsByPlaceGroupCache={rowsRef:rows,version:rowsIndexVersion,map};
  }
  return siteRowsByPlaceGroupCache.map.get(key) || [];
}
function siteSiblingRows(site,pool=rows){
  const key=sitePlaceGroupKey(site);
  return cachedRowsByPlaceGroup(key,pool);
}
function uncachedHasMultipleSourcesForKey(key){
  if(!key) return false;
  let count=0;
  for(const row of rows){
    if(sitePlaceGroupKey(row)===key && ++count>1) return true;
  }
  return false;
}
function siteHasMultipleSources(site){
  const key=sitePlaceGroupKey(site);
  if(!site || typeof site!=="object"){
    return cachedRowsByPlaceGroup(key).length>1;
  }
  if(
    !rowsIndexDirty
    && site._multiSourceVersion===rowsIndexVersion
    && site._multiSourcePlaceKey===key
    && typeof site._multiSourceCache==="boolean"
  ){
    return site._multiSourceCache;
  }
  const hasMultiple=rowsIndexDirty
    ? uncachedHasMultipleSourcesForKey(key)
    : cachedRowsByPlaceGroup(key).length>1;
  if(!rowsIndexDirty){
    site._multiSourceVersion=rowsIndexVersion;
    site._multiSourcePlaceKey=key;
    site._multiSourceCache=hasMultiple;
  }
  return hasMultiple;
}
const recordSourceIdentityCache=new WeakMap();
function recordSourceIdentity(record){
  if(!record) return "";
  const values=[
    record.siteSource,
    record.siteSourceIdentity,
    record.sourceIdentity,
    record.deviceType,
    record.source,
    record.zdroj,
    record.device,
    record.deviceName,
    record.serial,
    record.serialNumber,
    record.vyrobniCislo
  ];
  if(record && (typeof record==="object" || typeof record==="function")){
    const cached=recordSourceIdentityCache.get(record);
    if(
      cached &&
      cached.siteSource===record.siteSource &&
      cached.siteSourceIdentity===record.siteSourceIdentity &&
      cached.sourceIdentity===record.sourceIdentity &&
      cached.deviceType===record.deviceType &&
      cached.source===record.source &&
      cached.zdroj===record.zdroj &&
      cached.device===record.device &&
      cached.deviceName===record.deviceName &&
      cached.serial===record.serial &&
      cached.serialNumber===record.serialNumber &&
      cached.vyrobniCislo===record.vyrobniCislo
    ){
      return cached.identity;
    }
    const identity=searchNorm(values.filter(Boolean).join(" "));
    recordSourceIdentityCache.set(record,{
      siteSource:record.siteSource,
      siteSourceIdentity:record.siteSourceIdentity,
      sourceIdentity:record.sourceIdentity,
      deviceType:record.deviceType,
      source:record.source,
      zdroj:record.zdroj,
      device:record.device,
      deviceName:record.deviceName,
      serial:record.serial,
      serialNumber:record.serialNumber,
      vyrobniCislo:record.vyrobniCislo,
      identity
    });
    return identity;
  }
  return searchNorm(values.filter(Boolean).join(" "));
}
function recordSourceMatchesSite(record,site){
  const siteSource=siteSourceIdentity(site);
  const recordSource=recordSourceIdentity(record);
  if(!siteSource || !recordSource) return false;
  return siteSource===recordSource || siteSource.includes(recordSource) || recordSource.includes(siteSource);
}
function statusPriority(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.priority : 10;
}
function groupRepresentative(groupRows){
  const rowsList=groupRows || [];
  if(rowsList._szzRepresentativeRow) return rowsList._szzRepresentativeRow;
  const representative=rowsList.slice().sort((a,b)=>{
    const pa=statusPriority(a), pb=statusPriority(b);
    if(pb!==pa) return pb-pa;
    return (daysToComputedNext(a)??999999)-(daysToComputedNext(b)??999999);
  })[0];
  if(representative){
    try{
      Object.defineProperty(rowsList,"_szzRepresentativeRow",{value:representative,configurable:true});
    }catch(e){
      rowsList._szzRepresentativeRow=representative;
    }
  }
  return representative;
}
function groupColor(groupRows){
  const rep=groupRepresentative(groupRows);
  return rep ? color(rep) : "#16a34a";
}
function markerRowSignature(row){
  if(!row) return "";
  const detail=detailKey(row);
  const source=siteSourceLabel(row);
  const status=statusText(row);
  if(
    row._markerSignatureDetail===detail &&
    row._markerSignatureSource===source &&
    row._markerSignatureStatus===status &&
    row._markerSignatureValue
  ){
    return row._markerSignatureValue;
  }
  const value=stableSignature([detail,source,status]);
  row._markerSignatureDetail=detail;
  row._markerSignatureSource=source;
  row._markerSignatureStatus=status;
  row._markerSignatureValue=value;
  return value;
}
function groupRowsByPlace(inputRows){
  const mapByKey=new Map();
  (inputRows || []).forEach(r=>{
    const key=sitePlaceGroupKey(r);
    if(!mapByKey.has(key)){
      mapByKey.set(key,{key,rows:[],lat:null,lon:null,label:sitePlaceLabel(r)});
    }
    const group=mapByKey.get(key);
    group.rows.push(r);
    if(!group.label) group.label=sitePlaceLabel(r);
    if(!Number.isFinite(group.lat) && Number.isFinite(r.lat) && Number.isFinite(r.lon)){
      group.lat=r.lat;
      group.lon=r.lon;
    }
  });
  return [...mapByKey.values()].map(group=>{
    group.rows=group.rows.sort((a,b)=>siteSourceLabel(a).localeCompare(siteSourceLabel(b),"cs",{sensitivity:"base"}));
    group._markerRowsSignature=group.rows.map(markerRowSignature).join("\u001e");
    const representative=groupRepresentative(group.rows) || group.rows[0] || null;
    group._representativeRow=representative;
    group._nextSortValue=representative ? (daysToComputedNext(representative) ?? 999999) : 999999;
    return group;
  });
}
function groupPrimaryRow(group){
  return (group && group._representativeRow) || groupRepresentative(group && group.rows) || (group && group.rows && group.rows[0]) || null;
}
function groupNextSortValue(group){
  if(group && Number.isFinite(group._nextSortValue)) return group._nextSortValue;
  const representative=groupPrimaryRow(group);
  return representative ? (daysToComputedNext(representative) ?? 999999) : 999999;
}
function cachedPlaceGroups(inputRows){
  const signature=`${rowsIndexVersion}\u001f${filteredRowsCache.signature || ""}\u001f${inputRows ? inputRows.length : 0}`;
  if(placeGroupsCache.sourceRows===inputRows && placeGroupsCache.signature===signature) return placeGroupsCache.groups;
  const groups=groupRowsByPlace(inputRows);
  placeGroupsCache={sourceRows:inputRows,signature,groups};
  return groups;
}
function sourceButtonHtml(row){
  return `<button class="source-popup-btn" type="button" onclick="openDetailById(${esc(JSON.stringify(detailKey(row)))})">${esc(siteSourceLabel(row))}<small>${esc(statusText(row))}</small></button>`;
}
function groupPopupHtml(group){
  if(!group) return "";
  const rowsInGroup=group.rows || [];
  const primary=rowsInGroup[0] || null;
  const signature=stableSignature([
    group.key || "",
    group.label || "",
    primary ? primary.adresa || "" : "",
    rowsInGroup.length,
    group._markerRowsSignature || rowsInGroup.map(markerRowSignature).join("\u001e")
  ]);
  if(group._popupHtmlSignature===signature && group._popupHtml){
    return group._popupHtml;
  }
  let html="";
  if(rowsInGroup.length<=1){
    const r=primary;
    html=r ? `<b>${esc(r.adresa||"Bez názvu")}</b><br>${esc(siteSourceLabel(r))}<br>${esc(statusText(r))}<br><button onclick="openDetailById(${esc(JSON.stringify(detailKey(r)))})">Detail</button>` : "";
  }else{
    html=`<b>${esc(group.label || "Místo")}</b><br>${rowsInGroup.length} zdrojů na jednom místě<div class="source-popup-list">${rowsInGroup.map(sourceButtonHtml).join("")}</div>`;
  }
  group._popupHtmlSignature=signature;
  group._popupHtml=html;
  return html;
}
function setNewDataFieldValue(key,value){
  const next=String(value || "");
  (newSiteFieldElementsByKey().get(key) || []).forEach(el=>{
    if(el.value!==next) el.value=next;
  });
}
function copyPlaceFieldsToNewSource(site){
  if(!site) return;
  const raw=site.raw || {};
  const place=sitePlaceLabel(site);
  const region=rowRegion(site);
  const contact=safe(site.kontakt || rawValueForAny(raw,["Kontakt","Kontakt_mapy","Hlavní kontakt"]));
  setInputValue("newName",safe(raw["Název"] || site.adresa || place));
  setInputValue("newGpsAddress",place);
  setInputValue("newGpsLat",Number.isFinite(site.lat) ? String(site.lat) : "");
  setInputValue("newGpsLon",Number.isFinite(site.lon) ? String(site.lon) : "");
  setInputValue("newRegion",region || "");
  setInputValue("newContact",contact);
  setInputValue("newSource","");
  setInputValue("newNextCheck","");
  setInputValue("newLastCheck","");
  setInputValue("newNotes","");
  setInputValue("newExtra","");
  setInputChecked("newNoOrder",false);
  setNewDataFieldValue("Název",safe(raw["Název"] || site.adresa || place));
  setNewDataFieldValue("Adresa / umístění",place);
  setNewDataFieldValue("Adresa_GPS",place);
  setNewDataFieldValue("Kraj",region || "");
  setNewDataFieldValue("Kontakt",contact);
  setNewDataFieldValue("Historie oprav","");
  setNewDataFieldValue("Postup testování","");
  setNewDataFieldValue("Jistič UPS","");
  setNewDataFieldValue("Popis_zdroje","");
  setNewDataFieldValue("Zdroj","");
  setNewDataFieldValue("Perioda kontrol",userSiteSharedFieldValue(site,"Perioda kontrol") || "12");
  setNewDataFieldValue("Hlídáme kontroly sami",userSiteSharedFieldValue(site,"Hlídáme sami termín") || "ne");
  setNewDataFieldValue("Smlouva ano/ne",userSiteSharedFieldValue(site,"Smlouva ano/ne") || "ne");
  setNewDataFieldValue("Poznámky",userSiteSharedFieldValue(site,"Poznámky"));
  setNewDataFieldValue("Důležitá poznámka",userSiteSharedFieldValue(site,"Důležitá poznámka"));
}
function openAddSourceForSite(site=selectedSite){
  if(!site) return;
  addSourceBaseSite=site;
  openNewSiteForm();
  addSourceBaseSite=site;
  const title=document.getElementById("drawerTitle") || document.getElementById("detailTitle");
  const sub=document.getElementById("drawerSub") || document.getElementById("detailSub");
  if(title) title.textContent="Přidat další zdroj";
  if(sub) sub.textContent=sitePlaceLabel(site) || site.adresa || "";
  copyPlaceFieldsToNewSource(site);
  const st=document.getElementById("newSiteStatus");
  if(st) st.textContent="Adresa a GPS jsou převzaté z aktuálního místa. Doplň typ zdroje nebo výrobní číslo.";
  runAfterPaint(()=>{
    const source=document.getElementById("newSource") || document.querySelector('#newAllFieldsBox [data-new-key="Popis_zdroje"]');
    if(source){
      source.focus();
      source.scrollIntoView({behavior:"smooth",block:"center"});
    }
  });
}
function openAddSourceForSiteByKey(key){
  const row=findRowByAnyId(key);
  if(row) openAddSourceForSite(row);
}
function sourceChooserRenderSignature(site,siblings,activeKey){
  return [
    rowsIndexVersion,
    activeKey,
    sitePlaceGroupKey(site),
    sitePlaceLabel(site),
    (siblings || []).map(markerRowSignature).join("\u001e")
  ].map(stableSignaturePart).join("\u001f");
}
function bindSourceChooserClick(box){
  if(!box || box.__szzSourceChooserClickBound) return;
  box.__szzSourceChooserClickBound=true;
  box.addEventListener("click",event=>{
    const sourceBtn=event.target.closest && event.target.closest("[data-source-key]");
    if(sourceBtn && box.contains(sourceBtn)){
      window.openDetailById(sourceBtn.getAttribute("data-source-key"));
      return;
    }
    const addBtn=event.target.closest && event.target.closest("[data-add-source]");
    if(addBtn && box.contains(addBtn)){
      openAddSourceForSiteByKey(addBtn.getAttribute("data-add-source"));
    }
  });
}
function renderSourceChooser(site=selectedSite){
  const box=document.getElementById("sourceChooser");
  if(!box) return;
  bindSourceChooserClick(box);
  const siblings=siteSiblingRows(site);
  if(!site){
    box.style.display="none";
    box.replaceChildren();
    box.dataset.renderSignature="";
    return;
  }
  const activeKey=detailKey(site);
  const signature=sourceChooserRenderSignature(site,siblings,activeKey);
  if(box.dataset.renderSignature===signature && box.childElementCount){
    box.style.display="block";
    return;
  }
  box.style.display="block";
  box.dataset.renderSignature=signature;
  const title=document.createElement("div");
  title.className="source-chooser-title";
  title.textContent="Zdroje na tomto místě";
  const buttons=document.createElement("div");
  buttons.className="source-chooser-buttons";
  siblings.forEach(row=>{
    const btn=document.createElement("button");
    btn.className=`source-chooser-button ${detailKey(row)===activeKey ? "active" : ""}`.trim();
    btn.type="button";
    btn.dataset.sourceKey=safe(detailKey(row));
    btn.appendChild(document.createTextNode(siteSourceLabel(row)));
    const meta=document.createElement("small");
    meta.textContent=statusText(row);
    btn.appendChild(meta);
    buttons.appendChild(btn);
  });
  const addBtn=document.createElement("button");
  addBtn.className="source-chooser-button";
  addBtn.type="button";
  addBtn.dataset.addSource=safe(activeKey);
  addBtn.appendChild(document.createTextNode("+ Přidat další zdroj"));
  const addMeta=document.createElement("small");
  addMeta.textContent=sitePlaceLabel(site) || site.adresa || "";
  addBtn.appendChild(addMeta);
  buttons.appendChild(addBtn);
  box.replaceChildren(title,buttons);
}
function rowRegion(r){
  return canonicalRegionValue(r && r.kraj) || inferRegionFromAddressText(rowSearchText(r));
}
let siteRowsByAnyId=new Map();
let siteRowIndexByRef=new WeakMap();
let csvRowsByAnyId=new Map();
let rowsGpsCountCache=0;
let lastVisiblePlaceGroups=[];
let renderRequested=false;
let mapMoveRenderTimer=0;
let rowsIndexVersion=0;
let rowsIndexDirty=true;
let indexedRowsRef=null;
let indexedRowsLength=-1;
let indexedCsvRowsRef=null;
let indexedCsvRowsLength=-1;
let filteredRowsCache={signature:"",rows:[]};
let placeGroupsCache={sourceRows:null,signature:"",groups:[]};
let siteRowsByPlaceGroupCache={rowsRef:null,version:-1,map:new Map()};
let mapRenderCache={groups:null,rowsVersion:-1,boundsKey:""};
let sidebarRenderCache={groups:null,signature:"",renderedEmpty:false};
let sidebarSortedGroupsCache={groups:null,signature:"",visibleGroups:[]};
let renderCountersCache={shown:null,gps:null};
const MAP_MARKER_RENDER_LIMIT=900;

function markRowsDirty(){
  rowsIndexDirty=true;
  filteredRowsCache={signature:"",rows:[]};
  placeGroupsCache={sourceRows:null,signature:"",groups:[]};
  siteRowsByPlaceGroupCache={rowsRef:null,version:-1,map:new Map()};
  mapRenderCache={groups:null,rowsVersion:-1,boundsKey:""};
  sidebarRenderCache={groups:null,signature:"",renderedEmpty:false};
  sidebarSortedGroupsCache={groups:null,signature:"",visibleGroups:[]};
  renderCountersCache={shown:null,gps:null};
}

function installRowsWindowBridge(){
  const existingRows=Array.isArray(window.rows) ? window.rows : rows;
  if(existingRows!==rows && existingRows.length && !rows.length){
    rows=existingRows;
    rowsIndexDirty=true;
  }
  try{
    Object.defineProperty(window,"rows",{
      configurable:true,
      get(){ return rows; },
      set(nextRows){
        const normalized=Array.isArray(nextRows) ? nextRows : [];
        const changed=normalized!==indexedRowsRef || normalized.length!==indexedRowsLength || normalized!==rows;
        rows=normalized;
        if(changed) markRowsDirty();
      }
    });
  }catch(e){
    window.rows=rows;
  }
}

window.markRowsDirty=markRowsDirty;
installRowsWindowBridge();

function rowLookupKeys(r){
  const raw=(r && r.raw) || {};
  const detail=r ? detailKey(r) : "";
  const id=r && r.id;
  const firebaseDocId=r && r.firebaseDocId;
  const rawFirebaseDocId=raw["Firebase_doc_id"];
  const rawAddressKey=raw["Klíč_adresy"];
  const rawPlaceId=raw["ID_mista"];
  if(r && (typeof r==="object" || typeof r==="function")){
    if(
      r._lookupKeysRawRef===raw &&
      r._lookupKeysDetail===detail &&
      r._lookupKeysId===id &&
      r._lookupKeysFirebaseDocId===firebaseDocId &&
      r._lookupKeysRawFirebaseDocId===rawFirebaseDocId &&
      r._lookupKeysRawAddressKey===rawAddressKey &&
      r._lookupKeysRawPlaceId===rawPlaceId &&
      Array.isArray(r._lookupKeysCache)
    ){
      return r._lookupKeysCache;
    }
    const keys=[
      detail,
      id,
      firebaseDocId,
      rawFirebaseDocId,
      rawAddressKey,
      rawPlaceId
    ].map(x=>String(x || "").trim()).filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
    r._lookupKeysRawRef=raw;
    r._lookupKeysDetail=detail;
    r._lookupKeysId=id;
    r._lookupKeysFirebaseDocId=firebaseDocId;
    r._lookupKeysRawFirebaseDocId=rawFirebaseDocId;
    r._lookupKeysRawAddressKey=rawAddressKey;
    r._lookupKeysRawPlaceId=rawPlaceId;
    r._lookupKeysCache=keys;
    return keys;
  }
  return [
    detail,
    r && r.id,
    r && r.firebaseDocId,
    raw["Firebase_doc_id"],
    raw["Klíč_adresy"],
    raw["ID_mista"]
  ].map(x=>String(x || "").trim()).filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
}

function rowRenderFingerprint(r){
  if(!r) return "";
  const sourceIdentity=r._sourceIdentity!==undefined ? r._sourceIdentity : siteSourceIdentity(r);
  return [
    rowLookupKeys(r).join(","),
    Number.isFinite(r.lat) ? Number(r.lat).toFixed(6) : "",
    Number.isFinite(r.lon) ? Number(r.lon).toFixed(6) : "",
    r._regionNorm || "",
    r._statusText || "",
    r._scheduleFingerprint || rowScheduleFingerprint(r),
    r._placeGroupKey || sitePlaceGroupKey(r),
    r._placeLabel || sitePlaceLabel(r),
    sourceIdentity
  ].join("|");
}

function ensureRowFastIndexes(r,index){
  if(!r) return;
  r.i=index;
  if(r._searchRawRef!==r.raw || !r._searchText){
    const text=searchNorm(rowSearchText(r));
    r._searchText=text;
    r._compactSearchText=text.replace(/\s+/g,"");
    r._searchRawRef=r.raw;
  }
  if(r._regionRawRef!==r.raw || !r._regionNorm){
    r._regionNorm=regionTextNorm(rowRegion(r));
    r._regionRawRef=r.raw;
  }
  ensureRowPlaceCache(r);
  ensureRowSourceCache(r);
  const schedule=ensureRowScheduleCache(r);
  r._statusText=schedule ? schedule.status : statusText(r);
}

function rebuildRowLookupCache(){
  const lookup=new Map();
  const indexByRef=new WeakMap();
  let gpsCount=0;
  rows.forEach((r,i)=>{
    if(r && (typeof r==="object" || typeof r==="function")) indexByRef.set(r,i);
    if(inCzSk(r)) gpsCount++;
    rowLookupKeys(r).forEach(key=>{
      if(!lookup.has(key)) lookup.set(key,r);
    });
  });
  siteRowsByAnyId=lookup;
  siteRowIndexByRef=indexByRef;
  rowsGpsCountCache=gpsCount;
  window.siteRowsByAnyId=siteRowsByAnyId;
}

function rebuildCsvRowLookupCache(){
  const lookup=new Map();
  (csvRows || []).forEach((r,i)=>{
    rowLookupKeys(r).forEach(key=>{
      if(!lookup.has(key)) lookup.set(key,i);
    });
  });
  csvRowsByAnyId=lookup;
  indexedCsvRowsRef=csvRows;
  indexedCsvRowsLength=csvRows.length;
  window.csvRowsByAnyId=csvRowsByAnyId;
}

function syncCsvRowLookupCache(){
  if(indexedCsvRowsRef===csvRows && indexedCsvRowsLength===csvRows.length && csvRowsByAnyId.size) return;
  rebuildCsvRowLookupCache();
}

function syncRowIndexes(){
  const rowsRefChanged=indexedRowsRef!==rows;
  const rowsLengthChanged=indexedRowsLength!==rows.length;
  if(!rowsIndexDirty && !rowsRefChanged && !rowsLengthChanged && siteRowsByAnyId.size){
    return;
  }
  let indexesChanged=rowsRefChanged || rowsLengthChanged;
  rows.forEach((r,i)=>{
    const beforeIndex=r && r.i;
    const beforeSearchRawRef=r && r._searchRawRef;
    const beforeRegion=r && r._regionNorm;
    const beforeStatus=r && r._statusText;
    const beforeFingerprint=r && r._renderIndexFingerprint;
    ensureRowFastIndexes(r,i);
    const nextFingerprint=r ? rowRenderFingerprint(r) : "";
    if(r && (beforeIndex!==r.i || beforeSearchRawRef!==r._searchRawRef || beforeRegion!==r._regionNorm || beforeStatus!==r._statusText)){
      indexesChanged=true;
    }
    if(r && beforeFingerprint!==nextFingerprint){
      r._renderIndexFingerprint=nextFingerprint;
      indexesChanged=true;
    }
  });
  if(!indexesChanged){
    indexedRowsRef=rows;
    indexedRowsLength=rows.length;
    rowsIndexDirty=false;
    return;
  }
  rebuildRowLookupCache();
  rowsIndexVersion++;
  siteRowsByPlaceGroupCache={rowsRef:null,version:-1,map:new Map()};
  indexedRowsRef=rows;
  indexedRowsLength=rows.length;
  rowsIndexDirty=false;
}
function rowMatchesAnyLookupKey(row,key){
  const wanted=String(key || "").trim();
  if(!row || !wanted) return false;
  return rowLookupKeys(row).includes(wanted);
}
function rowIndexForRow(row){
  if(!row) return -1;
  if(Number.isFinite(row.i) && rows[row.i]===row) return row.i;
  syncRowIndexes();
  const cached=siteRowIndexByRef.get(row);
  if(Number.isInteger(cached) && rows[cached]===row) return cached;
  return rows.indexOf(row);
}
function csvRowIndexForRow(row){
  if(!row) return -1;
  syncCsvRowLookupCache();
  const keys=rowLookupKeys(row);
  for(const key of keys){
    const idx=csvRowsByAnyId.get(key);
    if(Number.isInteger(idx) && rowMatchesAnyLookupKey(csvRows[idx],key)) return idx;
  }
  return -1;
}
function findRowByAnyId(key,pool=rows){
  const wanted=String(key || "").trim();
  if(!wanted) return null;
  if(pool===rows){
    syncRowIndexes();
    const direct=siteRowsByAnyId && siteRowsByAnyId.get(wanted);
    if(direct) return direct;
  }
  const source=Array.isArray(pool) ? pool : [];
  for(const row of source){
    if(row && rowLookupKeys(row).includes(wanted)) return row;
  }
  return null;
}
function detailKey(r){
  return editCacheKeyForRow(r);
}
function siteRecordKeys(site=selectedSite){
  const raw=(site && site.raw) || {};
  const docId=safe(site && (site.firebaseDocId || raw["Firebase_doc_id"]));
  const siteDetailKey=site ? detailKey(site) : "";
  const siteIdValue=site && site.id;
  const siteFirebaseDocId=site && site.firebaseDocId;
  const rawFirebaseDocId=raw["Firebase_doc_id"];
  const rawAddressKey=raw["Klíč_adresy"];
  const rawPlaceId=raw["ID_mista"];
  if(
    site && typeof site==="object" &&
    site._recordKeysRawRef===raw &&
    site._recordKeysDetailKey===siteDetailKey &&
    site._recordKeysSiteId===siteIdValue &&
    site._recordKeysSiteFirebaseDocId===siteFirebaseDocId &&
    site._recordKeysRawFirebaseDocId===rawFirebaseDocId &&
    site._recordKeysRawAddressKey===rawAddressKey &&
    site._recordKeysRawPlaceId===rawPlaceId &&
    Array.isArray(site._recordKeysCache)
  ){
    return site._recordKeysCache;
  }
  const values=[
    siteDetailKey,
    siteIdValue,
    docId,
    rawFirebaseDocId,
    rawAddressKey,
    docId ? `firebase_${docId}` : "",
    docId ? `firebase_site_${docId}` : ""
  ];
  const keys=values
    .map(x=>String(x || "").trim())
    .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
  if(site && typeof site==="object"){
    site._recordKeysRawRef=raw;
    site._recordKeysDetailKey=siteDetailKey;
    site._recordKeysSiteId=siteIdValue;
    site._recordKeysSiteFirebaseDocId=siteFirebaseDocId;
    site._recordKeysRawFirebaseDocId=rawFirebaseDocId;
    site._recordKeysRawAddressKey=rawAddressKey;
    site._recordKeysRawPlaceId=rawPlaceId;
    site._recordKeysCache=keys;
  }
  return keys;
}
function siteRecordKeySet(site=selectedSite){
  const keys=siteRecordKeys(site);
  if(site && typeof site==="object" && site._recordKeySetKeysRef===keys && site._recordKeySetCache instanceof Set){
    return site._recordKeySetCache;
  }
  const keySet=new Set(keys);
  if(site && typeof site==="object"){
    site._recordKeySetKeysRef=keys;
    site._recordKeySetCache=keySet;
  }
  return keySet;
}
function selectedSiteDocId(site=selectedSite){
  const raw=(site && site.raw) || {};
  return safe(site && (site.firebaseDocId || raw["Firebase_doc_id"]));
}
const recordIdKeysCache=new WeakMap();
function recordIdKeys(record){
  if(!record) return [];
  const siteKeys=Array.isArray(record.siteKeys) ? record.siteKeys : [];
  const rawValues=[
    record.siteId,
    record.siteKey,
    record.siteDocId,
    record.firebaseDocId,
    ...siteKeys
  ];
  if(record && (typeof record==="object" || typeof record==="function")){
    const cached=recordIdKeysCache.get(record);
    if(
      cached &&
      cached.siteId===record.siteId &&
      cached.siteKey===record.siteKey &&
      cached.siteDocId===record.siteDocId &&
      cached.firebaseDocId===record.firebaseDocId &&
      sameArrayValues(cached.siteKeys,siteKeys)
    ){
      return cached.keys;
    }
    const keys=rawValues
      .map(x=>String(x || "").trim())
      .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
    recordIdKeysCache.set(record,{
      siteId:record.siteId,
      siteKey:record.siteKey,
      siteDocId:record.siteDocId,
      firebaseDocId:record.firebaseDocId,
      siteKeys:siteKeys.slice(),
      keys
    });
    return keys;
  }
  return rawValues
    .map(x=>String(x || "").trim())
    .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
}
function createRecordIdDedupe(items=[]){
  const ids=new Set();
  const rememberId=id=>{
    const key=safe(id);
    if(!key) return false;
    if(ids.has(key)) return true;
    ids.add(key);
    return false;
  };
  (items || []).forEach(item=>{
    const id=safe(item && item._id);
    if(id) ids.add(id);
  });
  return {
    has:id=>ids.has(safe(id)),
    add:item=>{
      if(!item) return false;
      const duplicate=rememberId(item._id);
      if(duplicate) return false;
      items.push(item);
      return true;
    }
  };
}
function recordMatchesSite(record,site=selectedSite){
  if(!record || !site) return false;
  const keySet=siteRecordKeySet(site);
  if(recordIdKeys(record).some(k=>keySet.has(k))) return true;
  if(siteHasMultipleSources(site) && !recordSourceMatchesSite(record,site)) return false;

  const siteTexts=siteRecordNormTextKeys(site);
  const recordTexts=recordMatchTextKeys(record);
  return siteTexts.some(a=>recordTexts.some(b=>a===b || (a.length>=10 && b.length>=10 && (a.includes(b) || b.includes(a)))));
}
function siteRecordTextKeys(site=selectedSite){
  if(!site) return [];
  const raw=site.raw || {};
  const siteAddress=site.adresa;
  const siteGpsAddress=site.gpsAddress;
  const rawName=raw["Název"];
  const rawAddress=raw["Adresa / umístění"];
  const rawGpsAddress=raw["Adresa_GPS"];
  const rawPlace=raw["Umístění"];
  const rawSourcePlace=raw["Umístění zdroje"];
  if(
    site && typeof site==="object" &&
    site._recordTextRawRef===raw &&
    site._recordTextSiteAddress===siteAddress &&
    site._recordTextSiteGpsAddress===siteGpsAddress &&
    site._recordTextRawName===rawName &&
    site._recordTextRawAddress===rawAddress &&
    site._recordTextRawGpsAddress===rawGpsAddress &&
    site._recordTextRawPlace===rawPlace &&
    site._recordTextRawSourcePlace===rawSourcePlace &&
    Array.isArray(site._recordTextKeysCache)
  ){
    return site._recordTextKeysCache;
  }
  const keys=[
    siteAddress,
    siteGpsAddress,
    rawName,
    rawAddress,
    rawGpsAddress,
    rawPlace,
    rawSourcePlace
  ]
    .map(x=>String(x || "").trim())
    .filter((x,idx,arr)=>x.length>=4 && arr.indexOf(x)===idx);
  if(site && typeof site==="object"){
    site._recordTextRawRef=raw;
    site._recordTextSiteAddress=siteAddress;
    site._recordTextSiteGpsAddress=siteGpsAddress;
    site._recordTextRawName=rawName;
    site._recordTextRawAddress=rawAddress;
    site._recordTextRawGpsAddress=rawGpsAddress;
    site._recordTextRawPlace=rawPlace;
    site._recordTextRawSourcePlace=rawSourcePlace;
    site._recordTextKeysCache=keys;
  }
  return keys;
}
function siteRecordNormTextKeys(site=selectedSite){
  const keys=siteRecordTextKeys(site);
  if(site && typeof site==="object" && site._recordNormTextKeysRef===keys && Array.isArray(site._recordNormTextKeysCache)){
    return site._recordNormTextKeysCache;
  }
  const normalized=keys.map(searchNorm).filter(x=>x.length>=4);
  if(site && typeof site==="object"){
    site._recordNormTextKeysRef=keys;
    site._recordNormTextKeysCache=normalized;
  }
  return normalized;
}
const recordMatchTextCache=new WeakMap();
function recordMatchTextKeys(record){
  if(!record) return [];
  const values=[record.siteName,record.siteAddress,record.place,record.pbzLocation];
  if(record && (typeof record==="object" || typeof record==="function")){
    const cached=recordMatchTextCache.get(record);
    if(
      cached &&
      cached.siteName===record.siteName &&
      cached.siteAddress===record.siteAddress &&
      cached.place===record.place &&
      cached.pbzLocation===record.pbzLocation
    ){
      return cached.keys;
    }
    const keys=values.map(searchNorm).filter(x=>x.length>=4);
    recordMatchTextCache.set(record,{
      siteName:record.siteName,
      siteAddress:record.siteAddress,
      place:record.place,
      pbzLocation:record.pbzLocation,
      keys
    });
    return keys;
  }
  return values.map(searchNorm).filter(x=>x.length>=4);
}
Object.assign(window,{
  geocodeAddressGeneric,
  geocodeAddressFast,
  geocodeRequestedHouseNumbers,
  inferControlPeriodMonthsFromDateValues,
  inferControlPeriodMonthsFromDates,
  inferRegionFromAddressText,
  canonicalRegionValue,
  regionTextNorm,
  sitePlaceGroupKey,
  sitePlaceLabel,
  siteSourceLabel,
  siteSourceIdentity,
  siteSiblingRows,
  openAddSourceForSite,
  openAddSourceForSiteByKey,
  siteRecordKeys,
  selectedSiteDocId,
  siteRecordTextKeys,
  recordMatchesSite,
  startDetailManualGpsPick,
  startLegacyNewManualGpsPick,
  startOnlyNewManualGpsPick,
  startFbUnifiedManualGpsPick,
  refreshSiteDataFromFirebase,
  applyLatestProtocolDateToRaw,
  applyLatestProtocolToSite,
  updateSiteControlDateFromProtocol,
  waitForFirebaseUser,
  isAppAdmin,
  setRegionFieldValue
});
window.openDetailById=function(id){
  const row=findRowByAnyId(id);
  const idx=rowIndexForRow(row);
  if(idx>=0) return window.openDetail(idx);
};
let mapMarkerCache=new Map();
function mapMarkerSignature(group,fill){
  return [
    Number(group.lat).toFixed(6),
    Number(group.lon).toFixed(6),
    fill,
    group.label || "",
    group._markerRowsSignature || (group.rows || []).map(markerRowSignature).join("\u001e")
  ].join("||");
}
function attachLazyMarkerPopup(marker,group){
  marker.on("click",()=>{
    marker.bindPopup(groupPopupHtml(group)).openPopup();
  });
  return marker;
}
function buildMapMarkerForGroup(group,fill){
  if(group.rows.length>1){
    return attachLazyMarkerPopup(L.marker([group.lat,group.lon],{
      icon:L.divIcon({
        className:"source-group-marker-wrap",
        html:`<div class="source-group-marker" style="background:${esc(fill)}">${group.rows.length}</div>`,
        iconSize:[26,26],
        iconAnchor:[13,13]
      })
    }),group);
  }
  const r=group.rows[0];
  return attachLazyMarkerPopup(L.circleMarker([r.lat,r.lon],{radius:8,color:"#fff",weight:2,fillColor:fill,fillOpacity:.92}),group);
}
function groupHasUsableGps(group){
  return group && Number.isFinite(group.lat) && Number.isFinite(group.lon) && group.lat>=47 && group.lat<=51.5 && group.lon>=12 && group.lon<=23;
}
function groupsInsideCurrentMap(groups){
  const source=groups || [];
  const out=[];
  const pushGroup=group=>{
    if(!groupHasUsableGps(group)) return;
    out.push(group);
  };
  if(!map || typeof map.getBounds!=="function"){
    for(const group of source){
      pushGroup(group);
      if(out.length>=MAP_MARKER_RENDER_LIMIT) break;
    }
    return out;
  }
  let bounds=null;
  try{bounds=map.getBounds().pad(0.18);}catch(e){}
  if(!bounds || typeof bounds.contains!=="function"){
    for(const group of source){
      pushGroup(group);
      if(out.length>=MAP_MARKER_RENDER_LIMIT) break;
    }
    return out;
  }
  for(const group of source){
    if(!groupHasUsableGps(group)) continue;
    if(!bounds.contains([group.lat,group.lon])) continue;
    out.push(group);
    if(out.length>=MAP_MARKER_RENDER_LIMIT) break;
  }
  return out;
}
function currentMapBoundsKey(){
  if(!map || typeof map.getBounds!=="function") return "no-map";
  try{
    const bounds=map.getBounds().pad(0.18);
    const sw=bounds.getSouthWest();
    const ne=bounds.getNorthEast();
    return `${Number(sw.lat).toFixed(4)},${Number(sw.lng).toFixed(4)},${Number(ne.lat).toFixed(4)},${Number(ne.lng).toFixed(4)}`;
  }catch(e){
    return "bounds-error";
  }
}
function renderMapGroups(groups){
  const boundsKey=currentMapBoundsKey();
  if(mapRenderCache.groups===groups && mapRenderCache.rowsVersion===rowsIndexVersion && mapRenderCache.boundsKey===boundsKey && mapMarkerCache.size){
    return;
  }
  const visibleGroups=groupsInsideCurrentMap(groups);
  mapRenderCache={groups,rowsVersion:rowsIndexVersion,boundsKey};
  updateMapMarkers(visibleGroups);
}
function refreshVisibleMapMarkers(){
  if(!lastVisiblePlaceGroups.length) return;
  renderMapGroups(lastVisiblePlaceGroups);
}
function bindMapViewportRendering(){
  if(!map || map.__szzViewportRenderBound || typeof map.on!=="function") return;
  map.__szzViewportRenderBound=true;
  map.on("moveend zoomend",()=>{
    if(mapMoveRenderTimer) cancelAnimationFrame(mapMoveRenderTimer);
    mapMoveRenderTimer=requestAnimationFrame(()=>{
      mapMoveRenderTimer=0;
      refreshVisibleMapMarkers();
    });
  });
}
function updateMapMarkers(groups){
  if(!layer) return;
  const visibleKeys=new Set();
  (groups || []).forEach(group=>{
    if(!Number.isFinite(group.lat) || !Number.isFinite(group.lon)) return;
    const key=group.key || `${group.lat},${group.lon}`;
    const fill=groupColor(group.rows);
    const signature=mapMarkerSignature(group,fill);
    visibleKeys.add(key);
    const cached=mapMarkerCache.get(key);
    if(cached && cached.signature===signature) return;
    if(cached && cached.marker){
      try{layer.removeLayer(cached.marker);}catch(e){}
    }
    const marker=buildMapMarkerForGroup(group,fill);
    marker.addTo(layer);
    mapMarkerCache.set(key,{marker,signature});
  });
  mapMarkerCache.forEach((cached,key)=>{
    if(visibleKeys.has(key)) return;
    if(cached && cached.marker){
      try{layer.removeLayer(cached.marker);}catch(e){}
    }
    mapMarkerCache.delete(key);
  });
}
const SIDEBAR_GROUP_RENDER_LIMIT=160;
function topSidebarGroups(groups,limit=SIDEBAR_GROUP_RENDER_LIMIT){
  const source=groups || [];
  if(source.length<=limit){
    return source.slice().sort((a,b)=>groupNextSortValue(a)-groupNextSortValue(b));
  }
  const top=[];
  source.forEach(group=>{
    const value=groupNextSortValue(group);
    if(top.length>=limit && value>=top[top.length-1].value) return;
    const item={group,value};
    let insertAt=top.length;
    while(insertAt>0 && value<top[insertAt-1].value) insertAt--;
    top.splice(insertAt,0,item);
    if(top.length>limit) top.pop();
  });
  return top.map(item=>item.group);
}
function sidebarVisibleGroups(groups,signature){
  if(sidebarSortedGroupsCache.groups===groups && sidebarSortedGroupsCache.signature===signature){
    return sidebarSortedGroupsCache.visibleGroups;
  }
  const visibleGroups=topSidebarGroups(groups);
  sidebarSortedGroupsCache={groups,signature,visibleGroups};
  return visibleGroups;
}
function bindSidebarListClick(list){
  if(!list || list.__szzSidebarClickBound) return;
  list.__szzSidebarClickBound=true;
  list.addEventListener("click",event=>{
    const item=event.target.closest && event.target.closest("[data-sidebar-detail-key]");
    if(!item || !list.contains(item)) return;
    const key=item.getAttribute("data-sidebar-detail-key");
    if(key) window.openDetailById(key);
  });
}
function renderSidebarGroups(groups){
  const list=document.getElementById("list");
  if(!list) return;
  bindSidebarListClick(list);
  const signature=`${rowsIndexVersion}\u001f${filteredRowsCache.signature || ""}\u001f${groups ? groups.length : 0}`;
  if(sidebarRenderCache.groups===groups && sidebarRenderCache.signature===signature && (list.childElementCount || sidebarRenderCache.renderedEmpty)){
    return;
  }
  const fragment=document.createDocumentFragment();
  sidebarVisibleGroups(groups,signature).forEach(group=>{
    const r=groupPrimaryRow(group);
    if(!r) return;
    fragment.appendChild(createSidebarGroupItem(group,r));
  });
  const renderedEmpty=!fragment.childNodes.length;
  list.replaceChildren(fragment);
  sidebarRenderCache={groups,signature,renderedEmpty};
}
function createSidebarGroupItem(group,r){
  const d=document.createElement("div");
  d.className="item";
  d.dataset.sidebarDetailKey=safe(detailKey(r));
  const title=document.createElement("div");
  title.className="item-title";
  title.textContent=group.label || r.adresa || "Bez názvu";
  d.appendChild(title);

  const meta=document.createElement("div");
  meta.className="item-meta";
  meta.append(document.createTextNode(group.rows.length>1 ? `${group.rows.length} zdrojů na místě` : siteSourceLabel(r)));
  meta.appendChild(document.createElement("br"));
  meta.append(document.createTextNode("Další kontrola: "));
  const next=document.createElement("b");
  next.textContent=displayNext(r) || "není vyplněno";
  meta.appendChild(next);
  d.appendChild(meta);

  if(group.rows.length>1){
    const sources=document.createElement("div");
    sources.className="item-sources";
    group.rows.slice(0,5).forEach(row=>{
      const chip=document.createElement("span");
      chip.className="item-source-chip";
      chip.textContent=siteSourceLabel(row);
      sources.appendChild(chip);
    });
    if(group.rows.length>5){
      const more=document.createElement("span");
      more.className="item-source-chip";
      more.textContent=`+${group.rows.length-5}`;
      sources.appendChild(more);
    }
    d.appendChild(sources);
  }

  const status=document.createElement("span");
  status.className=`pill ${pill(r)}`;
  status.textContent=statusText(r);
  d.appendChild(status);
  return d;
}
function setCounterTextIfChanged(el,value){
  if(el && el.textContent!==String(value)) el.textContent=String(value);
}
function renderCounters(visibleCount,gpsCount){
  if(renderCountersCache.shown!==visibleCount){
    setCounterTextIfChanged(document.getElementById("shownCount"),visibleCount);
    renderCountersCache.shown=visibleCount;
  }
  if(renderCountersCache.gps!==gpsCount){
    setCounterTextIfChanged(document.getElementById("gpsCount"),gpsCount);
    renderCountersCache.gps=gpsCount;
  }
  const box=document.getElementById("gpsBox");
  if(box && (box.style.display!=="none" || box.className!=="notice" || box.childNodes.length)){
    if(box.style.display!=="none") box.style.display="none";
    if(box.className!=="notice") box.className="notice";
    if(box.childNodes.length) box.replaceChildren();
  }
}
function render(){
  syncRowIndexes();
  window.rows=rows;
  if(rows.length) resetFirebaseRowsAutoReload();
  bindMapViewportRendering();
  const vis=filtered();
  const groups=cachedPlaceGroups(vis);
  lastVisiblePlaceGroups=groups;
  renderMapGroups(groups);
  renderSidebarGroups(groups);
  renderCounters(vis.length,rowsGpsCountCache);
}
function requestRender(){
  if(renderRequested) return;
  renderRequested=true;
  requestAnimationFrame(()=>{
    renderRequested=false;
    render();
  });
}
window.requestRender=requestRender;
const FIREBASE_EMPTY_RELOAD_KEY="astipFirebaseEmptyReloadCount";
let firebaseRowsAutoReloadTimer=null;
function hasLoadedRows(){
  return Array.isArray(rows) && rows.length>0;
}
function resetFirebaseRowsAutoReload(){
  try{sessionStorage.removeItem(FIREBASE_EMPTY_RELOAD_KEY);}catch(e){}
}
function firebaseAutoReloadCount(){
  try{return Number(sessionStorage.getItem(FIREBASE_EMPTY_RELOAD_KEY) || "0") || 0;}catch(e){return 0;}
}
function setFirebaseAutoReloadCount(count){
  try{sessionStorage.setItem(FIREBASE_EMPTY_RELOAD_KEY,String(count));}catch(e){}
}
async function scheduleFirebaseRowsAutoReload(delay=9000){
  if(hasLoadedRows()){
    resetFirebaseRowsAutoReload();
    return;
  }
  const nextCount=firebaseAutoReloadCount()+1;
  if(nextCount>3){
    const gps=document.getElementById("gpsBox");
    if(gps){
      gps.style.display="block";
      gps.className="notice err";
      gps.textContent="Body se zatím nenačetly. Zkontroluj přihlášení přes účet @astip.cz nebo oprávnění Firebase a použij ruční obnovení.";
    }
    return;
  }
  setFirebaseAutoReloadCount(nextCount);
  clearTimeout(firebaseRowsAutoReloadTimer);
  firebaseRowsAutoReloadTimer=setTimeout(async()=>{
    if(!firebaseReady || !firebaseUnifiedPrimary) return;
    if(hasLoadedRows()){
      resetFirebaseRowsAutoReload();
      return;
    }
    const signedUser=await waitForFirebaseUser(2500);
    if(!signedUser) return;
    if(typeof window.loadFirebaseSitesUnified==="function"){
      try{await window.loadFirebaseSitesUnified();}catch(e){console.warn("Opakované načtení Firebase selhalo",e);}
    }
    if(hasLoadedRows()){
      resetFirebaseRowsAutoReload();
      return;
    }
    const p=document.getElementById("progress");
    if(p) p.textContent=`Body se zatím nenačetly, zkouším znovu (${nextCount}/3)...`;
    if(nextCount<3){
      scheduleFirebaseRowsAutoReload(Math.min(delay*1.7,30000));
    }
  },delay);
}
window.scheduleFirebaseRowsAutoReload=scheduleFirebaseRowsAutoReload;
function filters(){
  const {status:st,region:kr}=filterControls();
  if(!st || !kr) return;
  const currentStatus=st.value;
  const currentRegion=kr.value;
  const signature=`status:${APP_STATUS_FILTER_OPTIONS.join("|")};region:${APP_REGION_OPTIONS.join("|")}`;
  if(st.dataset.filterOptionsSignature!==signature){
    const statusFragment=document.createDocumentFragment();
    const statusAll=document.createElement("option");
    statusAll.value="";
    statusAll.textContent="Vše";
    statusFragment.appendChild(statusAll);
    APP_STATUS_FILTER_OPTIONS.forEach(v=>{
      const o=document.createElement("option");
      o.value=v;
      o.textContent=v;
      const cls=statusFilterClass(v);
      if(cls) o.className=cls;
      if(cls==="status-red"){o.style.backgroundColor="#fee2e2";o.style.color="#991b1b";}
      if(cls==="status-orange"){o.style.backgroundColor="#ffedd5";o.style.color="#9a3412";}
      if(cls==="status-yellow"){o.style.backgroundColor="#fef3c7";o.style.color="#92400e";}
      if(cls==="status-blue"){o.style.backgroundColor="#dbeafe";o.style.color="#1d4ed8";}
      if(cls==="status-green"){o.style.backgroundColor="#dcfce7";o.style.color="#166534";}
      if(cls==="status-gray"){o.style.backgroundColor="#f1f5f9";o.style.color="#334155";}
      if(cls==="status-pink"){o.style.backgroundColor="#fdf2f8";o.style.color="#9d174d";}
      statusFragment.appendChild(o);
    });
    st.replaceChildren(statusFragment);
    st.dataset.filterOptionsSignature=signature;
  }
  if(kr.dataset.filterOptionsSignature!==signature){
    const regionFragment=document.createDocumentFragment();
    const regionAll=document.createElement("option");
    regionAll.value="";
    regionAll.textContent="Vše";
    regionFragment.appendChild(regionAll);
    APP_REGION_OPTIONS.forEach(v=>{const o=document.createElement("option");o.value=v;o.textContent=v;regionFragment.appendChild(o)});
    kr.replaceChildren(regionFragment);
    kr.dataset.filterOptionsSignature=signature;
  }
  if((currentStatus===""||APP_STATUS_FILTER_OPTIONS.includes(currentStatus))&&st.value!==currentStatus) st.value=currentStatus;
  if((currentRegion===""||APP_REGION_OPTIONS.includes(currentRegion))&&kr.value!==currentRegion) kr.value=currentRegion;
  updateStatusFilterColor();
}
function statusFilterClass(v){
  if(v==="Propadlá kontrola") return "status-red";
  if(v==="1–30 dní k termínu") return "status-orange";
  if(v==="Kontrola objednaná") return "status-yellow";
  if(v==="Objednaná oprava") return "status-blue";
  if(v==="Stop Stav") return "status-gray";
  if(v==="OK / ostatní") return "status-green";
  if(v==="Hlídáme termín sami") return "status-pink";
  return "";
}
function updateStatusFilterColor(){
  const st=filterControls().status;
  if(!st) return;
  const cls=statusFilterClass(st.value);
  const previous=st.dataset.statusFilterClass || "";
  if(previous===cls) return;
  if(previous) st.classList.remove(previous);
  else st.classList.remove("status-red","status-orange","status-yellow","status-blue","status-green","status-gray","status-pink");
  if(cls) st.classList.add(cls);
  st.dataset.statusFilterClass=cls;
}
function fit(){
  syncRowIndexes();
  const pts=[];
  for(const r of filtered()){
    if(inCzSk(r)) pts.push([r.lat,r.lon]);
  }
  if(pts.length)map.fitBounds(pts,{padding:[30,30]});
}
window.fit=fit;

let mapFocusDetailKey="";
let mapFocusReturnHandler=null;
let manualGpsPickHandler=null;
let manualGpsPickMarker=null;
function setMapFocusMode(active){
  document.body.classList.toggle("map-focus-mode", !!active);
  invalidateMapAfterPaint();
}
function setInputValueIfExists(selector,value){
  const el=document.querySelector(selector);
  const next=String(value ?? "");
  if(el && el.value!==next) el.value=next;
}
function beginManualGpsPick(options={}){
  if(manualGpsPickHandler){
    try{map.off("click",manualGpsPickHandler);}catch(e){}
    manualGpsPickHandler=null;
  }
  mapFocusReturnHandler=typeof options.reopen==="function" ? options.reopen : null;
  setMapFocusMode(true);
  const center=map.getCenter();
  runAfterTwoPaints(()=>{
    try{
      L.popup({closeButton:false,autoClose:true})
        .setLatLng(center)
        .setContent(`<b>${esc(options.title || "Vyber místo na mapě")}</b><br>Klikni přímo na budovu nebo vstup. GPS se doplní automaticky.`)
        .openOn(map);
    }catch(e){}
  },120);
  manualGpsPickHandler=async e=>{
    try{map.off("click",manualGpsPickHandler);}catch(_e){}
    manualGpsPickHandler=null;
    const lat=Number(e.latlng.lat.toFixed(6));
    const lon=Number(e.latlng.lng.toFixed(6));
    try{
      if(manualGpsPickMarker) map.removeLayer(manualGpsPickMarker);
      manualGpsPickMarker=L.circleMarker([lat,lon],{radius:10,color:"#111827",weight:2,fillColor:"#2563eb",fillOpacity:.95}).addTo(map);
      manualGpsPickMarker.bindPopup("Ručně vybrané GPS").openPopup();
    }catch(_e){}
    try{
      if(typeof options.apply==="function") await options.apply(lat,lon);
      showSaveConfirmation(options.confirmation || "GPS vybráno z mapy.");
    }catch(err){
      const st=document.getElementById(options.statusId || "editStatus");
      if(st) st.textContent="Chyba uložení GPS z mapy: "+err.message;
    }
    const reopen=typeof options.reopen==="function" ? options.reopen : null;
    mapFocusReturnHandler=null;
    setMapFocusMode(false);
    runAfterTwoPaints(()=>{
      try{map.invalidateSize(true);}catch(_e){}
      if(reopen) reopen();
    });
  };
  map.on("click",manualGpsPickHandler);
}
function showMapFocusLocation(lat,lon,title,subtitle,returnHandler){
  if(!Number.isFinite(lat) || !Number.isFinite(lon)){
    return;
  }
  mapFocusReturnHandler=typeof returnHandler==="function" ? returnHandler : null;
  setMapFocusMode(true);
  const latlng=[lat,lon];
  runAfterTwoPaints(()=>{
    try{
      map.setView(latlng, Math.max(map.getZoom() || 0, 16));
      L.popup({closeButton:false,autoClose:true})
        .setLatLng(latlng)
        .setContent(`<b>${esc(title || "Bod na mapě")}</b>${subtitle ? `<br>${esc(subtitle)}` : ""}`)
        .openOn(map);
    }catch(e){}
  });
}
function showSelectedSiteOnMap(){
  if(!selectedSite) return;
  const st=document.getElementById("editStatus");
  if(!Number.isFinite(selectedSite.lat) || !Number.isFinite(selectedSite.lon)){
    if(st) st.textContent="Bod nemá platné GPS souřadnice.";
    return;
  }
  mapFocusDetailKey=detailKey(selectedSite) || selectedSite.id;
  const drawer=document.getElementById("drawer");
  if(drawer) drawer.classList.remove("open");
  showMapFocusLocation(selectedSite.lat, selectedSite.lon, selectedSite.adresa || "Bez názvu", statusText(selectedSite), null);
}
function returnFromMapFocus(){
  const key=mapFocusDetailKey;
  const handler=mapFocusReturnHandler;
  if(manualGpsPickHandler){
    try{map.off("click",manualGpsPickHandler);}catch(e){}
    manualGpsPickHandler=null;
  }
  mapFocusReturnHandler=null;
  setMapFocusMode(false);
  runAfterTwoPaints(()=>{
    try{map.invalidateSize(true);}catch(e){}
    if(handler) handler();
    else if(key) window.openDetailById(key);
  });
}
window.showSelectedSiteOnMap=showSelectedSiteOnMap;
window.showMapFocusLocation=showMapFocusLocation;
window.returnFromMapFocus=returnFromMapFocus;
window.beginManualGpsPick=beginManualGpsPick;
const siteDedupKeysCache=new WeakMap();
function siteDedupValue(v){
  return safe(v)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\b(ceska republika|slovensko|cr|sr)\b/g," ")
    .replace(/\s+/g," ")
    .trim();
}
function siteDedupRawParts(raw){
  raw=raw || {};
  return {
    name:raw["Název"],
    address:raw["Adresa / umístění"],
    gpsAddress:raw["Adresa_GPS"],
    location:raw["Umístění"],
    sourceLocation:raw["Umístění zdroje"],
    originalAddress:raw["Původní adresa / umístění"],
    sourceType:sourceTypeTextFromRaw(raw),
    sourceSerial:sourceSerialTextFromRaw(raw)
  };
}
function siteDedupPartsEqual(a={},b={}){
  return a.name===b.name &&
    a.address===b.address &&
    a.gpsAddress===b.gpsAddress &&
    a.location===b.location &&
    a.sourceLocation===b.sourceLocation &&
    a.originalAddress===b.originalAddress &&
    a.sourceType===b.sourceType &&
    a.sourceSerial===b.sourceSerial;
}
function siteDedupKeysFromRaw(raw){
  if(raw && typeof raw==="object"){
    const parts=siteDedupRawParts(raw);
    const cached=siteDedupKeysCache.get(raw);
    if(cached && siteDedupPartsEqual(cached.parts,parts)) return cached.keys.slice();
    const keys=computeSiteDedupKeysFromRaw(raw,parts);
    siteDedupKeysCache.set(raw,{parts,keys:keys.slice()});
    return keys;
  }
  return computeSiteDedupKeysFromRaw(raw);
}
function computeSiteDedupKeysFromRaw(raw,parts=siteDedupRawParts(raw || {})){
  const keys=[];
  const seen=new Set();
  const source=siteDedupValue([
    parts.sourceType,
    parts.sourceSerial
  ].filter(Boolean).join(" "));
  function add(prefix,v){
    const n=siteDedupValue(v);
    if(!n || n.length<3) return;
    const values=[n];
    const sorted=n.split(" ").filter(Boolean).sort().join(" ");
    if(sorted && sorted!==n) values.push("sorted:"+sorted);
    values.forEach(value=>{
      const key=source ? `${prefix}_source:${value}|${source}` : `${prefix}:${value}`;
      if(seen.has(key)) return;
      seen.add(key);
      keys.push(key);
    });
  }
  add("name", parts.name);
  [parts.address,parts.gpsAddress,parts.location,parts.sourceLocation,parts.originalAddress].forEach(value=>add("address", value));
  return keys;
}
const rawNonEmptyValueCountCache=new WeakMap();
function rawNonEmptyValueCount(raw={}){
  const source=raw || {};
  if(!source || (typeof source!=="object" && typeof source!=="function")){
    return Object.values(source).filter(v=>safe(v)).length;
  }
  const keys=Object.keys(source);
  const cached=rawNonEmptyValueCountCache.get(source);
  if(cached && sameArrayValues(cached.keys,keys)){
    let same=true;
    for(let i=0;i<keys.length;i++){
      if(cached.values[i]!==source[keys[i]]){
        same=false;
        break;
      }
    }
    if(same) return cached.count;
  }
  const values=keys.map(key=>source[key]);
  const count=values.filter(v=>safe(v)).length;
  rawNonEmptyValueCountCache.set(source,{keys,values,count});
  return count;
}
function siteRowPriority(r,index,preferredDocId=null){
  const raw=r.raw || {};
  const data=r.firebaseData || {};
  let score=rawNonEmptyValueCount(raw);
  const docId=String(r.firebaseDocId || raw["Firebase_doc_id"] || r.id || "");
  if(preferredDocId && docId===String(preferredDocId)) score+=100000;
  if(Number.isFinite(r.lat)&&Number.isFinite(r.lon)) score+=20;
  if(data.manualEntry) score+=1000000;
  if(data.createdAt) score+=100;
  if(data.updatedAt) score+=50;
  if(data.migratedFromCsv) score-=1000;
  if(r.firebaseDocId && !String(r.firebaseDocId).startsWith("site_")) score+=500000;
  return {score,index};
}
function dedupeSiteRows(inputRows,preferredDocId=null){
  const indexed=(inputRows||[]).map((row,index)=>({row,index,priority:siteRowPriority(row,index,preferredDocId)}));
  indexed.sort((a,b)=>b.priority.score-a.priority.score || a.priority.index-b.priority.index);
  const usedKeys=new Map();
  const keep=new Set();
  const duplicateDocIds=[];
  const duplicateRows=[];
  for(const item of indexed){
    const keys=siteDedupKeysFromRaw(item.row.raw || {});
    const matchedKey=keys.find(k=>usedKeys.has(k));
    if(matchedKey){
      const kept=usedKeys.get(matchedKey);
      const raw=item.row.raw || {};
      const keptRaw=(kept && kept.row && kept.row.raw) || {};
      const docId=String(item.row.firebaseDocId || raw["Firebase_doc_id"] || item.row.id || "");
      if(docId) duplicateDocIds.push(docId);
      duplicateRows.push({
        docId,
        id:String(item.row.id || ""),
        title:String(raw["Název"] || raw["Adresa / umístění"] || raw["Adresa_GPS"] || item.row.adresa || ""),
        matchedKey,
        keptDocId:String((kept && kept.row && (kept.row.firebaseDocId || keptRaw["Firebase_doc_id"] || kept.row.id)) || ""),
        keptTitle:String(keptRaw["Název"] || keptRaw["Adresa / umístění"] || keptRaw["Adresa_GPS"] || (kept && kept.row && kept.row.adresa) || "")
      });
      continue;
    }
    keep.add(item.index);
    keys.forEach(k=>usedKeys.set(k,item));
  }
  return {
    rows:indexed.filter(item=>keep.has(item.index)).sort((a,b)=>a.index-b.index).map(item=>item.row),
    duplicateDocIds,
    duplicateRows
  };
}
window.siteDedupKeysFromRaw = siteDedupKeysFromRaw;
window.dedupeSiteRows = dedupeSiteRows;
let filterControlCache=null;
function filterControls(){
  if(
    filterControlCache &&
    filterControlCache.search?.isConnected &&
    filterControlCache.status?.isConnected &&
    filterControlCache.region?.isConnected
  ){
    return filterControlCache;
  }
  filterControlCache={
    search:document.getElementById("search"),
    status:document.getElementById("statusFilter"),
    region:document.getElementById("regionFilter")
  };
  return filterControlCache;
}
function clearFiltersForOpenedSite(){
  const {search,status,region}=filterControls();
  if(search && search.value!=="") search.value="";
  if(status && status.value!=="") status.value="";
  if(region && region.value!=="") region.value="";
  updateStatusFilterColor();
}
function isFirebaseRowHidden(row,openedDocId=""){
  if(!row || !deletedSiteIds || !deletedSiteIds.has(row.id)) return false;
  return !(openedDocId && String(row.firebaseDocId || "")===openedDocId);
}
function hiddenFirebaseRowInfo(row){
  return {
    id:String(row && row.id || ""),
    docId:String(row && row.firebaseDocId || ""),
    title:String((row && row.raw && (row.raw["Název"] || row.raw["Adresa / umístění"] || row.raw["Adresa_GPS"])) || (row && row.adresa) || "")
  };
}
function updateFirebaseLoadReport(firebaseRows,dedupedRows,hiddenRows=[],duplicateRows=[]){
  window.__lastFirebaseLoadReport={
    docs:Array.isArray(firebaseRows)?firebaseRows.length:0,
    afterDedupe:Array.isArray(dedupedRows)?dedupedRows.length:0,
    shown:rows.length,
    duplicateCount:Array.isArray(duplicateRows)?duplicateRows.length:0,
    duplicateRows:Array.isArray(duplicateRows)?duplicateRows:[],
    hiddenCount:Array.isArray(hiddenRows)?hiddenRows.length:0,
    hiddenRows:Array.isArray(hiddenRows)?hiddenRows:[]
  };
}
function openFirebaseRowAfterRender(openDocId){
  if(!openDocId) return;
  const r=findRowByAnyId(openDocId);
  if(!r) return;
  if(Number.isFinite(r.lat)&&Number.isFinite(r.lon)) runAfterPaint(()=>map.setView([r.lat,r.lon],14));
  runAfterTwoPaints(()=>window.openDetailById(openDocId));
}
window.setFirebaseSiteRows = function(firebaseRows, openDocId=null){
  firebaseUnifiedPrimary = true;
  window.firebaseUnifiedPrimary = true;
  window.__firebaseUnifiedPrimary = true;
  const deduped=dedupeSiteRows(firebaseRows, openDocId);
  const openedDocId=openDocId ? String(openDocId) : "";
  csvRows = deduped.rows;
  rebuildCsvRowLookupCache();
  const hiddenRows=[];
  rows = csvRows
    .map((r,i)=>{r.i=i; return applyEditToRow(r);})
    .filter(r=>{
      const hidden=isFirebaseRowHidden(r,openedDocId);
      if(hidden) hiddenRows.push(hiddenFirebaseRowInfo(r));
      return !hidden;
    });
  window.rows = rows;
  updateFirebaseLoadReport(firebaseRows,deduped.rows,hiddenRows,deduped.duplicateRows);
  if(openDocId) clearFiltersForOpenedSite();
  filters();
  render();
  openFirebaseRowAfterRender(openDocId);
  return rows;
};
window.upsertFirebaseSiteRow = function(firebaseRow, openDocId=null){
  if(!firebaseRow) return rows;
  const nextRows = csvRows.slice();
  let existingIndex = csvRowIndexForRow(firebaseRow);
  if(existingIndex<0){
    existingIndex = nextRows.findIndex(r=>{
      if(firebaseRow.firebaseDocId && r.firebaseDocId===firebaseRow.firebaseDocId) return true;
      return r.id && firebaseRow.id && r.id===firebaseRow.id;
    });
  }

  if(existingIndex>=0) nextRows[existingIndex]=firebaseRow;
  else nextRows.push(firebaseRow);

  const targetOpenDocId=openDocId===false ? null : (openDocId || firebaseRow.firebaseDocId || firebaseRow.id);
  const openedDocId=targetOpenDocId ? String(targetOpenDocId) : "";
  const csvIndex=existingIndex>=0 ? existingIndex : nextRows.length-1;
  csvRows=nextRows;
  rebuildCsvRowLookupCache();
  const indexedRow={...firebaseRow,i:csvIndex};
  const nextVisibleRow=applyEditToRow(indexedRow);
  const hiddenRows=[];
  let nextVisibleRows=rows.slice();
  const selectedKey=selectedSite ? (detailKey(selectedSite) || selectedSite.id || selectedSite.firebaseDocId) : "";
  const visibleIndex=nextVisibleRows.findIndex(row=>Number.isFinite(row && row.i) && row.i===csvIndex);
  if(isFirebaseRowHidden(nextVisibleRow,openedDocId)){
    hiddenRows.push(hiddenFirebaseRowInfo(nextVisibleRow));
    if(visibleIndex>=0) nextVisibleRows.splice(visibleIndex,1);
  }else if(visibleIndex>=0){
    nextVisibleRows[visibleIndex]=nextVisibleRow;
  }else{
    const previous=findRowByAnyId(firebaseRow.firebaseDocId || firebaseRow.id || detailKey(firebaseRow));
    const previousIndex=rowIndexForRow(previous);
    if(previousIndex>=0) nextVisibleRows[previousIndex]=nextVisibleRow;
    else nextVisibleRows.push(nextVisibleRow);
  }
  if(selectedKey && rowMatchesAnyLookupKey(nextVisibleRow,selectedKey)) selectedSite=nextVisibleRow;
  rows=nextVisibleRows;
  window.rows=rows;
  updateFirebaseLoadReport(csvRows,csvRows,hiddenRows,[]);
  if(targetOpenDocId) clearFiltersForOpenedSite();
  filters();
  render();
  openFirebaseRowAfterRender(targetOpenDocId);
  return rows;
};
window.removeFirebaseSiteRow = function(site){
  if(!site) return null;
  const raw=(site && site.raw) || {};
  const targetDetailKey=detailKey(site);
  const targetDocId=safe(site.firebaseDocId || raw["Firebase_doc_id"]);
  const targetId=safe(site.id);
  const hasPreciseTarget=!!(targetDetailKey || targetDocId);
  const matchesTarget=row=>{
    const rowRaw=(row && row.raw) || {};
    const rowDetailKey=detailKey(row);
    const rowDocId=safe(row && (row.firebaseDocId || rowRaw["Firebase_doc_id"]));
    const rowId=safe(row && row.id);
    return (targetDetailKey && rowDetailKey===targetDetailKey)
      || (targetDocId && rowDocId===targetDocId)
      || (!hasPreciseTarget && targetId && rowId===targetId);
  };
  const beforeRows=csvRows || [];
  const nextRows=beforeRows.filter(row=>!matchesTarget(row));
  if(nextRows.length===beforeRows.length) return null;
  csvRows=nextRows;
  rebuildCsvRowLookupCache();
  rows=(rows || []).filter(row=>!matchesTarget(row));
  if(selectedSite && matchesTarget(selectedSite)) selectedSite=null;
  window.rows=rows;
  updateFirebaseLoadReport(csvRows,csvRows,[],[]);
  filters();
  render();
  return rows;
};
window.getCurrentCsvRows = function(){
  return originalCsvRows.length ? originalCsvRows : csvRows;
};

const duplicateValueAliases = [
  ["Název","Adresa / umístění","Adresa_GPS","Umístění","Umístění zdroje","Původní adresa / umístění"],
  ["Popis_zdroje","Zdroj","Jaký zdroj"],
  ["Kontakt_mapy","Kontakt","Hlavní kontakt"],
  ["Poznámky_mapy","Poznámky","DŮLEŽITÁ POZNÁMKA"],
  ["Příští_kontrola"],
  ["Poslední_kontrola"],
  ["Dní do kontroly","Dní_do_kontroly"],
  ["Stav_kontroly"],
  ["Barva bodu","Barva_bodu"]
];
function canonicalKey(key){
  for(const group of duplicateValueAliases){
    if(group.includes(key)) return group[0];
  }
  return key;
}

function formatCzDate(v){
  const s=safe(v);
  if(!s) return "";
  const m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if(m) return `${Number(m[3])}.${Number(m[2])}.${m[1]}`;
  const d=new Date(s);
  if(!isNaN(d.getTime())) return `${d.getDate()}.${d.getMonth()+1}.${d.getFullYear()}`;
  return s;
}


const hiddenDataLabels = new Set([
  "příští_kontrola","pristi_kontrola","příští kontrola","pristi kontrola","příští plánovaná kontrola",
  "cena fz v kč","cena fz v kc","cena_fz","cena fz",
  "protokol s fakturou na","protokol_s_fakturou_na","protokol s fakturou",
  "jaký zdroj","jaky zdroj",
  "kontakt_mapy","kontakt mapy",
  "poznámky_mapy","poznamky_mapy","poznámky mapy","poznamky mapy",
  "všechny_termíny","vsechny_terminy","všechny termíny","vsechny terminy",
  "zdrojový_řádek","zdrojovy_radek","zdrojový řádek","zdrojovy radek",
  "důležitá poznámka","dulezita poznamka","důležitá_poznámka","dulezita_poznamka",
  "počet_termínů","pocet_terminu","počet termínů","pocet terminu",

  "stav_kontroly","stav kontroly","stav pro mapu",
  "zdrojový_soubor","zdrojovy_soubor","zdrojový soubor","zdrojovy soubor",
  "poslední_kontrola","posledni_kontrola","poslední kontrola","posledni kontrola","poslední proběhlá kontrola",
  "dní_do_kontroly","dní do kontroly","dni_do_kontroly","dni do kontroly",
  "barva_bodu","barva bodu",
  "gps_lat","gps_lon","gps_status","gps_nalezeno_jako","gps_poznámka","gps_poznamka","gps_raw",
  "klíč_adresy","klic_adresy","klíč adresy","klic adresy",
  "další kontrola podle periody","dalsi kontrola podle periody",
  "zdrojový kód","zdrojovy kod","zdrojovy_kod","zdrojový_kód",
  "firebase_doc_id","id místa","id mista"
]);
function shouldHideDataRow(k){
  const key=String(k||"").trim().toLowerCase();
  if(hiddenDataLabels.has(key)) return true;
  if(key.includes("gps")) return true;
  if(/^měsíc[_\s-]*\d*$/i.test(key) || /^mesic[_\s-]*\d*$/i.test(key)) return true;
  if(/^month[_\s-]*\d*$/i.test(key)) return true;
  if(/^\d{1,2}$/.test(key)) return true;
  return false;
}



async function reverseGeocodeGpsGeneric(lat,lon){
  const url=`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  const res=await fetch(url,{headers:{"Accept":"application/json"}});
  if(!res.ok) throw new Error("Reverse geokódování selhalo");
  const data=await res.json();
  return data.display_name || "";
}

function selectedSiteMatchForSave(row, selectedKey, firebaseDocId){
  if(!row) return false;
  const rowDocId=safe(row.firebaseDocId || (row.raw && row.raw["Firebase_doc_id"]) || "");
  return detailKey(row)===selectedKey || row.id===selectedKey || (firebaseDocId && rowDocId===firebaseDocId);
}

function copySharedDetailEdit(editedRaw,out,keys=[]){
  const sourceKey=(keys || []).find(key=>Object.prototype.hasOwnProperty.call(editedRaw,key));
  if(!sourceKey) return;
  const value=editedRaw[sourceKey];
  (keys || []).forEach(key=>{out[key]=value;});
}

function sharedPlaceEditsFromRaw(editedRaw={}){
  const out={};
  const copy=(from,to=from)=>{
    if(Object.prototype.hasOwnProperty.call(editedRaw,from)){
      out[to]=editedRaw[from];
    }
  };
  copy("Adresa / umístění");
  copy("Adresa / umístění","Původní adresa / umístění");
  copy("Adresa_GPS");
  copy("GPS_lat");
  copy("GPS_lon");
  copy("Kraj");
  copySharedDetailEdit(editedRaw,out,["Název"]);
  copySharedDetailEdit(editedRaw,out,["Kontakt","Kontakt_mapy","Hlavní kontakt","Upravený kontakt"]);
  copySharedDetailEdit(editedRaw,out,["Perioda kontrol","Perioda zkoušky","Perioda zkoušek","Perioda kontroly","Perioda","Četnost","Cetnost","Interval"]);
  copySharedDetailEdit(editedRaw,out,["Hlídáme sami termín","Hlídáme termín sami","Hlídat termín sami","Hlidat termin sami","Hlídáme kontroly sami","Hlidame kontroly sami","Jezdit hlídáme termín sami","Bez objednávky"]);
  copySharedDetailEdit(editedRaw,out,["Smlouva ano/ne","Smlouva (ano/ne)","Smlouva ano ne","Smlouva ano","Smlouva"]);
  copySharedDetailEdit(editedRaw,out,["Důležitá poznámka","DŮLEŽITÁ POZNÁMKA","Důležité poznámky"]);
  copySharedDetailEdit(editedRaw,out,["Poznámky","Poznámky_mapy","Upravené poznámky"]);
  const watchValue=out["Hlídáme sami termín"] || out["Hlídáme kontroly sami"] || out["Hlídat termín sami"];
  if(Object.keys(out).some(key=>dataNormFixed(key).includes("hlidame") || dataNormFixed(key).includes("hlidat"))){
    applyWatchSelfAliases(out,watchValue || "ne");
  }
  return out;
}

function rowIdentityKeys(row){
  return [
    selectedSiteDocId(row),
    row && row.firebaseDocId,
    row && row.id,
    detailKey(row),
    row && row.raw && row.raw["Firebase_doc_id"]
  ].map(safe).filter(Boolean);
}

function rowMatchesIdentity(row,identityKeys){
  if(!row || !identityKeys || !identityKeys.size) return false;
  return rowIdentityKeys(row).some(key=>identityKeys.has(key));
}

async function propagateSharedPlaceEditsToSiblingSources(siblingRows=[],sharedRaw={}){
  const validSiblings=(siblingRows || []).filter(Boolean);
  const keys=Object.keys(sharedRaw || {});
  if(!validSiblings.length || !keys.length) return 0;

  const identityKeys=new Set();
  const {doc,setDoc,serverTimestamp}=fb.fsMod;
  let saved=0;

  for(const sibling of validSiblings){
    const docId=selectedSiteDocId(sibling);
    const selectedKey=detailKey(sibling) || sibling.id || docId;
    rowIdentityKeys(sibling).forEach(key=>identityKeys.add(key));
    const mergedRaw={...(sibling.raw || {}), ...sharedRaw};
    if(docId) mergedRaw["Firebase_doc_id"]=docId;
    if(docId && !mergedRaw["Klíč_adresy"]) mergedRaw["Klíč_adresy"]="firebase_"+docId;
    const lat=num(mergedRaw["GPS_lat"]);
    const lon=num(mergedRaw["GPS_lon"]);
    const edit={
      rawEdits:sharedRaw,
      gpsAddress:sharedRaw["Adresa_GPS"] || "",
      gpsLat:sharedRaw["GPS_lat"] || "",
      gpsLon:sharedRaw["GPS_lon"] || "",
      updatedBy:currentUser?.email || "",
      updatedAt:new Date().toISOString()
    };

    try{
      if(docId && isFirebaseUnifiedRow(sibling)){
        await setDoc(doc(db,"sitesUnified",docId),{
          raw:mergedRaw,
          dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(mergedRaw) : [],
          name:mergedRaw["Název"] || mergedRaw["Adresa / umístění"] || mergedRaw["Adresa_GPS"] || "",
          lat:Number.isFinite(lat) ? lat : null,
          lon:Number.isFinite(lon) ? lon : null,
          updatedBy:currentUser?.email || "",
          updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
        },{merge:true});
      }else{
        await saveLegacySiteEditIfNeeded(selectedKey,edit,sibling);
      }
      editCache[selectedKey]={...(editCache[selectedKey] || editCache[sibling.id] || {}), ...edit};
      if(docId) editCache[docId]={...(editCache[docId] || {}), ...edit};
      saved++;
    }catch(e){
      console.warn("Společná adresa zdroje se nepodařila uložit",sibling,e);
    }
  }

  if(identityKeys.size){
    rows=rows.map(row=>{
      if(!rowMatchesIdentity(row,identityKeys)) return row;
      const raw={...(row.raw || {}), ...sharedRaw};
      const docId=selectedSiteDocId(row);
      if(docId) raw["Firebase_doc_id"]=docId;
      return applyEditToRow({...row, raw, firebaseDocId:docId || row.firebaseDocId});
    });
    window.rows=rows;
  }
  return saved;
}

async function saveSelectedSiteGpsPosition(lat,lon,found={},address=""){
  if(!selectedSite) throw new Error("Není vybrané místo.");
  const selectedKey=detailKey(selectedSite) || selectedSite.id;
  const firebaseDocId=safe(selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "");
  const latText=String(lat);
  const lonText=String(lon);
  const gpsText=`${latText}, ${lonText}`;
  const regionEl=document.querySelector('#detailTable [data-key="Kraj"]');
  let region=safe(regionEl && regionEl.value);
  if(!region) region=inferRegionFromAddressText((found && found.display) || address, (found && found.address) || {});
  if(regionEl && !safe(regionEl.value) && region) regionEl.value=region;

  const editedRaw={
    "GPS_lat":latText,
    "GPS_lon":lonText,
    "Adresa_GPS":gpsText
  };
  if(region) editedRaw["Kraj"]=region;
  const edit={
    rawEdits:editedRaw,
    gpsAddress:gpsText,
    gpsLat:latText,
    gpsLon:lonText,
    updatedBy:(currentUser && currentUser.email) || "",
    updatedAt:new Date().toISOString()
  };
  const matches=(row)=>selectedSiteMatchForSave(row,selectedKey,firebaseDocId);
  const sharedSiblingRows=siteSiblingRows(selectedSite)
    .filter(row=>!selectedSiteMatchForSave(row,selectedKey,firebaseDocId));
  let siblingAddressUpdates=0;

  if(firebaseReady && currentUser && firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    const mergedRaw={...(selectedSite.raw||{}), ...editedRaw, Firebase_doc_id:firebaseDocId};
    if(!mergedRaw["Klíč_adresy"]) mergedRaw["Klíč_adresy"]="firebase_"+firebaseDocId;
    await setDoc(doc(db,"sitesUnified",firebaseDocId),{
      raw:mergedRaw,
      dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(mergedRaw) : [],
      name:mergedRaw["Název"] || mergedRaw["Adresa / umístění"] || mergedRaw["Adresa_GPS"] || "",
      lat,
      lon,
      updatedBy:currentUser.email,
      updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
    },{merge:true});
  }else if(firebaseReady && currentUser){
    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
  }
  if(firebaseReady && currentUser){
    siblingAddressUpdates=await propagateSharedPlaceEditsToSiblingSources(sharedSiblingRows,editedRaw);
  }

  editCache[selectedKey]={...(editCache[selectedKey]||editCache[selectedSite.id]||{}), ...edit};
  if(firebaseDocId) editCache[firebaseDocId]={...(editCache[firebaseDocId]||{}), ...edit};
  const applyGpsEditToRow=(r)=>{
    const raw={...(r.raw||{}), ...editedRaw};
    if(firebaseDocId) raw["Firebase_doc_id"]=firebaseDocId;
    return applyEditToRow({...r, raw, firebaseDocId:firebaseDocId || r.firebaseDocId});
  };
  const lookupKey=safe(firebaseDocId || selectedKey);
  const indexedRow=(lookupKey && findRowByAnyId(lookupKey)) || selectedSite;
  const index=rowIndexForRow(indexedRow);
  if(indexedRow && index>=0 && matches(indexedRow)){
    const nextRows=rows.slice();
    const updated=applyGpsEditToRow(indexedRow);
    nextRows[index]=updated;
    rows=nextRows;
    window.rows=rows;
    selectedSite=updated;
  }else{
    rows=rows.map(r=>matches(r) ? applyGpsEditToRow(r) : r);
    window.rows=rows;
    selectedSite=(lookupKey && findRowByAnyId(lookupKey)) || applyGpsEditToRow(selectedSite);
  }
  saveFirebaseRowsCacheForRows(rows);
  render();
  try{
    if(window.map && window.map.setView) window.map.setView([lat,lon],15);
  }catch(e){}
  if(typeof showSaveConfirmation==="function"){
    showSaveConfirmation(firebaseReady && currentUser
      ? (siblingAddressUpdates ? "GPS poloha uložena i u dalších zdrojů." : "GPS poloha uložena.")
      : "GPS poloha dopočítána.");
  }
  return !!(firebaseReady && currentUser);
}

async function dataAddressToGps(){
  const st=document.getElementById("editStatus");
  const btn=document.getElementById("detailGpsCalcInline") || document.getElementById("calcDataGpsBtn");
  const coordPattern=/^\s*-?\d+(?:[.,]\d+)?\s*[,;]\s*-?\d+(?:[.,]\d+)?\s*$/;
  const addressCandidates=["Adresa / umístění","Původní adresa / umístění","Umístění","Adresa_GPS","Název","Umístění zdroje"]
    .map(k=>document.querySelector(`#detailTable [data-key="${CSS.escape(k)}"]`))
    .map(el=>el ? safe(el.value) : "")
    .filter(Boolean);
  const address=addressCandidates.find(v=>!coordPattern.test(v)) || addressCandidates[0] || "";
  if(!address){if(st)st.textContent="Vyplň adresu.";return;}
  try{
    if(btn) btn.disabled=true;
    if(st)st.textContent="Dopočítávám GPS z adresy...";
    let r=await geocodeAddressFast(address);
    if(!r){
      if(st)st.textContent="Rychlé hledání adresu nenašlo, zkouším podrobněji...";
      r=await geocodeAddressGeneric(address);
    }
    if(!r){
      const region=inferRegionFromAddressText(address);
      const regionEl=document.querySelector('#detailTable [data-key="Kraj"]');
      if(regionEl && !safe(regionEl.value) && region) regionEl.value=region;
      const message=window.lastGeocodeMessage || (region ? "Adresa nebyla nalezena pro GPS, kraj jsem doplnil podle textu adresy." : "Adresa nebyla nalezena.");
      if(st)st.textContent=message;
      return;
    }
    const lat=Number(r.lat);
    const lon=Number(r.lon);
    if(!Number.isFinite(lat) || !Number.isFinite(lon)){
      if(st)st.textContent="Adresa byla nalezena, ale GPS souřadnice nejsou platné.";
      return;
    }
    let latEl=document.querySelector('#detailTable [data-key="GPS_lat"]');
    let lonEl=document.querySelector('#detailTable [data-key="GPS_lon"]');
    let gpsTextEl=document.querySelector('#detailTable [data-key="Adresa_GPS"]');
    let regionEl=document.querySelector('#detailTable [data-key="Kraj"]');
    if(latEl)latEl.value=String(lat);
    if(lonEl)lonEl.value=String(lon);
    if(gpsTextEl)gpsTextEl.value=`${lat}, ${lon}`;
    if(regionEl && !safe(regionEl.value)){
      const region=inferRegionFromAddressText(r.display || address, r.address || {});
      if(region) regionEl.value=region;
    }
    const saved=await saveSelectedSiteGpsPosition(lat,lon,r,address);
    if(st)st.textContent=saved ? "GPS uloženo a bod přesunut na mapě." : "GPS doplněno, ale pro trvalé uložení se přihlaš.";
  }catch(e){
    if(st)st.textContent="Chyba: "+e.message;
  }finally{
    if(btn) btn.disabled=false;
  }
}

function reopenDetailAfterManualGps(key,wasEditing){
  return ()=>{
    if(key) window.openDetailById(key);
    if(wasEditing){
      setTimeout(()=>{
        const btn=document.getElementById("editDataToggleBtn");
        if(btn) btn.click();
      },260);
    }
  };
}

function startDetailManualGpsPick(){
  const key=selectedSite ? (detailKey(selectedSite) || selectedSite.id) : "";
  const wasEditing=!!document.getElementById("detailTable")?.classList.contains("data-edit-table");
  const drawer=document.getElementById("drawer");
  if(drawer) drawer.classList.remove("open");
  beginManualGpsPick({
    title:"Vyber GPS pro tento bod",
    statusId:"editStatus",
    confirmation:"GPS poloha vybrána a uložena.",
    reopen:reopenDetailAfterManualGps(key,wasEditing),
    apply:async(lat,lon)=>{
      setInputValueIfExists('#detailTable [data-key="GPS_lat"]',String(lat));
      setInputValueIfExists('#detailTable [data-key="GPS_lon"]',String(lon));
      setInputValueIfExists('#detailTable [data-key="Adresa_GPS"]',`${lat}, ${lon}`);
      if(selectedSite){
        await saveSelectedSiteGpsPosition(lat,lon,{display:"Ručně vybráno na mapě",address:{}}, "Ručně vybráno na mapě");
      }
    }
  });
}

function startLegacyNewManualGpsPick(){
  const drawer=document.getElementById("drawer");
  if(drawer) drawer.classList.remove("open");
  beginManualGpsPick({
    title:"Vyber GPS pro nové místo",
    statusId:"newSiteStatus",
    confirmation:"GPS nového místa vybráno.",
    reopen:()=>{
      const d=document.getElementById("drawer");
      if(d) d.classList.add("open");
      const card=document.getElementById("newSiteCard");
      if(card){card.style.display="block";card.scrollIntoView({block:"start"});}
    },
    apply:async(lat,lon)=>{
      setInputValueIfExists("#newGpsLat",String(lat));
      setInputValueIfExists("#newGpsLon",String(lon));
      const st=document.getElementById("newSiteStatus");
      if(st) st.textContent="GPS vybráno z mapy.";
    }
  });
}

function startOnlyNewManualGpsPick(){
  const drawer=document.getElementById("drawer");
  if(drawer) drawer.classList.remove("open");
  beginManualGpsPick({
    title:"Vyber GPS pro nové místo",
    statusId:"onlyNewStatus",
    confirmation:"GPS nového místa vybráno.",
    reopen:()=>{
      const d=document.getElementById("drawer");
      if(d) d.classList.add("open");
    },
    apply:async(lat,lon)=>{
      setInputValueIfExists("#onlyNewGpsLat",String(lat));
      setInputValueIfExists("#onlyNewGpsLon",String(lon));
      const st=document.getElementById("onlyNewStatus");
      if(st) st.textContent="GPS vybráno z mapy.";
    }
  });
}

function startFbUnifiedManualGpsPick(){
  const overlay=document.getElementById("fbUnifiedOverlay");
  const panel=document.getElementById("fbUnifiedPanel");
  if(overlay) overlay.classList.remove("open");
  if(panel) panel.classList.remove("open");
  beginManualGpsPick({
    title:"Vyber GPS pro nové místo",
    statusId:"fbUnifiedStatus",
    confirmation:"GPS nového místa vybráno.",
    reopen:()=>{
      const o=document.getElementById("fbUnifiedOverlay");
      const p=document.getElementById("fbUnifiedPanel");
      if(o) o.classList.add("open");
      if(p) p.classList.add("open");
    },
    apply:async(lat,lon)=>{
      setInputValueIfExists('#fbUnifiedPanel [data-fb-key="GPS_lat"]',String(lat));
      setInputValueIfExists('#fbUnifiedPanel [data-fb-key="GPS_lon"]',String(lon));
      const st=document.getElementById("fbUnifiedStatus");
      if(st) st.textContent="GPS vybráno z mapy.";
    }
  });
}

async function dataGpsToAddress(){
  const st=document.getElementById("editStatus");
  const latEl=document.querySelector('#detailTable [data-key="GPS_lat"]');const lonEl=document.querySelector('#detailTable [data-key="GPS_lon"]');
  if(!latEl||!lonEl||!latEl.value||!lonEl.value){if(st)st.textContent="Vyplň GPS lat/lon.";return;}
  try{if(st)st.textContent="Dopočítávám adresu z GPS...";const addr=await reverseGeocodeGpsGeneric(latEl.value,lonEl.value);const addrEl=document.querySelector('#detailTable [data-key="Adresa_GPS"], #detailTable [data-key="Adresa / umístění"], #detailTable [data-key="Umístění"]');if(addrEl)addrEl.value=addr;if(st)st.textContent="Adresa doplněna z GPS.";}catch(e){if(st)st.textContent="Chyba: "+e.message;}
}


function isPlaceholderDataKey(k){
  return /^sloupec\s*\d+$/i.test(dataNormFixed(k));
}

function isFirebaseUnifiedRow(r){
  const raw = (r && r.raw) || {};
  return !!(r && r.firebaseDocId) || safe(raw["Zdroj_dat"]).toLowerCase().includes("firebase");
}

function shouldSkipLegacySiteEdits(site=selectedSite){
  return !!(firebaseUnifiedPrimary && selectedSiteDocId(site) && isFirebaseUnifiedRow(site));
}

async function saveLegacySiteEditIfNeeded(selectedKey,edit,site=selectedSite){
  if(shouldSkipLegacySiteEdits(site)) return false;
  const {doc,setDoc}=fb.fsMod;
  await setDoc(doc(db,"siteEdits",selectedKey),edit,{merge:true});
  return true;
}

function orderedEditableKeys(r){
  const raw = (r && r.raw) || {};
  const out = orderedFixedKeys(raw);

  if(isFirebaseUnifiedRow(r) && Array.isArray(window.firebaseUnifiedEditableKeys)){
    window.firebaseUnifiedEditableKeys.forEach(k=>{
      if(!out.some(existing=>dataNormFixed(existing)===dataNormFixed(k))){
        out.push(k);
      }
    });
  }

  return out;
}

function shouldShowEmptyEditableField(k,label){
  if(isPlaceholderDataKey(k)) return false;
  if(hideDataFixed(k)) return false;
  const n=dataNormFixed(k);
  const l=dataNormFixed(label);
  if(n==="adresa gps" || l==="vyrobni cislo") return true;
  return true;
}

const USER_SITE_DATA_FIELDS = [
  {label:"Název", key:"Název", keys:["Název"]},
  {label:"Adresa / umístění", key:"Adresa / umístění", keys:["Adresa / umístění","Původní adresa / umístění"]},
  {label:"Adresa_GPS", key:"Adresa_GPS", keys:["Adresa_GPS"], readonly:true},
  {label:"Kraj", key:"Kraj", keys:["Kraj","Region","Kraj / oblast"], type:"region"},
  {label:"Popis zdroje", key:"Popis_zdroje", keys:["Popis_zdroje","Jaký zdroj"]},
  {label:"Výrobní číslo", key:"Zdroj", keys:["Výrobní číslo","Výrobní_číslo","Seriové číslo","Sériové číslo","Serial","SN","Zdroj"]},
  {label:"Kontakt", key:"Kontakt", keys:["Kontakt","Kontakt_mapy","Hlavní kontakt"]},
  {label:"Umístění zdroje", key:"Umístění zdroje", keys:["Umístění zdroje","Umístění"]},
  {label:"Historie oprav", key:"Historie oprav", keys:["Historie oprav","Historie_oprav"], type:"textarea"},
  {label:"Postup testování", key:"Postup testování", keys:["Postup testování","Postup testovani"], type:"textarea"},
  {label:"Jistič UPS", key:"Jistič UPS", keys:["Jistič UPS","Jistic UPS","Jističe UPS","Jistič"], type:"textarea"},
  {label:"Poznámky", key:"Poznámky", keys:["Poznámky","Poznámky_mapy"], type:"textarea"},
  {label:"Perioda kontrol", key:"Perioda kontrol", keys:["Perioda kontrol","Perioda zkoušky","Perioda zkoušek","Perioda kontroly","Perioda kontrol (6/12)","Perioda","Četnost","Cetnost","Kontrola","Interval"], type:"period"},
  {label:"Hlídáme sami termín", key:"Hlídáme sami termín", keys:["Hlídáme sami termín","Hlídáme termín sami","Hlídat termín sami","Hlidat termin sami","Hlídáme kontroly sami","Hlidame kontroly sami","Jezdit hlídáme termín sami","Bez objednávky"], type:"yesno"},
  {label:"Smlouva", key:"Smlouva ano/ne", keys:["Smlouva ano/ne","Smlouva (ano/ne)","Smlouva ano ne","Smlouva ano","Smlouva"], type:"yesno"},
  {label:"Cena FZ", key:"Cena FZ", keys:["Cena FZ","Cena FZ v Kč"]},
  {label:"Důležité poznámky", key:"Důležitá poznámka", keys:["Důležitá poznámka","DŮLEŽITÁ POZNÁMKA","Důležité poznámky"], type:"textarea", important:true}
];
window.userSiteDataFields = USER_SITE_DATA_FIELDS.map(f=>({label:f.label,key:f.key,type:f.type||"text"}));

const userSiteFieldSpecLookupCache=new Map();
function userSiteFieldSpecByKey(key){
  const target=dataNormFixed(key);
  if(userSiteFieldSpecLookupCache.has(target)) return userSiteFieldSpecLookupCache.get(target);
  const spec=USER_SITE_DATA_FIELDS.find(item=>dataNormFixed(item.key)===target || dataNormFixed(item.label)===target) || null;
  userSiteFieldSpecLookupCache.set(target,spec);
  return spec;
}

function userSiteSharedFieldValue(site,key){
  const spec=userSiteFieldSpecByKey(key);
  if(!spec) return "";
  return userSiteFieldValue(site,spec,rawForSiteFieldLookup(site));
}

function siteContactForProtocol(site=selectedSite){
  const raw=rawForSiteFieldLookup(site);
  return safe((site && site.kontakt) || firstSiteField(raw,["Kontakt","Kontakt_mapy","Hlavní kontakt","Upravený kontakt"]));
}

function syncOpenProtocolContactFromDetail(site=selectedSite,options={}){
  const el=document.getElementById("protoContacts");
  const form=document.getElementById("protocolForm");
  if(!el || !form || form.style.display==="none") return;
  const next=siteContactForProtocol(site);
  if(!next) return;
  const current=safe(el.value);
  const previous=safe(options.previousContact);
  if(options.force || !current || (previous && dataNormFixed(current)===dataNormFixed(previous))){
    el.value=next;
    if(options.saveDraft) scheduleProtocolDraftSave();
  }
}

const rowDataNormKeyLookupCache=new WeakMap();
function dataNormRowKeyEntries(raw){
  if(!raw || (typeof raw!=="object" && typeof raw!=="function")) return [];
  const keys=Object.keys(raw);
  const signature=keys.join("\u001f");
  const cached=rowDataNormKeyLookupCache.get(raw);
  if(cached && cached.signature===signature) return cached.entries;
  const entries=keys.map(k=>[k,dataNormFixed(k)]);
  rowDataNormKeyLookupCache.set(raw,{signature,entries});
  return entries;
}

function firstSiteField(raw, keys){
  const source=raw || {};
  for(const k of keys || []){
    const v=safe(get(source,k));
    if(v) return v;
  }
  const wanted=(keys || []).map(k=>dataNormFixed(k)).filter(Boolean);
  if(!wanted.length) return "";
  const wantedSet=new Set(wanted);
  for(const [k,n] of dataNormRowKeyEntries(source)){
    if(wantedSet.has(n)){
      const v=safe(source[k]);
      if(v) return v;
    }
  }
  return "";
}

const siteFieldLookupRawCache=new WeakMap();
function rawForSiteFieldLookup(r){
  const raw=(r && r.raw) || {};
  const rawEdits=(r && r.edit && r.edit.rawEdits) || null;
  if(r && (typeof r==="object" || typeof r==="function")){
    const cached=siteFieldLookupRawCache.get(r);
    if(cached && cached.rawRef===raw && cached.rawEditsRef===rawEdits){
      return cached.value;
    }
    const value=rawEdits ? {...raw,...rawEdits} : {...raw};
    siteFieldLookupRawCache.set(r,{rawRef:raw,rawEditsRef:rawEdits,value});
    return value;
  }
  return rawEdits ? {...raw,...rawEdits} : {...raw};
}

function yesNoFixed(v, fallback="ne"){
  const n=dataNormFixed(v);
  if(n==="ano" || n==="yes" || n==="true" || n==="1" || n==="aktivni") return "ano";
  if(n==="ne" || n==="no" || n==="false" || n==="0" || n==="") return "ne";
  return fallback;
}

function regionOptionsFixed(current){
  const map=new Map();
  const add=v=>{
    const clean=safe(v);
    const key=dataNormFixed(clean);
    if(!key && !map.has("")) map.set("", "");
    if(key && !map.has(key)) map.set(key, clean);
  };
  add("");
  APP_REGION_OPTIONS.forEach(add);
  const currentKey=dataNormFixed(current);
  return [...map.entries()].map(([key,v])=>({key,value:v,label:v || "Vyber kraj",selected:key===currentKey}));
}

function userSiteFieldValue(r, spec, rawOverride=null){
  const raw=rawOverride || rawForSiteFieldLookup(r);
  if(spec.type==="period") return detectControlPeriod(raw);
  if(spec.key==="Hlídáme sami termín") return yesNoFixed(getWatchFixed(raw), "ne");
  if(spec.important) return getImportantNoteFixed(raw);
  if(spec.key==="Adresa_GPS"){
    const lat=Number.isFinite(r.lat) ? r.lat : num(raw["GPS_lat"]);
    const lon=Number.isFinite(r.lon) ? r.lon : num(raw["GPS_lon"]);
    if(Number.isFinite(lat) && Number.isFinite(lon)) return `${lat}, ${lon}`;
  }

  let v=firstSiteField(raw, spec.keys);
  if(!v && spec.key==="Název") v=r.adresa || "";
  if(!v && spec.key==="Adresa / umístění") v=firstSiteField(raw,["Umístění","Umístění zdroje"]);
  if(!v && spec.key==="Kontakt") v=r.kontakt || "";
  if(!v && spec.key==="Popis_zdroje") v=r.zdroj || "";
  return v;
}

function createUserSiteSelect(dataKey,options,selectedValue){
  const select=document.createElement("select");
  select.dataset.key=dataKey;
  options.forEach(([value,label])=>{
    const option=document.createElement("option");
    option.value=value;
    option.textContent=label;
    select.appendChild(option);
  });
  select.value=selectedValue;
  return select;
}

function userSiteInput(spec, value, site=null){
  if(spec.type==="region"){
    const select=document.createElement("select");
    select.dataset.key=spec.key;
    regionOptionsFixed(value).forEach(item=>{
      const option=document.createElement("option");
      option.value=item.value;
      option.textContent=item.label;
      option.selected=item.selected;
      select.appendChild(option);
    });
    return select;
  }
  if(spec.type==="period"){
    const periodValue=String(value || "").includes("6") ? "6" : "12";
    return createUserSiteSelect(spec.key,[["6","6 měsíců"],["12","12 měsíců"]],periodValue);
  }
  if(spec.type==="yesno"){
    return createUserSiteSelect(spec.key,[["ne","ne"],["ano","ano"]],yesNoFixed(value));
  }
  if(spec.type==="textarea"){
    const textarea=document.createElement("textarea");
    textarea.dataset.key=spec.key;
    textarea.value=safe(value);
    return textarea;
  }
  if(spec.key==="Adresa_GPS"){
    const raw=rawForSiteFieldLookup(site);
    const gpsLat=Number.isFinite(site && site.lat) ? String(site.lat) : safe(raw["GPS_lat"]);
    const gpsLon=Number.isFinite(site && site.lon) ? String(site.lon) : safe(raw["GPS_lon"]);
    const fragment=document.createDocumentFragment();
    const coordinate=document.createElement("div");
    coordinate.className="gps-coordinate-edit";
    const gpsInput=document.createElement("input");
    gpsInput.dataset.key=spec.key;
    gpsInput.value=safe(value);
    gpsInput.readOnly=true;
    gpsInput.title="GPS souřadnice";
    const calcBtn=document.createElement("button");
    calcBtn.className="secondary";
    calcBtn.type="button";
    calcBtn.id="detailGpsCalcInline";
    calcBtn.textContent="Dopočítat GPS";
    const pickBtn=document.createElement("button");
    pickBtn.className="secondary";
    pickBtn.type="button";
    pickBtn.id="detailGpsPickMapInline";
    pickBtn.textContent="Vybrat na mapě";
    coordinate.append(gpsInput,calcBtn,pickBtn);
    const latLon=document.createElement("div");
    latLon.className="gps-lat-lon-edit";
    const latInput=document.createElement("input");
    latInput.dataset.key="GPS_lat";
    latInput.value=gpsLat;
    latInput.placeholder="GPS lat";
    const lonInput=document.createElement("input");
    lonInput.dataset.key="GPS_lon";
    lonInput.value=gpsLon;
    lonInput.placeholder="GPS lon";
    latLon.append(latInput,lonInput);
    fragment.append(coordinate,latLon);
    return fragment;
  }
  const input=document.createElement("input");
  input.dataset.key=spec.key;
  input.value=safe(value);
  if(spec.readonly){
    input.readOnly=true;
    input.title="Dopočítá se z adresy";
  }
  return input;
}

function renderEditableDataTable(table,r){
  if(!table) return;
  table.classList.remove("history-item","small","detail-history-table");
  const raw=rawForSiteFieldLookup(r);
  const fragment=document.createDocumentFragment();
  USER_SITE_DATA_FIELDS.forEach(spec=>{
    const value=userSiteFieldValue(r,spec,raw);
    const row=document.createElement("tr");
    if(spec.important) row.className="notes-red-row";
    const label=document.createElement("td");
    label.textContent=spec.key==="Adresa_GPS" ? "GPS souřadnice" : spec.label;
    const valueCell=document.createElement("td");
    valueCell.appendChild(userSiteInput(spec,value,r));
    row.append(label,valueCell);
    fragment.appendChild(row);
  });
  table.replaceChildren(fragment);
  table.dataset.detailTableMode="edit";
  delete table.dataset.detailSignature;
}

function userSiteDisplayValue(spec, value){
  return esc(userSiteDisplayText(spec,value));
}

function userSiteDisplayText(spec, value){
  if(spec.type==="period") return value ? `${safe(value)} měsíců` : "";
  if(spec.type==="yesno") return yesNoFixed(value, "ne");
  return safe(value);
}

function dateInputValueFromAny(v){
  const d=v instanceof Date ? v : parseDateValue(v);
  if(!d || isNaN(d.getTime())) return "";
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
function setTextIfChanged(el,text){
  if(el && el.textContent!==String(text)) el.textContent=String(text);
}
function setDisplayIfChanged(el,value){
  if(el && el.style.display!==value) el.style.display=value;
}
function setClassNameIfChanged(el,value){
  if(el && el.className!==value) el.className=value;
}
function setDisabledIfChanged(el,value){
  if(el && el.disabled!==!!value) el.disabled=!!value;
}

function showControlDateDisplay(r){
  const lastBox=document.getElementById("detailLastCheck");
  const nextBox=document.getElementById("detailNextCheck");
  setTextIfChanged(lastBox,formatDateCz(parseDateValue(r.posledni)) || r.posledni || "-");
  setTextIfChanged(nextBox,displayNext(r) || r.pristi || "-");
}

function showControlDateInputs(r){
  const lastBox=document.getElementById("detailLastCheck");
  const nextBox=document.getElementById("detailNextCheck");
  if(lastBox){
    const input=document.createElement("input");
    input.id="detailLastCheckInput";
    input.type="date";
    input.value=dateInputValueFromAny(r.posledni);
    lastBox.replaceChildren(input);
  }
  if(nextBox){
    const input=document.createElement("input");
    input.id="detailNextCheckInput";
    input.type="date";
    input.value=dateInputValueFromAny(computedNextDate(r));
    nextBox.replaceChildren(input);
  }
  const lastInput=document.getElementById("detailLastCheckInput");
  const nextInput=document.getElementById("detailNextCheckInput");
  const periodInput=document.querySelector('#detailTable [data-key="Perioda kontrol"]');
  if(lastInput && nextInput){
    const recalc=()=>{
      const d=parseDateValue(lastInput.value);
      if(!d) return;
      const months=periodInput && periodInput.value==="12" ? 12 : periodInput && periodInput.value==="6" ? 6 : periodMonths(selectedSite || r);
      nextInput.value=dateInputValueFromAny(addMonths(d, months));
    };
    lastInput.addEventListener("change",recalc);
    if(periodInput) periodInput.addEventListener("change",recalc);
  }
}


function addNewDataRowToTable(){
  const keyEl = document.getElementById("newDataKey");
  const valEl = document.getElementById("newDataValue");
  const table = document.getElementById("detailTable");
  if(!keyEl || !valEl || !table) return;

  const key = keyEl.value.trim();
  const val = valEl.value.trim();

  if(!key){
    alert("Vyplň název nového údaje.");
    keyEl.focus();
    return;
  }
  if(!val){
    alert("Vyplň hodnotu nového údaje.");
    valEl.focus();
    return;
  }

  const row = document.createElement("tr");
  row.className = isNoteUser(key) ? "notes-red-row" : "";
  const keyCell=document.createElement("td");
  keyCell.textContent=key;
  const valueCell=document.createElement("td");
  const input=document.createElement("input");
  input.dataset.key=key;
  input.value=val;
  valueCell.appendChild(input);
  row.append(keyCell,valueCell);

  if(isNoteUser(key)){
    table.appendChild(row);
  }else{
    const firstNote = table.querySelector(".notes-red-row");
    if(firstNote) table.insertBefore(row, firstNote);
    else table.appendChild(row);
  }

  keyEl.value = "";
  valEl.value = "";
  keyEl.focus();
}

async function saveAllDataEdits(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }
  if(!firebaseReady){ if(st) st.textContent="Firebase není nastavený."; return; }
  if(!currentUser){ if(st) st.textContent="Nejdřív se přihlaš."; return; }

  const editedRaw={};
  USER_SITE_DATA_FIELDS.forEach(spec=>{
    const el=document.querySelector(`#detailTable [data-key="${CSS.escape(spec.key)}"]`);
    if(!el) return;
    let value=String(el.value || "").trim();
    if(spec.type==="yesno") value=yesNoFixed(value,"ne");
    if(spec.type==="period") value=value==="6" ? "6" : "12";
    if(!value && spec.type!=="yesno" && spec.type!=="period" && !spec.important && spec.key!=="Poznámky") return;
    editedRaw[spec.key]=value;
    if(spec.key==="Poznámky"){
      editedRaw["Poznámky_mapy"]=value;
      editedRaw["Upravené poznámky"]=value;
    }
    if(spec.important){
      (spec.keys || []).forEach(key=>{editedRaw[key]=value;});
    }
  });

  const gpsLat=safe(document.querySelector('#detailTable [data-key="GPS_lat"]')?.value);
  const gpsLon=safe(document.querySelector('#detailTable [data-key="GPS_lon"]')?.value);
  if(gpsLat) editedRaw["GPS_lat"]=gpsLat;
  if(gpsLon) editedRaw["GPS_lon"]=gpsLon;

  const lastCheck=safe(document.getElementById("detailLastCheckInput")?.value);
  const nextCheck=safe(document.getElementById("detailNextCheckInput")?.value);
  if(lastCheck) editedRaw["Poslední_kontrola"]=lastCheck;
  if(nextCheck) editedRaw["Příští_kontrola"]=nextCheck;
  const lastChanged=!!lastCheck && isoDateFromAny(lastCheck)!==isoDateFromAny(selectedSite && selectedSite.posledni);
  const nextChanged=!!nextCheck && isoDateFromAny(nextCheck)!==isoDateFromAny(selectedSite && selectedSite.pristi);
  const cancelOrderedByDateChange=selectedSite && selectedSite.ordered === true && (lastChanged || nextChanged);
  if(cancelOrderedByDateChange){
    editedRaw["Kontrola objednaná"]="NE";
    editedRaw["Objednáno"]="NE";
    editedRaw["Stav pro mapu"]="";
  }
  const datePeriod=inferControlPeriodMonthsFromDateValues(
    lastCheck || editedRaw["Poslední_kontrola"] || (selectedSite && selectedSite.posledni),
    nextCheck || editedRaw["Příští_kontrola"] || (selectedSite && selectedSite.pristi)
  );
  if(datePeriod) editedRaw["Perioda kontrol"]=String(datePeriod);

  applyWatchSelfAliases(editedRaw, editedRaw["Hlídáme sami termín"]);
  const watchSelf=explicitWatchSelfFromRaw(editedRaw)===true;

  try{
    const selectedKey=detailKey(selectedSite) || selectedSite.id;
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    const sharedPlaceEdits=sharedPlaceEditsFromRaw(editedRaw);
    const sharedSiblingRows=Object.keys(sharedPlaceEdits).length
      ? siteSiblingRows(selectedSite).filter(row=>!selectedSiteMatchForSave(row,selectedKey,selectedSiteDocId(selectedSite)))
      : [];
    const edit = {
      rawEdits: editedRaw,
      name: editedRaw["Název"] || editedRaw["Adresa / umístění"] || "",
      contact: editedRaw["Kontakt"] || "",
      source: editedRaw["Popis_zdroje"] || "",
      notes: editedRaw["Poznámky"] || "",
      gpsAddress: editedRaw["Adresa_GPS"] || "",
      gpsLat,
      gpsLon,
      lastCheck,
      nextCheck,
      noOrder: watchSelf,
      updatedBy: currentUser.email,
      updatedAt: new Date().toISOString()
    };
    if(cancelOrderedByDateChange) edit.ordered=false;

    const firebaseDocId=safe(selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "");
    const matchesSelectedEditRow=(row)=>{
      if(!row) return false;
      const rowDocId=safe(row.firebaseDocId || (row.raw && row.raw["Firebase_doc_id"]) || "");
      return detailKey(row)===selectedKey || row.id===selectedKey || (firebaseDocId && rowDocId===firebaseDocId);
    };
    if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
      const mergedRaw={...(selectedSite.raw||{}), ...editedRaw, Firebase_doc_id:firebaseDocId};
      if(!mergedRaw["Klíč_adresy"]) mergedRaw["Klíč_adresy"]="firebase_"+firebaseDocId;
      const lat=num(mergedRaw["GPS_lat"]);
      const lon=num(mergedRaw["GPS_lon"]);
      const firebaseUpdate={
        raw:mergedRaw,
        dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(mergedRaw) : [],
        name:mergedRaw["Název"] || mergedRaw["Adresa / umístění"] || mergedRaw["Adresa_GPS"] || "",
        lat:Number.isFinite(lat) ? lat : null,
        lon:Number.isFinite(lon) ? lon : null,
        updatedBy:currentUser.email,
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      };
      await setDoc(doc(db,"sitesUnified",firebaseDocId), firebaseUpdate, {merge:true});
    }
    const siblingAddressUpdates=await propagateSharedPlaceEditsToSiblingSources(sharedSiblingRows,sharedPlaceEdits);

    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);

    editCache[selectedKey] = {...(editCache[selectedKey]||editCache[selectedSite.id]||{}), ...edit};
    if(firebaseDocId) editCache[firebaseDocId] = {...(editCache[firebaseDocId]||{}), ...edit};
    const applyDataEditToRow=(r)=>{
      const raw={...(r.raw||{}), ...editedRaw};
      if(firebaseDocId) raw["Firebase_doc_id"]=firebaseDocId;
      return applyEditToRow({...r, raw, firebaseDocId:firebaseDocId || r.firebaseDocId});
    };
    const lookupKey=safe(firebaseDocId || selectedKey);
    const indexedRow=(lookupKey && findRowByAnyId(lookupKey)) || selectedSite;
    const index=rowIndexForRow(indexedRow);
    if(indexedRow && index>=0 && matchesSelectedEditRow(indexedRow)){
      const nextRows=rows.slice();
      const updated=applyDataEditToRow(indexedRow);
      nextRows[index]=updated;
      rows=nextRows;
      window.rows=rows;
      selectedSite=updated;
    }else{
      rows=rows.map(r=>matchesSelectedEditRow(r) ? applyDataEditToRow(r) : r);
      window.rows=rows;
      selectedSite=(lookupKey && findRowByAnyId(lookupKey)) || applyDataEditToRow(selectedSite);
    }
    saveFirebaseRowsCacheForRows(rows);

    const siblingText=siblingAddressUpdates ? ` Sdílené řádky propsány i do dalších zdrojů: ${siblingAddressUpdates}.` : "";
    if(st) st.textContent=cancelOrderedByDateChange ? `Data uložena. Objednaná kontrola byla zrušena kvůli změně termínu.${siblingText}` : `Data uložena.${siblingText}`;
    showSaveConfirmation(cancelOrderedByDateChange ? "Data uložena, objednání kontroly zrušeno." : (siblingAddressUpdates ? "Sdílené řádky uloženy pro celé místo." : "Data uložena."));
    const reopenKey=(selectedSite && (detailKey(selectedSite) || selectedSite.firebaseDocId || selectedKey)) || selectedKey;
    render();
    if(selectedSite && Number.isFinite(selectedSite.lat) && Number.isFinite(selectedSite.lon)){
      runAfterPaint(()=>{try{window.map.setView([selectedSite.lat,selectedSite.lon],15);}catch(e){}});
    }
    window.openDetailById(reopenKey);
  }catch(e){
    if(st) st.textContent="Chyba uložení dat: "+e.message;
  }
}

function updateOrderedButton(){
  const btn=document.getElementById("toggleOrderedBtn");
  if(!btn || !selectedSite) return;
  btn.textContent=selectedSite.ordered === true ? "Objednáno" : "Kontrola objednána";
  btn.className=selectedSite.ordered === true ? "secondary ordered-toggle-active" : "secondary";
}
function updateRepairButton(){
  const btn=document.getElementById("toggleRepairBtn");
  if(!btn || !selectedSite) return;
  btn.textContent=selectedSite.repairOrdered === true ? "Oprava objednána" : "Objednaná oprava";
  btn.className=selectedSite.repairOrdered === true ? "secondary repair-toggle-active" : "secondary";
}
function updateStopButton(){
  const btn=document.getElementById("toggleStopBtn");
  if(!btn || !selectedSite) return;
  btn.textContent=selectedSite.stopped === true ? "Stop Stav aktivní" : "Stop Stav";
  btn.className=selectedSite.stopped === true ? "secondary stop-toggle-active" : "secondary";
}

function updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,fallbackSite=null,patch={}){
  const lookupKey=safe(firebaseDocId || selectedKey);
  const existing=(lookupKey && findRowByAnyId(lookupKey)) || fallbackSite;
  const index=rowIndexForRow(existing);
  if(existing && index>=0){
    const nextRows=rows.slice();
    const updated=applyEditToRow(existing);
    nextRows[index]=updated;
    rows=nextRows;
    window.rows=rows;
    return updated;
  }
  rows=rows.map(row=>detailKey(row)===selectedKey ? applyEditToRow(row) : row);
  window.rows=rows;
  return (lookupKey && findRowByAnyId(lookupKey)) || (fallbackSite ? {...fallbackSite,...patch} : null);
}

async function toggleRepairFromDetail(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }
  if(!firebaseReady){ if(st) st.textContent="Firebase není nastavený."; return; }
  if(!currentUser){ if(st) st.textContent="Nejdřív se přihlaš."; return; }

  const selectedKey=detailKey(selectedSite) || selectedSite.id;
  const repairOrdered=selectedSite.repairOrdered !== true;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    const existingEdit=editCache[selectedKey] || editCache[selectedSite.id] || {};
    const edit={
      repairOrdered,
      rawEdits:{...(existingEdit.rawEdits || {}),"Objednaná oprava":repairOrdered ? "ANO" : "NE"},
      updatedBy:currentUser.email,
      updatedAt:new Date().toISOString()
    };

    const firebaseDocId=selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "";
    if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
      const mergedRaw={...(selectedSite.raw||{}), Firebase_doc_id:firebaseDocId};
      mergedRaw["Objednaná oprava"]=repairOrdered ? "ANO" : "NE";
      if(!repairOrdered && simpleNorm(mergedRaw["Stav pro mapu"]).includes("oprava")) mergedRaw["Stav pro mapu"]="";
      if(!mergedRaw["Klíč_adresy"]) mergedRaw["Klíč_adresy"]="firebase_"+firebaseDocId;
      await setDoc(doc(db,"sitesUnified",firebaseDocId),{
        raw:mergedRaw,
        dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(mergedRaw) : [],
        updatedBy:currentUser.email,
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
    }

    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
    editCache[selectedKey]={...existingEdit,...edit};
    selectedSite=updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,selectedSite,{repairOrdered});
    if(st) st.textContent=repairOrdered ? "Oprava označena jako objednaná." : "Objednání opravy zrušeno.";
    showSaveConfirmation(repairOrdered ? "Oprava objednána." : "Objednání opravy zrušeno.");
    render();
    updateRepairButton();
  }catch(e){
    if(st) st.textContent="Chyba uložení objednané opravy: "+e.message;
  }
}

async function toggleOrderedFromDetail(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }
  if(!firebaseReady){ if(st) st.textContent="Firebase není nastavený."; return; }
  if(!currentUser){ if(st) st.textContent="Nejdřív se přihlaš."; return; }

  const selectedKey=detailKey(selectedSite) || selectedSite.id;
  const ordered=selectedSite.ordered !== true;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    const existingEdit=editCache[selectedKey] || editCache[selectedSite.id] || {};
    const edit={
      ordered,
      rawEdits:{
        ...(existingEdit.rawEdits || {}),
        "Kontrola objednaná":ordered ? "ANO" : "NE",
        "Objednáno":ordered ? "ANO" : "NE",
        "Stav pro mapu":ordered ? "Kontrola objednaná" : ""
      },
      updatedBy:currentUser.email,
      updatedAt:new Date().toISOString()
    };

    const firebaseDocId=selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "";
    if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
      const mergedRaw={...(selectedSite.raw||{}), Firebase_doc_id:firebaseDocId};
      mergedRaw["Kontrola objednaná"]=ordered ? "ANO" : "NE";
      mergedRaw["Objednáno"]=ordered ? "ANO" : "NE";
      mergedRaw["Stav pro mapu"]=ordered ? "Kontrola objednaná" : "";
      if(!mergedRaw["Klíč_adresy"]) mergedRaw["Klíč_adresy"]="firebase_"+firebaseDocId;
      await setDoc(doc(db,"sitesUnified",firebaseDocId),{
        raw:mergedRaw,
        dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(mergedRaw) : [],
        updatedBy:currentUser.email,
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
    }

    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
    editCache[selectedKey]={...existingEdit,...edit};
    selectedSite=updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,selectedSite,{ordered});
    if(st) st.textContent=ordered ? "Kontrola označena jako objednaná." : "Objednání kontroly zrušeno.";
    showSaveConfirmation(ordered ? "Kontrola objednána." : "Objednání zrušeno.");
    render();
    updateOrderedButton();
  }catch(e){
    if(st) st.textContent="Chyba uložení objednání: "+e.message;
  }
}

async function toggleStopFromDetail(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }
  if(!firebaseReady){ if(st) st.textContent="Firebase není nastavený."; return; }
  if(!currentUser){ if(st) st.textContent="Nejdřív se přihlaš."; return; }

  const selectedKey=detailKey(selectedSite) || selectedSite.id;
  const stopped=selectedSite.stopped !== true;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    const existingEdit=editCache[selectedKey] || editCache[selectedSite.id] || {};
    const edit={
      stopped,
      rawEdits:{...(existingEdit.rawEdits || {}),"Stop Stav":stopped ? "ANO" : "NE"},
      updatedBy:currentUser.email,
      updatedAt:new Date().toISOString()
    };

    const firebaseDocId=selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "";
    if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
      const mergedRaw={...(selectedSite.raw||{}), Firebase_doc_id:firebaseDocId};
      mergedRaw["Stop Stav"]=stopped ? "ANO" : "NE";
      if(!mergedRaw["Klíč_adresy"]) mergedRaw["Klíč_adresy"]="firebase_"+firebaseDocId;
      await setDoc(doc(db,"sitesUnified",firebaseDocId),{
        raw:mergedRaw,
        dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(mergedRaw) : [],
        updatedBy:currentUser.email,
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
    }

    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
    editCache[selectedKey]={...existingEdit,...edit};
    selectedSite=updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,selectedSite,{stopped});
    if(st) st.textContent=stopped ? "Zdroj je označený jako Stop Stav." : "Stop Stav byl zrušen.";
    showSaveConfirmation(stopped ? "Stop Stav uložen." : "Stop Stav zrušen.");
    render();
    updateStopButton();
  }catch(e){
    if(st) st.textContent="Chyba uložení Stop Stavu: "+e.message;
  }
}


function rememberBoundedStringCache(cache,key,value,maxSize=5000){
  cache.set(key,value);
  if(cache.size>maxSize){
    const firstKey=cache.keys().next().value;
    cache.delete(firstKey);
  }
  return value;
}
const DATA_NORM_ALL_CACHE_MAX=5000;
const dataNormAllCache=new Map();
function dataNormAll(k){
  const key=String(k||"");
  if(dataNormAllCache.has(key)) return dataNormAllCache.get(key);
  const value=key.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/_/g," ")
    .replace(/\s+/g," ")
    .trim();
  return rememberBoundedStringCache(dataNormAllCache,key,value,DATA_NORM_ALL_CACHE_MAX);
}
function dataLabelAll(k){
  const n=dataNormAll(k);
  if(n==="popis zdroje" || n==="jaky zdroj") return "Typ zdroje";
  if(["vyrobni cislo","vyrobni c.","seriove cislo","sn","serial","vyr. c."].includes(n)) return "Výrobní číslo";
  return k;
}
function isImportantDataAll(k){
  return dataNormAll(k)==="dulezita poznamka";
}
function hideOnlyInternalData(k){
  const n=dataNormAll(k);
  if(!n) return true;

  // pryč pouze interní / technické věci, které nemají být v uživatelských datech
  if(n.includes("gps")) return true;
  if(n==="firebase doc id") return true;
  if(n==="id mista") return true;
  if(n==="klic adresy") return true;
  if(n==="zdrojovy kod") return true;

  return false;
}
function orderedAllDataKeys(raw){
  // přesně zachová původní pořadí sloupců z CSV/Excelu
  return Object.keys(raw || {});
}


const DATA_NORM_USER_CACHE_MAX=5000;
const dataNormUserCache=new Map();
function dataNormUser(k){
  const key=String(k||"");
  if(dataNormUserCache.has(key)) return dataNormUserCache.get(key);
  const value=key.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/_/g," ")
    .replace(/\s+/g," ")
    .trim();
  return rememberBoundedStringCache(dataNormUserCache,key,value,DATA_NORM_USER_CACHE_MAX);
}

function hideDataUser(k){
  const n=dataNormUser(k);
  if(!n) return true;

  // skryté řádky podle zadání
  if(n.includes("gps") && n!=="adresa gps") return true;
  if(n==="kontakt mapy") return true;
  if(n==="hlavni kontakt") return true;
  if(n==="poznamky mapy") return true;
  if(n==="umisteni") return true;
  if(n==="jaky zdroj") return true;
  if(n==="stav kontroly") return true;
  if(n==="stav pro mapu") return true;
  if(n==="zdrojovy radek") return true;
  if(n==="jezdit bez objednavky") return true;
  if(n==="bez objednavky") return true;
  if(n==="ruzova") return true;
  if(n==="hlidame termin sami") return true;
  if(n==="hlidat termin sami") return true;

  if(n==="pristi planovana kontrola") return true;
  if(n==="posledni probehla kontrola") return true;
  if(n==="dni do kontroly") return true;
  if(n==="barva bodu") return true;
  if(n==="posledni kontrola") return true;
  if(n==="pristi kontrola") return true;
  if(n==="vsechny terminy") return true;
  if(n==="zdrojovy soubor") return true;
  if(n==="pocet terminu") return true;

  // výrobní číslo se už nemá doplňovat z řádku Zdroj
  if(n==="zdroj") return true;

  // technické řádky
  if(n==="firebase doc id") return true;
  if(n==="id mista") return true;
  if(n==="klic adresy") return true;

  // řádky s měsíci
  if(/^mesic\s*\d*$/.test(n)) return true;
  if(/^month\s*\d*$/.test(n)) return true;
  if(["leden","unor","brezen","duben","kveten","cerven","cervenec","srpen","zari","rijen","listopad","prosinec"].includes(n)) return true;
  if(/^\d{1,2}$/.test(n)) return true;

  return false;
}

function dataLabelUser(k){
  const n=dataNormUser(k);
  if(n==="adresa gps") return "Umístění zdroje";
  return k;
}

function dataValueKeyUser(v){
  return String(v||"").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g," ");
}

function isNoteUser(k){
  const n=dataNormUser(k);
  return n==="poznamky" || n==="poznamka" || n==="dulezita poznamka" || n==="poznamky mapy";
}

function orderedDataUser(raw){
  return Object.keys(raw || {});
}


function getWatchSelfValue(raw){
  return canonicalWatchSelfValue(raw);
}


const DATA_NORM_FIXED_CACHE_MAX=5000;
const dataNormFixedCache=new Map();
function dataNormFixed(k){
  const key=String(k||"");
  if(dataNormFixedCache.has(key)) return dataNormFixedCache.get(key);
  const value=key.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/_/g," ")
    .replace(/\s+/g," ")
    .trim();
  return rememberBoundedStringCache(dataNormFixedCache,key,value,DATA_NORM_FIXED_CACHE_MAX);
}

function hideDataFixed(k){
  const n=dataNormFixed(k);
  if(!n) return true;

  if(n.includes("gps") && n!=="adresa gps") return true;
  if(n==="kontakt mapy") return true;
  if(n==="hlavni kontakt") return true;
  if(n==="poznamky mapy") return true;
  if(n==="umisteni") return true;
  if(n==="jaky zdroj") return true;
  if(n==="stav kontroly") return true;
  if(n==="stav pro mapu") return true;
  if(n==="zdrojovy radek") return true;
  if(n==="zdroj dat") return true;
  if(n==="jezdit bez objednavky") return true;
  if(n==="bez objednavky") return true;
  if(n==="ruzova") return true;
  if(n==="hlidame termin sami") return true;
  if(n==="hlidat termin sami") return true;
  if(n==="perioda kontrol") return true;

  if(n==="pristi planovana kontrola") return true;
  if(n==="posledni probehla kontrola") return true;
  if(n==="dni do kontroly") return true;
  if(n==="barva bodu") return true;
  if(n==="posledni kontrola") return true;
  if(n==="pristi kontrola") return true;
  if(n==="vsechny terminy") return true;
  if(n==="zdrojovy soubor") return true;
  if(n==="pocet terminu") return true;

  if(n==="firebase doc id") return true;
  if(n==="id mista") return true;
  if(n==="klic adresy") return true;

  if(/^mesic\s*\d*$/.test(n)) return true;
  if(/^month\s*\d*$/.test(n)) return true;
  if(["leden","unor","brezen","duben","kveten","cerven","cervenec","srpen","zari","rijen","listopad","prosinec"].includes(n)) return true;
  if(/^\d{1,2}$/.test(n)) return true;

  return false;
}

function dataLabelFixed(k){
  const n=dataNormFixed(k);
  if(n==="adresa gps") return "Umístění zdroje";
  if(n==="zdroj") return "Výrobní číslo";
  if(n==="dulezita poznamka") return "Důležité poznámky";
  return k;
}

function isWatchFixed(k){
  const n=dataNormFixed(k);
  return [
    "hlidame kontroly sami",
    "hlidame sami termin",
    "hlidame termin sami",
    "hlidat termin sami",
    "jezdit hlidame termin sami"
  ].includes(n);
}

function isNoteFixed(k){
  const n=dataNormFixed(k);
  return n==="dulezita poznamka" || n==="dulezite poznamky";
}

const VAL_NORM_FIXED_CACHE_MAX=5000;
const valNormFixedCache=new Map();
function valNormFixed(v){
  const key=String(v||"");
  if(valNormFixedCache.has(key)) return valNormFixedCache.get(key);
  const value=key.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g," ");
  return rememberBoundedStringCache(valNormFixedCache,key,value,VAL_NORM_FIXED_CACHE_MAX);
}

function getWatchFixed(raw){
  return canonicalWatchSelfValue(raw);
}

function getImportantNoteFixed(raw){
  return firstSiteField(raw,["Důležitá poznámka","DŮLEŽITÁ POZNÁMKA","Důležité poznámky","dulezita poznamka"]);
}

function orderedFixedKeys(raw){
  const keys=Object.keys(raw||{});
  const sourceKey=keys.find(k=>dataNormFixed(k)==="popis zdroje");
  const serialKey=keys.find(k=>dataNormFixed(k)==="zdroj" && safe(raw[k]));
  const out=[];
  let serialInserted=false;

  keys.forEach(k=>{
    if(serialKey && k===serialKey) return;
    if(isWatchFixed(k)) return;
    if(isNoteFixed(k)) return;

    out.push(k);

    if(sourceKey && k===sourceKey && serialKey && !serialInserted){
      out.push(serialKey);
      serialInserted=true;
    }
  });

  if(serialKey && !serialInserted){
    out.push(serialKey);
  }

  return out;
}


function detectControlPeriod(raw){
  const dateMonths=inferControlPeriodMonthsFromDates(raw || {});
  if(dateMonths) return String(dateMonths);
  const value=firstSiteField(raw,[
    "Perioda",
    "Perioda kontrol",
    "Perioda zkoušky",
    "Perioda zkoušek",
    "Perioda kontroly",
    "Perioda kontrol (6/12)",
    "Cetnost",
    "Četnost",
    "Kontrola",
    "Interval"
  ]);
  if(value){
    const v=valNormFixed(value);
    if(v.includes("6")) return "6";
    if(v.includes("12") || v.includes("rok") || v.includes("rocni")) return "12";
  }

  // fallback podle původních dat
  const joined = JSON.stringify(raw||{}).toLowerCase();
  if(joined.includes("6 mes") || joined.includes("6 měs")) return "6";
  if(joined.includes("12 mes")) return "12";
  if(joined.includes("1 rok")) return "12";

  return "12";
}


function shouldWatchSelf(raw){
  return explicitWatchSelfFromRaw(raw)===true;
}

function detailTableRows(r){
  const raw=rawForSiteFieldLookup(r);
  return USER_SITE_DATA_FIELDS.map(spec=>({spec,value:userSiteFieldValue(r,spec,raw)}));
}

function detailTableSignature(rowsForDetail){
  return rowsForDetail.map(({spec,value})=>`${String(spec.key).length}:${spec.key}\u001e${String(value).length}:${value}`).join("\u001f");
}

function renderDetailTable(table,r){
  if(!table) return;
  table.classList.remove("data-edit-table");
  table.classList.add("history-item","small","detail-history-table");
  const rowsForDetail=detailTableRows(r);
  const signature=detailTableSignature(rowsForDetail);
  if(table.dataset.detailTableMode==="display" && table.dataset.detailSignature===signature && table.childElementCount){
    return;
  }
  const fragment=document.createDocumentFragment();
  rowsForDetail.forEach(({spec,value})=>{
    const row=document.createElement("div");
    row.className="history-detail-row";
    const label=document.createElement("span");
    label.textContent=spec.label;
    const valueCell=document.createElement("span");
    valueCell.textContent=userSiteDisplayText(spec,value);
    row.append(label,valueCell);
    fragment.appendChild(row);
  });
  table.replaceChildren(fragment);
  table.dataset.detailTableMode="display";
  table.dataset.detailSignature=signature;
}

window.openDetail=function(i){
  restoreNormalDetailDrawerShell();
  syncRowIndexes();
  const r=rows[Number(i)]; if(!r)return; selectedSite=r;
  startDetailAsyncLoads(r);
  document.getElementById("drawer").classList.add("open"); document.getElementById("drawer").scrollTop=0;
  document.getElementById("newSiteCard").style.display="none";
  clearNewSiteMode();
  document.getElementById("detailTitle").textContent=r.adresa||"Bez názvu";
  document.getElementById("detailSub").textContent=siteSourceLabel(r)||"";
  renderSourceChooser(r);
  resetOfficialProtocolSection(r);
  if(window.setDetailTab) window.setDetailTab("data");
  const detailTableEl=document.getElementById("detailTable");
  detailTableEl.classList.remove("data-edit-table");
  renderDetailTable(detailTableEl,r);
  showControlDateDisplay(r);
  const addDataRowBox=document.getElementById("addDataRowBox"); if(addDataRowBox) addDataRowBox.style.display="none";
  const editDataToggleBtn=document.getElementById("editDataToggleBtn");
  const toggleOrderedBtn=document.getElementById("toggleOrderedBtn");
  const toggleRepairBtn=document.getElementById("toggleRepairBtn");
  const toggleStopBtn=document.getElementById("toggleStopBtn");
  const showSiteOnMapBtn=document.getElementById("showSiteOnMapBtn");
  const calcDataGpsBtn=document.getElementById("calcDataGpsBtn");
  const saveDataBtn=document.getElementById("saveDataEditsBtn");
  const cancelDataEditBtn=document.getElementById("cancelDataEditBtn");
  if(calcDataGpsBtn){ calcDataGpsBtn.style.display="none"; calcDataGpsBtn.onclick=dataAddressToGps; }
  if(toggleOrderedBtn){
    toggleOrderedBtn.style.display="block";
    updateOrderedButton();
    toggleOrderedBtn.onclick=toggleOrderedFromDetail;
  }
  if(toggleRepairBtn){
    toggleRepairBtn.style.display="block";
    updateRepairButton();
    toggleRepairBtn.onclick=toggleRepairFromDetail;
  }
  if(toggleStopBtn){
    toggleStopBtn.style.display="block";
    updateStopButton();
    toggleStopBtn.onclick=toggleStopFromDetail;
  }
  const deleteDataSiteBtn=document.getElementById("deleteDataSiteBtn");
  if(deleteDataSiteBtn){
    deleteDataSiteBtn.style.display=isAppAdmin() ? "block" : "none";
    deleteDataSiteBtn.onclick=deleteSelectedSite;
  }
  if(showSiteOnMapBtn){
    showSiteOnMapBtn.style.display="block";
    showSiteOnMapBtn.onclick=showSelectedSiteOnMap;
  }

  if(editDataToggleBtn){
    editDataToggleBtn.style.display="block";
    editDataToggleBtn.onclick=()=>{
      const table=document.getElementById("detailTable");
      table.classList.add("data-edit-table");
      renderEditableDataTable(table,selectedSite);
      const inlineGpsBtn=document.getElementById("detailGpsCalcInline");
      if(inlineGpsBtn) inlineGpsBtn.onclick=dataAddressToGps;
      const inlineGpsPickBtn=document.getElementById("detailGpsPickMapInline");
      if(inlineGpsPickBtn) inlineGpsPickBtn.onclick=startDetailManualGpsPick;
      showControlDateInputs(selectedSite);
      editDataToggleBtn.style.display="none";
      if(calcDataGpsBtn) calcDataGpsBtn.style.display="none";
      if(saveDataBtn) saveDataBtn.style.display="block";
      if(cancelDataEditBtn) cancelDataEditBtn.style.display="block";
      const addDataRowBox=document.getElementById("addDataRowBox"); if(addDataRowBox) addDataRowBox.style.display="none";
      
    };
  }
  if(saveDataBtn){ saveDataBtn.style.display="none"; saveDataBtn.onclick=saveAllDataEdits; }
  if(cancelDataEditBtn){
    cancelDataEditBtn.style.display="none";
    cancelDataEditBtn.onclick=()=>window.openDetailById(detailKey(selectedSite) || selectedSite.id);
  }
  const addDataRowBtn=document.getElementById("addDataRowBtn");
  if(addDataRowBtn) addDataRowBtn.onclick=addNewDataRowToTable;
  clearProtocolEditState();
  const pf=formFieldNode("protocolForm"); if(pf){ pf.style.display="none"; } setTextIfChanged(formFieldNode("toggleProtocolBtn"),"Vyplnit protokol");;
  try{
    setInputValue("editName",r.adresa||"");
    setInputValue("editContact",r.kontakt||"");
    setInputValue("editSource",r.zdroj||"");
    setInputChecked("editOrdered",r.ordered === true);
    setInputValue("editGpsAddress",r.gpsAddress||first(r.raw,["Adresa_GPS","Adresa / umístění","Umístění"])||"");
    setInputValue("editGpsLat",Number.isFinite(r.lat)?String(r.lat):"");
    setInputValue("editGpsLon",Number.isFinite(r.lon)?String(r.lon):"");
    setInputValue("editLastCheck",isoDateFromAny(r.posledni)||"");
    recalcEditNextCheck();
    setInputValue("editNotes",r.poznamky||"");
    setInputValue("technician",currentUser?.displayName||currentUser?.email||"");
    setInputValue("checkDate",new Date().toISOString().slice(0,10));
  }catch(e){
    console.warn("Doplňková pole detailu se nepodařilo vyplnit",e);
  }
}
let detailHistoryItems=[];
let detailHistoryIndex=0;
let protocolEditState=null;
const DETAIL_HISTORY_CACHE_MS=45000;
const DETAIL_HISTORY_MUTATION_KINDS=new Set(["protocolHistory","serviceHistory","protocols","serviceRecords"]);
const detailHistoryCache=new Map();
const LAST_PROTOCOL_CACHE_MS=45000;
const lastProtocolCache=new Map();
const MAIN_PROTOCOL_HISTORY_CACHE_MS=45000;
let mainProtocolHistoryCache={key:"",savedAt:0,items:null};

function detailHistoryCacheKey(site=selectedSite){
  if(!site) return "";
  const keys=[detailLazyKey(site), selectedSiteDocId(site), ...siteRecordKeys(site), currentUserEmail()]
    .map(x=>String(x || "").trim())
    .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
  return keys.join("|");
}

function cloneDetailHistoryItem(item){
  return item && typeof item==="object" ? {...item} : item;
}

function readLastProtocolCache(site=selectedSite){
  const key=detailHistoryCacheKey(site);
  if(!key) return undefined;
  const cached=lastProtocolCache.get(key);
  if(!cached) return undefined;
  if(Date.now()-cached.savedAt>LAST_PROTOCOL_CACHE_MS){
    lastProtocolCache.delete(key);
    return undefined;
  }
  return cloneDetailHistoryItem(cached.item) || null;
}

function writeLastProtocolCache(site=selectedSite,item=null){
  const key=detailHistoryCacheKey(site);
  if(!key) return;
  lastProtocolCache.set(key,{
    savedAt:Date.now(),
    item:cloneDetailHistoryItem(item) || null
  });
}

function clearLastProtocolCache(site=selectedSite){
  if(!site){
    lastProtocolCache.clear();
    return;
  }
  const key=detailHistoryCacheKey(site);
  if(key) lastProtocolCache.delete(key);
  else lastProtocolCache.clear();
}

function readDetailHistoryCache(site=selectedSite){
  const key=detailHistoryCacheKey(site);
  if(!key) return null;
  const cached=detailHistoryCache.get(key);
  if(!cached) return null;
  if(Date.now()-cached.savedAt>DETAIL_HISTORY_CACHE_MS){
    detailHistoryCache.delete(key);
    return null;
  }
  return Array.isArray(cached.items) ? cached.items.map(cloneDetailHistoryItem) : [];
}

function writeDetailHistoryCache(site=selectedSite,items=[]){
  const key=detailHistoryCacheKey(site);
  if(!key) return;
  detailHistoryCache.set(key,{
    savedAt:Date.now(),
    items:Array.isArray(items) ? items.map(cloneDetailHistoryItem) : []
  });
}

function clearDetailHistoryCache(site=selectedSite){
  if(!site){
    detailHistoryCache.clear();
    lastProtocolCache.clear();
    return;
  }
  const key=detailHistoryCacheKey(site);
  if(key) detailHistoryCache.delete(key);
  else detailHistoryCache.clear();
  clearLastProtocolCache(site);
}
window.clearDetailHistoryCache=clearDetailHistoryCache;

function mainProtocolHistoryCacheKey(){
  return currentUserEmail() || "anonymous";
}

function readMainProtocolHistoryCache(){
  const key=mainProtocolHistoryCacheKey();
  if(!mainProtocolHistoryCache.items || mainProtocolHistoryCache.key!==key) return null;
  if(Date.now()-mainProtocolHistoryCache.savedAt>MAIN_PROTOCOL_HISTORY_CACHE_MS){
    mainProtocolHistoryCache={key:"",savedAt:0,items:null};
    return null;
  }
  return mainProtocolHistoryCache.items.map(cloneDetailHistoryItem);
}

function writeMainProtocolHistoryCache(items=[]){
  mainProtocolHistoryCache={
    key:mainProtocolHistoryCacheKey(),
    savedAt:Date.now(),
    items:Array.isArray(items) ? items.map(cloneDetailHistoryItem) : []
  };
}

function clearMainProtocolHistoryCache(){
  mainProtocolHistoryCache={key:"",savedAt:0,items:null};
}
window.clearMainProtocolHistoryCache=clearMainProtocolHistoryCache;

function clearDetailHistoryCacheForKind(kind,site=selectedSite){
  const cleanKind=String(kind || "");
  if(DETAIL_HISTORY_MUTATION_KINDS.has(cleanKind)) clearDetailHistoryCache(site);
  if(cleanKind==="protocolHistory" || cleanKind==="protocols") clearLastProtocolCache(site);
  if(cleanKind==="protocolHistory" || cleanKind==="protocols") clearMainProtocolHistoryCache();
}

function uniqueNonEmptyStrings(values=[]){
  return (Array.isArray(values) ? values : [])
    .map(value=>String(value || "").trim())
    .filter((value,idx,arr)=>value && arr.indexOf(value)===idx);
}

async function readFirestoreArrayContainsAny(fsMod,database,colName,field,values,addDocSnap,warnLabel="Firestore dotaz"){
  const cleanValues=uniqueNonEmptyStrings(values);
  if(!cleanValues.length || !fsMod || !database || typeof addDocSnap!=="function") return true;
  const {collection,query,where,getDocs}=fsMod;
  if(!collection || !query || !where || !getDocs) return false;
  for(let i=0;i<cleanValues.length;i+=10){
    const chunk=cleanValues.slice(i,i+10);
    try{
      const q=query(collection(database,colName),where(field,"array-contains-any",chunk));
      const snap=await getDocs(q);
      snap.forEach(addDocSnap);
    }catch(e){
      console.warn(warnLabel,field,e);
      return false;
    }
  }
  return true;
}

async function readFirestoreEqualsAny(fsMod,database,colName,field,values,addDocSnap,warnLabel="Firestore rovnostní dotaz"){
  const cleanValues=uniqueNonEmptyStrings(values);
  if(!cleanValues.length || !fsMod || !database || typeof addDocSnap!=="function") return true;
  const {collection,query,where,getDocs}=fsMod;
  if(!collection || !query || !where || !getDocs) return false;
  let batchOk=true;
  for(let i=0;i<cleanValues.length;i+=10){
    const chunk=cleanValues.slice(i,i+10);
    try{
      const q=query(collection(database,colName),where(field,"in",chunk));
      const snap=await getDocs(q);
      snap.forEach(addDocSnap);
    }catch(e){
      batchOk=false;
      console.warn(warnLabel,field,e);
      break;
    }
  }
  if(batchOk) return true;
  const fallbackTasks=cleanValues.map(value=>async()=>{
    try{
      const q=query(collection(database,colName),where(field,"==",value));
      const snap=await getDocs(q);
      snap.forEach(addDocSnap);
    }catch(e){
      console.warn(warnLabel,field,"fallback",e);
    }
  });
  await runBoundedFirestoreTasks(fallbackTasks,6);
  return false;
}

async function runBoundedFirestoreTasks(tasks=[],concurrency=6){
  const queue=(Array.isArray(tasks) ? tasks : []).filter(task=>typeof task==="function");
  if(!queue.length) return;
  const workerCount=Math.max(1,Math.min(concurrency,queue.length));
  let index=0;
  const workers=Array.from({length:workerCount},async()=>{
    while(index<queue.length){
      const task=queue[index++];
      await task();
    }
  });
  await Promise.all(workers);
}

const formFieldNodeCache=new Map();
function formFieldNode(id){
  const key=safe(id);
  if(!key) return null;
  const cached=formFieldNodeCache.get(key);
  if(cached && cached.isConnected && cached.id===key) return cached;
  const el=document.getElementById(key);
  if(el) formFieldNodeCache.set(key,el);
  else formFieldNodeCache.delete(key);
  return el;
}

function setInputValue(id,value){
  const el=formFieldNode(id);
  const next=String(value ?? "");
  if(el && el.value!==next) el.value=next;
}
function setInputChecked(id,value){
  const el=formFieldNode(id);
  if(el && el.checked!==!!value) el.checked=!!value;
}

function normalizeSealValue(value){
  const n=dataNormFixed(value);
  if(!n) return "";
  if(n.includes("porus") || n.includes("poskoz") || n.includes("spat")) return "porušena";
  if(n.includes("porad") || n==="ok" || n==="ano" || n.includes("neporus")) return "v pořádku";
  return safe(value);
}

function setProtocolFieldValue(id,value){
  const el=formFieldNode(id);
  if(!el) return;
  let next=safe(value);
  if(el.tagName==="SELECT"){
    if(id==="protoSeal2") next=normalizeSealValue(next);
    if(next && !Array.from(el.options).some(option=>option.value===next)){
      const option=document.createElement("option");
      option.value=next;
      option.textContent=next;
      el.appendChild(option);
    }
  }
  if(el.value!==next) el.value=next;
}

function updateProtocolSaveButtonText(){
  setTextIfChanged(formFieldNode("saveProtocolBtn"),protocolEditState ? "Uložit změny protokolu" : "Uložit protokol");
}

function clearProtocolEditState(){
  protocolEditState=null;
  updateProtocolSaveButtonText();
}

function protocolEditId(){
  return safe(protocolEditState && protocolEditState.id);
}

function drawSavedProtocolSignature(dataUrl){
  const canvas=protocolSignatureCanvas();
  const ctx=protocolSignatureContext();
  if(!canvas || !ctx || !safe(dataUrl)) return;
  const img=new Image();
  img.onload=()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const scale=Math.min(canvas.width/img.width, canvas.height/img.height);
    const w=img.width*scale;
    const h=img.height*scale;
    ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
    protoClientSignatureDirty=false;
  };
  img.src=dataUrl;
}

function fillProtocolFormFromHistory(protocol={}){
  const form=document.getElementById("protocolForm");
  if(form) form.reset();
  clearProtocolClientSignature();
  populateProtocolDeviceSelect();
  setProtocolFieldValue("protoDate",dateInputValueFromAny(protocol.date || protocol.checkDate || protocol.createdAt));
  setProtocolFieldValue("protoPlace",protocol.place || protocol.siteAddress || protocol.siteName || selectedSite?.adresa || "");
  setProtocolFieldValue("protoDeviceType",protocol.deviceType || protocol.selectedDevice || protocol.siteSource || "");
  setProtocolFieldValue("protoDeviceTypeSelect",protocol.selectedDevice || protocol.deviceType || "");
  setProtocolFieldValue("protoDeviceSelect",protocol.selectedDevice || protocol.deviceType || "");
  setProtocolFieldValue("protoSerial",protocol.serial || "");
  setProtocolFieldValue("protoSeal",protocol.seal || "");
  setProtocolFieldValue("protoOperator",protocol.operator || "");
  setProtocolFieldValue("protoCustomer",protocol.customer || "");
  setProtocolFieldValue("protoPbzLocation",protocol.pbzLocation || "");
  setProtocolFieldValue("protoBatteryCount",protocol.batteryCount || "");
  setProtocolFieldValue("protoCapacity",protocol.capacityAh || "");
  setProtocolFieldValue("protoSetCount",protocol.setCount || "");
  setProtocolFieldValue("protoAuxBatteryAh",protocol.auxBatteryAh || "");
  setProtocolFieldValue("protoTemp",protocol.temperature || "");
  setProtocolFieldValue("protoSeal2",protocol.seal2 || "");
  setProtocolFieldValue("protoInputVac",protocol.inputVac || "");
  setProtocolFieldValue("protoOutput1Vac",protocol.output1Vac || "");
  setProtocolFieldValue("protoOutput2Vac",protocol.output2Vac || "");
  setProtocolFieldValue("protoBackup1Vac",protocol.backup1Vac || "");
  setProtocolFieldValue("protoBackup2Vac",protocol.backup2Vac || "");
  setProtocolFieldValue("protoMainBatVdc",protocol.mainBatVdc || "");
  setProtocolFieldValue("protoResetDiag",protocol.resetDiagnostics || "");
  setProtocolFieldValue("protoAuxBatVdc",protocol.auxBatVdc || "");
  setProtocolFieldValue("protoUnbalance1",protocol.unbalance1 || "");
  setProtocolFieldValue("protoUnbalance2",protocol.unbalance2 || "");
  setProtocolFieldValue("protoBreakersLocation",protocol.breakersLocation || "");
  setProtocolFieldValue("protoControlLocation",protocol.controlLocation || "");
  setProtocolFieldValue("protoTestProcedure",protocol.testProcedure || "");
  setProtocolFieldValue("protoContacts",protocol.contacts || "");
  setProtocolFieldValue("protoOtherDevice",protocol.backedDevices?.other || "");
  setProtocolFieldValue("protoOtherAccess",protocol.access?.other || "");
  setProtocolFieldValue("protoOtherAvailability",protocol.availability?.other || "");
  setProtocolFieldValue("protoPeriod",protocol.period || "");
  setProtocolFieldValue("protoConditions",protocol.conditions || protocol.result || "");
  setProtocolFieldValue("protoConditionsReason",protocol.conditionsReason || "");
  setProtocolFieldValue("protoNotes",protocol.notes || protocol.issues || "");
  setProtocolFieldValue("protoClientSign",protocol.clientSign || protocol.customer || "");
  setProtocolFieldValue("protoTechSign",protocol.techSign || protocol.technician || protocol.createdBy || protocol.technicianEmail || currentUser?.email || "");

  const backed=protocol.backedDevices || {};
  setInputChecked("protoLift",backed.lift);
  setInputChecked("protoVent",backed.vent);
  setInputChecked("protoMachineLight",backed.machineLight);
  setInputChecked("protoChuc",backed.chuc);
  setInputChecked("protoDamper",backed.damper);
  setInputChecked("protoSkylight",backed.skylight);
  setInputChecked("protoGate",backed.gate);
  setInputChecked("protoAts",backed.ats);
  setInputChecked("protoRpo",backed.rpo);
  setInputChecked("protoNo",backed.no);
  setInputChecked("protoSprinkler",backed.sprinkler);
  setInputChecked("protoCsTs",backed.csTs);

  const access=protocol.access || {};
  setInputChecked("protoBlue",access.blue);
  setInputChecked("protoB",access.b);
  setInputChecked("protoC",access.c);
  setInputChecked("protoGarage",access.garage);
  setInputChecked("protoCarLift",access.carLift);
  setInputChecked("protoBarrier",access.barrier);
  setInputChecked("protoParkingHouse",access.parkingHouse);
  setInputChecked("protoPermit",access.permit);
  setInputChecked("protoTraining",access.training);
  setInputChecked("protoShoes",access.shoes);
  setInputChecked("protoVest",access.vest);
  setInputChecked("protoHelmet",access.helmet);

  const availability=protocol.availability || {};
  setInputChecked("protoWcOk",availability.wcOk);
  setInputChecked("protoWcNok",availability.wcNok);
  setInputChecked("protoLightOk",availability.lightOk);
  setInputChecked("protoLightNok",availability.lightNok);
  setInputChecked("protoLadder",availability.ladder);
  setInputChecked("protoStairs",availability.stairs);
  setInputChecked("protoLowCeiling",availability.lowCeiling);
  setInputChecked("protoExtremeTemp",availability.extremeTemp);
  drawSavedProtocolSignature(protocol.clientSignatureDataUrl || "");
  updateProtocolSummary();
}

function editCurrentHistoryProtocol(){
  const protocol=selectedHistoryProtocol();
  const st=document.getElementById("protocolStatus");
  if(!protocol){
    if(st) st.textContent="Není vybraný protokol k úpravě.";
    return;
  }
  if(window.setDetailTab) window.setDetailTab("protocol");
  const form=document.getElementById("protocolForm");
  if(form) form.style.display="block";
  const toggle=document.getElementById("toggleProtocolBtn");
  if(toggle) toggle.textContent="Skrýt protokol";
  initProtocolClientSignaturePad();
  fillProtocolFormFromHistory(protocol);
  protocolEditState={id:safe(protocol._id), item:{...protocol}, collection:protocol._collection || ""};
  updateProtocolSaveButtonText();
  if(st) st.textContent="Upravuješ uložený protokol. Po uložení se přepíše stejný záznam.";
  form?.scrollIntoView({behavior:"smooth",block:"start"});
}

let detailLazyLoadKey="";
let detailLazyLoadState={historyLoaded:false,historyLoading:false,photosLoaded:false,photosLoading:false};
function detailLazyKey(site=selectedSite){
  if(!site) return "";
  return String(detailKey(site) || site.firebaseDocId || site.raw?.["Firebase_doc_id"] || site.id || "").trim();
}
function activeDetailTabName(){
  return document.getElementById("drawer")?.dataset?.detailTab || "data";
}
function sameDetailLazySite(site=selectedSite){
  return !!site && detailLazyKey(site)===detailLazyLoadKey;
}
function resetDetailLazyLoadState(site){
  detailLazyLoadKey=detailLazyKey(site);
  detailLazyLoadState={historyLoaded:false,historyLoading:false,photosLoaded:false,photosLoading:false};
  detailHistoryItems=[];
  detailHistoryIndex=0;
  sitePhotoItems=[];
  sitePhotoIndex=0;
  sitePhotoRenderSignature="";
  const history=document.getElementById("history");
  if(history) history.textContent="Zatím nenačteno.";
  const photoList=document.getElementById("sitePhotosList");
  if(photoList){
    const placeholder=document.createElement("div");
    placeholder.className="site-photos-empty";
    placeholder.textContent="Fotografie se načtou po otevření Galerie.";
    photoList.replaceChildren(placeholder);
  }
  const photoStatus=document.getElementById("sitePhotosStatus");
  if(photoStatus) photoStatus.textContent="";
  updateOfficialProtocolSourceInfo();
}
function startDetailAsyncLoads(site){
  resetDetailLazyLoadState(site);
  try{ resetSitePhotoInput(); }catch(e){}
}

function ensureDetailAsyncLoads(site){
  return ensureDetailTabLoad(activeDetailTabName(),site);
}
function ensureDetailTabLoad(tabName=activeDetailTabName(),site=selectedSite){
  if(!site || !sameDetailLazySite(site)) return;
  if(tabName==="gallery"){
    if(detailLazyLoadState.photosLoaded || detailLazyLoadState.photosLoading) return;
    detailLazyLoadState.photosLoading=true;
    const st=document.getElementById("sitePhotosStatus");
    if(st && !st.textContent) st.textContent="Načítám fotografie...";
    Promise.resolve(loadSitePhotos(site))
      .then(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.photosLoaded=true; })
      .catch(e=>{
        detailLazyLoadState.photosLoaded=false;
        console.warn("Načtení fotografií detailu selhalo",e);
      })
      .finally(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.photosLoading=false; });
  }
  if(tabName==="protocol" || tabName==="document"){
    if(detailLazyLoadState.historyLoaded || detailLazyLoadState.historyLoading) return;
    detailLazyLoadState.historyLoading=true;
    Promise.resolve(loadHistory(site.id))
      .then(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.historyLoaded=true; })
      .catch(e=>{
        detailLazyLoadState.historyLoaded=false;
        console.warn("Načtení historie detailu selhalo",e);
      })
      .finally(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.historyLoading=false; });
  }
}
window.ensureDetailTabLoad=ensureDetailTabLoad;
function refreshDetailTabLoad(tabName=activeDetailTabName(),site=selectedSite){
  if(!site || !sameDetailLazySite(site)) return;
  if(tabName==="gallery"){
    detailLazyLoadState.photosLoaded=false;
    if(detailLazyLoadState.photosLoading) return;
    ensureDetailTabLoad("gallery",site);
  }
  if(tabName==="protocol" || tabName==="document"){
    detailLazyLoadState.historyLoaded=false;
    if(detailLazyLoadState.historyLoading) return;
    ensureDetailTabLoad(tabName,site);
  }
}
function refreshLoadedDetailTabs(site=selectedSite){
  if(!site || !sameDetailLazySite(site)) return;
  const active=activeDetailTabName();
  if(active==="gallery" || detailLazyLoadState.photosLoaded){
    refreshDetailTabLoad("gallery",site);
  }
  if(active==="protocol" || active==="document" || detailLazyLoadState.historyLoaded){
    refreshDetailTabLoad(active==="document" ? "document" : "protocol",site);
  }
}
window.refreshLoadedDetailTabs=refreshLoadedDetailTabs;

function timeValueFromAny(raw){
  if(raw && typeof raw.toDate==="function") return raw.toDate().getTime();
  const d=new Date(raw || 0);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function historyTimeValue(item){
  return timeValueFromAny(item?.savedAt || item?.createdAt || item?.updatedAt || item?.offlineSavedAt || item?.uploadedAt || item?.checkDate || item?.date || 0);
}

function protocolSavedTimeValue(item){
  return timeValueFromAny(item?.savedAt || item?.createdAt || item?.updatedAt || item?.offlineSavedAt || 0);
}

function dateOnlyTextFallback(value){
  return safe(value)
    .replace(/T\d{1,2}:\d{2}(:\d{2})?.*$/,"")
    .replace(/\s+\d{1,2}:\d{2}(:\d{2})?.*$/,"")
    .trim();
}

function historySavedDateLabel(item){
  const raw=item?.savedAt || item?.createdAt || item?.updatedAt || item?.offlineSavedAt || "";
  const time=protocolExportValue(raw);
  if(!time) return "";
  if(raw && typeof raw.toDate==="function") return isAppAdmin() ? formatDateTimeCz(raw.toDate()) : formatDateCz(raw.toDate());
  const d=new Date(raw || 0);
  return isNaN(d.getTime()) ? (isAppAdmin() ? time : dateOnlyTextFallback(time)) : (isAppAdmin() ? formatDateTimeCz(d) : formatDateCz(d));
}

function historyDateLabel(item){
  if(item?.checkDate) return item.checkDate;
  if(item?.date) return item.date;
  const raw=item?.createdAt;
  if(raw && typeof raw.toDate==="function") return formatDateCz(raw.toDate());
  const d=new Date(raw || 0);
  return isNaN(d.getTime()) ? "bez data" : formatDateCz(d);
}

function photoDateLabel(item){
  const raw=item?.createdAt || item?.uploadedAt || item?.date || "";
  if(raw && typeof raw.toDate==="function") return formatDateCz(raw.toDate());
  const d=new Date(raw || 0);
  return isNaN(d.getTime()) ? "" : formatDateCz(d);
}

function photoDateTimeLabel(raw){
  if(raw && typeof raw.toDate==="function") return isAppAdmin() ? formatDateTimeCz(raw.toDate()) : formatDateCz(raw.toDate());
  const d=new Date(raw || 0);
  return isNaN(d.getTime()) ? "" : (isAppAdmin() ? formatDateTimeCz(d) : formatDateCz(d));
}

function photoCloudinaryVersionDate(item){
  const version=Number(item?.cloudinaryVersion || item?.version || 0);
  if(!Number.isFinite(version) || version<1000000000) return "";
  return new Date(version*1000).toISOString();
}

function photoTakenLabel(item){
  return photoDateTimeLabel(item?.takenAt || item?.photoTakenAt || item?.lastModifiedAt || item?.createdAt || item?.uploadedAt || item?.date || photoCloudinaryVersionDate(item));
}

function photoInsertedLabel(item){
  return photoDateTimeLabel(item?.createdAt || item?.uploadedAt || item?.date || photoCloudinaryVersionDate(item));
}

function historyObjectSummary(obj){
  if(!obj || typeof obj!=="object") return "";
  const labels={
    lift:"Výtah",vent:"Vent. výt. šachty",machineLight:"Osvětlení strojovny",chuc:"CHÚC",
    damper:"Klapka",skylight:"Světlík",gate:"Vrata",ats:"ATS",rpo:"RPO",no:"NO",
    sprinkler:"Sprinkler",csTs:"CS/TS",blue:"modrá",b:"B",c:"C",garage:"garáže",
    carLift:"auto výtah",barrier:"závora",parkingHouse:"park. dům",permit:"povolení",
    training:"školení",shoes:"boty",vest:"vesta",helmet:"helma",wcOk:"WC OK",
    wcNok:"WC NOK",lightOk:"Osvětlení OK",lightNok:"Osvětlení NOK",ladder:"Žebřík",
    stairs:"Schody",lowCeiling:"Snížený strop",extremeTemp:"Extrémní teploty",
    other:"jiné"
  };
  return Object.entries(obj)
    .filter(([,value])=>value===true || (value!==false && safe(value)))
    .map(([key,value])=>{
      const label=labels[key] || key;
      return value===true ? label : `${label}: ${value}`;
    })
    .join(", ");
}

function isProtocolHistoryItem(item){
  return !!item && (
    item._type==="Protokol" ||
    ["protocols","siteProtocols","localProtocols","embeddedProtocols","protocolRefs"].includes(item._collection)
  );
}

function protocolExportValue(value){
  if(value===null || value===undefined) return "";
  if(value && typeof value.toDate==="function") return formatDateTimeCz(value.toDate());
  if(value instanceof Date) return formatDateTimeCz(value);
  if(Array.isArray(value)) return value.map(protocolExportValue).filter(Boolean).join(", ");
  if(typeof value==="object"){
    const summary=historyObjectSummary(value);
    if(summary) return summary;
    try{return JSON.stringify(value)}catch(e){return String(value)}
  }
  return String(value).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g," ").trim();
}

function protocolWordFileNamePart(value){
  return simpleNorm(value || "protokol")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"")
    .slice(0,60) || "protokol";
}

function protocolExportDatePart(protocol={}){
  const raw=safe(protocol.date || protocol.checkDate || protocol.createdAt || "");
  const d=parseDateValue(raw);
  if(d){
    const pad=n=>String(n).padStart(2,"0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  }
  return new Date().toISOString().slice(0,10);
}

function protocolDisplayDate(value){
  const d=parseDateValue(value);
  return d ? formatDateCz(d) : protocolExportValue(value);
}

function wordXmlEscape(value){
  return protocolExportValue(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&apos;");
}

function wordTextXml(value){
  const raw=protocolExportValue(value);
  if(!raw) return '<w:t xml:space="preserve"> </w:t>';
  return raw.split(/\r?\n/).map((part,idx)=>`${idx ? "<w:br/>" : ""}<w:t xml:space="preserve">${wordXmlEscape(part)}</w:t>`).join("");
}

function wordRun(value,options={}){
  const props=[
    '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>',
    `<w:sz w:val="${options.size || 20}"/>`,
    `<w:szCs w:val="${options.size || 20}"/>`
  ];
  if(options.bold) props.push("<w:b/><w:bCs/>");
  if(options.italic) props.push("<w:i/><w:iCs/>");
  if(options.color) props.push(`<w:color w:val="${options.color}"/>`);
  return `<w:r><w:rPr>${props.join("")}</w:rPr>${wordTextXml(value)}</w:r>`;
}

function wordParagraphXml(runXml,options={}){
  const props=[];
  if(options.align) props.push(`<w:jc w:val="${options.align}"/>`);
  props.push(`<w:spacing w:before="${options.before || 0}" w:after="${options.after ?? 0}" w:line="220" w:lineRule="auto"/>`);
  return `<w:p><w:pPr>${props.join("")}</w:pPr>${runXml || wordRun(" ")}</w:p>`;
}

function wordParagraph(value,options={}){
  return wordParagraphXml(wordRun(value,options),options);
}

function wordBlank(after=60){
  return wordParagraph(" ",{size:4,after});
}

function wordCellXml(contentXml,width,options={}){
  const props=[
    `<w:tcW w:w="${width}" w:type="dxa"/>`,
    `<w:vAlign w:val="${options.vAlign || "center"}"/>`,
    '<w:tcMar><w:top w:w="45" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="45" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tcMar>'
  ];
  if(options.colSpan && options.colSpan>1) props.push(`<w:gridSpan w:val="${options.colSpan}"/>`);
  if(options.fill) props.push(`<w:shd w:fill="${options.fill}"/>`);
  return `<w:tc><w:tcPr>${props.join("")}</w:tcPr>${contentXml || wordParagraph(" ")}</w:tc>`;
}

function wordCellText(text,width,options={}){
  const paragraph=wordParagraph(text || " ",{
    size:options.size || 20,
    bold:!!options.bold,
    align:options.align || "left",
    after:0
  });
  return wordCellXml(paragraph,width,options);
}

function wordTable(rows,widths,options={}){
  const total=widths.reduce((sum,w)=>sum+w,0);
  const borders=options.noBorders
    ? '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'
    : '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="000000"/><w:left w:val="single" w:sz="4" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:color="000000"/><w:right w:val="single" w:sz="4" w:color="000000"/><w:insideH w:val="single" w:sz="4" w:color="000000"/><w:insideV w:val="single" w:sz="4" w:color="000000"/></w:tblBorders>';
  const grid=widths.map(width=>`<w:gridCol w:w="${width}"/>`).join("");
  const rowXml=rows.map(row=>{
    let colIndex=0;
    const minHeight=row.reduce((max,cell)=>Math.max(max,(cell && cell.height) || 0),0);
    const trPr=minHeight ? `<w:trPr><w:trHeight w:val="${minHeight}" w:hRule="atLeast"/></w:trPr>` : "";
    const cells=row.map(cell=>{
      const c=typeof cell==="string" ? {text:cell} : (cell || {});
      const span=c.colSpan || 1;
      const width=c.width || widths.slice(colIndex,colIndex+span).reduce((sum,w)=>sum+w,0);
      colIndex+=span;
      if(c.xml) return wordCellXml(c.xml,width,c);
      return wordCellText(c.text,width,c);
    }).join("");
    return `<w:tr>${trPr}${cells}</w:tr>`;
  }).join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:tblLayout w:type="fixed"/>${borders}</w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rowXml}</w:tbl>`;
}

function wordFormField(label,value,width=9630){
  return wordTable([
    [{text:label,bold:true,size:18,fill:"F2F2F2"}],
    [{text:protocolExportValue(value) || " ",size:20,height:330}]
  ],[width]) + wordBlank(20);
}

function wordFormGrid(labels,values,widths){
  return wordTable([
    labels.map(label=>({text:label,bold:true,size:18,fill:"F2F2F2"})),
    values.map(value=>({text:protocolExportValue(value) || " ",size:20,height:330}))
  ],widths) + wordBlank(20);
}

function base64ToBytes(base64){
  const binary=atob(base64 || "");
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  return bytes;
}

function protocolSignatureImageBytes(protocol={}){
  const dataUrl=safe(protocol.clientSignatureDataUrl || protocol.clientSignature || "");
  const match=dataUrl.match(/^data:image\/png;base64,(.+)$/);
  if(!match) return null;
  try{return base64ToBytes(match[1]);}catch(e){return null;}
}

function wordSignatureImageRun(relId="rIdSignature",options={}){
  const cx=Number(options.cx) || 2600000;
  const cy=Number(options.cy) || 760000;
  return `<w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="7" name="Podpis objednavatele"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="7" name="podpis-objednavatele.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}

function wordClientSignatureCellXml(protocol={},options={}){
  const compact=!!options.compact;
  const parts=[];
  if(safe(protocol.clientSign)) parts.push(wordParagraph(protocol.clientSign,{size:compact ? 16 : 18,after:compact ? 0 : 30}));
  if(protocolSignatureImageBytes(protocol)){
    const imageOptions=compact ? {cx:3800000,cy:1100000} : {};
    parts.push(wordParagraphXml(wordSignatureImageRun("rIdSignature",imageOptions),{after:0}));
  }
  return parts.join("") || wordParagraph(" ",{size:18,after:0});
}

function wordSignatureGrid(protocol={}){
  const tech=protocol.techSign || protocol.technician || currentUser?.displayName || currentUser?.email || "";
  return wordTable([
    [
      {text:"Za objednavatele:",bold:true,size:18,fill:"F2F2F2"},
      {text:"Kontrolu provedl:",bold:true,size:18,fill:"F2F2F2"}
    ],
    [
      {xml:wordClientSignatureCellXml(protocol),height:1050},
      {text:protocolExportValue(tech) || " ",size:20,height:1050}
    ]
  ],[4815,4815]) + wordParagraph("(čitelně + podpis)",{size:16,after:35});
}

function wordCheck(value){
  return value ? "☒" : "☐";
}

function protocolCheckedText(items){
  return items.map(item=>`${wordCheck(!!item.checked)} ${item.label}`).join("   ");
}

function protocolBackedDevicesText(protocol={}){
  const d=protocol.backedDevices || {};
  return protocolCheckedText([
    {checked:d.lift,label:"Výtah"},
    {checked:d.vent,label:"vent. výt. šachty"},
    {checked:d.machineLight,label:"osvětlení strojovny"},
    {checked:d.chuc,label:"CHÚC"},
    {checked:d.damper,label:"klapka"},
    {checked:d.skylight,label:"světlík"},
    {checked:d.gate,label:"vrata"},
    {checked:d.ats,label:"ATS"},
    {checked:d.rpo,label:"RPO"},
    {checked:d.no,label:"NO"},
    {checked:d.sprinkler,label:"sprinkler"},
    {checked:d.csTs,label:"CS/TS"},
    {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
  ]);
}

function protocolAccessText(protocol={}){
  const d=protocol.access || {};
  return protocolCheckedText([
    {checked:d.blue,label:"modrá"},
    {checked:d.b,label:"B"},
    {checked:d.c,label:"C"},
    {checked:d.garage,label:"garáže"},
    {checked:d.carLift,label:"auto výtah"},
    {checked:d.barrier,label:"závora"},
    {checked:d.parkingHouse,label:"park. dům"},
    {checked:d.permit,label:"povolení"},
    {checked:d.training,label:"školení"},
    {checked:d.shoes,label:"boty"},
    {checked:d.vest,label:"vesta"},
    {checked:d.helmet,label:"helma"},
    {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
  ]);
}

function protocolAvailabilityText(protocol={}){
  const d=protocol.availability || {};
  return [
    `WC ${wordCheck(d.wcOk)} Ok / ${wordCheck(d.wcNok)} Nok`,
    `Osvětlení ${wordCheck(d.lightOk)} Ok / ${wordCheck(d.lightNok)} Nok`,
    protocolCheckedText([
      {checked:d.ladder,label:"žebřík"},
      {checked:d.stairs,label:"schody"},
      {checked:d.lowCeiling,label:"snížený strop"},
      {checked:d.extremeTemp,label:"extrémní teploty"},
      {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
    ])
  ].join("   ");
}

function protocolPeriodText(protocol={}){
  const period=simpleNorm(protocol.period);
  return `${wordCheck(period.includes("6"))} 6 měsíců / ${wordCheck(period.includes("12"))} 12 měsíců`;
}

function protocolConditionsText(protocol={}){
  const n=simpleNorm(protocol.conditions || protocol.result);
  const base=`${wordCheck(n==="ano" || n==="ok")} ano / ${wordCheck(n==="ne" || n==="nok")} ne`;
  return safe(protocol.conditionsReason) ? `${base}\nOdůvodnění: ${protocol.conditionsReason}` : base;
}

function protocolMeasurementTable(protocol={}){
  const w=[1070,1070,1070,1070,1070,1070,1070,1070,1070];
  const label={bold:true,size:17,fill:"F2F2F2",align:"center"};
  const value={size:18,align:"center",height:330};
  return wordTable([
    [
      {...label,text:"Počet baterií: (ks)"},
      {...label,text:"Kapacita (Ah)"},
      {...label,text:"Počet sad (ks)",colSpan:2},
      {...label,text:"Pom. Bat (Ah)",colSpan:2},
      {...label,text:"Teplota okolí (°C)",colSpan:2},
      {...label,text:"Plomba"}
    ],
    [
      {...value,text:protocol.batteryCount},
      {...value,text:protocol.capacityAh},
      {...value,text:protocol.setCount,colSpan:2},
      {...value,text:protocol.auxBatteryAh,colSpan:2},
      {...value,text:protocol.temperature,colSpan:2},
      {...value,text:protocol.seal2}
    ],
    [
      {...label,text:"Vstup (Vac)"},
      {...label,text:"Výstup 1 (Vac)",colSpan:2},
      {...label,text:"Výstup 2 (Vac)",colSpan:2},
      {...label,text:"Výstup zál. 1 (Vac)",colSpan:2},
      {...label,text:"Výstup zál. 2 (Vac)",colSpan:2}
    ],
    [
      {...value,text:protocol.inputVac},
      {...value,text:protocol.output1Vac,colSpan:2},
      {...value,text:protocol.output2Vac,colSpan:2},
      {...value,text:protocol.backup1Vac,colSpan:2},
      {...value,text:protocol.backup2Vac,colSpan:2}
    ],
    [
      {...label,text:"Hl. bat. 1 (Vdc)"},
      {...label,text:"Reset Diagnostiky",colSpan:2},
      {...label,text:"Pom. bat. (Vdc)",colSpan:2},
      {...label,text:"Rozvážení 1 (Vdc)",colSpan:2},
      {...label,text:"Rozvážení 2 (Vdc)",colSpan:2}
    ],
    [
      {...value,text:protocol.mainBatVdc},
      {...value,text:protocol.resetDiagnostics,colSpan:2},
      {...value,text:protocol.auxBatVdc,colSpan:2},
      {...value,text:protocol.unbalance1,colSpan:2},
      {...value,text:protocol.unbalance2,colSpan:2}
    ]
  ],w) + wordBlank(25);
}

function protocolLegendXml(){
  const items=[
    ["Místo kontroly","oficiální stálá, dočasná nebo stavební adresa v tomto pořadí, popř. GPS navigace"],
    ["Provozovatel zařízení","Adresa dle obchodního rejstříku a IČO majitele zařízení (developer, SVJ)."],
    ["Objednatel zkoušky provozuschopnosti","případně objednatel montáže s následnou zkouškou, může se jednat o dodavatele zálohovaných zařízení, jehož jsme subdodavatelem, apd."],
    ["Umístění PBZ v objektu","co nejpřesnější popis zahrnuje patro a lokaci oproti vchodu do objektu, rozlišení jako např.: chodba, sklepní koje, garáže, pod schodištěm apd."],
    ["Umístění jističů UPS a zál. zařízení v objektu","poloha jističe přívodu do UPS a poloha jističů za UPS, případně poznámka, zda lze bezpečně použít odpínač uvnitř UPS."],
    ["Typ a umístění zálohovaných zařízení v objektu","např.: výtah, ventilátor, klapky, světlíky, čerpadlo, CS a TS, EPS, nouzové osvětlení, závora, vrata, sprinklery, RPO."],
    ["Umístění zálohovaných zařízení","přesná poloha zálohovaných zařízení v objektu."],
    ["Postup testování","stručný postup zkoušky, který se použije pro opakovanou kontrolu stejného zdroje."],
    ["Parkování a vstup do objektu, předepsané OOPP","informace o parkování, vjezdu, klíčích a povinných ochranných pomůckách."],
    ["Kontakty","správce za developera, správce za SVJ, firma, telefon a email."],
    ["Dostupnost","žebříky, stropy, osvětlení, WC a vše, co je anomální a ztěžuje provedení prací."],
    ["Perioda zkoušky provozuschopnosti","6 měsíců pro veřejné budovy a objekty se zvýšeným výskytem osob; 12 měsíců pro klasické bytové domy, pokud PBŘ nepředepisuje jinak."],
    ["Zařízení pracuje ve vyhovujících podmínkách","v odůvodnění uvést např. teplotu okolí, vlhkost, prašnost, mechanické poškození nebo znepřístupněné zařízení."],
    ["Poznámky","např. UPS je plně funkční, STOP STAV, vadná akumulátorová sada, vadná deska střídače apd."]
  ];
  return wordParagraph("Legenda:",{bold:true,size:20,before:90,after:40}) +
    items.map(([label,text])=>wordParagraphXml(wordRun(`${label}: `,{bold:true,size:16}) + wordRun(text,{size:16}),{after:25})).join("");
}

function buildProtocolWordDocumentXml(protocol={}){
  const site=selectedSite || {};
  const deviceType=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || site.zdroj || "";
  const place=protocol.place || protocol.siteAddress || protocol.siteName || site.adresa || "";
  const blocks=[
    wordParagraph("Potvrzení o provedené zkoušce provozuschopnosti",{align:"center",bold:true,size:28,after:80}),
    wordParagraph("Tento formulář slouží zároveň jako objednávka zkoušky provozuschopnosti. Kontrolu záložního zdroje na PBZ dle Vyhl. 246/2001 Sb. §6, §7 provedl: Servis záložních zdrojů s.r.o., IČ: 09391126",{size:18,after:80}),
    wordFormField("Datum provedení kontroly zdroje:",protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt)),
    wordFormGrid(["Kontrolované zařízení – Typ","Výrobní č.","Plomba"],[deviceType,protocol.serial,protocol.seal],[4300,2650,2680]),
    wordFormField("1) Místo kontroly:",place),
    wordFormField("2) Provozovatel zařízení:",protocol.operator),
    wordFormField("3) Objednatel zkoušky provozuschopnosti:",protocol.customer),
    wordFormField("4) Umístění PBZ v objektu:",protocol.pbzLocation),
    protocolMeasurementTable(protocol),
    wordFormField("5) Umístění jističů UPS a zál. zařízení v objektu:",protocol.breakersLocation),
    wordFormField("6) Typ a umístění zálohovaných zařízení v objektu:",protocolBackedDevicesText(protocol)),
    wordFormField("7) Umístění zálohovaných zařízení:",protocol.controlLocation),
    wordFormField("Postup testování:",protocol.testProcedure),
    wordFormField("8) Parkování a vstup do objektu, předepsané OOPP:",protocolAccessText(protocol)),
    wordFormField("9) Kontakty:",protocol.contacts),
    wordFormField("10) Dostupnost:",protocolAvailabilityText(protocol)),
    wordFormField("11) Perioda zkoušky provozuschopnosti:",protocolPeriodText(protocol)),
    wordFormField("12) Zařízení pracuje ve vyhovujících podmínkách (odůvodnění):",protocolConditionsText(protocol)),
    wordFormField("13) Poznámky:",protocol.notes || protocol.issues),
    wordSignatureGrid(protocol)
  ];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
<w:body>${blocks.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}

function buildProtocolWordStylesXml(){
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style>
<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>
</w:styles>`;
}

function buildProtocolWordEntries(protocol={}){
  const now=new Date().toISOString();
  const title=`Protokol ${protocol.siteName || protocol.place || ""}`.trim();
  const signatureBytes=protocolSignatureImageBytes(protocol);
  const imageContentType=signatureBytes ? '<Default Extension="png" ContentType="image/png"/>' : "";
  const imageRel=signatureBytes ? '<Relationship Id="rIdSignature" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/client-signature.png"/>' : "";
  const entries=[
    {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${imageContentType}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`},
    {name:"_rels/.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`},
    {name:"word/_rels/document.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${imageRel}</Relationships>`},
    {name:"word/document.xml",data:buildProtocolWordDocumentXml(protocol)},
    {name:"word/styles.xml",data:buildProtocolWordStylesXml()},
    {name:"word/settings.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/><w:defaultTabStop w:val="708"/><w:compat/></w:settings>`},
    {name:"docProps/core.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${wordXmlEscape(title)}</dc:title><dc:creator>${wordXmlEscape(protocol.createdBy || protocol.technicianEmail || currentUser?.email || "")}</dc:creator><cp:lastModifiedBy>${wordXmlEscape(currentUser?.email || "")}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`},
    {name:"docProps/app.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Servis záložních zdrojů - mapa FZ</Application></Properties>`}
  ];
  if(signatureBytes) entries.push({name:"word/media/client-signature.png",data:signatureBytes});
  return entries;
}

function officialProtocolDataForSite(site=selectedSite){
  const remote=(site?.firebaseData?.officialProtocolData && typeof site.firebaseData.officialProtocolData==="object") ? site.firebaseData.officialProtocolData : {};
  const local=readSiteLocalObject("officialProtocolData",site);
  const remoteTime=timeValueFromAny(remote.updatedAt || remote.savedAt || remote.createdAt || 0);
  const localTime=timeValueFromAny(local.updatedAt || local.savedAt || local.createdAt || 0);
  return localTime>remoteTime ? {...remote,...local} : {...local,...remote};
}

const OFFICIAL_CONTROL_SUBJECT_TEXT="Servis záložních zdrojů s.r.o.\nBožetěchova 3003/133\n612 00 Brno\nIČO: 09391126, DIČ: CZ09391126\nC 118823/KSBR Krajský soud v Brně";
const OFFICIAL_DEFAULT_MANUFACTURER_TEXT="Servis záložních zdrojů s.r.o.\nBožetěchova 3003/133\n612 00 Brno\nIČO: 09391126, DIČ: CZ09391126\nC 118823/KSBR Krajský soud v Brně";
const OFFICIAL_MANUFACTURERS={
  astip:{
    label:"Astip",
    text:"Astip servis s.r.o.\ntřída Kpt. Jaroše 1922/3, Černá Pole\n60200, Brno\nIČ: 29276861, DIČ: CZ29276861"
  },
  tipo:{
    label:"TiPO",
    text:"TIPO electric s.r.o.\ntřída Kpt. Jaroše 1922/3, Černá Pole\n60200, Brno\nIČ: 03528405, DIČ: CZ03528405"
  },
  szz:{
    label:"Servis záložních zdrojů",
    text:OFFICIAL_DEFAULT_MANUFACTURER_TEXT
  }
};

function officialManufacturerKeyFromText(value){
  const normalized=simpleNorm(value);
  if(normalized.includes("astip servis")) return "astip";
  if(normalized.includes("tipo electric")) return "tipo";
  if(normalized.includes("servis zaloznich zdroju")) return "szz";
  return "szz";
}

function officialManufacturerTextByKey(key){
  return (OFFICIAL_MANUFACTURERS[key] || OFFICIAL_MANUFACTURERS.szz).text;
}

function syncOfficialManufacturerHidden(){
  const select=document.getElementById("officialManufacturerSelect");
  const key=select?.value || "szz";
  setInputValue("officialManufacturerData",officialManufacturerTextByKey(key));
  return key;
}

function officialProtocolInputData(){
  const manufacturerKey=syncOfficialManufacturerHidden();
  return {
    operator:val("officialOperatorData"),
    objectAddress:val("officialObjectData"),
    manufacturerKey,
    manufacturer:officialManufacturerTextByKey(manufacturerKey),
    note:val("officialProtocolNote"),
    updatedAt:new Date().toISOString(),
    updatedBy:currentUser?.email || ""
  };
}

function sharedOfficialProtocolData(data={}){
  return {
    operator:data.operator || "",
    objectAddress:data.objectAddress || "",
    manufacturerKey:data.manufacturerKey || "szz",
    manufacturer:data.manufacturer || officialManufacturerTextByKey(data.manufacturerKey || "szz"),
    updatedAt:data.updatedAt || new Date().toISOString(),
    updatedBy:data.updatedBy || currentUser?.email || ""
  };
}

async function propagateOfficialProtocolDataToSiblingSources(data={},site=selectedSite,signedUser=null){
  if(!site) return 0;
  const siblings=siteSiblingRows(site)
    .filter(row=>row && !selectedSiteMatchForSave(row,detailKey(site) || site.id || "",selectedSiteDocId(site)));
  if(!siblings.length) return 0;

  const shared=sharedOfficialProtocolData(data);
  const identityKeys=new Set();
  const canSaveRemote=!!(firebaseReady && db && fb.fsMod && signedUser);
  const remoteWrites=[];
  let saved=0;

  siblings.forEach(sibling=>{
    const existing=officialProtocolDataForSite(sibling);
    const siblingData={
      ...existing,
      ...shared,
      note:existing.note || ""
    };
    writeSiteLocalObject("officialProtocolData",siblingData,sibling);
    sibling.firebaseData={...(sibling.firebaseData || {}),officialProtocolData:siblingData};
    rowIdentityKeys(sibling).forEach(key=>identityKeys.add(key));
    saved++;

    if(canSaveRemote){
      const docId=selectedSiteDocId(sibling);
      if(docId){
        const {doc,setDoc,serverTimestamp}=fb.fsMod;
        remoteWrites.push(setDoc(doc(db,"sitesUnified",docId),{
          officialProtocolData:siblingData,
          updatedAt:serverTimestamp ? serverTimestamp() : siblingData.updatedAt,
          updatedBy:currentUser?.email || ""
        },{merge:true}).catch(e=>{
          console.warn("Sdílená data dokladu se nepodařila uložit pro další zdroj",sibling,e);
        }));
      }
    }
  });

  if(remoteWrites.length) await Promise.all(remoteWrites);
  if(identityKeys.size){
    rows=rows.map(row=>{
      if(!rowMatchesIdentity(row,identityKeys)) return row;
      const existing=row.firebaseData?.officialProtocolData || {};
      return {
        ...row,
        firebaseData:{
          ...(row.firebaseData || {}),
          officialProtocolData:{...existing,...shared,note:existing.note || ""}
        }
      };
    });
    window.rows=rows;
  }
  return saved;
}

function fillOfficialProtocolInputs(site=selectedSite){
  const data=officialProtocolDataForSite(site);
  const raw=site?.raw || {};
  setInputValue("officialOperatorData",data.operator || pickRawValue(raw,["Provozovatel","Provozovatel zařízení"]) || "");
  setInputValue("officialObjectData",data.objectAddress || "");
  const manufacturerKey=data.manufacturerKey || officialManufacturerKeyFromText(data.manufacturer || "");
  setInputValue("officialManufacturerSelect",manufacturerKey);
  setInputValue("officialManufacturerData",officialManufacturerTextByKey(manufacturerKey));
  setInputValue("officialProtocolNote",data.note || "");
}

function latestDisplayedProtocol(){
  return detailHistoryItems
    .filter(isProtocolHistoryItem)
    .slice()
    .sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a))[0] || null;
}

function latestLocalProtocolForSite(site=selectedSite){
  return readSiteLocalArray("protocolHistory",site)
    .map((item,idx)=>({...item,_type:"Protokol",_collection:"localProtocols",_id:item._id || `local_protocol_${idx}`}))
    .filter(item=>recordMatchesSite(item,site))
    .sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a))[0] || null;
}

function selectedHistoryProtocol(){
  const current=detailHistoryItems[detailHistoryIndex];
  return isProtocolHistoryItem(current) ? current : null;
}

function updateOfficialProtocolSourceInfo(){
  const info=document.getElementById("officialProtocolSourceInfo");
  if(!info) return;
  const selectedProtocol=selectedHistoryProtocol();
  const protocol=selectedProtocol || latestDisplayedProtocol() || latestLocalProtocolForSite(selectedSite);
  if(protocol){
    const saved=historySavedDateLabel(protocol);
    const checked=historyDateLabel(protocol);
    info.textContent=[
      selectedProtocol ? "Použije se právě zobrazený protokol" : "Použije se poslední uložený protokol",
      saved ? `uložený ${saved}` : "",
      checked ? `(kontrola ${checked})` : ""
    ].filter(Boolean).join(" ") + ".";
  }else{
    info.textContent="Použije se poslední uložený protokol. Pokud tu ještě není, nejdřív ulož protokol kontroly.";
  }
}

function resetOfficialProtocolSection(site=selectedSite){
  fillOfficialProtocolInputs(site);
  const box=document.getElementById("officialProtocolDataBox");
  const status=document.getElementById("officialProtocolStatus");
  if(box) box.style.display="none";
  if(status) status.textContent="";
  updateOfficialProtocolSourceInfo();
}

async function saveOfficialProtocolData(options={}){
  const status=document.getElementById("officialProtocolStatus");
  if(!selectedSite){
    if(status) status.textContent="Není vybrané místo.";
    return null;
  }
  const data=officialProtocolInputData();
  if(!safe(data.operator) || !safe(data.objectAddress)){
    const box=document.getElementById("officialProtocolDataBox");
    if(box) box.style.display="grid";
    if(status) status.textContent="Nejdřív ručně vyplň bod a) Provozovatel PBZ a bod b) Adresa objektu. Bod b) se nepřebírá z protokolu ani z detailu.";
    return null;
  }
  writeSiteLocalObject("officialProtocolData",data,selectedSite);
  selectedSite.firebaseData={...(selectedSite.firebaseData || {}),officialProtocolData:data};
  let savedToFirebase=false;
  let signedUser=null;
  const docId=selectedSiteDocId(selectedSite);
  if(docId && firebaseReady && db && fb.fsMod){
    signedUser=await waitForFirebaseUser(1200);
    if(signedUser){
      try{
        const {doc,setDoc,serverTimestamp}=fb.fsMod;
        await setDoc(doc(db,"sitesUnified",docId),{
          officialProtocolData:data,
          updatedAt:serverTimestamp ? serverTimestamp() : data.updatedAt,
          updatedBy:currentUser?.email || ""
        },{merge:true});
        savedToFirebase=true;
      }catch(e){
        console.warn("Uložení dat provozovatele selhalo",e);
        if(!options.silent && status) status.textContent=`Data provozovatele jsou uložená jen lokálně: ${e.message}`;
      }
    }
  }
  const siblingCount=await propagateOfficialProtocolDataToSiblingSources(data,selectedSite,signedUser);
  if(!options.silent){
    const siblingText=siblingCount ? ` Data propsána i do dalších zdrojů na stejném místě: ${siblingCount}.` : "";
    if(status) status.textContent=(savedToFirebase ? "Data provozovatele uložena." : "Data provozovatele uložena lokálně.") + siblingText;
    showSaveConfirmation(siblingCount ? "Data provozovatele uložena pro celé místo." : "Data provozovatele uložena.");
  }
  return data;
}

async function protocolForOfficialDocument(){
  const visible=selectedHistoryProtocol() || latestDisplayedProtocol();
  if(visible) return visible;
  const local=latestLocalProtocolForSite(selectedSite);
  if(local) return local;
  if(!firebaseReady || !db) return null;
  try{
    const last=await getLastProtocol(selectedSite);
    return last || null;
  }catch(e){
    console.warn("Poslední protokol pro doklad se nepodařilo načíst",e);
    return null;
  }
}

function officialProtocolResultText(mode){
  return mode==="stop" ? "--- STOP STAV ---" : "--bez závad--";
}

function officialProtocolFunctionalText(mode){
  return mode==="stop" ? "--- ZAŘÍZENÍ NENÍ PROVOZUSCHOPNÉ ---" : "--zařízení je provozuschopné--";
}

function officialProtocolConditionsValue(protocol={},mode="ok"){
  if(typeof protocol.conditions==="boolean") return protocol.conditions ? "ano" : "ne";
  const normalized=simpleNorm(protocol.conditions);
  if(normalized){
    if(normalized==="ne" || normalized==="no" || normalized==="false" || normalized==="0" || normalized.includes("nevyhov")) return "ne";
    if(normalized==="ano" || normalized==="yes" || normalized==="true" || normalized==="1" || normalized==="ok" || normalized.includes("vyhov")) return "ano";
  }
  return mode==="stop" ? "ne" : "ano";
}

function officialProtocolConditionsText(protocol={},mode="ok"){
  return `-- ${officialProtocolConditionsValue(protocol,mode)} --${officialProtocolConditionsReasonText(protocol)}`;
}

function officialProtocolConditionsReasonText(protocol={}){
  const reason=officialOneLine(protocol.conditionsReason || protocol.environmentReason || protocol.reason || "",90);
  return reason ? ` Důvod: ${reason}` : "";
}

function officialProtocolNextDate(protocol={},site=selectedSite){
  const explicit=protocol.nextDate || protocol.nextCheck || site?.pristi || first(site?.raw || {},NEXT_CHECK_KEYS);
  const explicitDate=parseDateValue(explicit);
  if(explicitDate) return formatDateCz(explicitDate);
  const control=parseDateValue(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  if(!control) return "";
  const p=simpleNorm(protocol.period);
  const months=p.includes("12") ? 12 : (p.includes("6") ? 6 : periodMonths(site));
  return formatDateCz(addMonths(control,months));
}

function officialProtocolRemedyMonth(protocol={}){
  const control=parseDateValue(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  if(!control) return "";
  const remedy=addMonths(control,2);
  const month=String(remedy.getMonth()+1).padStart(2,"0");
  return `${month}/${remedy.getFullYear()}`;
}

function officialProtocolDeviceLine(protocol={},site=selectedSite){
  const device=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || protocolDeviceTypeFromSite(site);
  const serial=protocol.serial || protocolSerialFromSite(site);
  const seal=protocol.seal || "";
  return [device,serial,seal].map(safe).filter(Boolean).join(", ");
}

function officialMeasurementLineText(label,value,unit){
  const measured=unit==="RAW" ? officialOneLine(value) : officialMeasurementValue(value,unit);
  let suffix="";
  if(measured){
    if(unit==="VAC") suffix=" VAC";
    if(unit==="VDC") suffix=" VDC";
    if(unit==="TEMP" && /^[-+]?\d/.test(measured)) suffix=" °C";
  }
  return `${label} –${measured ? ` ${measured}${suffix}` : ""}`;
}

function officialOptionalMeasurementLineText(label,value,unit){
  const measured=unit==="RAW" ? officialOneLine(value) : officialMeasurementValue(value,unit);
  return measured ? officialMeasurementLineText(label,value,unit) : "";
}

function officialMeasurementPairValue(firstValue,secondValue,unit){
  const first=officialMeasurementValue(firstValue,unit);
  const second=officialMeasurementValue(secondValue,unit);
  if(first && second) return `1: ${first}   2: ${second}`;
  return first || second;
}

function officialProtocolMeasurementColumns(protocol={}){
  const unbalance=officialCombinedMeasurement(protocol.unbalance1,protocol.unbalance2);
  const output1=officialMeasurementLineText("Výstup 1",protocol.output1Vac,"VAC");
  const backup1=officialMeasurementLineText("Výstup při záloze 1",protocol.backup1Vac,"VAC");
  return {
    left:[
      officialMeasurementLineText("Vstup",protocol.inputVac,"VAC"),
      output1,
      backup1,
      officialMeasurementLineText("Pomocná baterie",protocol.auxBatVdc,"VDC")
    ],
    right:[
      officialOptionalMeasurementLineText("Výstup 2",protocol.output2Vac,"VAC"),
      officialOptionalMeasurementLineText("Výstup při záloze 2",protocol.backup2Vac,"VAC"),
      officialMeasurementLineText("Hlavní baterie",protocol.mainBatVdc,"VDC"),
      officialMeasurementLineText("Rozvážení baterií",unbalance,"VDC"),
      officialMeasurementLineText("Teplota v okolí",protocol.temperature,"TEMP")
    ].filter(line=>safe(line).trim())
  };
}

function officialProtocolMeasurementNotesXml(protocol={},extraNote="",after=80){
  const columns=officialProtocolMeasurementColumns(protocol);
  const columnXml=lines=>lines.filter(line=>safe(line).trim()).map(line=>wordParagraph(line,{size:22,after:0})).join("");
  const notes=[];
  if(safe(protocol.notes || protocol.issues)) notes.push(`Poznámka z protokolu – ${safe(protocol.notes || protocol.issues)}`);
  if(safe(extraNote)) notes.push(`Poznámka do dokladu – ${safe(extraNote)}`);
  const notesXml=notes.map(text=>wordParagraph(text,{size:22,after:0})).join("");
  return wordTable([[
    {xml:columnXml(columns.left),vAlign:"top"},
    {xml:columnXml(columns.right),vAlign:"top"}
  ]],[4815,4815],{noBorders:true}) + (notesXml ? wordBlank(10) + notesXml : "") + wordBlank(after);
}

function officialManufacturerText(officialData={}){
  if(officialData.manufacturerKey) return officialManufacturerTextByKey(officialData.manufacturerKey);
  const text=protocolExportValue(officialData.manufacturer).trim();
  if(!text) return OFFICIAL_DEFAULT_MANUFACTURER_TEXT;
  const normalized=simpleNorm(text);
  if(normalized.includes("servis zaloznich zdroju") && normalized.includes("118823")){
    return text
      .replace(/,\s*C\s*118823\/KSBR\s*Krajský\s+soud\s+v\s+Brně/i,"\nC 118823/KSBR Krajský soud v Brně")
      .replace(/\n\s*C\s*118823\/KSBR\s*Krajský\s+soud\s+v\s+Brně/i,"\nC 118823/KSBR Krajský soud v Brně");
  }
  if(normalized.includes("servis zaloznich zdroju") && normalized.includes("09391126") && !normalized.includes("118823")){
    const lines=text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
    const lineIndex=lines.findIndex(line=>/I[ČC]O|I[ČC]|ICO/i.test(line));
    if(lineIndex>=0){
      lines[lineIndex]=lines[lineIndex].replace(/\s+$/,"");
      lines.splice(lineIndex+1,0,"C 118823/KSBR Krajský soud v Brně");
      return lines.join("\n");
    }
    return OFFICIAL_DEFAULT_MANUFACTURER_TEXT;
  }
  return text;
}

function officialRtfMeasurementTextLine(text){
  return `{\\rtlch\\fcs1 \\af0\\afs24 \\ltrch\\fcs0 \\fs24 ${officialRtfEscape(text)}\\par }`;
}

function officialRtfCompactMeasurements(protocol={}){
  const columns=officialProtocolMeasurementColumns(protocol);
  const leftRows=columns.left.map(officialRtfMeasurementTextLine).join("");
  const rightRows=columns.right.map(officialRtfMeasurementTextLine).join("");
  return `{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\sect }\\sectd \\ltrsect\\sbknone\\linex0\\headery708\\footery708\\cols2\\colsx2\\endnhere\\sectdefaultcl \\pard\\plain \\ltrpar\\ql \\li0\\ri0\\sb0\\sa0\\sl260\\slmult1\\nowidctlpar\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 \\rtlch\\fcs1 \\af24\\afs24\\alang1081 \\ltrch\\fcs0 \\fs24\\lang1029\\langfe2052\\kerning3\\cgrid\\langnp1029\\langfenp2052 ${leftRows}\\column ${rightRows}`;
}

function compactOfficialRtfMeasurementSection(output,protocol={}){
  const compact=`${officialRtfCompactMeasurements(protocol)}{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\sect }`;
  const patterns=[
    /\{\\rtlch\\fcs1 [^{}]*?\\sect \}\\sectd \\ltrsect\\sbknone\\linex0\\headery708\\footery708\\cols2\\colsx2[\s\S]*?Pomocn\\'e1 baterie \\endash[\s\S]*?\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\insrsid3878691\\charrsid536511 \\sect \}/,
    /\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 [^{}]*Vstup \\endash[\s\S]*?Pomocn\\'e1 baterie \\endash[\s\S]*?\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\insrsid3878691\\charrsid536511 \\sect \}/
  ];
  for(const pattern of patterns){
    if(pattern.test(output)) return output.replace(pattern,compact);
  }
  return output;
}

function officialBlockXml(label,value){
  return wordParagraph(label,{bold:true,size:20,after:35}) + wordParagraph(value || " ",{size:20,after:0});
}

function officialTwoColumnXml(leftLabel,leftValue,rightLabel,rightValue,options={}){
  const after=Number.isFinite(options.after) ? options.after : 25;
  return wordTable([[
    {xml:officialBlockXml(leftLabel,leftValue),vAlign:"top"},
    {xml:officialBlockXml(rightLabel,rightValue),vAlign:"top"}
  ]],[4815,4815],{noBorders:true}) + wordBlank(after);
}

function officialInlineParagraph(label,value){
  return wordParagraphXml(wordRun(label,{bold:true,size:20}) + wordRun(value || " ",{size:20}),{after:45});
}

function buildOfficialProtocolWordDocumentXml(protocol={},officialData={},mode="ok"){
  const site=selectedSite || {};
  const operator=officialOperatorText(officialData.operator);
  const objectAddress=safe(officialData.objectAddress);
  const place=protocol.pbzLocation || protocolSourceLocationFromSite(site) || "";
  const controlDate=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  const nextDate=officialProtocolNextDate(protocol,site);
  const controlSubject=OFFICIAL_CONTROL_SUBJECT_TEXT;
  const manufacturer=officialManufacturerText(officialData);
  const tech="Ing. Michal Tipek";
  const blocks=[
    wordParagraph("Doklad o servisní kontrole a zkoušce provozuschopnosti PBZ",{align:"center",bold:true,size:26,after:30}),
    wordParagraph("dle zákona č. 133/1985 a vyhlášky 246/2001 Sb.",{align:"center",size:20,after:20}),
    wordParagraph("Doklad byl sestaven dle vyhl. 246/2001 Sb. §7, odst.8, písm. a – f.",{align:"center",size:20,after:120}),
    officialTwoColumnXml("a) Provozovatel PBZ:",operator,"b) Adresa objektu kde je PBZ umístěno:",objectAddress,{after:0}),
    officialInlineParagraph("c) Umístění PBZ: ",place),
    officialInlineParagraph("d) Typ záložního zdroje, Výrobní číslo, plomba: ",officialProtocolDeviceLine(protocol,site)),
    officialTwoColumnXml("e) Kontrolní subjekt:",controlSubject,"f) Výrobce PBZ:",manufacturer,{after:70}),
    officialInlineParagraph("g) Výsledek kontroly provozuschopnosti: ",officialProtocolResultText(mode)),
    officialInlineParagraph("h) Výsledek funkčních zkoušek: ",officialProtocolFunctionalText(mode)),
    officialInlineParagraph("i) Datum provedení kontroly: ",controlDate),
    officialInlineParagraph("j) Datum příští kontroly do: ",nextDate),
    wordParagraph("k) Potvrzení kontrolního subjektu:",{bold:true,size:20,after:45}),
    wordParagraph("Potvrzujeme, že jsme provedli funkční zkoušku a kontrolu provozuschopnosti výše uvedeného zařízení v souladu s platnými právními předpisy §6 a §7 vyhlášky MV246/2001 Sb., normativními požadavky, dokumentací a technickými podmínkami výrobce.",{size:20,after:70}),
    officialInlineParagraph("l) Zařízení pracuje ve vyhovujících podmínkách: ",officialProtocolConditionsText(protocol,mode)),
    wordParagraph("Poznámky:",{bold:true,size:20,after:35}),
    officialProtocolMeasurementNotesXml(protocol,officialData.note,25),
    wordBlank(180),
    wordTable([
      [
        {text:"______________________________________",size:18,align:"center"},
        {xml:wordClientSignatureCellXml(protocol,{compact:true}) + wordParagraph("______________________________________",{size:18,align:"center"})}
      ],
      [
        {text:`Servis záložních zdrojů s.r.o. – ${tech}`,size:18,align:"center"},
        {text:"převzal za objednavatele",size:18,align:"center"}
      ]
    ],[4815,4815],{noBorders:true})
  ];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
<w:body>${blocks.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="700" w:right="850" w:bottom="700" w:left="850" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}

function buildOfficialProtocolWordEntries(protocol={},officialData={},mode="ok"){
  const now=new Date().toISOString();
  const title=`Doklad provozuschopnosti ${protocol.siteName || protocol.place || selectedSite?.adresa || ""}`.trim();
  const signatureBytes=protocolSignatureImageBytes(protocol);
  const imageContentType=signatureBytes ? '<Default Extension="png" ContentType="image/png"/>' : "";
  const imageRel=signatureBytes ? '<Relationship Id="rIdSignature" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/client-signature.png"/>' : "";
  const entries=[
    {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${imageContentType}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`},
    {name:"_rels/.rels",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'},
    {name:"word/_rels/document.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${imageRel}</Relationships>`},
    {name:"word/document.xml",data:buildOfficialProtocolWordDocumentXml(protocol,officialData,mode)},
    {name:"word/styles.xml",data:buildProtocolWordStylesXml()},
    {name:"word/settings.xml",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/><w:defaultTabStop w:val="708"/><w:compat/></w:settings>'},
    {name:"docProps/core.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${wordXmlEscape(title)}</dc:title><dc:creator>${wordXmlEscape(protocol.createdBy || protocol.technicianEmail || currentUser?.email || "")}</dc:creator><cp:lastModifiedBy>${wordXmlEscape(currentUser?.email || "")}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`},
    {name:"docProps/app.xml",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Servis záložních zdrojů - mapa FZ</Application></Properties>'}
  ];
  if(signatureBytes) entries.push({name:"word/media/client-signature.png",data:signatureBytes});
  return entries;
}

const OFFICIAL_RTF_TEMPLATE_URL="official-template.rtf";
const OFFICIAL_STOP_RTF_TEMPLATE_URL="official-stop-template.rtf";
const OFFICIAL_TIPEK_SIGNATURE_URL="./podpis-tipek.png";
const OFFICIAL_WATERMARK_LOGO_URL="./szz-logo-display.png";
const officialRtfTemplateCache={};
let officialTipekSignatureBytesCache=null;
let officialWatermarkLogoBytesCache=null;

async function loadOfficialRtfTemplate(mode="ok"){
  const key=mode==="stop" ? "stop" : "ok";
  if(officialRtfTemplateCache[key]) return officialRtfTemplateCache[key];
  const url=key==="stop" ? OFFICIAL_STOP_RTF_TEMPLATE_URL : OFFICIAL_RTF_TEMPLATE_URL;
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok) throw new Error(`Šablonu ${url} se nepodařilo načíst (${response.status}).`);
  const template=await response.text();
  if(!template.includes("__SZZ_OPERATOR_1__")) throw new Error("Šablona dokladu nemá připravená vyplňovací pole.");
  officialRtfTemplateCache[key]=template;
  return template;
}

async function loadOfficialTipekSignatureBytes(){
  if(officialTipekSignatureBytesCache) return officialTipekSignatureBytesCache;
  try{
    const response=await fetch(OFFICIAL_TIPEK_SIGNATURE_URL,{cache:"force-cache"});
    if(!response.ok) throw new Error(`Podpis se nepodařilo načíst (${response.status}).`);
    officialTipekSignatureBytesCache=new Uint8Array(await response.arrayBuffer());
    return officialTipekSignatureBytesCache;
  }catch(e){
    console.warn("Podpis Ing. Tipek se nepodařilo načíst",e);
    return null;
  }
}

async function loadOfficialWatermarkLogoBytes(){
  if(officialWatermarkLogoBytesCache) return officialWatermarkLogoBytesCache;
  try{
    const response=await fetch(OFFICIAL_WATERMARK_LOGO_URL,{cache:"force-cache"});
    if(!response.ok) throw new Error(`Logo se nepodařilo načíst (${response.status}).`);
    officialWatermarkLogoBytesCache=new Uint8Array(await response.arrayBuffer());
    return officialWatermarkLogoBytesCache;
  }catch(e){
    console.warn("Logo pro vodoznak dokladu se nepodařilo načíst",e);
    return null;
  }
}

function officialOneLine(value,maxLength=0){
  const text=protocolExportValue(value).replace(/\u00a0/g," ").replace(/\s+/g," ").trim();
  if(!maxLength || text.length<=maxLength) return text;
  return `${text.slice(0,Math.max(0,maxLength-3)).trim()}...`;
}

function officialMultiline(value,maxLines=4){
  const lines=protocolExportValue(value)
    .replace(/\u00a0/g," ")
    .replace(/\r\n/g,"\n")
    .replace(/\r/g,"\n")
    .split("\n")
    .map(line=>officialOneLine(line))
    .filter(Boolean);
  if(maxLines>1 && lines.length>maxLines){
    const head=lines.slice(0,maxLines-1);
    const tail=lines.slice(maxLines-1).join(", ");
    return head.concat([officialOneLine(tail)]).slice(0,maxLines);
  }
  while(lines.length<maxLines) lines.push("");
  return lines.slice(0,maxLines);
}

function officialOperatorLines(value,maxLines=4){
  return officialMultiline(value,maxLines);
}

function officialOperatorText(value){
  return officialOperatorLines(value,5).filter(Boolean).join("\n");
}

function officialIcoValue(value){
  return officialOneLine(value).replace(/^(i[čc]o|i[čc]|ico)\s*[:：]?\s*/i,"");
}

function officialMeasurementValue(value,unit){
  let text=officialOneLine(value);
  if(!text) return "";
  if(unit==="VAC") text=text.replace(/\s*VAC\.?\s*$/i,"");
  if(unit==="VDC") text=text.replace(/\s*VDC\.?\s*$/i,"");
  if(unit==="TEMP") text=text.replace(/\s*(°C|C)\s*$/i,"");
  return text.trim();
}

function officialCombinedMeasurement(...values){
  return values.map(value=>officialMeasurementValue(value,"VDC")).filter(Boolean).join(" / ");
}

function officialRtfEscape(value){
  const text=protocolExportValue(value);
  let out="";
  for(const ch of text){
    if(ch==="\n"){
      out+="\\line ";
      continue;
    }
    if(ch==="\\") out+="\\\\";
    else if(ch==="{") out+="\\{";
    else if(ch==="}") out+="\\}";
    else{
      const code=ch.codePointAt(0);
      if(code===160) out+="\\~";
      else if(code<128) out+=ch;
      else out+=`\\u${code>32767 ? code-65536 : code}?`;
    }
  }
  return out;
}

function officialRtfRun(text,{bold=false,underline=false}={}){
  const styles=[
    "\\rtlch\\fcs1",
    bold ? "\\ab" : "",
    "\\af0\\afs22",
    "\\ltrch\\fcs0",
    bold ? "\\b" : "",
    "\\fs22",
    underline ? "\\ul" : ""
  ].filter(Boolean).join(" ");
  return `{${styles} ${officialRtfEscape(text)}}`;
}

function officialRtfSubjectBlock(officialData={}){
  const left=officialMultiline(OFFICIAL_CONTROL_SUBJECT_TEXT,5);
  const right=officialMultiline(officialManufacturerText(officialData),5);
  const paragraph="\\pard \\ltrpar\\ql \\li0\\ri0\\sl250\\slmult1\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 ";
  const heading=`${paragraph}${officialRtfRun("e) Kontrolní subjekt:",{bold:true,underline:true})}\\tab ${officialRtfRun("f) Výrobce PBZ:",{bold:true,underline:true})}\\par`;
  const rows=left.map((line,idx)=>`${paragraph}${officialRtfRun(line || " ")}\\tab ${officialRtfRun(right[idx] || " ")}\\par`).join("\n");
  const blank=`${paragraph}${officialRtfRun(" ")}\\tab ${officialRtfRun(" ")}\\par`;
  return `${heading}\n${blank}\n${rows}\n${blank}\n`;
}

function officialRtfOperatorObjectBlock(officialData={}){
  const left=officialOperatorLines(officialData.operator,5).filter(Boolean);
  const right=officialMultiline(officialData.objectAddress,5).filter(Boolean);
  const rowCount=Math.max(left.length,right.length,1);
  const paragraph="\\pard \\ltrpar\\ql \\li0\\ri0\\sl250\\slmult1\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 ";
  const heading=`${paragraph}${officialRtfRun("a) Provozovatel PBZ:",{bold:true,underline:true})}\\tab ${officialRtfRun("b) Adresa objektu kde je PBZ umístěno:",{bold:true,underline:true})}\\par`;
  const rows=Array.from({length:rowCount},(_,idx)=>`${paragraph}${officialRtfRun(left[idx] || " ")}\\tab ${officialRtfRun(right[idx] || " ")}\\par`).join("\n");
  const blank=`${paragraph}${officialRtfRun(" ")}\\tab ${officialRtfRun(" ")}\\par`;
  return `${heading}\n${blank}\n${rows}\n`;
}

function replaceOfficialRtfOperatorObjectBlock(output,officialData={}){
  const operatorLabel="Provozovatel PBZ:";
  const locationLabel="Um\\'edst\\'ecn\\'ed PBZ:";
  const labelIndex=output.indexOf(operatorLabel);
  const locationIndex=output.indexOf(locationLabel,labelIndex);
  if(labelIndex<0 || locationIndex<0) return output;
  const aMarker=output.lastIndexOf(" a)}",labelIndex);
  const start=aMarker>=0 ? output.lastIndexOf("{\\rtlch",aMarker) : output.lastIndexOf("{\\rtlch",labelIndex);
  const end=output.lastIndexOf("\\pard\\plain",locationIndex);
  if(start<0 || end<0 || end<=start) return output;
  return `${output.slice(0,start)}${officialRtfOperatorObjectBlock(officialData)}${output.slice(end)}`;
}

function replaceOfficialRtfSubjectBlock(output,officialData={}){
  const manufacturerLabel="V\\'fdrobce PBZ:";
  const labelIndex=output.indexOf(manufacturerLabel);
  if(labelIndex<0) return output;
  const resultIndex=output.indexOf("{\\*\\bkmkstart _Hlk56757522}",labelIndex);
  const resultStart=output.lastIndexOf("{\\rtlch\\fcs1",resultIndex);
  const start=output.lastIndexOf("\\pard \\ltrpar\\ql \\li0\\ri0\\nowidctlpar\\tx4962",labelIndex);
  if(start<0 || resultStart<0 || resultStart<=start) return output;
  return `${output.slice(0,start)}${officialRtfSubjectBlock(officialData)}${output.slice(resultStart)}`;
}

function rtfVisibleText(segment){
  return safe(segment)
    .replace(/\\'[0-9a-fA-F]{2}/g,"x")
    .replace(/\\[a-zA-Z]+-?\d* ?/g,"")
    .replace(/[{}]/g,"")
    .trim();
}

function removeOfficialRtfBlankBeforeLocation(output){
  const labelIndex=output.indexOf("Um\\'edst\\'ecn\\'ed PBZ:");
  if(labelIndex<0) return output;
  const locationLabelRunStart=output.lastIndexOf("{\\rtlch",labelIndex);
  const locationMarkerRunStart=output.lastIndexOf("{\\rtlch",locationLabelRunStart-1);
  const locationRunStart=locationMarkerRunStart>=0 ? locationMarkerRunStart : locationLabelRunStart;
  const sectionStart=output.lastIndexOf("\\sectdefaultcl",locationRunStart);
  const paragraphStart=output.indexOf("\\pard\\plain",sectionStart);
  const firstRunStart=output.indexOf("{\\rtlch",paragraphStart);
  const blankEnd=output.lastIndexOf("\\par }",locationRunStart);
  if(sectionStart<0 || paragraphStart<0 || firstRunStart<0 || blankEnd<firstRunStart) return output;
  const blankParagraph=output.slice(firstRunStart,blankEnd+"\\par }".length);
  if(blankParagraph.length>1800 || rtfVisibleText(blankParagraph)) return output;
  const paragraphPrefix=output.slice(paragraphStart,firstRunStart);
  return `${output.slice(0,paragraphStart)}${paragraphPrefix}${output.slice(locationRunStart)}`;
}

function removeOfficialSpacerRunBeforeMarker(block,marker){
  const idx=block.indexOf(marker);
  if(idx<0) return block;
  const before=block.slice(0,idx);
  const after=block.slice(idx);
  const cleaned=before.replace(/(\{\\rtlch\\fcs1[^{}]*(?:I\\'c8O:\s*|\s+)\})\s*(\{\\rtlch\\fcs1[^{}]*\s*)$/,"$2");
  return `${cleaned}${after}`;
}

function normalizeOfficialRtfOperatorBlock(output){
  const first=output.indexOf("__SZZ_OPERATOR_1__");
  const object=output.indexOf("__SZZ_OBJECT_1__",first);
  if(first<0 || object<0) return output;
  const start=output.lastIndexOf("\\pard\\plain",first);
  const blockStart=start>=0 ? start : first;
  let block=output.slice(blockStart,object);
  block=block.replace(/\\li142/g,"\\li0").replace(/\\lin142/g,"\\lin0");
  [
    "__SZZ_OPERATOR_1__",
    "__SZZ_OPERATOR_2__",
    "__SZZ_OPERATOR_3__",
    "__SZZ_OPERATOR_4__"
  ].forEach(marker=>{
    block=removeOfficialSpacerRunBeforeMarker(block,marker);
  });
  return `${output.slice(0,blockStart)}${block}${output.slice(object)}`;
}

function shrinkOfficialRtfTextSize(output){
  return output.replace(/\\(a?fs)(\d+)/g,(match,prefix,sizeText)=>{
    const size=Number(sizeText);
    if(!Number.isFinite(size) || size<=10) return match;
    return `\\${prefix}${Math.max(10,size-2)}`;
  });
}

function bytesToHex(bytes){
  return Array.from(bytes || [],byte=>byte.toString(16).padStart(2,"0")).join("");
}

function szzLogoDataUrl(){
  const logo=document.querySelector("[data-szz-logo-copy]") || document.querySelector(".logo-img");
  return safe(logo?.getAttribute("src") || logo?.src || "");
}

function dataUrlImageBytes(dataUrl){
  const match=safe(dataUrl).match(/^data:image\/(?:png|jpe?g);base64,(.+)$/i);
  if(!match) return null;
  try{return base64ToBytes(match[1]);}catch(e){return null;}
}

function officialRtfWatermark(officialData={}){
  const bytes=officialData.watermarkLogoBytes || dataUrlImageBytes(szzLogoDataUrl());
  if(!bytes) return "";
  const hex=bytesToHex(bytes);
  return `{\\shp{\\*\\shpinst\\shpleft900\\shptop4300\\shpright9900\\shpbottom8765\\shpfhdr1\\shpbxcolumn\\shpbxignore\\shpbypara\\shpbyignore\\shpwr3\\shpwrk0\\shpfblwtxt1\\shpz2\\shplid20260728{\\sp{\\sn shapeType}{\\sv 75}}{\\sp{\\sn fLockAspectRatio}{\\sv 1}}{\\sp{\\sn fFlipH}{\\sv 0}}{\\sp{\\sn fFlipV}{\\sv 0}}{\\sp{\\sn pib}{\\sv {\\pict\\piccropl0\\piccropr0\\piccropt0\\piccropb0\\picw998\\pich495\\picwgoal9000\\pichgoal4465\\pngblip ${hex}}}}{\\sp{\\sn pibFlags}{\\sv 2}}{\\sp{\\sn pictureContrast}{\\sv 19661}}{\\sp{\\sn pictureBrightness}{\\sv 22938}}{\\sp{\\sn fLine}{\\sv 0}}{\\sp{\\sn wzName}{\\sv WordPictureWatermarkSZZ}}{\\sp{\\sn posh}{\\sv 2}}{\\sp{\\sn posrelh}{\\sv 0}}{\\sp{\\sn posv}{\\sv 2}}{\\sp{\\sn posrelv}{\\sv 0}}{\\sp{\\sn dhgt}{\\sv 251660288}}{\\sp{\\sn fLayoutInCell}{\\sv 0}}{\\sp{\\sn fBehindDocument}{\\sv 1}}}}{\\shprslt\\par\\pard\\ql \\li0\\ri0\\widctlpar\\phmrg\\posxc\\posyc\\dxfrtext180\\dfrmtxtx180\\dfrmtxty0\\wraparound\\aspalpha\\aspnum\\faauto\\adjustright\\rin0\\lin0\\itap0}\\par `;
}

function addOfficialRtfWatermark(output,officialData={}){
  if(output.includes("WordPictureWatermarkSZZ")) return output;
  const watermark=officialRtfWatermark(officialData);
  if(!watermark) return output;
  const shapeIndex=output.indexOf("{\\shp{\\*\\shpinst");
  if(shapeIndex<0) return output;
  return `${output.slice(0,shapeIndex)}${watermark}${output.slice(shapeIndex)}`;
}

function officialRtfSignatureImage(protocol={}){
  const bytes=protocolSignatureImageBytes(protocol);
  if(!bytes) return "";
  return `{\\pict\\pngblip\\picw900\\pich260\\picwgoal3800\\pichgoal1100 ${bytesToHex(bytes)}}`;
}

function officialRtfTipekSignatureImage(officialData={}){
  const bytes=officialData.tipekSignatureBytes;
  if(!bytes) return "";
  return `{\\pict\\pngblip\\picw865\\pich666\\picwgoal2850\\pichgoal2195 ${bytesToHex(bytes)}}`;
}

function officialRtfClientSignatureContent(protocol={}){
  const name=officialOneLine(protocol.clientSign || protocol.customer || "",80);
  const signature=officialRtfSignatureImage(protocol);
  const parts=[];
  if(name) parts.push(`{\\fs18 ${officialRtfEscape(name)}}`);
  if(signature) parts.push(signature);
  return parts.join(" ");
}

function officialRtfSignatureRow(protocol={},officialData={}){
  const left=officialRtfTipekSignatureImage(officialData);
  const right=officialRtfClientSignatureContent(protocol);
  if(!left && !right) return "";
  const leftCell=left || "{\\fs18 \\~}";
  const rightCell=right || "{\\fs18 \\~}";
  return `{\\pard \\ltrpar\\ql \\li0\\ri0\\sb0\\sa0\\sl0\\slmult0\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 {\\*\\szztipeksignature PodpisTipekSZZ}{\\rtlch\\fcs1 \\af0\\afs18 \\ltrch\\fcs0 \\fs18 ${leftCell}\\tab ${rightCell}}\\par }`;
}

function addOfficialRtfSignatures(output,protocol={},officialData={}){
  const block=officialRtfSignatureRow(protocol,officialData);
  if(!block || output.includes("PodpisTipekSZZ")) return output;
  const marker=/(\{\\\*\\bkmkstart _Hlk178752668\})______________________________________/;
  if(marker.test(output)){
    return output.replace(marker,`$1${block}______________________________________`);
  }
  return output.replace("______________________________________        ______________________________________",`${block}______________________________________        ______________________________________`);
}

function compactOfficialRtfEmptyNoteBeforeSignatures(output,officialData={}){
  return output.replace(/\\par\s*\\par\s*(\}\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\fs22\\insrsid3356663\\charrsid9718217 \{\\\*\\bkmkstart _Hlk178752668\})/,"\\par $1");
}

function officialRtfHighlightedNoteRun(text,{bold=false,underline=false}={}){
  const rtlBold=bold ? "\\ab" : "";
  const ltrBold=bold ? "\\b" : "";
  const underlineStyle=underline ? "\\ul" : "";
  return `{\\rtlch\\fcs1 ${rtlBold}\\af0\\afs22 \\ltrch\\fcs0 ${ltrBold}\\fs22${underlineStyle}\\highlight7 ${officialRtfEscape(text)}}`;
}

function inlineOfficialRtfNoteHeading(output,officialData={}){
  const note=officialOneLine(officialData.note,130);
  if(!note) return output;
  const marker="Pozn\\'e1mky:";
  const idx=output.indexOf(marker);
  if(idx<0) return output;
  const insertion=officialRtfHighlightedNoteRun(` ${note}`);
  return `${output.slice(0,idx+marker.length)}${insertion}${output.slice(idx+marker.length)}`;
}

function removeOfficialRtfOperatorIcoLabel(output){
  const marker="__SZZ_OPERATOR_4__";
  const idx=output.indexOf(marker);
  if(idx<0) return output;
  const label="I\\'c8O:";
  const start=output.lastIndexOf(label,idx);
  if(start>=0 && idx-start<260){
    return `${output.slice(0,start)}     ${output.slice(start+label.length)}`;
  }
  return output;
}

function normalizeOfficialRtfClientLabel(output){
  return output.replace(/p\\'f8\s*evzal za provozovatele/g,"p\\'f8evzal za objednavatele");
}

function officialProtocolConditionsTail(protocol={},mode="ok"){
  return `${officialProtocolConditionsValue(protocol,mode)} --${officialProtocolConditionsReasonText(protocol)}`;
}

function highlightOfficialStopResultLetter(output,mode="ok"){
  if(mode!=="stop") return output;
  return output
    .replace(
      /(\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\b\\fs22)(\\insrsid2818420\\charrsid9718217 \{\\\*\\bkmkstart _Hlk56757522\}g\})/,
      "$1\\highlight7$2"
    )
    .replace(
      /(\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\b\\fs22)(\\insrsid7237376\\charrsid9718217 \) \})/,
      "$1\\highlight7$2"
    );
}

function officialProtocolTemplateValues(protocol={},officialData={},mode="ok"){
  const site=selectedSite || {};
  const operator=officialOperatorLines(officialData.operator,5);
  const object=officialMultiline(officialData.objectAddress,4);
  const operatorFourthLine=[operator[3],operator[4]].filter(Boolean).join("\n");
  const controlDate=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  const device=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || protocolDeviceTypeFromSite(site);
  const serial=protocol.serial || protocolSerialFromSite(site);
  const seal=protocol.seal || "";
  const tech="Ing. Michal Tipek";
  return {
    "__SZZ_OPERATOR_1__":operator[0],
    "__SZZ_OPERATOR_2__":operator[1],
    "__SZZ_OPERATOR_3__":operator[2],
    "__SZZ_OPERATOR_4__":operatorFourthLine,
    "__SZZ_OBJECT_1__":object[0],
    "__SZZ_OBJECT_2__":object[1],
    "__SZZ_OBJECT_3__":object[2],
    "__SZZ_OBJECT_4__":object[3],
    "__SZZ_LOCATION__":officialOneLine(protocol.pbzLocation || protocolSourceLocationFromSite(site) || ""),
    "__SZZ_DEVICE__":officialOneLine(device),
    "__SZZ_SERIAL__":officialOneLine(serial || "-"),
    "__SZZ_SEAL__":officialOneLine(seal || "-"),
    "__SZZ_RESULT__":` ${officialProtocolResultText(mode)}`,
    "__SZZ_FUNCTIONAL__":` ${officialProtocolFunctionalText(mode)}`,
    "__SZZ_CONTROL_DATE__":controlDate,
    "__SZZ_NEXT_DATE__":officialProtocolNextDate(protocol,site),
    "__SZZ_REMEDY_DATE__":officialProtocolRemedyMonth(protocol),
    "__SZZ_CONDITIONS__":officialProtocolConditionsTail(protocol,mode),
    "__SZZ_INPUT__":officialMeasurementValue(protocol.inputVac,"VAC"),
    "__SZZ_OUTPUT__":officialMeasurementPairValue(protocol.output1Vac,protocol.output2Vac,"VAC"),
    "__SZZ_BACKUP__":officialMeasurementPairValue(protocol.backup1Vac,protocol.backup2Vac,"VAC"),
    "__SZZ_AUX__":officialMeasurementValue(protocol.auxBatVdc,"VDC"),
    "__SZZ_MAIN__":officialMeasurementValue(protocol.mainBatVdc,"VDC"),
    "__SZZ_UNBALANCE__":officialOneLine(officialCombinedMeasurement(protocol.unbalance1,protocol.unbalance2)),
    "__SZZ_TEMP__":officialMeasurementValue(protocol.temperature,"TEMP"),
    "__SZZ_NOTE__":"",
    "__SZZ_TECH__":officialOneLine(tech)
  };
}

function fillOfficialRtfTemplate(template,protocol={},officialData={},mode="ok"){
  let output=removeOfficialRtfOperatorIcoLabel(template);
  output=replaceOfficialRtfOperatorObjectBlock(output,officialData);
  output=normalizeOfficialRtfOperatorBlock(output);
  output=replaceOfficialRtfSubjectBlock(output,officialData);
  const values=officialProtocolTemplateValues(protocol,officialData,mode);
  Object.entries(values).forEach(([placeholder,value])=>{
    output=output.replaceAll(placeholder,officialRtfEscape(value));
  });
  output=inlineOfficialRtfNoteHeading(output,officialData);
  output=highlightOfficialStopResultLetter(output,mode);
  output=compactOfficialRtfEmptyNoteBeforeSignatures(output,officialData);
  output=compactOfficialRtfMeasurementSection(output,protocol);
  output=addOfficialRtfWatermark(output,officialData);
  output=addOfficialRtfSignatures(output,protocol,officialData);
  output=normalizeOfficialRtfClientLabel(output);
  output=shrinkOfficialRtfTextSize(output);
  return output;
}

function protocolWordFileNameJoin(parts,fallback="protokol"){
  const name=parts
    .map(part=>safe(part))
    .filter(Boolean)
    .map(part=>protocolWordFileNamePart(part))
    .filter(Boolean)
    .join("-")
    .replace(/-+/g,"-")
    .replace(/^-+|-+$/g,"");
  return name.slice(0,140) || fallback;
}

function officialProtocolFileDatePart(protocol={}){
  const raw=safe(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  const d=parseDateValue(raw);
  if(d){
    const pad=n=>String(n).padStart(2,"0");
    return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  }
  const today=new Date();
  const pad=n=>String(n).padStart(2,"0");
  return `${pad(today.getDate())}-${pad(today.getMonth()+1)}-${today.getFullYear()}`;
}

function officialSourceFileLabel(protocol={},site=selectedSite){
  if(!siteHasMultipleSources(site)) return "";
  const text=safe(
    protocol.deviceType ||
    protocol.selectedDevice ||
    protocol.siteSource ||
    siteSourceLabel(site) ||
    sourceTypeTextFromRaw(site?.raw || {})
  );
  if(!text) return "";
  const power=text.match(/\b\d+(?:[,.]\d+)?\s*(?:kva|va|kw|w)\b/i);
  if(power) return power[0].replace(/\s+/g,"").replace(",",".");
  const larger=text.match(/\b\d{3,}\b/);
  if(larger) return larger[0];
  const any=text.match(/\b\d+(?:[,.]\d+)?\b/);
  return any ? any[0].replace(",",".") : "";
}

function officialProtocolAddressFileName(protocol={},site=selectedSite,mode="ok"){
  const raw=site?.raw || {};
  const address=officialOneLine(
    protocol.siteAddress ||
    protocol.siteName ||
    protocol.place ||
    site?.adresa ||
    pickRawValue(raw,["Adresa / umístění","Adresa_GPS","Umístění"]) ||
    "",
    140
  );
  if(!address) return "";
  const parts=address.split(",").map(part=>part.trim()).filter(Boolean);
  let city="";
  let street="";
  if(parts.length>=2){
    const first=parts[0];
    const second=parts.slice(1).join(", ");
    const firstHasNumber=/\d/.test(first);
    const secondHasNumber=/\d/.test(second);
    if(firstHasNumber && !secondHasNumber){
      street=first;
      city=second;
    }else if(!firstHasNumber && secondHasNumber){
      city=first;
      street=second;
    }else{
      street=first;
      city=second;
    }
  }else{
    street=address;
  }
  return protocolWordFileNameJoin([
    street,
    city,
    officialProtocolFileDatePart(protocol),
    officialSourceFileLabel(protocol,site),
    mode==="stop" ? "STOP STAV" : ""
  ],"doklad");
}

async function preparedOfficialProtocolExport(protocol={},officialData={},mode="ok"){
  const filled={
    ...protocol,
    createdBy:protocol.createdBy || protocol.technicianEmail || currentUser?.email || ""
  };
  const exportOfficialData={
    ...officialData,
    tipekSignatureBytes:officialData.tipekSignatureBytes || await loadOfficialTipekSignatureBytes(),
    watermarkLogoBytes:officialData.watermarkLogoBytes || await loadOfficialWatermarkLogoBytes()
  };
  const prefix=mode==="stop" ? "doklad-stop-stav" : "doklad-provozuschopnosti";
  const fileBase=officialProtocolAddressFileName(filled,selectedSite,mode) || `${prefix}-${officialProtocolFileDatePart(filled)}`;
  const fileName=`${fileBase}.rtf`;
  const template=await loadOfficialRtfTemplate(mode);
  return {
    filled,
    fileName,
    blob:new Blob([fillOfficialRtfTemplate(template,filled,exportOfficialData,mode)],{type:"application/rtf;charset=utf-8"})
  };
}

async function exportOfficialProtocol(mode="ok"){
  const status=document.getElementById("officialProtocolStatus");
  if(!selectedSite){
    if(status) status.textContent="Není vybrané místo.";
    return;
  }
  const noteInput=document.getElementById("officialProtocolNote");
  const noteBefore=noteInput ? noteInput.value : "";
  const data=await saveOfficialProtocolData({silent:true});
  if(data) data.note=noteBefore;
  if(noteInput) noteInput.value=noteBefore;
  if(!safe(data?.operator) || !safe(data?.objectAddress)){
    const box=document.getElementById("officialProtocolDataBox");
    if(box) box.style.display="grid";
    if(status) status.textContent="Nejdřív doplň bod a) Provozovatel PBZ a bod b) Adresa objektu.";
    return;
  }
  if(status) status.textContent="Připravuji doklad z posledního uloženého protokolu...";
  const protocol=await protocolForOfficialDocument();
  if(!protocol){
    if(status) status.textContent="Nenalezl jsem uložený protokol, ze kterého se má doklad doplnit.";
    showSaveConfirmation("Nejdřív ulož protokol kontroly.");
    return;
  }
  let prepared;
  try{
    prepared=await preparedOfficialProtocolExport(protocol,data,mode);
  }catch(e){
    console.warn("Export dokladu z RTF šablony selhal",e);
    if(status) status.textContent=e.message || "Doklad se nepodařilo připravit.";
    showSaveConfirmation("Doklad se nepodařilo připravit.");
    return;
  }
  downloadBlobFile(prepared.fileName,prepared.blob);
  if(noteInput) noteInput.value=noteBefore;
  if(status) status.textContent=mode==="stop" ? "Doklad Stop Stav exportován." : "Doklad provozuschopnosti exportován.";
  showSaveConfirmation("Doklad exportován do Wordu.");
}

function confirmProtocolMailSend(){
  return confirm("Opravdu chcete odeslat protokol na mail iva.glozova@astip.cz?");
}

let protocolWordZipModulePromise=null;
function loadProtocolWordZipModule(){
  if(!protocolWordZipModulePromise) protocolWordZipModulePromise=import("./zip-docx.js");
  return protocolWordZipModulePromise;
}

async function buildProtocolWordBlob(protocol={}){
  const {buildDocxBlob}=await loadProtocolWordZipModule();
  return buildDocxBlob(buildProtocolWordEntries(protocol));
}

function downloadBlobFile(filename,blob){
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(()=>{
    URL.revokeObjectURL(url);
    link.remove();
  },0);
}

async function preparedProtocolExport(protocol){
  if(!protocol) return null;
  const filled={
    ...protocol,
    createdBy:protocol.createdBy || protocol.technicianEmail || currentUser?.email || ""
  };
  const baseName=filled.deviceType || filled.selectedDevice || filled.siteSource || filled.siteName || selectedSite?.adresa || "protokol";
  const fileName=`protokol-${protocolExportDatePart(filled)}-${protocolWordFileNamePart(baseName)}.docx`;
  return {
    filled,
    fileName,
    blob:await buildProtocolWordBlob(filled)
  };
}

async function exportProtocolToWord(protocol){
  if(!protocol){
    showSaveConfirmation("Není vybraný protokol k exportu.");
    return;
  }
  const st=document.getElementById("protocolStatus");
  try{
    if(st) st.textContent="Připravuji Word export...";
    const prepared=await preparedProtocolExport(protocol);
    downloadBlobFile(prepared.fileName,prepared.blob);
    if(st) st.textContent="Protokol exportován do Wordu.";
    showSaveConfirmation("Protokol exportován do Wordu.");
  }catch(e){
    console.warn("Export protokolu do Wordu selhal",e);
    if(st) st.textContent="Export do Wordu se nepodařil.";
    showSaveConfirmation("Export do Wordu se nepodařil.");
  }
}

function protocolMailSubject(protocol={}){
  const date=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt);
  const place=safe(protocol.place || protocol.siteAddress || protocol.siteName || selectedSite?.adresa || "");
  return ["Protokol zkoušky provozuschopnosti",date,place].filter(Boolean).join(" - ");
}

function protocolMailBody(protocol={},fileName=""){
  const date=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt);
  const place=safe(protocol.place || protocol.siteAddress || protocol.siteName || selectedSite?.adresa || "");
  const device=safe(protocol.deviceType || protocol.selectedDevice || protocol.siteSource || selectedSite?.zdroj || "");
  return [
    "Dobrý den,",
    "",
    "v příloze posílám vyexportovaný protokol.",
    "",
    date ? `Datum kontroly: ${date}` : null,
    place ? `Místo: ${place}` : null,
    device ? `Zařízení: ${device}` : null,
    fileName ? `Soubor: ${fileName}` : null,
    "",
    "S pozdravem"
  ].filter(line=>line!==null).join("\n");
}

function blobToBase64(blob){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const result=String(reader.result || "");
      resolve(result.includes(",") ? result.split(",").pop() : result);
    };
    reader.onerror=()=>reject(reader.error || new Error("Soubor nejde připravit k odeslání."));
    reader.readAsDataURL(blob);
  });
}

async function sendProtocolByMail(protocol){
  if(!protocol){
    showSaveConfirmation("Není vybraný protokol k poslání.");
    return;
  }
  const mailReady=await ensureMailFunctions();
  if(!firebaseReady || !mailReady || !fb.fnMod || !mailFunctions){
    throw new Error("Odesílací funkce není dostupná. Nejdřív je potřeba nasadit Firebase Function sendProtocolMail.");
  }
  const prepared=await preparedProtocolExport(protocol);
  const st=document.getElementById("protocolStatus");
  if(st) st.textContent="Odesílám protokol na mail...";
  const sendMail=fb.fnMod.httpsCallable(mailFunctions,"sendProtocolMail");
  await sendMail({
    subject:protocolMailSubject(prepared.filled),
    body:protocolMailBody(prepared.filled,prepared.fileName),
    fileName:prepared.fileName,
    fileBase64:await blobToBase64(prepared.blob)
  });
  if(st) st.textContent="Protokol byl odeslán na iva.glozova@astip.cz, kopie na jan.soldan@astip.cz.";
  showSaveConfirmation("Protokol odeslán na mail.");
}

function protocolMailErrorText(error){
  const code=safe(error && error.code);
  const message=safe(error && error.message || error);
  if(code==="functions/unauthenticated" || code==="unauthenticated"){
    return "Nejdřív se znovu přihlaš přes Google účtem @astip.cz.";
  }
  if(code==="functions/permission-denied" || code==="permission-denied"){
    return message || "Odeslání je povolené jen přihlášeným uživatelům @astip.cz.";
  }
  if(code==="functions/resource-exhausted" || code==="resource-exhausted"){
    return message || "Příloha protokolu je moc velká.";
  }
  return [code,message].filter(Boolean).join(": ") || "E-mail se nepodařilo odeslat.";
}

function protocolMailToastText(error){
  const message=protocolMailErrorText(error);
  return message.length>120 ? `${message.slice(0,117)}...` : message;
}

function siteLocalCacheKey(kind,site=selectedSite){
  const key=selectedSiteDocId(site) || detailKey(site) || site?.id || "unknown";
  return `astipMap:${kind}:${key}`;
}
const LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS=1800;
const localStorageArrayEntriesCache=new Map();
const localStorageObjectEntriesCache=new Map();
const siteLocalArrayReadCache=new Map();
const siteLocalObjectReadCache=new Map();
function cloneLocalStorageArrayEntries(entries=[]){
  return (entries || []).map(entry=>({
    key:entry.key,
    suffix:entry.suffix,
    items:Array.isArray(entry.items) ? entry.items.slice() : []
  }));
}
function cloneLocalStorageArrayItems(items=[]){
  return Array.isArray(items) ? items.map(item=>item && typeof item==="object" ? {...item} : item) : [];
}
function cloneLocalStorageObjectEntries(entries=[]){
  return (entries || []).map(entry=>({
    key:entry.key,
    suffix:entry.suffix,
    item:entry.item && typeof entry.item==="object" ? {...entry.item} : entry.item
  }));
}
function cloneLocalStorageObjectItem(item){
  return item && typeof item==="object" && !Array.isArray(item) ? {...item} : {};
}
function rememberSiteLocalArrayReadCache(key,items=[],raw=null){
  const clean=String(key || "");
  if(!clean) return;
  const serialized=raw===null ? JSON.stringify(Array.isArray(items) ? items : []) : raw;
  siteLocalArrayReadCache.set(clean,{raw:serialized,savedAt:Date.now(),items:cloneLocalStorageArrayItems(items)});
}
function rememberSiteLocalObjectReadCache(key,item={},raw=null){
  const clean=String(key || "");
  if(!clean) return;
  const source=item && typeof item==="object" && !Array.isArray(item) ? item : {};
  const serialized=raw===null ? JSON.stringify(source) : raw;
  siteLocalObjectReadCache.set(clean,{raw:serialized,savedAt:Date.now(),item:cloneLocalStorageObjectItem(source)});
}
function clearSiteLocalObjectReadCache(prefixOrKey=""){
  const clean=String(prefixOrKey || "");
  if(!clean){
    siteLocalObjectReadCache.clear();
    return;
  }
  for(const key of siteLocalObjectReadCache.keys()){
    if(key===clean || key.startsWith(clean) || clean.startsWith(key)){
      siteLocalObjectReadCache.delete(key);
    }
  }
}
function clearLocalStorageArrayEntriesCache(prefixOrKey=""){
  const clean=String(prefixOrKey || "");
  if(!clean){
    localStorageArrayEntriesCache.clear();
    siteLocalArrayReadCache.clear();
    return;
  }
  for(const prefix of localStorageArrayEntriesCache.keys()){
    if(prefix===clean || clean.startsWith(prefix) || prefix.startsWith(clean)){
      localStorageArrayEntriesCache.delete(prefix);
    }
  }
  for(const key of siteLocalArrayReadCache.keys()){
    if(key===clean || key.startsWith(clean) || clean.startsWith(key)){
      siteLocalArrayReadCache.delete(key);
    }
  }
}
function clearLocalStorageObjectEntriesCache(prefixOrKey=""){
  const clean=String(prefixOrKey || "");
  if(!clean){
    localStorageObjectEntriesCache.clear();
    clearSiteLocalObjectReadCache();
    return;
  }
  for(const prefix of localStorageObjectEntriesCache.keys()){
    if(prefix===clean || clean.startsWith(prefix) || prefix.startsWith(clean)){
      localStorageObjectEntriesCache.delete(prefix);
    }
  }
  clearSiteLocalObjectReadCache(clean);
}
window.addEventListener("storage",()=>{
  clearLocalStorageArrayEntriesCache();
  clearLocalStorageObjectEntriesCache();
});
function readSiteLocalArray(kind,site=selectedSite){
  try{
    const key=siteLocalCacheKey(kind,site);
    const raw=localStorage.getItem(key);
    const cached=siteLocalArrayReadCache.get(key);
    if(cached && cached.raw===raw && Date.now()-cached.savedAt<LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS){
      return cloneLocalStorageArrayItems(cached.items);
    }
    const arr=raw ? JSON.parse(raw) : [];
    const items=Array.isArray(arr) ? arr : [];
    siteLocalArrayReadCache.set(key,{raw,savedAt:Date.now(),items:cloneLocalStorageArrayItems(items)});
    return items;
  }catch(e){
    return [];
  }
}
function appendSiteLocalArray(kind,item,site=selectedSite,limit=80){
  try{
    const arr=readSiteLocalArray(kind,site);
    const id=safe(item && item._id);
    let next=(id ? arr.filter(x=>safe(x && x._id)!==id) : arr).concat([{...item}]);
    if(Number.isFinite(limit) && limit>0) next=next.slice(-limit);
    const key=siteLocalCacheKey(kind,site);
    const raw=JSON.stringify(next);
    localStorage.setItem(key,raw);
    clearLocalStorageArrayEntriesCache(key);
    rememberSiteLocalArrayReadCache(key,next,raw);
    clearDetailHistoryCacheForKind(kind,site);
  }catch(e){
    console.warn("Lokální cache se nepodařila uložit",kind,e);
  }
}

function mergeSiteLocalArray(kind,items=[],site=selectedSite,limit=120){
  try{
    const cleanKind=safe(kind);
    if(!cleanKind) return [];
    const incoming=(Array.isArray(items) ? items : []).filter(item=>item && typeof item==="object");
    if(!incoming.length) return readSiteLocalArray(cleanKind,site);
    const docId=selectedSiteDocId(site);
    const keys=siteRecordKeys(site);
    let next=readSiteLocalArray(cleanKind,site).slice();
    incoming.forEach((item,idx)=>{
      const id=safe(item._id || item.id) || `${cleanKind}_${Date.now()}_${idx}`;
      const enriched={
        ...item,
        _id:id,
        siteDocId:safe(item.siteDocId) || docId,
        firebaseDocId:safe(item.firebaseDocId) || docId,
        siteKey:safe(item.siteKey) || keys[0] || docId,
        siteKeys:uniqueNonEmptyStrings([...(Array.isArray(item.siteKeys) ? item.siteKeys : []),...keys])
      };
      next=next.filter(existing=>safe(existing && existing._id)!==id);
      next.push(enriched);
    });
    if(Number.isFinite(limit) && limit>0) next=next.slice(-limit);
    const key=siteLocalCacheKey(cleanKind,site);
    const raw=JSON.stringify(next);
    localStorage.setItem(key,raw);
    clearLocalStorageArrayEntriesCache(key);
    rememberSiteLocalArrayReadCache(key,next,raw);
    clearDetailHistoryCacheForKind(cleanKind,site);
    return next;
  }catch(e){
    console.warn("Lokální cache se nepodařila sloučit",kind,e);
    return [];
  }
}
window.mergeSiteLocalArray=mergeSiteLocalArray;

function removeSiteLocalItem(kind,id,site=selectedSite){
  try{
    const cleanId=safe(id);
    if(!cleanId) return;
    const next=readSiteLocalArray(kind,site).filter(item=>safe(item && item._id)!==cleanId);
    const key=siteLocalCacheKey(kind,site);
    const raw=JSON.stringify(next);
    localStorage.setItem(key,raw);
    clearLocalStorageArrayEntriesCache(key);
    rememberSiteLocalArrayReadCache(key,next,raw);
    clearDetailHistoryCacheForKind(kind,site);
  }catch(e){
    console.warn("Lokální cache se nepodařila upravit",kind,e);
  }
}

function readSiteLocalObject(kind,site=selectedSite){
  try{
    const key=siteLocalCacheKey(kind,site);
    const raw=localStorage.getItem(key);
    const cached=siteLocalObjectReadCache.get(key);
    if(cached && cached.raw===raw && Date.now()-cached.savedAt<LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS){
      return cloneLocalStorageObjectItem(cached.item);
    }
    const obj=raw ? JSON.parse(raw) : {};
    const item=obj && typeof obj==="object" && !Array.isArray(obj) ? obj : {};
    siteLocalObjectReadCache.set(key,{raw,savedAt:Date.now(),item:cloneLocalStorageObjectItem(item)});
    return item;
  }catch(e){
    return {};
  }
}

function writeSiteLocalObject(kind,item,site=selectedSite){
  try{
    const key=siteLocalCacheKey(kind,site);
    const value=item && typeof item==="object" && !Array.isArray(item) ? item : {};
    const raw=JSON.stringify(value);
    localStorage.setItem(key,raw);
    clearLocalStorageObjectEntriesCache(key);
    rememberSiteLocalObjectReadCache(key,value,raw);
  }catch(e){
    console.warn("Lokální cache se nepodařila uložit",kind,e);
  }
}

function makeLocalRecordId(prefix="local"){
  if(window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const SZZ_OFFLINE_QUEUE_DB_NAME="astipMapOfflineQueues";
const SZZ_OFFLINE_QUEUE_DB_VERSION=2;
const SZZ_OFFLINE_SITE_QUEUE_STORE="siteQueue";
const SZZ_OFFLINE_PROTOCOL_QUEUE_STORE="protocolQueue";
const SZZ_PROTOCOL_DRAFT_STORE="protocolDrafts";

function openSzzOfflineQueueDb(){
  return new Promise((resolve,reject)=>{
    if(!("indexedDB" in window)){
      reject(new Error("IndexedDB není v prohlížeči dostupné."));
      return;
    }
    const req=indexedDB.open(SZZ_OFFLINE_QUEUE_DB_NAME,SZZ_OFFLINE_QUEUE_DB_VERSION);
    req.onupgradeneeded=()=>{
      const database=req.result;
      if(!database.objectStoreNames.contains(SZZ_OFFLINE_SITE_QUEUE_STORE)){
        database.createObjectStore(SZZ_OFFLINE_SITE_QUEUE_STORE,{keyPath:"docId"});
      }
      if(!database.objectStoreNames.contains(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE)){
        const protocolStore=database.createObjectStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,{keyPath:"_id"});
        protocolStore.createIndex("siteCacheKey","siteCacheKey",{unique:false});
      }
      if(!database.objectStoreNames.contains(SZZ_PROTOCOL_DRAFT_STORE)){
        database.createObjectStore(SZZ_PROTOCOL_DRAFT_STORE,{keyPath:"siteCacheKey"});
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error || new Error("Offline databázi se nepodařilo otevřít."));
  });
}

async function withSzzOfflineQueueStore(storeName,mode,callback){
  const database=await openSzzOfflineQueueDb();
  return new Promise((resolve,reject)=>{
    const tx=database.transaction(storeName,mode);
    const store=tx.objectStore(storeName);
    let result;
    tx.oncomplete=()=>{database.close();resolve(result);};
    tx.onerror=()=>{database.close();reject(tx.error || new Error("Offline fronta selhala."));};
    try{
      callback(store,value=>{result=value;});
    }catch(e){
      database.close();
      reject(e);
    }
  });
}

function uniqueByOfflineId(items=[],idKey="_id"){
  const byId=new Map();
  const withoutId=[];
  (items || []).forEach(item=>{
    if(!item) return;
    const id=safe(item && item[idKey]);
    if(!id){
      withoutId.push(item);
      return;
    }
    byId.set(id,item);
  });
  return [...withoutId,...byId.values()];
}
window.uniqueByOfflineId=uniqueByOfflineId;

async function saveOfflineSiteQueueItem(item){
  if(!item || !safe(item.docId)) return null;
  try{
    await withSzzOfflineQueueStore(SZZ_OFFLINE_SITE_QUEUE_STORE,"readwrite",(store)=>{store.put({...item});});
    invalidateOfflineSiteCountCache();
    return item;
  }catch(e){
    console.warn("IndexedDB frontu bodů se nepodařilo uložit",e);
    return null;
  }
}
window.saveOfflineSiteQueueItem=saveOfflineSiteQueueItem;

async function readOfflineSiteQueueItems(){
  try{
    const items=await withSzzOfflineQueueStore(SZZ_OFFLINE_SITE_QUEUE_STORE,"readonly",(store,setResult)=>{
      const req=store.getAll();
      req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
      req.onerror=()=>setResult([]);
    });
    return (items || []).filter(item=>item && item.docId && item.raw);
  }catch(e){
    return [];
  }
}
window.readOfflineSiteQueueItems=readOfflineSiteQueueItems;

async function removeOfflineSiteQueueItem(docId){
  const id=safe(docId);
  if(!id) return;
  try{
    await withSzzOfflineQueueStore(SZZ_OFFLINE_SITE_QUEUE_STORE,"readwrite",(store)=>{store.delete(id);});
  }catch(e){}
  invalidateOfflineSiteCountCache();
}
window.removeOfflineSiteQueueItem=removeOfflineSiteQueueItem;

async function saveOfflineProtocolQueueItem(item,site=selectedSite){
  if(!item || !safe(item._id)) return null;
  const payload={...item,siteCacheKey:siteLocalCacheKey("protocolHistory",site)};
  try{
    await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readwrite",(store)=>{store.put(payload);});
    invalidateOfflineProtocolCountCache();
    return payload;
  }catch(e){
    console.warn("IndexedDB frontu protokolů se nepodařilo uložit",e);
    return null;
  }
}
window.saveOfflineProtocolQueueItem=saveOfflineProtocolQueueItem;

async function readAllOfflineProtocolQueueItems(){
  try{
    const items=await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readonly",(store,setResult)=>{
      const req=store.getAll();
      req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
      req.onerror=()=>setResult([]);
    });
    return (items || []).filter(item=>item && item._offline && item._syncStatus!=="online");
  }catch(e){
    return [];
  }
}
window.readAllOfflineProtocolQueueItems=readAllOfflineProtocolQueueItems;

async function readOfflineProtocolQueueItems(site=selectedSite){
  const cacheKey=siteLocalCacheKey("protocolHistory",site);
  let indexed=[];
  try{
    indexed=await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readonly",(store,setResult)=>{
      const req=store.index("siteCacheKey").getAll(cacheKey);
      req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
      req.onerror=()=>setResult([]);
    });
  }catch(e){}
  if(!indexed.length){
    indexed=(await readAllOfflineProtocolQueueItems()).filter(item=>{
      try{return recordMatchesSite(item,site);}catch(e){return false;}
    });
  }
  return indexed.filter(item=>item && item._offline && item._syncStatus!=="online");
}
window.readOfflineProtocolQueueItems=readOfflineProtocolQueueItems;

async function removeOfflineProtocolQueueItem(id){
  const cleanId=safe(id);
  if(!cleanId) return;
  try{
    await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readwrite",(store)=>{store.delete(cleanId);});
  }catch(e){}
  invalidateOfflineProtocolCountCache();
}
window.removeOfflineProtocolQueueItem=removeOfflineProtocolQueueItem;

function saveProtocolLocally(payload,site=selectedSite,reason=""){
  const offlinePayload={
    ...payload,
    _id:safe(payload?._id) || makeLocalRecordId("protocol"),
    _offline:true,
    _syncStatus:"local",
    localOnly:true,
    offlineReason:safe(reason),
    savedAt:safe(payload?.savedAt) || new Date().toISOString(),
    offlineSavedAt:new Date().toISOString(),
    syncQueuedAt:new Date().toISOString()
  };
  appendSiteLocalArray("protocolHistory",offlinePayload,site,120);
  invalidateOfflineProtocolCountCache();
  saveOfflineProtocolQueueItem(offlinePayload,site).catch(()=>{});
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  if(window.registerSzzBackgroundSync) window.registerSzzBackgroundSync("protocol");
  return offlinePayload;
}

let protocolDraftTimer=null;
let protocolDraftRestoreInProgress=false;
const PROTOCOL_DRAFT_COUNT_CACHE_MS=1800;
const OFFLINE_PROTOCOL_COUNT_CACHE_MS=1800;
let protocolDraftCountCache=null;
let protocolDraftCountCacheAt=0;
let protocolDraftCountStorageLength=0;
let offlineProtocolCountCache={count:null,savedAt:0,storageLength:-1};

function clearProtocolDraftCountCache(){
  protocolDraftCountCache=null;
  protocolDraftCountCacheAt=0;
  protocolDraftCountStorageLength=0;
}
window.clearProtocolDraftCountCache=clearProtocolDraftCountCache;
function invalidateOfflineProtocolCountCache(){
  offlineProtocolCountCache={count:null,savedAt:0,storageLength:-1};
  invalidateSzzOfflineCountsCache();
}
window.addEventListener("storage",event=>{
  if(!event.key || event.key.startsWith("astipMap:protocolDraft:")) clearProtocolDraftCountCache();
  if(!event.key || event.key.startsWith("astipMap:protocolHistory:")) invalidateOfflineProtocolCountCache();
});

function protocolDraftKey(site=selectedSite){
  return siteLocalCacheKey("protocolDraft",site);
}

async function saveProtocolDraftToIndexedDb(site,draft){
  const siteCacheKey=protocolDraftKey(site);
  if(!siteCacheKey || !draft || !draft.payload) return null;
  try{
    const item={...draft,siteCacheKey};
    await withSzzOfflineQueueStore(SZZ_PROTOCOL_DRAFT_STORE,"readwrite",(store)=>{store.put(item);});
    return item;
  }catch(e){
    console.warn("IndexedDB koncept protokolu se nepodařilo uložit",e);
    return null;
  }
}

async function readProtocolDraftFromIndexedDb(site=selectedSite){
  const siteCacheKey=protocolDraftKey(site);
  if(!siteCacheKey) return null;
  try{
    const item=await withSzzOfflineQueueStore(SZZ_PROTOCOL_DRAFT_STORE,"readonly",(store,setResult)=>{
      const req=store.get(siteCacheKey);
      req.onsuccess=()=>setResult(req.result || null);
      req.onerror=()=>setResult(null);
    });
    return item && item.payload ? item : null;
  }catch(e){
    return null;
  }
}

async function deleteProtocolDraftFromIndexedDb(site=selectedSite){
  const siteCacheKey=protocolDraftKey(site);
  if(!siteCacheKey) return;
  try{
    await withSzzOfflineQueueStore(SZZ_PROTOCOL_DRAFT_STORE,"readwrite",(store)=>{store.delete(siteCacheKey);});
  }catch(e){}
}

function clearProtocolDraft(site=selectedSite){
  const key=protocolDraftKey(site);
  try{localStorage.removeItem(key);}catch(e){}
  clearLocalStorageObjectEntriesCache(key);
  deleteProtocolDraftFromIndexedDb(site);
  clearProtocolDraftCountCache();
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
}

function readProtocolDraft(site=selectedSite){
  try{
    const raw=localStorage.getItem(protocolDraftKey(site));
    const parsed=raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed==="object" && parsed.payload ? parsed : null;
  }catch(e){
    return null;
  }
}

function saveProtocolDraftNow(){
  if(protocolDraftRestoreInProgress || protocolEditState || !selectedSite) return;
  const form=document.getElementById("protocolForm");
  if(!form || form.style.display==="none") return;
  try{
    const payload=protocolPayload();
    const draft={
      savedAt:new Date().toISOString(),
      siteKey:siteRecordKeys(selectedSite)[0] || selectedSite.id || "",
      payload
    };
    const key=protocolDraftKey(selectedSite);
    localStorage.setItem(key,JSON.stringify(draft));
    clearLocalStorageObjectEntriesCache(key);
    saveProtocolDraftToIndexedDb(selectedSite,draft).then(saved=>{
      if(!saved) return;
      try{
        localStorage.setItem(key,JSON.stringify({
          savedAt:draft.savedAt,
          siteKey:draft.siteKey,
          storage:"indexedDB"
        }));
        clearLocalStorageObjectEntriesCache(key);
      }catch(e){}
    });
    clearProtocolDraftCountCache();
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(250);
    const st=document.getElementById("protocolStatus");
    if(st && !/uložen|upravuješ/i.test(st.textContent || "")){
      st.textContent="Rozepsaný protokol se průběžně ukládá v tomto zařízení.";
    }
  }catch(e){
    console.warn("Koncept protokolu se nepodařilo uložit",e);
  }
}

function scheduleProtocolDraftSave(){
  if(protocolDraftRestoreInProgress || protocolEditState) return;
  clearTimeout(protocolDraftTimer);
  protocolDraftTimer=setTimeout(saveProtocolDraftNow,450);
}

function bindProtocolDraftAutosave(){
  const form=document.getElementById("protocolForm");
  if(!form || form.__protocolDraftBound) return;
  form.__protocolDraftBound="1";
  form.addEventListener("input",scheduleProtocolDraftSave);
  form.addEventListener("change",scheduleProtocolDraftSave);
}

function applyProtocolDraftToForm(draft){
  if(!draft || !draft.payload) return false;
  protocolDraftRestoreInProgress=true;
  try{
    fillProtocolFormFromHistory(draft.payload);
    const st=document.getElementById("protocolStatus");
    const when=protocolDisplayDate(draft.savedAt || "");
    if(st) st.textContent=`Obnoven rozepsaný protokol uložený lokálně${when ? ` (${when})` : ""}.`;
    return true;
  }catch(e){
    console.warn("Koncept protokolu se nepodařilo obnovit",e);
    return false;
  }finally{
    protocolDraftRestoreInProgress=false;
  }
}

function restoreProtocolDraftIfAny(site=selectedSite){
  const draft=readProtocolDraft(site);
  if(draft && draft.payload) return applyProtocolDraftToForm(draft);
  const key=protocolDraftKey(site);
  readProtocolDraftFromIndexedDb(site).then(indexedDraft=>{
    if(!indexedDraft || !indexedDraft.payload) return false;
    if(key!==protocolDraftKey(selectedSite) || protocolEditState) return false;
    return applyProtocolDraftToForm(indexedDraft);
  }).catch(e=>console.warn("IndexedDB koncept protokolu se nepodařilo obnovit",e));
  return false;
}

let offlineProtocolSyncRunning=false;

function localStorageArrayEntries(prefix){
  const cleanPrefix=String(prefix || "");
  const cached=localStorageArrayEntriesCache.get(cleanPrefix);
  if(cached && cached.length===localStorage.length && Date.now()-cached.savedAt<LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS){
    return cloneLocalStorageArrayEntries(cached.entries);
  }
  const entries=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key || !key.startsWith(cleanPrefix)) continue;
      const arr=JSON.parse(localStorage.getItem(key) || "[]");
      if(Array.isArray(arr)){
        entries.push({key,suffix:key.slice(cleanPrefix.length),items:arr});
      }
    }
  }catch(e){
    console.warn("Lokální frontu se nepodařilo načíst",e);
  }
  localStorageArrayEntriesCache.set(cleanPrefix,{savedAt:Date.now(),length:localStorage.length,entries:cloneLocalStorageArrayEntries(entries)});
  return entries;
}

function localStorageObjectEntries(prefix){
  const cleanPrefix=String(prefix || "");
  const cached=localStorageObjectEntriesCache.get(cleanPrefix);
  if(cached && cached.length===localStorage.length && Date.now()-cached.savedAt<LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS){
    return cloneLocalStorageObjectEntries(cached.entries);
  }
  const entries=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key || !key.startsWith(cleanPrefix)) continue;
      const item=JSON.parse(localStorage.getItem(key) || "null");
      if(item && typeof item==="object"){
        entries.push({key,suffix:key.slice(cleanPrefix.length),item});
      }
    }
  }catch(e){
    console.warn("Lokální položky se nepodařilo načíst",e);
  }
  localStorageObjectEntriesCache.set(cleanPrefix,{savedAt:Date.now(),length:localStorage.length,entries:cloneLocalStorageObjectEntries(entries)});
  return entries;
}

function removeLocalStorageArrayItemByKey(key,id){
  const cleanId=safe(id);
  if(!key || !cleanId) return;
  try{
    const arr=JSON.parse(localStorage.getItem(key) || "[]");
    if(!Array.isArray(arr)) return;
    const next=arr.filter(item=>safe(item && item._id)!==cleanId);
    const raw=JSON.stringify(next);
    localStorage.setItem(key,raw);
    clearLocalStorageArrayEntriesCache(key);
    rememberSiteLocalArrayReadCache(key,next,raw);
  }catch(e){}
}

function siteFromOfflineRecord(record={},cacheSuffix=""){
  const recordKeys=recordIdKeys(record);
  const found=(rows || []).find(row=>{
    try{
      const keys=siteRecordKeys(row);
      if(recordKeys.some(key=>keys.includes(key))) return true;
      return recordMatchesSite(record,row);
    }catch(e){
      return false;
    }
  });
  if(found) return found;
  const docId=safe(record.firebaseDocId || record.siteDocId || (/^[-A-Za-z0-9_]{6,}$/.test(cacheSuffix) && !cacheSuffix.startsWith("firebase_") ? cacheSuffix : ""));
  const siteKey=safe(record.siteKey || record.siteId || cacheSuffix || (docId ? `firebase_${docId}` : "offline_site"));
  const raw={
    "Klíč_adresy":siteKey,
    "Název":safe(record.siteName || record.place || record.siteAddress || ""),
    "Adresa / umístění":safe(record.siteName || record.place || record.siteAddress || ""),
    "Popis_zdroje":safe(record.siteSource || record.deviceType || ""),
    "Zdroj":safe(record.serial || "")
  };
  if(docId) raw["Firebase_doc_id"]=docId;
  if(record.lat) raw["GPS_lat"]=record.lat;
  if(record.lon) raw["GPS_lon"]=record.lon;
  return {
    id:siteKey,
    raw,
    firebaseDocId:docId,
    firebaseData:{raw},
    adresa:raw["Adresa / umístění"] || raw["Název"],
    zdroj:raw["Popis_zdroje"],
    lat:num(raw["GPS_lat"]),
    lon:num(raw["GPS_lon"])
  };
}

function pendingOfflineProtocolSiteRefs(){
  const byKey=new Map();
  localStorageArrayEntries("astipMap:protocolHistory:").forEach(entry=>{
    const offlineItems=entry.items.filter(item=>item && item._offline && item._syncStatus!=="online");
    if(!offlineItems.length) return;
    const site=siteFromOfflineRecord(offlineItems[0],entry.suffix);
    const key=selectedSiteDocId(site) || detailKey(site) || site.id || entry.suffix;
    byKey.set(key,{site,count:offlineItems.length});
  });
  return [...byKey.values()];
}

async function pendingOfflineProtocolSiteRefsAsync(){
  const byKey=new Map();
  const indexed=await readAllOfflineProtocolQueueItems();
  indexed.forEach(item=>{
    const site=siteFromOfflineRecord(item,item.siteCacheKey ? String(item.siteCacheKey).replace("astipMap:protocolHistory:","") : "");
    const key=selectedSiteDocId(site) || detailKey(site) || site.id || item.siteCacheKey || item._id;
    const current=byKey.get(key);
    byKey.set(key,{site,count:(current?.count || 0)+1});
  });
  if(!byKey.size){
    pendingOfflineProtocolSiteRefs().forEach(ref=>{
      const key=selectedSiteDocId(ref.site) || detailKey(ref.site) || ref.site?.id || "";
      if(key) byKey.set(key,ref);
    });
  }
  return [...byKey.values()];
}

async function syncOfflineProtocolsForSite(site=selectedSite,options={}){
  if(offlineProtocolSyncRunning) return 0;
  if(!site || !firebaseReady || !db || !fb.fsMod || !currentUser || navigator.onLine===false) return 0;
  const localItems=readSiteLocalArray("protocolHistory",site)
    .filter(item=>item && item._offline && item._syncStatus!=="online" && recordMatchesSite(item,site));
  const indexedItems=await readOfflineProtocolQueueItems(site);
  const offlineItems=uniqueByOfflineId([...localItems,...indexedItems])
    .filter(item=>item && item._offline && item._syncStatus!=="online" && recordMatchesSite(item,site));
  if(!offlineItems.length) return 0;
  offlineProtocolSyncRunning=true;
  let synced=0;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    for(const item of offlineItems){
      const id=safe(item._id) || makeLocalRecordId("protocol");
      const payload={
        ...item,
        _id:id,
        _offline:false,
        _syncStatus:"online",
        syncedAt:new Date().toISOString(),
        syncedBy:currentUser.email || "",
        updatedBy:currentUser.email || item.updatedBy || "",
        createdBy:item.createdBy || currentUser.email || "",
        savedAt:item.savedAt || item.offlineSavedAt || new Date().toISOString()
      };
      const childOk=await saveSiteChildItem("protocols",id,payload,site);
      if(!childOk) await appendEmbeddedSiteItem("protocolHistory",payload,site);
      await appendEmbeddedSiteItem("protocolRefs",{
        _id:id,
        siteId:payload.siteId,
        siteKey:payload.siteKey,
        firebaseDocId:payload.firebaseDocId,
        date:payload.date,
        createdAt:payload.createdAt || payload.savedAt
      },site);
      await setDoc(doc(db,"protocols",id),{
        ...payload,
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
      await updateSiteControlDateFromProtocol(payload,site,{clearManualStatus:item.clearManualStatusAfterSave !== false});
      removeSiteLocalItem("protocolHistory",id,site);
      await removeOfflineProtocolQueueItem(id);
      appendSiteLocalArray("protocolHistory",payload,site,120);
      synced++;
    }
  }catch(e){
    console.warn("Synchronizace offline protokolů selhala",e);
  }finally{
    offlineProtocolSyncRunning=false;
  }
  if(synced && !options.silent){
    showSaveConfirmation(synced===1 ? "Offline protokol uložen online." : `Offline protokoly uloženy online: ${synced}.`);
  }
  if(synced && window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  return synced;
}
window.syncOfflineProtocolsForSite=syncOfflineProtocolsForSite;

async function syncAllOfflineProtocols(options={}){
  if(!firebaseReady || !db || !fb.fsMod || navigator.onLine===false) return 0;
  const signedUser=await waitForFirebaseUser(3000);
  if(!signedUser) return 0;
  const refs=await pendingOfflineProtocolSiteRefsAsync();
  let total=0;
  for(const ref of refs){
    total+=await syncOfflineProtocolsForSite(ref.site,{silent:true});
  }
  if(total && !options.silent){
    showSaveConfirmation(total===1 ? "Offline protokol uložen online." : `Offline protokoly uloženy online: ${total}.`);
  }
  return total;
}
window.syncAllOfflineProtocols=syncAllOfflineProtocols;

const SITE_CHILD_ITEMS_CACHE_MS=30000;
const siteChildItemsCache=new Map();

function siteChildItemsCacheKey(kind,site=selectedSite){
  const cleanKind=safe(kind);
  const docId=selectedSiteDocId(site);
  if(!cleanKind || !docId) return "";
  return [cleanKind,docId,currentUserEmail()].join("|");
}

function cloneSiteChildItems(items=[]){
  return (items || []).map(item=>item && typeof item==="object" ? {...item} : item);
}

function readSiteChildItemsCache(kind,site=selectedSite){
  const key=siteChildItemsCacheKey(kind,site);
  if(!key) return null;
  const cached=siteChildItemsCache.get(key);
  if(!cached) return null;
  if(Date.now()-cached.savedAt>SITE_CHILD_ITEMS_CACHE_MS){
    siteChildItemsCache.delete(key);
    return null;
  }
  return cloneSiteChildItems(cached.items);
}

function writeSiteChildItemsCache(kind,site=selectedSite,items=[]){
  const key=siteChildItemsCacheKey(kind,site);
  if(!key) return;
  siteChildItemsCache.set(key,{
    savedAt:Date.now(),
    items:cloneSiteChildItems(items)
  });
}

function clearSiteChildItemsCache(kind=null,site=selectedSite){
  const cleanKind=kind ? safe(kind) : "";
  const docId=selectedSiteDocId(site);
  if(!cleanKind && !docId){
    siteChildItemsCache.clear();
    return;
  }
  siteChildItemsCache.forEach((_value,key)=>{
    const [cachedKind,cachedDocId]=String(key || "").split("|");
    if((!cleanKind || cachedKind===cleanKind) && (!docId || cachedDocId===docId)){
      siteChildItemsCache.delete(key);
    }
  });
}
window.clearSiteChildItemsCache=clearSiteChildItemsCache;

async function saveSiteChildItem(kind,id,item,site=selectedSite){
  const docId=selectedSiteDocId(site);
  const cleanId=safe(id || item?._id);
  if(!docId || !cleanId || !firebaseReady || !db || !fb.fsMod) return false;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    await setDoc(doc(db,"sitesUnified",docId,kind,cleanId),{
      ...item,
      _id:cleanId,
      siteDocId:docId,
      updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
    },{merge:true});
    try{
      await setDoc(doc(db,"sitesUnified",docId),{
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
    }catch(e){
      console.warn("Označení změny bodu po uložení položky selhalo",kind,e);
    }
    clearSiteChildItemsCache(kind,site);
    clearDetailHistoryCacheForKind(kind,site);
    return true;
  }catch(e){
    console.warn("Uložení pod bod selhalo",kind,e);
    return false;
  }
}

async function loadSiteChildItems(kind,site=selectedSite){
  const docId=selectedSiteDocId(site);
  if(!docId || !firebaseReady || !db || !fb.fsMod) return [];
  const cached=readSiteChildItemsCache(kind,site);
  if(cached) return cached;
  try{
    const {collection,getDocs}=fb.fsMod;
    const snap=await getDocs(collection(db,"sitesUnified",docId,kind));
    const items=[];
    snap.forEach(docSnap=>{
      items.push({...docSnap.data(),_id:docSnap.id});
    });
    writeSiteChildItemsCache(kind,site,items);
    const localKind=kind==="protocols" ? "protocolHistory" : kind==="serviceRecords" ? "serviceHistory" : kind==="photos" ? "photos" : "";
    if(localKind) mergeSiteLocalArray(localKind,items.map(item=>({
      ...item,
      _collection:item._collection || `site${kind}`,
      _type:item._type || (kind==="protocols" ? "Protokol" : kind==="serviceRecords" ? "Servisní záznam" : "")
    })),site,localKind==="photos" ? 180 : 180);
    return cloneSiteChildItems(items);
  }catch(e){
    console.warn("Načtení položek pod bodem selhalo",kind,e);
    return [];
  }
}

async function loadSiteChildItemsDelta(kind,site=selectedSite,sinceMs=0){
  const docId=selectedSiteDocId(site);
  const localKind=siteChildLocalKind(kind);
  if(!docId || !localKind || !sinceMs || !firebaseReady || !db || !fb.fsMod || navigator.onLine===false) return [];
  const items=[];
  const itemDedupe=createRecordIdDedupe(items);
  const addDocSnap=docSnap=>{
    if(!docSnap || !docSnap.id || typeof docSnap.data!=="function") return;
    itemDedupe.add({
      ...docSnap.data(),
      _id:docSnap.id,
      _collection:`site${kind}`,
      _type:siteChildTypeLabel(kind)
    });
  };
  try{
    const {collection}=fb.fsMod;
    await readFirestoreDocsUpdatedSince(
      ()=>collection(db,"sitesUnified",docId,kind),
      siteChildDeltaFields(kind),
      sinceMs,
      addDocSnap,
      `Rozdílové načtení ${kind} selhalo`
    );
    if(items.length){
      const merged=mergeSiteLocalArray(localKind,items,site,kind==="photos" ? 180 : 180);
      writeSiteChildItemsCache(kind,site,merged);
    }
    return cloneSiteChildItems(items);
  }catch(e){
    console.warn("Rozdílové načtení položek pod bodem selhalo",kind,e);
    return [];
  }
}

async function loadSiteChildItemsForOffline(kind,site=selectedSite,sinceMs=0){
  const localKind=siteChildLocalKind(kind);
  const hasLocal=localKind ? readSiteLocalArray(localKind,site).length>0 : false;
  if(!sinceMs || !hasLocal) return loadSiteChildItems(kind,site);
  return loadSiteChildItemsDelta(kind,site,sinceMs);
}

async function deleteSiteChildItem(kind,id,site=selectedSite){
  const docId=selectedSiteDocId(site);
  const cleanId=safe(id);
  if(!docId || !cleanId || !firebaseReady || !db || !fb.fsMod) return false;
  try{
    const {doc,deleteDoc}=fb.fsMod;
    await deleteDoc(doc(db,"sitesUnified",docId,kind,cleanId));
    clearSiteChildItemsCache(kind,site);
    clearDetailHistoryCacheForKind(kind,site);
    return true;
  }catch(e){
    console.warn("Smazání položky pod bodem selhalo",kind,e);
    return false;
  }
}

async function removeEmbeddedSiteItem(field,id,site=selectedSite){
  const docId=selectedSiteDocId(site);
  const cleanId=safe(id);
  if(!docId || !cleanId || !firebaseReady || !db || !fb.fsMod) return false;
  try{
    const {doc,setDoc,getDoc,serverTimestamp}=fb.fsMod;
    const ref=doc(db,"sitesUnified",docId);
    let current=[];
    try{
      const snap=await getDoc(ref);
      const data=snap.exists() ? (snap.data() || {}) : {};
      current=Array.isArray(data[field]) ? data[field].slice() : [];
    }catch(e){
      current=Array.isArray(site?.firebaseData?.[field]) ? site.firebaseData[field].slice() : [];
    }
    const next=current.filter(item=>safe(item && item._id)!==cleanId);
    await setDoc(ref,{[field]:next,updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()},{merge:true});
    if(site){
      site.firebaseData=site.firebaseData || {};
      site.firebaseData[field]=next;
    }
    clearDetailHistoryCacheForKind(field,site);
    return true;
  }catch(e){
    console.warn("Smazání vložené položky selhalo",field,e);
    return false;
  }
}

async function appendEmbeddedSiteItem(field,item,site=selectedSite){
  const docId=selectedSiteDocId(site);
  if(!docId || !firebaseReady || !db) return false;
  const dataItem={...item};
  try{
    const {doc,setDoc,getDoc,serverTimestamp}=fb.fsMod;
    const ref=doc(db,"sitesUnified",docId);
    let current=[];
    try{
      const snap=await getDoc(ref);
      const data=snap.exists() ? (snap.data() || {}) : {};
      current=Array.isArray(data[field]) ? data[field].slice() : [];
    }catch(e){
      current=Array.isArray(site?.firebaseData?.[field]) ? site.firebaseData[field].slice() : [];
    }
    const itemId=safe(dataItem._id);
    if(itemId){
      current=current.filter(existing=>safe(existing && existing._id)!==itemId);
    }
    current.push(dataItem);
    if(field!=="photos" && current.length>80) current=current.slice(-80);
    await setDoc(doc(db,"sitesUnified",docId),{
      [field]:current,
      updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
    },{merge:true});
    if(site){
      site.firebaseData=site.firebaseData || {};
      site.firebaseData[field]=current;
    }
    clearDetailHistoryCacheForKind(field,site);
    return true;
  }catch(e){
    console.warn("Záložní uložení do místa selhalo",field,e);
    return false;
  }
}

function protocolDateIso(item){
  return isoDateFromAny(item?.date || item?.checkDate || item?.createdAt || "");
}

function protocolTimeValue(item){
  const saved=protocolSavedTimeValue(item);
  if(saved) return saved;
  const iso=protocolDateIso(item);
  const d=parseDateValue(iso);
  if(d) return d.getTime();
  return historyTimeValue(item);
}

function latestProtocolDateFromSiteData(data){
  const protocols=Array.isArray(data?.protocolHistory) ? data.protocolHistory : [];
  const latest=protocols
    .map(item=>({item,time:protocolTimeValue(item)}))
    .filter(x=>Number.isFinite(x.time) && x.time>0)
    .sort((a,b)=>b.time-a.time)[0];
  return latest ? protocolDateIso(latest.item) : isoDateFromAny(data?.latestProtocolDate || "");
}

function applyLatestProtocolDateToRaw(raw,data){
  const out={...(raw || {})};
  const latest=latestProtocolDateFromSiteData(data);
  if(!latest) return out;
  const months=Number(detectControlPeriod(out)) || periodMonths({raw:out});
  out["Perioda kontrol"]=String(months);
  out["Poslední_kontrola"]=latest;
  const last=parseDateValue(latest);
  if(last){
    out["Příští_kontrola"]=dateInputValueFromAny(addMonths(last, months));
  }
  return out;
}

function applyLatestProtocolToSite(protocol,site=selectedSite){
  if(!protocol || !site) return;
  const raw=applyLatestProtocolDateToRaw(site.raw || {},{protocolHistory:[protocol]});
  site.raw=raw;
  const refreshed=normalize([raw])[0];
  Object.assign(site, refreshed, {
    id:site.id,
    i:site.i,
    firebaseDocId:site.firebaseDocId || raw["Firebase_doc_id"] || "",
    firebaseData:site.firebaseData || {}
  });
  if(selectedSite && detailKey(selectedSite)===detailKey(site)) selectedSite=site;
}

function protocolRepairHistoryEntry(protocol={}){
  const note=safe(protocol.notes).replace(/\s+/g," ").trim();
  if(!note) return "";
  const date=protocolDisplayDate(protocol.savedAt || protocol.updatedAt || protocol.createdAt || protocol.date || new Date().toISOString());
  return `${date ? `${date} - ` : ""}${note}`;
}

function appendProtocolNoteToRepairHistory(raw={},protocol={}){
  const entry=protocolRepairHistoryEntry(protocol);
  if(!entry) return raw;
  const current=safe(raw["Historie oprav"] || raw["Historie_oprav"] || "");
  const lines=current.split(/\r?\n/).map(line=>safe(line)).filter(Boolean);
  if(lines.some(line=>line===entry)) return raw;
  const history=[entry,...lines].join("\n");
  raw["Historie oprav"]=history;
  raw["Historie_oprav"]=history;
  return raw;
}

function applyProtocolFieldsToRaw(raw,protocol={}){
  const out=raw || {};
  const device=safe(protocol.deviceType || protocol.selectedDevice);
  const serial=safe(protocol.serial);
  const location=safe(protocol.pbzLocation);
  const breakers=safe(protocol.breakersLocation);
  const testProcedure=safe(protocol.testProcedure);
  const contacts=safe(protocol.contacts);
  if(device){
    out["Popis_zdroje"]=device;
    out["Kontrolované zařízení"]=device;
    out["Typ zařízení"]=device;
  }
  if(serial){
    out["Zdroj"]=serial;
    out["Výrobní číslo"]=serial;
    out["Výrobní_číslo"]=serial;
  }
  if(location){
    out["Umístění zdroje"]=location;
    out["Umístění"]=location;
  }
  if(breakers){
    out["Jistič UPS"]=breakers;
    out["Jističe UPS"]=breakers;
    out["Umístění jističů"]=breakers;
  }
  if(testProcedure){
    out["Postup testování"]=testProcedure;
    out["Postup testovani"]=testProcedure;
  }
  if(contacts){
    out["Kontakt"]=contacts;
    out["Kontakt_mapy"]=contacts;
    out["Hlavní kontakt"]=contacts;
    out["Upravený kontakt"]=contacts;
  }
  appendProtocolNoteToRepairHistory(out,protocol);
  return out;
}

function applyProtocolFieldsToSite(protocol,site=selectedSite){
  if(!protocol || !site) return;
  const raw=applyProtocolFieldsToRaw({...(site.raw || {})},protocol);
  site.raw=raw;
  const refreshed=normalize([raw])[0];
  Object.assign(site, refreshed, {
    id:site.id,
    i:site.i,
    firebaseDocId:site.firebaseDocId || raw["Firebase_doc_id"] || "",
    firebaseData:{...(site.firebaseData || {}), raw}
  });
  if(selectedSite && detailKey(selectedSite)===detailKey(site)) selectedSite=site;
}

function clearManualStatusRaw(raw={}){
  raw["Stop Stav"]="NE";
  raw["Kontrola objednaná"]="NE";
  raw["Objednáno"]="NE";
  raw["Objednaná oprava"]="NE";
  raw["Stav pro mapu"]="";
  return raw;
}

function manualStatusSiteMatches(row,site,selectedKey,docId){
  if(!row || !site) return false;
  const rowDocId=selectedSiteDocId(row);
  return row===site
    || detailKey(row)===selectedKey
    || row.id===selectedKey
    || (!!docId && rowDocId===docId);
}

function clearManualStatusEditCache(site=selectedSite){
  if(!site) return;
  const keys=[
    detailKey(site),
    site.id,
    selectedSiteDocId(site),
    site.firebaseDocId,
    site.raw && site.raw["Firebase_doc_id"]
  ].map(safe).filter(Boolean);
  [...new Set(keys)].forEach(key=>{
    const existing=editCache[key] || {};
    editCache[key]={
      ...existing,
      ordered:false,
      repairOrdered:false,
      stopped:false,
      rawEdits:clearManualStatusRaw({...(existing.rawEdits || {})}),
      updatedBy:currentUser?.email || existing.updatedBy || "",
      updatedAt:new Date().toISOString()
    };
  });
}

function clearManualStatusLocalState(site=selectedSite){
  if(!site) return;
  const selectedKey=detailKey(site) || site.id;
  const docId=selectedSiteDocId(site);
  clearManualStatusEditCache(site);
  const applyClear=(target)=>{
    const raw=clearManualStatusRaw({...(target.raw || {})});
    const refreshed=normalize([raw])[0];
    return {
      ...target,
      ...refreshed,
      raw,
      ordered:false,
      repairOrdered:false,
      stopped:false,
      firebaseDocId:target.firebaseDocId || raw["Firebase_doc_id"] || "",
      firebaseData:{...(target.firebaseData || {}),raw}
    };
  };
  const lookupKey=safe(docId || selectedKey);
  const indexedRow=(lookupKey && findRowByAnyId(lookupKey)) || site;
  const index=rowIndexForRow(indexedRow);
  if(indexedRow && index>=0){
    const nextRows=rows.slice();
    const updated=applyClear(indexedRow);
    nextRows[index]=updated;
    rows=nextRows;
    window.rows=rows;
    selectedSite=updated;
    return;
  }
  rows=rows.map(row=>manualStatusSiteMatches(row,site,selectedKey,docId) ? applyClear(row) : row);
  window.rows=rows;
  selectedSite=(lookupKey && findRowByAnyId(lookupKey)) || applyClear(site);
}

function refreshSelectedDetailDataView(){
  if(!selectedSite) return;
  const table=document.getElementById("detailTable");
  if(table && !table.classList.contains("data-edit-table")){
    renderDetailTable(table,selectedSite);
  }
  showControlDateDisplay(selectedSite);
  const sub=document.getElementById("detailSub");
  if(sub) sub.textContent=siteSourceLabel(selectedSite) || "";
  syncOpenProtocolContactFromDetail(selectedSite);
}

async function refreshSiteDataFromFirebase(site=selectedSite){
  const docId=selectedSiteDocId(site);
  if(!docId || !firebaseReady || !db || !fb.fsMod) return null;
  try{
    const {doc,getDoc}=fb.fsMod;
    const snap=await getDoc(doc(db,"sitesUnified",docId));
    if(!snap.exists()) return null;
    const data=snap.data() || {};
    const mergedRaw=applyLatestProtocolDateToRaw({...(site?.raw||{}), ...(data.raw||{})}, data);
    if(site){
      site.firebaseData=data;
      site.raw=mergedRaw;
      const refreshed=normalize([mergedRaw])[0];
      Object.assign(site, refreshed, {
        id:site.id,
        i:site.i,
        firebaseDocId:docId,
        firebaseData:data
      });
    }
    if(selectedSite && detailKey(selectedSite)===detailKey(site)){
      selectedSite=site;
    }
    return data;
  }catch(e){
    console.warn("Čerstvé načtení dat bodu selhalo",e);
    return null;
  }
}

async function updateSiteControlDateFromProtocol(protocol,site=selectedSite,options={}){
  const docId=selectedSiteDocId(site);
  const latest=protocolDateIso(protocol);
  if(!docId || !firebaseReady || !db) return false;
  const baseRaw={...(site?.raw || {})};
  const raw=latest ? applyLatestProtocolDateToRaw(baseRaw,{protocolHistory:[protocol]}) : baseRaw;
  applyProtocolFieldsToRaw(raw,protocol);
  if(options.clearManualStatus) clearManualStatusRaw(raw);
  raw["Firebase_doc_id"]=docId;
  if(!raw["Klíč_adresy"]) raw["Klíč_adresy"]="firebase_"+docId;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    const updatePayload={
      raw,
      dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(raw) : [],
      updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString(),
      updatedBy:currentUser?.email || ""
    };
    if(latest) updatePayload.latestProtocolDate=latest;
    await setDoc(doc(db,"sitesUnified",docId),updatePayload,{merge:true});
    if(site){
      site.raw=raw;
      const refreshed=normalize([raw])[0];
      Object.assign(site, refreshed, {
        id:site.id,
        i:site.i,
        firebaseDocId:docId,
        firebaseData:{
          ...(site.firebaseData || {}),
          raw,
          ...(latest ? {latestProtocolDate:latest} : {})
        }
      });
    }
    if(options.clearManualStatus) clearManualStatusLocalState(site);
    return true;
  }catch(e){
    console.warn("Uložení poslední kontroly z protokolu selhalo",e);
    return false;
  }
}

function isHistoryAdmin(){
  return isAppAdmin();
}

function prependHistoryNotice(message){
  const history=document.getElementById("history");
  if(!history) return;
  const note=document.createElement("p");
  note.className="small";
  note.textContent=message;
  history.prepend(note);
}

async function deleteCurrentHistoryProtocol(){
  const item=detailHistoryItems[detailHistoryIndex];
  if(!item || item._type!=="Protokol" || !item._id) return;
  if(!isHistoryAdmin()){
    prependHistoryNotice("Mazat protokoly může jen správce.");
    return;
  }
  if(!confirm("Opravdu smazat tento uložený protokol z historie?")) return;
  try{
    const {doc,deleteDoc,setDoc,serverTimestamp}=fb.fsMod;
    try{ await deleteDoc(doc(db,"protocols",item._id)); }catch(e){ console.warn("Samostatný protokol se nepodařilo smazat",e); }
    const docId=selectedSiteDocId(selectedSite);
    if(docId){
      try{ await deleteDoc(doc(db,"sitesUnified",docId,"protocols",item._id)); }catch(e){ console.warn("Protokol pod bodem se nepodařilo smazat",e); }
      const currentData=selectedSite?.firebaseData || {};
      const protocolHistory=Array.isArray(currentData.protocolHistory) ? currentData.protocolHistory.filter(p=>String(p?._id || "")!==String(item._id)) : [];
      const protocolRefs=Array.isArray(currentData.protocolRefs) ? currentData.protocolRefs.filter(p=>String(p?._id || "")!==String(item._id)) : [];
      await setDoc(doc(db,"sitesUnified",docId),{
        protocolHistory,
        protocolRefs,
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
      selectedSite.firebaseData={...currentData,protocolHistory,protocolRefs};
    }
    removeSiteLocalItem("protocolHistory",item._id,selectedSite);
    showSaveConfirmation("Protokol smazán.");
    await loadHistory(selectedSite?.id || item.siteId);
  }catch(e){
    prependHistoryNotice(`Chyba mazání protokolu: ${e.message}`);
  }
}

function bindDetailHistoryActions(history){
  if(!history || history.__szzHistoryActionClickBound) return;
  history.__szzHistoryActionClickBound=true;
  history.addEventListener("click",async event=>{
    const button=event.target.closest && event.target.closest("button");
    if(!button || !history.contains(button)) return;
    const id=button.id || "";
    if(id==="historyPrevBtn"){
      detailHistoryIndex--;
      renderHistory();
      return;
    }
    if(id==="historyNextBtn"){
      detailHistoryIndex++;
      renderHistory();
      return;
    }
    if(id==="deleteHistoryProtocolBtn"){
      await deleteCurrentHistoryProtocol();
      return;
    }
    if(id==="editHistoryProtocolBtn"){
      editCurrentHistoryProtocol();
      return;
    }
    if(id==="exportHistoryProtocolBtn"){
      exportProtocolToWord(detailHistoryItems[detailHistoryIndex]);
      return;
    }
    if(id==="mailHistoryProtocolBtn"){
      if(!confirmProtocolMailSend()) return;
      button.disabled=true;
      try{
        await sendProtocolByMail(detailHistoryItems[detailHistoryIndex]);
      }catch(e){
        const st=document.getElementById("protocolStatus");
        const message=protocolMailErrorText(e);
        if(st) st.textContent=`Chyba odeslání e-mailu: ${message}`;
        showSaveConfirmation(`E-mail: ${protocolMailToastText(e)}`);
      }finally{
        button.disabled=false;
      }
    }
  });
}

function renderHistory(){
  const history=document.getElementById("history");
  if(!history) return;
  bindDetailHistoryActions(history);
  if(!canViewProtocolHistory()){
    detailHistoryItems=[];
    detailHistoryIndex=0;
    history.textContent="Historii protokolů uvidí přihlášený technik.";
    updateOfficialProtocolSourceInfo();
    return;
  }

  if(!detailHistoryItems.length){
    history.textContent="Zatím žádný záznam.";
    updateOfficialProtocolSourceInfo();
    return;
  }

  if(detailHistoryIndex<0) detailHistoryIndex=0;
  if(detailHistoryIndex>=detailHistoryItems.length) detailHistoryIndex=detailHistoryItems.length-1;

  const d=detailHistoryItems[detailHistoryIndex];
  const canExportProtocol=isProtocolHistoryItem(d);
  const canDeleteProtocol=isHistoryAdmin() && canExportProtocol;
  const rows=[
    ["Typ záznamu", d._type || "Záznam"],
    ["Datum", historyDateLabel(d)],
    ["Uloženo", historySavedDateLabel(d)],
    ["Technik", d.technician || d.techSign || d.createdBy || d.technicianEmail || ""],
    ["Zařízení", d.deviceType || d.siteSource || ""],
    ["Výrobní číslo", d.serial || ""],
    ["Adresa", d.place || d.siteAddress || d.siteName || ""],
    ["Umístění PBZ", d.pbzLocation || ""],
    ["Perioda", d.period || ""],
    ["Výsledek", d.result || d.conditions || ""],
    ["Reset diagnostiky", d.resetDiagnostics || ""],
    ["Baterie", [d.batteryCount ? `${d.batteryCount} ks` : "", d.capacityAh ? `${d.capacityAh} Ah` : "", d.setCount ? `${d.setCount} sad` : ""].filter(Boolean).join(", ")],
    ["Měření AC", [d.inputVac&&`vstup ${d.inputVac} Vac`, d.output1Vac&&`výstup 1 ${d.output1Vac} Vac`, d.output2Vac&&`výstup 2 ${d.output2Vac} Vac`].filter(Boolean).join(", ")],
    ["Měření DC", [d.mainBatVdc&&`hl. bat. ${d.mainBatVdc} Vdc`, d.auxBatVdc&&`pom. bat. ${d.auxBatVdc} Vdc`].filter(Boolean).join(", ")],
    ["Jističe", d.breakersLocation || ""],
    ["Zálohovaná zařízení", historyObjectSummary(d.backedDevices)],
    ["Umístění zálohovaných zařízení", d.controlLocation || ""],
    ["Postup testování", d.testProcedure || ""],
    ["Vstup / OOPP", historyObjectSummary(d.access)],
    ["Kontakty", d.contacts || ""],
    ["Dostupnost", historyObjectSummary(d.availability)],
    ["Zjištění / poznámky", d.issues || d.notes || d.conditionsReason || ""],
    ["Doporučení", d.recommendation || ""],
    ["Podpis objednavatele", d.clientSignatureDataUrl ? "uložen elektronicky" : ""]
  ].filter(([,value])=>safe(value));

  const photos=d._collection==="protocols" ? [] : (d.photoLinks||[]).filter(Boolean);
  const controls=document.createElement("div");
  controls.className="history-controls";
  const prevBtn=document.createElement("button");
  prevBtn.className="secondary";
  prevBtn.type="button";
  prevBtn.id="historyPrevBtn";
  prevBtn.disabled=detailHistoryIndex<=0;
  prevBtn.textContent="Předchozí";
  const counter=document.createElement("div");
  counter.className="history-counter";
  counter.textContent=`${detailHistoryIndex+1} / ${detailHistoryItems.length}`;
  const nextBtn=document.createElement("button");
  nextBtn.className="secondary";
  nextBtn.type="button";
  nextBtn.id="historyNextBtn";
  nextBtn.disabled=detailHistoryIndex>=detailHistoryItems.length-1;
  nextBtn.textContent="Další";
  controls.append(prevBtn,counter,nextBtn);

  const itemEl=document.createElement("div");
  itemEl.className="history-item";
  rows.forEach(([label,value])=>{
    const rowEl=document.createElement("div");
    rowEl.className="history-detail-row";
    const labelEl=document.createElement("span");
    labelEl.textContent=safe(label);
    const valueEl=document.createElement("span");
    valueEl.textContent=safe(value);
    rowEl.append(labelEl,valueEl);
    itemEl.appendChild(rowEl);
  });
  if(photos.length){
    const photosEl=document.createElement("div");
    photosEl.className="history-photos";
    photos.forEach((url,idx)=>{
      const link=document.createElement("a");
      link.href=safe(url);
      link.target="_blank";
      const img=document.createElement("img");
      img.src=safe(url);
      img.alt=`Foto ${idx+1}`;
      img.loading="lazy";
      img.decoding="async";
      link.appendChild(img);
      photosEl.appendChild(link);
    });
    itemEl.appendChild(photosEl);
  }
  if(canExportProtocol || canDeleteProtocol){
    const actions=document.createElement("div");
    actions.className="history-actions";
    const addAction=(className,id,text)=>{
      const button=document.createElement("button");
      button.className=className;
      button.type="button";
      button.id=id;
      button.textContent=text;
      actions.appendChild(button);
    };
    if(canExportProtocol){
      addAction("secondary","editHistoryProtocolBtn","Upravit protokol");
      addAction("secondary","exportHistoryProtocolBtn","Exportovat do Wordu");
      addAction("secondary","mailHistoryProtocolBtn","Poslat na mail");
    }
    if(canDeleteProtocol) addAction("danger","deleteHistoryProtocolBtn","Smazat protokol");
    itemEl.appendChild(actions);
  }
  history.replaceChildren(controls,itemEl);
  updateOfficialProtocolSourceInfo();
}

async function loadHistory(siteId){
  const history=document.getElementById("history");
  if(!history) return;
  const requestedKey=detailLazyKey(selectedSite);
  const stillSameSite=()=>!requestedKey || requestedKey===detailLazyKey(selectedSite);
  if(!canViewProtocolHistory()){
    detailHistoryItems=[];
    detailHistoryIndex=0;
    history.textContent="Historii protokolů uvidí přihlášený technik.";
    updateOfficialProtocolSourceInfo();
    return;
  }
  let localHistoryItems=null;
  const readLocalHistoryItemsOnce=async()=>{
    if(localHistoryItems) return localHistoryItems;
    localHistoryItems=await readSiteLocalProtocolHistoryItems(selectedSite);
    return localHistoryItems;
  };
  const showLocalHistoryOnly=async message=>{
    const localItems=await readLocalHistoryItemsOnce();
    if(localItems.length){
      localItems.sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a));
      detailHistoryItems=localItems.slice();
      detailHistoryIndex=0;
      renderHistory();
      return true;
    }
    history.textContent=message;
    detailHistoryItems=[];
    detailHistoryIndex=0;
    updateOfficialProtocolSourceInfo();
    return false;
  };
  if(!firebaseReady){
    await showLocalHistoryOnly("Firebase není nastavený, historie se nenačte.");
    return;
  }
  history.textContent="Načítám historii…";
  const signedUser=await waitForFirebaseUser();
  if(!stillSameSite()) return;
  if(!signedUser){
    await showLocalHistoryOnly("Čekám na přihlášení, historie se načte po přihlášení.");
    return;
  }
  await syncOfflineProtocolsForSite(selectedSite,{silent:true});
  if(!stillSameSite()) return;
  const cachedHistoryItems=readDetailHistoryCache(selectedSite);
  if(cachedHistoryItems){
    detailHistoryItems=cachedHistoryItems;
    detailHistoryIndex=0;
    renderHistory();
    return;
  }
  localHistoryItems=await readLocalHistoryItemsOnce();
  if(!stillSameSite()) return;

  try{
    const [,childProtocols,childRecords]=await Promise.all([
      refreshSiteDataFromFirebase(selectedSite),
      loadSiteChildItems("protocols",selectedSite),
      loadSiteChildItems("serviceRecords",selectedSite)
    ]);
    if(!stillSameSite()) return;
    const {collection,query,where,getDocs,doc,getDoc}=fb.fsMod;
    const items=[];
    const itemDedupe=createRecordIdDedupe(items);
    const addHistoryItem=item=>{
      itemDedupe.add(item);
    };
    childProtocols.forEach((item,idx)=>{
      addHistoryItem({...item,_type:"Protokol",_collection:"siteProtocols",_id:item._id || `site_protocol_${idx}`});
    });
    childRecords.forEach((item,idx)=>{
      addHistoryItem({...item,_type:"Servisní záznam",_collection:"siteServiceRecords",_id:item._id || `site_service_${idx}`});
    });
    const embeddedProtocols=Array.isArray(selectedSite?.firebaseData?.protocolHistory) ? selectedSite.firebaseData.protocolHistory : [];
    embeddedProtocols.forEach((item,idx)=>{
      addHistoryItem({...item,_type:"Protokol",_collection:"embeddedProtocols",_id:item._id || `embedded_protocol_${idx}`});
    });
    localHistoryItems.forEach(addHistoryItem);
    const embeddedRecords=Array.isArray(selectedSite?.firebaseData?.serviceHistory) ? selectedSite.firebaseData.serviceHistory : [];
    embeddedRecords.forEach((item,idx)=>{
      addHistoryItem({...item,_type:"Servisní záznam",_collection:"embeddedServiceRecords",_id:item._id || `embedded_service_${idx}`});
    });
    const initialItems=items.filter(item=>recordMatchesSite(item,selectedSite));
    if(initialItems.length){
      initialItems.sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a));
      detailHistoryItems=initialItems.slice();
      detailHistoryIndex=0;
      renderHistory();
    }
    const refTasks=[];
    const protocolRefs=Array.isArray(selectedSite?.firebaseData?.protocolRefs) ? selectedSite.firebaseData.protocolRefs : [];
    protocolRefs.forEach(refItem=>{
      const id=safe(refItem && refItem._id);
      if(!id) return;
      refTasks.push(async()=>{
        if(itemDedupe.has(id)) return;
        try{
          const snap=await getDoc(doc(db,"protocols",id));
          if(snap.exists()) addHistoryItem({...snap.data(),_type:"Protokol",_collection:"protocols",_id:snap.id});
          else addHistoryItem({...refItem,_type:"Protokol",_collection:"protocolRefs",_id:id});
        }catch(e){
          console.warn("Přímé načtení protokolu selhalo",id,e);
          addHistoryItem({...refItem,_type:"Protokol",_collection:"protocolRefs",_id:id});
        }
      });
    });
    const serviceRefs=Array.isArray(selectedSite?.firebaseData?.serviceRefs) ? selectedSite.firebaseData.serviceRefs : [];
    serviceRefs.forEach(refItem=>{
      const id=safe(refItem && refItem._id);
      if(!id) return;
      refTasks.push(async()=>{
        if(itemDedupe.has(id)) return;
        try{
          const snap=await getDoc(doc(db,"serviceRecords",id));
          if(snap.exists()) addHistoryItem({...snap.data(),_type:"Servisní záznam",_collection:"serviceRecords",_id:snap.id});
          else addHistoryItem({...refItem,_type:"Servisní záznam",_collection:"serviceRefs",_id:id});
        }catch(e){
          console.warn("Přímé načtení servisního záznamu selhalo",id,e);
          addHistoryItem({...refItem,_type:"Servisní záznam",_collection:"serviceRefs",_id:id});
        }
      });
    });
    await runBoundedFirestoreTasks(refTasks,6);
    const historySiteIds=[siteId, ...siteRecordKeys(selectedSite)]
      .map(x=>String(x || ""))
      .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);

    async function readCollection(colName,typeLabel){
      try{
        const addDocSnap=docSnap=>{
          const d=docSnap.data();
          addHistoryItem({...d,_type:typeLabel,_collection:colName,_id:docSnap.id});
        };
        const hasMatchingType=()=>items.some(item=>item._type===typeLabel && recordMatchesSite(item,selectedSite));
        const buildTextQueryTasks=()=>{
          const textQueryTasks=[];
          const textKeys=siteRecordTextKeys(selectedSite).slice(0,8);
          for(const value of textKeys){
            for(const field of ["siteName","siteAddress","place"]){
              textQueryTasks.push(async()=>{
                try{
                  const q=query(collection(db,colName),where(field,"==",value));
                  const snap=await getDocs(q);
                  snap.forEach(addDocSnap);
                }catch(e){
                  console.warn("Historie textový dotaz selhal",colName,field,e);
                }
              });
            }
          }
          return textQueryTasks;
        };
        const renderLegacyTextMatches=()=>{
          if(!stillSameSite()) return;
          const finalItems=items.filter(item=>recordMatchesSite(item,selectedSite));
          if(finalItems.length<=detailHistoryItems.length) return;
          finalItems.sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a));
          const latestProtocol=finalItems.find(item=>item._type==="Protokol");
          if(latestProtocol && selectedSite){
            applyLatestProtocolToSite(latestProtocol,selectedSite);
            showControlDateDisplay(selectedSite);
            requestRender();
          }
          detailHistoryItems=finalItems;
          detailHistoryIndex=Math.min(detailHistoryIndex,Math.max(0,detailHistoryItems.length-1));
          writeDetailHistoryCache(selectedSite,finalItems);
          renderHistory();
        };
        const runTextFallback=async(background=false)=>{
          const textQueryTasks=buildTextQueryTasks();
          if(!textQueryTasks.length) return;
          if(!background){
            await runBoundedFirestoreTasks(textQueryTasks,6);
            return;
          }
          runWhenIdle(async()=>{
            const before=items.length;
            await runBoundedFirestoreTasks(textQueryTasks,3);
            if(items.length>before) renderLegacyTextMatches();
          },1600);
        };
        const siteKeysBatchOk=await readFirestoreArrayContainsAny(
          fb.fsMod,
          db,
          colName,
          "siteKeys",
          historySiteIds,
          addDocSnap,
          `Historie dávkový dotaz selhal ${colName}`
        );
        const queryTasks=[];
        for(const field of ["siteId","siteKey","firebaseDocId"]){
          queryTasks.push(()=>readFirestoreEqualsAny(
            fb.fsMod,
            db,
            colName,
            field,
            historySiteIds,
            addDocSnap,
            `Historie rovnostní dávkový dotaz selhal ${colName}`
          ));
        }
        for(const id of historySiteIds){
          if(!siteKeysBatchOk){
            queryTasks.push(async()=>{
              try{
                const q=query(collection(db,colName),where("siteKeys","array-contains",id));
                const snap=await getDocs(q);
                snap.forEach(addDocSnap);
              }catch(e){
                console.warn("Historie dotaz selhal",colName,"siteKeys",e);
              }
            });
          }
        }
        await runBoundedFirestoreTasks(queryTasks,6);
        if(hasMatchingType()){
          await runTextFallback(true);
          return;
        }
        await runTextFallback(false);
      }catch(e){
        console.warn("Historie kolekce nejde načíst",colName,e);
      }
    }

    await Promise.all([
      readCollection("serviceRecords","Servisní záznam"),
      readCollection("protocols","Protokol")
    ]);
    if(!stillSameSite()) return;

    const finalItems=items.filter(item=>recordMatchesSite(item,selectedSite));
    if(!finalItems.length){
      detailHistoryItems=[];
      detailHistoryIndex=0;
      writeDetailHistoryCache(selectedSite,[]);
      history.textContent="Zatím žádný záznam.";
      updateOfficialProtocolSourceInfo();
      return;
    }

    finalItems.sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a));
    const latestProtocol=finalItems.find(item=>item._type==="Protokol");
    if(latestProtocol && selectedSite){
      applyLatestProtocolToSite(latestProtocol,selectedSite);
      showControlDateDisplay(selectedSite);
      requestRender();
    }
    detailHistoryItems=finalItems;
    detailHistoryIndex=0;
    writeDetailHistoryCache(selectedSite,finalItems);
    renderHistory();
  }catch(e){
    if(stillSameSite()) history.textContent="Chyba načtení historie: "+e.message;
  }
}

window.loadHistory=loadHistory;

let offlineSyncInFlight=null;
let lastAutomaticOfflineSyncAt=0;
const AUTOMATIC_OFFLINE_SYNC_MIN_MS=5000;
function runOfflineSync(reason="manual",silent=false){
  if(navigator.onLine===false) return Promise.resolve(0);
  if(offlineSyncInFlight) return offlineSyncInFlight;
  const isAutomatic=reason!=="manual" && silent;
  if(isAutomatic){
    const now=Date.now();
    if(now-lastAutomaticOfflineSyncAt<AUTOMATIC_OFFLINE_SYNC_MIN_MS) return Promise.resolve(0);
    lastAutomaticOfflineSyncAt=now;
  }
  if(typeof syncOfflineChanges==="function"){
    offlineSyncInFlight=syncOfflineChanges({reason,silent}).finally(()=>{offlineSyncInFlight=null;});
    return offlineSyncInFlight;
  }
  if(selectedSite && typeof syncOfflineProtocolsForSite==="function"){
    offlineSyncInFlight=syncOfflineProtocolsForSite(selectedSite).finally(()=>{offlineSyncInFlight=null;});
    return offlineSyncInFlight;
  }
  return Promise.resolve(0);
}

window.addEventListener("online",()=>{
  runOfflineSync("online").then(count=>{
    if(count && selectedSite){
      if(typeof window.refreshLoadedDetailTabs==="function") window.refreshLoadedDetailTabs(selectedSite);
    }
  });
});

window.addEventListener("offline",()=>{
  if(typeof showSaveConfirmation==="function") showSaveConfirmation("Offline režim. Změny se uloží lokálně.");
});
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible") runOfflineSync("visible",true);
});
window.addEventListener("focus",()=>runOfflineSync("focus",true));



function fixMapView(){
  if(typeof map === "undefined") return;

  try{
    map.invalidateSize(true);

    // donucení znovunačtení dlaždic
    map.eachLayer(layer=>{
      if(layer && layer.redraw){
        try{ layer.redraw(); }catch(e){}
      }
    });

    if(typeof fit==="function") fit();

  }catch(e){
    console.warn("Map refresh error",e);
  }
}

function showApp(){
  if(window.setStartupAuthChecking) window.setStartupAuthChecking(false);
  if(window.updateAdminAppControls) window.updateAdminAppControls();
  window.__mapAppUnlocked=true;
  const startup=document.getElementById("startupScreen");
  const app=document.getElementById("mainApp");
  const loginRow=document.getElementById("mainLoginRow");
  const topLogout=document.getElementById("topLogoutBtn");
  setDisplayIfChanged(startup,"none");
  setDisplayIfChanged(app,"grid");
  setDisplayIfChanged(loginRow,"none");
  if(topLogout){
    const hasUser=!!(currentUser || window.currentUser || window.__authReadyUser);
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode(hasUser ? "logout" : "login");
    const canTryLogin=hasUser || firebaseReady || window.__firebaseConfigured || !!(window.firebase && firebase.auth);
    setDisplayIfChanged(topLogout,canTryLogin ? "block" : "none");
  }
  runAfterTwoPaints(()=>{ if(window.mobileFixMap) window.mobileFixMap(); if(window.map) window.map.invalidateSize(true); });
}
function showLogin(){
  if(window.setStartupAuthChecking) window.setStartupAuthChecking(false);
  if(window.updateAdminAppControls) window.updateAdminAppControls();
  window.__mapAppUnlocked=false;
  const startup=document.getElementById("startupScreen");
  const app=document.getElementById("mainApp");
  const loginRow=document.getElementById("mainLoginRow");
  const topLogout=document.getElementById("topLogoutBtn");
  setDisplayIfChanged(startup,"flex");
  setDisplayIfChanged(app,"none");
  setDisplayIfChanged(loginRow,"none");
  setDisplayIfChanged(topLogout,"none");
}

function showSaveConfirmation(message="Uloženo."){
  const stack=document.getElementById("saveToast");
  if(!stack) return;
  const item=document.createElement("div");
  item.className="save-toast-item";
  item.textContent=message || "Uloženo.";
  stack.appendChild(item);
  requestAnimationFrame(()=>item.classList.add("show"));
  setTimeout(()=>item.classList.add("hide"),2100);
  setTimeout(()=>item.remove(),2700);
}
window.showSaveConfirmation=showSaveConfirmation;

function protocolGlobalHistoryTitle(item={}){
  const title=safe(item.siteName || item.place || item.siteAddress || item.siteKey || item.firebaseDocId || "Protokol");
  const device=safe(item.deviceType || item.selectedDevice || item.siteSource || "");
  const serial=safe(item.serial || "");
  return [title, device, serial].filter(Boolean).join(" | ");
}

function readAllLocalProtocolHistoryItems(){
  const items=[];
  try{
    localStorageArrayEntries("astipMap:protocolHistory:").forEach(entry=>{
      entry.items.forEach((item,idx)=>{
        if(item) items.push({...item,_type:"Protokol",_collection:"localProtocols",_id:item._id || `local_protocol_${idx}`});
      });
    });
  }catch(e){
    console.warn("Lokální historie protokolů nejde načíst",e);
  }
  return items;
}

function normalizeProtocolHistoryItems(items=[],collection="localProtocols",idPrefix=collection){
  return (items || []).filter(Boolean).map((item,idx)=>({
    ...item,
    _type:"Protokol",
    _collection:item._collection || collection,
    _id:item._id || `${idPrefix}_${idx}`
  }));
}

async function readAllLocalAndIndexedProtocolHistoryItems(){
  const localItems=readAllLocalProtocolHistoryItems();
  let indexedItems=[];
  if(typeof readAllOfflineProtocolQueueItems==="function"){
    try{
      indexedItems=normalizeProtocolHistoryItems(await readAllOfflineProtocolQueueItems(),"indexedOfflineProtocols","indexed_protocol");
    }catch(e){
      console.warn("IndexedDB historie protokolů nejde načíst",e);
    }
  }
  return uniqueByOfflineId([...localItems,...indexedItems]);
}

async function readSiteLocalProtocolHistoryItems(site=selectedSite){
  const localItems=normalizeProtocolHistoryItems(readSiteLocalArray("protocolHistory",site),"localProtocols","local_protocol")
    .filter(item=>recordMatchesSite(item,site));
  let indexedItems=[];
  if(typeof readOfflineProtocolQueueItems==="function"){
    try{
      indexedItems=normalizeProtocolHistoryItems(await readOfflineProtocolQueueItems(site),"indexedOfflineProtocols","indexed_protocol")
        .filter(item=>recordMatchesSite(item,site));
    }catch(e){
      console.warn("IndexedDB protokoly pro místo nejde načíst",e);
    }
  }
  return uniqueByOfflineId([...localItems,...indexedItems]);
}

async function loadMainProtocolHistoryItems(){
  if(!canViewMainProtocolHistory()) return [];
  const cached=readMainProtocolHistoryCache();
  if(cached) return cached;
  const items=[];
  const itemDedupe=createRecordIdDedupe(items);
  const addItem=item=>{
    itemDedupe.add(item);
  };
  (await readAllLocalAndIndexedProtocolHistoryItems()).forEach(addItem);
  if(firebaseReady && db && fb.fsMod && currentUser && navigator.onLine !== false){
    try{
      const {collection,getDocs,query,orderBy,limit:queryLimit}=fb.fsMod;
      let snap=null;
      if(query && orderBy && queryLimit){
        try{
          snap=await getDocs(query(collection(db,"protocols"),orderBy("savedAt","desc"),queryLimit(80)));
        }catch(e){
          console.warn("Seřazené načtení hlavní historie selhalo, načítám bez řazení",e);
        }
      }
      if(!snap) snap=await getDocs(collection(db,"protocols"));
      snap.forEach(docSnap=>addItem({...docSnap.data(),_type:"Protokol",_collection:"protocols",_id:docSnap.id}));
    }catch(e){
      console.warn("Hlavní historie protokolů nejde načíst",e);
    }
  }
  const finalItems=items
    .filter(isProtocolHistoryItem)
    .sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a))
    .slice(0,80);
  writeMainProtocolHistoryCache(finalItems);
  return finalItems.map(cloneDetailHistoryItem);
}

function renderMainProtocolHistoryShell(drawer){
  const head=document.createElement("div");
  head.className="drawer-head";
  const titleWrap=document.createElement("div");
  const title=document.createElement("h2");
  title.textContent="Historie protokolů";
  const subtitle=document.createElement("p");
  subtitle.className="small";
  subtitle.textContent="Poslední uložené protokoly napříč mapou.";
  titleWrap.append(title,subtitle);
  const close=document.createElement("button");
  close.className="secondary x";
  close.type="button";
  close.id="closeDrawer";
  close.textContent="Zavřít";
  head.append(titleWrap,close);

  const card=document.createElement("div");
  card.className="card";
  card.id="mainProtocolHistoryCard";
  const heading=document.createElement("h3");
  heading.textContent="Poslední protokoly";
  const list=document.createElement("div");
  list.id="mainProtocolHistoryList";
  list.className="main-history-list small";
  list.textContent="Načítám historii...";
  card.append(heading,list);

  drawer.replaceChildren(head,card);
  return {close,list};
}

function bindMainProtocolHistoryListClick(list){
  if(!list || list.__szzMainHistoryClickBound) return;
  list.__szzMainHistoryClickBound=true;
  list.addEventListener("click",event=>{
    const btn=event.target.closest && event.target.closest("[data-history-site-key]");
    if(!btn || !list.contains(btn)) return;
    const key=btn.getAttribute("data-history-site-key");
    if(key && typeof window.openDetailById==="function") window.openDetailById(key);
  });
}

async function openMainProtocolHistoryPanel(){
  if(!canViewMainProtocolHistory()){
    showSaveConfirmation("Hlavní historii protokolů může zobrazit jen správce nebo Iva.");
    return;
  }
  const drawer=document.getElementById("drawer");
  if(!drawer) return;
  captureNormalDetailDrawerShell(drawer);
  drawer.classList.add("open");
  drawer.classList.remove("adding-new-site");
  drawer.scrollTop=0;
  const {close,list}=renderMainProtocolHistoryShell(drawer);
  if(close) close.onclick=()=>drawer.classList.remove("open");
  bindMainProtocolHistoryListClick(list);
  const items=await loadMainProtocolHistoryItems();
  if(!list) return;
  if(!items.length){
    list.textContent="Zatím není uložený žádný protokol.";
    return;
  }
  const fragment=document.createDocumentFragment();
  items.forEach(item=>{
    const title=protocolGlobalHistoryTitle(item);
    const key=safe(item.siteKey || item.firebaseDocId || item.siteId || (Array.isArray(item.siteKeys) ? item.siteKeys[0] : ""));
    const meta=isAppAdmin() ? [
      historySavedDateLabel(item) ? `uloženo ${historySavedDateLabel(item)}` : "",
      historyDateLabel(item) ? `kontrola ${historyDateLabel(item)}` : "",
      safe(item.createdBy || item.technicianEmail || item.updatedBy)
    ].filter(Boolean).join(" | ") : "";
    const row=document.createElement("div");
    row.className="main-history-row";
    const button=document.createElement("button");
    button.type="button";
    button.dataset.historySiteKey=key;
    button.textContent=title;
    row.appendChild(button);
    if(meta){
      const small=document.createElement("small");
      small.textContent=meta;
      row.appendChild(small);
    }
    fragment.appendChild(row);
  });
  list.replaceChildren(fragment);
}
window.openMainProtocolHistoryPanel=openMainProtocolHistoryPanel;

if(typeof window.bindLoginButtons==="function"){
  window.bindLoginButtons();
}




bindDrawerCloseButton();
let filterRenderTimer=0;
let lastFilterInputSignature="";
function filterInputSignature(){
  const {search,status,region}=filterControls();
  return [
    search ? search.value : "",
    status ? status.value : "",
    region ? region.value : ""
  ].join("\u001f");
}
function scheduleFilterRender(delay=220){
  const signature=filterInputSignature();
  if(signature===lastFilterInputSignature) return;
  lastFilterInputSignature=signature;
  clearTimeout(filterRenderTimer);
  filterRenderTimer=setTimeout(requestRender,delay);
}
function requestFilterRenderNow(){
  const signature=filterInputSignature();
  if(signature===lastFilterInputSignature) return;
  lastFilterInputSignature=signature;
  requestRender();
}
lastFilterInputSignature=filterInputSignature();
const initialFilterControls=filterControls();
initialFilterControls.search?.addEventListener("input",()=>scheduleFilterRender());
initialFilterControls.status?.addEventListener("change",()=>{updateStatusFilterColor();requestFilterRenderNow();});
initialFilterControls.region?.addEventListener("change",requestFilterRenderNow);
document.getElementById("fitBtn").addEventListener("click",fit);
const mapBackBtn=document.getElementById("mapBackBtn");
if(mapBackBtn) mapBackBtn.onclick=returnFromMapFocus;
const mainProtocolHistoryBtn=document.getElementById("mainProtocolHistoryBtn");
if(mainProtocolHistoryBtn) mainProtocolHistoryBtn.addEventListener("click",openMainProtocolHistoryPanel);
document.getElementById("reloadEditBtn").onclick=async()=>{
  await loadEdits();
  await loadDeletedSites();
  if(firebaseUnifiedPrimary && typeof window.loadFirebaseSitesUnified==="function"){
    await window.loadFirebaseSitesUnified();
  }else{
    await loadExtraSites();
    render();
  }
};
document.getElementById("addSiteBtn").onclick=()=>{
  openNewSiteForm();
  const form=document.getElementById("newSiteCard");
  if(form){
    form.style.display="block";
    form.scrollIntoView({behavior:"smooth",block:"start"});
  }
  runAfterPaint(()=>{
    const first=document.getElementById("newName");
    if(first){
      first.focus();
      first.click();
    }
  });
};
document.getElementById("cancelNewSiteBtn").onclick=()=>{
  const baseKey=addSourceBaseSite ? detailKey(addSourceBaseSite) : "";
  document.getElementById("newSiteCard").style.display="none";
  clearNewSiteMode();
  if(baseKey) window.openDetailById(baseKey);
};
document.getElementById("saveNewSiteBtn").onclick=async()=>{
  const st=document.getElementById("newSiteStatus");
  const sourceBaseSite=addSourceBaseSite;
  if(!firebaseReady){st.textContent="Firebase není nastavený.";return;}
  if(!currentUser){st.textContent="Nejdřív se přihlaš.";return;}

  const name=document.getElementById("newName").value.trim();
  const gpsLat=document.getElementById("newGpsLat").value.trim();
  const gpsLon=document.getElementById("newGpsLon").value.trim();

  if(!name){
    st.className="small";
    st.textContent="Je potřeba doplnit místo / název, který se bude zobrazovat na mapě.";
    document.getElementById("newName").focus();
    return;
  }
  if(!gpsLat || !gpsLon){
    st.className="small";
    st.textContent="Vyplň GPS lat a GPS lon, aby se bod mohl zobrazit na mapě.";
    if(!gpsLat) document.getElementById("newGpsLat").focus();
    else document.getElementById("newGpsLon").focus();
    return;
  }

  const data={
    name,
    gpsAddress:document.getElementById("newGpsAddress").value.trim(),
    gpsLat,
    gpsLon,
    region:document.getElementById("newRegion").value.trim(),
    contact:document.getElementById("newContact").value.trim(),
    source:document.getElementById("newSource").value.trim(),
    ordered:false,
    noOrder:document.getElementById("newNoOrder").checked,
    nextCheck:document.getElementById("newNextCheck").value,
    lastCheck:document.getElementById("newLastCheck").value,
    notes:document.getElementById("newNotes").value.trim(),
    extra:document.getElementById("newExtra").value.trim(),
    allRawData:collectNewSiteAllFields(),
    allData:document.getElementById("newAllData") ? document.getElementById("newAllData").value.trim() : "",
    allRawData:collectNewSiteAllFields(),
    createdBy:currentUser.email,
    createdAt:new Date().toISOString(),
    updatedBy:currentUser.email,
    updatedAt:new Date().toISOString()
  };
  const newSourceType=safe(data.source || data.allRawData?.["Popis_zdroje"] || data.allRawData?.["Kontrolované zařízení"] || data.allRawData?.["Typ zařízení"]);
  const newSourceSerial=sourceSerialTextFromRaw(data.allRawData || {});
  if(sourceBaseSite && !newSourceType && !newSourceSerial){
    st.className="small";
    st.textContent="Pro další zdroj na stejné adrese doplň typ zdroje nebo výrobní číslo, aby se odlišil od ostatních.";
    const sourceInput=document.getElementById("newSource") || document.querySelector('#newAllFieldsBox [data-new-key="Popis_zdroje"]') || document.querySelector('#newAllFieldsBox [data-new-key="Zdroj"]');
    if(sourceInput) sourceInput.focus();
    return;
  }
  const newSiteDatePeriod=inferControlPeriodMonthsFromDateValues(data.lastCheck,data.nextCheck);
  if(newSiteDatePeriod){
    data.period=String(newSiteDatePeriod);
    data.controlPeriod=String(newSiteDatePeriod);
    data.allRawData={...(data.allRawData || {}), "Perioda kontrol":String(newSiteDatePeriod)};
  }

  try{
    let savedRef=null;
    let savedOffline=false;
    let savedRow=null;
    if(firebaseUnifiedPrimary){
      if(typeof window.saveUnifiedSiteRaw!=="function") throw new Error("Firebase ukládání nových bodů ještě není připravené.");
      const raw={...(data.allRawData || {})};
      raw["Název"]=data.name || raw["Název"] || "";
      raw["Adresa / umístění"]=data.gpsAddress || raw["Adresa / umístění"] || data.name || "";
      raw["Adresa_GPS"]=data.gpsAddress || raw["Adresa_GPS"] || raw["Adresa / umístění"] || "";
      raw["GPS_lat"]=data.gpsLat || raw["GPS_lat"] || "";
      raw["GPS_lon"]=data.gpsLon || raw["GPS_lon"] || "";
      raw["Kraj"]=data.region || raw["Kraj"] || "";
      raw["Kontakt"]=data.contact || raw["Kontakt"] || "";
      raw["Kontakt_mapy"]=data.contact || raw["Kontakt_mapy"] || raw["Kontakt"] || "";
      raw["Popis_zdroje"]=data.source || raw["Popis_zdroje"] || "";
      raw["Poznámky"]=data.notes || raw["Poznámky"] || "";
      raw["Poznámky_mapy"]=data.notes || raw["Poznámky_mapy"] || raw["Poznámky"] || "";
      raw["Příští_kontrola"]=data.nextCheck || raw["Příští_kontrola"] || "";
      raw["Poslední_kontrola"]=data.lastCheck || raw["Poslední_kontrola"] || "";
      if(data.period) raw["Perioda kontrol"]=data.period;
      applyWatchSelfAliases(raw, data.noOrder ? "ano" : raw["Hlídáme sami termín"] || raw["Hlídáme kontroly sami"] || "ne");
      if(sourceBaseSite){
        raw["Adresa / umístění"]=data.gpsAddress || sitePlaceLabel(sourceBaseSite) || raw["Adresa / umístění"] || raw["Název"] || "";
        raw["Adresa_GPS"]=data.gpsAddress || raw["Adresa_GPS"] || raw["Adresa / umístění"] || "";
        raw["GPS_lat"]=data.gpsLat || raw["GPS_lat"] || "";
        raw["GPS_lon"]=data.gpsLon || raw["GPS_lon"] || "";
        raw["Kraj"]=data.region || rowRegion(sourceBaseSite) || raw["Kraj"] || "";
        raw["Zdroj_dat"]="Firebase další zdroj";
      }
      const result=await window.saveUnifiedSiteRaw(raw);
      if(result.duplicate){
        st.textContent="Bod už existuje. Otevírám existující záznam.";
        addSourceBaseSite=null;
        if(navigator.onLine !== false && typeof window.refreshFirebaseSitesAfterSave==="function") await window.refreshFirebaseSitesAfterSave(result.id,result.row);
        else if(navigator.onLine !== false && typeof window.loadFirebaseSitesUnified==="function") await window.loadFirebaseSitesUnified(result.id);
        return;
      }
      savedRef={id:result.id};
      savedOffline=!!result.offline;
      savedRow=result.row || null;
    }else{
      const {collection,addDoc}=fb.fsMod;
      savedRef=await addDoc(collection(db,"sites"),data);
    }
    st.textContent=sourceBaseSite ? "Nový zdroj uložen." : "Nové místo uloženo.";
    showSaveConfirmation(sourceBaseSite ? "Nový zdroj uložen." : "Nové místo uloženo.");
    addSourceBaseSite=null;
    setInputValue("newName","");
    setInputValue("newGpsAddress","");
    setInputValue("newGpsLat","");
    setInputValue("newGpsLon","");
    setInputValue("newRegion","");
    setInputValue("newContact","");
    setInputValue("newSource","");
    
    setInputChecked("newNoOrder",false);
    setInputValue("newNextCheck","");
    setInputValue("newLastCheck","");
    setInputValue("newNotes","");
    setInputValue("newExtra","");
    clearNewSiteAllFields();
    setInputValue("newAllData","");
    if(savedOffline){
      if(typeof render==="function") render();
      if(savedRef && savedRef.id && typeof window.openDetailById==="function"){
        setTimeout(()=>window.openDetailById(savedRef.id),250);
      }
    }else if(firebaseUnifiedPrimary && typeof window.refreshFirebaseSitesAfterSave==="function"){
      await window.refreshFirebaseSitesAfterSave(savedRef && savedRef.id, savedRow);
    }else if(firebaseUnifiedPrimary && typeof window.loadFirebaseSitesUnified==="function"){
      await window.loadFirebaseSitesUnified();
    }else{
      await loadExtraSites();
      fit();
    }
  }catch(e){st.textContent="Chyba uložení nového místa: "+e.message;}
};
document.getElementById("editBtn").onclick=()=>document.getElementById("editCard").style.display="block";
document.getElementById("cancelEditBtn").onclick=()=>document.getElementById("editCard").style.display="none";

const toggleProtocolBtn=formFieldNode("toggleProtocolBtn");
if(toggleProtocolBtn){
  toggleProtocolBtn.onclick=()=>{
    const f=formFieldNode("protocolForm");
    if(!f) return;
    const open=f.style.display !== "none";
    f.style.display=open ? "none" : "block";
    setTextIfChanged(toggleProtocolBtn,open ? "Vyplnit protokol" : "Skrýt protokol");
    if(!open){
      initProtocolClientSignaturePad();
      if(typeof prefillProtocol==="function") prefillProtocol();
    }
  };
}


const editFindGpsBtn=document.getElementById("editFindGpsBtn");
if(editFindGpsBtn) editFindGpsBtn.onclick=recalcGpsForEditedAddress;
const editPickGpsBtn=document.getElementById("editPickGpsBtn");
if(editPickGpsBtn) editPickGpsBtn.onclick=startDetailManualGpsPick;
const newPickGpsBtn=document.getElementById("newPickGpsBtn");
if(newPickGpsBtn) newPickGpsBtn.onclick=startLegacyNewManualGpsPick;

const editGpsAddressEl=document.getElementById("editGpsAddress");
if(editGpsAddressEl){
  let gpsTimer=null;
  editGpsAddressEl.addEventListener("change",recalcGpsForEditedAddress);
  editGpsAddressEl.addEventListener("blur",recalcGpsForEditedAddress);
}

const editLastCheckEl=document.getElementById("editLastCheck");
if(editLastCheckEl) editLastCheckEl.addEventListener("change",recalcEditNextCheck);

const deleteSiteBtn=document.getElementById("deleteSiteBtn");
if(deleteSiteBtn) deleteSiteBtn.onclick=deleteSelectedSite;

document.getElementById("saveEditBtn").onclick=async()=>{
  const st=document.getElementById("editStatus");
  if(!firebaseReady){st.textContent="Firebase není nastavený.";return;}
  if(!currentUser){st.textContent="Nejdřív se přihlaš.";return;}
  if(!selectedSite){st.textContent="Není vybrané místo.";return;}
  const edit={
    name:document.getElementById("editName").value,
    contact:document.getElementById("editContact").value,
    source:document.getElementById("editSource").value,
    ordered:document.getElementById("editOrdered").checked,
    gpsAddress:document.getElementById("editGpsAddress").value,
    gpsLat:document.getElementById("editGpsLat").value,
    gpsLon:document.getElementById("editGpsLon").value,
    lastCheck:document.getElementById("editLastCheck").value,
    nextCheck:document.getElementById("editNextCheck").value,
    notes:document.getElementById("editNotes").value,
    updatedBy:currentUser.email,
    updatedAt:new Date().toISOString()
  };
  try{
    const selectedKey=detailKey(selectedSite) || selectedSite.id;
    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
    editCache[selectedKey]={...(editCache[selectedKey]||editCache[selectedSite.id]||{}),...edit};
    selectedSite=updateSingleSelectedRowAfterEdit(selectedKey,selectedSiteDocId(selectedSite),selectedSite,edit);
    render(); window.openDetailById(selectedKey);
    st.textContent="Úpravy uloženy.";
    showSaveConfirmation("Úpravy uloženy.");
  }catch(e){st.textContent="Chyba uložení: "+e.message;}
};
const serviceForm=document.getElementById("serviceForm");
if(serviceForm){
  serviceForm.addEventListener("submit",async e=>{
    e.preventDefault();
    const st=document.getElementById("formStatus");
    if(!firebaseReady){st.textContent="Firebase není nastavený.";return;}
    if(!currentUser){st.textContent="Nejdřív se přihlaš.";return;}
    if(!selectedSite){st.textContent="Není vybrané místo.";return;}
    if(!val("protoResetDiag")){
      st.textContent="Je nutné vyplnit pole Reset diagnostiky.";
      formFieldNode("protoResetDiag")?.focus();
      return;
    }

    try{
      const {collection,doc,setDoc,serverTimestamp}=fb.fsMod;
      const keys=siteRecordKeys(selectedSite);
      const serviceRef=doc(collection(db,"serviceRecords"));
      const servicePayload={_id:serviceRef.id,siteId:selectedSite.id,siteKey:keys[0] || selectedSite.id,siteKeys:keys,firebaseDocId:selectedSite.firebaseDocId || selectedSite.raw?.["Firebase_doc_id"] || "",sourceGroupKey:sitePlaceGroupKey(selectedSite),sourceIdentity:siteSourceIdentity(selectedSite),siteAddress:selectedSite.adresa,siteSource:selectedSite.zdroj,technician:val("technician"),technicianEmail:currentUser.email,checkDate:val("checkDate"),result:val("result"),issues:val("issues"),recommendation:val("recommendation"),photoLinks:val("photoLinks").split(/\n+/).map(x=>x.trim()).filter(Boolean),createdAt:new Date().toISOString()};
      const childOk=await saveSiteChildItem("serviceRecords",serviceRef.id,servicePayload,selectedSite);
      const embeddedOk=childOk ? true : await appendEmbeddedSiteItem("serviceHistory",servicePayload,selectedSite);
      await appendEmbeddedSiteItem("serviceRefs",{
        _id:servicePayload._id,
        siteId:servicePayload.siteId,
        siteKey:servicePayload.siteKey,
        firebaseDocId:servicePayload.firebaseDocId,
        checkDate:servicePayload.checkDate,
        createdAt:servicePayload.createdAt
      },selectedSite);
      try{
        await setDoc(serviceRef,{...servicePayload,createdAt:serverTimestamp()});
      }catch(e){
        console.warn("Samostatný servisní záznam se neuložil, používám zálohu v bodu",e);
        if(!embeddedOk) throw e;
      }
      st.textContent="Uloženo.";
      showSaveConfirmation("Servisní záznam uložen.");
      loadHistory(selectedSite.id);
    }catch(err){st.textContent="Chyba uložení: "+err.message;}
  });
}


function checkbox(id){return formFieldNode(id)?.checked || false;}
function val(id){return formFieldNode(id)?.value || "";}
function protocolStatusNode(){
  return formFieldNode("protocolStatus");
}
function setProtocolStatusText(text){
  setTextIfChanged(protocolStatusNode(),text);
}

let protoClientSignatureDirty=false;
function protocolSignatureCanvas(){
  return formFieldNode("protoClientSignaturePad");
}
function protocolSignaturePoint(e,canvas){
  const rect=canvas.getBoundingClientRect();
  return {
    x:(e.clientX-rect.left)*(canvas.width/rect.width),
    y:(e.clientY-rect.top)*(canvas.height/rect.height)
  };
}
function protocolSignatureContext(){
  const canvas=protocolSignatureCanvas();
  if(!canvas) return null;
  const ctx=canvas.getContext("2d");
  if(!ctx) return null;
  ctx.lineWidth=4;
  ctx.lineCap="round";
  ctx.lineJoin="round";
  ctx.strokeStyle="#0f172a";
  return ctx;
}
function clearProtocolClientSignature(){
  const canvas=protocolSignatureCanvas();
  const ctx=protocolSignatureContext();
  if(!canvas || !ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  protoClientSignatureDirty=false;
}
function initProtocolClientSignaturePad(){
  const canvas=protocolSignatureCanvas();
  if(!canvas) return;
  const ctx=protocolSignatureContext();
  if(!ctx) return;
  if(canvas.dataset.signatureReady==="1") return;
  canvas.dataset.signatureReady="1";
  let drawing=false;
  let last=null;
  const start=e=>{
    e.preventDefault();
    drawing=true;
    last=protocolSignaturePoint(e,canvas);
    ctx.beginPath();
    ctx.arc(last.x,last.y,2,0,Math.PI*2);
    ctx.fillStyle="#0f172a";
    ctx.fill();
    protoClientSignatureDirty=true;
    scheduleProtocolDraftSave();
    try{canvas.setPointerCapture(e.pointerId);}catch(_e){}
  };
  const move=e=>{
    if(!drawing || !last) return;
    e.preventDefault();
    const point=protocolSignaturePoint(e,canvas);
    ctx.beginPath();
    ctx.moveTo(last.x,last.y);
    ctx.lineTo(point.x,point.y);
    ctx.stroke();
    last=point;
    protoClientSignatureDirty=true;
    scheduleProtocolDraftSave();
  };
  const stop=e=>{
    if(!drawing) return;
    e.preventDefault();
    drawing=false;
    last=null;
    try{canvas.releasePointerCapture(e.pointerId);}catch(_e){}
  };
  canvas.addEventListener("pointerdown",start);
  canvas.addEventListener("pointermove",move);
  canvas.addEventListener("pointerup",stop);
  canvas.addEventListener("pointercancel",stop);
  canvas.addEventListener("pointerleave",stop);
  const clearBtn=formFieldNode("clearClientSignatureBtn");
  if(clearBtn) clearBtn.onclick=()=>{
    clearProtocolClientSignature();
    scheduleProtocolDraftSave();
  };
}
function protocolClientSignatureDataUrl(){
  const canvas=protocolSignatureCanvas();
  if(!canvas || !protoClientSignatureDirty) return "";
  try{return canvas.toDataURL("image/png");}catch(e){return "";}
}


function splitPossibleSources(text){
  const s=safe(text);
  if(!s) return [];
  return s
    .split(/\s*(?:\+|\||;|\n|\r| \/ |, (?=(?:UPS|zdroj|FZ|PBZ|typ|[A-Z0-9]{3,})))\s*/i)
    .map(x=>x.trim())
    .filter(Boolean);
}

function sourceOptionsFromSite(site){
  const raw=site?.raw || {};
  const candidates=[
    protocolDeviceTypeFromSite(site),
    get(raw,"Popis_zdroje"),
    get(raw,"Kontrolované zařízení"),
    get(raw,"Jaký zdroj"),
    get(raw,"Typ zařízení"),
    get(raw,"Typ"),
    get(raw,"Serviska")
  ].filter(Boolean);

  let out=[];
  candidates.forEach(c=>{
    const parts=splitPossibleSources(c);
    if(parts.length) out.push(...parts);
    else out.push(String(c).trim());
  });

  // unique, remove empty
  const seen=new Set();
  return out.filter(x=>{
    const k=x.toLowerCase();
    if(!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function populateProtocolDeviceSelect(){
  const oldWrap=formFieldNode("protocolDeviceSelectWrap");
  if(oldWrap) oldWrap.style.display="none";
  const inputWrap=formFieldNode("protoDeviceInputWrap");
  const selectWrap=formFieldNode("protoDeviceSelectWrap2");
  const select=formFieldNode("protoDeviceTypeSelect");
  const input=formFieldNode("protoDeviceType");
  if(!selectedSite || !input || !select) return;
  const rawSource=[
    protocolDeviceTypeFromSite(selectedSite),
    selectedSite?.raw?.["Jaký zdroj"],
    selectedSite?.raw?.["Popis_zdroje"],
    selectedSite?.raw?.["Kontrolované zařízení"],
    selectedSite?.raw?.["Typ zařízení"]
  ].filter(Boolean).join(" ");
  const hasPlus=rawSource.includes("+");
  const devices=hasPlus ? rawSource.split("+").map(x=>x.trim()).filter(Boolean) : sourceOptionsFromSite(selectedSite);
  const fragment=document.createDocumentFragment();
  const placeholder=document.createElement("option");
  placeholder.value="";
  placeholder.textContent="Vyber zařízení";
  fragment.appendChild(placeholder);
  devices.forEach((d,idx)=>{const o=document.createElement("option");o.value=d;o.textContent=d||`Zařízení ${idx+1}`;fragment.appendChild(o);});
  select.replaceChildren(fragment);
  if(hasPlus && devices.length>1){
    if(inputWrap) inputWrap.classList.add("hidden");
    if(selectWrap) selectWrap.classList.remove("hidden");
    input.value="";
  }else{
    if(inputWrap) inputWrap.classList.remove("hidden");
    if(selectWrap) selectWrap.classList.add("hidden");
    input.value=devices[0]||protocolDeviceTypeFromSite(selectedSite)||"";
  }
  updateProtocolSummary();
}

function resetProtocolTechnicalFieldsForNewDevice(){
  [
    "protoDeviceType","protoSerial","protoSeal","protoSeal2",
    "protoBatteryCount","protoCapacity","protoSetCount","protoAuxBatteryAh",
    "protoInputVac","protoOutput1Vac","protoOutput2Vac","protoBackup1Vac","protoBackup2Vac",
    "protoMainBatVdc","protoResetDiag","protoAuxBatVdc","protoUnbalance1","protoUnbalance2"
  ].forEach(id=>{
    const el=formFieldNode(id);
    if(el) el.value="";
  });

  const sel=formFieldNode("protoDeviceSelect");
  const type=formFieldNode("protoDeviceType");
  if(sel && sel.value && type) type.value=sel.value;
  updateProtocolSummary();
}

function pickRawValue(raw, names){
  for(const n of names){
    const v=safe(get(raw,n));
    if(v) return v;
  }
  return "";
}

function setIfEmpty(id,value){
  const el=formFieldNode(id);
  if(!el) return;
  if(!safe(el.value) && safe(value)) el.value=value;
}

function setCheckbox(id,value){
  const el=formFieldNode(id);
  if(!el) return;
  el.checked = value === true || String(value).toLowerCase()==="true" || String(value).toLowerCase()==="ano";
}

function protocolDeviceTypeFromSite(site){
  const raw=site?.raw || {};
  const explicit=pickRawValue(raw,[
    "Popis_zdroje","Jaký zdroj","Kontrolované zařízení","Kontrolované zařízení – typ",
    "Kontrolovane zarizeni","Typ zařízení","Typ zarizeni","Typ","Serviska"
  ]);
  if(explicit) return explicit;

  const source=safe(site?.zdroj);
  const serial=protocolSerialFromSite(site);
  if(source && dataNormFixed(source)!==dataNormFixed(serial)) return source;
  return "";
}

function protocolSerialFromSite(site){
  const raw=site?.raw || {};
  return pickRawValue(raw,[
    "Výrobní č.","Výrobní číslo","Výrobní_číslo","Vyrobni cislo",
    "Sériové číslo","Seriové číslo","Serial","SN","Zdroj"
  ]);
}

function protocolSourceLocationFromSite(site){
  const raw=site?.raw || {};
  return pickRawValue(raw,[
    "Umístění zdroje","Umístění_zdroje","Umístění","Umisteni",
    "Adresa_GPS","Adresa / umístění"
  ]);
}

const protocolSummaryNodeCache={};
function protocolSummaryNode(id){
  const cached=protocolSummaryNodeCache[id];
  if(cached && cached.isConnected) return cached;
  const el=document.getElementById(id);
  if(el) protocolSummaryNodeCache[id]=el;
  return el;
}

function updateProtocolSummary(){
  const set=(id,value)=>{
    setTextIfChanged(protocolSummaryNode(id),safe(value) || "-");
  };
  set("protoSummaryAddress", val("protoPlace"));
  set("protoSummaryDevice", val("protoDeviceTypeSelect") || val("protoDeviceType") || val("protoDeviceSelect"));
  set("protoSummarySerial", val("protoSerial"));
  set("protoSummaryLocation", val("protoPbzLocation"));
  set("protoSummaryPeriod", val("protoPeriod"));
}

let protocolPrefillSiteId="";

function resetProtocolFormForSelectedSite(siteId){
  const key=String(siteId || "");
  clearProtocolEditState();
  const form=formFieldNode("protocolForm");
  if(form) form.reset();
  clearProtocolClientSignature();
  protocolPrefillSiteId=key;
}

function closeProtocolFormAfterSave(){
  const form=formFieldNode("protocolForm");
  if(form){
    form.reset();
    form.style.display="none";
  }
  clearProtocolEditState();
  clearProtocolClientSignature();
  protocolPrefillSiteId="";
  updateProtocolSummary();
  setTextIfChanged(formFieldNode("toggleProtocolBtn"),"Vyplnit protokol");
}

function fileBaseName(name){
  return safe(name || "fotografie").replace(/\.[^.]+$/,"") || "fotografie";
}

function photoFileName(item,idx=0){
  const base=fileBaseName(item?.fileName || item?.originalFileName || `fotografie-${idx+1}`)
    .replace(/[^\p{L}\p{N}_-]+/gu,"_")
    .replace(/^_+|_+$/g,"")
    .slice(0,70) || `fotografie-${idx+1}`;
  return `${base}.jpg`;
}

const photoUrlBundleCache=new WeakMap();
function photoUrlFingerprint(item){
  if(!item || (typeof item!=="object" && typeof item!=="function")) return "";
  return [
    item.displayUrl,
    item.url,
    item.fullUrl,
    item.originalUrl,
    item.downloadUrl,
    item.dataUrl,
    item.thumbUrl,
    item.previewUrl,
    item.thumbnailUrl
  ].map(safe).join("\u001f");
}
function computePhotoDisplayUrl(item){
  const explicit=safe(item && (item.displayUrl || item.url));
  if(explicit) return cloudinaryTransformUrl(explicit,"f_auto,q_auto,w_1600,c_limit");
  const original=safe(item && (item.fullUrl || item.originalUrl || item.downloadUrl));
  if(original) return cloudinaryTransformUrl(original,"f_auto,q_auto,w_1600,c_limit");
  return safe(item && item.dataUrl);
}

function computePhotoFullUrl(item){
  return safe(item && (item.fullUrl || item.originalUrl || item.downloadUrl || item.url || item.displayUrl || item.dataUrl));
}

function computePhotoThumbUrl(item,displayUrl=""){
  const original=safe(item && (item.fullUrl || item.originalUrl || item.downloadUrl));
  if(original) return cloudinaryTransformUrl(original,"f_auto,q_auto,w_240,c_limit");
  const explicit=safe(item && (item.thumbUrl || item.previewUrl || item.thumbnailUrl));
  const fallback=displayUrl || computePhotoDisplayUrl(item);
  return cloudinaryTransformUrl(explicit || fallback,"f_auto,q_auto,w_240,c_limit");
}

function photoUrlBundle(item){
  const canCache=!!(item && (typeof item==="object" || typeof item==="function"));
  const fingerprint=canCache ? photoUrlFingerprint(item) : "";
  if(canCache && fingerprint){
    const cached=photoUrlBundleCache.get(item);
    if(cached && cached.fingerprint===fingerprint) return cached.urls;
  }
  const display=computePhotoDisplayUrl(item);
  const full=computePhotoFullUrl(item);
  const thumb=computePhotoThumbUrl(item,display);
  const urls={display,full,thumb};
  if(canCache && fingerprint) photoUrlBundleCache.set(item,{fingerprint,urls});
  return urls;
}

function photoDisplayUrl(item){
  return photoUrlBundle(item).display;
}

function photoFullUrl(item){
  return photoUrlBundle(item).full;
}

function photoThumbUrl(item){
  return photoUrlBundle(item).thumb;
}

function bytesLabel(bytes){
  const n=Number(bytes || 0);
  if(!Number.isFinite(n) || n<=0) return "";
  if(n<1024) return `${Math.round(n)} B`;
  if(n<1024*1024) return `${Math.round(n/1024)} kB`;
  return `${(n/1024/1024).toFixed(1).replace(".",",")} MB`;
}

const photoRenderMetaCache=new WeakMap();
function photoRenderMetaFingerprint(item,idx=0){
  if(!item || (typeof item!=="object" && typeof item!=="function")) return "";
  return [
    idx,
    isAppAdmin() ? "admin" : "user",
    item.createdAt,
    item.uploadedAt,
    item.date,
    item.takenAt,
    item.photoTakenAt,
    item.lastModifiedAt,
    item.cloudinaryVersion,
    item.version,
    item.storageMode,
    item.size,
    item.originalSize,
    item.uploadedBy,
    item.createdBy,
    item.ownerEmail,
    item.fileName,
    item.originalFileName,
    item.photoFolder,
    item.folderName,
    item.folder,
    item.cloudinaryFolderDate,
    item.cloudinaryFolder
  ].map(safe).join("\u001f");
}

function photoRenderMeta(item,idx=0){
  const canCache=!!(item && (typeof item==="object" || typeof item==="function"));
  const fingerprint=canCache ? photoRenderMetaFingerprint(item,idx) : "";
  if(canCache && fingerprint){
    const cached=photoRenderMetaCache.get(item);
    if(cached && cached.fingerprint===fingerprint) return cached.value;
  }
  const modeLabel=item.storageMode==="cloudinary" ? "Cloudinary" : (item.storageMode==="offline" ? "lokálně v tomto zařízení" : "starší záznam");
  const insertedAt=photoDateLabel(item);
  const meta=[insertedAt ? `Vloženo: ${insertedAt}` : "", modeLabel, bytesLabel(item.size), item.uploadedBy].filter(Boolean).join(" · ");
  const takenAt=photoTakenLabel(item) || "není uvedeno";
  const insertedAtFull=photoInsertedLabel(item) || "datum není uložené";
  const uploadedBy=safe(item.uploadedBy || item.createdBy || item.ownerEmail) || "není uvedeno";
  const currentFolder=photoFolderName(item);
  const value={
    modeLabel,
    insertedAt,
    meta,
    takenAt,
    insertedAtFull,
    uploadedBy,
    currentFolder,
    downloadName:photoFileName(item,idx),
    photoInfoRows:[
      ["Přidáno", insertedAtFull],
      ["Složka", currentFolder || "Bez data"],
      ["Uložil", uploadedBy],
      ["Pořízeno", takenAt],
      ["Velikost", bytesLabel(item.size || item.originalSize) || "není uvedeno"]
    ]
  };
  if(canCache && fingerprint) photoRenderMetaCache.set(item,{fingerprint,value});
  return value;
}

function canDeleteSitePhotoForUser(item,email=currentUserEmail(),isAdminValue=isAppAdmin()){
  if(item && (item.storageMode==="offline" || item._offline === true)) return true;
  const uploadedBy=safe(item && item.uploadedBy).toLowerCase();
  const userEmail=safe(email).toLowerCase();
  return !!isAdminValue || (!!uploadedBy && uploadedBy===userEmail);
}

function canDeleteSitePhoto(item){
  return canDeleteSitePhotoForUser(item);
}

const CLOUDINARY_TRANSFORM_URL_CACHE_LIMIT=800;
const cloudinaryTransformUrlCache=new Map();
function rememberCloudinaryTransformUrl(cacheKey,value){
  cloudinaryTransformUrlCache.set(cacheKey,value);
  if(cloudinaryTransformUrlCache.size>CLOUDINARY_TRANSFORM_URL_CACHE_LIMIT){
    const firstKey=cloudinaryTransformUrlCache.keys().next().value;
    if(firstKey) cloudinaryTransformUrlCache.delete(firstKey);
  }
  return value;
}

function cloudinaryTransformUrl(url,transformation){
  const s=safe(url);
  const t=safe(transformation);
  if(!s || !t || !s.includes("/image/upload/")) return s;
  if(s.includes(`/image/upload/${t}/`)) return s;
  const cacheKey=`${t}|${s}`;
  const cached=cloudinaryTransformUrlCache.get(cacheKey);
  if(cached) return cached;
  const marker="/image/upload/";
  const markerIndex=s.indexOf(marker);
  const prefix=s.slice(0,markerIndex+marker.length);
  const rest=s.slice(markerIndex+marker.length);
  const slashIndex=rest.indexOf("/");
  if(slashIndex<0) return s;
  const firstSegment=rest.slice(0,slashIndex);
  const remaining=rest.slice(slashIndex+1);
  const firstSegmentIsVersion=/^v\d+$/i.test(firstSegment);
  const firstSegmentLooksTransform=/(^|,)(?:f_auto|q_auto|w_\d+|h_\d+|c_[a-z0-9_]+|dpr_|fl_|e_|g_|r_|ar_)/i.test(firstSegment);
  const transformed=firstSegmentLooksTransform && !firstSegmentIsVersion
    ? `${prefix}${t}/${remaining}`
    : `${prefix}${t}/${rest}`;
  return rememberCloudinaryTransformUrl(cacheKey,transformed);
}

let photoUploadModulePromise=null;
function photoUploadModule(){
  if(!photoUploadModulePromise) photoUploadModulePromise=import("./photo-upload.js");
  return photoUploadModulePromise;
}

async function prepareCloudinaryUploadFile(file){
  const mod=await photoUploadModule();
  return mod.prepareCloudinaryUploadFile(file);
}

async function prepareOfflinePhotoData(file){
  const mod=await photoUploadModule();
  return mod.prepareOfflinePhotoData(file);
}

async function uploadPhotoToCloudinary(photoId,file,site=selectedSite,folderName=""){
  const mod=await photoUploadModule();
  return mod.uploadPhotoToCloudinary({photoId,file,site,folderName,config:CLOUDINARY_PHOTOS});
}

async function deleteCloudinaryUpload(item){
  const token=safe((item && item.cloudinaryDeleteToken) || sitePhotoDeleteTokens.get(safe(item && item._id)));
  if(!token || !CLOUDINARY_PHOTOS.cloudName) return;
  const mod=await photoUploadModule();
  await mod.deleteCloudinaryUpload({token,config:CLOUDINARY_PHOTOS});
}

let sitePhotoPreviewUrls=[];
let sitePhotoItems=[];
let sitePhotoIndex=0;
let sitePhotoRenderSignature="";
let sitePhotoDeleteTokens=new Map();
const LOCAL_PHOTO_DB_NAME="astipMapLocalPhotos";
const LOCAL_PHOTO_STORE="photos";

function openLocalPhotoDb(){
  return new Promise((resolve,reject)=>{
    if(!("indexedDB" in window)){
      reject(new Error("IndexedDB není v prohlížeči dostupné."));
      return;
    }
    const req=indexedDB.open(LOCAL_PHOTO_DB_NAME,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(LOCAL_PHOTO_STORE)){
        const store=db.createObjectStore(LOCAL_PHOTO_STORE,{keyPath:"_id"});
        store.createIndex("siteCacheKey","siteCacheKey",{unique:false});
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error || new Error("Lokální databázi fotek se nepodařilo otevřít."));
  });
}

async function withLocalPhotoStore(mode,callback){
  const db=await openLocalPhotoDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(LOCAL_PHOTO_STORE,mode);
    const store=tx.objectStore(LOCAL_PHOTO_STORE);
    let result;
    tx.oncomplete=()=>{db.close();resolve(result);};
    tx.onerror=()=>{db.close();reject(tx.error || new Error("Lokální databáze fotek selhala."));};
    try{
      callback(store,value=>{result=value;});
    }catch(e){
      db.close();
      reject(e);
    }
  });
}

async function saveOfflinePhotoItem(item,site=selectedSite){
  const payload={...item,siteCacheKey:siteLocalCacheKey("photos",site)};
  try{
    await withLocalPhotoStore("readwrite",(store)=>{store.put(payload);});
  }catch(e){
    appendSiteLocalArray("offlinePhotos",payload,site,50);
  }
  invalidateOfflinePhotoCountCache();
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  if(window.registerSzzBackgroundSync) window.registerSzzBackgroundSync("photo");
  return payload;
}

async function readOfflinePhotoItems(site=selectedSite){
  const cacheKey=siteLocalCacheKey("photos",site);
  const fallback=readSiteLocalArray("offlinePhotos",site);
  try{
    const items=await withLocalPhotoStore("readonly",(store,setResult)=>{
      const req=store.index("siteCacheKey").getAll(cacheKey);
      req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
      req.onerror=()=>setResult([]);
    });
    const all=[...(items || []),...fallback];
    const seen=new Set();
    return all.filter(item=>{
      const id=safe(item && item._id);
      if(id && seen.has(id)) return false;
      if(id) seen.add(id);
      return !!photoDisplayUrl(item);
    });
  }catch(e){
    return fallback.filter(item=>!!photoDisplayUrl(item));
  }
}

async function removeOfflinePhotoItem(id,site=selectedSite,sourceItem=null){
  const cleanId=safe(id);
  if(!cleanId) return;
  try{
    await withLocalPhotoStore("readwrite",(store)=>{store.delete(cleanId);});
  }catch(e){}
  removeSiteLocalItem("offlinePhotos",cleanId,site);
  const explicitCacheKey=safe(sourceItem && sourceItem.siteCacheKey);
  if(explicitCacheKey){
    removeLocalStorageArrayItemByKey(explicitCacheKey.replace("astipMap:photos:","astipMap:offlinePhotos:"),cleanId);
  }
  invalidateOfflinePhotoCountCache();
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
}

async function readAllOfflinePhotoItems(){
  const fallback=[];
  localStorageArrayEntries("astipMap:offlinePhotos:").forEach(entry=>{
    const siteCacheKey=entry.key.replace("astipMap:offlinePhotos:","astipMap:photos:");
    entry.items.forEach(item=>{
      if(item) fallback.push({...item,siteCacheKey:item.siteCacheKey || siteCacheKey});
    });
  });
  let indexed=[];
  try{
    indexed=await withLocalPhotoStore("readonly",(store,setResult)=>{
      const req=store.getAll();
      req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
      req.onerror=()=>setResult([]);
    });
  }catch(e){}
  const seen=new Set();
  return [...(indexed || []),...fallback]
    .filter(item=>item && (item._offline || item.storageMode==="offline" || item.localOnly))
    .filter(item=>{
      const id=safe(item._id);
      if(id && seen.has(id)) return false;
      if(id) seen.add(id);
      return !!photoDisplayUrl(item);
    });
}

function siteCacheSuffixFromPhoto(item){
  const key=safe(item && item.siteCacheKey);
  return key.startsWith("astipMap:photos:") ? key.slice("astipMap:photos:".length) : "";
}

async function offlinePhotoFileFromItem(item){
  const dataUrl=safe(item && (item.fullUrl || item.displayUrl || item.url || item.thumbUrl));
  if(!dataUrl || !dataUrl.startsWith("data:")){
    throw new Error("Lokální fotka nemá uložená obrazová data.");
  }
  const response=await fetch(dataUrl);
  const blob=await response.blob();
  const fileName=photoFileName(item || {},0);
  return new File([blob],fileName,{type:blob.type || item.type || "image/jpeg",lastModified:Date.parse(item.takenAt || item.createdAt || "") || Date.now()});
}

let offlinePhotoSyncRunning=false;

async function syncOfflinePhotos(options={}){
  if(offlinePhotoSyncRunning) return 0;
  if(!firebaseReady || !db || !fb.fsMod || navigator.onLine===false) return 0;
  const signedUser=await waitForFirebaseUser(3000);
  if(!signedUser) return 0;
  const offlineItems=await readAllOfflinePhotoItems();
  if(!offlineItems.length) return 0;
  offlinePhotoSyncRunning=true;
  let synced=0;
  let failed=0;
  try{
    for(const item of offlineItems){
      const id=safe(item._id) || makeLocalRecordId("photo");
      const site=siteFromOfflineRecord(item,siteCacheSuffixFromPhoto(item));
      try{
        if(!site || !selectedSiteDocId(site)){
          throw new Error("K fotce nejde najít Firebase bod.");
        }
        const folderName=photoFolderName(item) || photoFolderNameForDate(item.createdAt || new Date());
        const uploadFile=await offlinePhotoFileFromItem({...item,_id:id});
        const cloudinaryResult=await uploadPhotoToCloudinary(id,uploadFile,site,folderName);
        const syncedAt=new Date().toISOString();
        const payload={
          ...item,
          _id:id,
          url:cloudinaryResult.url,
          displayUrl:cloudinaryResult.displayUrl,
          fullUrl:cloudinaryResult.fullUrl,
          thumbUrl:cloudinaryResult.thumbUrl,
          storageMode:"cloudinary",
          _offline:false,
          _syncStatus:"online",
          localOnly:false,
          offlineReason:"",
          syncedAt,
          syncedBy:signedUser.email || currentUserEmail(),
          uploadedBy:item.uploadedBy || signedUser.email || currentUserEmail(),
          photoFolder:folderName,
          folderName,
          folder:folderName,
          cloudinaryFolderDate:folderName,
          cloudinaryPublicId:cloudinaryResult.cloudinaryPublicId,
          cloudinaryAssetId:cloudinaryResult.cloudinaryAssetId,
          cloudinaryVersion:cloudinaryResult.cloudinaryVersion,
          cloudinaryUploadPreset:cloudinaryResult.cloudinaryUploadPreset,
          cloudinaryFolder:cloudinaryResult.cloudinaryFolder || cloudinaryPhotoFolderPath(folderName),
          size:uploadFile.size || item.size || item.originalSize || 0
        };
        const childOk=await saveSiteChildItem("photos",id,payload,site);
        const embeddedOk=childOk ? true : await appendEmbeddedSiteItem("photos",payload,site);
        if(!childOk && !embeddedOk) throw new Error("Firebase nepovolil uložit odkaz k bodu.");
        appendSiteLocalArray("photos",payload,site,0);
        await removeOfflinePhotoItem(id,site,item);
        if(selectedSite && recordMatchesSite(payload,selectedSite)){
          sitePhotoItems=[payload,...sitePhotoItems.filter(photo=>safe(photo._id)!==id)];
          renderSitePhotos(sitePhotoItems,true);
        }
        synced++;
      }catch(e){
        failed++;
        console.warn("Synchronizace offline fotografie selhala",id,e);
      }
    }
  }finally{
    offlinePhotoSyncRunning=false;
  }
  if(synced && !options.silent){
    showSaveConfirmation(synced===1 ? "Offline fotografie uložena online." : `Offline fotografie uloženy online: ${synced}.`);
  }
  if(failed && !options.silent){
    const st=document.getElementById("sitePhotosStatus");
    if(st) st.textContent=`Některé offline fotografie ještě čekají na synchronizaci: ${failed}.`;
  }
  if((synced || failed) && window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  return synced;
}
window.syncOfflinePhotos=syncOfflinePhotos;

let offlineSyncRunning=false;
let offlineSyncLastStarted=0;

async function syncOfflineChanges(options={}){
  if(offlineSyncRunning) return 0;
  if(navigator.onLine===false) return 0;
  const now=Date.now();
  if(!options.force && now-offlineSyncLastStarted<2500) return 0;
  if(!firebaseReady || !db || !fb.fsMod) return 0;
  const signedUser=await waitForFirebaseUser(3000);
  if(!signedUser) return 0;
  offlineSyncRunning=true;
  offlineSyncLastStarted=now;
  if(window.noteSzzSyncState) window.noteSzzSyncState("syncing",{reason:options.reason || "auto"});
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(20);
  let siteCount=0;
  let protocolCount=0;
  let photoCount=0;
  try{
    const p=document.getElementById("progress");
    if(p && !options.silent) p.textContent="Synchronizuji offline změny...";
    if(typeof window.syncOfflineSites==="function"){
      siteCount=await window.syncOfflineSites({silent:true});
    }
    protocolCount=await syncAllOfflineProtocols({silent:true});
    photoCount=await syncOfflinePhotos({silent:true});
    const total=siteCount+protocolCount+photoCount;
    if(total){
      if(selectedSite){
        try{ window.refreshLoadedDetailTabs?.(selectedSite); }catch(e){}
      }
      if(!options.silent){
        showSaveConfirmation(`Offline změny odeslány online: ${total}.`);
      }
    }
    if(window.noteSzzSyncState) window.noteSzzSyncState("ok",{lastCount:total,reason:options.reason || "auto"});
    if(p && !options.silent) p.textContent="";
    return total;
  }catch(e){
    console.warn("Synchronizace offline změn selhala",e);
    if(window.noteSzzSyncState) window.noteSzzSyncState("error",{lastError:e && (e.message || e.code) || String(e),reason:options.reason || "auto"});
    const p=document.getElementById("progress");
    if(p && !options.silent) p.textContent="Offline změny zůstaly uložené lokálně a zkusí se odeslat později.";
    return protocolCount+photoCount;
  }finally{
    offlineSyncRunning=false;
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  }
}
window.syncOfflineChanges=syncOfflineChanges;

const SZZ_SYNC_STATE_KEY="astipSzzSyncState:v1";
const SZZ_LEGACY_OFFLINE_SITE_QUEUE_KEY="astipMap:offlineSites:v1";
let szzOfflineStatusTimer=0;
let szzOfflineStatusRun=0;
const SZZ_OFFLINE_COUNTS_CACHE_MS=1200;
let szzOfflineCountsCache=null;
let szzOfflineCountsCacheAt=0;
const SZZ_LEGACY_OFFLINE_SITE_COUNT_CACHE_MS=1800;
let szzLegacyOfflineSiteCountCache={raw:null,count:0,savedAt:0};
const OFFLINE_SITE_COUNT_CACHE_MS=1800;
let offlineSiteCountCache={count:null,savedAt:0,storageLength:-1};
const OFFLINE_PHOTO_COUNT_CACHE_MS=1800;
let offlinePhotoCountCache={count:null,savedAt:0,storageLength:-1};

function cloneSzzOfflineCounts(counts){
  return counts ? {...counts} : counts;
}

function invalidateSzzOfflineCountsCache(){
  szzOfflineCountsCache=null;
  szzOfflineCountsCacheAt=0;
}
window.invalidateSzzOfflineCountsCache=invalidateSzzOfflineCountsCache;
function invalidateOfflineSiteCountCache(){
  offlineSiteCountCache={count:null,savedAt:0,storageLength:-1};
  szzLegacyOfflineSiteCountCache={raw:null,count:0,savedAt:0};
  invalidateSzzOfflineCountsCache();
}
function invalidateOfflinePhotoCountCache(){
  offlinePhotoCountCache={count:null,savedAt:0,storageLength:-1};
  invalidateSzzOfflineCountsCache();
}
window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_LEGACY_OFFLINE_SITE_QUEUE_KEY){
    invalidateOfflineSiteCountCache();
  }
  if(!event.key || event.key.startsWith("astipMap:offlinePhotos:")){
    invalidateOfflinePhotoCountCache();
  }
});

function readSzzSyncState(){
  return readSzzLocalStateObject(SZZ_SYNC_STATE_KEY);
}

function writeSzzSyncState(update={}){
  try{
    const next={...readSzzSyncState(),...update,updatedAt:new Date().toISOString()};
    return writeSzzLocalStateObject(SZZ_SYNC_STATE_KEY,next);
  }catch(e){
    return {...update};
  }
}

function noteSzzSyncState(status,details={}){
  const nowIso=new Date().toISOString();
  if(status==="syncing"){
    return writeSzzSyncState({
      status:"syncing",
      lastReason:details.reason || "",
      syncStartedAt:nowIso,
      lastError:""
    });
  }
  if(status==="error"){
    return writeSzzSyncState({
      status:"error",
      lastReason:details.reason || "",
      lastError:safe(details.lastError || "Synchronizace selhala."),
      lastFailedAt:nowIso
    });
  }
  return writeSzzSyncState({
    status:"ok",
    lastReason:details.reason || "",
    lastCount:Number(details.lastCount) || 0,
    lastSyncedAt:nowIso,
    lastError:""
  });
}
window.noteSzzSyncState=noteSzzSyncState;

async function readPendingOfflineSitesCount(){
  const now=Date.now();
  if(
    offlineSiteCountCache.count!==null &&
    offlineSiteCountCache.storageLength===localStorage.length &&
    now-offlineSiteCountCache.savedAt<OFFLINE_SITE_COUNT_CACHE_MS
  ){
    return offlineSiteCountCache.count;
  }
  const remember=count=>{
    offlineSiteCountCache={count:Number(count) || 0,savedAt:Date.now(),storageLength:localStorage.length};
    return offlineSiteCountCache.count;
  };
  try{
    const indexedItems=await readOfflineSiteQueueItems();
    if(indexedItems.length) return remember(uniqueByOfflineId(indexedItems,"docId").length);
    const raw=localStorage.getItem(SZZ_LEGACY_OFFLINE_SITE_QUEUE_KEY) || "";
    if(szzLegacyOfflineSiteCountCache.raw===raw && Date.now()-szzLegacyOfflineSiteCountCache.savedAt<SZZ_LEGACY_OFFLINE_SITE_COUNT_CACHE_MS){
      return remember(szzLegacyOfflineSiteCountCache.count);
    }
    const items=JSON.parse(raw || "[]");
    const localItems=Array.isArray(items) ? items.filter(item=>item && item.docId && item.raw) : [];
    const count=uniqueByOfflineId(localItems,"docId").length;
    szzLegacyOfflineSiteCountCache={raw,count,savedAt:Date.now()};
    return remember(count);
  }catch(e){
    return remember(0);
  }
}

async function readPendingOfflineProtocolCount(){
  const now=Date.now();
  if(
    offlineProtocolCountCache.count!==null &&
    offlineProtocolCountCache.storageLength===localStorage.length &&
    now-offlineProtocolCountCache.savedAt<OFFLINE_PROTOCOL_COUNT_CACHE_MS
  ){
    return offlineProtocolCountCache.count;
  }
  const remember=count=>{
    offlineProtocolCountCache={count:Number(count) || 0,savedAt:Date.now(),storageLength:localStorage.length};
    return offlineProtocolCountCache.count;
  };
  try{
    const indexedItems=await readAllOfflineProtocolQueueItems();
    if(indexedItems.length) return remember(uniqueByOfflineId(indexedItems).length);
    const localItems=[];
    localStorageArrayEntries("astipMap:protocolHistory:").forEach(entry=>{
      entry.items
        .filter(item=>item && item._offline && item._syncStatus!=="online")
        .forEach(item=>localItems.push(item));
    });
    return remember(uniqueByOfflineId(localItems).length);
  }catch(e){}
  return remember(0);
}

async function readProtocolDraftCount(){
  const now=Date.now();
  if(
    protocolDraftCountCache!==null
    && protocolDraftCountStorageLength===localStorage.length
    && now-protocolDraftCountCacheAt<PROTOCOL_DRAFT_COUNT_CACHE_MS
  ){
    return protocolDraftCountCache;
  }
  try{
    const indexedCount=await withSzzOfflineQueueStore(SZZ_PROTOCOL_DRAFT_STORE,"readonly",(store,setResult)=>{
      const req=store.count();
      req.onsuccess=()=>setResult(Number(req.result) || 0);
      req.onerror=()=>setResult(0);
    });
    if(indexedCount){
      protocolDraftCountCache=indexedCount;
      protocolDraftCountCacheAt=Date.now();
      protocolDraftCountStorageLength=localStorage.length;
      return indexedCount;
    }
  }catch(e){}
  let count=0;
  try{
    localStorageObjectEntries("astipMap:protocolDraft:").forEach(entry=>{
      if(entry && entry.item && entry.item.payload) count++;
    });
  }catch(e){}
  protocolDraftCountCache=count;
  protocolDraftCountCacheAt=Date.now();
  protocolDraftCountStorageLength=localStorage.length;
  return count;
}

async function readPendingOfflinePhotoCount(){
  const now=Date.now();
  if(
    offlinePhotoCountCache.count!==null &&
    offlinePhotoCountCache.storageLength===localStorage.length &&
    now-offlinePhotoCountCache.savedAt<OFFLINE_PHOTO_COUNT_CACHE_MS
  ){
    return offlinePhotoCountCache.count;
  }
  const remember=count=>{
    offlinePhotoCountCache={count:Number(count) || 0,savedAt:Date.now(),storageLength:localStorage.length};
    return offlinePhotoCountCache.count;
  };
  if(typeof readAllOfflinePhotoItems==="function"){
    try{return remember((await readAllOfflinePhotoItems()).length);}catch(e){}
  }
  let count=0;
  try{
    localStorageArrayEntries("astipMap:offlinePhotos:").forEach(entry=>{
      count+=entry.items.filter(item=>item && (item._offline || item.storageMode==="offline" || item.localOnly)).length;
    });
  }catch(e){}
  return remember(count);
}

async function collectSzzOfflineCounts(){
  const now=Date.now();
  if(szzOfflineCountsCache && now-szzOfflineCountsCacheAt<SZZ_OFFLINE_COUNTS_CACHE_MS){
    return cloneSzzOfflineCounts(szzOfflineCountsCache);
  }
  const ready=readSzzOfflineReadyState();
  const [sites,protocols,photos,drafts,storage,estimate]=await Promise.all([
    readPendingOfflineSitesCount(),
    readPendingOfflineProtocolCount(),
    readPendingOfflinePhotoCount(),
    readProtocolDraftCount(),
    requestSzzPersistentStorage({request:false}),
    szzStorageEstimate()
  ]);
  const counts={
    sites,
    protocols,
    photos,
    drafts,
    cachedRows:readCachedFirebaseSiteCount(),
    persistentStorage:!!(storage.persisted || ready.persistentStorage),
    storageSupported:!!(storage.supported || ready.persistentStorageSupported),
    storageUsage:estimate ? estimate.usage : (Number(ready.storageUsage) || 0),
    storageQuota:estimate ? estimate.quota : (Number(ready.storageQuota) || 0),
    preparedAt:ready.preparedAt || "",
    pending:sites+protocols+photos
  };
  szzOfflineCountsCache=counts;
  szzOfflineCountsCacheAt=Date.now();
  return cloneSzzOfflineCounts(counts);
}

function szzSyncTimeLabel(value){
  const raw=safe(value);
  if(!raw) return "zatím neproběhla";
  const date=new Date(raw);
  if(Number.isNaN(date.getTime())) return raw;
  const diff=Math.max(0,Date.now()-date.getTime());
  if(diff<45000) return "před chvílí";
  if(diff<3600000) return `před ${Math.max(1,Math.round(diff/60000))} min`;
  if(diff<86400000) return `před ${Math.max(1,Math.round(diff/3600000))} h`;
  return date.toLocaleString("cs-CZ",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
}

const szzOfflineStatusNodeCache={};
function szzOfflineStatusNode(id){
  const cached=szzOfflineStatusNodeCache[id];
  if(cached && cached.isConnected) return cached;
  const el=document.getElementById(id);
  if(el) szzOfflineStatusNodeCache[id]=el;
  return el;
}

function renderSzzOfflineAppStatus(counts){
  const card=szzOfflineStatusNode("appSyncCard");
  if(!card) return;
  const state=readSzzSyncState();
  const online=navigator.onLine!==false;
  const pending=Number(counts?.pending) || 0;
  const drafts=Number(counts?.drafts) || 0;
  const syncing=state.status==="syncing" && Date.now()-new Date(state.syncStartedAt || 0).getTime()<45000;
  const dot=szzOfflineStatusNode("appConnectionDot");
  const label=szzOfflineStatusNode("appConnectionLabel");
  const text=szzOfflineStatusNode("appSyncText");
  const meta=szzOfflineStatusNode("appSyncMeta");
  const syncBtn=szzOfflineStatusNode("syncNowBtn");
  const setCount=(id,value)=>{
    setTextIfChanged(szzOfflineStatusNode(id),String(value || 0));
  };
  setCount("pendingSitesCount",counts?.sites);
  setCount("pendingProtocolsCount",counts?.protocols);
  setCount("pendingPhotosCount",counts?.photos);
  setCount("pendingDraftsCount",drafts);
  if(dot){
    dot.classList.toggle("offline",!online || pending>0);
    dot.classList.toggle("error",state.status==="error" && pending>0 && online);
  }
  if(card) card.classList.toggle("syncing",syncing);
  if(label){
    const message=!online
      ? "Offline režim"
      : syncing
        ? "Synchronizuji změny"
        : pending
          ? "Čeká na synchronizaci"
          : drafts
            ? "Jsou uložené koncepty"
            : "Synchronizováno";
    setTextIfChanged(label,message);
  }
  if(text){
    const message=!online
      ? "Práce se ukládá do telefonu. Po připojení se odešle do webu."
      : syncing
        ? "Odesílám lokální změny do Firebase a Cloudinary."
        : pending
          ? `V telefonu čeká ${pending} změn k odeslání.`
          : drafts
            ? "Rozepsané protokoly jsou uložené lokálně, odešlou se po uložení formuláře."
            : "Všechny uložené změny jsou spárované s webem.";
    setTextIfChanged(text,message);
  }
  if(meta){
    const last=szzSyncTimeLabel(state.lastSyncedAt);
    const lastCount=Number(state.lastCount) || 0;
    const error=safe(state.lastError);
    const cachedRows=Number(counts?.cachedRows) || 0;
    const usageLabel=szzBytesLabel(counts?.storageUsage);
    const storageLabel=counts?.persistentStorage ? "úložiště trvalé" : (counts?.storageSupported ? "úložiště běžné" : "úložiště nezjištěno");
    const offlineLabel=cachedRows ? `Offline data: ${cachedRows} bodů, ${storageLabel}${usageLabel ? `, ${usageLabel}` : ""}.` : `Offline data: ${storageLabel}.`;
    const message=error && pending
      ? `Poslední chyba: ${error}`
      : `Poslední synchronizace: ${last}${lastCount ? `, odesláno ${lastCount}` : ""}. ${offlineLabel}`;
    setTextIfChanged(meta,message);
  }
  if(syncBtn){
    const disabled=syncing || !online || !pending;
    if(syncBtn.disabled!==disabled) syncBtn.disabled=disabled;
    setTextIfChanged(syncBtn,syncing ? "Synchronizuji..." : "Synchronizovat teď");
  }
}

async function updateSzzOfflineAppStatus(options={}){
  if(options && options.force) invalidateSzzOfflineCountsCache();
  const runId=++szzOfflineStatusRun;
  const counts=await collectSzzOfflineCounts();
  if(runId!==szzOfflineStatusRun) return counts;
  window.__szzOfflineCounts=counts;
  renderSzzOfflineAppStatus(counts);
  return counts;
}
window.updateSzzOfflineAppStatus=updateSzzOfflineAppStatus;

function scheduleSzzOfflineAppStatus(delay=120){
  clearTimeout(szzOfflineStatusTimer);
  szzOfflineStatusTimer=setTimeout(()=>updateSzzOfflineAppStatus().catch(e=>console.warn("Offline stav se nepodařilo obnovit",e)),delay);
}
window.scheduleSzzOfflineAppStatus=scheduleSzzOfflineAppStatus;

async function triggerSzzSync(reason="manual",silent=false){
  if(window.openAppToolsPanel) window.openAppToolsPanel();
  if(navigator.onLine===false){
    if(window.showSaveConfirmation) window.showSaveConfirmation("Jsi offline. Změny zůstanou uložené v telefonu.");
    scheduleSzzOfflineAppStatus(20);
    return 0;
  }
  noteSzzSyncState("syncing",{reason});
  scheduleSzzOfflineAppStatus(20);
  try{
    const synced=typeof syncOfflineChanges==="function"
      ? await syncOfflineChanges({reason,force:true,silent})
      : 0;
    noteSzzSyncState("ok",{reason,lastCount:synced});
    const counts=await updateSzzOfflineAppStatus({force:true});
    if(!silent && !synced && !counts.pending && window.showSaveConfirmation){
      window.showSaveConfirmation("Vše je synchronizované.");
    }
    return synced;
  }catch(e){
    noteSzzSyncState("error",{reason,lastError:e && (e.message || e.code) || String(e)});
    scheduleSzzOfflineAppStatus(20);
    throw e;
  }
}
window.triggerSzzSync=triggerSzzSync;

async function registerSzzBackgroundSync(reason="change"){
  if(!("serviceWorker" in navigator) || navigator.onLine===false) return false;
  try{
    const registration=window.registerSzzServiceWorker
      ? await window.registerSzzServiceWorker()
      : await navigator.serviceWorker.ready;
    if(registration && "sync" in registration){
      await registration.sync.register("astip-szz-offline-sync");
      return true;
    }
  }catch(e){
    console.warn("Background sync se nepodařilo naplánovat",reason,e);
  }
  return false;
}
window.registerSzzBackgroundSync=registerSzzBackgroundSync;

function bindSzzOfflineAppControls(){
  const syncBtn=document.getElementById("syncNowBtn");
  const refreshBtn=document.getElementById("refreshOfflineStateBtn");
  const prepareBtn=document.getElementById("prepareOfflineAppBtn");
  if(prepareBtn && !prepareBtn.__szzPrepareBound){
    prepareBtn.__szzPrepareBound=true;
    prepareBtn.addEventListener("click",()=>prepareSzzOfflineAppData({reason:"manual"}).catch(e=>{
      if(window.showSaveConfirmation) window.showSaveConfirmation("Offline příprava se nepodařila.");
      console.warn("Offline příprava selhala",e);
    }));
  }
  if(syncBtn && !syncBtn.__szzSyncBound){
    syncBtn.__szzSyncBound=true;
    syncBtn.addEventListener("click",()=>triggerSzzSync("manual",false).catch(e=>{
      if(window.showSaveConfirmation) window.showSaveConfirmation("Synchronizace se nepodařila.");
      console.warn("Ruční synchronizace selhala",e);
    }));
  }
  if(refreshBtn && !refreshBtn.__szzRefreshBound){
    refreshBtn.__szzRefreshBound=true;
    refreshBtn.addEventListener("click",()=>updateSzzOfflineAppStatus());
  }
  if(!bindSzzOfflineAppControls.__initialStatusScheduled){
    bindSzzOfflineAppControls.__initialStatusScheduled=true;
    scheduleSzzOfflineAppStatus(1200);
  }
}
document.addEventListener("DOMContentLoaded",bindSzzOfflineAppControls);
bindSzzOfflineAppControls();

window.addEventListener("online",()=>{
  scheduleSzzOfflineAppStatus(20);
  registerSzzBackgroundSync("online");
});
window.addEventListener("offline",()=>scheduleSzzOfflineAppStatus(20));
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible") scheduleSzzOfflineAppStatus(80);
});
window.addEventListener("focus",()=>scheduleSzzOfflineAppStatus(80));
window.addEventListener("storage",event=>{
  if(event.key && /^astip(Map|Szz)/.test(event.key)) scheduleSzzOfflineAppStatus(80);
});
if("serviceWorker" in navigator){
  navigator.serviceWorker.addEventListener("message",event=>{
    if(event.data && event.data.type==="SZZ_SYNC_REQUEST"){
      triggerSzzSync(event.data.reason || "background-sync",true).catch(()=>{});
    }
  });
}

function resetSitePhotoInput(){
  const input=document.getElementById("sitePhotosInput");
  const camera=document.getElementById("siteCameraInput");
  if(input) input.value="";
  if(camera) camera.value="";
  renderSitePhotoPreview();
}

function selectedSitePhotoFiles(){
  const gallery=document.getElementById("sitePhotosInput");
  const camera=document.getElementById("siteCameraInput");
  return [
    ...Array.from(gallery?.files || []),
    ...Array.from(camera?.files || [])
  ];
}

function renderSitePhotoPreview(){
  const box=document.getElementById("sitePhotoPreview");
  if(!box) return;
  sitePhotoPreviewUrls.forEach(url=>URL.revokeObjectURL(url));
  sitePhotoPreviewUrls=[];
  const files=selectedSitePhotoFiles();
  if(!files.length){
    box.replaceChildren();
    return;
  }
  const head=document.createElement("div");
  head.className="photo-preview-head";
  const title=document.createElement("span");
  title.textContent="Vybrané fotografie";
  const count=document.createElement("span");
  count.textContent=`${files.length} ks`;
  head.append(title,count);

  const grid=document.createElement("div");
  grid.className="photo-preview-grid";
  const fragment=document.createDocumentFragment();
  files.forEach((file,idx)=>{
    const url=URL.createObjectURL(file);
    sitePhotoPreviewUrls.push(url);
    const item=document.createElement("div");
    item.className="photo-preview-item";
    const img=document.createElement("img");
    img.src=url;
    img.alt=`Nová fotografie ${idx+1}`;
    img.decoding="async";
    const index=document.createElement("span");
    index.className="photo-preview-index";
    index.textContent=String(idx+1);
    item.append(img,index);
    fragment.appendChild(item);
  });
  grid.appendChild(fragment);
  box.replaceChildren(head,grid);
}

function sitePhotoKeys(site=selectedSite){
  return siteRecordKeys(site);
}

function photoFolderNameForDate(value=new Date()){
  let d=null;
  if(value && typeof value.toDate==="function") d=value.toDate();
  else if(value instanceof Date) d=value;
  else d=parseDateValue(value);
  if(!d || isNaN(d.getTime())) d=new Date();
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function normalizePhotoFolderDateName(value="",fallback=new Date()){
  const raw=safe(value);
  const last=raw.split(/[\\/]/).map(part=>safe(part)).filter(Boolean).pop() || raw;
  const candidates=[last,raw,fallback].map(item=>safe(item)).filter(Boolean);
  for(const candidate of candidates){
    const d=parseDateValue(candidate);
    if(d && !isNaN(d.getTime())) return photoFolderNameForDate(d);
  }
  return photoFolderNameForDate(new Date());
}

const photoFolderNameCache=new WeakMap();
function photoFolderDateFingerprint(value){
  if(value && typeof value.toDate==="function"){
    try{return `ts:${value.toDate().getTime()}`;}catch(e){}
  }
  if(value instanceof Date) return `date:${value.getTime()}`;
  return safe(value);
}
function photoFolderNameFingerprint(item){
  if(!item || (typeof item!=="object" && typeof item!=="function")) return "";
  const explicit=safe(item.photoFolder || item.folderName || item.folder || item.cloudinaryFolderDate || item.cloudinaryFolder);
  const fallbackDate=item.createdAt || item.uploadedAt || item.date || "";
  const version=safe(item.cloudinaryVersion || item.version);
  const fallback=photoFolderDateFingerprint(fallbackDate);
  if(!explicit && !fallback && !version) return "";
  return [explicit,fallback,version].join("\u001f");
}
function photoFolderName(item){
  const canCache=!!(item && (typeof item==="object" || typeof item==="function"));
  const fingerprint=canCache ? photoFolderNameFingerprint(item) : "";
  if(canCache && fingerprint){
    const cached=photoFolderNameCache.get(item);
    if(cached && cached.fingerprint===fingerprint) return cached.value;
  }
  const explicit=safe(item && (item.photoFolder || item.folderName || item.folder || item.cloudinaryFolderDate || item.cloudinaryFolder));
  const value=explicit
    ? normalizePhotoFolderDateName(explicit,item?.createdAt || item?.uploadedAt || item?.date || photoCloudinaryVersionDate(item))
    : photoFolderNameForDate(item?.createdAt || item?.uploadedAt || item?.date || photoCloudinaryVersionDate(item));
  if(canCache && fingerprint) photoFolderNameCache.set(item,{fingerprint,value});
  return value;
}

function cloudinaryPhotoFolderPath(folderName){
  const base=safe(CLOUDINARY_PHOTOS.folder);
  const folder=safe(folderName);
  return [base,folder].filter(Boolean).join("/");
}

function sitePhotoFolderGroups(items){
  const groups=new Map();
  (items || []).forEach((photo,idx)=>{
    const folder=photoFolderName(photo);
    if(!groups.has(folder)) groups.set(folder,[]);
    groups.get(folder).push({photo,idx});
  });
  return Array.from(groups.entries()).map(([folder,photos])=>({folder,photos}));
}

const sitePhotoPointInfoRowsCache=new WeakMap();
function sitePhotoPointInfoFingerprint(site=selectedSite){
  if(!site || (typeof site!=="object" && typeof site!=="function")) return "";
  const raw=(site && site.raw) || {};
  const gps=Number.isFinite(site?.lat) && Number.isFinite(site?.lon)
    ? `${site.lat.toFixed(6)}, ${site.lon.toFixed(6)}`
    : pickRawValue(raw,["Adresa_GPS","GPS","GPS souřadnice","GPS souradnice"]);
  return [
    safe(site?.adresa),
    safe(site?.kraj),
    safe(site?.zdroj),
    safe(site?.lat),
    safe(site?.lon),
    gps,
    pickRawValue(raw,["Název","Adresa / umístění","Umístění"]),
    pickRawValue(raw,["Kraj","Region","Okres"]),
    pickRawValue(raw,["Adresa / umístění","Adresa","Umístění"]),
    pickRawValue(raw,["Popis_zdroje","Popis zdroje","Zdroj","Typ zdroje"]),
    pickRawValue(raw,["Výrobní číslo","Výrobní č.","Výrobní_cislo","Zdroj","SN"])
  ].map(safe).join("\u001f");
}

function sitePhotoPointInfoRows(site=selectedSite){
  const canCache=!!(site && (typeof site==="object" || typeof site==="function"));
  const fingerprint=canCache ? sitePhotoPointInfoFingerprint(site) : "";
  if(canCache && fingerprint){
    const cached=sitePhotoPointInfoRowsCache.get(site);
    if(cached && cached.fingerprint===fingerprint) return cached.rows;
  }
  const raw=(site && site.raw) || {};
  const gps=Number.isFinite(site?.lat) && Number.isFinite(site?.lon)
    ? `${site.lat.toFixed(6)}, ${site.lon.toFixed(6)}`
    : pickRawValue(raw,["Adresa_GPS","GPS","GPS souřadnice","GPS souradnice"]);
  const rows=[
    ["Název", site?.adresa || pickRawValue(raw,["Název","Adresa / umístění","Umístění"])],
    ["Kraj", site?.kraj || pickRawValue(raw,["Kraj","Region","Okres"])],
    ["Adresa", pickRawValue(raw,["Adresa / umístění","Adresa","Umístění"]) || site?.adresa],
    ["GPS", gps],
    ["Popis zdroje", site?.zdroj || pickRawValue(raw,["Popis_zdroje","Popis zdroje","Zdroj","Typ zdroje"])],
    ["Výrobní číslo", pickRawValue(raw,["Výrobní číslo","Výrobní č.","Výrobní_cislo","Zdroj","SN"])]
  ];
  const result=rows
    .map(([label,value])=>[label,safe(value) || "-"])
    .filter(([label,value],idx,all)=>value!=="-" || idx<3 || all.length<=3);
  if(canCache && fingerprint) sitePhotoPointInfoRowsCache.set(site,{fingerprint,rows:result});
  return result;
}

function sitePhotoRenderKey(items=sitePhotoItems,index=sitePhotoIndex,site=selectedSite,pointInfoRows=null){
  const siteKey=detailLazyKey(site) || sitePlaceGroupKey(site) || safe(site && site.id);
  const userEmail=currentUserEmail();
  const isAdminUser=isAppAdmin();
  const pointInfo=(pointInfoRows || sitePhotoPointInfoRows(site))
    .map(([label,value])=>`${safe(label)}:${safe(value)}`)
    .join("|");
  const photos=(items || []).map((photo,idx)=>[
    safe(photo && (photo._id || photo.id || idx)),
    photoDisplayUrl(photo),
    photoFullUrl(photo),
    photoThumbUrl(photo),
    safe(photo && photo.storageMode),
    safe(photo && photo._syncStatus),
    safe(photo && photo._offline),
    safe(photo && (photo.createdAt || photo.uploadedAt || photo.date)),
    safe(photo && photo.updatedAt),
    safe(photo && photo.takenAt),
    safe(photo && (photo.photoFolder || photo.folderName || photo.folder || photo.cloudinaryFolderDate || photo.cloudinaryFolder)),
    safe(photo && (photo.uploadedBy || photo.createdBy || photo.ownerEmail)),
    safe(photo && (photo.size || "")),
    safe(photo && (photo.originalSize || "")),
    safe(photo && (photo.fileName || photo.originalFileName)),
    canDeleteSitePhotoForUser(photo,userEmail,isAdminUser) ? "delete" : "readonly"
  ].join("~")).join("||");
  return [
    siteKey,
    index,
    (items || []).length,
    userEmail,
    isAdminUser ? "admin" : "user",
    photos,
    pointInfo
  ].join("|||");
}

function bindSitePhotoListClicks(list){
  if(!list || list.__szzPhotoClickBound) return;
  list.__szzPhotoClickBound=true;
  list.addEventListener("click",event=>{
    const button=event.target.closest && event.target.closest("button");
    if(button && list.contains(button)){
      if(button.id==="sitePhotoPrevBtn"){
        if(sitePhotoItems.length>1){
          sitePhotoIndex=(sitePhotoIndex-1+sitePhotoItems.length)%sitePhotoItems.length;
          renderSitePhotos(sitePhotoItems,true);
        }
        return;
      }
      if(button.id==="sitePhotoNextBtn"){
        if(sitePhotoItems.length>1){
          sitePhotoIndex=(sitePhotoIndex+1)%sitePhotoItems.length;
          renderSitePhotos(sitePhotoItems,true);
        }
        return;
      }
      if(button.id==="deleteSitePhotoBtn"){
        deleteCurrentSitePhoto();
        return;
      }
    }
    const btn=event.target.closest && event.target.closest("[data-photo-idx]");
    if(!btn || !list.contains(btn)) return;
    const nextIndex=Number(btn.getAttribute("data-photo-idx")) || 0;
    if(sitePhotoIndex!==nextIndex){
      sitePhotoIndex=nextIndex;
      renderSitePhotos(sitePhotoItems,true);
    }
  });
}

function renderSitePhotos(items=sitePhotoItems,preserveIndex=false){
  const list=document.getElementById("sitePhotosList");
  if(!list) return;
  bindSitePhotoListClicks(list);
  if(Array.isArray(items) && items!==sitePhotoItems){
    sitePhotoItems=items;
    if(!preserveIndex) sitePhotoIndex=0;
  }
  if(!sitePhotoItems.length){
    const emptySignature=`empty:${detailLazyKey(selectedSite) || sitePlaceGroupKey(selectedSite) || safe(selectedSite && selectedSite.id)}`;
    if(sitePhotoRenderSignature===emptySignature && list.childElementCount) return;
    sitePhotoRenderSignature=emptySignature;
    const empty=document.createElement("div");
    empty.className="site-photos-empty";
    empty.textContent="Zatím nejsou uložené žádné fotografie.";
    list.replaceChildren(empty);
    return;
  }
  sitePhotoIndex=Math.max(0,Math.min(sitePhotoIndex,sitePhotoItems.length-1));
  const pointInfoRows=sitePhotoPointInfoRows(selectedSite);
  const renderSignature=sitePhotoRenderKey(sitePhotoItems,sitePhotoIndex,selectedSite,pointInfoRows);
  if(sitePhotoRenderSignature===renderSignature && list.childElementCount) return;
  sitePhotoRenderSignature=renderSignature;
  const item=sitePhotoItems[sitePhotoIndex];
  const mainUrl=photoDisplayUrl(item);
  const fullUrl=photoFullUrl(item);
  const thumbCount=sitePhotoItems.length;
  const photoMeta=photoRenderMeta(item,sitePhotoIndex);
  const currentFolder=photoMeta.currentFolder;
  const photoInfoRows=photoMeta.photoInfoRows;
  const downloadName=photoMeta.downloadName;
  const deleteAllowed=canDeleteSitePhoto(item);
  const viewer=document.createElement("div");
  viewer.className="site-photo-viewer";

  const stage=document.createElement("div");
  stage.className="site-photo-stage";
  const frame=document.createElement("div");
  frame.className="site-photo-frame";
  const mainLink=document.createElement("a");
  mainLink.className="site-photo-main";
  mainLink.href=fullUrl || mainUrl;
  mainLink.target="_blank";
  const mainImg=document.createElement("img");
  mainImg.src=mainUrl;
  mainImg.alt=`Fotografie bodu ${sitePhotoIndex+1}`;
  mainImg.decoding="async";
  mainLink.appendChild(mainImg);
  const prev=document.createElement("button");
  prev.className="secondary site-photo-arrow site-photo-arrow-prev";
  prev.type="button";
  prev.id="sitePhotoPrevBtn";
  prev.disabled=thumbCount<=1;
  prev.setAttribute("aria-label","Předchozí fotografie");
  prev.textContent="‹";
  const next=document.createElement("button");
  next.className="secondary site-photo-arrow site-photo-arrow-next";
  next.type="button";
  next.id="sitePhotoNextBtn";
  next.disabled=thumbCount<=1;
  next.setAttribute("aria-label","Další fotografie");
  next.textContent="›";
  const counter=document.createElement("span");
  counter.className="site-photo-counter";
  counter.textContent=`${sitePhotoIndex+1} / ${thumbCount}`;
  frame.append(mainLink,prev,next,counter);
  stage.appendChild(frame);
  viewer.appendChild(stage);

  const thumbs=document.createElement("div");
  thumbs.className="site-photo-thumbs";
  const folderGroups=sitePhotoFolderGroups(sitePhotoItems);
  const activeFolder=currentFolder || (folderGroups[0] && folderGroups[0].folder) || "";
  const thumbsFragment=document.createDocumentFragment();
  folderGroups.forEach(group=>{
    const groupEl=document.createElement("div");
    groupEl.className=`site-photo-folder-group ${group.folder===activeFolder ? "active" : ""}`.trim();
    const folderName=safe(group.folder) || "Bez názvu složky";
    const label=document.createElement("button");
    label.className="site-photo-folder-label";
    label.type="button";
    label.dataset.photoIdx=String((group.photos[0] && group.photos[0].idx) || 0);
    label.setAttribute("aria-label",`Zobrazit složku ${folderName}`);
    label.textContent=folderName;
    const row=document.createElement("div");
    row.className="site-photo-folder-thumbs";
    group.photos.forEach(({photo,idx})=>{
      const button=document.createElement("button");
      button.className=`site-photo-thumb ${idx===sitePhotoIndex ? "active" : ""}`.trim();
      button.type="button";
      button.dataset.photoIdx=String(idx);
      button.setAttribute("aria-label",`Zobrazit fotografii ${idx+1}`);
      const thumbImg=document.createElement("img");
      thumbImg.src=photoThumbUrl(photo);
      thumbImg.alt=`Náhled ${idx+1}`;
      thumbImg.loading="lazy";
      thumbImg.decoding="async";
      button.appendChild(thumbImg);
      row.appendChild(button);
    });
    groupEl.append(label,row);
    thumbsFragment.appendChild(groupEl);
  });
  thumbs.appendChild(thumbsFragment);
  viewer.appendChild(thumbs);

  const infoStrip=document.createElement("div");
  infoStrip.className="site-photo-info-strip";
  photoInfoRows.forEach(([label,value])=>{
    const pill=document.createElement("div");
    pill.className="site-photo-info-pill";
    const labelEl=document.createElement("span");
    labelEl.textContent=safe(label);
    const valueEl=document.createElement("b");
    valueEl.textContent=safe(value);
    pill.append(labelEl,valueEl);
    infoStrip.appendChild(pill);
  });
  viewer.appendChild(infoStrip);

  const detailGrid=document.createElement("div");
  detailGrid.className="site-photo-detail-grid";
  pointInfoRows.forEach(([label,value])=>{
    const card=document.createElement("div");
    card.className="site-photo-detail-card";
    const labelEl=document.createElement("span");
    labelEl.textContent=safe(label);
    const valueEl=document.createElement("b");
    valueEl.textContent=safe(value);
    card.append(labelEl,valueEl);
    detailGrid.appendChild(card);
  });
  viewer.appendChild(detailGrid);

  if(photoMeta.meta){
    const metaEl=document.createElement("div");
    metaEl.className="site-photo-meta";
    metaEl.textContent=photoMeta.meta;
    viewer.appendChild(metaEl);
  }

  const actions=document.createElement("div");
  actions.className="site-photo-actions";
  const download=document.createElement("a");
  download.href=fullUrl || mainUrl;
  download.target="_blank";
  download.download=downloadName;
  download.textContent="Stáhnout fotku";
  const del=document.createElement("button");
  del.className="danger";
  del.type="button";
  del.id="deleteSitePhotoBtn";
  del.disabled=!deleteAllowed;
  del.textContent="Smazat fotku";
  actions.append(download,del);
  viewer.appendChild(actions);

  list.replaceChildren(viewer);
}

async function loadSitePhotos(site=selectedSite){
  const st=document.getElementById("sitePhotosStatus");
  if(!st) return;
  const requestedKey=detailLazyKey(site);
  const stillSameSite=()=>!requestedKey || requestedKey===detailLazyKey(selectedSite);
  const items=[];
  const photoDedupe=createRecordIdDedupe(items);
  const addPhoto=item=>{
    if(!item || !photoDisplayUrl(item)) return;
    photoDedupe.add(item);
  };
  const renderLoaded=(message="")=>{
    if(!stillSameSite()) return;
    items.sort((a,b)=>historyTimeValue(b)-historyTimeValue(a));
    renderSitePhotos(items);
    st.textContent=message || (items.length ? `Načteno fotografií: ${items.length}.` : "");
  };

  if(site){
    readSiteLocalArray("photos",site).forEach((item,idx)=>{
      addPhoto({...item,_id:item._id || `local_photo_${idx}`});
    });
    const offlinePhotos=await readOfflinePhotoItems(site);
    offlinePhotos.forEach((item,idx)=>{
      addPhoto({...item,_id:item._id || `offline_photo_${idx}`,storageMode:item.storageMode || "offline",_offline:true});
    });
  }

  if(!firebaseReady || !db || !site){
    renderLoaded(items.length ? `Načteno lokálních fotografií: ${items.length}.` : "");
    return;
  }
  if(!stillSameSite()) return;
  st.textContent="Načítám fotografie...";
  const signedUser=await waitForFirebaseUser();
  if(!stillSameSite()) return;
  if(!signedUser){
    renderLoaded(items.length ? `Načteno lokálních fotografií: ${items.length}.` : "Čekám na přihlášení, fotografie se načtou po přihlášení.");
    return;
  }
  try{
    const [,childPhotos]=await Promise.all([
      refreshSiteDataFromFirebase(site),
      loadSiteChildItems("photos",site)
    ]);
    if(!stillSameSite()) return;
    const embeddedPhotos=Array.isArray(site?.firebaseData?.photos) ? site.firebaseData.photos : [];
    embeddedPhotos.forEach((item,idx)=>{
      addPhoto({...item,_id:item._id || `embedded_photo_${idx}`});
    });
    childPhotos.forEach((item,idx)=>{
      addPhoto({...item,_id:item._id || `site_photo_${idx}`});
    });
    renderLoaded();
  }catch(e){
    if(items.length){
      renderLoaded(`Načteno lokálních fotografií: ${items.length}. Online fotky se nepodařilo načíst.`);
    }else{
      if(stillSameSite()) st.textContent="Chyba načtení fotografií: "+e.message;
    }
  }
}

async function deleteCurrentSitePhoto(){
  const st=document.getElementById("sitePhotosStatus");
  const item=sitePhotoItems[sitePhotoIndex];
  if(!item || !safe(item._id)){
    if(st) st.textContent="Není vybraná fotografie ke smazání.";
    return;
  }
  if(!canDeleteSitePhoto(item)){
    if(st) st.textContent="Tuhle fotografii může smazat správce nebo ten, kdo ji nahrál.";
    return;
  }
  if(!confirm("Opravdu smazat tuto fotografii?")) return;
  try{
    if(st) st.textContent="Mažu fotografii...";
    const id=safe(item._id);
    await deleteSiteChildItem("photos",id,selectedSite);
    await removeEmbeddedSiteItem("photos",id,selectedSite);
    removeSiteLocalItem("photos",id,selectedSite);
    await removeOfflinePhotoItem(id,selectedSite);
    await deleteCloudinaryUpload(item);
    sitePhotoDeleteTokens.delete(id);
    sitePhotoItems=sitePhotoItems.filter(photo=>safe(photo && photo._id)!==id);
    if(sitePhotoIndex>=sitePhotoItems.length) sitePhotoIndex=Math.max(0,sitePhotoItems.length-1);
    renderSitePhotos(sitePhotoItems,true);
    if(st) st.textContent="Fotografie smazána z bodu.";
    showSaveConfirmation("Fotografie smazána z bodu.");
  }catch(e){
    if(st) st.textContent="Chyba mazání fotografie: "+e.message;
  }
}

async function uploadSitePhotos(){
  const st=document.getElementById("sitePhotosStatus");
  const files=selectedSitePhotoFiles();
  if(!st) return;
  if(!selectedSite){st.textContent="Není vybraný bod.";return;}
  if(!files.length){st.textContent="Nejdřív vyber fotografie.";return;}

  try{
    const signedUser=(firebaseReady && db) ? await waitForFirebaseUser(1200) : null;
    const userEmail=signedUser?.email || currentUser?.email || lastKnownUserEmail() || "";
    const keys=sitePhotoKeys(selectedSite);
    const siteKey=keys[0] || selectedSite.id || "bod";
    const siteId=selectedSite.id || siteKey;
    const onlineUploadAvailable=!!(firebaseReady && db && signedUser && navigator.onLine !== false);
    const uploadFolderName=photoFolderNameForDate(new Date());
    let localOnlyCount=0;
    let offlineCount=0;
    let onlineCount=0;

    const buildBasePayload=(photoId,file,createdAt)=>({
      _id:photoId,
      siteId,
      siteKey,
      siteKeys:keys,
      firebaseDocId:selectedSite.firebaseDocId || selectedSite.raw?.["Firebase_doc_id"] || "",
      sourceGroupKey:sitePlaceGroupKey(selectedSite),
      sourceIdentity:siteSourceIdentity(selectedSite),
      siteName:selectedSite.adresa || "",
      siteSource:selectedSite.zdroj || "",
      fileName:file.name || "",
      uploadedBy:userEmail || "nepřihlášený uživatel",
      photoFolder:uploadFolderName,
      folderName:uploadFolderName,
      folder:uploadFolderName,
      cloudinaryFolderDate:uploadFolderName,
      cloudinaryFolder:cloudinaryPhotoFolderPath(uploadFolderName),
      createdAt,
      takenAt:file.lastModified ? new Date(file.lastModified).toISOString() : createdAt
    });

    const saveOfflinePhoto=async (photoId,file,reason,index)=>{
      st.textContent=`Ukládám fotografii ${index+1}/${files.length} lokálně...`;
      const createdAt=new Date().toISOString();
      const offlineData=await prepareOfflinePhotoData(file);
      const photoPayload={
        ...buildBasePayload(photoId,file,createdAt),
        url:offlineData.dataUrl,
        displayUrl:offlineData.dataUrl,
        fullUrl:offlineData.dataUrl,
        thumbUrl:offlineData.dataUrl,
        storageMode:"offline",
        _offline:true,
        _syncStatus:"local",
        localOnly:true,
        offlineReason:safe(reason),
        size:offlineData.size || file.size,
        originalSize:file.size,
        type:offlineData.type || file.type || "image/jpeg",
        syncQueuedAt:createdAt
      };
      await saveOfflinePhotoItem(photoPayload,selectedSite);
      offlineCount++;
      renderSitePhotos([photoPayload,...sitePhotoItems.filter(photo=>safe(photo._id)!==photoPayload._id)]);
    };

    for(let i=0;i<files.length;i++){
      const file=files[i];
      const photoId=(window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : `photo_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      if(!onlineUploadAvailable){
        await saveOfflinePhoto(photoId,file,!navigator.onLine ? "Bez připojení k internetu." : "Firebase nebo přihlášení není dostupné.",i);
        continue;
      }

      st.textContent=`Zmenšuji fotografii ${i+1}/${files.length}...`;
      let uploadFile;
      let cloudinaryResult;
      try{
        uploadFile=await prepareCloudinaryUploadFile(file);
        st.textContent=`Nahrávám fotografii ${i+1}/${files.length} na Cloudinary...`;
        cloudinaryResult=await uploadPhotoToCloudinary(photoId,uploadFile,selectedSite,uploadFolderName);
      }catch(uploadError){
        console.warn("Online nahrání fotky selhalo, ukládám lokálně",uploadError);
        await saveOfflinePhoto(photoId,file,uploadError.message,i);
        continue;
      }
      if(cloudinaryResult?.cloudinaryDeleteToken){
        sitePhotoDeleteTokens.set(photoId,cloudinaryResult.cloudinaryDeleteToken);
      }

      const createdAt=new Date().toISOString();
      const photoPayload={
        ...buildBasePayload(photoId,file,createdAt),
        url:cloudinaryResult.url,
        displayUrl:cloudinaryResult.displayUrl,
        fullUrl:cloudinaryResult.fullUrl,
        thumbUrl:cloudinaryResult.thumbUrl,
        storageMode:"cloudinary",
        cloudinaryPublicId:cloudinaryResult.cloudinaryPublicId,
        cloudinaryAssetId:cloudinaryResult.cloudinaryAssetId,
        cloudinaryVersion:cloudinaryResult.cloudinaryVersion,
        cloudinaryUploadPreset:cloudinaryResult.cloudinaryUploadPreset,
        cloudinaryFolder:cloudinaryResult.cloudinaryFolder || cloudinaryPhotoFolderPath(uploadFolderName),
        size:uploadFile.size || file.size,
        originalSize:file.size
      };
      const childOk=await saveSiteChildItem("photos",photoId,photoPayload,selectedSite);
      const embeddedOk=childOk ? true : await appendEmbeddedSiteItem("photos",photoPayload,selectedSite);
      appendSiteLocalArray("photos",photoPayload,selectedSite,0);
      if(!childOk && !embeddedOk){
        localOnlyCount++;
        st.textContent="Fotografie je na Cloudinary. Firebase nepovolil uložení odkazu k bodu, proto je odkaz uložen lokálně v tomto prohlížeči.";
      }
      onlineCount++;
      renderSitePhotos([photoPayload,...sitePhotoItems.filter(photo=>safe(photo._id)!==photoPayload._id)]);
    }

    if(offlineCount && onlineCount){
      st.textContent=`Uloženo fotografií do složky ${uploadFolderName}: ${onlineCount} online, ${offlineCount} lokálně v tomto zařízení.`;
      showSaveConfirmation("Fotografie uloženy.");
    }else if(offlineCount){
      st.textContent=`Fotografie uloženy lokálně do složky ${uploadFolderName}: ${offlineCount}. Po připojení se samy odešlou online.`;
      showSaveConfirmation("Fotografie uloženy lokálně.");
    }else if(localOnlyCount){
      st.textContent=`Fotografie nahrány na Cloudinary do složky ${uploadFolderName}. ${localOnlyCount} odkazů Firebase nepovolil uložit k bodu, proto jsou uložené lokálně v tomto prohlížeči.`;
      showSaveConfirmation("Fotografie nahrány.");
    }else{
      st.textContent=`Uloženo fotografií do složky ${uploadFolderName}: ${onlineCount} (Cloudinary).`;
      showSaveConfirmation("Fotografie uloženy.");
    }
    if(offlineCount && navigator.onLine!==false && typeof syncOfflineChanges==="function"){
      setTimeout(()=>syncOfflineChanges({reason:"photo-offline-save",silent:true}),2500);
    }
    resetSitePhotoInput();
    try{ refreshDetailTabLoad("gallery",selectedSite); }catch(e){}
  }catch(e){
    st.textContent="Chyba uložení fotografií: "+e.message;
  }
}

window.loadSitePhotos=loadSitePhotos;
window.uploadSitePhotos=uploadSitePhotos;

async function getLastProtocol(site=selectedSite){
  if(!firebaseReady || !db || !site) return null;
  const cachedProtocol=readLastProtocolCache(site);
  if(cachedProtocol!==undefined) return cachedProtocol;
  const signedUser=await waitForFirebaseUser();
  if(!signedUser) return null;
  try{
    const [,childProtocols]=await Promise.all([
      refreshSiteDataFromFirebase(site),
      loadSiteChildItems("protocols",site)
    ]);
    const {collection,query,where,getDocs,doc,getDoc}=fb.fsMod;
    const keys=siteRecordKeys(site);
    const items=[];
    const itemDedupe=createRecordIdDedupe(items);
    const addProtocolItem=item=>{
      itemDedupe.add(item);
    };
    childProtocols.forEach((item,idx)=>{
      addProtocolItem({...item,_id:item._id || `site_protocol_${idx}`});
    });
    const embeddedProtocols=Array.isArray(site?.firebaseData?.protocolHistory) ? site.firebaseData.protocolHistory : [];
    embeddedProtocols.forEach((item,idx)=>{
      addProtocolItem({...item,_id:item._id || `embedded_protocol_${idx}`});
    });
    const localProtocolItems=await readSiteLocalProtocolHistoryItems(site);
    localProtocolItems.forEach((item,idx)=>{
      const id=item._id || `local_protocol_${idx}`;
      if(!itemDedupe.has(id)) addProtocolItem({...item,_id:id});
    });
    const protocolRefs=Array.isArray(site?.firebaseData?.protocolRefs) ? site.firebaseData.protocolRefs : [];
    const protocolRefTasks=protocolRefs.map(refItem=>async()=>{
      const id=safe(refItem && refItem._id);
      if(!id || itemDedupe.has(id)) return;
      try{
        const snap=await getDoc(doc(db,"protocols",id));
        if(snap.exists()) addProtocolItem({...snap.data(),_id:snap.id});
        else addProtocolItem({...refItem,_id:id});
      }catch(e){
        addProtocolItem({...refItem,_id:id});
      }
    });
    await runBoundedFirestoreTasks(protocolRefTasks,6);
    const addProtocolDocSnap=docSnap=>{
      addProtocolItem({...docSnap.data(),_id:docSnap.id});
    };
    const addSnap=snap=>snap.forEach(addProtocolDocSnap);
    const siteKeysBatchOk=await readFirestoreArrayContainsAny(
      fb.fsMod,
      db,
      "protocols",
      "siteKeys",
      keys,
      addProtocolDocSnap,
      "Poslední protokol dávkový dotaz selhal"
    );
    const protocolQueryTasks=[];
    for(const field of ["siteId","siteKey","firebaseDocId"]){
      protocolQueryTasks.push(()=>readFirestoreEqualsAny(
        fb.fsMod,
        db,
        "protocols",
        field,
        keys,
        addProtocolDocSnap,
        "Poslední protokol rovnostní dávkový dotaz selhal"
      ));
    }
    for(const id of keys){
      if(!siteKeysBatchOk){
        protocolQueryTasks.push(async()=>{
          try{
            addSnap(await getDocs(query(collection(db,"protocols"),where("siteKeys","array-contains",id))));
          }catch(e){
            console.warn("Poslední protokol dotaz selhal","siteKeys",e);
          }
        });
      }
    }
    await runBoundedFirestoreTasks(protocolQueryTasks,6);
    let matchedItems=items.filter(item=>recordMatchesSite(item,site));
    if(!matchedItems.length){
      const textQueryTasks=[];
      const textKeys=siteRecordTextKeys(site).slice(0,8);
      for(const value of textKeys){
        for(const field of ["siteName","siteAddress","place"]){
          textQueryTasks.push(async()=>{
            try{
              addSnap(await getDocs(query(collection(db,"protocols"),where(field,"==",value))));
            }catch(e){
              console.warn("Poslední protokol textový dotaz selhal",field,e);
            }
          });
        }
      }
      await runBoundedFirestoreTasks(textQueryTasks,6);
      matchedItems=items.filter(item=>recordMatchesSite(item,site));
    }
    matchedItems.sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a));
    const latest=matchedItems[0] || null;
    writeLastProtocolCache(site,latest);
    return latest;
  }catch(e){
    console.warn("Nepodařilo se načíst poslední protokol:",e);
    return null;
  }
}

async function prefillProtocol(){
  if(!selectedSite) return;

  resetProtocolFormForSelectedSite(selectedSite.id);
  const raw=selectedSite.raw || {};
  // Nový protokol má začínat čistě, bez hodnot z posledního uloženého protokolu.
  const last=null;

  // základ z aktuálního místa
  populateProtocolDeviceSelect();
  const address=selectedSite.adresa || pickRawValue(raw,["Název","Adresa / umístění","Adresa_GPS","Umístění"]);
  const contacts=siteContactForProtocol(selectedSite);
  const period=periodMonths(selectedSite) === 12 ? "12 měsíců" : "6 měsíců";
  const deviceType=protocolDeviceTypeFromSite(selectedSite);
  const serial=protocolSerialFromSite(selectedSite);
  const sourceLocation=protocolSourceLocationFromSite(selectedSite);

  setProtocolFieldValue("protoDate",new Date().toISOString().slice(0,10));
  setProtocolFieldValue("protoPlace",address);
  setProtocolFieldValue("protoContacts",contacts);
  setProtocolFieldValue("protoTechSign",currentUser?.displayName || currentUser?.email || "");
  setProtocolFieldValue("protoPeriod",period);
  setProtocolFieldValue("protoDeviceType",deviceType);
  setProtocolFieldValue("protoSerial",serial);
  setProtocolFieldValue("protoPbzLocation",sourceLocation);

  // předvyplnění z dat v indexu / CSV
  setIfEmpty("protoBatteryCount", pickRawValue(raw,["Počet baterií","Pocet baterii","Počet baterií (ks)","Baterie ks","Počet AKU"]));
  setIfEmpty("protoCapacity", pickRawValue(raw,["Kapacita","Kapacita (Ah)","Kapacita Ah","Ah"]));
  setIfEmpty("protoSetCount", pickRawValue(raw,["Počet sad","Pocet sad","Počet sad (ks)","Sady ks"]));
  setIfEmpty("protoAuxBatteryAh", pickRawValue(raw,["Pom. Bat","Pom. Bat (Ah)","Pomocná baterie","Pom baterie"]));


  setIfEmpty("protoOperator", pickRawValue(raw,["Provozovatel","Provozovatel zařízení"]));
  setIfEmpty("protoCustomer", pickRawValue(raw,["Objednatel","Faktura na","Protokol na","Objednatel zkoušky provozuschopnosti"]));
  setIfEmpty("protoBreakersLocation", pickRawValue(raw,["Jistič UPS","Jistic UPS","Umístění jističů","Jističe UPS","Jističe"]));
  setIfEmpty("protoControlLocation", pickRawValue(raw,["Umístění ovládání","Ovládání zálohovaných zařízení"]));
  setIfEmpty("protoTestProcedure", pickRawValue(raw,["Postup testování","Postup testovani","Postup testu"]));


  // pokud existuje předchozí protokol, má prioritu pro technické hodnoty
  if(last){
    setIfEmpty("protoDeviceType", last.deviceType);
    setIfEmpty("protoSerial", last.serial);

    setIfEmpty("protoOperator", last.operator);
    setIfEmpty("protoCustomer", last.customer);
    setIfEmpty("protoPbzLocation", last.pbzLocation);
    setIfEmpty("protoBatteryCount", last.batteryCount);
    setIfEmpty("protoCapacity", last.capacityAh);
    setIfEmpty("protoSetCount", last.setCount);
    setIfEmpty("protoAuxBatteryAh", last.auxBatteryAh);











    setIfEmpty("protoBreakersLocation", last.breakersLocation);
    setIfEmpty("protoControlLocation", last.controlLocation);
    setIfEmpty("protoTestProcedure", last.testProcedure);
    setIfEmpty("protoContacts", last.contacts);
    setIfEmpty("protoConditions", last.conditions);
    setIfEmpty("protoConditionsReason", last.conditionsReason);

    if(last.backedDevices){
      setCheckbox("protoLift", last.backedDevices.lift);
      setCheckbox("protoVent", last.backedDevices.vent);
      setCheckbox("protoMachineLight", last.backedDevices.machineLight);
      setCheckbox("protoChuc", last.backedDevices.chuc);
      setCheckbox("protoDamper", last.backedDevices.damper);
      setCheckbox("protoSkylight", last.backedDevices.skylight);
      setCheckbox("protoGate", last.backedDevices.gate);
      setCheckbox("protoAts", last.backedDevices.ats);
      setCheckbox("protoRpo", last.backedDevices.rpo);
      setCheckbox("protoNo", last.backedDevices.no);
      setCheckbox("protoSprinkler", last.backedDevices.sprinkler);
      setCheckbox("protoCsTs", last.backedDevices.csTs);
      setIfEmpty("protoOtherDevice", last.backedDevices.other);
    }

    if(last.access){
      setCheckbox("protoBlue", last.access.blue);
      setCheckbox("protoB", last.access.b);
      setCheckbox("protoC", last.access.c);
      setCheckbox("protoGarage", last.access.garage);
      setCheckbox("protoCarLift", last.access.carLift);
      setCheckbox("protoBarrier", last.access.barrier);
      setCheckbox("protoParkingHouse", last.access.parkingHouse);
      setCheckbox("protoPermit", last.access.permit);
      setCheckbox("protoTraining", last.access.training);
      setCheckbox("protoShoes", last.access.shoes);
      setCheckbox("protoVest", last.access.vest);
      setCheckbox("protoHelmet", last.access.helmet);
      setIfEmpty("protoOtherAccess", last.access.other);
    }

    if(last.availability){
      setCheckbox("protoWcOk", last.availability.wcOk);
      setCheckbox("protoWcNok", last.availability.wcNok);
      setCheckbox("protoLightOk", last.availability.lightOk);
      setCheckbox("protoLightNok", last.availability.lightNok);
      setCheckbox("protoLadder", last.availability.ladder);
      setCheckbox("protoStairs", last.availability.stairs);
      setCheckbox("protoLowCeiling", last.availability.lowCeiling);
      setCheckbox("protoExtremeTemp", last.availability.extremeTemp);
      setIfEmpty("protoOtherAvailability", last.availability.other);
    }

    setProtocolStatusText("Předvyplněno z posledního uloženého protokolu a dat místa.");
  }else{
    setProtocolStatusText("Předvyplněno z dat místa.");
  }

  updateProtocolSummary();
  bindProtocolDraftAutosave();
  restoreProtocolDraftIfAny(selectedSite);
}

function protocolPayload(){
  const original=protocolEditState?.item || {};
  const signature=protocolClientSignatureDataUrl() || original.clientSignatureDataUrl || "";
  const nowIso=new Date().toISOString();
  const originalCreatedAt=original.createdAt && typeof original.createdAt.toDate==="function" ? original.createdAt.toDate().toISOString() : (safe(original.createdAt) || nowIso);
  return {
    _id:protocolEditId() || "",
    siteId:selectedSite?.id || "",
    siteKey:siteRecordKeys(selectedSite)[0] || selectedSite?.id || "",
    siteKeys:siteRecordKeys(selectedSite),
    firebaseDocId:selectedSite?.firebaseDocId || selectedSite?.raw?.["Firebase_doc_id"] || "",
    sourceGroupKey:sitePlaceGroupKey(selectedSite),
    sourceIdentity:siteSourceIdentity(selectedSite),
    siteName:selectedSite?.adresa || "",
    siteSource:selectedSite?.zdroj || "",
    technicianEmail:currentUser?.email || lastKnownUserEmail() || "",
    date:val("protoDate"),
    selectedDevice:val("protoDeviceTypeSelect") || val("protoDeviceSelect"),
    deviceType:val("protoDeviceType"),
    serial:val("protoSerial"),
    seal:val("protoSeal"),
    place:val("protoPlace"),
    operator:val("protoOperator"),
    customer:val("protoCustomer"),
    pbzLocation:val("protoPbzLocation"),
    batteryCount:val("protoBatteryCount"),
    capacityAh:val("protoCapacity"),
    setCount:val("protoSetCount"),
    auxBatteryAh:val("protoAuxBatteryAh"),
    temperature:val("protoTemp"),
    seal2:val("protoSeal2"),
    inputVac:val("protoInputVac"),
    output1Vac:val("protoOutput1Vac"),
    output2Vac:val("protoOutput2Vac"),
    backup1Vac:val("protoBackup1Vac"),
    backup2Vac:val("protoBackup2Vac"),
    mainBatVdc:val("protoMainBatVdc"),
    resetDiagnostics:val("protoResetDiag"),
    auxBatVdc:val("protoAuxBatVdc"),
    unbalance1:val("protoUnbalance1"),
    unbalance2:val("protoUnbalance2"),
    breakersLocation:val("protoBreakersLocation"),
    backedDevices:{
      lift:checkbox("protoLift"),
      vent:checkbox("protoVent"),
      machineLight:checkbox("protoMachineLight"),
      chuc:checkbox("protoChuc"),
      damper:checkbox("protoDamper"),
      skylight:checkbox("protoSkylight"),
      gate:checkbox("protoGate"),
      ats:checkbox("protoAts"),
      rpo:checkbox("protoRpo"),
      no:checkbox("protoNo"),
      sprinkler:checkbox("protoSprinkler"),
      csTs:checkbox("protoCsTs"),
      other:val("protoOtherDevice")
    },
    controlLocation:val("protoControlLocation"),
    testProcedure:val("protoTestProcedure"),
    access:{
      blue:checkbox("protoBlue"),
      b:checkbox("protoB"),
      c:checkbox("protoC"),
      garage:checkbox("protoGarage"),
      carLift:checkbox("protoCarLift"),
      barrier:checkbox("protoBarrier"),
      parkingHouse:checkbox("protoParkingHouse"),
      permit:checkbox("protoPermit"),
      training:checkbox("protoTraining"),
      shoes:checkbox("protoShoes"),
      vest:checkbox("protoVest"),
      helmet:checkbox("protoHelmet"),
      other:val("protoOtherAccess")
    },
    contacts:val("protoContacts"),
    availability:{
      wcOk:checkbox("protoWcOk"),
      wcNok:checkbox("protoWcNok"),
      lightOk:checkbox("protoLightOk"),
      lightNok:checkbox("protoLightNok"),
      ladder:checkbox("protoLadder"),
      stairs:checkbox("protoStairs"),
      lowCeiling:checkbox("protoLowCeiling"),
      extremeTemp:checkbox("protoExtremeTemp"),
      other:val("protoOtherAvailability")
    },
    period:val("protoPeriod"),
    conditions:val("protoConditions"),
    conditionsReason:val("protoConditionsReason"),
    notes:val("protoNotes"),
    clientSign:val("protoClientSign"),
    clientSignatureDataUrl:signature,
    techSign:val("protoTechSign") || (currentUser?.displayName || currentUser?.email || lastKnownUserEmail() || ""),
    savedAt:nowIso,
    createdAt:originalCreatedAt,
    updatedAt:protocolEditId() ? nowIso : ""
  };
}

const exportProtocolFormBtn=document.getElementById("exportProtocolFormBtn");
if(exportProtocolFormBtn){
  exportProtocolFormBtn.addEventListener("click",()=>{
    if(!selectedSite){
      setProtocolStatusText("Není vybrané místo.");
      return;
    }
    const payload=protocolPayload();
    payload.createdBy=currentUser?.email || payload.technicianEmail || "";
    exportProtocolToWord(payload);
  });
}

const mailProtocolFormBtn=document.getElementById("mailProtocolFormBtn");
if(mailProtocolFormBtn){
  mailProtocolFormBtn.addEventListener("click",async()=>{
    if(!selectedSite){
      setProtocolStatusText("Není vybrané místo.");
      return;
    }
    const payload=protocolPayload();
    payload.createdBy=currentUser?.email || payload.technicianEmail || "";
    if(!confirmProtocolMailSend()) return;
    mailProtocolFormBtn.disabled=true;
    try{
      await sendProtocolByMail(payload);
    }catch(e){
      const message=protocolMailErrorText(e);
      setProtocolStatusText(`Chyba odeslání e-mailu: ${message}`);
      showSaveConfirmation(`E-mail: ${protocolMailToastText(e)}`);
    }finally{
      mailProtocolFormBtn.disabled=false;
    }
  });
}

const officialProtocolDataBtn=document.getElementById("officialProtocolDataBtn");
if(officialProtocolDataBtn){
  officialProtocolDataBtn.addEventListener("click",()=>{
    const box=document.getElementById("officialProtocolDataBox");
    if(box) box.style.display=box.style.display==="none" ? "grid" : "none";
  });
}
const officialManufacturerSelect=document.getElementById("officialManufacturerSelect");
if(officialManufacturerSelect){
  officialManufacturerSelect.addEventListener("change",syncOfficialManufacturerHidden);
}
const saveOfficialProtocolDataBtn=document.getElementById("saveOfficialProtocolDataBtn");
if(saveOfficialProtocolDataBtn){
  saveOfficialProtocolDataBtn.addEventListener("click",async ()=>{
    const data=await saveOfficialProtocolData();
    const box=document.getElementById("officialProtocolDataBox");
    if(data && box) box.style.display="none";
  });
}
const officialProtocolOkBtn=document.getElementById("officialProtocolOkBtn");
if(officialProtocolOkBtn){
  officialProtocolOkBtn.addEventListener("click",()=>exportOfficialProtocol("ok"));
}
const officialProtocolStopBtn=document.getElementById("officialProtocolStopBtn");
if(officialProtocolStopBtn){
  officialProtocolStopBtn.addEventListener("click",()=>exportOfficialProtocol("stop"));
}

const protocolFormEl=formFieldNode("protocolForm");
if(protocolFormEl){
protocolFormEl.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!selectedSite){setProtocolStatusText("Není vybrané místo.");return;}

  if(!val("protoResetDiag")){
    setProtocolStatusText("Je nutné vyplnit pole Reset diagnostiky.");
    formFieldNode("protoResetDiag")?.focus();
    return;
  }

  const payload=protocolPayload();
  const editingId=protocolEditId();
  const editing=!!editingId;
  payload.createdBy=protocolEditState?.item?.createdBy || currentUser?.email || lastKnownUserEmail() || "";
  payload.updatedBy=currentUser?.email || lastKnownUserEmail() || "";
  payload.clearManualStatusAfterSave=!editing;
  const onlineSaveAvailable=!!(firebaseReady && db && fb.fsMod && currentUser && navigator.onLine !== false);
  const saveOffline=reason=>{
    const offlinePayload=saveProtocolLocally(payload,selectedSite,reason);
    clearProtocolDraft(selectedSite);
    applyProtocolFieldsToSite(offlinePayload,selectedSite);
    if(!editing) clearManualStatusLocalState(selectedSite);
    refreshSelectedDetailDataView();
    render();
    setProtocolStatusText("Protokol uložen lokálně v tomto prohlížeči. Internet/Firebase teď není dostupný.");
    showSaveConfirmation("Protokol uložen lokálně.");
    if(navigator.onLine!==false && typeof syncOfflineChanges==="function"){
      setTimeout(()=>syncOfflineChanges({reason:"protocol-offline-save",silent:true}),2000);
    }
    if(typeof loadHistory === "function") loadHistory(selectedSite.id);
    closeProtocolFormAfterSave();
    return offlinePayload;
  };

  if(!onlineSaveAvailable){
    saveOffline(!navigator.onLine ? "Bez připojení k internetu." : "Firebase nebo přihlášení není dostupné.");
    return;
  }

  try{
    const {collection,doc,setDoc,serverTimestamp}=fb.fsMod;
    const ref=editing ? doc(db,"protocols",editingId) : doc(collection(db,"protocols"));
    payload._id=ref.id;
    payload.createdBy=currentUser.email || payload.createdBy;
    const childOk=await saveSiteChildItem("protocols",ref.id,payload,selectedSite);
    const embeddedOk=childOk ? true : await appendEmbeddedSiteItem("protocolHistory",payload,selectedSite);
    appendSiteLocalArray("protocolHistory",payload,selectedSite,120);
    await appendEmbeddedSiteItem("protocolRefs",{
      _id:ref.id,
      siteId:payload.siteId,
      siteKey:payload.siteKey,
      firebaseDocId:payload.firebaseDocId,
      date:payload.date,
      createdAt:payload.createdAt
    },selectedSite);
    try{
      const standalonePayload={
        ...payload,
        updatedAt:serverTimestamp ? serverTimestamp() : (payload.updatedAt || new Date().toISOString())
      };
      if(!editing) standalonePayload.createdAt=serverTimestamp ? serverTimestamp() : payload.createdAt;
      await setDoc(ref,standalonePayload,{merge:true});
    }catch(e){
      console.warn("Samostatný protokol se neuložil, používám kopii pod bodem",e);
      if(!embeddedOk) throw e;
    }
    await updateSiteControlDateFromProtocol(payload,selectedSite,{clearManualStatus:!editing});
    clearProtocolDraft(selectedSite);
    refreshSelectedDetailDataView();
    setProtocolStatusText(editing ? "Protokol upraven." : "Protokol uložen.");
    showSaveConfirmation(editing ? "Protokol upraven." : "Protokol uložen.");
    render();
    if(typeof loadHistory === "function") loadHistory(selectedSite.id);
    closeProtocolFormAfterSave();
  }catch(err){
    saveOffline(err.message);
  }
});
}



const protoDeviceTypeSelectEl=formFieldNode("protoDeviceTypeSelect");
if(protoDeviceTypeSelectEl){
  protoDeviceTypeSelectEl.addEventListener("change",()=>{
    const input=formFieldNode("protoDeviceType");
    resetProtocolTechnicalFieldsForNewDevice();
    if(input) input.value=protoDeviceTypeSelectEl.value;
    updateProtocolSummary();
    setProtocolStatusText("Vybráno zařízení – vyplň údaje pro tento zdroj.");
  });
}

const protoDeviceSelectEl=formFieldNode("protoDeviceSelect");
if(protoDeviceSelectEl){
  protoDeviceSelectEl.addEventListener("change",()=>{
    resetProtocolTechnicalFieldsForNewDevice();
    updateProtocolSummary();
    setProtocolStatusText("Vybrán jiný zdroj – vyplň hodnoty pro tento zdroj.");
  });
}

[
  "protoPlace","protoDeviceType","protoSerial","protoPbzLocation","protoPeriod"
].forEach(id=>{
  const el=formFieldNode(id);
  if(el){
    el.addEventListener("input",updateProtocolSummary);
    el.addEventListener("change",updateProtocolSummary);
  }
});

const selectGalleryPhotosBtn=document.getElementById("selectGalleryPhotosBtn");
if(selectGalleryPhotosBtn && selectGalleryPhotosBtn.tagName==="BUTTON") selectGalleryPhotosBtn.addEventListener("click",()=>document.getElementById("sitePhotosInput")?.click());
const selectCameraPhotosBtn=document.getElementById("selectCameraPhotosBtn");
if(selectCameraPhotosBtn && selectCameraPhotosBtn.tagName==="BUTTON") selectCameraPhotosBtn.addEventListener("click",()=>document.getElementById("siteCameraInput")?.click());
document.addEventListener("change",e=>{
  const target=e.target;
  if(!target || (target.id!=="sitePhotosInput" && target.id!=="siteCameraInput")) return;
  renderSitePhotoPreview();
  const st=document.getElementById("sitePhotosStatus");
  const count=selectedSitePhotoFiles().length;
  if(st && count) st.textContent=`Vybráno fotografií: ${count}.`;
});
document.addEventListener("click",e=>{
  const picker=e.target && e.target.closest ? e.target.closest("[data-photo-picker]") : null;
  if(!picker || picker.tagName!=="BUTTON") return;
  e.preventDefault();
  const inputId=picker.getAttribute("data-photo-picker")==="camera" ? "siteCameraInput" : "sitePhotosInput";
  document.getElementById(inputId)?.click();
});
document.addEventListener("click",e=>{
  const btn=e.target && e.target.closest ? e.target.closest("#uploadSitePhotosBtn") : null;
  if(!btn) return;
  e.preventDefault();
  uploadSitePhotos();
});
document.addEventListener("keydown",e=>{
  const picker=e.target && e.target.closest ? e.target.closest("[data-photo-picker]") : null;
  if(!picker || (e.key!=="Enter" && e.key!==" ")) return;
  e.preventDefault();
  picker.click();
});

let fixMapViewTimer=0;
function scheduleFixMapView(delay=180){
  clearTimeout(fixMapViewTimer);
  fixMapViewTimer=setTimeout(()=>{ if(typeof fixMapView==="function") fixMapView(); },delay);
}
window.addEventListener("resize",()=>scheduleFixMapView());
window.addEventListener("orientationchange",()=>scheduleFixMapView(240));
window.addEventListener("DOMContentLoaded",()=>{
  runAfterTwoPaints(()=>{ if(typeof fixMapView==="function") fixMapView(); });
});
async function refreshFirebaseUnifiedPrimary(){
  await loadEdits();
  await loadDeletedSites();
  if(typeof window.loadFirebaseSitesUnified==="function"){
    await window.loadFirebaseSitesUnified();
    return true;
  }
  return false;
}
let firebaseUnifiedPrimaryLoadPromise=null;
let firebaseUnifiedPrimaryLoadRetryTimer=0;
async function runFirebaseUnifiedPrimaryLoad(){
  if(firebaseUnifiedPrimaryLoadPromise) return firebaseUnifiedPrimaryLoadPromise;
  firebaseUnifiedPrimaryLoadPromise=(async()=>{
    const loaded=await refreshFirebaseUnifiedPrimary();
    if(!loaded) scheduleFirebaseUnifiedPrimaryLoad(1200);
    if(firebaseUnifiedPrimary && typeof scheduleFirebaseRowsAutoReload==="function") scheduleFirebaseRowsAutoReload(12000);
  })().finally(()=>{ firebaseUnifiedPrimaryLoadPromise=null; });
  return firebaseUnifiedPrimaryLoadPromise;
}
function scheduleFirebaseUnifiedPrimaryLoad(delay=0){
  const run=()=>runFirebaseUnifiedPrimaryLoad().catch(e=>console.warn("Primární načtení Firebase selhalo",e));
  if(delay>0){
    clearTimeout(firebaseUnifiedPrimaryLoadRetryTimer);
    firebaseUnifiedPrimaryLoadRetryTimer=setTimeout(()=>{
      firebaseUnifiedPrimaryLoadRetryTimer=0;
      runWhenIdle(run,900);
    },delay);
    return;
  }
  if(firebaseUnifiedPrimaryLoadRetryTimer){
    clearTimeout(firebaseUnifiedPrimaryLoadRetryTimer);
    firebaseUnifiedPrimaryLoadRetryTimer=0;
  }
  runWhenIdle(run,900);
}
let csvLoadPromise=null;
window.loadCsvRowsForMigration=function(){
  if(!PUBLIC_CSV_DATA_ENABLED || !CSV_FILE){
    const message="Veřejný CSV export není v produkční verzi dostupný. Servisní data se načítají po přihlášení z Firebase.";
    const p=document.getElementById("progress");
    if(p) p.textContent=message;
    return Promise.resolve([]);
  }
  if(originalCsvRows.length) return Promise.resolve(originalCsvRows);
  if(csvLoadPromise) return csvLoadPromise;
  csvLoadPromise=new Promise((resolve,reject)=>{
    Papa.parse(CSV_FILE,{download:true,header:true,skipEmptyLines:true,delimiter:"",transformHeader:h=>String(h).replace(/^\uFEFF/,"").trim(),complete:async res=>{
      const data=res.data.filter(r=>Object.values(r).some(v=>safe(v)!==""));
      csvRows=normalize(data);
      originalCsvRows=csvRows.slice();
      populateNewRegionOptions();
      fixMapView();
      if(firebaseUnifiedPrimary){
        const p=document.getElementById("progress");
        if(p) p.textContent="";
        resolve(originalCsvRows);
        return;
      }
      rows=csvRows.map(applyEditToRow);
      filters(); render(); fit();
      document.getElementById("progress").textContent=`Načteno ${rows.length} řádků.`;
      await loadEdits();
      await loadDeletedSites();
      await loadExtraSites();
      resolve(originalCsvRows);
    },error:e=>{
      if(!firebaseUnifiedPrimary) document.getElementById("progress").textContent="Veřejný CSV zdroj není dostupný: "+e;
      reject(e);
    }});
  });
  return csvLoadPromise;
};
if(firebaseUnifiedPrimary){
  scheduleFirebaseUnifiedPrimaryLoad();
}else{
  window.loadCsvRowsForMigration().then(()=>{
    rows=[];
    window.rows=rows;
    filters();
    render();
  }).catch(()=>{});
}

window.addEventListener("DOMContentLoaded",()=>{
  if(typeof window.bindLoginButtons==="function"){
    window.bindLoginButtons();
  }
});
