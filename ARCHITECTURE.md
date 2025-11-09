# LegalMind Architecture
## Startup Legal Launchpad — Technical Design

**Version:** 3.0 (Pack-Focused MVP)
**Last Updated:** 2025-10-22
**Status:** Active Development

> **Note:** This document is part of the MVP pivot to two commercial packs. For complete implementation blueprint, see `MVP_STARTUP_LAUNCHPAD.md`.

---

## 1. Product Scope

LegalMind is a **Startup Legal Launchpad** providing two commercial packs:

### Pack 1: Fundraising Pack (7 Templates)
1. Founders' Agreement
2. Shareholders' Agreement
3. SAFE (Post-Money)
4. Convertible Note
5. Seed Term Sheet
6. IP Assignment Agreement
7. Due Diligence Checklist

### Pack 2: SaaS Operations Pack (7 Templates)
1. SaaS Subscription Agreement
2. Master Services Agreement (MSA)
3. Data Processing Agreement (DPA)
4. Privacy Policy (GDPR baseline)
5. Terms of Use
6. Service Level Agreement (SLA)
7. Cookie Policy

**Jurisdictions:** UK, US-DE, DE, FR, CZ (baseline set)

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      USER JOURNEY                           │
│                                                             │
│  Landing → Onboarding (4Q) → Pack Select → Template →      │
│  Questionnaire → Preview → Payment → Export → [Lawyer]     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 14)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   /packs     │  │  /generate   │  │  /pricing    │     │
│  │   Listing    │  │  Q&A Flow    │  │  Tiers       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 API GATEWAY (NestJS)                        │
│  Auth (Clerk) | Rate Limit (Redis) | Versioning (/v1)      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               APPLICATION SERVICES                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pack Service                                        │  │
│  │  • GET /packs                                        │  │
│  │  • GET /packs/{id}/templates                         │  │
│  │  • Access control guard (tier check)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Template Service                                    │  │
│  │  • Fetch template + overlay                          │  │
│  │  • Merge jurisdiction rules                          │  │
│  │  • Resolve JSONLogic variables                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Generation Service (Python FastAPI)                │  │
│  │  • BullMQ async queue                                │  │
│  │  • Jinja2 templating                                 │  │
│  │  • DOCX/PDF export                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Billing Service (Stripe)                           │  │
│  │  • Checkout sessions                                 │  │
│  │  • Webhook handling                                  │  │
│  │  • Tier validation                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Referral Service (Scale tier)                      │  │
│  │  • Lawyer matching                                   │  │
│  │  • Revenue tracking (20-25% commission)              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                              │
│  PostgreSQL (Templates, Users) | Redis (Cache, Queue)      │
│  S3 (Documents) | ElasticSearch (Lawyer search - future)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Core Design Principles

### 3.1 Pack-First Organization
**Everything is scoped to a pack (fundraising or saas).**

```typescript
// Database schema
templates {
  id: uuid
  pack: "fundraising" | "saas"  // NEW FIELD
  title: string
  access_level: "starter" | "pro" | "scale"
  ...
}

// API endpoints
GET /packs                           // List packs
GET /packs/fundraising/templates     // Templates in pack
GET /packs/saas/templates
POST /generate/fundraising/safe      // Generate by pack + template
```

### 3.2 Pricing Tier Access Control

**Three tiers with different access levels:**

| Tier | Price | Access | Features |
|------|-------|--------|----------|
| **Starter** | €99 one-time | 1 pack (choose) | 5 docs/mo, 1 jurisdiction |
| **Pro** | €49/mo | Both packs | Unlimited docs, all jurisdictions |
| **Scale** | €149/mo | Both packs + | Lawyer referral, quarterly review |

**Implementation:**

```typescript
// Access control middleware
@UseGuards(TierAccessGuard)
@RequiredTier('starter')  // Minimum tier required
async getTemplates(@Param('pack') pack: string) {
  const user = this.request.user;

  // Starter tier: check if user purchased this specific pack
  if (user.tier === 'starter') {
    if (!user.purchased_packs.includes(pack)) {
      throw new ForbiddenException({
        error: 'INSUFFICIENT_TIER',
        message: 'Upgrade to Pro to access this pack',
        required_tier: 'pro'
      });
    }
  }

  // Pro/Scale: access to both packs
  return this.packService.getTemplates(pack);
}
```

### 3.3 Overlay Merge System

**Jurisdiction overlays customize templates per legal system:**

