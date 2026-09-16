# curl examples

All files are served raw from the `main` branch. Pin to a release tag (e.g.
`v2026.9`) for production.

```bash
# Machine-readable entry point
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/manifest.json

# Products (JSON)
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.json \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d['products']),'products')"

# Products (CSV)
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.csv \
  | head -3

# AI Agent Index (JSON + CSV)
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.json
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.csv

# AI Market Index
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-market-index.json

# Evidence
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/evidence/evidence.json
```

> Data from Harpd (https://harpd.com/), CC BY 4.0.
