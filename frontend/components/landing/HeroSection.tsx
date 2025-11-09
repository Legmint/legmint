'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-32 sm:pb-32">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Startup legal docs.
            <br />
            <span className="text-emerald-600">Ready in minutes.</span>
            <br />
            <span className="text-gray-700">Valid in your jurisdiction.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Generate lawyer-grade contracts, terms, and agreements for UK, Germany, Czech Republic, Delaware, and California — no legal degree required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Generate your first document free →
                </Link>
                <Link
                  href="/lawyers/apply"
                  className="w-full sm:w-auto bg-white text-emerald-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-emerald-600 hover:bg-emerald-50 transition-all"
                >
                  Join as a Lawyer
                </Link>
              </>
            )}
          </div>

          <p className="text-sm text-gray-500">
            Built for founders in London, Berlin, and beyond.
          </p>
        </div>
      </div>
    </div>
  );
}
