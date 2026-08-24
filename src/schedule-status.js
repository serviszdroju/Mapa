import { ORIGINAL_PINK_PLACE_SIGNATURES } from "./app-options.js";
import { first, safe } from "./core-utils.js";
import { explicitWatchSelfFromRaw, mapStatusRawFingerprint } from "./map-status.js";

const PARSE_DATE_VALUE_CACHE_MAX=8000;
const parseDateValueCache=new Map();

function rememberParsedDateValue(key,time){
  parseDateValueCache.set(key,time);
  if(parseDateValueCache.size>PARSE_DATE_VALUE_CACHE_MAX){
    const firstKey=parseDateValueCache.keys().next().value;
    parseDateValueCache.delete(firstKey);
  }
}

export function parseDateValue(v){
  const s=safe(v);
  if(!s) return null;
  if(parseDateValueCache.has(s)){
    const time=parseDateValueCache.get(s);
    return Number.isFinite(time) ? new Date(time) : null;
  }
  let m=s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if(m){
    const d=new Date(Number(m[1]), Number(m[2])-1, Number(m[3]));
    const time=isNaN(d.getTime()) ? null : d.getTime();
    rememberParsedDateValue(s,time);
    return Number.isFinite(time) ? new Date(time) : null;
  }
  m=s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if(m){
    const d=new Date(Number(m[3]), Number(m[2])-1, Number(m[1]));
    const time=isNaN(d.getTime()) ? null : d.getTime();
    rememberParsedDateValue(s,time);
    return Number.isFinite(time) ? new Date(time) : null;
  }
  const d=new Date(s);
  const time=isNaN(d.getTime()) ? null : d.getTime();
  rememberParsedDateValue(s,time);
  return Number.isFinite(time) ? new Date(time) : null;
}

export function formatDateCz(dateObj){
  if(!dateObj || isNaN(dateObj.getTime())) return "";
  return `${dateObj.getDate()}.${dateObj.getMonth()+1}.${dateObj.getFullYear()}`;
}

