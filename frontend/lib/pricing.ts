/**
 * Shared Pricing Configuration for Legmint
 * Used by both homepage pricing section and /pricing page
 */

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: 'month' | 'year';
  displayPrice: string;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  highlighted: boolean;
  buttonStyle: string;
  yearlyDiscount?: number; // percentage discount for yearly billing
}

export const PRICING_CONFIG = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: '€',
    period: 'month' as const,
    displayPrice: '€0',
    description: 'Explore and preview templates',
    features: [
      'Browse and preview all templates',
      'Use the interactive form up to preview',
      'No downloads or exports',
      'No finalized generation',
      'Upgrade anytime'
    ],
    cta: 'Browse Templates',
    ctaHref: '/templates',
    highlighted: false,
    buttonStyle: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 99,
    currency: '€',
    period: 'month' as const,
    displayPrice: '€99',
    description: 'Full access for growing startups',
    features: [
      'Full access to all templates across jurisdictions (UK, DE, CZ, US-DE, US-CA)',
      'Unlimited document generation and downloads (PDF/DOCX)',
      'Templates auto-updated with latest laws (GDPR, CCPA, UK Companies Act, etc.)',
      'Multilingual support (EN / DE / CS)',
      'Access to future template categories (funding, HR, IP, data protection)',
      'Lawyer referral integration: direct consultation with verified local attorneys'
    ],
    cta: 'Subscribe to Pro',
    ctaHref: '/pricing',
    highlighted: true,
    buttonStyle: 'bg-emerald-600 text-white hover:bg-emerald-700',
    yearlyDiscount: 15 // 15% discount for yearly billing
  }
} as const;

// Helper to get all plans as array
export const ALL_PLANS = [PRICING_CONFIG.free, PRICING_CONFIG.pro] as const;

// Helper to calculate yearly price with discount
export function getYearlyPrice(monthlyPrice: number, discountPercent: number = 15): number {
  return monthlyPrice * 12 * (1 - discountPercent / 100);
}

// Helper to calculate monthly equivalent of yearly price
export function getYearlyMonthlyEquivalent(monthlyPrice: number, discountPercent: number = 15): number {
  return Math.round(getYearlyPrice(monthlyPrice, discountPercent) / 12);
}

// Helper to calculate yearly savings
export function getYearlySavings(monthlyPrice: number, discountPercent: number = 15): number {
  return monthlyPrice * 12 - getYearlyPrice(monthlyPrice, discountPercent);
}

// Stripe Price IDs (set via environment variables, with production defaults)
export const STRIPE_PRICE_IDS = {
  proMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_1SVHMJQ9KFcDL1QqYwn72e2q',
  proYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || 'price_1SVHMKQ9KFcDL1QqOBUNlZkJ',
} as const;
