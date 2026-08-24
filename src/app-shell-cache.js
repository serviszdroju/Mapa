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

export function currentAppShellUrls(baseUrls=APP_SHELL_URLS){
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

export function cachedPostAppShellUrlsToServiceWorker(registration,urls){
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
