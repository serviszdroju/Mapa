export function createSiteAttachmentRenderHelpers({
  attachmentDisplayUrl,
  attachmentFileName,
  attachmentRenderSignature,
  bytesLabel,
  photoInsertedLabel,
  siteAttachmentsNode
}){
  let siteAttachmentRenderSignature="";

  function resetSiteAttachmentRenderSignature(){
    siteAttachmentRenderSignature="";
  }

  function renderSiteAttachments(items=[]){
    const list=siteAttachmentsNode("siteAttachmentsList");
    if(!list) return;
    const source=Array.isArray(items) ? items : [];
    const signature=attachmentRenderSignature(source);
    if(siteAttachmentRenderSignature===signature && list.childElementCount) return;
    siteAttachmentRenderSignature=signature;
    if(!source.length){
      const empty=document.createElement("div");
      empty.className="site-photos-empty";
      empty.textContent="Zatím nejsou uložené žádné přílohy.";
      list.replaceChildren(empty);
      return;
    }
    const fragment=document.createDocumentFragment();
    source.forEach((item,idx)=>{
      const row=document.createElement("div");
      row.className="site-attachment-item";
      const info=document.createElement("div");
      const title=document.createElement("div");
      title.className="site-attachment-title";
      title.textContent=attachmentFileName(item,idx);
      const meta=document.createElement("div");
      meta.className="site-attachment-meta";
      meta.textContent=[
        photoInsertedLabel(item),
        bytesLabel(item.size || item.originalSize),
        item.uploadedBy
      ].filter(Boolean).join(" · ");
      info.append(title,meta);
      const actions=document.createElement("div");
      actions.className="site-attachment-actions";
      const url=attachmentDisplayUrl(item);
      if(url){
        const open=document.createElement("a");
        open.className="secondary";
        open.href=url;
        open.target="_blank";
        open.rel="noopener";
        open.textContent="Otevřít";
        const download=document.createElement("a");
        download.className="secondary";
        download.href=url;
        download.download=attachmentFileName(item,idx);
        download.textContent="Stáhnout";
        actions.append(open,download);
      }
      row.append(info,actions);
      fragment.appendChild(row);
    });
    list.replaceChildren(fragment);
  }

  return {
    renderSiteAttachments,
    resetSiteAttachmentRenderSignature
  };
}
