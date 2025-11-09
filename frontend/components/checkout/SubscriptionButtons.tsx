/**
 * Subscription Checkout Buttons
 *
 * Example components for subscription checkout and billing portal
 *
 * Usage:
 * <SubscriptionCheckoutButton priceId="price_xxx" planName="Pro" price={99} />
 * <BillingPortalButton />
 */

'use client';

import { useCheckout } from '@/hooks/useCheckout';

interface SubscriptionCheckoutButtonProps {
  priceId: string;
  planName: string;
  price: number;
  currency?: string;
  interval?: 'month' | 'year';
  className?: string;
}

export function SubscriptionCheckoutButton({
  priceId,
  planName,
  price,
  currency = 'EUR',
  interval = 'month',
  className = '',
}: SubscriptionCheckoutButtonProps) {
  const { checkoutSubscription, isLoading, error } = useCheckout();

  const handleCheckout = async () => {
    await checkoutSubscription(priceId);
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading
          ? 'Redirecting...'
          : `Subscribe to ${planName} - ${currency} ${price}/${interval}`}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface BillingPortalButtonProps {
  className?: string;
}

export function BillingPortalButton({
  className = '',
}: BillingPortalButtonProps) {
  const { openBillingPortal, isLoading, error } = useCheckout();

  const handleClick = async () => {
    await openBillingPortal();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? 'Opening...' : 'Manage Billing'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
