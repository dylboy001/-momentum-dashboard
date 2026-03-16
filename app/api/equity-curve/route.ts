import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') === 'growth' ? 'growth' : 'balanced'

  const filename = mode === 'growth' ? 'equity_curve_growth.json' : 'equity_curve_data.json'
  const filePath = path.join(process.cwd(), 'data', filename)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      {
        error: `Equity curve data not found (${mode} mode)`,
        detail: `Run: python gen_equity_curve${mode === 'growth' ? '_growth' : ''}.py to generate ${filename}`,
      },
      { status: 503 }
    )
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { error: 'Failed to read equity curve', detail: message },
      { status: 500 }
    )
  }
}
