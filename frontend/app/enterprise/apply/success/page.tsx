import Link from 'next/link';

export default function EnterpriseApplySuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Application Received
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          Thank you for applying for Legmint Enterprise. We're reviewing your application and will be in touch within 24-48 hours with next steps.
        </p>

        {/* What's Next */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8 text-left">
          <h2 className="font-semibold text-gray-900 mb-4">What happens next?</h2>
          <ol className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium">1</span>
              <span>Our team will review your application</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium">2</span>
              <span>You'll receive an email with our decision within 24-48 hours</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-medium">3</span>
              <span>If approved, we'll send your contract and invoice</span>
            </li>
          </ol>
        </div>

        {/* Contact */}
        <p className="text-sm text-gray-500 mb-6">
          Questions? Contact us at{' '}
          <a href="mailto:enterprise@legmint.com" className="text-emerald-600 hover:underline">
            enterprise@legmint.com
          </a>
        </p>

        {/* Return Home */}
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
