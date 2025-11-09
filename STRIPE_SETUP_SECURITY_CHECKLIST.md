# 🔒 Stripe Setup Security Checklist

## IMPORTANT: Never commit or share your secret keys publicly!

This checklist tells you exactly where to paste your Stripe keys **locally**. I will never echo or display your keys.

---

## 📝 Local Development Setup

### Step 1: Backend Environment Variables

**File:** `/api/.env`

Paste your keys in these exact locations:

```bash
# Copy from Stripe Dashboard → Developers → API keys
STRIPE_SECRET_KEY=<PASTE_YOUR_sk_test_KEY_HERE>

# Leave empty for now - will be filled after webhook setup
STRIPE_WEBHOOK_SECRET=<WILL_BE_FILLED_AFTER_STRIPE_CLI_SETUP>

# Optional - only if using Stripe Connect
STRIPE_CONNECT_CLIENT_ID=<PASTE_YOUR_ca_xxx_HERE_IF_APPLICABLE>

# Platform fees (already configured)
PLATFORM_FEE_FIXED_CENTS=2500
PLATFORM_FEE_PERCENT=10
```

### Step 2: Frontend Environment Variables

**File:** `/frontend/.env.local`

```bash
# Copy from Stripe Dashboard → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<PASTE_YOUR_pk_test_KEY_HERE>

# API endpoint
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_BRAND_NAME=Legmint
```

---

## ✅ Security Verification Checklist

- [ ] **Both** `.env` and `.env.local` are listed in `.gitignore`
- [ ] You have **NOT** committed any files containing actual keys
- [ ] You copied keys **directly** from Stripe Dashboard (not from chat/email)
- [ ] Test keys start with `sk_test_` and `pk_test_` (not live keys!)
- [ ] `.env.example` files contain only **placeholders**, not real keys

---

## 🔄 Key Rotation (If You Accidentally Exposed Keys)

If you accidentally posted keys in plain text (chat, GitHub, etc.):

1. **Immediately** go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
2. Click **"Reveal test key token"** on the exposed key
3. Click **"Roll key"** or **"Delete"**
4. Generate a new key
5. Update your local `.env` files with the **new** key
6. Restart your development servers

---

## 🚀 Webhook Secret Setup (Step 3 - After Implementation)

After the webhook handler is implemented, you'll run:

```bash
# This command will output a webhook signing secret
stripe listen --forward-to http://localhost:3000/webhooks/stripe
```

**Copy the `whsec_...` secret** from the terminal output and paste it into:

**File:** `/api/.env`
```bash
STRIPE_WEBHOOK_SECRET=<PASTE_whsec_OUTPUT_FROM_STRIPE_CLI>
```

Then restart your backend server.

---

## 🌐 Production Setup (Later)

For production deployment:

1. Switch to **live keys** (start with `sk_live_` and `pk_live_`)
2. Paste keys into:
   - **Backend:** Render/Railway/your host's environment variables dashboard
   - **Frontend:** Vercel/Netlify environment variables dashboard
3. Create production webhook at: Stripe Dashboard → Webhooks → Add endpoint
   - URL: `https://api.legmint.com/webhooks/stripe`
   - Copy the **production** `whsec_...` secret to backend env vars

---

## 🛡️ Security Best Practices

1. **Never log secret keys** in code or console
2. **Use test keys** for local development
3. **Rotate keys** if compromised
4. **Restrict API key permissions** in Stripe Dashboard if possible
5. **Enable webhook signature verification** (we do this automatically)
6. **Monitor** Stripe Dashboard for unexpected activity

---

## ✨ You're Ready!

Once you've pasted your keys in the two `.env` files above:

1. ✅ Backend knows how to process payments
2. ✅ Frontend knows how to redirect to Stripe Checkout
3. ✅ No secrets are in git
4. ✅ You can proceed with implementation

---

**Next Steps:** Run the database migrations and seed script.