```javascript
// Template resolution flow
async function resolveTemplate(templateId, jurisdiction, userAnswers) {
  // 1. Load base template (jurisdiction-agnostic)
  const base = await db.templates.findById(templateId);

  // 2. Load jurisdiction overlay
  const overlay = await db.overlays.find({
    template_id: templateId,
    jurisdiction_code: jurisdiction
  });

  // 3. Merge overlay (replace/append clauses)
  let template = mergeOverlay(base.content, overlay.rules);

  // 4. Evaluate conditional logic (JSONLogic)
  template = evaluateConditionals(template, userAnswers);

  // 5. Interpolate variables
  template = interpolateVariables(template, userAnswers);

  return template;
}

// Example overlay structure
{
  "template_id": "founders-agreement",
  "jurisdiction_code": "UK",
  "overlay_rules": {
    "clauses": [
      {
        "clause_id": "governing_law",
        "action": "replace",
        "content": "This Agreement shall be governed by the laws of England and Wales."
      },
      {
        "clause_id": "vesting_schedule",
        "action": "append",
        "content": "**UK Tax Note:** Consider Entrepreneurs' Relief under TCGA 1992."
      }
    ],
    "terminology": {
      "equity": "ordinary shares",
      "board": "board of directors"
    },
    "formatting": {
      "date_format": "DD/MM/YYYY",
      "currency": "GBP"
    }
  }
}
```

### 3.4 Questionnaire Engine (JSONLogic)

**Conditional questions based on user answers:**

```json
{
  "template_id": "founders-agreement",
  "questions": [
    {
      "id": "has_vesting",
      "type": "boolean",
      "label": "Do you want a vesting schedule for founder equity?",
      "required": true
    },
    {
      "id": "vesting_cliff_months",
      "type": "number",
      "label": "Vesting cliff period (months)?",
      "conditional_logic": {
        "==": [{"var": "has_vesting"}, true]
      },
      "validation": {
        "min": 0,
        "max": 24
      }
    }
  ]
}
```

**Frontend evaluation:**

```typescript
import jsonLogic from 'json-logic-js';

function shouldShowQuestion(question, answers) {
  if (!question.conditional_logic) return true;
  return jsonLogic.apply(question.conditional_logic, answers);
}
```

---

## 4. Technology Stack

### 4.1 Frontend
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Framework | **Next.js 14** (App Router) | SSR, i18n, SEO |
| UI | **Tailwind CSS** + Headless UI | Rapid dev, accessible |
| State | **Zustand** + React Query | Lightweight |
| Forms | **React Hook Form** + Zod | Type-safe validation |
| i18n | **next-intl** | Jurisdiction-aware |

### 4.2 Backend
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Framework | **NestJS** (Node.js) | Enterprise-grade, TypeScript |
| API | **REST** (OpenAPI 3.1) | MVP simplicity |
| Auth | **Clerk** | Multi-tenant ready |
| Queue | **BullMQ** (Redis) | Async doc generation |
| Templating | **Jinja2** (Python) | Legal-grade templating |

### 4.3 Data & Storage
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Primary DB | **PostgreSQL 15** | JSONB support, ACID |
| Cache | **Redis** | Session, rate-limit |
| Object Storage | **AWS S3** / DO Spaces | Generated documents |
| Search | **ElasticSearch** (future) | Lawyer profiles |

### 4.4 Payments & Infrastructure
| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Payments | **Stripe** | EU VAT, subscriptions |
| Hosting | **Vercel** (FE) + AWS ECS (BE) | Edge optimization |
| CI/CD | **GitHub Actions** | Automated testing |
| Monitoring | **DataDog** + Sentry | APM, errors |
| CDN | **Cloudflare** | DDoS protection |

---

## 5. Data Model (Simplified)

**Core entities with pack integration:**

