function C({base64ToBytes:m,safe:j}){function x(n=""){const a=j(n).split(",").pop()||"";return m(a)}function l(n){return new TextEncoder().encode(String(n||""))}function F(n=[]){const a=n.reduce((r,i)=>r+i.length,0),g=new Uint8Array(a);let s=0;return n.forEach(r=>{g.set(r,s),s+=r.length}),g}function P(n=[]){const s=n.length,r=[],i=[];let d=0;const o=t=>{const e=typeof t=="string"?l(t):t;r.push(e),d+=e.length},f=2+s*3,c=(t,e)=>{i[t]=d,o(`${t} 0 obj
`),(Array.isArray(e)?e:[e]).forEach(o),o(`
endobj
`)};o(`%PDF-1.4
%âãÏÓ
`),c(1,"<< /Type /Catalog /Pages 2 0 R >>");const R=Array.from({length:s},(t,e)=>`${3+e*3} 0 R`).join(" ");c(2,`<< /Type /Pages /Kids [${R}] /Count ${s} >>`),n.forEach((t,e)=>{const $=3+e*3,p=$+1,u=$+2,y=`Im${e+1}`,h=x(t.dataUrl),b=`q
${595.28.toFixed(2)} 0 0 ${841.89.toFixed(2)} 0 0 cm
/${y} Do
Q`;c($,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${595.28.toFixed(2)} ${841.89.toFixed(2)}] /Resources << /XObject << /${y} ${p} 0 R >> >> /Contents ${u} 0 R >>`),c(p,[`<< /Type /XObject /Subtype /Image /Width ${t.width} /Height ${t.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${h.length} >>
stream
`,h,`
endstream`]),c(u,`<< /Length ${l(b).length} >>
stream
${b}
endstream`)});const B=d;o(`xref
0 ${f+1}
`),o(`0000000000 65535 f 
`);for(let t=1;t<=f;t++)o(`${String(i[t]||0).padStart(10,"0")} 00000 n 
`);return o(`trailer
<< /Size ${f+1} /Root 1 0 R >>
startxref
${B}
%%EOF`),F(r)}return{buildPdfFromJpegPages:P}}export{C as createPdfByteWriterHelpers};
