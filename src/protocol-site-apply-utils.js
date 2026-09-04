export function createProtocolSiteApplyHelpers({
  addMonths,
  applyStopStatusRawPatch,
  dateInputValueFromAny,
  detailKey,
  detectControlPeriod,
  getSelectedSite,
  historyObjectSummary,
  historyTimeValue,
  isoDateFromAny,
  normalize,
  parseDateValue,
  periodMonths,
  protocolDisplayDate,
  protocolSavedTimeValue,
  protocolSourceStateValue,
  safe,
  setSelectedSite
}){
  function protocolDateIso(item){
    return isoDateFromAny(item?.date || item?.checkDate || item?.createdAt || "");
  }

  function protocolTimeValue(item){
    const saved=protocolSavedTimeValue(item);
    if(saved) return saved;
    const iso=protocolDateIso(item);
    const d=parseDateValue(iso);
    if(d) return d.getTime();
    return historyTimeValue(item);
  }

  function latestProtocolDateFromSiteData(data){
    const protocols=Array.isArray(data?.protocolHistory) ? data.protocolHistory : [];
    let latestItem=null;
    let latestTime=-Infinity;
    for(const item of protocols){
      const time=protocolTimeValue(item);
      if(!Number.isFinite(time) || time<=0) continue;
      if(!latestItem || time>latestTime){
        latestItem=item;
        latestTime=time;
      }
    }
    return latestItem ? protocolDateIso(latestItem) : isoDateFromAny(data?.latestProtocolDate || "");
  }

  function applyLatestProtocolDateToRaw(raw,data){
    const out={...(raw || {})};
    const latest=latestProtocolDateFromSiteData(data);
    if(!latest) return out;
    const months=Number(detectControlPeriod(out)) || periodMonths({raw:out});
    out["Perioda kontrol"]=String(months);
    out["Poslední_kontrola"]=latest;
    const last=parseDateValue(latest);
    if(last){
      out["Příští_kontrola"]=dateInputValueFromAny(addMonths(last, months));
    }
    return out;
  }

  function applyLatestProtocolToSite(protocol,site=getSelectedSite()){
    if(!protocol || !site) return;
    const raw=applyLatestProtocolDateToRaw(site.raw || {},{protocolHistory:[protocol]});
    applyProtocolFieldsToRaw(raw,protocol);
    site.raw=raw;
    const refreshed=normalize([raw])[0];
    Object.assign(site, refreshed, {
      id:site.id,
      i:site.i,
      firebaseDocId:site.firebaseDocId || raw["Firebase_doc_id"] || "",
      firebaseData:site.firebaseData || {}
    });
    const selectedSite=getSelectedSite();
    if(selectedSite && detailKey(selectedSite)===detailKey(site)) setSelectedSite(site);
  }

  function protocolRepairHistoryEntry(protocol={}){
    const note=safe(protocol.notes).replace(/\s+/g," ").trim();
    if(!note) return "";
    const date=protocolDisplayDate(protocol.savedAt || protocol.updatedAt || protocol.createdAt || protocol.date || new Date().toISOString());
    return `${date ? `${date} - ` : ""}${note}`;
  }

  function appendProtocolNoteToRepairHistory(raw={},protocol={}){
    const entry=protocolRepairHistoryEntry(protocol);
    if(!entry) return raw;
    const current=safe(raw["Historie oprav"] || raw["Historie_oprav"] || "");
    const lines=current.split(/\r?\n/).map(line=>safe(line)).filter(Boolean);
    if(lines.some(line=>line===entry)) return raw;
    const history=[entry,...lines].join("\n");
    raw["Historie oprav"]=history;
    raw["Historie_oprav"]=history;
    return raw;
  }

  function applyRawValueAliases(raw,keys,value){
    const text=safe(value);
    if(!text) return raw;
    keys.forEach(key=>{ raw[key]=text; });
    return raw;
  }

  function applyProtocolFieldsToRaw(raw,protocol={}){
    const out=raw || {};
    const device=safe(protocol.deviceType || protocol.selectedDevice);
    const serial=safe(protocol.serial);
    const location=safe(protocol.pbzLocation);
    const breakers=safe(protocol.breakersLocation);
    const testProcedure=safe(protocol.testProcedure);
    const contacts=safe(protocol.contacts);
    const backedSummary=historyObjectSummary(protocol.backedDevices);
    const accessSummary=historyObjectSummary(protocol.access);
    const availabilitySummary=historyObjectSummary(protocol.availability);
    const state=protocolSourceStateValue(protocol);
    if(device){
      out["Popis_zdroje"]=device;
      out["Kontrolované zařízení"]=device;
      out["Typ zařízení"]=device;
    }
    if(serial){
      out["Zdroj"]=serial;
      out["Výrobní číslo"]=serial;
      out["Výrobní_číslo"]=serial;
    }
    if(location){
      out["Umístění zdroje"]=location;
      out["Umístění"]=location;
      out["Umístění PBZ v objektu"]=location;
    }
    applyRawValueAliases(out,["Počet baterií","Počet baterií (ks)","Pocet baterii","Baterie ks"],protocol.batteryCount);
    applyRawValueAliases(out,["Kapacita","Kapacita (Ah)","Kapacita Ah","Ah"],protocol.capacityAh);
    applyRawValueAliases(out,["Počet sad","Počet sad (ks)","Pocet sad","Sady ks"],protocol.setCount);
    applyRawValueAliases(out,["Pom. Bat","Pom. Bat (Ah)","Pomocná baterie","Pom baterie"],protocol.auxBatteryAh);
    if(breakers){
      out["Jistič UPS"]=breakers;
      out["Jističe UPS"]=breakers;
      out["Umístění jističů"]=breakers;
    }
    if(testProcedure){
      out["Postup testování"]=testProcedure;
      out["Postup testovani"]=testProcedure;
    }
    if(contacts){
      [
        "Kontakt",
        "Kontakt_mapy",
        "Hlavní kontakt",
        "Upravený kontakt",
        "Kontakty",
        "Telefon",
        "Telefon kontakt",
        "Mobil",
        "Kontakt osoba",
        "Kontakt na místě"
      ].forEach(key=>{ out[key]=contacts; });
    }
    if(backedSummary){
      out["Typ a umístění zálohovaných zařízení"]=backedSummary;
      out["Zálohovaná zařízení"]=backedSummary;
    }
    if(safe(protocol.controlLocation)){
      out["Umístění zálohovaných zařízení"]=safe(protocol.controlLocation);
      out["Umístění ovládání"]=safe(protocol.controlLocation);
      out["Ovládání zálohovaných zařízení"]=safe(protocol.controlLocation);
    }
    if(accessSummary){
      out["Parkování a vstup do objektu, předepsané OOPP"]=accessSummary;
      out["Parkování a vstup"]=accessSummary;
      out["OOPP"]=accessSummary;
    }
    if(availabilitySummary){
      out["Dostupnost"]=availabilitySummary;
    }
    if(state==="stop"){
      applyStopStatusRawPatch(out,true,out);
    }else if(state==="ok"){
      applyStopStatusRawPatch(out,false,out);
    }
    appendProtocolNoteToRepairHistory(out,protocol);
    return out;
  }

  function applyProtocolFieldsToSite(protocol,site=getSelectedSite()){
    if(!protocol || !site) return;
    const raw=applyProtocolFieldsToRaw({...(site.raw || {})},protocol);
    site.raw=raw;
    const refreshed=normalize([raw])[0];
    Object.assign(site, refreshed, {
      id:site.id,
      i:site.i,
      firebaseDocId:site.firebaseDocId || raw["Firebase_doc_id"] || "",
      firebaseData:{...(site.firebaseData || {}), raw}
    });
    const selectedSite=getSelectedSite();
    if(selectedSite && detailKey(selectedSite)===detailKey(site)) setSelectedSite(site);
  }

  return {
    applyLatestProtocolDateToRaw,
    applyLatestProtocolToSite,
    applyProtocolFieldsToRaw,
    applyProtocolFieldsToSite,
    latestProtocolDateFromSiteData,
    protocolDateIso,
    protocolTimeValue
  };
}
