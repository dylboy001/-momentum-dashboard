'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// ─── Animated counter (counts up on scroll into view) ────────────────────────
function AnimatedCounter({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1800,
}: {
  target: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const start = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(parseFloat((eased * target).toFixed(decimals)))
      if (t < 1) requestAnimationFrame(step)
      else setValue(target)
    }
    requestAnimationFrame(step)
  }, [inView, target, decimals, duration])

  return (
    <span ref={ref}>
      {prefix}{value.toFixed(decimals)}{suffix}
    </span>
  )
}

// ─── Sector dot grid ─────────────────────────────────────────────────────────
const SECTORS = [
  'Tech', 'Finance', 'Health', 'Energy', 'Cyclical', 'Defensive',
  'Industrials', 'Materials', 'Utilities', 'Real Estate', 'Comms',
  'Gold', 'Silver', 'Copper', 'Uranium', 'Clean Energy', 'Crypto ETF',
  'Bitcoin', 'Ethereum',
]

// ─── Main component ───────────────────────────────────────────────────────────
export function BentoSection() {
  return (
    <section className="bg-[#080808] px-5 py-20 md:px-12 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 md:mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600 mb-4">
            — Strategy
          </p>
          <h2
            className="font-thin text-white leading-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', letterSpacing: '-0.01em' }}
          >
            Systematic outperformance.
            <br />
            <span className="text-zinc-500">Backed by 19 years of data.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">

          {/* ── A: Main feature card (2 cols) ─────────────────────────────── */}
          <div className="md:col-span-2 relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 md:p-9 flex flex-col justify-between min-h-[280px] md:min-h-[320px] transition-colors duration-200 hover:border-zinc-700 group">
            {/* Subtle violet glow top-left */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -left-16 h-48 w-64 rounded-full bg-violet-600/[0.07] blur-3xl"
            />

            <div>
              {/* Tag */}
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-violet-400/70 mb-5 block">
                Balanced Mode · 2006–2025 Backtest
              </span>

              {/* CAGR headline */}
              <div className="flex items-end gap-3 mb-2">
                <p
                  className="font-mono font-thin text-violet-400 tabular-nums leading-none"
                  style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}
                >
                  <AnimatedCounter target={47.72} decimals={2} suffix="%" duration={2000} />
                </p>
                <p className="text-zinc-500 text-sm mb-3 font-mono uppercase tracking-wider">
                  CAGR
                </p>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                Systematic rotation across 19 market sectors — ETFs and direct crypto — ranked
                weekly by momentum. No discretion. No guesswork.
              </p>
            </div>

            {/* Bottom stat row */}
            <div className="mt-8 pt-6 border-t border-zinc-800/60 grid grid-cols-3 gap-4">
              <div>
                <p className="font-mono text-zinc-100 font-thin text-xl tabular-nums">$21.5M</p>
                <p className="text-zinc-600 text-xs font-mono uppercase tracking-wider mt-0.5">$10k → today</p>
              </div>
              <div>
                <p className="font-mono text-zinc-100 font-thin text-xl tabular-nums">1.163</p>
                <p className="text-zinc-600 text-xs font-mono uppercase tracking-wider mt-0.5">Sharpe ratio</p>
              </div>
              <div>
                <p className="font-mono text-zinc-100 font-thin text-xl tabular-nums">19yr</p>
                <p className="text-zinc-600 text-xs font-mono uppercase tracking-wider mt-0.5">backtest period</p>
              </div>
            </div>
          </div>

          {/* ── B: Alpha vs SPY card (1 col, tall) ────────────────────────── */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 flex flex-col justify-between min-h-[280px] md:min-h-[320px] transition-colors duration-200 hover:border-zinc-700">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-5 block">
                vs S&P 500
              </span>
              <p
                className="font-mono font-thin text-emerald-400 tabular-nums leading-none mb-2"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
              >
                <AnimatedCounter target={36.9} decimals={1} prefix="+" suffix="%" duration={1800} />
              </p>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-5">
                Annual alpha
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs">Strategy CAGR</span>
                  <span className="font-mono text-zinc-200 text-sm tabular-nums">47.72%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 text-xs">SPY CAGR</span>
                  <span className="font-mono text-zinc-500 text-sm tabular-nums">10.80%</span>
                </div>
              </div>
            </div>

            {/* Regime proof */}
            <div className="mt-6 pt-5 border-t border-zinc-800/60 space-y-2.5">
              <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-wider mb-3">
                Crisis performance
              </p>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-xs">2008 crash</span>
                <span className="font-mono text-emerald-400 text-xs tabular-nums">−4.6%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-xs">SPY 2008</span>
                <span className="font-mono text-red-400 text-xs tabular-nums">−40.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 text-xs">2022 bear</span>
                <span className="font-mono text-emerald-400 text-xs tabular-nums">+11.6%</span>
              </div>
            </div>
          </div>

          {/* ── C: Sector universe card ────────────────────────────────────── */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 transition-colors duration-200 hover:border-zinc-700">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-4 block">
              Universe
            </span>
            <div className="flex items-end gap-2 mb-4">
              <p className="font-mono font-thin text-white tabular-nums" style={{ fontSize: '2.75rem', lineHeight: 1 }}>
                19
              </p>
              <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-2">Sectors</p>
            </div>
            {/* Dot grid */}
            <div className="flex flex-wrap gap-1.5">
              {SECTORS.map((s) => (
                <span
                  key={s}
                  className="text-[10px] font-mono text-zinc-500 bg-zinc-800/60 px-2 py-0.5 rounded"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ── D: Rebalance cadence card ──────────────────────────────────── */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 transition-colors duration-200 hover:border-zinc-700">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-4 block">
              Cadence
            </span>
            <p className="font-mono font-thin text-white tabular-nums mb-1" style={{ fontSize: '2.75rem', lineHeight: 1 }}>
              Weekly
            </p>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-6">
              Rebalance schedule
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Fixed 7-day cycle. The system re-ranks every sector every week and rotates
              automatically — no manual judgment required.
            </p>
            <div className="mt-5 pt-5 border-t border-zinc-800/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600 font-mono uppercase tracking-wider">Growth mode</span>
                <span className="font-mono text-zinc-400">30-day</span>
              </div>
            </div>
          </div>

          {/* ── E: EMA filter card ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 transition-colors duration-200 hover:border-zinc-700">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-600 mb-4 block">
              Bear market brake
            </span>
            <p className="font-mono font-thin text-white mb-1" style={{ fontSize: '2.75rem', lineHeight: 1 }}>
              EMA
            </p>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider mb-6">
              10 / 100 daily filter
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Before entering any sector, price must be above its 10-day and 100-day moving
              averages. Blocked crypto in 2018–19 and 2022 bear markets entirely.
            </p>
            <div className="mt-5 pt-5 border-t border-zinc-800/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600 font-mono uppercase tracking-wider">Cash when none qualify</span>
                <span className="font-mono text-emerald-400">Protected</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom disclaimer */}
        <p className="mt-8 text-center text-zinc-700 text-xs font-mono">
          Past performance does not guarantee future results. Backtest period: 2006–2025. PIT-clean — no survivorship bias.
        </p>
      </div>
    </section>
  )
}
