const TEXT_NORM_CACHE_LIMIT=1200;
const TEXT_NORM_CACHE_MAX_LENGTH=240;
const simpleNormCache=new Map();
const rowKeyLookupCache=new WeakMap();
const rowSimpleKeyLookupCache=new WeakMap();

function safe(v){return String(v ?? "").trim();}

function rememberTextNormCache(cache,key,value){
  cache.set(key,value);
  if(cache.size>TEXT_NORM_CACHE_LIMIT){
    const firstKey=cache.keys().next().value;
    if(firstKey!==undefined) cache.delete(firstKey);
  }
  return value;
}

function simpleNorm(v){
  const text=String(v || "").trim();
  if(text.length<=TEXT_NORM_CACHE_MAX_LENGTH && simpleNormCache.has(text)){
    const cached=simpleNormCache.get(text);
    simpleNormCache.delete(text);
    simpleNormCache.set(text,cached);
    return cached;
  }
  const normalized=text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[_\/\\,.;:()\-]+/g," ")
    .replace(/\s+/g," ")
    .trim();
  return text.length<=TEXT_NORM_CACHE_MAX_LENGTH ? rememberTextNormCache(simpleNormCache,text,normalized) : normalized;
}

function normalizedRowKeyName(n){return String(n).replace(/^\uFEFF/,"").trim().toLowerCase();}

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

function get(r,n){
  if(!r) return "";
  if(r[n]!==undefined) return r[n];
  const lookup=normalizedRowKeyLookup(r);
  if(!lookup) return "";
  const k=lookup.get(normalizedRowKeyName(n));
  return k!==undefined ? r[k] : "";
}

function first(r,a){
  for(const n of a){
    const v=safe(get(r,n));
    if(v) return v;
  }
  return "";
}

function simpleRowKeyLookup(r){
  if(!r || (typeof r!=="object" && typeof r!=="function")) return null;
  const keys=Object.keys(r);
  const signature=keys.join("\u001f");
  const cached=rowSimpleKeyLookupCache.get(r);
  if(cached && cached.signature===signature) return cached.map;
  const map=new Map();
  for(const k of keys){
    const normalized=simpleNorm(k);
    if(!map.has(normalized)) map.set(normalized,[]);
    map.get(normalized).push(k);
  }
  rowSimpleKeyLookupCache.set(r,{signature,map});
  return map;
}

function yesNoBool(v){
  const n=simpleNorm(v);
  if(["ano","yes","true","1","aktivni"].includes(n)) return true;
  if(["ne","no","false","0",""].includes(n)) return false;
  return n.includes("ano") || n.includes("aktivni");
}

export function yesNoFlagFromRaw(raw,keys){
  for(const k of keys){
    const v=get(raw || {},k);
    if(!safe(v)) continue;
    const n=simpleNorm(v);
    if(["ano","yes","true","1","aktivni"].includes(n)) return true;
    if(["ne","no","false","0"].includes(n)) return false;
    if(n.includes("ano") || n.includes("aktivni")) return true;
    if(n.includes("ne") || n.includes("false")) return false;
  }
  return null;
}

const WATCH_SELF_PRIMARY_KEYS=[
  "Hlídáme sami termín",
  "Hlídáme kontroly sami",
  "Hlídáme termín sami",
  "Hlídat termín sami",
  "Hlidame kontroly sami",
  "Hlidat termin sami",
  "Jezdit hlídáme termín sami"
];
const WATCH_SELF_LEGACY_FLAG_KEYS=[
  "Jezdit bez objednávky",
  "Jezdit bez objednavky",
  "Bez objednávky",
  "Bez objednavky",
  "Růžová",
  "Ruzova"
];
export const WATCH_SELF_RAW_KEYS=[...WATCH_SELF_PRIMARY_KEYS,...WATCH_SELF_LEGACY_FLAG_KEYS];

function watchRawValue(raw,key){
  const source=raw || {};
  const direct=get(source,key);
  if(safe(direct)) return direct;
  const wanted=simpleNorm(key);
  const lookup=simpleRowKeyLookup(source);
  const keys=lookup ? (lookup.get(wanted) || []) : [];
  for(const existingKey of keys){
    if(safe(source[existingKey])) return source[existingKey];
  }
  return "";
}

function yesNoExplicitValue(v){
  const n=simpleNorm(v);
  if(["ano","yes","true","1","aktivni"].includes(n)) return true;
  if(["ne","no","false","0",""].includes(n)) return false;
  if(n.includes("ano") || n.includes("aktivni")) return true;
  if(n.includes("ne") || n.includes("false")) return false;
  return null;
}

function explicitFlagFromKeys(raw,keys){
  let foundYes=false;
  for(const key of keys){
    const value=watchRawValue(raw,key);
    if(!safe(value)) continue;
    const flag=yesNoExplicitValue(value);
    if(flag===false) return false;
    if(flag===true) foundYes=true;
  }
  return foundYes ? true : null;
}

export function explicitWatchSelfFromRaw(raw){
  const primary=explicitFlagFromKeys(raw,WATCH_SELF_PRIMARY_KEYS);
  if(primary!==null) return primary;
  return explicitFlagFromKeys(raw,WATCH_SELF_LEGACY_FLAG_KEYS);
}

export function canonicalWatchSelfValue(raw){
  return explicitWatchSelfFromRaw(raw)===true ? "ano" : "ne";
}

