# Environment Variables - Legmint

This document lists all required environment variables for deploying Legmint to production.

## Frontend (Vercel)

### Required

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://api.legmint.com

# Branding
NEXT_PUBLIC_BRAND_NAME=Legmint

# Stripe (Optional - for client-side price display)
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_xxxxx
```

### How to Set (Vercel)

1. Go to your Vercel project → Settings → Environment Variables
2. Add each variable for Production, Preview, and Development environments
3. Redeploy after adding variables

## Backend (Render / Your API Server)

### Required

```bash
# Clerk Authentication
CLERK_SECRET_KEY=sk_live_xxxxx

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@legmint.com

# AWS S3 (for document storage)
AWS_ACCESS_KEY_ID=AKIAxxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=eu-west-1
S3_BUCKET_NAME=legmint-documents-prod

# Frontend URL (for CORS and redirects)
FRONTEND_URL=https://legmint.com
API_BASE_URL=https://api.legmint.com

# Node Environment
NODE_ENV=production
```

### How to Set (Render)

1. Go to your Render service → Environment
2. Add each variable as a Secret File or Environment Variable
3. Redeploy after adding variables

## Stripe Product Setup

Before deploying, create Stripe products and prices:

### Products

1. **Pro Monthly**
   - Name: Legmint Pro (Monthly)
   - Price: €99/month
   - Billing: Recurring monthly
   - Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY`

2. **Pro Yearly**
   - Name: Legmint Pro (Annual)
   - Price: €1009.20/year (99 * 12 * 0.85 = 15% discount)
   - Billing: Recurring yearly
   - Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY`

### Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://api.legmint.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

## Clerk Setup

1. Go to Clerk Dashboard → API Keys
2. Copy:
   - Publishable Key → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Secret Key → `CLERK_SECRET_KEY`
3. Configure domains:
   - Production: `legmint.com`
   - Preview: `*.vercel.app` (if using Vercel previews)

## SendGrid Setup

1. Create SendGrid account
2. Go to Settings → API Keys
3. Create API Key with "Mail Send" permissions
4. Copy API Key → `SENDGRID_API_KEY`
5. Verify sender email domain

## AWS S3 Setup

1. Create S3 bucket: `legmint-documents-prod`
2. Enable versioning and encryption
3. Create IAM user with S3 access
4. Attach policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::legmint-documents-prod/*"
    }
  ]
}
```

5. Copy Access Key ID and Secret → `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

## Security Notes

⚠️ **NEVER commit secrets to git**
⚠️ Use different keys for development/staging/production
⚠️ Rotate keys regularly
⚠️ Use Stripe test mode for development
⚠️ Enable 2FA on all service accounts

## Verification Checklist

Before going live, verify:

- [ ] All environment variables are set
- [ ] Stripe webhook is receiving events
- [ ] Clerk authentication works
- [ ] Email sending works (SendGrid)
- [ ] Document generation saves to S3
- [ ] Database connection is stable
- [ ] Frontend can call backend API
- [ ] CORS is configured correctly
- [ ] SSL certificates are valid
- [ ] DNS is pointing to correct servers
