# Plnohodnotna Android aplikace SZZ

Soucasna slozka `android/` je Trusted Web Activity, tedy web otevreny jako aplikace.
Pro servisni praci offline je potreba dalsi krok: nativni Android aplikace, ktera web jen
neobaluje, ale ma vlastni lokalni data a synchronizaci.

## Cil

- aplikace se spusti i bez internetu,
- body, protokoly a fotografie se ukladaji lokalne,
- po pripojeni k internetu se vse spolehlive synchronizuje do Firebase,
- mapa CR je ulozena primo v telefonu jako offline mapovy balik,
- web zustane zachovany jako online/admin rozhrani.

## Navrzena architektura

1. Lokalni databaze
   - Room / SQLite
   - tabulky: `sites`, `sources`, `protocols`, `photos`, `sync_queue`
   - kazda zmena se nejdriv ulozi lokalne a potom se prida do fronty synchronizace
   - zalozeno: `app/src/main/java/cz/astip/serviszdroju/offline/OfflineTables.java`
   - zalozeno: `SyncOperation.java` a `SyncState.java` pro budouci synchronizacni frontu

2. Offline mapa
   - MapLibre Android
   - mapovy podklad CR jako `mbtiles` nebo vlastni tile cache
   - body se kresli z lokalni databaze, ne primo z Firebase

3. Synchronizace
   - WorkManager
   - spousti se pri pripojeni k internetu a pravidelne na pozadi
   - zmeny se posilaji do Firebase az po uspesnem lokalnim ulozeni

4. Fotografie
   - original/fotka se ulozi lokalne do slozky aplikace
   - pro nahled se vytvori mala zmensena verze
   - po internetu se fotka nahraje do Cloudinary a odkaz se ulozi do Firebase

5. Protokoly
   - rozpracovany protokol se uklada lokalne prubezne
   - export do Wordu zustane lokalni akce
   - odeslani e-mailem se provede az online

## Postup prepisu

1. Nechat soucasnou TWA jako docasne funkcni reseni.
2. Pridat Room/SQLite vrstvu podle zalozeneho offline kontraktu.
3. Pridat nativni obrazovku prihlaseni a lokalni databazi.
4. Pridat MapLibre offline mapu CR.
5. Pridat offline protokoly a fotografie.
6. Pridat synchronizaci s Firebase a Cloudinary.
7. Teprve potom TWA odstranit nebo ji nechat jen jako zalohu.

## Proc to neudelat jen jako PWA

PWA umi fungovat offline, ale neni idealni pro velke mapove podklady cele CR,
velke mnozstvi fotek a garantovanou synchronizaci po dnech bez internetu. Nativni
Android aplikace ma lepsi kontrolu nad ulozistem, behem na pozadi a mapovymi daty.
