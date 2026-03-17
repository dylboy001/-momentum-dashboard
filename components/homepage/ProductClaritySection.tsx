'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const E = [0.16, 1, 0.3, 1] as const

const CARDS = [
  {
    num: '01',
    heading: 'The signal',
    body: 'Every week, we tell you which 1–2 market themes have the strongest momentum. Clear output: what to hold, at what weight, and when to rebalance next.',
  },
  {
    num: '02',
    heading: 'You execute',
    body: 'Your capital stays in your own brokerage. We never touch it. You decide when and how to act on the signal — full control, always.',
  },
  {
    num: '03',
    heading: 'Your edge',
    body: 'Run it as a complete rules-based strategy, or use the momentum rankings as quantitative confirmation alongside your own analysis. Either works.',
  },
]

export function ProductClaritySection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="flex min-h-screen items-center bg-[#0c0c0c] px-8 py-24"
    >
      <div className="mx-auto w-full max-w-6xl">

        {/* Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: E }}
          className="mb-16 max-w-3xl"
        >
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600">
            — What is Momentum Capital?
          </p>
          <h2
            className="font-thin tracking-tight text-white leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.75rem)' }}
          >
            Weekly rotation signals<br />for self-directed traders.
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed max-w-xl">
            We scan 19 market themes daily using quantitative momentum analysis and tell you which ones are strongest right now.{' '}
            <span className="text-zinc-200">You execute in your own account.</span>{' '}
            Not a fund. Not a robo-advisor. A systematic signal service that does the research so you don&apos;t have to.
          </p>
        </motion.div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CARDS.map(({ num, heading, body }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.11, ease: E }}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 p-8 transition-colors duration-200 hover:border-zinc-700 hover:bg-zinc-900/30"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <p
                className="mb-8 font-mono font-thin leading-none text-zinc-800 transition-colors duration-300 group-hover:text-zinc-700"
                style={{ fontSize: 'clamp(3rem, 5vw, 5rem)' }}
              >
                {num}
              </p>
              <p className="mb-3 text-lg font-light text-white">{heading}</p>
              <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
