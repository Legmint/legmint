/**
 * Template Detail Page with Stripe Checkout
 *
 * Displays template details fetched from the API
 * Example: /templates/founders-agreement
 */

'use client';

import { useParams } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Use API_BASE_URL (without /v1) to avoid double path
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface Template {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  jurisdictions: string[];
  languages: string[];
  is_featured?: boolean;
  is_active?: boolean;
  render_engine?: string;
  price_cents?: number;
  availableOverlays?: Array<{ jurisdiction: string; language: string }>;
}

// Default features for templates (could be enhanced with template-specific features from API)
const getTemplateFeatures = (category: string): string[] => {
  const featuresByCategory: Record<string, string[]> = {
    startup: [
      'Equity and ownership provisions',
      'Vesting schedules and cliffs',
      'IP assignment clauses',
      'Exit and dispute resolution',
      'Jurisdiction-specific compliance',
    ],
    b2b: [
      'Professional service terms',
      'Confidentiality provisions',
      'Liability limitations',
      'Payment and termination terms',
      'Governing law selection',
    ],
    b2c: [
      'User terms and conditions',
      'Privacy and data protection',
      'GDPR/CCPA compliance',
      'Dispute resolution',
      'Service level agreements',
    ],
    p2p: [
      'Party obligations',
      'Payment terms',
      'Confidentiality clauses',
      'Term and termination',
      'Governing law',
    ],
    other: [
      'Comprehensive legal coverage',
      'Clear definitions',
      'Standard legal provisions',
      'Customizable terms',
      'Professional formatting',
    ],
  };
  return featuresByCategory[category] || featuresByCategory.other;
};

export default function TemplateDetailPage() {
  const params = useParams();
  const { isSignedIn } = useUser();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const templateCode = params?.code as string;

  useEffect(() => {
    async function fetchTemplate() {
      if (!templateCode) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/v1/templates/${templateCode}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Template not found');
          }
          throw new Error('Failed to fetch template');
        }

        const data = await response.json();
        setTemplate(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load template');
      } finally {
        setLoading(false);
      }
    }

    fetchTemplate();
  }, [templateCode]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-white">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/templates" className="text-emerald-200 hover:text-white mb-4 inline-block">
              ← Back to Templates
            </Link>
            <h1 className="text-4xl font-bold mb-4">Template Not Found</h1>
            <p className="text-xl text-emerald-100">
              {error || 'The template you are looking for does not exist or is no longer available.'}
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Link
            href="/templates"
            className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition"
          >
            Browse All Templates
          </Link>
        </div>
      </div>
    );
  }

  const features = getTemplateFeatures(template.category);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-white">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Legmint
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/templates"
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Templates
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Pricing
              </Link>
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <Link
                  href="/sign-in"
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/templates" className="text-emerald-200 hover:text-white mb-4 inline-block">
            ← Back to Templates
          </Link>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-emerald-500 px-3 py-1 rounded-full text-sm font-medium capitalize">
                  {template.category}
                </span>
                {template.is_featured && (
                  <span className="bg-amber-500 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
                {template.jurisdictions && template.jurisdictions.length > 0 && (
                  <span className="bg-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                    {template.jurisdictions.length} jurisdiction{template.jurisdictions.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{template.title}</h1>
              <p className="text-xl text-emerald-100 mb-6">
                {template.description}
              </p>
              <div className="flex items-center gap-6 text-emerald-100 flex-wrap">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>~15 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>PDF & DOCX</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{template.jurisdictions?.join(', ') || 'Global'}</span>
                </div>
              </div>
            </div>

            {/* Subscription Required Card */}
            <div className="bg-white text-gray-900 p-8 rounded-2xl shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-3xl font-extrabold mb-2 text-emerald-600">
                  Pro Subscription Required
                </div>
                <p className="text-gray-600">Subscribe to generate this template</p>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-100 rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-extrabold text-emerald-600 mb-1">€99</div>
                  <div className="text-gray-600">per month</div>
                </div>
                <ul className="space-y-2 text-sm text-emerald-900">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited template generation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All jurisdictions (UK, DE, CZ, US)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>PDF & DOCX downloads</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Lawyer referral integration</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/pricing"
                className="block w-full bg-emerald-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition text-center mb-4 shadow-md"
              >
                Subscribe to Pro - €99/month
              </Link>

              {!isSignedIn && (
                <p className="text-xs text-gray-500 text-center">
                  Need an account?{' '}
                  <Link href="/sign-up" className="text-emerald-600 hover:underline font-medium">
                    Sign up free
                  </Link>
                </p>
              )}

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-6">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure checkout
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
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
          {features.map((feature: string, idx: number) => (
            <div key={idx} className="flex items-start bg-gradient-to-br from-white to-emerald-50/50 p-6 rounded-2xl border-2 border-emerald-100">
              <svg className="w-6 h-6 text-emerald-600 mr-4 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="bg-emerald-50/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Subscribe</h3>
              <p className="text-gray-600 text-sm">
                Secure checkout via Stripe in seconds
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Answer Questions</h3>
              <p className="text-gray-600 text-sm">
                Guided questionnaire (takes ~15 min)
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Generate Document</h3>
              <p className="text-gray-600 text-sm">
                AI customizes your template instantly
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Subscribe to Pro and generate {template.title} (and all templates) unlimited times
          </p>
          <Link
            href="/pricing"
            className="bg-white text-emerald-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-emerald-50 transition inline-flex items-center shadow-md"
          >
            Subscribe to Pro - €99/month
          </Link>
        </div>
      </div>
    </div>
  );
}
