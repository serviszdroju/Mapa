const DEFAULT_RUNTIME_CACHE_NAME="astip-szz-v459-runtime";
const DEFAULT_MEDIA_FETCH_CONCURRENCY=4;

export function createOfflinePrefetchItemHelpers({
  safeValue=value=>String(value ?? "").trim(),
  photoDisplayUrl=()=>"",
  photoFullUrl=()=>"",
  photoThumbUrl=()=>"",
  runtimeCacheName=DEFAULT_RUNTIME_CACHE_NAME,
  mediaFetchConcurrency=DEFAULT_MEDIA_FETCH_CONCURRENCY
}={}){
  function embeddedItemsForOffline(site,field,typeLabel,collectionLabel,idPrefix){
    const items=Array.isArray(site?.firebaseData?.[field]) ? site.firebaseData[field] : [];
    const out=[];
    for(let idx=0;idx<items.length;idx++){
      const item=items[idx];
      out.push({
        ...item,
        _type:item?._type || typeLabel || "",
        _collection:item?._collection || collectionLabel || field,
        _id:item?._id || `${idPrefix || field}_${idx}`
      });
    }
    return out;
  }

  function appendOfflineItems(out,items=[]){
    const source=Array.isArray(items) ? items : [];
    for(const item of source) out.push(item);
    return out;
  }

  function appendOfflineChildItemsWithMeta(out,items=[],typeLabel="",collectionLabel=""){
    const source=Array.isArray(items) ? items : [];
    for(const item of source){
      out.push({
        ...item,
        _type:item._type || typeLabel,
        _collection:item._collection || collectionLabel
      });
    }
    return out;
  }

  function offlinePhotoUrls(items=[]){
    const urls=[];
    const seen=new Set();
    const addUrl=url=>{
      const clean=safeValue(url);
      if(clean && /^https?:\/\//i.test(clean) && !seen.has(clean)){
        seen.add(clean);
        urls.push(clean);
      }
    };
    for(const item of (Array.isArray(items) ? items : [])){
      try{
        addUrl(photoDisplayUrl(item));
        addUrl(photoThumbUrl(item));
        addUrl(photoFullUrl(item));
      }catch(e){}
    }
    return urls;
  }

  async function cacheOfflineMediaUrls(urls=[]){
    if(!("caches" in window)) return 0;
    const seen=new Set();
    const unique=[];
    for(const url of (Array.isArray(urls) ? urls : [])){
      const clean=safeValue(url);
      if(clean && /^https?:\/\//i.test(clean) && !seen.has(clean)){
        seen.add(clean);
        unique.push(clean);
      }
    }
    if(!unique.length) return 0;
    const cache=await caches.open(runtimeCacheName);
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
    const workers=[];
    const workerCount=Math.min(mediaFetchConcurrency,unique.length);
    for(let i=0;i<workerCount;i++) workers.push(worker());
    await Promise.allSettled(workers);
    return done;
  }

  return {
    appendOfflineChildItemsWithMeta,
    appendOfflineItems,
    cacheOfflineMediaUrls,
    embeddedItemsForOffline,
    offlinePhotoUrls
  };
}
