# Outfitted waitlist

A lightweight static landing page for Outfitted.

## Stack

- index.html — page structure and copy
- styles.css — all styling and responsive behavior
- script.js — local waitlist form submission
- google-apps-script/Code.gs — Google Sheets webhook code

There is no React, Next.js, TypeScript, Tailwind, Vite, pnpm/npm dependency install, or build step.

## Run locally

Open `index.html` directly in your browser, or use any static server:

    python3 -m http.server 8000

Then open http://localhost:8000.

## Google Sheets setup

1. Create a Google Sheet with a header row such as `Created At` and `Email`.
2. Open **Extensions > Apps Script**, replace the editor contents with `google-apps-script/Code.gs`, and save it.
3. In Apps Script, open **Project Settings > Script properties** and add:
    - `SPREADSHEET_ID` — the text between `/d/` and `/edit` in your Sheet URL.
    - `SHEET_NAME` — the exact tab name at the bottom of the Sheet, usually `Sheet1`.
4. Choose **Deploy > Manage deployments**, click the pencil icon, select **New version**, set **Execute as** to yourself, set access to **Anyone**, and deploy.
5. Copy the web app URL and paste it into `GOOGLE_SHEETS_WEBHOOK_URL` at the top of `script.js`.
6. Open `index.html` and submit a test email.

If the script is bound to the Sheet, `SPREADSHEET_ID` is optional, but setting it makes the web app connection reliable. If you change the Apps Script code, create a new deployment version before testing again.

The Apps Script checks for an existing email before adding a row. The URL is used by the local page to submit signups directly to the Sheet.

## Notes

The previous React version referenced outfitted-hero.png and avatar-scan.png, but those files were not committed to the repository. This static version uses CSS-based visual stand-ins so the page does not ship with broken image links. Real assets can be dropped in later without bringing the old framework stack back.
