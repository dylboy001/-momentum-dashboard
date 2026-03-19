'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useTheme } from 'next-themes';

interface DataPoint {
  date: string;
  strategy: number;
  spy: number;
}

interface Props {
  data: DataPoint[];
  finalStrategy: number;
  finalSpy: number;
  strategyLabel?: string;
}

function formatDollar(val: number): string {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
  if (val >= 1_000)     return `$${(val / 1_000).toFixed(0)}k`;
  return `$${val.toFixed(0)}`;
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { dataKey: string; value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const strategy = payload.find(p => p.dataKey === 'strategy')?.value;
  const spy      = payload.find(p => p.dataKey === 'spy')?.value;
  const aheadNum = strategy && spy ? (strategy / spy - 1) * 100 : null;

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1.5 font-mono">{label}</p>
      {strategy != null && (
        <p className="text-violet-400">Strategy: {formatDollar(strategy)}</p>
      )}
      {spy != null && (
        <p className="text-zinc-400">SPY: {formatDollar(spy)}</p>
      )}
      {aheadNum != null && (
        <p className={`mt-1.5 border-t border-zinc-800 pt-1.5 ${aheadNum >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {aheadNum >= 0 ? '+' : ''}{aheadNum.toFixed(1)}% vs SPY
        </p>
      )}
    </div>
  );
}

function CustomLegend({ finalStrategy, finalSpy, strategyLabel }: { finalStrategy: number; finalSpy: number; strategyLabel: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-end text-xs mb-2 pr-1">
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-5 h-0.5 bg-violet-500 rounded" />
        <span className="text-zinc-300 dark:text-zinc-300">
          {strategyLabel}: $10k → {formatDollar(finalStrategy)}
        </span>
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block w-5 h-0.5 bg-zinc-400 dark:bg-zinc-500 rounded" />
        <span className="text-zinc-500 dark:text-zinc-400">
          S&amp;P 500: $10k → {formatDollar(finalSpy)}
        </span>
      </span>
    </div>
  );
}

export function EquityCurveChart({ data, finalStrategy, finalSpy, strategyLabel = 'Momentum Strategy' }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  const gridColor   = isDark ? '#27272a' : '#e2e8f0';
  const axisColor   = isDark ? '#3f3f46' : '#e2e8f0';
  const tickColor   = isDark ? '#71717a' : '#94a3b8';
  const spyColor    = isDark ? '#71717a' : '#94a3b8';

  // Find one date per year for X-axis ticks
  const yearTicks = ['2006', '2008', '2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024']
    .map(y => data.find(d => d.date.startsWith(y))?.date)
    .filter((d): d is string => !!d);

  return (
    <div>
      <CustomLegend finalStrategy={finalStrategy} finalSpy={finalSpy} strategyLabel={strategyLabel} />
      <ResponsiveContainer width="100%" height={380}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            ticks={yearTicks}
            tickFormatter={val => val.slice(0, 4)}
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
            dy={6}
          />
          <YAxis
            scale="log"
            domain={['auto', 'auto']}
            tickFormatter={formatDollar}
            tick={{ fill: tickColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={58}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="strategy"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="spy"
            stroke={spyColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: spyColor, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
