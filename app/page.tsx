import { NavBar } from '@/components/dashboard/NavBar'
import { HeroSection } from '@/components/homepage/HeroSection'
import { BentoSection } from '@/components/homepage/BentoSection'
import { HowItWorksSection } from '@/components/homepage/HowItWorksSection'
import { CTASection } from '@/components/homepage/CTASection'

export default function HomePage() {
  return (
    <div className="bg-[#080808] text-white">
      <NavBar />

      {/* ── 1. HERO ───────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. BENTO — strategy proof + stats ─────────────────────── */}
      <BentoSection />

      {/* ── 3. HOW IT WORKS ───────────────────────────────────────── */}
      <HowItWorksSection />

      {/* ── 4. CTA ────────────────────────────────────────────────── */}
      <CTASection />
    </div>
  )
}
