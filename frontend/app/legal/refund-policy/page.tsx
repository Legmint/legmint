import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL, getRefundWindowText } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Refund Policy | Legmint',
  description: 'Understand our refund policy for digital legal templates and services. Learn about refund eligibility, EU consumer rights, and how to request a review.',
  alternates: {
    canonical: '/legal/refund-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-2"
          >
            ← Back to Legmint
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-emerald max-w-none">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Last updated: {LEGAL.lastUpdated.refundPolicy}
          </p>

          {/* Introduction */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mb-8">
            <p className="text-lg text-gray-800 font-medium mb-2">
              Summary
            </p>
            <p className="text-gray-700">
              Legmint provides digital legal templates that are delivered instantly upon generation.
              Because you receive the completed document immediately, we cannot offer refunds after
              successful delivery. However, we will review refund requests for technical failures,
              duplicate charges, or billing errors within {getRefundWindowText()}.
            </p>
          </div>

          {/* Not a Law Firm Disclaimer */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              Important: Legmint Is Not a Law Firm
            </p>
            <p className="text-sm text-amber-800">
              {LEGAL.companyName} is a technology platform providing document generation tools
              and lawyer referrals. We do not provide legal advice, representation, or attorney-client
              relationships. Our templates are informational tools, not substitutes for professional
              legal counsel. For advice on your specific situation, consult a licensed attorney.
            </p>
          </div>

          {/* 1. How Our Service Works */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. How Our Service Works
            </h2>
            <p className="mb-4">
              When you use Legmint, you follow this process:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>
                <strong>Preview for free:</strong> You answer questions and see a preview of
                your document without any charge.
              </li>
              <li>
                <strong>Payment & delivery:</strong> When satisfied with the preview, you pay
                (one-time or subscription) and immediately receive the final, editable document.
              </li>
              <li>
                <strong>Digital content delivered:</strong> Your document is available for
                download instantly—this is the point where the digital content is fully delivered.
              </li>
            </ol>
            <p>
              Because digital documents are delivered immediately and cannot be "returned,"
              standard refund rights do not apply once you successfully generate and download
              your document.
            </p>
          </section>

          {/* 2. No Refunds After Successful Delivery */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. No Refunds After Successful Delivery
            </h2>
            <p className="mb-4">
              Once you click "Generate" and your document is successfully created and made
              available for download, the purchase is final. This applies to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>One-time document purchases</li>
              <li>Subscription-based template access</li>
              <li>Add-on services (lawyer referrals, premium templates)</li>
            </ul>
            <p>
              You are encouraged to carefully review the preview before purchasing. If you
              have questions about whether a template meets your needs, contact us at{' '}
              <a href={`mailto:${LEGAL.supportEmail}`} className="text-emerald-600 hover:underline">
                {LEGAL.supportEmail}
              </a>{' '}
              before completing payment.
            </p>
          </section>

          {/* 3. EU Consumer Rights & Withdrawal Period Waiver */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. EU Consumer Rights & Withdrawal Period Waiver
            </h2>
            <p className="mb-4">
              If you are a consumer in the European Union or United Kingdom, you ordinarily
              have the right to cancel purchases of digital content within 14 days under
              Directive 2011/83/EU (the Consumer Rights Directive).
            </p>
            <p className="mb-4">
              <strong>However, by clicking "Generate" and proceeding with payment, you:</strong>
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-4">
              <li>
                Expressly request immediate delivery of the digital content (your legal document).
              </li>
              <li>
                Acknowledge that performance begins immediately upon payment.
              </li>
              <li>
                Agree to waive your 14-day right of withdrawal, as permitted by Article 16(m)
                of Directive 2011/83/EU.
              </li>
            </ol>
            <p>
              This waiver is presented clearly during checkout. Once the document is delivered,
              the 14-day cancellation right no longer applies.
            </p>
          </section>

          {/* 4. Exceptions: When Refunds May Be Granted */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Exceptions: When Refunds May Be Granted
            </h2>
            <p className="mb-4">
              We will review and may approve refund requests in the following situations:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Technical Failures
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                The document generation process failed, and you were charged but did not
                receive a usable document.
              </li>
              <li>
                A system error prevented download or delivery despite successful payment.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) Duplicate or Erroneous Charges
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You were charged multiple times for the same transaction due to a billing error.
              </li>
              <li>
                An unauthorized charge appeared on your account (you should also dispute this
                with your bank/card issuer).
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Billing Errors
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You were charged an incorrect amount (e.g., wrong currency, pricing glitch).
              </li>
              <li>
                A subscription renewed unexpectedly due to a system malfunction (note:
                normal renewals after your billing cycle are not errors—see our{' '}
                <Link href="/legal/terms" className="text-emerald-600 hover:underline">
                  Terms of Service
                </Link>
                ).
              </li>
            </ul>

            <p className="mt-6">
              <strong>Time limit:</strong> Refund requests must be submitted within{' '}
              {getRefundWindowText()} of the charge. Requests received after this period
              will not be considered.
            </p>
          </section>

          {/* 5. How to Request a Refund Review */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. How to Request a Refund Review
            </h2>
            <p className="mb-4">
              To request a refund review, email{' '}
              <a href={`mailto:${LEGAL.consumerRefundEmail}`} className="text-emerald-600 hover:underline">
                {LEGAL.consumerRefundEmail}
              </a>{' '}
              within {getRefundWindowText()} of the charge. Include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Your account email</strong> (the email used for registration/payment)
              </li>
              <li>
                <strong>Transaction ID or receipt</strong> (from Stripe or your email confirmation)
              </li>
              <li>
                <strong>Date and amount charged</strong>
              </li>
              <li>
                <strong>Description of the issue</strong> (e.g., "document failed to generate,"
                "charged twice," "billing error")
              </li>
              <li>
                <strong>Screenshots or error messages</strong> (if applicable)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Review Timeline
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                We will acknowledge receipt of your refund request within 2 business days.
              </li>
              <li>
                We will investigate and respond with a decision within 5-7 business days.
              </li>
              <li>
                If approved, refunds are processed via Stripe and typically appear in your
                account within 5-10 business days (depending on your bank).
              </li>
            </ul>

            <p className="mt-4">
              Our decision is final. If you disagree, you may dispute the charge with your
              card issuer (see Section 7 below).
            </p>
          </section>

          {/* 6. Subscriptions & Cancellations */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Subscriptions & Cancellations
            </h2>
            <p className="mb-4">
              <strong>Subscription renewals are not refundable</strong> unless there was a
              billing error or technical failure (see Section 4). If you wish to avoid future
              charges:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Cancel your subscription <strong>before</strong> your next billing date via
                your account dashboard or by contacting{' '}
                <a href={`mailto:${LEGAL.supportEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.supportEmail}
                </a>.
              </li>
              <li>
                Cancellations take effect at the end of your current billing period—you retain
                access until then.
              </li>
              <li>
                We do not prorate partial months. If you cancel mid-cycle, you will not receive
                a refund for unused time.
              </li>
            </ul>
          </section>

          {/* 7. Chargebacks & Stripe Disputes */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Chargebacks & Stripe Disputes
            </h2>
            <p className="mb-4">
              If you dispute a charge with your bank or card issuer (a "chargeback") without
              first contacting us, we may:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Suspend or terminate your Legmint account.</li>
              <li>
                Provide evidence to Stripe (our payment processor) that the service was
                delivered as described.
              </li>
              <li>
                Be unable to reinstate your account if the chargeback is reversed in your favor.
              </li>
            </ul>
            <p className="mt-4">
              <strong>We strongly encourage you to contact us first</strong> at{' '}
              <a href={`mailto:${LEGAL.consumerRefundEmail}`} className="text-emerald-600 hover:underline">
                {LEGAL.consumerRefundEmail}
              </a>{' '}
              to resolve billing issues before initiating a chargeback. Most issues can be
              resolved quickly and amicably.
            </p>
          </section>

          {/* 8. Lawyer Referral Fees */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Lawyer Referral Fees
            </h2>
            <p className="mb-4">
              If you book a consultation or engagement with a lawyer through our referral
              marketplace and pay a platform fee to Legmint:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Referral fees are non-refundable</strong> once the introduction is made.
              </li>
              <li>
                Disputes about the lawyer's services, fees, or work product must be resolved
                directly with the lawyer—Legmint is not responsible for the quality or outcome
                of legal services provided by independent attorneys.
              </li>
              <li>
                If a technical error prevented the referral from being delivered, contact{' '}
                <a href={`mailto:${LEGAL.supportEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.supportEmail}
                </a>{' '}
                within {getRefundWindowText()}.
              </li>
            </ul>
          </section>

          {/* 9. Modifications to This Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Modifications to This Policy
            </h2>
            <p className="mb-4">
              We may update this Refund Policy from time to time to reflect changes in our
              practices, legal requirements, or service offerings. Updates will be posted on
              this page with a revised "Last updated" date. Your continued use of Legmint
              after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* 10. Contact Us */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Contact Us
            </h2>
            <p className="mb-4">
              If you have questions about this Refund Policy or need assistance with a refund
              request, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Email:</strong>{' '}
                <a href={`mailto:${LEGAL.consumerRefundEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.consumerRefundEmail}
                </a>
              </p>
              <p className="mb-2">
                <strong>Company:</strong> {LEGAL.companyName}
              </p>
              <p>
                <strong>Address:</strong> {LEGAL.registeredAddress}
              </p>
            </div>
          </section>

          {/* Related Links */}
          <div className="border-t border-gray-200 pt-8 mt-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Related Legal Documents
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/legal/terms"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                href="/legal/privacy"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/pricing"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
