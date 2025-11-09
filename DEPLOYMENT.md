# LegalMind Deployment Guide

This document provides step-by-step instructions for deploying the LegalMind application to production.

## Architecture Overview

- **Frontend**: Next.js 14 app deployed to **Vercel**
- **Backend**: NestJS API deployed to **Render**
- **Database**: PostgreSQL on Render
- **Cache/Queue**: Redis on Render
- **Storage**: AWS S3 for document storage
- **Payments**: Stripe
- **Auth**: Clerk.js

---

## Prerequisites

Before deploying, ensure you have:

### Required Accounts
- [ ] GitHub account with repository access
- [ ] Vercel account (https://vercel.com)
- [ ] Render account (https://render.com)
- [ ] AWS account with S3 bucket created
- [ ] Stripe account with API keys
- [ ] Clerk.js account with app configured
- [ ] SendGrid account for email (optional)

### Required CLI Tools
```bash
# Install Vercel CLI
npm i -g vercel@latest

# Install Render CLI
npm i -g @renderinc/cli@latest
# OR: brew install render

# Install Stripe CLI (optional, for webhooks testing)
brew install stripe/stripe-cli/stripe
# OR: choco install stripe
```

---

## Backend Deployment (Render)

### Step 1: Set Up Environment Variables

1. Go to Render Dashboard: https://dashboard.render.com/
2. Navigate to your backend service
3. Go to **Environment** tab
4. Add the following environment variables from `api/.env.example`:

#### Required Variables
```bash
# Database (auto-populated by Render)
DATABASE_URL=<from Render PostgreSQL>
REDIS_URL=<from Render Redis>

# Authentication (from Clerk.js)
CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
JWT_SECRET=<generate strong random string>
JWT_REFRESH_SECRET=<generate strong random string>

# Stripe (from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# AWS S3 (from AWS Console)
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_REGION=eu-west-1
S3_BUCKET=legalmind-documents

# Email (from SendGrid)
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@legalmind.tech

# Application
NODE_ENV=production
FRONTEND_URL=https://legalmind.tech
CORS_ORIGINS=https://legalmind.tech,https://www.legalmind.tech
```

### Step 2: Deploy Using Render YAML

The project includes `api/render.yaml` which configures:
- PostgreSQL database
- Redis instance
- NestJS web service

#### Deploy via Render Dashboard:
1. Go to https://dashboard.render.com/
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Select the `api/render.yaml` file
5. Click **Apply**

#### Deploy via CLI:
```bash
cd api
render deploy
```

### Step 3: Run Database Migrations

Once deployed, run migrations:
```bash
# SSH into Render instance
render ssh legalmind-api

# Run migrations (once implemented)
npm run migration:run
```

### Step 4: Set Up Stripe Webhooks

1. Go to Stripe Dashboard: https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Enter URL: `https://api.legalmind.tech/v1/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy webhook secret and add to Render environment as `STRIPE_WEBHOOK_SECRET`

---

## Frontend Deployment (Vercel)

### Step 1: Set Up Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Navigate to your project
3. Go to **Settings** → **Environment Variables**
4. Add the following from `demo/.env.example`:

```bash
# API
NEXT_PUBLIC_API_URL=https://api.legalmind.tech/v1

# Authentication (from Clerk.js)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Application
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_APP_URL=https://legalmind.tech
```

### Step 2: Deploy Using Vercel CLI

```bash
cd demo

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Step 3: Deploy via GitHub Integration

The project includes `.github/workflows/frontend-ci-cd.yml` which automatically:
1. Runs tests and linting
2. Builds the application
3. Deploys to Vercel on push to `main`

#### Configure GitHub Secrets:
1. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   ```
   VERCEL_TOKEN=<from Vercel Dashboard>
   VERCEL_ORG_ID=<from Vercel Dashboard>
   VERCEL_PROJECT_ID=<from Vercel Dashboard>
   ```

### Step 4: Configure Custom Domain

1. In Vercel Dashboard, go to **Settings** → **Domains**
2. Add your domain: `legalmind.tech`
3. Add DNS records as instructed by Vercel
4. Wait for SSL certificate to provision (~5 minutes)

---

## Database Setup

### Step 1: Create Database Schema

Once backend is deployed, run:
```bash
# Connect to Render shell
render ssh legalmind-api

# Run migrations (once implemented)
npm run migration:run
```

### Step 2: Seed Data (Optional)

```bash
# Import template packs
npm run seed:templates

# Import sample data for development
npm run seed:dev
```

---

## AWS S3 Setup

### Step 1: Create S3 Buckets

1. Go to AWS Console: https://console.aws.amazon.com/s3/
2. Create two buckets:
   - `legalmind-documents` (for generated documents)
   - `legalmind-previews` (for HTML previews)
3. Configure CORS policy for both buckets:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://legalmind.tech",
      "https://www.legalmind.tech"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### Step 2: Create IAM User

1. Go to IAM Console: https://console.aws.amazon.com/iam/
2. Create new user: `legalmind-api`
3. Attach policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::legalmind-documents/*",
        "arn:aws:s3:::legalmind-previews/*"
      ]
    }
  ]
}
```
4. Generate access keys and add to Render environment

---

## Post-Deployment Checklist

### Backend (Render)
- [ ] Service is running (check Render dashboard)
- [ ] Database is connected and migrations ran
- [ ] Redis is connected
- [ ] Health check endpoint responds: `https://api.legalmind.tech/v1/health`
- [ ] Swagger docs accessible (non-prod): `https://api.legalmind.tech/api-docs`
- [ ] Stripe webhooks are configured
- [ ] S3 buckets are accessible
- [ ] Email sending works (test with SendGrid)

### Frontend (Vercel)
- [ ] Site is live: https://legalmind.tech
- [ ] Custom domain configured with SSL
- [ ] API calls work (check Network tab)
- [ ] Clerk.js authentication works
- [ ] Stripe checkout works
- [ ] Google Analytics tracking works

### Integration Tests
- [ ] Sign up new user → receives email
- [ ] Purchase subscription → Stripe checkout works
- [ ] Generate document → PDF/DOCX downloads work
- [ ] Referral system → attorney recommendations appear
- [ ] Admin panel → audit logs visible

---

## Monitoring & Maintenance

### Logs
```bash
# View Render logs
render logs legalmind-api --tail

# View Vercel logs
vercel logs legalmind-frontend
```

### Monitoring Tools (Recommended)
- **Error Tracking**: Sentry (https://sentry.io)
- **Uptime Monitoring**: Better Uptime (https://betteruptime.com)
- **Analytics**: Google Analytics + PostHog
- **Performance**: Vercel Analytics

### Backup Strategy
- Database: Render auto-backups (daily)
- S3 Documents: Enable versioning
- Code: GitHub (automatic)

---

## Rollback Procedure

### Rollback Backend (Render)
```bash
# Via Render Dashboard
1. Go to Deploy tab
2. Select previous successful deploy
3. Click "Redeploy"

# Via CLI
render rollback legalmind-api
```

### Rollback Frontend (Vercel)
```bash
# Via Vercel Dashboard
1. Go to Deployments tab
2. Find previous deployment
3. Click "..." → "Promote to Production"

# Via CLI
vercel rollback
```

---

## Troubleshooting

### Backend Issues

#### Service won't start
- Check environment variables are set
- Check database connection
- View logs: `render logs legalmind-api --tail`

#### 502/503 Errors
- Service may be starting (wait 1-2 minutes)
- Check health endpoint
- Check memory/CPU usage in Render dashboard

#### Database connection errors
- Verify DATABASE_URL is correct
- Check database is running
- Check SSL settings

### Frontend Issues

#### Build fails
- Check all environment variables are set
- Check for TypeScript errors locally: `npm run build`
- View build logs in Vercel dashboard

#### API calls fail
- Check NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Check browser console for errors

---

## Security Best Practices

- [ ] All environment variables use production values (no test keys)
- [ ] JWT secrets are strong random strings (32+ characters)
- [ ] CORS origins only allow production domains
- [ ] API rate limiting is enabled
- [ ] Database SSL is enabled
- [ ] S3 buckets are not public
- [ ] Stripe webhooks use signature verification
- [ ] All sensitive endpoints require authentication

---

## Support

For deployment issues:
- Check Render status: https://render.com/status
- Check Vercel status: https://vercel.com/status
- Contact: support@legalmind.tech
