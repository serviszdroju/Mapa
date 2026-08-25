const IMPORTANT_NOTE_ALIASES=["Důležitá poznámka","DŮLEŽITÁ POZNÁMKA","Důležité poznámky","dulezita poznamka"];

export function createRowEditApplyHelpers({
  applyWatchSelfAliases=()=>{},
  canonicalRegionValue=value=>value,
  editCacheEntryForRow=()=>null,
  explicitWatchSelfFromRaw=()=>null,
  inferRegionFromAddressText=()=>"",
  isFirebaseUnifiedRow=()=>false,
  isNoOrderSite=()=>false,
  num=value=>{
    const n=parseFloat(String(value ?? "").replace(",","."));
    return Number.isFinite(n) ? n : null;
  },
  orderedFlagFromRaw=()=>false,
  repairOrderFlagFromRaw=()=>false,
  restoreFirebaseMapStatusRawValues=()=>{},
  stopFlagFromRaw=()=>false
}={}){
  function applyEditToRow(r){
    const e=editCacheEntryForRow(r);
    if(!e) return r;

    const rawEdits=e.rawEdits || {};
    const firebaseStatusFromPrimaryRaw=isFirebaseUnifiedRow(r);
    const hasRawEdit=key=>Object.prototype.hasOwnProperty.call(rawEdits,key);
    const editedImportantNoteKey=IMPORTANT_NOTE_ALIASES.find(hasRawEdit);
    const lat=num(e.gpsLat) ?? num((e.rawEdits || {})["GPS_lat"]);
    const lon=num(e.gpsLon) ?? num((e.rawEdits || {})["GPS_lon"]);
    const updatedRaw={...r.raw,...rawEdits};
    if(firebaseStatusFromPrimaryRaw) restoreFirebaseMapStatusRawValues(updatedRaw,r.raw || {});
    const rawWatch=explicitWatchSelfFromRaw(rawEdits);
    if(rawWatch !== null) applyWatchSelfAliases(updatedRaw,rawWatch ? "ano" : "ne");

    if(e.name) updatedRaw["Upravený název"]=e.name;
    if(e.contact) updatedRaw["Upravený kontakt"]=e.contact;
    if(e.source) updatedRaw["Upravený zdroj"]=e.source;
    if(hasRawEdit("Poznámky")) updatedRaw["Upravené poznámky"]=rawEdits["Poznámky"];
    else if(e.notes) updatedRaw["Upravené poznámky"]=e.notes;
    if(e.gpsAddress) updatedRaw["Upravená Adresa_GPS"]=e.gpsAddress;
    if(e.lastCheck) updatedRaw["Upravená poslední kontrola"]=e.lastCheck;
    if(e.nextCheck) updatedRaw["Upravená další kontrola"]=e.nextCheck;
    if(!firebaseStatusFromPrimaryRaw && e.ordered !== undefined) updatedRaw["Kontrola objednaná"]=e.ordered ? "ANO" : "NE";
    if(!firebaseStatusFromPrimaryRaw && e.repairOrdered !== undefined) updatedRaw["Objednaná oprava"]=e.repairOrdered ? "ANO" : "NE";
    if(!firebaseStatusFromPrimaryRaw && e.stopped !== undefined) updatedRaw["Stop Stav"]=e.stopped ? "ANO" : "NE";
    if(Number.isFinite(lat)) updatedRaw["Upravené GPS_lat"]=String(lat);
    if(Number.isFinite(lon)) updatedRaw["Upravené GPS_lon"]=String(lon);
    const regionValue=canonicalRegionValue(rawEdits["Kraj"] || r.kraj) || inferRegionFromAddressText([
      rawEdits["Kraj"],
      updatedRaw["Kraj"],
      updatedRaw["Název"],
      updatedRaw["Adresa / umístění"],
      updatedRaw["Adresa_GPS"],
      updatedRaw["Umístění zdroje"],
      r.adresa
    ].filter(Boolean).join(" "));

    const editedNotes=hasRawEdit("Poznámky")
      ? rawEdits["Poznámky"]
      : editedImportantNoteKey
        ? rawEdits[editedImportantNoteKey]
        : e.notes || r.poznamky;

    return {...r,
      raw:updatedRaw,
      adresa:e.name || rawEdits["Název"] || rawEdits["Adresa / umístění"] || rawEdits["Umístění zdroje"] || r.adresa,
      kontakt:e.contact || rawEdits["Kontakt"] || r.kontakt,
      zdroj:e.source || rawEdits["Popis_zdroje"] || r.zdroj,
      poznamky:editedNotes,
      kraj:regionValue || rawEdits["Kraj"] || r.kraj,
      posledni:e.lastCheck || r.posledni,
      pristi:e.nextCheck || r.pristi,
      lat:Number.isFinite(lat) ? lat : r.lat,
      lon:Number.isFinite(lon) ? lon : r.lon,
      gpsAddress:e.gpsAddress || r.gpsAddress,
      ordered:!firebaseStatusFromPrimaryRaw && e.ordered !== undefined ? e.ordered === true : orderedFlagFromRaw(updatedRaw),
      repairOrdered:!firebaseStatusFromPrimaryRaw && e.repairOrdered !== undefined ? e.repairOrdered === true : repairOrderFlagFromRaw(updatedRaw),
      stopped:!firebaseStatusFromPrimaryRaw && e.stopped !== undefined ? e.stopped === true : stopFlagFromRaw(updatedRaw),
      noOrder:rawWatch !== null ? rawWatch === true : (e.noOrder === true ? true : e.noOrder === false ? false : isNoOrderSite({...r,raw:updatedRaw})),
      edit:e
    };
  }

  return {
    applyEditToRow
  };
}
