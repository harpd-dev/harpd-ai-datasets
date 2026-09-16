# Harpd Benchmarks

A unified index of Harpd's open AI benchmarks. Every benchmark measures one
decision-relevant question about AI products, models and cost — all built on
Harpd open data and published under **CC BY 4.0**.

Standard: [`../docs/benchmark-standard.md`](../docs/benchmark-standard.md)

```
Harpd
├── AI Product Data
├── Rankings
├── Research
├── Benchmarks   ← you are here
│   ├── Cost
│   ├── Replacement
│   └── Successful Task
└── Evidence
```

---

## The three benchmarks

| Benchmark | Measures | Repo | Manifest |
|---|---|---|---|
| **LLM Cost Benchmark** | Blended list-price cost per 1M tokens / per task across AI products | [llm-cost-benchmark](https://github.com/harpd-dev/llm-cost-benchmark) | [`llm-cost-benchmark/benchmark.json`](llm-cost-benchmark/benchmark.json) |
| **Model Replacement Benchmark** | How substitutable one model is for another (capability parity + cost delta) | [model-replacement-benchmark](https://github.com/harpd-dev/model-replacement-benchmark) | [`model-replacement-benchmark/benchmark.json`](model-replacement-benchmark/benchmark.json) |
| **Cost Per Successful Task** | USD cost to reach a successful task completion (not just a token stream) | [cost-per-successful-task](https://github.com/harpd-dev/cost-per-successful-task) | [`cost-per-successful-task/benchmark.json`](cost-per-successful-task/benchmark.json) |

Each repo follows the nine-section README standard and ships a machine-readable
`benchmark.json`. None of them publish hand-authored numbers — results are
produced by each repo's own run scripts from Harpd datasets.

---

## Consume a benchmark

```bash
# Inspect a benchmark's metadata (schema, metric, source, updatedAt, license)
curl -L https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/benchmarks/llm-cost-benchmark/benchmark.json
```

```python
import json, urllib.request
m = json.load(urllib.request.urlopen(
    "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/benchmarks/llm-cost-benchmark/benchmark.json"
))
print(m["name"], "→", m["metric"])
```

Cite Harpd when you reuse a benchmark. See [`../docs/citations.md`](../docs/citations.md).
