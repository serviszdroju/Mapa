export function createRowNormalizeHelpers({
  applyEditToRow=row=>row,
  canonicalRegionValue=value=>value,
  explicitWatchSelfFromRaw=()=>null,
  first=()=>"",
  get=()=>"",
  inferControlPeriodMonthsFromDateValues=()=>0,
  inferRegionFromAddressText=()=>"",
  lastCheckKeys=[],
  nextCheckKeys=[],
  num=()=>null,
  orderedFlagFromRaw=()=>false,
  repairOrderFlagFromRaw=()=>false,
  siteId=(raw,i)=>String(i),
  stopFlagFromRaw=()=>false
}={}){
  function normalize(data=[]){
    return data.map((raw,i)=>{
      const lat=num(get(raw,"GPS_lat")), lon=num(get(raw,"GPS_lon"));
      const adresa=first(raw,["Název","Adresa / umístění","Adresa_GPS","Umístění","Umístění zdroje","Původní adresa / umístění"]);
      const zdroj=first(raw,["Popis_zdroje","Zdroj","Jaký zdroj"]);
      const kontakt=first(raw,["Kontakt_mapy","Kontakt","Hlavní kontakt"]);
      const rawLast=first(raw,lastCheckKeys);
      const rawNext=first(raw,nextCheckKeys);
      const inferredPeriod=inferControlPeriodMonthsFromDateValues(rawLast,rawNext);
      if(inferredPeriod) raw["Perioda kontrol"]=String(inferredPeriod);
      const rawRegion=first(raw,["Kraj","Region","Kraj / oblast"]);
      const region=canonicalRegionValue(rawRegion) || inferRegionFromAddressText([
        rawRegion,
        adresa,
        first(raw,["Adresa / umístění","Adresa_GPS","Umístění","Umístění zdroje","Původní adresa / umístění"])
      ].filter(Boolean).join(" "));
      const explicitWatchSelf=explicitWatchSelfFromRaw(raw);
      const r={
        id:siteId(raw,i), i, raw, lat, lon,
        gpsAddress:first(raw,["Adresa_GPS","Adresa / umístění","Umístění"]),
        adresa, zdroj, kontakt,
        kraj:region || rawRegion,
        poznamky:first(raw,["Poznámky_mapy","Poznámky","DŮLEŽITÁ POZNÁMKA"]),
        pristi:first(raw,["Příští_kontrola","Příští plánovaná kontrola","Příští kontrola"]),
        posledni:first(raw,["Poslední_kontrola","Poslední proběhlá kontrola","Poslední kontrola"]),
        dni:first(raw,["Dní do kontroly","Dní_do_kontroly"]),
        stav:first(raw,["Stav_kontroly","Stav pro mapu"]),
        barva:first(raw,["Barva bodu","Barva_bodu"]),
        ordered:orderedFlagFromRaw(raw),
        repairOrdered:repairOrderFlagFromRaw(raw),
        stopped:stopFlagFromRaw(raw),
        noOrder:explicitWatchSelf === null ? null : explicitWatchSelf === true
      };
      return applyEditToRow(r);
    });
  }

  return {
    normalize
  };
}
