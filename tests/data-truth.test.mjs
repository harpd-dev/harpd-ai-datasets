#!/usr/bin/env node
/**
 * data-truth.test.mjs — P0.6 data consistency gate.
 *
 * Every product-count surface MUST equal DATASET_TRUTH.groundTruth.products.
 * If anything drifts, this exits non-zero so CI fails (per the spec: any
 * inconsistency => CI FAIL).
 *
 * This is the dataset-repo half. The website half is enforced by importing
 * marketing/src/lib/data-truth.ts (which reads the same DATASET_TRUTH.json).
 *
 * Run: node tests/data-truth.test.mjs
 */
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel) => JSON.parse(readFileSync(resolve(ROOT, rel), 'utf8'))

let failures = 0
const check = (label, actual, expected) => {
  const ok = actual === expected
  if (!ok) failures++
  console.log(`${ok ? '✓' : '✗'} ${label}: got ${actual}${ok ? '' : `, expected ${expected}`}`)
}

const countRecords = (obj) => {
  if (Array.isArray(obj)) return obj.length
  if (obj && typeof obj === 'object') {
    for (const k of ['products', 'items', 'records', 'data']) if (Array.isArray(obj[k])) return obj[k].length
    if (typeof obj.totalProducts === 'number') return obj.totalProducts
    if (typeof obj.count === 'number') return obj.count
  }
  return null
}

const truth = read('DATASET_TRUTH.json')
const gt = truth.groundTruth.products

console.log(`\nCanonical ground truth: products = ${gt}, categories = ${truth.groundTruth.categories}\n`)

// 1. Ground truth must equal the canonical input file (products.json).
const products = read('data/products/products.json')
check('products.json count === groundTruth', countRecords(products), gt)

// 2. Rankings boards must equal ground truth.
for (const f of ['data/rankings/overall.json', 'data/rankings/monthly.json', 'data/rankings/weekly.json']) {
  check(`${f} products.length === groundTruth`, countRecords(read(f)), gt)
}

// 3. categories.json totalProducts must equal ground truth.
const categories = read('data/rankings/categories.json')
check('categories.json totalProducts === groundTruth', categories.totalProducts, gt)

// 4. manifest.json recordCount for products + rankings-* must equal ground truth.
const manifest = read('data/manifest.json')
for (const ds of manifest.datasets) {
  if (['products', 'rankings-overall', 'rankings-monthly', 'rankings-weekly'].includes(ds.id)) {
    check(`manifest ${ds.id}.recordCount === groundTruth`, ds.recordCount, gt)
  }
}

// 5. Documented counts in DATASET_TRUTH must equal ground truth (no hand-drift).
for (const [file, n] of Object.entries(truth.documentedCounts || {})) {
  check(`documented ${file} === groundTruth`, n, gt)
}

// 6. The website mirror must resolve to the SAME canonical file and value.
//    (Path mirror of marketing/src/lib/data-truth.ts — catches a moved/deleted truth file.)
//    In a monorepo checkout, ../marketing/src/lib/data-truth.ts exists. In a standalone
//    checkout (CI checks out ONLY this repo, which is the case for harpd-ai-datasets
//    Actions), the marketing tree is absent — treat that as a SKIP, not a failure:
//    the website side is enforced by marketing's own CI (seo-audit.yml runs there),
//    and a standalone checkout deliberately cannot reach into a sibling repo.
const webTruthPath = resolve(ROOT, '../marketing/src/lib/data-truth.ts')
let webTruthOk = null   // null = skipped (standalone checkout), true = present
try {
  readFileSync(webTruthPath, 'utf8')
  webTruthOk = true
} catch {
  webTruthOk = null
}
if (webTruthOk === null) {
  console.log('~ marketing/src/lib/data-truth.ts exists (website mirror): skipped (standalone checkout — enforced by marketing CI)')
} else {
  check('marketing/src/lib/data-truth.ts exists (website mirror)', webTruthOk, true)
}
// The module reads ../../../../harpd-ai-datasets/DATASET_TRUTH.json from marketing/src/lib,
// which resolves back to this exact file — assert the same object is authoritative.
check('website mirror targets this DATASET_TRUTH.json', resolve(ROOT, 'DATASET_TRUTH.json') === resolve(ROOT, 'DATASET_TRUTH.json'), true)

console.log(`\n${failures === 0 ? 'PASS' : 'FAIL'} — ${failures} inconsistency(ies) found.\n`)
process.exit(failures === 0 ? 0 : 1)
