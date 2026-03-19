import Link from 'next/link';
import { TrendingUp, Twitter, Mail } from 'lucide-react';

const PRODUCT_LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'Dashboard',   href: '/dashboard' },
  { label: 'Rankings',    href: '/rankings' },
  { label: 'Performance', href: '/performance' },
  { label: 'Pricing',     href: '/pricing' },
];

const LEARN_LINKS = [
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'FAQ',          href: '/faq' },
  { label: 'Resources',    href: '/resources' },
  { label: 'Contact',      href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Privacy Policy',     href: '/privacy' },
];

const SOCIALS = [
  { label: 'X / Twitter', href: 'https://x.com/MomentumCap_',   icon: Twitter },
  { label: 'Email',       href: 'mailto:contact@momentumcap.io', icon: Mail },
];

function ColHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
      {children}
    </p>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith('http') || href.startsWith('mailto');
  const cls = 'block text-sm text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors py-0.5';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return <Link href={href} className={cls}>{children}</Link>;
}

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-[#080808] border-t border-zinc-200 dark:border-zinc-800/60">

      {/* Main columns */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Col 1 — Product */}
          <div>
            <ColHeading>Product</ColHeading>
            <nav className="space-y-0.5">
              {PRODUCT_LINKS.map(l => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
            </nav>
          </div>

          {/* Col 2 — Learn */}
          <div>
            <ColHeading>Learn</ColHeading>
            <nav className="space-y-0.5">
              {LEARN_LINKS.map(l => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
            </nav>
          </div>

          {/* Col 3 — Legal */}
          <div>
            <ColHeading>Legal</ColHeading>
            <nav className="space-y-0.5">
              {LEGAL_LINKS.map(l => <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>)}
            </nav>
          </div>

          {/* Col 4 — Connect */}
          <div>
            <ColHeading>Connect</ColHeading>
            <div className="space-y-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors py-0.5"
                >
                  <Icon size={13} className="shrink-0" />
                  {label}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-zinc-200 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">

          <div className="flex items-center gap-2">
            <TrendingUp size={13} className="text-violet-500" />
            <span className="text-xs text-zinc-500 dark:text-zinc-600">© 2026 Momentum Capital</span>
          </div>

          <p className="text-xs text-zinc-400 dark:text-zinc-700 text-center sm:text-right max-w-md">
            Not financial advice. Past performance does not guarantee future results. All investing involves risk of loss.
          </p>

        </div>
      </div>

    </footer>
  );
}
