import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Legmint - Startup Legal Docs. Ready in Minutes. Valid in Your Jurisdiction.",
  description: "Generate lawyer-grade contracts, terms, and agreements for UK, Germany, Czech Republic, Delaware, and California. Over 70 templates for startups. No legal degree required.",
  keywords: [
    "legal documents",
    "startup templates",
    "SAFE agreement",
    "fundraising documents",
    "SaaS contracts",
    "incorporation documents",
    "UK legal templates",
    "Germany legal documents",
    "Delaware incorporation",
    "California startup law",
    "Czech Republic legal templates",
    "B2B contracts",
    "B2C terms of service",
    "privacy policy generator",
    "NDA template",
    "employment contracts",
    "founders agreement",
    "stock option plan",
    "IP assignment",
    "vesting agreement"
  ],
  authors: [{ name: "Legmint" }],
  creator: "Legmint",
  publisher: "Legmint",
  metadataBase: new URL('https://legmint.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://legmint.com',
    siteName: 'Legmint',
    title: 'Legmint - Startup Legal Docs. Ready in Minutes. Valid in Your Jurisdiction.',
    description: 'Generate lawyer-grade contracts, terms, and agreements for UK, Germany, Czech Republic, Delaware, and California. Over 70 templates for startups.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Legmint - Legal documents for startups',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Legmint - Startup Legal Docs. Ready in Minutes.',
    description: 'Generate lawyer-grade contracts for UK, Germany, Czech Republic, Delaware, and California. 70+ templates.',
    images: ['/og-image.png'],
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
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
