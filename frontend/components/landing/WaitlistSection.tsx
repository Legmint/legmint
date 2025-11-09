'use client';

import { useState } from 'react';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    // TODO: Implement actual waitlist signup (e.g., save to database or email service)
    setStatus('success');
    setEmail('');

    // Reset after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);
  };

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Expanding to new jurisdictions soon.
          </h2>
          <p className="text-xl text-gray-600">
            Be first to know when we launch in France, Netherlands, Spain, and beyond.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-lg border-2 border-gray-300 focus:border-emerald-600 focus:outline-none text-gray-900"
              disabled={status === 'success'}
            />
            <button
              type="submit"
              className="bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status === 'success'}
            >
              {status === 'success' ? 'Joined! 🎉' : 'Join the waitlist'}
            </button>
          </div>

          {status === 'error' && (
            <p className="mt-3 text-red-600 text-sm text-center">
              Please enter a valid email address.
            </p>
          )}

          {status === 'success' && (
            <p className="mt-3 text-emerald-600 text-sm text-center font-semibold">
              You&apos;re on the list! We&apos;ll notify you when we expand.
            </p>
          )}

          <p className="mt-4 text-sm text-gray-500 text-center">
            We respect your inbox. Updates only when we launch something new.
          </p>
        </form>
      </div>
    </div>
  );
}
