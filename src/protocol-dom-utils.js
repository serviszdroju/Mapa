export function createProtocolDomHelpers({
  formFieldNode,
  safeValue,
  setTextIfChanged
}){
  const protocolSummaryNodeCache={};

  function checkbox(id){
    return formFieldNode(id)?.checked || false;
  }

  function val(id){
    return formFieldNode(id)?.value || "";
  }

  function protocolStatusNode(){
    return formFieldNode("protocolStatus");
  }

  function setProtocolStatusText(text){
    setTextIfChanged(protocolStatusNode(),text);
  }

  function protocolSummaryNode(id){
    const cached=protocolSummaryNodeCache[id];
    if(cached && cached.isConnected) return cached;
    const el=document.getElementById(id);
    if(el) protocolSummaryNodeCache[id]=el;
    return el;
  }

  function updateProtocolSummary(){
    const set=(id,value)=>{
      setTextIfChanged(protocolSummaryNode(id),safeValue(value) || "-");
    };
    set("protoSummaryAddress", val("protoPlace"));
    set("protoSummaryDevice", val("protoDeviceType"));
    set("protoSummarySerial", val("protoSerial"));
    set("protoSummaryLocation", val("protoPbzLocation"));
    set("protoSummaryPeriod", val("protoPeriod"));
  }

  return {
    checkbox,
    protocolStatusNode,
    setProtocolStatusText,
    updateProtocolSummary,
    val
  };
}
