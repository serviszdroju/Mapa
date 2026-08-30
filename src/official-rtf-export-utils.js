export function createOfficialRtfExportHelpers({
  OFFICIAL_RTF_TEMPLATE_URL,
  OFFICIAL_STOP_RTF_TEMPLATE_URL,
  OFFICIAL_TIPEK_SIGNATURE_URL,
  OFFICIAL_WATERMARK_LOGO_URL,
  fillOfficialRtfTemplate,
  getCurrentUser,
  getSelectedSite,
  officialProtocolAddressFileName,
  officialProtocolFileDatePart
}){
  const officialRtfTemplateCache={};
  let officialTipekSignatureBytesCache=null;
  let officialWatermarkLogoBytesCache=null;

  async function loadOfficialRtfTemplate(mode="ok"){
    const key=mode==="stop" ? "stop" : "ok";
    if(officialRtfTemplateCache[key]) return officialRtfTemplateCache[key];
    const url=key==="stop" ? OFFICIAL_STOP_RTF_TEMPLATE_URL : OFFICIAL_RTF_TEMPLATE_URL;
    const response=await fetch(url,{cache:"no-store"});
    if(!response.ok) throw new Error(`Šablonu ${url} se nepodařilo načíst (${response.status}).`);
    const template=await response.text();
    if(!template.includes("__SZZ_OPERATOR_1__")) throw new Error("Šablona dokladu nemá připravená vyplňovací pole.");
    officialRtfTemplateCache[key]=template;
    return template;
  }

  async function loadOfficialTipekSignatureBytes(){
    if(officialTipekSignatureBytesCache) return officialTipekSignatureBytesCache;
    try{
      const response=await fetch(OFFICIAL_TIPEK_SIGNATURE_URL,{cache:"force-cache"});
      if(!response.ok) throw new Error(`Podpis se nepodařilo načíst (${response.status}).`);
      officialTipekSignatureBytesCache=new Uint8Array(await response.arrayBuffer());
      return officialTipekSignatureBytesCache;
    }catch(e){
      console.warn("Podpis Ing. Tipek se nepodařilo načíst",e);
      return null;
    }
  }

  async function loadOfficialWatermarkLogoBytes(){
    if(officialWatermarkLogoBytesCache) return officialWatermarkLogoBytesCache;
    try{
      const response=await fetch(OFFICIAL_WATERMARK_LOGO_URL,{cache:"force-cache"});
      if(!response.ok) throw new Error(`Logo se nepodařilo načíst (${response.status}).`);
      officialWatermarkLogoBytesCache=new Uint8Array(await response.arrayBuffer());
      return officialWatermarkLogoBytesCache;
    }catch(e){
      console.warn("Logo pro vodoznak dokladu se nepodařilo načíst",e);
      return null;
    }
  }

  async function preparedOfficialProtocolExport(protocol={},officialData={},mode="ok"){
    const currentUser=getCurrentUser();
    const selectedSite=getSelectedSite();
    const filled={
      ...protocol,
      createdBy:protocol.createdBy || protocol.technicianEmail || currentUser?.email || ""
    };
    const exportOfficialData={
      ...officialData,
      tipekSignatureBytes:officialData.tipekSignatureBytes || await loadOfficialTipekSignatureBytes(),
      watermarkLogoBytes:officialData.watermarkLogoBytes || await loadOfficialWatermarkLogoBytes()
    };
    const prefix=mode==="stop" ? "doklad-stop-stav" : "doklad-provozuschopnosti";
    const fileBase=officialProtocolAddressFileName(filled,selectedSite,mode) || `${prefix}-${officialProtocolFileDatePart(filled)}`;
    const fileName=`${fileBase}.rtf`;
    const template=await loadOfficialRtfTemplate(mode);
    return {
      filled,
      fileName,
      blob:new Blob([fillOfficialRtfTemplate(template,filled,exportOfficialData,mode)],{type:"application/rtf;charset=utf-8"})
    };
  }

  return {
    preparedOfficialProtocolExport
  };
}
