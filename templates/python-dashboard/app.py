#!/usr/bin/env python3
"""Harpd-powered AI Product Ranking Dashboard — zero dependency.

Loads the live Harpd Rank overall board (CSV) and serves a sortable HTML page.
Data from Harpd (https://harpd.com/), CC BY 4.0.
"""
import csv
import html
import io
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.request import urlopen

CSV = "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/overall.csv"
PORT = 8000


def load_rows():
    with urlopen(CSV, timeout=30) as r:
        text = r.read().decode()
    return list(csv.DictReader(io.StringIO(text)))


def render(rows):
    top = sorted(rows, key=lambda x: float(x.get("rankPoints") or 0), reverse=True)[:25]
    cards = "".join(
        f"<tr><td>{html.escape(r['rank'])}</td><td>{html.escape(r['name'])}</td>"
        f"<td>{html.escape(r['categoryName'])}</td>"
        f"<td>{html.escape(r['rankPoints'])}</td>"
        f"<td>{'✔' if r.get('verified')=='true' else ''}</td></tr>"
        for r in top
    )
    cats = {}
    for r in rows:
        cats[r["categoryName"]] = cats.get(r["categoryName"], 0) + 1
    cat_rows = "".join(f"<tr><td>{html.escape(k)}</td><td>{v}</td></tr>"
                       for k, v in sorted(cats.items(), key=lambda x: -x[1]))
    return f"""<!doctype html><html><head><meta charset=utf-8>
<title>Harpd Rank Dashboard</title>
<style>body{{font:14px/1.5 system-ui;margin:2rem;background:#0f0f12;color:#eee}}
table{{border-collapse:collapse;width:100%;margin:1rem 0}}th,td{{border:1px solid #333;padding:.5rem;text-align:left}}
h1{{font-size:1.4rem}}a{{color:#8a7bff}}</style></head><body>
<h1>AI Product Ranking Dashboard</h1>
<p>Powered by <a href="https://harpd.com/data/">Harpd Data</a> &middot; {len(rows)} products &middot; CC BY 4.0</p>
<h2>Top 25 by rank points</h2>
<table><thead><tr><th>Rank</th><th>Product</th><th>Category</th><th>Points</th><th>Verified</th></tr></thead>
<tbody>{cards}</tbody></table>
<h2>Products per category</h2>
<table><thead><tr><th>Category</th><th>Count</th></tr></thead><tbody>{cat_rows}</tbody></table>
</body></html>"""


class H(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            body = render(load_rows()).encode()
        except Exception as e:  # never crash the server on upstream blips
            body = f"<h1>Harpd Data unavailable</h1><pre>{html.escape(str(e))}</pre>".encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *a):
        pass


if __name__ == "__main__":
    print(f"serving on http://localhost:{PORT}")
    HTTPServer(("0.0.0.0", PORT), H).serve_forever()
