import { NavBar } from '@/components/dashboard/NavBar'
import { PageHeader } from '@/components/ui/page-header'

const LAST_UPDATED = 'February 26, 2026'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      <NavBar />

      <PageHeader
        tag="— Legal"
        title="Privacy Policy"
        sub={`Last updated: ${LAST_UPDATED}`}
      />

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-14 space-y-12">

        {/* 1. Introduction */}
        <Section title="1. Introduction">
          <p>
            Momentum Capital (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your privacy.
            This policy explains what data we collect when you use our platform, how we use it,
            and the rights you have over it.
          </p>
          <p>
            By using Momentum Capital you agree to the collection and use of information described here.
            If you do not agree, please discontinue use of the service.
          </p>
        </Section>

        {/* 2. Information We Collect */}
        <Section title="2. Information We Collect">
          <p className="text-zinc-400 text-sm">We collect the following categories of data:</p>
          <ul className="space-y-3 mt-4">
            <BulletItem label="Email address">
              Required for account creation and to send rebalance alerts.
            </BulletItem>
            <BulletItem label="Payment information">
              Billing details are entered directly into Stripe&rsquo;s secure checkout.
              We never see or store your full card number.
            </BulletItem>
            <BulletItem label="Usage data">
              Pages visited, features used, and time spent on the platform —
              collected to understand how the product is being used.
            </BulletItem>
            <BulletItem label="Device &amp; browser information">
              Browser type, operating system, screen resolution, and language
              settings, collected automatically on each visit.
            </BulletItem>
            <BulletItem label="IP address">
              Logged automatically by our hosting provider for security monitoring
              and abuse prevention.
            </BulletItem>
          </ul>
        </Section>

        {/* 3. How We Use Your Information */}
        <Section title="3. How We Use Your Information">
          <ul className="space-y-3">
            <BulletItem label="Service delivery">
              Generate stock picks, calculate position sizing, and display your personalised dashboard.
            </BulletItem>
            <BulletItem label="Payment processing">
              Initiate and confirm subscription charges via Stripe.
            </BulletItem>
            <BulletItem label="Rebalance notifications">
              Send email alerts on or near your scheduled rebalance date (Pro and Premium plans only).
            </BulletItem>
            <BulletItem label="Platform improvement">
              Identify bugs, measure feature adoption, and prioritise development work.
            </BulletItem>
            <BulletItem label="Analytics">
              Aggregate, anonymised reporting on usage patterns. No individual user data
              is shared with third parties for marketing purposes.
            </BulletItem>
          </ul>
        </Section>

        {/* 4. Third-Party Services */}
        <Section title="4. Third-Party Services">
          <p>
            We use a small number of trusted third-party services to operate the platform.
            Each provider processes data under their own privacy policies:
          </p>
          <ul className="space-y-3 mt-4">
            <BulletItem label="EODHD">
              Provides stock price and fundamental data. Ticker symbols are
              sent to their API; no personal data is shared.
            </BulletItem>
            <BulletItem label="Stripe">
              Handles all payment processing. Your billing data is governed by the{' '}
              <ExternalLink href="https://stripe.com/privacy">Stripe Privacy Policy</ExternalLink>.
            </BulletItem>
            <BulletItem label="Vercel">
              Hosts the platform and processes request logs. Governed by the{' '}
              <ExternalLink href="https://vercel.com/legal/privacy-policy">Vercel Privacy Policy</ExternalLink>.
            </BulletItem>
            <BulletItem label="Google Analytics (optional)">
              If enabled, anonymised usage data is shared with Google. You can
              disable this via your browser&rsquo;s privacy settings or a tracker blocker.
            </BulletItem>
          </ul>
          <Callout>
            We do not sell, rent, or trade your personal data to any third party.
          </Callout>
        </Section>

        {/* 5. Data Storage & Security */}
        <Section title="5. Data Storage &amp; Security">
          <p>We take reasonable steps to protect your data:</p>
          <ul className="space-y-3 mt-4">
            <BulletItem label="Encryption in transit">
              All data is transmitted over HTTPS/TLS. Plain-text HTTP is not supported.
            </BulletItem>
            <BulletItem label="Secure storage">
              User account data is stored in an encrypted database with access
              restricted to authorised systems.
            </BulletItem>
            <BulletItem label="Regular backups">
              Automated daily backups are retained for 30 days to ensure recoverability.
            </BulletItem>
            <BulletItem label="Limited access">
              Only essential personnel can access user data, and only when required
              to operate or support the service.
            </BulletItem>
          </ul>
          <p>
            No method of transmission or storage is 100% secure. In the event of a data
            breach affecting your personal information, we will notify you as required by
            applicable law.
          </p>
        </Section>

        {/* 6. Your Rights (GDPR) */}
        <Section title="6. Your Rights (GDPR)">
          <p>
            If you are located in the European Economic Area (EEA) or United Kingdom,
            you have the following rights under GDPR:
          </p>
          <ul className="space-y-3 mt-4">
            <BulletItem label="Right of access">
              Request a copy of the personal data we hold about you.
            </BulletItem>
            <BulletItem label="Right to erasure">
              Request deletion of your account and all associated personal data
              (&ldquo;right to be forgotten&rdquo;).
            </BulletItem>
            <BulletItem label="Right to opt out of emails">
              Unsubscribe from rebalance alerts and other communications at any
              time via the unsubscribe link in any email, or by contacting us directly.
            </BulletItem>
            <BulletItem label="Right to data portability">
              Request an export of your data in a machine-readable format (CSV or JSON).
            </BulletItem>
            <BulletItem label="Right to rectification">
              Request correction of any inaccurate personal data we hold.
            </BulletItem>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a
              href="mailto:privacy@momentumcap.io"
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              privacy@momentumcap.io
            </a>
            . We will respond within 30 days.
          </p>
        </Section>

        {/* 7. Cookies */}
        <Section title="7. Cookies">
          <p>We use a minimal set of cookies:</p>
          <ul className="space-y-3 mt-4">
            <BulletItem label="Essential cookies">
              Required for authentication and to keep you logged in across sessions.
              These cannot be disabled without breaking core functionality.
            </BulletItem>
            <BulletItem label="Analytics cookies (optional)">
              Used to measure aggregate usage patterns via Google Analytics.
              You can disable these in your browser settings or with a privacy
              extension (e.g. uBlock Origin, Privacy Badger).
            </BulletItem>
          </ul>
          <p>
            We do not use advertising or cross-site tracking cookies.
          </p>
        </Section>

        {/* 8. Changes */}
        <Section title="8. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the
            &ldquo;Last updated&rdquo; date at the top of this page. For material changes, we will
            send a notification to your registered email address.
          </p>
          <p>
            Continued use of the platform after changes are posted constitutes acceptance
            of the updated policy.
          </p>
        </Section>

        {/* Contact */}
        <Section title="9. Contact">
          <p>
            If you have questions about this Privacy Policy or how your data is handled,
            please contact us:
          </p>
          <div className="mt-4 rounded-lg bg-zinc-900/50 border border-zinc-800 px-5 py-4 text-sm space-y-1">
            <p className="text-zinc-100 font-medium">Momentum Capital</p>
            <p className="text-zinc-400">
              Email:{' '}
              <a
                href="mailto:privacy@momentumcap.io"
                className="text-violet-400 hover:text-violet-300 transition-colors"
              >
                privacy@momentumcap.io
              </a>
            </p>
          </div>
        </Section>

      </main>

    </div>
  )
}

// ─── Small layout helpers ─────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-light text-zinc-100 border-b border-zinc-800 pb-2">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
        {children}
      </div>
    </section>
  )
}

function BulletItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0 mt-[6px]" />
      <span>
        <span className="text-zinc-200 font-medium">{label}</span>
        {' — '}
        {children}
      </span>
    </li>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-lg border border-violet-300 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-950/30 px-4 py-3 text-sm text-violet-800 dark:text-violet-200">
      {children}
    </div>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-violet-400 hover:text-violet-300 transition-colors"
    >
      {children}
    </a>
  )
}
