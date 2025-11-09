# LegalMind MVP Roadmap
## Weeks 3-8 Implementation Plan

**Version:** 3.0 (Startup Legal Launchpad)
**Last Updated:** 2025-10-22
**Status:** Active Implementation

> **Product Focus:** Two commercial packs (Fundraising + SaaS Operations), 14 templates, 5 jurisdictions

---

## Overview

This roadmap covers the **6-week implementation sprint** to launch LegalMind MVP with:
- **2 packs** (Fundraising + SaaS Operations)
- **14 templates** (7 per pack)
- **5 jurisdictions** (UK, US-DE, DE, FR, CZ)
- **3 pricing tiers** (Starter €99, Pro €49/mo, Scale €149/mo)
- **Lawyer referral system** (Scale tier)

**Timeline:** Weeks 3-8 (6 weeks total)
**Team Size:** 3-5 people (1 FE, 2 BE, 1 Legal, 1 PM/QA)

---

## Week 3: Overlay API Implementation

### Objective
Build jurisdiction overlay resolution system to customize templates per legal jurisdiction.

### Key Deliverables
- [ ] **Overlay JSON schema** (standardized format for jurisdiction rules)
- [ ] **Overlay merge algorithm** (apply jurisdiction-specific clauses)
- [ ] **API endpoint:** `GET /overlays/{jurisdiction}/{template_id}`
- [ ] **Test coverage:** 70 combinations (14 templates × 5 jurisdictions)
- [ ] **Documentation:** Overlay authoring guide for legal team

### Technical Tasks

#### Backend (NestJS)
```typescript
// 1. Create OverlayService
@Injectable()
class OverlayService {
  async getOverlay(templateId: string, jurisdiction: string) {
    return await this.overlayRepository.findOne({
      template_id: templateId,
      jurisdiction_code: jurisdiction
    });
  }

  async mergeOverlay(baseTemplate: Template, overlay: Overlay) {
    // Apply clause replacements/additions
    // Apply terminology substitutions
    // Apply formatting rules
    return mergedTemplate;
  }
}

// 2. Create API controller
@Controller('overlays')
class OverlayController {
  @Get(':jurisdiction/:template_id')
  async getOverlay(
    @Param('jurisdiction') jurisdiction: string,
    @Param('template_id') templateId: string
  ) {
    return this.overlayService.getOverlay(templateId, jurisdiction);
  }
}
```

#### Database Migration
```sql
-- Create overlays table
CREATE TABLE overlays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES templates(id) NOT NULL,
  jurisdiction_code VARCHAR(20) NOT NULL,
  overlay_rules JSONB NOT NULL,
  legal_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(template_id, jurisdiction_code)
);

CREATE INDEX idx_overlays_template ON overlays(template_id);
CREATE INDEX idx_overlays_jurisdiction ON overlays(jurisdiction_code);
```

### Testing
- [ ] Unit tests for merge algorithm
- [ ] Integration tests for API endpoint
- [ ] Manual QA: Generate 5 samples (1 template × 5 jurisdictions)

### Success Criteria
✅ Overlay system functional for all 5 jurisdictions
✅ API response time <100ms
✅ Zero merge errors in test cases

---

## Week 4: Fundraising Pack Pilot (5 Templates)

### Objective
Launch subset of Fundraising Pack for alpha testing with 10 startup founders.

### Templates to Implement
1. **Founders' Agreement** (Complexity: 7/10)
2. **SAFE (Post-Money)** (Complexity: 5/10)
3. **IP Assignment Agreement** (Complexity: 3/10)
4. **Shareholders' Agreement** (Basic version) (Complexity: 8/10)
5. **Due Diligence Checklist** (Complexity: 4/10)

### Key Deliverables
- [ ] **5 template content files** (Markdown + DOCX structure)
- [ ] **5 questionnaires** (10-15 questions each)
- [ ] **25 jurisdiction overlays** (5 templates × 5 jurisdictions)
- [ ] **JSONLogic conditional logic** (e.g., vesting schedules)
- [ ] **Alpha testing:** 10 founders generate 25 documents

