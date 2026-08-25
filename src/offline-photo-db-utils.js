const LOCAL_PHOTO_DB_NAME="astipMapLocalPhotos";
const LOCAL_PHOTO_STORE="photos";

export function openLocalPhotoDb(){
  return new Promise((resolve,reject)=>{
    if(!("indexedDB" in window)){
      reject(new Error("IndexedDB není v prohlížeči dostupné."));
      return;
    }
    const req=indexedDB.open(LOCAL_PHOTO_DB_NAME,1);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(LOCAL_PHOTO_STORE)){
        const store=db.createObjectStore(LOCAL_PHOTO_STORE,{keyPath:"_id"});
        store.createIndex("siteCacheKey","siteCacheKey",{unique:false});
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error || new Error("Lokální databázi fotek se nepodařilo otevřít."));
  });
}

export async function withLocalPhotoStore(mode,callback){
  const db=await openLocalPhotoDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(LOCAL_PHOTO_STORE,mode);
    const store=tx.objectStore(LOCAL_PHOTO_STORE);
    let result;
    tx.oncomplete=()=>{db.close();resolve(result);};
    tx.onerror=()=>{db.close();reject(tx.error || new Error("Lokální databáze fotek selhala."));};
    try{
      callback(store,value=>{result=value;});
    }catch(e){
      db.close();
      reject(e);
    }
  });
}
