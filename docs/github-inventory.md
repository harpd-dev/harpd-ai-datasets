# Harpd GitHub Organization — Inventory Audit

> **Audit date:** 2026-09-16 · **Source of truth:** GitHub REST API (`gh api users/harpd-dev/repos`), not assumptions.
> **Owner:** `harpd-dev` (personal account, not a separate GitHub Organization).
> **Public repos audited:** 23

## Summary

Harpd maintains **two coherent product families** under `harpd-dev`:

1. **Open AI Data + Research + Benchmark + Tools + MCP** (the authority-engineering target of this plan).
2. **Agent-payment / x402 SDK tooling** (`@harpd/*` SDKs, schemas, examples) — a mature, MIT-licensed developer toolkit for AI agents that pay via x402 on Base.

Both families share the Harpd brand but serve different audiences. This audit covers all 23 repos; the authority plan (P0–P18) focuses on family #1.

**Aggregate:** 51 stars · 2 forks across 23 repos.
**CI present:** 12/23 · **GitHub Releases:** 0/23 (release cadence in P8 is not yet implemented).

## Classification (unified taxonomy)

| Class | Repos |
|---|---|
| DATA | `harpd-ai-datasets`, `harpd-discovery-dataset`, `harpd-rank-dataset` |
| RESEARCH | `harpd-ai-research-notebooks` |
| BENCHMARKS | `ai-agent-cost-calculator`, `cost-per-successful-task`, `llm-cost-benchmark`, `model-replacement-benchmark` |
| INFRASTRUCTURE | `agent-budget-policy`, `agent-budget-policy-go`, `agent-transaction-audit-schema`, `observe`, `observe-py`, `x402-logging-middleware` |
| TOOLS | `harpd-ai-data-explorer`, `harpd-ai-ranking-dashboard` |
| AGENTS | `agent-market`, `example-agent`, `harpd-mcp`, `mcp-paid-tool-example`, `mcp-paid-tool-starter`, `x402-worker-starter` |
| ORG PROFILE | `.github` |

## Per-repository inventory

| Repository | Class | Stars | Forks | Lang | License | CI | Release | Last push | README |
|---|---|---:|---:|---|---|---|---|---|---|
| `.github` | ORG PROFILE | 2 | 0 | — | — | — | — | 2026-09-16 | ✓ |
| `agent-budget-policy` | INFRASTRUCTURE | 4 | 0 | JavaScript | MIT | ✓ | — | 2026-09-03 | ✓ |
| `agent-budget-policy-go` | INFRASTRUCTURE | 2 | 0 | Go | MIT | ✓ | — | 2026-09-03 | ✓ |
| `agent-market` | AGENTS | 2 | 0 | TypeScript | MIT | — | — | 2026-09-03 | ✓ |
| `agent-transaction-audit-schema` | INFRASTRUCTURE | 4 | 1 | JavaScript | MIT | — | — | 2026-08-31 | ✓ |
| `ai-agent-cost-calculator` | BENCHMARKS | 2 | 0 | JavaScript | MIT | — | — | 2026-08-31 | ✓ |
| `cost-per-successful-task` | BENCHMARKS | 2 | 0 | JavaScript | MIT | — | — | 2026-08-31 | ✓ |
| `example-agent` | AGENTS | 2 | 0 | JavaScript | MIT | ✓ | — | 2026-09-03 | ✓ |
| `harpd-ai-data-explorer` | TOOLS | 1 | 0 | TypeScript | NOASSERTION | ✓ | — | 2026-09-16 | ✓ |
| `harpd-ai-datasets` | DATA | 1 | 0 | JavaScript | NOASSERTION | ✓ | — | 2026-09-16 | ✓ |
| `harpd-ai-ranking-dashboard` | TOOLS | 1 | 0 | TypeScript | NOASSERTION | ✓ | — | 2026-09-16 | ✓ |
| `harpd-ai-research-notebooks` | RESEARCH | 1 | 0 | Jupyter Notebook | NOASSERTION | ✓ | — | 2026-09-16 | ✓ |
| `harpd-discovery-dataset` | DATA | 1 | 0 | JavaScript | NOASSERTION | ✓ | — | 2026-09-16 | ✓ |
| `harpd-mcp` | AGENTS | 1 | 0 | TypeScript | NOASSERTION | ✓ | — | 2026-09-16 | ✓ |
| `harpd-rank-dataset` | DATA | 1 | 0 | JavaScript | NOASSERTION | ✓ | — | 2026-09-16 | ✓ |
| `llm-cost-benchmark` | BENCHMARKS | 4 | 0 | JavaScript | MIT | — | — | 2026-09-05 | ✓ |
| `mcp-paid-tool-example` | AGENTS | 2 | 0 | JavaScript | MIT | ✓ | — | 2026-09-03 | ✓ |
| `mcp-paid-tool-starter` | AGENTS | 4 | 0 | JavaScript | MIT | — | — | 2026-09-03 | ✓ |
| `model-replacement-benchmark` | BENCHMARKS | 2 | 0 | JavaScript | MIT | — | — | 2026-08-31 | ✓ |
| `observe` | INFRASTRUCTURE | 4 | 0 | JavaScript | MIT | — | — | 2026-08-31 | ✓ |
| `observe-py` | INFRASTRUCTURE | 2 | 0 | Python | MIT | ✓ | — | 2026-09-03 | ✓ |
| `x402-logging-middleware` | INFRASTRUCTURE | 4 | 1 | JavaScript | MIT | — | — | 2026-09-03 | ✓ |
| `x402-worker-starter` | AGENTS | 2 | 0 | TypeScript | MIT | — | — | 2026-09-03 | ✓ |

