import { NavBar } from '@/components/dashboard/NavBar'
import { HeroSection } from '@/components/homepage/HeroSection'
import { StatsSection } from '@/components/homepage/StatsSection'
import { HowItWorksSection } from '@/components/homepage/HowItWorksSection'
import { CTASection } from '@/components/homepage/CTASection'
import { ScrollDots } from '@/components/homepage/ScrollDots'

export default function HomePage() {
  return (
    <div className="bg-[#080808] text-white">
      <NavBar />

      {/* Seamless dark canvas — panels share the same background, only content transitions */}

      {/* ── 1. HERO — base layer ─────────────────────────────────── */}
      <div className="sticky top-0 z-[1]">
        <HeroSection />
      </div>

      {/* ── 2. STATS ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-[2] rounded-t-[2rem] overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-violet-500/[0.06] to-transparent" />
        <StatsSection />
      </div>

      {/* ── 3. HOW IT WORKS ───────────────────────────────────────── */}
      <div className="sticky top-0 z-[3] rounded-t-[2rem] overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-violet-500/[0.06] to-transparent" />
        <HowItWorksSection />
      </div>

      {/* ── 4. CTA ────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-[4] rounded-t-[2rem] overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-violet-500/[0.06] to-transparent" />
        <CTASection />
      </div>

      {/* Fixed scroll progress dots */}
      <ScrollDots />
    </div>
  )
}
