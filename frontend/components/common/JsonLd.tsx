/**
 * JSON-LD Structured Data Component
 * Helps search engines understand page content
 */

interface JsonLdProps {
  data: object;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Schema generators for common page types

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Legmint',
  url: 'https://legmint.com',
  logo: 'https://legmint.com/logo.png',
  description:
    'AI-powered legal document automation platform for startups across UK, EU, and US',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'contact@legmint.com',
    contactType: 'Customer Service',
  },
  sameAs: [
    'https://linkedin.com/company/legmint',
    'https://twitter.com/legmint',
  ],
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Legmint',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '99',
    priceCurrency: 'EUR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '99',
      priceCurrency: 'EUR',
      unitText: 'MONTH',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
  },
};

export const legalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'Legmint',
  description:
    'Automated legal document generation and lawyer referral platform',
  url: 'https://legmint.com',
  areaServed: [
    {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    {
      '@type': 'Country',
      name: 'Germany',
    },
    {
      '@type': 'Country',
      name: 'Czech Republic',
    },
    {
      '@type': 'Country',
      name: 'United States',
    },
  ],
};

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});
