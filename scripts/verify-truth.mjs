#!/usr/bin/env node
/**
 * DATASET_TRUTH verification gate — kills "143 vs 1,122" style drift.
 *
 * The whole point of DATASET_TRUTH is that ONE number (groundTruth.products)
 * is the only source of truth. This script independently re-derives that number
 * from the real data files and then checks that EVERY artifact which prints or
 * stores a product count agrees with it:
 *
 *   1. DATASET_TRUTH.json itself is not stale (recompute == stored groundTruth).
 *   2. data/manifest.json — every dataset.recordCount matches its file.
 *   3. data/rankings/categories.json — totalProducts == groundTruth.products.
 *   4. harpd-rank-dataset/manifest.json — products == groundTruth.products.
 *   5. overall/monthly/weekly.json — products.length == groundTruth.products.
 *   6. README / doc surfaces (documentedCounts) print exactly the truth and
 *      contain NO conflicting product-count claim (this is what catches "143").
 *
 * Any mismatch => non-zero exit, so CI / a pre-commit hook can never publish a
 * dataset where the website, API, GitHub and research disagree.
 *
 * Usage: node scripts/verify-truth.mjs
 * Zero dependencies.
 */
import { readFile } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const WS = resolve(ROOT, '..') // /Users/shankou/harpd
const readJson = async (abs) => JSON.parse(await readFile(abs, 'utf8'))
const readText = async (abs) => readFile(abs, 'utf8').catch(() => null)

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

const fatals = []
const divergences = []
const okLines = []
const fatal = (m) => { fatals.push(m); console.error(`  FAIL ${m}`) }
const diverge = (m) => { divergences.push(m); console.error(`  DIVERGE ${m}`) }
const ok = (m) => { okLines.push(m); console.log(`  ok   ${m}`) }

// Match a number (with optional thousands separators) near a product/listing context word.
// (?<!\d) is required: without it, "1122 listings" would be captured as the 3-digit
// fragment "122" (the engine starts at the 2nd digit), producing a false divergence.
const COUNT_RE = /(?<!\d)(\d{1,3}(?:,\d{3})*)\s*(?:products?|listings?|records?|件产品|rows?)\b/gi
const parseNum = (s) => Number(s.replace(/,/g, ''))
// Extract the source line that CONTAINS a regex match, using the match's real index
// (not a naive "first line containing the substring" search, which returns the wrong line).
const lineAt = (text, idx) => {
  const ls = text.lastIndexOf('\n', idx) + 1
  let le = text.indexOf('\n', idx)
  if (le === -1) le = text.length
  return text.slice(ls, le).trim()
}
// A matched count is ONLY a catalog conflict if it asserts the product catalog.
// Research coverage slices (334/693/1,918 records) and period-scoped boards
// (weekly/monthly, e.g. 980 listings) are legitimately different datasets and
// must NOT be flagged as "143 vs 1,122" drift.
const NON_CATALOG = /coverage slice|research|index|weekly|monthly|agent|developer-tools|ai-tools|slice|evidence|claims|findings|discovery/i

