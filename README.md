# Outfitted waitlist

A lightweight static landing page for Outfitted.

## Stack

- index.html — page structure and copy
- styles.css — all styling and responsive behavior
- script.js — minimal waitlist form submission
- functions/api/waitlist.js — optional Cloudflare Pages Function for saving emails to D1
- schema.sql — the waitlist table schema

There is no React, Next.js, TypeScript, Tailwind, Vite, pnpm/npm dependency install, or build step.

## Run locally

For the visual page only, any static server works. For example:

    python3 -m http.server 8000

Then open http://localhost:8000.

The /api/waitlist endpoint is a Cloudflare Pages Function, so the signup form needs a Pages deployment (or another backend wired to the same URL) to actually store emails.

## Cloudflare Pages + D1

1. Create or reuse a D1 database.
2. Apply schema.sql to that database.
3. Add a Pages D1 binding named DB.
4. Deploy the repository as a Pages project with no build command and / as the output directory.

## Notes

The previous React version referenced outfitted-hero.png and avatar-scan.png, but those files were not committed to the repository. This static version uses CSS-based visual stand-ins so the page does not ship with broken image links. Real assets can be dropped in later without bringing the old framework stack back.
