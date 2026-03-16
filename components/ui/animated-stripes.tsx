'use client'

import { motion } from 'framer-motion'

const STRIPES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${-10 + i * 6}%`,
  duration: 18 + (i % 5) * 3,
  delay: (i % 8) * 1.4,
}))

export function AnimatedStripes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {STRIPES.map(({ id, left, duration, delay }) => (
        <motion.div
          key={id}
          className="absolute h-[300vh] w-32 bg-gradient-to-b from-transparent via-violet-600/[0.12] to-transparent"
          style={{
            left,
            top: '-100vh',
            rotate: 45,
          }}
          animate={{
            x: ['-300px', '2800px'],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            x: { duration, repeat: Infinity, ease: 'linear', delay },
            opacity: { duration, repeat: Infinity, times: [0, 0.08, 0.92, 1], delay },
          }}
        />
      ))}
    </div>
  )
}
