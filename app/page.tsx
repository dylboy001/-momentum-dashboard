import { NavBar } from '@/components/dashboard/NavBar'
import { HeroSection } from '@/components/homepage/HeroSection'
import { ProductClaritySection } from '@/components/homepage/ProductClaritySection'
import { StatsSection } from '@/components/homepage/StatsSection'
import { HowItWorksSection } from '@/components/homepage/HowItWorksSection'
import { CTASection } from '@/components/homepage/CTASection'
import { ScrollDots } from '@/components/homepage/ScrollDots'

export default function HomePage() {
  return (
    <div className="bg-[#080808] text-white">
      <NavBar />

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-[1]">
        <HeroSection />
      </div>

      {/* ── 2. WHAT IS IT — hidden on mobile ──────────────────────── */}
      <div className="hidden sm:block sm:sticky sm:top-0 sm:z-[2] sm:rounded-t-[2rem] sm:overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-violet-500/[0.06] to-transparent" />
        <ProductClaritySection />
      </div>

      {/* ── 3. STATS — hidden on mobile ───────────────────────────── */}
      <div className="hidden sm:block sm:sticky sm:top-0 sm:z-[3] sm:rounded-t-[2rem] sm:overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-violet-500/[0.06] to-transparent" />
        <StatsSection />
      </div>

      {/* ── 4. HOW IT WORKS — hidden on mobile ────────────────────── */}
      <div className="hidden sm:block sm:sticky sm:top-0 sm:z-[4] sm:rounded-t-[2rem] sm:overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-violet-500/[0.06] to-transparent" />
        <HowItWorksSection />
      </div>

      {/* ── 5. CTA ────────────────────────────────────────────────── */}
      <div className="sm:sticky sm:top-0 sm:z-[5] sm:rounded-t-[2rem] sm:overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-violet-500/[0.06] to-transparent" />
        <CTASection />
      </div>

      <ScrollDots />
    </div>
  )
}
