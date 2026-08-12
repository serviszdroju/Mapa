# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Current durable design decision: the user wants the redesigned GitHub Pages site to keep the original web appearance from `karolopejlo/Mapa`. Do not continue with the React/dashboard redesign. Preserve the original map layout, left controls, colors, all point data, completed protocols, photos, and document generation. The only desired design change is in the point detail: add a small top menu for switching between Detail, Protokol, Galerie, and Doklad while keeping the original functions and DOM ids intact.

Current audit decision: production must be Firebase-first and must not reintroduce public operational datasets such as `data.csv` or hardcoded plaintext address inventories. If a private export is needed locally, keep it ignored under `private-data/`. The public site can show the app shell without login, but service points, protocols, photos, and doklady must come from Firebase/Cloudinary after authentication.

Current optimization decision: implement the Word performance brief incrementally while preserving the original visual style, Firebase-backed data, detail functions, protocols, photos, document exports, and offline drafts. Prefer debounced UI work, cached map/data rendering, and no idle polling over visible redesigns or destructive data changes.

Current visual refinement decision: when exploring improved visuals, keep the page built like the user's current web app: left controls, central map, and right point detail. Preserve the original color palette and existing status colors unless the user explicitly asks for a specific control-color change. Improve detail quality, hierarchy, spacing, tabs, cards, status indicators, typography, and polish rather than introducing a new dashboard or different product architecture.

Current approved visual direction: implement the 2026-08-08 06:44 generated mock direction with original SZZ colors, a dark "Přidat nové místo" action, icon-led technician/history rows, map-first center, and a polished right detail drawer with tabs, source cards, date cards, and very low-height rows/buttons/fields so much more information fits. Do not show a standalone "Mapa" field in the left column. Keep this as visual-only refinement; do not change Firebase data flows, protocols, photos, documents, or point detail functions.

Current detail styling decision: regular information rows in the Detail tab should look like the compact summary rows used in Protokol, while the two date cards "Poslední proběhlá kontrola" and "Příští plánovaná kontrola" keep their existing highlighted appearance. Blue primary action buttons should be replaced with the same neutral gray button treatment used by "Přiblížit na body"; status colors and data colors stay unchanged.

Current gallery styling decision: only the Galerie tab should use the 2026-08-08 07:25 visual direction: compact picker/upload controls, a large full-width photo viewer with overlay arrows and counter, a horizontal thumbnail strip, a compact photo metadata row, and small point-information cards underneath. Preserve all existing gallery behavior, photo data sources, uploads, downloads, deletes, offline storage, and the rest of the app.

Current performance optimization decision: implement `optimalizace_webu_servis_zdroju.md` incrementally while preserving the current appearance, Firebase data, gallery, protocols, documents, Cloudinary, offline mode, and GitHub Pages. Prefer safe high-impact steps first: precomputed search indexes, render batching, shared grouped data, viewport-limited marker rendering, lazy marker popups, DocumentFragment/replaceChildren for sidebar, and IndexedDB-backed data cache. Do not remove compat Firebase or split the monolithic file until those migrations can be verified in smaller controlled steps.

Current performance phase 2 decision: continue with low-risk runtime optimizations only: lazy-load gallery and protocol history when their detail tabs are opened, reduce Cloudinary thumbnail size, add lazy/async image hints, and use stale-while-revalidate for HTML shell loading. Keep detail fields, tabs, uploads, protocols, doklady, and offline behavior unchanged.

Current performance phase 3 decision: keep lazy detail media/history intact across login and offline/online sync. Background refreshes should call `refreshLoadedDetailTabs` so only the currently open or previously loaded detail tab refreshes; explicit user actions inside Galerie or Protokol may still reload that tab immediately.

Current performance phase 4 decision: large Firebase map row cache should be IndexedDB-first. Store only small metadata/count in `localStorage` during normal saves, and write the full row payload to `localStorage` only as a fallback when IndexedDB fails. Keep old localStorage cache reading for backward compatibility.

Current performance phase 5 decision: coalesce/debounce IndexedDB map row cache saves so repeated Firebase/offline updates in a short burst write only the latest row snapshot while keeping localStorage metadata/fallback compatibility.

Current performance phase 6 decision: cache filtered row results and place groups by row-index version plus active filter values so repeated renders without changed data skip expensive filtering/grouping while preserving the same DOM and map behavior.

Current performance phase 7 decision: skip unchanged marker and left-sidebar rerenders when the grouped rows, row-index version, active filters, and map bounds have not changed. Keep the existing marker/sidebar DOM structure and event handlers.

Current performance phase 8 decision: avoid rebuilding the row lookup map and GPS count during repeated renders when the row collection and row render fingerprints are unchanged. Keep the same lookup keys and row indexing behavior.

Current performance phase 9 decision: cache offline status counts briefly so repeated focus/storage/sync UI refreshes do not rescan IndexedDB and localStorage multiple times in the same short burst. Force-refresh counts after explicit sync.

Current performance phase 10 decision: cache loaded detail history briefly per site/user and invalidate it whenever protocol/service child, embedded, or local records change, so reopening Protokol does not repeat the full Firestore fallback query burst.

Current performance phase 11 decision: after saving a Firebase site/source, prefer a single-row local upsert plus IndexedDB map cache update, and keep the full Firebase reload only as a fallback when the local upsert cannot be verified.

Current performance phase 12 decision: the main Firebase add-site panel must pass its freshly saved row into the same post-save single-row refresh path, so every add-site/source entry point avoids a full collection reload when local verification succeeds.

Current performance phase 13 decision: offline site/source synchronization should reuse the same single-row upsert path without focusing the map or opening detail, and only fall back to a full Firebase reload if no saved rows are available.

