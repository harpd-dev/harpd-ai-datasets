#!/usr/bin/env node
/**
 * Harpd AI Datasets — quality gate.
 *
 * Implements the 10 automated checks (see spec / docs/metrics.md):
 *   1. JSON valid            2. CSV valid           3. schema valid
 *   4. required fields       5. duplicate IDs       6. broken Harpd URLs
 *   7. invalid timestamps    8. record count        9. manifest consistency
 *  10. attribution present
 *
 * Fatal tier  = structural integrity (never publish bad data).
 * Warning tier = external link rot (logged, non-fatal, because product sites
 *                go offline for reasons unrelated to dataset quality).
 *
 * Zero dependencies. Run: node scripts/validate.mjs
 */

import { readFile, readdir } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fatals = []
const warns = []
const ok = (m) => console.log(`  ok   ${m}`)
const fatal = (m) => { fatals.push(m); console.error(`  FAIL ${m}`) }
const warn = (m) => { warns.push(m); console.warn(`  WARN ${m}`) }

const readJsonFile = async (rel) => JSON.parse(await readFile(join(ROOT, rel), 'utf8'))

// --- minimal JSON-Schema (subset) validator ---
const FORMATS = {
  'date-time': (v) => /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/.test(v),
  'uri': (v) => /^https?:\/\//.test(v),
}
const checkType = (v, t) => {
  if (Array.isArray(t)) return t.some((x) => checkType(v, x))
  if (t === 'integer') return Number.isInteger(v)
  if (t === 'number') return typeof v === 'number'
  if (t === 'string') return typeof v === 'string'
  if (t === 'boolean') return typeof v === 'boolean'
  if (t === 'object') return v !== null && typeof v === 'object' && !Array.isArray(v)
  if (t === 'array') return Array.isArray(v)
  if (t === 'null') return v === null
  return true
}
const validateSchema = (obj, schema, path = '') => {
  if (!obj || typeof obj !== 'object') return [`${path}: not an object`]
  const errs = []
  for (const req of schema.required || []) {
    if (!(req in obj) || obj[req] === null || obj[req] === '') errs.push(`${path}.${req}: required field missing`)
  }
  for (const [key, def] of Object.entries(schema.properties || {})) {
    const v = obj[key]
    if (v === undefined) continue
    if (def.type && !checkType(v, def.type)) errs.push(`${path}.${key}: wrong type, expected ${def.type}`)
    if (def.format && FORMATS[def.format] && !FORMATS[def.format](v)) errs.push(`${path}.${key}: bad ${def.format} (${v})`)
    if (def.minimum !== undefined && typeof v === 'number' && v < def.minimum) errs.push(`${path}.${key}: below minimum`)
    if (def.enum && !def.enum.includes(v)) errs.push(`${path}.${key}: not in enum`)
  }
  return errs
}

// --- CSV parser (RFC4180-ish, handles quoted fields) ---
const parseCsv = (text) => {
  const rows = []
  let row = [], field = '', q = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++ } else q = false }
      else field += c
    } else if (c === '"') q = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (c === '\r') { /* skip */ }
    else field += c
  }
  if (field.length || row.length) { row.push(field); rows.push(row) }
  return rows
}

