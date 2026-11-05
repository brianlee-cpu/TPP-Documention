# eMAX Field Mapping

Static documentation site: where every field the TPP RHP microsite sends to eMAX comes from (Cash Sale, payment receipt, customer pre-check, Cash Sale PDF).

- Single page, no build step: `index.html`.
- Open it locally by double-clicking `index.html`.
- Deployed on Vercel as a static site (framework preset: **Other**, no build command, output directory: `.`).

Source of truth is the microsite code (`EmaxPostingService.BuildSales` / `BuildPayment`, `EmaxClient`, `AppWAToken`). When the mapping changes there, update the `DATA` tables in `index.html`.