## Detailed entries

### `.github`

- **Class:** ORG PROFILE
- **Description:** Harpd — independent AI product discovery and ranking intelligence platform (harpd.com): rankings, research, open datasets, benchmarks and evidence. Org profile for Harpd's open data and agent-payment tooling.
- **Topics:** (none)
- **Stars / Forks:** 2 / 0
- **Language:** — · **License:** —
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-08-31 · **Last push:** 2026-09-16
- **Dataset dependency:** none (independent)
- **Homepage:** https://harpd.com/

### `agent-budget-policy`

- **Class:** INFRASTRUCTURE
- **Description:** Local, synchronous budget control SDK for agent payments. Declare per-call/agent/endpoint/tool caps and evaluate them before a payment is sent. Maintained by Harpd (harpd.com).
- **Topics:** agent-payments, ai-agents, budget-control, nodejs, sdk, usdc, x402
- **Stars / Forks:** 4 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-07-29 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** https://harpd.com/products/spend-control/

### `agent-budget-policy-go`

- **Class:** INFRASTRUCTURE
- **Description:** Local, synchronous budget control SDK for agent payments, in Go. Declare per-call/agent/endpoint/tool caps and evaluate them before a payment is sent. Maintained by Harpd (harpd.com).
- **Topics:** agent-payments, ai-agents, budget-control, go, golang, sdk, x402
- **Stars / Forks:** 2 / 0
- **Language:** Go · **License:** MIT
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-03 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** —

### `agent-market`

- **Class:** AGENTS
- **Description:** Build paid APIs that AI agents can discover and buy via x402 on Base. Generic server-side x402 payment gate, machine-discovery catalog & OpenAPI generator. MIT.
- **Topics:** agent-commerce, ai-agents, base, cloudflare-workers, payments, typescript, usdc, x402
- **Stars / Forks:** 2 / 0
- **Language:** TypeScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-09-03 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** https://harpd.com/docs/agent-market

### `agent-transaction-audit-schema`

- **Class:** INFRASTRUCTURE
- **Description:** Canonical, protocol-agnostic audit record for agent payments. Normalizes x402/MPP/AP2 into one schema and validates it. Maintained by Harpd (harpd.com).
- **Topics:** agent-payments, ai-agents, audit-schema, base-network, usdc, x402
- **Stars / Forks:** 4 / 1
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-07-29 · **Last push:** 2026-08-31
- **Dataset dependency:** none (independent)
- **Related repositories:** observe, agent-budget-policy, x402-logging-middleware
- **Homepage:** https://harpd.com

### `ai-agent-cost-calculator`

