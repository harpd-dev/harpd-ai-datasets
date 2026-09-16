# Template: Harpd AI Product Explorer (Streamlit)

An interactive explorer for the Harpd AI Datasets — filter products by
category, search by name, and view rank points. Reads live data from
raw.githubusercontent.com.

**Built with:** Harpd AI Datasets · Data from Harpd (https://harpd.com/), CC BY 4.0.

## Run

```bash
pip install streamlit pandas
streamlit run app.py
```

## Features

- Category filter + free-text search.
- Sort by rank / rank points.
- Shows verification status.
- "Powered by Harpd Data" attribution footer.

## Customize

- Switch the CSV source to `monthly.csv` / `weekly.csv`.
- Add a chart with `st.bar_chart`.
- Pin to a release tag for a frozen snapshot.
