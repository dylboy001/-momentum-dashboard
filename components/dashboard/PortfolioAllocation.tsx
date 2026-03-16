'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Pick {
  ticker: string
  theme: string
  weight_pct: number
}

interface PortfolioAllocationProps {
  picks: Pick[]
}

// Distinct colors for up to ~10 positions
const COLORS = [
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
  '#a78bfa', // purple-light
]

interface TooltipPayload {
  name: string
  value: number
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { name: string; value: number }[]
}) {
  if (!active || !payload?.length) return null
  const d = payload[0] as TooltipPayload
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-white font-mono font-bold">{d.name}</p>
      <p className="text-zinc-300">{d.value.toFixed(1)}% of portfolio</p>
    </div>
  )
}

function CustomLegend({ picks }: { picks: Pick[] }) {
  return (
    <ul className="flex flex-col gap-1.5 justify-center pl-2">
      {picks.map((p, i) => (
        <li key={p.ticker} className="flex items-center gap-2 text-sm">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
          />
          <span className="font-mono text-zinc-200">{p.ticker}</span>
          <span className="text-zinc-500 ml-auto pl-4">{p.weight_pct.toFixed(1)}%</span>
        </li>
      ))}
    </ul>
  )
}

export function PortfolioAllocation({ picks }: PortfolioAllocationProps) {
  if (!picks.length) {
    return (
      <p className="text-zinc-500 text-sm py-6 text-center">No positions.</p>
    )
  }

  const data = picks.map((p) => ({
    name: p.ticker,
    value: p.weight_pct,
  }))

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={180} height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <CustomLegend picks={picks} />
    </div>
  )
}
