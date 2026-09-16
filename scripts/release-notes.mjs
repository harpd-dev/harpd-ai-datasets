#!/usr/bin/env node
/**
 * Print a DATA SNAPSHOT release body from manifest.json.
 * Usage: node scripts/release-notes.mjs  (stdout = markdown)
 */
import { readFileSync } from 'node:fs'

const m = JSON.parse(readFileSync('data/manifest.json', 'utf8'))
const total = m.datasets.reduce((a, d) => a + (d.recordCount || 0), 0)

const rows = m.datasets
  .map((d) => `| ${d.name} | ${d.recordCount ?? 0} | ${d.json} | ${d.sourceUrl} |`)
  .join('\n')

const body = `## Harpd AI Datasets — Data Snapshot ${m.version}

A frozen snapshot of Harpd's open AI data. Canonical source: **https://harpd.com/data/**.
License: **CC BY 4.0** (attribution required).

### Datasets (${m.datasets.length}, ${total} total records)

| Dataset | Records | Raw file | Source |
|---|---:|---|---|
${rows}

### Methodology

- Core datasets are mirrored verbatim from public harpd.com endpoints.
- \`ai-agent\`, \`developer-tools\`, \`ai-tools\` indices are real subsets of the
  Harpd Product Discovery Index, sliced by product category (see each file's
  \`meta.sliceDefinition\`).
- Monthly / weekly rankings are the live board scoped to the real period window.

### Quality

Validated by \`scripts/validate.mjs\` (JSON/CSV/schema/unique-IDs/timestamps/
manifest consistency/attribution). Bad data is never published.

### Citation

\`\`\`bibtex
@dataset{harpd_ai_datasets_${m.version.replace('.', '_')},
  author = {Harpd},
  title = {Harpd AI Datasets},
  year = {${new Date().getUTCFullYear()}},
  publisher = {Harpd},
  url = {https://harpd.com/data/},
  license = {CC BY 4.0}
}
\`\`\`

Attribution: *Data from Harpd (https://harpd.com/)*

Generated ${m.updatedAt}.
`

process.stdout.write(body)
