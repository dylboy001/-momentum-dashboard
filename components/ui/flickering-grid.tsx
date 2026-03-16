'use client'

import { useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface FlickeringGridProps {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  width?: number
  height?: number
  className?: string
  maxOpacity?: number
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return [255, 255, 255]
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ]
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = '#ffffff',
  width,
  height,
  className,
  maxOpacity = 0.3,
}: FlickeringGridProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef       = useRef<number>(0)
  const gridRef      = useRef<Float32Array | null>(null)
  const dimsRef      = useRef({ cols: 0, rows: 0, w: 0, h: 0 })
  const colorRef     = useRef<[number, number, number]>([255, 255, 255])

  // Keep colour ref in sync with prop (avoids restarting the entire effect on colour change)
  useEffect(() => {
    colorRef.current = hexToRgb(color)
  }, [color])

  const initGrid = useCallback(
    (w: number, h: number) => {
      const cols = Math.ceil(w / (squareSize + gridGap))
      const rows = Math.ceil(h / (squareSize + gridGap))
      const grid = new Float32Array(cols * rows)
      for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.random() * maxOpacity
      }
      gridRef.current  = grid
      dimsRef.current  = { cols, rows, w, h }
    },
    [squareSize, gridGap, maxOpacity],
  )

  const resizeCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1
      // Resetting width/height automatically resets the context transform
      canvas.width        = Math.round(w * dpr)
      canvas.height       = Math.round(h * dpr)
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
      canvas.getContext('2d')?.scale(dpr, dpr)
    },
    [],
  )

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const getSize = () => ({
      w: width  ?? container.clientWidth,
      h: height ?? container.clientHeight,
    })

    const setup = (w: number, h: number) => {
      resizeCanvas(canvas, w, h)
      initGrid(w, h)
    }

    const { w, h } = getSize()
    setup(w, h)

    const animate = () => {
      const ctx  = canvas.getContext('2d')
      const grid = gridRef.current
      if (!ctx || !grid) { rafRef.current = requestAnimationFrame(animate); return }

      const { cols, rows, w, h } = dimsRef.current
      const [r, g, b]            = colorRef.current

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const idx = i * rows + j
          if (Math.random() < flickerChance) {
            grid[idx] = Math.random() * maxOpacity
          }
          const opacity = grid[idx]
          if (opacity < 0.005) continue   // skip invisible squares
          ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`
          ctx.fillRect(
            i * (squareSize + gridGap),
            j * (squareSize + gridGap),
            squareSize,
            squareSize,
          )
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    const ro = new ResizeObserver(() => {
      const { w, h } = getSize()
      setup(w, h)
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [squareSize, gridGap, flickerChance, maxOpacity, width, height, initGrid, resizeCanvas])

  return (
    <div ref={containerRef} className={cn('overflow-hidden', className)}>
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
