export function createFirestoreDeltaHelpers({
  getDb=()=>null,
  getFsMod=()=>null,
  isPermissionDenied=()=>false,
  isFirebaseReady=()=>false,
  isOnline=()=>true,
  runBoundedFirestoreTasks=async tasks=>Promise.allSettled(tasks.map(task=>task())),
  safetyMs=0,
  uniqueNonEmptyStrings=values=>Array.from(new Set((Array.isArray(values) ? values : []).map(value=>String(value ?? "").trim()).filter(Boolean)))
}={}){
  async function readFirestoreDocsUpdatedSince(collectionFactory,fields=[],sinceMs=0,addDocSnap=null,warnLabel="Rozdílový Firestore dotaz",options={}){
    const fsMod=getFsMod();
    const db=getDb();
    if(!isFirebaseReady() || !db || !fsMod || !isOnline() || !sinceMs || typeof addDocSnap!=="function") return 0;
    const {query,where,getDocs,Timestamp}=fsMod;
    if(!query || !where || !getDocs) return 0;
    const cutoffMs=Math.max(0,Number(sinceMs) - safetyMs);
    const cutoffValues=[];
    if(Timestamp && typeof Timestamp.fromMillis==="function") cutoffValues.push(Timestamp.fromMillis(cutoffMs));
    cutoffValues.push(new Date(cutoffMs).toISOString());
    let count=0;
    const tasks=[];
    uniqueNonEmptyStrings(fields).forEach(field=>{
      cutoffValues.forEach(cutoff=>{
        tasks.push(async()=>{
          try{
            const snap=await getDocs(query(collectionFactory(),where(field,">",cutoff)));
            snap.forEach(docSnap=>{
              count++;
              addDocSnap(docSnap);
            });
          }catch(e){
            if(!isPermissionDenied(e)) console.warn(warnLabel,field,e);
          }
        });
      });
    });
    await runBoundedFirestoreTasks(tasks,Number(options.concurrency) || 4,{
      yieldEvery:Number(options.yieldEvery) || 2,
      yieldTimeout:Number(options.yieldTimeout) || 120
    });
    return count;
  }

  return {
    readFirestoreDocsUpdatedSince
  };
}
