# Android aplikace SZZ mapa

Android build je webova aplikace 1:1 s produkcnim webem `https://serviszdroju.github.io/Mapa/`.
Neni to samostatne nativni UI ani TWA pres externi Chrome. `MainActivity` pouziva WebView, aby se
vzhled, ovladani, detail, galerie, protokoly a dokumenty chovaly stejne jako web.

## Co build dela

- otevre stejny webovy shell jako GitHub Pages,
- drzi uzivatele uvnitr aplikace, vcetne tlacitka Zpet,
- povoluje cookies, localStorage, IndexedDB a service worker pro offline cache,
- pouziva nativni Google Credential Manager s fallbackem na klasicky Google Sign-In a predava Firebase ID token webu pres `SzzAndroidAuth`,
- podporuje GPS, vyber fotek a foceni pres webovy upload,
- po nacteni webu pripravi jen app shell cache; servisni data se synchronizuji az po prihlaseni a z lokalni cache se zobrazuji co nejdrive.

APK obsahuje webove soubory, Leaflet, ikony, loga a sablony dokladu v `android/app/src/main/assets/Mapa`,
takze prvni obrazovka neni zavisla na GitHub Pages ani Leaflet CDN. Servisni body, protokoly,
galerie/fotky a prilohy se po prihlaseni ukladaji do lokalni cache a dalsi behy maji sahat jen na zmeny,
aby aplikace na tabletu nebrzdila.

## Build

Pro funkcni Google prihlaseni musi build dostat Firebase Google Web OAuth Client ID:

```bash
SZZ_FIREBASE_GOOGLE_WEB_CLIENT_ID=304123957651-8nnf5s40h56r63uiqddooioiu7fqh8pk.apps.googleusercontent.com ./gradlew assembleDebug
```

Debug APK bude v:

`android/app/build/outputs/apk/debug/app-debug.apk`

Soubor pro webove tlacitko se publikuje jako:

`public/downloads/szz-servis-zdroju-android.apk`

Pokud aplikace ukaze chybu Google prihlaseni s kodem `10`, neni problem ve webu: v Google Cloud/Firebase
chybi Android OAuth klient pro balicek `cz.astip.serviszdroju` a podpis aktualni APK.

Aktualni debug APK publikovana pod tlacitkem `Stáhnout aplikaci`:

- verze: `1.1.8-room-sites` (`versionCode 10`);
- SHA-1 podpisu: `86:A1:C4:BB:1D:FE:A6:65:36:67:C0:CA:A3:AF:52:6E:0C:7A:E4:A3`;
- build weboveho shellu: `apk-room-sites-v549`;
- SHA-256 souboru APK: `492aa19f241dc5b263b80427da2ce08614e264ae40675f7527258e6f7c75ccaf`;
- obsahuje zabalene HTML/CSS/JS, Leaflet, loga a sablony dokladu;
- obsahuje Room databazi `szz-offline.db` s tabulkami `sites`, `sources`, `protocols`,
  `protocol_drafts`, `photos`, `attachments`, `my_sites`, `sync_outbox`, `sync_cursor`
  a `conflicts`;
- uklada snapshot servisnich bodu do Room tabulky `sites` a pri Android startu ho umi
  vratit webu pres `SzzAndroidOffline.cachedSitesJson()`;
- umi tise obnovit Android Google prihlaseni pres `SzzAndroidAuth.restoreGoogleSignIn()`,
  kdyz Firebase session ve WebView dobehne nebo se dočasne ztrati;
- uklada rozpracovany protokol do Room pres `SzzAndroidOffline` a vynuti flush pri
  `onPause()`/`onStop()`;
- lokalni kamerove snimky uklada do interni slozky aplikace `szz-media/photos` misto cache.
