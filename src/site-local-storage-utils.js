import {
  cloneLocalStorageArrayItems,
  cloneLocalStorageObjectItem
} from "./local-storage-clone-utils.js";

export function createSiteLocalStorageHelpers({
  siteLocalCacheKey,
  szzItemsMeta,
  cloneSzzItemsMeta,
  getDefaultSite,
  maxAgeMs=1800
}={}){
  const siteLocalArrayReadCache=new Map();
  const siteLocalObjectReadCache=new Map();

  function defaultSite(){
    return typeof getDefaultSite==="function" ? getDefaultSite() : undefined;
  }

  function cacheKey(kind,site){
    const targetSite=site===undefined ? defaultSite() : site;
    return typeof siteLocalCacheKey==="function" ? siteLocalCacheKey(kind,targetSite) : "";
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

  function clearSiteLocalArrayReadCache(prefixOrKey=""){
    const clean=String(prefixOrKey || "");
    if(!clean){
      siteLocalArrayReadCache.clear();
      return;
    }
    for(const key of siteLocalArrayReadCache.keys()){
      if(key===clean || key.startsWith(clean) || clean.startsWith(key)){
        siteLocalArrayReadCache.delete(key);
      }
    }
  }

  function readSiteLocalArray(kind,site){
    try{
      const key=cacheKey(kind,site);
      const raw=localStorage.getItem(key);
      const cached=siteLocalArrayReadCache.get(key);
      if(cached && cached.raw===raw && Date.now()-cached.savedAt<maxAgeMs){
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

  function readSiteLocalArrayMeta(kind,site){
    const emptyMeta=typeof szzItemsMeta==="function" ? szzItemsMeta([]) : {count:0,latest:0,signature:""};
    try{
      const key=cacheKey(kind,site);
      const raw=localStorage.getItem(key);
      const cached=siteLocalArrayReadCache.get(key);
      if(cached && cached.raw===raw && Date.now()-cached.savedAt<maxAgeMs){
        if(!cached.meta && typeof szzItemsMeta==="function") cached.meta=szzItemsMeta(cached.items);
        return typeof cloneSzzItemsMeta==="function" ? cloneSzzItemsMeta(cached.meta) : cached.meta;
      }
      const items=readSiteLocalArray(kind,site);
      const meta=typeof szzItemsMeta==="function" ? szzItemsMeta(items) : emptyMeta;
      const fresh=siteLocalArrayReadCache.get(key);
      if(fresh && fresh.raw===raw && typeof cloneSzzItemsMeta==="function") fresh.meta=cloneSzzItemsMeta(meta);
      return meta;
    }catch(e){
      return emptyMeta;
    }
  }

  function readSiteLocalObject(kind,site){
    try{
      const key=cacheKey(kind,site);
      const raw=localStorage.getItem(key);
      const cached=siteLocalObjectReadCache.get(key);
      if(cached && cached.raw===raw && Date.now()-cached.savedAt<maxAgeMs){
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

  return {
    clearSiteLocalArrayReadCache,
    clearSiteLocalObjectReadCache,
    readSiteLocalArray,
    readSiteLocalArrayMeta,
    readSiteLocalObject,
    rememberSiteLocalArrayReadCache,
    rememberSiteLocalObjectReadCache
  };
}
