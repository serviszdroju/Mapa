export function createOfficialProtocolWordDocumentHelpers({
  OFFICIAL_CONTROL_SUBJECT_TEXT,
  buildProtocolWordStylesXml,
  getCurrentUser,
  getSelectedSite,
  officialManufacturerText,
  officialOperatorText,
  officialProtocolConditionsText,
  officialProtocolCustomerNote,
  officialProtocolDeviceLine,
  officialProtocolFunctionalText,
  officialProtocolMeasurementNotesXml,
  officialProtocolNextDate,
  officialProtocolResultText,
  protocolDisplayDate,
  protocolSignatureImageBytes,
  protocolSourceLocationFromSite,
  safe,
  wordBlank,
  wordClientSignatureCellXml,
  wordParagraph,
  wordParagraphXml,
  wordRun,
  wordTable,
  wordXmlEscape
}){
  function officialBlockXml(label,value){
    return wordParagraph(label,{bold:true,size:20,after:35}) + wordParagraph(value || " ",{size:20,after:0});
  }

  function officialTwoColumnXml(leftLabel,leftValue,rightLabel,rightValue,options={}){
    const after=Number.isFinite(options.after) ? options.after : 25;
    return wordTable([[
      {xml:officialBlockXml(leftLabel,leftValue),vAlign:"top"},
      {xml:officialBlockXml(rightLabel,rightValue),vAlign:"top"}
    ]],[4815,4815],{noBorders:true}) + wordBlank(after);
  }

  function officialInlineParagraph(label,value){
    return wordParagraphXml(wordRun(label,{bold:true,size:20}) + wordRun(value || " ",{size:20}),{after:45});
  }

  function buildOfficialProtocolWordDocumentXml(protocol={},officialData={},mode="ok"){
    const site=getSelectedSite() || {};
    const operator=officialOperatorText(officialData.operator);
    const objectAddress=safe(officialData.objectAddress);
    const place=protocol.pbzLocation || protocolSourceLocationFromSite(site) || "";
    const controlDate=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
    const nextDate=officialProtocolNextDate(protocol,site);
    const controlSubject=OFFICIAL_CONTROL_SUBJECT_TEXT;
    const manufacturer=officialManufacturerText(officialData);
    const tech="Ing. Michal Tipek";
    const blocks=[
      wordParagraph("Doklad o servisní kontrole a zkoušce provozuschopnosti PBZ",{align:"center",bold:true,size:26,after:30}),
      wordParagraph("dle zákona č. 133/1985 a vyhlášky 246/2001 Sb.",{align:"center",size:20,after:20}),
      wordParagraph("Doklad byl sestaven dle vyhl. 246/2001 Sb. §7, odst.8, písm. a – f.",{align:"center",size:20,after:120}),
      officialTwoColumnXml("a) Provozovatel PBZ:",operator,"b) Adresa objektu kde je PBZ umístěno:",objectAddress,{after:0}),
      officialInlineParagraph("c) Umístění PBZ: ",place),
      officialInlineParagraph("d) Typ záložního zdroje, Výrobní číslo, plomba: ",officialProtocolDeviceLine(protocol,site)),
      officialTwoColumnXml("e) Kontrolní subjekt:",controlSubject,"f) Výrobce PBZ:",manufacturer,{after:70}),
      officialInlineParagraph("g) Výsledek kontroly provozuschopnosti: ",officialProtocolResultText(mode)),
      officialInlineParagraph("h) Výsledek funkčních zkoušek: ",officialProtocolFunctionalText(mode)),
      officialInlineParagraph("i) Datum provedení kontroly: ",controlDate),
      officialInlineParagraph("j) Datum příští kontroly do: ",nextDate),
      wordParagraph("k) Potvrzení kontrolního subjektu:",{bold:true,size:20,after:45}),
      wordParagraph("Potvrzujeme, že jsme provedli funkční zkoušku a kontrolu provozuschopnosti výše uvedeného zařízení v souladu s platnými právními předpisy §6 a §7 vyhlášky MV246/2001 Sb., normativními požadavky, dokumentací a technickými podmínkami výrobce.",{size:20,after:70}),
      officialInlineParagraph("l) Zařízení pracuje ve vyhovujících podmínkách: ",officialProtocolConditionsText(protocol,mode)),
      wordParagraph("Poznámky:",{bold:true,size:20,after:35}),
      officialProtocolMeasurementNotesXml(protocol,officialProtocolCustomerNote(protocol,officialData),25),
      wordBlank(180),
      wordTable([
        [
          {text:"______________________________________",size:18,align:"center"},
          {xml:wordClientSignatureCellXml(protocol,{compact:true}) + wordParagraph("______________________________________",{size:18,align:"center"})}
        ],
        [
          {text:`Servis záložních zdrojů s.r.o. – ${tech}`,size:18,align:"center"},
          {text:"převzal za objednavatele",size:18,align:"center"}
        ]
      ],[4815,4815],{noBorders:true})
    ];
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
<w:body>${blocks.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="700" w:right="850" w:bottom="700" w:left="850" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  }

  function buildOfficialProtocolWordEntries(protocol={},officialData={},mode="ok"){
    const currentUser=getCurrentUser();
    const selectedSite=getSelectedSite();
    const now=new Date().toISOString();
    const title=`Doklad provozuschopnosti ${protocol.siteName || protocol.place || selectedSite?.adresa || ""}`.trim();
    const signatureBytes=protocolSignatureImageBytes(protocol);
    const imageContentType=signatureBytes ? '<Default Extension="png" ContentType="image/png"/>' : "";
    const imageRel=signatureBytes ? '<Relationship Id="rIdSignature" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/client-signature.png"/>' : "";
    const entries=[
      {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${imageContentType}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`},
      {name:"_rels/.rels",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'},
      {name:"word/_rels/document.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${imageRel}</Relationships>`},
      {name:"word/document.xml",data:buildOfficialProtocolWordDocumentXml(protocol,officialData,mode)},
      {name:"word/styles.xml",data:buildProtocolWordStylesXml()},
      {name:"word/settings.xml",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/><w:defaultTabStop w:val="708"/><w:compat/></w:settings>'},
      {name:"docProps/core.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${wordXmlEscape(title)}</dc:title><dc:creator>${wordXmlEscape(protocol.createdBy || protocol.technicianEmail || currentUser?.email || "")}</dc:creator><cp:lastModifiedBy>${wordXmlEscape(currentUser?.email || "")}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`},
      {name:"docProps/app.xml",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Servis záložních zdrojů - mapa FZ</Application></Properties>'}
    ];
    if(signatureBytes) entries.push({name:"word/media/client-signature.png",data:signatureBytes});
    return entries;
  }

  return {
    buildOfficialProtocolWordEntries
  };
}
