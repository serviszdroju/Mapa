# Design QA

Date: 2026-08-07

## Visual Source

- Selected mock: `/Users/jansoldan/.codex/generated_images/019fcb7f-a335-7e60-a9b4-44eb6bb2407d/call_LJO0vaQ0VDATkRzUwNnw2u0i.png`
- Requested adjustment: move away from the darker dashboard-like look after user feedback.
- Durable layout target: light gray/white/soft-blue interface, compact light filter panel, central map, right detail drawer, no dark left sidebar and no heavy dark top bar.

## Evidence

- Desktop production preview: `/private/tmp/servis-mapa-light-redesign-desktop.png`
- Mobile production preview: `/private/tmp/servis-mapa-light-redesign-mobile.png`
- Previous desktop QA capture: `/private/tmp/servis-mapa-qa-desktop-final.png`
- Side-by-side design comparison: `/private/tmp/servis-mapa-design-qa-comparison.png`

## Viewports

- Desktop: 1280 x 720, devicePixelRatio 2 in production preview.
- Mobile: 390 x 844, devicePixelRatio 1.

## Result

Passed.

- No dark left sidebar is present.
- No startup toast or error overlay covers the UI.
- The first desktop viewport keeps the intended composition: header, filters, map, and detail drawer.
- Mobile has no horizontal overflow and keeps account text readable.
- Production preview reported no console errors.
- Build passed and emitted `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
- `test:sites` passed all 4 checks.

## Notes

- The current app uses static prototype data and UI behavior matching the Word assignment extract.
- Firebase, Google sign-in, Firestore, Cloudinary uploads, RTF export, email delivery, and data migration are prepared as next integration work, not connected to live services in this prototype.
