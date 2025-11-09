'use client';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Saved us €15K and 3 weeks on our founders agreement. The guided questionnaire caught equity vesting issues we hadn't considered. Our Series A lead investors said it was one of the cleanest founder docs they'd seen.",
    author: "Sarah Chen",
    role: "Co-founder & CEO",
    company: "TechFlow (YC W23, €8M raised)",
    avatar: "👩‍💼"
  },
  {
    quote: "Generated our SAFE in 20 minutes. Sent it to our lawyer for review—he had zero changes. Saved us €3K. Now we use Legmint for all our employment contracts and NDAs.",
    author: "Marcus Weber",
    role: "Founder",
    company: "DataLoop (€2M from Accel)",
    avatar: "👨‍💻"
  },
  {
    quote: "As a second-time founder, I've wasted €50K+ on legal fees in my first startup. Legmint is 10x faster and 95% cheaper. Every pre-seed founder should use this before paying a lawyer.",
    author: "Priya Sharma",
    role: "Founder",
    company: "CloudKit (Acquired by Stripe)",
    avatar: "👩‍🚀"
  }
];

export default function Testimonials() {
  return (
    <section className="mb-12 -mt-8">
      <div className="card p-8 bg-gradient-to-br from-primary-50 to-white border border-primary-100">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-3">
            ⭐️ Trusted by 15,000+ Founders
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What Startup Founders Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-3">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-primary-600 font-medium">{testimonial.company}</div>
                </div>
              </div>
              <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🚀</span>
              <span><strong className="text-gray-900">500+</strong> YC companies</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">💰</span>
              <span><strong className="text-gray-900">€2B+</strong> raised</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              <span><strong className="text-gray-900">18K+</strong> docs generated</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

