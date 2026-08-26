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
const SZZ_WARRANTY_SELECT_OPTIONS=[
  {value:"",label:"Vyber záruku"},
  {value:"záruka 2 roky",label:"záruka 2 roky"},
  {value:"záruka 5 let",label:"záruka 5 let"},
  {value:"záruka zrušena",label:"záruka zrušena"}
];
window.szzDrawerNodesHaveDetailShell = window.szzDrawerNodesHaveDetailShell || function(nodes){
  return (nodes || []).some(node=>{
    if(!node || node.nodeType!==1) return false;
    return node.id==="detailTable"
      || node.id==="detailTabs"
      || !!(node.querySelector && (node.querySelector("#detailTable") || node.querySelector("#detailTabs")));
  });
};
window.szzCloneDrawerNodes = window.szzCloneDrawerNodes || function(nodes){
  return (nodes || []).map(node=>node && node.cloneNode ? node.cloneNode(true) : null).filter(Boolean);
};
window.szzCaptureNormalDrawerSnapshot = window.szzCaptureNormalDrawerSnapshot || function(drawer){
  const d=drawer || document.getElementById("drawer");
  if(!d || !(d.querySelector("#detailTable") && d.querySelector("#detailTabs"))) return false;
  const nodes=Array.from(d.childNodes);
  window.__normalDrawerNodes=nodes;
  window.__normalDrawerNodeClones=window.szzCloneDrawerNodes(nodes);
  if(typeof window.captureNormalDetailDrawerShell==="function"){
    try{ window.captureNormalDetailDrawerShell(d); }catch(e){}
  }
  return true;
};
window.szzRestoreNormalDrawerSnapshot = window.szzRestoreNormalDrawerSnapshot || function(drawer){
  const d=drawer || document.getElementById("drawer");
  if(!d) return false;
  if(typeof window.restoreNormalDetailDrawerShell==="function"){
    try{
      window.restoreNormalDetailDrawerShell();
      if(d.querySelector("#detailTable") && d.querySelector("#detailTabs")){
        if(typeof window.bindDetailShellControls==="function") window.bindDetailShellControls();
        return true;
      }
    }catch(e){}
  }
  if(window.szzDrawerNodesHaveDetailShell(window.__normalDrawerNodes)){
    d.replaceChildren(...window.__normalDrawerNodes);
    window.szzCaptureNormalDrawerSnapshot(d);
    if(typeof window.bindDetailShellControls==="function") window.bindDetailShellControls();
    return true;
  }
  if(window.szzDrawerNodesHaveDetailShell(window.__normalDrawerNodeClones)){
    d.replaceChildren(...window.szzCloneDrawerNodes(window.__normalDrawerNodeClones));
    window.szzCaptureNormalDrawerSnapshot(d);
    if(typeof window.bindDetailShellControls==="function") window.bindDetailShellControls();
    return true;
  }
  return false;
};
;
(function(){
  let onlyNewTempMarker=null;

  function nodeAdd(tag, options={}, children=[]){
    const node=document.createElement(tag);
    if(options.id) node.id=options.id;
    if(options.className) node.className=options.className;
    if(options.type) node.type=options.type;
    if(options.text!==undefined) node.textContent=String(options.text);
    if(options.value!==undefined) node.value=String(options.value);
    if(options.placeholder!==undefined) node.placeholder=String(options.placeholder);
    if(options.readOnly) node.readOnly=true;
    if(options.selected) node.selected=true;
    if(options.attrs){
      Object.entries(options.attrs).forEach(([key,value])=>{
        if(value!==undefined && value!==null) node.setAttribute(key,String(value));
      });
    }
    if(options.style) Object.assign(node.style,options.style);
    const list=Array.isArray(children) ? children : [children];
    list.forEach(child=>{
      if(child===null || child===undefined) return;
      node.append(child && child.nodeType ? child : document.createTextNode(String(child)));
    });
    return node;
  }

  function newKeyFieldAdd(label,key,options={}){
    const classes=[options.full ? "full" : "", options.className || ""].filter(Boolean).join(" ");
    const wrap=nodeAdd("div",{className:classes});
    const labelEl=nodeAdd("label",{text:label});
    let control;
    if(options.type==="textarea"){
      control=nodeAdd("textarea",{id:options.id});
    }else if(options.type==="select"){
      const selectedValue=String(options.value ?? "");
      control=nodeAdd("select",{id:options.id},(options.options || []).map(item=>{
        const value=String(item.value ?? "");
        return nodeAdd("option",{value,text:item.label ?? value,selected:value===selectedValue});
      }));
      control.value=selectedValue;
    }else{
      control=nodeAdd("input",{
        id:options.id,
        type:options.inputType,
        value:options.value,
        placeholder:options.placeholder,
        readOnly:options.readOnly
      });
    }
    control.dataset.newKey=key;
    wrap.append(labelEl,control);
    return wrap;
  }

  function createOnlyNewHead(){
    return nodeAdd("div",{className:"drawer-head"},[
      nodeAdd("div",{},[
        nodeAdd("h2",{text:"Přidat nové místo"}),
        nodeAdd("p",{className:"small",text:"Vyplň údaje a ulož bod."})
      ]),
      nodeAdd("button",{className:"secondary x",type:"button",id:"closeOnlyNew",text:"Zavřít"})
    ]);
  }

  function createOnlyNewSiteCard(){
    const gpsAddressInput=nodeAdd("input",{id:"onlyNewGpsAddress"});
    gpsAddressInput.dataset.newKey="Adresa_GPS";
    const grid=nodeAdd("div",{className:"new-only-grid"},[
      newKeyFieldAdd("Název","Název",{id:"onlyNewName"}),
      newKeyFieldAdd("Adresa / umístění","Adresa / umístění",{id:"onlyNewAddress"}),
      nodeAdd("div",{className:"full new-gps-address-field"},[
        nodeAdd("label",{text:"Adresa GPS"}),
        nodeAdd("div",{className:"new-gps-address-line"},[
          gpsAddressInput,
          nodeAdd("button",{className:"secondary",type:"button",id:"calcOnlyGps",text:"Dopočítat GPS"})
        ])
      ]),
      nodeAdd("div",{className:"full gps-actions"},[
        nodeAdd("button",{className:"secondary",type:"button",id:"pickOnlyGps",text:"Vybrat na mapě"}),
        nodeAdd("button",{className:"primary",type:"button",id:"findOnlyGps",text:"Ukázat bod na mapě"})
      ]),
      newKeyFieldAdd("GPS lat","GPS_lat",{id:"onlyNewGpsLat",placeholder:"49.123456"}),
      newKeyFieldAdd("GPS lon","GPS_lon",{id:"onlyNewGpsLon",placeholder:"16.123456"}),
      newKeyFieldAdd("Popis zdroje","Popis_zdroje",{full:true}),
      newKeyFieldAdd("Výrobní číslo","Zdroj",{full:true}),
      newKeyFieldAdd("Kontakt","Kontakt"),
      newKeyFieldAdd("Kraj","Kraj"),
      newKeyFieldAdd("Rok výroby","Rok výroby"),
      newKeyFieldAdd("Serviska","Serviska",{type:"select",options:[
        {value:"",label:""},
        {value:"ano",label:"ano"},
        {value:"ne",label:"ne"}
      ]}),
      newKeyFieldAdd("Záruka","Záruka",{type:"select",options:SZZ_WARRANTY_SELECT_OPTIONS}),
      newKeyFieldAdd("Perioda kontrol","Perioda kontrol",{type:"select",value:"12",options:[
        {value:"6",label:"6 měsíců"},
        {value:"12",label:"12 měsíců"}
      ]}),
      newKeyFieldAdd("Hlídáme kontroly sami","Hlídáme kontroly sami",{full:true,type:"select",value:"ne",options:[
        {value:"ne",label:"ne"},
        {value:"ano",label:"ano"}
      ]}),
      newKeyFieldAdd("Důležité poznámky","Důležitá poznámka",{full:true,className:"only-red",type:"textarea"})
    ]);
    return nodeAdd("div",{className:"card",id:"newSiteOnlyCard"},[
      grid,
      nodeAdd("div",{className:"row",style:{marginTop:"12px"}},[
        nodeAdd("button",{className:"primary",type:"button",id:"saveOnlyNew",text:"Uložit nové místo"}),
        nodeAdd("button",{className:"secondary",type:"button",id:"cancelOnlyNew",text:"Zrušit"})
      ]),
      nodeAdd("p",{className:"small",id:"onlyNewStatus"})
    ]);
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
    const gpsAddressEl=document.getElementById("onlyNewGpsAddress") || document.querySelector('#newSiteOnlyCard [data-new-key="Adresa_GPS"]');
    const address=String(gpsAddressEl?.value || document.getElementById("onlyNewAddress")?.value || document.getElementById("onlyNewName")?.value || "").trim();
    const latEl=document.getElementById("onlyNewGpsLat");
    const lonEl=document.getElementById("onlyNewGpsLon");

    if(!address){
      if(st) st.textContent="Vyplň adresu GPS nebo adresu / umístění.";
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
        window.setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region,{force:true});
        if(st) st.textContent=window.lastGeocodeMessage || (region ? "Adresa nebyla nalezena pro GPS, kraj jsem doplnil podle textu adresy." : "Adresa nebyla nalezena.");
        return;
      }

      if(latEl) latEl.value=g.lat;
      if(lonEl) lonEl.value=g.lon;
      if(gpsAddressEl) gpsAddressEl.value=g.display || address;
      const region=window.inferRegionFromAddressText(g.display || address, g.address || {});
      window.setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region,{force:true});
      if(st) st.textContent="GPS doplněno.";
    }catch(e){
      if(st) st.textContent="Chyba dopočtu GPS: "+e.message;
    }
  }

  function syncOnlyNewRegionFromText(options={}){
    const infer=window.inferRegionFromAddressText;
    const setRegion=window.setRegionFieldValue;
    if(typeof infer!=="function" || typeof setRegion!=="function") return "";
    const text=String(
      document.getElementById("onlyNewGpsAddress")?.value ||
      document.getElementById("onlyNewAddress")?.value ||
      document.getElementById("onlyNewName")?.value ||
      ""
    ).trim();
    if(!text) return "";
    const region=infer(text);
    if(region) setRegion('#newSiteOnlyCard [data-new-key="Kraj"]',region,options);
    return region;
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
    drawer.replaceChildren(createOnlyNewHead(),createOnlyNewSiteCard());

    document.getElementById("closeOnlyNew").onclick=()=>{drawer.classList.remove("open");};
    document.getElementById("cancelOnlyNew").onclick=()=>{drawer.classList.remove("open");};
    document.getElementById("calcOnlyGps").onclick=calcAddGps;
    document.getElementById("pickOnlyGps").onclick=window.startOnlyNewManualGpsPick;
    document.getElementById("findOnlyGps").onclick=findAddOnMap;
    document.getElementById("saveOnlyNew").onclick=saveAddSite;
    ["onlyNewName","onlyNewAddress","onlyNewGpsAddress"].forEach(id=>{
      const el=document.getElementById(id);
      if(el){
        el.addEventListener("input",()=>syncOnlyNewRegionFromText());
        el.addEventListener("change",()=>syncOnlyNewRegionFromText({force:true}));
      }
    });
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
      raw["Kraj"]=window.inferRegionFromAddressText(raw["Adresa_GPS"] || raw["Adresa / umístění"] || raw["Název"] || "");
      row.raw["Kraj"]=raw["Kraj"] || row.raw["Kraj"] || "";
      row.kraj=raw["Kraj"] || row.kraj || "";
    }

    if(!Number.isFinite(row.lat) || !Number.isFinite(row.lon)){
      try{
        const address=raw["Adresa_GPS"] || raw["Adresa / umístění"] || raw["Název"] || "";
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

    let legacyRowUpserted=false;
    if(!savedUnified && !savedOffline){
      if(typeof window.upsertFirebaseSiteRow==="function"){
        try{
          const loadedRows=window.upsertFirebaseSiteRow(row,false);
          const indexed=typeof window.findRowByAnyId==="function" ? window.findRowByAnyId(row.id,loadedRows) : null;
          if(indexed) row=indexed;
          legacyRowUpserted=true;
        }catch(e){
          console.warn("Rychlá aktualizace nového místa selhala, používám původní vložení",e);
        }
      }
      if(!legacyRowUpserted && Array.isArray(window.rows)){
        row.i=window.rows.length;
        window.rows.push(row);
        if(window.markRowsDirty) window.markRowsDirty();
      }
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
      }else if(!legacyRowUpserted && typeof window.render==="function") window.render();

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
      console.warn("Rychlé zobrazení nového místa selhalo",e);
      if(savedUnified && typeof window.loadFirebaseSitesUnified==="function"){
        window.loadFirebaseSitesUnified(savedId).catch(()=>{});
      }else if(typeof window.render==="function"){
        window.render();
      }
    }
  }

  function bindAddOnly(){
    if(window.__firebaseUnifiedPrimary !== false) return;
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
    if(!d.querySelector("#newSiteOnlyCard")){
      window.szzCaptureNormalDrawerSnapshot(d);
    }
  }

  function restoreDrawerTemplate(){
    const d = drawer();
    if(!d) return false;

    const isTemporaryForm = !!d.querySelector("#newSiteOnlyCard") || !!d.querySelector("#mainProtocolHistoryCard");
    if(isTemporaryForm && window.szzRestoreNormalDrawerSnapshot(d)){
      d.classList.remove("adding-new-site");
      const close=d.querySelector("#closeDrawer");
      if(close) close.onclick=()=>{
        if(typeof window.closeDetailDrawer==="function") window.closeDetailDrawer();
        else d.classList.remove("open");
      };
      if(typeof window.bindDetailShellControls==="function"){
        try{ window.bindDetailShellControls(); }catch(e){}
      }
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
    {label:"Adresa GPS", key:"Adresa_GPS", full:true, gpsAddress:true},
    {label:"Kraj", key:"Kraj", type:"region"},
    {label:"Popis zdroje", key:"Popis_zdroje", full:true},
    {label:"Výrobní číslo", key:"Zdroj"},
    {label:"Kontakt", key:"Kontakt"},
    {label:"Perioda kontrol", key:"Perioda kontrol", type:"period"},
    {label:"Hlídáme sami termín", key:"Hlídáme sami termín", type:"yesno"},
    {label:"Smlouva", key:"Smlouva ano/ne", type:"yesno"},
    {label:"Záruka", key:"Záruka", type:"select", options:SZZ_WARRANTY_SELECT_OPTIONS},
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
    window.__szzFirebaseSitesLastNetworkLoadAt = firebaseSitesLastNetworkLoadAt;
    window.__szzFirebaseRowsNetworkLoaded = true;
  }

  function firebaseSitesNetworkIsFresh(maxAge=FIREBASE_BACKGROUND_REFRESH_MIN_MS){
    return !!firebaseSitesLastNetworkLoadAt && Date.now()-firebaseSitesLastNetworkLoadAt < maxAge;
  }

  function firebaseSitesHaveOfflineSyncState(){
    try{
      const ready=JSON.parse(localStorage.getItem("astipSzzOfflineReady:v1") || "{}");
      return Number(ready && ready.rowsSyncedAtMs) > 0;
    }catch(e){
      return false;
    }
  }

  function firebaseSitesMayUseLocalCache(opts={}, signedUser=null){
    if(opts.skipLocalCache) return false;
    if(opts.offlineCacheOnly) return true;
    if(navigator.onLine===false) return true;
    if(opts.allowOnlineCache === true) return true;
    return !signedUser;
  }

  function firebaseSitesMayUseFirestoreCache(opts={}){
    if(opts.skipFirestoreCache) return false;
    if(opts.offlineCacheOnly) return true;
    if(navigator.onLine===false) return true;
    return opts.allowOnlineCache === true;
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
    "zaruka":"Záruka",
    "warranty":"Záruka",
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
  function regionOptionNodes(current=""){
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
    return [...map.entries()].map(([key,value])=>{
      const option=document.createElement("option");
      option.value=value;
      option.textContent=value || "Vyber kraj";
      option.selected=key===currentKey;
      return option;
    });
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
  let compatFirebaseNamespaceCache=null;
  let compatFirebaseAppCache=null;
  function ensureCompatFirebase(){
    if(!window.firebase) return null;
    if(compatFirebaseNamespaceCache===window.firebase && compatFirebaseAppCache) return compatFirebaseAppCache;
    try{
      if((!firebase.apps || !firebase.apps.length) && window.__firebaseConfig){
        firebase.initializeApp(window.__firebaseConfig);
      }
      const app=firebase.apps && firebase.apps.length ? firebase : null;
      if(app){
        compatFirebaseNamespaceCache=window.firebase;
        compatFirebaseAppCache=app;
      }
      return app;
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
  let modularDatabaseCache={fs:null,firestore:null,value:null};
  function modularDatabase(){
    const fs=window.fb && window.fb.fsMod;
    const firestore=window.db;
    if(!fs || !firestore || !fs.collection || !fs.doc || !fs.getDocs || !fs.setDoc) return null;
    if(modularDatabaseCache.fs===fs && modularDatabaseCache.firestore===firestore && modularDatabaseCache.value){
      return modularDatabaseCache.value;
    }
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
    const value={
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
    modularDatabaseCache={fs,firestore,value};
    return value;
  }
  let compatDatabaseCache={compat:null,value:null};
  function compatDatabase(){
    const compat=ensureCompatFirebase();
    if(!compat) return null;
    if(compatDatabaseCache.compat===compat && compatDatabaseCache.value) return compatDatabaseCache.value;
    try{
      const value=compat.firestore();
      compatDatabaseCache={compat,value};
      return value;
    }catch(e){
      return null;
    }
  }
  function db(){
    const modern=modularDatabase();
    if(modern) return modern;
    return compatDatabase();
  }
  let compatAuthCache={compat:null,value:null};
  function compatAuth(){
    const compat=ensureCompatFirebase();
    if(!compat || !compat.auth) return null;
    if(compatAuthCache.compat===compat && compatAuthCache.value) return compatAuthCache.value;
    try{
      const value=compat.auth();
      compatAuthCache={compat,value};
      return value;
    }catch(e){
      return null;
    }
  }
  function user(){
    const modernUser=window.__authReadyUser || window.currentUser || (window.auth && window.auth.currentUser) || null;
    if(modernUser) return modernUser;
    const auth=compatAuth();
    if(!auth) return null;
    try{return auth.currentUser || window.__authReadyUser || window.currentUser || null;}catch(e){return window.__authReadyUser || window.currentUser || null;}
  }
  function waitCompatUser(timeoutMs=3500){
    if(window.__authReadyUser || window.currentUser) return Promise.resolve(window.__authReadyUser || window.currentUser);
    if(typeof window.waitForFirebaseUser==="function") return window.waitForFirebaseUser(timeoutMs);
    const auth=compatAuth();
    if(!auth) return Promise.resolve(window.__authReadyUser || window.currentUser || null);
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
  function fbNode(tag, options={}, children=[]){
    const node=document.createElement(tag);
    if(options.id) node.id=options.id;
    if(options.className) node.className=options.className;
    if(options.type) node.type=options.type;
    if(options.text!==undefined) node.textContent=String(options.text);
    if(options.value!==undefined) node.value=String(options.value);
    if(options.placeholder!==undefined) node.placeholder=String(options.placeholder);
    if(options.readOnly) node.readOnly=true;
    if(options.selected) node.selected=true;
    if(options.title) node.title=options.title;
    if(options.attrs){
      Object.entries(options.attrs).forEach(([key,value])=>{
        if(value!==undefined && value!==null) node.setAttribute(key,String(value));
      });
    }
    const list=Array.isArray(children) ? children : [children];
    list.forEach(child=>{
      if(child===null || child===undefined) return;
      node.append(child && child.nodeType ? child : document.createTextNode(String(child)));
    });
    return node;
  }
  function fbField(spec){
    const k=spec.key;
    const cls=[spec.full ? "full" : "", spec.important ? "fbImportant" : ""].filter(Boolean).join(" ");
    const wrap=fbNode("div",{className:cls});
    const label=fbNode("label",{text:spec.label});
    let control;
    if(spec.type==="region"){
      control=fbNode("select",{},regionOptionNodes());
    }else if(spec.type==="period"){
      control=fbNode("select",{},[
        fbNode("option",{value:"6",text:"6 měsíců"}),
        fbNode("option",{value:"12",text:"12 měsíců",selected:true})
      ]);
      control.value="12";
    }else if(spec.type==="yesno"){
      control=fbNode("select",{},[
        fbNode("option",{value:"ne",text:"ne",selected:true}),
        fbNode("option",{value:"ano",text:"ano"})
      ]);
      control.value="ne";
    }else if(spec.type==="select"){
      control=fbNode("select",{},(spec.options || []).map(option=>fbNode("option",{
        value:option.value,
        text:option.label,
        selected:option.selected
      })));
    }else if(spec.type==="textarea"){
      control=fbNode("textarea");
    }else if(spec.gpsAddress){
      const input=fbNode("input",{id:"fbUnifiedGpsAddress"});
      input.dataset.fbKey=k;
      wrap.classList.add("fbUnifiedGpsAddressField");
      wrap.append(label,fbNode("div",{className:"fbUnifiedGpsAddressLine"},[
        input,
        fbNode("button",{className:"fbSecondary",id:"fbUnifiedGpsInline",type:"button",text:"Dopočítat GPS"})
      ]));
      return wrap;
    }else{
      control=fbNode("input",{readOnly:spec.readonly,title:spec.readonly ? "Dopočítá se z adresy" : ""});
    }
    control.dataset.fbKey=k;
    wrap.append(label,control);
    return wrap;
  }
  function fbDateBox(className,label,id){
    return fbNode("div",{className:`control-date-box ${className}`},[
      fbNode("span",{text:label}),
      fbNode("input",{id,type:"date"})
    ]);
  }
  function createFbUnifiedPanelContent(){
    const head=fbNode("div",{className:"fbUnifiedHead"},[
      fbNode("div",{},[
        fbNode("h2",{text:"Přidat nové místo"}),
        fbNode("p",{className:"small",text:"Nové místo se uloží mezi ostatní body."}),
        fbNode("div",{className:"fbDbBadge"},[
          "Kolekce: ",
          fbNode("b",{text:FB_COLLECTION})
        ])
      ]),
      fbNode("button",{className:"fbSecondary",id:"fbUnifiedClose",type:"button",text:"Zavřít"})
    ]);
    const grid=fbNode("div",{className:"fbUnifiedGrid"},[
      ...FB_USER_FIELDS.map(fbField),
      ...FB_HIDDEN_KEYS.map(key=>{
        const input=fbNode("input",{type:"hidden"});
        input.dataset.fbKey=key;
        return input;
      })
    ]);
    return [
      head,
      fbNode("div",{className:"fbUnifiedNotice",id:"fbUnifiedStatus",text:"Připraveno. Vyplň aspoň název/adresu a GPS."}),
      fbNode("div",{className:"fbUnifiedDates control-dates-strong"},[
        fbDateBox("control-date-last","Poslední proběhlá kontrola","fbUnifiedLastCheck"),
        fbDateBox("control-date-next","Příští plánovaná kontrola","fbUnifiedNextCheck")
      ]),
      fbNode("div",{className:"fbUnifiedActions"},[
        fbNode("button",{className:"fbSecondary",id:"fbUnifiedPick",type:"button",text:"Vybrat na mapě"}),
        fbNode("button",{className:"fbSecondary",id:"fbUnifiedFind",type:"button",text:"Ukázat bod na mapě"}),
        fbNode("button",{className:"fbPrimary",id:"fbUnifiedSave",type:"button",text:"Uložit bod a otevřít detail"}),
        fbNode("button",{className:"fbDanger",id:"fbUnifiedClear",type:"button",text:"Vymazat formulář"})
      ]),
      grid
    ];
  }
  function ensurePanel(){
    if(document.getElementById("fbUnifiedPanel")) return;
    const overlay=document.createElement("div"); overlay.id="fbUnifiedOverlay"; overlay.onclick=closePanel; document.body.appendChild(overlay);
    const panel=document.createElement("div"); panel.id="fbUnifiedPanel";
    panel.replaceChildren(...createFbUnifiedPanelContent());
    document.body.appendChild(panel);
    document.getElementById("fbUnifiedClose").onclick=closePanel;
    const gpsBtn=document.getElementById("fbUnifiedGpsInline");
    if(gpsBtn) gpsBtn.onclick=calcGps;
    document.getElementById("fbUnifiedPick").onclick=window.startFbUnifiedManualGpsPick;
    document.getElementById("fbUnifiedFind").onclick=findOnMap;
    document.getElementById("fbUnifiedSave").onclick=savePoint;
    document.getElementById("fbUnifiedClear").onclick=clearForm;
    ["Název","Adresa / umístění","Adresa_GPS"].forEach(key=>{
      const el=panel.querySelector(`[data-fb-key="${CSS.escape(key)}"]`);
      if(el){
        el.addEventListener("input",()=>syncFbUnifiedRegionFromText());
        el.addEventListener("change",()=>syncFbUnifiedRegionFromText({force:true}));
      }
    });
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
  function syncFbUnifiedRegionFromText(options={}){
    const infer=window.inferRegionFromAddressText;
    const setRegion=window.setRegionFieldValue;
    if(typeof infer!=="function" || typeof setRegion!=="function") return "";
    const text=val(document.querySelector('#fbUnifiedPanel [data-fb-key="Adresa_GPS"]')?.value)
      || val(document.querySelector('#fbUnifiedPanel [data-fb-key="Adresa / umístění"]')?.value)
      || val(document.querySelector('#fbUnifiedPanel [data-fb-key="Název"]')?.value);
    if(!text) return "";
    const region=infer(text);
    if(region) setRegion('#fbUnifiedPanel [data-fb-key="Kraj"]',region,options);
    return region;
  }
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
    const raw=getRaw(); const address=raw["Adresa_GPS"] || raw["Adresa / umístění"] || raw["Název"];
    if(!address){status("Vyplň nejdřív adresu GPS nebo adresu / umístění.",true);return;}
    try{
      status("Dopočítávám GPS...");
      const geocode=window.geocodeAddressGeneric;
      const inferRegion=window.inferRegionFromAddressText;
      const found=typeof geocode==="function" ? await geocode(address) : null;
      if(!found){
        const region=typeof inferRegion==="function" ? inferRegion(address) : "";
        if(region) setField("Kraj",region);
        status(window.lastGeocodeMessage || (region ? "GPS se nepodařilo dopočítat, kraj jsem doplnil podle textu adresy." : "Adresa nebyla nalezena."),true);
        return;
      }
      setField("Adresa_GPS",found.display || address);
      setField("GPS_lat",found.lat);
      setField("GPS_lon",found.lon);
      if(typeof inferRegion==="function"){
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
  function rawHasOwnKeys(raw){
    if(!raw || typeof raw!=="object") return false;
    for(const key in raw){
      if(Object.prototype.hasOwnProperty.call(raw,key)) return true;
    }
    return false;
  }
  function mapRowsCacheItems(firebaseRows){
    return (firebaseRows || []).map(row=>({
      docId:row.firebaseDocId || row.raw?.["Firebase_doc_id"] || row.id || "",
      raw:row.raw || {},
      latestProtocolDate:row.firebaseData?.latestProtocolDate || ""
    })).filter(item=>item.docId && rawHasOwnKeys(item.raw));
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
  const OFFLINE_SITE_QUEUE_CACHE_MS=1800;
  let offlineSiteQueueCache={raw:null,items:null,savedAt:0};
  function cloneOfflineSiteQueueItems(items=[]){
    return Array.isArray(items)
      ? items.map(item=>item && typeof item==="object" ? {...item,raw:item.raw && typeof item.raw==="object" ? {...item.raw} : item.raw} : item)
      : [];
  }
  function rememberOfflineSiteQueue(raw,items=[]){
    offlineSiteQueueCache={raw:String(raw || ""),items:cloneOfflineSiteQueueItems(items),savedAt:Date.now()};
  }
  window.addEventListener("storage",event=>{
    if(!event.key || event.key===OFFLINE_SITE_QUEUE_KEY){
      offlineSiteQueueCache={raw:null,items:null,savedAt:0};
    }
  });
  function readOfflineSiteQueue(){
    try{
      const raw=localStorage.getItem(OFFLINE_SITE_QUEUE_KEY) || "";
      if(offlineSiteQueueCache.raw===raw && offlineSiteQueueCache.items && Date.now()-offlineSiteQueueCache.savedAt<OFFLINE_SITE_QUEUE_CACHE_MS){
        return cloneOfflineSiteQueueItems(offlineSiteQueueCache.items);
      }
      const items=JSON.parse(raw || "[]");
      const queue=Array.isArray(items) ? items.filter(item=>item && item.docId && item.raw) : [];
      rememberOfflineSiteQueue(raw,queue);
      return queue;
    }catch(e){
      return [];
    }
  }
  function compactOfflineSiteQueueAfterIndexedDbSave(items=[]){
    if(!window.saveOfflineSiteQueueItem || !Array.isArray(items) || !items.length) return;
    Promise.allSettled(items.map(item=>window.saveOfflineSiteQueueItem(item))).then(results=>{
      const unsaved=items.filter((_item,idx)=>!(results[idx] && results[idx].status==="fulfilled" && results[idx].value));
      try{
        const raw=JSON.stringify(unsaved);
        localStorage.setItem(OFFLINE_SITE_QUEUE_KEY,raw);
        rememberOfflineSiteQueue(raw,unsaved);
      }catch(e){}
    }).catch(()=>{});
  }
  function writeOfflineSiteQueue(items=[]){
    try{
      const queueItems=Array.isArray(items) ? items : [];
      const raw=JSON.stringify(queueItems);
      localStorage.setItem(OFFLINE_SITE_QUEUE_KEY,raw);
      rememberOfflineSiteQueue(raw,queueItems);
      compactOfflineSiteQueueAfterIndexedDbSave(queueItems);
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
    let row=rowFromDoc(docId,{raw,createdAt:now,updatedAt:now,manualEntry:true,localOnly:true,offline:true});
    let loadedRows=null;
    if(typeof window.upsertFirebaseSiteRow==="function"){
      try{
        loadedRows=window.upsertFirebaseSiteRow(row,docId);
        const indexed=typeof window.findRowByAnyId==="function" ? window.findRowByAnyId(docId,loadedRows) : null;
        if(indexed) row=indexed;
      }catch(e){
        console.warn("Rychlé offline vložení bodu selhalo, používám původní obnovu řádků",e);
        loadedRows=null;
      }
    }
    if(!Array.isArray(loadedRows)){
      const nextRows=(Array.isArray(window.rows) ? window.rows : [])
        .filter(existing=>String(existing.firebaseDocId || existing.raw?.["Firebase_doc_id"] || existing.id || "")!==docId)
        .concat([row]);
      if(typeof window.setFirebaseSiteRows==="function") loadedRows=window.setFirebaseSiteRows(nextRows,docId);
      else{
        window.rows=nextRows;
        if(window.markRowsDirty) window.markRowsDirty();
        if(typeof window.render==="function") window.render();
        loadedRows=nextRows;
      }
    }
    const cacheRows=Array.isArray(loadedRows) && loadedRows.length
      ? loadedRows
      : (Array.isArray(window.rows) && window.rows.length ? window.rows : [row]);
    saveMapRowsCache(cacheRows);
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
  async function showMapRowsCache(openDocId=null, options={}){
    if(openDocId) return [];
    if(Array.isArray(window.rows) && window.rows.length) return [];
    if(navigator.onLine!==false && !options.offlineBoot && !options.allowOnlineCache){
      return [];
    }
    const cachedRows=await readMapRowsCacheFast();
    if(!cachedRows.length) return [];
    const label=navigator.onLine===false || options.offlineBoot
      ? `<b>Offline režim.</b> Načteno ${cachedRows.length} bodů z lokální cache.`
      : `<b>Načteno ${cachedRows.length} bodů z lokální cache.</b> Aktualizuji Firebase na pozadí...`;
    return applyFirebaseRows(cachedRows, openDocId, label, false);
  }
  window.showFirebaseMapRowsCache=showMapRowsCache;
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
    if(opts.auto && !openDocId && Array.isArray(window.rows) && window.rows.length && firebaseSitesHaveOfflineSyncState()){
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
      const cachedRows=await showMapRowsCache(openDocId,{offlineBoot:navigator.onLine===false || opts.offlineCacheOnly});
      if(cachedRows.length){
        const p=document.getElementById("progress");
        if(p) p.textContent="Offline režim. Body jsou načtené z lokální cache.";
        if(lockLoad){
          firebaseSitesLoading=false;
          if(firebaseSitesLoadingResolve) firebaseSitesLoadingResolve();
          firebaseSitesLoadingPromise=null;
          firebaseSitesLoadingResolve=null;
        }
        return cachedRows;
      }
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
        if(navigator.onLine===false || opts.offlineCacheOnly || (window.knownSignedIn && window.knownSignedIn())){
          const cachedRows=await showMapRowsCache(openDocId,{offlineBoot:navigator.onLine===false || opts.offlineCacheOnly});
          if(cachedRows.length){
            const p=document.getElementById("progress");
            if(p) p.textContent=navigator.onLine===false
              ? "Offline režim. Body jsou načtené z lokální cache."
              : "Čekám na obnovení přihlášení, zatím používám lokální cache.";
            return cachedRows;
          }
        }
        sideStatus("",false);
        if(!opts.offlineCacheOnly && !opts.retryAuth) setTimeout(()=>loadFirebaseSites(openDocId,{retryAuth:true}),1200);
        return [];
      }
      if(firebaseSitesMayUseLocalCache(opts,signedUser)){
        const cachedRows=await showMapRowsCache(openDocId);
        if(cachedRows.length && !opts.force){
          scheduleFirebaseSitesBackgroundRefresh(openDocId,80);
          return cachedRows;
        }
      }
      const collectionRef=database.collection(FB_COLLECTION);
      if(firebaseSitesMayUseFirestoreCache(opts) && !openDocId && database.mode==="modular" && typeof collectionRef.getCached==="function"){
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
      if(options.openDetail!==false && typeof window.openDetailById==="function") window.szzAfterTwoPaints(()=>window.openDetailById(id));
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
      window.szzAfterTwoPaints(()=>window.openDetailById(id));
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
	      const address=raw["Adresa_GPS"] || raw["Adresa / umístění"] || raw["Název"] || "";
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
    const reload=document.getElementById("reloadFirebaseSitesBtn"); if(reload) reload.onclick=()=>loadFirebaseSites(null,{force:true,skipLocalCache:true,skipFirestoreCache:true});
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
    const auth=compatAuth();
    if(auth && auth.onAuthStateChanged){
      auth.onAuthStateChanged(user=>{ if(user) loadFirebaseSites(null,{auto:true,force:true,skipLocalCache:true,skipFirestoreCache:true}); });
    }
  }catch(e){}
  window.loadFirebaseSitesUnified=loadFirebaseSites;
  window.migrateCsvToFirebaseUnified=migrateCsvToFirebase;
  window.saveUnifiedSiteRaw=saveUnifiedSiteRaw;
  window.refreshFirebaseSitesAfterSave=refreshAfterSave;
})();
;
/* FINAL FIX: další zdroj z detailu používá samostatný čistý formulář */
(function(){
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

  function sourceNode(tag, options={}, children=[]){
    const node=document.createElement(tag);
    if(options.id) node.id=options.id;
    if(options.className) node.className=options.className;
    if(options.type) node.type=options.type;
    if(options.text!==undefined) node.textContent=String(options.text);
    if(options.value!==undefined) node.value=String(options.value);
    if(options.placeholder!==undefined) node.placeholder=String(options.placeholder);
    if(options.readOnly) node.readOnly=true;
    if(options.selected) node.selected=true;
    if(options.attrs){
      Object.entries(options.attrs).forEach(([key,value])=>{
        if(value!==undefined && value!==null) node.setAttribute(key,String(value));
      });
    }
    if(options.style) Object.assign(node.style,options.style);
    const list=Array.isArray(children) ? children : [children];
    list.forEach(child=>{
      if(child===null || child===undefined) return;
      node.append(child && child.nodeType ? child : document.createTextNode(String(child)));
    });
    return node;
  }

  function sourceNewKeyField(label,key,options={}){
    const classes=[options.full ? "full" : "", options.className || ""].filter(Boolean).join(" ");
    const wrap=sourceNode("div",{className:classes});
    let control;
    if(options.type==="textarea"){
      control=sourceNode("textarea",{id:options.id,value:options.value});
      if(options.value!==undefined) control.value=String(options.value);
    }else if(options.type==="select"){
      const selectedValue=String(options.value ?? "");
      control=sourceNode("select",{id:options.id},(options.options || []).map(item=>{
        const value=String(item.value ?? "");
        return sourceNode("option",{value,text:item.label ?? value,selected:value===selectedValue});
      }));
      control.value=selectedValue;
    }else{
      control=sourceNode("input",{
        id:options.id,
        type:options.inputType,
        value:options.value,
        placeholder:options.placeholder,
        readOnly:options.readOnly
      });
    }
    control.dataset.newKey=key;
    wrap.append(sourceNode("label",{text:label}),control);
    return wrap;
  }

  function createAddSourceHead(place){
    return sourceNode("div",{className:"drawer-head"},[
      sourceNode("div",{},[
        sourceNode("h2",{text:"Přidat další zdroj"}),
        sourceNode("p",{className:"small",text:place || "Stejné místo"})
      ]),
      sourceNode("button",{className:"secondary x",type:"button",id:"closeOnlyNew",text:"Zavřít"})
    ]);
  }

  function createAddSourceCard(data){
    const period=data.period === "6" ? "6" : "12";
    const grid=sourceNode("div",{className:"new-only-grid"},[
      sourceNewKeyField("Název místa","Název",{full:true,value:data.name}),
      sourceNewKeyField("Adresa / umístění","Adresa / umístění",{full:true,id:"onlyNewAddress",value:data.place,readOnly:true}),
      sourceNewKeyField("GPS lat","GPS_lat",{id:"onlyNewGpsLat",value:data.lat,readOnly:true}),
      sourceNewKeyField("GPS lon","GPS_lon",{id:"onlyNewGpsLon",value:data.lon,readOnly:true}),
      sourceNewKeyField("Adresa GPS","Adresa_GPS",{full:true,value:data.place,readOnly:true}),
      sourceNewKeyField("Kraj","Kraj",{value:data.region,readOnly:true}),
      sourceNewKeyField("Kontakt","Kontakt",{value:data.contact}),
      sourceNewKeyField("Popis zdroje","Popis_zdroje",{full:true,id:"addSourceType",placeholder:"např. PS 20 000/3f - 45 min."}),
      sourceNewKeyField("Výrobní číslo","Zdroj",{full:true,id:"addSourceSerial",placeholder:"výrobní číslo zdroje"}),
      sourceNewKeyField("Poslední kontrola","Poslední_kontrola",{inputType:"date",value:data.lastCheck}),
      sourceNewKeyField("Příští kontrola","Příští_kontrola",{inputType:"date",value:data.nextCheck}),
      sourceNewKeyField("Perioda kontrol","Perioda kontrol",{type:"select",value:period,options:[
        {value:"6",label:"6 měsíců"},
        {value:"12",label:"12 měsíců"}
      ]}),
      sourceNewKeyField("Hlídáme sami termín","Hlídáme sami termín",{type:"select",value:"ne",options:[
        {value:"ne",label:"ne"},
        {value:"ano",label:"ano"}
      ]}),
      sourceNewKeyField("Rok výroby","Rok výroby"),
      sourceNewKeyField("Serviska","Serviska",{type:"select",options:[
        {value:"",label:""},
        {value:"ano",label:"ano"},
        {value:"ne",label:"ne"}
      ]}),
      sourceNewKeyField("Smlouva","Smlouva ano/ne",{type:"select",options:[
        {value:"",label:""},
        {value:"ano",label:"ano"},
        {value:"ne",label:"ne"}
      ]}),
      sourceNewKeyField("Záruka","Záruka",{type:"select",options:SZZ_WARRANTY_SELECT_OPTIONS}),
      sourceNewKeyField("Důležité poznámky","Důležitá poznámka",{full:true,className:"only-red",type:"textarea"})
    ]);
    return sourceNode("div",{className:"card",id:"newSiteOnlyCard",attrs:{"data-add-source-form":"1"}},[
      sourceNode("p",{className:"small",text:"Adresa a GPS jsou převzaté z aktuálního místa. Doplň hlavně popis zdroje nebo výrobní číslo."}),
      grid,
      sourceNode("div",{className:"row",style:{marginTop:"12px"}},[
        sourceNode("button",{className:"primary",type:"button",id:"saveAddSourceOnly",text:"Uložit nový zdroj"}),
        sourceNode("button",{className:"secondary",type:"button",id:"cancelOnlyNew",text:"Zrušit"})
      ]),
      sourceNode("p",{className:"small",id:"onlyNewStatus"})
    ]);
  }

  function rowKeySource(row){
    try{
      if(typeof window.detailKey === "function") return window.detailKey(row);
    }catch(e){}
    const raw = (row && row.raw) || {};
    return cleanSource((row && (row.firebaseDocId || row.id)) || raw["Firebase_doc_id"] || raw["Klíč_adresy"]);
  }

  function rowBySourceKey(key){
    const wanted = cleanSource(key);
    if(!wanted) return null;
    try{
      if(typeof window.findRowByAnyId === "function"){
        const indexed = window.findRowByAnyId(wanted);
        if(indexed) return indexed;
      }
      const direct = window.siteRowsByAnyId && window.siteRowsByAnyId.get && window.siteRowsByAnyId.get(wanted);
      if(direct) return direct;
    }catch(e){}
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
    window.szzCaptureNormalDrawerSnapshot(drawer);
  }

	  function restoreNormalDrawerTemplateForSource(){
	    const drawer = document.getElementById("drawer");
	    if(!drawer) return false;
	    if(drawer.querySelector("#newSiteOnlyCard") && window.szzRestoreNormalDrawerSnapshot(drawer)){
	      drawer.classList.remove("adding-new-site");
	      if(typeof window.bindDetailShellControls==="function"){
	        try{ window.bindDetailShellControls(); }catch(e){}
	      }
	      return true;
	    }
	    return false;
	  }

  function returnToSourceDetail(site){
    const key = rowKeySource(site);
    restoreNormalDrawerTemplateForSource();
    if(key && typeof window.openDetailById === "function"){
      window.szzAfterPaint(()=>window.openDetailById(key));
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
    drawer.replaceChildren(createAddSourceHead(place),createAddSourceCard({
      place,
      region,
      name,
      contact,
      lat,
      lon,
      period,
      lastCheck,
      nextCheck
    }));

    document.getElementById("closeOnlyNew").onclick = ()=>returnToSourceDetail(site);
    document.getElementById("cancelOnlyNew").onclick = ()=>returnToSourceDetail(site);
    document.getElementById("saveAddSourceOnly").onclick = ()=>saveAddSourceFromDetail(site);
    window.szzAfterPaint(()=>{
      const first = document.getElementById("addSourceType") || document.getElementById("addSourceSerial");
      if(first) first.focus();
    });
  }

  function upsertAddedSourceRowLocally(raw, savedId){
    const cleanId = typeof window.safe === "function" ? window.safe(savedId) : cleanSource(savedId);
    if(!cleanId || !raw) return null;
    const prepared = {...raw, "Firebase_doc_id": cleanId};
    let normalized = null;
    try{
      const normalizeRows = window.normalizeSiteRows || window.normalize;
      normalized = typeof normalizeRows === "function" ? normalizeRows([prepared])[0] : null;
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
    if(typeof window.upsertFirebaseSiteRow === "function"){
      try{
        const loadedRows = window.upsertFirebaseSiteRow(normalized, false);
        const indexed = typeof window.findRowByAnyId === "function" ? window.findRowByAnyId(cleanId, loadedRows) : null;
        window.selectedSite = indexed || normalized;
        return window.selectedSite;
      }catch(e){
        console.warn("Rychlý lokální upsert nového zdroje selhal, používám fallback", e);
      }
    }
    const detailFn = typeof window.detailKey === "function" ? window.detailKey : null;
    const docIdFn = typeof window.selectedSiteDocId === "function" ? window.selectedSiteDocId : null;
    const localKey = (detailFn ? detailFn(normalized) : cleanId) || cleanId;
    const currentRows = Array.isArray(window.rows) ? window.rows : [];
    window.rows = currentRows.filter(row=>{
      const rowDoc = docIdFn ? docIdFn(row) : (typeof window.safe === "function" ? window.safe(row && row.firebaseDocId) : cleanSource(row && row.firebaseDocId));
      const rowKey = detailFn ? detailFn(row) : (typeof window.safe === "function" ? window.safe(row && row.id) : cleanSource(row && row.id));
      return rowDoc !== cleanId && rowKey !== localKey;
    }).concat([normalized]);
    window.selectedSite = normalized;
    if(window.markRowsDirty) window.markRowsDirty();
    if(typeof window.filters === "function") window.filters();
    if(typeof window.render === "function") window.render();
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
        if(typeof window.openDetailById === "function") window.szzAfterTwoPaints(()=>window.openDetailById(savedId));
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
      }else if(typeof window.render === "function"){
        window.render();
      }
      restoreNormalDrawerTemplateForSource();
      if((visible || localRow) && typeof window.openDetailById === "function"){
        window.szzAfterTwoPaints(()=>window.openDetailById(savedId));
      }
    }catch(e){
      if(st) st.textContent = "Chyba uložení nového zdroje: " + e.message;
    }
  }

  function openSourceByKey(key){
    const site = rowBySourceKey(key) || window.selectedSite;
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
const SZZ_INSTALL_APP_BUILD_VERSION="2026-08-26-detail-status-buttons-module-v541";
const SZZ_INSTALL_SITE_CACHE_KEY="astipFirebaseSitesMapCacheV2";
const SZZ_INSTALL_QUEUE_DB_NAME="astipMapOfflineQueues";
const SZZ_INSTALL_QUEUE_DB_VERSION=2;
const SZZ_INSTALL_OFFLINE_READY_CACHE_MS=1800;
const SZZ_INSTALL_SITE_COUNT_CACHE_MS=1800;
const SZZ_INSTALL_OFFLINE_COUNTS_CACHE_MS=1200;
let szzInstallOfflineReadyCache={raw:null,item:null,savedAt:0};
let szzInstallSiteCountCache={raw:null,count:0,savedAt:0};
let szzInstallOfflineCountsCache={savedAt:0,counts:null,promise:null};
let szzInstallOfflineCountsCacheVersion=0;
function cloneSzzInstallOfflineReady(value={}){
  return value && typeof value==="object" && !Array.isArray(value) ? {...value} : {};
}
function clearSzzInstallOfflineReadyCache(){
  szzInstallOfflineReadyCache={raw:null,item:null,savedAt:0};
}
function cloneSzzInstallOfflineCounts(counts={}){
  return {
    sites:Number(counts.sites) || 0,
    protocols:Number(counts.protocols) || 0,
    photos:Number(counts.photos) || 0,
    drafts:Number(counts.drafts) || 0
  };
}
function clearSzzInstallOfflineCountsCache(){
  szzInstallOfflineCountsCacheVersion++;
  szzInstallOfflineCountsCache={savedAt:0,counts:null,promise:null};
}
window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_INSTALL_OFFLINE_READY_KEY) clearSzzInstallOfflineReadyCache();
  if(!event.key || event.key===SZZ_INSTALL_SITE_CACHE_KEY) szzInstallSiteCountCache={raw:null,count:0,savedAt:0};
  if(
    !event.key ||
    event.key==="astipMap:offlineSites:v1" ||
    event.key.startsWith("astipMap:protocolHistory:") ||
    event.key.startsWith("astipMap:protocolDraft:")
  ){
    clearSzzInstallOfflineCountsCache();
  }
});
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
  "./szz-app-icon-maskable-192.png",
  "./szz-app-icon-maskable-512.png",
  "./podpis-tipek.png",
  "./podpis-tipek.jpg",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];

function szzInstallCurrentShellUrls(baseUrls=SZZ_INSTALL_SHELL_URLS){
  const urls=[...(baseUrls || [])];
  try{
    document.querySelectorAll('script[src],link[rel="stylesheet"][href],link[rel="modulepreload"][href],link[rel="preload"][href],link[rel="manifest"][href],link[rel~="icon"][href],link[rel="apple-touch-icon"][href]').forEach(el=>{
      if(el.rel==="preload" && !["script","style","fetch"].includes(el.as || "")) return;
      const url=el.src || el.href;
      if(url) urls.push(url);
    });
  }catch(e){}
  try{
    if(performance && typeof performance.getEntriesByType==="function"){
      performance.getEntriesByType("resource").forEach(entry=>{
        const url=entry && entry.name;
        if(szzInstallIsShellResourceUrl(url)) urls.push(url);
      });
    }
  }catch(e){}
  return urls
    .map(szzInstallNormalizeShellUrl)
    .filter((url,idx,arr)=>url && arr.indexOf(url)===idx);
}

function szzInstallNormalizeShellUrl(url){
  try{
    const absolute=new URL(url,document.baseURI);
    if(!/^https?:$/.test(absolute.protocol)) return "";
    return absolute.href;
  }catch(e){
    return "";
  }
}

function szzInstallIsShellResourceUrl(url){
  try{
    const absolute=new URL(url,document.baseURI);
    const path=absolute.pathname;
    if(absolute.origin===location.origin){
      return path.includes("/assets/") ||
        /\/(index\.html|app\.css|late\.js|manifest\.webmanifest|sw\.js|szz-icon(?:-\d+)?\.png|szz-app-icon(?:-maskable)?-\d+\.png|szz-logo(?:-display)?\.png|podpis-tipek\.(?:png|jpg))$/.test(path);
    }
    return absolute.hostname==="unpkg.com" &&
      /^\/leaflet@1\.9\.4\/dist\/leaflet\.(?:css|js)$/.test(path);
  }catch(e){
    return false;
  }
}

function szzInstallPostShellUrlsToServiceWorker(registration,urls){
  const worker=(navigator.serviceWorker && navigator.serviceWorker.controller) ||
    (registration && (registration.active || registration.waiting || registration.installing));
  if(!worker || !urls.length) return Promise.resolve(urls.length);
  if(typeof MessageChannel==="undefined"){
    try{ worker.postMessage({type:"SZZ_CACHE_APP_SHELL",urls}); }catch(e){}
    return Promise.resolve(urls.length);
  }
  return new Promise(resolve=>{
    const channel=new MessageChannel();
    const timer=setTimeout(()=>resolve(urls.length),3500);
    channel.port1.onmessage=event=>{
      clearTimeout(timer);
      const count=Number(event && event.data && event.data.count);
      resolve(Number.isFinite(count) && count>=0 ? count : urls.length);
    };
    try{
      worker.postMessage({type:"SZZ_CACHE_APP_SHELL",urls},[channel.port2]);
    }catch(e){
      clearTimeout(timer);
      resolve(urls.length);
    }
  });
}

const SZZ_INSTALL_SHELL_POST_CACHE_MS=30000;
let szzInstallShellPostCache={signature:"",savedAt:0,count:null,promise:null};
function szzInstallCachedPostShellUrlsToServiceWorker(registration,urls){
  const signature=(urls || []).join("\n");
  const now=Date.now();
  if(
    signature
    && szzInstallShellPostCache.signature===signature
    && now-szzInstallShellPostCache.savedAt<SZZ_INSTALL_SHELL_POST_CACHE_MS
  ){
    if(szzInstallShellPostCache.promise) return szzInstallShellPostCache.promise;
    if(Number.isFinite(szzInstallShellPostCache.count)) return Promise.resolve(szzInstallShellPostCache.count);
  }
  const promise=szzInstallPostShellUrlsToServiceWorker(registration,urls).then(count=>{
    szzInstallShellPostCache={signature,savedAt:Date.now(),count:Number(count) || 0,promise:null};
    return szzInstallShellPostCache.count;
  });
  szzInstallShellPostCache={signature,savedAt:now,count:null,promise};
  return promise;
}

function szzInstallReadOfflineReady(){
  try{
    const raw=localStorage.getItem(SZZ_INSTALL_OFFLINE_READY_KEY) || "";
    if(
      szzInstallOfflineReadyCache.raw===raw &&
      szzInstallOfflineReadyCache.item &&
      Date.now()-szzInstallOfflineReadyCache.savedAt<SZZ_INSTALL_OFFLINE_READY_CACHE_MS
    ){
      return cloneSzzInstallOfflineReady(szzInstallOfflineReadyCache.item);
    }
    const parsed=JSON.parse(raw || "{}");
    const item=parsed && typeof parsed==="object" ? parsed : {};
    szzInstallOfflineReadyCache={raw,item:cloneSzzInstallOfflineReady(item),savedAt:Date.now()};
    return item;
  }catch(e){
    return {};
  }
}

function szzInstallWriteOfflineReady(update={}){
  const next={...szzInstallReadOfflineReady(),...update,updatedAt:new Date().toISOString()};
  try{
    const raw=JSON.stringify(next);
    localStorage.setItem(SZZ_INSTALL_OFFLINE_READY_KEY,raw);
    szzInstallOfflineReadyCache={raw,item:cloneSzzInstallOfflineReady(next),savedAt:Date.now()};
  }catch(e){}
  return next;
}

async function szzInstallCachedShellCountIfCurrent(signature){
  try{
    const ready=szzInstallReadOfflineReady();
    const count=Number(ready && ready.shellCount);
    if(
      ready.appBuildVersion!==SZZ_INSTALL_APP_BUILD_VERSION ||
      ready.appShellSignature!==signature ||
      !Number.isFinite(count) ||
      count<=0 ||
      !("caches" in window)
    ){
      return 0;
    }
    const cachedShell=
      await caches.match(new URL("./index.html",document.baseURI).href) ||
      await caches.match(new URL("./sw.js",document.baseURI).href) ||
      await caches.match("./");
    return cachedShell ? count : 0;
  }catch(e){
    return 0;
  }
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
  clearSzzInstallOfflineCountsCache();
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
    clearSzzInstallOfflineCountsCache();
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
  clearSzzInstallOfflineCountsCache();
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
    clearSzzInstallOfflineCountsCache();
  }catch(e){}
};

const SZZ_INSTALL_LOCAL_STORAGE_CACHE_MS=5000;
const szzInstallLocalArrayCache=new Map();
const szzInstallLocalObjectCache=new Map();
let szzInstallLegacyOfflineSiteQueueCache={raw:null,length:-1,savedAt:0,items:[]};
let szzInstallDraftCountCache=null;
let szzInstallDraftCountCacheAt=0;
let szzInstallDraftCountStorageLength=-1;

function szzInstallCloneItems(items=[]){
  return items.map(item=>item && typeof item==="object" ? {...item} : item);
}

function szzInstallCloneOfflineSiteQueueItems(items=[]){
  return items.map(item=>item && typeof item==="object"
    ? {...item,raw:item.raw && typeof item.raw==="object" ? {...item.raw} : item.raw}
    : item);
}

function szzInstallCloneObjectEntries(entries=[]){
  return entries.map(entry=>({
    key:entry.key,
    suffix:entry.suffix,
    item:entry.item && typeof entry.item==="object" ? {...entry.item} : entry.item
  }));
}

function szzInstallLocalArrayEntries(prefix){
  const cleanPrefix=String(prefix || "");
  const now=Date.now();
  const cached=szzInstallLocalArrayCache.get(cleanPrefix);
  if(cached && cached.length===localStorage.length && now-cached.savedAt<SZZ_INSTALL_LOCAL_STORAGE_CACHE_MS){
    return szzInstallCloneItems(cached.items);
  }
  const entries=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key || !key.startsWith(cleanPrefix)) continue;
      const arr=JSON.parse(localStorage.getItem(key) || "[]");
      if(Array.isArray(arr)) entries.push(...arr);
    }
  }catch(e){}
  szzInstallLocalArrayCache.set(cleanPrefix,{savedAt:now,length:localStorage.length,items:szzInstallCloneItems(entries)});
  return entries;
}

function szzInstallLocalObjectEntries(prefix){
  const cleanPrefix=String(prefix || "");
  const now=Date.now();
  const cached=szzInstallLocalObjectCache.get(cleanPrefix);
  if(cached && cached.length===localStorage.length && now-cached.savedAt<SZZ_INSTALL_LOCAL_STORAGE_CACHE_MS){
    return szzInstallCloneObjectEntries(cached.entries);
  }
  const entries=[];
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key || !key.startsWith(cleanPrefix)) continue;
      const item=JSON.parse(localStorage.getItem(key) || "null");
      if(item && typeof item==="object") entries.push({key,suffix:key.slice(cleanPrefix.length),item});
    }
  }catch(e){}
  szzInstallLocalObjectCache.set(cleanPrefix,{savedAt:now,length:localStorage.length,entries:szzInstallCloneObjectEntries(entries)});
  return entries;
}

function szzInstallLegacyOfflineSiteQueueItems(){
  const now=Date.now();
  try{
    const raw=localStorage.getItem("astipMap:offlineSites:v1") || "";
    if(
      szzInstallLegacyOfflineSiteQueueCache.raw===raw &&
      szzInstallLegacyOfflineSiteQueueCache.length===localStorage.length &&
      now-szzInstallLegacyOfflineSiteQueueCache.savedAt<SZZ_INSTALL_LOCAL_STORAGE_CACHE_MS
    ){
      return szzInstallCloneOfflineSiteQueueItems(szzInstallLegacyOfflineSiteQueueCache.items);
    }
    const parsed=JSON.parse(raw || "[]");
    const items=Array.isArray(parsed) ? parsed.filter(item=>item && item.docId && item.raw) : [];
    szzInstallLegacyOfflineSiteQueueCache={
      raw,
      length:localStorage.length,
      savedAt:now,
      items:szzInstallCloneOfflineSiteQueueItems(items)
    };
    return items;
  }catch(e){
    szzInstallLegacyOfflineSiteQueueCache={raw:null,length:-1,savedAt:0,items:[]};
    return [];
  }
}

window.addEventListener("storage",()=>{
  szzInstallLocalArrayCache.clear();
  szzInstallLocalObjectCache.clear();
  szzInstallLegacyOfflineSiteQueueCache={raw:null,length:-1,savedAt:0,items:[]};
  szzInstallDraftCountCache=null;
  clearSzzInstallOfflineCountsCache();
});

function szzInstallLocalProtocolDraftCount(){
  const now=Date.now();
  if(
    szzInstallDraftCountCache!==null
    && szzInstallDraftCountStorageLength===localStorage.length
    && now-szzInstallDraftCountCacheAt<SZZ_INSTALL_LOCAL_STORAGE_CACHE_MS
  ){
    return szzInstallDraftCountCache;
  }
  let drafts=0;
  try{
    szzInstallLocalObjectEntries("astipMap:protocolDraft:").forEach(entry=>{
      if(entry && entry.item && entry.item.payload) drafts++;
    });
  }catch(e){}
  szzInstallDraftCountCache=drafts;
  szzInstallDraftCountCacheAt=now;
  szzInstallDraftCountStorageLength=localStorage.length;
  return drafts;
}

async function szzInstallOfflineCounts(){
  const now=Date.now();
  if(
    szzInstallOfflineCountsCache.counts &&
    now-szzInstallOfflineCountsCache.savedAt<SZZ_INSTALL_OFFLINE_COUNTS_CACHE_MS
  ){
    return cloneSzzInstallOfflineCounts(szzInstallOfflineCountsCache.counts);
  }
  if(szzInstallOfflineCountsCache.promise){
    return szzInstallOfflineCountsCache.promise.then(cloneSzzInstallOfflineCounts);
  }
  const cacheVersion=szzInstallOfflineCountsCacheVersion;
  const promise=(async()=>{
  let localSites=[];
  const indexedSites=await window.readOfflineSiteQueueItems();
  try{
    if(!indexedSites.length){
      localSites=szzInstallLegacyOfflineSiteQueueItems();
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
    drafts=szzInstallLocalProtocolDraftCount();
  }
  return {
    sites:szzInstallUniqueById([...localSites,...indexedSites],"docId").length,
    protocols:szzInstallUniqueById([...localProtocols,...indexedProtocols]).length,
    photos:0,
    drafts
  };
  })().then(counts=>{
    const cleanCounts=cloneSzzInstallOfflineCounts(counts);
    if(cacheVersion===szzInstallOfflineCountsCacheVersion){
      szzInstallOfflineCountsCache={savedAt:Date.now(),counts:cleanCounts,promise:null};
    }
    return cloneSzzInstallOfflineCounts(cleanCounts);
  }).catch(error=>{
    if(cacheVersion===szzInstallOfflineCountsCacheVersion) clearSzzInstallOfflineCountsCache();
    throw error;
  });
  szzInstallOfflineCountsCache={savedAt:now,counts:null,promise};
  return promise;
}

function szzInstallSetTextIfChanged(el,value){
  if(el && el.textContent!==String(value)) el.textContent=String(value);
}
function szzInstallSetDisabledIfChanged(el,value){
  if(el && el.disabled!==!!value) el.disabled=!!value;
}

window.updateSzzOfflineAppStatus=window.updateSzzOfflineAppStatus || async function(){
  const counts=await szzInstallOfflineCounts();
  const setCount=(id,value)=>{
    const el=document.getElementById(id);
    szzInstallSetTextIfChanged(el,String(value || 0));
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
  szzInstallSetTextIfChanged(label,navigator.onLine===false ? "Offline režim" : (pending ? "Čeká na synchronizaci" : "Synchronizováno"));
  szzInstallSetTextIfChanged(text,navigator.onLine===false
    ? "Práce se ukládá do telefonu. Po připojení se odešle do webu."
    : pending ? `V telefonu čeká ${pending} změn k odeslání.` : "Všechny uložené změny jsou spárované s webem.");
  if(meta && !meta.textContent) szzInstallSetTextIfChanged(meta,"Offline fronta připravena v telefonu.");
  if(syncBtn){
    const disabled=navigator.onLine===false || !pending || typeof window.syncOfflineChanges!=="function";
    if(syncBtn.disabled!==disabled) syncBtn.disabled=disabled;
  }
  return counts;
};

window.scheduleSzzOfflineAppStatus=window.scheduleSzzOfflineAppStatus || function(delay=120){
  clearTimeout(window.__szzInstallStatusTimer);
  window.__szzInstallStatusTimer=setTimeout(()=>window.updateSzzOfflineAppStatus?.().catch(()=>{}),delay);
};

window.cacheAppShellForOffline=window.cacheAppShellForOffline || async function(options={}){
  if(!("serviceWorker" in navigator)) return 0;
  try{
    const registration=window.registerSzzServiceWorker
      ? await window.registerSzzServiceWorker()
      : await navigator.serviceWorker.register("./sw.js");
    await navigator.serviceWorker.ready;
    const urls=szzInstallCurrentShellUrls();
    const signature=urls.join("\n");
    const reusable=options.force===true ? 0 : await szzInstallCachedShellCountIfCurrent(signature);
    if(reusable) return reusable;
    const count=await szzInstallCachedPostShellUrlsToServiceWorker(registration,urls);
    szzInstallWriteOfflineReady({
      appBuildVersion:SZZ_INSTALL_APP_BUILD_VERSION,
      appShellSignature:signature,
      shellCachedAt:new Date().toISOString(),
      shellCount:count
    });
    return count;
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
    const raw=localStorage.getItem(SZZ_INSTALL_SITE_CACHE_KEY) || "";
    if(szzInstallSiteCountCache.raw===raw && Date.now()-szzInstallSiteCountCache.savedAt<SZZ_INSTALL_SITE_COUNT_CACHE_MS){
      return szzInstallSiteCountCache.count;
    }
    const parsed=JSON.parse(raw || "null");
    const count=Number(parsed && parsed.count);
    if(Number.isFinite(count) && count>0){
      szzInstallSiteCountCache={raw,count,savedAt:Date.now()};
      return count;
    }
    const items=Array.isArray(parsed && parsed.items) ? parsed.items : [];
    const fallbackCount=items.filter(item=>item && item.docId && item.raw).length;
    szzInstallSiteCountCache={raw,count:fallbackCount,savedAt:Date.now()};
    return fallbackCount;
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

window.prepareSzzOfflineAppData=window.prepareSzzOfflineAppData || async function(options={}){
  const silent=options.silent===true;
  if(!silent && window.openAppToolsPanel) window.openAppToolsPanel();
  const button=document.getElementById("prepareOfflineAppBtn");
  const text=document.getElementById("appSyncText");
  if(button){
    szzInstallSetDisabledIfChanged(button,true);
    szzInstallSetTextIfChanged(button,"Připravuji offline...");
  }
  szzInstallSetTextIfChanged(text,"Ukládám aplikaci a servisní data do telefonu.");
  try{
    const storage=await window.requestSzzPersistentStorage({request:true});
    if(window.registerSzzServiceWorker) await window.registerSzzServiceWorker();
    const shellCount=await window.cacheAppShellForOffline();
    const cachedRowsBefore=szzInstallCachedRowsCount();
    if(navigator.onLine!==false && !cachedRowsBefore && options.forceFull===true && typeof window.loadFirebaseSitesUnified==="function"){
      try{ await window.loadFirebaseSitesUnified(null,{force:true,skipLocalCache:true}); }catch(e){}
    }
    const cachedRows=szzInstallCacheCurrentRows();
    const ready={
      appBuildVersion:SZZ_INSTALL_APP_BUILD_VERSION,
      preparedAt:new Date().toISOString(),
      rowsSyncedAtMs:navigator.onLine!==false ? Date.now() : 0,
      persistentStorage:!!storage.persisted,
      persistentStorageSupported:!!storage.supported,
      shellCount,
      cachedRows
    };
    szzInstallWriteOfflineReady(ready);
    szzInstallSetTextIfChanged(text,cachedRows ? `Offline připraveno: ${cachedRows} bodů v telefonu.` : "Aplikace je připravená pro offline otevření.");
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
    if(!silent && window.showSaveConfirmation) window.showSaveConfirmation("Offline data připravena.");
    return ready;
  }finally{
    if(button){
      szzInstallSetDisabledIfChanged(button,false);
      szzInstallSetTextIfChanged(button,"Připravit offline data");
    }
  }
};
