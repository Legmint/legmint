# Legmint Rebrand - Deployment Plan

**Project:** LegalMind → Legmint Rebrand
**Date:** January 2025
**Version:** 1.0.0

---

## 🎯 Deployment Overview

This document outlines the complete deployment strategy for the Legmint rebrand, including pre-deployment preparation, deployment steps, verification procedures, and rollback plans.

---

## 📋 Pre-Deployment Checklist

### 1. Code Review & Testing
- [ ] All code changes reviewed and approved
- [ ] QA checklist completed (see REBRAND_QA_CHECKLIST.md)
- [ ] Local testing passed (frontend + backend)
- [ ] Integration testing completed
- [ ] No critical bugs or regressions identified

### 2. Backups
- [ ] **Database Backup** created:
  ```bash
  pg_dump -h localhost -U postgres legalmind > backups/legalmind_backup_$(date +%Y%m%d_%H%M%S).sql
  ```
- [ ] **S3 Buckets** verified with versioning enabled
- [ ] **Environment Variables** documented and saved:
  ```bash
  # Frontend
  cat demo/.env.local > backups/frontend_env_backup.txt

  # Backend
  cat api/.env > backups/backend_env_backup.txt
  ```

### 3. Git Tagging
- [ ] Create final pre-rebrand tag:
  ```bash
  git tag -a v1.0.0-legalmind-final -m "Final LegalMind version before rebrand"
  git push origin v1.0.0-legalmind-final
  ```
- [ ] Create rebrand tag:
  ```bash
  git tag -a v1.0.0-legmint -m "Legmint rebrand launch"
  git push origin v1.0.0-legmint
  ```

### 4. DNS & Domains
- [ ] Domain `legmint.com` registered and ready
- [ ] Subdomain DNS records prepared (api, cdn, assets, docs)
- [ ] SSL certificates obtained for all domains
- [ ] Nameservers configured and propagated

### 5. Third-Party Services
- [ ] **Stripe**: Product and plan names updated
- [ ] **AWS S3**: New buckets created or renamed
- [ ] **SendGrid**: Sender domains verified for legmint.com
- [ ] **Clerk/Auth**: Redirect URLs updated
- [ ] **Vercel**: Environment variables prepared
- [ ] **Render** (or backend host): Environment variables prepared

---

## 🏗️ Infrastructure Setup

### 1. AWS S3 Buckets

#### Option A: Create New Buckets (Recommended)
```bash
# Create new S3 buckets
aws s3 mb s3://legmint-documents --region eu-west-1
aws s3 mb s3://legmint-previews --region eu-west-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket legmint-documents \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-versioning \
  --bucket legmint-previews \
  --versioning-configuration Status=Enabled

# Copy existing data (if needed)
aws s3 sync s3://legalmind-documents s3://legmint-documents
aws s3 sync s3://legalmind-previews s3://legmint-previews
```

#### Option B: Rename Existing Buckets
Note: S3 doesn't support direct renaming. Must create new and copy data.

### 2. Database Migration

#### Option A: Rename Database (PostgreSQL)
```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Disconnect all users from the database
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'legalmind';

-- Rename database
ALTER DATABASE legalmind RENAME TO legmint;

-- Verify
\l legmint
```

#### Option B: Create New Database and Migrate
```bash
# Create new database
createdb -U postgres legmint

# Migrate schema
pg_dump -s -U postgres legalmind | psql -U postgres legmint

# Migrate data
pg_dump -a -U postgres legalmind | psql -U postgres legmint
```

### 3. DNS Configuration

#### Create DNS Records (Example: Cloudflare)
```
Type: A     Name: @                Value: <vercel-frontend-ip>
Type: A     Name: api              Value: <render-backend-ip>
Type: A     Name: api-staging      Value: <render-staging-ip>
Type: CNAME Name: cdn              Value: <cloudfront-dist>.cloudfront.net
Type: CNAME Name: assets           Value: <s3-bucket-url>
Type: CNAME Name: docs             Value: <docs-hosting>
```

#### Verify DNS Propagation
```bash
# Check DNS propagation
dig legmint.com
dig api.legmint.com
dig cdn.legmint.com

# Use online tool
# https://www.whatsmydns.net/#A/legmint.com
```

---

## 🚀 Deployment Steps

