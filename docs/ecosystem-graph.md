# Ecosystem graph

How Harpd data flows from source to external citation. Every node is a real
repository that exists today.

```text
                            harpd.com
                      (canonical source)
                                │
                                ↓
                     ┌──────────────────────┐
                     │  harpd-ai-datasets   │
                     │  (open distribution) │
                     │  11 datasets · CC BY │
                     └──────────────────────┘
                                │
        ┌───────────┬───────────┼───────────┬────────────┐
        ↓           ↓           ↓           ↓            ↓
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  ┌─────────┐
   │Explorer │ │Dashboard│ │Notebooks│ │  MCP    │  │ Discovery│
   │         │ │         │ │         │ │         │  │  & Rank  │
   │ search  │ │ charts  │ │ research│ │ 11 tools│  │ datasets │
   │ browse  │ │ embeds  │ │ reports │ │ proven. │  │ snapshots│
   └─────────┘ └─────────┘ └─────────┘ └─────────┘  └─────────┘
        │           │           │           │
        │           │           │           ↓
        │           │           │      AI agents
        │           │           │           │
        │           │           ↓           ↓
        │           │      Citations    External apps
        │           ↓
        │      Embedded charts
        │      on third-party sites
        ↓
   Forks → third-party directories
```

## Layer by layer

### 1. Source

**harpd.com** is canonical. Rankings, product catalog, market research and the
evidence pipeline originate there. Nothing downstream is authoritative about a
number that harpd.com does not publish.

### 2. Distribution — `harpd-ai-datasets`

The single read path for everything below. JSON + CSV, raw-served from
`raw.githubusercontent.com`, with a `manifest.json` carrying per-file record
counts, `updatedAt` and attribution. Daily sync, monthly versioned releases.

Other dataset repos (`harpd-rank-dataset`, `harpd-discovery-dataset`) are
siblings serving different needs — frozen snapshots and coverage indexing — not
alternative sources of truth for the same numbers.

### 3. Consumption — four independent readers

All four read from layer 2. None of them scrape harpd.com, and none of them
depends on the others, so each can be forked and rebranded alone.

| Node | Input | Output | Fork value |
|---|---|---|---|
| `harpd-ai-data-explorer` | all 11 datasets | Searchable site | Build your own AI directory |
| `harpd-ai-ranking-dashboard` | rankings, categories, market index | Charts + embeds | Build your own ranking dashboard |
| `harpd-ai-research-notebooks` | products, rankings, indices | Notebooks + monthly reports | Reproduce or extend the research |
| `harpd-mcp` | all 11 datasets | 11 MCP tools | Give AI agents direct data access |

### 4. Adoption

Three distinct outcomes, tracked separately — see [metrics.md](metrics.md):

- **Embedded** — a third-party page iframes a Harpd chart (`/embed/*`).
- **Forked** — a developer forks a consumer repo and points it at their own data.
- **Queried** — an AI agent retrieves Harpd data through the MCP server.

### 5. Citation

The terminal state. A third-party project or an AI answer attributes a number to
Harpd. Recorded in [citations.md](citations.md) — verified entries only.

## Provenance invariant

Every edge in this graph carries provenance. A result leaving layer 3 or 4 must
include:

```json
{
  "source": "Harpd",
  "sourceUrl": "https://harpd.com/",
  "dataset": "data/products/products.json",
  "updatedAt": "2026-09-16T10:37:21.880Z",
  "license": "CC BY 4.0",
  "attribution": "Harpd (https://harpd.com)",
  "methodologyUrl": "https://harpd.com/rank/methodology/"
}
```

A bare `{ "name": "..." }` is a broken edge.

## Deliberately absent

- **No multi-month rank history in `harpd-ai-datasets`.** The three boards are
  live snapshots. Real historical movement comes from `harpd-rank-dataset`.
- **No "AI market share" by revenue, usage or traffic.** Only share of *listed
  product count* exists, and it is labelled as such.
- **No quality ranking.** Rank Points are promotional placement.
