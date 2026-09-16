# Data provenance

Every byte in this repository is traceable to its origin. This document is the
contract for that.

## The one authoritative count

All product counts derive from a single file:
[`DATASET_TRUTH.json`](../DATASET_TRUTH.json). `scripts/generate-truth.mjs`
recomputes it from the raw dataset files on every sync; `scripts/verify-truth.mjs`
fails CI if any artifact here disagrees with it. There is exactly one source of
truth — never hand-edit a count in a README or doc.

Current canonical: **1,122 products / 28 category boards**.

## Per-file provenance

Two layers:

1. **Repository manifest** — [`data/manifest.json`](../data/manifest.json) records,
   per dataset and per raw file:
   - `sourceUrl` — the harpd.com endpoint it was mirrored from
   - `recordCount` — number of records
   - `license` / `attribution` — CC BY 4.0, attributed to Harpd
   - `canonicalUrl` / `citationUrl` — https://harpd.com/data/
   - `updatedAt` — ISO timestamp
   - `files[].sha256` — content hash of every raw file

2. **In-file metadata** — every `data/*.json` embeds `source`, `sourceUrl`,
   `license` and `attribution` so attribution travels with the data, even when a
   file is copied out of context.

## How data flows

```text
harpd.com (canonical) → daily GitHub Action sync → this repo (mirrored) → your app
```

The three research indices (`ai-agent`, `developer-tools`, `ai-tools`) are real
subsets of the Harpd Product Discovery Index, sliced by category. The slice is
recorded in each file's `meta.sliceDefinition` — they are not invented rows.

## Immutability

For citations and reproducible research, pin a [release tag](releases/) (e.g.
`v2026.9`). Each monthly snapshot freezes the record counts and methodology at a
point in time.
