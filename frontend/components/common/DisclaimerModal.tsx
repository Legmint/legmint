'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  title?: string;
  templateName?: string;
}

export default function DisclaimerModal({
  isOpen,
  onClose,
  onAccept,
  title = 'Legal Disclaimer',
  templateName,
}: DisclaimerModalProps) {
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasAccepted(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (hasAccepted) {
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          {/* Header */}
          <div className="bg-red-50 border-b border-red-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-8 h-8 text-red-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {templateName && (
              <p className="text-sm text-gray-600 mb-4">
                You are about to generate: <strong>{templateName}</strong>
              </p>
            )}

            <div className="space-y-4 text-sm text-gray-900">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                <p className="font-semibold mb-2 text-gray-900">
                  ⚠️ Critical Notice: This is NOT Legal Advice
                </p>
                <p className="text-gray-800">
                  Legmint provides automated document generation tools and general legal
                  information only. We do NOT provide legal advice, representation, or legal
                  opinions.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-900">
                  No Attorney-Client Relationship
                </h4>
                <p className="text-gray-700">
                  Using Legmint does not create an attorney-client relationship between you
                  and Legmint. Our templates are informational starting points, not
                  substitutes for professional legal counsel.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-900">
                  Your Responsibility
                </h4>
                <p className="text-gray-700 mb-2">
                  By proceeding, you acknowledge that:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>
                    You are solely responsible for reviewing and customizing any document
                    generated
                  </li>
                  <li>
                    You will verify that the document complies with all applicable laws in
                    your jurisdiction
                  </li>
                  <li>
                    You should consult a licensed attorney before relying on or executing
                    any legal document
                  </li>
                  <li>
                    Laws vary by jurisdiction and change over time; templates may not be
                    suitable for your specific needs
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-gray-900">
                  No Warranties
                </h4>
                <p className="text-gray-700">
                  Legmint provides templates "as is" without warranties of any kind. We do
                  not warrant that templates are accurate, complete, legally sufficient, or
                  enforceable in your jurisdiction.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/legal/disclaimer"
                  target="_blank"
                  className="text-emerald-600 hover:text-emerald-700 font-medium underline"
                >
                  Read full disclaimer →
                </Link>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAccepted}
                  onChange={(e) => setHasAccepted(e.target.checked)}
                  className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-900">
                  <strong>I understand and agree</strong> that Legmint does not provide
                  legal advice, and I will consult a licensed attorney before relying on any
                  document generated through this platform.
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAccept}
              disabled={!hasAccepted}
              className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                hasAccepted
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              I Understand, Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
