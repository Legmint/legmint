# 🧪 Stripe Integration - Local Testing Runbook

## Prerequisites

Before testing, ensure you have:
- ✅ Pasted your Stripe keys into `/api/.env` and `/frontend/.env.local`
- ✅ Stripe CLI installed (`brew install stripe/stripe-cli/stripe` or [download](https://stripe.com/docs/stripe-cli))
- ✅ PostgreSQL running with the database created
- ✅ Run migrations

---

## Step 1: Setup Database

```bash
# Navigate to API directory
cd api

# Run all migrations
npm run migrate

# Verify tables were created
psql $DATABASE_URL -c "\dt"
# Should show: subscriptions, document_entitlements, orders, etc.
```

---

## Step 2: Seed Stripe Products

```bash
# Still in /api directory
npm run stripe:seed
```

**Expected output:**
```
🚀 Starting Stripe Product & Price Seeder...
============================================================
Processing: STARTER
============================================================
✅ Created product: prod_xxxxx
✅ Created price: price_xxxxx

... (similar for PRO and SCALE)

✅ SEED COMPLETE!
📄 Price IDs saved to: /api/stripe.prices.json

📋 Quick Reference:
────────────────────────────────────────────────────────────
STARTER_PRICE_ID=price_xxxxx
PRO_PRICE_ID=price_xxxxx
SCALE_PRICE_ID=price_xxxxx
```

**Important:** Copy the price IDs for testing later!

---

## Step 3: Start Backend Server

```bash
# In /api directory
npm run start:dev
```

**Expected output:**
```
🚀 Legmint API is running on: http://localhost:3000/v1
📚 API Documentation: http://localhost:3000/api-docs
🏥 Health Check: http://localhost:3000/v1/health
```

**Verify:** Visit http://localhost:3000/v1/health - should return status: "ok"

---

## Step 4: Start Stripe Webhook Listener

**Open a new terminal:**

```bash
# Login to Stripe CLI (first time only)
stripe login

# Start webhook forwarding
stripe listen --forward-to http://localhost:3000/webhooks/stripe
```

**Expected output:**
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

**IMPORTANT:** Copy the `whsec_xxxxx` secret!

**Paste it into `/api/.env`:**
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Restart your backend server** (Ctrl+C and `npm run start:dev` again)

---

## Step 5: Start Frontend Server

**Open a new terminal:**

```bash
# In /frontend directory
cd frontend
npm run dev
```

**Expected output:**
```
▲ Next.js 14.x.x
- Local: http://localhost:3001
```

---

## Step 6: Test Scenarios

### 📋 Test 1: Subscribe to Pro Plan

**Goal:** Test subscription checkout and webhook handling

1. **Get your Pro price ID** from the seed output or `stripe.prices.json`

2. **Create a test checkout link:**

   Open Postman/Insomnia or use curl:

   ```bash
   curl -X POST http://localhost:3000/payments/checkout/subscription \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TEST_JWT" \
     -d '{"priceId": "price_xxxxx"}'
   ```

   **Response:**
   ```json
   {
     "sessionId": "cs_test_xxxxx",
     "url": "https://checkout.stripe.com/c/pay/cs_test_xxxxx"
   }
   ```

3. **Open the checkout URL** in your browser

4. **Use Stripe test card:**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

5. **Complete checkout**

6. **Watch the webhook terminal** - you should see:
   ```
   [200] POST http://localhost:3000/webhooks/stripe [evt_xxxxx]
   ```

7. **Verify in database:**
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM subscriptions WHERE user_id='YOUR_USER_ID';"
   ```

   Should show an `active` subscription!

8. **Verify in database:**
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM orders WHERE type='subscription';"
   ```

   Should show a subscription order!

**✅ Success criteria:**
- Webhook received (200 status)
- Subscription created in DB with status `active`
- Order created with type `subscription`

---

### 📋 Test 2: One-Time Template Purchase

**Goal:** Test one-time purchase and entitlement creation

1. **Create template checkout:**

   ```bash
   curl -X POST http://localhost:3000/payments/checkout/template \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TEST_JWT" \
     -d '{
       "templateCode": "incorporation-delaware",
       "amountCents": 4900,
       "currency": "eur"
     }'
   ```

2. **Complete checkout** (same test card as above)

3. **Watch webhook** - should process `checkout.session.completed`

4. **Verify entitlement created:**
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM document_entitlements WHERE user_id='YOUR_USER_ID';"
   ```

   Should show:
   - `template_code`: incorporation-delaware
   - `single_use`: true
   - `used`: false
   - `expires_at`: 30 minutes from now

5. **Verify order created:**
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM orders WHERE type='template';"
   ```

**✅ Success criteria:**
- Webhook received
- Order created with `template_code`
- Document entitlement created with 30-min expiry

---

### 📋 Test 3: Generate Document with Subscription

**Goal:** Verify subscription grants access

**Prerequisites:** You completed Test 1 and have an active subscription

1. **Check access:**
   ```bash
   # In your backend, test the EntitlementsService
   # (You can create a test endpoint for this)
   ```

2. **Try to generate a document** via your generate endpoint

3. **Expected:** Access granted, no entitlement consumed (subscription = unlimited)

**✅ Success criteria:**
- Generation succeeds
- No entitlement consumed (subscriptions are not consumed)

---

### 📋 Test 4: Generate Document with One-Time Purchase

**Goal:** Verify one-time entitlement is consumed

**Prerequisites:** You completed Test 2 and have an unused entitlement

1. **Generate document** for `incorporation-delaware`

2. **Verify entitlement consumed:**
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM document_entitlements WHERE user_id='YOUR_USER_ID';"
   ```

   Should show:
   - `used`: true
   - `used_at`: current timestamp

3. **Try to generate again**

4. **Expected:** 403 Forbidden (entitlement already used)

**✅ Success criteria:**
- First generation succeeds
- Entitlement marked as `used`
- Second generation fails with 403

---

### 📋 Test 5: Billing Portal

**Goal:** Test subscription management

**Prerequisites:** Active subscription from Test 1

1. **Get user's Stripe customer ID:**
   ```bash
   psql $DATABASE_URL -c "SELECT stripe_customer_id FROM users WHERE id='YOUR_USER_ID';"
   ```

2. **Create portal session:**
   ```bash
   curl -X POST http://localhost:3000/payments/portal \
     -H "Authorization: Bearer YOUR_TEST_JWT"
   ```

3. **Open the returned URL** in browser

4. **Test actions:**
   - Update payment method
   - Cancel subscription
   - View invoices

5. **Cancel subscription** and watch webhook:
   ```
   [200] POST http://localhost:3000/webhooks/stripe [evt_xxxxx]
   customer.subscription.deleted
   ```

6. **Verify in DB:**
   ```bash
   psql $DATABASE_URL -c "SELECT status FROM subscriptions WHERE user_id='YOUR_USER_ID';"
   ```

   Should show `canceled`

**✅ Success criteria:**
- Portal opens successfully
- Subscription updates sync to DB via webhooks

---

### 📋 Test 6: Referral Checkout (Stripe Connect)

**Goal:** Test lawyer referral with €25 fixed fee

**Prerequisites:**
- A lawyer/partner record in the `partners` table
- Lawyer has `stripe_account_id` set (you'll need to create a Stripe Connect account for testing)

**Note:** This test requires additional Stripe Connect setup. For now, you can skip this or manually create a Connect test account.

1. **Create a test Connect account:**
   ```bash
   # In Stripe Dashboard → Connect → Accounts
   # Or use Stripe CLI: stripe accounts create
   ```

2. **Update lawyer record:**
   ```bash
   psql $DATABASE_URL -c "UPDATE partners SET stripe_account_id='acct_xxxxx' WHERE id='LAWYER_ID';"
   ```

3. **Create referral checkout:**
   ```bash
   curl -X POST http://localhost:3000/payments/checkout/referral \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TEST_JWT" \
     -d '{
       "lawyerId": "LAWYER_UUID",
       "referralId": "REFERRAL_UUID",
       "amountCents": 20000,
       "currency": "eur"
     }'
   ```

4. **Complete checkout**

5. **Verify order:**
   ```bash
   psql $DATABASE_URL -c "SELECT * FROM orders WHERE type='referral';"
   ```

   Should show:
   - `amount_gross_cents`: 20000 (€200)
   - `platform_fee_fixed_cents`: 2500 (€25)
   - `amount_platform_cents`: 2500
   - `amount_lawyer_cents`: 17500 (€175)

**✅ Success criteria:**
- Checkout succeeds
- Platform fee correctly set to €25
- Transfer destination set to lawyer's Connect account

---

## 🔍 Debugging Tips

### Webhook not working?

1. **Check webhook listener is running:**
   ```bash
   stripe listen --forward-to http://localhost:3000/webhooks/stripe
   ```

2. **Verify webhook secret in .env:**
   ```bash
   grep STRIPE_WEBHOOK_SECRET api/.env
   ```

3. **Check backend logs** for signature verification errors

4. **Manually trigger test event:**
   ```bash
   stripe trigger checkout.session.completed
   ```

### Checkout not redirecting?

1. **Check browser console** for errors

2. **Verify API endpoint** is returning a URL:
   ```json
   { "url": "https://checkout.stripe.com/..." }
   ```

3. **Check CORS settings** in backend

### Database not updating?

1. **Check webhook received:**
   - Look at Stripe CLI output
   - Should show `[200]` response

2. **Check backend logs** for errors

3. **Manually verify in Stripe Dashboard:**
   - Developers → Webhooks → click on endpoint
   - Check "Recent attempts"

---

## 📊 Monitoring Checklist

After each test, verify:

- [ ] Webhook received (200 status in Stripe CLI)
- [ ] Database updated correctly
- [ ] No errors in backend logs
- [ ] Stripe Dashboard shows the event

---

## 🎯 Complete Test Suite Summary

| Test | What it checks | Success metric |
|------|----------------|----------------|
| 1. Subscribe to Pro | Subscription checkout + webhook | Subscription in DB with `active` status |
| 2. One-time purchase | Template checkout + entitlement | Entitlement created, expires in 30min |
| 3. Generate with subscription | Access control with subscription | Generation succeeds, unlimited |
| 4. Generate with one-time | Entitlement consumption | First succeeds, second fails (403) |
| 5. Billing portal | Subscription management | Updates sync via webhooks |
| 6. Referral checkout | Stripe Connect fee split | Platform gets €25, lawyer gets rest |

---

## ✅ All Tests Passed?

You're ready for production deployment! See `STRIPE_PRODUCTION_DEPLOYMENT.md`

---

## 🆘 Common Issues

### Issue: "STRIPE_SECRET_KEY is not configured"
**Fix:** Check `/api/.env` has the correct key (starts with `sk_test_`)

### Issue: Webhook signature verification failed
**Fix:**
1. Restart backend after updating `STRIPE_WEBHOOK_SECRET`
2. Ensure webhook listener is running

### Issue: Database connection error
**Fix:** Verify `DATABASE_URL` in `.env` and database is running

### Issue: 403 Forbidden when generating
**Expected!** This means the paywall is working. Purchase a template or subscribe first.

---

**Next:** [Production Deployment Guide](./STRIPE_PRODUCTION_DEPLOYMENT.md)
