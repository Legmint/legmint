export default function HowItWorks() {
  const steps = [
    {
      icon: '🔍',
      title: 'Pick your document',
      description: 'Browse 70+ templates across Startup, B2B, B2C, and P2P categories.'
    },
    {
      icon: '✍️',
      title: 'Fill in your details',
      description: 'Answer simple questions. Our engine handles the legal language.'
    },
    {
      icon: '⬇️',
      title: 'Get your document instantly',
      description: 'Download as PDF or DOCX. Ready to sign or file.'
    }
  ];

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Three steps. Zero complexity.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-gray-50 p-8 rounded-2xl hover:bg-emerald-50 transition-all hover:shadow-lg group"
            >
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 text-emerald-600 text-3xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 bg-emerald-50 inline-block px-6 py-3 rounded-lg">
            <span className="font-semibold text-emerald-700">Need expert review?</span> Connect to a verified lawyer in your jurisdiction for professional guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
