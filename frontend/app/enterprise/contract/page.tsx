'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EnterpriseContractPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const applicationId = searchParams.get('id');
  const planType = searchParams.get('plan') || 'enterprise';
  const isUltra = planType === 'enterprise-ultra';

  const [signatureName, setSignatureName] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signed, setSigned] = useState(false);

  const handleSign = async () => {
    if (!signatureName.trim()) {
      setError('Please enter your full name to sign');
      return;
    }
    if (!acceptedTerms) {
      setError('Please accept the terms to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/enterprise/contract/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          acceptedTerms: true,
          signatureName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to sign contract');
      }

      setSigned(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (signed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contract Signed</h1>
          <p className="text-gray-600 mb-8">
            Thank you for signing. Your invoice has been sent to your email address.
            Once payment is received, your account will be activated immediately.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Legmint {isUltra ? 'Enterprise Ultra' : 'Enterprise'} Agreement
          </h1>
          <p className="text-gray-600 mt-2">
            Please review and sign the agreement to complete your subscription
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Contract Document */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              LEGMINT {isUltra ? 'ENTERPRISE ULTRA' : 'ENTERPRISE'} SUBSCRIPTION AGREEMENT
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Effective Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>

            <p>
              This Enterprise Subscription Agreement ("Agreement") is entered into between Legmint Ltd,
              a company registered in England and Wales ("Legmint", "we", "us", or "our") and the
              subscribing entity ("Customer", "you", or "your").
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1. SUBSCRIPTION SERVICES</h3>
            <p>
              1.1. Legmint grants Customer a non-exclusive, non-transferable right to access and use
              the Legmint platform and services during the Subscription Term.
            </p>
            <p>
              1.2. The {isUltra ? 'Enterprise Ultra' : 'Enterprise'} subscription includes:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full access to all document templates across supported jurisdictions</li>
              <li>Unlimited document generation and downloads</li>
              {isUltra ? (
                <>
                  <li><strong>Unlimited legal consultations</strong> with specialist attorneys</li>
                  <li>White-label solution with custom branding</li>
                  <li>Priority template development (48-hour turnaround)</li>
                  <li>Dedicated account manager and legal team</li>
                  <li>99.99% uptime SLA guarantee</li>
                </>
              ) : (
                <>
                  <li>10 hours per month of legal consultation with specialist attorneys</li>
                  <li>24/7 priority support with dedicated account manager</li>
                  <li>Custom template development</li>
                  <li>Multi-user team access</li>
                  <li>99.9% uptime SLA guarantee</li>
                </>
              )}
              <li>API access for workflow automation</li>
              <li>Templates auto-updated with latest legal requirements</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. FEES AND PAYMENT</h3>
            <p>
              2.1. Customer agrees to pay the subscription fee of <strong>€{isUltra ? '6,500' : '3,500'} per month</strong>
              {' '}(or the agreed annual amount if billed annually).
            </p>
            <p>
              2.2. The minimum commitment period is <strong>{isUltra ? '6 months' : '3 months'}</strong>.
            </p>
            <p>
              2.3. Payment is due within 14 days of invoice date. Legmint reserves the right to
              suspend access for overdue payments exceeding 30 days.
            </p>
            <p>
              2.4. All fees are exclusive of applicable taxes (VAT, sales tax) which will be added where required.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. TERM AND TERMINATION</h3>
            <p>
              3.1. This Agreement commences on the Effective Date and continues for the initial
              commitment period, then renews monthly unless terminated.
            </p>
            <p>
              3.2. Either party may terminate with 30 days' written notice after the initial commitment period.
            </p>
            <p>
              3.3. Legmint may terminate immediately for material breach, including non-payment or
              violation of acceptable use policies.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">4. IMPORTANT DISCLAIMERS</h3>
            <p>
              4.1. <strong>AI-Assisted Services</strong>: Legmint provides AI-assisted legal document
              generation and information services. This does not constitute legal advice.
            </p>
            <p>
              4.2. <strong>Not a Law Firm</strong>: Legmint is not a law firm and does not provide
              regulated legal services. Documents generated should be reviewed by qualified legal
              counsel before use.
            </p>
            <p>
              4.3. <strong>Consultation Services</strong>: Legal consultations included in this
              subscription are provided by independent, qualified attorneys in the relevant
              jurisdictions. Legmint facilitates but does not provide these services directly.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">5. DATA PROTECTION</h3>
            <p>
              5.1. Both parties agree to comply with applicable data protection laws including GDPR.
            </p>
            <p>
              5.2. Legmint will process Customer data in accordance with our Privacy Policy and
              Data Processing Agreement.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">6. LIMITATION OF LIABILITY</h3>
            <p>
              6.1. To the maximum extent permitted by law, Legmint's total liability under this
              Agreement shall not exceed the fees paid by Customer in the 12 months preceding the claim.
            </p>
            <p>
              6.2. Neither party shall be liable for indirect, incidental, special, or consequential damages.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">7. GOVERNING LAW</h3>
            <p>
              This Agreement shall be governed by and construed in accordance with the laws of
              England and Wales. Any disputes shall be subject to the exclusive jurisdiction of
              the courts of England and Wales.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">8. ENTIRE AGREEMENT</h3>
            <p>
              This Agreement, together with Legmint's Terms of Service and Privacy Policy,
              constitutes the entire agreement between the parties and supersedes all prior
              negotiations, representations, or agreements relating to this subject matter.
            </p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Sign Agreement</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Full Legal Name (as signature)
              </label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg"
                placeholder="John Smith"
              />
              <p className="text-xs text-gray-500 mt-1">
                By typing your name, you agree this constitutes your electronic signature
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">
                I have read and agree to the terms of this Agreement, including the{' '}
                <Link href="/legal/terms" className="text-emerald-600 hover:underline" target="_blank">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/legal/privacy" className="text-emerald-600 hover:underline" target="_blank">
                  Privacy Policy
                </Link>. I confirm I am authorized to enter into this Agreement on behalf of the Customer.
              </span>
            </label>

            <button
              onClick={handleSign}
              disabled={loading || !signatureName.trim() || !acceptedTerms}
              className={`w-full py-4 rounded-lg font-semibold text-white transition disabled:opacity-50 ${
                isUltra
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? 'Processing...' : 'Sign Agreement & Continue to Payment'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Questions? Contact{' '}
          <a href="mailto:enterprise@legmint.com" className="text-emerald-600 hover:underline">
            enterprise@legmint.com
          </a>
        </p>
      </div>
    </div>
  );
}
