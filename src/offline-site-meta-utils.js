export function createOfflineSiteMetaHelpers({
  detailKey=()=>"",
  readOfflineDetailMeta=()=>({}),
  readSiteLocalArrayMeta=()=>({count:0}),
  safeValue=value=>String(value ?? "").trim(),
  selectedSiteDocId=()=>"",
  writeOfflineDetailMeta=update=>update
}={}){
  function offlineSiteMetaKey(site){
    return selectedSiteDocId(site) || detailKey(site) || safeValue(site?.id);
  }

  function readOfflineSiteMeta(site){
    const key=offlineSiteMetaKey(site);
    const meta=readOfflineDetailMeta();
    return key && meta.sites && meta.sites[key] && typeof meta.sites[key]==="object" ? meta.sites[key] : null;
  }

  function writeOfflineSiteMeta(site,siteMeta={}){
    const key=offlineSiteMetaKey(site);
    if(!key) return null;
    const meta=readOfflineDetailMeta();
    const sites=meta.sites && typeof meta.sites==="object" ? {...meta.sites} : {};
    sites[key]={...(sites[key] || {}),...siteMeta,updatedAt:new Date().toISOString()};
    return writeOfflineDetailMeta({sites});
  }

  function localOfflineDetailMeta(site){
    return {
      protocols:readSiteLocalArrayMeta("protocolHistory",site),
      serviceRecords:readSiteLocalArrayMeta("serviceHistory",site),
      photos:readSiteLocalArrayMeta("photos",site),
      attachments:readSiteLocalArrayMeta("attachments",site)
    };
  }

  return {
    localOfflineDetailMeta,
    offlineSiteMetaKey,
    readOfflineSiteMeta,
    writeOfflineSiteMeta
  };
}
