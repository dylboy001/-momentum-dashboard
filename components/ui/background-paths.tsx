'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// FloatingPaths
//
// SVG coordinate system: viewBox="-300 -200 2100 1400"  (x: -300→1800, y: -200→1200)
// With preserveAspectRatio="xMidYMid slice" on a 1440×900 screen:
//   scale = max(1440/2100, 900/1400) = max(0.686, 0.643) = 0.686  (width constrains)
//   full viewBox width is visible — paths span the entire viewport.
//
// position= 1 → paths sweep left-to-right  (top-left  → bottom-right)
// position=-1 → paths sweep right-to-left  (top-right → bottom-left)
//
// Animation: a short dash (pathLength=0.2) travels along each path once per cycle.
// ─────────────────────────────────────────────────────────────────────────────

export function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => {
    let d: string

    if (position > 0) {
      // Left-to-right diagonal sweep
      const sx = -200 + i * 20   // start x: −200 → 500
      const ex =  900 + i * 20   // end   x:  900 → 1600
      d = `M ${sx} -100 C ${sx + 300} 350, ${ex - 200} 650, ${ex} 1000`
    } else {
      // Right-to-left diagonal sweep (mirror)
      const sx = 1580 - i * 20   // start x: 1580 → 880
      const ex =  480 - i * 20   // end   x:  480 → −220
      d = `M ${sx} -100 C ${sx - 300} 350, ${ex + 200} 650, ${ex} 1000`
    }

    return {
      id:       i,
      d,
      width:    0.3  + i * 0.022,          // 0.3 → 1.1 px
      opacity:  0.04 + i * 0.012,          // 0.04 → 0.46
      duration: 20   + (i % 5) * 5,       // 20–40 s, deterministic
      delay:    (i % 9) * 0.75,            // 0–6 s stagger, deterministic
    }
  })

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="h-full w-full"
        viewBox="-300 -200 2100 1400"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map(({ id, d, width, opacity, duration, delay }) => (
          <motion.path
            key={id}
            d={d}
            stroke="rgb(139 92 246)"
            strokeWidth={width}
            fill="none"
            initial={{ pathLength: 0.2, pathOffset: 0, opacity: 0 }}
            animate={{
              pathOffset: [0, 1],
              opacity:    [0, opacity, opacity, 0],
            }}
            transition={{
              duration,
              delay,
              repeat:    Infinity,
              ease:      'linear',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BackgroundPaths — hero section
// ─────────────────────────────────────────────────────────────────────────────

export function BackgroundPaths() {
  // Two lines, each animated letter-by-letter.
  // Kept as separate arrays — never joined into one string — so
  // word-wrap is impossible regardless of viewport width.
  const lines = ['MOMENTUM', 'CAPITAL']

  let globalIndex = 0   // running letter index for stagger delay

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black px-8">

      {/* ── Animated path layers ── */}
      <div className="absolute inset-0">
        <FloatingPaths position={ 1} />
        <FloatingPaths position={-1} />
      </div>

      {/* ── Hero content ── */}
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Headline — each word on its own block line, letters staggered */}
          <h1
            className="mb-8 font-thin uppercase leading-none tracking-[0.12em]"
            style={{ fontSize: 'clamp(48px, 8.5vw, 140px)' }}
          >
            {lines.map((line, li) => {
              const lineElement = (
                <span key={li} className="block">
                  {line.split('').map((letter, ci) => {
                    const idx = globalIndex
                    globalIndex++
                    return (
                      <motion.span
                        key={`${li}-${ci}`}
                        initial={{ y: 56, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          delay:     idx * 0.04 + 0.3,
                          type:      'spring',
                          stiffness: 110,
                          damping:   18,
                        }}
                        className="inline-block bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent"
                      >
                        {letter}
                      </motion.span>
                    )
                  })}
                </span>
              )
              return lineElement
            })}
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mb-4 text-xl font-light tracking-[0.05em] text-zinc-400 sm:text-2xl"
          >
            Systematic Rotation into Leading Market Trends
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            className="mx-auto mb-14 max-w-[520px] text-base font-light leading-relaxed text-zinc-500"
          >
            Dynamic momentum rotation across 19 sectors (ETFs + BTC + ETH) —
            rebalanced quarterly into the strongest performers.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.6 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link href="/rankings" className="btn-primary">
              View Live Rankings
            </Link>
            <Link href="/how-it-works" className="btn-outline">
              Learn More
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-5 w-px bg-zinc-700"
        />
      </motion.div>
    </section>
  )
}
