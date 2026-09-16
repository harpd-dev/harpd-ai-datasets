"""Harpd AI Product Explorer — Streamlit.
Data from Harpd (https://harpd.com/), CC BY 4.0.

Run:  pip install streamlit pandas && streamlit run app.py
"""
import pandas as pd
import streamlit as st

CSV = "https://raw.githubusercontent.com/harpd-dev/harpd-ai-datasets/main/data/products/products.csv"

st.set_page_config(page_title="Harpd AI Product Explorer", layout="wide")
st.title("AI Product Explorer")
st.caption('Powered by [Harpd Data](https://harpd.com/data/) · CC BY 4.0')

@st.cache_data(ttl=3600)
def load():
    return pd.read_csv(CSV)

df = load()
cats = ["All"] + sorted(df["categoryName"].dropna().unique().tolist())
category = st.sidebar.selectbox("Category", cats)
query = st.sidebar.text_input("Search name")

view = df
if category != "All":
    view = view[view["categoryName"] == category]
if query:
    view = view[view["name"].str.contains(query, case=False, na=False)]

st.metric("Products", len(view))
sort_by = st.sidebar.selectbox("Sort by", ["rankPoints", "rank"])
view = view.sort_values(sort_by, ascending=False)

st.dataframe(
    view[["name", "categoryName", "rank", "rankPoints", "verified"]],
    use_container_width=True, height=600,
)
st.markdown("Data from Harpd (https://harpd.com/) — CC BY 4.0")
