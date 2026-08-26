export function createMapFocusHelpers({
  detailKey,
  drawerNode,
  escValue,
  getLeaflet,
  getMap,
  getSelectedSite,
  invalidateMapAfterPaint,
  openDetailById,
  runAfterTwoPaints,
  showSaveConfirmation,
  statusText
}){
  let mapFocusDetailKey="";
  let mapFocusReturnHandler=null;
  let manualGpsPickHandler=null;
  let manualGpsPickMarker=null;

  function setMapFocusMode(active){
    document.body.classList.toggle("map-focus-mode", !!active);
    invalidateMapAfterPaint();
  }

  function clearManualGpsPickHandler(){
    if(!manualGpsPickHandler) return;
    try{getMap().off("click",manualGpsPickHandler);}catch(e){}
    manualGpsPickHandler=null;
  }

  function beginManualGpsPick(options={}){
    clearManualGpsPickHandler();
    const map=getMap();
    const leaflet=getLeaflet();
    mapFocusReturnHandler=typeof options.reopen==="function" ? options.reopen : null;
    setMapFocusMode(true);
    const center=map.getCenter();
    runAfterTwoPaints(()=>{
      try{
        leaflet.popup({closeButton:false,autoClose:true})
          .setLatLng(center)
          .setContent(`<b>${escValue(options.title || "Vyber místo na mapě")}</b><br>Klikni přímo na budovu nebo vstup. GPS se doplní automaticky.`)
          .openOn(map);
      }catch(e){}
    },120);
    manualGpsPickHandler=async e=>{
      clearManualGpsPickHandler();
      const lat=Number(e.latlng.lat.toFixed(6));
      const lon=Number(e.latlng.lng.toFixed(6));
      try{
        if(manualGpsPickMarker) map.removeLayer(manualGpsPickMarker);
        manualGpsPickMarker=leaflet.circleMarker([lat,lon],{radius:10,color:"#111827",weight:2,fillColor:"#2563eb",fillOpacity:.95}).addTo(map);
        manualGpsPickMarker.bindPopup("Ručně vybrané GPS").openPopup();
      }catch(_e){}
      try{
        if(typeof options.apply==="function") await options.apply(lat,lon);
        showSaveConfirmation(options.confirmation || "GPS vybráno z mapy.");
      }catch(err){
        const st=document.getElementById(options.statusId || "editStatus");
        if(st) st.textContent="Chyba uložení GPS z mapy: "+err.message;
      }
      const reopen=typeof options.reopen==="function" ? options.reopen : null;
      mapFocusReturnHandler=null;
      setMapFocusMode(false);
      runAfterTwoPaints(()=>{
        try{map.invalidateSize(true);}catch(_e){}
        if(reopen) reopen();
      });
    };
    map.on("click",manualGpsPickHandler);
  }

  function showMapFocusLocation(lat,lon,title,subtitle,returnHandler){
    if(!Number.isFinite(lat) || !Number.isFinite(lon)){
      return;
    }
    const map=getMap();
    const leaflet=getLeaflet();
    mapFocusReturnHandler=typeof returnHandler==="function" ? returnHandler : null;
    setMapFocusMode(true);
    const latlng=[lat,lon];
    runAfterTwoPaints(()=>{
      try{
        map.setView(latlng, Math.max(map.getZoom() || 0, 16));
        leaflet.popup({closeButton:false,autoClose:true})
          .setLatLng(latlng)
          .setContent(`<b>${escValue(title || "Bod na mapě")}</b>${subtitle ? `<br>${escValue(subtitle)}` : ""}`)
          .openOn(map);
      }catch(e){}
    });
  }

  function showSelectedSiteOnMap(){
    const selectedSite=getSelectedSite();
    if(!selectedSite) return;
    const st=document.getElementById("editStatus");
    if(!Number.isFinite(selectedSite.lat) || !Number.isFinite(selectedSite.lon)){
      if(st) st.textContent="Bod nemá platné GPS souřadnice.";
      return;
    }
    mapFocusDetailKey=detailKey(selectedSite) || selectedSite.id;
    const drawer=drawerNode();
    if(drawer) drawer.classList.remove("open");
    showMapFocusLocation(selectedSite.lat, selectedSite.lon, selectedSite.adresa || "Bez názvu", statusText(selectedSite), null);
  }

  function returnFromMapFocus(){
    const key=mapFocusDetailKey;
    const handler=mapFocusReturnHandler;
    clearManualGpsPickHandler();
    mapFocusReturnHandler=null;
    setMapFocusMode(false);
    runAfterTwoPaints(()=>{
      try{getMap().invalidateSize(true);}catch(e){}
      if(handler) handler();
      else if(key) openDetailById(key);
    });
  }

  function closeMapFocusIfIdle(){
    if(document.body.classList.contains("map-focus-mode") && !manualGpsPickHandler){
      mapFocusDetailKey="";
      mapFocusReturnHandler=null;
      setMapFocusMode(false);
    }
  }

  return {
    beginManualGpsPick,
    closeMapFocusIfIdle,
    returnFromMapFocus,
    showMapFocusLocation,
    showSelectedSiteOnMap
  };
}
