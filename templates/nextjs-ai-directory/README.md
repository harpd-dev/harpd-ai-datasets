# Template: Harpd-powered AI Agent Directory (Next.js)

A minimal Next.js app that lists AI agents from the Harpd **AI Agent Index**
(loaded live from raw.githubusercontent.com). Fork, `npm install`, `npm run
dev`, and you have a working directory in 5 minutes.

**Built with:** Harpd AI Datasets · Data from Harpd (https://harpd.com/), CC BY 4.0.

## Run

```bash
npm install
npm run dev
# open http://localhost:3000
```

## What it does

- Fetches `data/research/ai-agent-index.csv` at build/runtime.
- Renders a searchable, category-filtered agent directory.
- Footer attributes Harpd and links to https://harpd.com/data/.

## Customize

- Swap the CSV for `ai-tools-index.csv` or `overall.csv`.
- Add `st/pages` routing per agent using the `url` field.
- Pin to a release tag (`v2026.9`) for a frozen snapshot.
