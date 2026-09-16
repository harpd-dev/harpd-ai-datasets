# Changelog

All record counts reflect the data committed at the date shown. The canonical
source for every dataset is [harpd.com/data/](https://harpd.com/data/).

## 2026-09-16 — Initial public snapshot (`v2026.9`)

First release of the unified Harpd AI Datasets repository, consolidating the
previous `harpd-rank-dataset` and `harpd-discovery-dataset` mirrors.

**Datasets**

| Dataset | Records | Source |
|---|---:|---|
| Products | 1,122 | https://harpd.com/data/products.json |
| Rankings (overall) | 1,122 | https://harpd.com/data/rank.json |
| Rankings (monthly) | 1,122 | https://harpd.com/rank/ (month window 2026-09) |
| Rankings (weekly) | 1,122 | https://harpd.com/rank/ (week 2026-W38) |
| Category Boards | 28 | https://harpd.com/data/categories.json |
| AI Market Index | 27 | https://harpd.com/data/market-index.json |
| AI Agent Index | 334 | https://harpd.com/discovery/ (category=agents) |
| Developer Tools Index | 1,918 | https://harpd.com/discovery/ (category=developer) |
| AI Tools Index | 693 | https://harpd.com/discovery/ (agents + AI-media) |
| Research Index | 5 | https://harpd.com/research/ |
| Evidence | 5 | https://harpd.com/data/evidence.json |

**Added**
- JSON + CSV for every core dataset.
- Stable JSON Schemas in `schema/`.
- `manifest.json` machine-readable entry (record counts, sha256, source URLs).
- Quality gate in `scripts/validate.mjs` (10 checks, fails closed).
- Daily sync GitHub Action; monthly snapshot release workflow.
- Examples (Python, JavaScript, curl, DuckDB, pandas) and starter templates.
- CITATION.cff, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.

**Methodology note**
The three research indices (`ai-agent`, `developer-tools`, `ai-tools`) are
coverage views sliced from the Harpd Product Discovery Index by product
category. They are real subsets of discovered products, not invented rows; the
slice definition is recorded in each dataset's `meta.sliceDefinition`.