### Template Authoring Process

#### Step 1: Content Creation (Legal Team)
```markdown
# Founders' Agreement Template

## 1. Parties
This Agreement is made on {{signing_date}} between:
- {{founder_1.name}} ({{founder_1.equity}}% equity)
- {{founder_2.name}} ({{founder_2.equity}}% equity)

## 2. Equity Allocation
The Founders agree to the following equity distribution:
{{#each founders}}
- {{name}}: {{equity}}% ordinary shares
{{/each}}

## 3. Vesting Schedule
{{#if has_vesting}}
Founder shares shall vest over {{vesting_period_months}} months with a {{cliff_months}}-month cliff.
{{/if}}
```

#### Step 2: Questionnaire Design
```json
{
  "template_id": "founders-agreement",
  "questions": [
    {
      "id": "company_name",
      "type": "text",
      "label": "What is your company name?",
      "required": true,
      "validation": { "minLength": 2, "maxLength": 100 }
    },
    {
      "id": "founders",
      "type": "array",
      "label": "Add founders",
      "min_items": 2,
      "max_items": 5,
      "fields": [
        { "id": "name", "type": "text", "label": "Full name" },
        { "id": "equity", "type": "number", "label": "Equity %", "validation": { "min": 0, "max": 100 } }
      ]
    },
    {
      "id": "has_vesting",
      "type": "boolean",
      "label": "Include vesting schedule?",
      "default": true
    },
    {
      "id": "vesting_period_months",
      "type": "number",
      "label": "Vesting period (months)",
      "conditional_logic": { "==": [{ "var": "has_vesting" }, true] },
      "validation": { "min": 12, "max": 60 },
      "default": 48
    }
  ]
}
```

#### Step 3: Jurisdiction Overlays
```json
{
  "template_id": "founders-agreement",
  "jurisdiction_code": "UK",
  "overlay_rules": {
    "clauses": [
      {
        "clause_id": "governing_law",
        "action": "replace",
        "content": "This Agreement is governed by the laws of England and Wales."
      }
    ],
    "terminology": {
      "equity": "ordinary shares",
      "shareholder": "member"
    }
  }
}
```

### Implementation Tasks
- [ ] Author 5 templates (Legal team + PM)
- [ ] Build 5 questionnaires (Frontend dev)
- [ ] Create 25 overlays (Legal team)
- [ ] Implement variable interpolation (Backend dev)
- [ ] Test generation pipeline (QA)

### Success Criteria
✅ 5 templates live in production
✅ 10 alpha users complete 25 documents
✅ User satisfaction >4/5
✅ Zero critical bugs

---

## Week 5: SaaS Operations Pack (7 Templates)

### Objective
Complete SaaS pack for revenue-stage startups selling software services.

### Templates to Implement
1. **SaaS Subscription Agreement** (Complexity: 6/10)
2. **Data Processing Agreement (DPA)** (Complexity: 7/10)
3. **Privacy Policy** (GDPR baseline) (Complexity: 6/10)
4. **Master Services Agreement (MSA)** (Complexity: 7/10)
5. **Terms of Use** (Complexity: 5/10)
6. **Service Level Agreement (SLA)** (Complexity: 5/10)
7. **Cookie Policy** (Complexity: 4/10)

### Key Deliverables
- [ ] **7 template content files**
- [ ] **7 questionnaires** (8-20 questions each)
- [ ] **35 jurisdiction overlays** (7 templates × 5 jurisdictions)
- [ ] **GDPR compliance review** (Privacy Policy + DPA)
- [ ] **QA testing:** 35 sample documents generated

### Special Focus: GDPR Compliance

