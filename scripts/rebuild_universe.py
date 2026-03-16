"""
UNIVERSE REBUILD SCRIPT
========================
Fetches current ETF holdings from EODHD fundamentals API.
Pulls top 15 stocks by weight for each of the 17 ETF themes.
Writes to data/universe_config.json — read by v2_picks_generator.py.

Run manually or via GitHub Actions monthly cron.
Usage: python scripts/rebuild_universe.py
"""

import json
import os
import time
import requests
from datetime import datetime

API_KEY = os.environ.get("EODHD_API_KEY", "6986e42b69a9d5.27218591")
BASE_URL = "https://eodhd.com/api/fundamentals"
TOP_N = 15  # Max stocks per theme

# The 17 ETF themes (no BTC/ETH — they are direct assets, no constituents)
ETF_THEMES = [
    "XLK", "XLF", "XLV", "XLE", "XLY", "XLP",
    "XLI", "XLB", "XLU", "XLRE", "XLC",
    "GLD", "SLV", "CPER", "URA", "ICLN", "BITO",
]


def fetch_components(etf_ticker: str) -> list[str]:
    """Fetch top N holdings for an ETF by weight. Returns list of tickers."""
    url = f"{BASE_URL}/{etf_ticker}.US"
    params = {
        "api_token": API_KEY,
        "filter": "Components",
        "fmt": "json",
    }
    try:
        r = requests.get(url, params=params, timeout=30)
        r.raise_for_status()
        components = r.json()

        if not isinstance(components, dict) or not components:
            print(f"  -- {etf_ticker:<5}  no components data")
            return []

        # Each entry: {"Code": "AAPL", "Exchange": "US", "Assets_%": "12.54", "Type": "Stock", ...}
        stocks = []
        for key, info in components.items():
            if not isinstance(info, dict):
                continue
            ticker = info.get("Code", "").strip()
            exchange = info.get("Exchange", "").strip().upper()
            asset_type = info.get("Type", "").strip()
            weight_str = info.get("Assets_%") or info.get("Equity_%") or "0"

            # Filter: US-listed stocks and ETFs only (excludes futures, cash, foreign)
            if not ticker:
                continue
            if exchange not in ("US", "NYSE", "NASDAQ", "NYSE ARCA", "BATS", ""):
                continue
            if asset_type in ("Cash", "Money Market", ""):
                continue

            try:
                weight = float(weight_str)
            except (ValueError, TypeError):
                weight = 0.0

            stocks.append((ticker, weight))

        # Sort by weight descending, take top N
        stocks.sort(key=lambda x: x[1], reverse=True)
        top_tickers = [t for t, _ in stocks[:TOP_N]]

        print(f"  OK {etf_ticker:<5}  {len(top_tickers)} stocks  (top: {', '.join(top_tickers[:3])}...)")
        return top_tickers

    except requests.RequestException as e:
        print(f"  -- {etf_ticker:<5}  request failed: {e}")
        return []
    except Exception as e:
        print(f"  -- {etf_ticker:<5}  error: {e}")
        return []


# Hardcoded fallback in case API returns nothing for a theme
FALLBACK_UNIVERSE: dict[str, list[str]] = {
    "XLK":  ["AAPL","MSFT","NVDA","GOOGL","META","AVGO","AMD","ORCL","ADBE","CRM","QCOM","NOW"],
    "XLF":  ["JPM","BAC","GS","MS","WFC","BLK","AXP","SCHW","SPGI","CME","C","MCO"],
    "XLV":  ["UNH","LLY","JNJ","ABBV","MRK","TMO","ISRG","AMGN","VRTX","DHR","REGN","ABT"],
    "XLE":  ["XOM","CVX","COP","EOG","SLB","MPC","PSX","VLO","OXY","HAL","DVN","BKR"],
    "XLY":  ["AMZN","TSLA","HD","MCD","NKE","BKNG","LOW","TJX","SBUX","MAR","CMG","TGT"],
    "XLP":  ["WMT","COST","PG","KO","PEP","PM","MO","CL","MDLZ","KMB","HSY","SYY"],
    "XLI":  ["GE","CAT","RTX","HON","LMT","UNP","UPS","ETN","DE","ITW","BA","CSX"],
    "XLB":  ["LIN","SHW","APD","ECL","FCX","NEM","NUE","DOW","ALB","VMC","PPG","MLM"],
    "XLU":  ["NEE","SO","DUK","AEP","SRE","EXC","D","XEL","PEG","WEC","ES","AWK"],
    "XLRE": ["PLD","AMT","EQIX","CCI","PSA","DLR","WELL","O","VICI","AVB","EQR","SBAC"],
    "XLC":  ["META","GOOGL","NFLX","DIS","CMCSA","T","VZ","TMUS","EA","CHTR","TTWO","LYV"],
    "GLD":  ["NEM","GOLD","AEM","FNV","WPM","KGC","RGLD","AU","AGI","BTG"],
    "SLV":  ["PAAS","AG","HL","CDE","EXK","FSM","SVM","SSRM"],
    "CPER": ["FCX","SCCO","BHP","RIO","VALE","TECK","HBM","ERO"],
    "URA":  ["CCJ","UUUU","DNN","UEC","NXE","EU","URG","UROY"],
    "ICLN": ["ENPH","FSLR","RUN","SEDG","CSIQ","JKS","FLNC","ARRY","MAXN"],
    "BITO": ["COIN","MSTR","MARA","RIOT","CLSK","HUT","BITF","CIFR","CORZ","IREN"],
}


def main():
    print("=" * 60)
    print("  UNIVERSE REBUILD")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 60)
    print(f"\nFetching top {TOP_N} holdings for {len(ETF_THEMES)} ETFs ...\n")

    universe: dict[str, list[str]] = {}

    for etf in ETF_THEMES:
        tickers = fetch_components(etf)
        if tickers:
            universe[etf] = tickers
        else:
            # Fall back to hardcoded if API returns nothing
            fallback = FALLBACK_UNIVERSE.get(etf, [])
            universe[etf] = fallback
            if fallback:
                print(f"  >> {etf:<5}  using fallback ({len(fallback)} stocks)")
        time.sleep(0.3)

    out_path = os.path.join(os.path.dirname(__file__), "..", "data", "universe_config.json")
    out_path = os.path.normpath(out_path)

    output = {
        "generated": datetime.now().strftime("%Y-%m-%d"),
        "universe": universe,
    }

    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)

    total_stocks = sum(len(v) for v in universe.values())
    print(f"\n  Saved {total_stocks} stocks across {len(universe)} themes → {out_path}")
    print("\nDone.")


if __name__ == "__main__":
    main()
