"use client";

import { useEffect, useMemo, useState } from "react";

// Harpd AI Datasets — AI Agent Index (CSV). Data from Harpd (https://harpd.com/), CC BY 4.0.
const CSV =
  "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.csv";

type Agent = { id: string; name: string; domain: string; url: string; category: string; on_rank_board: string };

async function loadCsv(url: string): Promise<Agent[]> {
  const text = await (await fetch(url)).text();
  const [head, ...lines] = text.trim().split("\n");
  const cols = head.split(",");
  return lines.map((line) => {
    const cells = line.split(",");
    const o: Record<string, string> = {};
    cols.forEach((c, i) => (o[c] = cells[i] ?? ""));
    return o as unknown as Agent;
  });
}

export default function Home() {
  const [rows, setRows] = useState<Agent[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    loadCsv(CSV).then(setRows);
  }, []);

  const view = useMemo(
    () => rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );

  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 880, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Harpd AI Agent Directory</h1>
      <p>
        Powered by <a href="https://harpd.com/data/">Harpd Data</a> · {rows.length} agents · CC BY 4.0
      </p>
      <input
        placeholder="Search agents…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", margin: "1rem 0" }}
      />
      <ul>
        {view.map((a) => (
          <li key={a.id}>
            <a href={a.url || a.domain}>{a.name}</a>{" "}
            <small style={{ color: "#888" }}>{a.category}</small>
          </li>
        ))}
      </ul>
      <footer style={{ marginTop: "2rem", color: "#888" }}>
        Data from Harpd (https://harpd.com/) — CC BY 4.0
      </footer>
    </main>
  );
}
