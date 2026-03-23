'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavBar } from '@/components/dashboard/NavBar';
import { PageHeader } from '@/components/ui/page-header';
import { BookOpen, TrendingUp, BarChart2, RefreshCw, FlaskConical } from 'lucide-react';

interface Article {
  slug: string;
  icon: React.ElementType;
  title: string;
  summary: string;
  readTime: string;
  body: React.ReactNode;
}

const ARTICLES: Article[] = [
  {
    slug: 'momentum-trading',
    icon: TrendingUp,
    title: 'What is Momentum Trading?',
    summary: 'Momentum investing means buying assets that are rising and selling those that are falling. Our strategy rotates across 19 sectors to find the strongest uptrends.',
    readTime: '4 min read',
    body: (
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        <p>
          Momentum investing is one of the most well-documented phenomena in financial markets. The core idea is simple: assets that have been performing well recently tend to continue performing well over the next few months, and assets that have been underperforming tend to continue lagging.
        </p>
        <p>
          This effect — sometimes called the <span className="text-zinc-200">momentum premium</span> — has been observed across stocks, bonds, commodities, currencies, and even real estate going back over a century of market data. It was formally documented by academics Jegadeesh and Titman in 1993 and has held up in peer-reviewed research across virtually every major market.
        </p>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">Why does momentum work?</h3>
        <p>
          There are two leading explanations. The first is behavioural: investors systematically underreact to new information, causing prices to adjust slowly rather than instantly. Early movers earn excess returns as the rest of the market catches up. The second is risk-based: high-momentum assets often carry genuine economic risk that justifies a return premium.
        </p>
        <p>
          In practice, both are probably true. What matters for our strategy is that the pattern is persistent and tradeable.
        </p>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">How our strategy uses momentum</h3>
        <p>
          Rather than picking individual stocks, we rotate capital at the sector level. We rank 19 broad market sectors (ETFs + BTC + ETH) by their 16–26 week price momentum, then apply an EMA 10/100 trend filter to confirm the uptrend is genuine before allocating. Capital flows into the top 1–2 qualifying sectors each rebalance.
        </p>
        <p>
          The result is a concentrated portfolio of 1–2 high-momentum sectors, rebalanced weekly (Balanced) or monthly (Growth). No discretionary guesswork — just price data, systematic rules, and discipline.
        </p>
      </div>
    ),
  },
  {
    slug: 'rs-score',
    icon: BarChart2,
    title: 'How Momentum Is Scored',
    summary: '16–26 week momentum ranks which of the 19 sectors is strongest. The EMA 10/100 filter then confirms whether the trend is real. Together these two factors determine what the portfolio holds.',
    readTime: '3 min read',
    body: (
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        <p>
          The <span className="text-zinc-200">momentum score</span> is the primary metric used to rank all 19 sectors. It answers the question: which sectors are showing the strongest sustained price trends right now?
        </p>
        <div className="bg-zinc-100 dark:bg-zinc-800/60 rounded-lg px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 my-4">
          Momentum Score = (Price today / Price N weeks ago) − 1  [N = 16 Balanced · 26 Growth]
        </div>
        <p>
          A high score means the sector has been rising strongly over the past 16–26 weeks. All 19 sectors are ranked by this score at each rebalance.
        </p>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">The EMA 10/100 trend filter</h3>
        <p>
          A high momentum score alone isn&apos;t enough — a sector can spike briefly without being in a genuine uptrend. The filter requires:
        </p>
        <div className="bg-zinc-100 dark:bg-zinc-800/60 rounded-lg px-4 py-3 font-mono text-xs text-zinc-700 dark:text-zinc-300 my-4">
          Price &gt; EMA(10 days) &gt; EMA(100 days)
        </div>
        <p>
          All three aligned means the trend is confirmed on both a short (10d) and medium-term (100d) daily basis. Only sectors that pass both the momentum ranking AND this filter receive capital.
        </p>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">Why this matters for crypto</h3>
        <p>
          Bitcoin and Ethereum have the highest momentum scores during bull cycles — but also crash hard. The EMA 10/100 filter blocked crypto during the 2018–2019 and 2022–2023 bear markets when BTC fell below its 100-day EMA, protecting the portfolio while most crypto holders lost 60–80%.
        </p>
      </div>
    ),
  },
  {
    slug: 'themes',
    icon: BookOpen,
    title: 'Sector Rankings Explained',
    summary: 'Our 19 sectors cover Tech, Energy, Commodities, and crypto (BTC + ETH). We rank by 16–26 week momentum with a trend filter to find genuine uptrends.',
    readTime: '3 min read',
    body: (
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        <p>
          The strategy organises the investable universe into <span className="text-zinc-200">19 sectors</span>: 17 ETFs (equity sectors, commodities, alternatives) plus direct BTC and ETH. Each rebalance these sectors are ranked by 16–26 week price return — highest to lowest. An EMA 10/100 trend filter then screens out anything not in a confirmed uptrend.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">US Equities (11)</p>
            <p className="text-zinc-400 text-xs leading-loose">
              Technology (XLK) · Financials (XLF) · Healthcare (XLV) · Energy (XLE) · Consumer Cyclical (XLY) · Consumer Defensive (XLP) · Industrials (XLI) · Materials (XLB) · Utilities (XLU) · Real Estate (XLRE) · Comm. Services (XLC)
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mb-2">Commodities &amp; Crypto (8)</p>
            <p className="text-zinc-400 text-xs leading-loose">
              Gold (GLD) · Silver (SLV) · Copper (CPER) · Uranium (URA) · Clean Energy (ICLN) · Crypto Futures (BITO) · Bitcoin (BTC) · Ethereum (ETH)
            </p>
          </div>
        </div>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">Why ETFs as benchmarks?</h3>
        <p>
          ETFs are highly liquid, transparent, and widely recognised. Using the ETF as the sector benchmark means we&apos;re measuring momentum against a real, tradeable asset — not a theoretical index. It also means any investor can verify the data independently.
        </p>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">Selecting the top sector(s)</h3>
        <p>
          The top 1–2 sectors with the highest 16–26 week momentum that also pass the EMA 10/100 trend filter receive equal capital allocation. If no sectors qualify, the strategy holds cash rather than force a trade into a questionable setup.
        </p>
        <p>
          In Balanced mode (recommended), the top 2 qualifying sectors each receive 50% of capital. In Growth mode, 100% goes to the single highest-ranked qualifying sector.
        </p>
      </div>
    ),
  },
  {
    slug: 'rebalancing',
    icon: RefreshCw,
    title: 'Quarterly Rebalancing Strategy',
    summary: 'Balanced mode rebalances weekly, Growth mode monthly. Between rebalances, you hold positions — no day trading required.',
    readTime: '3 min read',
    body: (
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        <p>
          Rebalancing frequency is one of the most important — and most underappreciated — decisions in any systematic strategy. Rebalance too often and you rack up transaction costs, short-term capital gains taxes, and exposure to short-term noise. Rebalance too rarely and you risk holding fading positions long after their momentum has turned.
        </p>
        <p>
          <span className="text-zinc-200">Balanced mode rebalances weekly (every 7 days)</span> and <span className="text-zinc-200">Growth mode rebalances monthly (every 30 days)</span>. Because momentum trends are persistent, weekly rebalancing typically re-selects the same sector — keeping actual turnover lower than it sounds while catching reversals faster.
        </p>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">What happens on rebalance day?</h3>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400">
          <li>Re-rank all 19 sectors by current momentum (16w Balanced · 26w Growth)</li>
          <li>Identify the top sector(s) with positive momentum</li>
          <li>Apply EMA 10/100 daily filter to confirm each top sector is in a genuine uptrend</li>
          <li>Allocate equally to top 1–2 qualifying sectors (ETF or direct crypto)</li>
          <li>Sell positions no longer in the portfolio; buy incoming sectors</li>
          <li>Adjust sizing of retained positions to match new target weights (50% each)</li>
        </ol>
        <p>
          The entire process takes 15–30 minutes. For ETF positions: any major broker (Fidelity, Schwab, IBKR). For BTC/ETH: a regulated exchange (Coinbase, Kraken) or a Bitcoin ETF (IBIT) as a proxy.</p>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">Between rebalances</h3>
        <p>
          You hold. Momentum strategies reward patience and penalise overtrading. Ignoring short-term volatility between rebalance dates is part of the discipline. The exception: if a position drops more than 20–25% from entry, a discretionary stop-loss review is reasonable.
        </p>
      </div>
    ),
  },
  {
    slug: 'backtests',
    icon: FlaskConical,
    title: 'Backtests vs Live Results',
    summary: 'Backtests show what WOULD have happened. Live results show what ACTUALLY happens. Expect differences due to slippage, execution, and market changes.',
    readTime: '5 min read',
    body: (
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        <p>
          Every quantitative strategy is built on backtested data. But backtests have a fundamental limitation: they are calculated after the fact, with perfect hindsight, using rules that were themselves derived from the same historical data. Understanding the gap between backtested and live results is critical to realistic expectations.
        </p>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">Why backtests look better than reality</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="text-violet-400 font-mono text-xs mt-0.5 shrink-0">01</span>
            <div>
              <p className="text-zinc-200 text-xs font-medium mb-0.5">Perfect execution</p>
              <p>Backtests assume you transact at exactly the closing price. In practice, market orders fill at slightly worse prices (slippage). ETFs and major crypto are highly liquid so slippage is minimal, but it still exists.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-violet-400 font-mono text-xs mt-0.5 shrink-0">02</span>
            <div>
              <p className="text-zinc-200 text-xs font-medium mb-0.5">No market impact</p>
              <p>Large orders move prices. Backtests ignore this. For small retail portfolios it&apos;s negligible; for larger accounts it erodes returns.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-violet-400 font-mono text-xs mt-0.5 shrink-0">03</span>
            <div>
              <p className="text-zinc-200 text-xs font-medium mb-0.5">Survivorship bias</p>
              <p>Our backtest uses ETFs and direct crypto only — no individual stock picking. ETFs don’t suffer from survivorship bias. The equity curve on the Performance page represents clean, point-in-time data with no survivorship inflation.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-violet-400 font-mono text-xs mt-0.5 shrink-0">04</span>
            <div>
              <p className="text-zinc-200 text-xs font-medium mb-0.5">Overfitting</p>
              <p>Any strategy that has been tuned on historical data will look better in-sample than out-of-sample. Even well-intentioned researchers risk finding patterns that were noise, not signal.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-violet-400 font-mono text-xs mt-0.5 shrink-0">05</span>
            <div>
              <p className="text-zinc-200 text-xs font-medium mb-0.5">Regime changes</p>
              <p>Markets evolve. A strategy that worked from 2000–2020 may face a different regime in the 2020s. Zero-interest-rate environments, algorithmic trading saturation, and changing correlations all affect strategy performance.</p>
            </div>
          </div>
        </div>
        <h3 className="text-zinc-200 font-medium mt-6 mb-2">How to think about our backtested numbers</h3>
        <p>
          The backtested CAGR and other metrics shown on this site are honest estimates using standard rules, not cherry-picked windows. But treat them as a plausibility check — evidence that the approach has a rational basis in historical data — rather than a guarantee of future performance. The strategy&apos;s live results will always differ, likely negatively, from the backtest.
        </p>
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40 rounded-lg px-4 py-3 text-amber-700 dark:text-amber-300/80 text-xs leading-relaxed mt-4">
          Past performance is not indicative of future results. Backtested results are hypothetical and do not represent actual trading. All investing involves risk of loss.
        </div>
      </div>
    ),
  },
];

