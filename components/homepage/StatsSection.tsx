'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

// ── Animated counter ──────────────────────────────────────────────────────────

function AnimatedCounter({
  end,
  suffix = '',
  decimals = 0,
}: {
  end: number
  suffix?: string
  decimals?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let frame: number
    const duration = 2000
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(eased * end)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isInView, end])

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}
      {suffix}
    </span>
  )
}

// ── Data ──────────────────────────────────────────────────────────────────────

const STATS = [
  {
    end: 47.72,
    decimals: 2,
    suffix: '%',
    label: '19-Year CAGR',
    sub: 'Balanced mode · 2006 – 2025',
  },
  {
    end: 19,
    decimals: 0,
    suffix: '',
    label: 'Themes Tracked',
    sub: 'Equity, commodities & crypto',
  },
  {
    display: 'Weekly',
    label: 'Rebalance Cadence',
    sub: 'Balanced: 7d · Growth: 30d',
  },
] as const

// ── Component ─────────────────────────────────────────────────────────────────

export function StatsSection({ light = false }: { light?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const bg         = light ? 'bg-white'       : 'bg-[#080808]'
  const border     = light ? 'border-zinc-200' : 'border-zinc-800'
  const numColor   = light ? 'text-black'      : 'text-white'
  const labelColor = light ? 'text-zinc-400'   : 'text-zinc-500'
  const subColor   = light ? 'text-zinc-400'   : 'text-zinc-600'
  const tagColor   = light ? 'text-zinc-400'   : 'text-zinc-600'
  const hoverBg    = light ? 'hover:bg-zinc-50' : 'hover:bg-zinc-900/40'
  const accentLine = light ? 'bg-zinc-900'     : 'bg-violet-500'

  return (
    <section
      ref={ref}
      className={`${bg} flex min-h-screen items-center justify-center px-8 py-24`}
    >
      <div className="mx-auto w-full max-w-6xl">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className={`mb-16 font-mono text-[11px] uppercase tracking-[0.22em] ${tagColor}`}
        >
          — Performance
        </motion.p>

        {/* Stats */}
        <div className={`grid grid-cols-1 border-t ${border} md:grid-cols-3`}>
          {STATS.map((stat, i) => {
            const hasEnd = 'end' in stat
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.1 + i * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={[
                  'group relative py-20 text-center transition-colors duration-300',
                  hoverBg,
                  i > 0
                    ? `border-t md:border-t-0 md:border-l md:pl-10 ${border}`
                    : '',
                  i < 2 ? 'md:pr-10' : '',
                ].join(' ')}
              >
                {/* Hover accent line */}
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] ${accentLine} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                {/* Number / text */}
                <p
                  className={`mb-5 font-thin leading-none ${numColor} ${hasEnd ? 'font-mono tabular-nums' : ''}`}
                  style={{ fontSize: 'clamp(3.25rem, 4.5vw, 5rem)' }}
                >
                  {hasEnd ? (
                    <AnimatedCounter
                      end={stat.end}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  ) : (
                    stat.display
                  )}
                </p>

                {/* Label */}
                <p className={`mb-2 text-sm font-medium uppercase tracking-[0.18em] ${labelColor}`}>
                  {stat.label}
                </p>

                {/* Sub */}
                <p className={`text-sm ${subColor}`}>{stat.sub}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className={`mt-8 text-[11px] leading-relaxed ${subColor}`}
        >
          Past performance does not guarantee future results. Backtested data reflects the strategy applied retroactively to historical prices.
        </motion.p>
      </div>
    </section>
  )
}
