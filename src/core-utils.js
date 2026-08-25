export function safe(v){return String(v ?? "").trim();}

export function esc(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

export function num(v){
  if(v===null || v===undefined || v==="") return null;
  const n=Number(String(v).trim().replace(",","."));
  return Number.isFinite(n) ? n : null;
}

export function stableSignaturePart(value){
  const text=String(value ?? "");
  return `${text.length}:${text}`;
}

export function stableSignature(parts=[]){
  const source=Array.isArray(parts) ? parts : [];
  let signature="";
  for(let i=0;i<source.length;i++){
    if(i) signature+="\u001f";
    signature+=stableSignaturePart(source[i]);
  }
  return signature;
}

export function sameArrayValues(a=[],b=[]){
  if(a===b) return true;
  if(!Array.isArray(a) || !Array.isArray(b) || a.length!==b.length) return false;
  for(let i=0;i<a.length;i++){
    if(a[i]!==b[i]) return false;
  }
  return true;
}

export function makeLocalRecordId(prefix="local",cryptoSource=typeof window!=="undefined" ? window.crypto : null){
  if(cryptoSource && typeof cryptoSource.randomUUID==="function") return cryptoSource.randomUUID();
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

const TEXT_NORM_CACHE_LIMIT=1200;
export const TEXT_NORM_CACHE_MAX_LENGTH=240;
const simpleNormCache=new Map();
export const searchNormCache=new Map();
export const regionNormCache=new Map();
export const dedupNormCache=new Map();
const rowKeyLookupCache=new WeakMap();

export function readTextNormCache(cache,key){
  if(!cache.has(key)) return undefined;
  const value=cache.get(key);
  cache.delete(key);
  cache.set(key,value);
  return value;
}

export function rememberTextNormCache(cache,key,value){
  cache.set(key,value);
  if(cache.size>TEXT_NORM_CACHE_LIMIT){
    const firstKey=cache.keys().next().value;
    if(firstKey!==undefined) cache.delete(firstKey);
  }
  return value;
}

function normalizedRowKeyName(n){
  return String(n).replace(/^\uFEFF/,"").trim().toLowerCase();
}

function normalizedRowKeyLookup(r){
  if(!r || (typeof r!=="object" && typeof r!=="function")) return null;
  const keys=Object.keys(r);
  const signature=keys.join("\u001f");
  const cached=rowKeyLookupCache.get(r);
  if(cached && cached.signature===signature) return cached.map;
  const map=new Map();
  for(const k of keys){
    const normalized=normalizedRowKeyName(k);
    if(!map.has(normalized)) map.set(normalized,k);
  }
  rowKeyLookupCache.set(r,{signature,map});
  return map;
}

export function get(r,n){
  if(!r) return "";
  if(r[n]!==undefined) return r[n];
  const lookup=normalizedRowKeyLookup(r);
  if(!lookup) return "";
  const k=lookup.get(normalizedRowKeyName(n));
  return k!==undefined ? r[k] : "";
}

export function first(r,a){
  for(const n of a){
    const v=safe(get(r,n));
    if(v) return v;
  }
  return "";
}

export function simpleNorm(v){
  const text=String(v || "").trim();
  if(text.length<=TEXT_NORM_CACHE_MAX_LENGTH){
    const cached=readTextNormCache(simpleNormCache,text);
    if(cached!==undefined) return cached;
  }
  const normalized=text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\s+/g," ")
    .trim();
  return text.length<=TEXT_NORM_CACHE_MAX_LENGTH ? rememberTextNormCache(simpleNormCache,text,normalized) : normalized;
}
