# Harpd AI Datasets — Catalog

> Machine-generated from `data/manifest.json`. Record counts are read from the
> manifest's `recordCount` field — they are **never hand-maintained**.

Generated: `2026-09-16T10:37:21.880Z` · Manifest version: `2026.9` · License: `CC BY 4.0`

| Dataset | Records | Format | Updated |
|---|---:|---|---|
| Products | 1122 | JSON + CSV | 2026-09-16 |
| Rankings (overall) | 1122 | JSON + CSV | 2026-09-16 |
| Rankings (monthly) | 1122 | JSON + CSV | 2026-09-16 |
| Rankings (weekly) | 1122 | JSON + CSV | 2026-09-16 |
| AI Market Index | 27 | JSON + CSV | 2026-09-16 |
| AI Agent Index | 334 | JSON + CSV | 2026-09-16 |
| Developer Tools Index | 1918 | JSON + CSV | 2026-09-16 |
| AI Tools Index | 693 | JSON + CSV | 2026-09-16 |
| Research Index | 5 | JSON + CSV | 2026-09-16 |
| Evidence | 5 | JSON + CSV | 2026-09-16 |
| Category Boards | 28 | JSON | 2026-09-16 |

## Products

Harpd product catalog with rank, category and verification status.

- **Format:** JSON, CSV
- **Records:** 1122
- **Schema:** `schema/product.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/data/products.json
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/products/products.json`
- CSV: `data/products/products.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.json").json()
print(len(data), "records")
```

---

## Rankings (overall)

Harpd Rank overall board — all products with rank and rank points.

- **Format:** JSON, CSV
- **Records:** 1122
- **Schema:** `schema/ranking.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/data/rank.json
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/rankings/overall.json`
- CSV: `data/rankings/overall.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/overall.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/overall.json").json()
print(len(data), "records")
```

---

## Rankings (monthly)

Live Harpd Rank board scoped to the current month window.

- **Format:** JSON, CSV
- **Records:** 1122
- **Schema:** `schema/ranking.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/rank/
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/rankings/monthly.json`
- CSV: `data/rankings/monthly.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/monthly.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/monthly.json").json()
print(len(data), "records")
```

---

## Rankings (weekly)

Live Harpd Rank board scoped to the current week window.

- **Format:** JSON, CSV
- **Records:** 1122
- **Schema:** `schema/ranking.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/rank/
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/rankings/weekly.json`
- CSV: `data/rankings/weekly.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/weekly.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/weekly.json").json()
print(len(data), "records")
```

---

## AI Market Index

Category-level AI market share and rank-point distribution.

- **Format:** JSON, CSV
- **Records:** 27
- **Schema:** `schema/research.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/data/market-index.json
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/research/ai-market-index.json`
- CSV: `data/research/ai-market-index.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-market-index.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-market-index.json").json()
print(len(data), "records")
```

---

## AI Agent Index

AI-agent products from the Harpd Product Discovery Index (category=agents).

- **Format:** JSON, CSV
- **Records:** 334
- **Schema:** `schema/research.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/discovery/
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/research/ai-agent-index.json`
- CSV: `data/research/ai-agent-index.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.json").json()
print(len(data), "records")
```

---

## Developer Tools Index

Developer-tool products from the Harpd Product Discovery Index (category=developer).

- **Format:** JSON, CSV
- **Records:** 1918
- **Schema:** `schema/research.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/discovery/
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/research/developer-tools-index.json`
- CSV: `data/research/developer-tools-index.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/developer-tools-index.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/developer-tools-index.json").json()
print(len(data), "records")
```

---

## AI Tools Index

AI-tooling products (agent + AI-media) from the Harpd Product Discovery Index.

- **Format:** JSON, CSV
- **Records:** 693
- **Schema:** `schema/research.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/discovery/
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/research/ai-tools-index.json`
- CSV: `data/research/ai-tools-index.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-tools-index.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-tools-index.json").json()
print(len(data), "records")
```

---

## Research Index

Published monthly Harpd research report families (families, URLs, listing counts).

- **Format:** JSON, CSV
- **Records:** 5
- **Schema:** `schema/research.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/research/
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/research/research.json`
- CSV: `data/research/research.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/research.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/research.json").json()
print(len(data), "records")
```

---

## Evidence

Evidence-linked claims, datasets and audit rules behind Harpd rankings.

- **Format:** JSON, CSV
- **Records:** 5
- **Schema:** `schema/evidence.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/data/evidence.json
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/evidence/evidence.json`
- CSV: `data/evidence/evidence-claims.csv`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/evidence/evidence.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/evidence/evidence.json").json()
print(len(data), "records")
```

---

## Category Boards

The 28 Harpd Rank category boards with product counts and state.

- **Format:** JSON
- **Records:** 28
- **Schema:** `schema/ranking.schema.json`
- **Update frequency:** Daily sync from harpd.com; monthly frozen snapshot release (e.g. `v2026.09`).
- **Last updated:** 2026-09-16T10:37:21.880Z
- **Source:** https://harpd.com/data/categories.json
- **License:** CC BY 4.0
- **Attribution:** Harpd (https://harpd.com)

**Files**

- JSON: `data/rankings/categories.json`

**Example**

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/categories.json
```

```python
import requests
data = requests.get("https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/categories.json").json()
print(len(data), "records")
```

---
