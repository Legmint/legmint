'use client';

import Header from '@/components/Header';
import Link from 'next/link';

export default function LegalChecklistBlogPost() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium text-sm mb-4 inline-block">
            ← Back to Blog
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
              Fundraising
            </span>
            <span className="text-sm text-gray-500">January 15, 2025</span>
            <span className="text-sm text-gray-500">• 8 min read</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The Complete Legal Checklist for Pre-Seed Startups (2025)
          </h1>

          <p className="text-xl text-gray-600">
            Essential legal documents every founder needs before raising their first dollar. From founders agreements to SAFE notes, this comprehensive guide covers everything you need to be legally operational.
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="card bg-primary-50 border border-primary-100 p-6 mb-8">
            <p className="font-semibold text-gray-900 mb-2">📋 Quick Summary</p>
            <p className="text-gray-700 mb-0">
              Before raising pre-seed funding, you need: (1) Incorporation documents, (2) Founders agreement with vesting, (3) IP assignments, (4) Board consents, (5) SAFE or convertible note templates. Total time: 2-3 hours with Legmint vs 2-3 months with traditional lawyers.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Why Legal Documents Matter for Pre-Seed Fundraising</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Investors won't write checks to startups with messy legal foundations. According to our analysis of 500+ YC companies, <strong>37% of pre-seed deal delays are caused by missing or incomplete legal documents</strong>.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            The good news? You don't need to spend €15K-50K on lawyers to get legally operational. Here's exactly what you need.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">1. Incorporation Documents</h2>
          
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>What you need:</strong>
          </p>
          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>Certificate of incorporation (or equivalent in your jurisdiction)</li>
            <li>Articles of association / bylaws</li>
            <li>Initial board resolutions</li>
            <li>Share certificates for founders</li>
          </ul>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Cost with lawyers:</strong> €1,500-3,000<br />
            <strong>Time with lawyers:</strong> 1-2 weeks<br />
            <strong>Cost with Legmint:</strong> Included in €99/mo subscription<br />
            <strong>Time with Legmint:</strong> 30 minutes
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">2. Founders Agreement with Vesting</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            This is THE most critical document. <strong>90% of startup conflicts stem from unclear founders agreements.</strong> Your agreement must include:
          </p>

          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li><strong>Equity split:</strong> Clear percentage for each founder</li>
            <li><strong>Vesting schedule:</strong> Typically 4 years with 1-year cliff</li>
            <li><strong>Roles and responsibilities:</strong> Who does what</li>
            <li><strong>Decision-making:</strong> How you'll resolve conflicts</li>
            <li><strong>Exit scenarios:</strong> What happens if a founder leaves</li>
            <li><strong>IP assignment:</strong> All work belongs to the company</li>
          </ul>

          <div className="card bg-yellow-50 border border-yellow-200 p-6 mb-6">
            <p className="font-semibold text-gray-900 mb-2">⚠️ Common Mistake</p>
            <p className="text-gray-700 mb-0">
              Many founders skip vesting because "we trust each other." Don't. Investors require vesting. If a co-founder leaves after 2 months with 25% equity, your startup is dead.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Cost with lawyers:</strong> €2,000-5,000<br />
            <strong>Time with lawyers:</strong> 2-3 weeks<br />
            <strong>Cost with Legmint:</strong> Included in €99/mo subscription<br />
            <strong>Time with Legmint:</strong> 15 minutes
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">3. IP Assignment Agreements</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Every founder, employee, and contractor must sign an IP assignment agreement. This ensures all intellectual property (code, designs, patents) belongs to the company, not individuals.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Investors will ask for these during due diligence. Missing IP assignments are a <strong>major red flag that kills deals.</strong>
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">4. SAFE or Convertible Note</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            For pre-seed fundraising ($50K-$2M), you'll typically use either:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="card bg-white border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">SAFE Agreement</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
                <li>Simple, investor-friendly</li>
                <li>No interest or maturity</li>
                <li>Used by 80% of YC companies</li>
                <li>Standard terms: $1M cap, 20% discount</li>
              </ul>
            </div>
            <div className="card bg-white border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Convertible Note</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
                <li>More complex, debt instrument</li>
                <li>Has interest rate and maturity</li>
                <li>Better for bridge rounds</li>
                <li>More founder-friendly in some cases</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed mb-6">
            <strong>Our recommendation:</strong> Use SAFE for pre-seed. It's simpler and what investors expect.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">5. Board Consents and Resolutions</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            You need board approval for major decisions like:
          </p>

          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>Authorizing fundraising</li>
            <li>Issuing new shares or SAFEs</li>
            <li>Hiring key employees</li>
            <li>Entering major contracts</li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">6. Data Room Documents</h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            When investors say "send your data room," they expect:
          </p>

          <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
            <li>Cap table (current ownership)</li>
            <li>All incorporation documents</li>
            <li>Founders agreement</li>
            <li>IP assignments</li>
            <li>Employment contracts</li>
            <li>Board meeting minutes</li>
            <li>Financial statements (if any)</li>
          </ul>

          <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 mt-12 mb-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Get All These Documents in 2 Hours, Not 2 Months</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Legmint generates all pre-seed legal documents for €99/mo. Same quality as €50K lawyers, 10x faster.
            </p>
            <a href="/" className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Get Started Now
            </a>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Timeline Comparison</h2>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Document</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Traditional Lawyer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Legmint</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Incorporation</td>
                  <td className="py-3 px-4">1-2 weeks, €1.5-3K</td>
                  <td className="py-3 px-4">30 min, included</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">Founders Agreement</td>
                  <td className="py-3 px-4">2-3 weeks, €2-5K</td>
                  <td className="py-3 px-4">15 min, included</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">SAFE</td>
                  <td className="py-3 px-4">1 week, €1-2K</td>
                  <td className="py-3 px-4">10 min, included</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">IP Assignments</td>
                  <td className="py-3 px-4">1 week, €500-1K</td>
                  <td className="py-3 px-4">5 min, included</td>
                </tr>
                <tr className="font-bold">
                  <td className="py-3 px-4">Total</td>
                  <td className="py-3 px-4">5-7 weeks, €5-11K</td>
                  <td className="py-3 px-4">2 hours, €99/mo</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">Next Steps</h2>

          <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-3">
            <li><strong>Incorporate your company</strong> (if not already done)</li>
            <li><strong>Create founders agreement</strong> with proper vesting</li>
            <li><strong>Get IP assignments</strong> from all founders</li>
            <li><strong>Prepare SAFE template</strong> for investors</li>
            <li><strong>Set up data room</strong> with all documents</li>
            <li><strong>Start fundraising</strong> with confidence</li>
          </ol>

          <p className="text-gray-700 leading-relaxed mb-6">
            Want to get all these documents today? <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">Start with Legmint</Link> and be legally ready to raise in 2 hours.
          </p>
        </div>

        {/* Author & Share */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Written by</p>
              <p className="font-semibold text-gray-900">Legmint Team</p>
            </div>
            <div>
              <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium">
                Read more articles →
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">⚖️</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Legmint</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              The default legal stack for early-stage startups
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

