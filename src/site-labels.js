import {
  TEXT_NORM_CACHE_MAX_LENGTH,
  dedupNormCache,
  readTextNormCache,
  rememberTextNormCache,
  safe
} from "./core-utils.js";
import { searchNorm } from "./search-utils.js";

const PLACE_LABEL_RAW_KEYS=["Adresa / umístění","Adresa_GPS","Umístění","Umístění zdroje","Původní adresa / umístění"];
const SOURCE_TYPE_RAW_KEYS=[
  "Popis_zdroje","Zdroj","Jaký zdroj","Kontrolované zařízení","Typ zařízení","Zařízení","Zarizeni",
  "Upravený zdroj"
];
const SOURCE_SERIAL_RAW_KEYS=[
  "Výrobní číslo","Vyrobni cislo","Výrobní_číslo","Vyrobní_číslo","Sériové číslo","Seriove cislo",
  "Serial","Serial number","Zdroj"
];

function defaultDetailKey(r){
  return String((r && (r.firebaseDocId || (r.raw && r.raw["Firebase_doc_id"]) || r.id)) || "");
}

export function siteDedupValue(v){
  const text=safe(v);
  if(text.length<=TEXT_NORM_CACHE_MAX_LENGTH){
    const cached=readTextNormCache(dedupNormCache,text);
    if(cached!==undefined) return cached;
  }
  const normalized=text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\b(ceska republika|slovensko|cr|sr)\b/g," ")
    .replace(/\s+/g," ")
    .trim();
  return text.length<=TEXT_NORM_CACHE_MAX_LENGTH ? rememberTextNormCache(dedupNormCache,text,normalized) : normalized;
}

export function rawValueForAny(raw,keys){
  for(const k of keys){
    const v=raw && raw[k];
    const text=safe(v);
    if(text) return text;
  }
  return "";
}

export function sitePlaceLabel(site){
  const cached=ensureRowPlaceCache(site);
  return cached ? cached.label : computeSitePlaceLabel(site);
}

function sitePlaceParts(site){
  const raw=(site && site.raw) || {};
  const rawPlace=rawValueForAny(raw,PLACE_LABEL_RAW_KEYS);
  const gpsAddress=safe(site && site.gpsAddress);
  const address=safe(site && site.adresa);
  const rawName=safe(raw["Název"]);
  const lat=Number(site && site.lat);
  const lon=Number(site && site.lon);
  const fallback=defaultDetailKey(site) || (site && site.id) || "";
  return {
    label:safe(rawPlace || gpsAddress || address || rawName),
    lat,
    lon,
    fallback,
    fingerprint:[
      rawPlace,
      gpsAddress,
      address,
      rawName,
      Number.isFinite(lat) ? lat.toFixed(5) : "",
      Number.isFinite(lon) ? lon.toFixed(5) : "",
      fallback
    ].join("\u001f")
  };
}

function computeSitePlaceLabel(site,parts=sitePlaceParts(site)){
  return parts.label;
}

function computeSitePlaceGroupKey(site,parts=sitePlaceParts(site)){
  const place=siteDedupValue(parts.label);
  if(place && place.length>=3) return "addr:"+place;
  if(Number.isFinite(parts.lat) && Number.isFinite(parts.lon)) return `gps:${parts.lat.toFixed(5)},${parts.lon.toFixed(5)}`;
  return "single:"+(parts.fallback || "");
}

export function ensureRowPlaceCache(site){
  if(!site || typeof site!=="object") return null;
  const raw=(site && site.raw) || {};
  const parts=sitePlaceParts(site);
  if(site._placeRawRef===raw && site._placeFingerprint===parts.fingerprint && site._placeGroupKey){
    return {label:site._placeLabel || "",groupKey:site._placeGroupKey};
  }
  const label=computeSitePlaceLabel(site,parts);
  const groupKey=computeSitePlaceGroupKey(site,parts);
  site._placeRawRef=raw;
  site._placeFingerprint=parts.fingerprint;
  site._placeLabel=label;
  site._placeGroupKey=groupKey;
  return {label,groupKey};
}

export function sourceTypeTextFromRaw(raw){
  return rawValueForAny(raw,SOURCE_TYPE_RAW_KEYS);
}

export function sourceSerialTextFromRaw(raw){
  return rawValueForAny(raw,SOURCE_SERIAL_RAW_KEYS);
}

function siteSourceParts(site){
  const raw=(site && site.raw) || {};
  const siteType=safe(site && site.zdroj);
  const rawType=sourceTypeTextFromRaw(raw);
  const serial=sourceSerialTextFromRaw(raw);
  return {
    siteType,
    rawType,
    serial,
    fingerprint:[siteType,rawType,serial].join("\u001f")
  };
}

function computeSiteSourceLabel(site,parts=siteSourceParts(site)){
  const type=safe(parts.siteType || parts.rawType);
  const serial=parts.serial;
  if(type && serial && !searchNorm(type).includes(searchNorm(serial))) return `${type} · v.č. ${serial}`;
  return type || (serial ? `Výr. č. ${serial}` : "Zdroj");
}

function computeSiteSourceIdentity(site,parts=siteSourceParts(site)){
  const type=parts.rawType || parts.siteType;
  const serial=parts.serial;
  return searchNorm([type,serial].filter(Boolean).join(" "));
}

export function ensureRowSourceCache(site){
  if(!site || typeof site!=="object") return null;
  const raw=(site && site.raw) || {};
  const parts=siteSourceParts(site);
  if(site._sourceRawRef===raw && site._sourceFingerprint===parts.fingerprint && site._sourceLabel){
    return {label:site._sourceLabel,identity:site._sourceIdentity || ""};
  }
  const label=computeSiteSourceLabel(site,parts);
  const identity=computeSiteSourceIdentity(site,parts);
  site._sourceRawRef=raw;
  site._sourceFingerprint=parts.fingerprint;
  site._sourceLabel=label;
  site._sourceIdentity=identity;
  return {label,identity};
}

export function siteSourceLabel(site){
  const cached=ensureRowSourceCache(site);
  return cached ? cached.label : computeSiteSourceLabel(site);
}

export function siteSourceIdentity(site){
  const cached=ensureRowSourceCache(site);
  return cached ? cached.identity : computeSiteSourceIdentity(site);
}

export function sitePlaceGroupKey(site){
  const cached=ensureRowPlaceCache(site);
  return cached ? cached.groupKey : computeSitePlaceGroupKey(site);
}
