export function createRowFastIndexHelpers({
  ensureRowPlaceCache,
  ensureRowScheduleCache,
  ensureRowSourceCache,
  regionTextNorm,
  rowLookupKeys,
  rowRegion,
  rowScheduleFingerprint,
  rowSearchText,
  searchNorm,
  sitePlaceGroupKey,
  sitePlaceLabel,
  siteSourceIdentity,
  statusText
}){
  function rowRenderFingerprint(r){
    if(!r) return "";
    const sourceIdentity=r._sourceIdentity!==undefined ? r._sourceIdentity : siteSourceIdentity(r);
    return [
      rowLookupKeys(r).join(","),
      Number.isFinite(r.lat) ? Number(r.lat).toFixed(6) : "",
      Number.isFinite(r.lon) ? Number(r.lon).toFixed(6) : "",
      r._regionNorm || "",
      r._statusText || "",
      r._scheduleFingerprint || rowScheduleFingerprint(r),
      r._placeGroupKey || sitePlaceGroupKey(r),
      r._placeLabel || sitePlaceLabel(r),
      sourceIdentity
    ].join("|");
  }

  function ensureRowFastIndexes(r,index){
    if(!r) return;
    r.i=index;
    if(r._searchRawRef!==r.raw || !r._searchText){
      const text=searchNorm(rowSearchText(r));
      r._searchText=text;
      r._compactSearchText=text.replace(/\s+/g,"");
      r._searchRawRef=r.raw;
    }
    if(r._regionRawRef!==r.raw || !r._regionNorm){
      r._regionNorm=regionTextNorm(rowRegion(r));
      r._regionRawRef=r.raw;
    }
    ensureRowPlaceCache(r);
    ensureRowSourceCache(r);
    const schedule=ensureRowScheduleCache(r);
    r._statusText=schedule ? schedule.status : statusText(r);
  }

  return {
    ensureRowFastIndexes,
    rowRenderFingerprint
  };
}
