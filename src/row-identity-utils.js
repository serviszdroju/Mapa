import { safe } from "./core-utils.js";

function uniqueNonEmpty(values=[]){
  return (values || [])
    .map(value=>String(value || "").trim())
    .filter((value,index,array)=>value && array.indexOf(value)===index);
}

export function createRowIdentityHelpers({
  getSelectedSite,
  detailKey,
  sitePlaceGroupKey,
  siteSourceIdentity,
  uniqueNonEmptyStrings
}={}){
  const uniqueStrings=typeof uniqueNonEmptyStrings==="function" ? uniqueNonEmptyStrings : uniqueNonEmpty;
  const selected=site=>site===undefined && typeof getSelectedSite==="function" ? getSelectedSite() : site;
  const detailFor=row=>typeof detailKey==="function" ? detailKey(row) : "";

  function rowLookupKeys(r){
    const raw=(r && r.raw) || {};
    const detail=r ? detailFor(r) : "";
    const id=r && r.id;
    const firebaseDocId=r && r.firebaseDocId;
    const rawFirebaseDocId=raw["Firebase_doc_id"];
    const rawAddressKey=raw["Klíč_adresy"];
    const rawPlaceId=raw["ID_mista"];
    if(r && (typeof r==="object" || typeof r==="function")){
      if(
        r._lookupKeysRawRef===raw &&
        r._lookupKeysDetail===detail &&
        r._lookupKeysId===id &&
        r._lookupKeysFirebaseDocId===firebaseDocId &&
        r._lookupKeysRawFirebaseDocId===rawFirebaseDocId &&
        r._lookupKeysRawAddressKey===rawAddressKey &&
        r._lookupKeysRawPlaceId===rawPlaceId &&
        Array.isArray(r._lookupKeysCache)
      ){
        return r._lookupKeysCache;
      }
      const keys=[
        detail,
        id,
        firebaseDocId,
        rawFirebaseDocId,
        rawAddressKey,
        rawPlaceId
      ].map(x=>String(x || "").trim()).filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
      r._lookupKeysRawRef=raw;
      r._lookupKeysDetail=detail;
      r._lookupKeysId=id;
      r._lookupKeysFirebaseDocId=firebaseDocId;
      r._lookupKeysRawFirebaseDocId=rawFirebaseDocId;
      r._lookupKeysRawAddressKey=rawAddressKey;
      r._lookupKeysRawPlaceId=rawPlaceId;
      r._lookupKeysCache=keys;
      return keys;
    }
    return [
      detail,
      r && r.id,
      r && r.firebaseDocId,
      raw["Firebase_doc_id"],
      raw["Klíč_adresy"],
      raw["ID_mista"]
    ].map(x=>String(x || "").trim()).filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
  }

  function selectedSiteDocId(site=undefined){
    const current=selected(site);
    const raw=(current && current.raw) || {};
    return safe(current && (current.firebaseDocId || raw["Firebase_doc_id"]));
  }

  function siteRecordKeys(site=undefined){
    const current=selected(site);
    const raw=(current && current.raw) || {};
    const docId=safe(current && (current.firebaseDocId || raw["Firebase_doc_id"]));
    const siteDetailKey=current ? detailFor(current) : "";
    const siteIdValue=current && current.id;
    const siteFirebaseDocId=current && current.firebaseDocId;
    const rawFirebaseDocId=raw["Firebase_doc_id"];
    const rawAddressKey=raw["Klíč_adresy"];
    const rawPlaceId=raw["ID_mista"];
    if(
      current && typeof current==="object" &&
      current._recordKeysRawRef===raw &&
      current._recordKeysDetailKey===siteDetailKey &&
      current._recordKeysSiteId===siteIdValue &&
      current._recordKeysSiteFirebaseDocId===siteFirebaseDocId &&
      current._recordKeysRawFirebaseDocId===rawFirebaseDocId &&
      current._recordKeysRawAddressKey===rawAddressKey &&
      current._recordKeysRawPlaceId===rawPlaceId &&
      Array.isArray(current._recordKeysCache)
    ){
      return current._recordKeysCache;
    }
    const values=[
      siteDetailKey,
      siteIdValue,
      docId,
      rawFirebaseDocId,
      rawAddressKey,
      rawPlaceId,
      docId ? `firebase_${docId}` : "",
      docId ? `firebase_site_${docId}` : ""
    ];
    const keys=values
      .map(x=>String(x || "").trim())
      .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
    if(current && typeof current==="object"){
      current._recordKeysRawRef=raw;
      current._recordKeysDetailKey=siteDetailKey;
      current._recordKeysSiteId=siteIdValue;
      current._recordKeysSiteFirebaseDocId=siteFirebaseDocId;
      current._recordKeysRawFirebaseDocId=rawFirebaseDocId;
      current._recordKeysRawAddressKey=rawAddressKey;
      current._recordKeysRawPlaceId=rawPlaceId;
      current._recordKeysCache=keys;
    }
    return keys;
  }

  function siteRecordIdentity(site=undefined){
    const current=selected(site);
    const keys=siteRecordKeys(current);
    const docId=selectedSiteDocId(current);
    const legacyId=safe(current && current.id);
    const canonicalId=docId || legacyId || keys[0] || "";
    const siteKey=keys[0] || canonicalId;
    return {
      siteId:canonicalId,
      siteLegacyId:legacyId,
      siteKey,
      siteDocId:docId,
      firebaseDocId:docId,
      siteKeys:uniqueStrings([canonicalId,siteKey,legacyId,docId,...keys]),
      sourceGroupKey:current && typeof sitePlaceGroupKey==="function" ? sitePlaceGroupKey(current) : "",
      sourceIdentity:current && typeof siteSourceIdentity==="function" ? siteSourceIdentity(current) : "",
      siteName:safe(current && current.adresa),
      siteAddress:safe(current && current.adresa),
      siteSource:safe(current && current.zdroj)
    };
  }

  function siteRecordKeySet(site=undefined){
    const current=selected(site);
    const keys=siteRecordKeys(current);
    if(current && typeof current==="object" && current._recordKeySetKeysRef===keys && current._recordKeySetCache instanceof Set){
      return current._recordKeySetCache;
    }
    const keySet=new Set(keys);
    if(current && typeof current==="object"){
      current._recordKeySetKeysRef=keys;
      current._recordKeySetCache=keySet;
    }
    return keySet;
  }

  return {
    rowLookupKeys,
    selectedSiteDocId,
    siteRecordKeys,
    siteRecordIdentity,
    siteRecordKeySet
  };
}
