/* Extracted from index.html. Loaded as a classic script to preserve the original inline execution order. */
;
window.szzAfterPaint = window.szzAfterPaint || function(fn){
  const run=()=>{try{fn();}catch(e){}};
  if(typeof requestAnimationFrame==="function") requestAnimationFrame(run);
  else setTimeout(run,0);
};
window.szzAfterTwoPaints = window.szzAfterTwoPaints || function(fn){
  window.szzAfterPaint(()=>window.szzAfterPaint(fn));
};
(function(){
  function openOnlyNewSite(fromAddButton){
    if(fromAddButton !== true) return;
    const drawer=document.getElementById("drawer");
    if(!drawer) return;
    drawer.classList.add("open");
    drawer.innerHTML=`
      <div class="drawer-head">
        <div>
          <h2>Přidat nové místo</h2>
          <p class="small">Vyplň údaje a ulož bod.</p>
        </div>
        <button class="secondary x" type="button" id="closeOnlyNew">Zavřít</button>
      </div>

      <div class="card" id="newSiteOnlyCard">
        <div class="new-only-grid">
          <div><label>Název</label><input data-new-key="Název" id="onlyNewName"></div>
          <div><label>Adresa / umístění</label><input data-new-key="Adresa / umístění" id="onlyNewAddress"></div>
          <div>
            <label>GPS</label>
            <button class="secondary" type="button" id="calcOnlyGpsBtn" style="width:100%;margin-bottom:6px">Dopočítat GPS</button>
            <button class="secondary" type="button" id="pickOnlyGpsBtn" style="width:100%;margin-bottom:6px">Vybrat na mapě</button>
            <button class="primary" type="button" id="findOnlyGpsBtn" style="width:100%">Ukázat bod na mapě</button>
          </div>
          <div><label>GPS lat</label><input data-new-key="GPS_lat" id="onlyNewGpsLat" placeholder="49.123456"></div>
          <div><label>GPS lon</label><input data-new-key="GPS_lon" id="onlyNewGpsLon" placeholder="16.123456"></div>
          <div class="full"><label>Umístění zdroje</label><input data-new-key="Adresa_GPS"></div>
          <div class="full"><label>Historie oprav</label><textarea data-new-key="Historie oprav"></textarea></div>
          <div class="full"><label>Postup testování</label><textarea data-new-key="Postup testování"></textarea></div>
          <div class="full"><label>Jistič UPS</label><input data-new-key="Jistič UPS"></div>
          <div class="full"><label>Popis zdroje</label><input data-new-key="Popis_zdroje"></div>
          <div class="full"><label>Výrobní číslo</label><input data-new-key="Zdroj"></div>
          <div><label>Kontakt</label><input data-new-key="Kontakt"></div>
          <div><label>Kraj</label><input data-new-key="Kraj"></div>
          <div class="full"><label>Poznámky</label><input data-new-key="Poznámky"></div>
          <div><label>Rok výroby</label><input data-new-key="Rok výroby"></div>
          <div><label>Serviska</label><select data-new-key="Serviska"><option value=""></option><option value="ano">ano</option><option value="ne">ne</option></select></div>
          <div><label>Cena FZ</label><input data-new-key="Cena FZ"></div>
          <div><label>Perioda kontrol</label><select data-new-key="Perioda kontrol"><option value="6">6 měsíců</option><option value="12" selected>12 měsíců</option></select></div>
          <div class="full"><label>Hlídáme kontroly sami</label><select data-new-key="Hlídáme kontroly sami"><option value="ne" selected>ne</option><option value="ano">ano</option></select></div>
          <div class="full only-red"><label>Důležité poznámky</label><textarea data-new-key="Důležitá poznámka"></textarea></div>
        </div>
        <div class="row" style="margin-top:12px">
          <button class="primary" type="button" id="saveOnlyNew">Uložit nové místo</button>
          <button class="secondary" type="button" id="cancelOnlyNew">Zrušit</button>
        </div>
        <p class="small" id="onlyNewStatus"></p>
      </div>`;
    document.getElementById("closeOnlyNew").onclick=()=>{drawer.classList.remove("open");};
    document.getElementById("cancelOnlyNew").onclick=()=>{drawer.classList.remove("open");};
    document.getElementById("saveOnlyNew").onclick=saveOnlyNewSite;
    const gpsBtn=document.getElementById("calcOnlyGpsBtn");
    if(gpsBtn) gpsBtn.onclick=calcOnlyNewGps;
    const pickGpsBtn=document.getElementById("pickOnlyGpsBtn");
    if(pickGpsBtn) pickGpsBtn.onclick=window.startOnlyNewManualGpsPick;
    const findGpsBtn=document.getElementById("findOnlyGpsBtn");
    if(findGpsBtn) findGpsBtn.onclick=findOnlyNewGpsOnMap;
    window.szzAfterPaint(()=>{const f=document.getElementById("onlyNewName"); if(f) f.focus();});
  }

  function collectOnlyNewRaw(){
    const raw={};
    document.querySelectorAll("#newSiteOnlyCard [data-new-key]").forEach(el=>{
      const key=el.dataset.newKey;
      const val=String(el.value||"").trim();
      if(!key || !val) return;
      raw[key]=val;
    });
    if(typeof window.applyWatchSelfAliases==="function"){
      window.applyWatchSelfAliases(raw, raw["Hlídáme sami termín"] || raw["Hlídáme kontroly sami"] || "ne");
    }
    return raw;
  }

  
  async function calcOnlyNewGps(){
    const st=document.getElementById("onlyNewStatus");
    const addrEl=document.getElementById("onlyNewAddress");
    const latEl=document.getElementById("onlyNewGpsLat");
    const lonEl=document.getElementById("onlyNewGpsLon");
    const address=addrEl ? String(addrEl.value||"").trim() : "";

    if(!address){
      if(st) st.textContent="Vyplň adresu / umístění.";
      return;
    }

    try{
      if(st) st.textContent="Dopočítávám GPS...";
      if(typeof window.geocodeAddressGeneric==="function"){
        const g=await window.geocodeAddressGeneric(address);
        if(g){
          if(latEl) latEl.value=g.lat;
          if(lonEl) lonEl.value=g.lon;
          const region=window.inferRegionFromAddressText(g.display || address, g.address || {});
          window.setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region);
          if(st) st.textContent="GPS doplněno.";
          return;
        }
      }
      if(window.lastGeocodeMessage){
        const region=window.inferRegionFromAddressText(address);
        window.setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region);
        if(st) st.textContent=window.lastGeocodeMessage;
        return;
      }

      const url="https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q="+encodeURIComponent(address);
      const res=await fetch(url,{headers:{"Accept":"application/json"}});
      const data=await res.json();
      if(data && data[0]){
        if(latEl) latEl.value=data[0].lat;
        if(lonEl) lonEl.value=data[0].lon;
        const region=window.inferRegionFromAddressText(data[0].display_name || address, data[0].address || {});
        window.setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region);
        if(st) st.textContent="GPS doplněno.";
      }else{
        const region=window.inferRegionFromAddressText(address);
        window.setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region);
        if(st) st.textContent=window.lastGeocodeMessage || (region ? "Adresa nebyla nalezena pro GPS, kraj jsem doplnil podle textu adresy." : "Adresa nebyla nalezena.");
      }
    }catch(e){
      if(st) st.textContent="Chyba dopočtu GPS: "+e.message;
    }
  }

  
  let onlyNewTempMarker = null;

  function findOnlyNewGpsOnMap(){
    const st=document.getElementById("onlyNewStatus");
    const raw=collectOnlyNewRaw();
    const latEl=document.getElementById("onlyNewGpsLat");
    const lonEl=document.getElementById("onlyNewGpsLon");

    const lat=parseFloat(String(latEl?.value||"").replace(",","."));
    const lon=parseFloat(String(lonEl?.value||"").replace(",","."));

    if(!Number.isFinite(lat) || !Number.isFinite(lon)){
      if(st) st.textContent="Nejdřív vyplň nebo dopočítej GPS lat/lon.";
      return;
    }

    if(!window.map || !window.L){
      if(st) st.textContent="Mapa ještě není načtená.";
      return;
    }

    const latlng=[lat,lon];

    try{
      if(onlyNewTempMarker){
        window.map.removeLayer(onlyNewTempMarker);
      }

      onlyNewTempMarker=L.circleMarker(latlng,{
        radius:10,
        color:"#111827",
        weight:2,
        fillColor:"#2563eb",
        fillOpacity:.95
      }).addTo(window.map);

      onlyNewTempMarker.bindPopup("Nový bod - náhled");
      const drawer=document.getElementById("drawer");
      if(drawer) drawer.classList.remove("open");
      const reopen=()=>{ const d=document.getElementById("drawer"); if(d) d.classList.add("open"); };
      if(typeof window.showMapFocusLocation==="function"){
        window.showMapFocusLocation(lat,lon,raw["Název"] || raw["Adresa / umístění"] || "Nový bod","náhled před uložením",reopen);
      }else{
        window.map.setView(latlng,15);
        window.map.invalidateSize(true);
      }

      if(st) st.textContent="Bod nalezen na mapě podle GPS.";
    }catch(e){
      if(st) st.textContent="Chyba zobrazení bodu na mapě: "+e.message;
    }
  }

  async function saveOnlyNewSite(){
    const st=document.getElementById("onlyNewStatus");
    const raw=collectOnlyNewRaw();
    if(!raw["Název"] && !raw["Adresa / umístění"]){
      if(st) st.textContent="Vyplň alespoň Název nebo Adresa / umístění.";
      return;
    }

    const id="site_"+Date.now();
    let latManual=parseFloat(String(raw["GPS_lat"]||"").replace(",","."));
    let lonManual=parseFloat(String(raw["GPS_lon"]||"").replace(",","."));
    let row={
      id:id,
      i:Array.isArray(window.rows)?window.rows.length:0,
      nazev:raw["Název"]||raw["Adresa / umístění"]||"Nové místo",
      adresa:raw["Adresa / umístění"]||raw["Adresa_GPS"]||"",
      kraj:raw["Kraj"]||"",
      zdroj:raw["Popis_zdroje"]||"",
      kontakt:raw["Kontakt"]||"",
      pristi:"",
      posledni:"",
      lat:Number.isFinite(latManual)?latManual:null,
      lon:Number.isFinite(lonManual)?lonManual:null,
      ordered:false,
      noOrder:typeof window.explicitWatchSelfFromRaw==="function"
        ? window.explicitWatchSelfFromRaw(raw)===true
        : String(raw["Hlídáme kontroly sami"]||"").toLowerCase()==="ano",
      raw:raw
    };

    if(!raw["Kraj"]){
      raw["Kraj"]=window.inferRegionFromAddressText(raw["Adresa / umístění"] || raw["Název"] || raw["Adresa_GPS"] || "");
    }
    row.kraj=raw["Kraj"] || row.kraj || "";

    try{
      const address=raw["Adresa / umístění"]||raw["Adresa_GPS"]||"";
      if(address && typeof window.geocodeAddressGeneric==="function"){
        if(st) st.textContent="Dopočítávám GPS...";
        const g=await window.geocodeAddressGeneric(address);
        if(g){
          row.lat=Number(g.lat);
          row.lon=Number(g.lon);
          row.raw["GPS_lat"]=row.lat;
          row.raw["GPS_lon"]=row.lon;
          if(!row.raw["Kraj"]) row.raw["Kraj"]=window.inferRegionFromAddressText(g.display || address, g.address || {});
        }
      }
    }catch(e){}

    let savedUnified=false;
    let savedOffline=false;
    let savedId=id;

    try{
      const fbMod=window.fb || {};
      const firestoreDb=window.db;
      const useUnified=window.__firebaseUnifiedPrimary !== false;
      const userEmail=(window.currentUser && window.currentUser.email) || "";
      if(useUnified){
        if(typeof window.saveUnifiedSiteRaw!=="function") throw new Error("Firebase ukládání nových bodů ještě není připravené.");
        const result=await window.saveUnifiedSiteRaw(raw,{docId:id});
        if(result.duplicate){
          if(st) st.textContent="Bod už existuje. Otevírám existující záznam.";
          if(navigator.onLine !== false && typeof window.refreshFirebaseSitesAfterSave==="function") await window.refreshFirebaseSitesAfterSave(result.id,result.row);
          else if(navigator.onLine !== false && typeof window.loadFirebaseSitesUnified==="function") await window.loadFirebaseSitesUnified(result.id);
          return;
        }
        savedOffline=!!result.offline;
        savedUnified=!savedOffline;
        savedId=result.id;
        if(result.row) row=result.row;
      }else if(window.firebaseReady && firestoreDb && fbMod.fsMod){
        const {doc,setDoc}=fbMod.fsMod;
        await setDoc(doc(firestoreDb,"sites",id),{
          raw:raw,
          createdAt:new Date().toISOString(),
          createdBy:userEmail,
          noOrder:row.noOrder
        },{merge:true});
      }else throw new Error("Firebase není připravený, bod se neuložil.");
    }catch(e){
      if(st) st.textContent="Chyba uložení: "+e.message;
      return;
    }

    // vložit bod do hlavního seznamu tak, aby ho render() hned zobrazil na mapě
    if(!savedUnified && !savedOffline && Array.isArray(window.rows)){
      row.i = window.rows.length;
      row.lat = Number(row.lat);
      row.lon = Number(row.lon);
      row.raw = row.raw || {};
      row.raw["GPS_lat"] = row.lat;
      row.raw["GPS_lon"] = row.lon;
      row.raw["Název"] = row.nazev || row.raw["Název"] || "";
      row.raw["Adresa_GPS"] = row.adresa || row.raw["Adresa_GPS"] || "";
      window.rows.push(row);
    }

    if(st) st.textContent="Nové místo uloženo a zobrazeno na mapě.";
    if(window.showSaveConfirmation) window.showSaveConfirmation("Nové místo uloženo.");

    try{
      let visibleAfterReload=true;
      if(savedUnified && typeof window.refreshFirebaseSitesAfterSave==="function"){
        visibleAfterReload=await window.refreshFirebaseSitesAfterSave(savedId,row);
      }else if(savedUnified && typeof window.loadFirebaseSitesUnified==="function"){
        await window.loadFirebaseSitesUnified();
      }else if(!savedOffline && window.__firebaseUnifiedPrimary !== false && typeof window.loadFirebaseSitesUnified==="function"){
        await window.loadFirebaseSitesUnified();
      }else if(typeof render==="function") render();

      const hasGps = Number.isFinite(row.lat) && Number.isFinite(row.lon);
      if(visibleAfterReload && hasGps){
        const latlng=[row.lat,row.lon];

        if(!savedUnified && !savedOffline){
          try{
            if(window.L && window.map){
              const marker=L.circleMarker(latlng,{
                radius:8,
                color:"#111827",
                weight:2,
                fillColor: row.noOrder ? "#ec4899" : "#22c55e",
                fillOpacity:.95
              }).addTo(window.map);
              marker.bindPopup(row.nazev || "Nové místo");
              marker.on("click",()=>{ if(typeof window.openDetailById==="function") window.openDetailById(row.id); });
            }
          }catch(e){}
        }

        if(window.map){
          window.szzAfterPaint(()=>{try{window.map.setView(latlng,14);}catch(e){}});
          window.szzAfterTwoPaints(()=>{try{window.map.invalidateSize(true);}catch(e){}});
        }
      }

      if(visibleAfterReload && typeof window.openDetailById==="function") window.szzAfterTwoPaints(()=>window.openDetailById(savedUnified ? savedId : row.id));
    }catch(e){
      location.reload();
    }
  }

  function bindOnlyNew(){
    const btn=document.getElementById("addSiteBtn");
    if(btn){
      btn.onclick=function(e){
        if(e) e.preventDefault();
        openOnlyNewSite(true);
      };
      btn.dataset.onlyNewBound="1";
    }
  }

  window.runSzzDomReadyInit = window.runSzzDomReadyInit || function(fn,options={}){
    if(typeof fn!=="function") return;
    const run=()=>{
      try{ fn(); }
      catch(e){ console.warn("Inicializace ovládání selhala",e); }
    };
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",run,{once:true});
    else run();
    if(options && options.onLoad){
      if(document.readyState==="complete") run();
      else window.addEventListener("load",run,{once:true});
    }
  };
  window.runSzzDomReadyInit(bindOnlyNew);
})();
;
(function(){
  let onlyNewTempMarker=null;

  function escAdd(s){
    return String(s ?? "").replace(/[&<>"']/g, m => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

  function normAdd(s){
    return String(s||"").trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }

  function collectAddRaw(){
    const raw={};
    document.querySelectorAll("#newSiteOnlyCard [data-new-key]").forEach(el=>{
      const key=el.dataset.newKey;
      const val=String(el.value||"").trim();
      if(!key || !val) return;
      raw[key]=val;
    });
    if(typeof window.applyWatchSelfAliases==="function"){
      window.applyWatchSelfAliases(raw, raw["Hlídáme sami termín"] || raw["Hlídáme kontroly sami"] || "ne");
    }
    return raw;
  }

  function buildRowFromRaw(raw){
    const lat=parseFloat(String(raw["GPS_lat"]||"").replace(",","."));
    const lon=parseFloat(String(raw["GPS_lon"]||"").replace(",","."));
    const id="site_"+Date.now();

    const name=raw["Název"] || raw["Adresa / umístění"] || raw["Adresa_GPS"] || "Nové místo";
    const addr=raw["Adresa / umístění"] || raw["Adresa_GPS"] || name;
    const noOrder=typeof window.explicitWatchSelfFromRaw==="function"
      ? window.explicitWatchSelfFromRaw(raw)===true
      : String(raw["Hlídáme kontroly sami"]||"").toLowerCase()==="ano";

    return {
      id,
      i:Array.isArray(window.rows) ? window.rows.length : 0,
      nazev:name,
      adresa:addr,
      kraj:raw["Kraj"] || "",
      zdroj:raw["Popis_zdroje"] || raw["Zdroj"] || "",
      kontakt:raw["Kontakt"] || "",
      pristi:"",
      posledni:"",
      lat:Number.isFinite(lat) ? lat : null,
      lon:Number.isFinite(lon) ? lon : null,
      ordered:false,
      noOrder,
      raw:{...raw}
    };
  }

  async function calcAddGps(){
    const st=document.getElementById("onlyNewStatus");
    const address=String(document.getElementById("onlyNewAddress")?.value || document.querySelector('#newSiteOnlyCard [data-new-key="Adresa_GPS"]')?.value || "").trim();
    const latEl=document.getElementById("onlyNewGpsLat");
    const lonEl=document.getElementById("onlyNewGpsLon");

    if(!address){
      if(st) st.textContent="Vyplň adresu / umístění.";
      return;
    }

    try{
      if(st) st.textContent="Dopočítávám GPS...";
      let g=null;

      if(typeof window.geocodeAddressGeneric==="function"){
        g=await window.geocodeAddressGeneric(address);
      }else{
        const url="https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=1&q="+encodeURIComponent(address);
        const res=await fetch(url,{headers:{"Accept":"application/json"}});
        const data=await res.json();
        if(data && data[0]) g={lat:data[0].lat, lon:data[0].lon, display:data[0].display_name || "", address:data[0].address || {}};
      }

      if(!g){
        const region=window.inferRegionFromAddressText(address);
        window.setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region);
        if(st) st.textContent=window.lastGeocodeMessage || (region ? "Adresa nebyla nalezena pro GPS, kraj jsem doplnil podle textu adresy." : "Adresa nebyla nalezena.");
        return;
      }

      if(latEl) latEl.value=g.lat;
      if(lonEl) lonEl.value=g.lon;
      const region=window.inferRegionFromAddressText(g.display || address, g.address || {});
      window.setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region);
      if(st) st.textContent="GPS doplněno.";
    }catch(e){
      if(st) st.textContent="Chyba dopočtu GPS: "+e.message;
    }
  }

  function findAddOnMap(){
    const st=document.getElementById("onlyNewStatus");
    const raw=collectAddRaw();
    const lat=parseFloat(String(document.getElementById("onlyNewGpsLat")?.value || "").replace(",","."));
    const lon=parseFloat(String(document.getElementById("onlyNewGpsLon")?.value || "").replace(",","."));

    if(!Number.isFinite(lat) || !Number.isFinite(lon)){
      if(st) st.textContent="Nejdřív vyplň nebo dopočítej GPS.";
      return;
    }
    if(!window.map || !window.L){
      if(st) st.textContent="Mapa ještě není načtená.";
      return;
    }

    const latlng=[lat,lon];
    try{
      if(onlyNewTempMarker) window.map.removeLayer(onlyNewTempMarker);
      onlyNewTempMarker=L.circleMarker(latlng,{
        radius:10,
        color:"#111827",
        weight:2,
        fillColor:"#2563eb",
        fillOpacity:.95
      }).addTo(window.map);
      onlyNewTempMarker.bindPopup("Nový bod - náhled");
      const drawer=document.getElementById("drawer");
      if(drawer) drawer.classList.remove("open");
      const reopen=()=>{ const d=document.getElementById("drawer"); if(d) d.classList.add("open"); };
      if(typeof window.showMapFocusLocation==="function"){
        window.showMapFocusLocation(lat,lon,raw["Název"] || raw["Adresa / umístění"] || "Nový bod","náhled před uložením",reopen);
      }else{
        window.map.setView(latlng,15);
        window.map.invalidateSize(true);
      }
      if(st) st.textContent="Bod nalezen na mapě podle GPS.";
    }catch(e){
      if(st) st.textContent="Chyba zobrazení bodu: "+e.message;
    }
  }

  function openAddForm(){
    const drawer=document.getElementById("drawer");
    if(!drawer) return;

    drawer.classList.add("open");
    drawer.innerHTML=`
      <div class="drawer-head">
        <div>
          <h2>Přidat nové místo</h2>
          <p class="small">Vyplň údaje a ulož bod.</p>
        </div>
        <button class="secondary x" type="button" id="closeOnlyNew">Zavřít</button>
      </div>

      <div class="card" id="newSiteOnlyCard">
        <div class="new-only-grid">
          <div><label>Název</label><input data-new-key="Název" id="onlyNewName"></div>
          <div><label>Adresa / umístění</label><input data-new-key="Adresa / umístění" id="onlyNewAddress"></div>

          <div class="full gps-actions">
            <button class="secondary" type="button" id="calcOnlyGps">Dopočítat GPS</button>
            <button class="secondary" type="button" id="pickOnlyGps">Vybrat na mapě</button>
            <button class="primary" type="button" id="findOnlyGps">Ukázat bod na mapě</button>
          </div>

          <div><label>GPS lat</label><input data-new-key="GPS_lat" id="onlyNewGpsLat" placeholder="49.123456"></div>
          <div><label>GPS lon</label><input data-new-key="GPS_lon" id="onlyNewGpsLon" placeholder="16.123456"></div>

          <div class="full"><label>Umístění zdroje</label><input data-new-key="Adresa_GPS"></div>
          <div class="full"><label>Historie oprav</label><textarea data-new-key="Historie oprav"></textarea></div>
          <div class="full"><label>Postup testování</label><textarea data-new-key="Postup testování"></textarea></div>
          <div class="full"><label>Jistič UPS</label><input data-new-key="Jistič UPS"></div>
          <div class="full"><label>Popis zdroje</label><input data-new-key="Popis_zdroje"></div>
          <div class="full"><label>Výrobní číslo</label><input data-new-key="Zdroj"></div>

          <div><label>Kontakt</label><input data-new-key="Kontakt"></div>
          <div><label>Kraj</label><input data-new-key="Kraj"></div>

          <div class="full"><label>Poznámky</label><input data-new-key="Poznámky"></div>

          <div><label>Rok výroby</label><input data-new-key="Rok výroby"></div>
          <div><label>Serviska</label><select data-new-key="Serviska"><option value=""></option><option value="ano">ano</option><option value="ne">ne</option></select></div>

          <div><label>Cena FZ</label><input data-new-key="Cena FZ"></div>
          <div><label>Perioda kontrol</label><select data-new-key="Perioda kontrol"><option value="6">6 měsíců</option><option value="12" selected>12 měsíců</option></select></div>

          <div class="full"><label>Hlídáme kontroly sami</label><select data-new-key="Hlídáme kontroly sami"><option value="ne" selected>ne</option><option value="ano">ano</option></select></div>

          <div class="full only-red"><label>Důležité poznámky</label><textarea data-new-key="Důležitá poznámka"></textarea></div>
        </div>

        <div class="row" style="margin-top:12px">
          <button class="primary" type="button" id="saveOnlyNew">Uložit nové místo</button>
          <button class="secondary" type="button" id="cancelOnlyNew">Zrušit</button>
        </div>
        <p class="small" id="onlyNewStatus"></p>
      </div>`;

    document.getElementById("closeOnlyNew").onclick=()=>{drawer.classList.remove("open");};
    document.getElementById("cancelOnlyNew").onclick=()=>{drawer.classList.remove("open");};
    document.getElementById("calcOnlyGps").onclick=calcAddGps;
    document.getElementById("pickOnlyGps").onclick=window.startOnlyNewManualGpsPick;
    document.getElementById("findOnlyGps").onclick=findAddOnMap;
    document.getElementById("saveOnlyNew").onclick=saveAddSite;
    window.szzAfterPaint(()=>document.getElementById("onlyNewName")?.focus());
  }

  async function saveAddSite(){
    const st=document.getElementById("onlyNewStatus");
    const raw=collectAddRaw();

    if(!raw["Název"] && !raw["Adresa / umístění"]){
      if(st) st.textContent="Vyplň alespoň Název nebo Adresa / umístění.";
      return;
    }

    let row=buildRowFromRaw(raw);

    if(!raw["Kraj"]){
      raw["Kraj"]=window.inferRegionFromAddressText(raw["Adresa / umístění"] || raw["Název"] || raw["Adresa_GPS"] || "");
      row.raw["Kraj"]=raw["Kraj"] || row.raw["Kraj"] || "";
      row.kraj=raw["Kraj"] || row.kraj || "";
    }

    if(!Number.isFinite(row.lat) || !Number.isFinite(row.lon)){
      try{
        const address=raw["Adresa / umístění"] || raw["Adresa_GPS"] || "";
        if(address && typeof window.geocodeAddressGeneric==="function"){
          if(st) st.textContent="Dopočítávám GPS...";
          const g=await window.geocodeAddressGeneric(address);
          if(g){
            row.lat=Number(g.lat);
            row.lon=Number(g.lon);
            row.raw["GPS_lat"]=row.lat;
            row.raw["GPS_lon"]=row.lon;
            if(!row.raw["Kraj"]) row.raw["Kraj"]=window.inferRegionFromAddressText(g.display || address, g.address || {});
          }
        }
      }catch(e){}
    }

    if(!Number.isFinite(row.lat) || !Number.isFinite(row.lon)){
      if(st) st.textContent="Bod nemá GPS. Doplň GPS nebo použij Dopočítat GPS.";
      return;
    }

    let savedUnified=false;
    let savedOffline=false;
    let savedId=row.id;

    try{
      const fbMod=window.fb || {};
      const firestoreDb=window.db;
      const useUnified=window.__firebaseUnifiedPrimary !== false;
      const userEmail=(window.currentUser && window.currentUser.email) || "";
      if(useUnified){
        if(typeof window.saveUnifiedSiteRaw!=="function") throw new Error("Firebase ukládání nových bodů ještě není připravené.");
        const result=await window.saveUnifiedSiteRaw(row.raw,{docId:row.id});
        if(result.duplicate){
          if(st) st.textContent="Bod už existuje. Otevírám existující záznam.";
          if(navigator.onLine !== false && typeof window.refreshFirebaseSitesAfterSave==="function") await window.refreshFirebaseSitesAfterSave(result.id,result.row);
          else if(navigator.onLine !== false && typeof window.loadFirebaseSitesUnified==="function") await window.loadFirebaseSitesUnified(result.id);
          return;
        }
        savedOffline=!!result.offline;
        savedUnified=!savedOffline;
        savedId=result.id;
        if(result.row) row=result.row;
      }else if(window.firebaseReady && firestoreDb && fbMod.fsMod){
        const {doc,setDoc}=fbMod.fsMod;
        await setDoc(doc(firestoreDb,"sites",row.id),{
          raw:row.raw,
          noOrder:row.noOrder,
          createdAt:new Date().toISOString(),
          createdBy:userEmail
        },{merge:true});
      }else throw new Error("Firebase není připravený, bod se neuložil.");
    }catch(e){
      if(st) st.textContent="Chyba uložení: "+e.message;
      return;
    }

    if(!savedUnified && !savedOffline && Array.isArray(window.rows)){
      row.i=window.rows.length;
      window.rows.push(row);
    }

    if(st) st.textContent="Nové místo uloženo.";
    if(window.showSaveConfirmation) window.showSaveConfirmation("Nové místo uloženo.");

    try{
      let visibleAfterReload=true;
      if(savedUnified && typeof window.refreshFirebaseSitesAfterSave==="function"){
        visibleAfterReload=await window.refreshFirebaseSitesAfterSave(savedId,row);
      }else if(savedUnified && typeof window.loadFirebaseSitesUnified==="function"){
        await window.loadFirebaseSitesUnified();
      }else if(!savedOffline && window.__firebaseUnifiedPrimary !== false && typeof window.loadFirebaseSitesUnified==="function"){
        await window.loadFirebaseSitesUnified();
      }else if(typeof render==="function") render();

      const latlng=[row.lat,row.lon];
      if(visibleAfterReload && window.map){
        window.szzAfterPaint(()=>window.map.setView(latlng,14));
        window.szzAfterTwoPaints(()=>window.map.invalidateSize(true));
      }

      // nový bod se chová jako ostatní: detail se otevře přes původní openDetail
      if(visibleAfterReload && typeof window.openDetailById==="function"){
        window.szzAfterTwoPaints(()=>window.openDetailById(savedUnified ? savedId : row.id));
      }
    }catch(e){
      location.reload();
    }
  }

  function bindAddOnly(){
    const btn=document.getElementById("addSiteBtn");
    if(!btn) return;
    btn.onclick=function(e){
      if(e) e.preventDefault();
      openAddForm();
    };
  }

  window.runSzzDomReadyInit(bindAddOnly);
})();
;
(function(){
  function closeAddFormIfOpen(){
    const drawer=document.getElementById("drawer");
    if(!drawer) return;
    const addCard=document.getElementById("newSiteOnlyCard");
    if(addCard){
      drawer.classList.remove("adding-new-site");
    }
  }

  function patchOpenDetail(){
    if(typeof window.openDetail==="function" && !window.openDetail.__clearAddPatched){
      const original=window.openDetail;
      const patched=function(){
        closeAddFormIfOpen();
        return original.apply(this, arguments);
      };
      patched.__clearAddPatched=true;
      window.openDetail=patched;
    }
  }

  document.addEventListener("click", function(e){
    const addBtn=e.target.closest && e.target.closest("#addSiteBtn");
    if(addBtn) return;

    const detailLike=e.target.closest && e.target.closest(".item, .leaflet-marker-icon, .leaflet-interactive, .leaflet-popup");
    if(detailLike){
      closeAddFormIfOpen();
      patchOpenDetail();
    }
  }, true);

  window.runSzzDomReadyInit(patchOpenDetail,{onLoad:true});
})();
;
/* FINAL FIX: Přidat nové místo už nesmí přepsat normální detail */
(function(){
  function drawer(){
    return document.getElementById("drawer");
  }

  function saveDrawerTemplate(){
    const d = drawer();
    if(!d) return;
    if(!window.__normalDrawerTemplate || !window.__normalDrawerTemplate.includes('id="detailTable"')){
      if(!d.querySelector("#newSiteOnlyCard")){
        window.__normalDrawerTemplate = d.innerHTML;
      }
    }
  }

  function restoreDrawerTemplate(){
    const d = drawer();
    if(!d) return false;

    const isTemporaryForm = !!d.querySelector("#newSiteOnlyCard") || !!d.querySelector("#mainProtocolHistoryCard");
    if(isTemporaryForm && window.__normalDrawerTemplate){
      d.innerHTML = window.__normalDrawerTemplate;
      d.classList.remove("adding-new-site");
      const close=d.querySelector("#closeDrawer");
      if(close) close.onclick=()=>d.classList.remove("open");
      return true;
    }
    return false;
  }

  function patchOpenDetailFinal(){
    if(typeof window.openDetail !== "function") return;
    if(window.openDetail.__finalRestorePatched) return;

    const originalOpenDetail = window.openDetail;
    const patchedOpenDetail = function(){
      restoreDrawerTemplate();
      return originalOpenDetail.apply(this, arguments);
    };

    patchedOpenDetail.__finalRestorePatched = true;
    window.openDetail = patchedOpenDetail;
  }

  function bindAddButtonFinal(){
    const btn = document.getElementById("addSiteBtn");
    if(!btn || btn.__finalAddBound) return;

    const oldClick = btn.onclick;
    btn.onclick = function(e){
      saveDrawerTemplate();
      if(typeof oldClick === "function"){
        return oldClick.call(this, e);
      }
    };
    btn.__finalAddBound = true;
  }

  function initFinalFix(){
    saveDrawerTemplate();
    patchOpenDetailFinal();
    bindAddButtonFinal();
  }

  window.runSzzDomReadyInit(initFinalFix,{onLoad:true});

  // Když klikneš na položku nebo marker, vždy obnov normální detail před spuštěním handleru.
  document.addEventListener("click", function(e){
    const addBtn = e.target.closest && e.target.closest("#addSiteBtn");
    if(addBtn){
      saveDrawerTemplate();
      return;
    }

    const detailClick = e.target.closest && e.target.closest(".item, .leaflet-interactive, .leaflet-marker-icon, .leaflet-popup");
    if(detailClick){
      restoreDrawerTemplate();
      patchOpenDetailFinal();
    }
  }, true);

  // Po uložení nového místa se openDetail taky nejdřív vrátí na normální šablonu.
  window.__restoreDrawerTemplateForDetail = restoreDrawerTemplate;
})();
;
/* FIREBASE UNIFIED MODE */
(function(){
  const FB_USER_FIELDS = [
    {label:"Název", key:"Název", full:true},
    {label:"Adresa / umístění", key:"Adresa / umístění", full:true},
    {label:"Adresa_GPS", key:"Adresa_GPS", full:true, readonly:true},
    {label:"Kraj", key:"Kraj", type:"region"},
    {label:"Popis zdroje", key:"Popis_zdroje", full:true},
    {label:"Výrobní číslo", key:"Zdroj"},
    {label:"Kontakt", key:"Kontakt"},
    {label:"Umístění zdroje", key:"Umístění zdroje", full:true},
    {label:"Historie oprav", key:"Historie oprav", type:"textarea", full:true},
    {label:"Postup testování", key:"Postup testování", type:"textarea", full:true},
    {label:"Jistič UPS", key:"Jistič UPS", type:"textarea", full:true},
    {label:"Poznámky", key:"Poznámky", type:"textarea", full:true},
    {label:"Perioda kontrol", key:"Perioda kontrol", type:"period"},
    {label:"Hlídáme sami termín", key:"Hlídáme sami termín", type:"yesno"},
    {label:"Smlouva", key:"Smlouva ano/ne", type:"yesno"},
    {label:"Cena FZ", key:"Cena FZ"},
    {label:"Důležité poznámky", key:"Důležitá poznámka", type:"textarea", full:true, important:true}
  ];
  const FB_HIDDEN_KEYS = ["GPS_lat", "GPS_lon"];
  window.firebaseUnifiedEditableKeys = FB_USER_FIELDS.map(f=>f.key);
  const FB_COLLECTION = "sitesUnified";
  const FIREBASE_SITE_CACHE_KEY = "astipFirebaseSitesMapCacheV2";
  const FIREBASE_BACKGROUND_REFRESH_MIN_MS = 45000;
  let previewMarker = null;
  let firebaseSitesLoading = false;
  let firebaseSitesLoadingPromise = null;
  let firebaseSitesLoadingResolve = null;
  let firebaseSitesLastNetworkLoadAt = 0;
  let firebaseSitesBackgroundRefreshTimer = null;
  let firebaseSitesBackgroundRefreshPromise = null;

  const val = v => String(v ?? "").trim();
  const num = v => { const n = parseFloat(String(v ?? "").replace(",", ".")); return Number.isFinite(n) ? n : NaN; };
  const esc = v => String(v ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

  function markFirebaseSitesNetworkLoad(){
    firebaseSitesLastNetworkLoadAt = Date.now();
  }

  function firebaseSitesNetworkIsFresh(maxAge=FIREBASE_BACKGROUND_REFRESH_MIN_MS){
    return !!firebaseSitesLastNetworkLoadAt && Date.now()-firebaseSitesLastNetworkLoadAt < maxAge;
  }

  function canRunFirebaseSitesBackgroundRefresh(openDocId=null){
    if(openDocId) return false;
    if(navigator.onLine===false) return false;
    if(document.visibilityState==="hidden") return false;
    if(firebaseSitesBackgroundRefreshPromise) return false;
    if(firebaseSitesNetworkIsFresh()) return false;
    return true;
  }

  function scheduleFirebaseSitesBackgroundRefresh(openDocId=null, delay=80){
    if(!canRunFirebaseSitesBackgroundRefresh(openDocId)) return;
    clearTimeout(firebaseSitesBackgroundRefreshTimer);
    firebaseSitesBackgroundRefreshTimer=setTimeout(async()=>{
      firebaseSitesBackgroundRefreshTimer=null;
      if(!canRunFirebaseSitesBackgroundRefresh(openDocId)) return;
      firebaseSitesBackgroundRefreshPromise=loadFirebaseSites(null,{
        force:true,
        skipLocalCache:true,
        skipFirestoreCache:true,
        backgroundRefresh:true
      }).catch(e=>{
        console.warn("Tiché obnovení Firebase bodů selhalo",e);
        return Array.isArray(window.rows) ? window.rows : [];
      }).finally(()=>{
        firebaseSitesBackgroundRefreshPromise=null;
      });
      await firebaseSitesBackgroundRefreshPromise;
    },delay);
  }

  function rawKeyNorm(k){
    return String(k || "").trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[\/\\,.;:()\-]+/g," ")
      .replace(/_/g," ")
      .replace(/\s+/g," ")
      .trim();
  }
  const allowedRawKeys = new Set([
    ...FB_USER_FIELDS.map(f=>f.key),
    ...(window.WATCH_SELF_RAW_KEYS || []),
    "GPS_lat","GPS_lon","Příští_kontrola","Poslední_kontrola","Kontrola objednaná","Objednaná oprava","Stop Stav","Zdroj_dat","Firebase_doc_id","Klíč_adresy"
  ]);
  const rawKeyAliases = {
    "nazev":"Název",
    "adresa umisteni":"Adresa / umístění",
    "puvodni adresa umisteni":"Adresa / umístění",
    "adresa gps":"Adresa_GPS",
    "kraj":"Kraj",
    "popis zdroje":"Popis_zdroje",
    "jaky zdroj":"Popis_zdroje",
    "vyrobni cislo":"Zdroj",
    "seriove cislo":"Zdroj",
    "serial":"Zdroj",
    "sn":"Zdroj",
    "zdroj":"Zdroj",
    "kontakt":"Kontakt",
    "kontakt mapy":"Kontakt",
    "hlavni kontakt":"Kontakt",
    "umisteni zdroje":"Umístění zdroje",
    "umisteni":"Umístění zdroje",
    "historie oprav":"Historie oprav",
    "historie oprav zdroje":"Historie oprav",
    "postup testovani":"Postup testování",
    "postup testu":"Postup testování",
    "jistic ups":"Jistič UPS",
    "jistice ups":"Jistič UPS",
    "poznamky":"Poznámky",
    "poznamky mapy":"Poznámky",
    "perioda":"Perioda kontrol",
    "perioda kontrol":"Perioda kontrol",
    "cetnost":"Perioda kontrol",
    "hlidame sami termin":"Hlídáme sami termín",
    "hlidame kontroly sami":"Hlídáme sami termín",
    "hlidame termin sami":"Hlídáme sami termín",
    "hlidat termin sami":"Hlídáme sami termín",
    "jezdit bez objednavky":"Jezdit bez objednávky",
    "bez objednavky":"Bez objednávky",
    "ruzova":"Růžová",
    "smlouva":"Smlouva ano/ne",
    "smlouva ano ne":"Smlouva ano/ne",
    "cena fz":"Cena FZ",
    "cena fz v kc":"Cena FZ",
    "dulezita poznamka":"Důležitá poznámka",
    "dulezite poznamky":"Důležitá poznámka",
    "gps lat":"GPS_lat",
    "gps lon":"GPS_lon",
    "pristi kontrola":"Příští_kontrola",
    "pristi planovana kontrola":"Příští_kontrola",
    "posledni kontrola":"Poslední_kontrola",
    "posledni probehla kontrola":"Poslední_kontrola",
    "kontrola objednana":"Kontrola objednaná",
    "objednano":"Kontrola objednaná",
    "objednana oprava":"Objednaná oprava",
    "oprava objednana":"Objednaná oprava",
    "objednano oprava":"Objednaná oprava",
    "stop":"Stop Stav",
    "stop stav":"Stop Stav",
    "stop stav zdroje":"Stop Stav",
    "zdroj ve stop stavu":"Stop Stav",
    "odstaveno":"Stop Stav",
    "mimo provoz":"Stop Stav",
    "zdroj dat":"Zdroj_dat",
    "firebase doc id":"Firebase_doc_id",
    "klic adresy":"Klíč_adresy"
  };
  function canonicalRawKey(k){
    if(allowedRawKeys.has(k)) return k;
    return rawKeyAliases[rawKeyNorm(k)] || "";
  }
  function yesNo(v, fallback="ne"){
    const n=rawKeyNorm(v);
    if(n==="ano" || n==="yes" || n==="true" || n==="1") return "ano";
    if(n==="ne" || n==="no" || n==="false" || n==="0") return "ne";
    return fallback;
  }
  function regionOptions(current=""){
    const defaults=typeof window.appRegionOptions==="function" ? window.appRegionOptions() : [
      "Hlavní město Praha","Středočeský kraj","Jihočeský kraj","Plzeňský kraj","Karlovarský kraj",
      "Ústecký kraj","Liberecký kraj","Královéhradecký kraj","Pardubický kraj","Kraj Vysočina",
      "Jihomoravský kraj","Olomoucký kraj","Moravskoslezský kraj","Zlínský kraj","Slovensko"
    ];
    const map=new Map();
    const add=v=>{
      const clean=val(v);
      const key=rawKeyNorm(clean);
      if(!key && !map.has("")) map.set("", "");
      if(key && !map.has(key)) map.set(key, clean);
    };
    add("");
    defaults.forEach(add);
    const currentKey=rawKeyNorm(current);
    return [...map.entries()].map(([key,v])=>`<option value="${esc(v)}" ${key===currentKey ? "selected" : ""}>${esc(v || "Vyber kraj")}</option>`).join("");
  }
  function dateInputFromDate(date){
    if(!date || isNaN(date.getTime())) return "";
    const y=date.getFullYear();
    const m=String(date.getMonth()+1).padStart(2,"0");
    const d=String(date.getDate()).padStart(2,"0");
    return `${y}-${m}-${d}`;
  }
  function addMonthsToInput(value, months){
    if(!value) return "";
    const d=new Date(value+"T00:00:00");
    if(isNaN(d.getTime())) return "";
    const day=d.getDate();
    d.setMonth(d.getMonth()+months);
    if(d.getDate()!==day) d.setDate(0);
    return dateInputFromDate(d);
  }
  function status(msg,bad=false){
    const s=document.getElementById("fbUnifiedStatus");
    if(s){s.textContent=msg;s.className=bad?"fbUnifiedNotice fbUnifiedErr":"fbUnifiedNotice";}
    const p=document.getElementById("progress");
    if(p) p.textContent=msg;
  }
  function sideStatus(msg,bad=false){
    let el=document.getElementById("firebaseUnifiedStatus");
    if(!bad){
      if(el) el.remove();
      return;
    }
    if(!el){
      const gps=document.getElementById("gpsBox");
      if(gps){el=document.createElement("div");el.id="firebaseUnifiedStatus";gps.parentNode.insertBefore(el,gps.nextSibling);}
    }
    if(el){el.className="notice err";el.textContent=msg;}
  }
  function ensureCompatFirebase(){
    if(!window.firebase) return null;
    try{
      if((!firebase.apps || !firebase.apps.length) && window.__firebaseConfig){
        firebase.initializeApp(window.__firebaseConfig);
      }
      return firebase.apps && firebase.apps.length ? firebase : null;
    }catch(e){
      console.warn("Firebase compat inicializace selhala",e);
      return null;
    }
  }
  function serverTimestampValue(){
    try{
      if(window.fb && window.fb.fsMod && window.fb.fsMod.serverTimestamp) return window.fb.fsMod.serverTimestamp();
    }catch(e){}
    try{
      if(window.firebase && firebase.firestore && firebase.firestore.FieldValue) return firebase.firestore.FieldValue.serverTimestamp();
    }catch(e){}
    return new Date().toISOString();
  }
  function modularDatabase(){
    const fs=window.fb && window.fb.fsMod;
    const firestore=window.db;
    if(!fs || !firestore || !fs.collection || !fs.doc || !fs.getDocs || !fs.setDoc) return null;
    const wrapDoc=ref=>({
      _ref:ref,
      id:ref.id,
      set:(data,opts)=>fs.setDoc(ref,data,opts),
      delete:()=>fs.deleteDoc ? fs.deleteDoc(ref) : Promise.resolve(false)
    });
    const wrapCollection=name=>({
      doc:id=>wrapDoc(id ? fs.doc(firestore,name,id) : fs.doc(fs.collection(firestore,name))),
      get:async()=>{
        const snap=await fs.getDocs(fs.collection(firestore,name));
        return {
          empty:snap.empty,
          size:snap.size,
          forEach:fn=>snap.forEach(docSnap=>fn({id:docSnap.id,data:()=>docSnap.data()}))
        };
      },
      getCached:async()=>{
        if(!fs.getDocsFromCache) return null;
        const snap=await fs.getDocsFromCache(fs.collection(firestore,name));
        return {
          empty:snap.empty,
          size:snap.size,
          forEach:fn=>snap.forEach(docSnap=>fn({id:docSnap.id,data:()=>docSnap.data()}))
        };
      }
    });
    return {
      mode:"modular",
      collection:wrapCollection,
      batch:()=>{
        const batch=fs.writeBatch ? fs.writeBatch(firestore) : null;
        if(!batch) throw new Error("Firebase batch není dostupný.");
        return {
          set:(ref,data,opts)=>batch.set(ref && ref._ref ? ref._ref : ref,data,opts),
          delete:ref=>batch.delete(ref && ref._ref ? ref._ref : ref),
          commit:()=>batch.commit()
        };
      }
    };
  }
  function db(){
    const modern=modularDatabase();
    if(modern) return modern;
    const compat=ensureCompatFirebase();
    if(!compat) return null;
    try{return compat.firestore();}catch(e){return null;}
  }
  function user(){
    const compat=ensureCompatFirebase();
    if(!compat) return null;
    try{return compat.auth().currentUser || window.__authReadyUser || window.currentUser || null;}catch(e){return window.__authReadyUser || window.currentUser || null;}
  }
  function waitCompatUser(timeoutMs=3500){
    if(window.__authReadyUser || window.currentUser) return Promise.resolve(window.__authReadyUser || window.currentUser);
    if(typeof window.waitForFirebaseUser==="function") return window.waitForFirebaseUser(timeoutMs);
    const compat=ensureCompatFirebase();
    if(!compat || !compat.auth) return Promise.resolve(window.__authReadyUser || window.currentUser || null);
    const auth=compat.auth();
    try{
      auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .catch(()=>auth.setPersistence(firebase.auth.Auth.Persistence.SESSION))
        .catch(()=>{});
    }catch(e){}
    if(auth.currentUser || window.__authReadyUser || window.currentUser) return Promise.resolve(auth.currentUser || window.__authReadyUser || window.currentUser);
    return new Promise(resolve=>{
      let done=false;
      let unsub=null;
      const finish=u=>{
        if(done) return;
        done=true;
        if(unsub) try{unsub();}catch(e){}
        if(u){
          window.currentUser=u;
          window.__authReadyUser=u;
        }
        resolve(u || null);
      };
      const timer=setTimeout(()=>finish(auth.currentUser || window.__authReadyUser || window.currentUser || null),timeoutMs);
      try{
        unsub=auth.onAuthStateChanged(u=>{
          if(!u) return;
          clearTimeout(timer);
          finish(u);
        });
      }catch(e){
        clearTimeout(timer);
        finish(auth.currentUser || window.__authReadyUser || window.currentUser || null);
      }
    });
  }
  function dedupKeys(raw){
    return typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(raw || {}) : [];
  }
  function addDedupKeys(target, raw){
    dedupKeys(raw).forEach(k=>target.add(k));
  }
  function hasDuplicateKey(target, raw){
    const keys=dedupKeys(raw);
    return keys.length && keys.some(k=>target.has(k));
  }
  function existingDedupKeysFromSnapshot(snap){
    const keys=new Set();
    snap.forEach(doc=>addDedupKeys(keys, (doc.data()||{}).raw || {}));
    return keys;
  }
  async function deleteDuplicateDocs(database, docIds){
    const ids=[...new Set((docIds||[]).filter(Boolean))];
    if(!ids.length) return 0;
    let batch=database.batch(), count=0, batchCount=0;
    for(const id of ids){
      batch.delete(database.collection(FB_COLLECTION).doc(id));
      count++; batchCount++;
      if(batchCount>=350){await batch.commit(); batch=database.batch(); batchCount=0;}
    }
    if(batchCount>0) await batch.commit();
    return count;
  }
  function duplicateCandidateScore(data, existingKeys, docId, wanted){
    const raw=(data&&data.raw)||{};
    let score=0;
    existingKeys.forEach(k=>{
      if(!wanted.has(k)) return;
      score += k.startsWith("address:") ? 1000 : 100;
    });
    if(Number.isFinite(num(raw["GPS_lat"])) && Number.isFinite(num(raw["GPS_lon"]))) score+=50;
    if(data && data.manualEntry) score+=1000000;
    if(docId && !String(docId).startsWith("site_")) score+=500000;
    if(val(raw["Adresa_GPS"]) || val(raw["Adresa / umístění"])) score+=10;
    if(val(raw["Název"])) score+=5;
    if(data && data.createdAt) score+=3;
    if(data && data.migratedFromCsv) score-=1000;
    return score;
  }
  function bestDuplicateFromDocEntries(entries, wanted, skip){
    let found=null;
    (entries || []).forEach(entry=>{
      const id=String(entry && entry.id || "");
      if(!id || (skip && id===skip)) return;
      const data=(entry && entry.data) || {};
      const existingKeys=dedupKeys(data.raw || {});
      if(!existingKeys.some(k=>wanted.has(k))) return;
      const score=duplicateCandidateScore(data, existingKeys, id, wanted);
      if(!found || score>found.score) found={id,data,score};
    });
    return found ? {id:found.id,data:found.data} : null;
  }
  function currentRowDuplicateEntries(){
    const current=Array.isArray(window.rows) ? window.rows : [];
    return current.map(row=>{
      const raw=row && row.raw || {};
      const data={...(row?.firebaseData || {}),raw};
      const id=String(row?.firebaseDocId || raw["Firebase_doc_id"] || row?.id || "");
      return {id,data};
    }).filter(entry=>entry.id && entry.data && entry.data.raw);
  }
  function currentRowsHaveFirestoreDedupKeys(){
    const current=Array.isArray(window.rows) ? window.rows : [];
    return current.length>0 && current.every(row=>Array.isArray(row?.firebaseData?.dedupKeys));
  }
  async function queryDuplicateDocsByDedupKeys(database, keys, skip){
    const uniqueKeys=(keys || []).map(k=>String(k || "")).filter((k,idx,arr)=>k && arr.indexOf(k)===idx);
    if(!uniqueKeys.length) return {queried:false,entries:[]};
    const chunks=[];
    for(let i=0;i<uniqueKeys.length;i+=10) chunks.push(uniqueKeys.slice(i,i+10));
    const entries=[];
    const seen=new Set();
    const addEntry=(id,data)=>{
      const cleanId=String(id || "");
      if(!cleanId || seen.has(cleanId) || (skip && cleanId===skip)) return;
      seen.add(cleanId);
      entries.push({id:cleanId,data:data || {}});
    };
    let queried=false;
    for(const chunk of chunks){
      try{
        const fs=window.fb && window.fb.fsMod;
        if(fs && window.db && fs.collection && fs.query && fs.where && fs.getDocs){
          const snap=await fs.getDocs(fs.query(fs.collection(window.db,FB_COLLECTION),fs.where("dedupKeys","array-contains-any",chunk)));
          snap.forEach(docSnap=>addEntry(docSnap.id,docSnap.data() || {}));
          queried=true;
          continue;
        }
        if(database && typeof database.collection==="function"){
          const collectionRef=database.collection(FB_COLLECTION);
          if(collectionRef && typeof collectionRef.where==="function"){
            const snap=await collectionRef.where("dedupKeys","array-contains-any",chunk).get();
            snap.forEach(docSnap=>addEntry(docSnap.id,docSnap.data() || {}));
            queried=true;
          }
        }
      }catch(e){
        console.warn("Rychlý dotaz duplicit podle dedupKeys selhal",e);
        return {queried:false,entries:[]};
      }
    }
    return {queried,entries};
  }
  async function findDuplicateDoc(database, raw, skipDocId=null){
    const keys=dedupKeys(raw);
    if(!keys.length) return null;
    const wanted=new Set(keys);
    const skip=skipDocId ? String(skipDocId) : "";
    const localMatch=bestDuplicateFromDocEntries(currentRowDuplicateEntries(),wanted,skip);
    if(localMatch) return localMatch;
    const fastResult=await queryDuplicateDocsByDedupKeys(database,keys,skip);
    const fastMatch=bestDuplicateFromDocEntries(fastResult.entries,wanted,skip);
    if(fastMatch) return fastMatch;
    if(fastResult.queried && currentRowsHaveFirestoreDedupKeys()) return null;
    const snap=await database.collection(FB_COLLECTION).get();
    const entries=[];
    snap.forEach(doc=>{
      entries.push({id:doc.id,data:doc.data() || {}});
    });
    return bestDuplicateFromDocEntries(entries,wanted,skip);
  }

  function docIdFromRaw(raw,i){
    const base = val(raw["Klíč_adresy"]) || val(raw["ID_mista"]) || val(raw["Název"]) || val(raw["Adresa_GPS"]) || val(raw["Adresa / umístění"]) || ("row_"+i);
    let h=0; for(let x=0;x<base.length;x++) h=((h<<5)-h+base.charCodeAt(x))|0;
    return "site_" + Math.abs(h).toString(36) + "_" + String(i).padStart(5,"0");
  }
  function field(spec){
    const k=spec.key;
    const cls=[spec.full ? "full" : "", spec.important ? "fbImportant" : ""].filter(Boolean).join(" ");
    if(spec.type==="region") return `<div class="${cls}"><label>${esc(spec.label)}</label><select data-fb-key="${esc(k)}">${regionOptions()}</select></div>`;
    if(spec.type==="period") return `<div class="${cls}"><label>${esc(spec.label)}</label><select data-fb-key="${esc(k)}"><option value="6">6 měsíců</option><option value="12" selected>12 měsíců</option></select></div>`;
    if(spec.type==="yesno") return `<div class="${cls}"><label>${esc(spec.label)}</label><select data-fb-key="${esc(k)}"><option value="ne" selected>ne</option><option value="ano">ano</option></select></div>`;
    if(spec.type==="textarea") return `<div class="${cls}"><label>${esc(spec.label)}</label><textarea data-fb-key="${esc(k)}"></textarea></div>`;
    if(spec.readonly) return `<div class="${cls}"><label>${esc(spec.label)}</label><input data-fb-key="${esc(k)}" readonly title="Dopočítá se z adresy"></div>`;
    return `<div class="${cls}"><label>${esc(spec.label)}</label><input data-fb-key="${esc(k)}"></div>`;
  }
  function ensurePanel(){
    if(document.getElementById("fbUnifiedPanel")) return;
    const overlay=document.createElement("div"); overlay.id="fbUnifiedOverlay"; overlay.onclick=closePanel; document.body.appendChild(overlay);
    const panel=document.createElement("div"); panel.id="fbUnifiedPanel";
    panel.innerHTML=`
      <div class="fbUnifiedHead"><div><h2>Přidat nové místo</h2><p class="small">Nové místo se uloží mezi ostatní body.</p><div class="fbDbBadge">Kolekce: <b>${FB_COLLECTION}</b></div></div><button class="fbSecondary" id="fbUnifiedClose" type="button">Zavřít</button></div>
      <div id="fbUnifiedStatus" class="fbUnifiedNotice">Připraveno. Vyplň aspoň název/adresu a GPS.</div>
      <div class="fbUnifiedDates control-dates-strong">
        <div class="control-date-box control-date-last"><span>Poslední proběhlá kontrola</span><input id="fbUnifiedLastCheck" type="date"></div>
        <div class="control-date-box control-date-next"><span>Příští plánovaná kontrola</span><input id="fbUnifiedNextCheck" type="date"></div>
      </div>
      <div class="fbUnifiedActions"><button class="fbSecondary" id="fbUnifiedGps" type="button">Dopočítat GPS</button><button class="fbSecondary" id="fbUnifiedPick" type="button">Vybrat na mapě</button><button class="fbSecondary" id="fbUnifiedFind" type="button">Ukázat bod na mapě</button><button class="fbPrimary" id="fbUnifiedSave" type="button">Uložit bod a otevřít detail</button><button class="fbDanger" id="fbUnifiedClear" type="button">Vymazat formulář</button></div>
      <div class="fbUnifiedGrid">${FB_USER_FIELDS.map(field).join("")}${FB_HIDDEN_KEYS.map(k=>`<input type="hidden" data-fb-key="${esc(k)}">`).join("")}</div>`;
    document.body.appendChild(panel);
    document.getElementById("fbUnifiedClose").onclick=closePanel;
    document.getElementById("fbUnifiedGps").onclick=calcGps;
    document.getElementById("fbUnifiedPick").onclick=window.startFbUnifiedManualGpsPick;
    document.getElementById("fbUnifiedFind").onclick=findOnMap;
    document.getElementById("fbUnifiedSave").onclick=savePoint;
    document.getElementById("fbUnifiedClear").onclick=clearForm;
    const last=document.getElementById("fbUnifiedLastCheck");
    const next=document.getElementById("fbUnifiedNextCheck");
    const period=panel.querySelector('[data-fb-key="Perioda kontrol"]');
    if(last && next){
      last.addEventListener("change",()=>{
        const months=period && period.value==="6" ? 6 : 12;
        next.value=addMonthsToInput(last.value, months);
      });
    }
  }
  function openPanel(e){
    if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    ensurePanel(); document.getElementById("fbUnifiedOverlay").classList.add("open"); document.getElementById("fbUnifiedPanel").classList.add("open");
    clearForm(true);
    status("Panel otevřen. Po uložení se bod hned otevře v detailu.");
    window.szzAfterPaint(()=>{const first=document.querySelector('#fbUnifiedPanel [data-fb-key="Název"]') || document.querySelector('#fbUnifiedPanel input'); if(first) first.focus();});
    return false;
  }
  window.openFirebaseUnifiedPanel=openPanel;
  function closePanel(){
    const o=document.getElementById("fbUnifiedOverlay"), p=document.getElementById("fbUnifiedPanel");
    if(o)o.classList.remove("open"); if(p)p.classList.remove("open");
  }
  function setField(k,v){ const el=document.querySelector(`#fbUnifiedPanel [data-fb-key="${CSS.escape(k)}"]`); if(el) el.value=v; }
  function getRaw(){
    ensurePanel(); const raw={};
    document.querySelectorAll("#fbUnifiedPanel [data-fb-key]").forEach(el=>{const k=el.getAttribute("data-fb-key"); const v=val(el.value); if(v) raw[k]=v;});
    if(raw["Adresa / umístění"] && !raw["Název"]) raw["Název"]=raw["Adresa / umístění"];
    raw["Hlídáme sami termín"]=yesNo(raw["Hlídáme sami termín"],"ne");
    if(typeof window.applyWatchSelfAliases==="function") window.applyWatchSelfAliases(raw, raw["Hlídáme sami termín"]);
    raw["Smlouva ano/ne"]=yesNo(raw["Smlouva ano/ne"],"ne");
    const last=val(document.getElementById("fbUnifiedLastCheck")?.value);
    const next=val(document.getElementById("fbUnifiedNextCheck")?.value);
    if(last) raw["Poslední_kontrola"]=last;
    if(next) raw["Příští_kontrola"]=next;
    const datePeriod=typeof window.inferControlPeriodMonthsFromDateValues==="function" ? window.inferControlPeriodMonthsFromDateValues(last,next) : null;
    if(datePeriod) raw["Perioda kontrol"]=String(datePeriod);
    else if(raw["Perioda kontrol"]!=="6") raw["Perioda kontrol"]="12";
    if(!raw["Zdroj_dat"]) raw["Zdroj_dat"]="Firebase";
    return compactFirebaseRaw(raw);
  }
  function completeFirebaseRaw(raw, docId=null){
    const out=compactFirebaseRaw(raw || {});
    if(val(out["Adresa / umístění"]) && !val(out["Název"])) out["Název"]=out["Adresa / umístění"];
    const watchValue=val(out["Hlídáme sami termín"])
      ? yesNo(out["Hlídáme sami termín"],"ne")
      : (typeof window.canonicalWatchSelfValue==="function" ? window.canonicalWatchSelfValue(out) : "ne");
    out["Hlídáme sami termín"]=watchValue;
    if(typeof window.applyWatchSelfAliases==="function") window.applyWatchSelfAliases(out, watchValue);
    if(val(out["Smlouva ano/ne"])) out["Smlouva ano/ne"]=yesNo(out["Smlouva ano/ne"],"ne");
    if(val(out["Stop Stav"])) out["Stop Stav"]=yesNo(out["Stop Stav"],"ne");
    const datePeriod=typeof window.inferControlPeriodMonthsFromDates==="function" ? window.inferControlPeriodMonthsFromDates(out) : null;
    if(datePeriod) out["Perioda kontrol"]=String(datePeriod);
    else if(!val(out["Perioda kontrol"])) out["Perioda kontrol"]="12";
    if(!val(out["Zdroj_dat"])) out["Zdroj_dat"]="Firebase";
    if(docId){
      out["Firebase_doc_id"]=docId;
      if(!val(out["Klíč_adresy"])) out["Klíč_adresy"]="firebase_"+docId;
    }
    return compactFirebaseRaw(out);
  }
  function compactFirebaseRaw(raw){
    const out={};
    Object.entries(raw || {}).forEach(([k,v])=>{
      const key=String(k || "").trim();
      if(!key) return;
      if(/^Sloupec_\d+$/i.test(key)) return;
      const canonical=canonicalRawKey(key);
      if(!canonical) return;
      const value=typeof v==="string" ? v.trim() : v;
      if(value===undefined || value===null || value==="") return;
      if(!out[canonical] || canonical===key) out[canonical]=value;
    });
    return out;
  }
  function mergeDuplicateRaw(existingRaw, incomingRaw, docId){
    const out=completeFirebaseRaw(existingRaw || {}, docId);
    Object.entries(incomingRaw || {}).forEach(([k,v])=>{
      if(val(v) && !val(out[k])) out[k]=v;
    });
    const existingLat=num(out["GPS_lat"]);
    const existingLon=num(out["GPS_lon"]);
    const incomingLat=num(incomingRaw && incomingRaw["GPS_lat"]);
    const incomingLon=num(incomingRaw && incomingRaw["GPS_lon"]);
    const existingVisible=Number.isFinite(existingLat)&&Number.isFinite(existingLon)&&existingLat>=47&&existingLat<=51.5&&existingLon>=12&&existingLon<=23;
    const incomingVisible=Number.isFinite(incomingLat)&&Number.isFinite(incomingLon)&&incomingLat>=47&&incomingLat<=51.5&&incomingLon>=12&&incomingLon<=23;
    if(incomingVisible && !existingVisible){
      out["GPS_lat"]=String(incomingRaw["GPS_lat"]);
      out["GPS_lon"]=String(incomingRaw["GPS_lon"]);
    }else{
      if(!Number.isFinite(existingLat) && Number.isFinite(incomingLat)) out["GPS_lat"]=String(incomingRaw["GPS_lat"]);
      if(!Number.isFinite(existingLon) && Number.isFinite(incomingLon)) out["GPS_lon"]=String(incomingRaw["GPS_lon"]);
    }
    return completeFirebaseRaw(out, docId);
  }
  async function unhideOpenedRow(database, row){
    if(!row || !row.id) return;
    try{
      if(typeof deletedSiteIds!=="undefined" && deletedSiteIds && deletedSiteIds.has(row.id)){
        deletedSiteIds.delete(row.id);
        await database.collection("deletedSites").doc(row.id).delete().catch(()=>{});
      }
    }catch(e){
      console.warn("Nepodařilo se zrušit skrytí otevřeného bodu",e);
    }
  }
  async function openDuplicateDoc(database, duplicate, incomingRaw, currentUser){
    const mergedRaw=mergeDuplicateRaw((duplicate.data&&duplicate.data.raw)||{}, incomingRaw, duplicate.id);
    const mergedLat=num(mergedRaw["GPS_lat"]);
    const mergedLon=num(mergedRaw["GPS_lon"]);
    const updateData={
      raw:mergedRaw,
      dedupKeys:dedupKeys(mergedRaw),
      name:mergedRaw["Název"]||mergedRaw["Adresa / umístění"]||mergedRaw["Adresa_GPS"]||"",
      lat:Number.isFinite(mergedLat)?mergedLat:null,
      lon:Number.isFinite(mergedLon)?mergedLon:null,
      updatedAt:serverTimestampValue(),
      updatedBy:(currentUser&&currentUser.email)||"",
      manualEntry:true,
      migratedFromCsv:false
    };
    await database.collection(FB_COLLECTION).doc(duplicate.id).set(updateData,{merge:true});
    if(window.showSaveConfirmation) window.showSaveConfirmation("Bod aktualizován.");
    const localData={...(duplicate.data||{}),...updateData,updatedAt:new Date().toISOString()};
    const row=rowFromDoc(duplicate.id,localData);
    await unhideOpenedRow(database,row);
    closePanel();
    window.__lastSavedFirebaseSiteDocId=duplicate.id;
    if(previewMarker){try{map.removeLayer(previewMarker);}catch(_e){} previewMarker=null;}
    upsertSavedFirebaseRowAfterSave(row, duplicate.id);
    return row;
  }
  async function calcGps(){
    const raw=getRaw(); const address=raw["Adresa / umístění"] || raw["Název"];
    if(!address){status("Vyplň nejdřív adresu / umístění.",true);return;}
    try{
      status("Dopočítávám GPS...");
      const geocode=window.geocodeAddressGeneric;
      const inferRegion=window.inferRegionFromAddressText;
      const found=typeof geocode==="function" ? await geocode(address) : null;
      if(!found){
        const region=typeof inferRegion==="function" ? inferRegion(address) : "";
        if(region && !val(raw["Kraj"])) setField("Kraj",region);
        status(window.lastGeocodeMessage || (region ? "GPS se nepodařilo dopočítat, kraj jsem doplnil podle textu adresy." : "Adresa nebyla nalezena."),true);
        return;
      }
      setField("Adresa_GPS",`${found.lat}, ${found.lon}`);
      setField("GPS_lat",found.lat);
      setField("GPS_lon",found.lon);
      if(!val(raw["Kraj"]) && typeof inferRegion==="function"){
        const region=inferRegion(found.display || address, found.address || {});
        if(region) setField("Kraj",region);
      }
      status("GPS doplněno.");
    }catch(e){status("Chyba dopočtu GPS: "+e.message,true);}
  }
  function findOnMap(){
    const raw=getRaw(); const lat=num(raw["GPS_lat"]), lon=num(raw["GPS_lon"]);
    if(!Number.isFinite(lat)||!Number.isFinite(lon)){status("Nejdřív klikni Dopočítat GPS.",true);return;}
    try{
      if(previewMarker) map.removeLayer(previewMarker);
      previewMarker=L.circleMarker([lat,lon],{radius:10,color:"#111827",weight:2,fillColor:"#2563eb",fillOpacity:.95}).addTo(map);
      previewMarker.bindPopup("Nový bod - náhled");
      closePanel();
      const reopen=()=>{
        ensurePanel();
        document.getElementById("fbUnifiedOverlay").classList.add("open");
        document.getElementById("fbUnifiedPanel").classList.add("open");
        window.szzAfterPaint(()=>{try{map.invalidateSize(true);}catch(e){}});
      };
      if(typeof window.showMapFocusLocation==="function"){
        window.showMapFocusLocation(lat,lon,raw["Název"] || raw["Adresa / umístění"] || "Nový bod","náhled před uložením",reopen);
      }else{
        map.setView([lat,lon],15);
        previewMarker.openPopup();
      }
    }catch(e){status("Chyba mapy: "+e.message,true);}
  }
  function rowFromDoc(docId, d){
    const normalizeRows = window.normalizeSiteRows || window.normalize;
    const applyRowEdit = window.applySiteEditToRow || window.applyEditToRow || (row => row);
    if(typeof normalizeRows !== "function") throw new Error("normalizeSiteRows není dostupné");
    let raw=Object.assign({}, d.raw || {});
    if(typeof window.applyLatestProtocolDateToRaw==="function"){
      raw=window.applyLatestProtocolDateToRaw(raw,d || {});
    }
    raw["Firebase_doc_id"]=docId;
    if(!raw["Klíč_adresy"]) raw["Klíč_adresy"]="firebase_"+docId;
    const r=normalizeRows([raw])[0];
    r.id=raw["Klíč_adresy"]; r.raw=raw; r.firebaseDocId=docId;
    r.firebaseData=d;
    return applyRowEdit(r);
  }
  function rowsFromSnapshot(snap){
    const firebaseRows=[];
    if(!snap || typeof snap.forEach!=="function") return firebaseRows;
    snap.forEach(doc=>firebaseRows.push(rowFromDoc(doc.id, doc.data()||{})));
    return firebaseRows;
  }
  const MAP_ROWS_CACHE_DB_NAME="astipMapRowsCache";
  const MAP_ROWS_CACHE_DB_VERSION=1;
  const MAP_ROWS_CACHE_STORE="rows";
  const MAP_ROWS_CACHE_RECORD_KEY="latest";
  const MAP_ROWS_CACHE_SAVE_DELAY_MS=120;
  let mapRowsCacheSaveTimer=0;
  let mapRowsCacheSaveVersion=0;
  let pendingMapRowsCacheItems=[];
  function mapRowsCacheItems(firebaseRows){
    return (firebaseRows || []).map(row=>({
      docId:row.firebaseDocId || row.raw?.["Firebase_doc_id"] || row.id || "",
      raw:row.raw || {},
      latestProtocolDate:row.firebaseData?.latestProtocolDate || ""
    })).filter(item=>item.docId && item.raw && Object.keys(item.raw).length);
  }
  function openMapRowsCacheDb(){
    return new Promise((resolve,reject)=>{
      if(!("indexedDB" in window)){
        reject(new Error("IndexedDB není dostupné."));
        return;
      }
      const req=indexedDB.open(MAP_ROWS_CACHE_DB_NAME,MAP_ROWS_CACHE_DB_VERSION);
      req.onupgradeneeded=()=>{
        const database=req.result;
        if(!database.objectStoreNames.contains(MAP_ROWS_CACHE_STORE)){
          database.createObjectStore(MAP_ROWS_CACHE_STORE,{keyPath:"key"});
        }
      };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>reject(req.error || new Error("Cache bodů se nepodařila otevřít."));
    });
  }
  async function saveMapRowsCacheIndexedDbItems(items){
    if(!items.length) return;
    const database=await openMapRowsCacheDb();
    return new Promise((resolve,reject)=>{
      const tx=database.transaction(MAP_ROWS_CACHE_STORE,"readwrite");
      tx.objectStore(MAP_ROWS_CACHE_STORE).put({key:MAP_ROWS_CACHE_RECORD_KEY,savedAt:Date.now(),items});
      tx.oncomplete=()=>{database.close();resolve(true);};
      tx.onerror=()=>{database.close();reject(tx.error || new Error("Cache bodů se nepodařila uložit."));};
    });
  }
  function rowsFromMapRowsCacheItems(items){
    return (items || []).map(item=>rowFromDoc(item.docId,{raw:item.raw || {},latestProtocolDate:item.latestProtocolDate || ""})).filter(Boolean);
  }
  async function readMapRowsCacheIndexedDb(){
    try{
      const database=await openMapRowsCacheDb();
      const record=await new Promise((resolve,reject)=>{
        const tx=database.transaction(MAP_ROWS_CACHE_STORE,"readonly");
        const req=tx.objectStore(MAP_ROWS_CACHE_STORE).get(MAP_ROWS_CACHE_RECORD_KEY);
        req.onsuccess=()=>resolve(req.result || null);
        req.onerror=()=>reject(req.error || new Error("Cache bodů se nepodařila přečíst."));
        tx.oncomplete=()=>database.close();
        tx.onerror=()=>{database.close();reject(tx.error || new Error("Cache bodů se nepodařila přečíst."));};
      });
      const items=Array.isArray(record?.items) ? record.items : [];
      return rowsFromMapRowsCacheItems(items);
    }catch(e){
      return [];
    }
  }
  function writeMapRowsCacheMeta(items,storage="indexedDB"){
    try{
      localStorage.setItem(FIREBASE_SITE_CACHE_KEY,JSON.stringify({
        savedAt:Date.now(),
        count:items.length,
        storage
      }));
    }catch(storageError){
      console.warn("Metadata cache bodů se nepodařila uložit",storageError);
    }
  }
  function writeMapRowsCacheFallback(items){
    try{
      localStorage.setItem(FIREBASE_SITE_CACHE_KEY,JSON.stringify({
        savedAt:Date.now(),
        count:items.length,
        storage:"localStorage",
        items
      }));
    }catch(storageError){
      console.warn("Fallback cache bodů se nepodařila uložit",storageError);
    }
  }
  function scheduleMapRowsCacheIndexedDbSave(items){
    pendingMapRowsCacheItems=items;
    const saveVersion=++mapRowsCacheSaveVersion;
    clearTimeout(mapRowsCacheSaveTimer);
    mapRowsCacheSaveTimer=setTimeout(()=>{
      const latestItems=pendingMapRowsCacheItems;
      pendingMapRowsCacheItems=[];
      saveMapRowsCacheIndexedDbItems(latestItems).catch(e=>{
        console.warn("IndexedDB cache bodů se nepodařila uložit, používám localStorage fallback",e);
        if(saveVersion===mapRowsCacheSaveVersion) writeMapRowsCacheFallback(latestItems);
      });
    },MAP_ROWS_CACHE_SAVE_DELAY_MS);
  }
  function saveMapRowsCache(firebaseRows){
    try{
      const items=mapRowsCacheItems(firebaseRows);
      if(!items.length) return;
      writeMapRowsCacheMeta(items);
      scheduleMapRowsCacheIndexedDbSave(items);
    }catch(e){
      console.warn("Cache bodů se nepodařila uložit",e);
    }
  }
  window.saveFirebaseMapRowsCache=saveMapRowsCache;
  const OFFLINE_SITE_QUEUE_KEY="astipMap:offlineSites:v1";
  function readOfflineSiteQueue(){
    try{
      const items=JSON.parse(localStorage.getItem(OFFLINE_SITE_QUEUE_KEY) || "[]");
      return Array.isArray(items) ? items.filter(item=>item && item.docId && item.raw) : [];
    }catch(e){
      return [];
    }
  }
  function writeOfflineSiteQueue(items=[]){
    try{
      localStorage.setItem(OFFLINE_SITE_QUEUE_KEY,JSON.stringify(items));
      if(window.saveOfflineSiteQueueItem){
        items.forEach(item=>window.saveOfflineSiteQueueItem(item).catch(()=>{}));
      }
    }catch(e){
      console.warn("Offline frontu nových bodů se nepodařilo uložit",e);
    }
  }
  function removeOfflineSiteFromQueue(docId){
    const id=String(docId || "");
    if(!id) return;
    writeOfflineSiteQueue(readOfflineSiteQueue().filter(item=>String(item.docId || "")!==id));
    if(window.removeOfflineSiteQueueItem) window.removeOfflineSiteQueueItem(id).catch(()=>{});
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  }
  function saveUnifiedSiteRawOffline(rawInput={},opts={},reason=""){
    const docId=String(opts.docId || rawInput.Firebase_doc_id || rawInput["Firebase_doc_id"] || `offline_${Date.now()}_${Math.random().toString(36).slice(2,7)}`);
    let raw=completeFirebaseRaw(rawInput || {}, docId);
    raw["Firebase_doc_id"]=docId;
    if(!raw["Klíč_adresy"]) raw["Klíč_adresy"]="firebase_"+docId;
    const now=new Date().toISOString();
    const queue=readOfflineSiteQueue().filter(item=>String(item.docId || "")!==docId);
    const queuedItem={
      docId,
      raw,
      createdAt:now,
      updatedAt:now,
      reason:String(reason || "Offline režim"),
      createdBy:(window.currentUser && window.currentUser.email) || window.lastKnownUserEmail?.() || ""
    };
    queue.push(queuedItem);
    writeOfflineSiteQueue(queue);
    if(window.saveOfflineSiteQueueItem) window.saveOfflineSiteQueueItem(queuedItem).catch(()=>{});
    const row=rowFromDoc(docId,{raw,createdAt:now,updatedAt:now,manualEntry:true,localOnly:true,offline:true});
    const nextRows=(Array.isArray(window.rows) ? window.rows : [])
      .filter(existing=>String(existing.firebaseDocId || existing.raw?.["Firebase_doc_id"] || existing.id || "")!==docId)
      .concat([row]);
    if(typeof window.setFirebaseSiteRows==="function") window.setFirebaseSiteRows(nextRows,docId);
    else{
      rows=nextRows;
      window.rows=rows;
      if(typeof render==="function") render();
    }
    saveMapRowsCache(nextRows);
    if(window.showSaveConfirmation) window.showSaveConfirmation("Uloženo offline. Po připojení se odešle do Firebase.");
    const p=document.getElementById("progress");
    if(p) p.textContent="Nový bod/zdroj je uložený offline a čeká na synchronizaci.";
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
    if(window.registerSzzBackgroundSync) window.registerSzzBackgroundSync("site");
    return {duplicate:false,id:docId,row,offline:true,localOnly:true};
  }
  async function syncOfflineSites(options={}){
    if(navigator.onLine===false) return 0;
    const queue=(window.uniqueByOfflineId || ((items)=>items))([
      ...readOfflineSiteQueue(),
      ...(window.readOfflineSiteQueueItems ? await window.readOfflineSiteQueueItems() : [])
    ],"docId");
    if(!queue.length) return 0;
    const database=db();
    if(!database) return 0;
    const signedUser=await waitCompatUser(2500);
    if(!signedUser) return 0;
    let synced=0;
    const syncedRows=[];
    for(const item of queue){
      try{
        const result=await saveUnifiedSiteRaw(item.raw,{docId:item.docId,skipOffline:true});
        if(result && result.row) syncedRows.push({id:result.id || item.docId,row:result.row});
        removeOfflineSiteFromQueue(item.docId);
        synced++;
      }catch(e){
        console.warn("Offline bod/zdroj se nepodařilo synchronizovat",item.docId,e);
      }
    }
    if(synced && !options.silent && window.showSaveConfirmation){
      window.showSaveConfirmation(synced===1 ? "Offline bod/zdroj odeslán online." : `Offline body/zdroje odeslány online: ${synced}.`);
    }
    if(syncedRows.length){
      syncedRows.forEach(item=>upsertSavedFirebaseRowAfterSave(item.row,item.id,{openDetail:false,focusMap:false}));
    }else if(synced && typeof loadFirebaseSites==="function"){
      try{ await loadFirebaseSites(null,{force:true,skipLocalCache:true}); }catch(e){}
    }
    return synced;
  }
  window.syncOfflineSites=syncOfflineSites;
  function readMapRowsCache(){
    try{
      const parsed=JSON.parse(localStorage.getItem(FIREBASE_SITE_CACHE_KEY) || "null");
      const items=Array.isArray(parsed?.items) ? parsed.items : [];
      if(!items.length) return [];
      return rowsFromMapRowsCacheItems(items);
    }catch(e){
      return [];
    }
  }
  async function readMapRowsCacheFast(){
    if(pendingMapRowsCacheItems.length) return rowsFromMapRowsCacheItems(pendingMapRowsCacheItems);
    const indexed=await readMapRowsCacheIndexedDb();
    return indexed.length ? indexed : readMapRowsCache();
  }
  function applyFirebaseRows(firebaseRows, openDocId=null, sourceLabel="", saveCache=true){
    firebaseRows.forEach((r,i)=>r.i=i);
    if(typeof window.setFirebaseSiteRows !== "function") throw new Error("setFirebaseSiteRows není dostupné");
    const loadedRows=window.setFirebaseSiteRows(firebaseRows, openDocId);
    window.__firebaseUnifiedRowsLoaded=true;
    window.__firebaseUnifiedRowsCount=loadedRows.length;
    window.__lastFirebaseLoadError="";
    if(loadedRows.length){
      try{sessionStorage.removeItem("astipFirebaseEmptyReloadCount");}catch(e){}
      if(saveCache) saveMapRowsCache(firebaseRows);
    }else if(typeof window.scheduleFirebaseRowsAutoReload==="function"){
      window.scheduleFirebaseRowsAutoReload(7000);
    }
    sideStatus(sourceLabel || `<b>Firebase režim aktivní.</b> Načteno ${loadedRows.length} bodů z Firebase.`);
    return loadedRows;
  }
  async function showMapRowsCache(openDocId=null){
    if(openDocId) return [];
    if(Array.isArray(rows) && rows.length) return [];
    const cachedRows=await readMapRowsCacheFast();
    if(!cachedRows.length) return [];
    return applyFirebaseRows(cachedRows, openDocId, `<b>Načteno ${cachedRows.length} bodů z lokální cache.</b> Aktualizuji Firebase na pozadí...`, false);
  }
  async function saveUnifiedSiteRaw(rawInput, opts={}){
    if(navigator.onLine===false && !(opts && opts.skipOffline)){
      return saveUnifiedSiteRawOffline(rawInput,opts,"Bez připojení k internetu.");
    }
    const database=db();
    if(!database){
      if(!(opts && opts.skipOffline)) return saveUnifiedSiteRawOffline(rawInput,opts,"Firebase není dostupný.");
      throw new Error("Firebase není dostupný nebo není inicializovaný.");
    }
    const u=await waitCompatUser();
    if(!u){
      if(!(opts && opts.skipOffline)) return saveUnifiedSiteRawOffline(rawInput,opts,"Přihlášení se nepodařilo obnovit.");
      throw new Error("Nejdřív se přihlaš přes Google.");
    }

    const requestedDocId=opts && opts.docId ? String(opts.docId) : "";
    let raw=completeFirebaseRaw(rawInput || {}, requestedDocId || null);
    const duplicate=await findDuplicateDoc(database, raw, requestedDocId);
    if(duplicate){
      const row=await openDuplicateDoc(database,duplicate,raw,u);
      return {duplicate:true,id:duplicate.id,row};
    }

    const ref=requestedDocId ? database.collection(FB_COLLECTION).doc(requestedDocId) : database.collection(FB_COLLECTION).doc();
    raw=completeFirebaseRaw(raw, ref.id);
    const lat=num(raw["GPS_lat"]);
    const lon=num(raw["GPS_lon"]);
    const now=new Date().toISOString();
    const savedData={
      raw,
      dedupKeys:dedupKeys(raw),
      createdAt:serverTimestampValue(),
      updatedAt:serverTimestampValue(),
      createdBy:u.email||"",
      updatedBy:u.email||"",
      manualEntry:true,
      migratedFromCsv:false,
      name:raw["Název"]||raw["Adresa / umístění"]||raw["Adresa_GPS"]||"",
      lat:Number.isFinite(lat)?lat:null,
      lon:Number.isFinite(lon)?lon:null
    };
    await ref.set(savedData,{merge:true});
    const row=rowFromDoc(ref.id,{...savedData,createdAt:now,updatedAt:now});
    await unhideOpenedRow(database,row);
    return {duplicate:false,id:ref.id,row};
  }
  async function loadFirebaseSites(openDocId=null, opts={}){
    if(opts.auto && !openDocId && Array.isArray(window.rows) && window.rows.length && firebaseSitesNetworkIsFresh()){
      return window.rows;
    }
    const lockLoad=!openDocId && !opts.retryAuth && !opts.retryPermission && !opts.force;
    if(lockLoad && firebaseSitesLoading){
      if(firebaseSitesLoadingPromise){
        try{ await firebaseSitesLoadingPromise; }catch(e){}
      }
      return Array.isArray(window.rows) ? window.rows : [];
    }
    if(lockLoad){
      firebaseSitesLoading=true;
      firebaseSitesLoadingPromise=new Promise(resolve=>{firebaseSitesLoadingResolve=resolve;});
    }
    const database=db(); if(!database){
      sideStatus("Firebase není dostupný.",true);
      if(lockLoad){
        firebaseSitesLoading=false;
        if(firebaseSitesLoadingResolve) firebaseSitesLoadingResolve();
        firebaseSitesLoadingPromise=null;
        firebaseSitesLoadingResolve=null;
      }
      return [];
    }
    try{
      const signedUser=await waitCompatUser();
      if(!signedUser){
        if(navigator.onLine===false || (window.knownSignedIn && window.knownSignedIn())){
          const cachedRows=await showMapRowsCache(openDocId);
          if(cachedRows.length){
            const p=document.getElementById("progress");
            if(p) p.textContent=navigator.onLine===false
              ? "Offline režim. Body jsou načtené z lokální cache."
              : "Čekám na obnovení přihlášení, zatím používám lokální cache.";
            return cachedRows;
          }
        }
        sideStatus("",false);
        if(!opts.retryAuth) setTimeout(()=>loadFirebaseSites(openDocId,{retryAuth:true}),1200);
        return [];
      }
      if(!opts.skipLocalCache){
        const cachedRows=await showMapRowsCache(openDocId);
        if(cachedRows.length && !opts.force){
          scheduleFirebaseSitesBackgroundRefresh(openDocId,80);
          return cachedRows;
        }
      }
      const collectionRef=database.collection(FB_COLLECTION);
      if(!opts.skipFirestoreCache && !openDocId && database.mode==="modular" && typeof collectionRef.getCached==="function"){
        try{
          const cachedSnap=await collectionRef.getCached();
          const cachedRows=rowsFromSnapshot(cachedSnap);
          if(cachedRows.length){
            applyFirebaseRows(cachedRows, openDocId, `<b>Načteno ${cachedRows.length} bodů z Firebase cache.</b> Aktualizuji server...`, false);
          }
        }catch(e){}
      }
      sideStatus("Načítám body z Firebase...");
      const snap=await collectionRef.get();
      markFirebaseSitesNetworkLoad();
      const firebaseRows=rowsFromSnapshot(snap);
      return applyFirebaseRows(firebaseRows, openDocId);
    }catch(e){
      const message=String(e && (e.message || e.code) || e);
      window.__lastFirebaseLoadError=message;
      sideStatus("Chyba načtení z Firebase: "+message,true);
      return [];
    }finally{
      if(lockLoad){
        firebaseSitesLoading=false;
        if(firebaseSitesLoadingResolve) firebaseSitesLoadingResolve();
        firebaseSitesLoadingPromise=null;
        firebaseSitesLoadingResolve=null;
      }
    }
  }
  function upsertSavedFirebaseRowAfterSave(row, docId=null, options={}){
    const id=String(docId || row?.firebaseDocId || row?.raw?.["Firebase_doc_id"] || row?.id || "");
    if(!row || !id || typeof window.upsertFirebaseSiteRow!=="function") return false;
    try{
      const quiet=options.openDetail===false && options.focusMap===false;
      const loadedRows=window.upsertFirebaseSiteRow(row,quiet ? false : id);
      if(Array.isArray(loadedRows) && loadedRows.length) saveMapRowsCache(loadedRows);
      const found=findRowByAnyId(id,loadedRows);
      const target=found || row;
      if(options.focusMap!==false && Number.isFinite(target.lat)&&Number.isFinite(target.lon) && window.map) window.map.setView([target.lat,target.lon],14);
      if(options.openDetail!==false && typeof window.openDetailById==="function") setTimeout(()=>window.openDetailById(id),150);
      return true;
    }catch(e){
      console.warn("Rychlé zobrazení uloženého bodu selhalo, načítám čistě z Firebase",e);
      return false;
    }
  }

  async function refreshAfterSave(docId, savedRow=null){
    const id=String(docId || "");
    if(savedRow && upsertSavedFirebaseRowAfterSave(savedRow,id)) return true;
    const loadedRows=await loadFirebaseSites();
    const found=findRowByAnyId(id,loadedRows);
    if(found){
      if(Number.isFinite(found.lat)&&Number.isFinite(found.lon)) map.setView([found.lat,found.lon],14);
      setTimeout(()=>window.openDetailById(id),150);
      return true;
    }

    const report=window.__lastFirebaseLoadReport || {};
    const dup=(report.duplicateRows || []).find(d=>String(d.docId || "")===id);
    const hidden=(report.hiddenRows || []).find(d=>String(d.docId || "")===id);
    if(dup){
      sideStatus(`<b>Bod je ve Firebase, ale čisté načtení ho skrylo jako duplicitu.</b><br>Nový: ${esc(dup.title || id)}<br>Shoda: ${esc(dup.matchedKey || "")}<br>Ponechaný bod: ${esc(dup.keptTitle || dup.keptDocId || "")}`,true);
    }else if(hidden){
      sideStatus(`<b>Bod je ve Firebase, ale je vedený jako skrytý/smazaný.</b><br>${esc(hidden.title || id)}`,true);
    }else{
      sideStatus(`<b>Bod se zapsal, ale po čistém načtení z Firebase není v seznamu.</b><br>Dokument: ${esc(id)}. Firebase dokumentů: ${esc(report.docs ?? "?")}, po deduplikaci: ${esc(report.afterDedupe ?? "?")}, zobrazeno: ${esc(report.shown ?? "?")}.`,true);
    }
    return false;
  }
  async function migrateCsvToFirebase(){
    sideStatus("Veřejná CSV migrace je v produkční verzi vypnutá. Data se spravují po přihlášení přes Firebase.",true);
  }
  async function savePoint(e){
    if(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
    const database=db(), u=await waitCompatUser();
    if(!database){status("Firebase není dostupný nebo není inicializovaný.",true);return false;}
    if(!u){status("Nejdřív se přihlaš přes Google.",true);return false;}
    let raw=getRaw(); const lat=num(raw["GPS_lat"]), lon=num(raw["GPS_lon"]);
    if(!raw["Název"] && !raw["Adresa / umístění"]){status("Vyplň Název nebo Adresa / umístění.",true);return false;}
    if(!Number.isFinite(lat)||!Number.isFinite(lon)){status("Klikni Dopočítat GPS, aby se bod mohl zobrazit na mapě.",true);return false;}
    raw["GPS_lat"]=String(lat); raw["GPS_lon"]=String(lon);
    const inferRegion=window.inferRegionFromAddressText;
    const geocode=window.geocodeAddressGeneric;
    if(!raw["Kraj"] && typeof inferRegion==="function"){
      const address=raw["Adresa / umístění"] || raw["Název"] || raw["Adresa_GPS"] || "";
      let region=inferRegion(address);
      if(!region && address && typeof geocode==="function"){
        try{
          const found=await geocode(address);
          region=inferRegion(found?.display || address, found?.address || {});
        }catch(_e){}
      }
      if(region){
        raw["Kraj"]=region;
        setField("Kraj",region);
      }
    }
    try{
      status("Kontroluji duplicitu...");
      const duplicate=await findDuplicateDoc(database,raw);
      if(duplicate){
        status("Bod už existuje. Otevírám existující záznam...");
        await openDuplicateDoc(database,duplicate,raw,u);
        sideStatus("<b>Bod už ve Firebase existoval.</b> Otevřel jsem existující záznam a doplnil chybějící údaje/GPS z formuláře.");
        return false;
      }
      status("Ukládám bod do Firebase...");
      const ref=database.collection(FB_COLLECTION).doc();
      raw=completeFirebaseRaw(raw, ref.id);
      const keys=dedupKeys(raw);
      const savedData={
        raw:raw,
        dedupKeys:keys,
        createdAt:serverTimestampValue(),
        updatedAt:serverTimestampValue(),
        createdBy:u.email||"",
        updatedBy:u.email||"",
        manualEntry:true,
        migratedFromCsv:false,
        name:raw["Název"]||raw["Adresa / umístění"]||raw["Adresa_GPS"]||"",
        lat:lat,
        lon:lon
      };
      await ref.set(savedData,{merge:true});
      const localData={...savedData,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
      const row=rowFromDoc(ref.id,localData);
      await unhideOpenedRow(database,row);
      status("Bod uložen. Zobrazuji v mapě...");
      if(window.showSaveConfirmation) window.showSaveConfirmation("Bod uložen.");
      if(previewMarker){try{map.removeLayer(previewMarker);}catch(_e){} previewMarker=null;}
      closePanel();
      window.__lastSavedFirebaseSiteDocId=ref.id;
      const visibleAfterReload=await refreshAfterSave(ref.id,row);
      clearForm(true);
      if(visibleAfterReload) sideStatus("<b>Bod uložen.</b> Nové místo je načtené z Firebase stejně jako po refreshi.");
      return false;
    }catch(e){status("Chyba uložení: "+e.message,true);return false;}
  }
  function clearForm(silent=false){
    document.querySelectorAll("#fbUnifiedPanel [data-fb-key]").forEach(el=>el.value="");
    const last=document.getElementById("fbUnifiedLastCheck"); if(last) last.value="";
    const next=document.getElementById("fbUnifiedNextCheck"); if(next) next.value="";
    const period=document.querySelector('#fbUnifiedPanel [data-fb-key="Perioda kontrol"]'); if(period) period.value="12";
    document.querySelectorAll('#fbUnifiedPanel [data-fb-key="Hlídáme sami termín"], #fbUnifiedPanel [data-fb-key="Smlouva ano/ne"]').forEach(el=>el.value="ne");
    if(!silent) status("Formulář vymazán.");
  }
  function bind(){
    const add=document.getElementById("addSiteBtn");
    if(add){
      add.onclick=openPanel;
      if(!add.__firebaseUnifiedClickBound){
        add.addEventListener("click",openPanel,true);
        add.__firebaseUnifiedClickBound=true;
      }
    }
    const mig=document.getElementById("migrateCsvFirebaseBtn"); if(mig) mig.onclick=migrateCsvToFirebase;
    const reload=document.getElementById("reloadFirebaseSitesBtn"); if(reload) reload.onclick=()=>loadFirebaseSites();
    try{ if(typeof loadExtraSites==="function") loadExtraSites=async function(){}; }catch(e){}
  }
  if(!document.__firebaseUnifiedAddCaptureBound){
    document.addEventListener("click",e=>{
      const add=e.target && e.target.closest && e.target.closest("#addSiteBtn");
      if(add) openPanel(e);
    },true);
    document.__firebaseUnifiedAddCaptureBound=true;
  }
  window.runSzzDomReadyInit(bind,{onLoad:true});
  try{
    const compat=ensureCompatFirebase();
    if(compat && compat.auth){
      compat.auth().onAuthStateChanged(user=>{ if(user) loadFirebaseSites(null,{auto:true}); });
    }
  }catch(e){}
  window.loadFirebaseSitesUnified=loadFirebaseSites;
  window.migrateCsvToFirebaseUnified=migrateCsvToFirebase;
  window.saveUnifiedSiteRaw=saveUnifiedSiteRaw;
  window.refreshFirebaseSitesAfterSave=refreshAfterSave;
})();
;
/* AUTO MIGRACE DO FIREBASE PO PRIHLASENI - v produkci vypnuto */
(function(){
  return;
  const COLLECTION = "sitesUnified";
  let autoStarted = false;

  function showAutoStatus(msg, bad=false){
    let el = document.getElementById("autoFirebaseMigrationStatus");
    if(!bad){
      if(el) el.remove();
      return;
    }
    if(!el){
      const gps = document.getElementById("gpsBox") || document.getElementById("progress");
      el = document.createElement("div");
      el.id = "autoFirebaseMigrationStatus";
      el.className = "notice err";
      el.style.marginTop = "10px";
      if(gps && gps.parentNode) gps.parentNode.insertBefore(el, gps.nextSibling);
      else document.body.prepend(el);
    }
    el.className = "notice err";
    el.textContent = msg;
  }

  function db(){
    try{
      if(window.firebase && (!firebase.apps || !firebase.apps.length) && window.__firebaseConfig){
        firebase.initializeApp(window.__firebaseConfig);
      }
      if(window.firebase && firebase.apps && firebase.apps.length) return firebase.firestore();
    }catch(e){}
    return null;
  }

  function user(){
    try{
      if(window.firebase && (!firebase.apps || !firebase.apps.length) && window.__firebaseConfig){
        firebase.initializeApp(window.__firebaseConfig);
      }
      return firebase.auth().currentUser;
    }catch(e){return null;}
  }

  function docIdFromRawAuto(raw,i){
    const base = String(raw["Klíč_adresy"] || raw["ID_mista"] || raw["Název"] || raw["Adresa_GPS"] || raw["Adresa / umístění"] || ("row_"+i));
    let h=0;
    for(let x=0;x<base.length;x++) h=((h<<5)-h+base.charCodeAt(x))|0;
    return "site_" + Math.abs(h).toString(36) + "_" + String(i).padStart(5,"0");
  }

  function parseNumAuto(v){
    const n = parseFloat(String(v ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  async function autoMigrateIfNeeded(){
    if(autoStarted) return;
    const database = db();
    const u = user();
    if(!database || !u) return;

    autoStarted = true;

    try{
      showAutoStatus("Kontroluji Firebase databázi...");

      const existing = await database.collection(COLLECTION).get();
      if(!existing.empty){
        showAutoStatus("Firebase už obsahuje body. Načítám mapu z Firebase...");
        if(typeof window.loadFirebaseSitesUnified === "function"){
          await window.loadFirebaseSitesUnified();
        }
        return;
      }

      let sourceRows = typeof window.getCurrentCsvRows === "function" ? window.getCurrentCsvRows() : [];
      if((!Array.isArray(sourceRows) || !sourceRows.length) && typeof window.loadCsvRowsForMigration==="function"){
        sourceRows=await window.loadCsvRowsForMigration();
      }
      if(!Array.isArray(sourceRows) || !sourceRows.length){
        showAutoStatus("Firebase je prázdná a veřejný import není v produkční verzi dostupný.", true);
        autoStarted = false;
        return;
      }

      const seenKeys = new Set();
      existing.forEach(doc=>{
        if(typeof window.siteDedupKeysFromRaw === "function"){
          window.siteDedupKeysFromRaw((doc.data()||{}).raw || {}).forEach(k=>seenKeys.add(k));
        }
      });

      showAutoStatus("Firebase je prázdná. Jednorázová migrace je v produkční verzi vypnutá.");

      const total = sourceRows.length;
      let batch = database.batch();
      let batchCount = 0;
      let count = 0;
      let skipped = 0;

      for(let i=0;i<sourceRows.length;i++){
        const raw = Object.assign({}, sourceRows[i].raw || {});
        const keys = typeof window.siteDedupKeysFromRaw === "function" ? window.siteDedupKeysFromRaw(raw) : [];
        if(keys.length && keys.some(k=>seenKeys.has(k))){
          skipped++;
          continue;
        }
        keys.forEach(k=>seenKeys.add(k));
        const docId = docIdFromRawAuto(raw, i);

        if(!raw["Klíč_adresy"]) raw["Klíč_adresy"] = "firebase_" + docId;
        raw["Zdroj_dat"] = raw["Zdroj_dat"] || "Firebase jednorázová migrace";

        const ref = database.collection(COLLECTION).doc(docId);
        batch.set(ref, {
          raw,
          dedupKeys: keys,
          migratedFromCsv: true,
          csvIndex: i,
          name: raw["Název"] || raw["Adresa / umístění"] || raw["Adresa_GPS"] || "",
          lat: parseNumAuto(raw["GPS_lat"]),
          lon: parseNumAuto(raw["GPS_lon"]),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedBy: u.email || ""
        }, {merge:true});

        count++;
        batchCount++;

        if(batchCount >= 350){
          await batch.commit();
          showAutoStatus("Migrováno " + count + " / " + total + " bodů...");
          batch = database.batch();
          batchCount = 0;
        }
      }

      if(count===0){
        showAutoStatus("Firebase už obsahuje všechny unikátní body. Načítám mapu z Firebase...");
        if(typeof window.loadFirebaseSitesUnified === "function"){
          await window.loadFirebaseSitesUnified();
        }
        return;
      }

      if(batchCount > 0) await batch.commit();

      showAutoStatus("<b>Automatická migrace hotová.</b> Uloženo " + count + " bodů do Firebase, přeskočeno duplicit: " + skipped + ". Načítám mapu z Firebase...");

      if(typeof window.loadFirebaseSitesUnified === "function"){
        await window.loadFirebaseSitesUnified();
      }

    }catch(e){
      showAutoStatus("Automatická migrace se nepovedla: " + e.message, true);
      autoStarted = false;
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    setTimeout(autoMigrateIfNeeded, 3000);
  });
})();
;
/* FINAL FIX: další zdroj z detailu používá samostatný čistý formulář */
(function(){
  const escSource = v => String(v ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
  const attrSource = v => escSource(v);
  const cleanSource = v => String(v ?? "").trim();
  const numSource = v => {
    const n = parseFloat(String(v ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };
  const dateInputSource = v => {
    try{
      if(typeof dateInputValueFromAny === "function") return dateInputValueFromAny(v) || "";
    }catch(e){}
    return cleanSource(v);
  };

  function firstRawValue(raw, keys){
    for(const key of keys){
      const value = cleanSource(raw && raw[key]);
      if(value) return value;
    }
    return "";
  }

  function rowKeySource(row){
    try{
      if(typeof detailKey === "function") return detailKey(row);
    }catch(e){}
    const raw = (row && row.raw) || {};
    return cleanSource((row && (row.firebaseDocId || row.id)) || raw["Firebase_doc_id"] || raw["Klíč_adresy"]);
  }

  function rowBySourceKey(key){
    const wanted = cleanSource(key);
    if(!wanted) return null;
    return (window.rows || []).find(row=>{
      const raw = (row && row.raw) || {};
      return rowKeySource(row) === wanted
        || cleanSource(row && row.id) === wanted
        || cleanSource(row && row.firebaseDocId) === wanted
        || cleanSource(raw["Firebase_doc_id"]) === wanted
        || cleanSource(raw["Klíč_adresy"]) === wanted;
    }) || null;
  }

  function saveNormalDrawerTemplateForSource(){
    const drawer = document.getElementById("drawer");
    if(!drawer || drawer.querySelector("#newSiteOnlyCard")) return;
    if(drawer.innerHTML.includes('id="detailTable"')){
      window.__normalDrawerTemplate = drawer.innerHTML;
    }
  }

  function restoreNormalDrawerTemplateForSource(){
    const drawer = document.getElementById("drawer");
    if(!drawer) return false;
    if(window.__normalDrawerTemplate && drawer.querySelector("#newSiteOnlyCard")){
      drawer.innerHTML = window.__normalDrawerTemplate;
      drawer.classList.remove("adding-new-site");
      return true;
    }
    return false;
  }

  function returnToSourceDetail(site){
    const key = rowKeySource(site);
    restoreNormalDrawerTemplateForSource();
    if(key && typeof window.openDetailById === "function"){
      setTimeout(()=>window.openDetailById(key), 0);
    }else{
      const drawer = document.getElementById("drawer");
      if(drawer) drawer.classList.remove("open");
    }
  }

  function collectSourceFormRaw(){
    const raw = {};
    document.querySelectorAll("#newSiteOnlyCard [data-new-key]").forEach(el=>{
      const key = el.dataset.newKey;
      const value = cleanSource(el.value);
      if(key && value) raw[key] = value;
    });
    if(typeof window.applyWatchSelfAliases === "function"){
      window.applyWatchSelfAliases(raw, raw["Hlídáme sami termín"] || raw["Hlídáme kontroly sami"] || "ne");
    }
    return raw;
  }

  function openAddSourceDetailForm(site){
    if(!site) return;
    saveNormalDrawerTemplateForSource();

    const drawer = document.getElementById("drawer");
    if(!drawer) return;

    const raw = site.raw || {};
    const place = (typeof window.sitePlaceLabel === "function" ? window.sitePlaceLabel(site) : "")
      || site.gpsAddress || site.adresa || raw["Adresa / umístění"] || raw["Adresa_GPS"] || raw["Název"] || "";
    const region = (typeof window.rowRegion === "function" ? window.rowRegion(site) : "")
      || site.kraj || raw["Kraj"] || "";
    const name = raw["Název"] || site.adresa || place || "Nový zdroj";
    const contact = site.kontakt || firstRawValue(raw, ["Kontakt","Kontakt_mapy","Hlavní kontakt"]);
    const lat = Number.isFinite(Number(site.lat)) ? String(site.lat) : firstRawValue(raw, ["GPS_lat"]);
    const lon = Number.isFinite(Number(site.lon)) ? String(site.lon) : firstRawValue(raw, ["GPS_lon"]);
    const periodText = firstRawValue(raw, ["Perioda kontrol","Perioda"]);
    const period = /\b6\b/.test(periodText) ? "6" : "12";
    const lastCheck = dateInputSource(firstRawValue(raw, ["Poslední_kontrola","Poslední proběhlá kontrola","Poslední kontrola"]));
    const nextCheck = dateInputSource(firstRawValue(raw, ["Příští_kontrola","Příští plánovaná kontrola","Příští kontrola"]));

    drawer.classList.add("open");
    drawer.classList.remove("adding-new-site");
    drawer.innerHTML = `
      <div class="drawer-head">
        <div>
          <h2>Přidat další zdroj</h2>
          <p class="small">${escSource(place || "Stejné místo")}</p>
        </div>
        <button class="secondary x" type="button" id="closeOnlyNew">Zavřít</button>
      </div>

      <div class="card" id="newSiteOnlyCard" data-add-source-form="1">
        <p class="small">Adresa a GPS jsou převzaté z aktuálního místa. Doplň hlavně popis zdroje nebo výrobní číslo.</p>
        <div class="new-only-grid">
          <div class="full"><label>Název místa</label><input data-new-key="Název" value="${attrSource(name)}"></div>
          <div class="full"><label>Adresa / umístění</label><input data-new-key="Adresa / umístění" id="onlyNewAddress" value="${attrSource(place)}" readonly></div>
          <div><label>GPS lat</label><input data-new-key="GPS_lat" id="onlyNewGpsLat" value="${attrSource(lat)}" readonly></div>
          <div><label>GPS lon</label><input data-new-key="GPS_lon" id="onlyNewGpsLon" value="${attrSource(lon)}" readonly></div>
          <div class="full"><label>Adresa_GPS</label><input data-new-key="Adresa_GPS" value="${attrSource(place)}" readonly></div>
          <div><label>Kraj</label><input data-new-key="Kraj" value="${attrSource(region)}" readonly></div>
          <div><label>Kontakt</label><input data-new-key="Kontakt" value="${attrSource(contact)}"></div>

          <div class="full"><label>Popis zdroje</label><input data-new-key="Popis_zdroje" id="addSourceType" placeholder="např. PS 20 000/3f - 45 min."></div>
          <div class="full"><label>Výrobní číslo</label><input data-new-key="Zdroj" id="addSourceSerial" placeholder="výrobní číslo zdroje"></div>
          <div class="full"><label>Umístění zdroje</label><input data-new-key="Umístění zdroje" placeholder="např. suterén, rozvodna, serverovna"></div>
          <div class="full"><label>Historie oprav</label><textarea data-new-key="Historie oprav"></textarea></div>
          <div class="full"><label>Postup testování</label><textarea data-new-key="Postup testování"></textarea></div>
          <div class="full"><label>Jistič UPS</label><input data-new-key="Jistič UPS"></div>

          <div><label>Poslední kontrola</label><input type="date" data-new-key="Poslední_kontrola" value="${attrSource(lastCheck)}"></div>
          <div><label>Příští kontrola</label><input type="date" data-new-key="Příští_kontrola" value="${attrSource(nextCheck)}"></div>
          <div><label>Perioda kontrol</label><select data-new-key="Perioda kontrol">
            <option value="6" ${period === "6" ? "selected" : ""}>6 měsíců</option>
            <option value="12" ${period !== "6" ? "selected" : ""}>12 měsíců</option>
          </select></div>
          <div><label>Hlídáme sami termín</label><select data-new-key="Hlídáme sami termín">
            <option value="ne" selected>ne</option>
            <option value="ano">ano</option>
          </select></div>

          <div><label>Rok výroby</label><input data-new-key="Rok výroby"></div>
          <div><label>Serviska</label><select data-new-key="Serviska"><option value=""></option><option value="ano">ano</option><option value="ne">ne</option></select></div>
          <div><label>Smlouva</label><select data-new-key="Smlouva ano/ne"><option value=""></option><option value="ano">ano</option><option value="ne">ne</option></select></div>
          <div><label>Cena FZ</label><input data-new-key="Cena FZ"></div>
          <div class="full"><label>Poznámky</label><textarea data-new-key="Poznámky"></textarea></div>
          <div class="full only-red"><label>Důležité poznámky</label><textarea data-new-key="Důležitá poznámka"></textarea></div>
        </div>

        <div class="row" style="margin-top:12px">
          <button class="primary" type="button" id="saveAddSourceOnly">Uložit nový zdroj</button>
          <button class="secondary" type="button" id="cancelOnlyNew">Zrušit</button>
        </div>
        <p class="small" id="onlyNewStatus"></p>
      </div>`;

    document.getElementById("closeOnlyNew").onclick = ()=>returnToSourceDetail(site);
    document.getElementById("cancelOnlyNew").onclick = ()=>returnToSourceDetail(site);
    document.getElementById("saveAddSourceOnly").onclick = ()=>saveAddSourceFromDetail(site);
    setTimeout(()=>{
      const first = document.getElementById("addSourceType") || document.getElementById("addSourceSerial");
      if(first) first.focus();
    }, 100);
  }

  function upsertAddedSourceRowLocally(raw, savedId){
    const cleanId = safe(savedId);
    if(!cleanId || !raw) return null;
    const prepared = {...raw, "Firebase_doc_id": cleanId};
    let normalized = null;
    try{
      normalized = typeof normalize === "function" ? normalize([prepared])[0] : null;
    }catch(e){
      console.warn("Lokální normalizace nového zdroje selhala", e);
    }
    if(!normalized){
      normalized = {
        id: cleanId,
        firebaseDocId: cleanId,
        raw: prepared,
        adresa: prepared["Adresa / umístění"] || prepared["Adresa_GPS"] || prepared["Název"] || "Nový zdroj",
        zdroj: prepared["Popis_zdroje"] || prepared["Zdroj"] || "",
        lat: Number(prepared["GPS_lat"]),
        lon: Number(prepared["GPS_lon"]),
        kraj: prepared["Kraj"] || ""
      };
    }
    normalized.id = cleanId;
    normalized.firebaseDocId = cleanId;
    normalized.raw = {...(normalized.raw || {}), ...prepared, "Firebase_doc_id": cleanId};
    normalized.firebaseData = {...(normalized.firebaseData || {}), raw: normalized.raw};
    const localKey = (typeof detailKey === "function" ? detailKey(normalized) : cleanId) || cleanId;
    rows = (rows || []).filter(row=>{
      const rowDoc = typeof selectedSiteDocId === "function" ? selectedSiteDocId(row) : safe(row && row.firebaseDocId);
      const rowKey = typeof detailKey === "function" ? detailKey(row) : safe(row && row.id);
      return rowDoc !== cleanId && rowKey !== localKey;
    }).concat([normalized]);
    selectedSite = normalized;
    if(typeof filters === "function") filters();
    if(typeof render === "function") render();
    return normalized;
  }

  async function saveAddSourceFromDetail(baseSite){
    const st = document.getElementById("onlyNewStatus");
    const baseRaw = (baseSite && baseSite.raw) || {};
    const place = (typeof window.sitePlaceLabel === "function" ? window.sitePlaceLabel(baseSite) : "")
      || baseSite.gpsAddress || baseSite.adresa || baseRaw["Adresa / umístění"] || baseRaw["Adresa_GPS"] || "";
    const region = (typeof window.rowRegion === "function" ? window.rowRegion(baseSite) : "")
      || baseSite.kraj || baseRaw["Kraj"] || "";
    const lat = Number.isFinite(Number(baseSite.lat)) ? String(baseSite.lat) : firstRawValue(baseRaw, ["GPS_lat"]);
    const lon = Number.isFinite(Number(baseSite.lon)) ? String(baseSite.lon) : firstRawValue(baseRaw, ["GPS_lon"]);

    const raw = collectSourceFormRaw();
    raw["Název"] = raw["Název"] || baseRaw["Název"] || baseSite.adresa || place || "Nový zdroj";
    raw["Adresa / umístění"] = place;
    raw["Adresa_GPS"] = place;
    raw["GPS_lat"] = lat;
    raw["GPS_lon"] = lon;
    raw["Kraj"] = region || raw["Kraj"] || "";
    raw["Zdroj_dat"] = "Firebase další zdroj";

    const sourceType = cleanSource(raw["Popis_zdroje"]);
    const serial = cleanSource(raw["Zdroj"] || raw["Výrobní číslo"]);
    if(!sourceType && !serial){
      if(st) st.textContent = "Doplň popis zdroje nebo výrobní číslo, aby se nový zdroj odlišil od původního.";
      const target = document.getElementById("addSourceType") || document.getElementById("addSourceSerial");
      if(target) target.focus();
      return;
    }
    if(!Number.isFinite(numSource(lat)) || !Number.isFinite(numSource(lon))){
      if(st) st.textContent = "Původní místo nemá GPS. Nejdřív oprav GPS u místa.";
      return;
    }
    if(typeof window.saveUnifiedSiteRaw !== "function"){
      if(st) st.textContent = "Firebase ukládání nových zdrojů ještě není připravené.";
      return;
    }

    try{
      if(st) st.textContent = "Ukládám nový zdroj...";
      const docId = "site_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7);
      const result = await window.saveUnifiedSiteRaw(raw, {docId});
      const savedId = result && result.id ? result.id : docId;
      const savedOffline = !!(result && result.offline);

      if(result && result.duplicate){
        if(st) st.textContent = "Takový zdroj už existuje. Otevírám existující záznam.";
        restoreNormalDrawerTemplateForSource();
        if(navigator.onLine !== false && typeof window.refreshFirebaseSitesAfterSave === "function") await window.refreshFirebaseSitesAfterSave(savedId, result.row);
        else if(navigator.onLine !== false && typeof window.loadFirebaseSitesUnified === "function") await window.loadFirebaseSitesUnified(savedId);
        if(typeof window.openDetailById === "function") setTimeout(()=>window.openDetailById(savedId), 250);
        return;
      }

      const localRow = upsertAddedSourceRowLocally(raw, savedId);

      if(window.showSaveConfirmation) window.showSaveConfirmation("Nový zdroj uložen.");
      if(st) st.textContent = "Nový zdroj uložen.";

      let visible = true;
      if(!savedOffline && typeof window.refreshFirebaseSitesAfterSave === "function"){
        visible = await window.refreshFirebaseSitesAfterSave(savedId, result && result.row ? result.row : localRow);
      }else if(!savedOffline && typeof window.loadFirebaseSitesUnified === "function"){
        await window.loadFirebaseSitesUnified(savedId);
      }else if(typeof render === "function"){
        render();
      }
      restoreNormalDrawerTemplateForSource();
      if((visible || localRow) && typeof window.openDetailById === "function"){
        setTimeout(()=>window.openDetailById(savedId), 250);
      }
    }catch(e){
      if(st) st.textContent = "Chyba uložení nového zdroje: " + e.message;
    }
  }

  function openSourceByKey(key){
    const site = rowBySourceKey(key) || window.selectedSite || selectedSite;
    if(site) openAddSourceDetailForm(site);
  }

  window.openAddSourceForSite = openAddSourceDetailForm;
  window.openAddSourceForSiteByKey = openSourceByKey;

  document.addEventListener("click", e=>{
    const button = e.target.closest && e.target.closest("[data-add-source]");
    if(!button) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openSourceByKey(button.getAttribute("data-add-source"));
  }, true);
})();
;
const SZZ_INSTALL_OFFLINE_READY_KEY="astipSzzOfflineReady:v1";
const SZZ_INSTALL_SITE_CACHE_KEY="astipFirebaseSitesMapCacheV2";
const SZZ_INSTALL_QUEUE_DB_NAME="astipMapOfflineQueues";
const SZZ_INSTALL_QUEUE_DB_VERSION=2;
const SZZ_INSTALL_SITE_QUEUE_STORE="siteQueue";
const SZZ_INSTALL_PROTOCOL_QUEUE_STORE="protocolQueue";
const SZZ_INSTALL_PROTOCOL_DRAFT_STORE="protocolDrafts";
const SZZ_INSTALL_SHELL_URLS=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw.js",
  "./szz-logo-display.png",
  "./szz-app-icon-192.png",
  "./szz-app-icon-512.png",
  "./podpis-tipek.png",
  "./podpis-tipek.jpg",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];

function szzInstallCurrentShellUrls(baseUrls=SZZ_INSTALL_SHELL_URLS){
  const urls=[...(baseUrls || [])];
  try{
    document.querySelectorAll('script[src],link[rel="stylesheet"][href],link[rel="manifest"][href],link[rel~="icon"][href],link[rel="apple-touch-icon"][href]').forEach(el=>{
      const url=el.src || el.href;
      if(url) urls.push(url);
    });
  }catch(e){}
  return urls.filter((url,idx,arr)=>url && arr.indexOf(url)===idx);
}

function szzInstallSafe(value){
  return String(value ?? "").trim();
}

function szzInstallUniqueById(items=[],idKey="_id"){
  const byId=new Map();
  const withoutId=[];
  (items || []).forEach(item=>{
    if(!item) return;
    const id=szzInstallSafe(item[idKey]);
    if(!id){
      withoutId.push(item);
      return;
    }
    byId.set(id,item);
  });
  return [...withoutId,...byId.values()];
}
window.uniqueByOfflineId=window.uniqueByOfflineId || szzInstallUniqueById;

function openSzzInstallQueueDb(){
  return new Promise((resolve,reject)=>{
    if(!("indexedDB" in window)){
      reject(new Error("IndexedDB není v prohlížeči dostupné."));
      return;
    }
    const req=indexedDB.open(SZZ_INSTALL_QUEUE_DB_NAME,SZZ_INSTALL_QUEUE_DB_VERSION);
    req.onupgradeneeded=()=>{
      const database=req.result;
      if(!database.objectStoreNames.contains(SZZ_INSTALL_SITE_QUEUE_STORE)){
        database.createObjectStore(SZZ_INSTALL_SITE_QUEUE_STORE,{keyPath:"docId"});
      }
      if(!database.objectStoreNames.contains(SZZ_INSTALL_PROTOCOL_QUEUE_STORE)){
        const protocolStore=database.createObjectStore(SZZ_INSTALL_PROTOCOL_QUEUE_STORE,{keyPath:"_id"});
        protocolStore.createIndex("siteCacheKey","siteCacheKey",{unique:false});
      }
      if(!database.objectStoreNames.contains(SZZ_INSTALL_PROTOCOL_DRAFT_STORE)){
        database.createObjectStore(SZZ_INSTALL_PROTOCOL_DRAFT_STORE,{keyPath:"siteCacheKey"});
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error || new Error("Offline databázi se nepodařilo otevřít."));
  });
}

async function withSzzInstallQueueStore(storeName,mode,callback){
  const database=await openSzzInstallQueueDb();
  return new Promise((resolve,reject)=>{
    const tx=database.transaction(storeName,mode);
    const store=tx.objectStore(storeName);
    let result;
    tx.oncomplete=()=>{database.close();resolve(result);};
    tx.onerror=()=>{database.close();reject(tx.error || new Error("Offline fronta selhala."));};
    try{
      callback(store,value=>{result=value;});
    }catch(e){
      database.close();
      reject(e);
    }
  });
}

window.saveOfflineSiteQueueItem=window.saveOfflineSiteQueueItem || async function(item){
  if(!item || !szzInstallSafe(item.docId)) return null;
  await withSzzInstallQueueStore(SZZ_INSTALL_SITE_QUEUE_STORE,"readwrite",(store)=>{store.put({...item});});
  return item;
};

window.readOfflineSiteQueueItems=window.readOfflineSiteQueueItems || async function(){
  try{
    const items=await withSzzInstallQueueStore(SZZ_INSTALL_SITE_QUEUE_STORE,"readonly",(store,setResult)=>{
      const req=store.getAll();
      req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
      req.onerror=()=>setResult([]);
    });
    return (items || []).filter(item=>item && item.docId && item.raw);
  }catch(e){
    return [];
  }
};

window.removeOfflineSiteQueueItem=window.removeOfflineSiteQueueItem || async function(docId){
  const id=szzInstallSafe(docId);
  if(!id) return;
  try{
    await withSzzInstallQueueStore(SZZ_INSTALL_SITE_QUEUE_STORE,"readwrite",(store)=>{store.delete(id);});
  }catch(e){}
};

function szzInstallSiteCacheKey(site={},kind="protocolHistory"){
  const raw=site && site.raw || {};
  const key=szzInstallSafe(site.firebaseDocId || raw["Firebase_doc_id"] || site.id || site.siteId || site.siteKey || "unknown");
  return `astipMap:${kind}:${key}`;
}

window.saveOfflineProtocolQueueItem=window.saveOfflineProtocolQueueItem || async function(item,site={}){
  if(!item || !szzInstallSafe(item._id)) return null;
  const payload={...item,siteCacheKey:szzInstallSiteCacheKey(site)};
  await withSzzInstallQueueStore(SZZ_INSTALL_PROTOCOL_QUEUE_STORE,"readwrite",(store)=>{store.put(payload);});
  return payload;
};

window.readAllOfflineProtocolQueueItems=window.readAllOfflineProtocolQueueItems || async function(){
  try{
    const items=await withSzzInstallQueueStore(SZZ_INSTALL_PROTOCOL_QUEUE_STORE,"readonly",(store,setResult)=>{
      const req=store.getAll();
      req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
      req.onerror=()=>setResult([]);
    });
    return (items || []).filter(item=>item && item._offline && item._syncStatus!=="online");
  }catch(e){
    return [];
  }
};

window.readOfflineProtocolQueueItems=window.readOfflineProtocolQueueItems || async function(site={}){
  const cacheKey=szzInstallSiteCacheKey(site);
  try{
    const items=await withSzzInstallQueueStore(SZZ_INSTALL_PROTOCOL_QUEUE_STORE,"readonly",(store,setResult)=>{
      const req=store.index("siteCacheKey").getAll(cacheKey);
      req.onsuccess=()=>setResult(Array.isArray(req.result) ? req.result : []);
      req.onerror=()=>setResult([]);
    });
    return (items || []).filter(item=>item && item._offline && item._syncStatus!=="online");
  }catch(e){
    return [];
  }
};

window.removeOfflineProtocolQueueItem=window.removeOfflineProtocolQueueItem || async function(id){
  const cleanId=szzInstallSafe(id);
  if(!cleanId) return;
  try{
    await withSzzInstallQueueStore(SZZ_INSTALL_PROTOCOL_QUEUE_STORE,"readwrite",(store)=>{store.delete(cleanId);});
  }catch(e){}
};

function szzInstallLocalArrayEntries(prefix){
  const entries=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key || !key.startsWith(prefix)) continue;
      const arr=JSON.parse(localStorage.getItem(key) || "[]");
      if(Array.isArray(arr)) entries.push(...arr);
    }
  }catch(e){}
  return entries;
}

async function szzInstallOfflineCounts(){
  let localSites=[];
  const indexedSites=await window.readOfflineSiteQueueItems();
  try{
    if(!indexedSites.length){
      const parsed=JSON.parse(localStorage.getItem("astipMap:offlineSites:v1") || "[]");
      localSites=Array.isArray(parsed) ? parsed.filter(item=>item && item.docId && item.raw) : [];
    }
  }catch(e){}
  const indexedProtocols=await window.readAllOfflineProtocolQueueItems();
  let localProtocols=[];
  try{
    if(!indexedProtocols.length){
      localProtocols=szzInstallLocalArrayEntries("astipMap:protocolHistory:")
        .filter(item=>item && item._offline && item._syncStatus!=="online");
    }
  }catch(e){}
  let drafts=0;
  try{
    drafts=await withSzzInstallQueueStore(SZZ_INSTALL_PROTOCOL_DRAFT_STORE,"readonly",(store,setResult)=>{
      const req=store.count();
      req.onsuccess=()=>setResult(Number(req.result) || 0);
      req.onerror=()=>setResult(0);
    });
  }catch(e){}
  if(!drafts){
    try{
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i);
        if(key && key.startsWith("astipMap:protocolDraft:")){
          const parsed=JSON.parse(localStorage.getItem(key) || "null");
          if(parsed && parsed.payload) drafts++;
        }
      }
    }catch(e){}
  }
  return {
    sites:szzInstallUniqueById([...localSites,...indexedSites],"docId").length,
    protocols:szzInstallUniqueById([...localProtocols,...indexedProtocols]).length,
    photos:0,
    drafts
  };
}

window.updateSzzOfflineAppStatus=window.updateSzzOfflineAppStatus || async function(){
  const counts=await szzInstallOfflineCounts();
  const setCount=(id,value)=>{
    const el=document.getElementById(id);
    if(el) el.textContent=String(value || 0);
  };
  setCount("pendingSitesCount",counts.sites);
  setCount("pendingProtocolsCount",counts.protocols);
  setCount("pendingPhotosCount",counts.photos);
  setCount("pendingDraftsCount",counts.drafts);
  const pending=counts.sites+counts.protocols+counts.photos;
  const label=document.getElementById("appConnectionLabel");
  const text=document.getElementById("appSyncText");
  const meta=document.getElementById("appSyncMeta");
  const syncBtn=document.getElementById("syncNowBtn");
  if(label) label.textContent=navigator.onLine===false ? "Offline režim" : (pending ? "Čeká na synchronizaci" : "Synchronizováno");
  if(text) text.textContent=navigator.onLine===false
    ? "Práce se ukládá do telefonu. Po připojení se odešle do webu."
    : pending ? `V telefonu čeká ${pending} změn k odeslání.` : "Všechny uložené změny jsou spárované s webem.";
  if(meta) meta.textContent=meta.textContent || "Offline fronta připravena v telefonu.";
  if(syncBtn) syncBtn.disabled=navigator.onLine===false || !pending || typeof window.syncOfflineChanges!=="function";
  return counts;
};

window.scheduleSzzOfflineAppStatus=window.scheduleSzzOfflineAppStatus || function(delay=120){
  clearTimeout(window.__szzInstallStatusTimer);
  window.__szzInstallStatusTimer=setTimeout(()=>window.updateSzzOfflineAppStatus?.().catch(()=>{}),delay);
};

window.cacheAppShellForOffline=window.cacheAppShellForOffline || async function(){
  if(!("serviceWorker" in navigator)) return 0;
  try{
    if(window.registerSzzServiceWorker) await window.registerSzzServiceWorker();
    else await navigator.serviceWorker.register("./sw.js");
    await navigator.serviceWorker.ready;
    return szzInstallCurrentShellUrls().length;
  }catch(e){
    console.warn("Offline shell fallback se nepodařilo připravit přes service worker",e);
    return 0;
  }
};

window.requestSzzPersistentStorage=window.requestSzzPersistentStorage || async function(options={}){
  const result={supported:false,persisted:false,requested:false,granted:false};
  if(!navigator.storage) return result;
  result.supported=typeof navigator.storage.persisted==="function" || typeof navigator.storage.persist==="function";
  try{
    if(typeof navigator.storage.persisted==="function") result.persisted=await navigator.storage.persisted();
    if(!result.persisted && options.request && typeof navigator.storage.persist==="function"){
      result.requested=true;
      result.granted=await navigator.storage.persist();
      result.persisted=result.granted || (typeof navigator.storage.persisted==="function" ? await navigator.storage.persisted() : false);
    }
  }catch(e){
    result.error=e && (e.message || e.code) || String(e);
  }
  return result;
};

function szzInstallCachedRowsCount(){
  try{
    const parsed=JSON.parse(localStorage.getItem(SZZ_INSTALL_SITE_CACHE_KEY) || "null");
    const count=Number(parsed && parsed.count);
    if(Number.isFinite(count) && count>0) return count;
    const items=Array.isArray(parsed && parsed.items) ? parsed.items : [];
    return items.filter(item=>item && item.docId && item.raw).length;
  }catch(e){
    return 0;
  }
}

function szzInstallCacheCurrentRows(){
  const currentRows=Array.isArray(window.rows) ? window.rows : [];
  const firebaseRows=currentRows.filter(row=>row && (row.firebaseDocId || (row.raw && row.raw["Firebase_doc_id"])));
  if(firebaseRows.length && typeof window.saveFirebaseMapRowsCache==="function"){
    try{ window.saveFirebaseMapRowsCache(firebaseRows); }catch(e){}
  }
  return firebaseRows.length || szzInstallCachedRowsCount();
}

window.prepareSzzOfflineAppData=window.prepareSzzOfflineAppData || async function(){
  if(window.openAppToolsPanel) window.openAppToolsPanel();
  const button=document.getElementById("prepareOfflineAppBtn");
  const text=document.getElementById("appSyncText");
  if(button){
    button.disabled=true;
    button.textContent="Připravuji offline...";
  }
  if(text) text.textContent="Ukládám aplikaci a servisní data do telefonu.";
  try{
    const storage=await window.requestSzzPersistentStorage({request:true});
    if(window.registerSzzServiceWorker) await window.registerSzzServiceWorker();
    const shellCount=await window.cacheAppShellForOffline();
    if(navigator.onLine!==false && typeof window.loadFirebaseSitesUnified==="function"){
      try{ await window.loadFirebaseSitesUnified(null,{force:true,skipLocalCache:true}); }catch(e){}
    }
    const cachedRows=szzInstallCacheCurrentRows();
    const ready={
      preparedAt:new Date().toISOString(),
      persistentStorage:!!storage.persisted,
      persistentStorageSupported:!!storage.supported,
      shellCount,
      cachedRows
    };
    try{ localStorage.setItem(SZZ_INSTALL_OFFLINE_READY_KEY,JSON.stringify(ready)); }catch(e){}
    if(text) text.textContent=cachedRows ? `Offline připraveno: ${cachedRows} bodů v telefonu.` : "Aplikace je připravená pro offline otevření.";
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
    if(window.showSaveConfirmation) window.showSaveConfirmation("Offline data připravena.");
    return ready;
  }finally{
    if(button){
      button.disabled=false;
      button.textContent="Připravit offline data";
    }
  }
};

let deferredSzzInstallPrompt=null;

function isSzzAppInstalledView(){
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

function canShowSzzInstallButton(){
  return !isSzzAppInstalledView();
}

function updateSzzInstallButtons(){
  const show=canShowSzzInstallButton();
  document.querySelectorAll(".install-app-btn").forEach(button=>{
    button.style.display=show ? "" : "none";
  });
}

function setSzzInstallStatus(message="",state="info"){
  const panel=document.getElementById("appInstallStatus");
  if(panel){
    panel.style.display=message ? "block" : "none";
    panel.className=`notice offline-map-status ${state==="error" ? "err" : state==="ok" ? "ok" : ""}`.trim();
    panel.textContent=message;
  }
  const startup=document.getElementById("startupStatus");
  const startupVisible=!!(startup && document.getElementById("startupScreen")?.style.display!=="none");
  if(startupVisible && message) startup.textContent=message;
}

function androidInstallHelpText(){
  const ua=navigator.userAgent || "";
  if(/firefox/i.test(ua)){
    return "Firefox na Androidu neumí spustit přímou instalaci tímto tlačítkem. Otevři stránku v Chromu a klikni znovu, nebo ve Firefox menu zvol Přidat na domovskou obrazovku.";
  }
  if(/android/i.test(ua)){
    return "Prohlížeč zatím nepřipravil instalační dialog. V Chromu otevři menu ⋮ a zvol Instalovat aplikaci nebo Přidat na plochu.";
  }
  return "Instalaci teď nabízí prohlížeč v menu. V Android Chromu použij menu ⋮ a Instalovat aplikaci.";
}

function openAppToolsPanel(){
  const appToolsPanel=document.getElementById("appToolsPanel");
  const appToolsToggle=document.getElementById("appToolsToggle");
  if(appToolsPanel) appToolsPanel.classList.add("open");
  if(appToolsToggle) appToolsToggle.setAttribute("aria-expanded","true");
}

function setSzzInstallBusy(busy=false,text="Stáhnout aplikaci"){
  document.querySelectorAll(".install-app-btn").forEach(button=>{
    button.disabled=!!busy;
    button.textContent=text;
  });
}

async function installSzzAppFromPage(){
  openAppToolsPanel();
  if(isSzzAppInstalledView()){
    setSzzInstallStatus("Aplikace už běží jako nainstalovaná.","ok");
    if(window.showSaveConfirmation) window.showSaveConfirmation("Aplikace už je nainstalovaná.");
    return;
  }
  setSzzInstallBusy(true,"Připravuji instalaci...");
  setSzzInstallStatus("Připravuji aplikaci pro offline otevření...");
  try{
    if(window.prepareSzzOfflineAppData){
      const ready=await window.prepareSzzOfflineAppData({reason:"install"});
      const count=Number(ready && ready.shellCount) || 0;
      setSzzInstallStatus(`Aplikace připravena pro offline otevření (${count} souborů). Spouštím instalaci...`,"ok");
    }else{
      if(window.registerSzzServiceWorker) await window.registerSzzServiceWorker();
      if(window.requestSzzPersistentStorage) await window.requestSzzPersistentStorage({request:true});
      if(window.cacheAppShellForOffline){
        const count=await window.cacheAppShellForOffline();
        setSzzInstallStatus(`Aplikace připravena pro offline otevření (${count} souborů). Spouštím instalaci...`,"ok");
      }
    }
  }catch(e){
    console.warn("Příprava aplikace pro instalaci selhala",e);
    setSzzInstallStatus("Aplikaci se nepodařilo připravit pro offline režim: " + (e?.message || e),"error");
  }
  if(!deferredSzzInstallPrompt){
    const help=androidInstallHelpText();
    setSzzInstallStatus(help,"error");
    setSzzInstallBusy(false);
    if(window.showSaveConfirmation) window.showSaveConfirmation("Instalaci musí potvrdit prohlížeč.");
    return;
  }
  const promptEvent=deferredSzzInstallPrompt;
  deferredSzzInstallPrompt=null;
  updateSzzInstallButtons();
  try{
    promptEvent.prompt();
    const choice=await promptEvent.userChoice;
    if(choice?.outcome==="accepted"){
      setSzzInstallStatus("Instalace aplikace spuštěna. Po dokončení ji najdeš mezi aplikacemi / na ploše.","ok");
      if(window.showSaveConfirmation) window.showSaveConfirmation("Instalace aplikace spuštěna.");
    }else{
      setSzzInstallStatus("Instalace byla zrušena. Můžeš ji spustit znovu tlačítkem Stáhnout aplikaci.","error");
      if(window.showSaveConfirmation) window.showSaveConfirmation("Instalace zrušena.");
    }
  }catch(error){
    console.warn("Instalaci aplikace se nepodařilo spustit",error);
    setSzzInstallStatus("Instalaci se nepodařilo spustit: " + (error?.message || error),"error");
    if(window.showSaveConfirmation) window.showSaveConfirmation("Instalaci se nepodařilo spustit.");
  }finally{
    setSzzInstallBusy(false);
  }
}

window.updateSzzInstallButtons=updateSzzInstallButtons;
window.installSzzAppFromPage=installSzzAppFromPage;

window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  deferredSzzInstallPrompt=event;
  updateSzzInstallButtons();
});

window.addEventListener("appinstalled",()=>{
  deferredSzzInstallPrompt=null;
  updateSzzInstallButtons();
  if(window.showSaveConfirmation) window.showSaveConfirmation("Aplikace nainstalována.");
});

function bindSzzInstallControls(){
  const appToolsToggle=document.getElementById("appToolsToggle");
  const appToolsPanel=document.getElementById("appToolsPanel");
  if(appToolsToggle && appToolsPanel && !appToolsToggle.__appToolsBound){
    appToolsToggle.__appToolsBound=true;
    appToolsToggle.addEventListener("click",()=>{
      const open=!appToolsPanel.classList.contains("open");
      appToolsPanel.classList.toggle("open",open);
      appToolsToggle.setAttribute("aria-expanded",open ? "true" : "false");
    });
  }
  document.querySelectorAll(".install-app-btn").forEach(button=>{
    if(button.__szzInstallBound) return;
    button.__szzInstallBound=true;
    button.addEventListener("click",installSzzAppFromPage);
  });
  const prepareOfflineBtn=document.getElementById("prepareOfflineAppBtn");
  if(prepareOfflineBtn && !prepareOfflineBtn.__szzInstallPrepareBound){
    prepareOfflineBtn.__szzInstallPrepareBound=true;
    prepareOfflineBtn.addEventListener("click",()=>window.prepareSzzOfflineAppData?.({reason:"manual"}).catch(e=>{
      if(window.showSaveConfirmation) window.showSaveConfirmation("Offline příprava se nepodařila.");
      console.warn("Offline příprava selhala",e);
    }));
  }
  updateSzzInstallButtons();
}
document.addEventListener("DOMContentLoaded",bindSzzInstallControls);
bindSzzInstallControls();

function reportSzzServiceWorkerError(err){
  console.warn("Service worker se nepodarilo spustit",err);
  try{
    if(typeof setSzzInstallStatus==="function"){
      setSzzInstallStatus("Offline aplikaci se nepodařilo připravit. Zkus obnovit stránku nebo zkontroluj připojení.","error");
    }
  }catch(e){}
}
function registerSzzServiceWorker(){
  if(!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return Promise.resolve(null);
  if(window.__szzServiceWorkerRegistrationPromise) return window.__szzServiceWorkerRegistrationPromise;
  const serviceWorkerBuildVersion="2026-08-10-performance-phase99-v146";
  const reloadKey=`astipSzzSwReloaded:${serviceWorkerBuildVersion}`;
  if(!window.__szzSwControllerChangeBound){
    window.__szzSwControllerChangeBound=true;
    navigator.serviceWorker.addEventListener("controllerchange",()=>{
      try{
        if(sessionStorage.getItem(reloadKey)==="1") return;
        sessionStorage.setItem(reloadKey,"1");
        location.reload();
      }catch(e){
        location.reload();
      }
    });
  }
  window.__szzServiceWorkerRegistrationPromise=navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"})
    .then(registration=>{
      if(registration.waiting) registration.waiting.postMessage({type:"SKIP_WAITING"});
      registration.addEventListener("updatefound",()=>{
        const worker=registration.installing;
        if(!worker) return;
        worker.addEventListener("statechange",()=>{
          if(worker.state==="installed" && navigator.serviceWorker.controller){
            worker.postMessage({type:"SKIP_WAITING"});
          }
        });
      });
      try{ registration.update(); }catch(e){}
      return navigator.serviceWorker.ready.catch(()=>registration);
    })
    .catch(err=>{
      console.warn("Service worker se nepodarilo registrovat",err);
      window.__szzServiceWorkerRegistrationPromise=null;
      throw err;
    });
  return window.__szzServiceWorkerRegistrationPromise;
}
window.registerSzzServiceWorker=registerSzzServiceWorker;
registerSzzServiceWorker().catch(reportSzzServiceWorkerError);
window.addEventListener("load",()=>registerSzzServiceWorker().catch(reportSzzServiceWorkerError));
