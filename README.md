# eMAX Field Mapping

Static documentation site: where every field the TPP RHP microsite sends to eMAX comes from (Cash Sale, payment receipt, customer pre-check, Cash Sale PDF).

- Single page, no build step: `index.html`.
- Open it locally by double-clicking `index.html`.
- Deployed on Vercel as a static site (framework preset: **Other**, no build command, output directory: `.`).

## Remarks

Every table has a Remarks column. Saved remarks live in `remarks.json` (keys are `"<tableId>|<field>"`, e.g. `"t-sales-header|InvoiceDate"`), so they are shared and versioned in git. No database.

1. Type in a Remarks cell. The edit is kept in your browser only and shows as "Not saved".
2. Click **Remarks → Copy remarks.json**. This copies every remark, saved ones plus your edits.
3. Replace the contents of `remarks.json` on GitHub with it and commit. Vercel redeploys and everyone sees it.

Remarks don't load when you open `index.html` by double-click, because browsers block reading a local file. Use the Vercel URL, or run `python -m http.server` in this folder.

Source of truth is the microsite code (`EmaxPostingService.BuildSales` / `BuildPayment`, `EmaxClient`, `AppWAToken`). When the mapping changes there, update the `DATA` tables in `index.html`.
