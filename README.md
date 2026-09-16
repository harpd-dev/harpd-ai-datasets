# Harpd AI Datasets

Open datasets for AI products, rankings, research and evidence.

> An **AI product dataset**, **AI tools dataset**, **AI agent dataset**, **AI rankings** and **AI research dataset** — published as open AI data so developers can build on it without visiting harpd.com.

**Source:** [https://harpd.com/](https://harpd.com/)
**Canonical / citation:** [https://harpd.com/data/](https://harpd.com/data/)
**License:** CC BY 4.0 — attribution required (see [Attribution](#attribution))

---

## What is this?

Harpd AI Datasets is the open data distribution layer for [Harpd](https://harpd.com/). It mirrors Harpd's public rankings, product catalog, market research and evidence as **raw JSON + CSV files on GitHub**, synced automatically from harpd.com. Third-party developers can consume the data directly from `raw.githubusercontent.com` — no API key, no website visit, no scraping.

Every dataset is attributed to Harpd and links back to its canonical source page.

## What data is available?

| Dataset | Format | Records | Description |
|---|---|---:|---|
| [Products](data/products/products.json) | JSON / [CSV](data/products/products.csv) | 1,122 | AI product catalog with rank, category and verification status. |
| [Rankings (overall)](data/rankings/overall.json) | JSON / [CSV](data/rankings/overall.csv) | 1,122 | Harpd Rank overall board. |
| [Rankings (monthly)](data/rankings/monthly.json) | JSON / [CSV](data/rankings/monthly.csv) | 1,122 | Live board scoped to the current month window. |
| [Rankings (weekly)](data/rankings/weekly.json) | JSON / [CSV](data/rankings/weekly.csv) | 1,122 | Live board scoped to the current week window. |
| [Category Boards](data/rankings/categories.json) | JSON | 28 | The 28 Harpd Rank category boards. |
| [AI Market Index](data/research/ai-market-index.json) | JSON / [CSV](data/research/ai-market-index.csv) | 27 | Category-level AI market share & rank-point distribution. |
| [AI Agent Index](data/research/ai-agent-index.json) | JSON / [CSV](data/research/ai-agent-index.csv) | 334 | AI-agent products (Discovery Index, category=agents). |
| [Developer Tools Index](data/research/developer-tools-index.json) | JSON / [CSV](data/research/developer-tools-index.csv) | 1,918 | Developer-tool products (Discovery Index, category=developer). |
| [AI Tools Index](data/research/ai-tools-index.json) | JSON / [CSV](data/research/ai-tools-index.csv) | 693 | AI-tooling products (agents + AI-media). |
| [Research Index](data/research/research.json) | JSON / [CSV](data/research/research.csv) | 5 | Published monthly Harpd research families. |
| [Evidence](data/evidence/evidence.json) | JSON / [CSV](data/evidence/evidence-claims.csv) | 5 | Evidence-linked claims behind Harpd rankings. |

Each row links to its **GitHub file**, **Harpd source page** and **raw URL** — see [`manifest.json`](manifest.json) for the machine-readable index (schema, source URL, record count, sha256 per file).

## How to use it?

Three lines and you are reading real data:

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/manifest.json
```

```python
import requests
data = requests.get(
    "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.json"
).json()
print(len(data["products"]), "products")
```

Full examples (Python, JavaScript, curl, DuckDB, pandas, SQL) are in [`examples/`](examples/). Copy-paste starter apps are in [`templates/`](templates/).

## How often is it updated?

- **Daily** — a GitHub Action ([`.github/workflows/sync.yml`](.github/workflows/sync.yml)) re-syncs from harpd.com every day. If upstream data is unchanged (or degraded), it makes **no commit** — you never get a meaningless diff or a stale snapshot.
- **Monthly** — a [data snapshot release](https://github.com/harpd-dev/harpd-ai-datasets/releases) (`v2026.09`, …) freezes the current state with record counts and methodology.
- Every file carries an `updatedAt` and a `sha256` in `manifest.json`.

## How to cite it?

```bibtex
@dataset{harpd_ai_datasets,
  author = {Harpd},
  title = {Harpd AI Datasets},
  year = {2026},
  publisher = {Harpd},
  doi = {},
  url = {https://harpd.com/data/},
  license = {CC BY 4.0}
}
```

A `CITATION.cff` is included so GitHub renders a citation block. Cite the canonical source: **https://harpd.com/data/**.

## What license applies?

[**CC BY 4.0**](LICENSE). You may share and adapt for any purpose, including commercially, **provided you give appropriate credit** to Harpd. See [Attribution](#attribution).

## Where does the original data come from?

All data originates from [Harpd](https://harpd.com/) — its public rankings, product discovery index, market research and evidence pipeline. harpd.com remains the **canonical source**; this repository is a mirrored distribution layer. Three research indices (`ai-agent`, `developer-tools`, `ai-tools`) are coverage views **sliced by category** from the Harpd Product Discovery Index — they are real subsets, not invented rows, and the slice is recorded in each dataset's `meta.sliceDefinition`.

---

## Raw data distribution

All files are served raw from this repo. Replace `main` with a release tag (e.g. `v2026.09`) to pin a snapshot.

```bash
# Manifest (machine-readable entry point)
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/manifest.json

# Products
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.json

# AI Agent Index (JSON + CSV)
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.json
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.csv

# Evidence
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/evidence/evidence.json
```

## Examples

See [`examples/`](examples/) — each is runnable:

- **Python** — [`examples/python/load_dataset.py`](examples/python/load_dataset.py)
- **JavaScript / Node** — [`examples/javascript/load-dataset.mjs`](examples/javascript/load-dataset.mjs)
- **curl** — [`examples/curl/README.md`](examples/curl/README.md)
- **DuckDB / SQL** — [`examples/sql/query.duckdb.sql`](examples/sql/query.duckdb.sql)
- **pandas** — [`examples/python/analyze_with_pandas.py`](examples/python/analyze_with_pandas.py)

```sql
-- DuckDB: query the live CSV without downloading it
SELECT category, COUNT(*) AS n
FROM read_csv_auto('https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.csv')
GROUP BY category;
```

## Starter templates

Fork-and-run apps that use Harpd data directly — build something in 5 minutes:

- [`templates/python-dashboard/`](templates/python-dashboard/) — AI product ranking dashboard.
- [`templates/nextjs-ai-directory/`](templates/nextjs-ai-directory/) — AI agent / product directory.
- [`templates/streamlit-explorer/`](templates/streamlit-explorer/) — interactive AI product explorer.

## Using Harpd Data?

If your project uses this dataset, add the **Powered by Harpd Data** badge:

**Markdown**

```markdown
[![Powered by Harpd Data](https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/assets/powered-by-harpd-data.svg)](https://harpd.com/data/)
```

**HTML**

```html
<a href="https://harpd.com/data/">
  <img alt="Powered by Harpd Data"
       src="https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/assets/powered-by-harpd-data.svg" />
</a>
```

**Attribution (required by CC BY 4.0)**

```
Data from Harpd (https://harpd.com/)
```

## Attribution

Data source: **Harpd**
Website: **https://harpd.com/**
Dataset: **https://harpd.com/data/**
License: **CC BY 4.0**

Attribution string: *"Data from Harpd (https://harpd.com/)"*

Every dataset file embeds `source`, `sourceUrl`, `license` and `attribution` metadata so attribution travels with the data.

## Schema & validation

Every `data/*.json` is validated in CI against the JSON Schemas in [`schema/`](schema/) (`product`, `ranking`, `research`, `evidence`, `dataset`). The quality gate ([`scripts/validate.mjs`](scripts/validate.mjs)) checks JSON validity, CSV validity, required fields, unique IDs, timestamp format, manifest consistency, attribution presence and (sampled) Harpd URL liveness. **Bad data is never published.**

## Adoption

Real third-party usage is tracked in [`docs/adoption.md`](docs/adoption.md) — no fabricated metrics. Candidate integrations are listed in [`docs/integrations.md`](docs/integrations.md). KPI definitions are in [`docs/metrics.md`](docs/metrics.md).

## Cross-links

- **Harpd Data** (canonical): https://harpd.com/data/
- **Harpd Research**: https://harpd.com/research/
- **Harpd Rank**: https://harpd.com/rank/
- **Harpd Methodology / Evidence**: https://harpd.com/data/evidence.json
- **GitHub repo**: https://github.com/harpd-dev/harpd-ai-datasets

## Contributing

Found a stale price, a missing product, or want to add an example? See [`CONTRIBUTING.md`](CONTRIBUTING.md). Fork → modify → open a PR; validation runs automatically.

## Repository topics

`ai` · `ai-tools` · `ai-agents` · `ai-products` · `dataset` · `open-data` · `artificial-intelligence` · `machine-learning` · `research` · `ranking` · `ai-directory`

---

*Published by [Harpd](https://harpd.com/). Canonical source: https://harpd.com/data/. Licensed CC BY 4.0.*
