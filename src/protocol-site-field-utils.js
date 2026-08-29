export function createProtocolSiteFieldHelpers({
  dataNormFixed,
  formFieldNode,
  getRawValue,
  getSelectedSite,
  safeValue,
  updateProtocolSummary
}){
  const safe=safeValue;
  const get=getRawValue;

  function splitPossibleSources(text){
    const s=safe(text);
    if(!s) return [];
    return s
      .split(/\s*(?:\+|\||;|\n|\r| \/ |, (?=(?:UPS|zdroj|FZ|PBZ|typ|[A-Z0-9]{3,})))\s*/i)
      .map(x=>x.trim())
      .filter(Boolean);
  }

  function sourceOptionsFromSite(site){
    const raw=site?.raw || {};
    const candidates=[
      protocolDeviceTypeFromSite(site),
      get(raw,"Popis_zdroje"),
      get(raw,"Kontrolované zařízení"),
      get(raw,"Jaký zdroj"),
      get(raw,"Typ zařízení"),
      get(raw,"Typ"),
      get(raw,"Serviska")
    ].filter(Boolean);

    let out=[];
    candidates.forEach(c=>{
      const parts=splitPossibleSources(c);
      if(parts.length) out.push(...parts);
      else out.push(String(c).trim());
    });

    const seen=new Set();
    return out.filter(x=>{
      const k=x.toLowerCase();
      if(!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  function populateProtocolDeviceSelect(){
    const oldWrap=formFieldNode("protocolDeviceSelectWrap");
    if(oldWrap) oldWrap.style.display="none";
    const inputWrap=formFieldNode("protoDeviceInputWrap");
    const selectWrap=formFieldNode("protoDeviceSelectWrap2");
    const input=formFieldNode("protoDeviceType");
    if(inputWrap) inputWrap.classList.remove("hidden");
    if(selectWrap) selectWrap.classList.add("hidden");
    const selectedSite=getSelectedSite();
    if(!selectedSite || !input) return;
    input.value=protocolDeviceTypeFromSite(selectedSite) || "";
    updateProtocolSummary();
  }

  function resetProtocolTechnicalFieldsForNewDevice(){
    [
      "protoDeviceType","protoSerial","protoSeal","protoSeal2",
      "protoBatteryCount","protoCapacity","protoSetCount","protoAuxBatteryAh",
      "protoInputVac","protoOutput1Vac","protoOutput2Vac","protoBackup1Vac","protoBackup2Vac",
      "protoMainBatVdc","protoResetDiag","protoAuxBatVdc","protoUnbalance1","protoUnbalance2"
    ].forEach(id=>{
      const el=formFieldNode(id);
      if(el) el.value="";
    });

    updateProtocolSummary();
  }

  function pickRawValue(raw, names){
    for(const n of names){
      const v=safe(get(raw,n));
      if(v) return v;
    }
    return "";
  }

  function setIfEmpty(id,value){
    const el=formFieldNode(id);
    if(!el) return;
    if(!safe(el.value) && safe(value)) el.value=value;
  }

  function setCheckbox(id,value){
    const el=formFieldNode(id);
    if(!el) return;
    el.checked = value === true || String(value).toLowerCase()==="true" || String(value).toLowerCase()==="ano";
  }

  function protocolDeviceTypeFromSite(site){
    const raw=site?.raw || {};
    const explicit=pickRawValue(raw,[
      "Popis_zdroje","Jaký zdroj","Kontrolované zařízení","Kontrolované zařízení – typ",
      "Kontrolovane zarizeni","Typ zařízení","Typ zarizeni","Typ","Serviska"
    ]);
    if(explicit) return explicit;

    const source=safe(site?.zdroj);
    const serial=protocolSerialFromSite(site);
    if(source && dataNormFixed(source)!==dataNormFixed(serial)) return source;
    return "";
  }

  function protocolSerialFromSite(site){
    const raw=site?.raw || {};
    return pickRawValue(raw,[
      "Výrobní č.","Výrobní číslo","Výrobní_číslo","Vyrobni cislo",
      "Sériové číslo","Seriové číslo","Serial","SN","Zdroj"
    ]);
  }

  function protocolSourceLocationFromSite(site){
    const raw=site?.raw || {};
    return pickRawValue(raw,[
      "Umístění zdroje","Umístění_zdroje","Umístění","Umisteni",
      "Adresa_GPS","Adresa / umístění"
    ]);
  }

  return {
    pickRawValue,
    populateProtocolDeviceSelect,
    protocolDeviceTypeFromSite,
    protocolSerialFromSite,
    protocolSourceLocationFromSite,
    resetProtocolTechnicalFieldsForNewDevice,
    setCheckbox,
    setIfEmpty,
    sourceOptionsFromSite,
    splitPossibleSources
  };
}
