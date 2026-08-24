const SZZ_STORAGE_META_CACHE_MS=5000;
let szzStorageEstimateCache=null;
let szzStorageEstimateCacheAt=0;
let szzPersistentStorageCache=null;
let szzPersistentStorageCacheAt=0;

export function szzBytesLabel(value){
  const bytes=Number(value) || 0;
  if(!bytes) return "";
  if(bytes<1024) return `${bytes} B`;
  if(bytes<1048576) return `${Math.round(bytes/1024)} kB`;
  if(bytes<1073741824) return `${Math.round(bytes/104857.6)/10} MB`;
  return `${Math.round(bytes/107374182.4)/10} GB`;
}

export async function szzStorageEstimate(){
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

export async function requestSzzPersistentStorage(options={}){
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
