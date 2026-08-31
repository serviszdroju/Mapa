import { get, num, safe } from "./core-utils.js";

export function createSiteFieldLookupHelpers({
  dataNormFixed,
  userSiteDataFields,
  detectControlPeriod,
  getImportantNoteFixed,
  getWatchFixed
}={}){
  const normKey=value=>typeof dataNormFixed==="function"
    ? dataNormFixed(value)
    : String(value || "").trim().toLowerCase();
  const fields=Array.isArray(userSiteDataFields) ? userSiteDataFields : [];
  const userSiteFieldSpecLookupCache=new Map();
  const rowDataNormKeyLookupCache=new WeakMap();
  const siteFieldLookupRawCache=new WeakMap();

  function userSiteFieldSpecByKey(key){
    const target=normKey(key);
    if(userSiteFieldSpecLookupCache.has(target)) return userSiteFieldSpecLookupCache.get(target);
    const spec=fields.find(item=>normKey(item.key)===target || normKey(item.label)===target) || null;
    userSiteFieldSpecLookupCache.set(target,spec);
    return spec;
  }

  function dataNormRowKeyEntries(raw){
    if(!raw || (typeof raw!=="object" && typeof raw!=="function")) return [];
    const keys=Object.keys(raw);
    const signature=keys.join("\u001f");
    const cached=rowDataNormKeyLookupCache.get(raw);
    if(cached && cached.signature===signature) return cached.entries;
    const entries=keys.map(k=>[k,normKey(k)]);
    rowDataNormKeyLookupCache.set(raw,{signature,entries});
    return entries;
  }

  function firstSiteField(raw, keys){
    const source=raw || {};
    for(const k of keys || []){
      const v=safe(get(source,k));
      if(v) return v;
    }
    const wanted=(keys || []).map(k=>normKey(k)).filter(Boolean);
    if(!wanted.length) return "";
    const wantedSet=new Set(wanted);
    for(const [k,n] of dataNormRowKeyEntries(source)){
      if(wantedSet.has(n)){
        const v=safe(source[k]);
        if(v) return v;
      }
    }
    return "";
  }

  function rawForSiteFieldLookup(r){
    const raw=(r && r.raw) || {};
    const rawEdits=(r && r.edit && r.edit.rawEdits) || null;
    if(r && (typeof r==="object" || typeof r==="function")){
      const cached=siteFieldLookupRawCache.get(r);
      if(cached && cached.rawRef===raw && cached.rawEditsRef===rawEdits){
        return cached.value;
      }
      const value=rawEdits ? {...raw,...rawEdits} : {...raw};
      siteFieldLookupRawCache.set(r,{rawRef:raw,rawEditsRef:rawEdits,value});
      return value;
    }
    return rawEdits ? {...raw,...rawEdits} : {...raw};
  }

  function userSiteFieldValue(r, spec, rawOverride=null){
    const raw=rawOverride || rawForSiteFieldLookup(r);
    if(!spec) return "";
    if(spec.type==="period") return typeof detectControlPeriod==="function" ? detectControlPeriod(raw) : "";
    if(spec.key==="Hlídáme sami termín"){
      const value=typeof getWatchFixed==="function" ? getWatchFixed(raw) : "";
      return yesNoFixed(value,"ne");
    }
    if(spec.important) return typeof getImportantNoteFixed==="function" ? getImportantNoteFixed(raw) : "";
    if(spec.key==="Adresa_GPS"){
      const lat=Number.isFinite(r && r.lat) ? r.lat : num(raw["GPS_lat"]);
      const lon=Number.isFinite(r && r.lon) ? r.lon : num(raw["GPS_lon"]);
      if(Number.isFinite(lat) && Number.isFinite(lon)) return `${lat}, ${lon}`;
    }

    let v=firstSiteField(raw, spec.keys);
    if(!v && spec.key==="Název") v=(r && r.adresa) || "";
    if(!v && spec.key==="Adresa / umístění") v=firstSiteField(raw,["Umístění","Umístění zdroje"]);
    if(!v && spec.key==="Kraj") v=(r && r.kraj) || "";
    if(!v && spec.key==="Kontakt") v=(r && r.kontakt) || "";
    if(!v && spec.key==="Popis_zdroje") v=(r && r.zdroj) || "";
    return v;
  }

  function yesNoFixed(v, fallback="ne"){
    const n=normKey(v);
    if(n==="ano" || n==="yes" || n==="true" || n==="1" || n==="aktivni") return "ano";
    if(n==="ne" || n==="no" || n==="false" || n==="0" || n==="") return "ne";
    return fallback;
  }

  return {
    dataNormRowKeyEntries,
    firstSiteField,
    rawForSiteFieldLookup,
    userSiteFieldSpecByKey,
    userSiteFieldValue
  };
}
