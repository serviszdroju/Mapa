import { safe } from "./core-utils.js";

export function createSiteLocalKeyHelpers({
  detailKey,
  detailLazyKey,
  getSelectedSite,
  recordSourceIdentity,
  selectedSiteDocId
}={}){
  const selected=site=>site===undefined && typeof getSelectedSite==="function" ? getSelectedSite() : site;

  function siteLocalCacheKey(kind,site=undefined){
    const current=selected(site);
    const key=(typeof selectedSiteDocId==="function" ? selectedSiteDocId(current) : "")
      || (typeof detailKey==="function" ? detailKey(current) : "")
      || (current && current.id)
      || "unknown";
    return `astipMap:${kind}:${key}`;
  }

  function siteLocalDetailReadCacheKey(kind,site=undefined){
    const current=selected(site);
    const storageKey=siteLocalCacheKey(kind,current);
    const detailIdentity=(typeof detailLazyKey==="function" ? detailLazyKey(current) : "")
      || (typeof detailKey==="function" ? detailKey(current) : "")
      || safe(current && current.id);
    const sourceIdentity=typeof recordSourceIdentity==="function" ? recordSourceIdentity(current) : "";
    return [storageKey,detailIdentity,sourceIdentity].map(safe).join("|");
  }

  return {
    siteLocalCacheKey,
    siteLocalDetailReadCacheKey
  };
}
