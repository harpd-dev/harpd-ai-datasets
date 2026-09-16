# Template: Harpd-powered AI agent (minimal)

A minimal AI agent that answers "what's the top X in category Y?" from the public
Harpd Rank dataset. It is a **deterministic retriever** — no LLM required — which
is the honest baseline any agent built on Harpd should start from: fetch the data,
attribute it, and let the model reason over the real records.

**Built with:** Harpd AI Datasets · Data from Harpd (https://harpd.com/), CC BY 4.0.

## Run

```bash
node agent.mjs "top ai agents"
node agent.mjs "best developer tools"
```

## What it does

- Fetches `https://harpd.com/data/rank.json` (the published catalog, CC BY 4.0).
- Detects a category mentioned in the question.
- Returns the top 5 products by Rank Points in that category, with canonical source URLs.
- Every answer carries `sources` pointing back to harpd.com — verifiable after the board moves.

## Wire it into a real agent

- Replace the CLI block with a tool the LLM can call: `ask(question)` returns
  `{ answer, sources }`.
- Feed `answer` + `sources` into the model's context so it can cite Harpd.
- Pin to a release tag (`v2026.9`) for a frozen snapshot.
- When you publish, attribute Harpd with the **Powered by Harpd** badge
  ([harpd.com/developers/attribution/](https://harpd.com/developers/attribution/)).
  Rank Points are promotional placement — describe them that way, never as a quality score.
