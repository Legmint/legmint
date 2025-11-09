export default function JurisdictionsSection() {
  const jurisdictions = [
    {
      flag: '🇬🇧',
      country: 'UK',
      system: 'Common Law',
      templates: 69,
      highlights: 'Companies Act 2006, GDPR, UK employment law'
    },
    {
      flag: '🇩🇪',
      country: 'Germany',
      system: 'Civil Law',
      templates: 67,
      highlights: 'GmbH formation, HGB, BDSG privacy compliance'
    },
    {
      flag: '🇨🇿',
      country: 'Czech Republic',
      system: 'Civil Law',
      templates: 65,
      highlights: 'Civil Code, GDPR, s.r.o. agreements'
    },
    {
      flag: '🇺🇸',
      country: 'Delaware',
      system: 'Common Law',
      templates: 63,
      highlights: 'DGCL, 83(b) elections, Series Seed docs'
    },
    {
      flag: '🇺🇸',
      country: 'California',
      system: 'Common Law',
      templates: 63,
      highlights: 'CCPA, Cal. Corporations Code, equity plans'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-emerald-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Global coverage. Local expertise.
          </h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto mb-8">
          <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Country</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Legal System</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Templates</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">What&apos;s Included</th>
              </tr>
            </thead>
            <tbody>
              {jurisdictions.map((j, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{j.flag}</span>
                      <span className="font-semibold text-gray-900">{j.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{j.system}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                      {j.templates}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{j.highlights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden grid gap-4 mb-8">
          {jurisdictions.map((j, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{j.flag}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{j.country}</h3>
                    <p className="text-sm text-gray-500">{j.system}</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                  {j.templates}
                </span>
              </div>
              <p className="text-sm text-gray-600">{j.highlights}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700">
            We&apos;re where startups start — from London to Silicon Valley.
          </p>
        </div>
      </div>
    </div>
  );
}
