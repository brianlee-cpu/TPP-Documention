# eMAX Field Mapping

Static documentation site: where every field the TPP RHP microsite sends to eMAX comes from (Cash Sale, payment receipt, customer pre-check, Cash Sale PDF).

- Single page, no build step: `index.html`.
- Open it locally by double-clicking `index.html`.
- Deployed on Vercel as a static site (framework preset: **Other**, no build command, output directory: `.`).

## Remarks

Every table has a Remarks column, stored in a Google Sheet through a Google Apps Script web app ([apps-script/Code.gs](apps-script/Code.gs)). Typing in a cell saves it about a second after you stop. Everyone sees it on their next page load.

**Setup (once):**
1. Create a Google Sheet, open **Extensions → Apps Script**, and paste in `apps-script/Code.gs`.
2. **Project Settings → Script properties**: add `EDIT_KEY` with a password of your choice.
3. **Deploy → New deployment → Web app**: Execute as **Me**, Who has access **Anyone**. Authorise it and copy the URL that ends in `/exec`.
4. Put that URL in `const SHEET_URL = "..."` in `index.html`, then commit and push.

**Editing:** click **Remarks** in the top bar and enter your name and the edit key once per browser. Cells marked "Not saved" are retried when you click **Save and retry unsaved**.

The sheet's rows are `Key | Remark | UpdatedBy | UpdatedAt`, where Key is `"<tableId>|<field>"` (e.g. `t-sales-header|InvoiceDate`). If you change the script later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

Source of truth is the microsite code (`EmaxPostingService.BuildSales` / `BuildPayment`, `EmaxClient`, `AppWAToken`). When the mapping changes there, update the `DATA` tables in `index.html`.
