import type { Metadata } from 'next';
import Link from 'next/link';
import { LEGAL } from '@/config/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy | Legmint',
  description: 'Learn how Legmint collects, uses, and protects your personal data. GDPR-compliant privacy policy covering data rights, security, and international transfers.',
  alternates: {
    canonical: '/legal/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-600 mb-8">
            Last updated: {LEGAL.lastUpdated.privacyPolicy}
          </p>

          {/* Introduction */}
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mb-8">
            <p className="text-lg text-gray-900 font-medium mb-2">
              Your Privacy Matters
            </p>
            <p className="text-gray-900">
              {LEGAL.companyName} ("Legmint," "we," "us") is committed to protecting your
              personal data and respecting your privacy rights. This Privacy Policy explains
              how we collect, use, share, and protect your information when you use our
              platform at legmint.com.
            </p>
          </div>

          {/* GDPR Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              GDPR Compliance
            </p>
            <p className="text-sm text-gray-900">
              If you are located in the European Union or United Kingdom, this policy complies
              with the General Data Protection Regulation (GDPR) and UK GDPR. You have specific
              rights regarding your personal data—see Section 9 for details.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-gray-50 p-6 rounded-lg mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contents</h2>
            <ol className="space-y-2 text-sm">
              <li><a href="#controller" className="text-emerald-600 hover:underline">1. Data Controller</a></li>
              <li><a href="#data-collected" className="text-emerald-600 hover:underline">2. What Data We Collect</a></li>
              <li><a href="#how-we-use" className="text-emerald-600 hover:underline">3. How We Use Your Data</a></li>
              <li><a href="#legal-basis" className="text-emerald-600 hover:underline">4. Legal Basis for Processing (GDPR)</a></li>
              <li><a href="#sharing" className="text-emerald-600 hover:underline">5. Who We Share Data With</a></li>
              <li><a href="#international" className="text-emerald-600 hover:underline">6. International Data Transfers</a></li>
              <li><a href="#retention" className="text-emerald-600 hover:underline">7. How Long We Keep Your Data</a></li>
              <li><a href="#security" className="text-emerald-600 hover:underline">8. Security Measures</a></li>
              <li><a href="#your-rights" className="text-emerald-600 hover:underline">9. Your Privacy Rights</a></li>
              <li><a href="#cookies" className="text-emerald-600 hover:underline">10. Cookies & Tracking</a></li>
              <li><a href="#children" className="text-emerald-600 hover:underline">11. Children's Privacy</a></li>
              <li><a href="#changes" className="text-emerald-600 hover:underline">12. Changes to This Policy</a></li>
              <li><a href="#contact" className="text-emerald-600 hover:underline">13. Contact & Data Protection Officer</a></li>
            </ol>
          </div>

          {/* 1. Data Controller */}
          <section id="controller" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Data Controller
            </h2>
            <p className="mb-4">
              {LEGAL.companyName} is the data controller responsible for your personal data.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>Company Name:</strong> {LEGAL.companyName}
              </p>
              <p className="mb-2">
                <strong>Registered Address:</strong> {LEGAL.registeredAddress}
              </p>
              <p className="mb-2">
                <strong>Contact Email:</strong>{' '}
                <a href={`mailto:${LEGAL.contactEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.contactEmail}
                </a>
              </p>
              <p>
                <strong>Data Protection Officer (DPO):</strong>{' '}
                <a href={`mailto:${LEGAL.dpoEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.dpoEmail}
                </a>
              </p>
            </div>
          </section>

          {/* 2. What Data We Collect */}
          <section id="data-collected" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. What Data We Collect
            </h2>
            <p className="mb-4">
              We collect the following categories of personal data:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Account & Identity Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Name, email address, password (hashed)</li>
              <li>
                Authentication data managed by Clerk (our authentication provider)
              </li>
              <li>Account preferences and settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) Payment & Billing Information
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Billing name, address, and tax information (collected by Stripe, our payment processor)
              </li>
              <li>
                Payment card details (tokenized and stored by Stripe—Legmint never sees your
                full card number)
              </li>
              <li>Transaction history, invoices, and receipts</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Document Generation Data
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Inputs you provide when customizing legal templates (company names, addresses,
                dates, contractual terms, etc.)
              </li>
              <li>
                Generated documents are stored in AWS S3 (encrypted at rest) for your access
                and download
              </li>
              <li>
                We do <strong>not</strong> read or analyze the content of your documents unless
                required for technical support or legal compliance
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              d) Usage & Analytics Data
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                IP address, browser type, device information, operating system
              </li>
              <li>
                Pages visited, time spent on pages, clickstream data
              </li>
              <li>
                Referral source (how you found Legmint)
              </li>
              <li>
                Error logs and performance metrics (to improve service reliability)
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              e) Communications
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Emails, support tickets, and chat messages you send to us
              </li>
              <li>
                Transactional emails (order confirmations, password resets) sent via SendGrid
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              f) Lawyer Referral Data
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Information about consultations booked through our referral marketplace
              </li>
              <li>
                Ratings, reviews, and feedback on lawyers (anonymized where possible)
              </li>
              <li>
                Communication between you and lawyers occurs outside Legmint's systems—we do
                not monitor or store those conversations
              </li>
            </ul>
          </section>

          {/* 3. How We Use Your Data */}
          <section id="how-we-use" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. How We Use Your Data
            </h2>
            <p className="mb-4">We use your personal data to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Provide our services:</strong> Create your account, generate documents,
                process payments, deliver downloads
              </li>
              <li>
                <strong>Communicate with you:</strong> Send order confirmations, support responses,
                service updates, and (with your consent) marketing emails
              </li>
              <li>
                <strong>Improve the platform:</strong> Analyze usage patterns, fix bugs, optimize
                performance, and develop new features
              </li>
              <li>
                <strong>Ensure security:</strong> Detect fraud, prevent abuse, enforce our Terms
                of Service
              </li>
              <li>
                <strong>Comply with legal obligations:</strong> Tax reporting, responding to lawful
                requests from authorities, dispute resolution
              </li>
              <li>
                <strong>Facilitate lawyer referrals:</strong> Connect you with attorneys,
                manage bookings, process referral fees
              </li>
            </ul>
          </section>

          {/* 4. Legal Basis for Processing (GDPR) */}
          <section id="legal-basis" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Legal Basis for Processing (GDPR)
            </h2>
            <p className="mb-4">
              If you are in the EU/UK, we process your data under the following legal bases:
            </p>
            <ul className="list-disc pl-6 space-y-3">
              <li>
                <strong>Contract performance (Art. 6(1)(b) GDPR):</strong> Processing necessary
                to provide services you requested (account creation, document generation, payments)
              </li>
              <li>
                <strong>Legitimate interests (Art. 6(1)(f) GDPR):</strong> Fraud prevention,
                security monitoring, service improvement, anonymized analytics
              </li>
              <li>
                <strong>Legal obligation (Art. 6(1)(c) GDPR):</strong> Tax compliance, responding
                to valid legal requests
              </li>
              <li>
                <strong>Consent (Art. 6(1)(a) GDPR):</strong> Marketing emails, optional cookies
                (you can withdraw consent anytime)
              </li>
            </ul>
          </section>

          {/* 5. Who We Share Data With */}
          <section id="sharing" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Who We Share Data With
            </h2>
            <p className="mb-4">
              We do <strong>not</strong> sell your personal data. We share data only with
              trusted service providers and as required by law:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Service Providers (Data Processors)
            </h3>
            <p className="mb-4">
              These third parties process data on our behalf under strict data processing
              agreements:
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Provider
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Purpose
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left font-semibold">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LEGAL.processors.map((processor, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-4 py-2">{processor.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{processor.purpose}</td>
                      <td className="border border-gray-300 px-4 py-2">{processor.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) Lawyers (Independent Controllers)
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                When you book a consultation via our referral marketplace, we share your contact
                information with the lawyer you select.
              </li>
              <li>
                Lawyers are independent data controllers responsible for how they handle your
                data during consultations.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Legal & Compliance Disclosures
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We may disclose data to comply with court orders, subpoenas, tax authorities,
                or other lawful requests.
              </li>
              <li>
                We may share data to enforce our Terms, protect our rights, or investigate fraud.
              </li>
            </ul>
          </section>

          {/* 6. International Data Transfers */}
          <section id="international" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. International Data Transfers
            </h2>
            <p className="mb-4">
              Legmint operates globally. Your data may be transferred to and processed in
              countries outside the EU/UK, including the United States.
            </p>
            <p className="mb-4">
              <strong>Safeguards:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Standard Contractual Clauses (SCCs):</strong> We use EU-approved SCCs
                with US-based processors (Stripe, Clerk, SendGrid) to ensure GDPR-level protection.
              </li>
              <li>
                <strong>EU/UK hosting:</strong> Where possible, we use EU/UK data centers (e.g.,
                AWS S3 in Frankfurt, Render EU region).
              </li>
              <li>
                <strong>Encryption:</strong> Data in transit is encrypted via TLS; data at rest
                is encrypted in AWS S3.
              </li>
            </ul>
            <p>
              For more information on safeguards, contact our DPO at{' '}
              <a href={`mailto:${LEGAL.dpoEmail}`} className="text-emerald-600 hover:underline">
                {LEGAL.dpoEmail}
              </a>.
            </p>
          </section>

          {/* 7. How Long We Keep Your Data */}
          <section id="retention" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. How Long We Keep Your Data
            </h2>
            <p className="mb-4">We retain personal data only as long as necessary:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account data:</strong> Retained while your account is active, plus 90 days
                after closure (to handle support requests or disputes).
              </li>
              <li>
                <strong>Generated documents:</strong> Stored for the lifetime of your account or
                until you delete them. Deleted documents are permanently removed within 30 days.
              </li>
              <li>
                <strong>Payment records:</strong> Retained for 7 years to comply with tax and
                accounting laws.
              </li>
              <li>
                <strong>Marketing consent:</strong> Retained until you withdraw consent or for
                2 years of inactivity.
              </li>
              <li>
                <strong>Analytics & logs:</strong> Aggregated/anonymized data may be retained
                indefinitely for research and service improvement.
              </li>
            </ul>
          </section>

          {/* 8. Security Measures */}
          <section id="security" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Security Measures
            </h2>
            <p className="mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Encryption:</strong> TLS 1.2+ for data in transit; AES-256 encryption at
                rest for documents in AWS S3.
              </li>
              <li>
                <strong>Access controls:</strong> Role-based access; only authorized personnel
                can access sensitive data.
              </li>
              <li>
                <strong>Authentication:</strong> Passwords are hashed using bcrypt; Clerk manages
                secure authentication flows.
              </li>
              <li>
                <strong>Monitoring:</strong> Automated alerts for suspicious activity; regular
                security audits.
              </li>
              <li>
                <strong>Vendor security:</strong> We vet all third-party processors for SOC 2,
                ISO 27001, or equivalent certifications.
              </li>
            </ul>
            <p className="mt-4">
              <strong>No system is 100% secure.</strong> If you suspect a breach, contact{' '}
              <a href={`mailto:${LEGAL.dpoEmail}`} className="text-emerald-600 hover:underline">
                {LEGAL.dpoEmail}
              </a>{' '}
              immediately.
            </p>
          </section>

          {/* 9. Your Privacy Rights */}
          <section id="your-rights" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Your Privacy Rights
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Rights Under GDPR (EU/UK Users)
            </h3>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Access:</strong> Request a copy of your personal data we hold.
              </li>
              <li>
                <strong>Rectification:</strong> Correct inaccurate or incomplete data.
              </li>
              <li>
                <strong>Erasure ("right to be forgotten"):</strong> Request deletion of your data
                (subject to legal retention requirements).
              </li>
              <li>
                <strong>Restriction:</strong> Limit how we process your data in certain circumstances.
              </li>
              <li>
                <strong>Data portability:</strong> Receive your data in a machine-readable format
                (e.g., JSON, CSV).
              </li>
              <li>
                <strong>Object:</strong> Object to processing based on legitimate interests or
                direct marketing.
              </li>
              <li>
                <strong>Withdraw consent:</strong> Revoke consent for marketing or optional cookies
                at any time.
              </li>
              <li>
                <strong>Lodge a complaint:</strong> File a complaint with your national supervisory
                authority (see Section 9c).
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) Rights Under CCPA (California Users)
            </h3>
            <p className="mb-4">
              If you are a California resident, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Know what personal information we collect and how we use/share it.
              </li>
              <li>
                Request deletion of your personal information.
              </li>
              <li>
                Opt out of the "sale" of personal information (note: we do not sell data).
              </li>
              <li>
                Non-discrimination for exercising your rights.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) How to Exercise Your Rights
            </h3>
            <p className="mb-4">
              To exercise any of these rights, email{' '}
              <a href={`mailto:${LEGAL.dpoEmail}`} className="text-emerald-600 hover:underline">
                {LEGAL.dpoEmail}
              </a>{' '}
              with the subject line "Privacy Rights Request" and include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your account email address</li>
              <li>The right you wish to exercise (e.g., access, deletion)</li>
              <li>Verification information (we may ask for proof of identity)</li>
            </ul>
            <p className="mb-4">
              We will respond within <strong>30 days</strong> (GDPR) or <strong>45 days</strong>{' '}
              (CCPA).
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              d) Supervisory Authorities (EU/UK)
            </h3>
            <p className="mb-4">
              If you are unhappy with how we handle your data, you can lodge a complaint with
              your local data protection authority:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>EU:</strong> Contact your national authority (list at{' '}
                <a
                  href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  edpb.europa.eu
                </a>
                )
              </li>
              <li>
                <strong>UK:</strong> Information Commissioner's Office (ICO) —{' '}
                <a
                  href="https://ico.org.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline"
                >
                  ico.org.uk
                </a>
              </li>
            </ul>
          </section>

          {/* 10. Cookies & Tracking */}
          <section id="cookies" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Cookies & Tracking
            </h2>
            <p className="mb-4">
              Legmint uses minimal cookies and tracking technologies:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              a) Essential Cookies
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Session cookies:</strong> Keep you logged in, remember preferences
                (required for platform functionality).
              </li>
              <li>
                <strong>Security cookies:</strong> Prevent CSRF attacks, verify authentication.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              b) Analytics Cookies (Optional)
            </h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                We may use Google Analytics or similar tools to understand usage patterns
                (anonymized where possible).
              </li>
              <li>
                You can opt out via cookie banner or browser settings.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
              c) Managing Cookies
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Adjust preferences via your browser settings or our cookie consent banner.
              </li>
              <li>
                Disabling essential cookies may prevent you from using core features.
              </li>
            </ul>
          </section>

          {/* 11. Children's Privacy */}
          <section id="children" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Children's Privacy
            </h2>
            <p className="mb-4">
              Legmint is <strong>not intended for individuals under 16 years old</strong> (or
              under 18 in jurisdictions where the age of majority is 18).
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We do not knowingly collect personal data from children.
              </li>
              <li>
                If we learn that we have collected data from a child without parental consent,
                we will delete it promptly.
              </li>
              <li>
                If you believe a child has provided us with data, contact{' '}
                <a href={`mailto:${LEGAL.dpoEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.dpoEmail}
                </a>.
              </li>
            </ul>
          </section>

          {/* 12. Changes to This Policy */}
          <section id="changes" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Changes to This Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                We may update this Privacy Policy to reflect changes in our practices, legal
                requirements, or new features.
              </li>
              <li>
                Material changes will be notified via email or a prominent notice on the Platform
                at least 30 days before they take effect.
              </li>
              <li>
                Continued use after changes constitutes acceptance. If you disagree, please
                close your account.
              </li>
            </ul>
          </section>

          {/* 13. Contact & Data Protection Officer */}
          <section id="contact" className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Contact & Data Protection Officer
            </h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights,
              please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="mb-2">
                <strong>General Inquiries:</strong>{' '}
                <a href={`mailto:${LEGAL.contactEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.contactEmail}
                </a>
              </p>
              <p className="mb-2">
                <strong>Data Protection Officer (DPO):</strong>{' '}
                <a href={`mailto:${LEGAL.dpoEmail}`} className="text-emerald-600 hover:underline">
                  {LEGAL.dpoEmail}
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
                href="/legal/terms"
                className="text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Terms of Service
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
