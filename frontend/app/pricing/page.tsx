/**
 * Pricing Page - Simplified 2-Tier Model
 * Free (preview only) + Pro (€99/mo with 15% yearly discount)
 */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCheckout } from '@/hooks/useCheckout';
import Link from 'next/link';

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const { checkoutSubscription, isLoading, error } = useCheckout();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Stripe Price IDs (set these in your environment variables)
  const PRICE_IDS = {
    proMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_PRO_MONTHLY',
    proYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || 'price_PRO_YEARLY',
  };

  const handleSubscribe = async (priceId: string) => {
    if (!isSignedIn) {
      // Redirect to sign up
      window.location.href = '/sign-up';
      return;
    }
    await checkoutSubscription(priceId);
  };

  const yearlyPrice = 99 * 12 * 0.85; // 15% discount
  const monthlySavings = (99 * 12 - yearlyPrice) / 12;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center">
          <Link href="/" className="text-emerald-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant access to legal templates. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Save 15%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Free Tier */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="flex items-baseline justify-center mb-4">
                <span className="text-5xl font-extrabold text-gray-900">€0</span>
              </div>
              <p className="text-gray-600">Explore and preview templates</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Browse and preview all templates</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Use the interactive form up to preview</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-500">No downloads or exports</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-gray-500">No finalized generation</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 font-medium">Upgrade anytime</span>
              </li>
            </ul>

            <Link
              href="/templates"
              className="block w-full text-center bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Browse Templates
            </Link>
            <p className="text-xs text-gray-500 text-center mt-3">
              No credit card required
            </p>
          </div>

          {/* Pro - Most Popular */}
          <div className="bg-white border-2 border-emerald-600 rounded-xl p-8 shadow-lg relative transform md:scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="flex items-baseline justify-center mb-4">
                {billingCycle === 'monthly' ? (
                  <>
                    <span className="text-5xl font-extrabold text-emerald-600">€99</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-extrabold text-emerald-600">€{Math.round(yearlyPrice / 12)}</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </>
                )}
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-emerald-600 font-medium mb-2">
                  €{Math.round(yearlyPrice)}/year • Save €{Math.round(99 * 12 - yearlyPrice)} annually
                </p>
              )}
              <p className="text-gray-600">Full access for growing startups</p>
            </div>

            <ul className="space-y-3 mb-8 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Full access</strong> to all templates across jurisdictions (UK, DE, CZ, US-DE, US-CA)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Unlimited</strong> document generation and downloads (PDF/DOCX)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Templates <strong>auto-updated</strong> with latest laws (GDPR, CCPA, UK Companies Act, etc.)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Multilingual</strong> support (EN / DE / CS)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Access to <strong>future template categories</strong> (funding, HR, IP, data protection)</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700"><strong>Lawyer referral integration:</strong> direct consultation with verified local attorneys</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe(billingCycle === 'monthly' ? PRICE_IDS.proMonthly : PRICE_IDS.proYearly)}
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Redirecting to Stripe...
                </span>
              ) : (
                `Subscribe to Pro${billingCycle === 'yearly' ? ' (Annual)' : ''}`
              )}
            </button>
            {error && (
              <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
            )}
            <p className="text-xs text-gray-500 text-center mt-3">
              Secure checkout with Stripe • Cancel anytime
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes! Cancel your subscription anytime from your billing portal. No questions asked, no penalties.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, Amex) through our secure Stripe checkout.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">How does the Free plan work?</h3>
              <p className="text-gray-600">
                The Free plan lets you browse all templates and use the interactive form to preview what the final document will look like.
                To download or generate the final document, upgrade to Pro.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee on subscriptions. See our{' '}
                <Link href="/legal/refund-policy" className="text-emerald-600 hover:underline font-medium">
                  Refund Policy
                </Link>{' '}
                for complete details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-lg mb-2">What's included in the lawyer referral integration?</h3>
              <p className="text-gray-600">
                Pro subscribers get access to our verified network of local attorneys across all supported jurisdictions.
                Book consultations directly through the platform with transparent pricing and vetted professionals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 1.315 0 2.088.583 2.213 1.443h1.838c-.143-1.637-1.315-2.926-3.194-3.271V1.5h-2.4v2.092C8.945 3.836 7.5 5.11 7.5 6.866c0 2.052 1.732 3.012 4.456 3.911 2.497.826 3.044 1.594 3.044 2.566 0 .735-.512 1.657-2.4 1.657-1.696 0-2.571-.754-2.784-1.8H7.963c.226 2.106 1.946 3.22 4.337 3.517V19.5h2.4v-2.713c2.084-.327 3.5-1.657 3.5-3.477 0-2.542-2.128-3.434-4.224-4.14z" />
              </svg>
              <span className="font-medium">Powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
