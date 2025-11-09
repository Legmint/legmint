import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Legmint - Legal docs, minted for startups | Interactive Templates',
  description: 'Legal docs, minted for startups. Interactive templates for founders to incorporate, raise, hire, and scale. From idea to Series A - fast, affordable, compliant.',
  keywords: 'startup legal documents, founders agreement, SAFE agreement, startup incorporation, legal templates for startups, NDA template, employment contract, convertible note, legmint, legal automation',
  authors: [{ name: 'Legmint' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    shortcut: '/favicon.svg',
    apple: '/logo.svg',
  },
  themeColor: '#4BE1A0',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Legmint - Legal docs, minted for startups',
    description: 'Mint your legal foundation. Interactive templates designed for founders - from incorporation to funding and beyond.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Legmint',
    images: [
      {
        url: '/logo.svg',
        width: 120,
        height: 120,
        alt: 'Legmint Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legmint - Legal docs, minted for startups',
    description: 'Interactive legal templates for founders. Incorporate, raise, hire, and scale with confidence.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Legmint",
    "legalName": "Global Legal Consulting Ltd",
    "url": "https://legmint.com",
    "logo": "https://legmint.com/logo.png",
    "description": "Legal docs, minted for startups. Interactive legal templates for founders to incorporate, raise, hire, and scale.",
    "foundingDate": "2024",
    "slogan": "Mint your legal foundation — from idea to scale",
    "areaServed": ["UK", "US", "Germany", "France", "Spain", "Netherlands"],
    "serviceType": ["Legal Document Automation", "Startup Legal Templates", "Interactive Legal Forms"],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "523"
    }
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Legmint",
    "applicationCategory": "BusinessApplication",
    "description": "Interactive legal template platform designed for startup founders",
    "offers": {
      "@type": "Offer",
      "price": "99",
      "priceCurrency": "EUR",
      "description": "Access to full library of startup legal templates"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "523"
    },
    "featureList": ["Interactive Templates", "Multi-Jurisdiction Support", "Automated Document Generation", "Lawyer-Reviewed Content"]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </head>
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
