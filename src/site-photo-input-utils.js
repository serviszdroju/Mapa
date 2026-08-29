export function createSitePhotoInputHelpers({
  formFieldNode,
  setTextIfChanged
}){
  let sitePhotoPreviewUrls=[];

  function sitePhotosNode(id){
    return formFieldNode(id);
  }

  function sitePhotosListNode(){
    return sitePhotosNode("sitePhotosList");
  }

  function sitePhotosStatusNode(){
    return sitePhotosNode("sitePhotosStatus");
  }

  function setSitePhotosStatusText(text){
    setTextIfChanged(sitePhotosStatusNode(),text);
  }

  function resetSitePhotoInput(){
    const input=sitePhotosNode("sitePhotosInput");
    const camera=sitePhotosNode("siteCameraInput");
    if(input) input.value="";
    if(camera) camera.value="";
    renderSitePhotoPreview();
  }

  function selectedSitePhotoFiles(){
    const gallery=sitePhotosNode("sitePhotosInput");
    const camera=sitePhotosNode("siteCameraInput");
    return [
      ...Array.from(gallery?.files || []),
      ...Array.from(camera?.files || [])
    ];
  }

  function renderSitePhotoPreview(){
    const box=sitePhotosNode("sitePhotoPreview");
    if(!box) return;
    sitePhotoPreviewUrls.forEach(url=>URL.revokeObjectURL(url));
    sitePhotoPreviewUrls=[];
    const files=selectedSitePhotoFiles();
    if(!files.length){
      box.replaceChildren();
      return;
    }
    const head=document.createElement("div");
    head.className="photo-preview-head";
    const title=document.createElement("span");
    title.textContent="Vybrané fotografie";
    const count=document.createElement("span");
    count.textContent=`${files.length} ks`;
    head.append(title,count);

    const grid=document.createElement("div");
    grid.className="photo-preview-grid";
    const fragment=document.createDocumentFragment();
    files.forEach((file,idx)=>{
      const url=URL.createObjectURL(file);
      sitePhotoPreviewUrls.push(url);
      const item=document.createElement("div");
      item.className="photo-preview-item";
      const img=document.createElement("img");
      img.src=url;
      img.alt=`Nová fotografie ${idx+1}`;
      img.decoding="async";
      const index=document.createElement("span");
      index.className="photo-preview-index";
      index.textContent=String(idx+1);
      item.append(img,index);
      fragment.appendChild(item);
    });
    grid.appendChild(fragment);
    box.replaceChildren(head,grid);
  }

  return {
    renderSitePhotoPreview,
    resetSitePhotoInput,
    selectedSitePhotoFiles,
    setSitePhotosStatusText,
    sitePhotosListNode,
    sitePhotosNode,
    sitePhotosStatusNode
  };
}
