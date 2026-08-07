# Servisní mapa záložních zdrojů

Produkční statická aplikace pro repozitář `serviszdroju/Mapa`. Původní web na `karolopejlo.github.io/Mapa/` se tímto repozitářem neupravuje.

## Stav

- Zachovaný původní vzhled servisní mapy, levý filtr, Leaflet mapa, stavové značky a detail bodu.
- Detail bodu má horní přepínač `Detail / Protokol / Galerie / Doklad`.
- Servisní body, protokoly, galerie a doklady se načítají a ukládají přes Firebase po přihlášení.
- Veřejný `data.csv` není součástí produkčního webu ani cache service workeru.
- Firestore pravidla v `firestore.rules` povolují přístup jen přihlášeným uživatelům s doménou `@astip.cz`.

## Lokální spuštění

Statickou verzi lze otevřít přes lokální server:

```bash
python3 -m http.server 4176
```

## Volitelný build pro Sites

```bash
pnpm install
pnpm run build
pnpm run test:sites
```

Build vznikne v `dist/client` a pomocné soubory pro Sites v `dist/server` a `dist/.openai`.

## GitHub Pages

Nasazená adresa:

```text
https://serviszdroju.github.io/Mapa/
```
