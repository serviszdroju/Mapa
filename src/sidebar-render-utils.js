export function createSidebarRenderHelpers({
  displayNext,
  daysToComputedNext,
  detailKey,
  getFilteredRowsSignature,
  getRowsIndexVersion,
  gpsBoxNode,
  gpsCountNode,
  groupPrimaryRow,
  openDetailById,
  pill,
  safeValue,
  shownCountNode,
  sidebarListNode,
  siteSourceLabel,
  statusText
}){
  const SIDEBAR_GROUP_RENDER_LIMIT=160;
  let sidebarRenderCache={groups:null,signature:"",renderedEmpty:false};
  let sidebarSortedGroupsCache={groups:null,signature:"",visibleGroups:[]};
  let renderCountersCache={shown:null,gps:null};

  function resetSidebarRenderCaches(){
    sidebarRenderCache={groups:null,signature:"",renderedEmpty:false};
    sidebarSortedGroupsCache={groups:null,signature:"",visibleGroups:[]};
    renderCountersCache={shown:null,gps:null};
  }

  function groupNextSortValue(group){
    if(group && Number.isFinite(group._nextSortValue)) return group._nextSortValue;
    const representative=groupPrimaryRow(group);
    return representative ? (daysToComputedNext(representative) ?? 999999) : 999999;
  }

  function topSidebarGroups(groups,limit=SIDEBAR_GROUP_RENDER_LIMIT){
    const source=Array.isArray(groups) ? groups : [];
    if(source.length<=limit){
      return source.slice().sort((a,b)=>groupNextSortValue(a)-groupNextSortValue(b));
    }
    const top=[];
    for(const group of source){
      const value=groupNextSortValue(group);
      if(top.length>=limit && value>=top[top.length-1].value) continue;
      const item={group,value};
      let insertAt=top.length;
      while(insertAt>0 && value<top[insertAt-1].value) insertAt--;
      top.splice(insertAt,0,item);
      if(top.length>limit) top.pop();
    }
    const result=[];
    for(const item of top) result.push(item.group);
    return result;
  }

  function sidebarVisibleGroups(groups,signature){
    if(sidebarSortedGroupsCache.groups===groups && sidebarSortedGroupsCache.signature===signature){
      return sidebarSortedGroupsCache.visibleGroups;
    }
    const visibleGroups=topSidebarGroups(groups);
    sidebarSortedGroupsCache={groups,signature,visibleGroups};
    return visibleGroups;
  }

  function bindSidebarListClick(list){
    if(!list || list.__szzSidebarClickBound) return;
    list.__szzSidebarClickBound=true;
    list.addEventListener("click",event=>{
      const item=event.target.closest && event.target.closest("[data-sidebar-detail-key]");
      if(!item || !list.contains(item)) return;
      const key=item.getAttribute("data-sidebar-detail-key");
      if(key) openDetailById(key);
    });
  }

  function renderSidebarGroups(groups){
    const list=sidebarListNode();
    if(!list) return;
    bindSidebarListClick(list);
    const signature=`${getRowsIndexVersion()}\u001f${getFilteredRowsSignature() || ""}\u001f${groups ? groups.length : 0}`;
    if(sidebarRenderCache.groups===groups && sidebarRenderCache.signature===signature && (list.childElementCount || sidebarRenderCache.renderedEmpty)){
      return;
    }
    const fragment=document.createDocumentFragment();
    const visibleGroups=sidebarVisibleGroups(groups,signature);
    for(const group of visibleGroups){
      const r=groupPrimaryRow(group);
      if(!r) continue;
      fragment.appendChild(createSidebarGroupItem(group,r));
    }
    const renderedEmpty=!fragment.childNodes.length;
    list.replaceChildren(fragment);
    sidebarRenderCache={groups,signature,renderedEmpty};
  }

  function createSidebarGroupItem(group,r){
    const d=document.createElement("div");
    d.className="item";
    d.dataset.sidebarDetailKey=safeValue(detailKey(r));
    const title=document.createElement("div");
    title.className="item-title";
    title.textContent=group.label || r.adresa || "Bez názvu";
    d.appendChild(title);

    const meta=document.createElement("div");
    meta.className="item-meta";
    meta.append(document.createTextNode(group.rows.length>1 ? `${group.rows.length} zdrojů na místě` : siteSourceLabel(r)));
    meta.appendChild(document.createElement("br"));
    meta.append(document.createTextNode("Další kontrola: "));
    const next=document.createElement("b");
    next.textContent=displayNext(r) || "není vyplněno";
    meta.appendChild(next);
    d.appendChild(meta);

    if(group.rows.length>1){
      const sources=document.createElement("div");
      sources.className="item-sources";
      const chipLimit=Math.min(group.rows.length,5);
      for(let i=0;i<chipLimit;i++){
        const row=group.rows[i];
        const chip=document.createElement("span");
        chip.className="item-source-chip";
        chip.textContent=siteSourceLabel(row);
        sources.appendChild(chip);
      }
      if(group.rows.length>5){
        const more=document.createElement("span");
        more.className="item-source-chip";
        more.textContent=`+${group.rows.length-5}`;
        sources.appendChild(more);
      }
      d.appendChild(sources);
    }

    const status=document.createElement("span");
    status.className=`pill ${pill(r)}`;
    status.textContent=statusText(r);
    d.appendChild(status);
    return d;
  }

  function setCounterTextIfChanged(el,value){
    if(el && el.textContent!==String(value)) el.textContent=String(value);
  }

  function renderCounters(visibleCount,gpsCount){
    if(renderCountersCache.shown!==visibleCount){
      setCounterTextIfChanged(shownCountNode(),visibleCount);
      renderCountersCache.shown=visibleCount;
    }
    if(renderCountersCache.gps!==gpsCount){
      setCounterTextIfChanged(gpsCountNode(),gpsCount);
      renderCountersCache.gps=gpsCount;
    }
    const box=gpsBoxNode();
    if(box && (box.style.display!=="none" || box.className!=="notice" || box.childNodes.length)){
      if(box.style.display!=="none") box.style.display="none";
      if(box.className!=="notice") box.className="notice";
      if(box.childNodes.length) box.replaceChildren();
    }
  }

  return {
    renderCounters,
    renderSidebarGroups,
    resetSidebarRenderCaches
  };
}
