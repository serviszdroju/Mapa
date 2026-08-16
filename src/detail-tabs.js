const DETAIL_TAB_NAMES=["data","protocol","gallery","document"];

function setDetailTab(tabName,options={}){
  const target=DETAIL_TAB_NAMES.includes(tabName) ? tabName : "data";
  const drawer=document.getElementById("drawer");
  if(!drawer) return;
  if(drawer.classList.contains("adding-new-site") && !options.force) return;
  if(target!=="protocol" && typeof window.setProtocolFormOpen==="function"){
    window.setProtocolFormOpen(false,{skipPrefill:true});
  }
  drawer.dataset.detailTab=target;
  document.querySelectorAll(".detail-tab").forEach(btn=>{
    const active=btn.getAttribute("data-detail-tab")===target;
    btn.classList.toggle("active",active);
    btn.setAttribute("aria-selected",active ? "true" : "false");
  });
  document.querySelectorAll("[data-detail-panel]").forEach(panel=>{
    const panels=String(panel.getAttribute("data-detail-panel") || "").split(/\s+/).filter(Boolean);
    const active=panels.includes(target);
    panel.classList.toggle("detail-tab-panel-active",active);
    panel.classList.toggle("detail-tab-hidden",!active);
  });
  if(options.scroll){
    const tabs=document.getElementById("detailTabs");
    if(tabs) tabs.scrollIntoView({behavior:"smooth",block:"start"});
  }
  if(typeof window.ensureDetailTabLoad==="function"){
    window.ensureDetailTabLoad(target);
  }
}

document.addEventListener("click",event=>{
  const btn=event.target.closest && event.target.closest(".detail-tab");
  if(!btn) return;
  event.preventDefault();
  setDetailTab(btn.getAttribute("data-detail-tab"),{scroll:true});
});
document.addEventListener("DOMContentLoaded",()=>setDetailTab("data",{force:true}));
window.setDetailTab=setDetailTab;