#### Privacy Policy Requirements
- [ ] Article 13/14 GDPR compliance (information to data subjects)
- [ ] Lawful basis for processing (Art. 6)
- [ ] Data subject rights (Art. 15-22)
- [ ] International transfers (Art. 44-50)
- [ ] Cookie consent (ePrivacy Directive)

#### DPA Requirements
- [ ] Art. 28 GDPR compliance (processor obligations)
- [ ] Security measures (Art. 32)
- [ ] Sub-processor list
- [ ] Data breach notification (Art. 33)
- [ ] Standard Contractual Clauses (if non-EU transfers)

### Implementation Tasks
- [ ] Author 7 templates with GDPR lawyer review
- [ ] Build 7 questionnaires (more complex than Fundraising pack)
- [ ] Create 35 overlays with jurisdiction-specific data protection laws
- [ ] Implement conditional logic for data retention, international transfers
- [ ] Legal review by GDPR specialist

### Testing
- [ ] Generate 35 test documents (7 templates × 5 jurisdictions)
- [ ] GDPR compliance audit
- [ ] Validate all conditional clauses (e.g., if international transfers → add SCCs)

### Success Criteria
✅ 7 SaaS templates live
✅ GDPR compliance verified by external lawyer
✅ All 35 overlays functional
✅ Zero legal accuracy issues

---

## Week 6: Onboarding + Payment Flow

### Objective
Build user acquisition funnel and Stripe monetization integration.

### Key Deliverables
- [ ] **Onboarding questionnaire** (4 questions to recommend pack)
- [ ] **Pricing page** (3 tiers: Starter, Pro, Scale)
- [ ] **Stripe checkout integration** (test mode)
- [ ] **User dashboard** (purchased packs, usage stats)
- [ ] **Payment webhook handler** (subscription lifecycle)

### User Onboarding Flow

#### Question 1: Business Stage
```
What stage is your startup?
○ Pre-seed (idea/prototype)
○ Early revenue (<€100K ARR)
○ Growth stage (>€100K ARR)
```

#### Question 2: Target Markets
```
Which markets are you targeting? (Multi-select)
☐ UK
☐ EU (Germany, France)
☐ US
☐ Other
```

#### Question 3: Business Model
```
What type of business are you building?
○ SaaS / Software
○ Service-based
○ Product / E-commerce
○ Other
```

#### Question 4: Primary Need
```
What do you need legal documents for?
○ Raising capital (Fundraising Pack)
○ Selling to customers (SaaS Operations Pack)
○ Both
```

**Recommendation Engine:**
```typescript
function recommendPack(answers: OnboardingAnswers): Pack {
  if (answers.primary_need === 'fundraising') return 'fundraising';
  if (answers.primary_need === 'saas') return 'saas';
  if (answers.primary_need === 'both') return 'both'; // Recommend Pro tier

  // Fallback logic
  if (answers.business_stage === 'pre_seed') return 'fundraising';
  if (answers.business_model === 'saas') return 'saas';

  return 'fundraising'; // Default
}
```

### Pricing Page Implementation

```tsx
// components/pricing/PricingTiers.tsx
const tiers = [
  {
    name: 'Starter',
    price: '€99',
    billing: 'one-time',
    features: [
      'One pack (Fundraising OR SaaS)',
      '5 documents per month',
      '1 jurisdiction',
      'DOCX + PDF export',
      'Email support'
    ],
    cta: 'Choose Pack',
    popular: false
  },
  {
    name: 'Pro',
    price: '€49',
    billing: 'per month',
    features: [
      'Both packs (14 templates)',
      'Unlimited documents',
      'All 5 jurisdictions',
      'Save drafts',
      'Download history',
      'Priority support'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Scale',
    price: '€149',
    billing: 'per month',
    features: [
      'Everything in Pro',
      'Lawyer referral matching',
      'Quarterly legal review',
      '48h support SLA',
      'Custom jurisdiction requests'
    ],
    cta: 'Book Demo',
    popular: false
  }
];
```

### Stripe Integration