```sql
-- Templates table (updated with pack field)
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  pack VARCHAR(20) NOT NULL,  -- 'fundraising' | 'saas'
  code VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  access_level VARCHAR(20) NOT NULL,  -- 'starter' | 'pro' | 'scale'
  pricing_tier VARCHAR(20)[] NOT NULL,  -- ['starter', 'pro', 'scale']
  jurisdictions VARCHAR(20)[] NOT NULL,  -- ['UK', 'US-DE', ...]
  complexity_score INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Overlays table
CREATE TABLE overlays (
  id UUID PRIMARY KEY,
  template_id UUID REFERENCES templates(id),
  jurisdiction_code VARCHAR(20) NOT NULL,
  overlay_rules JSONB NOT NULL,
  legal_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(template_id, jurisdiction_code)
);

-- Users table (with purchased_packs)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(320) UNIQUE NOT NULL,
  clerk_user_id VARCHAR(255) UNIQUE NOT NULL,
  tier VARCHAR(20) DEFAULT 'free',  -- 'free' | 'starter' | 'pro' | 'scale'
  purchased_packs VARCHAR(20)[],  -- ['fundraising'] or ['saas'] for Starter
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan_tier VARCHAR(20) NOT NULL,  -- 'starter' | 'pro' | 'scale'
  status VARCHAR(20) NOT NULL,  -- 'active' | 'cancelled' | 'past_due'
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**See `DATABASE_SCHEMA_V2.md` for complete schema.**

---

## 6. API Endpoints

**Pack-focused API design:**

```
Authentication:
  POST /auth/register
  POST /auth/login
  GET  /auth/me

Packs:
  GET  /packs                              # List packs (fundraising, saas)
  GET  /packs/{pack_id}/templates          # Templates in pack (access-gated)

Questionnaires:
  GET  /questionnaire/{pack_id}/{template_id}?jurisdiction={code}

Generation:
  POST /generate/{pack_id}/{template_id}   # Generate DOCX/PDF
  GET  /documents/{document_id}            # Get document status + download URL

Billing:
  POST /purchase                           # Create Stripe checkout
  POST /webhooks/stripe                    # Stripe webhook handler

Referrals (Scale tier):
  POST /referral                           # Create lawyer referral
  GET  /referrals                          # List user's referrals
```

**See `API_SPECIFICATION.yaml` (updated) for full OpenAPI spec.**

---

## 7. Security Architecture

### 7.1 Authentication Flow (Clerk)

```
User → Frontend → Clerk (JWT) → API Gateway → Verify Token → Service
```

### 7.2 Authorization (RBAC + Access Control)

```typescript
// Role-based access control
enum Role {
  FOUNDER = 'founder',
  LAWYER = 'lawyer',
  ADMIN = 'admin'
}

enum Tier {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  SCALE = 'scale'
}

// Guards
@UseGuards(TierAccessGuard)
@RequiredTier(Tier.PRO)
async unlimitedFeature() { ... }

@UseGuards(RoleGuard)
@RequiredRole(Role.ADMIN)
async adminFunction() { ... }
```

### 7.3 Document Security

- **Access Control:** User can only access own documents (UUID-based URLs)
- **Expiry:** Download links expire after 7 days
- **Encryption:** S3 server-side encryption (SSE-KMS)
- **Audit:** All access logged (IP, timestamp, action)

---

## 8. Scalability & Performance

### 8.1 Performance Targets

| Metric | Target |
|--------|--------|
| API Response Time (p95) | <200ms |
| Document Generation (simple) | <5s |
| Document Generation (complex) | <15s |
| Page Load (FCP) | <1.5s |
| Concurrent Users | 10K (Year 1) |

### 8.2 Scaling Strategy

**Horizontal:**
- API Gateway: 3+ replicas (auto-scale)
- Generation Service: 5+ workers (BullMQ)

**Vertical:**
- PostgreSQL: Read replicas for analytics
- Redis: Cluster mode for HA

**CDN:**
- Static assets cached at edge (Cloudflare)
- API responses cached (5min TTL for templates)

---

## 9. Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE                           │
│               (CDN, DDoS Protection, SSL)                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                         VERCEL                              │
│                  (Next.js Frontend)                         │
│              Edge Functions, ISR, i18n                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       AWS ECS                               │
│                   (NestJS Backend)                          │
│           Auto-scaling, Load Balancing                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌───────────────────┬─────────────────┬───────────────────────┐
│   AWS RDS (PG)    │   ElastiCache   │   S3 (Documents)      │
│   Multi-AZ        │   (Redis)       │   Versioned, WORM     │
└───────────────────┴─────────────────┴───────────────────────┘
```

**Region:** EU (Frankfurt) for GDPR compliance
**Future:** Multi-region (US, APAC) in Phase 2

---

## 10. Key Architectural Decisions (ADRs)

### ADR-001: Single Region (EU) for MVP
**Decision:** Start with EU-only, add multi-region in Phase 2
**Rationale:** 70% early users in EU, reduces complexity

### ADR-002: Modular Monolith (Not Microservices)
**Decision:** NestJS monolith + Python microservice (generation only)
**Rationale:** Faster MVP, easy to extract services later