const main = async () => {
  const truth = await readJson(join(ROOT, 'DATASET_TRUTH.json'))
  const ground = truth.groundTruth.products

  console.log(`\nDATASET_TRUTH verification gate`)
  console.log(`  authoritative product count = ${ground}\n`)

  // 1. truth not stale
  const products = await readJson(join(ROOT, 'data/products/products.json'))
  const live = countRecords(products)
  if (live !== ground) fatal(`DATASET_TRUTH.json is STALE: file has ${live} products but groundTruth=${ground}. Run scripts/generate-truth.mjs.`)
  else ok(`groundTruth matches products.json (${live})`)

  // 2. ai-datasets manifest consistency
  const m = await readJson(join(ROOT, 'data/manifest.json'))
  for (const ds of m.datasets) {
    if (!ds.json) continue
    const obj = await readJson(join(ROOT, ds.json)).catch(() => null)
    if (!obj) continue
    const actual = countRecords(obj)
    if (actual !== ds.recordCount) {
      fatal(`manifest dataset "${ds.id}": recordCount=${ds.recordCount} but ${ds.json} has ${actual}`)
    }
  }
  ok(`data/manifest.json — all dataset recordCounts match their files`)

  // 3. categories.json totalProducts
  const cat = await readJson(join(ROOT, 'data/rankings/categories.json'))
  if (cat.totalProducts !== ground) fatal(`categories.json totalProducts=${cat.totalProducts} != groundTruth ${ground}`)
  else ok(`categories.json totalProducts=${cat.totalProducts}`)

  // 4. rank-dataset manifest
  const rm = await readJson(join(WS, 'harpd-rank-dataset/manifest.json')).catch(() => null)
  if (rm) {
    if (rm.products !== ground) fatal(`harpd-rank-dataset/manifest.json products=${rm.products} != groundTruth ${ground}`)
    else ok(`harpd-rank-dataset/manifest.json products=${rm.products}`)
  }

  // 5. ranking boards
  for (const f of ['overall', 'monthly', 'weekly']) {
    const obj = await readJson(join(ROOT, `data/rankings/${f}.json`))
    const n = countRecords(obj)
    if (n !== ground) fatal(`rankings/${f}.json has ${n} != groundTruth ${ground}`)
  }
  ok(`overall/monthly/weekly boards all = ${ground}`)

  // 6. documented count surfaces — must print truth and must NOT print a conflicting count
  const PRODUCT_WORDS = /products?|listings?|records?|件产品|rows?/i
  for (const [rel, exp] of Object.entries(truth.documentedCounts)) {
    const text = await readText(join(WS, rel))
    if (text == null) { console.warn(`  SKIP ${rel} (not found)`); continue }
    // Comma-insensitive: a doc may print "1,122" while exp is 1122 (no comma).
    const normText = text.replace(/(\d),(\d)/g, '$1$2')
    if (!normText.includes(String(exp))) fatal(`${rel} does not print expected count ${exp}`)
    let mm
    COUNT_RE.lastIndex = 0
    while ((mm = COUNT_RE.exec(text)) !== null) {
      const n = parseNum(mm[1])
      if (n !== exp) {
        // surface the line for triage
        const line = lineAt(text, mm.index).slice(0, 120)
        // Skip research/period scopes — those are different datasets by design.
        if (NON_CATALOG.test(line)) continue
        diverge(`${rel}: prints ${n} in a product-count context (truth=${exp}) — "${line}"`)
      }
    }
    if (!divergences.some((d) => d.startsWith(rel))) ok(`${rel} prints ${exp} and no conflicting count`)
  }

  // 7. explicit stale-baseline scan on planning/audit docs (catches 143, 148, etc.)
  const STALE_DOCS = ['HARPD_RANK_SCALE_10K_PLAN.md', 'D1_QUOTA_AUDIT_2026-09-16.md']
  for (const rel of STALE_DOCS) {
    const text = await readText(join(WS, rel))
    if (text == null) continue
    let mm
    COUNT_RE.lastIndex = 0
    while ((mm = COUNT_RE.exec(text)) !== null) {
      const n = parseNum(mm[1])
      if (n !== ground) {
        const line = lineAt(text, mm.index).slice(0, 120)
        // Skip research/period scopes — those are different datasets by design.
        if (NON_CATALOG.test(line)) continue
        diverge(`${rel}: product-count claim ${n} != truth ${ground} — "${line}"`)
      }
    }
  }

  console.log('')
  if (fatals.length === 0 && divergences.length === 0) {
    console.log(`  PASS — every artifact agrees with DATASET_TRUTH (${ground} products).`)
    process.exit(0)
  }
  console.error(`\n  FAILED: ${fatals.length} fatal, ${divergences.length} divergence(s).`)
  console.error(`  Fix the artifact(s) above, or regenerate DATASET_TRUTH.json, then re-run.`)
  process.exit(1)
}

main().catch((e) => { console.error(e); process.exit(1) })
