# 🚀 Stripe Integration - Production Deployment Guide

## Pre-Deployment Checklist

Before going live, ensure:

- [ ] ✅ All local tests passed (see `STRIPE_LOCAL_TESTING_RUNBOOK.md`)
- [ ] ✅ Test mode working flawlessly for at least 1 week
- [ ] ✅ Legal terms updated (pricing, refunds, subscriptions)
- [ ] ✅ Privacy policy covers payment data handling
- [ ] ✅ Customer support ready for billing questions
- [ ] ✅ Accounting/finance team briefed on revenue flow

---

## Step 1: Switch to Live Stripe Keys

### 1.1 Get Live Keys from Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle from **Test mode** → **Live mode** (top right)
3. Navigate to **Developers** → **API keys**
4. Reveal and copy:
   - **Secret key** (starts with `sk_live_`)
   - **Publishable key** (starts with `pk_live_`)

**⚠️ CRITICAL: Never commit or share live keys!**

### 1.2 Update Backend Environment Variables

**For Render/Railway/your host:**

1. Go to your backend service dashboard
2. Navigate to **Environment Variables**
3. Update these values:

```bash
STRIPE_SECRET_KEY=<PASTE_YOUR_sk_live_KEY_HERE>

# Leave STRIPE_WEBHOOK_SECRET empty for now (we'll set it in Step 3)
STRIPE_WEBHOOK_SECRET=

# Stripe Connect (if using lawyer referrals)
STRIPE_CONNECT_CLIENT_ID=<YOUR_LIVE_ca_xxx_FROM_CONNECT_SETTINGS>

# Platform fees (should already be correct)
PLATFORM_FEE_FIXED_CENTS=2500
PLATFORM_FEE_PERCENT=10
```

4. **Save** and **redeploy** your backend

### 1.3 Update Frontend Environment Variables

**For Vercel/Netlify:**

1. Go to your frontend project settings
2. Navigate to **Environment Variables**
3. Update:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<PASTE_YOUR_pk_live_KEY_HERE>
NEXT_PUBLIC_API_BASE_URL=https://api.legmint.com
```

4. **Save** and **redeploy** your frontend

---

## Step 2: Create Live Products & Prices

### 2.1 Seed Live Stripe Products

**Option A: Run seed script in production**

```bash
# SSH into your backend or use your host's console
cd /app  # or wherever your code is deployed
npm run stripe:seed
```

**Option B: Manually create in Stripe Dashboard**

1. Go to **Products** → **Add product**
2. Create:
   - **Legmint – Starter** (one-time, €49)
   - **Legmint – Pro** (monthly, €99)
   - **Legmint – Scale** (monthly, €299)
3. Copy the price IDs

**Save the price IDs** - you'll need them for frontend integration!

### 2.2 Update Frontend with Live Price IDs

If your frontend hardcodes price IDs (e.g., for subscription buttons), update them:

```typescript
// Example: Update in your pricing page
const PRICE_IDS = {
  pro: 'price_LIVE_XXX',    // Replace with your live Pro price ID
  scale: 'price_LIVE_YYY',  // Replace with your live Scale price ID
};
```

Or, better yet, fetch them from your backend API to keep them dynamic.

---

## Step 3: Set Up Production Webhook

### 3.1 Create Webhook Endpoint in Stripe

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Configure:
   - **Endpoint URL:** `https://api.legmint.com/webhooks/stripe`
   - **Description:** "Legmint Production Webhook"
   - **Events to send:** Select:
     - `checkout.session.completed`
     - `invoice.paid`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `account.updated` (if using Stripe Connect)
   - Or select **"Send all event types"** (recommended for simplicity)
4. Click **Add endpoint**

### 3.2 Get Webhook Signing Secret

1. After creating the endpoint, you'll see: **Signing secret**
2. Click **Reveal** and copy the `whsec_...` value

### 3.3 Add Secret to Backend Environment

1. Go to your backend host (Render/Railway/etc.)
2. Update environment variables:

```bash
STRIPE_WEBHOOK_SECRET=<PASTE_YOUR_whsec_LIVE_SECRET_HERE>
```

3. **Save** and **redeploy** backend

