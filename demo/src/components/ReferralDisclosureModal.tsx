'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ReferralDisclosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

/**
 * Referral Disclosure Modal
 *
 * LEGAL COMPLIANCE: This modal provides required disclosures about attorney referral
 * arrangements and commissions BEFORE users are shown lawyer referrals.
 *
 * Required by:
 * - UK SRA Transparency Rules
 * - US ABA Model Rule 7.2(b)(4)
 * - EU Unfair Commercial Practices Directive
 * - Consumer protection regulations
 *
 * This disclosure is MANDATORY and must be shown before presenting lawyer options.
 */
export default function ReferralDisclosureModal({
  isOpen,
  onClose,
  onAccept
}: ReferralDisclosureModalProps) {
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3 w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 mb-4"
                    >
                      💼 Attorney Referral Disclosure
                    </Dialog.Title>

                    <div className="space-y-4 text-sm text-gray-700">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <p className="font-semibold text-blue-900 mb-2">
                          Important: We Receive Referral Fees
                        </p>
                        <p className="text-blue-800">
                          Legmint operates an attorney referral service. When you engage a legal
                          professional through our platform, that professional pays Legmint a
                          referral commission (typically 10-15% of their fees).
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5 font-bold">✓</span>
                          <div>
                            <strong>No Additional Cost to You:</strong>
                            <p className="text-gray-600 mt-1">
                              The referral fee is paid by the legal professional, not added to your bill.
                              Any discounts offered reduce what you pay.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5 font-bold">✓</span>
                          <div>
                            <strong>Independent Matching:</strong>
                            <p className="text-gray-600 mt-1">
                              Referral fees do not influence which professionals we recommend. Matching is
                              based solely on jurisdiction, practice area, ratings, and availability.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5 font-bold">✓</span>
                          <div>
                            <strong>Your Choice:</strong>
                            <p className="text-gray-600 mt-1">
                              You are under no obligation to use our referral service. You may seek legal
                              services from any professional of your choosing.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5 font-bold">✓</span>
                          <div>
                            <strong>Independent Professionals:</strong>
                            <p className="text-gray-600 mt-1">
                              All legal professionals in our network are independent practitioners who
                              owe their professional duties to you, not to Legmint. Your attorney-client
                              relationship is solely with the professional you engage.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <span className="text-green-600 mr-2 mt-0.5 font-bold">✓</span>
                          <div>
                            <strong>Bar Verified:</strong>
                            <p className="text-gray-600 mt-1">
                              All professionals are verified to be licensed and in good standing with
                              their respective bar associations.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <p className="text-xs text-gray-600">
                          <strong>Your Rights:</strong> You have the right to (1) seek legal services
                          from any professional, including those not in our network, (2) obtain multiple
                          consultations before selecting a professional, (3) negotiate fees and terms
                          directly with any professional, and (4) decline to use the referral service.
                        </p>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-xs text-gray-600">
                          For complete details about our referral arrangements, matching criteria,
                          verification processes, and your rights, please review{' '}
                          <Link
                            href="/terms#section-9"
                            className="text-primary-600 hover:text-primary-700 underline font-medium"
                            target="_blank"
                          >
                            Section 9 of our Terms and Conditions
                          </Link>.
                        </p>
                      </div>

                      <div className="space-y-3 mt-4">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            id="disclosure-checkbox"
                            className="mt-1 border-gray-300 text-primary-600 focus:ring-primary-500"
                            required
                          />
                          <span className="ml-2 text-sm">
                            I understand that Legmint receives referral fees from legal professionals
                            and that I am not obligated to use the referral service
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="mt-6 flex space-x-3">
                      <button
                        type="button"
                        className="btn-secondary flex-1 text-sm"
                        onClick={onClose}
                      >
                        No Thanks - Skip Referrals
                      </button>
                      <button
                        type="button"
                        className="btn-primary flex-1 text-sm"
                        onClick={() => {
                          const checkbox = document.getElementById('disclosure-checkbox') as HTMLInputElement;
                          if (checkbox && checkbox.checked) {
                            onAccept();
                          } else {
                            alert('Please acknowledge that you understand the referral fee arrangement');
                          }
                        }}
                      >
                        I Understand - View Professionals
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
