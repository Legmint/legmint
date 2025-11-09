# Legmint Rebrand - QA & Verification Checklist

**Rebrand:** LegalMind → Legmint
**Date:** January 2025
**Version:** 1.0.0

---

## 🎯 Overview

This checklist ensures all brand references have been updated from "LegalMind" to "Legmint" and that the platform functions correctly post-rebrand.

---

## ✅ Configuration & Environment

### Frontend Configuration
- [ ] **demo/.env.example** - All brand references updated to Legmint
- [ ] **demo/.env.local** (if exists) - Updated with new domains
- [ ] **demo/vercel.json** - API and docs domains changed to legmint.com
- [ ] **demo/package.json** - Package name updated to `legmint-demo`
- [ ] **demo/tailwind.config.js** - New Legmint color palette added

### Backend Configuration
- [ ] **api/.env** - All brand references updated to Legmint
- [ ] **api/.env.example** - Database and bucket names updated
- [ ] **api/package.json** - Package name and description updated
- [ ] **API Swagger** - Title and contact info show "Legmint"

### Domain References
- [ ] All references to `legalmind.tech` changed to `legmint.com`
- [ ] All email addresses changed to `@legmint.com`
- [ ] Database name changed from `legalmind` to `legmint`
- [ ] S3 buckets changed to `legmint-documents` and `legmint-previews`

---

## 🎨 Visual Identity & Branding

### Logo & Icons
- [ ] Header logo updated to mint coin symbol (🪙)
- [ ] Logo text displays "Legmint" (not "LegalMind")
- [ ] Favicon updated or verified (if custom asset exists)
- [ ] Footer logo matches header branding
- [ ] Logo shape is circular (mint theme)

