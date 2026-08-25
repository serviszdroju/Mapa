import {
  cloneLocalStorageArrayItems,
  cloneLocalStorageObjectItem,
  szzArrayWithoutItemId as defaultArrayWithoutItemId
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

export function createSiteLocalStorageMutationHelpers({
  getDefaultSite,
  siteLocalCacheKey,
  readSiteLocalArray,
  rememberSiteLocalArrayReadCache,
  rememberSiteLocalObjectReadCache,
  clearLocalStorageArrayEntriesCache,
  clearLocalStorageObjectEntriesCache,
  clearDetailHistoryCacheForKind,
  siteRecordIdentity,
  uniqueNonEmptyStrings,
  szzArrayWithoutItemId=defaultArrayWithoutItemId,
  safeValue=value=>String(value ?? "").trim()
}={}){
  function defaultSite(){
    return typeof getDefaultSite==="function" ? getDefaultSite() : undefined;
  }

  function targetSite(site){
    return site===undefined ? defaultSite() : site;
  }

  function cacheKey(kind,site){
    return typeof siteLocalCacheKey==="function" ? siteLocalCacheKey(kind,targetSite(site)) : "";
  }

  function identityFor(site){
    return typeof siteRecordIdentity==="function" ? siteRecordIdentity(site) : {};
  }

  function uniqueStrings(values=[]){
    return typeof uniqueNonEmptyStrings==="function"
      ? uniqueNonEmptyStrings(values)
      : Array.from(new Set((Array.isArray(values) ? values : []).map(value=>String(value ?? "").trim()).filter(Boolean)));
  }

  function enrichSiteLocalItem(item,site,identity=null){
    const targetIdentity=identity || (site && item && typeof item==="object" ? identityFor(site) : null);
    if(!targetIdentity) return {...item};
    return {
      ...item,
      siteId:safeValue(item.siteId) || targetIdentity.siteId,
      siteLegacyId:safeValue(item.siteLegacyId) || targetIdentity.siteLegacyId,
      siteDocId:safeValue(item.siteDocId) || targetIdentity.siteDocId,
      firebaseDocId:safeValue(item.firebaseDocId) || targetIdentity.firebaseDocId,
      siteKey:safeValue(item.siteKey) || targetIdentity.siteKey,
      siteKeys:uniqueStrings([...(Array.isArray(item.siteKeys) ? item.siteKeys : []),...(Array.isArray(targetIdentity.siteKeys) ? targetIdentity.siteKeys : [])]),
      sourceGroupKey:safeValue(item.sourceGroupKey) || targetIdentity.sourceGroupKey,
      sourceIdentity:safeValue(item.sourceIdentity) || targetIdentity.sourceIdentity,
      siteName:safeValue(item.siteName) || targetIdentity.siteName,
      siteAddress:safeValue(item.siteAddress) || targetIdentity.siteAddress,
      siteSource:safeValue(item.siteSource) || targetIdentity.siteSource
    };
  }

  function appendSiteLocalArray(kind,item,site=defaultSite(),limit=80){
    const cleanSite=targetSite(site);
    try{
      const arr=typeof readSiteLocalArray==="function" ? readSiteLocalArray(kind,cleanSite) : [];
      const id=safeValue(item && item._id);
      const identity=cleanSite && item && typeof item==="object" ? identityFor(cleanSite) : null;
      const enrichedItem=identity ? enrichSiteLocalItem(item,cleanSite,identity) : {...item};
      let next=szzArrayWithoutItemId(arr,id,safeValue);
      next.push(enrichedItem);
      if(Number.isFinite(limit) && limit>0) next=next.slice(-limit);
      const key=cacheKey(kind,cleanSite);
      const raw=JSON.stringify(next);
      localStorage.setItem(key,raw);
      if(typeof clearLocalStorageArrayEntriesCache==="function") clearLocalStorageArrayEntriesCache(key);
      if(typeof rememberSiteLocalArrayReadCache==="function") rememberSiteLocalArrayReadCache(key,next,raw);
      if(typeof clearDetailHistoryCacheForKind==="function") clearDetailHistoryCacheForKind(kind,cleanSite);
    }catch(e){
      console.warn("Lokální cache se nepodařila uložit",kind,e);
    }
  }

  function mergeSiteLocalArray(kind,items=[],site=defaultSite(),limit=120){
    const cleanSite=targetSite(site);
    try{
      const cleanKind=safeValue(kind);
      if(!cleanKind) return [];
      const incoming=Array.isArray(items) ? items : [];
      const identity=identityFor(cleanSite);
      const enrichedItems=[];
      const incomingIds=new Set();
      const lastIncomingIndexById=new Map();
      for(let idx=0;idx<incoming.length;idx++){
        const item=incoming[idx];
        if(!item || typeof item!=="object") continue;
        const id=safeValue(item._id || item.id) || `${cleanKind}_${Date.now()}_${idx}`;
        const enriched={...enrichSiteLocalItem(item,cleanSite,identity),_id:id};
        lastIncomingIndexById.set(id,enrichedItems.length);
        incomingIds.add(id);
        enrichedItems.push({id,item:enriched});
      }
      if(!enrichedItems.length) return typeof readSiteLocalArray==="function" ? readSiteLocalArray(cleanKind,cleanSite) : [];
      const current=typeof readSiteLocalArray==="function" ? readSiteLocalArray(cleanKind,cleanSite) : [];
      let next=[];
      for(const existing of current){
        if(!incomingIds.has(safeValue(existing && existing._id))) next.push(existing);
      }
      for(let idx=0;idx<enrichedItems.length;idx++){
        const entry=enrichedItems[idx];
        if(lastIncomingIndexById.get(entry.id)===idx) next.push(entry.item);
      }
      if(Number.isFinite(limit) && limit>0) next=next.slice(-limit);
      const key=cacheKey(cleanKind,cleanSite);
      const raw=JSON.stringify(next);
      localStorage.setItem(key,raw);
      if(typeof clearLocalStorageArrayEntriesCache==="function") clearLocalStorageArrayEntriesCache(key);
      if(typeof rememberSiteLocalArrayReadCache==="function") rememberSiteLocalArrayReadCache(key,next,raw);
      if(typeof clearDetailHistoryCacheForKind==="function") clearDetailHistoryCacheForKind(cleanKind,cleanSite);
      return next;
    }catch(e){
      console.warn("Lokální cache se nepodařila sloučit",kind,e);
      return [];
    }
  }

  function removeSiteLocalItem(kind,id,site=defaultSite()){
    const cleanSite=targetSite(site);
    try{
      const cleanId=safeValue(id);
      if(!cleanId) return;
      const current=typeof readSiteLocalArray==="function" ? readSiteLocalArray(kind,cleanSite) : [];
      const next=szzArrayWithoutItemId(current,cleanId,safeValue);
      const key=cacheKey(kind,cleanSite);
      const raw=JSON.stringify(next);
      localStorage.setItem(key,raw);
      if(typeof clearLocalStorageArrayEntriesCache==="function") clearLocalStorageArrayEntriesCache(key);
      if(typeof rememberSiteLocalArrayReadCache==="function") rememberSiteLocalArrayReadCache(key,next,raw);
      if(typeof clearDetailHistoryCacheForKind==="function") clearDetailHistoryCacheForKind(kind,cleanSite);
    }catch(e){
      console.warn("Lokální cache se nepodařila upravit",kind,e);
    }
  }

  function removeLocalStorageArrayItemByKey(key,id){
    const cleanId=safeValue(id);
    if(!key || !cleanId) return;
    try{
      const arr=JSON.parse(localStorage.getItem(key) || "[]");
      if(!Array.isArray(arr)) return;
      const next=szzArrayWithoutItemId(arr,cleanId,safeValue);
      const raw=JSON.stringify(next);
      localStorage.setItem(key,raw);
      if(typeof clearLocalStorageArrayEntriesCache==="function") clearLocalStorageArrayEntriesCache(key);
      if(typeof rememberSiteLocalArrayReadCache==="function") rememberSiteLocalArrayReadCache(key,next,raw);
    }catch(e){}
  }

  function writeSiteLocalObject(kind,item,site=defaultSite()){
    const cleanSite=targetSite(site);
    try{
      const key=cacheKey(kind,cleanSite);
      const value=item && typeof item==="object" && !Array.isArray(item) ? item : {};
      const raw=JSON.stringify(value);
      localStorage.setItem(key,raw);
      if(typeof clearLocalStorageObjectEntriesCache==="function") clearLocalStorageObjectEntriesCache(key);
      if(typeof rememberSiteLocalObjectReadCache==="function") rememberSiteLocalObjectReadCache(key,value,raw);
    }catch(e){
      console.warn("Lokální cache se nepodařila uložit",kind,e);
    }
  }

  return {
    appendSiteLocalArray,
    mergeSiteLocalArray,
    removeLocalStorageArrayItemByKey,
    removeSiteLocalItem,
    writeSiteLocalObject
  };
}
