/**
 * TemplateCheckoutButton Component
 *
 * Example component for template one-time purchase
 *
 * Usage:
 * <TemplateCheckoutButton
 *   templateCode="incorporation-delaware"
 *   price={49}
 *   currency="EUR"
 * />
 */

'use client';

import { useCheckout } from '@/hooks/useCheckout';

interface TemplateCheckoutButtonProps {
  templateCode: string;
  price: number;
  currency?: string;
  className?: string;
}

export function TemplateCheckoutButton({
  templateCode,
  price,
  currency = 'EUR',
  className = '',
}: TemplateCheckoutButtonProps) {
  const { checkoutTemplate, isLoading, error } = useCheckout();

  const handleCheckout = async () => {
    await checkoutTemplate({
      templateCode,
      amountCents: Math.round(price * 100),
    });
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? 'Redirecting...' : `Buy for ${currency} ${price}`}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
