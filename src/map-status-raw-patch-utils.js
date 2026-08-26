import {
  simpleNorm
} from "./core-utils.js";
import {
  MAP_STATUS_COLOR_KEYS,
  MAP_STATUS_TEXT_KEYS,
  ORDERED_STATUS_FLAG_KEYS,
  REPAIR_STATUS_FLAG_KEYS,
  mapStatusColorMatches
} from "./map-status.js";

const STOP_STATUS_FLAG_KEYS=["Stop Stav","Stop stav","Stop_stav","Stop","Zdroj ve Stop Stavu","Odstaveno","Mimo provoz"];
const STOP_STATUS_TEXT_KEYS=MAP_STATUS_TEXT_KEYS;
const STOP_STATUS_COLOR_KEYS=MAP_STATUS_COLOR_KEYS;

function setRawFlagKeys(target={},keys=[],active=false){
  keys.forEach(key=>{
    target[key]=active ? "ANO" : "NE";
  });
  return target;
}

export function rawStatusTextLooksOrdered(value){
  const text=simpleNorm(value);
  return text.includes("objednan") && !text.includes("oprava");
}

export function rawStatusTextLooksRepairOrdered(value){
  const text=simpleNorm(value);
  return text.includes("oprava") && text.includes("objednan");
}

export function rawStatusColorLooksOrdered(value){
  return mapStatusColorMatches({"Barva bodu":value},["eab308","facc15"],["zluta","yellow"]);
}

export function rawStatusColorLooksRepairOrdered(value){
  return mapStatusColorMatches({"Barva bodu":value},["2563eb","3b82f6"],["modra","blue"]);
}

export function clearRawStatusTextWhere(target={},currentRaw={},predicate=()=>false){
  MAP_STATUS_TEXT_KEYS.forEach(key=>{
    if(predicate(currentRaw[key]) || predicate(target[key])) target[key]="";
  });
  return target;
}

export function clearRawStatusColorWhere(target={},currentRaw={},predicate=()=>false){
  MAP_STATUS_COLOR_KEYS.forEach(key=>{
    if(predicate(currentRaw[key]) || predicate(target[key])) target[key]="";
  });
  return target;
}

function setCanonicalRawStatus(target={},status="",color=""){
  target["Stav pro mapu"]=status;
  target["Stav_kontroly"]=status;
  target["Status"]=status;
  if(color){
    target["Barva bodu"]=color;
    target["Barva_bodu"]=color;
  }
  return target;
}

export function mapStatusRawPatchFromStatePatch(patch={},currentRaw={}){
  const rawPatch={};
  if(Object.prototype.hasOwnProperty.call(patch,"repairOrdered")){
    const active=patch.repairOrdered === true;
    setRawFlagKeys(rawPatch,REPAIR_STATUS_FLAG_KEYS,active);
    if(active){
      setRawFlagKeys(rawPatch,ORDERED_STATUS_FLAG_KEYS,false);
      applyStopStatusRawPatch(rawPatch,false,currentRaw);
      setCanonicalRawStatus(rawPatch,"Objednaná oprava","#2563eb");
    }
    if(!active){
      clearRawStatusTextWhere(rawPatch,currentRaw,rawStatusTextLooksRepairOrdered);
      clearRawStatusColorWhere(rawPatch,currentRaw,rawStatusColorLooksRepairOrdered);
    }
  }
  if(Object.prototype.hasOwnProperty.call(patch,"ordered")){
    const active=patch.ordered === true;
    setRawFlagKeys(rawPatch,ORDERED_STATUS_FLAG_KEYS,active);
    if(active){
      setRawFlagKeys(rawPatch,REPAIR_STATUS_FLAG_KEYS,false);
      applyStopStatusRawPatch(rawPatch,false,currentRaw);
      setCanonicalRawStatus(rawPatch,"Kontrola objednaná","#eab308");
    }else{
      clearRawStatusTextWhere(rawPatch,currentRaw,rawStatusTextLooksOrdered);
      clearRawStatusColorWhere(rawPatch,currentRaw,rawStatusColorLooksOrdered);
    }
  }
  if(Object.prototype.hasOwnProperty.call(patch,"stopped")){
    const active=patch.stopped === true;
    if(active){
      setRawFlagKeys(rawPatch,ORDERED_STATUS_FLAG_KEYS,false);
      setRawFlagKeys(rawPatch,REPAIR_STATUS_FLAG_KEYS,false);
    }
    applyStopStatusRawPatch(rawPatch,active,currentRaw);
  }
  return rawPatch;
}

export function rawStatusTextLooksStopped(value){
  const text=simpleNorm(value);
  return text.includes("stop") || text.includes("mimo provoz");
}

export function rawStatusColorLooksStopped(value){
  const compact=simpleNorm(value).replace(/[^a-z0-9#]/g,"");
  const cleanHex=compact.replace(/^#/,"");
  return ["64748b","94a3b8"].includes(cleanHex) || ["seda","gray","grey"].some(word=>compact.includes(word));
}

export function applyStopStatusRawPatch(target={},active=false,currentRaw={}){
  STOP_STATUS_FLAG_KEYS.forEach(key=>{
    target[key]=active ? "ANO" : "NE";
  });
  if(active){
    target["Stav pro mapu"]="Stop Stav";
    target["Stav_kontroly"]="Stop Stav";
    target["Status"]="Stop Stav";
    target["Barva bodu"]="#64748b";
    target["Barva_bodu"]="#64748b";
    return target;
  }
  STOP_STATUS_TEXT_KEYS.forEach(key=>{
    if(rawStatusTextLooksStopped(currentRaw[key]) || rawStatusTextLooksStopped(target[key])){
      target[key]="";
    }
  });
  STOP_STATUS_COLOR_KEYS.forEach(key=>{
    if(rawStatusColorLooksStopped(currentRaw[key]) || rawStatusColorLooksStopped(target[key])){
      target[key]="";
    }
  });
  return target;
}