Current performance phase 14 decision: duplicate checks before saving a Firebase site/source should first use loaded rows and targeted Firestore `dedupKeys` queries, falling back to the previous full collection scan only when the fast path is unavailable or not certain.

Current performance phase 15 decision: cache `sitesUnified/{site}/photos`, `protocols`, and `serviceRecords` reads briefly per site/user, and invalidate that cache after child saves/deletes so Galerie and Protokol do not repeat identical short-interval Firestore reads.

Current performance phase 16 decision: cache the main cross-site protocol history briefly per user and invalidate it on protocol saves/deletes so repeated openings of “Historie protokolů” do not rescan localStorage and Firestore.

Current performance phase 17 decision: coalesce Firebase background refreshes after cache-first startup, skip them while the page is hidden/offline or data was freshly loaded, and preserve manual reloads plus post-save refresh behavior.

Current performance phase 18 decision: keep critical service-worker precache focused on same-origin app shell files and warm external CDN libraries in the background, so service-worker install/update is not blocked by Leaflet/Firebase CDN fetches while manual offline preparation can still cache those libraries explicitly.

Current performance phase 19 decision: cache the representative row for each freshly built place group so marker coloring and sidebar ordering do not repeatedly sort the same source rows during one render cycle.

Current performance phase 20 decision: cache computed next-check date, days-to-check, marker color, status text, pill class, and status priority per row fingerprint so map/sidebar/detail renders reuse the same schedule state until the row date/status inputs change.

Current performance phase 21 decision: cache rows grouped by `sitePlaceGroupKey` for the active row collection/version so detail source pickers, multi-source checks, popup/document helpers, and add-source flows do not repeatedly filter and sort the full point list for the same place.

Current performance phase 22 decision: cache computed source label and normalized source identity per row/raw/source fingerprint so sidebar chips, source choosers, marker popups, detail subtitles, protocol matching, and document metadata reuse the same source text until the row source fields change.

Current performance phase 23 decision: cache computed place label and place-group key per row/raw/address/GPS/fallback fingerprint so grouping, marker rendering, sidebar ordering, detail source switching, and add-source flows reuse the same address grouping until the row place fields change.

Current performance phase 24 decision: avoid rebuilding the detail source chooser DOM when the row-index version, active source, place group, and sibling source/status signature are unchanged; preserve the same buttons, handlers, labels, and add-source behavior.

Current performance phase 25 decision: cache the read-only detail table HTML per row based on the displayed field values so repeated openings and refreshes of the same unchanged point reuse identical markup while edit mode, raw data, and field ordering stay unchanged.

Current performance phase 26 decision: avoid redundant textContent writes for displayed control dates in the detail panel by updating DOM text only when the rendered value changes; keep the same date formatting, fields, and edit behavior.

Current performance phase 27 decision: publish GitHub Pages from the production Vite output in `dist/client` instead of the raw development `index.html`; keep document RTF templates in the public build output so Doklad exports continue to fetch them from the site root.

Current performance phase 28 decision: use the existing `siteRowsByAnyId` lookup for frequent row retrieval paths such as opening details, adding sources, post-load focus, post-save upsert focus, GPS saves, and manual status toggles instead of repeated full `rows.find()`/`rows.findIndex()` scans; keep intentional dedupe scans unchanged.

Current performance phase 29 decision: replace repeated startup binding fallback timers for add-site/detail/Firebase controls with a shared idempotent DOM/load lifecycle initializer; preserve the final Firebase add-site panel as the active handler while removing idle timeout retries.

Current performance phase 30 decision: add a short-lived per-site cache for `getLastProtocol()` using the same detail history cache key/invalidation path, so repeated detail/protocol rendering does not re-run the same Firestore protocol lookups while preserving fresh data after protocol mutations.

Current performance phase 31 decision: batch Firestore `siteKeys` lookups for detail history and latest-protocol reads with `array-contains-any` chunks, falling back to the original per-key `array-contains` queries if batching fails so older data remains reachable.

Current performance phase 32 decision: run the remaining keyed/text Firestore fallback queries for detail history and latest-protocol reads through a bounded concurrent scheduler, and fetch `serviceRecords` plus `protocols` in parallel; keep all old matching fallbacks so legacy text-only protocol data remains visible.

Current performance phase 33 decision: keep Firebase SDK loading in the app unchanged, but remove compat/modular Firebase SDK URLs from manual app-shell and service-worker external precache lists; cache only the local shell assets and Leaflet up front, while Firebase scripts remain runtime/network loaded and can still be runtime-cached after use.

Current performance phase 34 decision: merge IndexedDB offline protocol queue items into both the per-site detail history and the main protocol history alongside legacy localStorage items, deduped by `_id`, so protocol history remains visible even when localStorage is incomplete while moving large offline state toward IndexedDB.

Current performance phase 35 decision: have `getLastProtocol()` reuse the merged local protocol history helper, so latest-protocol/date prefill logic can see IndexedDB-backed offline protocol records in addition to legacy localStorage records.

Current performance phase 36 decision: render the per-site protocol history detail with DOM elements and `replaceChildren()` instead of rebuilding a large HTML string; keep the same classes, text, photos, action button IDs, and handlers.

Current performance phase 37 decision: render the main cross-site protocol history row list with a `DocumentFragment` plus `replaceChildren()` instead of joining HTML strings; keep the existing panel markup, row classes, data attributes, admin metadata, and open-detail behavior.

Current performance phase 38 decision: cache `localStorageArrayEntries(prefix)` scans briefly and invalidate that cache when the app writes/removes matching per-site local arrays, reducing repeated full localStorage scans for offline status, protocol history, and offline photo fallbacks while preserving legacy storage compatibility.

