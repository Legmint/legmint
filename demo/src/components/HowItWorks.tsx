'use client';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
  time: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Choose Your Document",
    description: "Select from 50+ startup-specific templates: founders agreements, SAFEs, employment contracts, NDAs, and more.",
    icon: "📋",
    time: "1 min"
  },
  {
    number: 2,
    title: "Answer Smart Questions",
    description: "Our guided questionnaire adapts to your situation. No legal jargon—just clear questions about your startup, equity, jurisdiction.",
    icon: "💬",
    time: "10 min"
  },
  {
    number: 3,
    title: "Review & Download",
    description: "Get your lawyer-reviewed document instantly. Download as PDF or Word. Optional: Connect with startup lawyers for final review.",
    icon: "✅",
    time: "2 min"
  }
];

export default function HowItWorks() {
  return (
    <section className="mb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Get Legal Documents in 15 Minutes
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          From zero to legally operational. No law degree required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-300 to-primary-200 z-0">
                <div className="absolute right-0 top-1/2 transform translate-y-[-50%]">
                  <svg className="w-4 h-4 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            )}

            <div className="relative z-10 text-center">
              {/* Step circle */}
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-4 shadow-lg">
                <div>
                  <div className="text-4xl mb-1">{step.icon}</div>
                  <div className="text-xs font-bold opacity-90">{step.time}</div>
                </div>
              </div>

              {/* Step number badge */}
              <div className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold mb-3">
                Step {step.number}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="card p-8 bg-white border border-gray-200 overflow-x-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Legmint vs. The Old Way
        </h3>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="pb-4 pr-4 text-gray-700 font-semibold"></th>
              <th className="pb-4 px-4 text-center bg-mint-50 font-bold text-mint-700">Legmint</th>
              <th className="pb-4 px-4 text-center text-gray-600">DIY Google Docs</th>
              <th className="pb-4 px-4 text-center text-gray-600">Law Firm</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-4 pr-4 font-medium text-gray-700">Time to complete</td>
              <td className="py-4 px-4 text-center bg-mint-50">
                <span className="text-green-600 font-bold">✅ 15 minutes</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-red-600">❌ 5+ hours</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-red-600">❌ 2-3 weeks</span>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 pr-4 font-medium text-gray-700">Cost</td>
              <td className="py-4 px-4 text-center bg-mint-50">
                <span className="text-green-600 font-bold">✅ €99/unlimited</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-yellow-600">⚠️ €0 (but risky)</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-red-600">❌ €2,000-€5,000</span>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 pr-4 font-medium text-gray-700">Jurisdiction-specific</td>
              <td className="py-4 px-4 text-center bg-mint-50">
                <span className="text-green-600 font-bold">✅ Yes (6 countries)</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-red-600">❌ Generic</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-green-600">✅ Yes</span>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 pr-4 font-medium text-gray-700">Lawyer-reviewed</td>
              <td className="py-4 px-4 text-center bg-mint-50">
                <span className="text-green-600 font-bold">✅ Yes</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-red-600">❌ No</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-green-600">✅ Yes</span>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-4 pr-4 font-medium text-gray-700">Customizable</td>
              <td className="py-4 px-4 text-center bg-mint-50">
                <span className="text-green-600 font-bold">✅ Guided Q&A</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-yellow-600">⚠️ Manual editing</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-green-600">✅ Full custom</span>
              </td>
            </tr>
            <tr>
              <td className="py-4 pr-4 font-medium text-gray-700">Updates when law changes</td>
              <td className="py-4 px-4 text-center bg-mint-50">
                <span className="text-green-600 font-bold">✅ Automatic</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-red-600">❌ Never</span>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="text-yellow-600">⚠️ Pay again</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 text-center">
          <a href="#templates" className="inline-block bg-mint-400 text-navy-500 hover:bg-mint-300 px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200">
            Try Legmint Free →
          </a>
        </div>
      </div>
    </section>
  );
}

