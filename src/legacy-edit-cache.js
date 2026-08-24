import { safe } from "./core-utils.js";
import { timeValueFromAny } from "./history-time-utils.js";

export function createLegacyEditCacheHelpers({
  getEditCache,
  rowLookupKeys,
  siteRecordKeys
}={}){
  function editCacheKeyForRow(r){
    return String((r && (r.firebaseDocId || (r.raw && r.raw["Firebase_doc_id"]) || r.id)) || "");
  }
  function legacyEditCacheEntryTime(entry={}){
    return timeValueFromAny(entry.updatedAt || entry.savedAt || entry.createdAt || 0);
  }
  function mergeLegacyEditEntries(entries=[]){
    const source=(entries || []).filter(Boolean);
    if(!source.length) return null;
    source.sort((a,b)=>legacyEditCacheEntryTime(a)-legacyEditCacheEntryTime(b));
    const merged={rawEdits:{}};
    source.forEach(entry=>{
      const rawEdits=entry.rawEdits && typeof entry.rawEdits==="object" ? entry.rawEdits : {};
      Object.assign(merged,entry);
      merged.rawEdits={...(merged.rawEdits || {}),...rawEdits};
    });
    return merged;
  }
  function editCacheKeysForRow(r){
    const raw=(r && r.raw) || {};
    const keys=[];
    const add=value=>{
      const key=safe(value);
      if(key && !keys.includes(key)) keys.push(key);
    };
    add(editCacheKeyForRow(r));
    try{ if(typeof rowLookupKeys==="function") rowLookupKeys(r).forEach(add); }catch(_e){}
    try{ if(typeof siteRecordKeys==="function") siteRecordKeys(r).forEach(add); }catch(_e){}
    [
      r && r.id,
      r && r.firebaseDocId,
      raw["Firebase_doc_id"],
      raw["Klíč_adresy"],
      raw["ID_mista"],
      raw["Původní ID_mista"],
      raw["Původní_id_mista"],
      raw["Původní Klíč_adresy"],
      raw["Původní klíč adresy"],
      raw["Původní_klic_adresy"],
      raw["Puvodni ID_mista"],
      raw["Puvodni_klic_adresy"],
      raw["Název"],
      raw["Adresa / umístění"],
      raw["Adresa_GPS"],
      raw["Umístění"],
      raw["Původní adresa / umístění"]
    ].forEach(add);
    return keys;
  }
  function editCacheEntryForRow(r){
    const editCache=typeof getEditCache==="function" ? (getEditCache() || {}) : {};
    const entries=[];
    const seen=new Set();
    editCacheKeysForRow(r).forEach(key=>{
      const entry=editCache[key];
      if(!entry || seen.has(entry)) return;
      seen.add(entry);
      entries.push(entry);
    });
    return mergeLegacyEditEntries(entries);
  }
  function legacyEditCacheKeysFromEntry(docId,entry={}){
    const rawEdits=(entry && entry.rawEdits) || {};
    const keys=[];
    const add=value=>{
      const key=safe(value);
      if(key && !keys.includes(key)) keys.push(key);
    };
    add(docId);
    [
      entry.firebaseDocId,
      entry.siteDocId,
      entry.siteId,
      entry.siteLegacyId,
      entry.siteKey,
      entry.siteName,
      entry.siteAddress,
      entry.place,
      rawEdits["Firebase_doc_id"],
      rawEdits["Klíč_adresy"],
      rawEdits["ID_mista"],
      rawEdits["Název"],
      rawEdits["Adresa / umístění"],
      rawEdits["Adresa_GPS"],
      rawEdits["Umístění"]
    ].forEach(add);
    if(Array.isArray(entry.siteKeys)) entry.siteKeys.forEach(add);
    return keys;
  }
  function setLegacyEditCacheEntry(docId,entry){
    const editCache=typeof getEditCache==="function" ? getEditCache() : null;
    if(!editCache || typeof editCache!=="object") return;
    const payload=entry && typeof entry==="object" ? entry : {};
    legacyEditCacheKeysFromEntry(docId,payload).forEach(key=>{
      const existing=editCache[key];
      if(!existing || legacyEditCacheEntryTime(payload)>=legacyEditCacheEntryTime(existing)){
        editCache[key]=payload;
      }
    });
  }
  return {
    editCacheKeyForRow,
    editCacheEntryForRow,
    setLegacyEditCacheEntry
  };
}
