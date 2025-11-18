import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Terms of Service | Legmint',
  description: 'Terms and conditions governing your use of Legmint legal document platform, including template licensing, subscriptions, and lawyer referrals.',
  alternates: {
    canonical: '/legal/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsOfServicePage() {
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
        <div className="prose prose-emerald max-w-none text-gray-900">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Last updated: {LEGAL.lastUpdated.termsOfService}
          </p>

          {/* Introduction */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mb-8">
            <p className="text-lg text-gray-900 font-medium mb-2">
              Agreement to Terms
            </p>
            <p className="text-gray-900">
              By accessing or using Legmint, you agree to be bound by these Terms of Service
              and our{' '}
              <Link href="/legal/privacy" className="text-emerald-600 hover:underline font-medium">
                Privacy Policy
              </Link>
              . If you do not agree, do not use our services.
            </p>
          </div>

          {/* Not a Law Firm Disclaimer */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Critical: Legmint Is Not a Law Firm
            </p>
            <p className="text-sm text-gray-900 mb-2">
              {LEGAL.companyName} provides technology tools for generating legal document templates
              and connecting users with independent lawyers. We do not provide legal advice,
              representation, or legal opinions.
            </p>
            <p className="text-sm text-gray-900">
              <strong>No attorney-client relationship</strong> is created between you and Legmint
              by using our platform. Our templates are informational starting points, not substitutes
              for professional legal counsel. Always consult a licensed attorney for advice on your
              specific situation.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 p-6 rounded-lg mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contents</h2>
            <ol className="space-y-2 text-sm">
              <li><a href="#definitions" className="text-emerald-600 hover:underline">1. Definitions</a></li>
              <li><a href="#account" className="text-emerald-600 hover:underline">2. Account Registration & Eligibility</a></li>
              <li><a href="#services" className="text-emerald-600 hover:underline">3. Description of Services</a></li>
              <li><a href="#license" className="text-emerald-600 hover:underline">4. License to Use Templates</a></li>
              <li><a href="#payments" className="text-emerald-600 hover:underline">5. Payments, Subscriptions & Billing</a></li>
              <li><a href="#refunds" className="text-emerald-600 hover:underline">6. Refunds & Cancellations</a></li>
              <li><a href="#referrals" className="text-emerald-600 hover:underline">7. Lawyer Referral Marketplace</a></li>
              <li><a href="#acceptable-use" className="text-emerald-600 hover:underline">8. Acceptable Use Policy</a></li>
              <li><a href="#ip" className="text-emerald-600 hover:underline">9. Intellectual Property</a></li>
              <li><a href="#disclaimers" className="text-emerald-600 hover:underline">10. Disclaimers & No Warranties</a></li>
              <li><a href="#liability" className="text-emerald-600 hover:underline">11. Limitation of Liability</a></li>
              <li><a href="#indemnity" className="text-emerald-600 hover:underline">12. Indemnification</a></li>
              <li><a href="#termination" className="text-emerald-600 hover:underline">13. Termination</a></li>
              <li><a href="#governing-law" className="text-emerald-600 hover:underline">14. Governing Law & Disputes</a></li>
              <li><a href="#changes" className="text-emerald-600 hover:underline">15. Changes to Terms</a></li>
              <li><a href="#contact" className="text-emerald-600 hover:underline">16. Contact Information</a></li>
            </ol>
          </div>

          {/* 1. Definitions */}
          <section id="definitions" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Definitions
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>"Legmint," "we," "us," "our"</strong> refers to {LEGAL.companyName}.
              </li>
              <li>
                <strong>"Platform" or "Services"</strong> refers to the Legmint website, web application,
                APIs, and all related tools and features.
              </li>
              <li>
                <strong>"User," "you," "your"</strong> refers to any individual or entity using the Platform.
              </li>
              <li>
                <strong>"Templates"</strong> refers to the legal document templates generated through
                our Platform.
              </li>
              <li>
                <strong>"Lawyer"</strong> refers to independent legal professionals listed on our
                referral marketplace.
              </li>
            </ul>
          </section>

          {/* 2. Account Registration & Eligibility */}
          <section id="account" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Account Registration & Eligibility
            </h2>
            <p className="mb-4"><strong>Eligibility:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>You must be at least 18 years old to use Legmint.</li>
              <li>
                You must have legal capacity to enter into binding contracts in your jurisdiction.
              </li>
              <li>
                You must not be prohibited from using our Services under applicable law.
              </li>
            </ul>

            <p className="mb-4"><strong>Account Security:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You are responsible for maintaining the confidentiality of your account credentials.
              </li>
              <li>
                You agree to notify us immediately of any unauthorized use of your account at{' '}
                <a href={`mailto:${LEGAL.supportEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.supportEmail}
                </a>.
              </li>
              <li>
                You are liable for all activity conducted under your account.
              </li>
            </ul>

            <p className="mb-4"><strong>Accurate Information:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You agree to provide accurate, current, and complete information during registration.
              </li>
              <li>
                You agree to update your information promptly if it changes.
              </li>
              <li>
                We may suspend or terminate accounts with false or misleading information.
              </li>
            </ul>
          </section>

          {/* 3. Description of Services */}
          <section id="services" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Description of Services
            </h2>
            <p className="mb-4">Legmint provides:</p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Document Generation Platform
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Interactive questionnaires to collect information for legal document templates.
              </li>
              <li>
                Automated generation of customized legal documents based on your inputs.
              </li>
              <li>
                Access to templates covering common legal needs for startups and businesses in
                the UK, Germany, Czech Republic, Delaware (US), and California (US).
              </li>
              <li>
                Preview functionality (free) and final document delivery (paid).
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) Lawyer Referral Marketplace
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                A platform connecting users with independent, licensed attorneys for consultations
                and legal representation.
              </li>
              <li>
                Lawyer profiles, ratings, and booking tools.
              </li>
              <li>
                Legmint earns a referral fee when users book through the platform. Lawyers set
                their own fees and terms; Legmint is not responsible for the quality, outcome,
                or legality of services provided by independent lawyers.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Educational Content
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Blog posts, guides, and resources about legal topics. This content is for
                informational purposes only and does not constitute legal advice.
              </li>
            </ul>
          </section>

          {/* 4. License to Use Templates */}
          <section id="license" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. License to Use Templates
            </h2>
            <p className="mb-4">
              When you purchase or generate a document through Legmint, we grant you a
              <strong> non-exclusive, non-transferable, limited license</strong> to use the
              generated document for your internal business or personal purposes.
            </p>

            <p className="mb-4"><strong>You may:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Download, edit, and customize the document for your own use.</li>
              <li>
                Share the document with your employees, contractors, advisors, or legal counsel
                as needed.
              </li>
            </ul>

            <p className="mb-4"><strong>You may NOT:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Resell, redistribute, sublicense, or commercially exploit Legmint templates.
              </li>
              <li>
                Use templates to create competing products or services.
              </li>
              <li>
                Remove copyright notices, watermarks, or attribution (if present).
              </li>
              <li>
                Claim ownership of the underlying template structure or format.
              </li>
            </ul>

            <p className="mt-4">
              <strong>No Warranty on Suitability:</strong> While we strive for accuracy,
              we do not warrant that any template will meet your specific legal requirements
              or be enforceable in your jurisdiction. Always have documents reviewed by a
              licensed attorney before relying on them.
            </p>
          </section>

          {/* 5. Payments, Subscriptions & Billing */}
          <section id="payments" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Payments, Subscriptions & Billing
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Payment Methods
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                All payments are processed securely through Stripe. Legmint does not store your
                full payment card details.
              </li>
              <li>
                You authorize us to charge your selected payment method for all fees incurred.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) One-Time Purchases
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Pay per document. Charges are immediate upon clicking "Generate."
              </li>
              <li>
                Prices are displayed in your local currency (or USD/EUR/GBP). Final pricing
                includes VAT/sales tax where applicable.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Subscription Plans
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Monthly or annual billing:</strong> Subscriptions renew automatically
                at the end of each billing cycle unless cancelled.
              </li>
              <li>
                <strong>Pricing:</strong> Subscription fees are billed in advance. Pricing is
                subject to change; existing subscribers will be notified at least 30 days before
                price increases take effect.
              </li>
              <li>
                <strong>Auto-renewal:</strong> By subscribing, you authorize recurring charges
                until you cancel.
              </li>
              <li>
                <strong>Free trials:</strong> If offered, you must cancel before the trial ends
                to avoid charges. We will notify you before the trial expires.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              d) Taxes
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You are responsible for all applicable taxes (VAT, sales tax, GST, etc.) based
                on your location.
              </li>
              <li>
                Taxes will be calculated and added to your invoice at checkout where required.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              e) Failed Payments
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                If a payment fails, we may retry charging your payment method and/or suspend
                your subscription until payment is resolved.
              </li>
              <li>
                You agree to update payment information promptly to avoid service interruption.
              </li>
            </ul>
          </section>

          {/* 6. Refunds & Cancellations */}
          <section id="refunds" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Refunds & Cancellations
            </h2>
            <p className="mb-4">
              Please refer to our{' '}
              <Link href="/legal/refund-policy" className="text-emerald-600 hover:underline font-medium">
                Refund Policy
              </Link>{' '}
              for complete details. Summary:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>No refunds after successful delivery</strong> of digital documents.
              </li>
              <li>
                Refunds may be granted for technical failures, duplicate charges, or billing errors.
              </li>
              <li>
                <strong>EU consumers:</strong> By generating a document, you waive your 14-day
                withdrawal right (as permitted under Directive 2011/83/EU).
              </li>
              <li>
                <strong>Subscriptions:</strong> Cancel anytime via your account dashboard. No
                refunds for partial billing periods.
              </li>
            </ul>
          </section>

          {/* 7. Lawyer Referral Marketplace */}
          <section id="referrals" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Lawyer Referral Marketplace
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Independent Lawyers
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Lawyers listed on Legmint are independent contractors, not employees or agents
                of Legmint.
              </li>
              <li>
                Each lawyer is solely responsible for their own professional conduct, licensing,
                malpractice insurance, and compliance with bar association rules.
              </li>
              <li>
                Legmint does not supervise, control, or guarantee the quality of legal services
                provided by lawyers.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) Referral Fees
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                When you book a consultation or engagement through Legmint, we earn a platform
                fee (€30 fixed fee for initial document reviews, and 15% for additional legal work).
              </li>
              <li>
                This fee structure is disclosed to lawyers and does not affect your cost—lawyers
                set their own rates.
              </li>
              <li>
                Referral fees are non-refundable once the introduction is made (see{' '}
                <Link href="/legal/refund-policy" className="text-emerald-600 hover:underline">
                  Refund Policy
                </Link>
                ).
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) No Guarantee of Outcomes
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Legmint makes no representations or warranties about the results of any legal
                matter handled by a referred lawyer.
              </li>
              <li>
                Disputes about lawyer fees, ethics, or work quality must be resolved directly
                with the lawyer or through your jurisdiction's bar association.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              d) User Responsibility
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                You are responsible for vetting lawyers, reviewing their credentials, and
                determining if they are suitable for your needs.
              </li>
              <li>
                Legmint provides profiles and ratings as a convenience but does not endorse
                or verify every lawyer's qualifications.
              </li>
            </ul>
          </section>

          {/* 8. Acceptable Use Policy */}
          <section id="acceptable-use" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Acceptable Use Policy
            </h2>
            <p className="mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Violate any applicable laws, regulations, or third-party rights.
              </li>
              <li>
                Use the Platform for fraudulent, illegal, or unauthorized purposes.
              </li>
              <li>
                Interfere with or disrupt the Platform's functionality, security, or servers
                (e.g., hacking, denial-of-service attacks, malware).
              </li>
              <li>
                Reverse-engineer, decompile, or attempt to extract the source code of the Platform.
              </li>
              <li>
                Scrape, harvest, or collect user data without permission.
              </li>
              <li>
                Impersonate others or misrepresent your affiliation with any person or entity.
              </li>
              <li>
                Upload or transmit viruses, spam, or harmful code.
              </li>
              <li>
                Use templates or content in a way that infringes intellectual property rights.
              </li>
              <li>
                Abuse, harass, or threaten Legmint staff, lawyers, or other users.
              </li>
            </ul>
            <p className="mt-4">
              <strong>Enforcement:</strong> We reserve the right to suspend or terminate accounts
              that violate this policy, with or without notice.
            </p>
          </section>

          {/* 9. Intellectual Property */}
          <section id="ip" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Intellectual Property
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Legmint Owns the Platform
            </h3>
            <p className="mb-4">
              All content, design, code, logos, trademarks, and technology underlying Legmint
              (excluding user-generated content and third-party materials) are owned by or
              licensed to {LEGAL.companyName} and protected by copyright, trademark, and other
              intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) User-Generated Content
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You retain ownership of any information, data, or documents you input into the
                Platform.
              </li>
              <li>
                By using Legmint, you grant us a limited, non-exclusive license to process,
                store, and display your inputs solely to provide the Services (e.g., generate
                your documents).
              </li>
              <li>
                We do not claim ownership of your completed documents.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Feedback
            </h3>
            <p>
              If you provide feedback, suggestions, or ideas about Legmint, you grant us a
              perpetual, royalty-free, worldwide license to use and incorporate such feedback
              without compensation or attribution.
            </p>
          </section>

          {/* 10. Disclaimers & No Warranties */}
          <section id="disclaimers" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Disclaimers & No Warranties
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2 uppercase">
                Important Legal Disclaimer
              </p>
              <p className="text-sm text-gray-900">
                THE PLATFORM AND ALL TEMPLATES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              </p>
            </div>

            <p className="mb-4">
              <strong>We disclaim all warranties, including but not limited to:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Accuracy or suitability:</strong> We do not warrant that templates are
                error-free, legally sufficient, or appropriate for your jurisdiction or situation.
              </li>
              <li>
                <strong>Non-infringement:</strong> We do not guarantee that using our templates
                will not infringe third-party rights.
              </li>
              <li>
                <strong>Availability:</strong> We do not guarantee uninterrupted, error-free,
                or secure access to the Platform.
              </li>
              <li>
                <strong>Lawyer quality:</strong> We do not warrant the competence, reliability,
                or outcomes of lawyers in our referral marketplace.
              </li>
            </ul>

            <p className="mt-4">
              <strong>Your use of Legmint is at your sole risk.</strong> Always consult a
              licensed attorney before relying on any legal document or advice.
            </p>
          </section>

          {/* 11. Limitation of Liability */}
          <section id="liability" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Limitation of Liability
            </h2>
            <p className="mb-4">
              <strong>To the maximum extent permitted by law:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Legmint, its officers, directors, employees, and affiliates will not be liable
                for any indirect, incidental, consequential, special, or punitive damages arising
                from your use of the Platform.
              </li>
              <li>
                This includes (but is not limited to) damages for lost profits, data loss,
                business interruption, or legal fees incurred as a result of using templates
                or engaging referred lawyers.
              </li>
              <li>
                Our total liability to you for any claim related to the Services will not exceed
                the amount you paid us in the 12 months preceding the claim (or €100, whichever
                is greater).
              </li>
            </ul>

            <p className="mt-4">
              <strong>Jurisdictional Exceptions:</strong> Some jurisdictions do not allow
              exclusion of certain warranties or limitation of liability for incidental damages.
              In such cases, our liability will be limited to the fullest extent permitted by law.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section id="indemnity" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Indemnification
            </h2>
            <p className="mb-4">
              You agree to indemnify, defend, and hold harmless Legmint and its affiliates from
              any claims, liabilities, damages, losses, and expenses (including reasonable legal
              fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use or misuse of the Platform.</li>
              <li>Your violation of these Terms or applicable law.</li>
              <li>
                Your use of templates without proper legal review or customization.
              </li>
              <li>
                Any disputes with lawyers you engage through our referral marketplace.
              </li>
              <li>Infringement of third-party rights due to your actions.</li>
            </ul>
          </section>

          {/* 13. Termination */}
          <section id="termination" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Termination
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) By You
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                You may close your account at any time by contacting{' '}
                <a href={`mailto:${LEGAL.supportEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.supportEmail}
                </a>.
              </li>
              <li>
                Cancelling a subscription ends auto-renewal but does not delete your account
                or entitle you to a refund for the current billing period.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) By Legmint
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                We may suspend or terminate your account immediately if you violate these Terms,
                engage in fraudulent activity, or pose a security risk.
              </li>
              <li>
                We may also discontinue the Platform or specific features at any time, with or
                without notice (though we will try to provide reasonable notice for material changes).
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Effect of Termination
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Upon termination, your right to access the Platform ends immediately.
              </li>
              <li>
                Documents you generated before termination remain yours to use under the license
                granted in Section 4.
              </li>
              <li>
                Provisions related to disclaimers, liability, indemnity, and governing law survive
                termination.
              </li>
            </ul>
          </section>

          {/* 14. Governing Law & Disputes */}
          <section id="governing-law" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Governing Law & Disputes
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Governing Law
            </h3>
            <p className="mb-4">
              These Terms are governed by the laws of <strong>{LEGAL.governingLaw}</strong>,
              without regard to conflict-of-law principles.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) Dispute Resolution
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Informal resolution:</strong> Before initiating formal proceedings,
                contact us at{' '}
                <a href={`mailto:${LEGAL.contactEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.contactEmail}
                </a>{' '}
                to resolve the dispute amicably.
              </li>
              <li>
                <strong>Venue:</strong> Any legal disputes will be resolved in the courts of{' '}
                <strong>{LEGAL.disputeVenue}</strong>, and you consent to the exclusive jurisdiction
                of those courts.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Consumer Rights (EU/UK)
            </h3>
            <p>
              If you are a consumer in the EU or UK, nothing in these Terms affects your
              statutory rights under mandatory consumer protection laws. You may have the right
              to bring proceedings in your country of residence.
            </p>
          </section>

          {/* 15. Changes to Terms */}
          <section id="changes" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Changes to Terms
            </h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                We may update these Terms from time to time to reflect changes in our practices,
                legal requirements, or new features.
              </li>
              <li>
                Material changes will be notified via email or a prominent notice on the Platform
                at least 30 days before they take effect.
              </li>
              <li>
                Your continued use of Legmint after changes take effect constitutes acceptance
                of the updated Terms.
              </li>
              <li>
                If you do not agree to the changes, you must stop using the Platform and cancel
                your account/subscription.
              </li>
            </ul>
          </section>

          {/* 16. Contact Information */}
          <section id="contact" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              16. Contact Information
            </h2>
            <p className="mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Email:</strong>{' '}
                <a href={`mailto:${LEGAL.contactEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.contactEmail}
                </a>
              </p>
              <p className="mb-2">
                <strong>Support:</strong>{' '}
                <a href={`mailto:${LEGAL.supportEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.supportEmail}
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
                href="/legal/refund-policy"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Refund Policy
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
