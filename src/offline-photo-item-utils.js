export function createOfflinePhotoItemHelpers({
  photoDisplayUrl,
  photoFileName,
  safeValue=value=>String(value ?? "").trim()
}={}){
  function safeLocal(value){
    return safeValue(value);
  }

  function displayUrl(item){
    return typeof photoDisplayUrl==="function" ? photoDisplayUrl(item) : "";
  }

  function cloneOfflinePhotoItems(items=[]){
    const source=Array.isArray(items) ? items : [];
    const out=[];
    for(const item of source){
      if(!item) continue;
      out.push(typeof item==="object" ? {...item} : item);
    }
    return out;
  }

  function isPendingOfflinePhotoItem(item){
    return !!(item && (item._offline || item.storageMode==="offline" || item.localOnly));
  }

  function countPendingOfflinePhotoItems(items=[]){
    const source=Array.isArray(items) ? items : [];
    let count=0;
    for(const item of source){
      if(isPendingOfflinePhotoItem(item)) count++;
    }
    return count;
  }

  function displayablePhotoItems(items=[]){
    const out=[];
    const source=Array.isArray(items) ? items : [];
    for(const item of source){
      if(displayUrl(item)) out.push(item);
    }
    return out;
  }

  function collectDisplayablePhotoItemsFromLists(lists=[]){
    const out=[];
    const seen=new Set();
    const sourceLists=Array.isArray(lists) ? lists : [];
    for(const list of sourceLists){
      const source=Array.isArray(list) ? list : [];
      for(const item of source){
        const id=safeLocal(item && item._id);
        if(id && seen.has(id)) continue;
        if(id) seen.add(id);
        if(displayUrl(item)) out.push(item);
      }
    }
    return out;
  }

  function collectPendingOfflinePhotoItems(lists=[]){
    const out=[];
    const seen=new Set();
    const sourceLists=Array.isArray(lists) ? lists : [];
    for(const list of sourceLists){
      const source=Array.isArray(list) ? list : [];
      for(const item of source){
        if(!isPendingOfflinePhotoItem(item)) continue;
        const id=safeLocal(item._id);
        if(id && seen.has(id)) continue;
        if(id) seen.add(id);
        if(displayUrl(item)) out.push(item);
      }
    }
    return out;
  }

  function siteCacheSuffixFromPhoto(item){
    const key=safeLocal(item && item.siteCacheKey);
    return key.startsWith("astipMap:photos:") ? key.slice("astipMap:photos:".length) : "";
  }

  async function offlinePhotoFileFromItem(item){
    const dataUrl=safeLocal(item && (item.fullUrl || item.displayUrl || item.url || item.thumbUrl));
    if(!dataUrl || !dataUrl.startsWith("data:")){
      throw new Error("Lokální fotka nemá uložená obrazová data.");
    }
    const response=await fetch(dataUrl);
    const blob=await response.blob();
    const fileName=typeof photoFileName==="function" ? photoFileName(item || {},0) : "foto.jpg";
    return new File([blob],fileName,{type:blob.type || item.type || "image/jpeg",lastModified:Date.parse(item.takenAt || item.createdAt || "") || Date.now()});
  }

  return {
    cloneOfflinePhotoItems,
    collectDisplayablePhotoItemsFromLists,
    collectPendingOfflinePhotoItems,
    countPendingOfflinePhotoItems,
    displayablePhotoItems,
    isPendingOfflinePhotoItem,
    offlinePhotoFileFromItem,
    siteCacheSuffixFromPhoto
  };
}
