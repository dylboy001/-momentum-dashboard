'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { AnimatedWavesBg } from '@/components/ui/animated-waves-bg'

export function CTASection() {
  const { resolvedTheme } = useTheme()
  const [isLight, setIsLight] = useState(() =>
    typeof window !== 'undefined' && !document.documentElement.classList.contains('dark')
  )
  useEffect(() => { setIsLight(resolvedTheme === 'light') }, [resolvedTheme])

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-[#080808] px-8 py-28 md:py-36">
      <AnimatedWavesBg light={isLight} />

      {/* Heading clearance overlay — CSS var, no hydration flash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'var(--hero-clearance-bg)' }}
      />

      {/* Corner marks */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute top-10 left-10 h-5 w-5 border-l border-t border-zinc-700/40" />
        <div className="absolute top-10 right-10 h-5 w-5 border-r border-t border-zinc-700/40" />
        <div className="absolute bottom-10 left-10 h-5 w-5 border-b border-l border-zinc-700/40" />
        <div className="absolute bottom-10 right-10 h-5 w-5 border-b border-r border-zinc-700/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center pointer-events-none">

        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600">
          — Get Started
        </p>

        <h2
          className="mb-7 text-center font-light uppercase leading-[0.91] tracking-[0.10em] text-white"
          style={{ fontSize: 'clamp(2.7rem, 4.5vw, 4.5rem)' }}
        >
          Discover The Market&apos;s<br />Top Performers
        </h2>

        <p className="mx-auto mb-12 max-w-md text-base leading-relaxed text-zinc-400">
          The scanner runs daily. See which sectors are leading the market right now.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pointer-events-auto">
          <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}>
            <Link href="/rankings" className="btn-primary">
              View Live Rankings
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}>
            <Link href="/how-it-works" className="btn-outline">
              How It Works
            </Link>
          </motion.div>
        </div>

        <p className="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">
          Not financial advice · Backtested 2006 – 2025
        </p>

      </div>
    </section>
  )
}
