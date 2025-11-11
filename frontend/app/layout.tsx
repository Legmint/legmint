import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Legmint | AI Legal Templates for Startups',
    template: '%s | Legmint',
  },
  description:
    'Generate compliant startup contracts instantly across UK, EU, and US jurisdictions. AI-powered legal document automation for founders.',
  keywords: [
    'legal templates',
    'startup contracts',
    'UK legal documents',
    'GDPR compliance',
    'company formation',
    'NDA',
    'employment contracts',
  ],
  authors: [{ name: 'Legmint' }],
  creator: 'Legmint',
  publisher: 'Legmint',
  metadataBase: new URL('https://legmint.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://legmint.com',
    title: 'Legmint | AI Legal Templates for Startups',
    description:
      'Generate compliant startup contracts instantly across UK, EU, and US jurisdictions.',
    siteName: 'Legmint',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legmint | AI Legal Templates for Startups',
    description:
      'Generate compliant startup contracts instantly across UK, EU, and US jurisdictions.',
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
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}