### Phase 1: Backend Deployment

#### Step 1: Update Backend Environment Variables

**Render / Your Backend Host:**
1. Navigate to backend service dashboard
2. Update environment variables:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/legmint
   S3_BUCKET=legmint-documents
   S3_PREVIEW_BUCKET=legmint-previews
   EMAIL_FROM=noreply@legmint.com
   EMAIL_SUPPORT=support@legmint.com
   CORS_ORIGINS=https://legmint.com,https://www.legmint.com
   ```
3. Save changes (DO NOT deploy yet)

#### Step 2: Build and Test Backend Locally
```bash
cd api

# Install dependencies (if needed)
npm install

# Build
npm run build

# Run locally with new environment
npm run start:prod

# Verify
curl http://localhost:3000/v1/health
```

#### Step 3: Deploy Backend to Staging
```bash
# If using Render with Git integration
git push origin main  # Trigger auto-deploy to staging

# Or manually deploy
render deploy --service=legmint-api-staging
```

#### Step 4: Verify Staging Backend
```bash
# Test health check
curl https://api-staging.legmint.com/v1/health

# Test Swagger docs
open https://api-staging.legmint.com/api-docs

# Test a template endpoint
curl https://api-staging.legmint.com/v1/templates
```

#### Step 5: Deploy Backend to Production
```bash
# Deploy to production
render deploy --service=legmint-api-production

# Or use Render dashboard to promote staging to production
```

#### Step 6: Verify Production Backend
```bash
curl https://api.legmint.com/v1/health
```

---

### Phase 2: Frontend Deployment

#### Step 1: Update Frontend Environment Variables

**Vercel Dashboard:**
1. Navigate to project settings → Environment Variables
2. Update or add:
   ```
   NEXT_PUBLIC_API_URL=https://api.legmint.com/v1
   NEXT_PUBLIC_APP_URL=https://legmint.com
   NEXT_PUBLIC_SITE_NAME=Legmint
   NEXT_PUBLIC_CDN_URL=https://cdn.legmint.com
   NEXT_PUBLIC_ASSETS_URL=https://assets.legmint.com
   NEXT_PUBLIC_SUPPORT_EMAIL=support@legmint.com
   ```
3. Save changes

#### Step 2: Build and Test Frontend Locally
```bash
cd demo

# Install dependencies
npm install

# Build
npm run build

# Run locally
npm run start

# Verify
open http://localhost:3000
```

#### Step 3: Deploy Frontend to Vercel
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Verify preview deployment
# Check preview URL provided by Vercel
```

#### Step 4: Test Preview Deployment
- [ ] Homepage loads correctly
- [ ] Branding shows "Legmint"
- [ ] Navigation works
- [ ] API calls succeed
- [ ] No console errors

#### Step 5: Deploy to Production
```bash
# Deploy to production
vercel --prod

# Or use Vercel dashboard to promote preview to production
```

#### Step 6: Configure Custom Domain on Vercel
1. Go to Vercel project → Settings → Domains
2. Add domain: `legmint.com`
3. Add domain: `www.legmint.com`
4. Verify DNS configuration
5. Wait for SSL certificate provisioning

---

### Phase 3: Post-Deployment Configuration

#### Step 1: Clear CDN Cache
```bash
# If using Cloudflare
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

#### Step 2: Update Stripe

**Stripe Dashboard:**
1. Update product names:
   - "Starter (Legmint)"
   - "Pro (Legmint)"
   - "Scale (Legmint)"
2. Update webhook URLs:
   - `https://api.legmint.com/v1/webhooks/stripe`
3. Update success/cancel URLs:
   - Success: `https://legmint.com/account?session_id={CHECKOUT_SESSION_ID}`
   - Cancel: `https://legmint.com/pricing`
4. Test webhook delivery

#### Step 3: Update Authentication (Clerk)

**Clerk Dashboard:**
1. Add new allowed redirect URLs:
   - `https://legmint.com/*`
   - `https://www.legmint.com/*`
2. Update sign-in/sign-up URLs
3. Update application name to "Legmint"
4. Test auth flow

#### Step 4: Update Analytics

**Google Analytics:**
1. Add new property for legmint.com (if needed)
2. Update tracking code (if not using environment variable)
3. Verify tracking

**Posthog:**
1. Update project settings with new domain
2. Verify event tracking