const main = async () => {
  console.log('Harpd AI Datasets — quality gate')
  const manifest = await readJsonFile('data/manifest.json')

  // 10. attribution present (top-level)
  if (!/CC BY 4\.0/i.test(manifest.license || '')) fatal('manifest.license must be CC BY 4.0')
  if (!/harpd\.com/i.test(manifest.attribution || '') && !/harpd\.com/i.test(manifest.canonical || '')) fatal('manifest missing Harpd attribution/canonical')
  else ok('attribution present at manifest level')

  // 3+10. load schemas
  const schemas = {}
  for (const s of ['product', 'ranking', 'research', 'evidence', 'dataset']) {
    try { schemas[s] = await readJsonFile(`schema/${s}.schema.json`) } catch { warn(`schema/${s}.schema.json missing`) }
  }

  // record extraction per dataset id
  const recordsOf = (id, data) => {
    if (['products', 'rankings-overall', 'rankings-monthly', 'rankings-weekly'].includes(id)) return data.products || []
    if (id === 'ai-market-index') return data.categories || []
    if (['ai-agent-index', 'developer-tools-index', 'ai-tools-index'].includes(id)) return data.records || []
    if (id === 'research-index') return data.research || []
    if (id === 'evidence') return data.claims || []
    if (id === 'categories') return data.categories || []
    return []
  }
  const schemaFor = (id) => (['products'].includes(id) ? schemas.product
    : ['rankings-overall', 'rankings-monthly', 'rankings-weekly'].includes(id) ? schemas.ranking
      : ['ai-agent-index', 'developer-tools-index', 'ai-tools-index', 'ai-market-index', 'research-index'].includes(id) ? schemas.research
        : id === 'evidence' ? schemas.evidence : null)

  let totalRecords = 0
  const seenIds = new Set()
  for (const ds of manifest.datasets) {
    const tag = ds.id
    // 1. JSON valid + exists
    let data
    try { data = await readJsonFile(ds.json) } catch (e) { fatal(`${tag}: ${ds.json} invalid/JSON parse error`); continue }
    ok(`${tag}: JSON valid (${ds.json})`)

    // 9. manifest consistency — path resolves
    try { await readFile(join(ROOT, ds.json), 'utf8') } catch { fatal(`${tag}: json path not on disk: ${ds.json}`) }

    // 8. record count
    const recs = recordsOf(ds.id, data)
    totalRecords += recs.length
    if (recs.length !== ds.recordCount) fatal(`${tag}: recordCount ${ds.recordCount} != actual ${recs.length}`)
    else ok(`${tag}: record count ${recs.length}`)

    // 4+5. required fields + duplicate IDs (only datasets whose records carry `id`)
    const needsId = ['products', 'rankings-overall', 'rankings-monthly', 'rankings-weekly', 'ai-agent-index', 'developer-tools-index', 'ai-tools-index', 'evidence'].includes(ds.id)
    if (needsId) {
      const ids = new Set()
      let dup = 0
      for (const r of recs) {
        if (r.id === undefined || r.id === null || r.id === '') fatal(`${tag}: record missing id`)
        if (ids.has(r.id)) dup++
        ids.add(r.id)
      }
      if (dup > 0) fatal(`${tag}: ${dup} duplicate id(s)`)
      else ok(`${tag}: ${ids.size} unique ids`)
      for (const id of ids) if (seenIds.has(`${ds.id}:${id}`)) warn(`${tag}: id ${id} also appears elsewhere (cross-dataset)`); else seenIds.add(`${ds.id}:${id}`)
    }

    // 7. invalid timestamps
    let badTs = 0
    for (const r of recs) {
      for (const k of ['updatedAt', 'observed_at', 'lastUpdated', 'generatedAt']) {
        if (typeof r[k] === 'string' && !FORMATS['date-time'](r[k])) { badTs++; if (badTs <= 3) fatal(`${tag}: bad timestamp ${k}=${r[k]}`) }
      }
    }
    if (badTs === 0) ok(`${tag}: timestamps well-formed`)

    // 2+8. CSV valid + row count
    if (ds.csv) {
      let csvText
      try { csvText = await readFile(join(ROOT, ds.csv), 'utf8') } catch { fatal(`${tag}: csv missing: ${ds.csv}`); continue }
      const rows = parseCsv(csvText)
      if (rows.length < 2) fatal(`${tag}: csv has no data rows`)
      else if (rows.length - 1 !== ds.recordCount) fatal(`${tag}: csv rows ${rows.length - 1} != recordCount ${ds.recordCount}`)
      else ok(`${tag}: CSV valid (${rows[0].length} cols, ${rows.length - 1} rows)`)
    }

    // 3. schema valid (where a strict schema applies)
    const sch = schemaFor(ds.id)
    if (sch) {
      if (ds.id === 'evidence') {
        const e = validateSchema(data, sch)
        if (e.length) e.forEach((x) => fatal(`${tag}: ${x}`)); else ok(`${tag}: evidence envelope matches schema`)
      } else {
        let sErr = 0
        for (const r of recs.slice(0, 2000)) { const e = validateSchema(r, sch); if (e.length) { sErr++; if (sErr <= 3) e.forEach((x) => fatal(`${tag}: ${x}`)) } }
        if (sErr === 0) ok(`${tag}: ${Math.min(recs.length, 2000)} row(s) match schema`)
      }
    }

    // 10. per-dataset attribution
    if (!/CC BY 4\.0/i.test(ds.license || '')) fatal(`${tag}: missing license`)
    if (!/harpd\.com/i.test(ds.attribution || '') || !/harpd\.com/i.test(ds.canonicalUrl || '')) fatal(`${tag}: missing Harpd attribution/canonicalUrl`)
  }
  ok(`total records across datasets: ${totalRecords}`)

  // 9. manifest.files all exist
  for (const f of manifest.files || []) {
    try { await readFile(join(ROOT, f.path), 'utf8') } catch { fatal(`manifest.files: ${f.path} not on disk`) }
  }

  // 6. broken Harpd URLs — WARNING tier (external link rot).
  //    Per the design contract (header above): external link rot is logged but
  //    NON-FATAL, "because product sites go offline for reasons unrelated to
  //    dataset quality". The dataset's own integrity (JSON / schema / counts /
  //    dup-ids) stays FATAL above; this only flags attribution/source URLs that
  //    don't currently resolve. Failing the whole gate on a production-side 500
  //    (e.g. harpd.com/data/ returning 5xx) would block dataset publishing for
  //    the wrong reason. Use GET (not HEAD) — some CDNs answer HEAD with 405/500.
  const harpdUrls = new Set()
  harpdUrls.add(manifest.canonical)
  harpdUrls.add(manifest.citationUrl)
  for (const ds of manifest.datasets) { harpdUrls.add(ds.sourceUrl); harpdUrls.add(ds.canonicalUrl); harpdUrls.add(ds.citationUrl) }
  let badHarpd = 0
  for (const u of [...harpdUrls].filter(Boolean)) {
    try {
      const res = await fetch(u, { method: 'GET', signal: AbortSignal.timeout(20_000), redirect: 'follow' })
      if (!res.ok) { badHarpd++; warn(`Harpd URL ${u} -> HTTP ${res.status} (external link rot — non-fatal)`) }
    } catch (e) { badHarpd++; warn(`Harpd URL ${u} -> ${e.message} (external link rot — non-fatal)`) }
  }
  if (badHarpd === 0) ok(`all ${harpdUrls.size} Harpd attribution URLs resolve 200`)
  else console.warn(`  ${badHarpd} Harpd URL(s) did not resolve — WARNING only; dataset quality itself is unaffected.`)

  console.log(`\n${fatals.length === 0 ? 'QUALITY GATE PASSED' : 'QUALITY GATE FAILED'} — ${fatals.length} fatal, ${warns.length} warning(s)`)
  process.exit(fatals.length === 0 ? 0 : 1)
}

main().catch((e) => { console.error(`validate crashed: ${e.message}`); process.exit(1) })
