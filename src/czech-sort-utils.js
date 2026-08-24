const SZZ_CS_BASE_COLLATOR=new Intl.Collator("cs",{sensitivity:"base"});

export function szzCompareCsBase(a,b){
  return SZZ_CS_BASE_COLLATOR.compare(String(a ?? ""),String(b ?? ""));
}
