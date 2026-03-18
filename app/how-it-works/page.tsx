'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NavBar } from '@/components/dashboard/NavBar';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

const STEPS = [
  {
    num: '01',
    title: 'Rank all 19 sectors by momentum',
    desc: 'On each rebalance the system calculates price momentum for all 19 sectors (17 ETFs + BTC + ETH) — 16 weeks for Balanced mode, 26 weeks for Growth mode. A multi-factor trend confirmation filter then screens for sectors in genuine uptrends only. These are sorted highest to lowest — the leaderboard you see in the Rankings tab.',
  },
  {
    num: '02',
    title: 'Select the top 1–2 sectors',
    desc: 'The top-ranked sector(s) with positive momentum become the active investment sectors. If no sectors pass the trend confirmation filter, the strategy holds cash instead of forcing a trade.',
  },
  {
    num: '03',
    title: 'Allocate to ETF or direct crypto',
    desc: 'Each winning sector is held via its ETF directly (e.g. XLK for Technology, GLD for Gold). Crypto sectors (BTC, ETH) are held as direct assets — not futures or proxies.',
  },
  {
    num: '04',
    title: 'Equal-weight between sectors',
    desc: 'In Balanced mode, each of the top 2 sectors receives 50% of capital. In Growth mode, 100% goes to the single strongest qualifying sector.',
  },
  {
    num: '05',
    title: 'Rebalance on schedule',
    desc: 'Balanced mode rebalances weekly (every 7 days). Growth mode rebalances monthly (every 30 days). At rebalance, the full process repeats — sectors are re-ranked, winners are re-selected, and the portfolio is updated accordingly.',
  },
];

