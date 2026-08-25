const DEFAULT_EQUALITY_FIELDS=["siteId","siteKey","firebaseDocId","siteDocId","siteLegacyId"];
const DEFAULT_TEXT_FIELDS=["siteName","siteAddress","place"];

export function createOfflineStandaloneHistoryHelpers({
  createRecordIdDedupe=items=>({add:item=>items.push(item)}),
  getDb=()=>null,
  getFsMod=()=>null,
  hasMatchingHistoryItemForSite=()=>false,
  isFirebaseReady=()=>false,
  isOnline=()=>true,
  matchingHistoryItemsForSite=(items=[])=>items,
  readFirestoreArrayContainsAny=async()=>false,
  readFirestoreEqualsAny=async()=>false,
  runBoundedFirestoreTasks=async tasks=>Promise.all((tasks || []).map(task=>task())),
  safeValue=value=>String(value==null?"":value).trim(),
  siteRecordEqualityFields=DEFAULT_EQUALITY_FIELDS,
  siteRecordKeys=()=>[],
  siteRecordTextKeys=()=>[],
  textFields=DEFAULT_TEXT_FIELDS
}={}){
  async function readOfflineStandaloneHistoryCollection(site,colName,typeLabel){
    const fsMod=getFsMod();
    const db=getDb();
    if(!isFirebaseReady() || !db || !fsMod || !site || !isOnline()) return [];
    const items=[];
    const itemDedupe=createRecordIdDedupe(items);
    const addDocSnap=docSnap=>{
      const id=safeValue(docSnap && docSnap.id);
      const data=docSnap && docSnap.data ? docSnap.data() : {};
      itemDedupe.add({...data,_type:typeLabel,_collection:colName,_id:id});
    };
    const keys=siteRecordKeys(site);
    const siteKeysBatchOk=await readFirestoreArrayContainsAny(
      fsMod,
      db,
      colName,
      "siteKeys",
      keys,
      addDocSnap,
      `Offline historie dávkový dotaz selhal ${colName}`
    );
    const tasks=[];
    for(const field of siteRecordEqualityFields){
      tasks.push(()=>readFirestoreEqualsAny(
        fsMod,
        db,
        colName,
        field,
        keys,
        addDocSnap,
        `Offline historie rovnostní dotaz selhal ${colName}`
      ));
    }
    if(!siteKeysBatchOk){
      const {collection,query,where,getDocs}=fsMod;
      keys.forEach(id=>{
        tasks.push(async()=>{
          try{
            const snap=await getDocs(query(collection(db,colName),where("siteKeys","array-contains",id)));
            snap.forEach(addDocSnap);
          }catch(e){
            console.warn("Offline historie dotaz selhal",colName,e);
          }
        });
      });
    }
    await runBoundedFirestoreTasks(tasks,6);
    if(!hasMatchingHistoryItemForSite(items,site)){
      const {collection,query,where,getDocs}=fsMod;
      const textTasks=[];
      siteRecordTextKeys(site).slice(0,6).forEach(value=>{
        textFields.forEach(field=>{
          textTasks.push(async()=>{
            try{
              const snap=await getDocs(query(collection(db,colName),where(field,"==",value)));
              snap.forEach(addDocSnap);
            }catch(e){
              console.warn("Offline historie textový dotaz selhal",colName,field,e);
            }
          });
        });
      });
      await runBoundedFirestoreTasks(textTasks,4);
    }
    return matchingHistoryItemsForSite(items,site);
  }

  return {
    readOfflineStandaloneHistoryCollection
  };
}
