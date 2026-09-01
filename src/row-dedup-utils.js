import {
  safe,
  sameArrayValues
} from "./core-utils.js";
import {
  siteDedupValue,
  sourceSerialTextFromRaw,
  sourceTypeTextFromRaw
} from "./site-labels.js";

const siteDedupKeysCache=new WeakMap();
const rawNonEmptyValueCountCache=new WeakMap();

function siteDedupRawParts(raw){
  raw=raw || {};
  return {
    name:raw["Název"],
    address:raw["Adresa / umístění"],
    gpsAddress:raw["Adresa_GPS"],
    location:raw["Umístění"],
    sourceLocation:raw["Umístění zdroje"],
    originalAddress:raw["Původní adresa / umístění"],
    sourceType:sourceTypeTextFromRaw(raw),
    sourceSerial:sourceSerialTextFromRaw(raw)
  };
}

function siteDedupPartsEqual(a={},b={}){
  return a.name===b.name &&
    a.address===b.address &&
    a.gpsAddress===b.gpsAddress &&
    a.location===b.location &&
    a.sourceLocation===b.sourceLocation &&
    a.originalAddress===b.originalAddress &&
    a.sourceType===b.sourceType &&
    a.sourceSerial===b.sourceSerial;
}

export function siteDedupKeysFromRaw(raw){
  if(raw && typeof raw==="object"){
    const parts=siteDedupRawParts(raw);
    const cached=siteDedupKeysCache.get(raw);
    if(cached && siteDedupPartsEqual(cached.parts,parts)) return cached.keys.slice();
    const keys=computeSiteDedupKeysFromRaw(raw,parts);
    siteDedupKeysCache.set(raw,{parts,keys:keys.slice()});
    return keys;
  }
  return computeSiteDedupKeysFromRaw(raw);
}

function computeSiteDedupKeysFromRaw(raw,parts=siteDedupRawParts(raw || {})){
  const keys=[];
  const seen=new Set();
  const sourceParts=[];
  if(parts.sourceType) sourceParts.push(parts.sourceType);
  if(parts.sourceSerial) sourceParts.push(parts.sourceSerial);
  const source=siteDedupValue(sourceParts.join(" "));
  const sourceSerial=siteDedupValue(parts.sourceSerial);
  function addKey(prefix,value){
    const key=source ? `${prefix}_source:${value}|${source}` : `${prefix}:${value}`;
    if(seen.has(key)) return;
    seen.add(key);
    keys.push(key);
  }
  function addSerialKey(prefix,value){
    if(!sourceSerial) return;
    const key=`${prefix}_serial:${value}|${sourceSerial}`;
    if(seen.has(key)) return;
    seen.add(key);
    keys.push(key);
  }
  function add(prefix,v){
    const n=siteDedupValue(v);
    if(!n || n.length<3) return;
    addKey(prefix,n);
    addSerialKey(prefix,n);
    const sorted=n.split(" ").filter(Boolean).sort().join(" ");
    if(sorted && sorted!==n){
      addKey(prefix,"sorted:"+sorted);
      addSerialKey(prefix,"sorted:"+sorted);
    }
  }
  add("name", parts.name);
  add("address",parts.address);
  add("address",parts.gpsAddress);
  add("address",parts.location);
  add("address",parts.sourceLocation);
  add("address",parts.originalAddress);
  return keys;
}

function rawNonEmptyValueCount(raw={}){
  const source=raw || {};
  if(!source || (typeof source!=="object" && typeof source!=="function")){
    return Object.values(source).filter(v=>safe(v)).length;
  }
  const keys=Object.keys(source);
  const cached=rawNonEmptyValueCountCache.get(source);
  if(cached && sameArrayValues(cached.keys,keys)){
    let same=true;
    for(let i=0;i<keys.length;i++){
      if(cached.values[i]!==source[keys[i]]){
        same=false;
        break;
      }
    }
    if(same) return cached.count;
  }
  const values=new Array(keys.length);
  let count=0;
  for(let i=0;i<keys.length;i++){
    const value=source[keys[i]];
    values[i]=value;
    if(safe(value)) count++;
  }
  rawNonEmptyValueCountCache.set(source,{keys,values,count});
  return count;
}

function siteRowPriority(r,index,preferredDocId=null){
  const raw=r.raw || {};
  const data=r.firebaseData || {};
  let score=rawNonEmptyValueCount(raw);
  const docId=String(r.firebaseDocId || raw["Firebase_doc_id"] || r.id || "");
  if(preferredDocId && docId===String(preferredDocId)) score+=100000;
  if(Number.isFinite(r.lat)&&Number.isFinite(r.lon)) score+=20;
  if(data.manualEntry) score+=1000000;
  if(data.createdAt) score+=100;
  if(data.updatedAt) score+=50;
  if(data.migratedFromCsv) score-=1000;
  if(r.firebaseDocId && !String(r.firebaseDocId).startsWith("site_")) score+=500000;
  return {score,index};
}

export function dedupeSiteRows(inputRows,preferredDocId=null){
  const indexed=(inputRows||[]).map((row,index)=>({row,index,priority:siteRowPriority(row,index,preferredDocId)}));
  indexed.sort((a,b)=>b.priority.score-a.priority.score || a.priority.index-b.priority.index);
  const usedKeys=new Map();
  const keep=new Set();
  const duplicateDocIds=[];
  const duplicateRows=[];
  for(const item of indexed){
    const keys=siteDedupKeysFromRaw(item.row.raw || {});
    const matchedKey=keys.find(k=>usedKeys.has(k));
    if(matchedKey){
      const kept=usedKeys.get(matchedKey);
      const raw=item.row.raw || {};
      const keptRaw=(kept && kept.row && kept.row.raw) || {};
      const docId=String(item.row.firebaseDocId || raw["Firebase_doc_id"] || item.row.id || "");
      if(docId) duplicateDocIds.push(docId);
      duplicateRows.push({
        docId,
        id:String(item.row.id || ""),
        title:String(raw["Název"] || raw["Adresa / umístění"] || raw["Adresa_GPS"] || item.row.adresa || ""),
        matchedKey,
        keptDocId:String((kept && kept.row && (kept.row.firebaseDocId || keptRaw["Firebase_doc_id"] || kept.row.id)) || ""),
        keptTitle:String(keptRaw["Název"] || keptRaw["Adresa / umístění"] || keptRaw["Adresa_GPS"] || (kept && kept.row && kept.row.adresa) || "")
      });
      continue;
    }
    keep.add(item.index);
    keys.forEach(k=>usedKeys.set(k,item));
  }
  const dedupedRows=[];
  for(let i=0;i<(inputRows || []).length;i++){
    if(keep.has(i)) dedupedRows.push(inputRows[i]);
  }
  return {
    rows:dedupedRows,
    duplicateDocIds,
    duplicateRows
  };
}
