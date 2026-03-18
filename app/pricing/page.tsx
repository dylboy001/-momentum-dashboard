import Link from 'next/link'
import { NavBar } from '@/components/dashboard/NavBar'
import { PageHeader } from '@/components/ui/page-header'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Check, Minus } from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

interface Feature {
  text: string
  included: boolean
  soon?: boolean
}

interface Tier {
  id: string
  badge: string
  name: string
  price: number | 'Free'
  description: string
  cta: string
  ctaHref: string
  recommended: boolean
  features: Feature[]
}

const TIERS: Tier[] = [
  {
    id: 'free',
    badge: 'Explorer',
    name: 'Free',
    price: 'Free',
    description: 'Get a feel for the strategy with full access to sector rankings and educational content.',
    cta: 'Start Free',
    ctaHref: '/rankings',
    recommended: false,
    features: [
      { text: 'View all 19 sector momentum rankings', included: true  },
      { text: 'Sector momentum scores & vs SPY',     included: true  },
      { text: 'FAQ & How It Works',                  included: true  },
      { text: 'Constituent stock drill-down',        included: false },
      { text: 'Balanced mode picks (top 2 sectors)', included: false },
      { text: 'Rebalance countdown timer',           included: false },
      { text: 'Email alerts on rebalance day',       included: false },
      { text: 'Growth mode (100% concentration)',    included: false },
      { text: 'Historical performance data',         included: false },
    ],
  },
  {
    id: 'pro',
    badge: 'Trader',
    name: 'Pro',
    price: 49,
    description: 'Balanced mode: 47.72% CAGR over 19 years. Get exact ETF + crypto picks, position sizes, and weekly rebalance picks.',
    cta: 'Subscribe Now',
    ctaHref: '#',
    recommended: true,
    features: [
      { text: 'Everything in Free',                       included: true },
      { text: 'Constituent stocks per sector with RS data', included: true },
      { text: 'Balanced mode picks (top 2 sectors)',       included: true },
      { text: 'Equal-weight position sizing (50/50)',      included: true },
      { text: 'Rebalance countdown timer',                included: true },
      { text: 'Email alerts on rebalance day',            included: true },
      { text: 'Historical performance data',              included: true },
      { text: 'Growth mode picks',                        included: false },
      { text: 'API access & data export',                 included: false },
    ],
  },
  {
    id: 'premium',
    badge: 'Institutional',
    name: 'Premium',
    price: 99,
    description: 'Growth mode: 61.34% CAGR, concentrated single-sector allocation. For experienced investors who can handle -75.9% drawdowns.',
    cta: 'Contact Sales',
    ctaHref: 'mailto:sales@momentumcap.io',
    recommended: false,
    features: [
      { text: 'Everything in Pro',               included: true },
      { text: 'Growth mode (61.34% CAGR, top 1)', included: true },
      { text: 'Priority email support',           included: true },
      { text: 'Early access to new features',     included: true },
      { text: 'API access (JSON)',                  included: true, soon: true },
      { text: 'Backtest export',                  included: true, soon: true },
    ],
  },
]

const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No long-term contracts. Cancel your subscription at any time from your account settings and you will not be charged again. You retain access until the end of your current billing period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard) as well as PayPal. All payments are processed securely through Stripe.',
  },
  {
    q: 'Is the Free tier really free forever?',
    a: 'Yes. The Free tier (Explorer) has no time limit and requires no credit card. You can access sector rankings and momentum scores indefinitely at no cost.',
  },
  {
    q: 'When is the Pro plan worth it?',
    a: 'Once you want to act on the strategy — seeing the actual stock picks, position sizes, and rebalance dates — Pro gives you everything needed to execute quarterly rotation on your own brokerage account.',
  },
  {
    q: 'Why does the equity curve look flat vs SPY before 2016?',
    a: "Before 2017, the strategy had no crypto. Bitcoin and Ethereum are the primary alpha drivers — their bull-market gains, filtered through the EMA 10/100 daily trend check, are what create the steep compounding visible from 2017 onward. The 2006–2016 period was pure ETF and commodity rotation, which still outperformed in crises (2008: -4.6% vs SPY -40.4%) but lacked a high-octane outlier asset. The J-curve inflects when BTC's first major bull run qualified under the trend filter in 2017.",
  },
]

