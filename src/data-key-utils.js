import { safe } from "./core-utils.js";

function rememberBoundedStringCache(cache,key,value,maxSize=5000){
  cache.set(key,value);
  if(cache.size>maxSize){
    const firstKey=cache.keys().next().value;
    cache.delete(firstKey);
  }
  return value;
}

function normalizeDataKey(value){
  return String(value||"").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/_/g," ")
    .replace(/\s+/g," ")
    .trim();
}

const DATA_NORM_ALL_CACHE_MAX=5000;
const dataNormAllCache=new Map();
export function dataNormAll(k){
  const key=String(k||"");
  if(dataNormAllCache.has(key)) return dataNormAllCache.get(key);
  return rememberBoundedStringCache(dataNormAllCache,key,normalizeDataKey(key),DATA_NORM_ALL_CACHE_MAX);
}

export function dataLabelAll(k){
  const n=dataNormAll(k);
  if(n==="popis zdroje" || n==="jaky zdroj") return "Typ zdroje";
  if(["vyrobni cislo","vyrobni c.","seriove cislo","sn","serial","vyr. c."].includes(n)) return "Výrobní číslo";
  return k;
}

export function isImportantDataAll(k){
  return dataNormAll(k)==="dulezita poznamka";
}

export function hideOnlyInternalData(k){
  const n=dataNormAll(k);
  if(!n) return true;
  if(n.includes("gps")) return true;
  if(n==="firebase doc id") return true;
  if(n==="id mista") return true;
  if(n==="klic adresy") return true;
  if(n==="zdrojovy kod") return true;
  return false;
}

export function orderedAllDataKeys(raw){
  return Object.keys(raw || {});
}

const DATA_NORM_USER_CACHE_MAX=5000;
const dataNormUserCache=new Map();
export function dataNormUser(k){
  const key=String(k||"");
  if(dataNormUserCache.has(key)) return dataNormUserCache.get(key);
  return rememberBoundedStringCache(dataNormUserCache,key,normalizeDataKey(key),DATA_NORM_USER_CACHE_MAX);
}

export function hideDataUser(k){
  const n=dataNormUser(k);
  if(!n) return true;

  if(n.includes("gps") && n!=="adresa gps") return true;
  if(n==="kontakt mapy") return true;
  if(n==="hlavni kontakt") return true;
  if(n==="poznamky mapy") return true;
  if(n==="umisteni") return true;
  if(n==="jaky zdroj") return true;
  if(n==="stav kontroly") return true;
  if(n==="stav pro mapu") return true;
  if(n==="zdrojovy radek") return true;
  if(n==="jezdit bez objednavky") return true;
  if(n==="bez objednavky") return true;
  if(n==="ruzova") return true;
  if(n==="hlidame termin sami") return true;
  if(n==="hlidat termin sami") return true;

  if(n==="pristi planovana kontrola") return true;
  if(n==="posledni probehla kontrola") return true;
  if(n==="dni do kontroly") return true;
  if(n==="barva bodu") return true;
  if(n==="posledni kontrola") return true;
  if(n==="pristi kontrola") return true;
  if(n==="vsechny terminy") return true;
  if(n==="zdrojovy soubor") return true;
  if(n==="pocet terminu") return true;

  if(n==="zdroj") return true;

  if(n==="firebase doc id") return true;
  if(n==="id mista") return true;
  if(n==="klic adresy") return true;

  if(/^mesic\s*\d*$/.test(n)) return true;
  if(/^month\s*\d*$/.test(n)) return true;
  if(["leden","unor","brezen","duben","kveten","cerven","cervenec","srpen","zari","rijen","listopad","prosinec"].includes(n)) return true;
  if(/^\d{1,2}$/.test(n)) return true;

  return false;
}

export function dataLabelUser(k){
  const n=dataNormUser(k);
  if(n==="adresa gps") return "Umístění zdroje";
  return k;
}

export function dataValueKeyUser(v){
  return String(v||"").trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g," ");
}

export function isNoteUser(k){
  const n=dataNormUser(k);
  return n==="poznamky" || n==="poznamka" || n==="dulezita poznamka" || n==="poznamky mapy";
}

