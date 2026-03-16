import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Configurable via env: PICKS_JSON_PATH
// Falls back to checking both known output filenames
function findPicksFile(): string | null {
  if (process.env.PICKS_JSON_PATH) {
    return fs.existsSync(process.env.PICKS_JSON_PATH)
      ? process.env.PICKS_JSON_PATH
      : null
  }

  const base = path.join(process.cwd(), 'data')
  const candidates = [
    path.join(base, 'picks_raw.json'),
    path.join(process.cwd(), '..', 'picks_raw.json'),      // legacy local dev fallback
    path.join(process.cwd(), '..', 'current_picks.json'),  // legacy fallback
  ]

  return candidates.find((p) => fs.existsSync(p)) ?? null
}

// Normalize both script output formats into one consistent shape
function normalize(raw: Record<string, unknown>) {
  // Static_Universe.py uses sector_rankings / top_sectors / sector
  // Universe_generator_dynamic.py uses theme_rankings / top_themes / theme
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
    theme: p.theme ?? p.sector,   // unify field name
    price: p.price,
    rs_score: p.rs_score,
    volatility: p.volatility ?? null,
    weight_pct: p.weight_pct ?? 0,
  }))

  const spyMomentum = (raw.spy_momentum as number | undefined) ?? null
  const universeFullData = (raw.universe_full_data as Record<string, Record<string, unknown>[]> | undefined) ?? {}

  return {
    date: raw.date,
    rebalance_next: raw.rebalance_next,
    signal: raw.signal,
    theme_rankings: themeRankings,
    top_themes: topThemes,
    picks,
    spy_momentum: spyMomentum,
    universe_full_data: universeFullData,
  }
}

export async function GET() {
  const picksPath = findPicksFile()

  if (!picksPath) {
    return NextResponse.json(
      {
        error: 'No picks file found',
        detail:
          'Run Universe_generator_dynamic.py or Static_Universe.py screen first. ' +
          'Or set PICKS_JSON_PATH env variable.',
      },
      { status: 503 }
    )
  }

  try {
    const raw = JSON.parse(fs.readFileSync(picksPath, 'utf-8'))
    const stat = fs.statSync(picksPath)

    const data = {
      ...normalize(raw),
      last_generated: stat.mtime.toISOString(),
      source_file: path.basename(picksPath),
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'Failed to read picks', detail: message },
      { status: 500 }
    )
  }
}
