export function createLegacyExtraSiteHelpers({
  applyEditToRow,
  applyWatchSelfAliases,
  daysBetweenToday,
  filterControlsReady,
  getCsvRows,
  getDb,
  getDeletedSiteIds,
  getFirestoreModule,
  getNewSiteStatusNode,
  getRegionOptions,
  isFirebaseReady,
  isFirebaseUnifiedPrimary,
  normalize,
  render,
  setExtraSites,
  setRows
}){
  function newSiteToRow(docId, d){
    const days = d.nextCheck ? daysBetweenToday(d.nextCheck) : "";
    const raw = {
      "Název": d.name || "",
      "Adresa_GPS": d.gpsAddress || "",
      "Kraj": d.region || "",
      "Popis_zdroje": d.source || "",
      "Kontakt_mapy": d.contact || "",
      "Poznámky_mapy": d.notes || "",
      "Další informace": d.extra || "",
      "Vlastní data": d.allData || "",
      "Příští_kontrola": d.nextCheck || "",
      "Poslední_kontrola": d.lastCheck || "",
      "Dní_do_kontroly": days,
      "Kontrola objednaná": d.ordered ? "ANO" : "NE",
      "Objednaná oprava": d.repairOrdered ? "ANO" : "NE",
      "Hlídáme termín sami": d.noOrder ? "ANO" : "NE",
      "Stav_kontroly": d.repairOrdered ? "Objednaná oprava" : (d.ordered ? "Kontrola objednaná" : (days === "" ? "OK / ostatní" : (days < 0 ? "Propadlá kontrola" : (days <= 30 ? "1–30 dní k termínu" : "OK / ostatní")))),
      "GPS_lat": d.gpsLat || "",
      "GPS_lon": d.gpsLon || "",
      "Zdroj_dat": "Firebase nové místo",
      "Firebase_doc_id": docId
    };
    applyWatchSelfAliases(raw, d.noOrder ? "ano" : raw["Hlídáme termín sami"] || "ne");
    const r = normalize([raw])[0];
    r.id = "firebase_site_" + docId;
    r.isNewSite = true;
    return applyEditToRow(r);
  }

  async function loadExtraSites(options={}){
    const renderAfter=options.renderAfter!==false;
    setExtraSites([]);
    if(isFirebaseUnifiedPrimary()) return false;
    if(!isFirebaseReady() || !getDb()) return false;
    try{
      const {collection,getDocs}=getFirestoreModule();
      const db=getDb();
      const snap=await getDocs(collection(db,"sites"));
      const extraSites=[];
      snap.forEach(docSnap => extraSites.push(newSiteToRow(docSnap.id, docSnap.data())));
      setExtraSites(extraSites);
      const deletedSiteIds=getDeletedSiteIds();
      const nextRows=getCsvRows().concat(extraSites).map(applyEditToRow).filter(r=>!deletedSiteIds.has(r.id));
      setRows(nextRows);
      filterControlsReady();
      if(renderAfter){
        render();
        return true;
      }
      return false;
    }catch(e){
      const status=getNewSiteStatusNode();
      if(status) status.textContent = "Nová místa se nepodařilo načíst: " + e.message;
      return false;
    }
  }

  function populateNewRegionOptions(){
    const el=document.getElementById("newRegion");
    if(!el) return;
    const current=el.value;
    const regions=getRegionOptions();
    const fragment=document.createDocumentFragment();
    const placeholder=document.createElement("option");
    placeholder.value="";
    placeholder.textContent="Vyber kraj";
    fragment.appendChild(placeholder);
    regions.forEach(v=>{
      const o=document.createElement("option");
      o.value=v;
      o.textContent=v;
      fragment.appendChild(o);
    });
    el.replaceChildren(fragment);
    if(current && regions.includes(current)) el.value=current;
  }

  return {
    loadExtraSites,
    newSiteToRow,
    populateNewRegionOptions
  };
}
