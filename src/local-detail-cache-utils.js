export function readCachedLocalDetailItems({
  cache,
  cloneItems,
  key,
  loader,
  maxAgeMs=1800,
  maxEntries=32
}={}){
  const cleanKey=String(key || "");
  if(!cleanKey || typeof loader!=="function" || !cache) return Promise.resolve([]);
  const clone=typeof cloneItems==="function" ? cloneItems : items=>Array.isArray(items) ? items.slice() : [];
  const now=Date.now();
  const cached=cache.get(cleanKey);
  if(cached && now-cached.savedAt<maxAgeMs){
    if(cached.promise) return cached.promise.then(clone);
    if(Array.isArray(cached.items)) return Promise.resolve(clone(cached.items));
  }
  const promise=Promise.resolve()
    .then(loader)
    .then(items=>{
      const stable=clone(items);
      cache.set(cleanKey,{savedAt:Date.now(),items:stable,promise:null});
      trimOldestCacheEntries(cache,maxEntries,cleanKey);
      return stable;
    },error=>{
      cache.delete(cleanKey);
      throw error;
    });
  cache.set(cleanKey,{savedAt:now,items:null,promise});
  trimOldestCacheEntries(cache,maxEntries,cleanKey);
  return promise.then(clone);
}

export function trimOldestCacheEntries(cache,maxEntries=32,keepKey=""){
  if(!cache || typeof cache.size!=="number") return;
  const limit=Math.max(1,Number(maxEntries) || 32);
  while(cache.size>limit){
    let oldestKey;
    for(const key of cache.keys()){
      if(key!==keepKey){ oldestKey=key; break; }
    }
    if(oldestKey===undefined) oldestKey=cache.keys().next().value;
    if(oldestKey===undefined) break;
    cache.delete(oldestKey);
  }
}

export function clearLocalDetailReadCache(cache,prefixOrKey=""){
  if(!cache) return;
  const clean=String(prefixOrKey || "");
  if(!clean){
    cache.clear();
    return;
  }
  for(const key of cache.keys()){
    if(key===clean || key.startsWith(clean) || clean.startsWith(key)){
      cache.delete(key);
    }
  }
}
