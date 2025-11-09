'use client';

export default function EnhancedPricing() {
  return (
    <section className="mb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Simple, Founder-Friendly Pricing
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          No hidden fees, no surprises. Just affordable legal protection for your startup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Starter Plan */}
        <div className="card p-8 border-2 border-gray-200 hover:border-mint-400 transition-all duration-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">€99</div>
            <div className="text-sm text-gray-600 mb-1">One-time payment</div>
            <div className="text-xs text-gray-500">
              Average: €12.38 per doc
              <br />
              <span className="line-through">vs €2,500 with lawyers</span>
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>Essential fundraising templates (SAFE, Founders Agreement)</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>3 jurisdictions (UK, US-DE, GLOBAL-EN)</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>Unlimited document generations</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>Email support</span>
            </li>
          </ul>
          <button className="w-full btn-primary">
            Start Free Trial
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">Perfect for pre-seed founders</p>
        </div>

        {/* Pro Plan - Most Popular */}
        <div className="card p-8 border-2 border-mint-400 shadow-xl relative hover:shadow-2xl transition-all duration-200">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-mint-400 text-navy-500 px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </div>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">€49</div>
            <div className="text-sm text-gray-600 mb-1">per month</div>
            <div className="text-xs text-mint-600 font-semibold">
              €79/mo → €49/mo (Save €240/year)
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span><strong>All Starter features</strong></span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>All 50+ templates (employment, IP, SaaS)</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>All 6 jurisdictions</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>Priority email support</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>Quarterly template updates</span>
            </li>
          </ul>
          <button className="w-full bg-mint-400 text-navy-500 hover:bg-mint-300 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200">
            Start 14-Day Free Trial
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">Ideal for growing startups</p>
        </div>

        {/* Scale Plan */}
        <div className="card p-8 border-2 border-gray-200 hover:border-mint-400 transition-all duration-200">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Scale</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">€149</div>
            <div className="text-sm text-gray-600 mb-1">per month</div>
            <div className="text-xs text-gray-500">
              For Series A+ companies
            </div>
          </div>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span><strong>All Pro features</strong></span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>24/7 priority support</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>Custom template requests</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>Dedicated account manager</span>
            </li>
            <li className="flex items-start text-sm">
              <span className="text-mint-400 mr-2 mt-1">✓</span>
              <span>20% discount on lawyer reviews</span>
            </li>
          </ul>
          <button className="w-full btn-primary">
            Contact Sales
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">Enterprise-grade legal ops</p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600 mb-4">Founder-friendly payment options:</p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <span className="flex items-center">💳 Pay later with Klarna</span>
          <span className="flex items-center">🎯 AWS/Google Cloud credits accepted</span>
          <span className="flex items-center">🔒 Secure payment via Stripe</span>
        </div>
      </div>
    </section>
  );
}
