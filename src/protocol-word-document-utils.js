export function createProtocolWordDocumentHelpers({
  getCurrentUser,
  getSelectedSite,
  protocolAccessText,
  protocolAvailabilityText,
  protocolBackedDevicesText,
  protocolConditionsText,
  protocolDisplayDate,
  protocolMeasurementTableSpec,
  protocolPeriodText,
  protocolSignatureImageBytes,
  protocolSourceStateLabel,
  protocolSourceStateValue,
  protocolSourceTestMethodLabel,
  protocolTechnicianSignatureImageBytes,
  wordBlank,
  wordFormField,
  wordFormGrid,
  wordParagraph,
  wordParagraphXml,
  wordRun,
  wordSignatureGrid,
  wordTable,
  wordXmlEscape
}){
  function protocolMeasurementTable(protocol={}){
    const spec=protocolMeasurementTableSpec(protocol);
    return wordTable(spec.rows,spec.widths) + wordBlank(25);
  }

  function buildProtocolWordDocumentXml(protocol={}){
    const site=getSelectedSite() || {};
    const deviceType=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || site.zdroj || "";
    const place=protocol.place || protocol.siteAddress || protocol.siteName || site.adresa || "";
    const blocks=[
      wordParagraph("Potvrzení o provedené zkoušce provozuschopnosti",{align:"center",bold:true,size:28,after:80}),
      wordParagraph("Tento formulář slouží zároveň jako objednávka zkoušky provozuschopnosti. Kontrolu záložního zdroje na PBZ dle Vyhl. 246/2001 Sb. §6, §7 provedl: Servis záložních zdrojů s.r.o., IČ: 09391126",{size:18,after:80}),
      wordFormField("Datum provedení kontroly zdroje:",protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt)),
      wordFormGrid(["Kontrolované zařízení – Typ","Výrobní č.","Plomba"],[deviceType,protocol.serial,protocol.seal],[4300,2650,2680]),
      wordFormField("1) Místo kontroly:",place),
      wordFormField("2) Provozovatel zařízení:",protocol.operator),
      wordFormField("3) Objednatel zkoušky provozuschopnosti:",protocol.customer),
      wordFormField("4) Umístění PBZ v objektu:",protocol.pbzLocation),
      protocolMeasurementTable(protocol),
      wordFormField("5) Umístění jističů UPS a zál. zařízení v objektu:",protocol.breakersLocation),
      wordFormField("6) Typ a umístění zálohovaných zařízení v objektu:",protocolBackedDevicesText(protocol)),
      wordFormField("7) Umístění zálohovaných zařízení:",protocol.controlLocation),
      wordFormField("Postup testování:",protocol.testProcedure),
      wordFormField("8) Parkování a vstup do objektu, předepsané OOPP:",protocolAccessText(protocol)),
      wordFormField("9) Kontakty:",protocol.contacts),
      wordFormField("10) Dostupnost:",protocolAvailabilityText(protocol)),
      wordFormField("11) Perioda zkoušky provozuschopnosti:",protocolPeriodText(protocol)),
      wordFormField("12) Zařízení pracuje ve vyhovujících podmínkách (odůvodnění):",protocolConditionsText(protocol)),
      wordFormField("13) Poznámky:",protocol.notes || protocol.issues),
      wordFormField("14) Poznámka pro zákazníka:",protocol.customerNote || protocol.noteForCustomer),
      wordFormField("15) Chceck list:",protocol.checklist || protocol.checkList || protocol.chceckList),
      wordFormField("Stav zdroje po kontrole:",[
        protocolSourceStateLabel(protocol),
        protocolSourceStateValue(protocol)==="ok" ? protocolSourceTestMethodLabel(protocol.sourceTestMethod || protocol.testMethod) : ""
      ].filter(Boolean).join(" - ")),
      wordSignatureGrid(protocol)
    ];
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
<w:body>${blocks.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  }

  function buildProtocolWordStylesXml(){
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style>
<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>
</w:styles>`;
  }

  function buildProtocolWordEntries(protocol={}){
    const currentUser=getCurrentUser();
    const now=new Date().toISOString();
    const title=`Protokol ${protocol.siteName || protocol.place || ""}`.trim();
    const signatureBytes=protocolSignatureImageBytes(protocol);
    const techSignatureBytes=protocolTechnicianSignatureImageBytes(protocol);
    const hasPngImage=!!(signatureBytes || techSignatureBytes);
    const imageContentType=hasPngImage ? '<Default Extension="png" ContentType="image/png"/>' : "";
    const imageRel=[
      signatureBytes ? '<Relationship Id="rIdSignature" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/client-signature.png"/>' : "",
      techSignatureBytes ? '<Relationship Id="rIdTechSignature" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/technician-signature.png"/>' : ""
    ].join("");
    const entries=[
      {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${imageContentType}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`},
      {name:"_rels/.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`},
      {name:"word/_rels/document.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${imageRel}</Relationships>`},
      {name:"word/document.xml",data:buildProtocolWordDocumentXml(protocol)},
      {name:"word/styles.xml",data:buildProtocolWordStylesXml()},
      {name:"word/settings.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/><w:defaultTabStop w:val="708"/><w:compat/></w:settings>`},
      {name:"docProps/core.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${wordXmlEscape(title)}</dc:title><dc:creator>${wordXmlEscape(protocol.createdBy || protocol.technicianEmail || currentUser?.email || "")}</dc:creator><cp:lastModifiedBy>${wordXmlEscape(currentUser?.email || "")}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`},
      {name:"docProps/app.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Servis záložních zdrojů - mapa FZ</Application></Properties>`}
    ];
    if(signatureBytes) entries.push({name:"word/media/client-signature.png",data:signatureBytes});
    if(techSignatureBytes) entries.push({name:"word/media/technician-signature.png",data:techSignatureBytes});
    return entries;
  }

  return {
    buildProtocolWordEntries,
    buildProtocolWordStylesXml
  };
}