const METRICS = [
  { label: 'Sectors tracked', value: '19', note: '17 ETFs + BTC + ETH' },
  { label: 'Momentum lookback', value: '16–26 weeks', note: 'Balanced: 16w · Growth: 26w' },
  { label: 'Rebalance frequency', value: 'Weekly / Monthly', note: 'Balanced: 7d · Growth: 30d' },
  { label: 'Typical positions', value: '1–2', note: 'Top 1–2 sectors, equal weight' },
  { label: 'Position sizing', value: '50 / 50', note: 'Equal-weight between sectors' },
  { label: '19-year CAGR', value: '47.72%', note: 'vs 10.80% SPY (2006–2025)' },
  { label: 'Sharpe ratio', value: '1.163', note: 'Risk-adjusted performance' },
  { label: 'Max drawdown', value: '-46.4%', note: 'Worst peak-to-trough loss' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar />

      <PageHeader
        tag="— Process"
        title="How It Works"
        sub="A systematic, rules-based momentum strategy that rotates capital into the strongest market sectors weekly or monthly. No discretionary guesswork — just price data, math, and discipline."
      />

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-14 space-y-14">

        {/* What is this — bold clarity section */}
        <section>
          {/* Big statement */}
          <div className="border border-zinc-800 rounded-2xl overflow-hidden mb-4">
            <div className="px-8 py-8 sm:px-10 sm:py-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-violet-500 mb-4">— What this is</p>
              <p className="text-2xl sm:text-3xl font-thin tracking-tight text-white leading-snug mb-3">
                Weekly rotation analysis for<br className="hidden sm:block" /> self-directed traders.
              </p>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
                Momentum Capital scans 19 market sectors every day, ranks them by quantitative momentum, and tells you which 1–2 to hold each week. <span className="text-zinc-200">You execute the trades yourself</span> in your own brokerage. Your capital stays in your account — we never touch it.
              </p>
            </div>
          </div>

          {/* 3-column clarity cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: 'The analysis',
                heading: 'Know what to hold',
                body: 'Each rebalance you get a clear output: which 1–2 sectors are strongest, target weights, and a countdown to the next rebalance. No interpretation needed.',
                accent: 'border-violet-800/40 bg-violet-950/20',
                dot: 'bg-violet-400',
              },
              {
                label: 'Your control',
                heading: 'You trade. We research.',
                body: 'This is not a robo-advisor or managed fund. We do the quantitative work — you decide when and how to act. Full control of your capital, always.',
                accent: 'border-zinc-800',
                dot: 'bg-emerald-400',
              },
              {
                label: 'Your edge',
                heading: 'Standalone or confirmation',
                body: 'Run it as a complete rules-based strategy, or use the momentum rankings as quantitative confirmation alongside your own analysis. Either way works.',
                accent: 'border-zinc-800',
                dot: 'bg-blue-400',
              },
            ].map(({ label, heading, body, accent, dot }) => (
              <div key={label} className={`border ${accent} rounded-2xl px-5 py-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</span>
                </div>
                <p className="text-zinc-100 font-medium text-sm mb-2">{heading}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Strategy overview */}
        <section>
          <div className="mb-5">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-500">overview</p>
            <h2 className="text-2xl font-light tracking-tight text-white">The Strategy</h2>
          </div>
          <GlassCard>
            <div className="px-6 pt-6 pb-6 space-y-4 text-sm text-zinc-300 leading-relaxed">
              <p>
                Momentum rotation is built on a well-documented phenomenon in financial markets: assets that have recently outperformed tend to continue outperforming over the next 1–12 months. This effect has been observed across equities, commodities, currencies, and fixed income for decades.
              </p>
              <p>
                Instead of picking individual stocks bottom-up, the strategy first identifies <span className="text-zinc-100 font-medium">which market segment</span> has the strongest trend, then drills down to find the <span className="text-zinc-100 font-medium">best stocks within that segment</span>. This top-down filtering dramatically reduces the universe and focuses capital on the highest-probability opportunities.
              </p>
              <p>
                The result is a concentrated portfolio of 1–2 positions, rebalanced weekly (Balanced) or monthly (Growth), that systematically rotates toward market strength.
              </p>
              <p>
                The strategy has been backtested over 19 years (2006–2025), delivering <span className="text-zinc-100 font-medium">47.72% CAGR</span> (Balanced) vs SPY&apos;s 10.80% over the same period.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* Universe classification */}
        <section>
          <div className="mb-5">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-500">universe</p>
            <h2 className="text-2xl font-light tracking-tight text-white">Universe Classification</h2>
          </div>
          <GlassCard>
            <div className="px-6 pt-6 pb-6 space-y-4 text-sm text-zinc-300 leading-relaxed">
              <p>
                The investable universe spans <span className="text-zinc-100 font-medium">19 sectors</span>: 17 sector and commodity ETFs plus direct BTC and ETH. A proprietary trend confirmation filter ensures we only allocate to sectors in genuine uptrends — not just any market with recent price movement.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">US Equities (11)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Technology', 'Financials', 'Healthcare', 'Energy', 'Consumer Cyclical', 'Consumer Defensive', 'Industrials', 'Materials', 'Utilities', 'Real Estate', 'Comm. Services'].map(t => (
                      <Badge key={t} variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Commodities &amp; Alternatives (7)</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Gold', 'Silver', 'Copper', 'Uranium', 'Lithium', 'Clean Energy', 'Crypto'].map(t => (
                      <Badge key={t} variant="outline" className="border-zinc-700 text-zinc-400 text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p>
                The universe is refreshed monthly. Stocks that have been acquired, delisted, suspended, or lost liquidity are automatically replaced with active alternatives. You can explore each sector&apos;s full constituent list on the{' '}
                <Link href="/rankings" className="text-violet-400 hover:text-violet-300 transition-colors">Rankings page</Link>.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* Selection process */}
        <section>
          <div className="mb-5">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-500">selection</p>
            <h2 className="text-2xl font-light tracking-tight text-white">Selection Process</h2>
          </div>
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-violet-950/60 border border-violet-800/50 flex items-center justify-center text-violet-400 font-mono text-xs font-semibold shrink-0">
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-zinc-800 mt-2" />
                  )}
                </div>
                <div className="pb-6 pt-1.5 flex-1">
                  <p className="text-zinc-100 font-medium text-sm mb-1">{step.title}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rebalancing timeline */}
        <section>
          <div className="mb-5">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-500">cadence</p>
            <h2 className="text-2xl font-light tracking-tight text-white">Rebalancing Timeline</h2>
          </div>
          <GlassCard>
            <div className="px-6 pt-6 pb-6 space-y-4 text-sm text-zinc-300 leading-relaxed">
              <p>
                Rebalance frequency depends on your mode. <span className="text-zinc-100 font-medium">Balanced mode</span> rebalances every <span className="text-zinc-100 font-medium">7 days (weekly)</span>. <span className="text-zinc-100 font-medium">Growth mode</span> rebalances every <span className="text-zinc-100 font-medium">30 days (monthly)</span>. The countdown to the next rebalance is displayed on the Live Picks and Performance pages.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Balanced — weekly rebalance', 'Growth — monthly rebalance'].map(q => (
                  <div key={q} className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-md font-mono">{q}</div>
                ))}
              </div>
              <p>
                On rebalance day: re-rank all sectors, select new winners, sell outgoing positions, buy incoming picks, and adjust sizing to the new weights. The process typically takes 15–30 minutes to execute through a standard brokerage.
              </p>
            </div>
          </GlassCard>
        </section>

        {/* Backtested results */}
        <section>
          <div className="mb-5">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-500">performance</p>
            <h2 className="text-2xl font-light tracking-tight text-white">Backtested Results</h2>
          </div>
          <GlassCard>
            <div className="px-6 pt-6 pb-6 space-y-5">
              <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg px-4 py-3 text-amber-300/80 text-xs leading-relaxed">
                The figures below are from a historical backtest using the same rules applied to past price data. Backtests are hypothetical — they do not reflect actual trading, do not account for all costs, and past results are not predictive of future performance.
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {METRICS.map(m => (
                  <div key={m.label} className="bg-zinc-800/50 rounded-lg p-3">
                    <p className="text-zinc-400 text-xs mb-1">{m.label}</p>
                    <p className="text-zinc-100 font-semibold text-lg font-mono">{m.value}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{m.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Getting started */}
        <section>
          <div className="mb-5">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-500">start</p>
            <h2 className="text-2xl font-light tracking-tight text-white">Getting Started</h2>
          </div>
          <GlassCard>
            <div className="px-6 pt-6 pb-6 space-y-3 text-sm">
              {[
                { step: '1', text: 'Check the Live Picks page for current picks and their target weights.', href: '/', label: 'Live Picks' },
                { step: '2', text: 'Review the Rankings page to understand which sectors are leading and why.', href: '/rankings', label: 'Rankings' },
                { step: '3', text: 'Check the Performance page to see momentum metrics and the next rebalance date.', href: '/performance', label: 'Performance' },
                { step: '4', text: 'Execute trades through your own brokerage on or near the rebalance date.', href: null, label: null },
                { step: '5', text: 'Repeat on schedule. The system does the analysis — your job is disciplined execution.', href: null, label: null },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-mono shrink-0 mt-0.5">
                    {item.step}
                  </div>
                  <p className="text-zinc-300 leading-relaxed flex-1">
                    {item.text}
                    {item.href && (
                      <Link href={item.href} className="ml-1.5 inline-flex items-center gap-0.5 text-violet-400 hover:text-violet-300 transition-colors">
                        {item.label} <ArrowRight size={11} />
                      </Link>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

      </main>

    </div>
  );
}
