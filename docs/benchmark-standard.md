# Harpd Benchmark Standard

A single, enforced standard for every Harpd benchmark repository. The goal is
reproducibility: anyone who clones a Harpd benchmark repo must be able to
reproduce the published number from the published dataset, with no hidden steps.

Applies to: `llm-cost-benchmark`, `model-replacement-benchmark`,
`cost-per-successful-task` (and any future benchmark repo under `harpd-dev`).

---

## 1. Repository README standard

Every benchmark repo README **must** contain these nine sections, in order:

1. **Problem** — what decision the benchmark helps a buyer/engineer make.
2. **Method** — how the measurement is taken (sampling, prompts, harness).
3. **Dataset** — which Harpd dataset(s) it consumes, with the exact file path.
4. **Metrics** — the metric(s) defined precisely, including units.
5. **Results** — the latest published numbers, with `updatedAt` and the commit/run id.
6. **Reproduce** — copy-paste commands that regenerate the results.
7. **Limitations** — what the benchmark explicitly does **not** claim.
8. **Citation** — the BibTeX / APA block (reuse `docs/citations.md`).
9. **Harpd source** — the upstream Harpd dataset and methodology link.

## 2. `benchmark.json` (per repo)

Each benchmark repo ships a root `benchmark.json` that machines can read. Schema:

```json
{
  "name": "LLM Cost Benchmark",
  "version": "0.1.0",
  "publisher": "Harpd",
  "metric": "USD cost per 1M input+output tokens (blended list price)",
  "dataset": "harpd-ai-datasets/data/products/products.json",
  "methodology": "https://harpd.com/rank/methodology/",
  "updatedAt": "2026-09-16T00:00:00.000Z",
  "license": "CC BY 4.0",
  "source": "https://github.com/harpd-dev/llm-cost-benchmark",
  "reproducible": true
}
```

| Field | Required | Meaning |
|---|---|---|
| `name` | yes | Human-readable benchmark name |
| `version` | yes | Semver of the benchmark definition |
| `publisher` | yes | Always `Harpd` |
| `metric` | yes | The exact quantity measured, with units |
| `dataset` | yes | Path within `harpd-ai-datasets` |
| `methodology` | yes | URL to the methodology page |
| `updatedAt` | yes | ISO-8601 of the last run |
| `license` | yes | `CC BY 4.0` |
| `source` | yes | Canonical repo URL |
| `reproducible` | yes | `true` if `Reproduce` regenerates Results |

> **No fabricated results.** `benchmark.json` carries metadata only. Actual
> measurements live in the repo's `results/` directory, produced by the repo's
> own run scripts. Do not hand-write numbers into either file.

## 3. Quality gate

Every benchmark repo must include a GitHub Actions workflow that, on each push/PR:

- validates `benchmark.json` against this schema,
- checks `reproducible` is `true`,
- fails if `updatedAt` is older than the dataset it depends on,
- fails on any broken URL in README or `benchmark.json`.

## 4. Unified index

The canonical index of all Harpd benchmarks lives in
[`../benchmarks/`](../benchmarks/README.md) inside `harpd-ai-datasets`. Each
benchmark repo links back to it, and it links out to each repo.
