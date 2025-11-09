'use client';

import Link from 'next/link';

export default function LawyerSection() {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Built for Founders, Trusted by Lawyers
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            We partner with experienced startup lawyers who understand founders&apos; needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* For Founders */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">For Founders</h3>
            <p className="text-emerald-100 mb-6 leading-relaxed">
              Get affordable expert help when you need it. Every lawyer in our network is verified and startup-focused.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Verified startup lawyers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Jurisdiction-specific expertise</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Transparent, founder-friendly rates</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Fast turnaround times</span>
              </li>
            </ul>
          </div>

          {/* For Lawyers */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-4">For Lawyers</h3>
            <p className="text-emerald-100 mb-6 leading-relaxed">
              Receive qualified client referrals. We handle discovery, you provide expertise.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Competitive referral compensation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Qualified, pre-screened clients</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Flexible remote work</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                <span>Instant Stripe Connect payouts</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/lawyers/apply"
            className="inline-flex items-center bg-white text-emerald-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl"
          >
            Apply as a Partner Lawyer →
          </Link>
        </div>
      </div>
    </div>
  );
}
