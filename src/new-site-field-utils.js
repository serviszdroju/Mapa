const REQUIRED_NEW_SITE_FIELDS=[
  "Název","Adresa_GPS","Kraj","Popis_zdroje","Zdroj",
  "Perioda kontrol","Hlídáme kontroly sami","Důležitá poznámka",
  "Serviska","Smlouva ano/ne","Záruka","Rok výroby"
];

export function createNewSiteFieldHelpers({
  getRows=()=>[],
  requiredFields=REQUIRED_NEW_SITE_FIELDS
}={}){
  function newSiteFieldNorm(k){
    return String(k || "").trim().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/_/g," ")
      .replace(/\s+/g," ")
      .trim();
  }

  function shouldSkipNewSiteField(k){
    const n=newSiteFieldNorm(k);
    if(!n) return true;
    if(n.includes("gps") && n!=="adresa gps") return true;
    if(n==="firebase doc id" || n==="id mista" || n==="klic adresy") return true;
    if(n==="barva bodu" || n==="dni do kontroly" || n==="stav pro mapu" || n==="stav kontroly") return true;
    if(n==="faktura na") return true;
    if(n==="umisteni zdroje" || n==="historie oprav" || n==="postup testovani" || n==="jistic ups" || n==="jistice ups") return true;
    if(n==="poznamky" || n==="poznamka" || n==="cena fz" || n==="cena fz v kc") return true;
    if(n==="pristi kontrola" || n==="posledni kontrola" || n==="pristi planovana kontrola" || n==="posledni probehla kontrola") return true;
    if(n==="zdrojovy soubor" || n==="zdrojovy radek" || n==="pocet terminu" || n==="vsechny terminy") return true;
    if(/^mesic\s*\d*$/.test(n) || /^month\s*\d*$/.test(n) || /^\d{1,2}$/.test(n)) return true;
    return false;
  }

  function newSiteFieldLabel(k){
    const n=newSiteFieldNorm(k);
    if(n==="adresa gps") return "Adresa GPS";
    if(n==="zdroj") return "Výrobní číslo";
    return k;
  }

  function getAllKnownDataKeys(){
    const keys=[];
    const seen=new Set();

    (getRows() || []).forEach(r=>{
      const raw=r.raw || {};
      Object.keys(raw).forEach(k=>{
        if(shouldSkipNewSiteField(k)) return;
        const label=newSiteFieldLabel(k);
        const norm=newSiteFieldNorm(label);
        if(seen.has(norm)) return;
        seen.add(norm);
        keys.push(k);
      });
    });

    requiredFields.forEach(k=>{
      const label=newSiteFieldLabel(k);
      const norm=newSiteFieldNorm(label);
      if(!seen.has(norm) && !shouldSkipNewSiteField(k)){
        seen.add(norm);
        keys.push(k);
      }
    });

    return keys;
  }

  return {
    getAllKnownDataKeys,
    newSiteFieldLabel,
    newSiteFieldNorm,
    shouldSkipNewSiteField
  };
}
