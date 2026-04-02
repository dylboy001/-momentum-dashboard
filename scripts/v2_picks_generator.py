"""
V2 MOMENTUM CAPITAL PICKS GENERATOR
=====================================
Strategy: ETF + crypto theme rotation with EMA 10/100 daily trend filter
- 17 sector/commodity ETFs + BTC + ETH = 19 themes total
- Rank by 16-week (Balanced) / 26-week (Growth) price momentum
- EMA 10/100 daily filter: Price > EMA(10d) > EMA(100d) required to qualify
- Balanced mode (default): top 2 qualifying themes, 50/50 equal weight, rebalance every 7 days
- Growth mode (--growth): top 1 qualifying theme, 100%, rebalance every 30 days
- Output: picks_raw.json (same format as dashboard /api/picks expects)

Usage:
  python v2_picks_generator.py           # Balanced mode
  python v2_picks_generator.py --growth  # Growth mode (concentrated)
"""

import json
import os
import sys
import time
import warnings
from datetime import datetime, timedelta

import numpy as np
import pandas as pd
import requests

warnings.filterwarnings("ignore")

# ═══════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════

API_KEY = os.environ.get("EODHD_API_KEY", "6986e42b69a9d5.27218591")
EODHD_BASE_URL = "https://eodhd.com/api"

# 17 ETF themes
ETF_THEMES = [
    # 11 US equity sectors
    "XLK", "XLF", "XLV", "XLE", "XLY", "XLP", "XLI", "XLB", "XLU", "XLRE", "XLC",
    # 6 commodities / alternatives
    "GLD", "SLV", "CPER", "URA", "ICLN", "BITO",
]

# 2 direct crypto themes (EODHD crypto exchange suffix .CC)
CRYPTO_THEMES = {
    "BTC": "BTC-USD.CC",
    "ETH": "ETH-USD.CC",
}

