'use client'

import { useEffect, useId, useRef } from 'react'

/**
 * LogoMark — Momentum Capital brand icon.
 *
 * Möbius-style infinity symbol: left loop larger (foreground),
 * right loop smaller (background), angled ~20° upward.
 *
 * When `animate` is true (default), plays a one-shot morph on mount:
 * circle → infinity symbol.
 *
 * Usage:
 *   <LogoMark size={20} />              — animated (default)
 *   <LogoMark size={20} animate={false} /> — static final shape
 */

// Circle path — same command structure as INFINITY (M + 4C)
// Centered at ~(52, 40), radius 20. Starting point matches crossing of infinity.
const CIRCLE =
  'M 72 40 C 72 51 63 60 52 60 C 41 60 32 51 32 40 C 32 29 41 20 52 20 C 63 20 72 29 72 40'

// Möbius infinity — left loop bigger, right loop smaller, tilt applied via group rotate
const INFINITY =
  'M 55 42 C 64 22 88 18 88 36 C 88 54 66 56 55 42 C 44 28 16 24 16 44 C 16 64 40 68 55 42'

interface LogoMarkProps {
  size?: number
  className?: string
  animate?: boolean
  /** How long the morph takes in ms. Default 1400 (navbar). Hero uses ~3000. */
  morphDuration?: number
  /** Delay before morph starts in ms. Default 500. */
  morphDelay?: number
}

export function LogoMark({
  size = 20,
  className,
  animate = true,
  morphDuration = 1400,
  morphDelay = 500,
}: LogoMarkProps) {
  const uid = useId().replace(/:/g, '')
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!animate || !pathRef.current) return
    const el = pathRef.current
    el.animate(
      [{ d: `path("${CIRCLE}")` }, { d: `path("${INFINITY}")` }],
      {
        duration: morphDuration,
        delay: morphDelay,
        easing: 'cubic-bezier(0.37, 0, 0.63, 1)',
        fill: 'forwards',
      }
    )
  }, [animate, morphDuration, morphDelay])

  const gradId = `lm-grad-${uid}`
  const glowId = `lm-glow-${uid}`

  return (
    <svg
      width={size}
      height={Math.round(size * 22 / 30)}
      viewBox="8 14 88 58"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="15" y1="20" x2="90" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="40%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g transform="rotate(-20, 55, 42)">
        <path
          ref={pathRef}
          d={animate ? CIRCLE : INFINITY}
          stroke={`url(#${gradId})`}
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
          filter={`url(#${glowId})`}
        />
      </g>
    </svg>
  )
}
