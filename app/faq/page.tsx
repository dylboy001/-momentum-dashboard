'use client';

import { useState } from 'react';
import { NavBar } from '@/components/dashboard/NavBar';
import { PageHeader } from '@/components/ui/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_SECTIONS = [
  {
    number: '01',
    title: 'How It Works',
    sub: 'The mechanics behind the strategy — signals, filters, and structure.',
    faqs: [
      {
        q: 'What is a momentum rotation strategy?',
        a: `Momentum rotation is a systematic approach that shifts capital into the assets currently exhibiting the strongest price trends, and away from weakening ones. The premise is simple: things that have been going up tend to keep going up — at least in the near term.

This strategy measures momentum across 19 themes (17 sector/commodity ETFs + BTC + ETH) — 16 weeks for Balanced mode, 26 weeks for Growth mode. The top 1–2 themes must also pass an EMA 10/100 daily trend filter — we only enter themes in confirmed uptrends. Balanced mode rebalances weekly, Growth mode rebalances monthly.`,
      },
      {
        q: 'What are the 19 themes?',
        a: `Each theme is a broad market segment tracked by a well-known ETF or direct asset:

US Equity Sectors (11): Technology (XLK), Financials (XLF), Healthcare (XLV), Energy (XLE), Consumer Cyclical (XLY), Consumer Defensive (XLP), Industrials (XLI), Materials (XLB), Utilities (XLU), Real Estate (XLRE), Comm. Services (XLC)

Commodities & Alternatives (6): Gold (GLD), Silver (SLV), Copper (CPER), Uranium (URA), Clean Energy (ICLN), Crypto Futures (BITO)

Direct Crypto (2): Bitcoin (BTC) and Ethereum (ETH) — allocated directly when in confirmed uptrend

All 19 compete in the same momentum ranking each rebalance. The strategy holds the top 1–2 that pass the EMA 10/100 daily trend filter.`,
      },
      {
        q: 'What is the EMA 10/100 trend filter?',
        a: `Before entering any theme, the strategy checks whether it is in a genuine uptrend using two exponential moving averages on daily price data:

— EMA 10 (fast): 10-day exponential moving average of the ETF or crypto price
— EMA 100 (slow): 100-day exponential moving average

Entry is only allowed when: Price > EMA 10 > EMA 100

This alignment means the asset is rising on both a short and medium-term basis — not just making a short-lived spike. If a top-ranked theme fails this test (e.g. BTC during a crypto winter), it is skipped and the next qualifying theme is used instead. If no themes qualify, the strategy holds cash.

This filter is the key reason the strategy avoids crypto crashes: BTC fell below its 100-day EMA during the 2018–2019 and 2022–2023 bear markets, correctly keeping the strategy out.`,
      },
      {
        q: 'What exactly does the strategy hold?',
        a: `The strategy holds 1–2 positions at a time, equally weighted:

— For equity sector or commodity themes: the position is held via the theme ETF directly (e.g. buy XLK for Technology, GLD for Gold)
— For crypto themes: Bitcoin (BTC) or Ethereum (ETH) are held as direct assets — not futures or proxies

There are two modes:
• Balanced (recommended): holds top 2 qualifying themes — 50% each. 47.72% CAGR, 1.163 Sharpe, -46.4% max drawdown. Rebalances weekly.
• Growth: holds only the single top-ranked theme — 100% concentration. 61.34% CAGR, 1.065 Sharpe, -75.9% max drawdown. Rebalances monthly.`,
      },
      {
        q: 'How often should I rebalance?',
        a: `It depends on your mode. Balanced mode rebalances every 7 days (weekly). Growth mode rebalances every 30 days (monthly). The dashboard shows a countdown to the next scheduled rebalance date.

The key insight is that if the trend is still intact, weekly rebalancing simply re-picks the same theme — so turnover is lower than it sounds. The benefit is catching trend changes faster than quarterly cadences. Backtesting confirmed that weekly rebalancing nearly matches monthly/quarterly performance while maintaining the same max drawdown profile.

That said, if a position drops significantly from your entry price, a discretionary stop-loss review is always reasonable.`,
      },
    ],
  },
  {
    number: '02',
    title: 'The Numbers',
    sub: 'Performance, credibility, and the questions every serious investor will ask.',
    faqs: [
      {
        q: 'How is $21.5M from a $10,000 investment actually possible?',
        a: `It sounds extraordinary, but the number follows directly from compounding a 47.72% annual return over 19 years. At that rate: $10,000 × (1.4772)^19 = $21.5M. The maths is verifiable — it is not a rounding error or cherry-picked period.

The returns were not evenly distributed across years. The bulk of the compounding came from a small number of concentrated crypto bull runs: Bitcoin's 2017 rally (~+1,700%), the 2020–2021 crypto cycle (~+600%), and BTC's 2024 run (+150%+). During each of these, the EMA 10/100 daily filter confirmed the uptrend before entry — so the strategy was positioned in BTC or ETH during the strongest phases.

Equally important is what the strategy avoided. The EMA filter kept it out of BTC during its 2018–2019 crash (-84%) and the 2022 collapse (-77%). Avoiding those drawdowns preserved the compounded base — which is where most of the $21.5M figure actually comes from.

To be clear about what the backtest includes and excludes: slippage is not modelled (ETFs and major crypto have tight spreads at retail sizes), dividends are excluded (which would slightly improve results), and taxes are not deducted (which in a taxable account would reduce real-world returns significantly). The $21.5M is a gross pre-tax figure.

The return is extraordinary because crypto itself produced extraordinary returns in its bull cycles, and the EMA filter created an asymmetric exposure — capturing the upside while stepping aside during the crashes. That asymmetry, compounded over 19 years, is what drives the number.`,
      },
      {
        q: 'A 47–61% CAGR sounds too good to be true. Is this backtest overfitted?',
        a: `This is the right question to ask of any backtested system, and we take it seriously.

Several factors reduce overfitting risk:

No look-ahead bias: Momentum is computed using only prices available at each rebalance date. The EMA filter uses only historical data up to that point. No future information leaks into past decisions.

Structural simplicity: The strategy has very few parameters — lookback period, number of themes, EMA spans, rebalance cadence. The fewer parameters you tune, the less room there is to overfit.

Robustness across nearby parameters: Lookback periods of 12, 16, 20, and 26 weeks were all tested in the same grid search, alongside EMA combinations and rebalance frequencies. All produce positive Sharpe ratios significantly above SPY. A sharp local optimum surrounded by poor alternatives is a red flag for overfitting — this is not that. The signal is stable across the parameter space.

Known bad years are published, not hidden: 2023 (-2.8% vs SPY +24.3%) is shown prominently on the Performance page. Selectively reporting only good years is itself a form of overfitting. We don't do that.

That said, all backtests are partially optimistic. Transaction costs, execution timing, and the fact that history doesn't repeat exactly will cause real-world results to differ. The 47.72% CAGR (Balanced) is a historical reference point, not a guarantee.`,
      },
      {
        q: 'How were the strategy parameters chosen? Couldn\'t you tune any parameter to fit the history?',
        a: `Fair challenge. Parameters weren't chosen first and validated second — they were selected from a full grid search across lookback periods (12, 16, 20, 26 weeks), EMA combinations (fast: 10/20/50/60, slow: 100/150/200/250), rebalance frequencies (7, 30, 90 days), and concentration (top 1 or 2 themes).

The key check is robustness: does the strategy only work at one specific parameter combination, or does the signal hold broadly? All tested lookback periods produce meaningfully positive Sharpe ratios. The EMA 10/100 combination dominated across multiple lookbacks and rebalance cadences — not just at one setting.

This is also consistent with the broader academic momentum literature, which typically uses 6–12 month lookbacks (roughly 24–52 weeks). 16 and 26 weeks are firmly within that established range — these are not exotic parameters invented to fit this specific dataset.

No parameter selection process eliminates overfitting entirely. What it can do is reduce the risk by requiring robustness across a range, which this strategy passes.`,
      },
      {
        q: 'Why does the strategy include Bitcoin and Ethereum?',
        a: `BTC and ETH have historically been among the highest-momentum assets during their bull cycles — and they compete fairly in the same ranking as all other themes. If crypto has stronger momentum than Technology or Gold and is in a confirmed uptrend, it earns an allocation.

Critically, the EMA 10/100 daily trend filter prevents allocation during crypto bear markets. BTC fell below its 100-day EMA during 2018–2019 and 2022–2023 — the strategy correctly held other themes during those periods, avoiding the worst drawdowns.

This is not speculative crypto exposure. It is rules-based: crypto only gets capital when it is objectively in a strong, confirmed trend.`,
      },
      {
        q: 'Why not just hold BTC and ETH permanently instead of rotating through 19 themes?',
        a: `If you had held Bitcoin from 2017 to 2025 with perfect conviction — never selling through the -84% crash in 2018–2019 or the -77% collapse in 2022 — your returns would be extraordinary. Most people cannot do that. The drawdowns are psychologically and financially brutal.

The rotation strategy solves this problem by applying the EMA 10/100 daily filter. When BTC falls below its 100-day EMA — which it did in both major crypto bear markets — the strategy exits and rotates into whatever theme is actually in a confirmed uptrend at that time. It may be Technology, Gold, Energy, or even cash. The strategy does not hold crypto in a downtrend simply because it was strong before.

This creates asymmetric crypto exposure: the strategy participates in BTC and ETH bull cycles, but is systematically out before (or shortly into) the major crashes. That asymmetry, not just raw crypto exposure, drives the outperformance.

Holding BTC/ETH permanently also concentrates 100% of the portfolio in two highly correlated assets with near-identical bull and bear cycles. The 19-theme universe provides signal diversity — in periods when crypto is in a bear market, equity sector or commodity momentum still exists, and the strategy captures it.

The short answer: permanent BTC/ETH exposure gives you the upside but forces you to survive the -77% to -84% drawdowns. The rotation strategy targets the upside while structurally avoiding the worst of those drawdowns. For most investors, surviving the drawdown is the harder problem.`,
      },
      {
        q: 'What would the returns look like without any crypto exposure?',
        a: `Honest answer: significantly lower, but still meaningfully above SPY.

When backtested with only the 17 sector ETFs and commodity themes — no Bitcoin, no Ethereum — the strategy produces roughly 14–17% CAGR over the same period. That still comfortably beats SPY's 10.80%, and it does so with a similar max drawdown profile and better crisis performance (the EMA filter still kept the strategy out of the worst equity bear markets).

At 15% CAGR over 19 years, $10,000 grows to approximately $160,000 — not $21.5M, but still 2× what a passive SPY investor would have. The strategy has genuine alpha even without crypto.

The extraordinary compounding in the full backtest comes specifically from capturing asymmetric crypto exposure: holding BTC and ETH during their bull cycles while the EMA 10/100 filter exits before the crashes. That asymmetry is the primary driver of the gap between 15% and 47.72%.

This is why the strategy's crypto component is not hidden or downplayed. It is the edge — and understanding it is essential for anyone deciding whether to run this strategy. If you are not comfortable with crypto exposure, the ETF-only rotation is a coherent, rules-based strategy that still outperforms a passive index. If you are, the full universe is available.`,
      },
      {
        q: 'Why not individual stocks? Surely picking the right stocks beats ETFs?',
        a: `This was tested directly — and individual stock picking made the strategy significantly worse.

The full research process started by building a point-in-time-clean stock picker: ranking individual equities by momentum within each sector, applying the same EMA filter, sizing by inverse volatility. The best result from a full grid search over hundreds of parameter combinations was 9.74% CAGR over the same 2006–2025 period. That is barely above SPY's 10.80% — and not worth paying for.

Switching to pure ETF + direct crypto rotation, with no individual stocks at all, produced 47.72% CAGR. The difference is not marginal — it is a completely different order of magnitude.

Why does stock picking hurt?

First, idiosyncratic risk: individual stocks can crater 50–80% on a single earnings miss, fraud allegation, or sector rotation — events that have nothing to do with the broader theme momentum you are trying to capture. An ETF averages this away.

Second, stock selection adds noise. Momentum works at the theme level — the signal that Gold is outperforming Energy is clean and persistent. Trying to pick which gold miner outperforms the others adds a layer of uncertainty that degrades the signal.

Third, the real alpha in this strategy comes from crypto, not from stock selection. No individual stock can compete with BTC or ETH in a crypto bull market. Holding the direct assets rather than proxy stocks (like Coinbase or MicroStrategy) captures the full move.

The conclusion from the data is unambiguous: more granular does not mean better. ETF-level rotation is cleaner, more liquid, and more profitable than stock picking within themes.`,
      },
      {
        q: 'What are the risks?',
        a: `All investing involves risk of loss. This strategy carries specific risks worth understanding:

Whipsaw risk: In choppy or sideways markets, momentum signals can flip frequently. The EMA 10/100 filter reduces but does not eliminate this.

Drawdown risk: The Balanced mode has a -46.4% historical max drawdown. The worst drawdowns coincide with crypto crashes and 2008-style events. Investors should be prepared for extended periods below the prior peak.

Concentration risk: Holding 1–2 themes means the portfolio is not broadly diversified. A sudden reversal in the held theme hits the full portfolio.

Model risk: The backtested results are based on 2006–2025 historical data. Past patterns may not repeat. The model has no ability to predict the future.

Execution risk: Slippage, commissions, and timing differences between signal and execution can erode real-world returns versus backtested returns.`,
      },
    ],
  },
  {
    number: '03',
    title: 'Practical Use',
    sub: 'Executing trades, using the dashboard, and day-to-day questions.',
    faqs: [
      {
        q: 'Is this automated investing, or do I trade myself?',
        a: `Momentum Capital is a signal service — not automated investing. We do the quantitative research: scanning 19 market themes daily, ranking them by momentum, and filtering for confirmed uptrends. You receive a clear weekly signal (which 1–2 themes to hold and at what weight), and you execute the trades yourself in your own brokerage.

Your capital stays in your account at all times. We never have access to it, move it, or manage it. Think of it as having a systematic research analyst working for you — the analysis is done, the decision to act is yours.`,
      },
      {
        q: 'Can I use this alongside my existing trading strategy?',
        a: `Yes — and this is one of the most common ways traders use Momentum Capital.

If you already trade using technical analysis, fundamentals, or your own system, the momentum rankings act as a quantitative confirmation layer. Before entering a trade, check whether the theme ranks in the top 5 with an uptrend confirmed. If it does, you have data-driven backing for your view. If it ranks 15th of 19, you know you are fighting the macro trend.

Specific use cases:

Sector confirmation: You are bullish on Energy from a fundamental view. Momentum Capital ranks XLE in the top 2 with a confirmed uptrend. Your discretionary thesis and the quantitative signal agree — that is meaningful confluence.

Universe filtering: Instead of scanning thousands of stocks, start with the top-ranked themes. You are already in the strongest corner of the market — then apply your own stock selection process within those themes.

Time saving: The system does the broad market scan for you. What might take hours of weekly research is reduced to a 5-minute dashboard check.

The strategy works as a standalone rules-based system. But the underlying signal is a legitimate analytical input regardless of how you choose to use it.`,
      },
      {
        q: 'How do I actually execute the trades?',
        a: `The dashboard tells you what to hold — the actual trading is done through your own brokerage account. A typical rebalance workflow:

1. On or near the rebalance date, open the Live Dashboard
2. Note the current themes and their target weights (50% each for Balanced mode)
3. Log in to your broker and compare current holdings to the new positions
4. Sell positions no longer in the portfolio
5. Buy the new ETFs or crypto assets at the indicated weights
6. Keep a small cash buffer (1–2%) for transaction costs

For ETF positions: any major broker that supports commission-free ETF trading.
For BTC/ETH: any regulated crypto exchange, or a spot Bitcoin/Ethereum ETF as a proxy if preferred.`,
      },
      {
        q: 'What if I miss the rebalance date by a week or two?',
        a: `Missing by a day or two is fine — don't stress it. The momentum signals that drive theme selection shift gradually. The theme ranked #1 today will almost always still rank #1 tomorrow.

For Balanced mode (weekly rebalance), missing by 2–3 days has minimal impact. For Growth mode (monthly rebalance), you have a few days of buffer before drift matters.

The rebalance countdown on the dashboard is a target, not a hard deadline. Consistent execution over time matters far more than hitting the exact day. The biggest mistake is not acting at all because you missed the "ideal" window.`,
      },
      {
        q: 'What is the minimum account size to run this strategy?',
        a: `There is no hard minimum. The strategy holds 1–2 ETFs and occasionally direct crypto. Most brokers offer fractional share trading, so you can allocate precise percentages even with small accounts.

Practical considerations by account size:

$1,000–$5,000: Viable for the ETF-only portion. Crypto exchanges have low minimums ($10–$25). The main challenge is psychological — a -46.4% drawdown on $5,000 is a $2,320 loss in dollar terms. Ensure you can stay the course.

$10,000–$50,000: The strategy works well at this size. Transaction costs are negligible (commission-free ETF trading). Crypto allocations are straightforward on any regulated exchange.

$50,000+: No additional considerations. The ETFs and crypto assets are highly liquid — position sizing is not a constraint at any retail account size.

One practical note: keep a 1–2% cash buffer in your account for transaction costs and to avoid being fully invested (which can cause issues on settlement days).`,
      },
      {
        q: 'When the strategy holds cash, what does that mean?',
        a: `Cash periods occur when no themes pass the EMA 10/100 daily trend filter — meaning no asset class is in a confirmed uptrend that meets the entry criteria. Rather than force a position into a weak or deteriorating market, the strategy steps aside entirely. Historically this has happened several times over 19 years.

During a cash period, the dashboard will show that no themes are currently selected. Check back at the next scheduled rebalance date — the strategy will re-enter as soon as qualifying themes emerge.

What you do with uninvested capital during these periods is a personal decision based on your own circumstances and risk tolerance. We do not make recommendations on where to hold cash. Consult a financial advisor if you need guidance.`,
      },
      {
        q: 'What if I only want to trade the top-ranked themes with my own strategy? Can the rankings serve as a signal for my own analysis?',
        a: `Absolutely — and many experienced investors use momentum rankings exactly this way.

The rankings page shows all 19 themes ordered by 16–26 week price return, with their EMA trend status. You can take that signal and overlay your own analysis on top: fundamental research, technical setups, sector macro views, or any other filter you apply.

Some examples of how traders use this:

Confirmation signal: If your own analysis is bullish on Energy or Gold, checking that the theme ranks in the top 3–5 with a confirmed EMA uptrend adds a systematic data point to your discretionary view.

Universe filtering: Rather than scanning 5,000 stocks, start with the top-momentum themes from the rankings. You are already in the right corner of the market — then apply your own stock selection within those themes.

Contra-indicator awareness: If a theme you are considering is ranked 15th of 19 with a failing EMA filter, the momentum data is telling you the trend is not in your favour. You can still trade it — but you go in with eyes open.

The strategy as published is a complete, rules-based system designed for investors who want to follow it without discretion. But the underlying signal — theme momentum + EMA trend confirmation — is a legitimate analytical input regardless of how you use it.

The rankings page is free. Use it however it serves your process.`,
      },
      {
        q: 'Is this financial advice?',
        a: `No. This dashboard is an educational and analytical tool only. Nothing displayed here constitutes financial advice, investment advice, or a recommendation to buy or sell any security.

The picks, scores, and rankings are outputs of a quantitative model. They do not take into account your personal financial situation, tax position, risk tolerance, investment horizon, or any other individual circumstances.

Always consult a qualified financial advisor before making investment decisions.`,
      },
    ],
  },
];

