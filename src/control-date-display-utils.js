export function createControlDateDisplayHelpers({
  addMonths,
  computedNextDate,
  dateInputValueFromAny,
  detailLastCheckNode,
  detailNextCheckNode,
  displayNext,
  formatDateCz,
  getSelectedSite,
  parseDateValue,
  periodMonths,
  setTextIfChanged
}){
  function showControlDateDisplay(r){
    const lastBox=detailLastCheckNode();
    const nextBox=detailNextCheckNode();
    setTextIfChanged(lastBox,formatDateCz(parseDateValue(r.posledni)) || r.posledni || "-");
    setTextIfChanged(nextBox,displayNext(r) || r.pristi || "-");
  }

  function showControlDateInputs(r){
    const lastBox=detailLastCheckNode();
    const nextBox=detailNextCheckNode();
    if(lastBox){
      const input=document.createElement("input");
      input.id="detailLastCheckInput";
      input.type="date";
      input.value=dateInputValueFromAny(r.posledni);
      lastBox.replaceChildren(input);
    }
    if(nextBox){
      const input=document.createElement("input");
      input.id="detailNextCheckInput";
      input.type="date";
      input.value=dateInputValueFromAny(computedNextDate(r));
      nextBox.replaceChildren(input);
    }
    const lastInput=document.getElementById("detailLastCheckInput");
    const nextInput=document.getElementById("detailNextCheckInput");
    const periodInput=document.querySelector('#detailTable [data-key="Perioda kontrol"]');
    if(lastInput && nextInput){
      const recalc=()=>{
        const d=parseDateValue(lastInput.value);
        if(!d) return;
        const selectedSite=getSelectedSite();
        const months=periodInput && periodInput.value==="12" ? 12 : periodInput && periodInput.value==="6" ? 6 : periodMonths(selectedSite || r);
        nextInput.value=dateInputValueFromAny(addMonths(d, months));
      };
      lastInput.addEventListener("change",recalc);
      if(periodInput) periodInput.addEventListener("change",recalc);
    }
  }

  return {
    showControlDateDisplay,
    showControlDateInputs
  };
}
