const DOCX_MIME="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const encoder=new TextEncoder();
let zipCrcTable=null;

function utf8Bytes(text){
  return encoder.encode(text);
}

function dataBytes(data){
  if(data instanceof Uint8Array) return data;
  if(data instanceof ArrayBuffer) return new Uint8Array(data);
  return utf8Bytes(String(data ?? ""));
}

function zipCrc32(bytes){
  if(!zipCrcTable){
    zipCrcTable=new Uint32Array(256);
    for(let i=0;i<256;i++){
      let c=i;
      for(let k=0;k<8;k++) c=(c&1) ? (0xEDB88320 ^ (c>>>1)) : (c>>>1);
      zipCrcTable[i]=c>>>0;
    }
  }
  let crc=0xFFFFFFFF;
  for(const b of bytes) crc=zipCrcTable[(crc^b)&0xFF] ^ (crc>>>8);
  return (crc^0xFFFFFFFF)>>>0;
}

function zipDosDateTime(date=new Date()){
  const year=Math.max(1980,date.getFullYear());
  return {
    time:((date.getHours()&31)<<11)|((date.getMinutes()&63)<<5)|Math.floor((date.getSeconds()&63)/2),
    date:((year-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate()
  };
}

function zipHeader(size){
  const bytes=new Uint8Array(size);
  const view=new DataView(bytes.buffer);
  return {
    bytes,
    u16(offset,value){view.setUint16(offset,value,true);},
    u32(offset,value){view.setUint32(offset,value>>>0,true);}
  };
}

function concatBytes(parts){
  const total=parts.reduce((sum,part)=>sum+part.length,0);
  const out=new Uint8Array(total);
  let offset=0;
  for(const part of parts){
    out.set(part,offset);
    offset+=part.length;
  }
  return out;
}

export function buildStoredZip(entries){
  const now=zipDosDateTime(new Date());
  const prepared=entries.map(entry=>{
    const data=dataBytes(entry.data);
    return {name:entry.name,nameBytes:utf8Bytes(entry.name),data,crc:zipCrc32(data)};
  });
  const localParts=[];
  const centralParts=[];
  let offset=0;
  for(const file of prepared){
    const local=zipHeader(30+file.nameBytes.length);
    local.u32(0,0x04034b50);
    local.u16(4,20);
    local.u16(6,0x0800);
    local.u16(8,0);
    local.u16(10,now.time);
    local.u16(12,now.date);
    local.u32(14,file.crc);
    local.u32(18,file.data.length);
    local.u32(22,file.data.length);
    local.u16(26,file.nameBytes.length);
    local.u16(28,0);
    local.bytes.set(file.nameBytes,30);
    localParts.push(local.bytes,file.data);

    const central=zipHeader(46+file.nameBytes.length);
    central.u32(0,0x02014b50);
    central.u16(4,20);
    central.u16(6,20);
    central.u16(8,0x0800);
    central.u16(10,0);
    central.u16(12,now.time);
    central.u16(14,now.date);
    central.u32(16,file.crc);
    central.u32(20,file.data.length);
    central.u32(24,file.data.length);
    central.u16(28,file.nameBytes.length);
    central.u16(30,0);
    central.u16(32,0);
    central.u16(34,0);
    central.u16(36,0);
    central.u32(38,0);
    central.u32(42,offset);
    central.bytes.set(file.nameBytes,46);
    centralParts.push(central.bytes);
    offset+=local.bytes.length+file.data.length;
  }
  const centralStart=offset;
  const centralBytes=concatBytes(centralParts);
  const end=zipHeader(22);
  end.u32(0,0x06054b50);
  end.u16(4,0);
  end.u16(6,0);
  end.u16(8,prepared.length);
  end.u16(10,prepared.length);
  end.u32(12,centralBytes.length);
  end.u32(16,centralStart);
  end.u16(20,0);
  return concatBytes([...localParts,centralBytes,end.bytes]);
}

export function buildDocxBlob(entries){
  return new Blob([buildStoredZip(entries)],{type:DOCX_MIME});
}
