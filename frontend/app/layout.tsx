'use client';

import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Legmint',
  description: 'AI-powered legal assistant for contracts and compliance',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    console.warn('⚠️ Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  }

  return (
    <html lang="en">
      <body>
        <ClerkProvider publishableKey={publishableKey}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}