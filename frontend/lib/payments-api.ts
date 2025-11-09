/**
 * Payments API Client
 *
 * Client-side functions to call payment endpoints
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface CheckoutResponse {
  sessionId: string;
  url: string;
}

interface PortalResponse {
  url: string;
}

/**
 * Get auth token from Clerk (or your auth provider)
 * This function should be implemented based on your auth setup
 */
async function getAuthToken(): Promise<string | null> {
  // If using Clerk:
  // const { getToken } = useAuth();
  // return await getToken();

  // For now, return null - implement based on your auth
  // In a real implementation, you'd get this from your auth context
  return null;
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Request failed',
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Create a one-time checkout for a template
 */
export async function createTemplateCheckout(params: {
  templateCode: string;
  amountCents: number;
  currency?: string;
}): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>('/payments/checkout/template', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Create a subscription checkout
 */
export async function createSubscriptionCheckout(params: {
  priceId: string;
}): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>('/payments/checkout/subscription', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Create a billing portal session
 */
export async function createBillingPortal(): Promise<PortalResponse> {
  return apiRequest<PortalResponse>('/payments/portal', {
    method: 'POST',
  });
}

/**
 * Create a referral checkout (€25 fixed fee)
 */
export async function createReferralCheckout(params: {
  lawyerId: string;
  amountCents: number;
  currency?: string;
  referralId: string;
}): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>('/payments/checkout/referral', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Create a referral add-on checkout (10% fee)
 */
export async function createReferralAddonCheckout(params: {
  lawyerId: string;
  extraAmountCents: number;
  currency?: string;
  referralId: string;
}): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>('/payments/checkout/referral-addon', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
