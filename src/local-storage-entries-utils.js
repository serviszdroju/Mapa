export function createLocalStorageEntriesHelpers({
  cloneArrayEntries,
  cloneObjectEntries,
  clearSiteArrayReadCache,
  clearSiteObjectReadCache,
  maxAgeMs=1800
}={}){
  const arrayCache=new Map();
  const objectCache=new Map();
  const cloneArrays=typeof cloneArrayEntries==="function" ? cloneArrayEntries : entries=>Array.isArray(entries) ? entries.slice() : [];
  const cloneObjects=typeof cloneObjectEntries==="function" ? cloneObjectEntries : entries=>Array.isArray(entries) ? entries.slice() : [];

  function clearLocalStorageArrayEntriesCache(prefixOrKey=""){
    const clean=String(prefixOrKey || "");
    if(!clean){
      arrayCache.clear();
      if(typeof clearSiteArrayReadCache==="function") clearSiteArrayReadCache();
      return;
    }
    for(const prefix of arrayCache.keys()){
      if(prefix===clean || clean.startsWith(prefix) || prefix.startsWith(clean)){
        arrayCache.delete(prefix);
      }
    }
    if(typeof clearSiteArrayReadCache==="function") clearSiteArrayReadCache(clean);
  }

  function clearLocalStorageObjectEntriesCache(prefixOrKey=""){
    const clean=String(prefixOrKey || "");
    if(!clean){
      objectCache.clear();
      if(typeof clearSiteObjectReadCache==="function") clearSiteObjectReadCache();
      return;
    }
    for(const prefix of objectCache.keys()){
      if(prefix===clean || clean.startsWith(prefix) || prefix.startsWith(clean)){
        objectCache.delete(prefix);
      }
    }
    if(typeof clearSiteObjectReadCache==="function") clearSiteObjectReadCache(clean);
  }

  function localStorageArrayEntries(prefix){
    const cleanPrefix=String(prefix || "");
    const cached=arrayCache.get(cleanPrefix);
    if(cached && cached.length===localStorage.length && Date.now()-cached.savedAt<maxAgeMs){
      return cloneArrays(cached.entries);
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
    arrayCache.set(cleanPrefix,{savedAt:Date.now(),length:localStorage.length,entries:cloneArrays(entries)});
    return entries;
  }

  function localStorageObjectEntries(prefix){
    const cleanPrefix=String(prefix || "");
    const cached=objectCache.get(cleanPrefix);
    if(cached && cached.length===localStorage.length && Date.now()-cached.savedAt<maxAgeMs){
      return cloneObjects(cached.entries);
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
    objectCache.set(cleanPrefix,{savedAt:Date.now(),length:localStorage.length,entries:cloneObjects(entries)});
    return entries;
  }

  return {
    clearLocalStorageArrayEntriesCache,
    clearLocalStorageObjectEntriesCache,
    localStorageArrayEntries,
    localStorageObjectEntries
  };
}
