const DEFAULT_OBJECT_URL_LIMIT=300;

export function createOfflineMediaObjectUrlHelpers({
  cacheStorage=()=>globalThis.caches,
  createObjectUrl=blob=>URL.createObjectURL(blob),
  isOffline=()=>navigator.onLine===false,
  objectUrlLimit=DEFAULT_OBJECT_URL_LIMIT,
  photoDisplayUrl=()=>"",
  photoFullUrl=()=>"",
  photoThumbUrl=()=>"",
  revokeObjectUrl=url=>URL.revokeObjectURL(url),
  safeValue=value=>String(value ?? "").trim()
}={}){
  const objectUrls=new Map();

  function rememberObjectUrl(key,url){
    objectUrls.set(key,url);
    while(objectUrls.size>objectUrlLimit){
      const oldestKey=objectUrls.keys().next().value;
      const oldestUrl=objectUrls.get(oldestKey);
      objectUrls.delete(oldestKey);
      try{ revokeObjectUrl(oldestUrl); }catch(e){}
    }
    return url;
  }

  function releaseObjectUrls(){
    for(const url of objectUrls.values()){
      try{ revokeObjectUrl(url); }catch(e){}
    }
    objectUrls.clear();
  }

  function releaseUnusedObjectUrls(neededKeys){
    for(const [key,url] of objectUrls){
      if(neededKeys.has(key)) continue;
      objectUrls.delete(key);
      try{ revokeObjectUrl(url); }catch(e){}
    }
  }

  async function cachedObjectUrl(url){
    const key=safeValue(url);
    if(!key || !/^https?:\/\//i.test(key)) return "";
    if(objectUrls.has(key)) return objectUrls.get(key);
    try{
      const storage=cacheStorage();
      if(!storage || typeof storage.match!=="function") return "";
      const response=await storage.match(key);
      if(!response) return "";
      const blob=await response.blob();
      if(!blob || !blob.size) return "";
      return rememberObjectUrl(key,createObjectUrl(blob));
    }catch(e){
      return "";
    }
  }

  async function hydrateOfflinePhotoObjectUrls(items=[],options={}){
    const source=Array.isArray(items) ? items : [];
    if(!isOffline()){
      releaseObjectUrls();
      for(const item of source){
        if(!item || typeof item!=="object") continue;
        delete item._offlineDisplayUrl;
        delete item._offlineFullUrl;
        delete item._offlineThumbUrl;
      }
      return source;
    }
    const activeIndex=Math.max(0,Math.min(Number(options.activeIndex) || 0,Math.max(0,source.length-1)));
    const remoteUrls=source.map(item=>{
      if(!item || typeof item!=="object") return {display:"",full:"",thumb:""};
      delete item._offlineDisplayUrl;
      delete item._offlineFullUrl;
      delete item._offlineThumbUrl;
      return {
        display:photoDisplayUrl(item),
        full:photoFullUrl(item),
        thumb:photoThumbUrl(item)
      };
    });
    const neededKeys=new Set();
    remoteUrls.forEach((urls,index)=>{
      const thumb=safeValue(urls.thumb);
      if(thumb) neededKeys.add(thumb);
      if(index===activeIndex){
        const display=safeValue(urls.display);
        const full=safeValue(urls.full);
        if(display) neededKeys.add(display);
        if(full) neededKeys.add(full);
      }
    });
    releaseUnusedObjectUrls(neededKeys);
    await Promise.all(source.map(async(item,index)=>{
      if(!item || typeof item!=="object") return;
      const urls=remoteUrls[index];
      const thumb=await cachedObjectUrl(urls.thumb);
      if(index!==activeIndex){
        if(thumb) item._offlineThumbUrl=thumb;
        return;
      }
      const [display,full]=await Promise.all([
        cachedObjectUrl(urls.display),
        cachedObjectUrl(urls.full)
      ]);
      const fallback=display || full || thumb;
      if(!fallback) return;
      item._offlineDisplayUrl=display || fallback;
      item._offlineFullUrl=full || display || fallback;
      item._offlineThumbUrl=thumb || display || fallback;
    }));
    return source;
  }

  return {cachedObjectUrl,hydrateOfflinePhotoObjectUrls,releaseObjectUrls};
}