#### Checkout Session Creation
```typescript
@Post('/purchase')
async createCheckout(@Body() dto: PurchaseDto) {
  const priceIds = {
    starter: 'price_starter_99eur',
    pro_monthly: 'price_pro_monthly_49eur',
    pro_annual: 'price_pro_annual_490eur',
    scale_monthly: 'price_scale_monthly_149eur'
  };

  const session = await this.stripe.checkout.sessions.create({
    mode: dto.tier === 'starter' ? 'payment' : 'subscription',
    line_items: [
      {
        price: priceIds[dto.tier],
        quantity: 1
      }
    ],
    metadata: {
      user_id: this.request.user.id,
      tier: dto.tier,
      pack_id: dto.pack_id  // Only for Starter tier
    },
    success_url: `${APP_URL}/dashboard?success=true`,
    cancel_url: `${APP_URL}/pricing`
  });

  return { checkout_url: session.url };
}
```

#### Webhook Handler
```typescript
@Post('/webhooks/stripe')
async handleWebhook(
  @Body() rawBody,
  @Headers('stripe-signature') signature: string
) {
  const event = this.stripe.webhooks.constructEvent(
    rawBody,
    signature,
    STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await this.activateSubscription(event.data.object);
      break;

    case 'customer.subscription.updated':
      await this.updateSubscription(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await this.cancelSubscription(event.data.object);
      break;

    case 'invoice.payment_failed':
      await this.handlePaymentFailure(event.data.object);
      break;
  }

  return { received: true };
}

async activateSubscription(session: Stripe.Checkout.Session) {
  const { user_id, tier, pack_id } = session.metadata;

  // Create subscription record
  await this.db.subscriptions.create({
    user_id,
    stripe_subscription_id: session.subscription,
    plan_tier: tier,
    status: 'active',
    current_period_end: new Date(session.expires_at * 1000)
  });

  // Update user tier
  await this.db.users.update(user_id, {
    tier: tier,
    purchased_packs: tier === 'starter' ? [pack_id] : ['fundraising', 'saas']
  });

  // Send welcome email
  await this.emailService.send({
    to: user.email,
    template: 'subscription_activated',
    data: { tier, pack_id }
  });
}
```

### User Dashboard

```tsx
// app/dashboard/page.tsx
export default function Dashboard() {
  const user = useUser();
  const { data: documents } = useDocuments();

  return (
    <div>
      <h1>Welcome back, {user.name}</h1>

      {/* Subscription status */}
      <SubscriptionCard tier={user.tier} />

      {/* Available packs */}
      <PacksGrid packs={user.purchased_packs} />

      {/* Recent documents */}
      <DocumentList documents={documents} />

      {/* Usage stats */}
      <UsageStats user={user} />
    </div>
  );
}
```

### Implementation Tasks
- [ ] Design onboarding flow (Figma wireframes)
- [ ] Build onboarding UI (React components)
- [ ] Create pricing page (3 tiers)
- [ ] Integrate Stripe Checkout (test mode)
- [ ] Build webhook handler (subscription events)
- [ ] Create user dashboard
- [ ] Test subscription lifecycle (create, upgrade, cancel)

### Success Criteria
✅ End-to-end purchase flow functional
✅ Stripe webhooks processing correctly
✅ User can upgrade/downgrade tiers
✅ Access control enforced (tier-based)

---

## Week 7: Pro/Scale Tiers + Lawyer Referral Trigger

### Objective
Unlock premium features and implement lawyer referral system for Scale tier.

### Key Deliverables
- [ ] **Pro tier features** (unlimited docs, both packs, all jurisdictions)
- [ ] **Scale tier features** (lawyer referral, quarterly review)
- [ ] **Lawyer matching algorithm** (jurisdiction + specialization)
- [ ] **Referral tracking system**
- [ ] **Revenue attribution** (20-25% commission)

### Pro Tier Features

