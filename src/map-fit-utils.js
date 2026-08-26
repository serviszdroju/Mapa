export function createMapFitHelpers({
  filtered,
  getFilteredRowsSignature,
  getMap,
  inCzSk,
  syncRowIndexes
}){
  let fitBoundsPointsCache={signature:"",points:[]};

  function resetFitBoundsCache(){
    fitBoundsPointsCache={signature:"",points:[]};
  }

  function fit(){
    syncRowIndexes();
    const visibleRows=filtered();
    const signature=`${getFilteredRowsSignature() || ""}\u001f${visibleRows.length}`;
    let pts=fitBoundsPointsCache.signature===signature ? fitBoundsPointsCache.points : null;
    if(!pts){
      pts=[];
      for(const r of visibleRows){
        if(inCzSk(r)) pts.push([r.lat,r.lon]);
      }
      fitBoundsPointsCache={signature,points:pts};
    }
    if(pts.length) getMap().fitBounds(pts,{padding:[30,30]});
  }

  return {
    fit,
    resetFitBoundsCache
  };
}
