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

  return {
    mainProtocolHistoryRenderKey,
    mainProtocolHistoryVisibleRows
  };
}
