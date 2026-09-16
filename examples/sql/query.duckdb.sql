-- DuckDB: query Harpd data directly from raw.githubusercontent.com — no download.
-- Data from Harpd (https://harpd.com/), CC BY 4.0.
-- Requires: duckdb  (https://duckdb.org)

-- 1. Top 10 AI agents by rank points
SELECT name, category, rankPoints
FROM read_csv_auto('https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.csv')
ORDER BY CAST(rankPoints AS DOUBLE) DESC
LIMIT 10;

-- 2. Product count per category in the overall board
SELECT categoryName, COUNT(*) AS n
FROM read_csv_auto('https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/overall.csv')
GROUP BY categoryName
ORDER BY n DESC;

-- 3. Category-level AI market share
SELECT category, productCount, productShare
FROM read_csv_auto('https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-market-index.csv')
ORDER BY CAST(productCount AS INTEGER) DESC;

-- 4. Cross-dataset join: agents also on the rank board
SELECT a.name, a.category, o.rank, o.rankPoints
FROM read_csv_auto('https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/research/ai-agent-index.csv') a
JOIN read_csv_auto('https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/overall.csv') o
  ON a.name = o.name
WHERE a.on_rank_board = 'true'
ORDER BY CAST(o.rankPoints AS DOUBLE) DESC
LIMIT 20;