export default function ResourcesPage() {
  const [active, setActive] = useState(0);
  const article = ARTICLES[active];
  const Icon = article.icon;

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar />

      <PageHeader
        tag="— Resources"
        title="Educational Resources"
        sub="Understand the strategy from the ground up. Concepts behind momentum investing, how scoring works, and what to expect from a systematic approach."
      />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">

          {/* ── Left: sticky article nav ─────────────────────────────── */}
          <nav className="w-full flex flex-row md:flex-col gap-2 md:gap-0 md:sticky md:top-24 md:shrink-0 md:w-52 md:space-y-1 overflow-x-auto pb-1 md:pb-0">
            {ARTICLES.map((a, i) => {
              const NavIcon = a.icon;
              const isActive = i === active;
              return (
                <button
                  key={a.slug}
                  onClick={() => setActive(i)}
                  className={[
                    'group shrink-0 md:w-full text-left rounded-xl px-4 py-3 md:py-3.5 transition-colors duration-200',
                    isActive
                      ? 'bg-zinc-900 border border-zinc-700'
                      : 'border border-transparent hover:bg-zinc-900/60 hover:border-zinc-800',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <NavIcon size={13} className={isActive ? 'text-violet-400' : 'text-zinc-600 group-hover:text-zinc-500'} />
                    <span className={`font-mono text-[10px] uppercase tracking-[0.18em] ${isActive ? 'text-violet-400' : 'text-zinc-600 group-hover:text-zinc-500'}`}>
                      {a.readTime}
                    </span>
                  </div>
                  <span className={`block text-sm font-medium leading-snug whitespace-nowrap md:whitespace-normal ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                    {a.title}
                  </span>
                </button>
              );
            })}

            {/* Continue learning */}
            <div className="pt-5 mt-3 border-t border-zinc-800/60 space-y-1">
              <p className="px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600 mb-2">Also explore</p>
              {[
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Live Dashboard', href: '/dashboard' },
                { label: 'Rankings', href: '/rankings' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-900/40"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </nav>

          {/* ── Right: article content ────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Article header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-violet-400" />
              </div>
              <div>
                <h2 className="text-xl font-thin tracking-tight text-white mb-1">{article.title}</h2>
                <p className="text-xs text-zinc-500">{article.summary}</p>
              </div>
            </div>

            <div className="h-px mb-6 bg-gradient-to-r from-zinc-800 via-zinc-700/50 to-transparent" />

            {/* Article body — keyed so it resets scroll on tab switch */}
            <div key={active} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl px-6 py-6">
              {article.body}
            </div>

            {/* Read time footer */}
            <p className="mt-4 text-xs text-zinc-600 text-right font-mono">{article.readTime}</p>

          </div>
        </div>
      </main>

    </div>
  );
}
