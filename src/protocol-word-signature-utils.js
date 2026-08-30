export function createProtocolWordSignatureHelpers({
  protocolSignatureImageBytes,
  protocolTechnicianDisplayName,
  protocolTechnicianSignatureImageBytes,
  safe,
  wordParagraph,
  wordParagraphXml,
  wordTable,
  wordXmlEscape
}){
  function wordSignatureImageRun(relId="rIdSignature",options={}){
    const cx=Number(options.cx) || 2600000;
    const cy=Number(options.cy) || 760000;
    const docId=Number(options.docId) || 7;
    const name=wordXmlEscape(options.name || "Podpis objednavatele");
    const fileName=wordXmlEscape(options.fileName || "podpis.png");
    return `<w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${docId}" name="${name}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${docId}" name="${fileName}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
  }

  function wordClientSignatureCellXml(protocol={},options={}){
    const compact=!!options.compact;
    const parts=[];
    if(safe(protocol.clientSign)) parts.push(wordParagraph(protocol.clientSign,{size:compact ? 16 : 18,after:compact ? 0 : 30}));
    if(protocolSignatureImageBytes(protocol)){
      const imageOptions=compact ? {cx:3800000,cy:1100000,name:"Podpis objednavatele",fileName:"podpis-objednavatele.png"} : {name:"Podpis objednavatele",fileName:"podpis-objednavatele.png"};
      parts.push(wordParagraphXml(wordSignatureImageRun("rIdSignature",imageOptions),{after:0}));
    }
    return parts.join("") || wordParagraph(" ",{size:18,after:0});
  }

  function wordTechnicianSignatureCellXml(protocol={}){
    const tech=protocolTechnicianDisplayName(protocol,{allowCurrentFallback:true});
    const parts=[];
    if(safe(tech)) parts.push(wordParagraph(tech,{size:18,after:protocolTechnicianSignatureImageBytes(protocol) ? 20 : 0}));
    if(protocolTechnicianSignatureImageBytes(protocol)){
      parts.push(wordParagraphXml(wordSignatureImageRun("rIdTechSignature",{
        cx:3400000,
        cy:980000,
        docId:8,
        name:"Podpis technika",
        fileName:"podpis-technika.png"
      }),{after:0}));
    }
    return parts.join("") || wordParagraph(" ",{size:18,after:0});
  }

  function wordSignatureGrid(protocol={}){
    return wordTable([
      [
        {text:"Za objednavatele:",bold:true,size:18,fill:"F2F2F2"},
        {text:"Kontrolu provedl:",bold:true,size:18,fill:"F2F2F2"}
      ],
      [
        {xml:wordClientSignatureCellXml(protocol),height:1050},
        {xml:wordTechnicianSignatureCellXml(protocol),height:1050}
      ]
    ],[4815,4815]) + wordParagraph("(čitelně + podpis)",{size:16,after:35});
  }

  return {
    wordClientSignatureCellXml,
    wordSignatureGrid
  };
}
