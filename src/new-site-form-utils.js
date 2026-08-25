export const WARRANTY_SELECT_OPTIONS=[
  ["","Vyber záruku"],
  ["záruka 2 roky","záruka 2 roky"],
  ["záruka 5 let","záruka 5 let"],
  ["záruka zrušena","záruka zrušena"]
];

const NEW_SITE_FIELD_SPECS=[
  {label:"Název",key:"Název"},
  {label:"Adresa / umístění",key:"Adresa / umístění"},
  {label:"Adresa GPS",key:"Adresa_GPS",full:true},
  {label:"Popis_zdroje",forceLabel:"Popis zdroje",key:"Popis_zdroje",full:true},
  {label:"Výrobní číslo",key:"Zdroj",full:true},
  {label:"Kontakt",key:"Kontakt"},
  {label:"Kraj",key:"Kraj"},
  {label:"Rok výroby",key:"Rok výroby"},
  {label:"Serviska",key:"Serviska",type:"select",options:[["",""],["ano","ano"],["ne","ne"]]},
  {label:"Smlouva",key:"Smlouva ano/ne",type:"select",options:[["ne","ne"],["ano","ano"]],value:"ne"},
  {label:"Záruka",key:"Záruka",type:"select",options:WARRANTY_SELECT_OPTIONS},
  {label:"Perioda kontrol",key:"Perioda kontrol",type:"select",options:[["6","6 měsíců"],["12","12 měsíců"]],value:"12"},
  {label:"Hlídáme kontroly sami",key:"Hlídáme kontroly sami",type:"select",options:[["ne","ne"],["ano","ano"]],value:"ne",full:true,special:"watch-self"},
  {label:"Důležité poznámky",key:"Důležitá poznámka",type:"textarea",full:true,className:"notes-red-row",style:"padding:10px;border-radius:12px;"}
];

