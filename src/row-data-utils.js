import {
  first,
  safe
} from "./core-utils.js";

export function siteId(raw,i){
  return first(raw,["Klíč_adresy","ID_mista","Název","Adresa_GPS","Adresa / umístění","Umístění"]) || String(i);
}

export function rawGps(r){
  return Number.isFinite(r.lat) && Number.isFinite(r.lon);
}

export function inCzSk(r){
  return rawGps(r) && r.lat>=47 && r.lat<=51.5 && r.lon>=12 && r.lon<=23;
}

export function daysBetweenToday(dateStr){
  const s=safe(dateStr);
  if(!s) return "";
  const d=new Date(`${s}T00:00:00`);
  if(isNaN(d.getTime())) return "";
  const today=new Date();
  today.setHours(0,0,0,0);
  return Math.round((d.getTime()-today.getTime())/86400000);
}
