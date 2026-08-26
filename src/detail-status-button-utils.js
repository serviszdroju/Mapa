export function createDetailStatusButtonHelpers({
  getSelectedSite
}){
  function updateOrderedButton(){
    const btn=document.getElementById("toggleOrderedBtn");
    const selectedSite=getSelectedSite();
    if(!btn || !selectedSite) return;
    btn.textContent=selectedSite.ordered === true ? "Objednáno" : "Kontrola objednána";
    btn.className=selectedSite.ordered === true ? "secondary ordered-toggle-active" : "secondary";
  }

  function updateRepairButton(){
    const btn=document.getElementById("toggleRepairBtn");
    const selectedSite=getSelectedSite();
    if(!btn || !selectedSite) return;
    btn.textContent=selectedSite.repairOrdered === true ? "Oprava objednána" : "Objednaná oprava";
    btn.className=selectedSite.repairOrdered === true ? "secondary repair-toggle-active" : "secondary";
  }

  function updateStopButton(){
    const btn=document.getElementById("toggleStopBtn");
    const selectedSite=getSelectedSite();
    if(!btn || !selectedSite) return;
    btn.textContent=selectedSite.stopped === true ? "Stop Stav aktivní" : "Stop Stav";
    btn.className=selectedSite.stopped === true ? "secondary stop-toggle-active" : "secondary";
  }

  return {
    updateOrderedButton,
    updateRepairButton,
    updateStopButton
  };
}
