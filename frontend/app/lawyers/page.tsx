import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Join the Legmint Lawyer Network | Partner with Legmint',
  description: 'Receive qualified startup legal clients through Legmint. Transparent fee structure, instant payments via Stripe Connect, and verified pre-screened clients.',
  alternates: {
    canonical: '/lawyers',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LawyersLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Grow Your Startup Law Practice
            </h1>
            <p className="text-xl sm:text-2xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Receive qualified client referrals from founders who need expert legal help.
              We handle discovery, you provide expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/lawyers/apply"
                className="inline-flex items-center bg-white text-emerald-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
              >
                Apply as Partner Lawyer →
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-emerald-50 border-y border-emerald-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">€30 + 15%</div>
              <div className="text-gray-700">Transparent Fee Structure</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">2-7 Days</div>
              <div className="text-gray-700">Payment via Stripe Connect</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">100%</div>
              <div className="text-gray-700">Pre-Screened Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Join the Legmint Network?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Focus on what you do best—providing expert legal advice—while we handle client acquisition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Qualified Client Referrals
              </h3>
              <p className="text-gray-600">
                Receive pre-screened clients who have already generated legal documents and need expert review. No cold leads.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Transparent Compensation
              </h3>
              <p className="text-gray-600">
                €30 fixed fee per initial review, 15% on additional work. No hidden charges. You set your own rates.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Payments
              </h3>
              <p className="text-gray-600">
                Get paid automatically via Stripe Connect. Funds transferred to your account within 2-7 business days.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Flexible Remote Work
              </h3>
              <p className="text-gray-600">
                Work from anywhere. Review documents on your schedule. Accept or decline referrals based on your availability.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Verified Credentials
              </h3>
              <p className="text-gray-600">
                Join a network of verified startup lawyers. We handle credential verification and maintain quality standards.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multi-Jurisdiction Support
              </h3>
              <p className="text-gray-600">
                Practice in UK, Germany, Czech Republic, Delaware, California, or other supported jurisdictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent process from application to getting paid
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apply Online
              </h3>
              <p className="text-gray-600 text-sm">
                Submit your application with credentials, bar license, and professional liability insurance.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Verified
              </h3>
              <p className="text-gray-600 text-sm">
                We verify your bar admission, insurance, and credentials (typically 2-3 business days).
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Receive Referrals
              </h3>
              <p className="text-gray-600 text-sm">
                Get notified of client matches. Review details and accept or decline within 2 working days.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Paid
              </h3>
              <p className="text-gray-600 text-sm">
                Deliver your legal work. Client pays through platform. You receive payment via Stripe Connect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transparent Fee Structure
            </h2>
            <p className="text-xl text-gray-600">
              No hidden charges. You set your rates.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-200 rounded-2xl p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-emerald-600 font-semibold mb-2">Initial Document Review</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">€30 Fixed Fee</div>
                <p className="text-gray-600 text-sm">
                  Per referral for initial document review. Simple and predictable.
                </p>
                <div className="mt-6 bg-white rounded-lg p-4 border border-emerald-100">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Example:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client pays:</span>
                      <span className="font-semibold">€250</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Platform fee:</span>
                      <span className="font-semibold">-€30</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
                      <span>You receive:</span>
                      <span>€220</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-emerald-600 font-semibold mb-2">Additional Legal Work</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">15% Platform Fee</div>
                <p className="text-gray-600 text-sm">
                  On any follow-on services billed through the platform after the initial review.
                </p>
                <div className="mt-6 bg-white rounded-lg p-4 border border-emerald-100">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Example:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client pays:</span>
                      <span className="font-semibold">€1,000</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Platform fee (15%):</span>
                      <span className="font-semibold">-€150</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900">
                      <span>You receive:</span>
                      <span>€850</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-semibold text-blue-900 mb-1">What the platform fee covers:</div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Client acquisition and marketing</li>
                    <li>• Payment processing and infrastructure</li>
                    <li>• Credential verification and compliance</li>
                    <li>• Technology platform and support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-emerald-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Requirements
            </h2>
            <p className="text-xl text-gray-600">
              We partner with qualified, experienced lawyers
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Active Bar License</div>
                  <div className="text-sm text-gray-600">Licensed to practice in at least one supported jurisdiction</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Good Standing</div>
                  <div className="text-sm text-gray-600">No disciplinary actions or ethical complaints</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Professional Liability Insurance</div>
                  <div className="text-sm text-gray-600">Current malpractice coverage required</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Startup Law Experience</div>
                  <div className="text-sm text-gray-600">Experience with corporate, contract, or startup matters</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Responsive Communication</div>
                  <div className="text-sm text-gray-600">Timely responses to client inquiries and referrals</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Compliance Knowledge</div>
                  <div className="text-sm text-gray-600">Understanding of referral fee rules in your jurisdiction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <details className="bg-white border border-gray-200 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                How long does the application process take?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                Typically 2-3 business days. We verify your bar license, professional liability insurance, and credentials.
                You'll receive an email once your application is approved.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Are referral fees legal in my jurisdiction?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                Referral fee rules vary by jurisdiction. You are responsible for ensuring compliance with your bar
                association's rules. Our fee structure is designed for permissible jurisdictions, and we provide
                disclosure mechanisms to support compliance. We recommend consulting your bar's ethics guidelines.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                How do I get paid?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                All payments are processed via Stripe Connect. After client payment, the platform fee is automatically
                deducted and the remaining amount is transferred to your Stripe account within 2-7 business days.
                You'll need to complete Stripe onboarding after approval.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Can I set my own rates?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                Yes! You set your own hourly rates and engagement terms (subject to platform minimum/maximum guidelines
                to ensure quality). The platform fee is calculated on the total amount the client pays.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                What if I need to decline a referral?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                You have full discretion to accept or decline any referral based on conflicts, availability, or other
                professional considerations. You have 2 working days to respond to referral notifications.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Do I become an employee of Legmint?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                No. You remain an independent legal professional. Legmint is a referral platform, not a law firm.
                You maintain complete control over your legal work, client relationships, and professional conduct.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-lg p-6 group">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                What jurisdictions do you support?
                <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-gray-600">
                Currently: United Kingdom, Germany, Czech Republic, Delaware (US), and California (US). We're expanding
                to additional jurisdictions. You can practice in any jurisdiction where you hold an active license and
                referral fees are permissible.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Grow Your Practice?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join the Legmint lawyer network and start receiving qualified startup legal clients today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/lawyers/apply"
              className="inline-flex items-center bg-white text-emerald-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
            >
              Apply Now →
            </Link>
            <Link
              href="/legal/terms-lawyers"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Read Full Terms
            </Link>
          </div>
          <p className="text-sm text-emerald-100 mt-6">
            Questions? Email us at{' '}
            <a href="mailto:welcome@legmint.com" className="underline hover:text-white">
              welcome@legmint.com
            </a>{' '}
            or call{' '}
            <a href="tel:+420732913027" className="underline hover:text-white">
              +420 732 913 027
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
