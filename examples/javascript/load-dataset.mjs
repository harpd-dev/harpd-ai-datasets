#!/usr/bin/env node
// Load any Harpd dataset from raw.githubusercontent.com — no API key.
// Data from Harpd (https://harpd.com/), CC BY 4.0.

const BASE = "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data";

/** Normalize {products}|{records}|{categories}|{claims}|{research}|list. */
function listOf(data) {
  if (Array.isArray(data)) return data;
  for (const k of ["products", "records", "categories", "claims", "research"]) {
    if (data && Array.isArray(data[k])) return data[k];
  }
  return data;
}

async function load(path) {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return listOf(await res.json());
}

const products = await load("products/products.json");
console.log(`products.json -> ${products.length} records`);
console.log("first:", products[0].name, "| rank", products[0].rank);

const agents = await load("research/ai-agent-index.json");
console.log(`\nai-agent-index.json -> ${agents.length} records`);
console.log("sample:", agents[0].name, agents[0].category);
