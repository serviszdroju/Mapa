export function createSiteAttachmentDataHelpers({
  getSelectedSite,
  siteSiblingRows
}){
  function readAttachmentFileData(file){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(String(reader.result || ""));
      reader.onerror=()=>reject(reader.error || new Error("Přílohu se nepodařilo načíst."));
      reader.readAsDataURL(file);
    });
  }

  function attachmentSiblingRows(site=getSelectedSite()){
    const siblings=siteSiblingRows(site).filter(Boolean);
    return siblings.length ? siblings : (site ? [site] : []);
  }

  return {
    attachmentSiblingRows,
    readAttachmentFileData
  };
}
