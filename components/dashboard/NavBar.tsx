'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Tag,
  Menu,
  X,
  Lightbulb,
  BookOpen,
  HelpCircle,
  Mail,
  Sun,
  Moon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { SignInButton, Show, UserButton } from '@clerk/nextjs'
import { LogoMark } from '@/components/ui/logo'

import type { ReactNode } from 'react'

const NAV_PRIMARY = [
  { href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/rankings',    label: 'Rankings',    icon: BarChart3 },
  { href: '/performance', label: 'Performance', icon: Activity },
  { href: '/pricing',     label: 'Pricing',     icon: Tag },
]

const NAV_SECONDARY = [
  { href: '/how-it-works', label: 'How It Works', icon: Lightbulb },
  { href: '/resources',    label: 'Resources',    icon: BookOpen },
  { href: '/faq',          label: 'FAQ',          icon: HelpCircle },
  { href: '/contact',      label: 'Contact',      icon: Mail },
]

function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function NavBar({ rightContent }: { rightContent?: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── Header bar ── */}
      <header className="border-b border-zinc-800 dark:border-zinc-800 border-zinc-200 sticky top-0 z-30 bg-white/95 dark:bg-[#080808]/95 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            <Link href="/" className="flex items-center gap-3">
              <LogoMark size={22} animate={pathname === '/'} />
              <div>
                <span className="text-lg font-semibold tracking-tight block leading-tight text-zinc-900 dark:text-zinc-100">
                  Momentum Capital
                </span>
                <span className="text-zinc-500 text-xs">ETF &amp; Crypto Rotation</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_PRIMARY.map(({ href, label, icon: Icon }) =>
                isActive(href, pathname) ? (
                  <span
                    key={href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800"
                  >
                    <Icon size={14} />
                    {label}
                  </span>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Icon size={14} />
                    {label}
                  </Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-2">
              {rightContent != null && (
                <div className="hidden md:flex items-center gap-3 text-xs text-zinc-500">
                  {rightContent}
                </div>
              )}

              {/* Auth controls */}
              <Show when="signed-out">
                <SignInButton mode="redirect">
                  <button type="button" className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-200 px-3 py-1.5 border border-zinc-700 rounded-lg hover:border-zinc-500">
                    Sign In
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-8 h-8',
                    }
                  }}
                />
              </Show>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-center w-9 h-9 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle theme"
              >
                <Sun size={16} className="hidden dark:block" />
                <Moon size={16} className="block dark:hidden" />
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setOpen(prev => !prev)}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                <Menu size={18} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ── Backdrop ── always mounted, fades in/out */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* ── Drawer ── always mounted, slides in from right */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <LogoMark size={18} animate={false} />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Momentum Capital</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">

          {/* Primary */}
          {NAV_PRIMARY.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive(href, pathname)
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="pt-3 mt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
            {NAV_SECONDARY.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(href, pathname)
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

        </nav>

        {/* Mobile auth */}
        <div className="px-4 pt-4 pb-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button type="button" className="w-full text-left font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400 py-2">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <div className="flex items-center gap-3 py-2">
              <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
              <span className="text-sm text-zinc-400">Account</span>
            </div>
          </Show>
        </div>

        {/* Drawer footer */}
        <div className="px-5 py-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-700 leading-relaxed">
            Not financial advice. Past performance does not guarantee future results.
          </p>
        </div>

      </div>
    </>
  )
}