### ADR-003: PostgreSQL with JSONB
**Decision:** PostgreSQL for primary data, JSONB for flexible schemas
**Rationale:** ACID for billing, JSONB for template metadata

### ADR-004: Async Document Generation
**Decision:** BullMQ queue for document generation
**Rationale:** Complex docs take 10-15s, better UX with progress tracking

### ADR-005: External Lawyer Booking (Cal.com)
**Decision:** Integrate Cal.com/Calendly instead of building booking
**Rationale:** Faster MVP, leverage existing tools

---

## 11. Integration Points

### 11.1 Stripe Integration

```typescript
// Checkout session creation
async createCheckout(tier: Tier, packId?: string) {
  const session = await stripe.checkout.sessions.create({
    mode: tier === 'starter' ? 'payment' : 'subscription',
    line_items: [
      {
        price: PRICE_IDS[tier],
        quantity: 1
      }
    ],
    metadata: {
      user_id: user.id,
      tier: tier,
      pack_id: packId  // For Starter tier only
    },
    success_url: `${APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/pricing`
  });

  return session.url;
}

// Webhook handler
@Post('/webhooks/stripe')
async handleWebhook(@Body() event, @Headers('stripe-signature') sig) {
  const verified = stripe.webhooks.constructEvent(event, sig, WEBHOOK_SECRET);

  switch (verified.type) {
    case 'checkout.session.completed':
      await this.activateSubscription(verified.data.object);
      break;
    case 'customer.subscription.deleted':
      await this.cancelSubscription(verified.data.object);
      break;
  }
}
```

### 11.2 Lawyer Referral Flow

```typescript
// Match lawyer based on jurisdiction + specialization
async matchLawyer(jurisdiction: string, specialization: string) {
  return await db.lawyers.findOne({
    license_jurisdiction: jurisdiction,
    specialties: { $in: [specialization] },
    accepts_referrals: true,
    is_verified: true
  }).sort({ rating_average: -1 });
}

// Create referral
@Post('/referral')
@UseGuards(TierAccessGuard)
@RequiredTier(Tier.SCALE)  // Scale tier only
async createReferral(@Body() dto: CreateReferralDto) {
  const lawyer = await this.matchLawyer(dto.jurisdiction, dto.specialization);

  const referral = await db.referrals.create({
    user_id: user.id,
    lawyer_id: lawyer.id,
    document_id: dto.document_id,
    status: 'initiated'
  });

  // Send email to lawyer
  await this.emailService.send({
    to: lawyer.email,
    template: 'new_referral',
    data: { referral, user }
  });

  return referral;
}
```

---

## 12. Monitoring & Observability

### 12.1 Key Metrics

```typescript
// Application metrics
metrics.track('document.generated', {
  template_id: string,
  jurisdiction: string,
  generation_time_ms: number,
  user_tier: Tier
});

metrics.track('purchase.completed', {
  tier: Tier,
  pack_id?: string,
  amount_eur: number
});

metrics.track('referral.created', {
  lawyer_id: string,
  jurisdiction: string
});
```

### 12.2 Alerts

- API error rate > 1% → PagerDuty
- Document generation time > 30s → Slack
- Stripe webhook failure → Email + Slack
- DB connection pool exhausted → PagerDuty

---

## 13. Disaster Recovery

### 13.1 Backup Strategy

- **Database:** Automated daily backups (30-day retention)
- **Documents:** S3 versioning enabled (90-day retention)
- **Code:** GitHub primary + GitLab mirror

### 13.2 RTO/RPO Targets

| Component | RTO | RPO |
|-----------|-----|-----|
| API Gateway | <5 min | <1 min |
| Database | <15 min | <5 min |
| Documents | <30 min | 0 (versioned) |

---

## 14. Next Steps

1. **Review & Approve** this architecture
2. **Set up infrastructure** (AWS ECS, RDS, S3)
3. **Begin Week 3** implementation (Overlay API)
4. **Populate CMS** with 14 templates
5. **Configure Stripe** test mode

---

**Related Documents:**
- `MVP_STARTUP_LAUNCHPAD.md` — Master implementation blueprint
- `DATABASE_SCHEMA_V2.md` — Complete database design
- `ROADMAP.md` — Weeks 3-8 delivery plan
- `API_SPECIFICATION.yaml` — OpenAPI 3.1 spec

---

**Document Owner:** Engineering Lead
**Review Cycle:** Weekly during MVP development
**Version Control:** Git-tracked
