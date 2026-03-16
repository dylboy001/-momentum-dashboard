'use client'

import { useEffect, useRef } from 'react'

interface Layer {
  amp:     number   // amplitude as fraction of height
  freq:    number   // full cycles across width
  speed:   number   // radians per second
  phase:   number   // initial phase offset
  yBase:   number   // rest y as fraction of height
  r: number; g: number; b: number
  opacity: number
}

const LAYERS: Layer[] = [
  // Deep anchor layer — very slow, full-width, dominant violet
  { amp: 0.13, freq: 1.1, speed: 0.20, phase: 0.0,  yBase: 0.54, r: 109, g:  40, b: 217, opacity: 0.16 },
  // Mid indigo — slightly faster, offsets the anchor
  { amp: 0.10, freq: 1.7, speed: 0.28, phase: 1.8,  yBase: 0.50, r:  79, g:  70, b: 229, opacity: 0.13 },
  // Bright violet accent — shorter wavelength, livelier
  { amp: 0.08, freq: 2.5, speed: 0.40, phase: 3.2,  yBase: 0.48, r: 139, g:  92, b: 246, opacity: 0.11 },
  // Soft lavender highlight — thin fast ripple
  { amp: 0.05, freq: 3.4, speed: 0.58, phase: 0.9,  yBase: 0.46, r: 167, g: 139, b: 250, opacity: 0.08 },
  // Deep indigo shadow — low & slow
  { amp: 0.11, freq: 0.8, speed: 0.14, phase: 5.1,  yBase: 0.57, r:  55, g:  48, b: 163, opacity: 0.10 },
]

export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Smoothed mouse position (0–1 each axis)
  const mouse  = useRef({ x: 0.5, y: 0.5 })
  const target = useRef({ x: 0.5, y: 0.5 })
  const raf    = useRef<number>(0)
  const dims   = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── resize ────────────────────────────────────────────────────────
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      dims.current = { w, h }
      canvas.width  = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // ── mouse ─────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX / window.innerWidth
      target.current.y = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMove)

    // ── draw loop ─────────────────────────────────────────────────────
    let prev = 0
    const draw = (now: number) => {
      const dt = Math.min((now - prev) * 0.001, 0.05)  // seconds, capped
      prev = now

      // Lerp mouse position (lazy follow)
      const m = mouse.current
      const t = target.current
      m.x += (t.x - m.x) * 0.045
      m.y += (t.y - m.y) * 0.045

      const { w, h } = dims.current
      ctx.clearRect(0, 0, w, h)

      const mx = m.x   // 0–1
      const my = m.y   // 0–1

      // Phase accumulator lives on each layer — we accumulate into a
      // mutable array instead of mutating the read-only LAYERS constant
      LAYERS.forEach((layer, li) => {
        // Accumulate time in a stable way via a per-layer ref-like approach:
        // we store accumulated phase externally.
        phaseAcc[li] += layer.speed * dt

        const phTotal = phaseAcc[li] + layer.phase

        // Mouse influence
        const ampMult   = 1 + (my - 0.5) * 0.55      // mouse Y stretches amplitude
        const yShift    = (my - 0.5) * h * 0.11       // mouse Y shifts wave center
        const phShift   = (mx - 0.5) * Math.PI * 1.2  // mouse X shifts phase

        ctx.beginPath()

        const step = 4  // px between sample points — higher = faster, less smooth
        for (let px = 0; px <= w; px += step) {
          const nx = px / w  // 0–1

          // Base sine
          const baseY =
            Math.sin(nx * Math.PI * 2 * layer.freq + phTotal + phShift) *
            h * layer.amp * ampMult

          // Gaussian bump under cursor — creates a local push/pull
          const dx   = nx - mx
          const bump = Math.exp(-(dx * dx) / 0.035)
          const push = bump * (my - 0.5) * h * 0.09

          const y = h * layer.yBase + baseY + yShift + push

          px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y)
        }

        // Close path below screen
        ctx.lineTo(w, h * 1.05)
        ctx.lineTo(0, h * 1.05)
        ctx.closePath()

        ctx.fillStyle = `rgba(${layer.r},${layer.g},${layer.b},${layer.opacity})`
        ctx.fill()
      })

      raf.current = requestAnimationFrame(draw)
    }

    // Per-layer accumulated phase (not part of LAYERS so it's mutable)
    const phaseAcc = LAYERS.map(() => 0)

    raf.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
    />
  )
}
