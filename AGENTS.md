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

Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
