import {
  safe,
  simpleNorm
} from "./core-utils.js";

export function createProtocolHandoffHelpers({
  currentUserEmail,
  getSelectedSite,
  selectedSiteDocId,
  serverTimestamp,
  storageKey
}={}){
  let overridesCacheRaw=null;
  let overridesCache=null;
  const userEmail=()=>typeof currentUserEmail==="function" ? currentUserEmail() : "";
  const selectedSite=()=>typeof getSelectedSite==="function" ? getSelectedSite() : null;
  const selectedDocId=site=>typeof selectedSiteDocId==="function" ? selectedSiteDocId(site) : "";
  const remoteTime=()=>typeof serverTimestamp==="function" ? serverTimestamp() : new Date().toISOString();

  function clearProtocolHandoffOverridesCache(){
    overridesCacheRaw=null;
    overridesCache=null;
  }

  function readProtocolHandoffOverrides(){
    try{
      const raw=localStorage.getItem(storageKey) || "{}";
      if(overridesCache && overridesCacheRaw===raw) return overridesCache;
      const parsed=JSON.parse(raw);
      overridesCache=parsed && typeof parsed==="object" && !Array.isArray(parsed) ? parsed : {};
      overridesCacheRaw=raw;
      return overridesCache;
    }catch(e){
      overridesCache={};
      overridesCacheRaw="";
      return overridesCache;
    }
  }

  function writeProtocolHandoffOverrides(overrides={}){
    try{
      const source=overrides && typeof overrides==="object" && !Array.isArray(overrides) ? {...overrides} : {};
      const entries=Object.entries(source);
      if(entries.length>500){
        entries.sort((a,b)=>Date.parse(b[1]?.updatedAt || "")-Date.parse(a[1]?.updatedAt || ""));
        const trimmed={};
        entries.slice(0,500).forEach(([key,value])=>{ trimmed[key]=value; });
        Object.keys(source).forEach(key=>delete source[key]);
        Object.assign(source,trimmed);
      }
      const raw=JSON.stringify(source);
      localStorage.setItem(storageKey,raw);
      overridesCache=source;
      overridesCacheRaw=raw;
    }catch(e){
      console.warn("Lokální stav předání protokolu se nepodařilo uložit",e);
    }
  }

  function protocolHandoffItemId(protocol={}){
    return safe(protocol && (protocol._id || protocol.id || protocol.protocolId || protocol.protocolDocId));
  }

  function protocolHandoffOverrideValue(protocol={}){
    const id=protocolHandoffItemId(protocol);
    if(!id) return null;
    const overrides=readProtocolHandoffOverrides();
    if(!Object.prototype.hasOwnProperty.call(overrides,id)) return null;
    const entry=overrides[id];
    if(entry===true || entry===false) return entry;
    if(entry && typeof entry==="object" && typeof entry.checked==="boolean") return entry.checked;
    return null;
  }

  function rememberProtocolHandoffOverride(id,checked,item={}){
    const cleanId=safe(id);
    if(!cleanId) return;
    const currentSite=selectedSite();
    const overrides={...readProtocolHandoffOverrides()};
    overrides[cleanId]={
      checked:!!checked,
      updatedAt:new Date().toISOString(),
      by:userEmail(),
      siteDocId:safe(item.siteDocId || item.firebaseDocId || selectedDocId(currentSite)),
      siteKey:safe(item.siteKey || item.siteId || currentSite?.id || "")
    };
    writeProtocolHandoffOverrides(overrides);
  }

  function protocolHandoffFieldValue(value){
    if(value===true) return true;
    if(value===false) return false;
    const raw=safe(value);
    if(!raw) return null;
    const normalized=simpleNorm(raw);
    if(normalized==="ne" || normalized==="false" || normalized==="0" || normalized.includes("nepredan")) return false;
    if(normalized==="ano" || normalized==="true" || normalized==="1" || normalized.includes("predan")) return true;
    return null;
  }

  function protocolProcessedForHandoff(protocol={}){
    if(protocol.processed === true) return true;
    const processed=simpleNorm(protocol.processed);
    return processed==="ano" || processed==="true" || processed==="1" || !!protocol.processedAt;
  }

  function protocolLooksRedForHandoff(protocol={}){
    const values=[
      protocol.workflow,
      protocol.workflowState,
      protocol.mainProtocolWorkflowState,
      protocol.protocolWorkflowState,
      protocol.sourceState,
      protocol.protocolSourceState,
      protocol.sourceStatus,
      protocol.finalSourceState,
      protocol.result,
      protocol.conditions,
      protocol.status,
      protocol.state,
      protocol.conditionsReason,
      protocol.issues
    ];
    for(const value of values){
      const normalized=simpleNorm(value);
      if(!normalized) continue;
      if(
        normalized==="handoff" ||
        normalized==="stop" ||
        normalized==="red" ||
        normalized==="cervena" ||
        normalized==="cerveny" ||
        normalized.includes("cerven") ||
        normalized.includes("stop") ||
        normalized.includes("mimo provoz") ||
        normalized.includes("neprovozuschop") ||
        normalized.includes("nevyhov") ||
        normalized.includes("zavada")
      ){
        return true;
      }
    }
    return false;
  }

  function protocolHandoffForProcessing(protocol={}){
    const override=protocolHandoffOverrideValue(protocol);
    if(override!==null) return override;
    for(const value of [protocol.handoffForProcessing,protocol.submittedForProcessing,protocol.processingHandoff]){
      const parsed=protocolHandoffFieldValue(value);
      if(parsed!==null) return parsed;
    }
    if(protocolProcessedForHandoff(protocol)) return true;
    if(protocolLooksRedForHandoff(protocol)) return true;
    return false;
  }

  function protocolHandoffLocalPatch(checked){
    return {
      handoffForProcessing:!!checked,
      submittedForProcessing:!!checked,
      processingHandoff:checked ? "ano" : "ne",
      handoffAt:checked ? new Date().toISOString() : null,
      handoffBy:checked ? userEmail() : ""
    };
  }

  function protocolHandoffRemotePatch(checked){
    const time=remoteTime();
    return {
      handoffForProcessing:!!checked,
      submittedForProcessing:!!checked,
      processingHandoff:checked ? "ano" : "ne",
      handoffAt:checked ? time : null,
      handoffBy:checked ? userEmail() : "",
      updatedBy:userEmail(),
      updatedAt:time
    };
  }

  return {
    clearProtocolHandoffOverridesCache,
    protocolHandoffFieldValue,
    protocolHandoffForProcessing,
    protocolHandoffItemId,
    protocolHandoffLocalPatch,
    protocolHandoffOverrideValue,
    protocolHandoffRemotePatch,
    protocolLooksRedForHandoff,
    protocolProcessedForHandoff,
    readProtocolHandoffOverrides,
    rememberProtocolHandoffOverride,
    writeProtocolHandoffOverrides
  };
}
