'use client'

type Mode = 'balanced' | 'growth'

const REGIMES: Record<Mode, {
  period: string
  strategy: string
  spy: string
  strategyPositive: boolean
  spyPositive: boolean
  better: boolean
  description: string
}[]> = {
  balanced: [
    {
      period: '2008 Financial Crisis',
      strategy: '-4.6%',
      spy: '-40.4%',
      strategyPositive: false,
      spyPositive: false,
      better: true,
      description: 'The EMA 10/100 daily trend filter rotated out of equities early. While most investors lost 40%+, the strategy avoided the worst of the crash by holding only assets still in confirmed uptrends.',
    },
    {
      period: '2022 Bear Market',
      strategy: '+11.6%',
      spy: '-16.6%',
      strategyPositive: true,
      spyPositive: false,
      better: true,
      description: 'The EMA 10/100 filter correctly blocked crypto allocation (BTC fell below its 100-day EMA). The strategy rotated into Energy and commodities, gaining +11.6% while SPY fell -16.6% — a 28-point swing.',
    },
    {
      period: '2024',
      strategy: '+44.4%',
      spy: '+28.8%',
      strategyPositive: true,
      spyPositive: true,
      better: true,
      description: 'Bitcoin returned to a confirmed uptrend and earned portfolio allocation. Combined with commodity themes, the strategy outpaced the S&P 500 by over 15 percentage points.',
    },
    {
      period: '2023 Recovery',
      strategy: '-2.8%',
      spy: '+24.3%',
      strategyPositive: false,
      spyPositive: true,
      better: false,
      description: 'The AI-driven tech rally concentrated gains in a handful of mega-cap stocks. The momentum rotation held themes that lagged the narrow S&P recovery, underperforming significantly. Not all years go our way.',
    },
  ],
  growth: [
    {
      period: '2008 Financial Crisis',
      strategy: '-20.2%',
      spy: '-36.8%',
      strategyPositive: false,
      spyPositive: false,
      better: true,
      description: 'The EMA filter limited exposure but single-theme concentration led to a -20.2% loss — worse than Balanced. The strategy still outperformed SPY by 16+ points, but the concentrated bet amplified drawdown.',
    },
    {
      period: '2022 Bear Market',
      strategy: '-13.0%',
      spy: '-16.6%',
      strategyPositive: false,
      spyPositive: false,
      better: true,
      description: 'Growth mode edged out SPY by 3.6 points but still lost ground. Unlike Balanced mode (which gained +11.6% via Energy rotation), the single-theme approach missed the sector diversification benefit.',
    },
    {
      period: '2024',
      strategy: '+0.8%',
      spy: '+28.8%',
      strategyPositive: true,
      spyPositive: true,
      better: false,
      description: 'A difficult year for Growth mode. The broad equity rally and BTC bull run favoured the diversified Balanced approach. Single-theme concentration led to suboptimal positioning in this environment.',
    },
    {
      period: '2023 Recovery',
      strategy: '-4.5%',
      spy: '+24.3%',
      strategyPositive: false,
      spyPositive: true,
      better: false,
      description: 'The narrow AI/mega-cap rally that drove SPY higher was not captured by momentum themes. Growth mode\'s full concentration in a single lagging theme made underperformance more pronounced than Balanced.',
    },
  ],
}

export function RegimeBreakdown({ mode = 'balanced' }: { mode?: Mode }) {
  const regimes = REGIMES[mode]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {regimes.map((regime) => (
        <div
          key={regime.period}
          className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-zinc-200">{regime.period}</h3>
            <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              regime.better
                ? 'text-emerald-400 border-emerald-800/60 bg-emerald-950/30'
                : 'text-amber-400 border-amber-800/60 bg-amber-950/30'
            }`}>
              {regime.better ? 'Outperformed' : 'Underperformed'}
            </span>
          </div>

          <div className="flex items-end gap-6 mb-4">
            <div>
              <div className={`text-3xl font-thin tabular-nums leading-none mb-1 ${
                regime.strategyPositive ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {regime.strategy}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600">Strategy</div>
            </div>
            <div className="text-zinc-700 text-lg font-thin mb-4">vs</div>
            <div>
              <div className={`text-3xl font-thin tabular-nums leading-none mb-1 ${
                regime.spyPositive ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                {regime.spy}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-600">S&amp;P 500</div>
            </div>
          </div>

          <p className="text-xs text-zinc-500 leading-relaxed">{regime.description}</p>
        </div>
      ))}
    </div>
  )
}
