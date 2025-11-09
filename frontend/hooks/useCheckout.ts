/**
 * useCheckout Hook
 *
 * React hook for managing Stripe checkout flows
 */

'use client';

import { useState } from 'react';
import {
  createTemplateCheckout,
  createSubscriptionCheckout,
  createBillingPortal,
  createReferralCheckout,
  createReferralAddonCheckout,
} from '@/lib/payments-api';

interface UseCheckoutReturn {
  isLoading: boolean;
  error: string | null;
  checkoutTemplate: (params: {
    templateCode: string;
    amountCents: number;
  }) => Promise<void>;
  checkoutSubscription: (priceId: string) => Promise<void>;
  openBillingPortal: () => Promise<void>;
  checkoutReferral: (params: {
    lawyerId: string;
    amountCents: number;
    referralId: string;
  }) => Promise<void>;
  checkoutReferralAddon: (params: {
    lawyerId: string;
    extraAmountCents: number;
    referralId: string;
  }) => Promise<void>;
}

export function useCheckout(): UseCheckoutReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle checkout for template one-time purchase
   */
  const checkoutTemplate = async (params: {
    templateCode: string;
    amountCents: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await createTemplateCheckout(params);

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      console.error('Template checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle checkout for subscription
   */
  const checkoutSubscription = async (priceId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await createSubscriptionCheckout({ priceId });

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Checkout failed';
      setError(errorMessage);
      console.error('Subscription checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Open Stripe Billing Portal
   */
  const openBillingPortal = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await createBillingPortal();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No portal URL returned');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to open billing portal';
      setError(errorMessage);
      console.error('Billing portal error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle checkout for lawyer referral (€25 fixed)
   */
  const checkoutReferral = async (params: {
    lawyerId: string;
    amountCents: number;
    referralId: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await createReferralCheckout(params);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Referral checkout failed';
      setError(errorMessage);
      console.error('Referral checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle checkout for referral add-on (10% fee)
   */
  const checkoutReferralAddon = async (params: {
    lawyerId: string;
    extraAmountCents: number;
    referralId: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { url } = await createReferralAddonCheckout(params);

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Add-on checkout failed';
      setError(errorMessage);
      console.error('Referral add-on checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    checkoutTemplate,
    checkoutSubscription,
    openBillingPortal,
    checkoutReferral,
    checkoutReferralAddon,
  };
}
