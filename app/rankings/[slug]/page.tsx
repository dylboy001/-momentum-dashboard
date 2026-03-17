'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { NavBar } from '@/components/dashboard/NavBar';
import { GlassCard } from '@/components/ui/glass-card';
import { ArrowUpRight, ArrowDownRight, ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { THEME_NAMES, THEME_CATEGORIES } from '@/lib/theme-data';

// Top stocks per theme — curated for liquidity and relevance
const UNIVERSE: Record<string, string[]> = {
  XLK:  ['AAPL','MSFT','NVDA','GOOGL','META','AVGO','AMD','ORCL','ADBE','CRM','QCOM','NOW'],
  XLF:  ['JPM','BAC','GS','MS','WFC','BLK','AXP','SCHW','SPGI','CME','C','MCO'],
  XLV:  ['UNH','LLY','JNJ','ABBV','MRK','TMO','ISRG','AMGN','VRTX','DHR','REGN','ABT'],
  XLE:  ['XOM','CVX','COP','EOG','SLB','MPC','PSX','VLO','OXY','HAL','DVN','BKR'],
  XLY:  ['AMZN','TSLA','HD','MCD','NKE','BKNG','LOW','TJX','SBUX','MAR','CMG','TGT'],
  XLP:  ['WMT','COST','PG','KO','PEP','PM','MO','CL','MDLZ','KMB','HSY','SYY'],
  XLI:  ['GE','CAT','RTX','HON','LMT','UNP','UPS','ETN','DE','ITW','BA','CSX'],
  XLB:  ['LIN','SHW','APD','ECL','FCX','NEM','NUE','DOW','ALB','VMC','PPG','MLM'],
  XLU:  ['NEE','SO','DUK','AEP','SRE','EXC','D','XEL','PEG','WEC','ES','AWK'],
  XLRE: ['PLD','AMT','EQIX','CCI','PSA','DLR','WELL','O','VICI','AVB','EQR','SBAC'],
  XLC:  ['META','GOOGL','NFLX','DIS','CMCSA','T','VZ','TMUS','EA','CHTR','TTWO','LYV'],
  GLD:  ['NEM','GOLD','AEM','FNV','WPM','KGC','RGLD','AU','AGI','BTG'],
  SLV:  ['PAAS','AG','HL','CDE','EXK','FSM','SVM','SSRM'],
  CPER: ['FCX','SCCO','BHP','RIO','VALE','TECK','HBM','ERO'],
  URA:  ['CCJ','UUUU','DNN','UEC','NXE','EU','URG','UROY'],
  ICLN: ['ENPH','FSLR','RUN','SEDG','CSIQ','JKS','FLNC','ARRY','MAXN'],
  BITO: ['COIN','MSTR','MARA','RIOT','CLSK','HUT','BITF','CIFR','CORZ','IREN'],
  BTC:  [],  // direct asset — price data from universe_full_data
  ETH:  [],  // direct asset — price data from universe_full_data
};

interface UniverseStock {
  ticker: string;
  name?: string;
  price: number;
  rs_score: number | null;
  volatility: number | null;
  selected: boolean;
}

interface PicksData {
  date: string;
  rebalance_next: string;
  theme_rankings: [string, number][];
  top_themes: string[];
  spy_momentum: number | null;
  universe_full_data?: Record<string, UniverseStock[]>;
}

export default function ThemeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const theme = slug.toUpperCase();

  const [data, setData] = useState<PicksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type SortCol = 'price' | 'rs_score' | 'volatility';
  const [sortCol, setSortCol] = useState<SortCol>('rs_score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function handleSort(col: SortCol) {
    if (sortCol === col) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  }

  useEffect(() => {
    fetch('/api/picks', { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        if (json.error) setError(json.detail ?? json.error);
        else setData(json);
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const themeRank = data?.theme_rankings.findIndex(([t]) => t === theme) ?? -1;
  const themeMomentum = data?.theme_rankings.find(([t]) => t === theme)?.[1] ?? null;
  const isActive = data?.top_themes.includes(theme) ?? false;
  const constituents = UNIVERSE[theme] ?? [];
  const universeStockData = data?.universe_full_data?.[theme] ?? [];
  const universeStockMap = new Map(universeStockData.map(s => [s.ticker, s]));

  // Prefer live universe_full_data (updated by scanner) over hardcoded list
  // Falls back to hardcoded UNIVERSE only if scanner hasn't run yet
  const rows = universeStockData.length > 0
    ? universeStockData.map(s => ({ ticker: s.ticker, uStock: s }))
    : constituents.map(ticker => ({ ticker, uStock: universeStockMap.get(ticker) }));

  const sortedRows = [...rows]
    .sort((a, b) => {
      const dir = sortDir === 'desc' ? -1 : 1;
      let aVal: number | null = null;
      let bVal: number | null = null;
      switch (sortCol) {
        case 'price':      aVal = a.uStock?.price ?? null;       bVal = b.uStock?.price ?? null;       break;
        case 'rs_score':   aVal = a.uStock?.rs_score ?? null;    bVal = b.uStock?.rs_score ?? null;    break;
        case 'volatility': aVal = a.uStock?.volatility ?? null;  bVal = b.uStock?.volatility ?? null;  break;
      }
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      return (aVal - bVal) * dir;
    });

  const vsSpy = themeMomentum != null && data?.spy_momentum != null
    ? themeMomentum - data.spy_momentum
    : null;
  const themeName = THEME_NAMES[theme] ?? theme;

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* Breadcrumb + heading */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/rankings"
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <ArrowLeft size={11} /> Rankings
            </Link>
            <span className="font-mono text-[11px] text-zinc-700">/</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">{themeName}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-thin tracking-tight text-white">{themeName}</h1>
            <span className="font-mono text-sm text-zinc-500 bg-zinc-800/60 px-2.5 py-0.5 rounded">{theme}</span>
            {isActive && (
              <Badge className="bg-violet-900/50 text-violet-300 border-violet-700 text-xs">Active</Badge>
            )}
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            {THEME_CATEGORIES[theme] ?? 'Other'}{data?.date ? ` · as of ${data.date}` : ''}
          </p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-800/60 rounded-xl px-4 py-3 text-red-300 text-sm">{error}</div>
        )}

        {/* Stat cards — 4-column strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <GlassCard className="px-5 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">Rank</p>
            {loading ? <Skeleton className="h-8 w-16 bg-zinc-800" /> : (
              <div className="text-3xl font-thin text-zinc-100 tabular-nums">
                {themeRank >= 0 ? `#${themeRank + 1}` : '—'}
                <span className="text-sm text-zinc-600 ml-1">/ {data?.theme_rankings.length ?? '—'}</span>
              </div>
            )}
          </GlassCard>

          <GlassCard className="px-5 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">Momentum</p>
            {loading ? <Skeleton className="h-8 w-24 bg-zinc-800" /> : (
              <div className={`text-3xl font-thin tabular-nums flex items-center gap-1 ${
                (themeMomentum ?? 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {(themeMomentum ?? 0) >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                {themeMomentum != null ? `${themeMomentum >= 0 ? '+' : ''}${themeMomentum.toFixed(2)}%` : '—'}
              </div>
            )}
          </GlassCard>

          <GlassCard className="px-5 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">vs SPY</p>
            {loading ? <Skeleton className="h-8 w-24 bg-zinc-800" /> : (
              <div className={`text-3xl font-thin tabular-nums ${
                vsSpy == null ? 'text-zinc-600' : vsSpy >= 0 ? 'text-blue-400' : 'text-red-400'
              }`}>
                {vsSpy != null ? `${vsSpy >= 0 ? '+' : ''}${vsSpy.toFixed(2)}%` : '—'}
              </div>
            )}
          </GlassCard>

          <GlassCard className="px-5 py-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 mb-3">{constituents.length > 0 ? 'Sector Stocks' : 'Asset Type'}</p>
            <div className="text-3xl font-thin text-zinc-100 tabular-nums">
              {rows.length > 0 ? (
                <>{rows.length}<span className="text-sm text-zinc-600 ml-1">tracked</span></>
              ) : (
                <span className="text-lg text-zinc-300">Direct</span>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Context banner */}
        <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-4">
          <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-violet-400 shrink-0" />
          <div>
            {constituents.length > 0 ? (
              <>
                <p className="text-sm text-zinc-300 font-medium">
                  Strategy trades <span className="font-mono text-violet-300">{theme}</span> ETF directly
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Individual stocks below are shown for reference — useful for spotting what&apos;s leading within the theme. The portfolio holds the ETF, not these stocks.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-zinc-300 font-medium">
                  Strategy holds <span className="font-mono text-violet-300">{themeName}</span> directly via spot
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  This is a direct crypto position — no constituent stocks. The portfolio holds {themeName} itself.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Stock table */}
        <GlassCard>
          <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/40 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              {constituents.length > 0 ? 'Sector Stocks · Momentum Reference' : 'Direct Asset · Live Price'}
            </span>
            <span className="font-mono text-[11px] text-zinc-600">
              sorted by relative strength vs theme · live data when available
            </span>
          </div>
          {rows.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-8">No universe data for this theme.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="pl-6 text-sm">Ticker</TableHead>
                  <TableHead className="text-right text-sm">
                    <button onClick={() => handleSort('price')} className="flex items-center gap-1 ml-auto hover:text-zinc-100 transition-colors">
                      Price
                      {sortCol === 'price'
                        ? sortDir === 'desc' ? <ChevronDown size={12} className="text-violet-400" /> : <ChevronUp size={12} className="text-violet-400" />
                        : <ChevronDown size={12} className="text-zinc-600" />}
                    </button>
                  </TableHead>
                  <TableHead className="text-right text-sm">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => handleSort('rs_score')} className="flex items-center gap-1 ml-auto hover:text-zinc-100 transition-colors underline decoration-dotted underline-offset-2">
                          RS vs Theme
                          {sortCol === 'rs_score'
                            ? sortDir === 'desc' ? <ChevronDown size={12} className="text-violet-400" /> : <ChevronUp size={12} className="text-violet-400" />
                            : <ChevronDown size={12} className="text-zinc-600" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                        Stock&apos;s 16-week momentum minus the theme&apos;s momentum. Positive = outperforming its sector.
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="text-right pr-6 text-sm">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button onClick={() => handleSort('volatility')} className="flex items-center gap-1 ml-auto hover:text-zinc-100 transition-colors underline decoration-dotted underline-offset-2">
                          Volatility
                          {sortCol === 'volatility'
                            ? sortDir === 'desc' ? <ChevronDown size={12} className="text-violet-400" /> : <ChevronUp size={12} className="text-violet-400" />
                            : <ChevronDown size={12} className="text-zinc-600" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                        Annualised 60-day volatility.
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map(({ ticker, uStock }) => {
                  const isLeading = uStock?.rs_score != null && uStock.rs_score > 5;
                  return (
                    <TableRow
                      key={ticker}
                      className="border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-2.5">
                          {isLeading && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />}
                          <div>
                            <span className="font-mono font-bold text-sm text-zinc-300">
                              {ticker}
                            </span>
                            {uStock?.name && (
                              <span className="block text-xs text-zinc-500 font-sans font-normal mt-0.5 leading-tight">
                                {uStock.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-zinc-300 py-4">
                        {uStock?.price != null ? `$${uStock.price.toFixed(2)}` : <span className="text-zinc-700">—</span>}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm py-4">
                        {uStock?.rs_score != null
                          ? <span className={uStock.rs_score >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                              {uStock.rs_score >= 0 ? '+' : ''}{uStock.rs_score.toFixed(2)}
                            </span>
                          : <span className="text-zinc-700">—</span>
                        }
                      </TableCell>
                      <TableCell className="text-right pr-6 font-mono text-sm text-zinc-400 py-4">
                        {uStock?.volatility != null ? `${uStock.volatility.toFixed(1)}%` : <span className="text-zinc-700">—</span>}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </GlassCard>

      </main>
    </div>
  );
}