### 3.4 Test Webhook

1. In Stripe Dashboard → Webhooks → click your endpoint
2. Click **Send test webhook**
3. Select `checkout.session.completed`
4. Send it
5. Check **Response** - should be `200 OK`

**If you get an error:**
- Check backend logs
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure endpoint URL is publicly accessible

---

## Step 4: Database Migrations

### 4.1 Run Migrations in Production

**If using managed database (Render, Railway, etc.):**

```bash
# Connect to your production database
psql $DATABASE_URL

# Run migrations
\i /path/to/migrations/001_lawyer_referral_system.sql
\i /path/to/migrations/002_stripe_subscriptions_and_entitlements.sql

# Verify tables exist
\dt
```

**Or use your host's migration tool:**

```bash
# Example: Render Deploy Hook or Railway CLI
railway run npm run migrate
```

### 4.2 Verify Tables Created

```bash
psql $DATABASE_URL -c "\dt"
```

Should show:
- `subscriptions`
- `document_entitlements`
- `orders`
- `partners`
- `referrals`

---

## Step 5: Smoke Test Live Payments

### 5.1 Create a €1 Test Product (Recommended)

To avoid charging real amounts during testing:

1. Create a temporary product: **"Legmint Test"** (€1)
2. Test checkout → complete with a real card
3. Verify:
   - Webhook received
   - Database updated
   - Money appears in Stripe balance
4. **Refund** the test payment
5. Delete the test product

### 5.2 Test Each Flow

Using **real payment methods** (start with small amounts):

1. **One-time purchase:** Buy a template for €1
2. **Subscription:** Subscribe to Pro (cancel within billing period for no charge)
3. **Billing portal:** Manage subscription
4. **Referral (if applicable):** Test lawyer referral checkout

**⚠️ You will be charged real money. Use small amounts and refund afterward.**

### 5.3 Monitor First Live Transactions

1. **Stripe Dashboard** → Payments
2. **Backend logs** → Check for errors
3. **Database** → Verify records created

---

## Step 6: Monitoring & Alerting

### 6.1 Set Up Stripe Email Notifications

1. **Settings** → **Notifications**
2. Enable:
   - Failed payments
   - Disputes
   - Webhook failures

### 6.2 Backend Error Monitoring

Configure your backend to alert on:
- Webhook signature verification failures
- Database write errors during webhook processing
- Subscription sync failures

**Example with Sentry (optional):**

```bash
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_ENVIRONMENT=production
```

### 6.3 Stripe Dashboard Monitoring

Check regularly:
- **Payments** → Look for failed/disputed payments
- **Webhooks** → Check for delivery failures
- **Customers** → Monitor churn
- **Connect** (if using) → Monitor payouts to lawyers

---

## Step 7: Legal & Compliance

### 7.1 Update Terms of Service

Ensure your ToS covers:
- Pricing and billing
- Subscription auto-renewal
- Refund policy
- Cancellation terms

### 7.2 Update Privacy Policy

Add sections on:
- Payment data processing (Stripe)
- PCI compliance (Stripe handles this)
- Data retention for financial records

### 7.3 Subscription Disclosures

Ensure your checkout pages clearly state:
- Recurring billing amount and frequency
- Cancellation policy
- Contact information for billing support

**Example:**
> "By subscribing, you authorize Legmint to charge €99/month. Cancel anytime via your billing portal. No refunds for partial months."

---

## Step 8: Customer Support Preparation

### 8.1 Billing Support Email

Set up: `billing@legmint.com` or route to support team

### 8.2 Common Support Scenarios

Train your team to handle:
- Subscription cancellations
- Refund requests
- Payment failures
- Invoice/receipt requests
- Billing portal access

### 8.3 Stripe Dashboard Access

Grant support team **read-only** access:
1. **Settings** → **Team**
2. Add support email with **View only** role

---

## Step 9: Go Live Checklist

Before flipping the switch:

