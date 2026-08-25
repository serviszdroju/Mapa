export const SZZ_OFFLINE_QUEUE_DB_NAME="astipMapOfflineQueues";
export const SZZ_OFFLINE_QUEUE_DB_VERSION=2;
export const SZZ_OFFLINE_SITE_QUEUE_STORE="siteQueue";
export const SZZ_OFFLINE_PROTOCOL_QUEUE_STORE="protocolQueue";
export const SZZ_PROTOCOL_DRAFT_STORE="protocolDrafts";

export function openSzzOfflineQueueDb(){
  return new Promise((resolve,reject)=>{
    if(!("indexedDB" in window)){
      reject(new Error("IndexedDB není v prohlížeči dostupné."));
      return;
    }
    const req=indexedDB.open(SZZ_OFFLINE_QUEUE_DB_NAME,SZZ_OFFLINE_QUEUE_DB_VERSION);
    req.onupgradeneeded=()=>{
      const database=req.result;
      if(!database.objectStoreNames.contains(SZZ_OFFLINE_SITE_QUEUE_STORE)){
        database.createObjectStore(SZZ_OFFLINE_SITE_QUEUE_STORE,{keyPath:"docId"});
      }
      if(!database.objectStoreNames.contains(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE)){
        const protocolStore=database.createObjectStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,{keyPath:"_id"});
        protocolStore.createIndex("siteCacheKey","siteCacheKey",{unique:false});
      }
      if(!database.objectStoreNames.contains(SZZ_PROTOCOL_DRAFT_STORE)){
        database.createObjectStore(SZZ_PROTOCOL_DRAFT_STORE,{keyPath:"siteCacheKey"});
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error || new Error("Offline databázi se nepodařilo otevřít."));
  });
}

export async function withSzzOfflineQueueStore(storeName,mode,callback){
  const database=await openSzzOfflineQueueDb();
  return new Promise((resolve,reject)=>{
    const tx=database.transaction(storeName,mode);
    const store=tx.objectStore(storeName);
    let result;
    tx.oncomplete=()=>{database.close();resolve(result);};
    tx.onerror=()=>{database.close();reject(tx.error || new Error("Offline fronta selhala."));};
    try{
      callback(store,value=>{result=value;});
    }catch(e){
      database.close();
      reject(e);
    }
  });
}
