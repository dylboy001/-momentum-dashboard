'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info } from 'lucide-react'

interface Pick {
  ticker: string
  name?: string
  theme: string
  price: number
  rs_score: number
  volatility: number | null
  weight_pct: number
}

interface PicksTableProps {
  picks: Pick[]
}

const THEME_LABELS: Record<string, string> = {
  XLK: 'Technology',
  XLF: 'Financials',
  XLV: 'Healthcare',
  XLE: 'Energy',
  XLY: 'Cons. Cyclical',
  XLP: 'Cons. Defensive',
  XLI: 'Industrials',
  XLB: 'Materials',
  XLU: 'Utilities',
  XLRE: 'Real Estate',
  XLC: 'Comm. Services',
  GLD: 'Gold',
  SLV: 'Silver',
  CPER: 'Copper',
  URA: 'Uranium',
  LIT: 'Lithium',
  ICLN: 'Clean Energy',
  BITO: 'Crypto',
}

export function PicksTable({ picks }: PicksTableProps) {
  if (!picks.length) {
    return (
      <p className="text-zinc-500 text-sm py-6 text-center">No picks available.</p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-zinc-800 hover:bg-transparent">
          <TableHead className="text-zinc-400 font-medium">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1 cursor-help">
                Ticker <Info size={11} className="text-zinc-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                Stock symbol
              </TooltipContent>
            </Tooltip>
          </TableHead>
          <TableHead className="text-zinc-400 font-medium">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1 cursor-help">
                Theme <Info size={11} className="text-zinc-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                Sector/theme classification (Tech, Energy, Silver, etc.)
              </TooltipContent>
            </Tooltip>
          </TableHead>
          <TableHead className="text-zinc-400 font-medium text-right">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1 cursor-help ml-auto">
                Price <Info size={11} className="text-zinc-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                Current market price
              </TooltipContent>
            </Tooltip>
          </TableHead>
          <TableHead className="text-zinc-400 font-medium text-right">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1 cursor-help ml-auto">
                RS Score <Info size={11} className="text-zinc-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                Relative Strength — how much the stock outperforms its theme. Higher = stronger.
              </TooltipContent>
            </Tooltip>
          </TableHead>
          <TableHead className="text-zinc-400 font-medium text-right">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1 cursor-help ml-auto">
                Volatility <Info size={11} className="text-zinc-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                Annual volatility % — higher = more price swings.
              </TooltipContent>
            </Tooltip>
          </TableHead>
          <TableHead className="text-zinc-400 font-medium text-right">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-1 cursor-help ml-auto">
                Weight <Info size={11} className="text-zinc-600" />
              </TooltipTrigger>
              <TooltipContent className="max-w-56 text-xs bg-zinc-800 border-zinc-700 text-zinc-200">
                Portfolio allocation % based on inverse volatility.
              </TooltipContent>
            </Tooltip>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {picks.map((pick) => (
          <TableRow
            key={pick.ticker}
            className="border-zinc-800 hover:bg-zinc-800/50 transition-colors"
          >
            <TableCell>
              <span className="font-mono font-bold text-white">{pick.ticker}</span>
              {pick.name && (
                <span className="block text-xs text-zinc-500 font-sans font-normal mt-0.5 leading-tight">
                  {pick.name}
                </span>
              )}
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className="border-zinc-600 text-zinc-300 text-xs"
              >
                {THEME_LABELS[pick.theme] ?? pick.theme}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-mono text-zinc-200">
              ${pick.price.toFixed(2)}
            </TableCell>
            <TableCell className="text-right font-mono">
              <span
                className={
                  pick.rs_score >= 0
                    ? 'text-emerald-400'
                    : 'text-red-400'
                }
              >
                {pick.rs_score >= 0 ? '+' : ''}
                {pick.rs_score.toFixed(2)}
              </span>
            </TableCell>
            <TableCell className="text-right font-mono text-zinc-400">
              {pick.volatility != null ? `${pick.volatility.toFixed(1)}%` : '—'}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: `${Math.min(pick.weight_pct, 100)}%` }}
                  />
                </div>
                <span className="font-mono text-zinc-300 text-sm w-12 text-right">
                  {pick.weight_pct.toFixed(1)}%
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
