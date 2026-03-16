'use client';

import { NavBar } from '@/components/dashboard/NavBar';
import { PageHeader } from '@/components/ui/page-header';

const LAST_UPDATED = 'February 25, 2026';

const SECTIONS = [
  {
    title: '1. Not Financial Advice',
    body: `This website and dashboard ("the Service") is provided for educational and informational purposes only. Nothing contained on this Service constitutes financial advice, investment advice, trading advice, or any other type of advice. The content should not be relied upon as the basis for any investment or financial decision.

The picks, rankings, scores, and metrics displayed are outputs of a quantitative model. They do not represent personalised recommendations and do not take into account your individual financial circumstances, investment objectives, risk tolerance, tax position, or investment horizon.

You should not act or refrain from acting on the basis of any information provided through this Service without first obtaining independent financial advice from a qualified and authorised financial adviser.`,
  },
  {
    title: '2. Past Performance',
    body: `Past performance is not indicative of future results. Any historical data, backtested results, or performance metrics shown on this Service are for illustrative purposes only.

Backtested and hypothetical performance results have inherent limitations and do not reflect actual trading. They do not account for all transaction costs, taxes, slippage, market impact, or other real-world frictions that would reduce returns. Actual results achieved by following this strategy may differ materially — and negatively — from the backtested figures presented.

There is no guarantee, expressed or implied, that the strategy will achieve similar results in the future.`,
  },
  {
    title: '3. Risk of Loss',
    body: `All investing involves risk. You may lose some or all of the money you invest. The value of investments can go down as well as up, and you may not get back the amount originally invested.

Concentrated portfolios (holding 1–3 positions as this strategy typically does) carry higher volatility and single-position risk than a broadly diversified portfolio. A single adverse event in one holding can have a disproportionate impact on overall returns.

Do not invest money you cannot afford to lose. Do not invest borrowed money. Do not invest emergency funds or money you may need in the near term.`,
  },
  {
    title: '4. Do Your Own Research',
    body: `Before making any investment decision, you should conduct your own independent research and due diligence. This includes but is not limited to: reviewing the financial statements of any company you intend to invest in, understanding the regulatory environment, assessing your personal risk tolerance, and consulting a qualified financial adviser.

The information presented on this Service is not exhaustive and may not be current. Market conditions change rapidly and the data displayed may not reflect the most recent available information.`,
  },
  {
    title: '5. No Guarantees or Warranties',
    body: `The Service is provided "as is" and "as available" without warranty of any kind, express or implied. We make no warranties regarding the accuracy, completeness, timeliness, reliability, or suitability of the information provided.

We do not warrant that the Service will be uninterrupted, error-free, or free from technical issues. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.

We shall not be liable for any damages, losses, or costs (including but not limited to loss of profit, loss of data, or business interruption) arising from your use of or inability to use the Service.`,
  },
  {
    title: '6. Hypothetical and Backtested Results',
    body: `Backtested performance results displayed on this Service are hypothetical in nature. They are calculated by applying the current strategy rules retroactively to historical price data. As such, they do not represent actual investment returns.

Hypothetical results have the following limitations: they do not reflect the impact of material economic and market factors that may have affected decision-making at the time; they are generally prepared with the benefit of hindsight; they do not reflect actual transaction costs or taxes; and they cannot account for the psychological difficulty of holding a strategy through real drawdowns.

The difference between hypothetical and actual results can be significant and may be adverse to the investor.`,
  },
  {
    title: '7. User Assumes All Risk',
    body: `By using this Service, you acknowledge and agree that:

(a) You are solely responsible for all investment and financial decisions you make.

(b) You will not hold the creators, operators, or contributors to this Service liable for any investment losses or other damages resulting from your use of or reliance on this Service.

(c) You have read, understood, and agree to these Terms in their entirety.

(d) You are accessing this Service for educational and informational purposes only, and not for the purpose of obtaining investment advice.`,
  },
  {
    title: '8. Consult a Qualified Adviser',
    body: `We strongly recommend that before making any investment decision, you consult with a qualified and regulated financial adviser who is authorised to provide investment advice in your jurisdiction.

A qualified adviser can take into account your complete financial picture, personal circumstances, and goals in a way that this Service cannot. The cost of professional advice is generally modest compared to the potential cost of poorly informed investment decisions.`,
  },
  {
    title: '9. Changes to These Terms',
    body: `We reserve the right to update or modify these Terms at any time. Changes will be effective immediately upon posting to the Service. Your continued use of the Service after any changes constitutes your acceptance of the revised Terms.

We encourage you to review this page periodically for any updates. The "Last Updated" date at the top of this page indicates when the Terms were last revised.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">

      <NavBar />

      <PageHeader
        tag="— Legal"
        title="Terms & Conditions"
        sub={`Last updated: ${LAST_UPDATED}`}
      />

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">

        {/* Prominent disclaimer banner */}
        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl px-5 py-4 mb-10">
          <p className="text-amber-300 text-sm font-medium mb-1">Educational tool — not investment advice</p>
          <p className="text-amber-300/70 text-sm leading-relaxed">
            This dashboard is an analytical and educational resource only. Nothing here is a recommendation to buy, sell, or hold any financial instrument. Past performance does not guarantee future results. All investing involves risk of loss.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {SECTIONS.map(section => (
            <section key={section.title}>
              <h2 className="text-base font-light text-zinc-100 mb-3">{section.title}</h2>
              <p className="text-zinc-400 text-sm leading-7 whitespace-pre-line">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 text-xs text-zinc-600">
          Last updated: {LAST_UPDATED}
        </div>
      </main>

    </div>
  );
}
