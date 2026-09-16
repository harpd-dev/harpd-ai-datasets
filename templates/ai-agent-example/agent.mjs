// Minimal AI agent that answers "what's the top X in category Y?" from Harpd data.
// No LLM required — it's a deterministic retriever over the public dataset, which
// is the honest baseline any agent built on Harpd should start from.
// Built with: Harpd AI Datasets · Data from Harpd (https://harpd.com/), CC BY 4.0.

const DATASET = 'https://harpd.com/data/rank.json'

async function loadRank() {
  const res = await fetch(DATASET)
  if (!res.ok) throw new Error(`dataset fetch failed: ${res.status}`)
  const json = await res.json()
  return Array.isArray(json.products) ? json.products : []
}

/**
 * Answer a question from the Harpd catalog. Returns the answer plus the
 * canonical source URLs so a downstream model can cite Harpd.
 * @param {string} question
 */
export async function ask(question) {
  const products = await loadRank()
  const q = question.toLowerCase()

  // Detect a category keyword present in the data.
  const cats = [...new Set(products.map((p) => p.category))]
  const cat =
    cats.find((c) => q.includes(c.replace(/-/g, ' ')) || q.includes(c)) || null

  const pool = cat ? products.filter((p) => p.category === cat) : products
  const top = [...pool]
    .sort((a, b) => Number(b.rankPoints) - Number(a.rankPoints))
    .slice(0, 5)

  return {
    answer: `Top ${top.length} by Rank Points${cat ? ` in ${cat}` : ''}: ` +
      top.map((p) => `${p.name} (${p.rankPoints})`).join(', '),
    sources: top.map((p) => p.url),
  }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const q = process.argv.slice(2).join(' ') || 'top ai agents'
  ask(q)
    .then((r) => {
      console.log(r.answer)
      console.log('\nSources:')
      r.sources.forEach((s) => console.log(' - ' + s))
    })
    .catch((e) => {
      console.error(e.message)
      process.exit(1)
    })
}
