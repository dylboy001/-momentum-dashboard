'use client'

import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'

interface ProLockProps {
  children: React.ReactNode
}

export function ProLock({ children }: ProLockProps) {
  const { isSignedIn, sessionClaims } = useAuth()
  const metadata = (sessionClaims as Record<string, unknown> | null)?.metadata as { tier?: string } | undefined
  const hasPro = isSignedIn && (metadata?.tier === 'pro' || metadata?.tier === 'premium')

  if (hasPro) {
    return <>{children}</>
  }

  return (
    <div className="relative min-h-[400px]">
      {/* Blurred content teaser */}
      <div className="blur-sm pointer-events-none select-none opacity-50" aria-hidden>
        {children}
      </div>
      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#080808]/70 backdrop-blur-sm rounded-2xl z-10">
        <div className="text-center space-y-4 p-8 max-w-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-violet-950/60 border border-violet-800/50 flex items-center justify-center">
            <Lock size={20} className="text-violet-400" />
          </div>
          <h3 className="text-white font-thin text-xl tracking-tight">Pro Feature</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Upgrade to unlock live picks, rebalance timer, and full sector analysis.
          </p>
          <Link href="/pricing" className="btn-primary inline-block">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  )
}
