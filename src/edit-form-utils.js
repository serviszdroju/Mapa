export function createEditFormHelpers({
  addMonths=()=>null,
  formatDateCz=value=>String(value || ""),
  geocodeAddressGeneric=()=>Promise.resolve(null),
  getSelectedSite=()=>null,
  isoDateFromAny=value=>String(value || ""),
  parseDateValue=value=>value,
  periodMonths=()=>12,
  safe=value=>String(value == null ? "" : value).trim()
}={}){
  function setRegionFieldValue(selector,region,options={}){
    const clean=safe(region);
    if(!clean) return;
    const el=document.querySelector(selector);
    if(!el) return;
    if(options.force || !safe(el.value) || el.dataset.autoRegion==="1"){
      el.value=clean;
      el.dataset.autoRegion="1";
    }
  }

  function recalcEditNextCheck(){
    const last=isoDateFromAny(document.getElementById("editLastCheck")?.value);
    const out=document.getElementById("editNextCheck");
    if(!out) return;
    const selectedSite=getSelectedSite();
    if(!last || !selectedSite){
      out.value="";
      return;
    }
    const d=parseDateValue(last);
    const next=addMonths(d, periodMonths(selectedSite));
    out.value=formatDateCz(next);
  }

  async function recalcGpsForEditedAddress(){
    const st=document.getElementById("editStatus");
    const address=document.getElementById("editGpsAddress").value.trim();
    if(!address){
      st.textContent="Nejdřív vyplň adresu pro GPS.";
      document.getElementById("editGpsAddress").focus();
      return;
    }
    try{
      st.textContent="Dopočítávám GPS podle adresy...";
      const result=await geocodeAddressGeneric(address);
      if(!result){
        st.textContent=window.lastGeocodeMessage || "Adresa nebyla nalezena.";
        return;
      }
      document.getElementById("editGpsLat").value=result.lat;
      document.getElementById("editGpsLon").value=result.lon;
      st.textContent="GPS doplněno podle adresy.";
    }catch(e){
      st.textContent="Chyba při dopočítání GPS: "+e.message;
    }
  }

  return {
    recalcEditNextCheck,
    recalcGpsForEditedAddress,
    setRegionFieldValue
  };
}
