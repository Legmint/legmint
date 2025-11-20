/**
 * Billing Dashboard Page
 *
 * Shows subscription status and billing portal access
 */

'use client';

import { useUser } from '@clerk/nextjs';
import { useCheckout } from '@/hooks/useCheckout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock subscription data - in real app, fetch from API
interface Subscription {
  id: string;
  plan: 'pro';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function BillingPage() {
  const { openBillingPortal, checkoutSubscription, isLoading, error } = useCheckout();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => {
      // Example: user has Pro subscription
      setSubscription({
        id: 'sub_1234567890',
        plan: 'pro',
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
      });
      setIsLoadingData(false);
    }, 500);
  }, []);

  const planDetails = {
    pro: {
      name: 'Pro',
      price: 99,
      features: [
        'Full access to all templates (UK, DE, CZ, US-DE, US-CA)',
        'Unlimited document generation and downloads',
        'Multilingual templates (EN, DE, CS)',
        'Auto-updates when laws change',
        'Access to verified lawyer referral network',
      ],
    },
  };

  const handleManageBilling = async () => {
    await openBillingPortal();
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-indigo-600 hover:underline mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and payment methods</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2 space-y-6">
            {subscription ? (
              <>
                {/* Active Subscription Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {planDetails[subscription.plan].name} Plan
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            subscription.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : subscription.status === 'past_due'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {subscription.status === 'active' ? '✓ Active' : subscription.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-gray-900">
                        €{planDetails[subscription.plan].price}
                        <span className="text-lg text-gray-600 font-normal">/month</span>
                      </p>
                    </div>
                    <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Included features:</h3>
                    <ul className="space-y-2">
                      {planDetails[subscription.plan].features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-600">Next billing date:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {subscription.cancelAtPeriodEnd && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-sm text-yellow-800">
                          Your subscription will be canceled on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
                          You&apos;ll continue to have access until then.
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleManageBilling}
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Opening...' : 'Manage Subscription'}
                  </button>
                  {error && (
                    <p className="text-red-600 text-sm mt-3">{error}</p>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-3">
                    You&apos;ll be redirected to Stripe to manage your subscription
                  </p>
                </div>

                {/* Billing Portal Features */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    What you can do in the billing portal:
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update payment method
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      View billing history & invoices
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Change or cancel subscription
                    </li>
                    <li className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Download receipts for accounting
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              /* No Subscription */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Subscription</h2>
                <p className="text-gray-600 mb-6">
                  Subscribe to unlock unlimited document generation
                </p>
                <Link
                  href="/pricing"
                  className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  View Plans
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar - Usage & Support */}
          <div className="space-y-6">
            {/* Usage This Month */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Usage This Month</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Documents Generated</span>
                    <span className="font-medium">
                      {subscription ? 'Unlimited ✓' : '0 / 1'}
                    </span>
                  </div>
                  {!subscription && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <Link href="/dashboard/documents" className="text-indigo-600 hover:underline text-sm font-medium">
                    View all documents →
                  </Link>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <a href="mailto:billing@legmint.com" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  billing@legmint.com
                </a>
                <Link href="/help" className="flex items-center text-gray-700 hover:text-indigo-600">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help Center
                </Link>
              </div>
            </div>

            {/* Secure Payments */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <svg className="w-12 h-12 text-indigo-600 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 1.315 0 2.088.583 2.213 1.443h1.838c-.143-1.637-1.315-2.926-3.194-3.271V1.5h-2.4v2.092C8.945 3.836 7.5 5.11 7.5 6.866c0 2.052 1.732 3.012 4.456 3.911 2.497.826 3.044 1.594 3.044 2.566 0 .735-.512 1.657-2.4 1.657-1.696 0-2.571-.754-2.784-1.8H7.963c.226 2.106 1.946 3.22 4.337 3.517V19.5h2.4v-2.713c2.084-.327 3.5-1.657 3.5-3.477 0-2.542-2.128-3.434-4.224-4.14z" />
              </svg>
              <p className="text-sm font-medium text-gray-900 mb-1">Powered by Stripe</p>
              <p className="text-xs text-gray-600">
                Secure, PCI-compliant payments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
