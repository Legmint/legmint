/**
 * ReferralCheckoutButton Component
 *
 * Example component for lawyer referral payments
 *
 * Usage:
 * <ReferralCheckoutButton
 *   lawyerId="uuid-xxx"
 *   referralId="uuid-yyy"
 *   amount={200}
 *   type="referral"
 * />
 */

'use client';

import { useCheckout } from '@/hooks/useCheckout';

interface ReferralCheckoutButtonProps {
  lawyerId: string;
  referralId: string;
  amount: number;
  type: 'referral' | 'addon';
  currency?: string;
  className?: string;
}

export function ReferralCheckoutButton({
  lawyerId,
  referralId,
  amount,
  type,
  currency = 'EUR',
  className = '',
}: ReferralCheckoutButtonProps) {
  const { checkoutReferral, checkoutReferralAddon, isLoading, error } =
    useCheckout();

  const handleCheckout = async () => {
    const amountCents = Math.round(amount * 100);

    if (type === 'referral') {
      await checkoutReferral({
        lawyerId,
        referralId,
        amountCents,
      });
    } else {
      await checkoutReferralAddon({
        lawyerId,
        referralId,
        extraAmountCents: amountCents,
      });
    }
  };

  const buttonText =
    type === 'referral'
      ? `Book Review - ${currency} ${amount}`
      : `Pay Add-on - ${currency} ${amount}`;

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? 'Redirecting...' : buttonText}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      {type === 'referral' && (
        <p className="mt-2 text-xs text-gray-600">
          Platform fee: €25 • Lawyer receives: €{amount - 25}
        </p>
      )}
      {type === 'addon' && (
        <p className="mt-2 text-xs text-gray-600">
          Platform fee: 10% • Lawyer receives: €{(amount * 0.9).toFixed(2)}
        </p>
      )}
    </div>
  );
}
