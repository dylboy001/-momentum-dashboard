'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'

interface ThemeRankingsProps {
  // Array of [theme, momentum_pct] tuples
  rankings: [string, number][]
  topThemes: string[]
}

interface TooltipPayload {
  value: number
  payload: { theme: string; momentum: number }
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayload[]
}) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm shadow-xl">
      <p className="text-zinc-300 font-mono font-bold">{d.payload.theme}</p>
      <p
        className={
          d.value >= 0 ? 'text-emerald-400' : 'text-red-400'
        }
      >
        {d.value >= 0 ? '+' : ''}
        {d.value.toFixed(2)}% momentum
      </p>
    </div>
  )
}

export function ThemeRankings({ rankings, topThemes }: ThemeRankingsProps) {
  const data = rankings.slice(0, 10).map(([theme, momentum]) => ({
    theme,
    momentum,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
        barCategoryGap="20%"
      >
        <XAxis
          dataKey="theme"
          tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#71717a', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
          width={64}
          label={{
            value: '12w Momentum',
            angle: -90,
            position: 'insideLeft',
            fill: '#52525b',
            fontSize: 9,
            style: { textAnchor: 'middle' },
          }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <ReferenceLine y={0} stroke="#3f3f46" strokeDasharray="3 3" />
        <Bar dataKey="momentum" radius={[3, 3, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.theme}
              fill={
                topThemes.includes(entry.theme)
                  ? '#8b5cf6'          // violet — active position
                  : entry.momentum >= 0
                  ? '#10b981'          // emerald — positive
                  : '#ef4444'          // red — negative
              }
              fillOpacity={topThemes.includes(entry.theme) ? 1 : 0.65}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
