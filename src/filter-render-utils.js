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