export function createNewSiteFormFieldHelpers({
  applyWatchSelfAliases=()=>{},
  geocodeAddressFast=()=>Promise.resolve(null),
  geocodeAddressGeneric=()=>Promise.resolve(null),
  inferRegionFromAddressText=()=>"",
  newSiteFieldNorm=value=>String(value || "").trim().toLowerCase(),
  safe=value=>String(value == null ? "" : value).trim(),
  setInputValueIfExists=()=>{},
  setRegionFieldValue=()=>{}
}={}){
  let newSiteFieldElementMap=null;

  function createNewSiteFieldControl(spec){
    if(spec.type==="textarea"){
      return document.createElement("textarea");
    }
    if(spec.type==="select"){
      const select=document.createElement("select");
      (spec.options || []).forEach(([value,label])=>{
        const option=document.createElement("option");
        option.value=value;
        option.textContent=label;
        select.appendChild(option);
      });
      if(spec.value!==undefined) select.value=spec.value;
      return select;
    }
    return document.createElement("input");
  }

  function createNewSiteField(spec,options={}){
    const field=document.createElement("div");
    if(spec.full) field.classList.add("full");
    if(spec.className) field.classList.add(...spec.className.split(/\s+/).filter(Boolean));
    if(spec.style) field.setAttribute("style",spec.style);
    const label=document.createElement("label");
    label.textContent=options.forceLabels && spec.forceLabel ? spec.forceLabel : spec.label;
    const control=createNewSiteFieldControl(spec);
    control.dataset.newKey=spec.key;
    if(spec.special) control.dataset.special=spec.special;
    if(spec.key==="Adresa_GPS"){
      const line=document.createElement("div");
      line.className="new-gps-address-line";
      const button=document.createElement("button");
      button.className="secondary";
      button.id="newAllGpsCalcInline";
      button.type="button";
      button.textContent="Dopočítat GPS";
      line.append(control,button);
      field.append(label,line);
      return field;
    }
    field.append(label,control);
    return field;
  }

  function invalidateNewSiteFieldElementMap(){
    newSiteFieldElementMap=null;
  }

  function newSiteFieldElementsByKey(){
    const box=document.getElementById("newAllFieldsBox");
    if(newSiteFieldElementMap && box){
      let current=true;
      newSiteFieldElementMap.forEach(elements=>{
        (elements || []).forEach(el=>{
          if(!box.contains(el)) current=false;
        });
      });
      if(current) return newSiteFieldElementMap;
    }
    const map=new Map();
    if(!box){
      newSiteFieldElementMap=map;
      return map;
    }
    box.querySelectorAll("[data-new-key]").forEach(el=>{
      const key=el.dataset.newKey;
      if(!key) return;
      if(!map.has(key)) map.set(key,[]);
      map.get(key).push(el);
    });
    newSiteFieldElementMap=map;
    return map;
  }

  function newSiteFieldValue(key){
    const elements=newSiteFieldElementsByKey().get(key) || [];
    for(const el of elements){
      const value=safe(el && el.value);
      if(value) return value;
    }
    return "";
  }

  function setNewSiteFieldValue(key,value,options={}){
    const next=String(value || "");
    (newSiteFieldElementsByKey().get(key) || []).forEach(el=>{
      if(options.force || !safe(el.value) || el.dataset.autoFilled==="1"){
        if(el.value!==next) el.value=next;
        if(options.auto) el.dataset.autoFilled="1";
      }
    });
  }

  function setNewSiteRegionValue(region,options={}){
    const clean=safe(region);
    if(!clean) return;
    (newSiteFieldElementsByKey().get("Kraj") || []).forEach(el=>{
      if(options.force || !safe(el.value) || el.dataset.autoRegion==="1"){
        el.value=clean;
        el.dataset.autoRegion="1";
      }
    });
    setRegionFieldValue("#newRegion",clean,options);
  }

  function syncNewSiteRegionFromText(options={}){
    const text=newSiteFieldValue("Adresa_GPS")
      || newSiteFieldValue("Adresa / umístění")
      || newSiteFieldValue("Název")
      || safe(document.getElementById("newGpsAddress")?.value)
      || safe(document.getElementById("newName")?.value);
    if(!text) return "";
    const region=inferRegionFromAddressText(text);
    if(region) setNewSiteRegionValue(region,options);
    return region;
  }

  async function calcNewSiteGpsFromAddress(){
    const st=document.getElementById("newSiteStatus");
    const btn=document.getElementById("newAllGpsCalcInline");
    const address=newSiteFieldValue("Adresa_GPS")
      || newSiteFieldValue("Adresa / umístění")
      || newSiteFieldValue("Název")
      || safe(document.getElementById("newGpsAddress")?.value)
      || safe(document.getElementById("newName")?.value);
    if(!address){
      if(st) st.textContent="Vyplň adresu GPS nebo adresu / umístění.";
      return;
    }
    try{
      if(btn) btn.disabled=true;
      if(st) st.textContent="Dopočítávám GPS...";
      let found=await geocodeAddressFast(address);
      if(!found) found=await geocodeAddressGeneric(address);
      if(!found){
        const region=inferRegionFromAddressText(address);
        if(region) setNewSiteRegionValue(region,{force:true});
        if(st) st.textContent=window.lastGeocodeMessage || (region ? "GPS se nepodařilo dopočítat, kraj jsem doplnil podle textu adresy." : "Adresa nebyla nalezena.");
        return;
      }
      const lat=Number(found.lat);
      const lon=Number(found.lon);
      if(!Number.isFinite(lat) || !Number.isFinite(lon)){
        if(st) st.textContent="Adresa byla nalezena, ale GPS souřadnice nejsou platné.";
        return;
      }
      const display=found.display || address;
      setInputValueIfExists("#newGpsAddress",display);
      setInputValueIfExists("#newGpsLat",String(lat));
      setInputValueIfExists("#newGpsLon",String(lon));
      setNewSiteFieldValue("Adresa_GPS",display,{force:true,auto:true});
      const region=inferRegionFromAddressText(display,found.address || {});
      if(region) setNewSiteRegionValue(region,{force:true});
      if(st) st.textContent=region ? "GPS doplněno, kraj doplněn." : "GPS doplněno.";
    }catch(e){
      if(st) st.textContent="Chyba dopočtu GPS: "+e.message;
    }finally{
      if(btn) btn.disabled=false;
    }
  }

  function bindNewSiteDynamicControls(){
    const gpsBtn=document.getElementById("newAllGpsCalcInline");
    if(gpsBtn && !gpsBtn.__szzGpsBound){
      gpsBtn.__szzGpsBound=true;
      gpsBtn.onclick=calcNewSiteGpsFromAddress;
    }
    ["Název","Adresa / umístění","Adresa_GPS"].forEach(key=>{
      (newSiteFieldElementsByKey().get(key) || []).forEach(el=>{
        if(el.__szzRegionBound) return;
        el.__szzRegionBound=true;
        el.addEventListener("input",()=>syncNewSiteRegionFromText());
        el.addEventListener("change",()=>syncNewSiteRegionFromText({force:true}));
      });
    });
  }

  function renderNewSiteFields(options={}){
    const box=document.getElementById("newAllFieldsBox");
    if(!box) return;
    const fragment=document.createDocumentFragment();
    NEW_SITE_FIELD_SPECS.forEach(spec=>fragment.appendChild(createNewSiteField(spec,options)));
    if(options.wrapGrid){
      const grid=document.createElement("div");
      grid.className="new-data-grid";
      grid.appendChild(fragment);
      box.replaceChildren(grid);
      invalidateNewSiteFieldElementMap();
      bindNewSiteDynamicControls();
      return;
    }
    box.replaceChildren(fragment);
    invalidateNewSiteFieldElementMap();
    bindNewSiteDynamicControls();
  }

  function forceRenderNewSiteForm(){
    renderNewSiteFields({wrapGrid:true,forceLabels:true});
  }

  function renderNewSiteAllFields(){
    renderNewSiteFields();
  }

  function collectNewSiteAllFields(){
    const raw={};
    newSiteFieldElementsByKey().forEach(elements=>{
      (elements || []).forEach(el=>{
        const key=el.dataset.newKey;
        const val=String(el.value||"").trim();
        if(!key || !val) return;
        raw[key]=val;

        const n=newSiteFieldNorm(key);
        if(n==="perioda kontrol"){
          raw["Perioda kontrol"]=val;
        }
      });
    });
    applyWatchSelfAliases(raw, raw["Hlídáme sami termín"] || raw["Hlídáme kontroly sami"] || "ne");
    return raw;
  }

  function clearNewSiteAllFields(){
    newSiteFieldElementsByKey().forEach(elements=>{
      (elements || []).forEach(el=>{
        if(el.value!=="") el.value="";
      });
    });
  }

  return {
    calcNewSiteGpsFromAddress,
    clearNewSiteAllFields,
    collectNewSiteAllFields,
    forceRenderNewSiteForm,
    newSiteFieldElementsByKey,
    newSiteFieldValue,
    renderNewSiteAllFields,
    renderNewSiteFields,
    setNewSiteFieldValue,
    setNewSiteRegionValue,
    syncNewSiteRegionFromText
  };
}