#### Step 5: Update Error Tracking

**Sentry:**
1. Create new projects or rename existing:
   - `legmint-frontend`
   - `legmint-api`
2. Update DSN in environment variables (if changed)
3. Test error reporting

---

## 🧪 Post-Deployment Verification

### Automated Tests
```bash
# Run frontend tests
cd demo
npm run test

# Run backend tests
cd api
npm run test

# Run E2E tests (if available)
npm run test:e2e
```

### Manual Verification Checklist
See [REBRAND_QA_CHECKLIST.md](./REBRAND_QA_CHECKLIST.md) for comprehensive list.

#### Quick Smoke Tests
```bash
# Backend health
curl https://api.legmint.com/v1/health

# Frontend health
curl -I https://legmint.com

# Verify branding
curl -s https://legmint.com | grep -i "legmint"
```

---

## 🔄 Rollback Procedure

### If Critical Issues Detected

#### Immediate Rollback (< 1 hour post-deployment)

**Frontend:**
```bash
# Revert to previous Vercel deployment
vercel rollback <previous-deployment-url>

# Or via Vercel dashboard: Deployments → Select previous → Promote to Production
```

**Backend:**
```bash
# Revert to previous git commit
git revert <commit-hash>
git push origin main

# Or redeploy previous version via Render dashboard
```

**DNS:**
```bash
# Update DNS records back to old servers (if domain changed)
# This will take 5-60 minutes to propagate
```

#### Database Rollback
```sql
-- Stop application
-- Restore database from backup
psql -U postgres -d legmint < backups/legalmind_backup_YYYYMMDD.sql

-- Or rename back
ALTER DATABASE legmint RENAME TO legalmind;
```

#### Environment Variables Rollback
```bash
# Restore from backup files
# Re-deploy with old environment variables
```

### Rollback Communication
1. Post incident status on status page (if available)
2. Email support team about rollback
3. Notify users via social media (if needed)
4. Document rollback reason in postmortem

---

## 📊 Monitoring & Alerts

### First 24 Hours Post-Deploy

#### Metrics to Monitor
- [ ] **Error rate** (should be < 1%)
- [ ] **Response time** (should be < 500ms)
- [ ] **Uptime** (should be 99.9%+)
- [ ] **Traffic patterns** (similar to pre-rebrand)
- [ ] **Conversion rates** (no significant drop)

#### Tools
- **Sentry**: Monitor error rates
- **Vercel Analytics**: Monitor frontend performance
- **Render Metrics**: Monitor backend performance
- **Google Analytics**: Monitor traffic
- **Uptime Robot**: Monitor endpoint availability

#### Alert Conditions
```yaml
# Example alert rules
- Error rate > 5% for 5 minutes → Page on-call engineer
- API response time > 2s for 10 minutes → Slack alert
- Uptime < 99% → Email alert
- 5xx errors > 10 in 1 minute → Page on-call engineer
```

---

## 📧 Communication Plan

### Internal Communication

**Pre-Deployment (Day -1):**
- Email to engineering team: Deployment schedule
- Email to support team: What to expect, FAQs
- Slack announcement: Timeline and rollback contacts

**During Deployment:**
- Slack updates every 15 minutes
- Status page updated (if available)

**Post-Deployment:**
- Email to all staff: Rebrand successful
- Slack announcement: Monitoring links

### External Communication

**Option A: Soft Launch (Recommended)**
- Update site without major announcement
- Monitor for issues for 24-48 hours
- Then announce via blog/social media

**Option B: Hard Launch**
- Announce via email blast to users
- Social media announcement
- Blog post
- Press release (if applicable)

### User Communication Template

**Email Subject:** "Introducing Legmint - Same Great Service, Fresh New Look"

**Body:**
```
Hi [User],

We have some exciting news to share! 🪙

LegalMind is now Legmint — the same platform you trust, with a fresh new identity that better reflects our mission: legal docs, minted for startups.

What's Changing:
✓ New name: Legmint
✓ New domain: legmint.com
✓ New look: Cleaner, more modern design

What's NOT Changing:
✓ Your account and templates (still there!)
✓ Our commitment to founder-friendly legal tools
✓ Our pricing and features

You don't need to do anything. Just head to legmint.com and log in as usual.

Questions? Reply to this email or reach out to support@legmint.com.

Thanks for being part of the journey!

The Legmint Team

---
Global Legal Consulting Ltd (trading as Legmint)
```

