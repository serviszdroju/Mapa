export function createProtocolSignatureHelpers({
  formFieldNode,
  safeValue,
  scheduleProtocolDraftSave
}){
  let protoClientSignatureDirty=false;

  function protocolSignatureCanvas(){
    return formFieldNode("protoClientSignaturePad");
  }

  function protocolClientSignaturePanel(){
    return formFieldNode("protoClientSignaturePanel");
  }

  function protocolSignaturePoint(e,canvas){
    const rect=canvas.getBoundingClientRect();
    return {
      x:(e.clientX-rect.left)*(canvas.width/rect.width),
      y:(e.clientY-rect.top)*(canvas.height/rect.height)
    };
  }

  function protocolSignatureContext(){
    const canvas=protocolSignatureCanvas();
    if(!canvas) return null;
    const ctx=canvas.getContext("2d");
    if(!ctx) return null;
    ctx.lineWidth=4;
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.strokeStyle="#0f172a";
    return ctx;
  }

  function initProtocolClientSignaturePad(){
    const canvas=protocolSignatureCanvas();
    if(!canvas) return;
    const ctx=protocolSignatureContext();
    if(!ctx) return;
    if(canvas.dataset.signatureReady==="1") return;
    canvas.dataset.signatureReady="1";
    let drawing=false;
    let last=null;
    const start=e=>{
      e.preventDefault();
      drawing=true;
      last=protocolSignaturePoint(e,canvas);
      ctx.beginPath();
      ctx.arc(last.x,last.y,2,0,Math.PI*2);
      ctx.fillStyle="#0f172a";
      ctx.fill();
      protoClientSignatureDirty=true;
      scheduleProtocolDraftSave();
      try{canvas.setPointerCapture(e.pointerId);}catch(_e){}
    };
    const move=e=>{
      if(!drawing || !last) return;
      e.preventDefault();
      const point=protocolSignaturePoint(e,canvas);
      ctx.beginPath();
      ctx.moveTo(last.x,last.y);
      ctx.lineTo(point.x,point.y);
      ctx.stroke();
      last=point;
      protoClientSignatureDirty=true;
      scheduleProtocolDraftSave();
    };
    const stop=e=>{
      if(!drawing) return;
      e.preventDefault();
      drawing=false;
      last=null;
      try{canvas.releasePointerCapture(e.pointerId);}catch(_e){}
    };
    canvas.addEventListener("pointerdown",start);
    canvas.addEventListener("pointermove",move);
    canvas.addEventListener("pointerup",stop);
    canvas.addEventListener("pointercancel",stop);
    canvas.addEventListener("pointerleave",stop);
    const clearBtn=formFieldNode("clearClientSignatureBtn");
    if(clearBtn) clearBtn.onclick=()=>{
      clearProtocolClientSignature();
      scheduleProtocolDraftSave();
    };
  }

  function setProtocolClientSignaturePanelOpen(open){
    const panel=protocolClientSignaturePanel();
    const btn=formFieldNode("toggleClientSignatureBtn");
    const visible=!!open;
    if(panel){
      panel.hidden=!visible;
      panel.setAttribute("aria-hidden",visible ? "false" : "true");
    }
    if(btn) btn.textContent=visible ? "Skrýt podpis zákazníka" : "Podpis zákazníka";
    if(visible) requestAnimationFrame(()=>initProtocolClientSignaturePad());
  }

  function clearProtocolClientSignature(){
    const canvas=protocolSignatureCanvas();
    const ctx=protocolSignatureContext();
    if(!canvas || !ctx) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    protoClientSignatureDirty=false;
  }

  function drawSavedProtocolSignature(dataUrl){
    const canvas=protocolSignatureCanvas();
    const ctx=protocolSignatureContext();
    if(!canvas || !ctx || !safeValue(dataUrl)) return;
    setProtocolClientSignaturePanelOpen(true);
    const img=new Image();
    img.onload=()=>{
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const scale=Math.min(canvas.width/img.width,canvas.height/img.height);
      const w=img.width*scale;
      const h=img.height*scale;
      ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
      protoClientSignatureDirty=false;
    };
    img.src=dataUrl;
  }

  function protocolClientSignatureDataUrl(){
    const canvas=protocolSignatureCanvas();
    if(!canvas || !protoClientSignatureDirty) return "";
    try{return canvas.toDataURL("image/png");}catch(e){return "";}
  }

  function bindProtocolSignatureToggle(){
    document.addEventListener("click",event=>{
      const btn=event.target && event.target.closest ? event.target.closest("#toggleClientSignatureBtn") : null;
      if(!btn) return;
      event.preventDefault();
      const panel=protocolClientSignaturePanel();
      setProtocolClientSignaturePanelOpen(panel ? panel.hidden : true);
    });
  }

  return {
    bindProtocolSignatureToggle,
    clearProtocolClientSignature,
    drawSavedProtocolSignature,
    initProtocolClientSignaturePad,
    protocolClientSignatureDataUrl,
    protocolClientSignaturePanel,
    protocolSignatureCanvas,
    protocolSignatureContext,
    setProtocolClientSignaturePanelOpen
  };
}