### Color Palette
- [ ] Mint green (#4BE1A0) used for primary CTAs
- [ ] Navy (#1C1E26) used for headers and dark sections
- [ ] Slate (#5C6370) used for supporting text
- [ ] Off-white (#F8F9FB) used for light backgrounds
- [ ] Primary colors render correctly across all pages

### Typography
- [ ] All fonts load correctly (Inter/Outfit/Satoshi)
- [ ] Heading hierarchy is consistent
- [ ] Text is readable with new color scheme

---

## 📱 Frontend Pages & Components

### Core Pages
- [ ] **Homepage (/)**
  - Hero section shows "Legal docs, minted for startups"
  - CTAs say "Start Minting" and "Explore Templates"
  - Footer shows Legmint branding
  - No "LegalMind" references visible

- [ ] **About Page (/about)**
  - Title shows "About Legmint"
  - Mission statement updated
  - Footer shows Legmint branding
  - No "LegalMind" references visible

- [ ] **Terms Page (/terms)**
  - References to "Legmint" instead of "LegalMind"
  - Copyright shows "Global Legal Consulting Ltd"

- [ ] **Lawyers Page (/lawyers)**
  - Referral disclosure mentions "Legmint"
  - Footer shows Legmint branding

- [ ] **Blog Pages (/blog/*)**
  - Author attribution shows "Legmint Team"
  - Footer shows Legmint branding

### Components
- [ ] **Header Component**
  - Logo displays correctly
  - Navigation links styled with mint-400 when active
  - Brand name shows "Legmint"

- [ ] **Footer Component**
  - Logo displays correctly
  - Copyright shows "© 2025 Global Legal Consulting Ltd"
  - Links styled with mint-400 color

- [ ] **DisclaimerModal**
  - Text references "Legmint"

- [ ] **Testimonials**
  - Testimonial quotes reference "Legmint"

- [ ] **ReferralDisclosureModal**
  - Disclosure text mentions "Legmint"

---

## 🔧 Backend & API

### API Documentation
- [ ] **Swagger UI Title** - Shows "Legmint API Documentation"
- [ ] **API Description** - References Legmint, not LegalMind
- [ ] **Contact Info** - Shows support@legmint.com
- [ ] **Server URLs** - Point to api.legmint.com and api-staging.legmint.com
- [ ] **Favicon** - Points to legmint.com/favicon.ico

### Services
- [ ] **S3 Service** - Default bucket names use `legmint-*`
- [ ] **Email Service** - Sender addresses use `@legmint.com`
- [ ] **Referral Service** - CDN URLs reference legmint domain (if applicable)

### Startup Logs
- [ ] API startup message shows "Legmint API is running..."
- [ ] No "LegalMind" references in console logs

---

## 🌐 SEO & Metadata

### Meta Tags
- [ ] **Page Title** - "Legmint - Legal docs, minted for startups"
- [ ] **Meta Description** - References Legmint and new tagline
- [ ] **Keywords** - Include "legmint" and new brand terms
- [ ] **Author** - "Legmint Technologies Ltd"

### Open Graph
- [ ] **og:title** - Shows "Legmint - Legal docs, minted for startups"
- [ ] **og:site_name** - Shows "Legmint"
- [ ] **og:description** - Uses new brand messaging

### Twitter Cards
- [ ] **twitter:title** - Shows Legmint branding
- [ ] **twitter:description** - Uses new messaging

### Schema.org Structured Data
- [ ] **Organization Schema** - Name is "Legmint"
- [ ] **Organization Schema** - Legal name is "Global Legal Consulting Ltd"
- [ ] **Organization Schema** - URL is https://legmint.com
- [ ] **Product Schema** - Name is "Legmint"
- [ ] **Product Schema** - Description references new brand

---

## 📄 Template & Content Files

### Template Schemas
- [ ] **Questionnaire JSON** - `$id` URLs reference `legmint.com` (if updating)
- [ ] **Template Base JSON** - `$schema` URLs reference `legmint.com` (if updating)
- [ ] **Logic JSON** - `$schema` URLs reference `legmint.com` (if updating)
- [ ] Generated PDFs include "Legmint" footer attribution

### CMS Configuration
- [ ] CMS collections reference correct brand (if applicable)
- [ ] Template import scripts work correctly
- [ ] Template metadata shows Legmint attribution

---

## 💳 Payment & Subscription

### Stripe Integration
- [ ] **Product Names** - Show "Starter (Legmint)", "Pro (Legmint)", "Scale (Legmint)"
- [ ] **Webhooks** - Metadata includes `"brand":"Legmint"`
- [ ] **Success URLs** - Redirect to legmint.com/account
- [ ] **Email Receipts** - Reference Global Legal Consulting Ltd

### Subscription Flow
- [ ] Subscription pages display Legmint branding
- [ ] Payment confirmation shows correct brand name
- [ ] Invoice emails reference Global Legal Consulting Ltd

---

## 🧪 Functional Testing

### Navigation
- [ ] All internal links work correctly
- [ ] Header navigation is functional
- [ ] Footer links navigate to correct pages

### Forms & Interactions
- [ ] Template search/filter works correctly
- [ ] Template cards render properly
- [ ] CTA buttons are clickable and styled correctly

### API Endpoints
- [ ] Health check endpoint returns 200: `/v1/health`
- [ ] Swagger docs load correctly: `/api-docs`
- [ ] Template endpoints function normally
- [ ] Generation endpoints work as expected

### Authentication
- [ ] Sign in flow works correctly
- [ ] Sign up flow works correctly
- [ ] Auth redirects function properly

---

## 🌍 Multi-Environment Testing

### Local Development
- [ ] Frontend runs successfully: `npm run dev`
- [ ] Backend runs successfully: `npm run start:dev`
- [ ] No console errors related to branding
- [ ] Database connection works with new name

### Staging Environment
- [ ] Staging frontend deployed successfully
- [ ] Staging API deployed successfully
- [ ] Staging environment variables updated
- [ ] DNS records point to correct servers
- [ ] SSL certificates valid for new domains

### Production Environment
- [ ] Production frontend deployed successfully
- [ ] Production API deployed successfully
- [ ] Production environment variables updated
- [ ] DNS records point to correct servers
- [ ] SSL certificates valid for new domains
- [ ] CDN cache cleared/invalidated

---

## 📧 Email Templates

### Transactional Emails
- [ ] Welcome email references Legmint
- [ ] Password reset email shows Legmint branding
- [ ] Purchase confirmation email shows Legmint
- [ ] Document delivery email references Legmint
- [ ] All email footers show "Global Legal Consulting Ltd"

### Sender Configuration
- [ ] **From Address** - noreply@legmint.com
- [ ] **Support Address** - support@legmint.com
- [ ] **Reply-To** - Configured correctly

---

## 🔍 Search & Indexing

### Search Engine Verification
- [ ] `robots.txt` references correct domain (if domain-specific)
- [ ] Sitemap.xml references legmint.com URLs (when generated)
- [ ] Google Search Console property added for legmint.com
- [ ] Bing Webmaster Tools property added

### Social Media
- [ ] Twitter/X handle reserved or updated
- [ ] LinkedIn company page updated or created
- [ ] Social profile images updated with new branding

---

## 🗄️ Database & Storage

### Database
- [ ] Database renamed from `legalmind` to `legmint` (or migrations run)
- [ ] All connections use new database name
- [ ] Data integrity maintained post-migration
- [ ] Backup created before rebrand

### AWS S3
- [ ] Buckets renamed to `legmint-documents` and `legmint-previews` OR
- [ ] Application pointing to new bucket names
- [ ] Existing documents accessible after rebrand
- [ ] Backup of old buckets created

---

## 📊 Analytics & Monitoring

### Analytics Setup
- [ ] Google Analytics tracking for legmint.com configured
- [ ] Posthog events reference new domain (if applicable)
- [ ] Analytics dashboards updated with new property

### Error Tracking
- [ ] Sentry project renamed to `legmint-frontend` and `legmint-api`
- [ ] Error tracking functional post-rebrand
- [ ] Source maps uploading correctly

### Monitoring
- [ ] Health checks passing on all environments
- [ ] Uptime monitors updated to new domains
- [ ] Alert notifications reference Legmint

---

## 🚨 Rollback Plan

### Pre-Deployment Backup
- [ ] Database backup created: `pg_dump legalmind > legalmind_backup_YYYYMMDD.sql`
- [ ] S3 buckets backed up or versioned
- [ ] Git tag created: `git tag v1.0.0-legalmind-final`
- [ ] Environment variables documented

### Rollback Procedure (if needed)
1. Revert git commits to last known good state
2. Restore database from backup
3. Update DNS records back to old domains
4. Restore environment variables
5. Clear CDN cache
6. Communicate rollback to users

---

## 📝 Documentation Updates

### Public Documentation
- [ ] README.md updated with new brand
- [ ] API documentation references Legmint
- [ ] Setup guides reference new domains and names

### Internal Documentation
- [ ] Architecture diagrams updated
- [ ] Deployment guides reference new names
- [ ] Team wiki/notion pages updated

---

## 📢 Communication & Launch

### Internal Communication
- [ ] Team informed of rebrand timeline
- [ ] Support team trained on new branding
- [ ] FAQ prepared for common questions

### External Communication
- [ ] Email announcement drafted (if applicable)
- [ ] Social media posts scheduled
- [ ] Blog post announcing rebrand published
- [ ] Press release prepared (if applicable)

### User Communication
- [ ] In-app notification or banner (if needed)
- [ ] Email to existing users explaining rebrand
- [ ] Legacy domain redirects configured (if keeping legalmind.*)

---

## ✨ Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor error rates in Sentry
- [ ] Check analytics for traffic patterns
- [ ] Review support tickets for brand confusion
- [ ] Verify DNS propagation globally

### First Week
- [ ] SEO rankings monitored
- [ ] User feedback collected
- [ ] Performance metrics stable
- [ ] No major brand references missed

### First Month
- [ ] Brand recognition improving
- [ ] Search traffic recovering (if domain changed)
- [ ] User satisfaction maintained
- [ ] No technical regressions

---

## 🎉 Sign-Off

### QA Team Approval
- **Tester Name:** ___________________________
- **Date:** ___________________________
- **Signature:** ___________________________

### Product Owner Approval
- **Name:** ___________________________
- **Date:** ___________________________
- **Signature:** ___________________________

### Technical Lead Approval
- **Name:** ___________________________
- **Date:** ___________________________
- **Signature:** ___________________________

---

## 📞 Support Contacts

**Technical Issues:** tech@legmint.com
**Brand/Marketing Questions:** hello@legmint.com
**Emergency Rollback:** [On-call engineer contact]

---

**Checklist Version:** 1.0.0
**Last Updated:** January 2025

*Legmint — Legal docs, minted for startups*