#### Unlimited Document Generation
```typescript
// Middleware: Check quota
@UseGuards(QuotaGuard)
async generateDocument() {
  const user = this.request.user;

  if (user.tier === 'starter') {
    const usage = await this.usageService.getMonthlyUsage(user.id);
    if (usage.document_count >= 5) {
      throw new ForbiddenException('Monthly quota exceeded. Upgrade to Pro.');
    }
  }

  // Pro/Scale: No quota check
  return this.generationService.generate(...);
}
```

#### Draft Saving
```typescript
// Save questionnaire progress
@Post('/drafts')
async saveDraft(@Body() dto: SaveDraftDto) {
  return await this.db.drafts.upsert({
    user_id: this.request.user.id,
    template_id: dto.template_id,
    answers: dto.answers,
    updated_at: new Date()
  });
}

// Resume draft
@Get('/drafts/:template_id')
async getDraft(@Param('template_id') templateId: string) {
  return await this.db.drafts.findOne({
    user_id: this.request.user.id,
    template_id: templateId
  });
}
```

### Scale Tier: Lawyer Referral System

#### Lawyer Matching Algorithm
```typescript
@Injectable()
class LawyerMatchingService {
  async matchLawyer(
    jurisdiction: string,
    specialization: string,
    filters?: { maxRate?: number, minRating?: number }
  ): Promise<Lawyer> {
    const query = {
      license_jurisdiction: jurisdiction,
      specialties: { $in: [specialization] },
      accepts_referrals: true,
      is_verified: true,
      rating_average: { $gte: filters?.minRating || 4.0 }
    };

    if (filters?.maxRate) {
      query.hourly_rate_min = { $lte: filters.maxRate };
    }

    // Sort by rating, then by total referrals (fairness)
    const lawyers = await this.db.lawyers.find(query)
      .sort({ rating_average: -1, total_referrals: 1 })
      .limit(3);

    // Return top match (or let user choose from top 3)
    return lawyers[0];
  }
}
```

#### Referral Creation
```typescript
@Post('/referral')
@UseGuards(TierAccessGuard)
@RequiredTier(Tier.SCALE)  // Scale tier only
async createReferral(@Body() dto: CreateReferralDto) {
  const user = this.request.user;

  // 1. Match lawyer
  const lawyer = await this.lawyerMatchingService.matchLawyer(
    dto.jurisdiction,
    dto.specialization
  );

  if (!lawyer) {
    throw new NotFoundException('No lawyers available for this jurisdiction');
  }

  // 2. Create referral record
  const referral = await this.db.referrals.create({
    referral_code: generateReferralCode(),
    user_id: user.id,
    lawyer_id: lawyer.id,
    document_id: dto.document_id,
    referral_type: dto.referral_type,  // 'document_review' | 'full_setup' | 'consultation'
    message: dto.message,
    status: 'initiated'
  });

  // 3. Send email to lawyer
  await this.emailService.send({
    to: lawyer.email,
    template: 'new_referral',
    data: {
      referral_code: referral.referral_code,
      client_name: user.full_name,
      client_email: user.email,
      document_title: dto.document_title,
      message: dto.message,
      calendly_url: `${APP_URL}/referrals/${referral.id}/book`
    }
  });

  // 4. Send confirmation to user
  await this.emailService.send({
    to: user.email,
    template: 'referral_sent',
    data: {
      lawyer_name: lawyer.name,
      lawyer_firm: lawyer.law_firm_name,
      lawyer_calendly: lawyer.calendly_url
    }
  });

  return referral;
}
```

