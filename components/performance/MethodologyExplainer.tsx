'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const sections = [
  {
    id: 'momentum-calc',
    title: 'How We Calculate Momentum',
    content: (
      <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">
        <p>
          Momentum is calculated as the N-week total return for each sector ETF or crypto asset,
          measured from the close N weeks ago to the most recent close.
        </p>
        <p>
          Balanced mode uses a 16-week lookback. Growth mode uses a 26-week lookback. All 19 sectors
          are ranked by this score. The top 1–2 sectors that also pass the EMA 10/100 daily trend
          filter receive capital.
        </p>
        <p className="text-zinc-500">
          Formula (Balanced): <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-zinc-300">
            momentum = (price_today / price_16w_ago) - 1
          </code>
        </p>
      </div>
    ),
  },
  {
    id: 'rebalancing',
    title: 'Rebalancing Cadence',
    content: (
      <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">
        <p>
          Balanced mode rebalances every 7 days (weekly). Growth mode rebalances every 30 days (monthly).
          Backtesting confirmed that weekly rebalancing nearly matches the performance of less frequent
          cadences while catching trend reversals faster.
        </p>
        <p>
          Because momentum is persistent, the same sectors are often re-selected across consecutive
          rebalances — keeping actual turnover lower than the frequency implies.
        </p>
        <p>
          Slippage is not modelled in backtests. ETFs and major crypto are highly liquid so real-world
          impact at retail account sizes is minimal.
        </p>
      </div>
    ),
  },
  {
    id: 'assumptions',
    title: 'Backtest Assumptions & Limitations',
    content: (
      <div className="space-y-3 text-zinc-400 text-sm leading-relaxed">
        <ul className="space-y-2">
          <li className="flex gap-2">
            <span className="text-zinc-600 mt-0.5">·</span>
            <span><strong className="text-zinc-300">Universe:</strong> 17 sector/commodity ETFs plus direct BTC and ETH (19 sectors total). EMA 10/100 daily entry filter ensures confirmed uptrend before allocation.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600 mt-0.5">·</span>
            <span><strong className="text-zinc-300">Slippage:</strong> 0.1% per trade applied at each rebalance to simulate market impact.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600 mt-0.5">·</span>
            <span><strong className="text-zinc-300">No dividends:</strong> Results reflect price returns only. Including dividends would improve all figures.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600 mt-0.5">·</span>
            <span><strong className="text-zinc-300">Survivorship bias:</strong> Some ETFs in the universe launched after 2005 — earlier data uses synthetic proxies.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-600 mt-0.5">·</span>
            <span><strong className="text-zinc-300">No taxes:</strong> Tax drag from capital gains distributions is not modeled.</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: 'risk',
    title: 'Risk Warnings',
    content: (
      <div className="space-y-3 text-sm leading-relaxed">
        <p className="text-amber-400/80">
          Past performance does not guarantee future results. All investing involves risk,
          including the possible loss of principal.
        </p>
        <p className="text-zinc-400">
          This strategy can experience significant drawdowns. The maximum historical drawdown
          is -46.4% (Balanced) over the 19-year backtest. Investors should be prepared
          for similar or larger losses in future market dislocations.
        </p>
        <p className="text-zinc-400">
          Momentum strategies can underperform during sharp market reversals, when previously
          strong sectors rapidly give way to laggards. This is sometimes called &quot;momentum
          crash&quot; risk.
        </p>
        <p className="text-zinc-500 text-xs">
          This tool is for informational and educational purposes only. It does not constitute
          financial advice. Consult a qualified financial advisor before making investment decisions.
        </p>
      </div>
    ),
  },
]

export function MethodologyExplainer() {
  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          value={section.id}
          className="border-zinc-800"
        >
          <AccordionTrigger className="text-zinc-300 hover:text-white hover:no-underline text-sm font-medium py-5 px-1">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="px-1 pb-5">
            {section.content}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
