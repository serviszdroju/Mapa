export function createOfficialRtfTemplateHelpers({
  OFFICIAL_CONTROL_SUBJECT_TEXT,
  addOfficialRtfSignatures,
  addOfficialRtfWatermark,
  compactOfficialRtfMeasurementSection,
  officialManufacturerText,
  officialMultiline,
  officialOneLine,
  officialOperatorLines,
  officialProtocolCustomerNote,
  officialProtocolTemplateValues,
  officialRtfEscape,
  safe
}){
  function officialRtfRun(text,{bold=false,underline=false}={}){
    const styles=[
      "\\rtlch\\fcs1",
      bold ? "\\ab" : "",
      "\\af0\\afs22",
      "\\ltrch\\fcs0",
      bold ? "\\b" : "",
      "\\fs22",
      underline ? "\\ul" : ""
    ].filter(Boolean).join(" ");
    return `{${styles} ${officialRtfEscape(text)}}`;
  }

  function officialRtfSubjectBlock(officialData={}){
    const left=officialMultiline(OFFICIAL_CONTROL_SUBJECT_TEXT,5);
    const right=officialMultiline(officialManufacturerText(officialData),5);
    const paragraph="\\pard \\ltrpar\\ql \\li0\\ri0\\sl250\\slmult1\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 ";
    const heading=`${paragraph}${officialRtfRun("e) Kontrolní subjekt:",{bold:true,underline:true})}\\tab ${officialRtfRun("f) Výrobce PBZ:",{bold:true,underline:true})}\\par`;
    const rows=left.map((line,idx)=>`${paragraph}${officialRtfRun(line || " ")}\\tab ${officialRtfRun(right[idx] || " ")}\\par`).join("\n");
    const blank=`${paragraph}${officialRtfRun(" ")}\\tab ${officialRtfRun(" ")}\\par`;
    return `${heading}\n${blank}\n${rows}\n${blank}\n`;
  }

  function officialRtfOperatorObjectBlock(officialData={}){
    const left=officialOperatorLines(officialData.operator,5).filter(Boolean);
    const right=officialMultiline(officialData.objectAddress,5).filter(Boolean);
    const rowCount=Math.max(left.length,right.length,1);
    const paragraph="\\pard \\ltrpar\\ql \\li0\\ri0\\sl250\\slmult1\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 ";
    const heading=`${paragraph}${officialRtfRun("a) Provozovatel PBZ:",{bold:true,underline:true})}\\tab ${officialRtfRun("b) Adresa objektu kde je PBZ umístěno:",{bold:true,underline:true})}\\par`;
    const rows=Array.from({length:rowCount},(_,idx)=>`${paragraph}${officialRtfRun(left[idx] || " ")}\\tab ${officialRtfRun(right[idx] || " ")}\\par`).join("\n");
    const blank=`${paragraph}${officialRtfRun(" ")}\\tab ${officialRtfRun(" ")}\\par`;
    return `${heading}\n${blank}\n${rows}\n`;
  }

  function replaceOfficialRtfOperatorObjectBlock(output,officialData={}){
    const operatorLabel="Provozovatel PBZ:";
    const locationLabel="Um\\'edst\\'ecn\\'ed PBZ:";
    const labelIndex=output.indexOf(operatorLabel);
    const locationIndex=output.indexOf(locationLabel,labelIndex);
    if(labelIndex<0 || locationIndex<0) return output;
    const aMarker=output.lastIndexOf(" a)}",labelIndex);
    const start=aMarker>=0 ? output.lastIndexOf("{\\rtlch",aMarker) : output.lastIndexOf("{\\rtlch",labelIndex);
    const end=output.lastIndexOf("\\pard\\plain",locationIndex);
    if(start<0 || end<0 || end<=start) return output;
    return `${output.slice(0,start)}${officialRtfOperatorObjectBlock(officialData)}${output.slice(end)}`;
  }

  function replaceOfficialRtfSubjectBlock(output,officialData={}){
    const manufacturerLabel="V\\'fdrobce PBZ:";
    const labelIndex=output.indexOf(manufacturerLabel);
    if(labelIndex<0) return output;
    const resultIndex=output.indexOf("{\\*\\bkmkstart _Hlk56757522}",labelIndex);
    const resultStart=output.lastIndexOf("{\\rtlch\\fcs1",resultIndex);
    const start=output.lastIndexOf("\\pard \\ltrpar\\ql \\li0\\ri0\\nowidctlpar\\tx4962",labelIndex);
    if(start<0 || resultStart<0 || resultStart<=start) return output;
    return `${output.slice(0,start)}${officialRtfSubjectBlock(officialData)}${output.slice(resultStart)}`;
  }

  function rtfVisibleText(segment){
    return safe(segment)
      .replace(/\\'[0-9a-fA-F]{2}/g,"x")
      .replace(/\\[a-zA-Z]+-?\d* ?/g,"")
      .replace(/[{}]/g,"")
      .trim();
  }

  function removeOfficialRtfBlankBeforeLocation(output){
    const labelIndex=output.indexOf("Um\\'edst\\'ecn\\'ed PBZ:");
    if(labelIndex<0) return output;
    const locationLabelRunStart=output.lastIndexOf("{\\rtlch",labelIndex);
    const locationMarkerRunStart=output.lastIndexOf("{\\rtlch",locationLabelRunStart-1);
    const locationRunStart=locationMarkerRunStart>=0 ? locationMarkerRunStart : locationLabelRunStart;
    const sectionStart=output.lastIndexOf("\\sectdefaultcl",locationRunStart);
    const paragraphStart=output.indexOf("\\pard\\plain",sectionStart);
    const firstRunStart=output.indexOf("{\\rtlch",paragraphStart);
    const blankEnd=output.lastIndexOf("\\par }",locationRunStart);
    if(sectionStart<0 || paragraphStart<0 || firstRunStart<0 || blankEnd<firstRunStart) return output;
    const blankParagraph=output.slice(firstRunStart,blankEnd+"\\par }".length);
    if(blankParagraph.length>1800 || rtfVisibleText(blankParagraph)) return output;
    const paragraphPrefix=output.slice(paragraphStart,firstRunStart);
    return `${output.slice(0,paragraphStart)}${paragraphPrefix}${output.slice(locationRunStart)}`;
  }

  function removeOfficialSpacerRunBeforeMarker(block,marker){
    const idx=block.indexOf(marker);
    if(idx<0) return block;
    const before=block.slice(0,idx);
    const after=block.slice(idx);
    const cleaned=before.replace(/(\{\\rtlch\\fcs1[^{}]*(?:I\\'c8O:\s*|\s+)\})\s*(\{\\rtlch\\fcs1[^{}]*\s*)$/,"$2");
    return `${cleaned}${after}`;
  }

  function normalizeOfficialRtfOperatorBlock(output){
    const first=output.indexOf("__SZZ_OPERATOR_1__");
    const object=output.indexOf("__SZZ_OBJECT_1__",first);
    if(first<0 || object<0) return output;
    const start=output.lastIndexOf("\\pard\\plain",first);
    const blockStart=start>=0 ? start : first;
    let block=output.slice(blockStart,object);
    block=block.replace(/\\li142/g,"\\li0").replace(/\\lin142/g,"\\lin0");
    [
      "__SZZ_OPERATOR_1__",
      "__SZZ_OPERATOR_2__",
      "__SZZ_OPERATOR_3__",
      "__SZZ_OPERATOR_4__"
    ].forEach(marker=>{
      block=removeOfficialSpacerRunBeforeMarker(block,marker);
    });
    return `${output.slice(0,blockStart)}${block}${output.slice(object)}`;
  }

  function shrinkOfficialRtfTextSize(output){
    return output.replace(/\\(a?fs)(\d+)/g,(match,prefix,sizeText)=>{
      const size=Number(sizeText);
      if(!Number.isFinite(size) || size<=10) return match;
      return `\\${prefix}${Math.max(10,size-2)}`;
    });
  }

  function compactOfficialRtfEmptyNoteBeforeSignatures(output,officialData={}){
    return output.replace(/\\par\s*\\par\s*(\}\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\fs22\\insrsid3356663\\charrsid9718217 \{\\\*\\bkmkstart _Hlk178752668\})/,"\\par $1");
  }

  function officialRtfHighlightedNoteRun(text,{bold=false,underline=false}={}){
    const rtlBold=bold ? "\\ab" : "";
    const ltrBold=bold ? "\\b" : "";
    const underlineStyle=underline ? "\\ul" : "";
    return `{\\rtlch\\fcs1 ${rtlBold}\\af0\\afs22 \\ltrch\\fcs0 ${ltrBold}\\fs22${underlineStyle}\\highlight7 ${officialRtfEscape(text)}}`;
  }

  function inlineOfficialRtfNoteHeading(output,officialData={},protocol={}){
    const note=officialOneLine(officialProtocolCustomerNote(protocol,officialData),130);
    if(!note) return output;
    const marker="Pozn\\'e1mky:";
    const idx=output.indexOf(marker);
    if(idx<0) return output;
    const insertion=officialRtfHighlightedNoteRun(` ${note}`);
    return `${output.slice(0,idx+marker.length)}${insertion}${output.slice(idx+marker.length)}`;
  }

  function removeOfficialRtfOperatorIcoLabel(output){
    const marker="__SZZ_OPERATOR_4__";
    const idx=output.indexOf(marker);
    if(idx<0) return output;
    const label="I\\'c8O:";
    const start=output.lastIndexOf(label,idx);
    if(start>=0 && idx-start<260){
      return `${output.slice(0,start)}     ${output.slice(start+label.length)}`;
    }
    return output;
  }

  function normalizeOfficialRtfClientLabel(output){
    return output.replace(/p\\'f8\s*evzal za provozovatele/g,"p\\'f8evzal za objednavatele");
  }

  function highlightOfficialStopResultLetter(output,mode="ok"){
    if(mode!=="stop") return output;
    return output
      .replace(
        /(\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\b\\fs22)(\\insrsid2818420\\charrsid9718217 \{\\\*\\bkmkstart _Hlk56757522\}g\})/,
        "$1\\highlight7$2"
      )
      .replace(
        /(\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\b\\fs22)(\\insrsid7237376\\charrsid9718217 \) \})/,
        "$1\\highlight7$2"
      );
  }

  function fillOfficialRtfTemplate(template,protocol={},officialData={},mode="ok"){
    let output=removeOfficialRtfOperatorIcoLabel(template);
    output=replaceOfficialRtfOperatorObjectBlock(output,officialData);
    output=normalizeOfficialRtfOperatorBlock(output);
    output=replaceOfficialRtfSubjectBlock(output,officialData);
    const values=officialProtocolTemplateValues(protocol,officialData,mode);
    Object.entries(values).forEach(([placeholder,value])=>{
      output=output.replaceAll(placeholder,officialRtfEscape(value));
    });
    output=inlineOfficialRtfNoteHeading(output,officialData,protocol);
    output=highlightOfficialStopResultLetter(output,mode);
    output=compactOfficialRtfEmptyNoteBeforeSignatures(output,officialData);
    output=compactOfficialRtfMeasurementSection(output,protocol);
    output=addOfficialRtfWatermark(output,officialData);
    output=addOfficialRtfSignatures(output,protocol,officialData);
    output=normalizeOfficialRtfClientLabel(output);
    output=shrinkOfficialRtfTextSize(output);
    return output;
  }

  return {
    fillOfficialRtfTemplate
  };
}
