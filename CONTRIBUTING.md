# Contributing to Harpd AI Datasets

Thanks for helping improve open AI data. This repository mirrors public data from
[harpd.com](https://harpd.com/); contributions focus on **corrections, coverage,
schema, examples and integrations** — not on rewriting the source data.

## Ways to contribute

- **Data corrections** — a product has outdated pricing, a broken link, a wrong
  category. Open a `Data correction` issue or a PR.
- **New product sources** — propose a Discovery Index category or source board.
- **Schema improvements** — add documented, backward-compatible fields.
- **Examples & integrations** — add a language example or a dashboard that uses
  the data.
- **Templates** — extend `templates/` with a fork-and-run app.

## Workflow

```
Fork → Modify → Open PR → Validation → Review
```

1. Fork the repo and create a branch (`git checkout -b fix/agent-x-category`).
2. Make your change. For data corrections, edit the affected `data/*.json` **and**
   `data/*.csv`, and bump the relevant section in `CHANGELOG.md`.
3. Run the quality gate locally:

   ```bash
   node scripts/validate.mjs
   ```

   It must pass with `0 fatal`. PRs that fail CI are not merged.
4. Open a PR. The `validate.yml` workflow re-runs the gate on every push.

## Schema change policy

- Additive, documented changes are welcome.
- Renaming or removing a field counts as a **breaking change**: mark the old
  field `deprecated`, keep it for at least one release cycle, and update
  `CHANGELOG.md`.
- Never ship a change that breaks `scripts/validate.mjs`.

## Adding a dataset example

Put language examples under `examples/<lang>/` with a short README. Keep them
dependency-light and copy-paste runnable. Reference the raw `main` URL.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
