#!/usr/bin/env node
/**
 * DATASET_TRUTH generator — the single source of truth for Harpd AI Datasets.
 *
 * Why this exists
 * ---------------
 * Counts were hand-maintained in >=8 places (two manifests, categories.json,
 * three READMEs, the scale plan, research notebooks). That hand-maintenance is
 * exactly how "143" and "1,122" ended up contradicting each other. This script
 * rebuilds ONE canonical file — DATASET_TRUTH.json — by *computing* every count
 * from the real data files. Nothing here is typed by a human.
 *
 * Everything downstream (website, API, GitHub READMEs, research, schema, JSON)
 * must read its counts from DATASET_TRUTH.json, never re-hardcode them. The
 * companion scripts/verify-truth.mjs fails the build if any artifact drifts.
 *
 * Usage: node scripts/generate-truth.mjs
 * Zero dependencies.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const readJson = async (rel) => JSON.parse(await readFile(join(ROOT, rel), 'utf8'))
const sha256 = async (rel) => {
  const buf = await readFile(join(ROOT, rel))
  return createHash('sha256').update(buf).digest('hex')
}

/** Count records in a dataset file regardless of envelope shape. */
function countRecords(obj) {
  if (Array.isArray(obj)) return obj.length
  if (obj && typeof obj === 'object') {
    for (const k of ['products', 'items', 'records', 'data', 'claims', 'families']) {
      if (Array.isArray(obj[k])) return obj[k].length
    }
    if (typeof obj.categoryBoards === 'number') return obj.categoryBoards
    if (typeof obj.count === 'number') return obj.count
    if (typeof obj.totalProducts === 'number') return obj.totalProducts
  }
  return null
}

const main = async () => {
  // --- canonical inputs (the only files that are allowed to be authoritative) ---
  const products = await readJson('data/products/products.json')
  const overall = await readJson('data/rankings/overall.json')
  const monthly = await readJson('data/rankings/monthly.json')
  const weekly = await readJson('data/rankings/weekly.json')
  const categories = await readJson('data/rankings/categories.json')
  const discovery = await readJson('../harpd-discovery-dataset/coverage/discovery-index.json').catch(() => null)

  const productCount = countRecords(products)
  const categoryBoardCount = categories.categoryBoards ?? countRecords(categories)
  const discoveryTotal = discovery ? countRecords(discovery) : null
  const onRankBoard = discovery && Array.isArray(discovery.products)
    ? discovery.products.filter((p) => p.on_rank_board).length
    : null

  // --- ground truth: the ONE number every product-count surface must equal ---
  const groundTruth = {
    products: productCount,
    categories: categoryBoardCount,
    rankBoards: 3,
    discoveryTotal,
    discoveryOnRankBoard: onRankBoard,
  }

  // --- per-artifact provenance: what each derived file claims, its real count, its hash ---
  const artifactFiles = [
    'data/products/products.json',
    'data/products/products.csv',
    'data/rankings/overall.json',
    'data/rankings/overall.csv',
    'data/rankings/monthly.json',
    'data/rankings/monthly.csv',
    'data/rankings/weekly.json',
    'data/rankings/weekly.csv',
    'data/rankings/categories.json',
    'data/rankings/market-index.json',
    'data/research/ai-market-index.json',
    'data/research/ai-agent-index.json',
    'data/research/developer-tools-index.json',
    'data/research/ai-tools-index.json',
    'data/research/research.json',
    'data/evidence/evidence.json',
  ]
  const artifacts = []
  const checksums = {}
  for (const f of artifactFiles) {
    try {
      const obj = await readJson(f).catch(() => null)
      const c = obj ? countRecords(obj) : null
      checksums[f] = await sha256(f)
      artifacts.push({
        file: f,
        count: c,
        sha256: checksums[f],
        derivedFrom: f.startsWith('data/products/') || f.startsWith('data/rankings/overall')
          ? 'groundTruth.products'
          : 'canonical input',
      })
    } catch {
      /* file optional in some checkouts */
    }
  }

  const truth = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    source: 'https://harpd.com/',
    canonical: 'https://harpd.com/data/',
    license: 'CC BY 4.0',
    attribution: 'Harpd (https://harpd.com)',
    // The single authoritative number. Every product-count surface MUST equal this.
    groundTruth,
    // Files that must equal groundTruth.products (machine-checked by verify-truth.mjs).
    derivedArtifacts: [
      { file: 'data/manifest.json', field: 'datasets[].recordCount (products & rankings-*)', mustEqual: 'groundTruth.products' },
      { file: 'data/rankings/categories.json', field: 'totalProducts', mustEqual: 'groundTruth.products' },
      { file: '../harpd-rank-dataset/manifest.json', field: 'products', mustEqual: 'groundTruth.products' },
      { file: 'data/rankings/overall.json', field: 'products.length', mustEqual: 'groundTruth.products' },
      { file: 'data/rankings/monthly.json', field: 'products.length', mustEqual: 'groundTruth.products' },
      { file: 'data/rankings/weekly.json', field: 'products.length', mustEqual: 'groundTruth.products' },
    ],
    // Prose surfaces that PRINT a product count. verify-truth.mjs asserts these
    // print exactly groundTruth.products and flags any conflicting number.
    documentedCounts: {
      'harpd-ai-ranking-dashboard/README.md': productCount,
      'harpd-mcp/README.md': productCount,
      'output/readmes/harpd-ai-research-notebooks.md': productCount,
      'output/readmes/harpd-mcp.md': productCount,
    },
    artifacts,
    checksums,
    notes:
      'This file is the ONLY hand-free source of truth. Regenerate with ' +
      'scripts/generate-truth.mjs after any upstream data change. Never edit counts ' +
      'by hand in manifests, READMEs or schemas — derive them from here.',
  }

  await writeFile(join(ROOT, 'DATASET_TRUTH.json'), JSON.stringify(truth, null, 2) + '\n', 'utf8')
  console.log(`DATASET_TRUTH.json written.`)
  console.log(`  products=${groundTruth.products}  categories=${groundTruth.categories}  discoveryTotal=${groundTruth.discoveryTotal}`)
  console.log(`  on_rank_board=${groundTruth.discoveryOnRankBoard}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
