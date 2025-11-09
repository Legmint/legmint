'use client';

import Link from 'next/link';

export default function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '€0',
      period: '/month',
      description: 'Browse and preview all templates',
      features: [
        'Browse and preview all templates',
        'See jurisdiction coverage',
        'Access template descriptions'
      ],
      cta: 'Start free — no card required',
      href: '/sign-up',
      highlighted: false,
      buttonStyle: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
    },
    {
      name: 'Pro',
      price: '€49',
      period: '/month',
      description: 'Most popular for growing startups',
      features: [
        'Unlimited documents',
        'All 5 jurisdictions',
        'PDF + DOCX downloads',
        'Priority email support',
        'Early access to new templates'
      ],
      cta: 'Start free trial',
      href: '/sign-up',
      highlighted: true,
      buttonStyle: 'bg-emerald-600 text-white hover:bg-emerald-700'
    },
    {
      name: 'Scale',
      price: '€99',
      period: '/month',
      description: 'For teams and high-volume needs',
      features: [
        'Everything in Pro',
        '15% discount on lawyer referrals',
        'Dedicated account manager',
        'Custom template requests'
      ],
      cta: 'Start free trial',
      href: '/sign-up',
      highlighted: false,
      buttonStyle: 'bg-emerald-600 text-white hover:bg-emerald-700'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple pricing. No surprises.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.highlighted
                  ? 'border-4 border-emerald-600 shadow-2xl scale-105'
                  : 'border-2 border-gray-200 shadow-lg'
              } transition-all hover:shadow-2xl`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Recommended
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>

              <div className="mb-4">
                <span className="text-5xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600 ml-1">
                  {plan.period}
                </span>
              </div>

              <p className="text-gray-600 mb-6 text-sm">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all ${plan.buttonStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Cancel anytime. All plans include free updates when we expand to new jurisdictions.
          </p>
        </div>
      </div>
    </div>
  );
}
