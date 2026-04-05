'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { PicksTable } from '@/components/dashboard/PicksTable'
import { ThemeRankings } from '@/components/dashboard/ThemeRankings'
import { RebalanceTimer } from '@/components/dashboard/RebalanceTimer'
import { PortfolioAllocation } from '@/components/dashboard/PortfolioAllocation'
import { NavBar } from '@/components/dashboard/NavBar'
import { ProLock } from '@/components/ui/pro-lock'
import { RefreshCw, AlertTriangle, BarChart2 } from 'lucide-react'
import { THEME_NAMES } from '@/lib/theme-data'
import { GlassCard } from '@/components/ui/glass-card'

const REFRESH_INTERVAL = 60 * 1000

interface Pick {
  ticker: string
  theme: string
  price: number
  rs_score: number
  volatility: number | null
  weight_pct: number
}

interface PicksData {
  date: string
  rebalance_next: string
  theme_rankings: [string, number][]
  top_themes: string[]
  picks: Pick[]
  last_generated: string
  mode?: 'balanced' | 'growth'
  error?: string
  detail?: string
}

function secondsAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function DashboardPage() {
  const [data, setData] = useState<PicksData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<string | null>(null)
  const [secondsSince, setSecondsSince] = useState(0)

  const fetchPicks = useCallback(async () => {
    try {
      const res = await fetch('/api/picks', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) {
        setError(json.detail ?? json.error ?? 'Failed to load picks')
        setData(null)
      } else {
        setData(json)
        setError(null)
        setLastFetched(new Date().toISOString())
      }
    } catch {
      setError('Network error — could not reach /api/picks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPicks()
    const id = setInterval(fetchPicks, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetchPicks])

  useEffect(() => {
    if (!lastFetched) return
    const id = setInterval(() => {
      setSecondsSince(Math.floor((Date.now() - new Date(lastFetched).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [lastFetched])

  const topTheme = data?.top_themes[0]
  const topMomentum = data?.theme_rankings.find(([t]) => t === topTheme)?.[1]

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background — gives backdrop-blur something to catch */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar rightContent={
        <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-500">
          {loading && <RefreshCw size={11} className="animate-spin text-violet-400" />}
          {lastFetched && !loading && (
            <span>
              refreshed <span className="text-zinc-300">{secondsSince}s ago</span>
              {' '}· next in <span className="text-zinc-300">{60 - (secondsSince % 60)}s</span>
            </span>
          )}
          {data?.last_generated && (
            <span className="text-zinc-600">data: {secondsAgo(data.last_generated)}</span>
          )}
        </div>
      } />

      <ProLock>
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-5">

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-thin tracking-tight text-white">Dashboard</h1>
              {data?.mode && (
                <span className={`font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-0.5 rounded border ${
                  data.mode === 'growth'
                    ? 'text-amber-400 border-amber-500/30 bg-amber-500/[0.08]'
                    : 'text-violet-400 border-violet-500/30 bg-violet-500/[0.08]'
                }`}>
                  {data.mode === 'growth' ? 'Growth Mode' : 'Balanced Mode'}
                </span>
              )}
            </div>
            <p className="text-zinc-400 text-sm mt-1">Real-time action hub · updated daily</p>
          </div>
          {data?.picks.length ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                {data.picks.length} active position{data.picks.length !== 1 ? 's' : ''}
              </span>
              {data.date && (
                <span className="font-mono text-[11px] text-zinc-700">· {data.date}</span>
              )}
            </div>
          ) : null}
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-start gap-3 bg-red-950/40 border border-red-800/60 rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-300 text-sm font-medium">Scanner output unavailable</p>
              <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── ROW 1: Rebalance countdown — full width ────────────────────── */}
        <GlassCard className="dark:bg-gradient-to-b dark:from-zinc-900/60 dark:to-zinc-900/20">
          <div className="px-6 py-3 border-b border-zinc-800/50 dark:bg-zinc-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">Next Rebalance In</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 font-mono text-[11px] text-zinc-600">
              {topMomentum != null && (
                <span>
                  leading:{' '}
                  <span className="text-zinc-400">{topTheme ? (THEME_NAMES[topTheme] ?? topTheme) : '—'}</span>
                  {' '}
                  <span className={topMomentum >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {topMomentum >= 0 ? '+' : ''}{topMomentum.toFixed(2)}%
                  </span>
                </span>
              )}
              <span className="text-zinc-700">
                {data?.mode === 'growth' ? 'Monthly rotation' : 'Weekly rotation'}
              </span>
            </div>
          </div>
          <div className="px-6 py-8">
            {loading ? (
              <div className="flex justify-center gap-8 py-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-16 w-20 bg-zinc-800" />
                    <Skeleton className="h-3 w-8 bg-zinc-800" />
                  </div>
                ))}
              </div>
            ) : data?.rebalance_next ? (
              <RebalanceTimer rebalanceNext={data.rebalance_next} variant="hero" />
            ) : (
              <p className="text-zinc-600 text-sm text-center py-4">—</p>
            )}
          </div>
        </GlassCard>

        {/* ── Holdings + Allocation side by side ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 items-stretch">

          <GlassCard>
            <div className="px-6 py-3 border-b border-zinc-800/50 bg-zinc-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Current Holdings</span>
                {topMomentum != null && (
                  <span className={`font-mono text-[11px] ${topMomentum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    · {topTheme ? (THEME_NAMES[topTheme] ?? topTheme) : '—'} {topMomentum >= 0 ? '+' : ''}{topMomentum.toFixed(2)}%
                  </span>
                )}
              </div>
              {data?.date && (
                <span className="font-mono text-[11px] text-zinc-600">as of {data.date}</span>
              )}
            </div>
            <div className="px-6 py-5">
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full bg-zinc-800" />
                  ))}
                </div>
              ) : data?.picks ? (
                <PicksTable picks={data.picks} />
              ) : (
                <p className="text-zinc-600 text-sm text-center py-6">—</p>
              )}
            </div>
          </GlassCard>

          {/* Allocation donut — desktop only (weight % visible in table on mobile) */}
          <GlassCard className="hidden sm:block">
            <div className="px-6 py-3 border-b border-zinc-800/50 bg-zinc-900/40 flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Allocation</span>
              {data?.picks.length ? (
                <span className="font-mono text-[11px] text-zinc-600">{data.picks.length} positions</span>
              ) : null}
            </div>
            <div className="px-6 py-5">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32 bg-zinc-800" />
                  <Skeleton className="h-4 w-full bg-zinc-800" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                </div>
              ) : data?.picks ? (
                <PortfolioAllocation picks={data.picks} />
              ) : (
                <p className="text-zinc-600 text-sm text-center py-4">—</p>
              )}
            </div>
          </GlassCard>

        </div>

        {/* ── ROW 3: Live Theme Rankings — full width ────────────────────── */}
        <GlassCard>
          <div className="px-6 py-3 border-b border-zinc-800/50 bg-zinc-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-500" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Live Momentum Rankings</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-600">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500" />Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />Positive
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />Negative
              </span>
            </div>
          </div>
          <div className="px-6 py-5">
            {loading ? (
              <Skeleton className="h-64 w-full bg-zinc-800" />
            ) : data?.theme_rankings ? (
              <ThemeRankings rankings={data.theme_rankings} topThemes={data.top_themes ?? []} />
            ) : (
              <p className="text-zinc-600 text-sm text-center py-6">—</p>
            )}
          </div>
        </GlassCard>

        {/* ── Footer crosslink ───────────────────────────────────────────── */}
        <div className="pb-2">
          <Link
            href="/performance"
            className="group flex items-center justify-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors text-sm font-mono"
          >
            <BarChart2 size={13} className="text-violet-500/70 group-hover:text-violet-400 transition-colors" />
            See 19-year historical backtest proof
            <span className="text-violet-500/70 group-hover:text-violet-400 transition-colors">→ Performance</span>
          </Link>
        </div>

        </main>
      </ProLock>
    </div>
  )
}
