const hiddenDataLabels = new Set([
  "příští_kontrola","pristi_kontrola","příští kontrola","pristi kontrola","příští plánovaná kontrola",
  "cena fz v kč","cena fz v kc","cena_fz","cena fz",
  "protokol s fakturou na","protokol_s_fakturou_na","protokol s fakturou",
  "jaký zdroj","jaky zdroj",
  "kontakt_mapy","kontakt mapy",
  "poznámky_mapy","poznamky_mapy","poznámky mapy","poznamky mapy",
  "všechny_termíny","vsechny_terminy","všechny termíny","vsechny terminy",
  "zdrojový_řádek","zdrojovy_radek","zdrojový řádek","zdrojovy radek",
  "důležitá poznámka","dulezita poznamka","důležitá_poznámka","dulezita_poznamka",
  "počet_termínů","pocet_terminu","počet termínů","pocet terminu",

  "stav_kontroly","stav kontroly","stav pro mapu",
  "zdrojový_soubor","zdrojovy_soubor","zdrojový soubor","zdrojovy soubor",
  "poslední_kontrola","posledni_kontrola","poslední kontrola","posledni kontrola","poslední proběhlá kontrola",
  "dní_do_kontroly","dní do kontroly","dni_do_kontroly","dni do kontroly",
  "barva_bodu","barva bodu",
  "gps_lat","gps_lon","gps_status","gps_nalezeno_jako","gps_poznámka","gps_poznamka","gps_raw",
  "klíč_adresy","klic_adresy","klíč adresy","klic adresy",
  "další kontrola podle periody","dalsi kontrola podle periody",
  "zdrojový kód","zdrojovy kod","zdrojovy_kod","zdrojový_kód",
  "firebase_doc_id","id místa","id mista"
]);

export function shouldHideDataRow(k){
  const key=String(k || "").trim().toLowerCase();
  if(hiddenDataLabels.has(key)) return true;
  if(key.includes("gps")) return true;
  if(/^měsíc[_\s-]*\d*$/i.test(key) || /^mesic[_\s-]*\d*$/i.test(key)) return true;
  if(/^month[_\s-]*\d*$/i.test(key)) return true;
  if(/^\d{1,2}$/.test(key)) return true;
  return false;
}
