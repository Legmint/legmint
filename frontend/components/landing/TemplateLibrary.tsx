'use client';

import Link from 'next/link';

export default function TemplateLibrary() {
  const categories = [
    {
      icon: '🚀',
      title: 'Startup',
      templates: 'Founders\' agreements • Share vesting schedules • IP assignment • Board resolutions • Stock option plans'
    },
    {
      icon: '🤝',
      title: 'B2B',
      templates: 'SaaS MSA • Master service agreements • NDAs • Consulting contracts • Reseller agreements'
    },
    {
      icon: '👤',
      title: 'B2C',
      templates: 'Website terms of service • Privacy policy • Cookie policy • Refund & cancellation • SaaS subscription terms'
    },
    {
      icon: '🔗',
      title: 'P2P',
      templates: 'Collaboration agreements • Influencer contracts • Partnership MOUs • Joint venture terms'
    }
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Over 70 templates. Ready to customize.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every document is built by lawyers, localized for your jurisdiction, and designed for early-stage companies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-emerald-50 border-2 border-emerald-100 p-8 rounded-2xl hover:border-emerald-600 hover:shadow-xl transition-all group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {category.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {category.templates}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            Browse all templates →
          </Link>
        </div>
      </div>
    </div>
  );
}
