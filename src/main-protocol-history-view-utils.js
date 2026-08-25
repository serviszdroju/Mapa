import { safe } from "./core-utils.js";

export function createMainProtocolHistoryViewHelpers({
  canViewAllMainProtocolHistory,
  historyDateLabel,
  historySavedDateLabel,
  isMainProtocolProcessed,
  mainProtocolControlDateIso,
  mainProtocolHistoryItemOwnedByCurrentUser,
  mainProtocolWorkflowLabel,
  mainProtocolWorkflowState,
  protocolGlobalHistoryTitle,
  protocolSourceStateLabel,
  protocolSourceTestMethodLabel,
  protocolTimeValue
}={}){
  function mainProtocolHistoryVisibleRows(items=[],dateFilter=""){
    const canViewAll=typeof canViewAllMainProtocolHistory==="function" ? canViewAllMainProtocolHistory() : false;
    const filterDate=safe(dateFilter);
    const rows=[];
    const source=Array.isArray(items) ? items : [];
    for(let idx=0;idx<source.length;idx++){
      const item=source[idx];
      if(!canViewAll && typeof mainProtocolHistoryItemOwnedByCurrentUser==="function" && !mainProtocolHistoryItemOwnedByCurrentUser(item)) continue;
      if(filterDate && typeof mainProtocolControlDateIso==="function" && mainProtocolControlDateIso(item)!==filterDate) continue;
      const title=typeof protocolGlobalHistoryTitle==="function" ? protocolGlobalHistoryTitle(item) : "Protokol";
      const key=safe(item && (item.siteKey || item.firebaseDocId || item.siteId || (Array.isArray(item.siteKeys) ? item.siteKeys[0] : "")));
      const id=safe(item && (item._id || item.id || ""));
      const saved=typeof historySavedDateLabel==="function" ? historySavedDateLabel(item) : "";
      const checked=typeof historyDateLabel==="function" ? historyDateLabel(item) : "";
      const owner=safe(item && (item.createdBy || item.technicianEmail || item.updatedBy));
      const processed=typeof isMainProtocolProcessed==="function" ? isMainProtocolProcessed(item) : false;
      const workflow=typeof mainProtocolWorkflowState==="function" ? mainProtocolWorkflowState(item) : (processed ? "processed" : "idle");
      const workflowLabel=typeof mainProtocolWorkflowLabel==="function" ? mainProtocolWorkflowLabel(item) : "nepředáno ke zpracování";
      const showProcessedControl=processed || workflow==="handoff";
      const sourceState=typeof protocolSourceStateLabel==="function" ? protocolSourceStateLabel(item) : "";
      const sourceTest=typeof protocolSourceTestMethodLabel==="function" ? protocolSourceTestMethodLabel(item.sourceTestMethod || item.testMethod) : "";
      const metaParts=[];
      if(saved) metaParts.push(`uloženo ${saved}`);
      if(checked) metaParts.push(`kontrola ${checked}`);
      if(sourceState) metaParts.push(sourceState);
      if(sourceTest) metaParts.push(sourceTest);
      if(owner && canViewAll) metaParts.push(owner);
      const signatureParts=[
        id || idx,
        title,
        key,
        saved,
        checked,
        owner,
        processed ? "processed" : "open",
        workflow,
        showProcessedControl ? "processed-control" : "no-processed-control",
        workflowLabel,
        sourceState,
        sourceTest,
        typeof protocolTimeValue==="function" ? protocolTimeValue(item) : ""
      ];
      let signature="";
      for(const value of signatureParts) signature+=`${String(value).length}:${value}`;
      rows.push({id,title,key,meta:metaParts.join(" | "),processed,workflow,workflowLabel,showProcessedControl,signature});
    }
    return rows;
  }

  function mainProtocolHistoryRenderKey(visibleRows=[],dateFilter=""){
    const adminPart=typeof canViewAllMainProtocolHistory==="function" && canViewAllMainProtocolHistory() ? "admin" : "user";
    const source=Array.isArray(visibleRows) ? visibleRows : [];
    let rows="";
    for(let i=0;i<source.length;i++){
      if(i) rows+="\u001f";
      rows+=source[i] && source[i].signature ? source[i].signature : "";
    }
    return `${adminPart}\u001e${dateFilter}\u001e${source.length}\u001e${rows}`;
  }

  function renderMainProtocolHistoryRowsDom({
    list,
    items=[],
    dateFilter="",
    currentSignature=""
  }={}){
    if(!list) return currentSignature || "";
    const visibleRows=mainProtocolHistoryVisibleRows(items,dateFilter);
    if(!visibleRows.length){
      const emptySignature=`empty:${dateFilter}`;
      list.textContent=dateFilter ? "Pro vybrané datum není uložený žádný protokol." : "Zatím není uložený žádný protokol.";
      return emptySignature;
    }
    const renderSignature=mainProtocolHistoryRenderKey(visibleRows,dateFilter);
    if(currentSignature===renderSignature && list.childElementCount) return currentSignature;
    const fragment=document.createDocumentFragment();
    visibleRows.forEach(({id,title,key,meta,processed,workflow,workflowLabel,showProcessedControl})=>{
      const row=document.createElement("div");
      row.className=`main-history-row ${workflow || (processed ? "processed" : "idle")}`.trim();
      const top=document.createElement("div");
      top.className="main-history-row-main";
      const button=document.createElement("button");
      button.type="button";
      button.dataset.historySiteKey=key;
      button.textContent=title;
      if(showProcessedControl){
        const processedLabel=document.createElement("label");
        processedLabel.className="main-history-processed";
        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.checked=processed;
        checkbox.disabled=!id || !(typeof canViewAllMainProtocolHistory==="function" && canViewAllMainProtocolHistory());
        checkbox.dataset.mainHistoryProcessed=id;
        const processedText=document.createElement("span");
        processedText.textContent="Zpracováno";
        processedLabel.append(checkbox,processedText);
        top.append(processedLabel);
      }
      top.append(button);
      row.appendChild(top);
      if(meta){
        const small=document.createElement("small");
        small.textContent=meta;
        row.appendChild(small);
      }
      const state=document.createElement("span");
      state.className=`main-history-state ${workflow || "idle"}`;
      state.textContent=workflowLabel || "nepředáno ke zpracování";
      row.appendChild(state);
      fragment.appendChild(row);
    });
    list.replaceChildren(fragment);
    return renderSignature;
  }

  return {
    mainProtocolHistoryRenderKey,
    mainProtocolHistoryVisibleRows,
    renderMainProtocolHistoryRowsDom
  };
}
