export function createDetailHistoryViewHelpers({
  bindDetailHistoryActions,
  canViewProtocolHistory,
  detailHistoryNode,
  detailLazyKey,
  getDetailHistoryIndex,
  getDetailHistoryItems,
  getDetailHistoryRenderSignature,
  getSelectedSite,
  historyDateLabel,
  historyObjectSummary,
  historySavedDateLabel,
  isHistoryAdmin,
  isProtocolHistoryItem,
  protocolHandoffForProcessing,
  protocolSourceStateLabel,
  protocolSourceStateValue,
  protocolSourceTestMethodLabel,
  protocolTechnicianDisplayName,
  protocolTimeValue,
  safe,
  setDetailHistoryIndex,
  setDetailHistoryItems,
  setDetailHistoryRenderSignature,
  updateOfficialProtocolSourceInfo
}){
  function renderHistory(){
    const history=detailHistoryNode();
    if(!history) return;
    bindDetailHistoryActions(history);
    if(!canViewProtocolHistory()){
      setDetailHistoryItems([]);
      setDetailHistoryIndex(0);
      setDetailHistoryRenderSignature("auth");
      history.textContent="Historii protokolů uvidí přihlášený technik.";
      updateOfficialProtocolSourceInfo();
      return;
    }

    let detailHistoryItems=getDetailHistoryItems();
    let detailHistoryIndex=getDetailHistoryIndex();
    if(!detailHistoryItems.length){
      setDetailHistoryRenderSignature("empty");
      history.textContent="Zatím žádný záznam.";
      updateOfficialProtocolSourceInfo();
      return;
    }

    if(detailHistoryIndex<0) detailHistoryIndex=0;
    if(detailHistoryIndex>=detailHistoryItems.length) detailHistoryIndex=detailHistoryItems.length-1;
    setDetailHistoryIndex(detailHistoryIndex);
    detailHistoryItems=getDetailHistoryItems();

    const d=detailHistoryItems[detailHistoryIndex];
    const canExportProtocol=isProtocolHistoryItem(d);
    const canDeleteProtocol=isHistoryAdmin() && canExportProtocol;
    const protocolState=protocolSourceStateValue(d);
    const protocolStateText=protocolSourceStateLabel(d);
    const protocolTestText=protocolSourceTestMethodLabel(d.sourceTestMethod || d.testMethod);
    const protocolHandoffChecked=protocolHandoffForProcessing(d);
    const rows=[
      ["Typ záznamu", d._type || "Záznam"],
      ["Datum", historyDateLabel(d)],
      ["Uloženo", historySavedDateLabel(d)],
      ["Technik", protocolTechnicianDisplayName(d)],
      ["Zařízení", d.deviceType || d.siteSource || ""],
      ["Výrobní číslo", d.serial || ""],
      ["Adresa", d.place || d.siteAddress || d.siteName || ""],
      ["Umístění PBZ", d.pbzLocation || ""],
      ["Perioda", d.period || ""],
      ["Výsledek", d.result || d.conditions || ""],
      ["Stav zdroje", protocolStateText],
      ["Odzkoušení zdroje", protocolTestText],
      ["Předáno ke zpracování", protocolHandoffChecked ? "ano" : "ne"],
      ["Reset diagnostiky", d.resetDiagnostics || ""],
      ["Baterie", [d.batteryCount ? `${d.batteryCount} ks` : "", d.capacityAh ? `${d.capacityAh} Ah` : "", d.setCount ? `${d.setCount} sad` : ""].filter(Boolean).join(", ")],
      ["Měření AC", [d.inputVac&&`vstup ${d.inputVac} Vac`, d.output1Vac&&`výstup 1 ${d.output1Vac} Vac`, d.output2Vac&&`výstup 2 ${d.output2Vac} Vac`].filter(Boolean).join(", ")],
      ["Měření DC", [d.mainBatVdc&&`hl. bat. ${d.mainBatVdc} Vdc`, d.auxBatVdc&&`pom. bat. ${d.auxBatVdc} Vdc`].filter(Boolean).join(", ")],
      ["Jističe", d.breakersLocation || ""],
      ["Zálohovaná zařízení", historyObjectSummary(d.backedDevices)],
      ["Umístění zálohovaných zařízení", d.controlLocation || ""],
      ["Postup testování", d.testProcedure || ""],
      ["Vstup / OOPP", historyObjectSummary(d.access)],
      ["Kontakty", d.contacts || ""],
      ["Dostupnost", historyObjectSummary(d.availability)],
      ["Zjištění / poznámky", d.issues || d.notes || d.conditionsReason || ""],
      ["Poznámka pro zákazníka", d.customerNote || d.noteForCustomer || ""],
      ["Chceck list", d.checklist || d.checkList || d.chceckList || ""],
      ["Doporučení", d.recommendation || ""],
      ["Podpis objednavatele", d.clientSignatureDataUrl ? "uložen elektronicky" : ""]
    ].filter(([,value])=>safe(value));

    const photos=d._collection==="protocols" ? [] : (d.photoLinks||[]).filter(Boolean);
    const renderSignature=[
      detailLazyKey(getSelectedSite()),
      canViewProtocolHistory() ? "view" : "no-view",
      isHistoryAdmin() ? "admin" : "user",
      detailHistoryIndex,
      detailHistoryItems.length,
      safe(d && (d._id || d.id || "")),
      safe(d && (d._type || "")),
      safe(d && (d._collection || "")),
      canExportProtocol ? "export" : "",
      canDeleteProtocol ? "delete" : "",
      canExportProtocol ? "tech-signature" : "",
      protocolState,
      protocolStateText,
      protocolTestText,
      protocolHandoffChecked ? "handoff" : "",
      protocolTimeValue(d),
      ...rows.flatMap(([label,value])=>[safe(label),safe(value)]),
      ...photos.map(url=>safe(url))
    ].map(value=>`${String(value).length}:${value}`).join("\u001f");
    if(getDetailHistoryRenderSignature()===renderSignature && history.childElementCount) {
      updateOfficialProtocolSourceInfo();
      return;
    }
    setDetailHistoryRenderSignature(renderSignature);
    const controls=document.createElement("div");
    controls.className="history-controls";
    const prevBtn=document.createElement("button");
    prevBtn.className="secondary";
    prevBtn.type="button";
    prevBtn.id="historyPrevBtn";
    prevBtn.disabled=detailHistoryIndex<=0;
    prevBtn.textContent="Předchozí";
    const counter=document.createElement("div");
    counter.className="history-counter";
    counter.textContent=`${detailHistoryIndex+1} / ${detailHistoryItems.length}`;
    const nextBtn=document.createElement("button");
    nextBtn.className="secondary";
    nextBtn.type="button";
    nextBtn.id="historyNextBtn";
    nextBtn.disabled=detailHistoryIndex>=detailHistoryItems.length-1;
    nextBtn.textContent="Další";
    controls.append(prevBtn,counter,nextBtn);

    const itemEl=document.createElement("div");
    itemEl.className="history-item";
    rows.forEach(([label,value])=>{
      const rowEl=document.createElement("div");
      rowEl.className="history-detail-row";
      const labelEl=document.createElement("span");
      labelEl.textContent=safe(label);
      const valueEl=document.createElement("span");
      valueEl.textContent=safe(value);
      rowEl.append(labelEl,valueEl);
      itemEl.appendChild(rowEl);
    });
    if(protocolStateText){
      const stateEl=document.createElement("div");
      stateEl.className=`history-protocol-state ${protocolState}`;
      stateEl.textContent=protocolTestText && protocolState==="ok" ? `${protocolStateText} - ${protocolTestText}` : protocolStateText;
      itemEl.appendChild(stateEl);
    }
    if(photos.length){
      const photosEl=document.createElement("div");
      photosEl.className="history-photos";
      photos.forEach((url,idx)=>{
        const link=document.createElement("a");
        link.href=safe(url);
        link.target="_blank";
        const img=document.createElement("img");
        img.src=safe(url);
        img.alt=`Foto ${idx+1}`;
        img.loading="lazy";
        img.decoding="async";
        link.appendChild(img);
        photosEl.appendChild(link);
      });
      itemEl.appendChild(photosEl);
    }
    if(canExportProtocol || canDeleteProtocol){
      const actions=document.createElement("div");
      actions.className="history-actions";
      const addAction=(className,id,text)=>{
        const button=document.createElement("button");
        button.className=className;
        button.type="button";
        button.id=id;
        button.textContent=text;
        actions.appendChild(button);
      };
      if(canExportProtocol){
        addAction("secondary","editHistoryProtocolBtn","Upravit protokol");
        addAction("secondary","exportHistoryProtocolBtn","Exportovat do Wordu");
        addAction("secondary","mailHistoryProtocolBtn","Poslat na mail");
        const handoffLabel=document.createElement("label");
        handoffLabel.className=`secondary history-handoff-processing${protocolHandoffChecked ? " is-checked" : ""}`;
        handoffLabel.htmlFor="historyHandoffProtocolCheck";
        const handoffInput=document.createElement("input");
        handoffInput.type="checkbox";
        handoffInput.id="historyHandoffProtocolCheck";
        handoffInput.checked=protocolHandoffChecked;
        const handoffText=document.createElement("span");
        handoffText.textContent="Předán protokol ke zpracování";
        handoffLabel.append(handoffInput,handoffText);
        actions.appendChild(handoffLabel);
      }
      if(canDeleteProtocol) addAction("danger","deleteHistoryProtocolBtn","Smazat protokol");
      if(canExportProtocol) addAction("secondary","technicianSignatureBtn","Podpis technika");
      itemEl.appendChild(actions);
    }
    history.replaceChildren(controls,itemEl);
    updateOfficialProtocolSourceInfo();
  }

  return {
    renderHistory
  };
}
