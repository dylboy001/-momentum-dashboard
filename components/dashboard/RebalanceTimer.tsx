'use client'

import { useEffect, useState } from 'react'

interface RebalanceTimerProps {
  rebalanceNext: string // ISO date string e.g. "2025-05-01"
  variant?: 'default' | 'hero'
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function getTimeLeft(targetDate: string): TimeLeft {
  const now = Date.now()
  const target = new Date(targetDate).getTime()
  const diff = Math.max(0, target - now)

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function RebalanceTimer({ rebalanceNext, variant = 'default' }: RebalanceTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(rebalanceNext))

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(rebalanceNext))
    }, 1000)
    return () => clearInterval(id)
  }, [rebalanceNext])

  const isExpired = timeLeft.total === 0
  const urgencyColor =
    timeLeft.days === 0 && timeLeft.hours < 12
      ? 'text-red-400'
      : timeLeft.days < 7
      ? 'text-amber-400'
      : 'text-emerald-400'

  const glowFilter =
    timeLeft.days === 0 && timeLeft.hours < 12
      ? 'drop-shadow(0 0 12px rgba(248,113,113,0.6))'
      : timeLeft.days < 7
      ? 'drop-shadow(0 0 10px rgba(251,191,36,0.45))'
      : 'drop-shadow(0 0 8px rgba(52,211,153,0.2))'

  if (variant === 'hero') {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        {isExpired ? (
          <div className="text-center">
            <p className="text-red-400 font-semibold text-xl">Rebalance overdue</p>
            <p className="text-red-400/60 text-sm mt-1">Run scanner to generate new picks</p>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1.5 md:gap-5">
              <HeroSegment value={timeLeft.days} label="days" color={urgencyColor} glowFilter={glowFilter} />
              <HeroColon color={urgencyColor} />
              <HeroSegment value={timeLeft.hours} label="hrs" color={urgencyColor} glowFilter={glowFilter} />
              <HeroColon color={urgencyColor} />
              <HeroSegment value={timeLeft.minutes} label="min" color={urgencyColor} glowFilter={glowFilter} />
              <HeroColon color={urgencyColor} />
              <HeroSegment value={timeLeft.seconds} label="sec" color={urgencyColor} glowFilter={glowFilter} />
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <p className="text-zinc-400 text-sm font-mono">
                Next rebalance:{' '}
                <span className="text-zinc-200">{rebalanceNext}</span>
              </p>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {isExpired ? (
        <p className="text-red-400 font-semibold text-sm">Rebalance overdue — run scanner</p>
      ) : (
        <>
          <div className="flex items-end gap-1.5">
            <Segment value={timeLeft.days} label="days" color={urgencyColor} large />
            <Colon />
            <Segment value={timeLeft.hours} label="hrs" color={urgencyColor} />
            <Colon />
            <Segment value={timeLeft.minutes} label="min" color={urgencyColor} />
            <Colon />
            <Segment value={timeLeft.seconds} label="sec" color={urgencyColor} />
          </div>
          <p className="text-zinc-500 text-xs">
            Next rebalance:{' '}
            <span className="text-zinc-300 font-mono">{rebalanceNext}</span>
          </p>
        </>
      )}
    </div>
  )
}

function Segment({
  value,
  label,
  color,
  large,
}: {
  value: number
  label: string
  color: string
  large?: boolean
}) {
  return (
    <div className="flex flex-col items-center">
      <span
        className={`font-mono font-bold tabular-nums ${color} ${
          large ? 'text-4xl' : 'text-3xl'
        }`}
      >
        {pad(value)}
      </span>
      <span className="text-zinc-600 text-[10px] uppercase tracking-widest mt-0.5">
        {label}
      </span>
    </div>
  )
}

function Colon() {
  return <span className="text-zinc-600 text-2xl font-mono mb-4">:</span>
}

function HeroSegment({
  value,
  label,
  color,
  glowFilter,
}: {
  value: number
  label: string
  color: string
  glowFilter?: string
}) {
  return (
    <div className="flex flex-col items-center min-w-[2.75rem] md:min-w-[6rem]">
      <span
        className={`font-mono font-thin tabular-nums ${color} text-[2.25rem] md:text-7xl leading-none transition-[filter] duration-1000`}
        style={glowFilter ? { filter: glowFilter } : undefined}
      >
        {pad(value)}
      </span>
      <span className="text-zinc-600 text-[10px] md:text-xs uppercase tracking-[0.2em] mt-2">
        {label}
      </span>
    </div>
  )
}

function HeroColon({ color }: { color: string }) {
  return (
    <span className={`font-mono font-thin text-[1.75rem] md:text-6xl mb-3 md:mb-6 opacity-40 ${color}`}>:</span>
  )
}