- **Class:** BENCHMARKS
- **Description:** Estimate the monthly bill of an autonomous AI agent that makes thousands of paid calls, and see which model runs for less. From Harpd (harpd.com).
- **Topics:** ai-agents, ai-cost, calculator, cost-estimation, llm-cost
- **Stars / Forks:** 2 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-08-18 · **Last push:** 2026-08-31
- **Dataset dependency:** none (independent)
- **Homepage:** https://harpd.com/ai-agent-cost-calculator/

### `cost-per-successful-task`

- **Class:** BENCHMARKS
- **Description:** The metric production AI systems actually pay against: cost per successful task = cost per call / success rate. From Harpd (harpd.com).
- **Topics:** ai-agents, ai-cost, cost-per-successful-task, llm, metrics, unit-economics
- **Stars / Forks:** 2 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-08-18 · **Last push:** 2026-08-31
- **Dataset dependency:** none (independent)
- **Related repositories:** llm-cost-benchmark, model-replacement-benchmark
- **Homepage:** https://harpd.com/cost-per-successful-task/

### `example-agent`

- **Class:** AGENTS
- **Description:** Runnable example AI agent that pays an x402 seller using the Harpd SDK family: local budget policy, lifecycle observability, and canonical audit records. Zero-key, fully offline.
- **Topics:** agent-commerce, agent-payments, ai-agents, base, example, tutorial, usdc, x402, harpd
- **Stars / Forks:** 2 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-03 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** —

### `harpd-ai-data-explorer`

- **Class:** TOOLS
- **Description:** Fork-first explorer for Harpd open AI data — search 1,100+ AI products, 28 category boards, AI agents, AI tools, developer tools, research and evidence. Reads raw.githubusercontent.com, no API key.
- **Topics:** ai, ai-agents, ai-products, ai-tools, dataset, directory, explorer, nextjs, open-data, ranking
- **Stars / Forks:** 1 / 0
- **Language:** TypeScript · **License:** NOASSERTION
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-16 · **Last push:** 2026-09-16
- **Dataset dependency:** harpd-ai-datasets (reads raw.githubusercontent.com)
- **Homepage:** https://harpd.com/data/

### `harpd-ai-datasets`

- **Class:** DATA
- **Description:** Open AI product rankings, research datasets, evidence and market data from Harpd.
- **Topics:** ai, ai-agents, ai-directory, ai-products, ai-tools, artificial-intelligence, dataset, machine-learning, open-data, ranking, research
- **Stars / Forks:** 1 / 0
- **Language:** JavaScript · **License:** NOASSERTION
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-16 · **Last push:** 2026-09-16
- **Dataset dependency:** none (independent)
- **Related repositories:** harpd-ai-data-explorer, harpd-mcp, harpd-ai-ranking-dashboard, harpd-ai-research-notebooks
- **Homepage:** https://harpd.com/data/

### `harpd-ai-ranking-dashboard`

- **Class:** TOOLS
- **Description:** Forkable ranking dashboard for Harpd open AI ranking data — overall/monthly/weekly/category views, provenance on every chart, embeddable iframes and JSON/CSV export.
- **Topics:** ai, charts, dashboard, dataset, embeddable, open-data, ranking, react, recharts
- **Stars / Forks:** 1 / 0
- **Language:** TypeScript · **License:** NOASSERTION
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-16 · **Last push:** 2026-09-16
- **Dataset dependency:** harpd-ai-datasets
- **Homepage:** https://harpd.com/data/

### `harpd-ai-research-notebooks`

- **Class:** RESEARCH
- **Description:** Reproducible Jupyter notebooks computing AI market, ranking, agent and tooling research from Harpd's public open datasets — every number derived from real data, never authored by hand.
- **Topics:** ai, ai-agents, data-analysis, dataset, jupyter-notebooks, open-data, pandas, reproducible-research, research
- **Stars / Forks:** 1 / 0
- **Language:** Jupyter Notebook · **License:** NOASSERTION
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-16 · **Last push:** 2026-09-16
- **Dataset dependency:** harpd-ai-datasets
- **Homepage:** https://harpd.com/data/

### `harpd-discovery-dataset`

