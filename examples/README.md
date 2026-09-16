# Build With Harpd Data

Real, runnable examples for every consumer type. Every example reads the **raw
GitHub files** — no API key, no website visit. All data is attributed to
[Harpd](https://harpd.com/) under CC BY 4.0.

## Examples in this repo

| Example | Who it's for | File |
|---|---|---|
| Python load | Agents, apps, APIs | [`python/load_dataset.py`](python/load_dataset.py) |
| pandas analytics | Analysts, data science | [`python/analyze_with_pandas.py`](python/analyze_with_pandas.py) |
| JavaScript / Node | Web apps, scripts | [`javascript/load-dataset.mjs`](javascript/load-dataset.mjs) |
| curl | Shell, quick checks | [`curl/README.md`](curl/README.md) |
| DuckDB / SQL | Analysts, BI | [`sql/query.duckdb.sql`](sql/query.duckdb.sql) |

## Real use cases you can build

- **AI product explorer** — browse 1,122 products with rank, category, verification.
- **AI ranking dashboard** — chart the overall / monthly / weekly Harpd Rank boards.
- **AI market tracker** — watch category-level share from the AI Market Index.
- **AI agent directory** — index 334+ agents from the AI Agent Index.
- **AI product comparison** — diff products across categories with pandas.
- **AI research notebook** — cite the Research Index + Evidence in a notebook.

## Start in 30 seconds

```bash
# Python
python3 examples/python/analyze_with_pandas.py

# Node
node examples/javascript/load-dataset.mjs

# DuckDB
duckdb < examples/sql/query.duckdb.sql

# curl
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/manifest.json
```

## Use the data in your project

```markdown
[![Powered by Harpd Data](https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/assets/powered-by-harpd-data.svg)](https://harpd.com/data/)
```

```
Data from Harpd (https://harpd.com/)
```