export function orderedDataUser(raw){
  return Object.keys(raw || {});
}

const DATA_NORM_FIXED_CACHE_MAX=5000;
const dataNormFixedCache=new Map();
export function dataNormFixed(k){
  const key=String(k||"");
  if(dataNormFixedCache.has(key)) return dataNormFixedCache.get(key);
  return rememberBoundedStringCache(dataNormFixedCache,key,normalizeDataKey(key),DATA_NORM_FIXED_CACHE_MAX);
}

export function hideDataFixed(k){
  const n=dataNormFixed(k);
  if(!n) return true;

  if(n.includes("gps") && n!=="adresa gps") return true;
  if(n==="kontakt mapy") return true;
  if(n==="hlavni kontakt") return true;
  if(n==="poznamky mapy") return true;
  if(n==="umisteni") return true;
  if(n==="jaky zdroj") return true;
  if(n==="stav kontroly") return true;
  if(n==="stav pro mapu") return true;
  if(n==="zdrojovy radek") return true;
  if(n==="zdroj dat") return true;
  if(n==="jezdit bez objednavky") return true;
  if(n==="bez objednavky") return true;
  if(n==="ruzova") return true;
  if(n==="hlidame termin sami") return true;
  if(n==="hlidat termin sami") return true;
  if(n==="perioda kontrol") return true;

  if(n==="pristi planovana kontrola") return true;
  if(n==="posledni probehla kontrola") return true;
  if(n==="dni do kontroly") return true;
  if(n==="barva bodu") return true;
  if(n==="posledni kontrola") return true;
  if(n==="pristi kontrola") return true;
  if(n==="vsechny terminy") return true;
  if(n==="zdrojovy soubor") return true;
  if(n==="pocet terminu") return true;

  if(n==="firebase doc id") return true;
  if(n==="id mista") return true;
  if(n==="klic adresy") return true;

  if(/^mesic\s*\d*$/.test(n)) return true;
  if(/^month\s*\d*$/.test(n)) return true;
  if(["leden","unor","brezen","duben","kveten","cerven","cervenec","srpen","zari","rijen","listopad","prosinec"].includes(n)) return true;
  if(/^\d{1,2}$/.test(n)) return true;

  return false;
}

export function dataLabelFixed(k){
  const n=dataNormFixed(k);
  if(n==="adresa gps") return "Umístění zdroje";
  if(n==="zdroj") return "Výrobní číslo";
  if(n==="dulezita poznamka") return "Důležité poznámky";
  return k;
}

export function isWatchFixed(k){
  const n=dataNormFixed(k);
  return [
    "hlidame kontroly sami",
    "hlidame sami termin",
    "hlidame termin sami",
    "hlidat termin sami",
    "jezdit hlidame termin sami"
  ].includes(n);
}

export function isNoteFixed(k){
  const n=dataNormFixed(k);
  return n==="dulezita poznamka" || n==="dulezite poznamky";
}

const VAL_NORM_FIXED_CACHE_MAX=5000;
const valNormFixedCache=new Map();
export function valNormFixed(v){
  const key=String(v||"");
  if(valNormFixedCache.has(key)) return valNormFixedCache.get(key);
  const value=key.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g," ");
  return rememberBoundedStringCache(valNormFixedCache,key,value,VAL_NORM_FIXED_CACHE_MAX);
}

export function orderedFixedKeys(raw){
  const keys=Object.keys(raw||{});
  const sourceKey=keys.find(k=>dataNormFixed(k)==="popis zdroje");
  const serialKey=keys.find(k=>dataNormFixed(k)==="zdroj" && safe(raw[k]));
  const out=[];
  let serialInserted=false;

  keys.forEach(k=>{
    if(serialKey && k===serialKey) return;
    if(isWatchFixed(k)) return;
    if(isNoteFixed(k)) return;

    out.push(k);

    if(sourceKey && k===sourceKey && serialKey && !serialInserted){
      out.push(serialKey);
      serialInserted=true;
    }
  });

  if(serialKey && !serialInserted){
    out.push(serialKey);
  }

  return out;
}
