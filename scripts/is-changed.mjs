#!/usr/bin/env node
/**
 * Detect whether the working tree differs from HEAD in DATA content
 * (ignoring timestamp fields). Exit 0 = material change (commit/push),
 * exit 1 = only timestamps changed (skip commit).
 *
 * Used by .github/workflows/sync.yml so a daily run never produces a
 * meaningless commit when upstream data is unchanged.
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const strip = (s) =>
  s
    .replace(/"updatedAt"\s*:\s*"[^"]*"/g, '"updatedAt":"__ts__"')
    .replace(/"generatedAt"\s*:\s*"[^"]*"/g, '"generatedAt":"__ts__"')
    .replace(/"lastUpdated"\s*:\s*"[^"]*"/g, '"lastUpdated":"__ts__"')
    .replace(/"observed_at"\s*:\s*"[^"]*"/g, '"observed_at":"__ts__"')
    .replace(/"recordedAt"\s*:\s*"[^"]*"/g, '"recordedAt":"__ts__"')
    .replace(/"monthKey"\s*:\s*"[^"]*"/g, '"monthKey":"__ts__"')
    .replace(/"weekKey"\s*:\s*"[^"]*"/g, '"weekKey":"__ts__"')
    .replace(/"periodStart"\s*:\s*"[^"]*"/g, '"periodStart":"__ts__"')
    .replace(/"periodEnd"\s*:\s*"[^"]*"/g, '"periodEnd":"__ts__"')
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z/g, '__ts__')
    .replace(/\d{4}-\d{2}-\d{2}/g, '__date__')

let changed = false
const files = execSync('git diff --name-only HEAD', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)
  .filter((f) => /\.(json|csv)$/.test(f))

for (const f of files) {
  let head = ''
  try { head = execSync(`git show HEAD:${f}`, { encoding: 'utf8' }) } catch { head = '' }
  let work = ''
  try { work = readFileSync(f, 'utf8') } catch { work = '' }
  if (strip(head) !== strip(work)) {
    changed = true
    console.log(`material change: ${f}`)
    break
  }
}

if (changed) { console.log('data changed — commit will be made'); process.exit(0) }
console.log('no material change (timestamps only) — skip commit')
process.exit(1)
