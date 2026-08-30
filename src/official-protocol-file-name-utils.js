export function createOfficialProtocolFileNameHelpers({
  getSelectedSite,
  officialOneLine,
  parseDateValue,
  pickRawValue,
  protocolWordFileNamePart,
  safe,
  siteHasMultipleSources,
  siteSourceLabel,
  sourceTypeTextFromRaw
}){
  function protocolWordFileNameJoin(parts,fallback="protokol"){
    const name=parts
      .map(part=>safe(part))
      .filter(Boolean)
      .map(part=>protocolWordFileNamePart(part))
      .filter(Boolean)
      .join("-")
      .replace(/-+/g,"-")
      .replace(/^-+|-+$/g,"");
    return name.slice(0,140) || fallback;
  }

  function officialProtocolFileDatePart(protocol={}){
    const raw=safe(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
    const d=parseDateValue(raw);
    if(d){
      const pad=n=>String(n).padStart(2,"0");
      return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
    }
    const today=new Date();
    const pad=n=>String(n).padStart(2,"0");
    return `${pad(today.getDate())}-${pad(today.getMonth()+1)}-${today.getFullYear()}`;
  }

  function officialSourceFileLabel(protocol={},site=getSelectedSite()){
    if(!siteHasMultipleSources(site)) return "";
    const text=safe(
      protocol.deviceType ||
      protocol.selectedDevice ||
      protocol.siteSource ||
      siteSourceLabel(site) ||
      sourceTypeTextFromRaw(site?.raw || {})
    );
    if(!text) return "";
    const power=text.match(/\b\d+(?:[,.]\d+)?\s*(?:kva|va|kw|w)\b/i);
    if(power) return power[0].replace(/\s+/g,"").replace(",",".");
    const larger=text.match(/\b\d{3,}\b/);
    if(larger) return larger[0];
    const any=text.match(/\b\d+(?:[,.]\d+)?\b/);
    return any ? any[0].replace(",",".") : "";
  }

  function officialProtocolAddressFileName(protocol={},site=getSelectedSite(),mode="ok"){
    const raw=site?.raw || {};
    const address=officialOneLine(
      protocol.siteAddress ||
        protocol.siteName ||
        protocol.place ||
        site?.adresa ||
        pickRawValue(raw,["Adresa / umístění","Adresa_GPS","Umístění"]) ||
        "",
      140
    );
    if(!address) return "";
    const parts=address.split(",").map(part=>part.trim()).filter(Boolean);
    let city="";
    let street="";
    if(parts.length>=2){
      const first=parts[0];
      const second=parts.slice(1).join(", ");
      const firstHasNumber=/\d/.test(first);
      const secondHasNumber=/\d/.test(second);
      if(firstHasNumber && !secondHasNumber){
        street=first;
        city=second;
      }else if(!firstHasNumber && secondHasNumber){
        city=first;
        street=second;
      }else{
        street=first;
        city=second;
      }
    }else{
      street=address;
    }
    return protocolWordFileNameJoin([
      street,
      city,
      officialProtocolFileDatePart(protocol),
      officialSourceFileLabel(protocol,site),
      mode==="stop" ? "STOP STAV" : ""
    ],"doklad");
  }

  return {
    officialProtocolAddressFileName,
    officialProtocolFileDatePart
  };
}
