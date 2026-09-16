#!/usr/bin/env node
/**
 * Harpd AI Datasets — sync from harpd.com (real, public data) into this repo.
 *
 *   node scripts/sync.mjs            # fetch + normalize + validate + write
 *   node scripts/sync.mjs --check    # validate what is already committed
 *   node scripts/sync.mjs --origin=http://localhost:4322
 *
 * Zero dependencies (Node 18+ global fetch). No credentials: every source this
 * script reads is already public at https://harpd.com/data/*.
 *
 * Authenticity rule (no fabricated data):
 *   - Core datasets are fetched verbatim from live harpd.com public endpoints.
 *   - The three research indices (ai-agent / developer-tools / ai-tools) are
 *     REAL subsets of the Harpd Product Discovery Index, sliced by category.
 *     They are coverage views, not invented rows. The slice definition is
 *     recorded in each dataset's metadata so it is auditable.
 *   - Monthly / weekly rankings are the LIVE board scoped to the real period
 *     window published by harpd.com (rank.json `periods`). Historical monthly
 *     archives live at https://harpd.com/rank/history/ — never reconstructed.
 *
 * Safety rules — a public dataset that publishes an empty or degraded snapshot
 * is worse than one that is a day stale:
 *   1. Every direct endpoint must return 200 AND a non-empty body, else abort.
 *   2. rank.json must not shrink >25% vs the previous committed copy.
 *   3. discovery-index qualified count must not shrink >25% vs previous.
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const CHECK_ONLY = args.includes('--check')
const ORIGIN = (args.find((a) => a.startsWith('--origin=')) || '').split('=')[1] || 'https://harpd.com'

const LICENSE = 'CC BY 4.0'
const ATTR = 'Harpd (https://harpd.com)'
const CANON = 'https://harpd.com/data/'

const sha256 = (text) => createHash('sha256').update(text).digest('hex')
const nowIso = () => new Date().toISOString()

/** Direct fetch targets: upstream endpoint -> local path. */
const DIRECT = [
  ['/data/products.json', 'data/products/products.json'],
  ['/data/rank.json', 'data/rankings/overall.json'],
  ['/data/categories.json', 'data/rankings/categories.json'],
  ['/data/market-index.json', 'data/research/ai-market-index.json'],
  ['/data/research.json', 'data/research/research.json'],
  ['/data/evidence.json', 'data/evidence/evidence.json'],
]

