export function createDetailDrawerShellHelpers({
  bindProtocolToggleButton=()=>{},
  closeDetailDrawer=()=>{},
  drawerNode=()=>null
}={}){
  function bindDrawerCloseButton(){
    const close=document.getElementById("closeDrawer");
    const drawer=drawerNode();
    if(close && drawer) close.onclick=()=>closeDetailDrawer();
  }

  function bindDetailShellControls(){
    bindDrawerCloseButton();
    bindProtocolToggleButton();
  }

  function dedupeDetailTabs(drawer=drawerNode()){
    if(!drawer) return;
    const tabBars=Array.from(drawer.querySelectorAll(".detail-tabs"));
    if(!tabBars.length) return;
    const keep=tabBars.find(el=>el.id==="detailTabs") || tabBars[0];
    keep.id="detailTabs";
    tabBars.forEach(el=>{ if(el!==keep) el.remove(); });
    const seenTabs=new Set();
    keep.querySelectorAll(".detail-tab[data-detail-tab]").forEach(btn=>{
      const key=btn.getAttribute("data-detail-tab");
      if(seenTabs.has(key)){
        btn.remove();
        return;
      }
      seenTabs.add(key);
    });
  }

  function drawerNodesHaveDetailShell(nodes=[]){
    return (nodes || []).some(node=>{
      if(!node || node.nodeType!==1) return false;
      return node.id==="detailTable"
        || node.id==="detailTabs"
        || !!(node.querySelector && (node.querySelector("#detailTable") || node.querySelector("#detailTabs")));
    });
  }

  function cloneDrawerNodes(nodes=[]){
    return (nodes || []).map(node=>node && node.cloneNode ? node.cloneNode(true) : null).filter(Boolean);
  }

  function captureNormalDetailDrawerShell(drawer=drawerNode()){
    if(!drawer || !(drawer.querySelector("#detailTable") && drawer.querySelector("#detailTabs"))) return;
    dedupeDetailTabs(drawer);
    const nodes=Array.from(drawer.childNodes);
    window.__normalDrawerNodes=nodes;
    window.__normalDrawerNodeClones=cloneDrawerNodes(nodes);
  }

  function restoreNormalDetailDrawerShell(){
    const drawer=drawerNode();
    if(!drawer) return null;
    const hasDetailShell=!!(drawer.querySelector("#detailTable") && drawer.querySelector("#detailTabs"));
    if(!hasDetailShell){
      if(drawerNodesHaveDetailShell(window.__normalDrawerNodes)){
        drawer.replaceChildren(...window.__normalDrawerNodes);
      }else if(drawerNodesHaveDetailShell(window.__normalDrawerNodeClones)){
        drawer.replaceChildren(...cloneDrawerNodes(window.__normalDrawerNodeClones));
      }
    }
    dedupeDetailTabs(drawer);
    captureNormalDetailDrawerShell(drawer);
    bindDetailShellControls();
    return drawer;
  }

  return {
    bindDetailShellControls,
    bindDrawerCloseButton,
    captureNormalDetailDrawerShell,
    dedupeDetailTabs,
    restoreNormalDetailDrawerShell
  };
}
