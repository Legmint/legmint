/**
 * Template Detail Page with Stripe Checkout
 *
 * Shows how one-time template purchase appears
 * Example: /templates/incorporation-delaware
 */

'use client';

import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

// Mock template data - in real app, fetch from API
const TEMPLATES: Record<string, any> = {
  'incorporation-delaware': {
    name: 'Delaware C-Corp Incorporation',
    description: 'Complete incorporation package for Delaware C-Corporations',
    category: 'Formation',
    difficulty: 'Beginner',
    estimatedTime: '15 minutes',
    features: [
      'Certificate of Incorporation',
      'Bylaws template',
      'Initial board resolutions',
      'Stock issuance documents',
      'Jurisdiction-specific compliance checklist',
    ],
  },
  'nda-mutual': {
    name: 'Mutual Non-Disclosure Agreement',
    description: 'Two-way NDA for sharing confidential information',
    category: 'Contracts',
    difficulty: 'Beginner',
    estimatedTime: '10 minutes',
    features: [
      'Mutual confidentiality obligations',
      'Customizable term length',
      'Standard exclusions',
      'Return/destruction provisions',
      'Governing law selection',
    ],
  },
};

export default function TemplateDetailPage() {
  const params = useParams();
  const { isSignedIn } = useUser();

  const templateCode = params?.code as string;
  const template = TEMPLATES[templateCode] || TEMPLATES['incorporation-delaware'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/templates" className="text-indigo-200 hover:text-white mb-4 inline-block">
            ← Back to Templates
          </Link>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-500 px-3 py-1 rounded-full text-sm font-medium">
                  {template.category}
                </span>
                <span className="bg-indigo-500 px-3 py-1 rounded-full text-sm font-medium">
                  {template.difficulty}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{template.name}</h1>
              <p className="text-xl text-indigo-100 mb-6">
                {template.description}
              </p>
              <div className="flex items-center gap-6 text-indigo-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{template.estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF & DOCX</span>
                </div>
              </div>
            </div>

            {/* Subscription Required Card */}
            <div className="bg-white text-gray-900 p-8 rounded-xl shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-3xl font-extrabold mb-2 text-indigo-600">
                  Pro Subscription Required
                </div>
                <p className="text-gray-600">Subscribe to generate this template</p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-extrabold text-indigo-600 mb-1">€99</div>
                  <div className="text-gray-600">per month</div>
                </div>
                <ul className="space-y-2 text-sm text-indigo-900">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited template generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All jurisdictions (UK, DE, CZ, US)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>PDF & DOCX downloads</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lawyer referral integration</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/pricing"
                className="block w-full bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition text-center mb-4"
              >
                Subscribe to Pro - €99/month
              </Link>

              {!isSignedIn && (
                <p className="text-xs text-gray-500 text-center">
                  Need an account?{' '}
                  <Link href="/sign-up" className="text-indigo-600 hover:underline font-medium">
                    Sign up free
                  </Link>
                </p>
              )}

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-6">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure checkout
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 1.315 0 2.088.583 2.213 1.443h1.838c-.143-1.637-1.315-2.926-3.194-3.271V1.5h-2.4v2.092C8.945 3.836 7.5 5.11 7.5 6.866c0 2.052 1.732 3.012 4.456 3.911 2.497.826 3.044 1.594 3.044 2.566 0 .735-.512 1.657-2.4 1.657-1.696 0-2.571-.754-2.784-1.8H7.963c.226 2.106 1.946 3.22 4.337 3.517V19.5h2.4v-2.713c2.084-.327 3.5-1.657 3.5-3.477 0-2.542-2.128-3.434-4.224-4.14z" />
                  </svg>
                  Powered by Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold mb-8">What you'll get</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {template.features.map((feature: string, idx: number) => (
            <div key={idx} className="flex items-start bg-gray-50 p-6 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Click "Buy Now"</h3>
              <p className="text-gray-600 text-sm">
                Secure checkout via Stripe in seconds
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Answer Questions</h3>
              <p className="text-gray-600 text-sm">
                Guided questionnaire (takes ~15 min)
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Generate Document</h3>
              <p className="text-gray-600 text-sm">
                AI customizes your template instantly
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Download & Use</h3>
              <p className="text-gray-600 text-sm">
                Get PDF & DOCX, ready to sign
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Subscribe to Pro and generate {template.name} (and all templates) unlimited times
          </p>
          <Link
            href="/pricing"
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-flex items-center"
          >
            Subscribe to Pro - €99/month
          </Link>
        </div>
      </div>
    </div>
  );
}
