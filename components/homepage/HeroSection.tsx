'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { AnimatedWavesBg } from '@/components/ui/animated-waves-bg'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  const isLight = mounted && resolvedTheme === 'light'

  return (
    <section ref={sectionRef} className="relative flex min-h-[85vh] sm:min-h-screen flex-col overflow-hidden bg-[#080808]">

      {/* ── Animated wavy grid background ──────────────────────────────────── */}
      <AnimatedWavesBg light={isLight} />

      {/* ── Heading clearance overlay ───────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'var(--hero-clearance-bg)' }}
      />

      {/* ── Corner marks ────────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-7 left-7 h-5 w-5 border-l border-t border-zinc-700/40 sm:top-10 sm:left-10" />
        <div className="absolute top-7 right-7 h-5 w-5 border-r border-t border-zinc-700/40 sm:top-10 sm:right-10" />
        <div className="absolute bottom-7 left-7 h-5 w-5 border-b border-l border-zinc-700/40 sm:bottom-10 sm:left-10" />
        <div className="absolute bottom-7 right-7 h-5 w-5 border-b border-r border-zinc-700/40 sm:bottom-10 sm:right-10" />
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col justify-between px-5 py-8 sm:px-12 sm:py-11 pointer-events-none">

        {/* ── TOP: strategy label (left) + live badge (right) ─────────────── */}
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.38em] text-zinc-600">
            — ETF &amp; Crypto Momentum Rotation —
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-1.5">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-violet-400">
              Live · Updated Daily
            </span>
          </div>
        </div>

        {/* ── MIDDLE: heading + tagline + CTAs ────────────────────────────── */}
        <div className="flex flex-col items-center text-center">

          <h1
            className="mb-6 text-center font-thin uppercase leading-[0.91] tracking-[0.10em] text-white"
            style={{ fontSize: 'clamp(52px, 10vw, 158px)' }}
          >
            MOMENTUM<br />CAPITAL
          </h1>

          <p className="mb-10 max-w-sm text-base font-light tracking-wide text-zinc-400 sm:max-w-none sm:text-lg">
            Systematic Rotation Into Leading Market Assets
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center pointer-events-auto">
            <Link href="/rankings" className="btn-primary">
              Start Free
            </Link>
            <Link href="/dashboard" className="btn-outline">
              Live Dashboard
            </Link>
          </div>
        </div>

        {/* ── BOTTOM: three-column provenance / scroll / disclaimer ─────────── */}
        <div className="grid grid-cols-3 items-end">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-700">
            Backtested 2006 – 2025
          </span>

          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="h-6 w-px bg-gradient-to-b from-zinc-500 to-transparent"
            />
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-zinc-500">
              scroll
            </span>
          </div>

          <span className="text-right font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-700">
            Not financial advice
          </span>
        </div>

      </div>
    </section>
  )
}