# Constituent stocks per theme (top liquid names, reference only — strategy holds the ETF)
_UNIVERSE_HARDCODED: dict[str, list[str]] = {
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

def _load_universe() -> dict[str, list[str]]:
    """Load universe from universe_config.json if available, else use hardcoded."""
    config_path = os.path.join(os.path.dirname(__file__), "..", "data", "universe_config.json")
    config_path = os.path.normpath(config_path)
    if os.path.exists(config_path):
        try:
            with open(config_path) as f:
                data = json.load(f)
            universe = data.get("universe", {})
            if universe:
                print(f"  [universe] loaded from universe_config.json ({data.get('generated', 'unknown date')})")
                return universe
        except Exception:
            pass
    print("  [universe] using hardcoded fallback")
    return _UNIVERSE_HARDCODED

UNIVERSE: dict[str, list[str]] = _load_universe()

THEME_NAMES = {
    "XLK":  "Technology",
    "XLF":  "Financials",
    "XLV":  "Healthcare",
    "XLE":  "Energy",
    "XLY":  "Consumer Cyclical",
    "XLP":  "Consumer Defensive",
    "XLI":  "Industrials",
    "XLB":  "Materials",
    "XLU":  "Utilities",
    "XLRE": "Real Estate",
    "XLC":  "Comm. Services",
    "GLD":  "Gold",
    "SLV":  "Silver",
    "CPER": "Copper",
    "URA":  "Uranium",
    "ICLN": "Clean Energy",
    "BITO": "Crypto Futures",
    "BTC":  "Bitcoin",
    "ETH":  "Ethereum",
}

# EMA filter parameters (daily bars)
EMA_FAST_D    = 10    # fast EMA in trading days
EMA_SLOW_D    = 100   # slow EMA in trading days
VOL_LOOKBACK_D = 60   # trading days for realized vol

# Enough history to compute EMA(250w) ~= 5 years
DATA_START = "2000-01-01"
DATA_END   = datetime.now().strftime("%Y-%m-%d")


# ═══════════════════════════════════════════════════════════
# DATA DOWNLOAD
# ═══════════════════════════════════════════════════════════

def _fetch_eod(endpoint: str, params: dict) -> pd.DataFrame | None:
    """Shared EOD fetch with basic validation."""
    try:
        r = requests.get(endpoint, params=params, timeout=20)
        if r.status_code != 200:
            return None
        data = r.json()
        if not data or not isinstance(data, list):
            return None
        df = pd.DataFrame(data)
        if len(df) < 100:
            return None
        df["date"] = pd.to_datetime(df["date"])
        df = df.set_index("date").sort_index()
        # Prefer adjusted_close; fall back to close
        if "adjusted_close" in df.columns:
            price_col = df["adjusted_close"]
        elif "close" in df.columns:
            price_col = df["close"]
        else:
            return None
        return pd.DataFrame({"close": price_col})
    except Exception as e:
        return None


def download_etf(ticker: str) -> pd.DataFrame | None:
    """Daily adjusted close for a US-listed ETF."""
    return _fetch_eod(
        f"{EODHD_BASE_URL}/eod/{ticker}.US",
        {"api_token": API_KEY, "from": DATA_START, "to": DATA_END, "fmt": "json"},
    )


def download_crypto(cc_symbol: str) -> pd.DataFrame | None:
    """Daily close for a crypto asset via EODHD CC exchange (e.g. BTC-USD.CC)."""
    return _fetch_eod(
        f"{EODHD_BASE_URL}/eod/{cc_symbol}",
        {"api_token": API_KEY, "from": DATA_START, "to": DATA_END, "fmt": "json"},
    )


# ═══════════════════════════════════════════════════════════
# CALCULATIONS
# ═══════════════════════════════════════════════════════════

def to_weekly(daily_close: pd.Series) -> pd.Series:
    """Resample daily prices to weekly (last trading day of each week)."""
    return daily_close.resample("W").last().dropna()


def momentum_pct(weekly: pd.Series, lookback_weeks: int) -> float | None:
    """N-week momentum as percentage: (close_now / close_Nw_ago - 1) * 100."""
    n = lookback_weeks
    if len(weekly) < n + 1:
        return None
    current = float(weekly.iloc[-1])
    past    = float(weekly.iloc[-(n + 1)])
    if past <= 0:
        return None
    return round((current / past - 1) * 100, 2)


def ema_filter_passes(daily: pd.Series, fast: int, slow: int) -> bool:
    """Return True if Price > EMA(fast) > EMA(slow) using daily bars."""
    if len(daily) < slow:
        return False
    ema_f = daily.ewm(span=fast, adjust=False).mean()
    ema_s = daily.ewm(span=slow, adjust=False).mean()
    price = float(daily.iloc[-1])
    ef    = float(ema_f.iloc[-1])
    es    = float(ema_s.iloc[-1])
    return price > ef > es


def annualized_vol(daily_close: pd.Series, window: int = 60) -> float | None:
    """Annualized realized volatility (%) over last `window` trading days."""
    if len(daily_close) < window + 1:
        return None
    rets = daily_close.pct_change().dropna().iloc[-window:]
    vol  = rets.std() * (252 ** 0.5) * 100
    return round(float(vol), 2) if not np.isnan(vol) else None


# ═══════════════════════════════════════════════════════════
# PICKS GENERATION
# ═══════════════════════════════════════════════════════════

def generate_picks(growth_mode: bool = False) -> dict:
    mode_label     = "GROWTH" if growth_mode else "BALANCED"
    top_n          = 1 if growth_mode else 2
    lookback_weeks = 26 if growth_mode else 16
    rebalance_days = 30 if growth_mode else 7

    print(f"\n{'='*60}")
    print(f"  V2 PICKS GENERATOR  |  {mode_label} MODE")
    print(f"{'='*60}")
    print(f"  Lookback : {lookback_weeks}w")
    print(f"  EMA      : {EMA_FAST_D}/{EMA_SLOW_D} daily")
    print(f"  Top N    : {top_n}")
    print(f"  Rebalance: every {rebalance_days}d")

    # ------------------------------------------------------------------
    # 1. Download prices
    # ------------------------------------------------------------------
    print(f"\n[1/4] Downloading prices for 19 themes + SPY ...")
    daily: dict[str, pd.DataFrame] = {}

    for ticker in ETF_THEMES:
        df = download_etf(ticker)
        status = f"{len(df)} days" if df is not None else "FAILED"
        print(f"  {'OK' if df is not None else '--'} {ticker:<5}  {status}")
        if df is not None:
            daily[ticker] = df
        time.sleep(0.2)

    for theme_key, cc_symbol in CRYPTO_THEMES.items():
        df = download_crypto(cc_symbol)
        status = f"{len(df)} days" if df is not None else "FAILED"
        print(f"  {'OK' if df is not None else '--'} {theme_key:<5}  {status}")
        if df is not None:
            daily[theme_key] = df
        time.sleep(0.2)

    spy_df = download_etf("SPY")
    print(f"  {'OK' if spy_df is not None else '--'} SPY")

    if not daily:
        return {"error": "No price data available"}

    # ------------------------------------------------------------------
    # 2. Compute momentum + EMA filter for every theme
    # ------------------------------------------------------------------
    print(f"\n[2/4] Computing momentum & EMA {EMA_FAST_D}/{EMA_SLOW_D} daily filter ...")

    scores: dict[str, float]        = {}
    filter_pass: dict[str, bool]    = {}
    prices: dict[str, float]        = {}
    vols: dict[str, float | None]   = {}
    latest_date = None

    for theme, df in daily.items():
        weekly = to_weekly(df["close"])
        mom    = momentum_pct(weekly, lookback_weeks)
        passes = ema_filter_passes(df["close"], EMA_FAST_D, EMA_SLOW_D)

        if mom is not None:
            scores[theme]      = mom
            filter_pass[theme] = passes
            prices[theme]      = round(float(df["close"].iloc[-1]), 2)
            vols[theme]        = annualized_vol(df["close"], VOL_LOOKBACK_D)

        d = df.index[-1]
        if latest_date is None or d > latest_date:
            latest_date = d

        ema_str = "PASS" if passes else "fail"
        mom_str = f"{mom:+.1f}%" if mom is not None else "N/A  "
        print(f"  {theme:<5}  mom={mom_str:>8}  EMA={ema_str}")

    # ------------------------------------------------------------------
    # 3. Rank and select
    # ------------------------------------------------------------------
    print(f"\n[3/4] Selecting top {top_n} qualifying theme(s) — rebalance in {rebalance_days}d ...")

    # All themes ranked by momentum (descending)
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    theme_rankings = [[t, s] for t, s in ranked]

    # Themes that pass EMA filter
    qualifying = [(t, s) for t, s in ranked if filter_pass.get(t, False)]
    selected   = qualifying[:top_n]

    if qualifying:
        print(f"  Qualifying : {[t for t, _ in qualifying]}")
    else:
        print("  No themes pass EMA filter — strategy holds CASH")
    print(f"  Selected   : {[t for t, _ in selected]}")

    # Build picks list
    picks = []
    if selected:
        weight = round(100.0 / len(selected), 2)
        for theme, mom_score in selected:
            picks.append({
                "ticker":     theme,
                "name":       THEME_NAMES.get(theme, theme),
                "theme":      theme,
                "price":      prices.get(theme, 0.0),
                "rs_score":   mom_score,       # momentum % used as the score
                "volatility": vols.get(theme),
                "weight_pct": weight,
            })

    # SPY momentum (for dashboard display)
    spy_momentum = None
    if spy_df is not None:
        spy_weekly   = to_weekly(spy_df["close"])
        spy_momentum = momentum_pct(spy_weekly, lookback_weeks)

    date_str = str(latest_date.date()) if latest_date else datetime.now().strftime("%Y-%m-%d")

    # ------------------------------------------------------------------
    # Preserve rebalance_next across daily scanner runs.
    # The strategy rebalances on a fixed N-day schedule regardless of
    # whether holdings change. Keep the existing date if it's still in
    # the future; when it expires, advance by one full period (not from
    # today) to stay true to the backtest cadence.
    # ------------------------------------------------------------------
    out_path_check = os.path.join(os.path.dirname(__file__), "..", "data", "picks_raw.json")
    out_path_check = os.path.normpath(out_path_check)
    existing_rebalance_next = None
    try:
        if os.path.exists(out_path_check):
            with open(out_path_check) as f:
                existing_rebalance_next = json.load(f).get("rebalance_next", "")
    except Exception:
        pass

    today = datetime.now().date()
    rebalance_occurred = False  # True only if the period has elapsed this run
    if existing_rebalance_next:
        try:
            existing_date = datetime.strptime(existing_rebalance_next, "%Y-%m-%d").date()
            if existing_date > today:
                rebalance_next = existing_rebalance_next
                print(f"  Rebalance  : scheduled {rebalance_next} (unchanged)")
            else:
                # Advance by one period from the last scheduled date (not from today)
                rebalance_next = str(existing_date + timedelta(days=rebalance_days))
                rebalance_occurred = True
                print(f"  Rebalance  : period elapsed → next {rebalance_next}")
        except ValueError:
            rebalance_next = str((latest_date + timedelta(days=rebalance_days)).date()) if latest_date else ""
            rebalance_occurred = True
    else:
        rebalance_next = str((latest_date + timedelta(days=rebalance_days)).date()) if latest_date else ""
        rebalance_occurred = True
        print(f"  Rebalance  : first run → {rebalance_next}")

    # If no rebalance occurred, freeze picks/top_themes to the last saved values.
    # Rankings update daily (live signal); holdings only change on rebalance day.
    frozen_picks = []
    frozen_top_themes = [t for t, _ in selected]  # default: use today's signal
    if not rebalance_occurred:
        try:
            out_path_check2 = os.path.join(os.path.dirname(__file__), "..", "data", "picks_raw.json")
            out_path_check2 = os.path.normpath(out_path_check2)
            if os.path.exists(out_path_check2):
                with open(out_path_check2) as f:
                    existing_data = json.load(f)
                frozen_picks = existing_data.get("picks", [])
                frozen_top_themes = existing_data.get("top_themes", frozen_top_themes)
                # Refresh prices in frozen picks to current values (price display only)
                for p in frozen_picks:
                    ticker = p.get("ticker")
                    if ticker and ticker in prices:
                        p["price"] = prices[ticker]
                print(f"  Holdings   : frozen (no rebalance) — {frozen_top_themes}")
        except Exception:
            frozen_picks = picks  # fallback to recalculated if read fails
            frozen_top_themes = [t for t, _ in selected]
    else:
        frozen_picks = picks
        print(f"  Holdings   : rebalanced → {frozen_top_themes}")

    # ------------------------------------------------------------------
    # 4. Fetch constituent stock data for each theme (reference data)
    # ------------------------------------------------------------------
    print(f"\n[4/4] Fetching constituent stock data for {len(UNIVERSE)} themes ...")
    universe_full_data: dict[str, list[dict]] = {}

    for theme_key, tickers in UNIVERSE.items():
        theme_etf_mom = scores.get(theme_key)  # momentum of the theme ETF
        theme_stocks: list[dict] = []

        for ticker in tickers:
            df = download_etf(ticker)
            time.sleep(0.15)
            if df is None:
                print(f"    -- {ticker:<6} (no data)")
                theme_stocks.append({
                    "ticker": ticker,
                    "price": None,
                    "rs_score": None,
                    "volatility": None,
                    "selected": False,
                })
                continue

            weekly  = to_weekly(df["close"])
            stock_mom = momentum_pct(weekly, lookback_weeks)
            vol       = annualized_vol(df["close"], VOL_LOOKBACK_D)
            price     = round(float(df["close"].iloc[-1]), 2)

            # RS score = stock momentum minus theme ETF momentum
            if stock_mom is not None and theme_etf_mom is not None:
                rs = round(stock_mom - theme_etf_mom, 2)
            else:
                rs = None

            mom_str = f"{stock_mom:+.1f}%" if stock_mom is not None else "N/A"
            rs_str  = f"{rs:+.2f}" if rs is not None else "N/A"
            print(f"    OK {ticker:<6}  price=${price:.2f}  mom={mom_str:>8}  RS={rs_str:>7}")

            theme_stocks.append({
                "ticker":     ticker,
                "price":      price,
                "rs_score":   rs,
                "volatility": vol,
                "selected":   False,
            })

        universe_full_data[theme_key] = theme_stocks

    # Add direct crypto themes — they are their own asset, no constituents
    selected_keys = [t for t, _ in selected]
    for crypto_key in CRYPTO_THEMES:
        if crypto_key in prices:
            universe_full_data[crypto_key] = [{
                "ticker":     crypto_key,
                "price":      prices[crypto_key],
                "rs_score":   round(scores[crypto_key] - spy_momentum, 2) if spy_momentum is not None else 0.0,
                "volatility": vols.get(crypto_key),
                "selected":   crypto_key in selected_keys,
            }]

    return {
        "date":              date_str,
        "rebalance_next":    rebalance_next,
        "theme_rankings":    theme_rankings,
        "top_themes":        frozen_top_themes,
        "picks":             frozen_picks,
        "spy_momentum":      spy_momentum,
        "universe_full_data": universe_full_data,
        "mode":              mode_label.lower(),
        "ema_filter_status": {t: filter_pass.get(t, False) for t in scores},
    }


# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════

if __name__ == "__main__":
    growth_mode = "--growth" in sys.argv

    result = generate_picks(growth_mode=growth_mode)

    print(f"\n{'='*60}")
    print(f"  RESULT  |  {result.get('date', 'N/A')}")
    print(f"{'='*60}")

    if result.get("error"):
        print(f"\n  ERROR: {result['error']}")
        sys.exit(1)

    picks = result.get("picks", [])
    if picks:
        print(f"\n  Hold {len(picks)} position(s):")
        print(f"  {'Ticker':<6}  {'Name':<22}  {'Price':>10}  {'Mom%':>8}  {'Vol%':>7}  {'Weight':>7}")
        print(f"  {'-'*66}")
        for p in picks:
            name = (p.get("name") or "")[:21]
            vol  = p["volatility"] or 0.0
            print(
                f"  {p['ticker']:<6}  {name:<22}  ${p['price']:>9.2f}"
                f"  {p['rs_score']:>+7.1f}%  {vol:>6.1f}%  {p['weight_pct']:>6.1f}%"
            )
    else:
        print("\n  No qualifying themes — strategy holds CASH")

    print(f"\n  Next rebalance : {result['rebalance_next']}")
    if result["spy_momentum"] is not None:
        print(f"  SPY 20w mom    : {result['spy_momentum']:+.1f}%")

    out_path = os.path.join(os.path.dirname(__file__), "..", "data", "picks_raw.json")
    with open(out_path, "w") as f:
        json.dump(result, f, indent=2)
    print(f"\n  Saved: {out_path}")
