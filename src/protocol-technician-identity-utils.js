export function createProtocolTechnicianIdentityHelpers({
  currentUserEmail,
  getCurrentUser=()=>null,
  lastKnownUserEmail,
  safe,
  simpleNorm
}){
  function technicianKnownKeyFromValue(value=""){
    const text=safe(value);
    if(!text) return "";
    const lower=text.toLowerCase();
    const norm=simpleNorm(text);
    const compact=norm.replace(/\s+/g,"");
    if(
      lower.includes("tipek") ||
      norm.includes("michal tipek") ||
      compact.includes("michaltipek")
    ) return "tipek";
    if(
      lower.includes("jan.soldan") ||
      lower.includes("jansoldan") ||
      norm.includes("jan soldan") ||
      compact.includes("jansoldan")
    ) return "soldan";
    return "";
  }

  function technicianKnownDisplayName(key=""){
    if(key==="tipek") return "Ing. Michal Tipek";
    if(key==="soldan") return "Ing. Jan Soldan";
    return "";
  }

  function normalizeTechnicianDisplayName(value=""){
    const text=safe(value);
    if(!text) return "";
    const known=technicianKnownDisplayName(technicianKnownKeyFromValue(text));
    if(known) return known;
    if(/^ing\.?\s+/i.test(text)) return text.replace(/^ing\.?\s+/i,"Ing. ");
    if(text.includes("@")){
      const local=text.split("@")[0].replace(/[._-]+/g," ").trim();
      return local ? local.replace(/\b\w/g,char=>char.toUpperCase()) : text;
    }
    return text;
  }

  function protocolTechnicianEmail(protocol={},options={}){
    const candidates=[
      protocol.technicianEmail,
      protocol.techEmail,
      protocol.createdBy
    ];
    if(options.allowUpdatedBy) candidates.push(protocol.updatedBy);
    if(options.allowCurrentFallback){
      const currentUser=getCurrentUser() || {};
      candidates.push(currentUser.email,currentUserEmail(),lastKnownUserEmail());
    }
    for(const candidate of candidates){
      const email=safe(candidate).toLowerCase();
      if(email && email.includes("@")) return email;
    }
    return "";
  }

  function protocolTechnicianDisplayName(protocol={},options={}){
    const primary=[
      protocol.techSign,
      protocol.technician,
      protocol.technicianName,
      protocol.technicianDisplayName
    ].map(normalizeTechnicianDisplayName).find(Boolean);
    if(primary) return primary;
    const email=protocolTechnicianEmail(protocol,{allowCurrentFallback:false});
    const emailName=normalizeTechnicianDisplayName(email || protocol.technicianEmail || protocol.techEmail || "");
    if(emailName) return emailName;
    if(options.allowCurrentFallback){
      const currentUser=getCurrentUser() || {};
      return normalizeTechnicianDisplayName(
        currentUser.displayName ||
        currentUser.email ||
        currentUserEmail() ||
        lastKnownUserEmail() ||
        ""
      );
    }
    return "";
  }

  function normalizeProtocolTechnicianFields(protocol={},options={}){
    const email=protocolTechnicianEmail(protocol,{allowCurrentFallback:!!options.allowCurrentFallback});
    const display=protocolTechnicianDisplayName({...protocol,technicianEmail:protocol.technicianEmail || email},{
      allowCurrentFallback:!!options.allowCurrentFallback
    });
    return {
      ...protocol,
      technicianEmail:protocol.technicianEmail || email,
      techEmail:protocol.techEmail || email,
      technicianName:protocol.technicianName || display,
      techSign:display || protocol.techSign || protocol.technician || ""
    };
  }

  return {
    normalizeProtocolTechnicianFields,
    normalizeTechnicianDisplayName,
    protocolTechnicianDisplayName,
    protocolTechnicianEmail,
    technicianKnownKeyFromValue
  };
}