---

## 📅 Deployment Timeline

### Recommended Schedule

**Day -7: Final Preparation**
- Complete all code changes
- Run full QA checklist
- Create backups
- Prepare DNS records

**Day -3: Staging Deployment**
- Deploy to staging environment
- Run smoke tests
- Fix any critical bugs

**Day -1: Pre-Deployment Checks**
- Final backup of database
- Document all environment variables
- Brief team on deployment plan
- Set up monitoring alerts

**Day 0: Production Deployment**
- **09:00 AM** - Start deployment (low-traffic time)
- **09:15 AM** - Deploy backend to production
- **09:30 AM** - Verify backend health
- **09:45 AM** - Deploy frontend to production
- **10:00 AM** - Verify frontend health
- **10:15 AM** - Update DNS records (if needed)
- **10:30 AM** - Update third-party services
- **11:00 AM** - Clear CDN cache
- **11:30 AM** - Final verification
- **12:00 PM** - Announce internally
- **End of Day** - Monitor metrics

**Day 1-7: Post-Launch Monitoring**
- Monitor error rates, performance, traffic
- Address any issues quickly
- Collect user feedback

**Day 7: External Announcement**
- If no major issues, announce rebrand publicly
- Send user email
- Post on social media
- Publish blog post

---

## 🛠️ Useful Commands

### Environment Setup
```bash
# Frontend .env.local (Development)
cp demo/.env.example demo/.env.local

# Backend .env (Development)
cp api/.env.example api/.env
```

### Build Commands
```bash
# Frontend
cd demo
npm install
npm run build
npm run start

# Backend
cd api
npm install
npm run build
npm run start:prod
```

### Deployment Commands
```bash
# Vercel (Frontend)
vercel --prod

# Render (Backend) - via Git push
git push origin main
```

### Health Checks
```bash
# Backend
curl https://api.legmint.com/v1/health

# Frontend
curl -I https://legmint.com

# Check for brand references
curl -s https://legmint.com | grep -i "legalmind"  # Should return nothing
curl -s https://legmint.com | grep -i "legmint"    # Should return results
```

### DNS Checks
```bash
# Check DNS propagation
dig legmint.com
dig api.legmint.com

# Check SSL certificate
openssl s_client -connect legmint.com:443 -servername legmint.com
```

### Database Operations
```bash
# Backup
pg_dump -U postgres legalmind > backup.sql

# Restore
psql -U postgres legmint < backup.sql

# Rename
psql -U postgres -c "ALTER DATABASE legalmind RENAME TO legmint;"
```

---

## 📞 Emergency Contacts

**On-Call Engineer:** [Contact Info]
**DevOps Lead:** [Contact Info]
**Product Owner:** [Contact Info]
**Emergency Hotline:** [Contact Info]

---

## 📝 Post-Deployment Checklist

### Day 0 (Deployment Day)
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] DNS updated (if needed)
- [ ] Health checks passing
- [ ] No critical errors in logs
- [ ] Monitoring dashboards green
- [ ] Team notified of successful deployment

### Day 1 (Post-Deployment)
- [ ] Review metrics: Error rates, performance, traffic
- [ ] Check support tickets for brand confusion
- [ ] Verify analytics tracking
- [ ] Test critical user flows
- [ ] Document any issues found

### Week 1
- [ ] SEO rankings monitored
- [ ] User feedback collected
- [ ] Performance metrics stable
- [ ] No regressions identified
- [ ] External announcement sent (if ready)

### Week 4
- [ ] Brand recognition improving
- [ ] Search traffic recovering
- [ ] User satisfaction maintained
- [ ] Rebrand retrospective completed

---

## 📖 Additional Resources

- **Brand Guidelines:** [LEGMINT_BRAND_GUIDELINES.md](./LEGMINT_BRAND_GUIDELINES.md)
- **QA Checklist:** [REBRAND_QA_CHECKLIST.md](./REBRAND_QA_CHECKLIST.md)
- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

**Deployment Plan Version:** 1.0.0
**Last Updated:** January 2025
**Next Review:** After deployment completion

*Legmint — Legal docs, minted for startups*
