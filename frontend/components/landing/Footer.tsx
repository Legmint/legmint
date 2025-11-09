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
        { label: 'Refund Policy', href: '/legal/refund-policy' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
