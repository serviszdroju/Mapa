export function createPdfByteWriterHelpers({
  base64ToBytes,
  safe
}){
  function bytesFromDataUrl(dataUrl=""){
    const base64=safe(dataUrl).split(",").pop() || "";
    return base64ToBytes(base64);
  }

  function textBytes(text){
    return new TextEncoder().encode(String(text || ""));
  }

  function concatBytes(chunks=[]){
    const total=chunks.reduce((sum,chunk)=>sum+chunk.length,0);
    const out=new Uint8Array(total);
    let offset=0;
    chunks.forEach(chunk=>{
      out.set(chunk,offset);
      offset+=chunk.length;
    });
    return out;
  }

  function buildPdfFromJpegPages(pages=[]){
    const pageW=595.28;
    const pageH=841.89;
    const count=pages.length;
    const chunks=[];
    const offsets=[];
    let position=0;
    const push=chunk=>{
      const bytes=typeof chunk==="string" ? textBytes(chunk) : chunk;
      chunks.push(bytes);
      position+=bytes.length;
    };
    const objectCount=2+(count*3);
    const objectBody=(num,parts)=>{
      offsets[num]=position;
      push(`${num} 0 obj\n`);
      (Array.isArray(parts) ? parts : [parts]).forEach(push);
      push("\nendobj\n");
    };
    push("%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n");
    objectBody(1,"<< /Type /Catalog /Pages 2 0 R >>");
    const kids=Array.from({length:count},(_,idx)=>`${3+(idx*3)} 0 R`).join(" ");
    objectBody(2,`<< /Type /Pages /Kids [${kids}] /Count ${count} >>`);
    pages.forEach((page,idx)=>{
      const pageObj=3+(idx*3);
      const imageObj=pageObj+1;
      const contentObj=pageObj+2;
      const imageName=`Im${idx+1}`;
      const imageBytes=bytesFromDataUrl(page.dataUrl);
      const content=`q\n${pageW.toFixed(2)} 0 0 ${pageH.toFixed(2)} 0 0 cm\n/${imageName} Do\nQ`;
      objectBody(pageObj,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW.toFixed(2)} ${pageH.toFixed(2)}] /Resources << /XObject << /${imageName} ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>`);
      objectBody(imageObj,[`<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`,imageBytes,"\nendstream"]);
      objectBody(contentObj,`<< /Length ${textBytes(content).length} >>\nstream\n${content}\nendstream`);
    });
    const xrefStart=position;
    push(`xref\n0 ${objectCount+1}\n`);
    push("0000000000 65535 f \n");
    for(let i=1;i<=objectCount;i++) push(`${String(offsets[i] || 0).padStart(10,"0")} 00000 n \n`);
    push(`trailer\n<< /Size ${objectCount+1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);
    return concatBytes(chunks);
  }

  return {
    buildPdfFromJpegPages
  };
}
