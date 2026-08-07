# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Current durable design decision: the user wants the redesigned GitHub Pages site to keep the original web appearance from `karolopejlo/Mapa`. Do not continue with the React/dashboard redesign. Preserve the original map layout, left controls, colors, all point data, completed protocols, photos, and document generation. The only desired design change is in the point detail: add a small top menu for switching between Detail, Protokol, Galerie, and Doklad while keeping the original functions and DOM ids intact.

Current audit decision: production must be Firebase-first and must not reintroduce public operational datasets such as `data.csv` or hardcoded plaintext address inventories. If a private export is needed locally, keep it ignored under `private-data/`. The public site can show the app shell without login, but service points, protocols, photos, and doklady must come from Firebase/Cloudinary after authentication.

Current optimization decision: implement the Word performance brief incrementally while preserving the original visual style, Firebase-backed data, detail functions, protocols, photos, document exports, and offline drafts. Prefer debounced UI work, cached map/data rendering, and no idle polling over visible redesigns or destructive data changes.

Current visual refinement decision: when exploring improved visuals, keep the page built like the user's current web app: left controls, central map, and right point detail. Preserve the original color palette, especially the blue action color and existing status colors. Improve detail quality, hierarchy, spacing, tabs, cards, status indicators, typography, and polish rather than introducing a new dashboard or different product architecture.

Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
