export function createSiteAttachmentInputHelpers({
  bytesLabel,
  formFieldNode,
  setTextIfChanged
}){
  function siteAttachmentsNode(id){
    return formFieldNode(id);
  }

  function siteAttachmentsStatusNode(){
    return siteAttachmentsNode("siteAttachmentsStatus");
  }

  function setSiteAttachmentsStatusText(text){
    setTextIfChanged(siteAttachmentsStatusNode(),text);
  }

  function selectedSiteAttachmentFiles(){
    return Array.from(siteAttachmentsNode("siteAttachmentsInput")?.files || []);
  }

  function resetSiteAttachmentInput(){
    const input=siteAttachmentsNode("siteAttachmentsInput");
    if(input) input.value="";
    renderSiteAttachmentPreview();
  }

  function renderSiteAttachmentPreview(){
    const box=siteAttachmentsNode("siteAttachmentsPreview");
    if(!box) return;
    const files=selectedSiteAttachmentFiles();
    if(!files.length){
      box.replaceChildren();
      return;
    }
    const fragment=document.createDocumentFragment();
    files.forEach(file=>{
      const row=document.createElement("div");
      row.textContent=`${file.name || "Příloha"}${bytesLabel(file.size) ? ` · ${bytesLabel(file.size)}` : ""}`;
      fragment.appendChild(row);
    });
    box.replaceChildren(fragment);
  }

  return {
    renderSiteAttachmentPreview,
    resetSiteAttachmentInput,
    selectedSiteAttachmentFiles,
    setSiteAttachmentsStatusText,
    siteAttachmentsNode,
    siteAttachmentsStatusNode
  };
}