Current performance phase 39 decision: skip unchanged Galerie tab rerenders with a per-site/photo/user render signature, and cache repeated Cloudinary transform URLs in memory so thumbnail/full-image URL generation does not repeat during refreshes or thumbnail navigation. Preserve the existing gallery markup, upload/delete/offline behavior, and visual layout.

Current performance phase 40 decision: reuse the cached `localStorageArrayEntries(prefix)` scan for offline protocol and offline photo count fallbacks, so focus/storage/sync status refreshes do not run separate full localStorage loops while preserving IndexedDB queue merging and legacy localStorage compatibility.

Current performance phase 41 decision: collect independent offline status inputs in parallel (`sites`, `protocols`, `photos`, storage persistence, and storage estimate) while keeping draft counting synchronous, so app sync status refreshes complete faster without changing displayed values or offline queue behavior.

Current performance phase 42 decision: cache the protocol draft count briefly and invalidate it on draft save, draft clear, and cross-tab storage changes, reducing repeated localStorage scans during sync status refreshes while preserving local draft autosave/restore behavior.

Current performance phase 43 decision: load the root Firebase site document in parallel with per-site child collections for Galerie, Protokol history, and latest-protocol reads, reducing wait time while preserving embedded arrays, child subcollections, legacy standalone protocol/service fallbacks, and all existing matching behavior.

Current performance phase 44 decision: load direct `protocolRefs` and `serviceRefs` through the bounded Firestore task scheduler instead of sequential `getDoc()` loops in detail history and latest-protocol reads, preserving the same fallback records, dedupe behavior, and final time-based sorting.

Current performance phase 45 decision: lazy-read local per-site protocol history inside `loadHistory()` only when offline/no-login fallback is needed or the detail-history cache is missing, so reopening cached Protokol views avoids unnecessary IndexedDB/localStorage work while preserving local fallback behavior.

Current performance phase 46 decision: cache app-shell files for offline preparation with a small bounded parallel worker pool instead of sequential fetch/cache steps, both in the main helper and install fallback helper, preserving the same shell URL lists and saved-count behavior.

Current performance phase 47 decision: keep service-worker precache behavior and URL lists unchanged, but run shell fetch/cache work through the same small bounded worker pool to avoid unbounded install-time network bursts on slower devices.

Current performance phase 48 decision: cache normalized row-key lookups in a WeakMap for the shared `get(row,key)` helper so repeated fallback column-name reads no longer rescan and renormalize every object key during render/search/detail work.

Current performance phase 49 decision: cache `simpleNorm()` row-key candidates in a WeakMap for watch/self-maintained status field lookups, preserving first non-empty matching key behavior while avoiding repeated full key normalization.

Current performance phase 50 decision: keep filter, place-group, and sidebar cache invalidation inputs unchanged, but build their render cache signatures with simple stable strings instead of `JSON.stringify()` arrays during render scheduling.

Current performance phase 51 decision: cache `dataNormFixed()` raw-key entries for detail field fallback lookup while preserving original object-key order, and build read-only detail table signatures with length-prefixed strings instead of `JSON.stringify()`.

Current performance phase 52 decision: build the merged raw/edit field object once per detail/edit table render and pass it through `userSiteFieldValue()`, avoiding repeated object spreads and enabling the detail field-key cache to be reused within a render.

Current performance phase 53 decision: batch Firestore equality fallback reads for `siteId`, `siteKey`, and `firebaseDocId` using `in` chunks before falling back to the old per-id `==` queries, reducing request bursts for detail history and latest-protocol reads while preserving legacy fallback coverage.

Current performance phase 54 decision: compute gallery point-info rows once per photo render and reuse them for both the render signature and visible detail cards, preserving the existing gallery markup and behavior.

Current performance phase 55 decision: after deleting/skipping a Firebase-first site, remove the row locally and update the map cache instead of reloading the full Firebase map; keep the full reload path as a fallback when the local row cannot be matched.

Current performance phase 56 decision: maintain a lookup index for Firebase source rows and use it for single-row upserts after saving, falling back to the original scan only when the index has no match.

Current performance phase 57 decision: cache normalized Firebase deduplication keys by raw field signature so repeated local upserts and reload passes avoid recomputing the same name/address/source normalization.

Current performance phase 58 decision: cache render counter DOM writes and only reset the GPS notice box when its visible/content state actually needs cleanup.

Current performance phase 59 decision: normalize gallery display URLs through a 1600px Cloudinary transform when older photo records only provide an original/full URL, while preserving the full URL for opening and downloading.

Current performance phase 60 decision: route hashed local assets, icons, logos, manifest, signatures, and Leaflet CSS/JS through a service-worker cache-first strategy while preserving stale-while-revalidate for HTML/map tiles and network-only Firebase/Auth requests.

Current performance phase 61 decision: build sidebar result items with DOM nodes and textContent instead of per-item innerHTML, keeping the same classes and visual structure while reducing HTML parsing work.

Current performance phase 62 decision: add a fast no-filter path in filtered() that returns the current rows array directly, and compute compact search query text once per filter pass instead of once per row.

Current performance phase 63 decision: include currently loaded script, stylesheet, manifest, and icon URLs in the manual offline app-shell cache so Vite hashed assets and future split files are cached for offline use.

Current performance phase 64 decision: extract the inline CSS style blocks into app.css so Vite can emit CSS as a separate hashed asset, reducing the HTML app-shell size while preserving selector order and visual appearance.

Current performance phase 65 decision: cache offline gallery media with the same Request object used for fetching, preserving Cloudinary/origin request mode and credentials while avoiding mismatched cache keys during offline preparation.