- [ ] Live keys configured in backend
- [ ] Live keys configured in frontend
- [ ] Live products created and price IDs updated
- [ ] Production webhook endpoint created and secret configured
- [ ] Webhook tested (200 response)
- [ ] Database migrations run
- [ ] Smoke test with €1 completed successfully
- [ ] Terms of Service updated
- [ ] Privacy Policy updated
- [ ] Support team briefed
- [ ] Monitoring/alerts configured
- [ ] Test mode Stripe data archived/deleted (if desired)

---

## Step 10: Post-Launch Monitoring (First 48 Hours)

### Hour 1-24: Active Monitoring

- [ ] Monitor webhook delivery (should be 100% success rate)
- [ ] Check database for new subscriptions/orders
- [ ] Watch for error logs
- [ ] Test a real purchase yourself

### Hour 24-48: Regular Checks

- [ ] Review Stripe Dashboard for any issues
- [ ] Check customer support tickets
- [ ] Verify accounting reports match Stripe revenue

### Week 1: Fine-Tuning

- [ ] Analyze conversion rates
- [ ] Review subscription churn
- [ ] Optimize pricing if needed
- [ ] Fix any UX friction points

---

## 🚨 Rollback Plan

If something goes wrong:

### Quick Rollback

1. **Switch back to test mode keys** in environment variables
2. **Redeploy** both frontend and backend
3. **Update webhook** to point to test mode endpoint
4. **Investigate** the issue in test mode

### Partial Rollback

If only one component fails (e.g., webhooks):

1. **Disable webhook endpoint** in Stripe Dashboard
2. **Fix the backend** issue
3. **Test in staging** environment
4. **Re-enable** webhook

### Communication

If users are affected:

1. **Post status update** on your status page
2. **Email affected customers** with explanation and timeline
3. **Offer refunds/credits** if appropriate

---

## 📊 Success Metrics

Track these KPIs:

| Metric | Target | How to measure |
|--------|--------|----------------|
| Webhook success rate | 99.9%+ | Stripe Dashboard → Webhooks |
| Payment success rate | 95%+ | Stripe Dashboard → Payments |
| Subscription churn | <5%/month | Database queries or Stripe analytics |
| Support ticket volume | <2% of customers | Support ticketing system |
| Revenue accuracy | 100% match | Stripe balance vs. accounting records |

---

## 🔒 Security Hardening

### Production-Only Security Measures

1. **Rate limiting:**
   ```typescript
   // Increase limits for production
   RATE_LIMIT_MAX_AUTHENTICATED=1000
   RATE_LIMIT_MAX_UNAUTHENTICATED=100
   ```

2. **CORS:**
   ```bash
   CORS_ORIGINS=https://legmint.com,https://www.legmint.com
   ```

3. **Restrict Stripe API key permissions:**
   - In Stripe Dashboard, create restricted keys with minimal permissions
   - Use separate keys for different services if possible

4. **Monitor for fraud:**
   - Enable Stripe Radar (fraud detection)
   - Set up alerts for unusual patterns

---

## 📞 Emergency Contacts

Keep these handy:

- **Stripe Support:** https://support.stripe.com/ (24/7 for urgent issues)
- **Your hosting provider support:** (Render, Railway, etc.)
- **Database provider support:** (if managed separately)
- **Your development team lead:** (for code issues)

---

## ✅ Launch Day Checklist

On the day you go live:

**Morning:**
- [ ] Double-check all environment variables
- [ ] Verify webhook is active and receiving events
- [ ] Test one live transaction end-to-end
- [ ] Team on standby for issues

**During Launch:**
- [ ] Monitor dashboards continuously
- [ ] Watch for support tickets
- [ ] Check social media for user feedback

**Evening:**
- [ ] Review metrics
- [ ] Document any issues
- [ ] Plan fixes for tomorrow

---

## 🎉 You're Live!

Congratulations on deploying Stripe to production!

**Next steps:**
1. Monitor metrics for 1 week
2. Optimize based on user feedback
3. Consider adding features:
   - Promo codes
   - Annual billing (with discount)
   - Enterprise plans
   - Affiliate program

---

**Support:** For Stripe integration questions, refer to:
- [Stripe Documentation](https://stripe.com/docs)
- Your implementation code in `/api/src/payments/`
- Local testing runbook: `STRIPE_LOCAL_TESTING_RUNBOOK.md`
