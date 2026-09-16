# Security Policy

## Scope

This repository distributes **public, read-only datasets** mirrored from
[harpd.com](https://harpd.com/). It contains no secrets, credentials, or
authentication logic. The only automation (`sync.yml`, `validate.yml`,
`release.yml`) reads public endpoints and writes data files.

## Reporting a vulnerability

If you discover a security issue (e.g. a leaked credential in an example, a
malicious dependency, or a supply-chain concern in the sync pipeline), please
report it privately to **harpdsupport@gmail.com** rather than opening a public
issue.

We aim to acknowledge reports within 5 business days.

## Data integrity

- Every committed dataset file is hashed (`sha256`) in `manifest.json`.
- The quality gate (`scripts/validate.mjs`) blocks publication of malformed,
  empty, or shrunk snapshots.
- Monthly snapshot releases are immutable tags; `main` is the rolling mirror.

## Safe consumption

Pin to a release tag (e.g. `v2026.09`) in production. The `main` branch is
updated daily and may change shape between releases.
