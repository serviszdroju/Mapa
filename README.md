# Servisní mapa záložních zdrojů

Nová samostatná webová aplikace pro repozitář `serviszdroju/Mapa`. Původní produkce na `karolopejlo.github.io/Mapa/` není tímto projektem upravena.

## Co je hotové

- Vizuální směr podle první vybrané varianty bez levé tmavé postranní lišty.
- Interaktivní mapa, filtry, vyhledávání bez diakritiky a barevná stavová logika.
- Detail místa se zdroji, termíny, technickými poli, historií a akcemi.
- Frontendové workflow pro přidání místa, protokol, fotografie, doklady a hlavní historii.
- PWA manifest a service worker s allowlist cache strategií.
- Extrakt technického zadání v `technicke-zadani-extrakt.txt`.

## Důležité poznámky

Tento stav je nový frontendový základ. Produkční Firebase Auth, Firestore pravidla, Functions pro e-mail, Cloudinary upload, migrace dat a Word/RTF generování musí být připojené až po potvrzení kanonických produkčních dat, rolí, šablon a cílového hostingu podle kapitol 13 až 18 zadání.

## Lokální spuštění

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

Build pro statický hosting vznikne v `dist/client`.

## GitHub Pages

Součástí projektu je workflow `.github/workflows/deploy-pages.yml`. Po pushnutí do `serviszdroju/Mapa` je potřeba v GitHub nastavení repozitáře povolit Pages přes GitHub Actions. Výsledná adresa bude typicky:

```text
https://serviszdroju.github.io/Mapa/
```
