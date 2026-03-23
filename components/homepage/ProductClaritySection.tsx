'use client'

const CARDS = [
  {
    num: '01',
    heading: 'The analysis',
    body: 'Every week, we tell you which 1–2 market sectors have the strongest momentum. Clear output: what to hold, at what weight, and when to rebalance next.',
  },
  {
    num: '02',
    heading: 'You execute',
    body: 'Your capital stays in your own brokerage. We never touch it. You decide when and how to act on the analysis — full control, always.',
  },
  {
    num: '03',
    heading: 'Your edge',
    body: 'Run it as a complete rules-based strategy, or use the momentum rankings as quantitative confirmation alongside your own analysis. Either works.',
  },
]

export function ProductClaritySection() {
  return (
    <section className="bg-[#080808] px-8 py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl">

        {/* Statement */}
        <div className="mb-16 max-w-3xl">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-600">
            — What is Momentum Capital?
          </p>
          <h2
            className="font-thin tracking-tight text-white leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.75rem)' }}
          >
            Weekly rotation analysis<br />for self-directed traders.
          </h2>
          <p className="text-base text-zinc-400 leading-relaxed max-w-xl">
            We scan 19 market sectors daily using quantitative momentum analysis and tell you which ones are strongest right now.{' '}
            <span className="text-zinc-200">You execute in your own account.</span>{' '}
            Not a fund. Not a robo-advisor. A systematic research service that does the quantitative work so you don&apos;t have to.
          </p>
        </div>

        {/* 3 cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {CARDS.map(({ num, heading, body }) => (
            <div
              key={num}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800 p-10 transition-colors duration-200 hover:border-zinc-700 dark:hover:bg-zinc-900/30 hover:bg-zinc-50"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <p
                className="mb-10 font-mono font-thin leading-none text-zinc-800 transition-colors duration-300 group-hover:text-zinc-700"
                style={{ fontSize: 'clamp(4rem, 7vw, 7rem)' }}
              >
                {num}
              </p>
              <p className="mb-4 text-xl font-light text-white">{heading}</p>
              <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
