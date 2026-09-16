#!/usr/bin/env python3
"""Quick analytics on Harpd data with pandas — 30-second start.

Requires: pip install pandas
Data from Harpd (https://harpd.com/), CC BY 4.0.
"""
import pandas as pd
import requests

CSV = "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/rankings/overall.csv"


def main():
    df = pd.read_csv(CSV)
    print(f"Loaded {len(df)} ranked products\n")

    print("Top 10 by rank points:")
    print(df.sort_values("rankPoints", ascending=False).head(10)[["name", "category", "rankPoints"]].to_string(index=False))

    print("\nProducts per category (top 8):")
    print(df["categoryName"].value_counts().head(8).to_string())

    verified = df["verified"].sum()
    print(f"\nVerified products: {verified} / {len(df)} ({verified / len(df):.0%})")


if __name__ == "__main__":
    main()
