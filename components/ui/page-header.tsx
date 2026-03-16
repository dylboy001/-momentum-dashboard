'use client'

import { motion } from 'framer-motion'

interface PageHeaderProps {
  tag: string
  title: string
  sub?: string
}

export function PageHeader({ tag, title, sub }: PageHeaderProps) {
  return (
    <div className="relative px-8 pb-14 pt-20">

      {/* Content */}
      <div className="relative mx-auto max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.07 }}
          className="text-4xl font-thin tracking-tight text-white"
        >
          {title}
        </motion.h1>
        {sub && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-400"
          >
            {sub}
          </motion.p>
        )}
      </div>
    </div>
  )
}
