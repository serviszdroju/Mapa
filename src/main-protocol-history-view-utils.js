import { safe } from "./core-utils.js";

export function createMainProtocolHistoryViewHelpers({
  canViewAllMainProtocolHistory,
  historyDateLabel,
  historySavedDateLabel,
  isMainProtocolProcessed,
  mainProtocolControlDateIso,
  mainProtocolHistoryItemOwnedByCurrentUser,
  mainProtocolWorkflowLabel,
  mainProtocolWorkflowState,
  getMainProtocolHistoryCurrentItems,
  getMainProtocolHistoryDateFilter,
  getMainProtocolHistoryTechnicianFilter,
  setMainProtocolHistoryDateFilter,
  setMainProtocolHistoryTechnicianFilter,
  resetMainProtocolHistoryRenderSignature,
  renderMainProtocolHistoryRows,
  setMainProtocolHistoryProcessed,
  showSaveConfirmation,
  openDetailById,
  protocolGlobalHistoryTitle,
  protocolSourceStateLabel,
  protocolSourceTestMethodLabel,
  protocolTimeValue
}={}){
  function mainProtocolHistoryTechnicianLabel(item={}){
    return safe(item.createdBy || item.technicianEmail || item.techEmail || item.technician || item.techName || item.updatedBy);
  }

  function mainProtocolHistoryTechnicianKey(item={}){
    return mainProtocolHistoryTechnicianLabel(item).toLowerCase();
  }

  function mainProtocolHistoryTechnicianOptions(items=[]){
    const canViewAll=typeof canViewAllMainProtocolHistory==="function" ? canViewAllMainProtocolHistory() : false;
    if(!canViewAll) return [];
    const seen=new Set();
    const options=[];
    const source=Array.isArray(items) ? items : [];
    for(const item of source){
      const label=mainProtocolHistoryTechnicianLabel(item);
      const key=label.toLowerCase();
      if(!key || seen.has(key)) continue;
      seen.add(key);
      options.push({key,label});
    }
    options.sort((a,b)=>a.label.localeCompare(b.label,"cs",{sensitivity:"base"}));
    return options;
  }

  function mainProtocolHistoryVisibleRows(items=[],dateFilter="",technicianFilter=""){
    const canViewAll=typeof canViewAllMainProtocolHistory==="function" ? canViewAllMainProtocolHistory() : false;
    const filterDate=safe(dateFilter);
    const filterTechnician=canViewAll ? safe(technicianFilter).toLowerCase() : "";
    const rows=[];
    const source=Array.isArray(items) ? items : [];
    for(let idx=0;idx<source.length;idx++){
      const item=source[idx];
      if(!canViewAll && typeof mainProtocolHistoryItemOwnedByCurrentUser==="function" && !mainProtocolHistoryItemOwnedByCurrentUser(item)) continue;
      if(filterDate && typeof mainProtocolControlDateIso==="function" && mainProtocolControlDateIso(item)!==filterDate) continue;
      if(filterTechnician && mainProtocolHistoryTechnicianKey(item)!==filterTechnician) continue;
      const title=typeof protocolGlobalHistoryTitle==="function" ? protocolGlobalHistoryTitle(item) : "Protokol";
      const key=safe(item && (item.siteKey || item.firebaseDocId || item.siteId || (Array.isArray(item.siteKeys) ? item.siteKeys[0] : "")));
      const id=safe(item && (item._id || item.id || ""));
      const saved=typeof historySavedDateLabel==="function" ? historySavedDateLabel(item) : "";
      const checked=typeof historyDateLabel==="function" ? historyDateLabel(item) : "";
      const owner=safe(item && (item.createdBy || item.technicianEmail || item.updatedBy));
      const processed=typeof isMainProtocolProcessed==="function" ? isMainProtocolProcessed(item) : false;
      const workflow=typeof mainProtocolWorkflowState==="function" ? mainProtocolWorkflowState(item) : (processed ? "processed" : "idle");
      const workflowLabel=typeof mainProtocolWorkflowLabel==="function" ? mainProtocolWorkflowLabel(item) : "nepředáno ke zpracování";
      const showProcessedControl=canViewAll && (processed || workflow==="handoff");
      const sourceState=typeof protocolSourceStateLabel==="function" ? protocolSourceStateLabel(item) : "";
      const sourceTest=typeof protocolSourceTestMethodLabel==="function" ? protocolSourceTestMethodLabel(item.sourceTestMethod || item.testMethod) : "";
      const metaParts=[];
      if(saved) metaParts.push(`uloženo ${saved}`);
      if(checked) metaParts.push(`kontrola ${checked}`);
      if(sourceState) metaParts.push(sourceState);
      if(sourceTest) metaParts.push(sourceTest);
      if(owner && canViewAll) metaParts.push(owner);
      const signatureParts=[
        id || idx,
        title,
        key,
        saved,
        checked,
        owner,
        processed ? "processed" : "open",
        workflow,
        showProcessedControl ? "processed-control" : "no-processed-control",
        workflowLabel,
        sourceState,
        sourceTest,
        typeof protocolTimeValue==="function" ? protocolTimeValue(item) : ""
      ];
      let signature="";
      for(const value of signatureParts) signature+=`${String(value).length}:${value}`;
      rows.push({id,title,key,meta:metaParts.join(" | "),processed,workflow,workflowLabel,showProcessedControl,signature});
    }
    return rows;
  }

  function mainProtocolHistoryRenderKey(visibleRows=[],dateFilter="",technicianFilter=""){
    const adminPart=typeof canViewAllMainProtocolHistory==="function" && canViewAllMainProtocolHistory() ? "admin" : "user";
    const source=Array.isArray(visibleRows) ? visibleRows : [];
    let rows="";
    for(let i=0;i<source.length;i++){
      if(i) rows+="\u001f";
      rows+=source[i] && source[i].signature ? source[i].signature : "";
    }
    return `${adminPart}\u001e${dateFilter}\u001e${technicianFilter}\u001e${source.length}\u001e${rows}`;
  }

  function setSelectOptions(select,options=[],selectedValue=""){
    if(!select) return;
    const selected=safe(selectedValue).toLowerCase();
    const signature=options.map(option=>`${option.key}\u001f${option.label}`).join("\u001e");
    if(select.__szzOptionsSignature!==signature){
      const fragment=document.createDocumentFragment();
      const all=document.createElement("option");
      all.value="";
      all.textContent="Všichni";
      fragment.appendChild(all);
      for(const option of options){
        const node=document.createElement("option");
        node.value=option.key;
        node.textContent=option.label;
        fragment.appendChild(node);
      }
      select.replaceChildren(fragment);
      select.__szzOptionsSignature=signature;
    }
    select.value=options.some(option=>option.key===selected) ? selected : "";
  }

  function renderMainProtocolHistoryShellDom(drawer,{dateFilter="",technicianFilter="",items=[]}={}){
    const canViewAll=typeof canViewAllMainProtocolHistory==="function" ? canViewAllMainProtocolHistory() : false;
    const existingList=drawer?.querySelector?.("#mainProtocolHistoryList");
    const existingCard=drawer?.querySelector?.("#mainProtocolHistoryCard");
    const existingDateFilter=drawer?.querySelector?.("#mainProtocolHistoryDateFilter");
    const existingTechnicianFilter=drawer?.querySelector?.("#mainProtocolHistoryTechnicianFilter");
    if(existingList && existingCard && existingDateFilter && existingTechnicianFilter){
      if(existingTechnicianFilter){
        const technicianWrap=existingTechnicianFilter.closest(".main-history-technician-filter");
        if(technicianWrap) technicianWrap.hidden=!canViewAll;
        setSelectOptions(existingTechnicianFilter,mainProtocolHistoryTechnicianOptions(items),technicianFilter);
      }
      return {
        close:drawer.querySelector("#closeDrawer"),
        list:existingList,
        dateFilter:existingDateFilter,
        technicianFilter:existingTechnicianFilter,
        clearDate:drawer.querySelector("#mainProtocolHistoryDateClear"),
        reused:true
      };
    }
    const head=document.createElement("div");
    head.className="drawer-head";
    const titleWrap=document.createElement("div");
    const title=document.createElement("h2");
    title.textContent="Historie protokolů";
    const subtitle=document.createElement("p");
    subtitle.className="small";
    subtitle.textContent="Poslední uložené protokoly napříč mapou.";
    titleWrap.append(title,subtitle);
    const close=document.createElement("button");
    close.className="secondary x";
    close.type="button";
    close.id="closeDrawer";
    close.textContent="Zavřít";
    head.append(titleWrap,close);

    const card=document.createElement("div");
    card.className="card";
    card.id="mainProtocolHistoryCard";
    const heading=document.createElement("h3");
    heading.textContent="Poslední protokoly";
    const toolbar=document.createElement("div");
    toolbar.className="main-history-toolbar";
    const filterWrap=document.createElement("label");
    filterWrap.className="main-history-filter";
    const filterText=document.createElement("span");
    filterText.textContent="Datum kontroly";
    const dateFilterNode=document.createElement("input");
    dateFilterNode.type="date";
    dateFilterNode.id="mainProtocolHistoryDateFilter";
    dateFilterNode.value=dateFilter;
    filterWrap.append(filterText,dateFilterNode);
    const technicianWrap=document.createElement("label");
    technicianWrap.className="main-history-filter main-history-technician-filter";
    technicianWrap.hidden=!canViewAll;
    const technicianText=document.createElement("span");
    technicianText.textContent="Technik";
    const technicianFilterNode=document.createElement("select");
    technicianFilterNode.id="mainProtocolHistoryTechnicianFilter";
    setSelectOptions(technicianFilterNode,mainProtocolHistoryTechnicianOptions(items),technicianFilter);
    technicianWrap.append(technicianText,technicianFilterNode);
    const clearDate=document.createElement("button");
    clearDate.className="secondary main-history-clear-date";
    clearDate.type="button";
    clearDate.id="mainProtocolHistoryDateClear";
    clearDate.textContent="Vše";
    toolbar.append(filterWrap,technicianWrap,clearDate);
    const list=document.createElement("div");
    list.id="mainProtocolHistoryList";
    list.className="main-history-list small";
    list.textContent="Načítám historii...";
    card.append(heading,toolbar,list);

    drawer.replaceChildren(head,card);
    return {close,list,dateFilter:dateFilterNode,technicianFilter:technicianFilterNode,clearDate,reused:false};
  }

  function renderMainProtocolHistoryRowsDom({
    list,
    items=[],
    dateFilter="",
    technicianFilter="",
    currentSignature=""
  }={}){
    if(!list) return currentSignature || "";
    const canViewAll=typeof canViewAllMainProtocolHistory==="function" ? canViewAllMainProtocolHistory() : false;
    const effectiveTechnicianFilter=canViewAll ? technicianFilter : "";
    const visibleRows=mainProtocolHistoryVisibleRows(items,dateFilter,effectiveTechnicianFilter);
    if(!visibleRows.length){
      const emptySignature=`empty:${dateFilter}:${effectiveTechnicianFilter}`;
      list.textContent=dateFilter || effectiveTechnicianFilter ? "Pro vybraný filtr není uložený žádný protokol." : "Zatím není uložený žádný protokol.";
      return emptySignature;
    }
    const renderSignature=mainProtocolHistoryRenderKey(visibleRows,dateFilter,effectiveTechnicianFilter);
    if(currentSignature===renderSignature && list.childElementCount) return currentSignature;
    const fragment=document.createDocumentFragment();
    visibleRows.forEach(({id,title,key,meta,processed,workflow,workflowLabel,showProcessedControl})=>{
      const row=document.createElement("div");
      row.className=`main-history-row ${workflow || (processed ? "processed" : "idle")}`.trim();
      const top=document.createElement("div");
      top.className="main-history-row-main";
      const button=document.createElement("button");
      button.type="button";
      button.dataset.historySiteKey=key;
      button.textContent=title;
      if(showProcessedControl){
        const processedLabel=document.createElement("label");
        processedLabel.className="main-history-processed";
        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.checked=processed;
        checkbox.disabled=!id || !(typeof canViewAllMainProtocolHistory==="function" && canViewAllMainProtocolHistory());
        checkbox.dataset.mainHistoryProcessed=id;
        const processedText=document.createElement("span");
        processedText.textContent="Zpracováno";
        processedLabel.append(checkbox,processedText);
        top.append(processedLabel);
      }
      top.append(button);
      row.appendChild(top);
      if(meta){
        const small=document.createElement("small");
        small.textContent=meta;
        row.appendChild(small);
      }
      const state=document.createElement("span");
      state.className=`main-history-state ${workflow || "idle"}`;
      state.textContent=workflowLabel || "nepředáno ke zpracování";
      row.appendChild(state);
      fragment.appendChild(row);
    });
    list.replaceChildren(fragment);
    return renderSignature;
  }

  function currentItems(){
    return typeof getMainProtocolHistoryCurrentItems==="function" ? getMainProtocolHistoryCurrentItems() : [];
  }

  function resetSignature(){
    if(typeof resetMainProtocolHistoryRenderSignature==="function") resetMainProtocolHistoryRenderSignature();
  }

  function rerenderMainProtocolHistoryRows(list){
    if(typeof renderMainProtocolHistoryRows==="function") renderMainProtocolHistoryRows(list,currentItems());
  }

  function bindMainProtocolHistoryListClickDom(list){
    if(!list || list.__szzMainHistoryClickBound) return;
    list.__szzMainHistoryClickBound=true;
    list.addEventListener("change",async event=>{
      const checkbox=event.target.closest && event.target.closest("[data-main-history-processed]");
      if(!checkbox || !list.contains(checkbox)) return;
      if(!(typeof canViewAllMainProtocolHistory==="function" && canViewAllMainProtocolHistory())){
        checkbox.checked=!checkbox.checked;
        if(typeof showSaveConfirmation==="function") showSaveConfirmation("Zpracování protokolu potvrzuje Iva nebo správce.");
        return;
      }
      const id=checkbox.getAttribute("data-main-history-processed");
      const item=currentItems().find(row=>safe(row && (row._id || row.id))===safe(id));
      if(!item) return;
      checkbox.disabled=true;
      try{
        if(typeof setMainProtocolHistoryProcessed==="function"){
          await setMainProtocolHistoryProcessed(item,checkbox.checked);
        }
        resetSignature();
        rerenderMainProtocolHistoryRows(list);
        if(typeof showSaveConfirmation==="function"){
          showSaveConfirmation(checkbox.checked ? "Protokol označen jako zpracovaný." : "Zpracování protokolu zrušeno.");
        }
      }catch(e){
        checkbox.checked=!checkbox.checked;
        if(typeof showSaveConfirmation==="function") showSaveConfirmation("Zpracování protokolu se nepodařilo uložit.");
        console.warn("Označení protokolu jako zpracovaný selhalo",e);
      }finally{
        checkbox.disabled=false;
      }
    });
    list.addEventListener("click",event=>{
      const btn=event.target.closest && event.target.closest("[data-history-site-key]");
      if(!btn || !list.contains(btn)) return;
      const key=btn.getAttribute("data-history-site-key");
      if(key && typeof openDetailById==="function") openDetailById(key);
    });
  }

  function bindMainProtocolHistoryControlsDom({list,dateFilter,technicianFilter,clearDate}={}){
    if(dateFilter && !dateFilter.__szzMainHistoryDateBound){
      dateFilter.__szzMainHistoryDateBound=true;
      dateFilter.addEventListener("change",()=>{
        if(typeof setMainProtocolHistoryDateFilter==="function") setMainProtocolHistoryDateFilter(dateFilter.value || "");
        resetSignature();
        rerenderMainProtocolHistoryRows(list);
      });
    }
    if(technicianFilter && !technicianFilter.__szzMainHistoryTechnicianBound){
      technicianFilter.__szzMainHistoryTechnicianBound=true;
      technicianFilter.addEventListener("change",()=>{
        if(typeof setMainProtocolHistoryTechnicianFilter==="function") setMainProtocolHistoryTechnicianFilter(technicianFilter.value || "");
        resetSignature();
        rerenderMainProtocolHistoryRows(list);
      });
    }
    if(clearDate && !clearDate.__szzMainHistoryDateBound){
      clearDate.__szzMainHistoryDateBound=true;
      clearDate.addEventListener("click",()=>{
        if(typeof setMainProtocolHistoryDateFilter==="function") setMainProtocolHistoryDateFilter("");
        if(typeof setMainProtocolHistoryTechnicianFilter==="function") setMainProtocolHistoryTechnicianFilter("");
        if(dateFilter) dateFilter.value="";
        if(technicianFilter) technicianFilter.value="";
        resetSignature();
        rerenderMainProtocolHistoryRows(list);
      });
    }
  }

  return {
    bindMainProtocolHistoryControlsDom,
    bindMainProtocolHistoryListClickDom,
    mainProtocolHistoryRenderKey,
    mainProtocolHistoryTechnicianOptions,
    mainProtocolHistoryVisibleRows,
    renderMainProtocolHistoryShellDom,
    renderMainProtocolHistoryRowsDom
  };
}
