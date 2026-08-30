export function createOfficialProtocolTextHelpers({
  NEXT_CHECK_KEYS,
  OFFICIAL_DEFAULT_MANUFACTURER_TEXT,
  OFFICIAL_MANUFACTURERS,
  addMonths,
  first,
  formatDateCz,
  getSelectedSite,
  parseDateValue,
  periodMonths,
  protocolDeviceTypeFromSite,
  protocolDisplayDate,
  protocolExportValue,
  protocolSerialFromSite,
  protocolSourceLocationFromSite,
  safe,
  simpleNorm,
  wordBlank,
  wordParagraph,
  wordTable
}){
  function officialOneLine(value,maxLength=0){
    const text=protocolExportValue(value).replace(/\u00a0/g," ").replace(/\s+/g," ").trim();
    if(!maxLength || text.length<=maxLength) return text;
    return `${text.slice(0,Math.max(0,maxLength-3)).trim()}...`;
  }

  function officialMultiline(value,maxLines=4){
    const lines=protocolExportValue(value)
      .replace(/\u00a0/g," ")
      .replace(/\r\n/g,"\n")
      .replace(/\r/g,"\n")
      .split("\n")
      .map(line=>officialOneLine(line))
      .filter(Boolean);
    if(maxLines>1 && lines.length>maxLines){
      const head=lines.slice(0,maxLines-1);
      const tail=lines.slice(maxLines-1).join(", ");
      return head.concat([officialOneLine(tail)]).slice(0,maxLines);
    }
    while(lines.length<maxLines) lines.push("");
    return lines.slice(0,maxLines);
  }

  function officialOperatorLines(value,maxLines=4){
    return officialMultiline(value,maxLines);
  }

  function officialOperatorText(value){
    return officialOperatorLines(value,5).filter(Boolean).join("\n");
  }

  function officialIcoValue(value){
    return officialOneLine(value).replace(/^(i[čc]o|i[čc]|ico)\s*[:：]?\s*/i,"");
  }

  function officialMeasurementValue(value,unit){
    let text=officialOneLine(value);
    if(!text) return "";
    if(unit==="VAC") text=text.replace(/\s*VAC\.?\s*$/i,"");
    if(unit==="VDC") text=text.replace(/\s*VDC\.?\s*$/i,"");
    if(unit==="TEMP") text=text.replace(/\s*(°C|C)\s*$/i,"");
    return text.trim();
  }

  function officialCombinedMeasurement(...values){
    return values.map(value=>officialMeasurementValue(value,"VDC")).filter(Boolean).join(" / ");
  }

  function officialRtfEscape(value){
    const text=protocolExportValue(value);
    let out="";
    for(const ch of text){
      if(ch==="\n"){
        out+="\\line ";
        continue;
      }
      if(ch==="\\") out+="\\\\";
      else if(ch==="{") out+="\\{";
      else if(ch==="}") out+="\\}";
      else{
        const code=ch.codePointAt(0);
        if(code===160) out+="\\~";
        else if(code<128) out+=ch;
        else out+=`\\u${code>32767 ? code-65536 : code}?`;
      }
    }
    return out;
  }

  function officialProtocolResultText(mode){
    return mode==="stop" ? "--- STOP STAV ---" : "--bez závad--";
  }

  function officialProtocolFunctionalText(mode){
    return mode==="stop" ? "--- ZAŘÍZENÍ NENÍ PROVOZUSCHOPNÉ ---" : "--zařízení je provozuschopné--";
  }

  function officialProtocolConditionsValue(protocol={},mode="ok"){
    if(typeof protocol.conditions==="boolean") return protocol.conditions ? "ano" : "ne";
    const normalized=simpleNorm(protocol.conditions);
    if(normalized){
      if(normalized==="ne" || normalized==="no" || normalized==="false" || normalized==="0" || normalized.includes("nevyhov")) return "ne";
      if(normalized==="ano" || normalized==="yes" || normalized==="true" || normalized==="1" || normalized==="ok" || normalized.includes("vyhov")) return "ano";
    }
    return mode==="stop" ? "ne" : "ano";
  }

  function officialProtocolConditionsReasonText(protocol={}){
    const reason=officialOneLine(protocol.conditionsReason || protocol.environmentReason || protocol.reason || "",90);
    return reason ? ` Důvod: ${reason}` : "";
  }

  function officialProtocolConditionsText(protocol={},mode="ok"){
    return `-- ${officialProtocolConditionsValue(protocol,mode)} --${officialProtocolConditionsReasonText(protocol)}`;
  }

  function officialProtocolConditionsTail(protocol={},mode="ok"){
    return `${officialProtocolConditionsValue(protocol,mode)} --${officialProtocolConditionsReasonText(protocol)}`;
  }

  function officialProtocolNextDate(protocol={},site=getSelectedSite()){
    const explicit=protocol.nextDate || protocol.nextCheck || site?.pristi || first(site?.raw || {},NEXT_CHECK_KEYS);
    const explicitDate=parseDateValue(explicit);
    if(explicitDate) return formatDateCz(explicitDate);
    const control=parseDateValue(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
    if(!control) return "";
    const p=simpleNorm(protocol.period);
    const months=p.includes("12") ? 12 : (p.includes("6") ? 6 : periodMonths(site));
    return formatDateCz(addMonths(control,months));
  }

  function officialProtocolRemedyMonth(protocol={}){
    const control=parseDateValue(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
    if(!control) return "";
    const remedy=addMonths(control,2);
    const month=String(remedy.getMonth()+1).padStart(2,"0");
    return `${month}/${remedy.getFullYear()}`;
  }

  function officialProtocolDeviceLine(protocol={},site=getSelectedSite()){
    const device=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || protocolDeviceTypeFromSite(site);
    const serial=protocol.serial || protocolSerialFromSite(site);
    const seal=protocol.seal || "";
    return [device,serial,seal].map(safe).filter(Boolean).join(", ");
  }

  function officialProtocolCustomerNote(protocol={},officialData={}){
    return safe(protocol.customerNote || protocol.noteForCustomer || protocol.customerProtocolNote || officialData.note || "");
  }

  function officialMeasurementLineText(label,value,unit){
    const measured=unit==="RAW" ? officialOneLine(value) : officialMeasurementValue(value,unit);
    let suffix="";
    if(measured){
      if(unit==="VAC") suffix=" VAC";
      if(unit==="VDC") suffix=" VDC";
      if(unit==="TEMP" && /^[-+]?\d/.test(measured)) suffix=" °C";
    }
    return `${label} –${measured ? ` ${measured}${suffix}` : ""}`;
  }

  function officialOptionalMeasurementLineText(label,value,unit){
    const measured=unit==="RAW" ? officialOneLine(value) : officialMeasurementValue(value,unit);
    return measured ? officialMeasurementLineText(label,value,unit) : "";
  }

  function officialMeasurementPairValue(firstValue,secondValue,unit){
    const first=officialMeasurementValue(firstValue,unit);
    const second=officialMeasurementValue(secondValue,unit);
    if(first && second) return `1: ${first}   2: ${second}`;
    return first || second;
  }

  function officialProtocolMeasurementColumns(protocol={}){
    const unbalance=officialCombinedMeasurement(protocol.unbalance1,protocol.unbalance2);
    const output1=officialMeasurementLineText("Výstup 1",protocol.output1Vac,"VAC");
    const backup1=officialMeasurementLineText("Výstup při záloze 1",protocol.backup1Vac,"VAC");
    return {
      left:[
        officialMeasurementLineText("Vstup",protocol.inputVac,"VAC"),
        output1,
        backup1,
        officialMeasurementLineText("Pomocná baterie",protocol.auxBatVdc,"VDC")
      ],
      right:[
        officialOptionalMeasurementLineText("Výstup 2",protocol.output2Vac,"VAC"),
        officialOptionalMeasurementLineText("Výstup při záloze 2",protocol.backup2Vac,"VAC"),
        officialMeasurementLineText("Hlavní baterie",protocol.mainBatVdc,"VDC"),
        officialMeasurementLineText("Rozvážení baterií",unbalance,"VDC"),
        officialMeasurementLineText("Teplota v okolí",protocol.temperature,"TEMP")
      ].filter(line=>safe(line).trim())
    };
  }

  function officialProtocolMeasurementNotesXml(protocol={},extraNote="",after=80){
    const columns=officialProtocolMeasurementColumns(protocol);
    const columnXml=lines=>lines.filter(line=>safe(line).trim()).map(line=>wordParagraph(line,{size:22,after:0})).join("");
    const notes=[];
    if(safe(protocol.notes || protocol.issues)) notes.push(`Poznámka z protokolu – ${safe(protocol.notes || protocol.issues)}`);
    if(safe(extraNote)) notes.push(`Poznámka do dokladu – ${safe(extraNote)}`);
    const notesXml=notes.map(text=>wordParagraph(text,{size:22,after:0})).join("");
    return wordTable([[
      {xml:columnXml(columns.left),vAlign:"top"},
      {xml:columnXml(columns.right),vAlign:"top"}
    ]],[4815,4815],{noBorders:true}) + (notesXml ? wordBlank(10) + notesXml : "") + wordBlank(after);
  }

  function officialManufacturerTextByKey(key){
    return (OFFICIAL_MANUFACTURERS[key] || OFFICIAL_MANUFACTURERS.szz).text;
  }

  function officialManufacturerText(officialData={}){
    if(officialData.manufacturerKey) return officialManufacturerTextByKey(officialData.manufacturerKey);
    const text=protocolExportValue(officialData.manufacturer).trim();
    if(!text) return OFFICIAL_DEFAULT_MANUFACTURER_TEXT;
    const normalized=simpleNorm(text);
    if(normalized.includes("servis zaloznich zdroju") && normalized.includes("118823")){
      return text
        .replace(/,\s*C\s*118823\/KSBR\s*Krajský\s+soud\s+v\s+Brně/i,"\nC 118823/KSBR Krajský soud v Brně")
        .replace(/\n\s*C\s*118823\/KSBR\s*Krajský\s+soud\s+v\s+Brně/i,"\nC 118823/KSBR Krajský soud v Brně");
    }
    if(normalized.includes("servis zaloznich zdroju") && normalized.includes("09391126") && !normalized.includes("118823")){
      const lines=text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
      const lineIndex=lines.findIndex(line=>/I[ČC]O|I[ČC]|ICO/i.test(line));
      if(lineIndex>=0){
        lines[lineIndex]=lines[lineIndex].replace(/\s+$/,"");
        lines.splice(lineIndex+1,0,"C 118823/KSBR Krajský soud v Brně");
        return lines.join("\n");
      }
      return OFFICIAL_DEFAULT_MANUFACTURER_TEXT;
    }
    return text;
  }

  function officialRtfMeasurementTextLine(text){
    return `{\\rtlch\\fcs1 \\af0\\afs24 \\ltrch\\fcs0 \\fs24 ${officialRtfEscape(text)}\\par }`;
  }

  function officialRtfCompactMeasurements(protocol={}){
    const columns=officialProtocolMeasurementColumns(protocol);
    const leftRows=columns.left.map(officialRtfMeasurementTextLine).join("");
    const rightRows=columns.right.map(officialRtfMeasurementTextLine).join("");
    return `{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\sect }\\sectd \\ltrsect\\sbknone\\linex0\\headery708\\footery708\\cols2\\colsx2\\endnhere\\sectdefaultcl \\pard\\plain \\ltrpar\\ql \\li0\\ri0\\sb0\\sa0\\sl260\\slmult1\\nowidctlpar\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 \\rtlch\\fcs1 \\af24\\afs24\\alang1081 \\ltrch\\fcs0 \\fs24\\lang1029\\langfe2052\\kerning3\\cgrid\\langnp1029\\langfenp2052 ${leftRows}\\column ${rightRows}`;
  }

  function compactOfficialRtfMeasurementSection(output,protocol={}){
    const compact=`${officialRtfCompactMeasurements(protocol)}{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\sect }`;
    const patterns=[
      /\{\\rtlch\\fcs1 [^{}]*?\\sect \}\\sectd \\ltrsect\\sbknone\\linex0\\headery708\\footery708\\cols2\\colsx2[\s\S]*?Pomocn\\'e1 baterie \\endash[\s\S]*?\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\insrsid3878691\\charrsid536511 \\sect \}/,
      /\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 [^{}]*Vstup \\endash[\s\S]*?Pomocn\\'e1 baterie \\endash[\s\S]*?\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\insrsid3878691\\charrsid536511 \\sect \}/
    ];
    for(const pattern of patterns){
      if(pattern.test(output)) return output.replace(pattern,compact);
    }
    return output;
  }

  function officialProtocolTemplateValues(protocol={},officialData={},mode="ok"){
    const site=getSelectedSite() || {};
    const operator=officialOperatorLines(officialData.operator,5);
    const object=officialMultiline(officialData.objectAddress,4);
    const operatorFourthLine=[operator[3],operator[4]].filter(Boolean).join("\n");
    const controlDate=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
    const device=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || protocolDeviceTypeFromSite(site);
    const serial=protocol.serial || protocolSerialFromSite(site);
    const seal=protocol.seal || "";
    const tech="Ing. Michal Tipek";
    return {
      "__SZZ_OPERATOR_1__":operator[0],
      "__SZZ_OPERATOR_2__":operator[1],
      "__SZZ_OPERATOR_3__":operator[2],
      "__SZZ_OPERATOR_4__":operatorFourthLine,
      "__SZZ_OBJECT_1__":object[0],
      "__SZZ_OBJECT_2__":object[1],
      "__SZZ_OBJECT_3__":object[2],
      "__SZZ_OBJECT_4__":object[3],
      "__SZZ_LOCATION__":officialOneLine(protocol.pbzLocation || protocolSourceLocationFromSite(site) || ""),
      "__SZZ_DEVICE__":officialOneLine(device),
      "__SZZ_SERIAL__":officialOneLine(serial || "-"),
      "__SZZ_SEAL__":officialOneLine(seal || "-"),
      "__SZZ_RESULT__":` ${officialProtocolResultText(mode)}`,
      "__SZZ_FUNCTIONAL__":` ${officialProtocolFunctionalText(mode)}`,
      "__SZZ_CONTROL_DATE__":controlDate,
      "__SZZ_NEXT_DATE__":officialProtocolNextDate(protocol,site),
      "__SZZ_REMEDY_DATE__":officialProtocolRemedyMonth(protocol),
      "__SZZ_CONDITIONS__":officialProtocolConditionsTail(protocol,mode),
      "__SZZ_INPUT__":officialMeasurementValue(protocol.inputVac,"VAC"),
      "__SZZ_OUTPUT__":officialMeasurementPairValue(protocol.output1Vac,protocol.output2Vac,"VAC"),
      "__SZZ_BACKUP__":officialMeasurementPairValue(protocol.backup1Vac,protocol.backup2Vac,"VAC"),
      "__SZZ_AUX__":officialMeasurementValue(protocol.auxBatVdc,"VDC"),
      "__SZZ_MAIN__":officialMeasurementValue(protocol.mainBatVdc,"VDC"),
      "__SZZ_UNBALANCE__":officialOneLine(officialCombinedMeasurement(protocol.unbalance1,protocol.unbalance2)),
      "__SZZ_TEMP__":officialMeasurementValue(protocol.temperature,"TEMP"),
      "__SZZ_NOTE__":officialOneLine(officialProtocolCustomerNote(protocol,officialData),130),
      "__SZZ_TECH__":officialOneLine(tech)
    };
  }

  return {
    compactOfficialRtfMeasurementSection,
    officialIcoValue,
    officialManufacturerText,
    officialManufacturerTextByKey,
    officialMultiline,
    officialOneLine,
    officialOperatorLines,
    officialOperatorText,
    officialProtocolConditionsText,
    officialProtocolCustomerNote,
    officialProtocolDeviceLine,
    officialProtocolFunctionalText,
    officialProtocolMeasurementNotesXml,
    officialProtocolNextDate,
    officialProtocolResultText,
    officialProtocolTemplateValues,
    officialRtfEscape
  };
}