Current performance phase 66 decision: build the detail source chooser render signature with length-prefixed stable strings instead of `JSON.stringify()`, preserving the same source buttons and add-source behavior while reducing repeated serialization during detail refreshes.

Current performance phase 67 decision: return the cached place-group row array directly for normal `rows` lookups instead of cloning it on every detail/source read, preserving caller behavior because mutating paths already create their own filtered arrays.

Current performance phase 68 decision: precompute each place group's marker row signature during grouping and reuse it during map marker reconciliation, preserving marker content and lazy popups while reducing repeated source/status signature work on map moves.

Current performance phase 69 decision: cache each row's `siteRecordKeys()` result by relevant record-key fingerprint so detail history, latest protocol reads, offline prefetch, and record matching reuse the same identifier set without changing matching coverage.

Current performance phase 70 decision: cache normalized record/source text keys used by legacy detail-history matching so fallback protocol/service/photo lookups avoid repeated normalization while keeping the same text matching coverage.

Current performance phase 71 decision: cache `siteHasMultipleSources()` per row/place group for the current row-index version, with a direct non-cached fallback while rows are dirty, so legacy record matching avoids repeated sibling group lookups without changing multi-source filtering.

Current performance phase 72 decision: cache per-record identifier keys and per-site record-key Sets for legacy record matching so protocol/service/photo fallback checks use constant-time key membership while preserving the same `siteId`, `siteKey`, `siteDocId`, `firebaseDocId`, and `siteKeys` coverage.

Current performance phase 73 decision: deduplicate merged protocol/service history with a per-load `_id` Set instead of repeated `items.some(...)` scans, preserving the same item order, fallback sources, and visible history while reducing work on large detail and main protocol history loads.

Current performance phase 74 decision: make repeated "Připravit offline data" runs incremental after the first full sync: reuse cached Firebase rows, fetch only rows and per-site child items updated since the last prepared timestamp, skip unchanged embedded detail data, and keep full-sync fallback for first run or forced preparation. Child saves should also touch the parent site `updatedAt` so later incremental row checks notice changed protocols, service records, or photos. Preserve install-time offline preparation before the PWA prompt, cached rows, protocols, service records, photos, map tiles, and visible install/offline copy.

Current performance phase 75 decision: deduplicate merged gallery photo sources with a per-load `_id` Set in `loadSitePhotos()` instead of repeated array scans, preserving local, IndexedDB/offline, embedded, and Firebase child photo ordering, metadata, delete rights, and gallery rendering.

Current logo/icon decision: Android/PWA launcher icons must be generated directly from `Tipo_SZZ_logo3.png`. Use opaque white-background `szz-app-icon-192/512.png` for regular icons and separate padded `szz-app-icon-maskable-192/512.png` for maskable Android icons so the battery/SZZ mark is not cropped or shown on a dark transparent background.

Current performance phase 76 decision: cache the sorted, capped sidebar place-group list for the current grouped-row signature so repeated sidebar refreshes reuse the same top 160 groups without re-sorting the full group array, while preserving ordering, DOM structure, and visible list limit.

Current performance phase 77 decision: cache per-site record-key Sets and normalized text match arrays by the already-cached key-array reference instead of rebuilding stable signatures on every legacy `recordMatchesSite()` call, preserving the same identifier and text matching coverage.

Current performance phase 78 decision: avoid building stable-signature strings before reading `siteRecordKeys()` and `siteRecordTextKeys()` caches; compare the tracked row/raw field values directly and keep the same cache invalidation coverage for detail/history matching.

Current performance phase 79 decision: cache normalized legacy record text keys by direct record fields (`siteName`, `siteAddress`, `place`, `pbzLocation`) instead of rebuilding stable-signature strings on every `recordMatchTextKeys()` call, preserving the same text fallback matching for protocols, service records, and photos.

Current performance phase 80 decision: cache normalized record source identity by direct record fields (`siteSource`, `sourceIdentity`, device/source labels, and serial fields) instead of rebuilding stable-signature strings on every `recordSourceIdentity()` call, preserving the same source matching for multi-source protocols, service records, and photos.

Current performance phase 81 decision: cache record identifier keys by direct scalar id fields plus a shallow copy of `siteKeys`, avoiding stable-signature rebuilds in `recordIdKeys()` and reusing that cache for offline-record site matching while preserving the same id matching coverage.

Current performance phase 82 decision: cache each row's marker signature from `detailKey`, source label, and status text so group and marker reconciliation can reuse the same row-level signature during map moves/rerenders while preserving marker color, popup, grouping, and status behavior.

Current performance phase 83 decision: cache stable raw-data fingerprints and per-row offline fingerprints with WeakMaps so repeated offline preparation/delta checks avoid rebuilding large raw signature strings when row data is unchanged, while preserving incremental offline sync change detection.

Current performance phase 84 decision: build the detail source-chooser render signature from cached marker row signatures and length-prefixed fields instead of recomputing detail/source/status values for every sibling during repeated detail refreshes, preserving the same source chooser DOM and switching behavior.

Current performance phase 85 decision: cache site deduplication keys by direct raw field parts and reuse those parts while computing keys, avoiding repeated source/type serial lookups and raw signature string creation during local upserts, duplicate checks, and row dedupe passes.

Current performance phase 86 decision: cache each raw object's non-empty value count for `siteRowPriority()` so repeated dedupe/upsert passes avoid rescanning all raw fields while preserving the same priority scoring.

Current performance phase 87 decision: select visible map place groups in one bounded pass instead of filtering/slicing the full group list, preserving the same GPS validity, map-bounds, ordering, and marker render limit behavior with less allocation during map moves.