// ─── Components ──────────────────────────────────────────────────────────────

function FeatureRow({ text, included, soon }: Feature) {
  return (
    <li className="flex items-start gap-3 text-sm">
      {included ? (
        <Check size={15} className="text-emerald-400 mt-0.5 shrink-0" />
      ) : (
        <Minus size={15} className="text-zinc-700 mt-0.5 shrink-0" />
      )}
      <span className={included ? 'text-zinc-300' : 'text-zinc-500'}>
        {text}
        {soon && (
          <span className="inline-block whitespace-nowrap align-middle ml-2 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-500/80 border border-amber-500/30 bg-amber-500/[0.08] px-1.5 py-0.5 rounded">
            Coming soon
          </span>
        )}
      </span>
    </li>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar />

      <PageHeader
        tag="— Pricing"
        title="Simple, Transparent Pricing"
        sub="Start free with full rankings access. Upgrade when you're ready to act on the picks."
      />

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 space-y-20">

        {/* ── Pricing cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {TIERS.map((tier) => (
            <GlassCard
              key={tier.id}
              className={`overflow-visible relative flex flex-col hover:-translate-y-1 ${
                tier.recommended
                  ? 'border-violet-500/70 shadow-violet-600/20'
                  : ''
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-violet-600 text-white border-violet-500 px-3 py-0.5 text-xs font-medium shadow-md">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="pb-0 pt-8 px-6">
                <div className="space-y-4">
                  <div>
                    <Badge
                      variant="outline"
                      className={`text-xs mb-2 ${
                        tier.recommended
                          ? 'border-violet-700 text-violet-300'
                          : 'border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {tier.badge}
                    </Badge>
                    <h2 className="text-xl font-semibold text-zinc-100">{tier.name}</h2>
                  </div>

                  <div className="flex items-end gap-1">
                    {tier.price === 'Free' ? (
                      <span className="text-4xl font-bold text-zinc-100">Free</span>
                    ) : (
                      <>
                        <span className="text-zinc-400 text-lg mb-1">$</span>
                        <span className="text-4xl font-bold text-zinc-100">{tier.price}</span>
                        <span className="text-zinc-400 text-sm mb-1">/month</span>
                      </>
                    )}
                  </div>

                  <p className="text-zinc-400 text-sm leading-relaxed">{tier.description}</p>

                  <Link
                    href={tier.ctaHref}
                    className={`block w-full text-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      tier.recommended
                        ? 'bg-violet-600 hover:bg-violet-500 text-white'
                        : 'border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800'
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>

              <div className="pt-6 pb-7 px-6">
                <div className="border-t border-zinc-800/60 pt-6">
                  <ul className="space-y-3">
                    {tier.features.map((f) => (
                      <FeatureRow key={f.text} {...f} />
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* ── Feature comparison note ── */}
        <div className="flex items-center justify-center gap-8 text-xs text-zinc-400">
          <span className="flex items-center gap-2">
            <Check size={13} className="text-emerald-400" /> Included
          </span>
          <span className="flex items-center gap-2">
            <Minus size={13} className="text-zinc-700" /> Not included
          </span>
          <span className="text-zinc-700">·</span>
          <span>All plans billed monthly. No annual lock-in.</span>
        </div>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-500">faq</p>
            <h2 className="text-2xl font-light tracking-tight text-white">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl px-5 data-[state=open]:border-zinc-700/60"
              >
                <AccordionTrigger className="text-sm font-medium text-zinc-200 hover:text-zinc-100 hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-zinc-400 leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* ── Footer note ── */}
        <p className="text-center text-xs text-zinc-500 max-w-2xl mx-auto leading-relaxed">
          All plans include access to our systematic momentum rebalancing strategy.
          Past performance does not guarantee future results.{' '}
          <Link href="/terms" className="hover:text-zinc-400 transition-colors underline underline-offset-2">
            See Terms &amp; Conditions
          </Link>
          .
        </p>

      </main>

    </div>
  )
}
