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
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 3500,
    currency: '€',
    period: 'month' as const,
    displayPrice: '€3,500',
    description: 'For scaling companies with dedicated legal needs',
    features: [
      'Everything in Pro, plus:',
      '<strong>24/7 Priority Support</strong> – dedicated account manager & instant response',
      '<strong>10 hours/month</strong> of legal consultation with specialist attorneys',
      'Custom template development tailored to your business',
      'Multi-user team access with role-based permissions',
      'API access for workflow automation',
      'Dedicated onboarding & training sessions',
      'SLA-backed uptime guarantee (99.9%)',
      'Custom contract review & negotiation support'
    ],
    cta: 'Reach out to onboard your enterprise',
    ctaHref: '/pricing',
    highlighted: false,
    buttonStyle: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600',
    yearlyDiscount: 5 // 5% discount for yearly billing
  },
  enterpriseUltra: {
    id: 'enterprise-ultra',
    name: 'Enterprise Ultra',
    price: 6500,
    currency: '€',
    period: 'month' as const,
    displayPrice: '€6,500',
    description: 'Maximum legal protection for fast-growing enterprises',
    features: [
      'Everything in Enterprise, plus:',
      '<strong>Unlimited Legal Consultation</strong> – on-demand access to specialist attorneys',
      '<strong>White-label Solution</strong> – fully branded legal portal for your company',
      '<strong>Priority Template Development</strong> – custom templates built within 48 hours',
      'Dedicated legal team assigned to your account',
      'Advanced compliance monitoring & alerts (GDPR, CCPA, etc.)',
      'Multi-jurisdiction expansion support (new regions on request)',
      'Executive quarterly business reviews with legal strategy planning',
      'Direct integration with your legal & HR systems',
      '<strong>99.99% SLA</strong> with guaranteed response times',
      'Exclusive access to beta features and new jurisdictions'
    ],
    cta: 'Contact Sales',
    ctaHref: '/pricing',
    highlighted: false,
    buttonStyle: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700',
    yearlyDiscount: 8 // 8% discount for yearly billing
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
// Production (live) prices created in Stripe account 51SR6Xz
export const STRIPE_PRICE_IDS = {
  proMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || 'price_1Sht4vQ5A3vEghA1mOf7qhZA',
  proYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY || 'price_1Sht4wQ5A3vEghA1vQh8ARFq',
  enterpriseMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_1ShtPPQ5A3vEghA1zzIejV55',
  enterpriseYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_1ShtmwQ5A3vEghA1tvPciQDA',
  enterpriseUltraMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ULTRA_MONTHLY || 'price_1SjMCHQ5A3vEghA15zthuMtF',
  enterpriseUltraYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ULTRA_YEARLY || 'price_1SjMCHQ5A3vEghA1Ogf0faie',
} as const;