Current performance phase 88 decision: select the sidebar's first 160 place groups with a bounded top-list pass for large result sets instead of sorting the entire group array before slicing, preserving the same next-check ordering and stable tie behavior while reducing sidebar render work.

Current performance phase 89 decision: reduce map interaction allocations by building the map-bounds render key directly and collecting "Přiblížit na body" coordinates in one loop instead of chained array filter/map calls, preserving the same bounds and fit behavior.

Current performance phase 90 decision: cache each row's lookup key array by direct id/raw fields so row indexing, detail opening, and lookup-key matching reuse the same keys without rebuilding arrays when the row identifiers are unchanged.

Current performance phase 91 decision: have row render fingerprints reuse already-populated place/source cache fields when available, falling back to the existing helpers only when needed so row indexing avoids redundant place/source recomputation.

Current performance phase 92 decision: make the `findRowByAnyId()` fallback scan reuse the already-normalized lookup key in a simple loop instead of calling `rowMatchesAnyLookupKey()` for every row, preserving the same lookup coverage while avoiding repeated trim/helper work.

Current performance phase 93 decision: invalidate the short-lived localStorage object-entry cache after `writeSiteLocalObject()` writes a site-local object, preserving fresh local object reads while keeping object-entry scans cached between writes.

Current performance phase 94 decision: cache direct `readSiteLocalObject()` parses briefly by exact localStorage key and raw value, invalidating through the existing object-cache clear path so repeated Doklad/detail reads avoid reparsing unchanged local objects while preserving fresh writes.

Current performance phase 95 decision: cache direct `readSiteLocalArray()` parses briefly by exact localStorage key and raw value, invalidating through the existing array-cache clear path so repeated protocol/photo/offline local reads avoid reparsing unchanged arrays while preserving writes and removals.

Current performance phase 96 decision: cache local array meta summaries on the same per-key raw-value cache used by `readSiteLocalArray()`, so repeated offline detail checks reuse `count/latest/signature` for unchanged protocol, service, and photo arrays while preserving incremental sync decisions.

Current performance phase 97 decision: cache `readSzzOfflineDetailMeta()` briefly by the exact stored raw metadata string and refresh that cache on writes/storage events, so repeated offline preparation and delta checks avoid reparsing the same metadata object while preserving cross-tab freshness.

Current performance phase 98 decision: cache small local state object reads for offline-readiness and sync-status by exact stored raw value, refreshing on writes and storage events so startup/offline status rendering avoids repeated JSON parsing while preserving visible status values.

Current performance phase 99 decision: cache the fallback `readCachedFirebaseSiteCount()` result by exact stored Firebase map-cache JSON so offline/status UI avoids repeatedly parsing large legacy localStorage cache payloads while preserving IndexedDB-first data loading and raw-value freshness.

Current performance phase 100 decision: cache the legacy `astipMap:offlineSites:v1` fallback pending-site count by exact raw localStorage value, preserving IndexedDB-first offline queues while reducing repeated JSON parsing during status refreshes when legacy local queue data is present.

Current performance phase 101 decision: cache the legacy offline site queue parser inside `late.js` by exact raw localStorage value and refresh it on writes/compaction/storage events, preserving offline site save/sync behavior while reducing repeated parsing of `astipMap:offlineSites:v1`.

Current performance phase 102 decision: start the monolith split by moving the detail-tab controller and hosted-login fallback binding out of inline `index.html` into separate Vite modules (`src/detail-tabs.js` and `src/hosted-login.js`), preserving the same global functions, DOM ids, and Firebase login handoff.

Current performance phase 103 decision: continue the monolith split by moving app-shell boot helpers for the PWA install prompt, SZZ logo/icon refresh, startup login fallback binding, and mobile map resize invalidation from inline `index.html` into `src/shell-boot.js`, while keeping the tiny early `auth-resume` class bootstrap inline to avoid a startup flash.

Current performance phase 104 decision: load the legacy compatibility/helper `late.js` script with `async` so it no longer delays the HTML shell finishing, relying on the existing Firebase loader retry path and immediate late-script control binding to preserve install, offline, add-site, and map-data behavior.

Current performance phase 105 decision: minify the standalone classic `late.js` only in the production build output via `scripts/prepare-sites-build.mjs`, keeping the source readable while reducing the GitHub Pages transfer size for install/offline/Firebase helper code.

Current performance phase 106 decision: minify the production build copy of `sw.js` through the same standalone-script build step, keeping the service-worker source readable while reducing update/install transfer size.

Current performance phase 107 decision: lazy-load the Android/PWA install controls only when the app tools panel or install button is used, and keep service-worker registration in a small startup module. Preserve offline preparation, APK link, install prompt handling, and the existing install panel appearance.

Current performance phase 108 decision: during the production build, inject current hashed `dist/client/assets` files into the service-worker precache so lazy chunks, CSS, manifest, logos, and local images are available offline after install without being eagerly loaded on startup.

Current performance phase 109 decision: reuse the already prepared offline app shell when the app build version, shell URL signature, and Cache Storage shell entry are unchanged, avoiding repeated service-worker cache-post work during install/offline preparation while still refreshing after each new build.

Current performance phase 110 decision: cache the fallback `late.js` legacy offline-site count parser for `astipMap:offlineSites:v1` by exact raw value and localStorage length, so install/offline status refreshes do not repeatedly parse the same legacy queue.

Current performance phase 111 decision: restore the normal detail drawer from cached DOM nodes/clones instead of reparsing a saved `innerHTML` template when returning from temporary add/history drawers. Keep add-site/source form construction, detail tabs, handlers, and visual output unchanged.