#### Revenue Tracking
```typescript
// When engagement completes
@Post('/referrals/:id/complete')
@UseGuards(LawyerGuard)  // Only lawyer can mark complete
async completeReferral(
  @Param('id') id: string,
  @Body() dto: CompleteReferralDto
) {
  const referral = await this.db.referrals.findById(id);

  // Update referral status
  await this.db.referrals.update(id, {
    status: 'completed',
    completed_at: new Date()
  });

  // Calculate commission
  const commissionRate = referral.lawyer.referral_fee_percentage || 20;
  const legalMindRevenue = dto.engagement_value_eur * (commissionRate / 100);

  // Create payment record
  await this.db.referral_payments.create({
    referral_id: referral.id,
    lawyer_id: referral.lawyer_id,
    engagement_value_eur: dto.engagement_value_eur,
    referral_fee_percentage: commissionRate,
    referral_fee_eur: legalMindRevenue,
    payment_status: 'pending'
  });

  // Trigger payout (monthly batch or immediate via Stripe Connect)
  await this.payoutService.schedulePayout(referral.lawyer_id, legalMindRevenue);

  return { success: true };
}
```

### Implementation Tasks
- [ ] Build Pro tier features (draft saving, unlimited docs)
- [ ] Create lawyer matching algorithm
- [ ] Build referral creation API
- [ ] Implement email notifications (user + lawyer)
- [ ] Create referral tracking dashboard (for lawyers)
- [ ] Build revenue attribution system
- [ ] Test referral flow end-to-end

### Success Criteria
✅ Pro tier features functional
✅ Lawyer matching works for all 5 jurisdictions
✅ Referral emails sent successfully
✅ Revenue tracking accurate

---

## Week 8: QA + Launch Prep

### Objective
Final testing, SEO optimization, and go-to-market readiness.

### Key Deliverables
- [ ] **Full QA checklist** (70 template-jurisdiction combinations)
- [ ] **Stripe production mode** (move from test to live keys)
- [ ] **Load testing** (100 concurrent users)
- [ ] **Security audit** (OWASP Top 10)
- [ ] **SEO optimization** (meta tags, structured data, sitemap)
- [ ] **Email onboarding sequence** (5 emails)
- [ ] **Product Hunt launch** materials

### Quality Assurance

#### Functional Testing
```bash
# Test matrix: 14 templates × 5 jurisdictions = 70 combinations
./scripts/qa-test-all.sh

# Expected output:
✓ Founders Agreement (UK) - Generated successfully
✓ Founders Agreement (US-DE) - Generated successfully
✓ Founders Agreement (DE) - Generated successfully
...
✓ Cookie Policy (CZ) - Generated successfully

Total: 70/70 passed
```

#### Performance Testing
```bash
# Load test with k6
k6 run --vus 100 --duration 30s load-test.js

# Expected results:
✓ http_req_duration........: avg=185ms p(95)=245ms p(99)=320ms
✓ http_req_failed.........: 0.00%
✓ iteration_duration......: avg=2.1s
```

