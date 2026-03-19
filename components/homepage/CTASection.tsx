'use client'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { AnimatedWavesBg } from '@/components/ui/animated-waves-bg'

const E = [0.16, 1, 0.3, 1] as const

export function CTASection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isLight = mounted && resolvedTheme === 'light'

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-8 py-24"
    >
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: E }}
          className="mb-8 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600"
        >
          — Get Started
        </motion.p>

        <h2
          className="mb-7 text-center font-light uppercase leading-[0.91] tracking-[0.10em]"
          style={{ fontSize: 'clamp(2.7rem, 4.5vw, 4.5rem)' }}
        >
          {(["Discover The Market's", 'Top Performers'] as const).map((line, i) => (
            <div key={line} className="overflow-hidden">
              <motion.span
                className="hero-word"
                initial={{ y: '115%' }}
                animate={isInView ? { y: '0%' } : {}}
                transition={{ delay: 0.28 + i * 0.12, duration: 1.1, ease: E }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.22, ease: E }}
          className="mx-auto mb-12 max-w-md text-base leading-relaxed text-zinc-400"
        >
          The scanner runs daily. See which sectors are leading the market right now.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.34, ease: E }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row pointer-events-auto"
        >
          <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}>
            <Link href="/rankings" className="btn-primary">
              View Live Rankings
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/how-it-works"
              className="btn-outline"
            >
              How It Works
            </Link>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600"
        >
          Not financial advice · Backtested 2006 – 2025
        </motion.p>

      </div>
    </section>
  )
}
