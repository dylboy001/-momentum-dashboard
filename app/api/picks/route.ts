import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import fs from 'fs'
import path from 'path'

const GITHUB_RAW_BASE =
  'https://raw.githubusercontent.com/dylboy001/-momentum-dashboard/main/data'

async function getUserTier(): Promise<string> {
  try {
    const { userId } = await auth()
    if (!userId) return 'free'
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    return (user.publicMetadata as { tier?: string })?.tier ?? 'free'
  } catch {
    return 'free'
  }
}

function picksFilename(tier: string): string {
  return tier === 'premium' ? 'picks_raw_growth.json' : 'picks_raw.json'
}

function findPicksFile(filename: string): string | null {
  if (process.env.PICKS_JSON_PATH) {
    return fs.existsSync(process.env.PICKS_JSON_PATH)
      ? process.env.PICKS_JSON_PATH
      : null
  }
  const candidates = [
    path.join(process.cwd(), 'data', filename),
    path.join(process.cwd(), '..', filename),
  ]
  return candidates.find((p) => fs.existsSync(p)) ?? null
}

function normalize(raw: Record<string, unknown>) {
  const themeRankings =
    (raw.theme_rankings as [string, number][] | undefined) ??
    (raw.sector_rankings as [string, number][] | undefined) ??
    []

  const topThemes =
    (raw.top_themes as string[] | undefined) ??
    (raw.top_sectors as string[] | undefined) ??
    []

  const picks = (
    (raw.picks as Record<string, unknown>[] | undefined) ?? []
  ).map((p) => ({
    ticker: p.ticker,
    name: (p.name as string | undefined) ?? '',
    theme: p.theme ?? p.sector,
    price: p.price,
    rs_score: p.rs_score,
    volatility: p.volatility ?? null,
    weight_pct: p.weight_pct ?? 0,
  }))

  return {
    date: raw.date,
    rebalance_next: raw.rebalance_next,
    signal: raw.signal,
    theme_rankings: themeRankings,
    top_themes: topThemes,
    picks,
    spy_momentum: (raw.spy_momentum as number | undefined) ?? null,
    universe_full_data:
      (raw.universe_full_data as Record<string, Record<string, unknown>[]> | undefined) ?? {},
  }
}

export async function GET() {
  const tier = await getUserTier()
  const filename = picksFilename(tier)

  // In production, fetch live from GitHub so Vercel doesn't need to redeploy for data updates
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    try {
      const res = await fetch(`${GITHUB_RAW_BASE}/${filename}`, {
        next: { revalidate: 300 },
      })
      if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`)
      const raw = await res.json()
      return NextResponse.json(
        { ...normalize(raw), last_generated: raw.date, source_file: filename, mode: tier === 'premium' ? 'growth' : 'balanced' },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return NextResponse.json(
        { error: 'Failed to fetch picks from GitHub', detail: message },
        { status: 503 }
      )
    }
  }

  // Local dev — read from disk
  const picksPath = findPicksFile(filename)
  if (!picksPath) {
    return NextResponse.json(
      { error: 'No picks file found', detail: 'Run v2_picks_generator.py first.' },
      { status: 503 }
    )
  }

  try {
    const raw = JSON.parse(fs.readFileSync(picksPath, 'utf-8'))
    const stat = fs.statSync(picksPath)
    return NextResponse.json(
      { ...normalize(raw), last_generated: stat.mtime.toISOString(), source_file: path.basename(picksPath), mode: tier === 'premium' ? 'growth' : 'balanced' },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'Failed to read picks', detail: message },
      { status: 500 }
    )
  }
}
