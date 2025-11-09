# Legmint Lawyer Partner Program - Deployment Guide

This guide covers the complete deployment of the Lawyer Partner Program, from initial setup to production deployment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Migration](#database-migration)
3. [Stripe Connect Setup](#stripe-connect-setup)
4. [Environment Configuration](#environment-configuration)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Integration](#frontend-integration)
7. [Webhook Configuration](#webhook-configuration)
8. [Testing Checklist](#testing-checklist)
9. [Production Deployment](#production-deployment)
10. [Post-Deployment](#post-deployment)
11. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Accounts

- ✅ Stripe account with Connect enabled
- ✅ AWS account (for S3 document storage)
- ✅ PostgreSQL database (cloud or self-hosted)
- ✅ Domain with SSL certificate
- ✅ SendGrid account (for emails)

### Development Environment

```bash
# Node.js version
node --version  # v18+ required

# Install dependencies
cd api && npm install
cd ../demo && npm install
```

---

## 2. Database Migration

### Step 1: Check Current Schema

```bash
cd api
npm run typeorm migration:generate -- -n InitialSchema
```

### Step 2: Run Migrations

The new entities (`LawyerApplication`, updated `Partner`) need to be synced:

```bash
# Development (with synchronize: true in config)
npm run start:dev

# Production (manual migration)
npm run typeorm migration:run
```

### Step 3: Verify Database Tables

Connect to your database and verify:

```sql
-- Check new tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('partners', 'lawyer_applications', 'referrals');

-- Check Partner entity has new columns
SELECT column_name FROM information_schema.columns
WHERE table_name = 'partners';
-- Should include: stripeAccountId, status, licenseNumber, languages, fullName
```

### Step 4: Seed Initial Data (Optional)

Create test lawyer accounts for development:

```sql
-- Create a test lawyer partner
INSERT INTO partners (
  id, name, fullName, email, jurisdiction,
  specializations, languages, bio,
  status, isActive, discountPercentage, commissionPercentage
) VALUES (
  gen_random_uuid(),
  'Jane Smith',
  'Jane Smith, Esq.',
  'jane.smith@lawfirm.com',
  'UK',
  ARRAY['Corporate Law', 'Contract Law'],
  ARRAY['English', 'French'],
  'Experienced corporate lawyer specializing in startup law and fundraising.',
  'active',
  true,
  20,
  15
);
```

---

## 3. Stripe Connect Setup

### Step 1: Enable Stripe Connect

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/settings/connect)
2. Navigate to **Settings → Connect**
3. Click **Get started** to enable Connect
4. Choose **Platform or marketplace** as your business type

### Step 2: Configure Connect Settings

**Branding:**
- Upload logo
- Set brand color
- Configure email notifications

**Platform Profile:**
- Business name: Legmint
- Business type: Marketplace/Platform
- Industry: Legal Services
- Country: [Your country]

**Onboarding Settings:**
- Enable **Standard accounts** (recommended)
- Set up OAuth redirect URLs:
  - Return URL: `https://legmint.com/lawyers/connect/success`
  - Refresh URL: `https://legmint.com/lawyers/connect/refresh`

### Step 3: Get Stripe Connect Client ID

```bash
# From Stripe Dashboard → Settings → Connect → Integration
# Copy "Client ID" (starts with ca_)
STRIPE_CONNECT_CLIENT_ID=ca_xxxxx
```

### Step 4: Configure Platform Fees

In Stripe Dashboard:
1. Go to **Connect → Settings**
2. Configure **Application fees**
3. Set default: 15% (or as configured)

### Step 5: Test in Stripe Test Mode

```bash
# Use test mode credentials first
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Create a test Connect account
curl -X POST https://api.stripe.com/v1/accounts \
  -u sk_test_...: \
  -d type=standard \
  -d email=test@example.com \
  -d country=GB
```

---

## 4. Environment Configuration

### Step 1: Copy Environment Template

```bash
cd api
cp .env.example .env
```

### Step 2: Configure Required Variables

**Stripe Connect Variables:**
```env
# Stripe Core
STRIPE_SECRET_KEY=sk_live_xxxxx  # Production: sk_live_
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe Connect
STRIPE_CONNECT_CLIENT_ID=ca_xxxxx
PLATFORM_FEE_PERCENT=15
LAWYER_REFERRAL_DEFAULT_AMOUNT=20000  # €200 in cents
```

**Application URLs:**
```env
NODE_ENV=production
API_BASE_URL=https://api.legmint.com
FRONTEND_URL=https://legmint.com
```

**Database:**
```env
DATABASE_URL=postgresql://user:password@host:5432/legmint
DATABASE_SSL=true
```

**AWS S3:**
```env
AWS_ACCESS_KEY_ID=AKIAXXXXX
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=eu-west-1
S3_BUCKET=legmint-documents-prod
```

**Email:**
```env
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@legmint.com
EMAIL_SUPPORT=lawyers@legmint.com
```

### Step 3: Validate Configuration

```bash
npm run config:validate  # If you have a validation script
```

---

## 5. Backend Deployment

### Step 1: Build the Application

```bash
cd api
npm run build
```

### Step 2: Deploy to Your Platform

#### Option A: Render (Recommended)

```yaml
# render.yaml
services:
  - type: web
    name: legmint-api
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false  # Set in Render dashboard
      - key: STRIPE_SECRET_KEY
        sync: false
```

Deploy:
```bash
git push origin main  # Render auto-deploys from GitHub
```

#### Option B: Docker (Self-hosted)

```bash
# Build Docker image
docker build -t legmint-api:latest -f api/Dockerfile .

# Run container
docker run -d \
  --name legmint-api \
  --env-file api/.env \
  -p 3000:3000 \
  legmint-api:latest
```

#### Option C: Fly.io

```bash
fly launch
fly deploy
```

### Step 3: Verify API Health

```bash
curl https://api.legmint.com/v1/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00Z",
  "version": "1.0.0"
}
```

### Step 4: Test Lawyer Endpoints

```bash
# Test lawyer application endpoint
curl -X POST https://api.legmint.com/v1/lawyers/apply \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Lawyer",
    "email": "test@lawfirm.com",
    "jurisdiction": "UK",
    "licenseNumber": "TEST123",
    "specializations": ["Corporate Law"],
    "languages": ["English"],
    "bio": "Test bio",
    "termsAccepted": true
  }'
```

---

## 6. Frontend Integration

### Step 1: Add API Configuration

```typescript
// demo/src/lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.legmint.com';

export const lawyerApi = {
  apply: (data: LawyerApplicationDto) =>
    fetch(`${API_BASE_URL}/v1/lawyers/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  connectStripe: (partnerId: string) =>
    fetch(`${API_BASE_URL}/v1/lawyers/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerId,
        returnUrl: `${window.location.origin}/lawyers/connect/success`,
        refreshUrl: `${window.location.origin}/lawyers/connect/refresh`,
      }),
    }),
};
```

### Step 2: Create Lawyer Pages

**Onboarding Page:**
```bash
demo/src/app/lawyers/apply/page.tsx
```

**Dashboard Page:**
```bash
demo/src/app/lawyers/dashboard/page.tsx
```

**Terms Page:**
```bash
demo/src/app/lawyers/terms/page.tsx
```

### Step 3: Deploy Frontend

```bash
cd demo
npm run build

# Deploy to Vercel
vercel --prod

# Or build for static hosting
npm run export
```

---

## 7. Webhook Configuration

### Step 1: Create Webhook Endpoint

In your backend, add webhook handler:

```typescript
// api/src/controllers/webhooks.controller.ts
@Post('webhooks/stripe')
async handleStripeWebhook(
  @Headers('stripe-signature') signature: string,
  @Req() req: Request,
) {
  const event = this.stripeService.verifyWebhookSignature(
    req.body,
    signature,
  );

  switch (event.type) {
    case 'account.updated':
      await this.handleAccountUpdated(event.data.object);
      break;
    case 'charge.succeeded':
      await this.handleChargeSucceeded(event.data.object);
      break;
    case 'transfer.paid':
      await this.handleTransferPaid(event.data.object);
      break;
  }

  return { received: true };
}
```

### Step 2: Register Webhooks in Stripe

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. URL: `https://api.legmint.com/v1/webhooks/stripe`
4. Select events:
   - `account.updated` - Connect account status changes
   - `charge.succeeded` - Successful payments
   - `transfer.paid` - Lawyer payouts
   - `payment_intent.succeeded` - Payment completion
   - `customer.subscription.updated` - Subscription changes

5. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Step 3: Test Webhooks

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/v1/webhooks/stripe

# Trigger test event
stripe trigger payment_intent.succeeded
```

---

## 8. Testing Checklist

### Functional Tests

#### Lawyer Onboarding

- [ ] Application form submits successfully
- [ ] Email confirmation sent
- [ ] Application appears in admin dashboard
- [ ] Document upload works (license, insurance, ID)
- [ ] Stripe Connect redirect works
- [ ] After Stripe onboarding, lawyer account activated
- [ ] Terms acceptance logged in database

#### Lawyer Dashboard

- [ ] Login/authentication works
- [ ] Profile displays correctly
- [ ] Referrals list loads
- [ ] Payment history displays
- [ ] Stripe balance shows correctly
- [ ] Profile editing saves

#### Referral Flow

- [ ] User completes template generation
- [ ] "Get lawyer review" modal appears
- [ ] Lawyer list filtered by jurisdiction
- [ ] Stripe Checkout opens with correct amount
- [ ] Payment splits correctly (85% lawyer, 15% platform)
- [ ] Lawyer receives notification of new referral
- [ ] User receives confirmation email

#### Admin Functions

- [ ] Pending applications list loads
- [ ] Application approval/rejection works
- [ ] Email notifications sent on approval
- [ ] Partner status updates correctly
- [ ] Reporting dashboard shows data

### Security Tests

- [ ] JWT authentication required for protected endpoints
- [ ] Only admins can approve applications
- [ ] Lawyers can only access their own data
- [ ] Document uploads validated (file type, size)
- [ ] SQL injection protection tested
- [ ] XSS protection verified
- [ ] CORS configured correctly

### Payment Tests

- [ ] Test mode payment succeeds
- [ ] Platform fee calculated correctly
- [ ] Stripe Connect transfer successful
- [ ] Webhook events processed
- [ ] Failed payments handled gracefully
- [ ] Refunds work (if applicable)

### Performance Tests

- [ ] API response time < 500ms
- [ ] Database queries optimized
- [ ] File uploads < 5MB complete successfully
- [ ] Dashboard loads with 100+ referrals
- [ ] Concurrent user testing (50+ users)

---

## 9. Production Deployment

### Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Database backed up
- [ ] Stripe in live mode (not test mode)
- [ ] SSL certificates valid
- [ ] DNS records configured
- [ ] Monitoring enabled (Sentry, LogRocket, etc.)
- [ ] Rate limiting configured
- [ ] GDPR compliance verified
- [ ] Terms for Lawyers finalized
- [ ] Lawyer onboarding email templates ready

### Deployment Steps

#### 1. Database Backup

```bash
pg_dump -h production-db-host -U user -d legmint > backup_$(date +%Y%m%d).sql
```

#### 2. Run Migrations

```bash
npm run typeorm migration:run
```

#### 3. Deploy Backend

```bash
git tag -a v1.0.0 -m "Lawyer Partner Program Launch"
git push origin v1.0.0

# Trigger production deployment
npm run deploy:production
```

#### 4. Deploy Frontend

```bash
cd demo
vercel --prod
```

#### 5. Smoke Tests

```bash
# Health check
curl https://api.legmint.com/v1/health

# Test lawyer application (with real data)
curl -X POST https://api.legmint.com/v1/lawyers/apply \
  -H "Content-Type: application/json" \
  -d @test-lawyer-application.json
```

### Switch Stripe to Live Mode

1. Go to Stripe Dashboard
2. Toggle from **Test mode** to **Live mode**
3. Update environment variables:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
4. Restart API server

---

## 10. Post-Deployment

### Monitor Critical Metrics

**Application Metrics:**
- Lawyer applications submitted
- Approval rate
- Stripe Connect onboarding completion rate
- Referral conversion rate
- Average payment amount
- Platform fee revenue

**Technical Metrics:**
- API error rate
- Average response time
- Database connection pool usage
- S3 upload success rate
- Webhook delivery success rate

### Set Up Alerts

```yaml
# Example: PagerDuty/Datadog alerts
alerts:
  - name: High API Error Rate
    condition: error_rate > 5%
    severity: critical

  - name: Failed Stripe Webhook
    condition: webhook_failure_count > 10
    severity: high

  - name: Lawyer Application Failed
    condition: application_creation_error
    severity: medium
```

### Initial Lawyer Outreach

1. **Email Campaign:**
   - Send to legal network
   - Highlight benefits (new clients, passive income)
   - Provide onboarding link

2. **Documentation:**
   - Create lawyer help center
   - Video tutorials for dashboard
   - FAQs about payments and referrals

3. **Support:**
   - Dedicated email: lawyers@legmint.com
   - Live chat for first month
   - Weekly check-ins with early partners

---

## 11. Troubleshooting

### Common Issues

#### 1. Stripe Connect Onboarding Fails

**Symptoms:** Lawyer redirected to error page after clicking Stripe link

**Solutions:**
- Verify `STRIPE_CONNECT_CLIENT_ID` is correct
- Check redirect URLs match Stripe dashboard settings
- Ensure lawyer's country is supported by Stripe
- Check Stripe account status (not restricted)

```bash
# Debug: Check Stripe account status
stripe accounts retrieve acct_xxxxx
```

#### 2. Payment Split Not Working

**Symptoms:** Entire payment goes to platform, lawyer receives nothing

**Solutions:**
- Verify `stripeAccountId` is saved in database
- Check `application_fee_amount` calculation
- Ensure Stripe Connect account is fully onboarded
- Verify platform is in live mode (not test with live account)

```typescript
// Debug log in createLawyerReferralCheckout
console.log({
  amount,
  platformFeeAmount,
  lawyerStripeAccountId,
  lawyerReceives: amount - platformFeeAmount,
});
```

#### 3. Lawyer Dashboard Not Loading

**Symptoms:** 401 Unauthorized or 403 Forbidden errors

**Solutions:**
- Verify JWT token is being sent in headers
- Check lawyer has `partnerId` in token claims
- Ensure LawyerController auth guards are correct
- Verify database `partnerId` matches token

```bash
# Decode JWT to inspect claims
echo "eyJhbGc..." | base64 --decode
```

#### 4. Document Upload Fails

**Symptoms:** Upload returns 500 error

**Solutions:**
- Check S3 bucket permissions (public write not needed, use IAM role)
- Verify file size under limit (default 10MB)
- Check file type allowed (PDF, PNG, JPG)
- Ensure S3 bucket exists and is in correct region

```bash
# Test S3 upload manually
aws s3 cp test.pdf s3://legmint-documents-prod/test/
```

#### 5. Webhook Events Not Processing

**Symptoms:** Stripe events firing but not updating database

**Solutions:**
- Check webhook endpoint is publicly accessible
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- Ensure webhook handler is registered in routes
- Check logs for signature verification errors

```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/v1/webhooks/stripe
stripe trigger payment_intent.succeeded
```

### Debug Commands

```bash
# Check database connections
SELECT * FROM pg_stat_activity WHERE datname = 'legmint';

# View recent lawyer applications
SELECT id, email, status, "createdAt" FROM partners
ORDER BY "createdAt" DESC LIMIT 10;

# Check Stripe Connect accounts
SELECT id, email, "stripeAccountId", status FROM partners
WHERE "stripeAccountId" IS NOT NULL;

# View referral conversion funnel
SELECT
  status,
  COUNT(*) as count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM referrals
GROUP BY status;
```

### Support Contacts

| Issue Type | Contact | Response Time |
|------------|---------|---------------|
| Stripe Technical | Stripe Support | 24h |
| Payment Issues | lawyers@legmint.com | 4h |
| Database/Infra | devops@legmint.com | 2h |
| Legal/Compliance | legal@legmint.com | 48h |

---

## Next Steps

After successful deployment:

1. ✅ **Onboard pilot lawyers** (5-10 trusted partners)
2. ✅ **Collect feedback** on dashboard and payment flow
3. ✅ **Monitor metrics** for first month
4. ✅ **Iterate** based on lawyer feedback
5. ✅ **Scale** to broader legal network
6. ✅ **Expand** to new jurisdictions
7. ✅ **Add features** (reviews, ratings, direct booking)

---

## Resources

- [Stripe Connect Documentation](https://stripe.com/docs/connect)
- [TypeORM Migrations Guide](https://typeorm.io/migrations)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Legmint API Specification](/API_SPECIFICATION_V3.yaml)
- [Terms for Lawyers](/TERMS_FOR_LAWYERS.md)

---

**Version:** 1.0
**Last Updated:** January 2025
**Maintained By:** Legmint Engineering Team
