'use client';

export default function CostOfMistakes() {
  return (
    <section className="mb-12 -mt-4">
      <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-8 shadow-sm">
        <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center">
          <span className="text-3xl mr-3">⚠️</span>
          The Real Cost of DIY Legal Docs
        </h3>
        <p className="text-gray-700 mb-6 text-lg">
          23% of startups fail due to co-founder legal disputes. Don't let your startup become a statistic.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-red-600 mb-2">€50K-€500K</div>
            <p className="text-sm text-gray-700 font-medium">Average cost of founder equity disputes</p>
            <p className="text-xs text-gray-500 mt-2">Source: European Startup Monitor 2024</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-red-600 mb-2">18 months</div>
            <p className="text-sm text-gray-700 font-medium">Average time wasted in legal battles</p>
            <p className="text-xs text-gray-500 mt-2">Time you could spend building your product</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-4xl font-bold text-red-600 mb-2">23%</div>
            <p className="text-sm text-gray-700 font-medium">Startups that fail due to co-founder legal issues</p>
            <p className="text-xs text-gray-500 mt-2">CB Insights: Top 20 reasons startups fail</p>
          </div>
        </div>
        <div className="mt-6 bg-white p-4 rounded-lg border-l-4 border-mint-400">
          <p className="text-sm text-gray-700">
            <strong className="text-mint-600">The solution:</strong> Lawyer-reviewed templates that cost €99 instead of €5,000 and take 15 minutes instead of 3 weeks.
            Same legal protection, fraction of the cost.
          </p>
        </div>
      </div>
    </section>
  );
}
