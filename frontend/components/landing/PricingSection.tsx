'use client';

import Link from 'next/link';
import { PRICING_CONFIG } from '@/lib/pricing';

export default function PricingSection() {
  const plans = [PRICING_CONFIG.free, PRICING_CONFIG.pro, PRICING_CONFIG.enterprise];

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple pricing. No surprises.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
          {plans.map((plan) => {
            const isEnterprise = plan.id === 'enterprise';
            const isPro = plan.highlighted;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition-all hover:shadow-2xl ${
                  isEnterprise
                    ? 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-400 shadow-lg'
                    : isPro
                    ? 'bg-white border-4 border-emerald-600 shadow-2xl sm:scale-105'
                    : 'bg-white border-2 border-gray-200 shadow-lg'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                {isEnterprise && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Premium
                    </span>
                  </div>
                )}

                <h3 className={`text-2xl font-bold mb-2 ${isEnterprise ? 'text-amber-900' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>

                <div className="mb-4">
                  <span className={`text-5xl font-bold ${
                    isEnterprise
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent'
                      : 'text-gray-900'
                  }`}>
                    {plan.displayPrice}
                  </span>
                  <span className={`ml-1 ${isEnterprise ? 'text-amber-700' : 'text-gray-600'}`}>
                    /{plan.period}
                  </span>
                </div>

                <p className={`mb-6 text-sm ${isEnterprise ? 'text-amber-800' : 'text-gray-600'}`}>
                  {plan.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.slice(0, 5).map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-sm">
                      <span className={`mt-0.5 ${isEnterprise ? 'text-amber-500' : 'text-emerald-600'}`}>✓</span>
                      <span
                        className={isEnterprise ? 'text-amber-900' : 'text-gray-700'}
                        dangerouslySetInnerHTML={{ __html: feature }}
                      />
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className={`text-sm ${isEnterprise ? 'text-amber-700' : 'text-gray-500'}`}>
                      + {plan.features.length - 5} more features
                    </li>
                  )}
                </ul>

                <Link
                  href={plan.ctaHref}
                  className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all ${plan.buttonStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
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