- **Class:** DATA
- **Description:** Harpd Product Discovery Index — non-sponsored CC BY 4.0 coverage dataset of 8,600+ software/AI/developer products discovered on public launch & directory boards. Not a ranking.
- **Topics:** ai, ai-tools, cc-by-4-0, dataset, open-data, product-discovery, software-directory
- **Stars / Forks:** 1 / 0
- **Language:** JavaScript · **License:** NOASSERTION
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-09 · **Last push:** 2026-09-16
- **Dataset dependency:** none (independent)
- **Related repositories:** harpd-ai-datasets, harpd-ai-research-notebooks
- **Homepage:** https://harpd.com/data/

### `harpd-mcp`

- **Class:** AGENTS
- **Description:** MCP server exposing Harpd's open AI datasets to AI agents — products, rankings, categories, agents, tools, research and evidence, every result with mandatory provenance.
- **Topics:** ai, ai-agents, ai-tools, dataset, llm, mcp, model-context-protocol, open-data, typescript
- **Stars / Forks:** 1 / 0
- **Language:** TypeScript · **License:** NOASSERTION
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-16 · **Last push:** 2026-09-16
- **Dataset dependency:** harpd-ai-datasets / harpd-rank-dataset / harpd-discovery-dataset
- **Related repositories:** harpd-ai-datasets, harpd-ai-data-explorer
- **Homepage:** https://harpd.com/data/

### `harpd-rank-dataset`

- **Class:** DATA
- **Description:** Open, citable dataset of AI products and their Harpd Rank positions — 89 products, 28 category boards, frozen monthly snapshots with checksums, CC BY 4.0. From Harpd (harpd.com).
- **Topics:** ai-tools, cc-by-4-0, dataset, geo, leaderboard, open-data, rankings
- **Stars / Forks:** 1 / 0
- **Language:** JavaScript · **License:** NOASSERTION
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-06 · **Last push:** 2026-09-16
- **Dataset dependency:** none (independent)
- **Related repositories:** harpd-ai-datasets, harpd-ai-ranking-dashboard
- **Homepage:** https://harpd.com/data/

### `llm-cost-benchmark`

- **Class:** BENCHMARKS
- **Description:** Public, reproducible LLM cost benchmarks from Harpd (harpd.com) — ranked by cost per successful task, not per-call price.
- **Topics:** ai-agents, ai-cost, benchmark, cost-analysis, llm, cost-per-successful-task
- **Stars / Forks:** 4 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-08-18 · **Last push:** 2026-09-05
- **Dataset dependency:** none (independent)
- **Related repositories:** cost-per-successful-task, model-replacement-benchmark
- **Homepage:** https://harpd.com/benchmarks/

### `mcp-paid-tool-example`

- **Class:** AGENTS
- **Description:** Runnable MCP server with a free tool and a $0.01 paid tool, gated by @harpd/mcp-paid-tool-starter. Works with Claude Desktop; tested over real stdio.
- **Topics:** agent-payments, ai-agents, claude, harpd, mcp, model-context-protocol, paid-tools, x402
- **Stars / Forks:** 2 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-03 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** —

### `mcp-paid-tool-starter`

- **Class:** AGENTS
- **Description:** Starter SDK for building MCP tools that require payment before they run. definePaidTool + enforcePayment + runPaidTool. Maintained by Harpd (harpd.com).
- **Topics:** agent-payments, ai-agents, mcp, model-context-protocol, sdk, starter-kit, x402
- **Stars / Forks:** 4 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-07-29 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** https://harpd.com

### `model-replacement-benchmark`

- **Class:** BENCHMARKS
- **Description:** Decide whether a cheaper model can safely replace your current one on your tasks — measured by cost per successful task. From Harpd (harpd.com).
- **Topics:** ai-cost, benchmark, cost-per-successful-task, llm, model-evaluation, model-switching
- **Stars / Forks:** 2 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-08-18 · **Last push:** 2026-08-31
- **Dataset dependency:** none (independent)
- **Related repositories:** llm-cost-benchmark, cost-per-successful-task
- **Homepage:** https://harpd.com/modelswitch/

### `observe`

- **Class:** INFRASTRUCTURE
- **Description:** Harpd x402 V2 observability + budget-control SDK for agent payments — the 4 lifecycle hooks, above any Facilitator. Maintained by Harpd (harpd.com).
- **Topics:** agent-payments, ai-agents, base-network, nodejs, observability, sdk, usdc, x402
- **Stars / Forks:** 4 / 0
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-07-24 · **Last push:** 2026-08-31
- **Dataset dependency:** none (independent)
- **Related repositories:** agent-budget-policy, agent-transaction-audit-schema, x402-logging-middleware
- **Homepage:** https://harpd.com/products/spend-control/

