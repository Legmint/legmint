'use client';

import Header from '@/components/Header';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>

          <div className="prose prose-sm max-w-none text-gray-700">
            <p className="text-sm text-gray-500 mb-6">Last Updated: 24 October 2025</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="mb-4">
                Welcome to Legmint. These Terms and Conditions ("Terms", "Terms and Conditions") govern your relationship with the Legmint website and services (the "Service") operated by Global Legal Consulting Ltd ("us", "we", or "our").
              </p>
              <p className="mb-4">
                Please read these Terms and Conditions carefully before using our Service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.
              </p>
              <p className="mb-4">
                By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Company Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="mb-2"><strong>Company Name:</strong> Global Legal Consulting Ltd</p>
                <p className="mb-2"><strong>Company Number:</strong> 16615750</p>
                <p className="mb-2"><strong>Registered Office:</strong> 128 City Road, London, United Kingdom, EC1V 2NX</p>
                <p className="mb-2"><strong>Company Type:</strong> Private Limited Company</p>
                <p className="mb-2"><strong>Incorporated:</strong> 30 July 2025</p>
                <p><strong>Nature of Business:</strong> Activities of patent and copyright agents; other legal activities not elsewhere classified</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Description of Service</h2>
              <p className="mb-4">
                Legmint is an online platform that provides:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Legal document templates for startups and businesses</li>
                <li>Document generation and customization tools</li>
                <li>Access to a network of verified legal professionals</li>
                <li>Educational content and resources related to legal matters</li>
              </ul>
              <p className="mb-4">
                The Service is designed to help users create legal documents for various business purposes including but not limited to founding documents, fundraising agreements, employment contracts, and commercial agreements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Important Legal Disclaimer</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="mb-4 font-semibold text-yellow-900">
                  THIS SERVICE DOES NOT PROVIDE LEGAL ADVICE
                </p>
                <p className="mb-4">
                  Legmint is a document generation platform and does NOT provide legal advice, opinions, or recommendations about your legal rights, remedies, defenses, options, selection of forms, or strategies. The information and documents provided through the Service are general in nature and may not be suitable for your specific situation.
                </p>
                <p className="mb-4">
                  We are not a law firm and do not provide legal services or legal advice. The use of our Service does not create an attorney-client relationship between you and Global Legal Consulting Ltd.
                </p>
                <p>
                  You should always consult with a qualified legal professional before using any document generated through our Service for any legal matter. We strongly recommend that you have any generated documents reviewed by a licensed attorney before execution or use.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. User Accounts and Registration</h2>
              <p className="mb-4">
                To access certain features of the Service, you may be required to create an account. When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
              </p>
              <p className="mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Safeguarding the password that you use to access the Service</li>
                <li>Any activities or actions under your password, whether your password is with our Service or a third-party service</li>
                <li>Notifying us immediately upon becoming aware of any breach of security or unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. User Obligations and Acceptable Use</h2>
              <p className="mb-4">
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to use the Service:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>In any way that violates any applicable national or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
                <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
                <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                <li>To generate documents for illegal purposes or to facilitate illegal activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property Rights</h2>
              <p className="mb-4">
                The Service and its original content (excluding user-generated content and documents), features and functionality are and will remain the exclusive property of Global Legal Consulting Ltd and its licensors. The Service is protected by copyright, trademark, and other laws of the United Kingdom and foreign countries.
              </p>
              <p className="mb-4">
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Global Legal Consulting Ltd.
              </p>
              <p className="mb-4">
                When you generate a document through our Service, you retain ownership of the completed document. However, the underlying templates and generation technology remain our intellectual property.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Subscription and Payment Terms</h2>
              <p className="mb-4">
                Some parts of the Service are billed on a subscription or pay-per-use basis. You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set on a monthly or annual basis, depending on the type of subscription plan you select.
              </p>
              <p className="mb-4">
                At the end of each Billing Cycle, your subscription will automatically renew under the exact same conditions unless you cancel it or Global Legal Consulting Ltd cancels it.
              </p>
              <p className="mb-4">
                All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties.
              </p>
              <p className="mb-4">
                <strong>Refunds:</strong> Certain refund requests may be considered by Global Legal Consulting Ltd on a case-by-case basis and granted at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Attorney Referral Arrangements and Commissions</h2>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="mb-4 font-semibold text-blue-900">
                  IMPORTANT DISCLOSURE: REFERRAL FEE ARRANGEMENTS
                </p>
                <p className="mb-4">
                  Legmint operates an attorney referral service. When you are referred to a legal professional through our platform and subsequently engage their services, Legmint may receive a referral fee or commission from that legal professional.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">9.1 Financial Relationship Disclosure</h3>
              <p className="mb-4">
                <strong>Commission Structure:</strong> When you engage a legal professional referred through our platform, that professional may pay Legmint a referral fee typically ranging from 10% to 15% of the fees paid by you to that professional. This referral fee is paid by the legal professional, not by you as an additional charge.
              </p>
              <p className="mb-4">
                <strong>No Additional Cost to You:</strong> The referral fee does not increase the amount you pay for legal services. Any discounts offered through our platform (such as discount tokens) are provided by the legal professional and reduce the amount you pay.
              </p>
              <p className="mb-4">
                <strong>Professional Independence:</strong> While we receive compensation for referrals, all legal professionals in our network are independent practitioners who owe their professional duties to you as their client, not to Legmint. Your attorney-client relationship is solely with the legal professional you engage, and that professional's ethical obligations to you are not affected by any referral arrangement with Legmint.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">9.2 How We Match Legal Professionals</h3>
              <p className="mb-4">
                Legal professionals are matched to users based on the following criteria:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Jurisdiction:</strong> We match professionals licensed to practice in the relevant jurisdiction for your legal matter</li>
                <li><strong>Practice Area:</strong> We match professionals whose specializations align with your legal needs (e.g., fundraising, corporate law, SaaS agreements)</li>
                <li><strong>Ratings and Reviews:</strong> Professionals are ranked by client ratings and review scores</li>
                <li><strong>Availability:</strong> We prioritize professionals who are currently accepting new clients</li>
              </ul>
              <p className="mb-4">
                <strong>Important:</strong> The amount of referral fee paid to Legmint does NOT influence the matching or ranking of legal professionals. All professionals in the same tier pay the same referral fee percentage, and matching is based solely on the criteria listed above.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">9.3 Verification and Vetting</h3>
              <p className="mb-4">
                All legal professionals in our network are verified to be licensed and in good standing with their respective bar associations or regulatory bodies. However, Legmint does not:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Guarantee the quality or outcome of any legal services provided</li>
                <li>Supervise or control the professional conduct of referred legal professionals</li>
                <li>Accept liability for any acts, omissions, or professional negligence of referred legal professionals</li>
                <li>Provide legal advice or recommendations about which professional to engage</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">9.4 Third-Party Relationships</h3>
              <p className="mb-4">
                Our Service may contain links to third-party websites or services that are not owned or controlled by Global Legal Consulting Ltd, including connections to legal professionals and law firms.
              </p>
              <p className="mb-4">
                Global Legal Consulting Ltd has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites, services, or legal professionals. We do not warrant the offerings of any of these entities/individuals or their websites.
              </p>
              <p className="mb-4">
                When you engage with a legal professional through our platform, you enter into a separate and independent attorney-client relationship with that professional. Any such engagement is governed by the terms agreed upon between you and that professional, not by these Terms. You are solely responsible for reviewing and agreeing to that professional's engagement terms, fee structure, and service agreement.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">9.5 Your Rights and Choices</h3>
              <p className="mb-4">
                You are under no obligation to engage any legal professional referred through our platform. You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Seek legal services from any legal professional of your choosing, including those not in our network</li>
                <li>Obtain multiple consultations before selecting a legal professional</li>
                <li>Negotiate fees and terms directly with any legal professional</li>
                <li>Decline to use the referral service and use only our document generation features</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">9.6 Complaints and Regulatory Information</h3>
              <p className="mb-4">
                If you have concerns about a legal professional's conduct, you should contact the relevant regulatory authority:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>UK:</strong> Solicitors Regulation Authority (SRA) - www.sra.org.uk</li>
                <li><strong>US:</strong> The state bar association where the attorney is licensed</li>
                <li><strong>Germany:</strong> Local Bar Association (Rechtsanwaltskammer)</li>
                <li><strong>Other jurisdictions:</strong> The applicable bar association or legal regulatory body</li>
              </ul>
              <p className="mb-4">
                For questions about our referral arrangements or commission structure, please contact us at the address provided in Section 18 below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL GLOBAL LEGAL CONSULTING LTD, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Your access to or use of or inability to access or use the Service</li>
                  <li>Any conduct or content of any third party on the Service</li>
                  <li>Any content obtained from the Service</li>
                  <li>Unauthorized access, use or alteration of your transmissions or content</li>
                  <li>Use of any documents generated through the Service</li>
                  <li>Any legal consequences arising from the use of generated documents</li>
                </ul>
                <p>
                  WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
              </div>
              <p className="mb-4">
                Nothing in these Terms shall exclude or limit liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or any other liability which cannot be excluded or limited under applicable law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="mb-4">
                You agree to defend, indemnify and hold harmless Global Legal Consulting Ltd and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your use and access of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third party right, including without limitation any copyright, property, or privacy right</li>
                <li>Your use of any documents generated through the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Privacy and Data Protection</h2>
              <p className="mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you agree to the collection and use of information in accordance with our Privacy Policy.
              </p>
              <p className="mb-4">
                We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. For more information about how we handle your data, please review our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="mb-4">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.
              </p>
              <p className="mb-4">
                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Governing Law and Jurisdiction</h2>
              <p className="mb-4">
                These Terms shall be governed and construed in accordance with the laws of England and Wales, without regard to its conflict of law provisions.
              </p>
              <p className="mb-4">
                Any dispute arising out of or in connection with these Terms, including any question regarding their existence, validity or termination, shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
              <p className="mb-4">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">15. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="mb-4">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">16. Severability</h2>
              <p className="mb-4">
                If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">17. Entire Agreement</h2>
              <p className="mb-4">
                These Terms constitute the entire agreement between you and Global Legal Consulting Ltd regarding the use of the Service, and supersede all prior and contemporaneous written or oral agreements between you and Global Legal Consulting Ltd.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">18. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><strong>Global Legal Consulting Ltd</strong></p>
                <p className="mb-2">128 City Road</p>
                <p className="mb-2">London, EC1V 2NX</p>
                <p className="mb-2">United Kingdom</p>
                <p className="mb-2">Company Number: 16615750</p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500 text-center">
                By using Legmint, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">⚖️</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Legmint</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Professional legal document generation platform
            </p>
            <div className="text-xs text-gray-500">
              <p>
                © 2025 Global Legal Consulting Ltd. All rights reserved. Company Number: 16615750
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
