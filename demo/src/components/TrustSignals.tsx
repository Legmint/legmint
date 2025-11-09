'use client';

export default function TrustSignals() {
  return (
    <section className="mb-12">
      <div className="card p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Trusted by Investors, Backed by Legal Experts
          </h3>
          <p className="text-gray-600">
            Our templates are used by VC-backed startups and reviewed by top-tier law firms
          </p>
        </div>

        {/* Compliance Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm text-gray-700">
          <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
            <span className="text-green-600 mr-2 text-xl">✅</span>
            <span className="font-medium">UK Companies Act 2006 Compliant</span>
          </div>
          <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
            <span className="text-green-600 mr-2 text-xl">✅</span>
            <span className="font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
            <span className="text-green-600 mr-2 text-xl">✅</span>
            <span className="font-medium">Delaware DGCL Compliant</span>
          </div>
        </div>

        {/* Law Firm Backing */}
        <div className="bg-gradient-to-r from-mint-50 to-blue-50 p-6 rounded-lg border border-mint-100 mb-8">
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              🏛️ Templates Reviewed By
            </h4>
            <p className="text-sm text-gray-600">Tier 1 law firms specializing in startup law</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-semibold text-gray-900">UK Corporate Law</div>
              <div className="text-sm text-gray-600">Magic Circle Firms</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-semibold text-gray-900">US Securities Law</div>
              <div className="text-sm text-gray-600">Silicon Valley Partners</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="font-semibold text-gray-900">EU GDPR Compliance</div>
              <div className="text-sm text-gray-600">Data Protection Experts</div>
            </div>
          </div>
        </div>

        {/* Investor Trust */}
        <div className="text-center bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-lg font-semibold text-gray-900 mb-3">
            "Documents trusted by 500+ venture-backed startups"
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🚀</span>
              <span>Used by <strong className="text-gray-900">Y Combinator</strong> companies</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">💼</span>
              <span>Accepted by <strong className="text-gray-900">Tier 1 VCs</strong></span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">🌍</span>
              <span>Valid in <strong className="text-gray-900">6 jurisdictions</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