export function applyWatchSelfAliases(raw,value){
  const target=raw || {};
  let flag=yesNoExplicitValue(value);
  if(flag===null) flag=explicitWatchSelfFromRaw(target);
  const yes=flag===true;
  target["Hlídáme sami termín"]=yes ? "ano" : "ne";
  target["Hlídáme kontroly sami"]=yes ? "ano" : "ne";
  target["Hlídáme termín sami"]=yes ? "ano" : "ne";
  target["Hlídat termín sami"]=yes ? "ano" : "ne";
  target["Jezdit bez objednávky"]=yes ? "ANO" : "NE";
  target["Jezdit bez objednavky"]=yes ? "ANO" : "NE";
  target["Bez objednávky"]=yes ? "ANO" : "NE";
  target["Bez objednavky"]=yes ? "ANO" : "NE";
  target["Růžová"]=yes ? "ANO" : "NE";
  target["Ruzova"]=yes ? "ANO" : "NE";
  return target;
}

export function stopFlagFromRaw(raw){
  const keys=["Stop Stav","Stop stav","Stop_stav","Stop","Zdroj ve Stop Stavu","Odstaveno","Mimo provoz"];
  for(const k of keys){
    const v=get(raw || {},k);
    if(safe(v)) return yesNoBool(v) || simpleNorm(v).includes("stop") || simpleNorm(v).includes("mimo provoz");
  }
  const stav=first(raw || {},["Stav","Stav_kontroly","Stav pro mapu","Status"]);
  return simpleNorm(stav).includes("stop") || simpleNorm(stav).includes("mimo provoz");
}

const MAP_STATUS_RAW_KEYS=[
  "Kontrola objednaná",
  "Kontrola_objednaná",
  "Kontrola objednana",
  "Objednáno",
  "Objednano",
  "Ordered",
  "Objednaná oprava",
  "Objednana oprava",
  "Oprava objednaná",
  "Oprava objednana",
  "Objednáno oprava",
  "Objednano oprava",
  "Repair ordered",
  "Stop Stav",
  "Stop stav",
  "Stop_stav",
  "Stop",
  "Zdroj ve Stop Stavu",
  "Odstaveno",
  "Mimo provoz",
  "Stav",
  "Stav_kontroly",
  "Stav kontroly",
  "Stav pro mapu",
  "Status",
  "Barva bodu",
  "Barva_bodu",
  "Barva",
  "Marker color",
  "MarkerColor"
];
export const ORDERED_STATUS_FLAG_KEYS=["Kontrola objednaná","Kontrola_objednaná","Kontrola objednana","Objednáno","Objednano","Ordered"];
export const REPAIR_STATUS_FLAG_KEYS=["Objednaná oprava","Objednana oprava","Oprava objednaná","Oprava objednana","Objednáno oprava","Objednano oprava","Repair ordered"];
export const MAP_STATUS_TEXT_KEYS=["Stav pro mapu","Stav_kontroly","Stav kontroly","Status"];
export const MAP_STATUS_COLOR_KEYS=["Barva bodu","Barva_bodu","Barva","Marker color","MarkerColor"];

export function restoreFirebaseMapStatusRawValues(target={},source={}){
  const out=target || {};
  const raw=source || {};
  MAP_STATUS_RAW_KEYS.forEach(key=>{
    if(Object.prototype.hasOwnProperty.call(raw,key)) out[key]=raw[key];
    else delete out[key];
  });
  return out;
}

export function mapStatusRawText(raw={}){
  return MAP_STATUS_RAW_KEYS
    .map(key=>get(raw || {},key))
    .filter(value=>safe(value))
    .map(simpleNorm)
    .join(" | ");
}

export function mapStatusColorValue(raw={}){
  return simpleNorm(first(raw || {},["Barva bodu","Barva_bodu","Barva","Marker color","MarkerColor"]));
}

export function mapStatusColorMatches(raw={},hexValues=[],words=[]){
  const color=mapStatusColorValue(raw);
  if(!color) return false;
  const compact=color.replace(/[^a-z0-9#]/g,"");
  const cleanHex=compact.replace(/^#/,"");
  return hexValues.includes(cleanHex) || words.some(word=>compact.includes(word));
}

export function mapStatusRawFingerprint(raw={}){
  return MAP_STATUS_RAW_KEYS
    .map(key=>safe(get(raw || {},key)))
    .map(value=>`${value.length}:${value}`)
    .join("\u001e");
}

export function orderedFlagFromRaw(raw){
  const explicit=yesNoFlagFromRaw(raw || {},ORDERED_STATUS_FLAG_KEYS);
  if(explicit!==null) return explicit;
  const text=mapStatusRawText(raw);
  return text.includes("objednan") && !text.includes("oprava");
}

export function repairOrderFlagFromRaw(raw){
  for(const k of REPAIR_STATUS_FLAG_KEYS){
    const v=get(raw || {},k);
    if(safe(v)) return yesNoBool(v) || simpleNorm(v).includes("objednan");
  }
  const text=[
    mapStatusRawText(raw),
    get(raw || {},"Poznámky"),
    get(raw || {},"Poznámky_mapy")
  ].map(simpleNorm).join(" | ");
  return text.includes("objednana oprava") || text.includes("objednana servisni oprava") || text.includes("oprava objednana");
}
