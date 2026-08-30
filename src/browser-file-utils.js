export function createBrowserFileHelpers({ safe }){
  function downloadBlobFile(filename,blob){
    const url=URL.createObjectURL(blob);
    const link=document.createElement("a");
    link.href=url;
    link.download=filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(()=>{
      URL.revokeObjectURL(url);
      link.remove();
    },0);
  }

  function blobToBase64(blob){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>{
        const result=String(reader.result || "");
        resolve(result.includes(",") ? result.split(",").pop() : result);
      };
      reader.onerror=()=>reject(reader.error || new Error("Soubor nejde připravit k odeslání."));
      reader.readAsDataURL(blob);
    });
  }

  function protocolPdfFileNameFromWord(fileName=""){
    const clean=safe(fileName);
    return clean.toLowerCase().endsWith(".docx")
      ? `${clean.slice(0,-5)}.pdf`
      : (clean.toLowerCase().endsWith(".pdf") ? clean : "protokol.pdf");
  }

  function loadDataUrlImage(dataUrl=""){
    return new Promise((resolve,reject)=>{
      const src=safe(dataUrl);
      if(!src) return resolve(null);
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=()=>reject(new Error("Obrázek podpisu se nepodařilo načíst."));
      img.src=src;
    });
  }

  function drawImageContained(ctx,img,x,y,w,h){
    if(!ctx || !img || !img.width || !img.height) return;
    const scale=Math.min(w/img.width,h/img.height);
    const iw=img.width*scale;
    const ih=img.height*scale;
    ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);
  }

  return {
    blobToBase64,
    downloadBlobFile,
    drawImageContained,
    loadDataUrlImage,
    protocolPdfFileNameFromWord
  };
}
