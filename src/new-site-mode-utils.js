export function createNewSiteModeHelpers({
  clearNewSiteAllFields,
  detailSubNode,
  detailTableNode,
  detailTitleNode,
  drawerNode,
  forceRenderNewSiteForm,
  newSiteCardNode,
  populateNewRegionOptions,
  renderNewSiteAllFields,
  restoreNormalDetailDrawerShell,
  runAfterPaint,
  setAddSourceBaseSite,
  setNewSiteSourceChooserHidden,
  setSelectedSite,
  setTextIfChanged
}){
  function setNewSiteModeTitle(){
    const title=document.getElementById("drawerTitle") || detailTitleNode();
    const sub=document.getElementById("drawerSub") || detailSubNode();
    if(title) title.textContent="Přidat nové místo";
    if(sub) sub.textContent="Vyplň údaje a ulož místo.";
  }

  function clearNewSiteMode(){
    const drawerEl=drawerNode();
    if(drawerEl) drawerEl.classList.remove("adding-new-site");
    setAddSourceBaseSite(null);
    setNewSiteSourceChooserHidden();
  }

  function openNewSiteForm(){
    restoreNormalDetailDrawerShell();
    setSelectedSite(null);
    setAddSourceBaseSite(null);
    setNewSiteSourceChooserHidden();
    populateNewRegionOptions();
    const drawerEl=drawerNode();
    if(drawerEl){ drawerEl.classList.add("open"); drawerEl.scrollTop=0; }
    const newSiteCard=newSiteCardNode();
    if(newSiteCard) newSiteCard.style.display="block";
    forceRenderNewSiteForm();
    if(drawerEl) drawerEl.classList.add("adding-new-site");
    renderNewSiteAllFields();
    setNewSiteModeTitle();
    clearNewSiteAllFields();

    ["newName","newAddress","newRegion","newSource","newSerial","newBatteries","newCapacity","newSets","newExtra","newAllData"].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.value="";
    });

    runAfterPaint(()=>{const n=document.getElementById("newName"); if(n){n.focus(); n.scrollIntoView({behavior:"smooth",block:"start"});}});
    document.getElementById("editCard").style.display="none";
    setTextIfChanged(detailTitleNode(),"Přidat nové místo");
    setTextIfChanged(detailSubNode(),"Vyplň údaje a ulož místo.");
    const detailTable=detailTableNode();
    if(detailTable){
      detailTable.dataset.detailTableMode="new";
      delete detailTable.dataset.detailSignature;
      const row=document.createElement("tr");
      const label=document.createElement("td");
      label.textContent="Nové místo";
      const value=document.createElement("td");
      value.textContent="Po uložení se zobrazí v mapě.";
      row.append(label,value);
      detailTable.replaceChildren(row);
    }
    document.getElementById("newSiteStatus").textContent="";
  }

  return {
    clearNewSiteMode,
    openNewSiteForm,
    setNewSiteModeTitle
  };
}
