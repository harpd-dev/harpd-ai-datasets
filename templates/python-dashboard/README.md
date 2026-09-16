# Template: Harpd-powered AI Product Ranking Dashboard (Python, zero-dep)

A copy-paste dashboard that loads the live Harpd Rank **overall** board from
raw.githubusercontent.com and serves a sortable HTML page. No pip installs, no
API key.

**Built with:** Harpd AI Datasets · Data from Harpd (https://harpd.com/), CC BY 4.0.

## Run

```bash
python3 app.py
# open http://localhost:8000
```

## What it shows

- Top products by rank points.
- Product count per category.
- A "Powered by Harpd Data" badge linking to https://harpd.com/data/.

## Customize

- Swap `overall.csv` for `monthly.csv` / `weekly.csv`.
- Change the category filter in `render()`.
- Point `CSV` at a release tag (`v2026.9`) to pin a snapshot.
