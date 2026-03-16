import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-zinc-900/50 backdrop-blur-sm',
        'border border-zinc-800/60',
        'shadow-lg shadow-black/40',
        'transition-[border-color,box-shadow] duration-300',
        'hover:border-zinc-700/60 hover:shadow-violet-500/10',
        className
      )}
    >
      {children}
    </div>
  )
}