Current performance phase 112 decision: cache normalized region options and region alias matchers once, including the short-code boundary regexes, so row indexing and filter preparation no longer rebuild identical kraj/slovensko alias data for every row.

Current performance phase 113 decision: precompute allowed, admin, and protocol-history e-mail sets once at startup so repeated auth, admin-control, and protocol-history visibility checks do not rebuild lowercase arrays while preserving the same access rules.

Current performance phase 114 decision: cache parsed date timestamps from repeated service-control date strings and return fresh Date objects per call, reducing repeated date parsing across indexing, marker status, counters, detail, and protocol prefill while preserving mutable Date behavior for callers.

Current performance phase 115 decision: throttle silent automatic offline synchronization triggers from focus/visibility events for a few seconds, while keeping manual sync immediate and preserving the existing in-flight coalescing and post-sync detail refresh behavior.

Current performance phase 116 decision: cache computed gallery photo folder names per photo metadata fingerprint so thumbnail navigation and gallery rerenders do not repeatedly parse identical folder/date fields, while leaving undated fallback behavior uncached.

Current performance phase 117 decision: update manual detail status toggles through the existing row lookup/index path and replace only the selected row, falling back to the old full scan only when the row cannot be indexed.

Current performance phase 118 decision: reuse the indexed single-row update helper for the legacy detail edit save path, avoiding a full `rows.map()` pass for one-point edits while preserving the old fallback behavior.

Current performance phase 119 decision: compute the current gallery user/admin delete context once per gallery render signature and reuse it for each photo, preserving the same delete permissions while avoiding repeated auth/admin lookups across large galleries.

Current performance phase 120 decision: cache gallery photo display/full/thumb URL bundles per photo URL fingerprint so gallery render signatures, thumbnail rows, and viewer updates reuse identical Cloudinary transforms and URL fallback decisions.

Current performance phase 121 decision: cache Galerie point-information rows per selected site and displayed field fingerprint, so repeated photo navigation reuses the same point detail rows while GPS/raw/site changes still refresh the visible information.

Current performance phase 122 decision: cache Galerie photo render metadata per photo/date/user fingerprint, including displayed dates, folder, uploader, size, and download name, so repeated photo navigation does not reformat the same metadata while admin/user date visibility remains correct.

Current performance phase 123 decision: clearing manual status from the detail panel should use the existing row lookup/index and replace only the selected row, falling back to the old full-row scan only when the row cannot be matched by the index.

Current performance phase 124 decision: saving a GPS position from the detail panel should update the selected row through the existing row lookup/index after any sibling-address propagation, with the previous full-row scan kept only as a fallback when the selected row cannot be verified.

Current performance phase 125 decision: saving the editable Detail data table should update the selected row through the existing row lookup/index after any sibling-place propagation, with the previous full-row scan kept only as a fallback when the selected row cannot be verified.

Current performance phase 126 decision: build and cache the Firebase-backed row list used for offline map-cache saves per row-array reference and row-index version, and reuse it after save/delete paths instead of repeatedly filtering the full row collection.

Current performance phase 127 decision: cache the unique row list used for offline detail/media prefetch per row-array reference and row-index version, so repeated offline preparation steps do not re-dedupe the full row collection when data has not changed.

Current performance phase 128 decision: dedupe offline photo media URLs with a `Set` while preserving output order, avoiding repeated linear `includes()` scans across large galleries during offline media preparation.

Current performance phase 129 decision: dedupe the final offline media cache URL list with a `Set` and compute same-origin once per URL before building requests, preserving the existing bounded worker pool and cache behavior.

Current performance phase 130 decision: after writing per-site local arrays or objects to `localStorage`, immediately warm the matching read cache with the same serialized value so subsequent detail/history/offline reads do not reparse the just-written data.

Current performance phase 131 decision: cache the raw-object portion of each row search text by raw field names and values, so fallback search/region inference reuses the same concatenated raw text instead of repeatedly running `Object.keys()`, `Object.values()`, and `join()` for unchanged records.

Current performance phase 132 decision: cache lazily generated marker popup HTML per place group signature, preserving click-time popup creation while avoiding repeated HTML assembly for the same unchanged grouped sources.

Current performance phase 133 decision: cache the merged raw/edit object used for detail field lookup per row/raw/edit reference, so Detail and Protokol helpers reuse one lookup object and its normalized-key caches during repeated renders.

Current performance phase 134 decision: cache repeated `dataNormFixed()` string normalization with a bounded in-memory map, preserving the exact normalized output while reducing Unicode/regex work across detail fields, edit fields, and protocol helpers.

Current performance phase 135 decision: cache `USER_SITE_DATA_FIELDS` spec lookup by normalized field key/label so repeated detail/edit save paths do not rescan the field definition list for the same names.

Current performance phase 136 decision: cache the remaining detail/protocol normalization helpers (`dataNormAll`, `dataNormUser`, and `valNormFixed`) with bounded in-memory maps while preserving their exact string transformation output.

Current performance phase 137 decision: cache the `public/late.js` modular Firestore wrapper by `fb.fsMod` and `window.db` reference so repeated Firebase helper calls reuse the same wrapper object while preserving the compat fallback.

Current performance phase 138 decision: cache the `public/late.js` compat Firestore database instance for the fallback path, so repeated `db()` calls do not recreate the same compat database object when modular Firestore is unavailable.

Current performance phase 139 decision: cache the `public/late.js` compat Auth instance for the fallback path and reuse it in `user()` and `waitCompatUser()`, preserving the modular Auth path and existing persistence behavior.

Current performance phase 140 decision: cache the successfully initialized `public/late.js` compat Firebase namespace/app reference, but do not cache missing SDK failures, so later dynamic compat loading can still recover.

