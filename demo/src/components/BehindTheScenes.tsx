'use client';

export default function BehindTheScenes() {
  return (
    <section className="mb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          How We Keep Your Documents Current
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Behind every template is a system ensuring you always have the most up-to-date legal protection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card p-8 text-center hover:shadow-lg transition-shadow duration-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full text-4xl mb-4">
            🏛️
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Quarterly Legal Review</h3>
          <p className="text-gray-600 leading-relaxed">
            All templates reviewed by Tier 1 law firms every quarter. When regulations change, we update immediately.
          </p>
          <div className="mt-4 inline-block px-3 py-1 bg-mint-100 text-mint-700 rounded-full text-xs font-semibold">
            Last review: January 2025
          </div>
        </div>

        <div className="card p-8 text-center hover:shadow-lg transition-shadow duration-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full text-4xl mb-4">
            📊
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Battle-Tested by 5,000+ Deals</h3>
          <p className="text-gray-600 leading-relaxed">
            Templates refined based on actual founder usage and feedback from investors who've seen thousands of deals.
          </p>
          <div className="mt-4 inline-block px-3 py-1 bg-mint-100 text-mint-700 rounded-full text-xs font-semibold">
            18,000+ docs generated
          </div>
        </div>

        <div className="card p-8 text-center hover:shadow-lg transition-shadow duration-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full text-4xl mb-4">
            🔄
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Automatic Updates</h3>
          <p className="text-gray-600 leading-relaxed">
            When laws change, your templates update automatically. You always get the latest version — no manual checking required.
          </p>
          <div className="mt-4 inline-block px-3 py-1 bg-mint-100 text-mint-700 rounded-full text-xs font-semibold">
            Always current
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-mint-50 to-blue-50 p-6 rounded-lg border border-mint-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-4xl mr-4">🔒</span>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Your Data is Safe</h4>
              <p className="text-sm text-gray-600">
                All questionnaire data encrypted at rest and in transit. We never share your information.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs text-gray-600">
            <span className="flex items-center"><span className="text-green-600 mr-1">✓</span> SOC 2 Type II Certified</span>
            <span className="flex items-center"><span className="text-green-600 mr-1">✓</span> GDPR Compliant</span>
            <span className="flex items-center"><span className="text-green-600 mr-1">✓</span> 256-bit AES Encryption</span>
          </div>
        </div>
      </div>
    </section>
  );
}