### `observe-py`

- **Class:** INFRASTRUCTURE
- **Description:** Observability and local budget control for x402 AI-agent payments — Python port of @harpd/observe.
- **Topics:** agent-payments, ai-agents, base, budget-control, observability, payments, python, usdc, web3, x402
- **Stars / Forks:** 2 / 0
- **Language:** Python · **License:** MIT
- **README:** present · **CI:** present · **Release:** none
- **Created:** 2026-09-03 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** —

### `x402-logging-middleware`

- **Class:** INFRASTRUCTURE
- **Description:** Drop-in x402 payment logging middleware for Node HTTP / Express. Structured, audit-friendly logs for every x402 interaction. Maintained by Harpd (harpd.com).
- **Topics:** agent-payments, express, logging, middleware, nodejs, usdc, x402
- **Stars / Forks:** 4 / 1
- **Language:** JavaScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-07-29 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** https://harpd.com

### `x402-worker-starter`

- **Class:** AGENTS
- **Description:** Deploy-ready Cloudflare Worker that charges AI agents for API access via x402 on Base. Built on @harpd/agent-market. MIT.
- **Topics:** agent-commerce, ai-agents, base, cloudflare-workers, starter-template, usdc, x402
- **Stars / Forks:** 2 / 0
- **Language:** TypeScript · **License:** MIT
- **README:** present · **CI:** absent · **Release:** none
- **Created:** 2026-09-03 · **Last push:** 2026-09-03
- **Dataset dependency:** none (independent)
- **Homepage:** https://github.com/harpd-dev/agent-market

## Highest-value existing repos (priority order)

Per the plan's P0→P2 sequencing, the repos to lead with:

1. **`harpd-ai-datasets`** — the canonical data layer. Already has manifest, schema validation (passes, 7,498 records, 0 fatal), examples, templates, badge, CITATION.cff. *Gap: `docs/catalog.md` was missing — now generated from the manifest.*
2. **`harpd-ai-data-explorer`** — flagship browse tool. Next.js, build passes, 16 tests pass, all required routes present (`/products`,`/rankings`,`/categories`,`/agents`,`/tools`,`/research`,`/evidence`, product detail, `/search`, `/developer-tools`).
3. **`harpd-mcp`** — MCP server exposing the datasets to AI agents with mandatory provenance. Build/test status to be verified separately.
4. **`harpd-rank-dataset` + `harpd-discovery-dataset`** — versioned, checksummed data mirrors (the citable snapshots).
5. **`llm-cost-benchmark` / `model-replacement-benchmark` / `cost-per-successful-task`** — the benchmark family; candidates for the `harpd-benchmarks` umbrella (P3).

## Findings & blockers

- **No GitHub Organization exists** — repos live under the `harpd-dev` user account. The plan's "Organization README" is implemented as the `.github` profile repo, which is already comprehensive and compliant (answers What/Data/Where/MCP).
- **No GitHub Releases** on any repo — P8 (release cadence) is not implemented. Dataset README references `v2026.09` snapshots that are not yet published as Releases.
- **Most plan targets already exist** and are in good shape (org profile, datasets layer, explorer, MCP, dashboards, research notebooks, benchmarks). The remaining work is normalization, gap-filling (`catalog.md`), release engineering, and driving real external adoption (P6) — not building from scratch.
- **License display:** data/research repos show `NOASSERTION` because they use CC BY 4.0 (not a GitHub-detected SPDX id). This is correct, not a defect.
- **External adoption (P6):** no verified third-party projects yet — `docs/adoption.md` correctly tracks only real usage; do not fabricate.

## Verification performed this audit

- `harpd-ai-datasets`: ran `node scripts/validate.mjs` → **QUALITY GATE PASSED, 0 fatal, 0 warning**, 7,498 total records.
- `harpd-ai-data-explorer`: ran `npm test` → **16 passed, 0 failed**; ran `npm run build` → **build succeeded** with all required routes.
- All 23 repo metadata fields read live from the GitHub API.
