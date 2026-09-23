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

  async function hydrateOfflinePhotoObjectUrls(items=[]){
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
    await Promise.all(source.map(async item=>{
      if(!item || typeof item!=="object") return;
      const displayRemote=photoDisplayUrl(item);
      const fullRemote=photoFullUrl(item);
      const thumbRemote=photoThumbUrl(item);
      const [display,full,thumb]=await Promise.all([
        cachedObjectUrl(displayRemote),
        cachedObjectUrl(fullRemote),
        cachedObjectUrl(thumbRemote)
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
