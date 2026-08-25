export function createOfflineDetailMetaHelpers({
  storageKey,
  maxAgeMs=1800
}={}){
  const key=String(storageKey || "");
  let cache={raw:null,meta:null,savedAt:0};

  function cloneOfflineDetailMeta(meta={}){
    const source=meta && typeof meta==="object" && !Array.isArray(meta) ? meta : {};
    return {
      ...source,
      sites:source.sites && typeof source.sites==="object" && !Array.isArray(source.sites) ? {...source.sites} : source.sites
    };
  }

  function clearOfflineDetailMetaCache(){
    cache={raw:null,meta:null,savedAt:0};
  }

  function readOfflineDetailMeta(){
    try{
      const raw=localStorage.getItem(key) || "";
      if(
        cache.raw===raw &&
        cache.meta &&
        Date.now()-cache.savedAt<maxAgeMs
      ){
        return cloneOfflineDetailMeta(cache.meta);
      }
      const parsed=JSON.parse(raw || "{}");
      const meta=parsed && typeof parsed==="object" ? parsed : {};
      cache={raw,meta:cloneOfflineDetailMeta(meta),savedAt:Date.now()};
      return meta;
    }catch(e){
      return {};
    }
  }

  function writeOfflineDetailMeta(update={}){
    try{
      const next={...readOfflineDetailMeta(),...update,updatedAt:new Date().toISOString()};
      const raw=JSON.stringify(next);
      localStorage.setItem(key,raw);
      cache={raw,meta:cloneOfflineDetailMeta(next),savedAt:Date.now()};
      return next;
    }catch(e){
      return {...update};
    }
  }

  function bindOfflineDetailMetaStorageListener(target=window){
    if(!target || typeof target.addEventListener!=="function") return;
    target.addEventListener("storage",event=>{
      if(!event.key || event.key===key) clearOfflineDetailMetaCache();
    });
  }

  return {
    clearOfflineDetailMetaCache,
    readOfflineDetailMeta,
    writeOfflineDetailMeta,
    bindOfflineDetailMetaStorageListener
  };
}
