import { safe } from "./core-utils.js";
import { isoDateFromAny } from "./date-input-utils.js";

export function createProtocolWorkflowHelpers({
  currentUserEmail,
  protocolHandoffForProcessing,
  serverTimestamp
}={}){
  const userEmail=()=>typeof currentUserEmail==="function" ? currentUserEmail() : "";
  const remoteTime=()=>typeof serverTimestamp==="function" ? serverTimestamp() : new Date().toISOString();

  function mainProtocolHistoryItemOwnerEmail(item={}){
    return safe(item.createdBy || item.technicianEmail || item.techEmail || item.updatedBy).toLowerCase();
  }

  function mainProtocolHistoryItemOwnedByCurrentUser(item={}){
    const owner=mainProtocolHistoryItemOwnerEmail(item);
    const email=userEmail();
    return !!owner && !!email && owner===email;
  }

  function isMainProtocolProcessed(item={}){
    if(item.processed === true) return true;
    const processed=safe(item.processed).toLowerCase();
    return processed==="ano" || processed==="true" || processed==="1" || !!item.processedAt;
  }

  function mainProtocolWorkflowState(item={}){
    if(isMainProtocolProcessed(item)) return "processed";
    if(typeof protocolHandoffForProcessing==="function" && protocolHandoffForProcessing(item)) return "handoff";
    return "idle";
  }

  function mainProtocolWorkflowLabel(item={}){
    const state=mainProtocolWorkflowState(item);
    if(state==="processed") return "zpracováno";
    if(state==="handoff") return "předáno ke zpracování";
    return "nepředáno ke zpracování";
  }

  function mainProtocolControlDateIso(item={}){
    return isoDateFromAny(item.date || item.checkDate || "");
  }

  function mainProtocolProcessedLocalPatch(checked){
    return {
      processed:!!checked,
      processedAt:checked ? new Date().toISOString() : null,
      processedBy:checked ? userEmail() : ""
    };
  }

  function mainProtocolProcessedRemotePatch(checked){
    const time=remoteTime();
    return {
      processed:!!checked,
      processedAt:checked ? time : null,
      processedBy:checked ? userEmail() : "",
      updatedBy:userEmail(),
      updatedAt:time
    };
  }

  return {
    isMainProtocolProcessed,
    mainProtocolControlDateIso,
    mainProtocolHistoryItemOwnedByCurrentUser,
    mainProtocolHistoryItemOwnerEmail,
    mainProtocolProcessedLocalPatch,
    mainProtocolProcessedRemotePatch,
    mainProtocolWorkflowLabel,
    mainProtocolWorkflowState
  };
}
