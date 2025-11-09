'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function DisclaimerModal({ isOpen, onClose, onAccept }: DisclaimerModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-3 w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      ⚖️ Important Legal Notice
                    </Dialog.Title>

                    <div className="space-y-4 text-sm text-gray-700">
                      <p>Before we generate your document, please understand:</p>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5">✓</span>
                          <span>This is <strong>NOT legal advice</strong></span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5">✓</span>
                          <span>This document is a starting point, not a final solution</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5">✓</span>
                          <span>You should review with qualified legal counsel</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5">✓</span>
                          <span>Laws vary by jurisdiction and change over time</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5">✓</span>
                          <span>Your specific situation may require modifications</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-600">
                          Generated documents are provided "as is" without warranty of any kind.
                          Legmint assumes no liability for use of these documents.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            className="mt-1 border-gray-300 text-primary-600 focus:ring-primary-500"
                            required
                          />
                          <span className="ml-2 text-sm">
                            I understand this is not legal advice and will consult with qualified legal counsel before using this document
                          </span>
                        </label>

                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            className="mt-1 border-gray-300 text-primary-600 focus:ring-primary-500"
                            required
                          />
                          <span className="ml-2 text-sm">
                            I agree to the <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline" target="_blank">Terms of Service</Link> and <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline" target="_blank">Privacy Policy</Link>
                          </span>
                        </label>
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">🔒</span>
                        <span>Secure: We don't store your personal information</span>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        type="button"
                        className="btn-secondary flex-1 text-sm"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn-primary flex-1 text-sm"
                        onClick={() => {
                          // Check if both checkboxes are checked
                          const checkboxes = document.querySelectorAll('input[type="checkbox"]');
                          const allChecked = Array.from(checkboxes).every((cb: any) => cb.checked);

                          if (allChecked) {
                            onAccept();
                          } else {
                            alert('Please check both boxes to continue');
                          }
                        }}
                      >
                        I Understand - Continue
                      </button>
                    </div>

                    <div className="mt-4 text-center">
                      <Link
                        href="/terms"
                        target="_blank"
                        className="text-xs text-primary-600 hover:text-primary-700 underline"
                      >
                        View Full Terms and Conditions
                      </Link>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}