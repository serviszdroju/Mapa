export function createProtocolWordBlobHelpers({
  buildProtocolWordEntries
}){
  let protocolWordZipModulePromise=null;

  function loadProtocolWordZipModule(){
    if(!protocolWordZipModulePromise) protocolWordZipModulePromise=import("./zip-docx.js");
    return protocolWordZipModulePromise;
  }

  async function buildProtocolWordBlob(protocol={}){
    const {buildDocxBlob}=await loadProtocolWordZipModule();
    return buildDocxBlob(buildProtocolWordEntries(protocol));
  }

  return { buildProtocolWordBlob };
}
