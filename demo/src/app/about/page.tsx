'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function AboutPage() {
  const features = [
    {
      title: 'Document generator',
      description: 'Founders\' agreements, employment contracts, SAFEs, NDAs, SaaS agreements—all the legal docs you actually need'
    },
    {
      title: 'Lawyer marketplace',
      description: '100+ verified startup lawyers for reviews, fundraising, and complex deals (pay 15-25% less than traditional firms)'
    },
    {
      title: 'Multi-jurisdiction coverage',
      description: 'UK, US, Germany, France, Spain, and 15+ more—localized and compliant from day one'
    },
    {
      title: 'Transparent pricing',
      description: '€19-99/mo subscription, no hidden fees, no €15K retainers'
    }
  ];

  const stats = [
    { value: '15 min', label: 'Average document time' },
    { value: '€99/mo', label: 'vs €50K/year with firms' },
    { value: '20+', label: 'Jurisdictions supported' },
    { value: '50+', label: 'Startup-specific templates' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-navy-500 to-navy-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">
            About Legmint
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Legal docs, minted for startups. Automating the legals that usually slow founders down.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Statement */}
        <section className="mb-16">
          <div className="card p-8 bg-white">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Move fast with confidence
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                <strong>Legmint helps founders move fast with confidence — automating the legals that usually slow startups down, from incorporation to funding and beyond.</strong>
              </p>
              <p>
                We've turned complex legal work into interactive templates. Fill out smart forms, answer relevant questions, and generate lawyer-reviewed documents in minutes. No jargon, no bottlenecks, no surprise bills.
              </p>
              <p>
                Built by founders who've been there, reviewed by legal experts who know startup law inside out.
              </p>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What you get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 bg-white">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-mint-400 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="card p-8 bg-gradient-to-r from-mint-400 to-mint-500 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-white/90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="mb-16">
          <div className="card p-8 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Simple, transparent, founder-friendly
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                <strong>Speed.</strong> Interactive templates generate docs instantly — no waiting weeks for lawyer drafts.
              </p>
              <p>
                <strong>Clarity.</strong> Plain language, guided questions, no legal jargon to decode.
              </p>
              <p>
                <strong>Affordability.</strong> Simple subscription model. No retainers, no surprise invoices.
              </p>
            </div>
          </div>
        </section>

        {/* Positioning */}
        <section>
          <div className="card p-8 bg-navy-500 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to mint your first legal doc?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join founders building on a solid legal foundation — from incorporation to funding and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="btn-primary bg-mint-400 text-navy-500 hover:bg-mint-300">
                Start Minting
              </a>
              <a href="/lawyers" className="btn-secondary border-2 border-white text-white hover:bg-navy-600">
                Find a Lawyer
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-mint-400 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">🪙</span>
              </div>
              <span className="text-xl font-bold text-navy-500">Legmint</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Legal docs, minted for startups · Backed by legal experts
            </p>
            <div className="text-xs text-gray-500">
              <p className="mb-2">
                <strong>Important:</strong> This is NOT legal advice. All generated documents should be reviewed by qualified legal counsel before use.
              </p>
              <p>
                © 2025 Global Legal Consulting Ltd. All rights reserved. |
                <Link href="/privacy" className="text-mint-400 hover:text-mint-500 ml-1">Privacy Policy</Link> |
                <Link href="/terms" className="text-mint-400 hover:text-mint-500 ml-1">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

