export function createMapMarkerRenderHelpers({
  detailKey,
  escValue,
  getLastVisiblePlaceGroups,
  getLayer,
  getLeaflet,
  getMap,
  getRowsIndexVersion,
  groupColor,
  groupPopupHtml,
  groupPrimaryRow,
  markerRowsSignature,
  openDetailById,
  resetSourcePopupActivationGuard
}){
  let mapMarkerCache=new Map();
  let mapRenderCache={groups:null,rowsVersion:-1,boundsKey:""};
  let mapMoveRenderTimer=0;

  function resetMapRenderCaches(){
    mapRenderCache={groups:null,rowsVersion:-1,boundsKey:""};
  }

  function clearMapMarkerCache(){
    mapMarkerCache=new Map();
    resetMapRenderCaches();
  }

  function mapMarkerSignature(group,fill){
    return [
      Number(group.lat).toFixed(6),
      Number(group.lon).toFixed(6),
      fill,
      group.label || "",
      group._markerRowsSignature || markerRowsSignature(group.rows)
    ].join("||");
  }

  function attachLazyMarkerPopup(marker,group){
    marker.on("click",event=>{
      const rowsInGroup=(group && Array.isArray(group.rows)) ? group.rows : [];
      const leaflet=getLeaflet();
      const map=getMap();
      try{
        if(event && leaflet && leaflet.DomEvent) leaflet.DomEvent.stop(event);
      }catch(_e){}
      const row=groupPrimaryRow(group) || rowsInGroup[0];
      const key=row ? detailKey(row) : "";
      if(key){
        openDetailById(key);
        try{ if(map && typeof map.closePopup==="function") map.closePopup(); }catch(_e){}
        return;
      }
      try{
        if(marker.getPopup && marker.getPopup()) marker.unbindPopup();
      }catch(_e){}
      resetSourcePopupActivationGuard();
      marker.bindPopup(groupPopupHtml(group),sourcePopupOptions(group));
      marker.openPopup();
    });
    return marker;
  }

  function sourcePopupOptions(group){
    const rowsCount=(group && Array.isArray(group.rows)) ? group.rows.length : 0;
    const options={className:rowsCount>1 ? "source-popup source-popup-multi" : "source-popup"};
    try{
      if(typeof window!=="undefined" && window.matchMedia && window.matchMedia("(max-width: 760px)").matches){
        const map=getMap();
        const leaflet=getLeaflet();
        const mapEl=map && typeof map.getContainer==="function" ? map.getContainer() : null;
        const mapHeight=mapEl && mapEl.clientHeight ? mapEl.clientHeight : window.innerHeight;
        const popupWidth=Math.max(210,Math.min(286,window.innerWidth-52));
        options.maxWidth=popupWidth;
        options.minWidth=Math.min(popupWidth,rowsCount>1 ? 230 : 180);
        options.maxHeight=Math.max(128,Math.min(190,Math.floor(mapHeight*0.55)));
        options.autoPan=false;
        options.keepInView=false;
        if(leaflet && leaflet.point){
          options.autoPanPaddingTopLeft=leaflet.point(10,10);
          options.autoPanPaddingBottomRight=leaflet.point(10,10);
        }
      }
    }catch(e){}
    return options;
  }

  function buildMapMarkerForGroup(group,fill){
    const leaflet=getLeaflet();
    if(!leaflet) return null;
    if(group.rows.length>1){
      return attachLazyMarkerPopup(leaflet.marker([group.lat,group.lon],{
        icon:leaflet.divIcon({
          className:"source-group-marker-wrap",
          html:`<div class="source-group-marker" style="background:${escValue(fill)}">${group.rows.length}</div>`,
          iconSize:[26,26],
          iconAnchor:[13,13]
        })
      }),group);
    }
    const r=group.rows[0];
    return attachLazyMarkerPopup(leaflet.circleMarker([r.lat,r.lon],{radius:8,color:"#fff",weight:2,fillColor:fill,fillOpacity:.92}),group);
  }

  function groupHasUsableGps(group){
    return group && Number.isFinite(group.lat) && Number.isFinite(group.lon) && group.lat>=47 && group.lat<=51.5 && group.lon>=12 && group.lon<=23;
  }

  function mapMarkerGroups(groups){
    const source=Array.isArray(groups) ? groups : [];
    const out=[];
    for(const group of source){
      if(groupHasUsableGps(group)) out.push(group);
    }
    return out;
  }

  function renderMapGroups(groups){
    const boundsKey="all";
    if(mapRenderCache.groups===groups && mapRenderCache.rowsVersion===getRowsIndexVersion() && mapRenderCache.boundsKey===boundsKey && mapMarkerCache.size){
      return;
    }
    const visibleGroups=mapMarkerGroups(groups);
    mapRenderCache={groups,rowsVersion:getRowsIndexVersion(),boundsKey};
    updateMapMarkers(visibleGroups);
  }

  function refreshVisibleMapMarkers(){
    const groups=getLastVisiblePlaceGroups();
    if(!groups.length) return;
    renderMapGroups(groups);
  }

  function bindMapViewportRendering(){
    const map=getMap();
    if(!map || map.__szzViewportRenderBound || typeof map.on!=="function") return;
    map.__szzViewportRenderBound=true;
    map.on("moveend zoomend",()=>{
      if(mapMoveRenderTimer) cancelAnimationFrame(mapMoveRenderTimer);
      mapMoveRenderTimer=requestAnimationFrame(()=>{
        mapMoveRenderTimer=0;
        refreshVisibleMapMarkers();
      });
    });
  }

  function updateMapMarkers(groups){
    const layer=getLayer();
    if(!layer) return;
    const visibleKeys=new Set();
    const sourceGroups=Array.isArray(groups) ? groups : [];
    for(const group of sourceGroups){
      if(!Number.isFinite(group.lat) || !Number.isFinite(group.lon)) continue;
      const key=group.key || `${group.lat},${group.lon}`;
      const fill=groupColor(group.rows);
      const signature=mapMarkerSignature(group,fill);
      visibleKeys.add(key);
      const cached=mapMarkerCache.get(key);
      if(cached && cached.signature===signature) continue;
      if(cached && cached.marker){
        try{layer.removeLayer(cached.marker);}catch(e){}
      }
      const marker=buildMapMarkerForGroup(group,fill);
      if(!marker) continue;
      marker.addTo(layer);
      mapMarkerCache.set(key,{marker,signature});
    }
    for(const [key,cached] of mapMarkerCache){
      if(visibleKeys.has(key)) continue;
      if(cached && cached.marker){
        try{layer.removeLayer(cached.marker);}catch(e){}
      }
      mapMarkerCache.delete(key);
    }
  }

  return {
    bindMapViewportRendering,
    clearMapMarkerCache,
    groupHasUsableGps,
    refreshVisibleMapMarkers,
    renderMapGroups,
    resetMapRenderCaches
  };
}
