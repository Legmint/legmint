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
 * Make authenticated API request
 * Token is passed as a parameter from the calling hook/component
 * which has access to Clerk's useAuth() hook
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge existing headers if present
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>;
    Object.assign(headers, existingHeaders);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/v1${endpoint}`, {
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
export async function createTemplateCheckout(
  params: {
    templateCode: string;
    amountCents: number;
    currency?: string;
  },
  token?: string | null,
): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>(
    '/payments/checkout/template',
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
    token,
  );
}

/**
 * Create a subscription checkout
 */
export async function createSubscriptionCheckout(
  params: {
    priceId: string;
  },
  token?: string | null,
): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>(
    '/payments/checkout/subscription',
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
    token,
  );
}

/**
 * Create a billing portal session
 */
export async function createBillingPortal(
  token?: string | null,
): Promise<PortalResponse> {
  return apiRequest<PortalResponse>(
    '/payments/portal',
    {
      method: 'POST',
    },
    token,
  );
}

/**
 * Create a referral checkout (€30 fixed fee)
 */
export async function createReferralCheckout(
  params: {
    lawyerId: string;
    amountCents: number;
    currency?: string;
    referralId: string;
  },
  token?: string | null,
): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>(
    '/payments/checkout/referral',
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
    token,
  );
}

/**
 * Create a referral add-on checkout (15% commission)
 */
export async function createReferralAddonCheckout(
  params: {
    lawyerId: string;
    extraAmountCents: number;
    currency?: string;
    referralId: string;
  },
  token?: string | null,
): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>(
    '/payments/checkout/referral-addon',
    {
      method: 'POST',
      body: JSON.stringify(params),
    },
    token,
  );
}
