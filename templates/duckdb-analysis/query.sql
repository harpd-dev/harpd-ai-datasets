-- DuckDB analysis over the public Harpd Rank dataset (CC BY 4.0).
-- Run:  duckdb -c ".read query.sql"
-- The dataset is fetched live; pin a release tag for a frozen snapshot.
-- Column names follow https://harpd.com/data/schema.json
-- (id, name, slug, url, category, categoryName, rank, rankPoints, verified, updatedAt).
-- NOTE: rank and rankPoints arrive as strings — cast them before math.

CREATE OR REPLACE VIEW rank AS
  SELECT * FROM read_csv_auto('https://harpd.com/data/rank.csv', header=true);

-- 1. Products per category board (largest first).
SELECT categoryName, COUNT(*) AS products
FROM rank
GROUP BY categoryName
ORDER BY products DESC
LIMIT 15;

-- 2. Rank Points distribution (promotional placement — not a quality score).
SELECT
  MIN(TRY_CAST(rankPoints AS BIGINT)) AS min_points,
  MEDIAN(TRY_CAST(rankPoints AS BIGINT)) AS median_points,
  MAX(TRY_CAST(rankPoints AS BIGINT)) AS max_points,
  COUNT(*) FILTER (WHERE verified = 'True') AS verified_products
FROM rank;

-- 3. Top 10 by Rank Points in the largest category.
SELECT name, categoryName, rankPoints
FROM rank
WHERE category = (
  SELECT category FROM rank GROUP BY category ORDER BY COUNT(*) DESC LIMIT 1
)
ORDER BY TRY_CAST(rankPoints AS BIGINT) DESC
LIMIT 10;
