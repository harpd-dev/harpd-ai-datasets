# Metrics & KPIs

How we measure success for the Harpd Open Data Distribution Layer. The north
star is **External Dataset Adoption**, not vanity stars.

## Core KPI

> **External Dataset Adoption** = the number of *real third-party projects*
> that consume Harpd data (via raw.githubusercontent.com, a fork, or a release
> tag) and attribute Harpd.

A GitHub star on this repo is **not** adoption by itself. A fork that is never
used is **not** adoption. Adoption requires actual consumption + attribution.

## Supporting metrics (tracked, not equated to adoption)

| Metric | How measured | Tooling |
|---|---|---|
| GitHub stars | repo insight | GitHub API |
| Forks | repo insight | GitHub API |
| Dependents | repo dependency graph | GitHub API |
| Releases | tag list | GitHub API |
| External projects | manual verification | [adoption.md](adoption.md) |
| External links / references | web mentions | search |
| Dataset citations | papers / blogs citing CITATION.cff | search |
| Raw file downloads | GitHub traffic (when measurable) | GitHub API |
| CI health | sync/validate pass rate | Actions |

## What we do NOT count

- Stars as adoption.
- Estimated or projected usage.
- Any metric we cannot verify.

## Reporting

Recorded monthly in the release notes and reflected in
[adoption.md](adoption.md). Fake metrics are never published.
