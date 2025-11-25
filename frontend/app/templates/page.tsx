/**
 * Templates Index Page
 *
 * Browse all available legal document templates
 */

'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

// Template catalog - in real app, fetch from API
const TEMPLATE_CATALOG = [
  {
    code: 'incorporation-delaware',
    name: 'Delaware C-Corp Incorporation',
    description: 'Complete incorporation package for Delaware C-Corporations',
    category: 'Formation',
    difficulty: 'Beginner',
    estimatedTime: '15 minutes',
    jurisdiction: 'US-DE',
    popular: true,
  },
  {
    code: 'nda-mutual',
    name: 'Mutual Non-Disclosure Agreement',
    description: 'Two-way NDA for sharing confidential information',
    category: 'Contracts',
    difficulty: 'Beginner',
    estimatedTime: '10 minutes',
    jurisdiction: 'Multi',
    popular: true,
  },
  {
    code: 'employment-contract-uk',
    name: 'UK Employment Contract',
    description: 'Standard employment agreement compliant with UK law',
    category: 'Employment',
    difficulty: 'Intermediate',
    estimatedTime: '20 minutes',
    jurisdiction: 'UK',
    popular: false,
  },
  {
    code: 'safe-agreement',
    name: 'SAFE Agreement',
    description: 'Simple Agreement for Future Equity for startup fundraising',
    category: 'Funding',
    difficulty: 'Intermediate',
    estimatedTime: '15 minutes',
    jurisdiction: 'US',
    popular: true,
  },
  {
    code: 'gdpr-dpa',
    name: 'GDPR Data Processing Agreement',
    description: 'EU-compliant DPA for processor relationships',
    category: 'Data Protection',
    difficulty: 'Advanced',
    estimatedTime: '25 minutes',
    jurisdiction: 'EU',
    popular: false,
  },
  {
    code: 'saas-terms',
    name: 'SaaS Terms of Service',
    description: 'Terms of service for SaaS platforms',
    category: 'Legal',
    difficulty: 'Intermediate',
    estimatedTime: '20 minutes',
    jurisdiction: 'Multi',
    popular: true,
  },
];

const CATEGORIES = ['All', 'Formation', 'Contracts', 'Employment', 'Funding', 'Data Protection', 'Legal'];
const JURISDICTIONS = ['All', 'US', 'UK', 'EU', 'Multi'];

export default function TemplatesPage() {
  const { isSignedIn } = useUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Legal Document Templates</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Professional legal templates for startups and businesses. Generate customized documents in minutes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters - Simplified for now */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <div>
            <span className="text-sm font-medium text-gray-700 mr-3">Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`mr-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  cat === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Popular Templates Badge */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Templates</h2>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TEMPLATE_CATALOG.filter((t) => t.popular).map((template) => (
            <Link
              key={template.code}
              href={`/templates/${template.code}`}
              className="bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                        {template.category}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {template.jurisdiction}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition">
                      {template.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{template.difficulty}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-sm font-semibold text-indigo-600">Pro Plan Required</span>
                  </div>
                  <span className="text-indigo-600 font-semibold text-sm group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Templates Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Templates</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_CATALOG.map((template) => (
            <Link
              key={template.code}
              href={`/templates/${template.code}`}
              className="bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                        {template.category}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {template.jurisdiction}
                      </span>
                      {template.popular && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition">
                      {template.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{template.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>{template.difficulty}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-sm font-semibold text-indigo-600">Pro Plan Required</span>
                  </div>
                  <span className="text-indigo-600 font-semibold text-sm group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-indigo-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Unlimited Access?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Subscribe to Pro for €99/month and generate all templates unlimited times with full customization.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
