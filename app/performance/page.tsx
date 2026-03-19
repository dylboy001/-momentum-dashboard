'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { NavBar } from '@/components/dashboard/NavBar';
import { EquityCurveChart } from '@/components/dashboard/EquityCurveChart';
import { GlassCard } from '@/components/ui/glass-card';
import { RegimeBreakdown } from '@/components/performance/RegimeBreakdown';
import { MethodologyExplainer } from '@/components/performance/MethodologyExplainer';

interface EquityCurveData {
  data: { date: string; strategy: number; spy: number }[];
  final: { strategy: number; spy: number };
}

function StatSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-32 bg-zinc-800" />
      <Skeleton className="h-3 w-20 bg-zinc-800" />
      <Skeleton className="h-3 w-28 bg-zinc-800" />
    </div>
  );
}

type ChartMode = 'balanced' | 'growth';

const CHART_MODES: { id: ChartMode; label: string; cagr: string; maxdd: string; final: string }[] = [
  { id: 'balanced', label: 'Balanced',  cagr: '47.72%', maxdd: '-46.4%', final: '$21.5M' },
  { id: 'growth',   label: 'Growth',    cagr: '61.34%', maxdd: '-75.9%', final: '$121.9M' },
];

export default function PerformancePage() {
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [equityData, setEquityData] = useState<EquityCurveData | null>(null);
  const [chartMode, setChartMode] = useState<ChartMode>('balanced');

  // Initial load
  useEffect(() => {
    fetch('/api/equity-curve?mode=balanced', { cache: 'no-store' })
      .then(r => r.json())
      .then(json => { if (!json.error) setEquityData(json); })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  // Reload when mode changes (skip the initial mount — handled above)
  const isFirstRender = useState(true);
  useEffect(() => {
    if (isFirstRender[0]) { isFirstRender[1](false); return; }
    setChartLoading(true);
    fetch(`/api/equity-curve?mode=${chartMode}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(json => { if (!json.error) setEquityData(json); })
      .catch(() => null)
      .finally(() => setChartLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartMode]);

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Page header + CTA to Dashboard */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-thin tracking-tight text-white">Performance</h1>
            <p className="text-zinc-400 text-sm mt-1">19-year historical proof · 2006 – 2025 · trend-confirmed momentum vs S&amp;P 500</p>
          </div>
          <Link
            href="/rankings"
            className="group inline-flex items-center gap-2 border border-violet-800/50 hover:border-violet-600 bg-violet-950/20 hover:bg-violet-950/40 rounded-xl px-4 py-2.5 transition-colors self-start md:self-auto"
          >
            <TrendingUp size={13} className="text-violet-400" />
            <span className="text-sm text-violet-300 group-hover:text-violet-200 transition-colors">View theme rankings</span>
            <ArrowUpRight size={13} className="text-violet-400/60 group-hover:text-violet-300 transition-colors" />
          </Link>
        </div>

        {/* ── Headline backtest stats ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-zinc-800">
          {(chartMode === 'balanced' ? [
            { label: 'CAGR', value: '47.72%', sub: 'annualised', color: 'text-emerald-400' },
            { label: 'Sharpe Ratio', value: '1.163', sub: 'risk-adjusted return', color: 'text-white' },
            { label: 'Max Drawdown', value: '-46.4%', sub: 'worst peak-to-trough', color: 'text-white' },
            { label: 'vs SPY', value: '+36.92%', sub: 'annually above benchmark', color: 'text-emerald-400' },
          ] : [
            { label: 'CAGR', value: '61.34%', sub: 'annualised', color: 'text-emerald-400' },
            { label: 'Sharpe Ratio', value: '1.065', sub: 'risk-adjusted return', color: 'text-white' },
            { label: 'Max Drawdown', value: '-75.9%', sub: 'worst peak-to-trough', color: 'text-red-400' },
            { label: 'vs SPY', value: '+50.54%', sub: 'annually above benchmark', color: 'text-emerald-400' },
          ]).map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 }}
              className={`py-8 text-center ${i > 0 ? 'border-t md:border-t-0 md:border-l md:pl-8 border-zinc-800' : ''} ${i < 3 ? 'md:pr-8' : ''}`}
            >
              {loading ? <StatSkeleton /> : (
                <>
                  <p className={`font-mono text-[3rem] font-thin leading-none tabular-nums mb-3 ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-zinc-500 mb-1">{stat.label}</p>
                  <p className="text-xs text-zinc-600">{stat.sub}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>

        
        {/* ── Two portfolio modes ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600 mb-2">— Portfolio Modes</p>
            <h2 className="text-xl font-thin tracking-tight text-white">Choose your risk profile</h2>
            <p className="text-zinc-400 text-sm mt-1">Both modes use the same strategy. The only difference is concentration.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Balanced */}
            <div className="border border-violet-800/40 bg-violet-950/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-violet-400">Balanced</span>
                  <p className="text-zinc-500 text-xs mt-0.5">Recommended · Top 2 sectors · 50% each</p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border text-violet-400 border-violet-800/60 bg-violet-950/30">
                  Pro
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-mono text-3xl font-thin text-emerald-400 tabular-nums">47.72%</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mt-1">CAGR</p>
                </div>
                <div>
                  <p className="font-mono text-3xl font-thin text-white tabular-nums">1.163</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mt-1">Sharpe</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-thin text-white tabular-nums">-46.4%</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mt-1">Max DD</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-thin text-emerald-400 tabular-nums">$21.5M</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mt-1">$10k → (19yr)</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Holds the top 2 qualifying sectors equally weighted. Better risk-adjusted returns, shallower drawdowns. Suitable for most investors.</p>
            </div>
            {/* Growth */}
            <div className="border border-zinc-800 bg-zinc-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-300">Growth</span>
                  <p className="text-zinc-500 text-xs mt-0.5">Aggressive · Top 1 sector · 100% concentration</p>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border text-zinc-400 border-zinc-700 bg-zinc-800/40">
                  Premium
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="font-mono text-3xl font-thin text-emerald-400 tabular-nums">61.34%</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mt-1">CAGR</p>
                </div>
                <div>
                  <p className="font-mono text-3xl font-thin text-white tabular-nums">1.065</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mt-1">Sharpe</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-thin text-red-400 tabular-nums">-75.9%</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mt-1">Max DD</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-thin text-emerald-400 tabular-nums">$121.9M</p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600 mt-1">$10k → (19yr)</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Concentrates 100% in the single strongest qualifying sector. Higher return potential but -75.9% drawdowns require strong conviction and long time horizons.</p>
            </div>
          </div>
        </motion.div>

        {/* ── 19-year equity curve ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
        <GlassCard>
          <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                19-Year Performance Comparison (2006–2025)
              </span>
              <p className="text-xs text-zinc-600 mt-1">Momentum Strategy vs S&amp;P 500 — logarithmic scale</p>
            </div>
            {/* Mode toggle */}
            <div className="flex items-center gap-1 bg-zinc-800/60 rounded-lg p-1 self-start sm:self-auto">
              {CHART_MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setChartMode(m.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                    chartMode === m.id
                      ? 'bg-violet-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          {/* Mode stats strip */}
          {(() => {
            const m = CHART_MODES.find(x => x.id === chartMode)!;
            return (
              <div className="px-6 py-3 border-b border-zinc-800/40 flex items-center gap-6 flex-wrap">
                {[
                  { label: 'CAGR', value: m.cagr, color: 'text-emerald-400' },
                  { label: 'Max DD', value: m.maxdd, color: chartMode === 'growth' ? 'text-red-400' : 'text-zinc-300' },
                  { label: '$10k →', value: m.final, color: 'text-emerald-400' },
                ].map(s => (
                  <div key={s.label} className="flex items-baseline gap-1.5">
                    <span className={`font-mono text-sm tabular-nums ${s.color}`}>{s.value}</span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-600">{s.label}</span>
                  </div>
                ))}
                {chartMode === 'growth' && (
                  <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.15em] text-amber-500/80">
                    High drawdown — experienced investors only
                  </span>
                )}
              </div>
            );
          })()}
          <div className="px-6 py-6">
            {loading || chartLoading ? (
              <Skeleton className="h-72 w-full bg-zinc-800" />
            ) : equityData ? (
              <>
                <EquityCurveChart
                  data={equityData.data}
                  finalStrategy={equityData.final.strategy}
                  finalSpy={equityData.final.spy}
                  strategyLabel={chartMode === 'growth' ? 'Growth Mode' : 'Balanced Mode'}
                />
                <p className="text-xs text-zinc-600 mt-4 leading-relaxed">
                  Backtested on 17 ETFs + BTC + ETH. EMA 10/100 daily trend filter applied at entry. Point-in-time clean — no survivorship bias.
                  No dividends included. Past performance does not guarantee future results.
                </p>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-zinc-600 text-sm">
                No equity curve data available.
              </div>
            )}
          </div>
        </GlassCard>
        </motion.div>

        {/* ── Performance across key market regimes ────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
        <div>
          <div className="mb-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600 mb-2">— Market Regimes</p>
            <h2 className="text-xl font-thin tracking-tight text-white">How it performed when it mattered most</h2>
            <p className="text-zinc-400 text-sm mt-1">Strategy vs S&amp;P 500 during major market dislocations</p>
          </div>
          <RegimeBreakdown mode={chartMode} />
        </div>
        </motion.div>

        {/* ── Detailed metrics table ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
        <GlassCard>
          <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/40">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Detailed Backtest Metrics</span>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {(chartMode === 'balanced' ? [
                { label: 'CAGR (Annualised Return)', strategy: '47.72%', spy: '10.80%', better: true },
                { label: 'Sharpe Ratio', strategy: '1.163', spy: '0.590', better: true },
                { label: 'Max Drawdown', strategy: '-46.4%', spy: '-55.2%', better: true },
                { label: 'vs SPY (annual alpha)', strategy: '+36.92%', spy: '—', better: null },
                { label: 'Lookback Period', strategy: '16 weeks', spy: '—', better: null },
                { label: 'Concentration', strategy: 'Top 2 sectors · 50% each', spy: '—', better: null },
                { label: 'Entry Filter', strategy: 'EMA 10/100 uptrend', spy: '—', better: null },
                { label: 'Rebalance Cadence', strategy: 'Weekly (7 days)', spy: '—', better: null },
              ] : [
                { label: 'CAGR (Annualised Return)', strategy: '61.34%', spy: '10.80%', better: true },
                { label: 'Sharpe Ratio', strategy: '1.065', spy: '0.590', better: true },
                { label: 'Max Drawdown', strategy: '-75.9%', spy: '-55.2%', better: false },
                { label: 'vs SPY (annual alpha)', strategy: '+50.54%', spy: '—', better: null },
                { label: 'Lookback Period', strategy: '26 weeks', spy: '—', better: null },
                { label: 'Concentration', strategy: 'Top 1 sector · 100%', spy: '—', better: null },
                { label: 'Entry Filter', strategy: 'EMA 10/100 uptrend', spy: '—', better: null },
                { label: 'Rebalance Cadence', strategy: 'Monthly (30 days)', spy: '—', better: null },
              ]).map((row) => (
                <div key={row.label} className="flex items-center justify-between py-3 border-b border-zinc-800/60 last:border-0">
                  <span className="text-sm text-zinc-400">{row.label}</span>
                  <div className="flex items-center gap-4 font-mono text-sm">
                    <span className={row.better === true ? 'text-emerald-400' : row.better === false ? 'text-red-400' : 'text-zinc-300'}>
                      {row.strategy}
                    </span>
                    <span className="text-zinc-600 w-16 text-right">{row.spy}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-800 font-mono text-[10px] text-zinc-600">
              <span className="flex items-center gap-1.5"><span className="text-emerald-400">■</span> Strategy</span>
              <span className="flex items-center gap-1.5"><span className="text-zinc-500">■</span> S&P 500 (SPY)</span>
            </div>
          </div>
        </GlassCard>
        </motion.div>

        {/* ── Methodology & Education ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
        <div>
          <div className="mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600 mb-2">— Methodology</p>
            <h2 className="text-xl font-thin tracking-tight text-white">How it works</h2>
          </div>
          <GlassCard>
            <div className="px-6 py-2">
              <MethodologyExplainer />
            </div>
          </GlassCard>
        </div>
        </motion.div>

        {/* ── CTA to Dashboard ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
        <GlassCard className="dark:bg-gradient-to-br dark:from-violet-950/20 dark:to-transparent">
          <div className="px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-lg font-thin text-white mb-1">Ready to put this strategy to work?</p>
              <p className="text-sm text-zinc-400">Get live picks, rebalance alerts, and full position sizing — starting at $49/month.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-600 text-zinc-300 hover:text-white rounded-xl px-5 py-3 text-sm font-medium transition-colors"
              >
                <BarChart2 size={14} />
                See current picks
              </Link>
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl px-6 py-3 text-sm font-medium transition-colors"
              >
                Get Pro Access
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </GlassCard>
        </motion.div>

        <p className="text-xs text-zinc-700 leading-relaxed text-center pb-4">
          Backtested on 17 sector/commodity ETFs plus direct BTC and ETH using the same rules applied to past price data.
          Hypothetical results — past performance does not guarantee future returns.
        </p>

      </main>
    </div>
  );
}
