export function createOfficialRtfAssetHelpers({
  base64ToBytes,
  officialOneLine,
  officialRtfEscape,
  protocolSignatureImageBytes,
  safe
}){
  function bytesToHex(bytes){
    return Array.from(bytes || [],byte=>byte.toString(16).padStart(2,"0")).join("");
  }

  function szzLogoDataUrl(){
    const logo=document.querySelector("[data-szz-logo-copy]") || document.querySelector(".logo-img");
    return safe(logo?.getAttribute("src") || logo?.src || "");
  }

  function dataUrlImageBytes(dataUrl){
    const match=safe(dataUrl).match(/^data:image\/(?:png|jpe?g);base64,(.+)$/i);
    if(!match) return null;
    try{return base64ToBytes(match[1]);}catch(e){return null;}
  }

  function pngImageSize(bytes){
    if(!bytes || bytes.length<24) return null;
    const signature=[137,80,78,71,13,10,26,10];
    for(let i=0;i<signature.length;i++){
      if(bytes[i]!==signature[i]) return null;
    }
    const width=(((bytes[16]<<24)>>>0) + (bytes[17]<<16) + (bytes[18]<<8) + bytes[19])>>>0;
    const height=(((bytes[20]<<24)>>>0) + (bytes[21]<<16) + (bytes[22]<<8) + bytes[23])>>>0;
    if(!width || !height) return null;
    return {width,height};
  }

  function jpegImageSize(bytes){
    if(!bytes || bytes.length<4 || bytes[0]!==0xff || bytes[1]!==0xd8) return null;
    let offset=2;
    while(offset+9<bytes.length){
      if(bytes[offset]!==0xff){
        offset++;
        continue;
      }
      const marker=bytes[offset+1];
      const length=(bytes[offset+2]<<8) + bytes[offset+3];
      if(!length || offset+length>=bytes.length) break;
      if((marker>=0xc0 && marker<=0xc3) || (marker>=0xc5 && marker<=0xc7) || (marker>=0xc9 && marker<=0xcb) || (marker>=0xcd && marker<=0xcf)){
        const height=(bytes[offset+5]<<8) + bytes[offset+6];
        const width=(bytes[offset+7]<<8) + bytes[offset+8];
        if(width && height) return {width,height};
        return null;
      }
      offset+=2+length;
    }
    return null;
  }

  function officialRtfWatermarkGeometry(bytes){
    const size=pngImageSize(bytes) || jpegImageSize(bytes) || {width:998,height:495};
    const maxGoalWidth=9000;
    const maxGoalHeight=4465;
    const scale=Math.min(maxGoalWidth/size.width,maxGoalHeight/size.height);
    const picwgoal=Math.max(1,Math.round(size.width*scale));
    const pichgoal=Math.max(1,Math.round(size.height*scale));
    const shpleft=Math.round(900+(maxGoalWidth-picwgoal)/2);
    const shptop=Math.round(4300+(maxGoalHeight-pichgoal)/2);
    return {
      picw:size.width,
      pich:size.height,
      picwgoal,
      pichgoal,
      shpleft,
      shptop,
      shpright:shpleft+picwgoal,
      shpbottom:shptop+pichgoal
    };
  }

  function officialRtfWatermark(officialData={}){
    const bytes=officialData.watermarkLogoBytes || dataUrlImageBytes(szzLogoDataUrl());
    if(!bytes) return "";
    const hex=bytesToHex(bytes);
    const g=officialRtfWatermarkGeometry(bytes);
    const blip=(bytes[0]===0xff && bytes[1]===0xd8) ? "\\jpegblip" : "\\pngblip";
    return `{\\shp{\\*\\shpinst\\shpleft${g.shpleft}\\shptop${g.shptop}\\shpright${g.shpright}\\shpbottom${g.shpbottom}\\shpfhdr1\\shpbxcolumn\\shpbxignore\\shpbypara\\shpbyignore\\shpwr3\\shpwrk0\\shpfblwtxt1\\shpz2\\shplid20260728{\\sp{\\sn shapeType}{\\sv 75}}{\\sp{\\sn fLockAspectRatio}{\\sv 1}}{\\sp{\\sn fFlipH}{\\sv 0}}{\\sp{\\sn fFlipV}{\\sv 0}}{\\sp{\\sn pib}{\\sv {\\pict\\piccropl0\\piccropr0\\piccropt0\\piccropb0\\picw${g.picw}\\pich${g.pich}\\picwgoal${g.picwgoal}\\pichgoal${g.pichgoal}${blip} ${hex}}}}{\\sp{\\sn pibFlags}{\\sv 2}}{\\sp{\\sn pictureContrast}{\\sv 19661}}{\\sp{\\sn pictureBrightness}{\\sv 22938}}{\\sp{\\sn fLine}{\\sv 0}}{\\sp{\\sn wzName}{\\sv WordPictureWatermarkSZZ}}{\\sp{\\sn posh}{\\sv 2}}{\\sp{\\sn posrelh}{\\sv 0}}{\\sp{\\sn posv}{\\sv 2}}{\\sp{\\sn posrelv}{\\sv 0}}{\\sp{\\sn dhgt}{\\sv 251660288}}{\\sp{\\sn fLayoutInCell}{\\sv 0}}{\\sp{\\sn fBehindDocument}{\\sv 1}}}}{\\shprslt\\par\\pard\\ql \\li0\\ri0\\widctlpar\\phmrg\\posxc\\posyc\\dxfrtext180\\dfrmtxtx180\\dfrmtxty0\\wraparound\\aspalpha\\aspnum\\faauto\\adjustright\\rin0\\lin0\\itap0}\\par `;
  }

  function addOfficialRtfWatermark(output,officialData={}){
    if(output.includes("WordPictureWatermarkSZZ")) return output;
    const watermark=officialRtfWatermark(officialData);
    if(!watermark) return output;
    const shapeIndex=output.indexOf("{\\shp{\\*\\shpinst");
    if(shapeIndex<0) return output;
    return `${output.slice(0,shapeIndex)}${watermark}${output.slice(shapeIndex)}`;
  }

  function officialRtfSignatureImage(protocol={}){
    const bytes=protocolSignatureImageBytes(protocol);
    if(!bytes) return "";
    return `{\\pict\\pngblip\\picw900\\pich260\\picwgoal3800\\pichgoal1100 ${bytesToHex(bytes)}}`;
  }

  function officialRtfTipekSignatureImage(officialData={}){
    const bytes=officialData.tipekSignatureBytes;
    if(!bytes) return "";
    return `{\\pict\\pngblip\\picw865\\pich666\\picwgoal2850\\pichgoal2195 ${bytesToHex(bytes)}}`;
  }

  function officialRtfClientSignatureContent(protocol={}){
    const name=officialOneLine(protocol.clientSign || protocol.customer || "",80);
    const signature=officialRtfSignatureImage(protocol);
    const parts=[];
    if(name) parts.push(`{\\fs18 ${officialRtfEscape(name)}}`);
    if(signature) parts.push(signature);
    return parts.join(" ");
  }

  function officialRtfSignatureRow(protocol={},officialData={}){
    const left=officialRtfTipekSignatureImage(officialData);
    const right=officialRtfClientSignatureContent(protocol);
    if(!left && !right) return "";
    const leftCell=left || "{\\fs18 \\~}";
    const rightCell=right || "{\\fs18 \\~}";
    return `{\\pard \\ltrpar\\ql \\li0\\ri0\\sb0\\sa0\\sl0\\slmult0\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 {\\*\\szztipeksignature PodpisTipekSZZ}{\\rtlch\\fcs1 \\af0\\afs18 \\ltrch\\fcs0 \\fs18 ${leftCell}\\tab ${rightCell}}\\par }`;
  }

  function addOfficialRtfSignatures(output,protocol={},officialData={}){
    const block=officialRtfSignatureRow(protocol,officialData);
    if(!block || output.includes("PodpisTipekSZZ")) return output;
    const marker=/(\{\\\*\\bkmkstart _Hlk178752668\})______________________________________/;
    if(marker.test(output)){
      return output.replace(marker,`$1${block}______________________________________`);
    }
    return output.replace("______________________________________        ______________________________________",`${block}______________________________________        ______________________________________`);
  }

  return {
    addOfficialRtfSignatures,
    addOfficialRtfWatermark
  };
}
