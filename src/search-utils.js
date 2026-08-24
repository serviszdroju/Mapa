import {
  TEXT_NORM_CACHE_MAX_LENGTH,
  readTextNormCache,
  rememberTextNormCache,
  safe,
  sameArrayValues,
  searchNormCache
} from "./core-utils.js";

export function searchNorm(v){
  const text=safe(v);
  if(text.length<=TEXT_NORM_CACHE_MAX_LENGTH){
    const cached=readTextNormCache(searchNormCache,text);
    if(cached!==undefined) return cached;
  }
  const normalized=text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\s+/g," ")
    .trim();
  return text.length<=TEXT_NORM_CACHE_MAX_LENGTH ? rememberTextNormCache(searchNormCache,text,normalized) : normalized;
}

const rawSearchTextCache=new WeakMap();

export function rawSearchText(raw={}){
  const source=raw || {};
  if(!source || (typeof source!=="object" && typeof source!=="function")) return String(source ?? "");
  const keys=Object.keys(source);
  const cached=rawSearchTextCache.get(source);
  if(cached && sameArrayValues(cached.keys,keys)){
    let same=true;
    for(let i=0;i<keys.length;i++){
      if(cached.values[i]!==source[keys[i]]){
        same=false;
        break;
      }
    }
    if(same) return cached.text;
  }
  const values=keys.map(key=>source[key]);
  const text=keys.concat(values).join(" ");
  rawSearchTextCache.set(source,{keys,values,text});
  return text;
}

export function rowSearchText(r){
  const raw=(r&&r.raw)||{};
  return [
    r && r.adresa,
    r && r.gpsAddress,
    r && r.zdroj,
    r && r.kontakt,
    r && r.kraj,
    r && r.poznamky,
    r && r.id,
    r && r.firebaseDocId,
    rawSearchText(raw)
  ].join(" ");
}
