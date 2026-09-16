#!/usr/bin/env python3
"""Load any Harpd dataset directly from raw.githubusercontent.com — no API key.

Data from Harpd (https://harpd.com/), CC BY 4.0.
"""
import requests

BASE = "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data"

# A dataset file is either { "products": [...] } or { "records": [...] } or
# a bare list. This helper normalizes all three shapes.
def load(path: str):
    url = f"{BASE}/{path}"
    data = requests.get(url, timeout=30).json()
    if isinstance(data, list):
        return data
    for key in ("products", "records", "categories", "claims", "research"):
        if isinstance(data, dict) and key in data:
            return data[key]
    return data


if __name__ == "__main__":
    products = load("products/products.json")
    print(f"products.json -> {len(products)} records")
    print("first:", products[0]["name"], "| rank", products[0]["rank"])

    agents = load("research/ai-agent-index.json")
    print(f"\nai-agent-index.json -> {len(agents)} records")
    print("sample:", agents[0]["name"], agents[0]["category"])
