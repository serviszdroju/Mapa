export function createAppRenderLoopHelpers({
  bindMapViewportRendering,
  cachedPlaceGroups,
  filtered,
  getRows,
  getRowsGpsCount,
  inCzSk,
  renderCounters,
  renderMapGroups,
  renderSidebarGroups,
  resetFirebaseRowsAutoReload,
  setLastVisiblePlaceGroups,
  setWindowRows,
  syncRowIndexes
}){
  let renderRequested=false;

  function render(){
    syncRowIndexes();
    const rows=getRows();
    setWindowRows(rows);
    if(rows.length) resetFirebaseRowsAutoReload();
    bindMapViewportRendering();
    const vis=filtered();
    const gpsRows=[];
    for(const r of vis){
      if(inCzSk(r)) gpsRows.push(r);
    }
    const mapGroups=cachedPlaceGroups(gpsRows);
    const sidebarGroups=cachedPlaceGroups(vis);
    setLastVisiblePlaceGroups(mapGroups);
    renderMapGroups(mapGroups);
    renderSidebarGroups(sidebarGroups);
    renderCounters(vis.length,getRowsGpsCount());
  }

  function requestRender(){
    if(renderRequested) return;
    renderRequested=true;
    requestAnimationFrame(()=>{
      renderRequested=false;
      render();
    });
  }

  return {
    render,
    requestRender
  };
}