export function formatDateTimeCz(dateObj){
  if(!dateObj || isNaN(dateObj.getTime())) return "";
  const pad=n=>String(n).padStart(2,"0");
  return `${dateObj.getDate()}.${dateObj.getMonth()+1}.${dateObj.getFullYear()} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
}

export function addMonths(dateObj, months){
  const d=new Date(dateObj.getTime());
  const day=d.getDate();
  d.setMonth(d.getMonth()+months);
  if(d.getDate()!==day) d.setDate(0);
  return d;
}

export const LAST_CHECK_KEYS=["Poslední_kontrola","Poslední proběhlá kontrola","Poslední kontrola","Upravená poslední kontrola"];
export const NEXT_CHECK_KEYS=["Příští_kontrola","Příští plánovaná kontrola","Příští kontrola","Upravená další kontrola"];

function dateDistanceDays(a,b){
  return Math.abs(a.getTime()-b.getTime())/86400000;
}

export function inferControlPeriodMonthsFromDateValues(lastValue,nextValue){
  const last=parseDateValue(lastValue);
  const next=parseDateValue(nextValue);
  if(!last || !next || isNaN(last.getTime()) || isNaN(next.getTime()) || next<=last) return null;
  const sixDiff=dateDistanceDays(addMonths(last,6),next);
  const twelveDiff=dateDistanceDays(addMonths(last,12),next);
  if(sixDiff<=45 && sixDiff<=twelveDiff) return 6;
  if(twelveDiff<=60) return 12;
  const diffDays=(next.getTime()-last.getTime())/86400000;
  if(diffDays>=135 && diffDays<=230) return 6;
  if(diffDays>=300 && diffDays<=430) return 12;
  return null;
}

export function inferControlPeriodMonthsFromDates(raw={}, row={}){
  const last=safe(row && row.posledni) || first(raw,LAST_CHECK_KEYS);
  const next=safe(row && row.pristi) || first(raw,NEXT_CHECK_KEYS);
  return inferControlPeriodMonthsFromDateValues(last,next);
}

export function periodMonths(r){
  const raw=(r && r.raw) || {};
  const dateMonths=inferControlPeriodMonthsFromDates(raw,r || {});
  if(dateMonths) return dateMonths;
  const text=[raw["Zdrojový_soubor"], raw["Zdrojovy_soubor"], raw["Zdroj_dat"], raw["Perioda"], raw["period"], raw["Perioda kontrol"], raw["Perioda_kontrol"], raw["Četnost kontrol"], raw["Perioda zkoušky provozuschopnosti"]].join(" ").toLowerCase();
  if(text.includes("12")) return 12;
  if(text.includes("6")) return 6;
  return 6;
}

export function computedNextDate(r){
  const cached=ensureRowScheduleCache(r);
  if(cached) return Number.isFinite(cached.nextTime) ? new Date(cached.nextTime) : null;
  return computeComputedNextDate(r);
}

function computeComputedNextDate(r){
  const last=parseDateValue(r.posledni);
  if(last) return addMonths(last, periodMonths(r));
  const next=parseDateValue(r.pristi);
  return next;
}

function computeDaysFromDate(next){
  if(!next) return null;
  const today=new Date(); today.setHours(0,0,0,0);
  next.setHours(0,0,0,0);
  return Math.round((next.getTime()-today.getTime())/86400000);
}

export function rowScheduleFingerprint(r){
  const raw=(r && r.raw) || {};
  return [
    r && r.posledni,
    r && r.pristi,
    r && r.stopped,
    r && r.ordered,
    r && r.repairOrdered,
    r && r.noOrder,
    mapStatusRawFingerprint(raw),
    first(raw,LAST_CHECK_KEYS),
    first(raw,NEXT_CHECK_KEYS),
    raw["Hlídáme sami termín"],
    raw["Hlídáme kontroly sami"],
    raw["Hlídáme termín sami"],
    raw["Růžová"],
    raw["Ruzova"],
    raw["Typ"],
    raw["Kategorie"],
    raw["Poznámky"],
    raw["Poznámky_mapy"],
    raw["DŮLEŽITÁ POZNÁMKA"],
    raw["Zdrojový_soubor"],
    raw["Zdrojovy_soubor"],
    raw["Zdroj_dat"],
    raw["Perioda"],
    raw["period"],
    raw["Perioda kontrol"],
    raw["Perioda_kontrol"],
    raw["Četnost kontrol"],
    raw["Perioda zkoušky provozuschopnosti"]
  ].map(v=>String(v ?? "")).join("|");
}

export function ensureRowScheduleCache(r){
  if(!r) return null;
  const fingerprint=rowScheduleFingerprint(r);
  if(r._scheduleCache && r._scheduleFingerprint===fingerprint) return r._scheduleCache;
  const next=computeComputedNextDate(r);
  const days=computeDaysFromDate(next ? new Date(next.getTime()) : null);
  let status="OK / ostatní";
  let markerColor="#16a34a";
  let priority=10;
  if(r.repairOrdered === true){
    status="Objednaná oprava";
    markerColor="#2563eb";
    priority=45;
  }else if(r.ordered === true){
    status="Kontrola objednaná";
    markerColor="#eab308";
    priority=50;
  }else if(r.stopped === true){
    status="Stop Stav";
    markerColor="#64748b";
    priority=30;
  }else if(Number.isFinite(days) && days < 0){
    status="Propadlá kontrola";
    markerColor="#dc2626";
    priority=70;
  }else if(Number.isFinite(days) && days >= 1 && days <= 30){
    status="1–30 dní k termínu";
    markerColor="#f97316";
    priority=60;
  }else if(isNoOrderSite(r)){
    priority=20;
  }
  const pillClass=markerColor==="#dc2626"?"red":markerColor==="#f97316"?"orange":markerColor==="#eab308"?"yellow":markerColor==="#2563eb"?"blue":markerColor==="#64748b"?"gray":"green";
  const cache={
    nextTime:next ? next.getTime() : NaN,
    days,
    display:next ? formatDateCz(next) : (r.pristi || ""),
    color:markerColor,
    status,
    pill:pillClass,
    priority
  };
  r._scheduleFingerprint=fingerprint;
  r._scheduleCache=cache;
  return cache;
}

export function daysToComputedNext(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.days : null;
}

export function displayNext(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.display : (r && r.pristi || "");
}

export function color(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.color : "#16a34a";
}

export function statusText(r){
  const cached=ensureRowScheduleCache(r);
  return cached ? cached.status : "OK / ostatní";
}

export function pill(r){const cached=ensureRowScheduleCache(r);return cached ? cached.pill : "green"}

function normPinkText(s){
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\b(ceska republika|slovensko|cr|sr|okres|kraj|budova|objekt|areal|cp|c p|z s|m s)\b/g," ")
    .replace(/\s+/g," ")
    .trim();
}

function meaningfulTokens(s){
  return normPinkText(s)
    .split(" ")
    .filter(t => t.length >= 3 && !["dps","ldn","ups","astip","strong","minut","min","bud"].includes(t));
}

function pinkHashValue(value){
  let h=2166136261;
  for(const ch of String(value || "")){
    h^=ch.charCodeAt(0);
    h=Math.imul(h,16777619)>>>0;
  }
  return h.toString(36);
}

function pinkSignatureMatch(place, signature){
  const a=normPinkText(place);
  if(!a || !Array.isArray(signature)) return false;
  if(pinkHashValue(a)===signature[0]) return true;
  const at=new Set(meaningfulTokens(a).map(pinkHashValue));
  const bt=Array.isArray(signature[1]) ? signature[1] : [];
  if(!at.size || !bt.length) return false;
  let common=0;
  for(const tokenHash of bt){
    if(at.has(tokenHash)) common++;
  }
  return common>=2 || (bt.length===1 && common===1);
}

export function isNoOrderSite(r){
  const raw=r.raw || {};
  const explicit=explicitWatchSelfFromRaw(raw);
  if(explicit !== null) return explicit === true;

  if(r.noOrder === true) return true;

  const place = [
    r.adresa,
    raw["Název"],
    raw["Adresa_GPS"],
    raw["Adresa / umístění"],
    raw["Umístění"],
    raw["Umístění zdroje"],
    raw["Původní adresa / umístění"]
  ].map(v=>safe(v)).filter(Boolean).join(" | ");

  if(ORIGINAL_PINK_PLACE_SIGNATURES.some(signature => pinkSignatureMatch(place,signature))) return true;

  const text=[
    raw["Růžová"],
    raw["Ruzova"],
    raw["Typ"],
    raw["Kategorie"],
    raw["Poznámky"],
    raw["Poznámky_mapy"],
    raw["DŮLEŽITÁ POZNÁMKA"]
  ].map(v=>safe(v).toLowerCase()).join(" | ");

  return (
    text.includes("bez objednáv") ||
    text.includes("jezdit bez objednáv") ||
    text.includes("jezdit bez objednav") ||
    text.includes("růžov") ||
    text.includes("ruzov")
  );
}
