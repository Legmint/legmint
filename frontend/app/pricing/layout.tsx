// frontend/app/pricing/layout.tsx
import type { ReactNode } from 'react';

// Force dynamic rendering + no cache for everything under /pricing
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}