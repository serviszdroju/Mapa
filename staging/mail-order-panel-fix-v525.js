(function(){
  "use strict";

  const state={items:[],current:null,mode:"new"};
  let focusMarker=null;
  const FUNCTIONS_COMPAT_SCRIPT_URL="https://www.gstatic.com/firebasejs/10.12.5/firebase-functions-compat.js";
  const MAIL_ORDER_ADMIN_EMAILS=new Set(["jan.soldan@astip.cz","jansoldan@astip.cz","iva.glozova@astip.cz"]);
  let functionsCompatScriptPromise=null;

  function text(value){ return String(value == null ? "" : value).trim(); }
  function email(value){ return text(value).toLowerCase(); }
  function drawer(){ return document.getElementById("drawer"); }
  function setStatus(message){ const node=document.getElementById("mailOrderIntakeStatus"); if(node) node.textContent=message || ""; }
  function currentUserEmail(){
    return email(
      (window.currentUser && window.currentUser.email) ||
      (window.__authReadyUser && window.__authReadyUser.email) ||
      (window.firebase && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.email) ||
      ""
    );
  }
  function isMailOrderAdmin(){
    const userEmail=currentUserEmail();
    if(userEmail && (MAIL_ORDER_ADMIN_EMAILS.has(userEmail) || userEmail.endsWith("@astip.cz"))) return true;
    const historyButton=document.getElementById("mainProtocolHistoryBtn");
    if(historyButton){
      const style=window.getComputedStyle ? window.getComputedStyle(historyButton) : null;
      if(style && style.display!=="none" && style.visibility!=="hidden") return true;
    }
    return false;
  }
  function installSidebarButtonStyle(){
    if(document.getElementById("mailOrderSidebarButtonStyle")) return;
    const style=document.createElement("style");
    style.id="mailOrderSidebarButtonStyle";
    style.textContent=[
      "#mailOrderIntakeBtn.mail-order-sidebar-ready{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;text-align:left!important;font-weight:800!important}",
      "#mailOrderIntakeBtn .mail-order-sidebar-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
    ].join("\n");
    document.head.appendChild(style);
  }
  function prepareMailOrderSidebarButton(button){
    if(!button) return;
    installSidebarButtonStyle();
    button.classList.add("mail-order-sidebar-ready");
    button.style.display="flex";
    button.style.alignItems="center";
    button.style.justifyContent="flex-start";
    button.style.gap="10px";
    button.style.textAlign="left";
    button.style.fontWeight="800";
    const labelText=text(button.textContent) || "Objednávky z mailu";
    const label=document.createElement("span");
    label.className="mail-order-sidebar-label";
    label.textContent=labelText;
    button.replaceChildren(label);
  }
  function refreshMailOrderButtonVisibility(button){
    if(!button) return;
    if(isMailOrderAdmin()){
      prepareMailOrderSidebarButton(button);
      button.hidden=false;
      button.removeAttribute("aria-hidden");
    }
  }

  function loadFunctionsCompatScript(){
    if(window.firebase && firebase.functions) return Promise.resolve();
    if(functionsCompatScriptPromise) return functionsCompatScriptPromise;
    functionsCompatScriptPromise=new Promise((resolve,reject)=>{
      const absolute=new URL(FUNCTIONS_COMPAT_SCRIPT_URL,document.baseURI).href;
      const existing=Array.from(document.scripts).find(script=>script.src===absolute);
      if(existing){
        existing.addEventListener("load",()=>resolve(),{once:true});
        existing.addEventListener("error",()=>reject(new Error("Firebase Functions SDK se nepodařilo načíst.")),{once:true});
        if(existing.dataset.loaded==="1" || (window.firebase && firebase.functions)) resolve();
        return;
      }
      const script=document.createElement("script");
      script.src=FUNCTIONS_COMPAT_SCRIPT_URL;
      script.async=false;
      script.defer=true;
      script.addEventListener("load",()=>{
        script.dataset.loaded="1";
        resolve();
      },{once:true});
      script.addEventListener("error",()=>reject(new Error("Firebase Functions SDK se nepodařilo načíst.")),{once:true});
      document.head.appendChild(script);
    }).catch(error=>{
      functionsCompatScriptPromise=null;
      throw error;
    });
    return functionsCompatScriptPromise;
  }

  async function getFunctions(){
    if((!window.firebase || !firebase.functions) && typeof window.__loadFirebaseCompatScripts==="function"){
      await window.__loadFirebaseCompatScripts();
    }
    await loadFunctionsCompatScript();
    if(!window.firebase || !firebase.functions) throw new Error("Firebase Functions nejsou dostupné.");
    if(!firebase.apps || !firebase.apps.length){
      if(!window.__firebaseConfig) throw new Error("Firebase konfigurace chybí.");
      firebase.initializeApp(window.__firebaseConfig);
    }
    const app=firebase.app();
    return typeof app.functions==="function" ? app.functions("europe-west1") : firebase.functions("europe-west1");
  }

  async function callFunction(name,payload){
    const result=await (await getFunctions()).httpsCallable(name)(payload || {});
    return result && result.data ? result.data : {};
  }

  function errorText(error){
    const code=text(error && error.code);
    const message=text(error && (error.message || error));
    if(code.includes("permission-denied")) return "K objednávkám z mailu má přístup jen admin.";
    if(code.includes("unauthenticated")) return "Nejdřív se znovu přihlaš.";
    return [code,message].filter(Boolean).join(": ") || "Akce se nepodařila.";
  }

  function candidateId(candidate){ return text(candidate && (candidate.siteId || candidate.id)).slice(0,240); }
  function candidateScore(candidate){
    const score=Number(candidate && candidate.score);
    if(Number.isFinite(score) && score>0) return score;
    const confidence=Number(candidate && candidate.confidence);
    return Number.isFinite(confidence) && confidence>0 ? confidence*100 : 0;
  }
  function meaningfulCandidates(list){
    const candidates=Array.isArray(list) ? list.filter(candidate=>candidateId(candidate)) : [];
    if(!candidates.length) return [];
    const bestScore=candidateScore(candidates[0]);
    return candidates.filter((candidate,index)=>{
      if(index===0) return true;
      const score=candidateScore(candidate);
      if(bestScore>=62) return score>=62 && score>=bestScore-12;
      return score>=Math.max(36,bestScore-8);
    });
  }
  function candidates(item){ return meaningfulCandidates(item && item.match && item.match.candidates); }
  const genericMailMatchTokens=new Set(["adresa","astip","baterie","dobry","den","kontrola","kontrolu","objednavam","objednavka","oprava","revize","revizi","servis","servisni","zdroj","zdroje","zdroju","zalozni","zkouska"]);
  const broadPlaceTokens=new Set(["brno","praha","plzen","ostrava","olomouc","liberec","karvina","zlin","opava","hodonin","pardubice","jihlava","teplice"]);
  function norm(value){
    return text(value).toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[_/\\,.;:()\\-]+/g," ")
      .replace(/\bbrne\b/g,"brno")
      .replace(/\bpraze\b/g,"praha")
      .replace(/\bplzni\b/g,"plzen")
      .replace(/\bostrave\b/g,"ostrava")
      .replace(/\s+/g," ")
      .trim();
  }
  function tokenSet(value){
    const stop=new Set(["a","i","s","se","ve","v","u","na","do","pro","od","cz","psc"]);
    return new Set(norm(value).split(" ").filter(part=>part.length>=3 && !stop.has(part)));
  }
  function significantTokens(value){
    const set=tokenSet(value);
    genericMailMatchTokens.forEach(token=>set.delete(token));
    return set;
  }
  function specificPlaceTokens(value){
    const set=significantTokens(value);
    broadPlaceTokens.forEach(token=>set.delete(token));
    return set;
  }
  function overlap(left,right){
    if(!left.size || !right.size) return 0;
    let shared=0;
    left.forEach(token=>{ if(right.has(token)) shared++; });
    return shared / Math.max(left.size,right.size);
  }
  function containment(left,right){
    if(!left.size || !right.size) return 0;
    let shared=0;
    left.forEach(token=>{ if(right.has(token)) shared++; });
    return shared / Math.min(left.size,right.size);
  }
  function numericParts(value){
    const set=new Set();
    const matches=text(value).replace(/_/g,"/").match(/\b\d{1,5}(?:\s*[/-]\s*\d{1,4})?[a-zA-Z]?\b/g) || [];
    matches.forEach(match=>{
      const cleaned=norm(match).replace(/\s+/g,"/");
      if(!cleaned) return;
      set.add(cleaned);
      cleaned.split("/").forEach(part=>{ if(part.length>=2) set.add(part); });
    });
    return set;
  }
  function shares(left,right){
    for(const value of left){ if(right.has(value)) return true; }
    return false;
  }
  function relevantMailBody(value){
    const lines=text(value).split(/\r?\n/).map(text).filter(Boolean);
    const picked=[];
    for(const line of lines){
      const normalized=norm(line);
      if(!normalized) continue;
      if(normalized.includes("fakturacni adresa") || normalized.includes("s pozdravem") || normalized.startsWith("tel") || normalized.startsWith("mail") || normalized.includes(" ico") || normalized.includes(" dic")) continue;
      if(/\b(objednav|kontrol|reviz|oprav|servis)\w*/.test(normalized)) picked.push(line);
    }
    if(picked.length) return picked.join("\n");
    return lines.filter(line=>{
      const normalized=norm(line);
      return normalized && !normalized.includes("fakturacni adresa") && !normalized.includes("s pozdravem") && !normalized.startsWith("tel") && !normalized.startsWith("mail");
    }).slice(0,3).join("\n");
  }
  function mailBodyText(item){
    return text(item && (item.plainText || item.bodyText || item.text || item.snippet));
  }
  function dateLabel(value){
    const raw=text(value);
    if(!raw) return "";
    const date=new Date(raw);
    if(Number.isFinite(date.getTime())) return date.toLocaleString("cs-CZ");
    return raw;
  }
  function mailDisplayText(item){
    const lines=[];
    const subject=text(item && item.subject);
    const from=text(item && item.from);
    const received=dateLabel(item && item.receivedAt);
    const body=mailBodyText(item);
    if(subject) lines.push(`Předmět: ${subject}`);
    if(from) lines.push(`Od: ${from}`);
    if(received) lines.push(`Přijato: ${received}`);
    if(lines.length && body) lines.push("");
    if(body) lines.push(body);
    return lines.join("\n") || subject || "Text mailu není k dispozici.";
  }
  function rowCandidate(row){
    const raw=row && row.raw || {};
    const id=text(row && (row.firebaseDocId || row.id) || raw.Firebase_doc_id || raw.id || raw.ID || raw.Klíč_adresy).slice(0,240);
    const title=text(raw["Název"] || raw["Adresa / umístění"] || raw["Adresa_GPS"] || row && row.adresa || id);
    const address=text(raw["Adresa / umístění"] || raw["Adresa_GPS"] || raw["Umístění"] || raw["Umístění zdroje"] || row && row.adresa);
    return id ? {siteId:id,id,title,address,source:text(raw["Popis_zdroje"] || raw["Zdroj"] || raw["Kontrolované zařízení"])} : null;
  }
  function mailOrderText(item){
    const ai=item && item.ai || {};
    const body=relevantMailBody(mailBodyText(item));
    return [
      item && item.subject,
      item && item.siteName,
      item && item.address,
      ai.siteName,
      ai.address,
      body
    ].map(text).filter(Boolean).join("\n");
  }
  function scoreRowForMail(item,row){
    const candidate=rowCandidate(row);
    if(!candidate) return null;
    const mailText=mailOrderText(item);
    const mailSpecific=specificPlaceTokens(mailText);
    const mailAll=significantTokens(mailText);
    const rowPlace=[candidate.title,candidate.address].join(" ");
    const rowSpecific=specificPlaceTokens(rowPlace);
    const rowAll=significantTokens(rowPlace);
    const specificContainment=containment(mailSpecific,rowSpecific);
    const allOverlap=overlap(mailAll,rowAll);
    const mailNums=numericParts(mailText);
    const rowNums=numericParts(rowPlace);
    const numberMatch=shares(mailNums,rowNums);
    if(mailSpecific.size && specificContainment<=0) return null;
    if(!mailSpecific.size && !numberMatch) return null;
    let score=Math.round(72*specificContainment + 28*allOverlap);
    if(numberMatch) score+=28;
    if(mailNums.size && !numberMatch) score-=18;
    if(score<36) return null;
    candidate.score=Math.max(0,score);
    candidate.confidence=Math.min(1,candidate.score/100);
    candidate.reason=numberMatch ? "shoda konkrétní adresy a čísla" : "shoda konkrétní ulice nebo názvu místa";
    return candidate;
  }
  function hasSpecificMailPlaceSignal(item){
    const mailText=mailOrderText(item);
    return specificPlaceTokens(mailText).size > 0 || numericParts(mailText).size > 0;
  }
  function rerankClientCandidates(item){
    const rows=Array.isArray(window.rows) ? window.rows : [];
    if(!item || !rows.length) return item;
    const scored=rows.map(row=>scoreRowForMail(item,row)).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,5);
    if(!scored.length){
      if(hasSpecificMailPlaceSignal(item)){
        item.match={...(item.match || {}), selectedSiteId:"", candidates:[], confidence:0, reason:"Nenašel jsem bod se stejnou konkrétní ulicí nebo místem."};
        item.adminSelectedSiteId="";
      }
      return item;
    }
    const existing=(Array.isArray(item && item.match && item.match.candidates) ? item.match.candidates : []).filter(candidate=>candidateId(candidate) && !scored.some(next=>candidateId(next)===candidateId(candidate)));
    item.match={...(item.match || {}), selectedSiteId:candidateId(scored[0]), candidates:meaningfulCandidates(scored.concat(existing)).slice(0,8), confidence:scored[0].confidence, reason:scored[0].reason};
    item.adminSelectedSiteId=candidateId(scored[0]);
    return item;
  }
  function selectedSiteId(item){
    const direct=text(item && (item.adminSelectedSiteId || item.appliedSiteId || item.matchSiteId || item.siteId));
    if(direct) return direct;
    const matched=text(item && item.match && item.match.selectedSiteId);
    if(matched) return matched;
    return candidateId(candidates(item)[0]);
  }
  function hasUsableMatch(item){ return !!selectedSiteId(item) || Number(item && item.candidateCount || 0) > 0; }
  function orderType(item){ return text(item && (item.adminOrderType || item.appliedOrderType || item.ai && item.ai.orderType)) || "kontrola"; }
  function orderTypeLabel(value){ return text(value)==="oprava" ? "oprava" : "kontrola"; }
  function statusLabel(value){
    const status=text(value);
    if(status==="pending") return "Čeká na schválení";
    if(status==="needs_review") return "K ruční kontrole";
    if(status==="applied") return "Schváleno a zapsáno";
    if(status==="rejected") return "Zamítnuto";
    if(status==="failed") return "Chyba";
    return status || "Bez stavu";
  }
  function selectedCandidate(item){
    const selected=selectedSiteId(item);
    const list=candidates(item);
    return list.find(candidate=>candidateId(candidate)===selected) || list[0] || null;
  }
  function candidateLabel(candidate,item){
    return [
      text(candidate && (candidate.title || candidate.siteName || candidate.name)),
      text(candidate && candidate.address)
    ].filter(Boolean).join("\n") || text(item && (item.siteName || item.address)) || candidateId(candidate) || selectedSiteId(item) || "Místo není vybrané";
  }
  function isOpenStatus(status){
    const value=text(status);
    return value!=="applied" && value!=="rejected";
  }

  function rowByAnyId(id){
    const key=text(id);
    if(!key) return null;
    const direct=window.siteRowsByAnyId && typeof window.siteRowsByAnyId.get==="function" ? window.siteRowsByAnyId.get(key) : null;
    if(direct) return direct;
    const rows=Array.isArray(window.rows) ? window.rows : [];
    return rows.find(row=>{
      if(!row) return false;
      const raw=row.raw || {};
      return [row.id,row.firebaseDocId,raw.Firebase_doc_id,raw.id,raw.ID,raw.Klíč_adresy].map(text).includes(key);
    }) || null;
  }

  function focusSite(id){
    const row=rowByAnyId(id);
    const map=window.map;
    if(!row || !map || !Number.isFinite(row.lat) || !Number.isFinite(row.lon)) return false;
    try{ map.setView([row.lat,row.lon],15); }catch(_e){}
    try{
      if(focusMarker && map.removeLayer) map.removeLayer(focusMarker);
      if(window.L && L.circleMarker){
        focusMarker=L.circleMarker([row.lat,row.lon],{
          radius:17,
          color:"#2563eb",
          weight:4,
          opacity:.95,
          fillColor:"#fff",
          fillOpacity:.16,
          interactive:false
        }).addTo(map);
      }
    }catch(_e){}
    return true;
  }

  function makeButton(label,className){
    const button=document.createElement("button");
    button.type="button";
    button.className=className || "secondary";
    button.textContent=label;
    return button;
  }

  function renderShell(){
    const node=drawer();
    if(!node) return null;
    node.classList.add("open");
    node.classList.remove("adding-new-site");
    node.scrollTop=0;

    const head=document.createElement("div");
    head.className="drawer-head";
    const titleWrap=document.createElement("div");
    const title=document.createElement("h2");
    title.textContent="Objednávky z mailu";
    const subtitle=document.createElement("p");
    subtitle.className="small";
    subtitle.textContent="Klikni na nový mail, zkontroluj text a navržené místo. Zápis do mapy proběhne až po schválení.";
    titleWrap.append(title,subtitle);
    const close=makeButton("Zavřít","secondary x");
    close.id="closeDrawer";
    close.addEventListener("click",()=>node.classList.remove("open"));
    head.append(titleWrap,close);

    const card=document.createElement("div");
    card.className="card mail-order-card";
    card.id="mailOrderIntakeCard";

    const toolbar=document.createElement("div");
    toolbar.className="mail-order-toolbar";
    const newMode=makeButton("Nové maily",state.mode==="history" ? "secondary" : "primary");
    const historyMode=makeButton("Historie potvrzených",state.mode==="history" ? "primary" : "secondary");
    const importBtn=makeButton("Načíst Gmail","secondary");
    newMode.addEventListener("click",()=>switchMode("new"));
    historyMode.addEventListener("click",()=>switchMode("history"));
    importBtn.addEventListener("click",importGmail);
    toolbar.append(newMode,historyMode,importBtn);

    const status=document.createElement("p");
    status.className="small";
    status.id="mailOrderIntakeStatus";

    const layout=document.createElement("div");
    layout.className="mail-order-layout";
    const list=document.createElement("div");
    list.id="mailOrderIntakeList";
    list.className="mail-order-list small";
    const detail=document.createElement("div");
    detail.id="mailOrderIntakeDetail";
    detail.className="mail-order-detail small";
    layout.append(list,detail);
    card.append(toolbar,status,layout);
    node.replaceChildren(head,card);

    list.addEventListener("click",event=>{
      const row=event.target.closest && event.target.closest("[data-mail-order-id]");
      if(row && list.contains(row)) loadDetail(row.dataset.mailOrderId);
    });
    detail.addEventListener("click",event=>{
      const candidate=event.target.closest && event.target.closest("[data-candidate-site-id]");
      if(candidate){
        if(state.current) state.current.adminSelectedSiteId=candidate.dataset.candidateSiteId;
        renderDetail(state.current);
        focusSite(candidate.dataset.candidateSiteId);
        return;
      }
      if(event.target.closest && event.target.closest("#mailOrderShowSite")) focusSite(selectedSiteId(state.current));
      if(event.target.closest && event.target.closest("#mailOrderApprove")) approveCurrent();
      if(event.target.closest && event.target.closest("#mailOrderReject")) rejectCurrent();
    });

    renderList();
    renderDetail(state.current);
    return {list,detail,status};
  }

  function switchMode(mode){
    state.mode=mode;
    state.current=null;
    renderShell();
    loadList();
  }

  function renderList(){
    const list=document.getElementById("mailOrderIntakeList");
    if(!list) return;
    if(!state.items.length){
      list.textContent=state.mode==="history" ? "V historii zatím není žádný potvrzený mail." : "Žádný nový mail se shodou ke schválení.";
      return;
    }
    const fragment=document.createDocumentFragment();
    state.items.forEach(item=>{
      const row=makeButton("",`mail-order-row ${text(item.status)}`);
      row.dataset.mailOrderId=item.id;
      const title=document.createElement("b");
      title.textContent=text(item.subject || "Nový mail");
      const meta=document.createElement("span");
      meta.textContent=candidateLabel(selectedCandidate(item),item).replace(/\n+/g," · ");
      const small=document.createElement("small");
      small.textContent=[statusLabel(item.status),orderTypeLabel(orderType(item)),dateLabel(item.receivedAt)].filter(Boolean).join(" · ");
      row.append(title,meta,small);
      fragment.appendChild(row);
    });
    list.replaceChildren(fragment);
  }

  function renderDetail(item){
    const detail=document.getElementById("mailOrderIntakeDetail");
    if(!detail) return;
    if(!item){
      detail.textContent=state.mode==="history" ? "Vyber potvrzený mail z historie." : "Klikni na nový mail ze seznamu.";
      return;
    }
    const wrap=document.createElement("div");
    wrap.className="mail-order-detail-inner";

    const compactMeta=document.createElement("div");
    compactMeta.className="mail-order-compact-meta";
    [statusLabel(item.status),orderTypeLabel(orderType(item)),item.from,dateLabel(item.receivedAt)].map(text).filter(Boolean).forEach(value=>{
      const pill=document.createElement("span");
      pill.textContent=value;
      compactMeta.appendChild(pill);
    });
    if(compactMeta.childNodes.length) wrap.appendChild(compactMeta);

    const summary=document.createElement("div");
    summary.className="mail-order-summary";

    const place=document.createElement("section");
    place.className="history-item";
    const placeTitle=document.createElement("h4");
    placeTitle.textContent="Místo";
    const placeText=document.createElement("pre");
    placeText.textContent=candidateLabel(selectedCandidate(item),item);
    const showOnMap=makeButton("Ukázat bod v mapě","secondary");
    showOnMap.id="mailOrderShowSite";
    place.append(placeTitle,placeText,showOnMap);
    summary.appendChild(place);
    wrap.appendChild(summary);

    const candidateList=candidates(item);
    if(candidateList.length>1){
      const box=document.createElement("section");
      box.className="history-item mail-order-candidates";
      const title=document.createElement("h4");
      title.textContent="Možné shody";
      box.appendChild(title);
      const selected=selectedSiteId(item);
      candidateList.slice(0,5).forEach((candidate,index)=>{
        const id=candidateId(candidate);
        const button=makeButton(candidateLabel(candidate,item) || `Shoda ${index+1}`,id && id===selected ? "primary" : "secondary");
        button.dataset.candidateSiteId=id;
        box.appendChild(button);
      });
      wrap.appendChild(box);
    }

    const mail=document.createElement("section");
    mail.className="history-item mail-order-original";
    const mailTitle=document.createElement("h4");
    mailTitle.textContent="Celý mail";
    const body=document.createElement("pre");
    body.textContent=mailDisplayText(item);
    mail.append(mailTitle,body);
    wrap.appendChild(mail);

    const actions=document.createElement("div");
    actions.className="mail-order-actions";
    if(text(item.status)==="applied"){
      const done=document.createElement("p");
      done.className="small";
      done.textContent=`Potvrzeno jako ${orderTypeLabel(orderType(item))}.`;
      actions.appendChild(done);
    }else{
      const approve=makeButton(`Schválit jako ${orderTypeLabel(orderType(item))}`,"primary");
      approve.id="mailOrderApprove";
      const reject=makeButton("Zamítnout","secondary");
      reject.id="mailOrderReject";
      actions.append(approve,reject);
    }
    wrap.appendChild(actions);
    detail.replaceChildren(wrap);
  }

  async function loadList(){
    renderShell();
    setStatus(state.mode==="history" ? "Načítám historii potvrzených mailů..." : "Načítám nové maily se shodou...");
    try{
      const payload={limit:60};
      if(state.mode==="history") payload.status="applied";
      const data=await callFunction("listMailOrderIntake",payload);
      const raw=Array.isArray(data.items) ? data.items : [];
      state.items=state.mode==="history" ? raw : raw.filter(item=>isOpenStatus(item.status) && hasUsableMatch(item));
      renderList();
      setStatus(state.mode==="history" ? `Historie: ${state.items.length} potvrzených mailů.` : `Nové maily se shodou: ${state.items.length}.`);
    }catch(error){
      setStatus(errorText(error));
      const list=document.getElementById("mailOrderIntakeList");
      if(list) list.textContent="Frontu se nepodařilo načíst.";
    }
  }

  async function loadDetail(id){
    if(!id) return;
    setStatus("Načítám mail...");
    try{
      const data=await callFunction("getMailOrderIntake",{intakeId:id});
      state.current=rerankClientCandidates(data.item || null);
      renderDetail(state.current);
      if(state.current) focusSite(selectedSiteId(state.current));
      setStatus(state.current ? "Mail načten. Zkontroluj text a navržené místo." : "Mail nebyl nalezen.");
    }catch(error){
      setStatus(errorText(error));
    }
  }

  async function approveCurrent(){
    const item=state.current;
    if(!item) return;
    const siteId=selectedSiteId(item);
    if(!siteId){ setStatus("Mail nemá vybrané místo v mapě."); return; }
    const type=orderTypeLabel(orderType(item));
    if(!window.confirm(`Schválit objednávku jako ${type} a změnit bod v mapě?`)) return;
    setStatus("Schvaluji a zapisuji do mapy...");
    try{
      await callFunction("approveMailOrderIntake",{intakeId:item.id,siteId,orderType:type});
      state.current=null;
      state.items=state.items.filter(entry=>entry.id!==item.id);
      renderList();
      renderDetail(null);
      if(typeof window.loadFirebaseSitesUnified==="function") window.loadFirebaseSitesUnified(siteId,{force:true,skipFreshnessCheck:true}).catch(()=>{});
      setStatus("Objednávka zapsána do mapy.");
      if(typeof window.showSaveConfirmation==="function") window.showSaveConfirmation("Objednávka zapsána do mapy.");
    }catch(error){
      setStatus(errorText(error));
    }
  }

  async function rejectCurrent(){
    const item=state.current;
    if(!item) return;
    if(!window.confirm("Zamítnout tento mail?")) return;
    setStatus("Zamítám mail...");
    try{
      await callFunction("rejectMailOrderIntake",{intakeId:item.id,reason:"Zamítnuto adminem"});
      state.current=null;
      state.items=state.items.filter(entry=>entry.id!==item.id);
      renderList();
      renderDetail(null);
      setStatus("Mail zamítnut.");
    }catch(error){
      setStatus(errorText(error));
    }
  }

  async function importGmail(){
    if(!window.confirm("Načíst nové objednávky z Gmailu?")) return;
    setStatus("Načítám Gmail...");
    try{
      const data=await callFunction("importGmailOrderIntake",{maxResults:10,markProcessed:true,addProcessedLabel:true});
      await loadList();
      const imported=Array.isArray(data.imported) ? data.imported.length : 0;
      const skipped=Array.isArray(data.skipped) ? data.skipped.length : 0;
      const failed=Array.isArray(data.failed) ? data.failed.length : 0;
      setStatus(`Gmail hotovo: načteno ${imported}, přeskočeno ${skipped}, chyby ${failed}.`);
    }catch(error){
      setStatus(errorText(error));
    }
  }

  function install(){
    window.openMailOrderIntakePanel=function(){
      state.mode="new";
      state.current=null;
      renderShell();
      loadList();
    };
    let button=document.getElementById("mailOrderIntakeBtn");
    if(button && !button.dataset.mailOrderFixBound){
      const clone=button.cloneNode(true);
      clone.dataset.mailOrderFixBound="1";
      clone.addEventListener("click",event=>{
        event.preventDefault();
        event.stopPropagation();
        window.openMailOrderIntakePanel();
      });
      button.replaceWith(clone);
      button=clone;
    }
    refreshMailOrderButtonVisibility(button);
  }

  install();
  window.addEventListener("DOMContentLoaded",install);
  window.addEventListener("load",install);
  let attempts=0;
  const timer=setInterval(()=>{
    install();
    attempts+=1;
    if(attempts>30) clearInterval(timer);
  },500);
})();
