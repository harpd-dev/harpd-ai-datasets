# Template: Harpd Rank analysis with DuckDB

A zero-dependency analytical SQL workspace over the public Harpd Rank dataset.
DuckDB fetches the live CSV directly, so you can slice 1,000+ products with plain
SQL — no pipeline, no API key. Fork, install DuckDB, run.

**Built with:** Harpd AI Datasets · Data from Harpd (https://harpd.com/), CC BY 4.0.

## Run

```bash
# macOS / Linux
brew install duckdb
duckdb -c ".read query.sql"

# or pipe straight from the URL
duckdb -c "SELECT categoryName, COUNT(*) FROM read_csv_auto('https://harpd.com/data/rank.csv', header=true) GROUP BY 1 ORDER BY 2 DESC"
```

## What it does

- Loads `https://harpd.com/data/rank.csv` as a view (`rank`).
- Counts products per category board.
- Summarises the Rank Points distribution (promotional placement, **not** a quality score).
- Lists the top 10 by Rank Points within the largest category.

## Notes

- Column names follow [`/data/schema.json`](https://harpd.com/data/schema.json)
  (`id, name, slug, url, category, categoryName, rank, rankPoints, verified, updatedAt`).
  `rank` and `rankPoints` arrive as strings, so the queries `TRY_CAST` them.
- Pin to a release tag (`v2026.9`) for a frozen snapshot instead of the live URL.
- Attribute Harpd when you publish results: the **Powered by Harpd** badge and the
  citation lines live at [harpd.com/developers/attribution/](https://harpd.com/developers/attribution/).
