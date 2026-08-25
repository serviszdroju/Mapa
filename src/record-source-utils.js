export function createRecordSourceHelpers({
  searchNorm,
  siteSourceIdentity
}={}){
  const norm=value=>typeof searchNorm==="function" ? searchNorm(value) : String(value || "").trim().toLowerCase();
  const recordSourceIdentityCache=new WeakMap();

  function recordSourceIdentity(record){
    if(!record) return "";
    const values=[
      record.siteSource,
      record.siteSourceIdentity,
      record.sourceIdentity,
      record.deviceType,
      record.source,
      record.zdroj,
      record.device,
      record.deviceName,
      record.serial,
      record.serialNumber,
      record.vyrobniCislo
    ];
    if(record && (typeof record==="object" || typeof record==="function")){
      const cached=recordSourceIdentityCache.get(record);
      if(
        cached &&
        cached.siteSource===record.siteSource &&
        cached.siteSourceIdentity===record.siteSourceIdentity &&
        cached.sourceIdentity===record.sourceIdentity &&
        cached.deviceType===record.deviceType &&
        cached.source===record.source &&
        cached.zdroj===record.zdroj &&
        cached.device===record.device &&
        cached.deviceName===record.deviceName &&
        cached.serial===record.serial &&
        cached.serialNumber===record.serialNumber &&
        cached.vyrobniCislo===record.vyrobniCislo
      ){
        return cached.identity;
      }
      const identity=norm(values.filter(Boolean).join(" "));
      recordSourceIdentityCache.set(record,{
        siteSource:record.siteSource,
        siteSourceIdentity:record.siteSourceIdentity,
        sourceIdentity:record.sourceIdentity,
        deviceType:record.deviceType,
        source:record.source,
        zdroj:record.zdroj,
        device:record.device,
        deviceName:record.deviceName,
        serial:record.serial,
        serialNumber:record.serialNumber,
        vyrobniCislo:record.vyrobniCislo,
        identity
      });
      return identity;
    }
    return norm(values.filter(Boolean).join(" "));
  }

  function recordSourceMatchesSite(record,site){
    const siteSource=typeof siteSourceIdentity==="function" ? siteSourceIdentity(site) : "";
    const recordSource=recordSourceIdentity(record);
    if(!siteSource || !recordSource) return false;
    return siteSource===recordSource || siteSource.includes(recordSource) || recordSource.includes(siteSource);
  }

  return {
    recordSourceIdentity,
    recordSourceMatchesSite
  };
}
