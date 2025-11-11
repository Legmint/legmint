import Link from 'next/link';

export default function Footer() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Templates', href: '/dashboard' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Jurisdictions', href: '/#jurisdictions' },
        { label: 'How it works', href: '/#how-it-works' }
      ]
    },
    {
      title: 'For Lawyers',
      links: [
        { label: 'Partner program', href: '/lawyers/apply' },
        { label: 'Referral terms', href: '/legal/terms' },
        { label: 'Apply now', href: '/lawyers/apply' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/legal/privacy' },
        { label: 'Terms of Service', href: '/legal/terms' },
        { label: 'Refund Policy', href: '/legal/refund-policy' },
        { label: 'Disclaimer', href: '/legal/disclaimer' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Critical Legal Disclaimer */}
        <div className="mb-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
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
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Important Legal Notice
              </p>
              <p className="text-sm text-gray-700">
                Legmint provides automated document generation and general legal information only.
                It does not constitute legal advice, and no attorney-client relationship is created.
                Always consult a licensed attorney for advice specific to your situation.{' '}
                <Link
                  href="/legal/disclaimer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                >
                  Read full disclaimer
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-emerald-600 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 text-sm">
              © 2025 Legmint. All rights reserved.
            </div>

            {/* Social Links (placeholder - add your actual social media links) */}
            <div className="flex gap-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Twitter
              </a>
              <a
                href="mailto:contact@legmint.com"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
