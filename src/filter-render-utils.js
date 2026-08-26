export function createFilterRenderScheduler({
  filterControls,
  requestRender,
  updateStatusFilterColor,
  setTimeoutFn=typeof window!=="undefined" ? window.setTimeout.bind(window) : setTimeout,
  clearTimeoutFn=typeof window!=="undefined" ? window.clearTimeout.bind(window) : clearTimeout
}={}){
  let filterRenderTimer=0;
  let lastFilterInputSignature="";

  function filterInputSignature(){
    const controls=typeof filterControls==="function" ? filterControls() : {};
    const {search,status,region}=controls;
    return [
      search ? search.value : "",
      status ? status.value : "",
      region ? region.value : ""
    ].join("\u001f");
  }

  function scheduleFilterRender(delay=220){
    const signature=filterInputSignature();
    if(signature===lastFilterInputSignature) return;
    lastFilterInputSignature=signature;
    clearTimeoutFn(filterRenderTimer);
    filterRenderTimer=setTimeoutFn(()=>{
      if(typeof requestRender==="function") requestRender();
    },delay);
  }

  function requestFilterRenderNow(){
    const signature=filterInputSignature();
    if(signature===lastFilterInputSignature) return;
    lastFilterInputSignature=signature;
    if(typeof requestRender==="function") requestRender();
  }

  function bindFilterRenderControls(){
    lastFilterInputSignature=filterInputSignature();
    const controls=typeof filterControls==="function" ? filterControls() : {};
    controls.search?.addEventListener("input",()=>scheduleFilterRender());
    controls.status?.addEventListener("change",()=>{
      if(typeof updateStatusFilterColor==="function") updateStatusFilterColor();
      requestFilterRenderNow();
    });
    controls.region?.addEventListener("change",requestFilterRenderNow);
  }

  return {
    bindFilterRenderControls,
    filterInputSignature,
    requestFilterRenderNow,
    scheduleFilterRender
  };
}

export function createFilterOptionHelpers({
  regionOptions,
  statusOptions,
  filterControls
}){
  function statusFilterClass(v){
    if(v==="Propadlá kontrola") return "status-red";
    if(v==="1–30 dní k termínu") return "status-orange";
    if(v==="Kontrola objednaná") return "status-yellow";
    if(v==="Objednaná oprava") return "status-blue";
    if(v==="Stop Stav") return "status-gray";
    if(v==="OK / ostatní") return "status-green";
    if(v==="Hlídáme termín sami") return "status-pink";
    return "";
  }

  function styleStatusOption(option,cls){
    if(!cls) return;
    option.className=cls;
    if(cls==="status-red"){option.style.backgroundColor="#fee2e2";option.style.color="#991b1b";}
    if(cls==="status-orange"){option.style.backgroundColor="#ffedd5";option.style.color="#9a3412";}
    if(cls==="status-yellow"){option.style.backgroundColor="#fef3c7";option.style.color="#92400e";}
    if(cls==="status-blue"){option.style.backgroundColor="#dbeafe";option.style.color="#1d4ed8";}
    if(cls==="status-green"){option.style.backgroundColor="#dcfce7";option.style.color="#166534";}
    if(cls==="status-gray"){option.style.backgroundColor="#f1f5f9";option.style.color="#334155";}
    if(cls==="status-pink"){option.style.backgroundColor="#fdf2f8";option.style.color="#9d174d";}
  }

  function filters(){
    const {status:st,region:kr}=filterControls();
    if(!st || !kr) return;
    const currentStatus=st.value;
    const currentRegion=kr.value;
    const signature=`status:${statusOptions.join("|")};region:${regionOptions.join("|")}`;
    if(st.dataset.filterOptionsSignature!==signature){
      const statusFragment=document.createDocumentFragment();
      const statusAll=document.createElement("option");
      statusAll.value="";
      statusAll.textContent="Vše";
      statusFragment.appendChild(statusAll);
      statusOptions.forEach(v=>{
        const o=document.createElement("option");
        o.value=v;
        o.textContent=v;
        styleStatusOption(o,statusFilterClass(v));
        statusFragment.appendChild(o);
      });
      st.replaceChildren(statusFragment);
      st.dataset.filterOptionsSignature=signature;
    }
    if(kr.dataset.filterOptionsSignature!==signature){
      const regionFragment=document.createDocumentFragment();
      const regionAll=document.createElement("option");
      regionAll.value="";
      regionAll.textContent="Vše";
      regionFragment.appendChild(regionAll);
      regionOptions.forEach(v=>{
        const o=document.createElement("option");
        o.value=v;
        o.textContent=v;
        regionFragment.appendChild(o);
      });
      kr.replaceChildren(regionFragment);
      kr.dataset.filterOptionsSignature=signature;
    }
    if((currentStatus===""||statusOptions.includes(currentStatus))&&st.value!==currentStatus) st.value=currentStatus;
    if((currentRegion===""||regionOptions.includes(currentRegion))&&kr.value!==currentRegion) kr.value=currentRegion;
    updateStatusFilterColor();
  }

  function updateStatusFilterColor(){
    const st=filterControls().status;
    if(!st) return;
    const cls=statusFilterClass(st.value);
    const previous=st.dataset.statusFilterClass || "";
    if(previous===cls) return;
    if(previous) st.classList.remove(previous);
    else st.classList.remove("status-red","status-orange","status-yellow","status-blue","status-green","status-gray","status-pink");
    if(cls) st.classList.add(cls);
    st.dataset.statusFilterClass=cls;
  }

  return {
    filters,
    statusFilterClass,
    updateStatusFilterColor
  };
}

export function createFilterDomHelpers({
  updateStatusFilterColor
}={}){
  let filterControlCache=null;

  function filterControls(){
    if(
      filterControlCache &&
      filterControlCache.search?.isConnected &&
      filterControlCache.status?.isConnected &&
      filterControlCache.region?.isConnected
    ){
      return filterControlCache;
    }
    filterControlCache={
      search:document.getElementById("search"),
      status:document.getElementById("statusFilter"),
      region:document.getElementById("regionFilter")
    };
    return filterControlCache;
  }

  function clearFiltersForOpenedSite(){
    const {search,status,region}=filterControls();
    if(search && search.value!=="") search.value="";
    if(status && status.value!=="") status.value="";
    if(region && region.value!=="") region.value="";
    if(typeof updateStatusFilterColor==="function") updateStatusFilterColor();
  }

  return {
    clearFiltersForOpenedSite,
    filterControls
  };
}
