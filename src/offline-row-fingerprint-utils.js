import {
  sameArrayValues,
  stableSignature
} from "./core-utils.js";
import { szzCompareCsBase } from "./czech-sort-utils.js";

export function createOfflineRowFingerprintHelpers(){
  const rawFingerprintCache=new WeakMap();
  const offlineRowFingerprintCache=new WeakMap();

  function cachedObjectValuesMatch(keys=[],values=[],source={},currentKeys=[]){
    const compareKeys=Array.isArray(currentKeys) ? currentKeys : Object.keys(source || {}).sort(szzCompareCsBase);
    if(!sameArrayValues(keys,compareKeys)) return false;
    for(let i=0;i<keys.length;i++){
      if(values[i]!==source[keys[i]]) return false;
    }
    return true;
  }

  function stableRawFingerprint(raw={}){
    const source=raw || {};
    const keys=Object.keys(source).sort(szzCompareCsBase);
    const cacheable=source && (typeof source==="object" || typeof source==="function");
    if(cacheable){
      const cached=rawFingerprintCache.get(source);
      if(cached && cachedObjectValuesMatch(cached.keys,cached.values,source,keys)) return cached.fingerprint;
    }
    const values=new Array(keys.length);
    let fingerprint="";
    for(let idx=0;idx<keys.length;idx++){
      const key=keys[idx];
      const value=source[key];
      values[idx]=value;
      if(idx) fingerprint+="\u001e";
      fingerprint+=stableSignature([key,value]);
    }
    if(cacheable) rawFingerprintCache.set(source,{keys,values,fingerprint});
    return fingerprint;
  }

  function offlineRowFingerprint(row){
    const raw=row?.raw || {};
    const data=row?.firebaseData || {};
    const rawFingerprint=stableRawFingerprint(raw);
    if(row && (typeof row==="object" || typeof row==="function")){
      const cached=offlineRowFingerprintCache.get(row);
      if(
        cached &&
        cached.firebaseDocId===row.firebaseDocId &&
        cached.id===row.id &&
        cached.updatedAt===data.updatedAt &&
        cached.createdAt===data.createdAt &&
        cached.latestProtocolDate===data.latestProtocolDate &&
        cached.rawFingerprint===rawFingerprint
      ){
        return cached.fingerprint;
      }
      const fingerprint=stableSignature([
        row?.firebaseDocId,
        row?.id,
        data.updatedAt,
        data.createdAt,
        data.latestProtocolDate,
        rawFingerprint
      ]);
      offlineRowFingerprintCache.set(row,{
        firebaseDocId:row.firebaseDocId,
        id:row.id,
        updatedAt:data.updatedAt,
        createdAt:data.createdAt,
        latestProtocolDate:data.latestProtocolDate,
        rawFingerprint,
        fingerprint
      });
      return fingerprint;
    }
    return stableSignature([
      row?.firebaseDocId,
      row?.id,
      data.updatedAt,
      data.createdAt,
      data.latestProtocolDate,
      rawFingerprint
    ]);
  }

  return {
    stableRawFingerprint,
    offlineRowFingerprint
  };
}
