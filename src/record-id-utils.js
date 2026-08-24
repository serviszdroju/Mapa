import { safe, sameArrayValues } from "./core-utils.js";

const recordIdKeysCache=new WeakMap();

export function recordIdKeys(record){
  if(!record) return [];
  const siteKeys=Array.isArray(record.siteKeys) ? record.siteKeys : [];
  const rawValues=[
    record.siteId,
    record.siteLegacyId,
    record.siteKey,
    record.siteDocId,
    record.firebaseDocId,
    ...siteKeys
  ];
  if(record && (typeof record==="object" || typeof record==="function")){
    const cached=recordIdKeysCache.get(record);
    if(
      cached &&
      cached.siteId===record.siteId &&
      cached.siteLegacyId===record.siteLegacyId &&
      cached.siteKey===record.siteKey &&
      cached.siteDocId===record.siteDocId &&
      cached.firebaseDocId===record.firebaseDocId &&
      sameArrayValues(cached.siteKeys,siteKeys)
    ){
      return cached.keys;
    }
    const keys=rawValues
      .map(x=>String(x || "").trim())
      .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
    recordIdKeysCache.set(record,{
      siteId:record.siteId,
      siteLegacyId:record.siteLegacyId,
      siteKey:record.siteKey,
      siteDocId:record.siteDocId,
      firebaseDocId:record.firebaseDocId,
      siteKeys:siteKeys.slice(),
      keys
    });
    return keys;
  }
  return rawValues
    .map(x=>String(x || "").trim())
    .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
}

export function createRecordIdDedupe(items=[]){
  const ids=new Set();
  const rememberId=id=>{
    const key=safe(id);
    if(!key) return false;
    if(ids.has(key)) return true;
    ids.add(key);
    return false;
  };
  (items || []).forEach(item=>{
    const id=safe(item && item._id);
    if(id) ids.add(id);
  });
  return {
    has:id=>ids.has(safe(id)),
    add:item=>{
      if(!item) return false;
      const duplicate=rememberId(item._id);
      if(duplicate) return false;
      items.push(item);
      return true;
    }
  };
}
