'use client';

import { useState, useEffect } from 'react';

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // Detect when mouse leaves from the top of the page
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, [hasShown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
    console.log('Email submitted:', email);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Wait! Don't risk a €50K legal mistake
              </h3>
              <p className="text-gray-600 text-lg">
                Get our <strong>free Startup Legal Checklist</strong> used by 500+ YC founders
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mint-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-mint-400 text-navy-500 hover:bg-mint-300 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Free Checklist + €20 Discount
              </button>
            </form>

            <div className="bg-mint-50 p-4 rounded-lg border border-mint-200">
              <p className="text-sm text-gray-700 mb-2">
                <strong>What you'll get:</strong>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="text-mint-600 mr-2">✓</span>
                  <span>Pre-seed, Seed & Series A legal checklists</span>
                </li>
                <li className="flex items-start">
                  <span className="text-mint-600 mr-2">✓</span>
                  <span>Red flags investors look for in legal docs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-mint-600 mr-2">✓</span>
                  <span>€20 discount code for your first template</span>
                </li>
                <li className="flex items-start">
                  <span className="text-mint-600 mr-2">✓</span>
                  <span>Weekly founder legal tips (unsubscribe anytime)</span>
                </li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              No spam. Unsubscribe anytime. 15,000+ founders trust us.
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Check your inbox!
            </h3>
            <p className="text-gray-600">
              We've sent your free checklist and discount code to <strong>{email}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
