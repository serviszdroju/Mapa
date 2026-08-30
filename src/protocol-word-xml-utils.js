export function createProtocolWordXmlHelpers({
  protocolExportValue
}){
  function wordXmlEscape(value){
    return protocolExportValue(value)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&apos;");
  }

  function wordTextXml(value){
    const raw=protocolExportValue(value);
    if(!raw) return '<w:t xml:space="preserve"> </w:t>';
    return raw.split(/\r?\n/).map((part,idx)=>`${idx ? "<w:br/>" : ""}<w:t xml:space="preserve">${wordXmlEscape(part)}</w:t>`).join("");
  }

  function wordRun(value,options={}){
    const props=[
      '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>',
      `<w:sz w:val="${options.size || 20}"/>`,
      `<w:szCs w:val="${options.size || 20}"/>`
    ];
    if(options.bold) props.push("<w:b/><w:bCs/>");
    if(options.italic) props.push("<w:i/><w:iCs/>");
    if(options.color) props.push(`<w:color w:val="${options.color}"/>`);
    return `<w:r><w:rPr>${props.join("")}</w:rPr>${wordTextXml(value)}</w:r>`;
  }

  function wordParagraphXml(runXml,options={}){
    const props=[];
    if(options.align) props.push(`<w:jc w:val="${options.align}"/>`);
    props.push(`<w:spacing w:before="${options.before || 0}" w:after="${options.after ?? 0}" w:line="220" w:lineRule="auto"/>`);
    return `<w:p><w:pPr>${props.join("")}</w:pPr>${runXml || wordRun(" ")}</w:p>`;
  }

  function wordParagraph(value,options={}){
    return wordParagraphXml(wordRun(value,options),options);
  }

  function wordBlank(after=60){
    return wordParagraph(" ",{size:4,after});
  }

  function wordCellXml(contentXml,width,options={}){
    const props=[
      `<w:tcW w:w="${width}" w:type="dxa"/>`,
      `<w:vAlign w:val="${options.vAlign || "center"}"/>`,
      '<w:tcMar><w:top w:w="45" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="45" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tcMar>'
    ];
    if(options.colSpan && options.colSpan>1) props.push(`<w:gridSpan w:val="${options.colSpan}"/>`);
    if(options.fill) props.push(`<w:shd w:fill="${options.fill}"/>`);
    return `<w:tc><w:tcPr>${props.join("")}</w:tcPr>${contentXml || wordParagraph(" ")}</w:tc>`;
  }

  function wordCellText(text,width,options={}){
    const paragraph=wordParagraph(text || " ",{
      size:options.size || 20,
      bold:!!options.bold,
      align:options.align || "left",
      after:0
    });
    return wordCellXml(paragraph,width,options);
  }

  function wordTable(rows,widths,options={}){
    const total=widths.reduce((sum,w)=>sum+w,0);
    const borders=options.noBorders
      ? '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'
      : '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="000000"/><w:left w:val="single" w:sz="4" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:color="000000"/><w:right w:val="single" w:sz="4" w:color="000000"/><w:insideH w:val="single" w:sz="4" w:color="000000"/><w:insideV w:val="single" w:sz="4" w:color="000000"/></w:tblBorders>';
    const grid=widths.map(width=>`<w:gridCol w:w="${width}"/>`).join("");
    const rowXml=rows.map(row=>{
      let colIndex=0;
      const minHeight=row.reduce((max,cell)=>Math.max(max,(cell && cell.height) || 0),0);
      const trPr=minHeight ? `<w:trPr><w:trHeight w:val="${minHeight}" w:hRule="atLeast"/></w:trPr>` : "";
      const cells=row.map(cell=>{
        const c=typeof cell==="string" ? {text:cell} : (cell || {});
        const span=c.colSpan || 1;
        const width=c.width || widths.slice(colIndex,colIndex+span).reduce((sum,w)=>sum+w,0);
        colIndex+=span;
        if(c.xml) return wordCellXml(c.xml,width,c);
        return wordCellText(c.text,width,c);
      }).join("");
      return `<w:tr>${trPr}${cells}</w:tr>`;
    }).join("");
    return `<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:tblLayout w:type="fixed"/>${borders}</w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rowXml}</w:tbl>`;
  }

  function wordFormField(label,value,width=9630){
    return wordTable([
      [{text:label,bold:true,size:18,fill:"F2F2F2"}],
      [{text:protocolExportValue(value) || " ",size:20,height:330}]
    ],[width]) + wordBlank(20);
  }

  function wordFormGrid(labels,values,widths){
    return wordTable([
      labels.map(label=>({text:label,bold:true,size:18,fill:"F2F2F2"})),
      values.map(value=>({text:protocolExportValue(value) || " ",size:20,height:330}))
    ],widths) + wordBlank(20);
  }

  return {
    wordBlank,
    wordFormField,
    wordFormGrid,
    wordParagraph,
    wordParagraphXml,
    wordRun,
    wordTable,
    wordXmlEscape
  };
}
