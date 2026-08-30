export function createProtocolSignatureImageHelpers({
  safe
}){
  function base64ToBytes(base64){
    const binary=atob(base64 || "");
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
    return bytes;
  }

  function imageBytesFromPngDataUrl(dataUrl=""){
    const match=dataUrl.match(/^data:image\/png;base64,(.+)$/);
    if(!match) return null;
    try{return base64ToBytes(match[1]);}catch(e){return null;}
  }

  function protocolSignatureImageBytes(protocol={}){
    return imageBytesFromPngDataUrl(safe(protocol.clientSignatureDataUrl || protocol.clientSignature || ""));
  }

  function protocolTechnicianSignatureImageBytes(protocol={}){
    return imageBytesFromPngDataUrl(safe(protocol.techSignatureDataUrl || protocol.technicianSignatureDataUrl || ""));
  }

  return {
    base64ToBytes,
    protocolSignatureImageBytes,
    protocolTechnicianSignatureImageBytes
  };
}
