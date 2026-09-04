export function createProtocolFileExportHelpers({
  blobToBase64,
  buildPdfFromJpegPages,
  buildProtocolWordBlob,
  downloadBlobFile,
  enrichProtocolWithTechnicianSignature,
  ensureMailFunctions,
  getFbFnMod,
  getFirebaseReady,
  getMailFunctions,
  getSelectedSite,
  normalizeProtocolTechnicianFields,
  protocolExportDatePart,
  protocolMailBody,
  protocolMailSubject,
  protocolPdfFileNameFromWord,
  protocolTechnicianDisplayName,
  protocolTechnicianSignatureImageBytes,
  protocolWordFileNamePart,
  renderProtocolPdfPageCanvases,
  safe,
  setProtocolStatusText,
  showSaveConfirmation,
  validProtocolMailRecipient
}){
  async function preparedProtocolFilled(protocol,options={}){
    if(!protocol) return null;
    const allowCurrentTechnicianFallback=options.allowCurrentTechnicianFallback!==false;
    return enrichProtocolWithTechnicianSignature(normalizeProtocolTechnicianFields({
      ...protocol,
      createdBy:protocol.createdBy || protocol.technicianEmail || ""
    },{allowCurrentFallback:allowCurrentTechnicianFallback}));
  }

  async function preparedProtocolExport(protocol,options={}){
    if(!protocol) return null;
    const selectedSite=getSelectedSite();
    const filled=await preparedProtocolFilled(protocol,options);
    const baseName=filled.deviceType || filled.selectedDevice || filled.siteSource || filled.siteName || selectedSite?.adresa || "protokol";
    const fileName=`protokol-${protocolExportDatePart(filled)}-${protocolWordFileNamePart(baseName)}.docx`;
    return {
      filled,
      fileName,
      blob:await buildProtocolWordBlob(filled)
    };
  }

  async function exportProtocolToWord(protocol){
    if(!protocol){
      showSaveConfirmation("Není vybraný protokol k exportu.");
      return;
    }
    try{
      setProtocolStatusText("Připravuji Word export...");
      const prepared=await preparedProtocolExport(protocol);
      downloadBlobFile(prepared.fileName,prepared.blob);
      setProtocolStatusText("Protokol exportován do Wordu.");
      showSaveConfirmation("Protokol exportován do Wordu.");
    }catch(e){
      console.warn("Export protokolu do Wordu selhal",e);
      setProtocolStatusText("Export do Wordu se nepodařil.");
      showSaveConfirmation("Export do Wordu se nepodařil.");
    }
  }

  async function buildProtocolPdfBlob(protocol={},options={}){
    const pages=await renderProtocolPdfPageCanvases(protocol,options);
    return new Blob([buildPdfFromJpegPages(pages)],{type:"application/pdf"});
  }

  async function preparedProtocolPdfExport(protocol,options={}){
    if(!protocol) return null;
    const selectedSite=getSelectedSite();
    const filled=await preparedProtocolFilled(protocol,{
      allowCurrentTechnicianFallback:options.allowCurrentTechnicianFallback!==false
    });
    if(options.requireTechnicianSignature && !protocolTechnicianSignatureImageBytes(filled)){
      const tech=protocolTechnicianDisplayName(filled) || "technik z protokolu";
      throw new Error(`Technik ${tech} nemá uložený podpis. Nejdřív ulož podpis technika, aby bylo možné poslat PDF zákazníkovi.`);
    }
    const baseName=filled.deviceType || filled.selectedDevice || filled.siteSource || filled.siteName || selectedSite?.adresa || "protokol";
    const wordName=`protokol-${protocolExportDatePart(filled)}-${protocolWordFileNamePart(baseName)}.docx`;
    const fileName=protocolPdfFileNameFromWord(wordName);
    return {
      filled,
      fileName,
      blob:await buildProtocolPdfBlob(filled,{omitChecklist:!!options.omitChecklist})
    };
  }

  async function sendProtocolByMail(protocol,recipientEmail=""){
    if(!protocol){
      showSaveConfirmation("Není vybraný protokol k poslání.");
      return;
    }
    const toEmail=safe(recipientEmail).toLowerCase();
    if(!validProtocolMailRecipient(toEmail)){
      throw new Error("Zadej platný e-mail příjemce.");
    }
    const mailReady=await ensureMailFunctions();
    const fbFnMod=getFbFnMod();
    const mailFunctions=getMailFunctions();
    if(!getFirebaseReady() || !mailReady || !fbFnMod || !mailFunctions){
      throw new Error("Odesílací funkce není dostupná. Nejdřív je potřeba nasadit Firebase Function sendProtocolMail.");
    }
    setProtocolStatusText("Připravuji PDF protokol pro e-mail...");
    const prepared=await preparedProtocolPdfExport(protocol,{
      allowCurrentTechnicianFallback:false,
      omitChecklist:true,
      requireTechnicianSignature:true
    });
    setProtocolStatusText(`Odesílám PDF protokol na ${toEmail}...`);
    const sendMail=fbFnMod.httpsCallable(mailFunctions,"sendProtocolMail");
    await sendMail({
      recipientEmail:toEmail,
      toEmail,
      subject:protocolMailSubject(prepared.filled),
      body:protocolMailBody(prepared.filled,prepared.fileName),
      fileName:prepared.fileName,
      contentType:"application/pdf",
      fileBase64:await blobToBase64(prepared.blob)
    });
    setProtocolStatusText(`Protokol byl odeslán na ${toEmail}.`);
    showSaveConfirmation(`Protokol odeslán na ${toEmail}.`);
  }

  return {
    buildProtocolPdfBlob,
    exportProtocolToWord,
    preparedProtocolExport,
    preparedProtocolFilled,
    preparedProtocolPdfExport,
    sendProtocolByMail
  };
}
