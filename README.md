# FishDex Charleston Lowcountry — starter website

This is a working starter with all 77 species slots, two player profiles, search/filter, catch logging, browser-local persistence, and JSON export.

## Publish with GitHub Pages
1. Create a public repository named `fishdex`.
2. Upload `index.html`, `species.js`, `app.js`, and the `images` folder (keep file names).
3. Go to Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.
4. Visit `https://YOUR-USERNAME.github.io/fishdex/` after deployment.

## Photos
The `images` folder is intentionally empty except for a note. **No real photo assets are bundled.** Add licensed, species-verified JPEGs named `01.jpg` through `77.jpg`; keep credits and license information. Until then, cards show a placeholder.

## Important limitations
- Catch logs are stored in each browser's localStorage, **not synced across devices**. Export regularly. Two player profiles are separate within that browser.
- No catch-photo uploads or record-badge functionality yet.
- The species rarities are game mechanics, not official abundance rankings.
- Protected species may require observation-only handling and local legal review before public launch.