Current performance phase 141 decision: replace the fixed local-file hosted-login redirect timeout with a two-frame paint wait, so the redirect message can render without keeping an arbitrary 1200 ms delay.

Current performance phase 142 decision: route the remaining `public/late.js` auth-state listener through the cached compat Auth helper, avoiding one more repeated Auth object lookup while preserving the Firebase auto-load behavior.

Current performance phase 143 decision: cache the main app's successfully prepared compat Firebase namespace/app reference and route fallback initialization through one helper, avoiding repeated `firebase.apps` checks while preserving modular-primary and compat fallback behavior.

Current performance phase 144 decision: cache dynamic compat Firebase script-load promises by absolute URL, avoiding repeated script DOM scans/listeners while still clearing failed loads so fallback retries can recover.

Current performance phase 145 decision: coalesce the lazy Firebase Functions import for protocol e-mail sending with a retryable shared promise, preserving on-demand loading while preventing duplicate concurrent imports/callable setup.

Current performance phase 146 decision: cache pending offline photo counts briefly and invalidate them with the overall offline counts after photo save/delete/sync or matching storage changes, avoiding repeated full offline-photo IndexedDB reads during status refreshes.

Current performance phase 147 decision: cache pending offline protocol counts briefly and invalidate them with the overall offline counts after protocol queue save/delete/local save or matching storage changes, reducing repeated full offline-protocol queue reads during status refreshes.

Current performance phase 148 decision: cache pending offline site/source counts briefly and invalidate them with the overall offline counts after IndexedDB queue save/delete or legacy queue storage changes, reducing repeated full offline-site queue reads during status refreshes.

Current performance phase 149 decision: skip unchanged text/disabled DOM writes in the offline sync status panel, preserving the same displayed state while reducing repeated UI work during focus, storage, and sync refreshes.

Current performance phase 150 decision: cache the `public/late.js` install/offline-ready localStorage state briefly by raw JSON value and refresh it on writes/storage events, reducing repeated parsing during install/offline status fallback checks.

Current performance phase 151 decision: cache the `public/late.js` install fallback's saved Firebase site count briefly by raw map-cache JSON value, avoiding repeated parsing/filtering during offline preparation/status checks while preserving current cache metadata behavior.

Current performance phase 152 decision: skip unchanged text/disabled DOM writes in the `public/late.js` install fallback offline status updater, preserving the same fallback display while reducing repeated UI work before the main updater is available.

Current performance phase 153 decision: cache the `public/late.js` install fallback offline queue counts briefly and invalidate after queue/storage changes, preserving the same startup offline status while reducing repeated IndexedDB/localStorage reads before the main updater takes over.

Current performance phase 154 decision: skip unchanged text/disabled DOM writes while the `public/late.js` fallback prepares offline app data, preserving the same install/offline copy and button state while reducing repeated startup UI work.

Current performance phase 155 decision: skip unchanged text/display/attribute/disabled DOM writes in the lazy install controls module, preserving the same PWA/APK/offline install behavior while reducing repeated guide/status UI work.

Current performance phase 156 decision: skip unchanged startup/login/offline-map DOM writes in the main app bootstrap, preserving the same auth, app shell, offline cache, and map display behavior while reducing repeated style/text updates during startup.

Current performance phase 157 decision: skip unchanged text/disabled DOM writes during the main offline data preparation flow, preserving the same Firebase/cache/detail/gallery/offline map synchronization behavior while reducing repeated status UI writes during long offline preparation.

Current performance phase 158 decision: skip unchanged display/attribute/src/href DOM writes in the early shell boot install/logo fallback, preserving the same PWA controls, app tools menu, logo, and icon behavior while reducing repeated startup UI work before the lazy install module takes over.

Current performance phase 159 decision: skip unchanged auth/user/protocol-history visibility DOM writes in the main app, preserving the same login/logout labels, technician status, and private protocol-history visibility while reducing repeated startup/auth UI work.

Current performance phase 160 decision: skip unchanged hosted-login status, class, and click-handler DOM writes, preserving the same Google login/logout and local-file redirect behavior while reducing repeated startup/load auth binding work.

Current performance phase 161 decision: skip unchanged form value and checkbox writes in shared detail/protocol/document fill helpers, preserving the same detail editing, add-source, protocol restore, and official document prefill behavior while reducing repeated form DOM work.

Current performance phase 162 decision: skip unchanged GPS/detail helper writes, protocol save-button text writes, and add-site form reset writes, preserving the same map GPS picking, protocol edit labels, and post-save form cleanup while reducing repeated form DOM work.

Current performance phase 163 decision: cache the static status and region filter option DOM and rebuild it only when the option signature changes, preserving the same filter labels, colors, selected values, and render behavior while reducing repeated sidebar select work.

Current performance phase 164 decision: cache the add-site/all-fields DOM controls by `data-new-key` and reuse that index for collection, clearing, and add-source field prefill, preserving the same form values and save behavior while avoiding repeated full-field query scans.

Current performance phase 165 decision: cache the sidebar filter controls for search/status/region and reuse them during filtering, reset, color updates, signatures, and event binding, preserving the same filter UI and values while reducing repeated DOM lookups during render and search work.

Current performance phase 166 decision: delegate sidebar result item clicks to a single `#list` listener and store the detail key on each row, preserving the same sidebar item appearance and open-detail behavior while avoiding per-row click handler allocation on every render.

Current performance phase 167 decision: delegate gallery folder/thumbnail clicks to a single `#sitePhotosList` listener, preserving the same active thumbnail navigation and photo viewer behavior while avoiding per-thumbnail event handler allocation on every gallery rerender.

