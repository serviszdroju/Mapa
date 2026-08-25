const DEFAULT_UPSERT_BATCH_SIZE=24;
const DEFAULT_CACHE_DEFER_MS=1800;

export function createOfflineMapDeltaSyncHelpers({
  cacheCurrentRowsForOffline=()=>{},
  getDb=()=>null,
  getFsMod=()=>null,
  isFirebaseReady=()=>false,
  isOnline=()=>true,
  readFirestoreDocsUpdatedSince=async()=>{},
  rowFromDocSnap=()=>null,
  rowKey=row=>String(row && (row.firebaseDocId || row.id) || "").trim(),
  runWhenIdle=(callback,delay)=>setTimeout(callback,delay || 0),
  upsertChangedRows=async()=>{},
  waitForFirebaseUser=async()=>null,
  cacheDeferMs=DEFAULT_CACHE_DEFER_MS,
  upsertBatchSize=DEFAULT_UPSERT_BATCH_SIZE
}={}){
  async function syncOfflineMapRowDeltas(sinceMs=0,options={}){
    const fsMod=getFsMod();
    const db=getDb();
    if(!sinceMs || !isFirebaseReady() || !db || !fsMod || !isOnline()) return [];
    const signedUser=await waitForFirebaseUser(3000);
    if(!signedUser) return [];
    const background=options && options.background===true;
    const {collection}=fsMod;
    const rowsById=new Map();
    await readFirestoreDocsUpdatedSince(
      ()=>collection(db,"sitesUnified"),
      ["updatedAt","createdAt"],
      sinceMs,
      docSnap=>{
        const row=rowFromDocSnap(docSnap);
        if(row) rowsById.set(rowKey(row),row);
      },
      "Rozdílové načtení bodů selhalo",
      {
        concurrency:background ? 2 : 4,
        yieldEvery:1,
        yieldTimeout:background ? 180 : 120
      }
    );
    const changedRows=[...rowsById.values()];
    if(!changedRows.length) return [];
    await upsertChangedRows(changedRows,{background,upsertBatchSize});
    if(background){
      runWhenIdle(()=>cacheCurrentRowsForOffline(),cacheDeferMs);
    }else{
      cacheCurrentRowsForOffline();
    }
    return changedRows;
  }

  return {
    syncOfflineMapRowDeltas
  };
}
