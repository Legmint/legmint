# 🎨 Stripe Integration - Visual Guide

## Overview

This guide shows how the Stripe payment integration appears on the Legmint website. All pages are fully responsive and styled with Tailwind CSS.

---

## 1. Pricing Page (`/pricing`)

### Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Home                                              │
│                                                               │
│              Choose Your Plan                                 │
│     Get instant access to all legal templates                │
│                                                               │
│  ┌───────────────┐  ┌────────────────┐  ┌──────────────┐   │
│  │   STARTER     │  │      PRO       │  │    SCALE      │   │
│  │               │  │  [Most Popular]│  │               │   │
│  │   €49         │  │     €99        │  │    €299       │   │
│  │ /document     │  │   /month       │  │   /month      │   │
│  │               │  │                │  │               │   │
│  │ ✓ Single doc  │  │ ✓ Unlimited ★  │  │ ✓ Everything  │   │
│  │ ✓ Pro format  │  │ ✓ All templates│  │   in Pro      │   │
│  │ ✓ Instant DL  │  │ ✓ Priority     │  │ ✓ Multi-user  │   │
│  │ ✓ 30min access│  │ ✓ Versioning   │  │ ✓ Branding    │   │
│  │               │  │ ✓ Cancel       │  │ ✓ Manager     │   │
│  │               │  │                │  │               │   │
│  │ [Browse       │  │ [Subscribe to  │  │ [Subscribe to │   │
│  │  Templates]   │  │  Pro] ⚡        │  │  Scale]       │   │
│  │               │  │                │  │               │   │
│  │ Pay per       │  │ Secure • Stripe│  │ Secure •Stripe│   │
│  │ template      │  │                │  │               │   │
│  └───────────────┘  └────────────────┘  └──────────────┘   │
│                                                               │
│  [FAQ Section: Can I cancel? Payment methods? Refunds?]      │
│                                                               │
│  🔒 Secure Payments  |  🔐 SSL Encrypted  |  💳 Stripe      │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

**Pro Plan (Most Popular):**
- Larger card with subtle scale effect
- "Most Popular" badge at top
- Indigo gradient border
- Animated loading spinner on button click
- Redirects to Stripe Checkout

**Button States:**
- Default: "Subscribe to Pro"
- Loading: Spinner + "Redirecting to Stripe..."
- Disabled: Opacity 50%, cursor not-allowed