#### Security Audit
- [ ] OWASP ZAP scan (no critical vulnerabilities)
- [ ] IDOR testing (users cannot access others' documents)
- [ ] SQL injection testing (all inputs sanitized)
- [ ] XSS testing (all outputs escaped)
- [ ] CSRF protection (tokens validated)
- [ ] Rate limiting (100 req/min per user)

### Content & Marketing

#### Landing Page Optimization
```html
<!-- SEO meta tags -->
<head>
  <title>LegalMind | Startup Legal Documents - Fundraising & SaaS Operations</title>
  <meta name="description" content="Generate legal documents for your startup in minutes. Fundraising Pack + SaaS Operations Pack. UK, US, EU compliant." />
  <meta property="og:title" content="LegalMind - Startup Legal Launchpad" />
  <meta property="og:image" content="/og-image.png" />

  <!-- Structured data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LegalMind",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "49",
      "priceCurrency": "EUR"
    }
  }
  </script>
</head>
```

#### Email Onboarding Sequence
1. **Day 0:** Welcome + Quick Start Guide
2. **Day 1:** "How to Generate Your First Document"
3. **Day 3:** "Understanding Jurisdiction Overlays"
4. **Day 5:** "Meet Our Verified Lawyers" (Scale tier feature)
5. **Day 7:** "Upgrade to Pro - Save 50% on Annual Plan"

### Launch Checklist

#### Pre-Launch (Must Complete)
- [ ] All 70 template-jurisdiction combos tested
- [ ] Stripe in production mode (live keys)
- [ ] Legal disclaimers on all pages
- [ ] Privacy Policy + Terms of Service published
- [ ] GDPR cookie consent banner
- [ ] Monitoring dashboards configured (DataDog/Sentry)
- [ ] Backup/restore tested successfully
- [ ] DNS configured (api.legalmind.com, www.legalmind.com)
- [ ] SSL certificates installed
- [ ] CDN cache purged (Cloudflare)
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics installed (Google Analytics 4)

#### Launch Day (Product Hunt)
- [ ] Product Hunt submission (7am PST)
- [ ] Social media posts (Twitter, LinkedIn)
- [ ] Email blast to waitlist (if any)
- [ ] Monitor error rates (Sentry dashboard)
- [ ] Customer support ready (email + chat)

### Post-Launch Monitoring (Week 1)

#### Key Metrics to Track
| Metric | Target |
|--------|--------|
| Signups | 50 |
| Documents Generated | 100 |
| Conversion Rate (Free → Paid) | 5% |
| Avg Document Generation Time | <10s |
| API Uptime | 99.5% |
| Error Rate | <1% |

#### Daily Standup Topics
- Stripe webhook failures
- Document generation errors
- User drop-off points
- Customer feedback themes

### Success Criteria
✅ Zero critical bugs in production
✅ 50+ signups in Week 1
✅ Conversion rate >5%
✅ NPS score >40

---

## Summary: 6-Week Delivery Plan

| Week | Focus | Key Deliverable | Success Metric |
|------|-------|-----------------|----------------|
| **3** | Overlay API | Jurisdiction resolution system | 70 overlays functional |
| **4** | Fundraising Pack | 5 templates + questionnaires | 10 alpha users |
| **5** | SaaS Pack | 7 templates (GDPR-compliant) | GDPR audit passed |
| **6** | Payments | Stripe integration + onboarding | End-to-end purchase works |
| **7** | Premium Tiers | Pro/Scale features + lawyer referral | Referral flow functional |
| **8** | Launch Prep | QA + SEO + Product Hunt | 50+ signups Week 1 |

---

## Risk Management

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Legal accuracy issues** | High | Lawyer review for all templates |
| **Stripe integration bugs** | High | Test mode validation, webhook replay |
| **Performance bottlenecks** | Medium | Load testing Week 8, caching strategy |
| **Low initial adoption** | Medium | Product Hunt launch, email sequence |
| **Lawyer referral low quality** | Medium | Manual verification, rating system |

---

## Post-MVP Roadmap (Phase 2)

### Q2 2026: Pack Expansion
- **Hiring Pack** (Employment Agreement, ESOP, Contractor Agreement)
- **Compliance Pack** (Cookie Consent, GDPR Audit, ISO 27001)

### Q3 2026: Geographic Expansion
- **Jurisdictions:** ES, IT, NL, SE, NO (EU expansion)
- **Languages:** ES, IT, NL, SV, NO

### Q4 2026: AI-Powered Features
- **Clause Recommendations:** AI suggests optional clauses based on user profile
- **Risk Scoring:** Highlight high-risk clauses in generated documents
- **Automated Legal Updates:** Notify users when templates updated for new laws

---

**Related Documents:**
- `MVP_STARTUP_LAUNCHPAD.md` — Master implementation blueprint
- `ARCHITECTURE.md` — Technical design
- `DATABASE_SCHEMA_V2.md` — Database design
- `QA_CHECKLIST.md` — Testing plan

---

**Document Owner:** Product Manager
**Review Cycle:** Weekly sprint planning
**Version Control:** Git-tracked
**Status:** Active Implementation (Weeks 3-8)