Current performance phase 168 decision: delegate main protocol history row clicks to a single `#mainProtocolHistoryList` listener, preserving the same history panel rows and open-detail behavior while avoiding per-row handler binding after each history render.

Current performance phase 169 decision: delegate detail source chooser source switching to one `#sourceChooser` listener while leaving the existing add-source delegation intact, preserving the same source buttons and add-source behavior while avoiding per-button handler binding on chooser rerenders.

Current performance phase 170 decision: handle the source chooser `data-add-source` button inside the same delegated `#sourceChooser` listener, preserving add-source behavior even if the late helper loads later while keeping per-button handler binding removed.

Current performance phase 171 decision: delegate detail protocol-history controls through one `#history` listener, preserving the same previous/next/edit/export/mail/delete buttons while avoiding repeated per-button handler binding on every history rerender.

Current performance phase 172 decision: delegate Galerie viewer arrows and delete action through the existing `#sitePhotosList` listener, preserving thumbnail navigation, photo switching, and delete behavior while avoiding repeated viewer-button handlers on every photo rerender.

Current performance phase 173 decision: set detail history previous/next disabled state on the newly created button elements before `replaceChildren()`, preserving the same controls while avoiding redundant DOM lookups after every history render.

Current performance phase 174 decision: route the Galerie "Uložit fotografie" action only through the existing delegated document click handler, preserving uploads while avoiding a duplicate direct button listener on startup.

Current performance phase 175 decision: route Galerie photo input preview updates only through the existing delegated document change handler, preserving the same preview/status behavior while avoiding duplicate direct input listeners and duplicate preview rendering.

Current performance phase 176 decision: cache protocol summary DOM nodes and write their text only when changed, preserving the same protocol form summary while avoiding repeated `getElementById()` lookups and redundant text writes during form input.

Current performance phase 177 decision: cache offline/sync status panel DOM nodes and reuse them during status refreshes, preserving the same offline counts, labels, button state, and sync messaging while avoiding repeated `getElementById()` lookups on focus/storage/sync updates.

Current performance phase 178 decision: cache the last applied status-filter CSS class on the filter select, preserving the same filter colors while avoiding repeated removal/re-addition of all status classes when the selected status has not changed.

Current performance phase 179 decision: cache frequently used form field DOM nodes behind the shared value/checkbox/protocol setters, preserving the same protocol/detail form behavior while reducing repeated `getElementById()` lookups during form fill, save, draft, and export work.

Current performance phase 180 decision: route protocol prefill, device reset/change handling, service-record save reads, and small protocol helper writes through the cached form-field lookup path, preserving the same protocol values, status text, and handlers while reducing direct DOM queries during repeated protocol work.

Current performance phase 181 decision: cache stable protocol panel nodes such as the form, toggle/save buttons, status node, device selectors, and signature controls, preserving the same protocol open/close, validation, signature, and submit behavior while reducing repeated DOM lookup and redundant text writes.

Current performance phase 182 decision: route all protocol status messages for edit-from-history, Word export, mail sending, autosave, draft restore, and detail-history mail errors through the shared cached status helper, preserving identical copy while avoiding repeated `protocolStatus` lookups and duplicate text writes.

Current install UX decision: the Android/PWA install area should behave like the original `karolopejlo/Mapa` PWA flow: the main "Stáhnout aplikaci" button calls the browser install prompt directly when Android Chrome exposes it, without a custom confirmation dialog in front of the system prompt. Keep readiness/status copy and a visible APK fallback link, but do not auto-download APK merely because the PWA prompt is unavailable.

Current offline preparation decision: "Připravit offline data" should cache the app shell, Firebase map rows, per-site protocols, service records, gallery metadata, and gallery image URLs for offline use. New site/source records, protocols, and photos must remain saveable offline and synchronize back to Firebase/Cloudinary after reconnecting.

Current offline first-launch decision: the Android/PWA install flow must open the browser install prompt immediately from the user click and must not run full offline data preparation before installation. Offline startup must show locally cached Firebase rows even if Firebase SDK/auth cannot load. The supplied `Tipo_SZZ_logo3.png` battery mark is the required app logo/source for the visible logo and Android manifest icons.

Current incremental offline sync decision: first manual offline preparation may download the full Firebase row/detail/media set once, but repeated preparation/synchronization must use stored sync metadata and delta reads, skip unchanged points and cached media, and merge changed photos, points, protocols, and service records without creating duplicates.

Current Android packaging decision: for a guaranteed launcher/menu icon on tablets, maintain the `android/` Trusted Web Activity project against the current public web URL `https://serviszdroju.github.io/Mapa/`. PWA install remains best-effort because some Android/launcher/browser combinations create only a web shortcut; an APK install is the reliable path for appearing in the tablet app menu.

Current APK delivery decision: keep the public Pages `downloads/` folder during web deployments and expose `downloads/szz-mapa-tablet.apk` from the install panel as the reliable tablet-menu installation path. Build the APK from the `android/` TWA project and ship it inside the public web build until a CI token with workflow scope is available.

Current detail/history styling decision: the read-only Detail tab rows must use the same `history-item` and `history-detail-row` visual treatment as "Historie záznamů", including font, text size, colors, spacing, borders, and background. Do not apply special red/important-note styling to read-only detail rows.

Current detail menu decision: the Detail / Protokol / Galerie / Doklad tab menu must appear exactly once in the detail drawer. When returning from alternate drawer content such as main protocol history, restore the normal detail drawer shell and deduplicate `.detail-tabs`.

Current gallery folder display decision: gallery folders must be stacked vertically as full-width sections and must not block vertical drawer scrolling. Do not show a horizontal folder chip row; each folder header should show only the stored folder name, without a separate formatted date label or photo count.

Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
