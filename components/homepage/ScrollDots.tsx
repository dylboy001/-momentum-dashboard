'use client'

import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'

const SECTIONS = ['Hero', 'Performance', 'Process', 'Get Started']

export function ScrollDots() {
  const { scrollY } = useScroll()
  const [active, setActive] = useState(0)

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      const vh = window.innerHeight
      setActive(Math.min(Math.floor(latest / vh), SECTIONS.length - 1))
    })
  }, [scrollY])

  function goTo(i: number) {
    window.scrollTo({ top: i * window.innerHeight, behavior: 'smooth' })
  }

  return (
    <div className="fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3.5 md:flex">
      {SECTIONS.map((label, i) => (
        <button
          key={label}
          onClick={() => goTo(i)}
          aria-label={`Go to ${label}`}
          className="group flex items-center justify-end gap-2.5"
        >
          {/* Label — appears on hover */}
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {label}
          </span>

          {/* Dot */}
          <motion.span
            animate={{
              scale: active === i ? 1.5 : 1,
              backgroundColor: active === i ? '#8b5cf6' : '#52525b',
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="block h-1.5 w-1.5 shrink-0 rounded-full"
          />
        </button>
      ))}
    </div>
  )
}
