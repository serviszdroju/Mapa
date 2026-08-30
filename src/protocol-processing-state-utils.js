export function createProtocolProcessingStateHelpers({
  clearDetailHistoryCacheForKind,
  clearLocalDetailReadCacheForKind,
  clearLocalStorageArrayEntriesCache,
  clearSiteChildItemsCache,
  getCurrentUser,
  getDb,
  getDetailHistoryItems,
  getFirebaseReady,
  getFsMod,
  getMainProtocolHistoryCurrentItems,
  getSelectedSite,
  mainProtocolProcessedLocalPatch,
  mainProtocolProcessedRemotePatch,
  patchMainProtocolHistoryCacheItems,
  patchProtocolProcessedItems,
  protocolHandoffLocalPatch,
  protocolHandoffRemotePatch,
  rememberProtocolHandoffOverride,
  rememberSiteLocalArrayReadCache,
  safe,
  selectedSiteDocId,
  setDetailHistoryItems,
  setMainProtocolHistoryCurrentItems,
  setSelectedSite,
  uniqueNonEmptyStrings,
  withSzzOfflineQueueStore,
  SZZ_OFFLINE_PROTOCOL_QUEUE_STORE
}){
  function updateLocalProtocolHistoryProcessed(id,checked){
    const cleanId=safe(id);
    if(!cleanId) return 0;
    const patch=mainProtocolProcessedLocalPatch(checked);
    let changed=0;
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(!key || !key.startsWith("astipMap:protocolHistory:")) continue;
        const arr=JSON.parse(localStorage.getItem(key) || "[]");
        if(!Array.isArray(arr)) continue;
        const next=patchProtocolProcessedItems(arr,cleanId,patch,false);
        if(next===arr) continue;
        const raw=JSON.stringify(next);
        localStorage.setItem(key,raw);
        clearLocalStorageArrayEntriesCache(key);
        rememberSiteLocalArrayReadCache(key,next,raw);
        changed++;
      }
    }catch(e){
      console.warn("Lokální označení protokolu jako zpracovaný selhalo",e);
    }
    return changed;
  }

  async function updateOfflineProtocolQueueProcessed(id,checked){
    const cleanId=safe(id);
    if(!cleanId || typeof withSzzOfflineQueueStore!=="function") return false;
    const patch=mainProtocolProcessedLocalPatch(checked);
    try{
      return await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readwrite",(store,setResult)=>{
        const req=store.get(cleanId);
        req.onsuccess=()=>{
          const item=req.result;
          if(!item){
            setResult(false);
            return;
          }
          store.put({...item,...patch});
          setResult(true);
        };
        req.onerror=()=>setResult(false);
      });
    }catch(e){
      return false;
    }
  }

  async function saveMainProtocolProcessedRemote(item={},checked=false){
    const id=safe(item._id || item.id);
    const db=getDb();
    const fsMod=getFsMod();
    if(!id || !getFirebaseReady() || !db || !fsMod || !getCurrentUser() || navigator.onLine===false) return false;
    if(item._offline || /local|indexed/i.test(safe(item._collection))) return false;
    const {doc,setDoc}=fsMod;
    const patch=mainProtocolProcessedRemotePatch(checked);
    const writes=[
      setDoc(doc(db,"protocols",id),patch,{merge:true})
    ];
    const siteDocIds=uniqueNonEmptyStrings([
      item.siteDocId,
      item.firebaseDocId,
      item.siteId && String(item.siteId).startsWith("firebase_") ? String(item.siteId).slice("firebase_".length) : ""
    ]);
    for(const docId of siteDocIds){
      writes.push(setDoc(doc(db,"sitesUnified",docId,"protocols",id),patch,{merge:true}).catch(e=>{
        console.warn("Označení protokolu pod bodem selhalo",docId,e);
      }));
    }
    await Promise.all(writes);
    return true;
  }

  function updateMainProtocolHistoryProcessedState(id,checked){
    const cleanId=safe(id);
    const patch=mainProtocolProcessedLocalPatch(checked);
    setMainProtocolHistoryCurrentItems(patchProtocolProcessedItems(getMainProtocolHistoryCurrentItems(),cleanId,patch,true));
    patchMainProtocolHistoryCacheItems(items=>patchProtocolProcessedItems(items,cleanId,patch,true));
  }

  async function setMainProtocolHistoryProcessed(item={},checked=false){
    const id=safe(item._id || item.id);
    if(!id) throw new Error("Protokol nemá ID.");
    await saveMainProtocolProcessedRemote(item,checked);
    updateLocalProtocolHistoryProcessed(id,checked);
    await updateOfflineProtocolQueueProcessed(id,checked);
    updateMainProtocolHistoryProcessedState(id,checked);
  }

  function updateLocalProtocolHistoryHandoff(id,checked){
    const cleanId=safe(id);
    if(!cleanId) return 0;
    const patch=protocolHandoffLocalPatch(checked);
    let changed=0;
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(!key || !key.startsWith("astipMap:protocolHistory:")) continue;
        const arr=JSON.parse(localStorage.getItem(key) || "[]");
        if(!Array.isArray(arr)) continue;
        const next=patchProtocolProcessedItems(arr,cleanId,patch,false);
        if(next===arr) continue;
        const raw=JSON.stringify(next);
        localStorage.setItem(key,raw);
        clearLocalStorageArrayEntriesCache(key);
        rememberSiteLocalArrayReadCache(key,next,raw);
        changed++;
      }
    }catch(e){
      console.warn("Lokální předání protokolu ke zpracování selhalo",e);
    }
    return changed;
  }

  async function updateOfflineProtocolQueueHandoff(id,checked){
    const cleanId=safe(id);
    if(!cleanId || typeof withSzzOfflineQueueStore!=="function") return false;
    const patch=protocolHandoffLocalPatch(checked);
    try{
      return await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readwrite",(store,setResult)=>{
        const req=store.get(cleanId);
        req.onsuccess=()=>{
          const item=req.result;
          if(!item){
            setResult(false);
            return;
          }
          store.put({...item,...patch});
          setResult(true);
        };
        req.onerror=()=>setResult(false);
      });
    }catch(e){
      return false;
    }
  }

  async function saveProtocolHandoffRemote(item={},checked=false){
    const id=safe(item._id || item.id);
    const db=getDb();
    const fsMod=getFsMod();
    const selectedSite=getSelectedSite();
    if(!id || !getFirebaseReady() || !db || !fsMod || !getCurrentUser() || navigator.onLine===false) return false;
    if(item._offline || /local|indexed/i.test(safe(item._collection))) return false;
    const {doc,setDoc}=fsMod;
    const patch=protocolHandoffRemotePatch(checked);
    const writes=[
      setDoc(doc(db,"protocols",id),patch,{merge:true})
    ];
    const siteDocIds=uniqueNonEmptyStrings([
      item.siteDocId,
      item.firebaseDocId,
      selectedSiteDocId(selectedSite),
      item.siteId && String(item.siteId).startsWith("firebase_") ? String(item.siteId).slice("firebase_".length) : ""
    ]);
    for(const docId of siteDocIds){
      writes.push(setDoc(doc(db,"sitesUnified",docId,"protocols",id),patch,{merge:true}).catch(e=>{
        console.warn("Předání protokolu pod bodem selhalo",docId,e);
      }));
    }
    await Promise.all(writes);
    return true;
  }

  function updateDetailHistoryProtocolHandoffState(id,checked){
    const cleanId=safe(id);
    const patch=protocolHandoffLocalPatch(checked);
    const selectedSite=getSelectedSite();
    setDetailHistoryItems(patchProtocolProcessedItems(getDetailHistoryItems(),cleanId,patch,true));
    setMainProtocolHistoryCurrentItems(patchProtocolProcessedItems(getMainProtocolHistoryCurrentItems(),cleanId,patch,true));
    patchMainProtocolHistoryCacheItems(items=>patchProtocolProcessedItems(items,cleanId,patch,true));
    if(selectedSite?.firebaseData){
      if(Array.isArray(selectedSite.firebaseData.protocolHistory)){
        selectedSite.firebaseData.protocolHistory=patchProtocolProcessedItems(selectedSite.firebaseData.protocolHistory,cleanId,patch,true);
      }
      if(Array.isArray(selectedSite.firebaseData.protocolRefs)){
        selectedSite.firebaseData.protocolRefs=patchProtocolProcessedItems(selectedSite.firebaseData.protocolRefs,cleanId,patch,true);
      }
      setSelectedSite(selectedSite);
    }
    if(typeof clearSiteChildItemsCache==="function") clearSiteChildItemsCache("protocols",selectedSite);
    clearDetailHistoryCacheForKind("protocols",selectedSite);
    clearLocalDetailReadCacheForKind("protocolHistory",selectedSite);
  }

  async function setDetailHistoryProtocolHandoff(item={},checked=false){
    const id=safe(item._id || item.id);
    if(!id) throw new Error("Protokol nemá ID.");
    await saveProtocolHandoffRemote(item,checked);
    rememberProtocolHandoffOverride(id,checked,item);
    updateLocalProtocolHistoryHandoff(id,checked);
    await updateOfflineProtocolQueueHandoff(id,checked);
    updateDetailHistoryProtocolHandoffState(id,checked);
  }

  return {
    setDetailHistoryProtocolHandoff,
    setMainProtocolHistoryProcessed,
    updateDetailHistoryProtocolHandoffState,
    updateLocalProtocolHistoryHandoff,
    updateLocalProtocolHistoryProcessed,
    updateMainProtocolHistoryProcessedState,
    updateOfflineProtocolQueueHandoff,
    updateOfflineProtocolQueueProcessed,
    saveMainProtocolProcessedRemote,
    saveProtocolHandoffRemote
  };
}
