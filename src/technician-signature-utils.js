export function createTechnicianSignatureHelpers({
  collectionName,
  currentUserEmail,
  drawImageContained,
  getDb,
  getFbFsMod,
  getFirebaseReady,
  loadDataUrlImage,
  officialTipekSignatureUrl,
  protocolTechnicianEmail,
  protocolTechnicianSignatureImageBytes,
  safe,
  setProtocolStatusText,
  showSaveConfirmation,
  simpleNorm,
  technicianKnownKeyFromValue,
  uniqueNonEmptyStrings
}){
  const technicianSignatureDataUrlCache=new Map();

  function technicianSignatureKnownKey(protocol={}){
    return technicianKnownKeyFromValue([
      protocol.techSign,
      protocol.technician,
      protocol.technicianName,
      protocol.technicianDisplayName,
      protocol.technicianEmail,
      protocol.techEmail,
      protocol.createdBy
    ].map(safe).filter(Boolean).join(" "));
  }

  function technicianSignatureEmail(protocol={},options={}){
    return protocolTechnicianEmail(protocol,{allowCurrentFallback:!!options.allowCurrentFallback});
  }

  function technicianSignatureLookupKey(protocol={},options={}){
    const email=technicianSignatureEmail(protocol,options);
    if(email) return email;
    const known=technicianSignatureKnownKey(protocol);
    return known ? `known:${known}` : "";
  }

  function technicianSignatureDocIds(email=""){
    const clean=safe(email).toLowerCase();
    if(!clean) return [];
    return uniqueNonEmptyStrings([
      clean,
      clean.replace(/[/.#[\]$]/g,"_"),
      simpleNorm(clean).replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")
    ]);
  }

  async function loadKnownTechnicianSignatureDataUrl(protocol={}){
    const key=technicianSignatureKnownKey(protocol);
    if(key!=="tipek") return "";
    const cacheKey="known:tipek";
    if(technicianSignatureDataUrlCache.has(cacheKey)) return technicianSignatureDataUrlCache.get(cacheKey) || "";
    try{
      const response=await fetch(officialTipekSignatureUrl,{cache:"force-cache"});
      if(!response.ok) throw new Error(`Podpis Tipek se nepodařilo načíst (${response.status}).`);
      const blob=await response.blob();
      const dataUrl=await new Promise((resolve,reject)=>{
        const reader=new FileReader();
        reader.onload=()=>resolve(String(reader.result || ""));
        reader.onerror=()=>reject(reader.error || new Error("Podpis Tipek se nepodařilo převést."));
        reader.readAsDataURL(blob);
      });
      technicianSignatureDataUrlCache.set(cacheKey,dataUrl);
      return dataUrl;
    }catch(e){
      console.warn("Výchozí podpis technika se nepodařilo načíst",e);
      technicianSignatureDataUrlCache.set(cacheKey,"");
      return "";
    }
  }

  async function loadTechnicianSignatureDataUrl(protocol={}){
    const lookupKey=technicianSignatureLookupKey(protocol);
    if(!lookupKey) return "";
    if(technicianSignatureDataUrlCache.has(lookupKey)) return technicianSignatureDataUrlCache.get(lookupKey) || "";
    const remember=value=>{
      const dataUrl=safe(value);
      technicianSignatureDataUrlCache.set(lookupKey,dataUrl);
      return dataUrl;
    };
    const pickSignature=data=>{
      if(!data || typeof data!=="object") return "";
      return safe(data.signatureDataUrl || data.technicianSignatureDataUrl || data.dataUrl || data.pngDataUrl || "");
    };
    const email=lookupKey.startsWith("known:") ? "" : lookupKey;
    const fsMod=getFbFsMod();
    if(!email || !getFirebaseReady() || !getDb() || !fsMod || navigator.onLine===false){
      const fallback=await loadKnownTechnicianSignatureDataUrl(protocol);
      return fallback ? remember(fallback) : "";
    }
    try{
      const {doc,getDoc,collection,query,where,limit:getLimit,getDocs}=fsMod;
      const db=getDb();
      for(const docId of technicianSignatureDocIds(email)){
        try{
          const snap=await getDoc(doc(db,collectionName,docId));
          if(snap.exists()){
            const found=pickSignature(snap.data());
            if(found) return remember(found);
          }
        }catch(_e){}
      }
      if(query && where && getDocs){
        const constraints=[where("email","==",email)];
        if(getLimit) constraints.push(getLimit(1));
        const snap=await getDocs(query(collection(db,collectionName),...constraints));
        let found="";
        snap.forEach(docSnap=>{
          if(!found) found=pickSignature(docSnap.data());
        });
        if(found) return remember(found);
      }
    }catch(e){
      console.warn("Podpis technika se nepodařilo načíst",e);
    }
    return remember(await loadKnownTechnicianSignatureDataUrl(protocol));
  }

  async function enrichProtocolWithTechnicianSignature(protocol={}){
    if(protocolTechnicianSignatureImageBytes(protocol)) return protocol;
    const dataUrl=await loadTechnicianSignatureDataUrl(protocol);
    return dataUrl ? {...protocol,techSignatureDataUrl:dataUrl,technicianSignatureDataUrl:dataUrl} : protocol;
  }

  function technicianSignatureCurrentEmail(){
    return currentUserEmail();
  }

  async function saveCurrentTechnicianSignature(dataUrl=""){
    const email=technicianSignatureCurrentEmail();
    if(!email) throw new Error("Nejdřív se přihlaš jako technik.");
    const fsMod=getFbFsMod();
    const db=getDb();
    if(!getFirebaseReady() || !db || !fsMod) throw new Error("Firebase není dostupný.");
    const cleanDataUrl=safe(dataUrl);
    if(!cleanDataUrl.startsWith("data:image/png;base64,")) throw new Error("Podpis se nepodařilo připravit.");
    const {doc,setDoc,serverTimestamp}=fsMod;
    await setDoc(doc(db,collectionName,email),{
      email,
      signatureDataUrl:cleanDataUrl,
      technicianSignatureDataUrl:cleanDataUrl,
      updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString(),
      updatedBy:email
    },{merge:true});
    technicianSignatureDataUrlCache.set(email,cleanDataUrl);
    return cleanDataUrl;
  }

  async function deleteCurrentTechnicianSignature(){
    const email=technicianSignatureCurrentEmail();
    if(!email) throw new Error("Nejdřív se přihlaš jako technik.");
    const fsMod=getFbFsMod();
    const db=getDb();
    if(!getFirebaseReady() || !db || !fsMod) throw new Error("Firebase není dostupný.");
    const {doc,deleteDoc}=fsMod;
    await deleteDoc(doc(db,collectionName,email));
    technicianSignatureDataUrlCache.set(email,"");
  }

  function signatureCanvasPoint(e,canvas){
    const rect=canvas.getBoundingClientRect();
    return {
      x:(e.clientX-rect.left)*(canvas.width/rect.width),
      y:(e.clientY-rect.top)*(canvas.height/rect.height)
    };
  }

  function setupSignatureCanvasDrawing(canvas,onDirty){
    if(!canvas || canvas.dataset.signatureDrawingReady==="1") return;
    canvas.dataset.signatureDrawingReady="1";
    const ctx=canvas.getContext("2d");
    if(!ctx) return;
    ctx.lineWidth=4;
    ctx.lineCap="round";
    ctx.lineJoin="round";
    ctx.strokeStyle="#0f172a";
    let drawing=false;
    let last=null;
    const markDirty=()=>{ if(typeof onDirty==="function") onDirty(); };
    const start=e=>{
      e.preventDefault();
      drawing=true;
      last=signatureCanvasPoint(e,canvas);
      ctx.beginPath();
      ctx.arc(last.x,last.y,2,0,Math.PI*2);
      ctx.fillStyle="#0f172a";
      ctx.fill();
      markDirty();
      try{canvas.setPointerCapture(e.pointerId);}catch(_e){}
    };
    const move=e=>{
      if(!drawing || !last) return;
      e.preventDefault();
      const point=signatureCanvasPoint(e,canvas);
      ctx.beginPath();
      ctx.moveTo(last.x,last.y);
      ctx.lineTo(point.x,point.y);
      ctx.stroke();
      last=point;
      markDirty();
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
  }

  function clearSignatureCanvas(canvas){
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    if(ctx) ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  function signatureCanvasIsBlank(canvas){
    if(!canvas) return true;
    const blank=document.createElement("canvas");
    blank.width=canvas.width;
    blank.height=canvas.height;
    try{return canvas.toDataURL("image/png")===blank.toDataURL("image/png");}catch(e){return false;}
  }

  async function drawSignatureDataUrlOnCanvas(canvas,dataUrl=""){
    if(!canvas || !safe(dataUrl)) return false;
    const ctx=canvas.getContext("2d");
    if(!ctx) return false;
    const img=await loadDataUrlImage(dataUrl);
    if(!img) return false;
    clearSignatureCanvas(canvas);
    drawImageContained(ctx,img,18,18,canvas.width-36,canvas.height-36);
    return true;
  }

  function technicianSignatureDialogNodes(){
    const overlay=document.getElementById("technicianSignatureOverlay");
    return {
      overlay,
      canvas:document.getElementById("technicianSignaturePad"),
      status:document.getElementById("technicianSignatureStatus")
    };
  }

  function ensureTechnicianSignatureDialog(){
    let {overlay}=technicianSignatureDialogNodes();
    if(overlay) return overlay;
    overlay=document.createElement("div");
    overlay.id="technicianSignatureOverlay";
    overlay.className="technician-signature-overlay";
    overlay.hidden=true;
    overlay.innerHTML=`
      <div class="technician-signature-dialog" role="dialog" aria-modal="true" aria-labelledby="technicianSignatureTitle">
        <div class="technician-signature-head">
          <div>
            <h3 id="technicianSignatureTitle">Podpis technika</h3>
            <p>Podpis se uloží jen k tvému přihlášenému účtu.</p>
          </div>
          <button class="secondary" type="button" id="closeTechnicianSignatureBtn">Zavřít</button>
        </div>
        <canvas id="technicianSignaturePad" width="900" height="260"></canvas>
        <div class="technician-signature-actions">
          <button class="primary" type="button" id="saveTechnicianSignatureBtn">Uložit podpis</button>
          <button class="secondary" type="button" id="clearTechnicianSignatureBtn">Vymazat podpis</button>
          <button class="secondary" type="button" id="cancelTechnicianSignatureBtn">Zavřít</button>
        </div>
        <p class="small technician-signature-status" id="technicianSignatureStatus"></p>
      </div>`;
    document.body.appendChild(overlay);
    const nodes=technicianSignatureDialogNodes();
    const close=()=>{overlay.hidden=true;};
    document.getElementById("closeTechnicianSignatureBtn").onclick=close;
    document.getElementById("cancelTechnicianSignatureBtn").onclick=close;
    overlay.addEventListener("click",event=>{
      if(event.target===overlay) close();
    });
    setupSignatureCanvasDrawing(nodes.canvas,()=>{
      if(nodes.status) nodes.status.textContent="Podpis je upravený, ulož ho tlačítkem Uložit podpis.";
    });
    document.getElementById("saveTechnicianSignatureBtn").onclick=async()=>{
      const current=technicianSignatureDialogNodes();
      try{
        if(signatureCanvasIsBlank(current.canvas)){
          if(current.status) current.status.textContent="Nejdřív se podepiš do pole.";
          return;
        }
        const dataUrl=current.canvas.toDataURL("image/png");
        if(current.status) current.status.textContent="Ukládám podpis...";
        await saveCurrentTechnicianSignature(dataUrl);
        if(current.status) current.status.textContent="Podpis uložen. Bude se vkládat do nově generovaných protokolů.";
        showSaveConfirmation("Podpis technika uložen.");
      }catch(e){
        if(current.status) current.status.textContent=`Chyba uložení podpisu: ${e.message}`;
      }
    };
    document.getElementById("clearTechnicianSignatureBtn").onclick=async()=>{
      const current=technicianSignatureDialogNodes();
      try{
        clearSignatureCanvas(current.canvas);
        if(current.status) current.status.textContent="Mažu uložený podpis...";
        await deleteCurrentTechnicianSignature();
        if(current.status) current.status.textContent="Podpis vymazán.";
        showSaveConfirmation("Podpis technika vymazán.");
      }catch(e){
        if(current.status) current.status.textContent=`Chyba vymazání podpisu: ${e.message}`;
      }
    };
    return overlay;
  }

  async function openTechnicianSignatureDialog(){
    const email=technicianSignatureCurrentEmail();
    if(!email){
      setProtocolStatusText("Nejdřív se přihlaš jako technik.");
      return;
    }
    const overlay=ensureTechnicianSignatureDialog();
    overlay.hidden=false;
    const {canvas,status}=technicianSignatureDialogNodes();
    clearSignatureCanvas(canvas);
    if(status) status.textContent="Načítám uložený podpis...";
    try{
      const existing=await loadTechnicianSignatureDataUrl({technicianEmail:email});
      if(existing){
        await drawSignatureDataUrlOnCanvas(canvas,existing);
        if(status) status.textContent="Uložený podpis je načtený.";
      }else if(status){
        status.textContent="Zatím nemáš uložený podpis. Podepiš se a dej Uložit podpis.";
      }
    }catch(e){
      if(status) status.textContent="Podpis se nepodařilo načíst, můžeš ho zadat znovu.";
    }
  }

  return {
    enrichProtocolWithTechnicianSignature,
    openTechnicianSignatureDialog
  };
}
