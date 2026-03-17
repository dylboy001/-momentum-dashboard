'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const STEPS = [
  {
    num: '1',
    title: 'Rank 19 themes by momentum',
    desc: 'All 19 themes (17 sector/commodity ETFs + direct BTC + ETH) are ranked by 16–26 week price momentum. A trend confirmation filter screens out themes that are not in genuine uptrends.',
  },
  {
    num: '2',
    title: 'Select top 1–2 qualifying themes',
    desc: 'The top-ranked themes that pass the trend confirmation filter receive capital. Balanced mode holds 2 themes (50/50). Growth mode concentrates 100% in the single strongest theme.',
  },
  {
    num: '3',
    title: 'Rebalance weekly or monthly',
    desc: 'Balanced mode rebalances every 7 days. Growth mode every 30 days. If trends are intact, the same themes are re-selected — keeping turnover low while catching reversals fast.',
  },
]

export function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="flex min-h-screen items-center bg-[#080808] px-8 py-24"
    >
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600">
            — Process
          </p>
          <h2 className="text-5xl font-thin tracking-tight text-white">
            How It Works
          </h2>
        </motion.div>

        {/* Step cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map(({ num, title, desc }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.2 + i * 0.13,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 p-10 transition-colors duration-300 hover:border-zinc-600 hover:bg-zinc-900/30"
            >
              {/* Top glow line on hover */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Large step number */}
              <p
                className="mb-10 font-mono font-thin leading-none text-zinc-800 transition-colors duration-300 group-hover:text-zinc-700"
                style={{ fontSize: 'clamp(4rem, 7vw, 7rem)' }}
              >
                {num.padStart(2, '0')}
              </p>

              {/* Title */}
              <h3 className="mb-4 text-xl font-light leading-snug text-white">
                {title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
