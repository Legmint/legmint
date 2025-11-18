import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Terms for Lawyers | Legmint',
  description: 'Terms and conditions for lawyers participating in the Legmint Lawyer Partner Program.',
  alternates: {
    canonical: '/legal/terms-lawyers',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsForLawyersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/lawyers/apply"
            className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-2"
          >
            ← Back to Application
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-emerald max-w-none text-gray-900">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legmint Lawyer Partner Program Terms
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Last updated: January 2025
          </p>

          {/* Critical Notice */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Important Notice: Independent Contractor Relationship
            </p>
            <p className="text-sm text-gray-900">
              This agreement establishes an independent contractor relationship. You are not an employee,
              agent, or representative of Legmint. All legal services are provided directly by you to clients,
              and you maintain full professional responsibility for your work.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 p-6 rounded-lg mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contents</h2>
            <ol className="space-y-2 text-sm grid grid-cols-2 gap-x-4">
              <li><a href="#introduction" className="text-emerald-600 hover:underline">1. Introduction</a></li>
              <li><a href="#definitions" className="text-emerald-600 hover:underline">2. Definitions</a></li>
              <li><a href="#relationship" className="text-emerald-600 hover:underline">3. Nature of Relationship</a></li>
              <li><a href="#eligibility" className="text-emerald-600 hover:underline">4. Eligibility and Application</a></li>
              <li><a href="#fees" className="text-emerald-600 hover:underline">5. Platform Fees and Payment</a></li>
              <li><a href="#referrals" className="text-emerald-600 hover:underline">6. Referral System</a></li>
              <li><a href="#responsibilities" className="text-emerald-600 hover:underline">7. Your Responsibilities</a></li>
              <li><a href="#compliance" className="text-emerald-600 hover:underline">8. Compliance</a></li>
              <li><a href="#legmint-role" className="text-emerald-600 hover:underline">9. Legmint's Role</a></li>
              <li><a href="#reviews" className="text-emerald-600 hover:underline">10. Reviews and Ratings</a></li>
              <li><a href="#ip" className="text-emerald-600 hover:underline">11. Intellectual Property</a></li>
              <li><a href="#termination" className="text-emerald-600 hover:underline">12. Termination</a></li>
              <li><a href="#confidentiality" className="text-emerald-600 hover:underline">13. Confidentiality</a></li>
              <li><a href="#liability" className="text-emerald-600 hover:underline">14. Liability</a></li>
              <li><a href="#disputes" className="text-emerald-600 hover:underline">15. Dispute Resolution</a></li>
              <li><a href="#miscellaneous" className="text-emerald-600 hover:underline">16. Miscellaneous</a></li>
            </ol>
          </div>

          {/* 1. Introduction */}
          <section id="introduction" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="mb-4">
              These Terms for Lawyers govern your participation in the Legmint Lawyer Partner Program.
              By applying to become a partner lawyer or accepting referrals through the Legmint platform,
              you agree to be bound by these Terms.
            </p>
          </section>

          {/* 2. Definitions */}
          <section id="definitions" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Definitions
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>"Legmint," "we," "us," "our"</strong> refers to {LEGAL.companyName},
                trading as {LEGAL.tradingName}, a company registered in England and Wales
                (Company Number: {LEGAL.companyNumber}), the operator of the Platform.
              </li>
              <li>
                <strong>"Lawyer," "you," "your"</strong> refers to the attorney, solicitor, or
                legal professional participating in the Program.
              </li>
              <li>
                <strong>"Client" or "User"</strong> refers to individuals or entities who use
                the Platform and may request legal services.
              </li>
              <li>
                <strong>"Referral"</strong> means a connection facilitated by the Platform
                between a User and a Lawyer for potential legal services.
              </li>
              <li>
                <strong>"Platform Fee"</strong> means the service fee retained by Legmint
                from each completed transaction.
              </li>
            </ul>
          </section>

          {/* 3. Nature of Relationship */}
          <section id="relationship" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. Nature of Relationship
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Independent Professional Relationship
            </h3>
            <p className="mb-4">
              You are an independent legal professional. Nothing in these Terms creates an
              employment, partnership, joint venture, or agency relationship between you and
              Legmint. You:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Are solely responsible for your own professional conduct</li>
              <li>Maintain complete control over how you provide Legal Services</li>
              <li>Are responsible for your own taxes, insurance, and professional licensing</li>
              <li>May decline any Referral at your discretion</li>
              <li>May set your own rates (subject to Platform minimum/maximum guidelines)</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Critical Disclosure: Legmint is Not a Law Firm
              </p>
              <p className="text-sm text-gray-900">
                Legmint is a software and marketing services platform. Legmint does not provide
                legal advice or legal services, practice law, exercise control over your professional
                judgment, or assume any responsibility for the quality or outcome of your Legal Services.
                All Legal Services are provided by you directly to Clients under your own professional
                responsibility.
              </p>
            </div>
          </section>

          {/* 4. Eligibility */}
          <section id="eligibility" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Eligibility and Application
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Qualification Requirements
            </h3>
            <p className="mb-4">To participate in the Program, you must:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Hold an active license to practice law in at least one jurisdiction where you offer services</li>
              <li>Maintain good standing with all relevant bar associations or regulatory bodies</li>
              <li>Carry adequate professional liability insurance</li>
              <li>Comply with all applicable laws, ethical rules, and professional conduct standards</li>
              <li>Complete Legmint's verification process</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Ongoing Obligations
            </h3>
            <p className="mb-4">You must promptly notify Legmint of:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Any change in your license status</li>
              <li>Disciplinary actions or ethical complaints</li>
              <li>Changes to your professional liability insurance</li>
              <li>Any other material change affecting your eligibility</li>
            </ul>
          </section>

          {/* 5. Platform Fees */}
          <section id="fees" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Platform Fees and Payment Structure
            </h2>

            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mb-6">
              <h3 className="font-semibold text-lg mb-3">Platform Service Fee</h3>
              <p className="mb-4">
                Legmint charges a Platform Service Fee for connecting you with Clients and providing
                infrastructure services:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Fixed Referral Fee:</strong> €30 per initial document review referral</li>
                <li><strong>Ongoing Work Fee:</strong> 15% of the gross amount paid by the Client for any additional legal work</li>
                <li><strong>Calculation:</strong> Fee is calculated on the total payment before any taxes or expenses</li>
                <li><strong>Deduction:</strong> Fee is automatically deducted via Stripe Connect before funds are transferred to your account</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Examples
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">Initial Document Review:</p>
              <ul className="list-none space-y-1 text-sm">
                <li>• Client pays: €250 for initial review</li>
                <li>• Platform Fee (fixed): €30</li>
                <li>• <strong>Your payment: €220</strong></li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-semibold mb-2">Additional Legal Work:</p>
              <ul className="list-none space-y-1 text-sm">
                <li>• Client pays: €1,000 for follow-on services</li>
                <li>• Platform Fee (15%): €150</li>
                <li>• <strong>Your payment: €850</strong></li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Payment Processing
            </h3>
            <p className="mb-4">All payments are processed through Stripe Connect:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Client pays Legmint via Stripe Checkout</li>
              <li>Platform Fee is automatically deducted</li>
              <li>Remaining amount is transferred to your Stripe Connect account</li>
              <li>Stripe handles all payout schedules (typically 2-7 business days)</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-500 p-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Prohibited: No Direct Payments
              </p>
              <p className="text-sm text-gray-900">
                You may not request or accept payment directly from Clients referred through the Platform
                or bypass the Platform payment system. Violation of this provision may result in immediate
                termination and liability for all fees due.
              </p>
            </div>
          </section>

          {/* 6. Referral System */}
          <section id="referrals" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Referral System and Matching
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              How Referrals Work
            </h3>
            <p className="mb-4">When a User requests legal assistance:</p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li>Platform matches Users with Lawyers based on jurisdiction, area of specialization, language requirements, availability, and User preferences (not commission amounts)</li>
              <li>You receive a notification with Client's document/matter details, jurisdiction, and proposed engagement terms</li>
              <li>You may accept or decline within <strong>2 working days</strong></li>
            </ol>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                No Guarantee of Referrals
              </p>
              <p className="text-sm text-gray-900">
                Legmint makes no guarantee regarding the number of Referrals you will receive,
                the quality or suitability of potential Clients, or the completion of engagements
                after referral.
              </p>
            </div>
          </section>

          {/* 7. Your Responsibilities */}
          <section id="responsibilities" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Your Responsibilities as a Lawyer
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Professional Conduct
            </h3>
            <p className="mb-4">You must:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Comply with all applicable rules of professional conduct and ethics</li>
              <li>Maintain attorney-client confidentiality</li>
              <li>Avoid conflicts of interest</li>
              <li>Provide competent representation</li>
              <li>Communicate promptly and professionally with Clients</li>
              <li>Follow all licensing requirements in jurisdictions where you practice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Scope of Engagement
            </h3>
            <p className="mb-4">For each engagement, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Clearly define the scope of services with the Client</li>
              <li>Provide a written engagement agreement (if required by your jurisdiction)</li>
              <li>Establish an attorney-client relationship directly with the Client</li>
              <li>Maintain professional independence in all legal matters</li>
            </ul>
          </section>

          {/* 8. Compliance */}
          <section id="compliance" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Compliance and Regulatory Requirements
            </h2>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-2 uppercase">
                Critical: Your Compliance Obligation
              </p>
              <p className="text-sm text-gray-900 mb-3">
                Attorney referral fee rules vary by jurisdiction. Some jurisdictions prohibit or
                limit referral fees. You are responsible for ensuring compliance with your jurisdiction's
                rules.
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                You must verify that participation complies with your bar association's rules,
                obtain any required approvals or registrations, and notify Legmint if your jurisdiction
                prohibits the Platform Fee structure.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Insurance and Liability
            </h3>
            <p className="mb-4">You must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain professional liability insurance at all times</li>
              <li>Provide proof of coverage upon request</li>
              <li>Notify Legmint immediately of any claims or coverage lapses</li>
              <li>Assume full liability for your professional services</li>
            </ul>
          </section>

          {/* 9. Legmint's Role */}
          <section id="legmint-role" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Legmint's Role and Limitations
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Platform Services
            </h3>
            <p className="mb-4">Legmint provides:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Technology platform for client-lawyer connections</li>
              <li>Payment processing infrastructure</li>
              <li>Marketing and lead generation services</li>
              <li>Compliance monitoring tools</li>
              <li>Data security and privacy protections</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              What Legmint Does NOT Do
            </h3>
            <p className="mb-4">Legmint does not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Supervise or control your legal work</li>
              <li>Provide legal advice or services</li>
              <li>Guarantee client satisfaction or outcomes</li>
              <li>Assume liability for your professional conduct</li>
              <li>Create attorney-client relationships</li>
              <li>Practice law or regulate legal services</li>
            </ul>
          </section>

          {/* 10. Reviews */}
          <section id="reviews" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. User Reviews and Ratings
            </h2>
            <p className="mb-4">
              Clients may rate and review your services. Reviews are the Client's opinion.
              Legmint may display reviews publicly, and you may respond to reviews professionally.
            </p>
            <p className="mb-4"><strong>Prohibited Actions:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Solicit fake or incentivized reviews</li>
              <li>Retaliate against Clients for negative reviews</li>
              <li>Post false or misleading reviews of yourself</li>
              <li>Attempt to manipulate ratings</li>
            </ul>
          </section>

          {/* 11. Intellectual Property */}
          <section id="ip" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Intellectual Property and Data
            </h2>
            <p className="mb-4">
              Legmint owns all rights to the Platform and its technology, trademarks, logos,
              branding, aggregate data and analytics, and Platform-generated content.
            </p>
            <p className="mb-4">
              We grant you a limited, non-exclusive, non-transferable license to access the
              Platform for Program participation and use Legmint branding for approved marketing
              purposes.
            </p>
            <p className="mb-4"><strong>You may not:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reverse engineer or copy the Platform</li>
              <li>Use Platform data for competing services</li>
              <li>Misrepresent your relationship with Legmint</li>
              <li>Use Legmint branding without authorization</li>
            </ul>
          </section>

          {/* 12. Termination */}
          <section id="termination" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Term and Termination
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Termination by You
            </h3>
            <p className="mb-4">You may terminate participation by:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Providing 30 days written notice</li>
              <li>Completing all pending engagements</li>
              <li>Returning Platform materials</li>
              <li>Disconnecting Stripe account</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Termination by Legmint
            </h3>
            <p className="mb-4">We may terminate or suspend your participation:</p>
            <p className="mb-2"><strong>Immediately for cause:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>License suspension or revocation</li>
              <li>Professional misconduct</li>
              <li>Breach of these Terms</li>
              <li>Fraud or misrepresentation</li>
              <li>Violation of payment terms</li>
            </ul>
            <p className="mb-2"><strong>With notice (30 days):</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Strategic business reasons</li>
              <li>Insufficient engagement activity</li>
              <li>Platform changes or discontinuation</li>
            </ul>
          </section>

          {/* 13. Confidentiality */}
          <section id="confidentiality" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Confidentiality and Data Protection
            </h2>
            <p className="mb-4">You agree to keep confidential:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Platform algorithms and matching logic</li>
              <li>Fee structures and business models</li>
              <li>Aggregate data about other lawyers or clients</li>
              <li>Non-public platform features</li>
            </ul>
            <p className="mb-4">You must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Comply with GDPR, CCPA, and applicable privacy laws</li>
              <li>Process Client data only for authorized purposes</li>
              <li>Implement appropriate security measures</li>
              <li>Report data breaches promptly</li>
            </ul>
          </section>

          {/* 14. Liability */}
          <section id="liability" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Limitation of Liability and Indemnification
            </h2>

            <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-2 uppercase">
                Disclaimers
              </p>
              <p className="text-sm text-gray-900">
                Legmint provides the Platform "AS IS" and "AS AVAILABLE" without warranties of
                any kind. Legmint's total liability to you is limited to the Platform Fees paid
                to you in the prior 12 months.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Your Indemnification
            </h3>
            <p className="mb-4">You agree to indemnify and hold harmless Legmint from:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Professional malpractice claims arising from your services</li>
              <li>Violations of professional conduct rules</li>
              <li>Breach of these Terms</li>
              <li>Third-party claims related to your services</li>
              <li>Misuse of the Platform or Client data</li>
            </ul>
          </section>

          {/* 15. Dispute Resolution */}
          <section id="disputes" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Dispute Resolution
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Governing Law
            </h3>
            <p className="mb-6">
              These Terms are governed by the laws of <strong>England and Wales</strong>.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Arbitration
            </h3>
            <p className="mb-4">
              Disputes will be resolved through binding arbitration in London, United Kingdom
              under the Arbitration Act 1996, except:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Claims related to professional conduct (subject to bar jurisdiction)</li>
              <li>Intellectual property disputes</li>
              <li>Small claims court matters (under applicable threshold)</li>
            </ul>
          </section>

          {/* 16. Miscellaneous */}
          <section id="miscellaneous" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              16. Miscellaneous
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Amendments
            </h3>
            <p className="mb-6">
              Legmint may update these Terms by providing 30 days notice, posting updated Terms
              on the Platform, and obtaining your acknowledgment for material changes. Continued
              participation constitutes acceptance.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Assignment
            </h3>
            <p className="mb-6">
              You may not assign these Terms. Legmint may assign to affiliates or in connection
              with a merger or sale.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              Notice
            </h3>
            <p className="mb-4">Notices must be sent to:</p>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-2">To Legmint:</p>
              <p className="text-sm">Email: {LEGAL.contactEmail}</p>
              <p className="text-sm">Address: {LEGAL.registeredAddress}</p>
            </div>
            <p className="text-sm text-gray-600">
              To You: Email address on file in your Partner account
            </p>
          </section>

          {/* Contact Information */}
          <section className="mb-10 mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Questions or Concerns?
            </h2>
            <p className="mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Email:</strong>{' '}
                <a href={`mailto:${LEGAL.contactEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.contactEmail}
                </a>
              </p>
              <p className="mb-2">
                <strong>Phone:</strong>{' '}
                <span className="text-gray-900">{LEGAL.phone}</span>
              </p>
              <p className="mb-2">
                <strong>Company:</strong> {LEGAL.companyName}, trading as {LEGAL.tradingName}
              </p>
              <p>
                <strong>Address:</strong> {LEGAL.registeredAddress}
              </p>
            </div>
          </section>

          {/* Version Info */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-10">
            <p className="text-sm text-gray-900 mb-2">
              <strong>Version:</strong> 1.0
            </p>
            <p className="text-sm text-gray-900 mb-4">
              <strong>Last Updated:</strong> January 2025
            </p>
            <p className="text-sm text-gray-700">
              <strong>Important Legal Notice:</strong> These Terms are designed for informational
              purposes and comply with common legal standards. However, professional referral fee
              regulations vary significantly by jurisdiction. You are responsible for ensuring
              compliance with your specific bar association rules before participating in the Program.
            </p>
          </div>

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
                Terms of Service (Users)
              </Link>
              <Link
                href="/legal/privacy"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/lawyers/apply"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Apply as Partner Lawyer
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
