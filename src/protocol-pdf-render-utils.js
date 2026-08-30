export function createProtocolPdfRenderHelpers({
  drawImageContained,
  getSelectedSite=()=>({}),
  loadDataUrlImage,
  protocolAccessText,
  protocolAvailabilityText,
  protocolBackedDevicesText,
  protocolConditionsText,
  protocolDisplayDate,
  protocolExportValue,
  protocolMeasurementTableSpec,
  protocolPeriodText,
  protocolSourceStateLabel,
  protocolSourceStateValue,
  protocolSourceTestMethodLabel,
  protocolTechnicianDisplayName,
  safe
}){
  function wrapCanvasText(ctx,text,maxWidth){
    const paragraphs=String(text || "").split(/\r?\n/);
    const lines=[];
    paragraphs.forEach(paragraph=>{
      const words=paragraph.split(/\s+/).filter(Boolean);
      if(!words.length){
        lines.push("");
        return;
      }
      let line="";
      words.forEach(word=>{
        const test=line ? `${line} ${word}` : word;
        if(ctx.measureText(test).width<=maxWidth){
          line=test;
          return;
        }
        if(line) lines.push(line);
        line=word;
        while(ctx.measureText(line).width>maxWidth && line.length>1){
          let cut=line.length;
          while(cut>1 && ctx.measureText(line.slice(0,cut)).width>maxWidth) cut--;
          lines.push(line.slice(0,cut));
          line=line.slice(cut);
        }
      });
      lines.push(line);
    });
    return lines;
  }

  const PROTOCOL_PDF_PAGE_DXA_WIDTH=11906;
  const PROTOCOL_PDF_PAGE_WIDTH=1240;
  const PROTOCOL_PDF_PAGE_HEIGHT=1754;
  const PROTOCOL_PDF_DPI=150;
  const PROTOCOL_PDF_DXA_SCALE=PROTOCOL_PDF_PAGE_WIDTH/PROTOCOL_PDF_PAGE_DXA_WIDTH;

  function protocolPdfDxa(value){
    return Number(value || 0)*PROTOCOL_PDF_DXA_SCALE;
  }

  function protocolPdfWordFontPx(size=20){
    return Math.max(6,((Number(size) || 20)/2)*(PROTOCOL_PDF_DPI/72));
  }

  function protocolPdfLineHeight(size=20){
    return Math.ceil(protocolPdfWordFontPx(size)*1.15);
  }

  function protocolPdfApplyFont(ctx,options={}){
    const italic=options.italic ? "italic " : "";
    const weight=options.bold ? "700" : "400";
    const px=protocolPdfWordFontPx(options.size || 20).toFixed(2);
    ctx.font=`${italic}${weight} ${px}px "Times New Roman", Times, serif`;
  }

  function protocolPdfStartPage(state){
    const canvas=document.createElement("canvas");
    canvas.width=PROTOCOL_PDF_PAGE_WIDTH;
    canvas.height=PROTOCOL_PDF_PAGE_HEIGHT;
    const ctx=canvas.getContext("2d");
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.textBaseline="alphabetic";
    state.pages.push({canvas,ctx});
    state.canvas=canvas;
    state.ctx=ctx;
    state.y=protocolPdfDxa(850);
  }

  function protocolPdfEnsureSpace(state,height){
    if(!state.ctx || state.y+height>PROTOCOL_PDF_PAGE_HEIGHT-protocolPdfDxa(850)){
      protocolPdfStartPage(state);
    }
  }

  function protocolPdfDrawParagraph(state,text,options={}){
    const ctx=state.ctx;
    const before=protocolPdfDxa(options.before || 0);
    const after=protocolPdfDxa(options.after ?? 0);
    const width=protocolPdfDxa(9630);
    const fontSize=options.size || 20;
    protocolPdfApplyFont(ctx,options);
    const lines=wrapCanvasText(ctx,protocolExportValue(text) || " ",width);
    const lineHeight=protocolPdfLineHeight(fontSize);
    const height=before+(lines.length*lineHeight)+after;
    protocolPdfEnsureSpace(state,height);
    state.y+=before;
    ctx.fillStyle=options.color || "#000";
    ctx.textAlign=options.align==="center" ? "center" : "left";
    const x=options.align==="center" ? state.marginX+(width/2) : state.marginX;
    let baseline=state.y+protocolPdfWordFontPx(fontSize);
    for(const line of lines){
      ctx.fillText(line,x,baseline);
      baseline+=lineHeight;
    }
    ctx.textAlign="left";
    state.y+=lines.length*lineHeight+after;
  }

  function protocolPdfPreparedTableRows(ctx,rows=[],widths=[]){
    const scaledWidths=widths.map(protocolPdfDxa);
    const cellMargin={
      top:protocolPdfDxa(45),
      right:protocolPdfDxa(90),
      bottom:protocolPdfDxa(45),
      left:protocolPdfDxa(90)
    };
    return rows.map(row=>{
      let colIndex=0;
      let rowHeight=0;
      const cells=(row || []).map(inputCell=>{
        const cell=typeof inputCell==="string" ? {text:inputCell} : {...(inputCell || {})};
        const span=Math.max(1,Number(cell.colSpan) || 1);
        const width=cell.width ? protocolPdfDxa(cell.width) : scaledWidths.slice(colIndex,colIndex+span).reduce((sum,w)=>sum+w,0);
        colIndex+=span;
        const size=cell.size || 20;
        protocolPdfApplyFont(ctx,cell);
        const innerWidth=Math.max(10,width-cellMargin.left-cellMargin.right);
        const lines=wrapCanvasText(ctx,protocolExportValue(cell.text) || " ",innerWidth);
        const lineHeight=protocolPdfLineHeight(size);
        const contentHeight=(lines.length*lineHeight)+cellMargin.top+cellMargin.bottom;
        rowHeight=Math.max(rowHeight,protocolPdfDxa(cell.height || 0),contentHeight);
        return {cell,width,lines,lineHeight,size};
      });
      return {cells,height:rowHeight};
    });
  }

  function protocolPdfDrawTable(state,rows=[],widths=[],options={}){
    const ctx=state.ctx;
    const prepared=protocolPdfPreparedTableRows(ctx,rows,widths);
    const height=prepared.reduce((sum,row)=>sum+row.height,0);
    protocolPdfEnsureSpace(state,height);
    const cellMargin={
      top:protocolPdfDxa(45),
      right:protocolPdfDxa(90),
      bottom:protocolPdfDxa(45),
      left:protocolPdfDxa(90)
    };
    let y=state.y;
    prepared.forEach(row=>{
      let x=state.marginX;
      row.cells.forEach(({cell,width,lines,lineHeight,size})=>{
        if(cell.fill){
          ctx.fillStyle=`#${cell.fill}`;
          ctx.fillRect(x,y,width,row.height);
        }
        if(!options.noBorders){
          ctx.strokeStyle="#000";
          ctx.lineWidth=1;
          ctx.strokeRect(x,y,width,row.height);
        }
        protocolPdfApplyFont(ctx,cell);
        ctx.fillStyle=cell.color ? `#${cell.color}` : "#000";
        ctx.textAlign=cell.align==="center" ? "center" : "left";
        const textWidth=width-cellMargin.left-cellMargin.right;
        const textBlockHeight=lines.length*lineHeight;
        const fontPx=protocolPdfWordFontPx(size);
        const tx=cell.align==="center" ? x+(width/2) : x+cellMargin.left;
        let baseline=y+Math.max(cellMargin.top+fontPx,(row.height-textBlockHeight)/2+fontPx*.78);
        for(const line of lines){
          if(cell.align==="center"){
            ctx.fillText(line,tx,baseline,textWidth);
          }else{
            ctx.fillText(line,tx,baseline);
          }
          baseline+=lineHeight;
        }
        ctx.textAlign="left";
        x+=width;
      });
      y+=row.height;
    });
    state.y+=height;
  }

  function protocolPdfDrawBlank(state,after=60){
    state.y+=protocolPdfDxa(after)+protocolPdfWordFontPx(4);
  }

  function protocolPdfDrawFormField(state,label,value,width=9630,options={}){
    const rows=[
      [{text:label,bold:true,size:18,fill:"F2F2F2"}],
      [{text:protocolExportValue(value) || " ",size:20,height:330}]
    ];
    if(options.keepWithNextDxa){
      const prepared=protocolPdfPreparedTableRows(state.ctx,rows,[width]);
      const tableHeight=prepared.reduce((sum,row)=>sum+row.height,0);
      protocolPdfEnsureSpace(state,tableHeight+protocolPdfDxa(20)+protocolPdfWordFontPx(4)+protocolPdfDxa(options.keepWithNextDxa));
    }
    protocolPdfDrawTable(state,rows,[width]);
    protocolPdfDrawBlank(state,20);
  }

  function protocolPdfDrawFormGrid(state,labels,values,widths){
    protocolPdfDrawTable(state,[
      labels.map(label=>({text:label,bold:true,size:18,fill:"F2F2F2"})),
      values.map(value=>({text:protocolExportValue(value) || " ",size:20,height:330}))
    ],widths);
    protocolPdfDrawBlank(state,20);
  }

  function protocolPdfDrawMeasurementTable(state,protocol={}){
    const spec=protocolMeasurementTableSpec(protocol);
    protocolPdfDrawTable(state,spec.rows,spec.widths);
    protocolPdfDrawBlank(state,25);
  }

  function protocolPdfDrawSignatureCell(ctx,x,y,width,height,name,img){
    const marginX=protocolPdfDxa(90);
    const marginY=protocolPdfDxa(45);
    let usedY=y+marginY;
    protocolPdfApplyFont(ctx,{size:18});
    ctx.fillStyle="#000";
    ctx.textAlign="left";
    if(safe(name)){
      const lineHeight=protocolPdfLineHeight(18);
      const lines=wrapCanvasText(ctx,name,width-(marginX*2));
      let baseline=usedY+protocolPdfWordFontPx(18);
      for(const line of lines){
        ctx.fillText(line,x+marginX,baseline);
        baseline+=lineHeight;
      }
      usedY=baseline+protocolPdfDxa(20);
    }
    if(img){
      const availableH=Math.max(20,y+height-marginY-usedY);
      drawImageContained(ctx,img,x+marginX,usedY,width-(marginX*2),availableH);
    }
  }

  function protocolPdfDrawSignatureGrid(state,protocol={},clientImage=null,techImage=null){
    const widths=[4815,4815];
    const headerRows=[
      [
        {text:"Za objednavatele:",bold:true,size:18,fill:"F2F2F2"},
        {text:"Kontrolu provedl:",bold:true,size:18,fill:"F2F2F2"}
      ]
    ];
    const rowHeight=protocolPdfDxa(1050);
    protocolPdfEnsureSpace(state,protocolPdfDxa(330)+rowHeight+protocolPdfDxa(35)+protocolPdfWordFontPx(16));
    protocolPdfDrawTable(state,headerRows,widths);
    protocolPdfEnsureSpace(state,rowHeight+protocolPdfDxa(35)+protocolPdfWordFontPx(16));
    const ctx=state.ctx;
    const colW=protocolPdfDxa(4815);
    const y=state.y;
    [0,1].forEach(idx=>{
      const x=state.marginX+(idx*colW);
      ctx.strokeStyle="#000";
      ctx.lineWidth=1;
      ctx.strokeRect(x,y,colW,rowHeight);
    });
    protocolPdfDrawSignatureCell(ctx,state.marginX,y,colW,rowHeight,protocol.clientSign || "",clientImage);
    protocolPdfDrawSignatureCell(ctx,state.marginX+colW,y,colW,rowHeight,protocolTechnicianDisplayName(protocol),techImage);
    state.y+=rowHeight;
    protocolPdfDrawParagraph(state,"(čitelně + podpis)",{size:16,after:35});
  }

  function protocolPdfDocumentContext(protocol={}){
    const site=getSelectedSite() || {};
    return {
      deviceType:protocol.deviceType || protocol.selectedDevice || protocol.siteSource || site.zdroj || "",
      place:protocol.place || protocol.siteAddress || protocol.siteName || site.adresa || "",
      sourceState:[
        protocolSourceStateLabel(protocol),
        protocolSourceStateValue(protocol)==="ok" ? protocolSourceTestMethodLabel(protocol.sourceTestMethod || protocol.testMethod) : ""
      ].filter(Boolean).join(" - ")
    };
  }

  async function renderProtocolPdfPageCanvases(protocol={},options={}){
    const clientImage=await loadDataUrlImage(protocol.clientSignatureDataUrl || protocol.clientSignature || "").catch(()=>null);
    const techImage=await loadDataUrlImage(protocol.techSignatureDataUrl || protocol.technicianSignatureDataUrl || "").catch(()=>null);
    const state={
      pages:[],
      canvas:null,
      ctx:null,
      marginX:protocolPdfDxa(850),
      y:protocolPdfDxa(850)
    };
    const data=protocolPdfDocumentContext(protocol);
    protocolPdfStartPage(state);
    protocolPdfDrawParagraph(state,"Potvrzení o provedené zkoušce provozuschopnosti",{align:"center",bold:true,size:28,after:80});
    protocolPdfDrawParagraph(state,"Tento formulář slouží zároveň jako objednávka zkoušky provozuschopnosti. Kontrolu záložního zdroje na PBZ dle Vyhl. 246/2001 Sb. §6, §7 provedl: Servis záložních zdrojů s.r.o., IČ: 09391126",{size:18,after:80});
    protocolPdfDrawFormField(state,"Datum provedení kontroly zdroje:",protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt));
    protocolPdfDrawFormGrid(state,["Kontrolované zařízení – Typ","Výrobní č.","Plomba"],[data.deviceType,protocol.serial,protocol.seal],[4300,2650,2680]);
    protocolPdfDrawFormField(state,"1) Místo kontroly:",data.place);
    protocolPdfDrawFormField(state,"2) Provozovatel zařízení:",protocol.operator);
    protocolPdfDrawFormField(state,"3) Objednatel zkoušky provozuschopnosti:",protocol.customer);
    protocolPdfDrawFormField(state,"4) Umístění PBZ v objektu:",protocol.pbzLocation);
    protocolPdfDrawMeasurementTable(state,protocol);
    protocolPdfDrawFormField(state,"5) Umístění jističů UPS a zál. zařízení v objektu:",protocol.breakersLocation);
    protocolPdfDrawFormField(state,"6) Typ a umístění zálohovaných zařízení v objektu:",protocolBackedDevicesText(protocol));
    protocolPdfDrawFormField(state,"7) Umístění zálohovaných zařízení:",protocol.controlLocation);
    protocolPdfDrawFormField(state,"Postup testování:",protocol.testProcedure);
    protocolPdfDrawFormField(state,"8) Parkování a vstup do objektu, předepsané OOPP:",protocolAccessText(protocol));
    protocolPdfDrawFormField(state,"9) Kontakty:",protocol.contacts);
    protocolPdfDrawFormField(state,"10) Dostupnost:",protocolAvailabilityText(protocol));
    protocolPdfDrawFormField(state,"11) Perioda zkoušky provozuschopnosti:",protocolPeriodText(protocol));
    protocolPdfDrawFormField(state,"12) Zařízení pracuje ve vyhovujících podmínkách (odůvodnění):",protocolConditionsText(protocol));
    protocolPdfDrawFormField(state,"14) Poznámka pro zákazníka:",protocol.customerNote || protocol.noteForCustomer,9630,{keepWithNextDxa:650});
    if(!options.omitChecklist){
      protocolPdfDrawFormField(state,"15) Chceck list:",protocol.checklist || protocol.checkList || protocol.chceckList,9630,{keepWithNextDxa:650});
    }
    protocolPdfDrawFormField(state,"Stav zdroje po kontrole:",data.sourceState);
    protocolPdfDrawSignatureGrid(state,protocol,clientImage,techImage);
    state.pages.forEach((page,idx)=>{
      const pctx=page.ctx;
      pctx.fillStyle="#666";
      protocolPdfApplyFont(pctx,{size:14});
      pctx.textAlign="right";
      pctx.fillText(`Strana ${idx+1} / ${state.pages.length}`,PROTOCOL_PDF_PAGE_WIDTH-protocolPdfDxa(850),PROTOCOL_PDF_PAGE_HEIGHT-protocolPdfDxa(520));
      pctx.textAlign="left";
    });
    return state.pages.map(page=>({
      width:page.canvas.width,
      height:page.canvas.height,
      dataUrl:page.canvas.toDataURL("image/jpeg",0.86)
    }));
  }

  return {
    renderProtocolPdfPageCanvases
  };
}
