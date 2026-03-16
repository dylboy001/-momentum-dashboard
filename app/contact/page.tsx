'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavBar } from '@/components/dashboard/NavBar';
import { PageHeader } from '@/components/ui/page-header';
import { GlassCard } from '@/components/ui/glass-card';
import { Mail, HelpCircle, Twitter, Linkedin, CheckCircle, AlertCircle } from 'lucide-react';

const SUBJECTS = [
  'General Inquiry',
  'Technical Support',
  'Billing',
  'Partnership',
];

const FAQ_LINKS = [
  { label: 'How does the strategy work?', href: '/how-it-works' },
  { label: 'What is an RS Score?', href: '/faq' },
  { label: 'How often should I rebalance?', href: '/faq' },
  { label: 'Is this financial advice?', href: '/faq' },
];

export default function ContactPage() {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus]   = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors]   = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name    = 'Name is required.';
    if (!email.trim())   e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!subject)        e.subject = 'Please select a subject.';
    if (!message.trim()) e.message = 'Message is required.';
    else if (message.trim().length < 20) e.message = 'Message must be at least 20 characters.';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch('https://formspree.io/f/xvzwkjkg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>

      <NavBar />

      <PageHeader
        tag="— Contact"
        title="Contact Us"
        sub="Have a question or feedback? Fill out the form and we'll get back to you within 24 hours."
      />

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Left: Form */}
          <div className="lg:col-span-3">
            <GlassCard>
              <div className="px-6 pt-6 pb-6">

                {status === 'success' ? (
                  <div className="flex flex-col items-center gap-4 py-10 text-center">
                    <CheckCircle size={40} className="text-emerald-400" />
                    <div>
                      <p className="text-zinc-100 font-medium text-lg mb-1">Message sent!</p>
                      <p className="text-zinc-400 text-sm">Thanks for reaching out. We&apos;ll respond within 24 hours.</p>
                    </div>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">

                    {/* Name */}
                    <div>
                      <label className="block text-sm text-zinc-300 mb-1.5" htmlFor="name">
                        Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jane Smith"
                        className={`w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-violet-500 transition ${errors.name ? 'border-red-500' : 'border-zinc-700'}`}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-zinc-300 mb-1.5" htmlFor="email">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className={`w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-violet-500 transition ${errors.email ? 'border-red-500' : 'border-zinc-700'}`}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm text-zinc-300 mb-1.5" htmlFor="subject">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="subject"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        className={`w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-violet-500 transition ${errors.subject ? 'border-red-500' : 'border-zinc-700'} ${subject ? 'text-zinc-100' : 'text-zinc-600'}`}
                      >
                        <option value="" disabled>Select a subject...</option>
                        {SUBJECTS.map(s => (
                          <option key={s} value={s} className="bg-zinc-800 text-zinc-100">{s}</option>
                        ))}
                      </select>
                      {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject}</p>}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm text-zinc-300 mb-1.5" htmlFor="message">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Tell us what's on your mind..."
                        rows={6}
                        className={`w-full bg-zinc-800 border rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:ring-1 focus:ring-violet-500 resize-none transition ${errors.message ? 'border-red-500' : 'border-zinc-700'}`}
                      />
                      <div className="flex items-start justify-between mt-1">
                        {errors.message
                          ? <p className="text-xs text-red-400">{errors.message}</p>
                          : <span />
                        }
                        <span className="text-xs text-zinc-600 ml-auto">{message.length} chars</span>
                      </div>
                    </div>

                    {/* Error banner */}
                    {status === 'error' && (
                      <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/60 rounded-lg px-4 py-3 text-red-300 text-sm">
                        <AlertCircle size={14} className="shrink-0" />
                        Something went wrong. Please try again or email us directly.
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending...
                        </>
                      ) : 'Send Message'}
                    </button>

                  </form>
                )}

              </div>
            </GlassCard>
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact info */}
            <GlassCard>
              <div className="px-6 pt-6 pb-6 space-y-4">
                <p className="text-sm font-medium text-zinc-200">Get in touch</p>
                <a
                  href="mailto:contact@momentumcap.io"
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-violet-950 transition-colors">
                    <Mail size={14} className="text-violet-400" />
                  </div>
                  contact@momentumcap.io
                </a>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  We typically respond within one business day. For urgent issues, mention &quot;URGENT&quot; in your subject line.
                </p>
              </div>
            </GlassCard>

            {/* FAQ quick links */}
            <GlassCard>
              <div className="px-6 pt-6 pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle size={14} className="text-violet-400" />
                  <p className="text-sm font-medium text-zinc-200">Common questions</p>
                </div>
                <div className="space-y-1">
                  {FAQ_LINKS.map(link => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-zinc-400 hover:text-violet-300 transition-colors py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Social links */}
            <GlassCard>
              <div className="px-6 pt-6 pb-6">
                <p className="text-sm font-medium text-zinc-200 mb-3">Follow us</p>
                <div className="space-y-2">
                  <a
                    href="https://x.com/MomentumCap_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                      <Twitter size={14} />
                    </div>
                    @MomentumCap_
                  </a>
                  <a
                    href="https://linkedin.com/company/momentumcapital"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-zinc-400 hover:text-zinc-100 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                      <Linkedin size={14} />
                    </div>
                    Momentum Capital
                  </a>
                </div>
              </div>
            </GlassCard>

          </div>
        </div>

      </main>

    </div>
  );
}