**Color Scheme:**
- Indigo-600 primary (#4f46e5)
- Green-500 checkmarks (#22c55e)
- Gray-50 background (#f9fafb)

---

## 2. Template Detail Page (`/templates/incorporation-delaware`)

### Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [INDIGO HEADER - Full Width]                                │
│  ← Back to Templates                                         │
│                                                               │
│  [Formation] [Beginner]                                      │
│                                                               │
│  Delaware C-Corp Incorporation                               │
│  Complete incorporation package for Delaware C-Corporations  │
│                                                               │
│  ⏱ 15 minutes  |  📄 PDF & DOCX                              │
│                                                               │
│  ┌────────────────────────────────────┐                      │
│  │  [WHITE CARD - Pricing]            │                      │
│  │                                     │                      │
│  │          €49                        │                      │
│  │       One-time payment              │                      │
│  │                                     │                      │
│  │  ┌─────────────────────────────┐   │                      │
│  │  │ 🛒 Buy Now - Generate       │   │                      │
│  │  │    Instantly                │   │                      │
│  │  └─────────────────────────────┘   │                      │
│  │                                     │                      │
│  │  What's included:                   │                      │
│  │  ✓ Customized for Delaware law     │                      │
│  │  ✓ Professional formatting          │                      │
│  │  ✓ Instant PDF & DOCX download      │                      │
│  │  ✓ 30-minute access window          │                      │
│  │                                     │                      │
│  │  [BLUE BOX]                         │                      │
│  │  💡 Pro Tip: Get Unlimited Access   │                      │
│  │  Subscribe to Pro for €99/month     │                      │
│  │  → Compare Plans                    │                      │
│  │                                     │                      │
│  │  🔒 Secure | 💳 Stripe              │                      │
│  └────────────────────────────────────┘                      │
└─────────────────────────────────────────────────────────────┘

[WHITE SECTION - Features Grid]
What you'll get:
  ✓ Certificate of Incorporation
  ✓ Bylaws template
  ✓ Initial board resolutions
  ✓ Stock issuance documents
  ✓ Compliance checklist

[GRAY SECTION - How it Works]
  [1] → [2] → [3] → [4]
  Buy   Answer  Generate  Download
  Now   Qs      Doc      & Use

[INDIGO CTA]
  Ready to get started?
  [Buy Now - €49]
```

### Key Interactions

**Buy Now Button:**
1. User clicks "Buy Now - €49"
2. Button shows spinner: "Redirecting to Stripe..."
3. Backend creates Stripe Checkout session
4. Frontend receives `{ url: "https://checkout.stripe.com/..." }`
5. Redirects user to Stripe
6. User completes payment
7. Redirected to `/dashboard/documents?session_id=cs_xxx`

**Error Handling:**
- Red alert box appears below button if error
- Shows user-friendly message
- Button returns to default state

---

## 3. Billing Dashboard (`/dashboard/billing`)

### Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                         │
│                                                               │
│  Billing & Subscription                                      │
│  Manage your subscription and payment methods                │
│                                                               │
│  ┌──────────────────────────────────┐  ┌────────────────┐   │
│  │ [WHITE CARD - Current Plan]      │  │ [SIDEBAR]      │   │
│  │                                   │  │                │   │
│  │  Pro Plan         [✓ Active]     │  │ Usage This     │   │
│  │                      🏅           │  │ Month:         │   │
│  │  €99/month                        │  │                │   │
│  │                                   │  │ Documents:     │   │
│  │  Included features:               │  │ Unlimited ✓    │   │
│  │  ✓ Unlimited documents            │  │                │   │
│  │  ✓ All templates                  │  │ [View all →]   │   │
│  │  ✓ Priority support               │  ├────────────────┤   │
│  │  ✓ Version history                │  │ Need Help?     │   │
│  │                                   │  │                │   │
│  │  ─────────────────────────────    │  │ 📧 billing@... │   │
│  │  Next billing: January 8, 2026    │  │ ❓ Help Center │   │
│  │                                   │  ├────────────────┤   │
│  │  ┌─────────────────────────────┐ │  │ Powered by     │   │
│  │  │  [Manage Subscription]      │ │  │ Stripe 💳      │   │
│  │  └─────────────────────────────┘ │  │                │   │
│  │  ┌─────────────────────────────┐ │  │ Secure,        │   │
│  │  │  [Upgrade to Scale]         │ │  │ PCI-compliant  │   │
│  │  └─────────────────────────────┘ │  └────────────────┘   │
│  │                                   │                       │
│  │  You'll be redirected to Stripe   │                       │
│  └──────────────────────────────────┘                       │
│                                                               │
│  [BLUE INFO BOX]                                             │
│  ℹ What you can do in the billing portal:                   │
│  ✓ Update payment method                                     │
│  ✓ View billing history & invoices                           │
│  ✓ Change or cancel subscription                             │
│  ✓ Download receipts                                         │
└─────────────────────────────────────────────────────────────┘
```

### Status Indicators

**Active Subscription:**
- Green badge: "✓ Active"
- Shows next billing date
- "Manage Subscription" button (primary)
- "Upgrade to Scale" button (secondary, if Pro)

**Canceled Subscription:**
- Yellow warning box
- "Subscription will be canceled on [date]"
- "Renew Subscription" option

**No Subscription:**
- Gray icon (credit card)
- "No Active Subscription" heading
- "View Plans" CTA button

---

## 4. Stripe Checkout Flow (External)

### Step-by-Step User Experience

**Step 1: User on Legmint**
```
[Template Page]
  ┌───────────────────────────────┐
  │ Delaware C-Corp Incorporation │
  │ €49                           │
  │ [Buy Now] ← User clicks       │
  └───────────────────────────────┘
```

**Step 2: Loading State**
```
[Template Page]
  ┌───────────────────────────────┐
  │ Delaware C-Corp Incorporation │
  │ €49                           │
  │ [⚡ Redirecting to Stripe...] │
  │    (Spinner animating)        │
  └───────────────────────────────┘
```

**Step 3: Redirected to Stripe**
```
[Stripe Checkout - stripe.com]
  ┌─────────────────────────────────┐
  │ Legmint                         │
  │                                 │
  │ Legal Template: incorporation   │
  │ €49.00                          │
  │                                 │
  │ Email: [user@example.com]       │
  │                                 │
  │ Card number                     │
  │ [4242 4242 4242 4242]           │
  │                                 │
  │ Expiry    CVC                   │
  │ [12/34]   [123]                 │
  │                                 │
  │ [Pay €49] ← Secure payment      │
  │                                 │
  │ 🔒 Secured by Stripe            │
  └─────────────────────────────────┘
```

**Step 4: Processing**
```
[Stripe Checkout]
  ┌─────────────────────────────────┐
  │ Processing payment...           │
  │ ⚡ (Spinner)                     │
  └─────────────────────────────────┘
```

**Step 5: Success & Redirect**
```
[Stripe Checkout]
  ┌─────────────────────────────────┐
  │ ✓ Payment successful!           │
  │ Redirecting you back...         │
  └─────────────────────────────────┘
          ↓
[Legmint Dashboard]
  ┌─────────────────────────────────┐
  │ ✓ Payment received!             │
  │ You can now generate your       │
  │ document. Click below:          │
  │                                 │
  │ [Generate Document]             │
  └─────────────────────────────────┘
```

---

## 5. Billing Portal (Stripe-Hosted)

When user clicks "Manage Subscription", they're redirected to Stripe's billing portal:

```
[Stripe Customer Portal - billing.stripe.com]
  ┌─────────────────────────────────────────┐
  │ [Legmint Logo]                          │
  │                                         │
  │ Your subscription                       │
  │ ─────────────────────────────────       │
  │                                         │
  │ Plan: Pro - €99/month                   │
  │ Status: Active                          │
  │ Next payment: Jan 8, 2026               │
  │                                         │
  │ [Update plan ▼]                         │
  │   • Switch to Scale (€299)              │
  │   • Cancel subscription                 │
  │                                         │
  │ ─────────────────────────────────       │
  │ Payment method                          │
  │ ─────────────────────────────────       │
  │                                         │
  │ •••• 4242  Expires 12/34                │
  │ [Update payment method]                 │
  │                                         │
  │ ─────────────────────────────────       │
  │ Billing history                         │
  │ ─────────────────────────────────       │
  │                                         │
  │ Dec 8, 2025    €99.00   [Invoice ↓]    │
  │ Nov 8, 2025    €99.00   [Invoice ↓]    │
  │ Oct 8, 2025    €99.00   [Invoice ↓]    │
  │                                         │
  │ [← Return to Legmint]                   │
  └─────────────────────────────────────────┘
```

**Features:**
- White-labeled with Legmint branding
- Update payment methods
- View invoices (downloadable PDFs)
- Change subscription tier
- Cancel subscription

---

## 6. Mobile Responsive Design

All pages are fully responsive:

### Mobile Pricing (< 768px)

```
┌─────────────────┐
│ Choose Your Plan│
│                 │
│ ┌─────────────┐ │
│ │  STARTER    │ │
│ │  €49        │ │
│ │  [Browse]   │ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │  PRO ⭐     │ │
│ │  €99/mo     │ │
│ │  [Subscribe]│ │
│ └─────────────┘ │
│                 │
│ ┌─────────────┐ │
│ │  SCALE      │ │
│ │  €299/mo    │ │
│ │  [Subscribe]│ │
│ └─────────────┘ │
└─────────────────┘
```

Cards stack vertically, maintain full functionality.

---

## 7. Color Palette & Branding

### Primary Colors
- **Indigo-600:** `#4f46e5` - Primary CTA, links
- **Indigo-700:** `#4338ca` - Hover states
- **Indigo-50:** `#eef2ff` - Background accents

### Status Colors
- **Green-500:** `#22c55e` - Success, active
- **Yellow-500:** `#eab308` - Warning, pending
- **Red-600:** `#dc2626` - Error, failed
- **Gray-900:** `#111827` - Text primary

### UI Elements
- **Border radius:** `0.5rem` (8px) for cards
- **Shadow:** `shadow-lg` for emphasis
- **Font:** Default system fonts (SF Pro, Segoe UI)
- **Icons:** Heroicons (outline style)

---

## 8. Animation & Transitions

### Button Loading State
```css
/* Default */
button {
  background: #4f46e5;
  transition: all 0.2s;
}

/* Hover */
button:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Loading */
button.loading {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Spinner */
.spinner {
  animation: spin 1s linear infinite;
}
```

### Card Hover Effects
```css
.pricing-card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

/* Pro Plan - Slightly larger */
.pricing-card-pro {
  transform: scale(1.05);
}
```

---

## 9. User Flow Summary

### One-Time Purchase Flow

1. **Browse templates** → Template detail page
2. **Click "Buy Now"** → Loading state
3. **Redirected to Stripe** → Enter card details
4. **Payment processed** → Webhook fires
5. **Redirected back** → Document entitlement created
6. **Generate document** → Entitlement consumed
7. **Second attempt** → 403 Forbidden (paywall)

### Subscription Flow

1. **Pricing page** → Click "Subscribe to Pro"
2. **Redirected to Stripe** → Enter card & subscribe
3. **Payment processed** → Webhook creates subscription
4. **Redirected back** → Dashboard shows "Pro" plan
5. **Generate documents** → Unlimited (no consumption)
6. **Manage billing** → Stripe portal for updates

---

## 10. Accessibility Features

- **Keyboard navigation:** Full tab support
- **ARIA labels:** On all buttons and links
- **Focus indicators:** Visible focus rings
- **Color contrast:** WCAG AA compliant
- **Screen readers:** Semantic HTML + labels
- **Error messages:** Clear, actionable text

---

## 🎨 Design Principles

1. **Clarity:** Users always know what they're paying for
2. **Trust:** Stripe branding + security badges
3. **Speed:** Fast checkouts (< 30 seconds)
4. **Feedback:** Loading states, success/error messages
5. **Flexibility:** Easy to upgrade, downgrade, cancel

---

## 📱 To See It Live

```bash
# Start the development servers
cd api && npm run start:dev
cd frontend && npm run dev

# Visit:
http://localhost:3001/pricing
http://localhost:3001/templates/incorporation-delaware
http://localhost:3001/dashboard/billing
```

---

**All visual elements are production-ready and fully integrated with Stripe!** 🚀
