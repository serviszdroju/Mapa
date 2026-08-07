# Design QA

Date: 2026-08-07

## Visual Source

- Selected mock: `/Users/jansoldan/.codex/generated_images/019fcb7f-a335-7e60-a9b4-44eb6bb2407d/call_LJO0vaQ0VDATkRzUwNnw2u0i.png`
- Requested adjustment: keep the first design direction, remove only the dark left vertical sidebar.
- Durable layout target: dark top bar, light left filter panel, central map, right detail drawer.

## Evidence

- Desktop production preview: `/private/tmp/servis-mapa-production-preview.png`
- Desktop QA capture: `/private/tmp/servis-mapa-qa-desktop-final.png`
- Mobile QA capture: `/private/tmp/servis-mapa-mobile-final.png`
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
