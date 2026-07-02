# Site Audit — Pre-Production Fixes

---

## Critical

- [ ] **Missing favicon.ico and apple-touch-icon.png** — referenced in `app/layout.tsx` metadata but files don't exist in `/public/`. Every page load 404s on these. Add the assets.

---