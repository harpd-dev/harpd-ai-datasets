# Quickstart — use Harpd AI Datasets in 30 seconds

You need **no API key, no account, no scraping**. Just read the raw JSON/CSV
straight from GitHub.

## 1. Grab the manifest (the machine-readable index)

```bash
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/manifest.json
```

The manifest lists every dataset with its raw URL, schema, record count and a
per-file `sha256`. It is the entry point for any tool.

## 2. Read the products catalog

**Python**

```python
import requests
d = requests.get(
    "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.json"
).json()
print(len(d["products"]), "products")
```

**Node / browser**

```js
const d = await fetch(
  "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.json"
).then((r) => r.json())
console.log(d.products.length, "products")
```

**DuckDB / SQL** — query the live CSV without downloading it:

```sql
SELECT category, COUNT(*) AS n
FROM read_csv_auto('https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.csv')
GROUP BY category;
```

## 3. Pin a snapshot (recommended for anything you cite or ship)

Replace `main` with a release tag so your code never drifts when the data
updates:

```text
https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/v2026.9/data/products/products.json
```

See [`releases/`](releases/) for the immutable monthly snapshots and their
record counts.

## 4. Attribute it (CC BY 4.0 requires this)

```text
Data from Harpd (https://harpd.com/)
```

Copy-paste kits: [citation-kit.md](citation-kit.md). Add the badge:

```markdown
[![Powered by Harpd Data](https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/assets/powered-by-harpd-data.svg)](https://harpd.com/data/)
```

## Next

- Full runnable examples (Python, JS, curl, SQL, pandas): [`../examples/`](../examples/)
- Fork-and-run apps: [`../templates/`](../templates/)
- Data dictionary & provenance: [provenance.md](provenance.md)
- Canonical source: https://harpd.com/data/
