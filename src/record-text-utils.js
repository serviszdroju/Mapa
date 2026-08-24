export function createRecordTextHelpers({
  getSelectedSite,
  searchNorm
}={}){
  const selected=site=>site===undefined && typeof getSelectedSite==="function" ? getSelectedSite() : site;
  const norm=value=>typeof searchNorm==="function" ? searchNorm(value) : String(value || "").trim().toLowerCase();
  const recordMatchTextCache=new WeakMap();

  function siteRecordTextKeys(site=undefined){
    const current=selected(site);
    if(!current) return [];
    const raw=current.raw || {};
    const siteAddress=current.adresa;
    const siteGpsAddress=current.gpsAddress;
    const rawName=raw["Název"];
    const rawAddress=raw["Adresa / umístění"];
    const rawGpsAddress=raw["Adresa_GPS"];
    const rawPlace=raw["Umístění"];
    const rawSourcePlace=raw["Umístění zdroje"];
    if(
      current && typeof current==="object" &&
      current._recordTextRawRef===raw &&
      current._recordTextSiteAddress===siteAddress &&
      current._recordTextSiteGpsAddress===siteGpsAddress &&
      current._recordTextRawName===rawName &&
      current._recordTextRawAddress===rawAddress &&
      current._recordTextRawGpsAddress===rawGpsAddress &&
      current._recordTextRawPlace===rawPlace &&
      current._recordTextRawSourcePlace===rawSourcePlace &&
      Array.isArray(current._recordTextKeysCache)
    ){
      return current._recordTextKeysCache;
    }
    const keys=[
      siteAddress,
      siteGpsAddress,
      rawName,
      rawAddress,
      rawGpsAddress,
      rawPlace,
      rawSourcePlace
    ]
      .map(x=>String(x || "").trim())
      .filter((x,idx,arr)=>x.length>=4 && arr.indexOf(x)===idx);
    if(current && typeof current==="object"){
      current._recordTextRawRef=raw;
      current._recordTextSiteAddress=siteAddress;
      current._recordTextSiteGpsAddress=siteGpsAddress;
      current._recordTextRawName=rawName;
      current._recordTextRawAddress=rawAddress;
      current._recordTextRawGpsAddress=rawGpsAddress;
      current._recordTextRawPlace=rawPlace;
      current._recordTextRawSourcePlace=rawSourcePlace;
      current._recordTextKeysCache=keys;
    }
    return keys;
  }

  function siteRecordNormTextKeys(site=undefined){
    const current=selected(site);
    const keys=siteRecordTextKeys(current);
    if(current && typeof current==="object" && current._recordNormTextKeysRef===keys && Array.isArray(current._recordNormTextKeysCache)){
      return current._recordNormTextKeysCache;
    }
    const normalized=keys.map(norm).filter(x=>x.length>=4);
    if(current && typeof current==="object"){
      current._recordNormTextKeysRef=keys;
      current._recordNormTextKeysCache=normalized;
    }
    return normalized;
  }

  function recordMatchTextKeys(record){
    if(!record) return [];
    const values=[record.siteName,record.siteAddress,record.place,record.pbzLocation];
    if(record && (typeof record==="object" || typeof record==="function")){
      const cached=recordMatchTextCache.get(record);
      if(
        cached &&
        cached.siteName===record.siteName &&
        cached.siteAddress===record.siteAddress &&
        cached.place===record.place &&
        cached.pbzLocation===record.pbzLocation
      ){
        return cached.keys;
      }
      const keys=values.map(norm).filter(x=>x.length>=4);
      recordMatchTextCache.set(record,{
        siteName:record.siteName,
        siteAddress:record.siteAddress,
        place:record.place,
        pbzLocation:record.pbzLocation,
        keys
      });
      return keys;
    }
    return values.map(norm).filter(x=>x.length>=4);
  }

  return {
    siteRecordTextKeys,
    siteRecordNormTextKeys,
    recordMatchTextKeys
  };
}
