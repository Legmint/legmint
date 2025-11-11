import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Legal Disclaimer | Legmint',
  description:
    'Important legal disclaimer about Legmint document generation services. Not legal advice. No attorney-client relationship created.',
  alternates: {
    canonical: '/legal/disclaimer',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function DisclaimerPage() {
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
            Legal Disclaimer
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Last updated: {LEGAL.lastUpdated.termsOfService}
          </p>

          {/* Critical Warning */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg
                className="w-8 h-8 text-red-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="text-lg font-bold text-gray-900 mb-2 uppercase">
                  Critical Notice
                </p>
                <p className="text-base text-gray-900 font-medium">
                  By using Legmint, you acknowledge and agree that you understand
                  this disclaimer and that Legmint does not provide legal advice
                  or create an attorney-client relationship.
                </p>
              </div>
            </div>
          </div>

          {/* 1. Not Legal Advice */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Not Legal Advice
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <p className="text-gray-900 mb-4">
                <strong>Legmint is a technology platform</strong> that provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-900">
                <li>Automated document generation tools</li>
                <li>Template libraries for common legal documents</li>
                <li>General legal information and educational resources</li>
                <li>A marketplace to connect with independent lawyers</li>
              </ul>
            </div>

            <p className="text-gray-900 mb-4">
              <strong className="text-red-600">
                Legmint does NOT provide legal advice, legal representation, or legal opinions.
              </strong>
            </p>

            <p className="text-gray-900 mb-4">
              Our templates and content are for informational purposes only. They are not
              tailored to your specific situation, jurisdiction, or legal needs. Laws vary
              significantly by country, state, and municipality, and change frequently.
            </p>

            <p className="text-gray-900">
              <strong>What this means for you:</strong> You should not rely on Legmint
              templates or information as a substitute for professional legal advice from a
              licensed attorney who understands your specific circumstances.
            </p>
          </section>

          {/* 2. No Attorney-Client Relationship */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. No Attorney-Client Relationship
            </h2>
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-4">
              <p className="text-gray-900 font-semibold mb-2">
                Using Legmint does NOT create an attorney-client relationship between you and:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-900">
                <li>Legmint or its parent company</li>
                <li>Any employees, contractors, or affiliates of Legmint</li>
                <li>The creators or authors of our templates</li>
              </ul>
            </div>

            <p className="text-gray-900 mb-4">
              Communications with Legmint (via email, chat, support tickets, etc.) are not
              confidential or privileged. We are not acting as your lawyer, and you are not
              our client.
            </p>

            <p className="text-gray-900">
              <strong>Lawyer Referrals:</strong> If you engage a lawyer through our referral
              marketplace, an attorney-client relationship may be formed directly between you
              and that lawyer—but NOT between you and Legmint. Each lawyer is an independent
              professional responsible for their own conduct and legal advice.
            </p>
          </section>

          {/* 3. Always Consult a Licensed Attorney */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Always Consult a Licensed Attorney
            </h2>
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg mb-4">
              <p className="text-gray-900 font-semibold mb-2">
                We strongly recommend that you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-900">
                <li>
                  <strong>Review all documents with a lawyer</strong> before signing,
                  executing, or relying on them
                </li>
                <li>
                  <strong>Seek legal advice</strong> for any questions about your rights,
                  obligations, or legal situation
                </li>
                <li>
                  <strong>Verify compliance</strong> with local, national, and international
                  laws that apply to you
                </li>
                <li>
                  <strong>Update documents regularly</strong> as laws change and your
                  circumstances evolve
                </li>
              </ul>
            </div>

            <p className="text-gray-900 mb-4">
              Legal requirements vary by jurisdiction. For example:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
              <li>
                <strong>UK:</strong> Employment law, company formation, and data protection
                (GDPR, UK DPA 2018) have specific requirements
              </li>
              <li>
                <strong>Germany:</strong> Contracts may require notarization; labor law is
                highly protective of employees
              </li>
              <li>
                <strong>Czech Republic:</strong> Certain documents must be in Czech and
                comply with the Czech Civil Code
              </li>
              <li>
                <strong>United States (Delaware, California):</strong> State-specific
                corporate law, securities regulations, and consumer protection laws apply
              </li>
            </ul>

            <p className="text-gray-900">
              Only a qualified attorney licensed in your jurisdiction can provide advice
              tailored to your needs.
            </p>
          </section>

          {/* 4. Your Responsibility */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Your Responsibility
            </h2>
            <p className="text-gray-900 mb-4">
              By using Legmint, you acknowledge and accept full responsibility for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
              <li>
                <strong>Reviewing and customizing templates</strong> to fit your specific
                situation
              </li>
              <li>
                <strong>Verifying legal compliance</strong> with all applicable laws,
                regulations, and industry standards
              </li>
              <li>
                <strong>Ensuring accuracy</strong> of information you input into our platform
              </li>
              <li>
                <strong>Understanding</strong> the legal implications of any document you
                generate or sign
              </li>
              <li>
                <strong>Seeking professional legal review</strong> before relying on or
                executing any document
              </li>
            </ul>

            <p className="text-gray-900">
              Legmint is a tool to help you draft documents more efficiently—it is not a
              replacement for legal expertise. You use Legmint at your own risk.
            </p>
          </section>

          {/* 5. No Warranties */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. No Warranties
            </h2>
            <p className="text-gray-900 mb-4">
              Legmint provides templates and services <strong>"as is"</strong> and{' '}
              <strong>"as available"</strong> without warranties of any kind, express or implied.
            </p>

            <p className="text-gray-900 mb-4">
              <strong>We do NOT warrant that:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
              <li>
                Templates are accurate, complete, current, or error-free
              </li>
              <li>
                Templates are legally sufficient or enforceable in your jurisdiction
              </li>
              <li>
                Templates comply with all applicable laws (laws change frequently and vary by
                location)
              </li>
              <li>
                Using our templates will achieve any particular legal outcome
              </li>
              <li>
                Our platform will be uninterrupted, secure, or free from errors
              </li>
            </ul>

            <p className="text-gray-900">
              See our{' '}
              <Link
                href="/legal/terms"
                className="text-emerald-600 hover:underline font-medium"
              >
                Terms of Service
              </Link>{' '}
              for complete warranty disclaimers and limitations of liability.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-900 mb-4">
              <strong>To the maximum extent permitted by law:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
              <li>
                Legmint is not liable for any damages arising from your use of our platform,
                templates, or services
              </li>
              <li>
                This includes (but is not limited to) damages from legal disputes, contract
                issues, regulatory penalties, lost profits, or business interruptions
              </li>
              <li>
                You assume all risk associated with using documents generated through Legmint
              </li>
            </ul>

            <p className="text-gray-900">
              Some jurisdictions do not allow exclusion of certain warranties or limitations
              of liability. In such cases, our liability is limited to the fullest extent
              permitted by law.
            </p>
          </section>

          {/* 7. Third-Party Lawyers */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Third-Party Lawyers (Referral Marketplace)
            </h2>
            <p className="text-gray-900 mb-4">
              Legmint operates a marketplace connecting users with independent, licensed
              attorneys. These lawyers are NOT employees or agents of Legmint.
            </p>

            <p className="text-gray-900 mb-4">
              <strong>Important:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
              <li>
                Each lawyer is solely responsible for their own professional conduct, advice,
                and services
              </li>
              <li>
                Legmint does not supervise, control, or guarantee the quality of legal
                services provided
              </li>
              <li>
                Legmint is not liable for any acts, errors, or omissions by referred lawyers
              </li>
              <li>
                You are responsible for vetting lawyers and determining if they are suitable
                for your needs
              </li>
            </ul>

            <p className="text-gray-900">
              Disputes about lawyer fees, work quality, or professional conduct must be
              resolved directly with the lawyer or through your jurisdiction's bar association
              or legal ethics body.
            </p>
          </section>

          {/* 8. Jurisdictional Variations */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Jurisdictional Variations
            </h2>
            <p className="text-gray-900 mb-4">
              Legmint provides templates for multiple jurisdictions (UK, Germany, Czech
              Republic, Delaware, California, etc.). However:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
              <li>
                <strong>We cannot guarantee</strong> that templates comply with every local
                law, regulation, or ordinance
              </li>
              <li>
                <strong>Laws change frequently</strong> and our templates may not reflect the
                most recent legal developments
              </li>
              <li>
                <strong>Some documents require local customization,</strong> notarization, or
                witnessing that varies by jurisdiction
              </li>
            </ul>

            <p className="text-gray-900">
              Always verify that documents meet the specific legal requirements of your
              jurisdiction before using them.
            </p>
          </section>

          {/* 9. No Tax, Financial, or Business Advice */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. No Tax, Financial, or Business Advice
            </h2>
            <p className="text-gray-900 mb-4">
              In addition to not providing legal advice, Legmint does NOT provide:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-900 mb-4">
              <li>Tax advice or tax planning services</li>
              <li>Financial advice or investment recommendations</li>
              <li>Business strategy or management consulting</li>
              <li>Accounting or bookkeeping services</li>
            </ul>

            <p className="text-gray-900">
              Consult qualified tax advisors, accountants, financial planners, or business
              consultants for advice in those areas.
            </p>
          </section>

          {/* 10. Updates and Changes */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Updates and Changes
            </h2>
            <p className="text-gray-900 mb-4">
              We may update this disclaimer from time to time to reflect changes in our
              services, legal requirements, or best practices. Material changes will be
              communicated via email or a prominent notice on our platform.
            </p>

            <p className="text-gray-900">
              Your continued use of Legmint after changes take effect constitutes acceptance
              of the updated disclaimer.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Questions About This Disclaimer?
            </h2>
            <p className="text-gray-900 mb-4">
              If you have questions or concerns about this disclaimer, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${LEGAL.contactEmail}`}
                  className="text-emerald-600 hover:underline"
                >
                  {LEGAL.contactEmail}
                </a>
              </p>
              <p className="mb-2">
                <strong>Support:</strong>{' '}
                <a
                  href={`mailto:${LEGAL.supportEmail}`}
                  className="text-emerald-600 hover:underline"
                >
                  {LEGAL.supportEmail}
                </a>
              </p>
              <p>
                <strong>Company:</strong> {LEGAL.companyName}
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
                href="/legal/refund-policy"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Refund Policy
              </Link>
              <Link
                href="/pricing"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
