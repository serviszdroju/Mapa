# Android aplikace SZZ mapa

Tahle slozka obsahuje soucasny Android projekt postaveny jako Trusted Web Activity.
Je to docasny mezikrok k plnohodnotne offline aplikaci: podrobny navrh nativni verze je v
`OFFLINE_NATIVE_APP_PLAN.md`.

## Co to dela

- spousti web `https://serviszdroju.github.io/Mapa/` jako Android aplikaci,
- pouziva Chrome/Custom Tabs engine, takze Google prihlaseni funguje lepe nez v obycejnem WebView,
- po overeni Digital Asset Links se otevira bez horni listy prohlizece jako plna aplikace,
- zachova offline logiku webu, fotky, Firebase a Cloudinary,
- pouziva PWA manifest s Android PNG ikonami `szz-icon-192.png` a `szz-icon-512.png`.

## Co je potreba nainstalovat

1. Android Studio
2. JDK 17
3. Android SDK s API 37
4. Gradle 9.5+ nebo Android Studio sync, ktery Gradle obstara

Na tomto Macu zatim neni dostupny Android SDK ani funkcni Java runtime, proto tady APK nejde rovnou sestavit.
Po sestaveni a instalaci APK se aplikace zobrazi v menu tabletu jako bezna Android aplikace
pod nazvem `SZZ mapa`. Webova PWA instalace pres Chrome to na nekterych tabletech negarantuje.

## Dulezite: Digital Asset Links

Trusted Web Activity se overuje pres soubor:

`https://domena/.well-known/assetlinks.json`

Pro aktualni adresu `https://serviszdroju.github.io/Mapa/` je domena `serviszdroju.github.io`, takze overovaci soubor musi byt dostupny presne tady:

`https://serviszdroju.github.io/.well-known/assetlinks.json`

Projektova GitHub Pages stranka `/Mapa/` sama o sobe obvykle umi publikovat jen:

`https://serviszdroju.github.io/Mapa/.well-known/assetlinks.json`

To pro TWA nestaci. Produkcni reseni je jedno z techto:

1. Pridat `assetlinks.json` do root webu `serviszdroju.github.io`.
2. Nastavit vlastni domenu pro tento projekt, napr. `mapa.astip.cz`, a upravit Android projekt na tuhle domenu.

Ukazka obsahu je pripravena v `../.well-known/assetlinks.example.json`. Pred nasazenim se v ni musi nahradit hodnota `DOPLNIT:SHA256:OTISK:PODPISOVEHO:CERTIFIKATU` skutecnym SHA-256 otiskem release klice.

## Vytvoreni podpisoveho klice

Soukromy klic se nema commitovat do repozitare.

Priklad:

```bash
mkdir -p android/keystore
keytool -genkeypair -v \
  -keystore android/keystore/szz-release.jks \
  -alias szz-release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

SHA-256 otisk pro `assetlinks.json`:

```bash
keytool -list -v \
  -keystore android/keystore/szz-release.jks \
  -alias szz-release
```

## Nastaveni podpisu pro release build

Do souboru `~/.gradle/gradle.properties` pridej:

```properties
SZZ_RELEASE_STORE_FILE=/absolutni/cesta/k/android/keystore/szz-release.jks
SZZ_RELEASE_STORE_PASSWORD=heslo
SZZ_RELEASE_KEY_ALIAS=szz-release
SZZ_RELEASE_KEY_PASSWORD=heslo
```

## Build

V Android Studiu otevri slozku `android/`, nech projekt zesynchronizovat a spust:

```bash
./gradlew assembleDebug
./gradlew bundleRelease
```

Debug APK bude v:

`android/app/build/outputs/apk/debug/`

Release AAB pro Google Play bude v:

`android/app/build/outputs/bundle/release/`

## Zmena domeny

Kdyz se web presune na vlastni domenu, uprav:

- `android/app/build.gradle`:
  - `webHost`
  - `webPathPrefix`
  - `LAUNCH_URL`
  - `WEB_ORIGIN`
- `android/app/src/main/res/values/strings.xml`:
  - `asset_statements`
