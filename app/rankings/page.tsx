'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowUpRight, ArrowDownRight, Lock } from 'lucide-react';
import { NavBar } from '@/components/dashboard/NavBar';
import { THEME_NAMES, THEME_CATEGORIES } from '@/lib/theme-data';
import { GlassCard } from '@/components/ui/glass-card';

interface PicksData {
  theme_rankings: [string, number][];
  date: string;
  spy_momentum: number | null;
}

export default function RankingsPage() {
  const [data, setData] = useState<PicksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* Page header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600 mb-2">— Rankings</p>
          <h1 className="text-3xl font-thin tracking-tight text-white">Sector Rankings</h1>
          <p className="text-zinc-400 text-sm mt-2">
            {data ? `as of ${data.date}` : 'Ranked by 16–26 week momentum'}
            {' '}· click any row to drill into constituent stocks
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-950/40 border border-red-800/60 rounded-xl px-4 py-3 text-red-300 text-sm">{error}</div>
        )}

        <GlassCard>
          {/* Table header */}
          <div className="grid grid-cols-[56px_1fr_130px_150px_160px_160px] gap-4 px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/40">
            <div className="text-sm text-zinc-500 uppercase tracking-wider text-center">Rank</div>
            <div className="text-sm text-zinc-500 uppercase tracking-wider">Sector</div>
            <div className="text-sm text-zinc-500 uppercase tracking-wider">Category</div>
            <Tooltip>
              <TooltipTrigger className="text-sm text-zinc-500 uppercase tracking-wider cursor-help underline decoration-dotted underline-offset-2 text-left">
                Momentum
              </TooltipTrigger>
              <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                16-week price return of the sector&apos;s proxy ETF (e.g. BITO for Crypto, XLK for Technology). Higher = stronger trend.
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className="text-sm text-zinc-500 uppercase tracking-wider cursor-help underline decoration-dotted underline-offset-2 text-left">
                vs SPY
              </TooltipTrigger>
              <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                Sector momentum minus SPY&apos;s 16-week momentum. Positive = beating the market. Only shown when scanner has run recently.
              </TooltipContent>
            </Tooltip>
            <div className="text-sm text-zinc-500 uppercase tracking-wider">Status</div>
          </div>

          {loading && (
            <div className="px-6 py-6 space-y-4">
              {[...Array(10)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full bg-zinc-800" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="px-6 py-12 text-center text-zinc-500 text-sm">{error}</div>
          )}

          {data && (
            <div>
              {data.theme_rankings.map(([theme, momentum], i) => {
                const isPositive = momentum >= 0;

                return (
                  <Link
                    key={theme}
                    href={`/rankings/${theme}`}
                    className="relative grid grid-cols-[56px_1fr_130px_150px_160px_160px] gap-4 px-6 py-4 border-b border-zinc-800/50 transition-colors duration-150 items-center cursor-pointer group last:border-0 hover:bg-zinc-800/40"
                  >
                    <div className="absolute left-0 top-0 h-full w-[2px] rounded-r bg-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                    <div className="text-center font-mono text-zinc-500 text-sm">
                      #{i + 1}
                    </div>

                    <div>
                      <div className="text-zinc-100 font-medium text-base group-hover:text-violet-400 transition-colors">
                        {THEME_NAMES[theme] ?? theme}
                      </div>
                      <div className="text-zinc-600 text-sm font-mono">{theme}</div>
                    </div>

                    <div>
                      <span className="text-sm px-2 py-1 rounded bg-zinc-800/60 text-zinc-400 font-medium">
                        {THEME_CATEGORIES[theme] ?? 'Other'}
                      </span>
                    </div>

                    <div className={`font-mono font-semibold text-sm flex items-center gap-1 ${
                      isPositive ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {isPositive ? '+' : ''}{momentum.toFixed(2)}%
                    </div>

                    <div className="font-mono text-sm">
                      {data.spy_momentum != null ? (() => {
                        const vsSpy = momentum - data.spy_momentum!;
                        return (
                          <span className={vsSpy >= 0 ? 'text-blue-400' : 'text-red-400'}>
                            {vsSpy >= 0 ? '+' : ''}{vsSpy.toFixed(2)}%
                          </span>
                        );
                      })() : <span className="text-zinc-700">—</span>}
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-600">
                      <Lock size={11} className="shrink-0" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.15em]">Pro</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </GlassCard>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Momentum = 16-week price return of sector proxy ETF ·{' '}
          <Link
            href="/pricing"
            className="text-violet-400 hover:text-violet-300 underline underline-offset-2 decoration-violet-500/40 hover:decoration-violet-400/70 transition-colors font-medium"
          >
            Upgrade to Pro
          </Link>
          {' '}to see which sectors are currently held
        </p>
      </main>
    </div>
  );
}
