import { NavBar } from '@/components/dashboard/NavBar'
import { HeroSection } from '@/components/homepage/HeroSection'
import { ProductClaritySection } from '@/components/homepage/ProductClaritySection'
import { StatsSection } from '@/components/homepage/StatsSection'
import { HowItWorksSection } from '@/components/homepage/HowItWorksSection'
import { CTASection } from '@/components/homepage/CTASection'

export default function HomePage() {
  return (
    <div className="bg-[#080808] text-white">
      <NavBar />

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. WHAT IS IT ─────────────────────────────────────────── */}
      <ProductClaritySection />

      {/* ── 3. STATS ──────────────────────────────────────────────── */}
      <StatsSection />

      {/* ── 4. HOW IT WORKS ───────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ── 5. CTA ────────────────────────────────────────────────── */}
      <CTASection />
    </div>
  )
}
