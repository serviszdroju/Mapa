import { safe } from "./core-utils.js";

const SZZ_LOCAL_STATE_CACHE_MS=1800;
const szzLocalStateObjectCache=new Map();

function cloneSzzLocalStateObject(value={}){
  return value && typeof value==="object" && !Array.isArray(value) ? {...value} : {};
}

export function clearSzzLocalStateObjectCache(key=""){
  const clean=safe(key);
  if(!clean){
    szzLocalStateObjectCache.clear();
    return;
  }
  szzLocalStateObjectCache.delete(clean);
}

export function readSzzLocalStateObject(key){
  try{
    const cleanKey=safe(key);
    if(!cleanKey) return {};
    const raw=localStorage.getItem(cleanKey) || "";
    const cached=szzLocalStateObjectCache.get(cleanKey);
    if(cached && cached.raw===raw && Date.now()-cached.savedAt<SZZ_LOCAL_STATE_CACHE_MS){
      return cloneSzzLocalStateObject(cached.item);
    }
    const parsed=JSON.parse(raw || "{}");
    const item=parsed && typeof parsed==="object" ? parsed : {};
    szzLocalStateObjectCache.set(cleanKey,{raw,item:cloneSzzLocalStateObject(item),savedAt:Date.now()});
    return item;
  }catch(e){
    return {};
  }
}

export function writeSzzLocalStateObject(key,item={}){
  const cleanKey=safe(key);
  if(!cleanKey) return cloneSzzLocalStateObject(item);
  const next=cloneSzzLocalStateObject(item);
  const raw=JSON.stringify(next);
  localStorage.setItem(cleanKey,raw);
  szzLocalStateObjectCache.set(cleanKey,{raw,item:cloneSzzLocalStateObject(next),savedAt:Date.now()});
  return next;
}