export default function FAQPage() {
  const [active, setActive] = useState(0);
  const section = FAQ_SECTIONS[active];

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar />

      <PageHeader
        tag="— FAQ"
        title="Frequently Asked Questions"
        sub="Everything you need to understand how the strategy works, what the numbers mean, and how to use this dashboard."
      />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <div className="flex gap-10 items-start">

          {/* ── Left: sticky section nav ─────────────────────────────── */}
          <nav className="sticky top-24 shrink-0 w-52 space-y-1">
            {FAQ_SECTIONS.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.number}
                  onClick={() => setActive(i)}
                  className={[
                    'group w-full text-left rounded-xl px-4 py-3.5 transition-colors duration-200',
                    isActive
                      ? 'bg-violet-950/40 border border-violet-500/20'
                      : 'border border-transparent hover:bg-zinc-900/60 hover:border-zinc-800',
                  ].join(' ')}
                >
                  <span className={`block font-mono text-[10px] uppercase tracking-[0.22em] mb-1 ${isActive ? 'text-violet-400' : 'text-zinc-600 group-hover:text-zinc-500'}`}>
                    {s.number}
                  </span>
                  <span className={`block text-sm font-medium leading-snug ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`}>
                    {s.title}
                  </span>
                  <span className={`block text-xs mt-0.5 leading-snug ${isActive ? 'text-zinc-400' : 'text-zinc-600 group-hover:text-zinc-500'}`}>
                    {s.faqs.length} questions
                  </span>
                </button>
              );
            })}
          </nav>

          {/* ── Right: active section ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Section heading */}
            <div className="mb-6">
              <h2 className="text-xl font-thin tracking-tight text-white mb-1">{section.title}</h2>
              <p className="text-xs text-zinc-500">{section.sub}</p>
            </div>

            <div className="h-px mb-6 bg-gradient-to-r from-zinc-800 via-zinc-700/50 to-transparent" />

            {/* Accordion — keyed on active so it resets open state on tab switch */}
            <Accordion key={active} type="single" collapsible className="space-y-2">
              {section.faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl px-5 data-[state=open]:border-zinc-700/60 transition-colors duration-200"
                >
                  <AccordionTrigger className="text-left text-zinc-100 font-medium hover:text-violet-300 hover:no-underline py-4 text-sm leading-snug">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400 text-sm leading-relaxed pb-5 whitespace-pre-line">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

          </div>
        </div>
      </main>

    </div>
  );
}
