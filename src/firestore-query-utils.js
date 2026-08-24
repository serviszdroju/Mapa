import { szzYieldToBrowser } from "./scheduler-utils.js";

export function uniqueNonEmptyStrings(values=[]){
  return (Array.isArray(values) ? values : [])
    .map(value=>String(value || "").trim())
    .filter((value,idx,arr)=>value && arr.indexOf(value)===idx);
}

export async function readFirestoreArrayContainsAny(fsMod,database,colName,field,values,addDocSnap,warnLabel="Firestore dotaz"){
  const cleanValues=uniqueNonEmptyStrings(values);
  if(!cleanValues.length || !fsMod || !database || typeof addDocSnap!=="function") return true;
  const {collection,query,where,getDocs}=fsMod;
  if(!collection || !query || !where || !getDocs) return false;
  for(let i=0;i<cleanValues.length;i+=10){
    const chunk=cleanValues.slice(i,i+10);
    try{
      const q=query(collection(database,colName),where(field,"array-contains-any",chunk));
      const snap=await getDocs(q);
      snap.forEach(addDocSnap);
    }catch(e){
      console.warn(warnLabel,field,e);
      return false;
    }
  }
  return true;
}

export async function readFirestoreEqualsAny(fsMod,database,colName,field,values,addDocSnap,warnLabel="Firestore rovnostní dotaz"){
  const cleanValues=uniqueNonEmptyStrings(values);
  if(!cleanValues.length || !fsMod || !database || typeof addDocSnap!=="function") return true;
  const {collection,query,where,getDocs}=fsMod;
  if(!collection || !query || !where || !getDocs) return false;
  let batchOk=true;
  for(let i=0;i<cleanValues.length;i+=10){
    const chunk=cleanValues.slice(i,i+10);
    try{
      const q=query(collection(database,colName),where(field,"in",chunk));
      const snap=await getDocs(q);
      snap.forEach(addDocSnap);
    }catch(e){
      batchOk=false;
      console.warn(warnLabel,field,e);
      break;
    }
  }
  if(batchOk) return true;
  const fallbackTasks=cleanValues.map(value=>async()=>{
    try{
      const q=query(collection(database,colName),where(field,"==",value));
      const snap=await getDocs(q);
      snap.forEach(addDocSnap);
    }catch(e){
      console.warn(warnLabel,field,"fallback",e);
    }
  });
  await runBoundedFirestoreTasks(fallbackTasks,6);
  return false;
}

export async function runBoundedFirestoreTasks(tasks=[],concurrency=6,options={}){
  const queue=(Array.isArray(tasks) ? tasks : []).filter(task=>typeof task==="function");
  if(!queue.length) return;
  const workerCount=Math.max(1,Math.min(concurrency,queue.length));
  let index=0;
  let completed=0;
  const yieldEvery=Math.max(0,Number(options.yieldEvery) || 0);
  const yieldTimeout=Math.max(40,Number(options.yieldTimeout) || 120);
  const workers=Array.from({length:workerCount},async()=>{
    while(index<queue.length){
      const task=queue[index++];
      await task();
      completed++;
      if(yieldEvery && completed%yieldEvery===0) await szzYieldToBrowser(yieldTimeout);
    }
  });
  await Promise.all(workers);
}
