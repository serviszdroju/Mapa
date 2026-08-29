export function createSitePhotoViewerRenderHelpers({
  canDeleteSitePhoto,
  photoDisplayUrl,
  photoFullUrl,
  photoRenderMeta,
  photoThumbUrl,
  safe,
  sitePhotoFolderGroups
}){
  function createSitePhotoEmptyNode(){
    const empty=document.createElement("div");
    empty.className="site-photos-empty";
    empty.textContent="Zatím nejsou uložené žádné fotografie.";
    return empty;
  }

  function createSitePhotoViewer(items,index){
    const item=items[index];
    const mainUrl=photoDisplayUrl(item);
    const fullUrl=photoFullUrl(item);
    const thumbCount=items.length;
    const photoMeta=photoRenderMeta(item,index);
    const currentFolder=photoMeta.currentFolder;
    const photoInfoRows=photoMeta.photoInfoRows;
    const downloadName=photoMeta.downloadName;
    const deleteAllowed=canDeleteSitePhoto(item);
    const viewer=document.createElement("div");
    viewer.className="site-photo-viewer";

    const stage=document.createElement("div");
    stage.className="site-photo-stage";
    const frame=document.createElement("div");
    frame.className="site-photo-frame";
    const mainLink=document.createElement("a");
    mainLink.className="site-photo-main";
    mainLink.href=fullUrl || mainUrl;
    mainLink.target="_blank";
    const mainImg=document.createElement("img");
    mainImg.src=mainUrl;
    mainImg.alt=`Fotografie bodu ${index+1}`;
    mainImg.decoding="async";
    mainLink.appendChild(mainImg);
    const prev=document.createElement("button");
    prev.className="secondary site-photo-arrow site-photo-arrow-prev";
    prev.type="button";
    prev.id="sitePhotoPrevBtn";
    prev.disabled=thumbCount<=1;
    prev.setAttribute("aria-label","Předchozí fotografie");
    prev.textContent="‹";
    const next=document.createElement("button");
    next.className="secondary site-photo-arrow site-photo-arrow-next";
    next.type="button";
    next.id="sitePhotoNextBtn";
    next.disabled=thumbCount<=1;
    next.setAttribute("aria-label","Další fotografie");
    next.textContent="›";
    const counter=document.createElement("span");
    counter.className="site-photo-counter";
    counter.textContent=`${index+1} / ${thumbCount}`;
    frame.append(mainLink,prev,next,counter);
    stage.appendChild(frame);
    viewer.appendChild(stage);

    const thumbs=document.createElement("div");
    thumbs.className="site-photo-thumbs";
    const folderGroups=sitePhotoFolderGroups(items);
    const activeFolder=currentFolder || (folderGroups[0] && folderGroups[0].folder) || "";
    const thumbsFragment=document.createDocumentFragment();
    for(const group of folderGroups){
      const groupEl=document.createElement("div");
      groupEl.className=`site-photo-folder-group ${group.folder===activeFolder ? "active" : ""}`.trim();
      const folderName=safe(group.folder) || "Bez názvu složky";
      const label=document.createElement("button");
      label.className="site-photo-folder-label";
      label.type="button";
      label.dataset.photoIdx=String((group.photos[0] && group.photos[0].idx) || 0);
      label.setAttribute("aria-label",`Zobrazit složku ${folderName}`);
      label.textContent=folderName;
      const row=document.createElement("div");
      row.className="site-photo-folder-thumbs";
      for(const {photo,idx} of group.photos){
        const button=document.createElement("button");
        button.className=`site-photo-thumb ${idx===index ? "active" : ""}`.trim();
        button.type="button";
        button.dataset.photoIdx=String(idx);
        button.setAttribute("aria-label",`Zobrazit fotografii ${idx+1}`);
        const thumbImg=document.createElement("img");
        thumbImg.src=photoThumbUrl(photo);
        thumbImg.alt=`Náhled ${idx+1}`;
        thumbImg.loading="lazy";
        thumbImg.decoding="async";
        button.appendChild(thumbImg);
        row.appendChild(button);
      }
      groupEl.append(label,row);
      thumbsFragment.appendChild(groupEl);
    }
    thumbs.appendChild(thumbsFragment);
    viewer.appendChild(thumbs);

    const actions=document.createElement("div");
    actions.className="site-photo-actions";
    const download=document.createElement("a");
    download.href=fullUrl || mainUrl;
    download.target="_blank";
    download.download=downloadName;
    download.textContent="Stáhnout fotku";
    const del=document.createElement("button");
    del.className="danger";
    del.type="button";
    del.id="deleteSitePhotoBtn";
    del.disabled=!deleteAllowed;
    del.textContent="Smazat fotku";
    actions.append(download,del);
    viewer.appendChild(actions);

    const infoStrip=document.createElement("div");
    infoStrip.className="site-photo-info-strip";
    for(const [label,value] of photoInfoRows){
      const pill=document.createElement("div");
      pill.className="site-photo-info-pill";
      const labelEl=document.createElement("span");
      labelEl.textContent=safe(label);
      const valueEl=document.createElement("b");
      valueEl.textContent=safe(value);
      pill.append(labelEl,valueEl);
      infoStrip.appendChild(pill);
    }
    viewer.appendChild(infoStrip);

    if(photoMeta.meta){
      const metaEl=document.createElement("div");
      metaEl.className="site-photo-meta";
      metaEl.textContent=photoMeta.meta;
      viewer.appendChild(metaEl);
    }

    return viewer;
  }

  return { createSitePhotoEmptyNode, createSitePhotoViewer };
}