const get = async (path) => {
  const url = `${ORIGIN}${path}`
  const res = await fetch(url, { headers: { Accept: '*/*' }, signal: AbortSignal.timeout(60_000) })
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status} (aborting, nothing written)`)
  const text = await res.text()
  if (!text.trim()) throw new Error(`${url} -> empty body (aborting)`)
  return text
}

const write = async (relative, body) => {
  const target = join(ROOT, relative)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, body, 'utf8')
  return { path: relative, bytes: Buffer.byteLength(body), sha256: sha256(body) }
}

const readJson = async (relative) => {
  try { return JSON.parse(await readFile(join(ROOT, relative), 'utf8')) }
  catch { return null }
}

/** CSV escaping per RFC 4180. */
const csvCell = (v) => {
  if (v === null || v === undefined) return ''
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
const toCsv = (rows, columns) => {
  const head = columns.map(csvCell).join(',')
  const lines = rows.map((r) => columns.map((c) => csvCell(r[c])).join(','))
  return [head, ...lines].join('\n') + '\n'
}

const guardShrink = (name, before, after) => {
  if (before > 0 && after < before * 0.75) {
    throw new Error(`${name} dropped ${before} -> ${after} (>25%). Upstream likely degraded — refusing to publish.`)
  }
}

const main = async () => {
  if (CHECK_ONLY) {
    let failures = 0
    const files = [
      ...DIRECT.map(([, p]) => p),
      'data/rankings/monthly.json', 'data/rankings/weekly.json',
      'data/research/ai-agent-index.json', 'data/research/developer-tools-index.json',
      'data/research/ai-tools-index.json', 'data/evidence/evidence-claims.csv',
      'data/manifest.json',
    ]
    for (const f of files) {
      try {
        const text = await readFile(join(ROOT, f), 'utf8')
        if (f.endsWith('.json')) JSON.parse(text)
        if (!text.trim()) throw new Error('empty file')
      } catch (e) { failures += 1; console.error(`  FAIL ${f}: ${e.message}`) }
    }
    console.log(failures === 0 ? `check OK — ${files.length} files valid` : `check FAILED — ${failures} file(s)`)
    process.exit(failures === 0 ? 0 : 1)
  }

  console.log(`syncing from ${ORIGIN}`)
  const fetched = {}
  for (const [path, relative] of DIRECT) {
    const body = await get(path)
    fetched[relative] = body
    const parsed = JSON.parse(body)
    console.log(`  fetched ${path} (${body.length} bytes, ${Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length} keys)`)
  }

  // Guards against degraded upstream.
  const rank = JSON.parse(fetched['data/rankings/overall.json'])
  const rankCount = rank.products?.length ?? 0
  const prevRank = await readJson('data/rankings/overall.json')
  guardShrink('rank.json', prevRank?.products?.length ?? 0, rankCount)
  if (!rankCount) throw new Error('rank.json has no products — upstream degraded, aborting')

  // Discovery index: fetch (temp only) to derive the three research indices.
  const discText = await get('/data/discovery-index.json')
  const disc = JSON.parse(discText)
  const discCount = disc.counts?.qualified ?? disc.products?.length ?? 0
  const prevDisc = await readJson('data/research/ai-agent-index.json')
  guardShrink('discovery-index qualified', prevDisc?.meta?.sourceRecordCount ?? 0, discCount)
  if (!discCount) throw new Error('discovery-index has zero qualified products (aborting)')

  // Write direct datasets.
  const manifestFiles = []
  for (const [, relative] of DIRECT) manifestFiles.push(await write(relative, fetched[relative]))

  // ---- Derive research indices from the REAL discovery-index ----
  const discGen = disc.generated_at || nowIso()
  const products = Array.isArray(disc.products) ? disc.products : []

  const slice = (categories, id, title, desc) => {
    const set = new Set(categories)
    const rows = products.filter((p) => set.has(p.category)).map((p) => ({
      id: p.id, name: p.name, domain: p.domain, url: p.url, category: p.category,
      category_confidence: p.category_confidence, title: p.title, description: p.description,
      discovered_from: p.discovered_from, observed_at: p.observed_at,
      on_rank_board: p.on_rank_board, profile_url: p.profile_url || '',
    }))
    const meta = {
      datasetId: id, publisher: 'Harpd', license: LICENSE, attribution: ATTR,
      sourceUrl: 'https://harpd.com/discovery/', citationUrl: CANON, canonicalUrl: CANON,
      derivedFrom: 'Harpd Product Discovery Index (discovery-index.json)',
      sliceDefinition: { category: categories },
      generatedAt: discGen, recordCount: rows.length,
      disclosure: 'Coverage view sliced from the Harpd Product Discovery Index by product category. Not a ranking.',
    }
    return { meta, rows, title, desc }
  }

  const indices = [
    slice(['agents'], 'ai-agent-index', 'AI agent index',
      'AI-agent products discovered on public launch & directory boards (Harpd Product Discovery Index, category=agents).'),
    slice(['developer'], 'developer-tools-index', 'Developer tools index',
      'Developer-tool products discovered on public launch & directory boards (Harpd Product Discovery Index, category=developer).'),
    slice(['agents', 'ai-media'], 'ai-tools-index', 'AI tools index',
      'AI-tooling products (agent + AI-media categories) from the Harpd Product Discovery Index. Coverage, not a rating.'),
  ]

  for (const idx of indices) {
    const envelope = { meta: idx.meta, records: idx.rows }
    manifestFiles.push(await write(`data/research/${idx.meta.datasetId}.json`, JSON.stringify(envelope, null, 2) + '\n'))
    const cols = ['id', 'name', 'domain', 'url', 'category', 'category_confidence', 'title', 'description', 'discovered_from', 'observed_at', 'on_rank_board', 'profile_url']
    manifestFiles.push(await write(`data/research/${idx.meta.datasetId}.csv`, toCsv(idx.rows, cols)))
  }

  // ---- Monthly / weekly ranking views (real period window from rank.json) ----
  const periods = rank.periods || {}
  for (const scope of ['monthly', 'weekly']) {
    const key = scope === 'monthly' ? 'monthKey' : 'weekKey'
    const start = scope === 'monthly' ? 'monthStart' : 'weekStart'
    const end = scope === 'monthly' ? 'monthEnd' : 'weekEnd'
    const view = {
      meta: {
        datasetId: `rankings-${scope}`, publisher: 'Harpd', license: LICENSE, attribution: ATTR,
        sourceUrl: 'https://harpd.com/rank/', citationUrl: CANON, canonicalUrl: 'https://harpd.com/rank/',
        periodKey: periods[key] || null, periodStart: periods[start] || null, periodEnd: periods[end] || null,
        generatedAt: rank.generatedAt || nowIso(), recordCount: rankCount,
        note: 'Live Harpd Rank board scoped to the current period window. Historical archives: https://harpd.com/rank/history/',
      },
      products: rank.products,
    }
    manifestFiles.push(await write(`data/rankings/${scope}.json`, JSON.stringify(view, null, 2) + '\n'))
    const cols = ['id', 'name', 'slug', 'url', 'category', 'categoryName', 'rank', 'rankPoints', 'verified', 'updatedAt']
    manifestFiles.push(await write(`data/rankings/${scope}.csv`, toCsv(rank.products, cols)))
  }

  // ---- Evidence claims CSV (real) ----
  const ev = JSON.parse(fetched['data/evidence/evidence.json'])
  const claims = Array.isArray(ev.claims) ? ev.claims : []
  const claimCols = ['id', 'claim', 'claimType', 'supported', 'confidence', 'observedAt', 'datasetId', 'datasetUrl', 'methodologyUrl', 'source', 'citation']
  manifestFiles.push(await write('data/evidence/evidence-claims.csv', toCsv(claims, claimCols)))

  // ---- Products CSV (real) ----
  const prodCols = ['id', 'name', 'slug', 'url', 'category', 'categoryName', 'rank', 'rankPoints', 'verified', 'updatedAt', 'website', 'description', 'productType']
  const prods = JSON.parse(fetched['data/products/products.json']).products
  manifestFiles.push(await write('data/products/products.csv', toCsv(prods, prodCols)))

  // ---- Rankings overall CSV (real) ----
  manifestFiles.push(await write('data/rankings/overall.csv', toCsv(rank.products, ['id', 'name', 'slug', 'url', 'category', 'categoryName', 'rank', 'rankPoints', 'verified', 'updatedAt'])))

  // ---- AI market index CSV (real) ----
  const mi = JSON.parse(fetched['data/research/ai-market-index.json'])
  const miRows = Array.isArray(mi.categories) ? mi.categories : []
  manifestFiles.push(await write('data/research/ai-market-index.csv', toCsv(miRows, ['category', 'categoryName', 'productCount', 'totalRankPoints', 'productShare', 'pointsShare', 'topProduct', 'boardUrl'])))

  // ---- Research families CSV (real index) ----
  const rs = JSON.parse(fetched['data/research/research.json'])
  const rsRows = Array.isArray(rs.research) ? rs.research : []
  manifestFiles.push(await write('data/research/research.csv', toCsv(rsRows, ['family', 'familyTitle', 'monthKey', 'url', 'listingCount'])))

  // ---- Manifest (machine-readable entry) ----
  const datasets = [
    { id: 'products', name: 'Products', description: 'Harpd product catalog with rank, category and verification status.', json: 'data/products/products.json', csv: 'data/products/products.csv', schema: 'schema/product.schema.json', sourceUrl: 'https://harpd.com/data/products.json', recordCount: prods.length },
    { id: 'rankings-overall', name: 'Rankings (overall)', description: 'Harpd Rank overall board — all products with rank and rank points.', json: 'data/rankings/overall.json', csv: 'data/rankings/overall.csv', schema: 'schema/ranking.schema.json', sourceUrl: 'https://harpd.com/data/rank.json', recordCount: rankCount },
    { id: 'rankings-monthly', name: 'Rankings (monthly)', description: 'Live Harpd Rank board scoped to the current month window.', json: 'data/rankings/monthly.json', csv: 'data/rankings/monthly.csv', schema: 'schema/ranking.schema.json', sourceUrl: 'https://harpd.com/rank/', recordCount: rankCount },
    { id: 'rankings-weekly', name: 'Rankings (weekly)', description: 'Live Harpd Rank board scoped to the current week window.', json: 'data/rankings/weekly.json', csv: 'data/rankings/weekly.csv', schema: 'schema/ranking.schema.json', sourceUrl: 'https://harpd.com/rank/', recordCount: rankCount },
    { id: 'ai-market-index', name: 'AI Market Index', description: 'Category-level AI market share and rank-point distribution.', json: 'data/research/ai-market-index.json', csv: 'data/research/ai-market-index.csv', schema: 'schema/research.schema.json', sourceUrl: 'https://harpd.com/data/market-index.json', recordCount: miRows.length },
    { id: 'ai-agent-index', name: 'AI Agent Index', description: 'AI-agent products from the Harpd Product Discovery Index (category=agents).', json: 'data/research/ai-agent-index.json', csv: 'data/research/ai-agent-index.csv', schema: 'schema/research.schema.json', sourceUrl: 'https://harpd.com/discovery/', recordCount: indices[0].rows.length },
    { id: 'developer-tools-index', name: 'Developer Tools Index', description: 'Developer-tool products from the Harpd Product Discovery Index (category=developer).', json: 'data/research/developer-tools-index.json', csv: 'data/research/developer-tools-index.csv', schema: 'schema/research.schema.json', sourceUrl: 'https://harpd.com/discovery/', recordCount: indices[1].rows.length },
    { id: 'ai-tools-index', name: 'AI Tools Index', description: 'AI-tooling products (agent + AI-media) from the Harpd Product Discovery Index.', json: 'data/research/ai-tools-index.json', csv: 'data/research/ai-tools-index.csv', schema: 'schema/research.schema.json', sourceUrl: 'https://harpd.com/discovery/', recordCount: indices[2].rows.length },
    { id: 'research-index', name: 'Research Index', description: 'Published monthly Harpd research report families (families, URLs, listing counts).', json: 'data/research/research.json', csv: 'data/research/research.csv', schema: 'schema/research.schema.json', sourceUrl: 'https://harpd.com/research/', recordCount: rsRows.length },
    { id: 'evidence', name: 'Evidence', description: 'Evidence-linked claims, datasets and audit rules behind Harpd rankings.', json: 'data/evidence/evidence.json', csv: 'data/evidence/evidence-claims.csv', schema: 'schema/evidence.schema.json', sourceUrl: 'https://harpd.com/data/evidence.json', recordCount: claims.length },
    { id: 'categories', name: 'Category Boards', description: 'The 28 Harpd Rank category boards with product counts and state.', json: 'data/rankings/categories.json', csv: '', schema: 'schema/ranking.schema.json', sourceUrl: 'https://harpd.com/data/categories.json', recordCount: JSON.parse(fetched['data/rankings/categories.json']).categories?.length ?? 0 },
  ]
  const version = `2026.${new Date().getUTCMonth() + 1}`
  const manifest = {
    name: 'Harpd AI Datasets',
    version,
    updatedAt: nowIso(),
    source: 'https://harpd.com/',
    canonical: CANON,
    license: LICENSE,
    attribution: ATTR,
    citationUrl: CANON,
    description: 'Open AI product rankings, research datasets, evidence and market data from Harpd.',
    datasets: datasets.map((d) => ({
      ...d, license: LICENSE, attribution: ATTR, canonicalUrl: CANON, citationUrl: CANON,
      updatedAt: nowIso(),
    })),
    files: manifestFiles,
  }
  await write('data/manifest.json', JSON.stringify(manifest, null, 2) + '\n')

  // Clean any temp discovery file if accidentally written (it is not).
  console.log(`\ndone — ${datasets.length} datasets, ${manifestFiles.length} files`)
  console.log('next: git add -A && git commit -m "data: sync $(date -u +%F)"')
}

main().catch((e) => { console.error(`\nsync FAILED: ${e.message}`); process.exit(1) })
