'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import { AnimatedWavesBg } from '@/components/ui/animated-waves-bg'
import { LogoMark } from '@/components/ui/logo'

const E = [0.16, 1, 0.3, 1] as const

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="relative flex min-h-screen flex-col overflow-hidden bg-[#080808]">

      {/* ── Animated wavy grid background ──────────────────────────────────── */}
      <AnimatedWavesBg />

      {/* ── Background logo — circle morphs to infinity, then fades to ghost ── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
        style={{ willChange: 'transform, opacity' }}
        initial={{ opacity: 0, scale: 2.5, y: 0 }}
        animate={{ opacity: [0, 0.78, 0.13], scale: [2.5, 2.3, 1.0], y: [0, 0, -55] }}
        transition={{ duration: 7.5, times: [0, 0.07, 1.0], ease: [0.25, 0.1, 0.25, 1] }}
      >
        <LogoMark size={520} animate morphDelay={600} morphDuration={3200} />
      </motion.div>

      {/* ── Heading clearance overlay ───────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 65% 52% at 50% 44%, ' +
              'rgba(8,8,8,0.97)  0%, ' +
              'rgba(8,8,8,0.88) 22%, ' +
              'rgba(8,8,8,0.50) 52%, ' +
              'rgba(8,8,8,0.00) 76%)',
        }}
      />

      {/* ── Corner marks ────────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-7 left-7 h-5 w-5 border-l border-t border-zinc-700/40 sm:top-10 sm:left-10" />
        <div className="absolute top-7 right-7 h-5 w-5 border-r border-t border-zinc-700/40 sm:top-10 sm:right-10" />
        <div className="absolute bottom-7 left-7 h-5 w-5 border-b border-l border-zinc-700/40 sm:bottom-10 sm:left-10" />
        <div className="absolute bottom-7 right-7 h-5 w-5 border-b border-r border-zinc-700/40 sm:bottom-10 sm:right-10" />
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col justify-between px-8 py-9 sm:px-12 sm:py-11 pointer-events-none">

        {/* ── TOP: strategy label (left) + live badge (right) ─────────────── */}
        <div className="flex items-center justify-between">
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: E }}
            className="font-mono text-[10px] uppercase tracking-[0.38em] text-zinc-600"
          >
            — ETF &amp; Crypto Momentum Rotation —
          </motion.p>

          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.8, ease: E }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-1.5"
          >
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-violet-400">
              Live · Updated Daily
            </span>
          </motion.div>
        </div>

        {/* ── MIDDLE: heading + tagline + CTAs ────────────────────────────── */}
        <div className="flex flex-col items-center text-center">

          <h1
            className="mb-6 text-center font-thin uppercase leading-[0.91] tracking-[0.10em]"
            style={{ fontSize: 'clamp(52px, 10vw, 158px)' }}
          >
            {(['MOMENTUM', 'CAPITAL'] as const).map((word, i) => (
              <div key={word} className="overflow-hidden">
                <motion.span
                  className="block bg-gradient-to-b from-white via-white to-white/70 bg-clip-text text-transparent"
                  initial={{ y: '115%' }}
                  animate={{ y: '0%' }}
                  transition={{ delay: 0.28 + i * 0.12, duration: 1.1, ease: E }}
                >
                  {word}
                </motion.span>
              </div>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8, ease: E }}
            className="mb-3 max-w-sm text-base font-light tracking-wide text-zinc-300 sm:max-w-none sm:text-lg"
          >
            Systematic Rotation Into Leading Market Assets
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 0.8, ease: E }}
            className="mb-10 max-w-md text-sm font-light tracking-wide text-zinc-500 sm:max-w-xl"
          >
            A weekly signal service for self-directed traders — we surface the strongest market themes using quantitative analysis. You decide when to execute.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.65, ease: E }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center pointer-events-auto"
          >
            <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}>
              <Link href="/rankings" className="btn-primary">
                Start Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}>
              <Link href="/dashboard" className="btn-outline">
                Live Dashboard
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* ── BOTTOM: three-column provenance / scroll / disclaimer ─────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.9 }}
          className="grid grid-cols-3 items-end"
        >
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
        </motion.div>

      </div>
    </section>
  )
}
