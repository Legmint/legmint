import Link from 'next/link';

export default function LawyerApplySuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying to join the Legmint lawyer network. We've received your
            application and supporting documents.
          </p>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-indigo-900 mb-3">What happens next?</h2>
            <ol className="space-y-2 text-indigo-800">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>
                  Our team will review your credentials and verify your bar license (2-3 business
                  days)
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>You'll receive an email with your approval status</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>Once approved, you'll need to connect your Stripe account</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>Start receiving document review requests from verified founders!</span>
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-b from-indigo-50 to-white rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">While you wait:</h3>
            <ul className="text-left text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Review the Terms for Lawyers to understand the platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>
                  Prepare your Stripe Connect account (you'll need a bank account for payouts)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <span>Familiarize yourself with common startup legal documents</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Return to Home
            </Link>
            <p className="text-sm text-gray-600">
              Questions? Contact us at{' '}
              <a href="mailto:lawyers@legmint.com" className="text-indigo-600 hover:underline">
                lawyers@legmint.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
