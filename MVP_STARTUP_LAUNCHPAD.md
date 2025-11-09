# LegalMind MVP: Startup Legal Launchpad
## Two-Pack Commercial Product Strategy

**Version:** 3.0 (Pivot to Commercial Packs)
**Last Updated:** 2025-10-22
**Status:** Master Implementation Blueprint

---

## Executive Summary

LegalMind pivots from broad legal template platform to focused **Startup Legal Launchpad**:

> "Everything a startup needs to raise capital and start selling — legally, globally."

**Two Launch Packs:**
1. **Fundraising Pack** (7 templates) — For raising capital
2. **SaaS Operations Pack** (7 templates) — For selling services

**Key Differentiators:**
- Jurisdiction overlays (UK, US-DE, DE, FR, CZ baseline)
- JSONLogic-powered conditional clauses
- Guided questionnaire engine
- Stripe-gated pricing tiers
- Lawyer referral integration

---

# Section 1: Updated Project Structure

## 1.1 File Tree

```
/legalmind
├── /packs                          # NEW: Pack-based organization
│   ├── /fundraising
│   │   ├── /templates
│   │   │   ├── founders-agreement.json
│   │   │   ├── shareholders-agreement.json
│   │   │   ├── safe-post-money.json
│   │   │   ├── convertible-note.json
│   │   │   ├── seed-term-sheet.json
│   │   │   ├── ip-assignment.json
│   │   │   └── due-diligence-checklist.json
│   │   ├── /overlays
│   │   │   ├── UK.overlay.json
│   │   │   ├── US-DE.overlay.json
│   │   │   ├── DE.overlay.json
│   │   │   ├── FR.overlay.json
│   │   │   └── CZ.overlay.json
│   │   └── /questionnaires
│   │       ├── founders-agreement.questions.json
│   │       ├── safe.questions.json
│   │       └── [... 7 questionnaires total]
│   └── /saas
│       ├── /templates
│       │   ├── saas-subscription-agreement.json
│       │   ├── master-services-agreement.json
│       │   ├── data-processing-agreement.json
│       │   ├── privacy-policy.json
│       │   ├── terms-of-use.json
│       │   ├── service-level-agreement.json
│       │   └── cookie-policy.json
│       ├── /overlays
│       │   ├── UK.overlay.json
│       │   ├── US-DE.overlay.json
│       │   ├── DE.overlay.json
│       │   ├── FR.overlay.json
│       │   └── CZ.overlay.json
│       └── /questionnaires
│           ├── saas-subscription.questions.json
│           ├── dpa.questions.json
│           └── [... 7 questionnaires total]
│
├── /api
│   ├── openapi.yaml                # Updated with pack endpoints + pricing
│   ├── /src
│   │   ├── /modules
│   │   │   ├── /packs              # NEW: Pack management module
│   │   │   ├── /templates
│   │   │   ├── /generation
│   │   │   ├── /billing            # Stripe integration
│   │   │   ├── /referrals          # Lawyer referral system
│   │   │   └── /auth
│   │   └── main.ts
│   └── package.json
│
├── /db
│   ├── /migrations
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_packs.sql       # NEW: Pack + pricing fields
│   │   └── 003_add_access_control.sql
│   ├── schema.sql
│   └── seed.sql
│
├── /cms                            # Headless CMS configuration
│   ├── collections.json            # Updated with pack metadata
│   ├── /content
│   │   ├── /templates              # Template content (Markdown + DOCX)
│   │   └── /overlays               # Jurisdiction overlays
│   └── config.json
│
├── /frontend
│   ├── /app                        # Next.js 14 App Router
│   │   ├── /[locale]
│   │   │   ├── /packs              # Pack listing pages
│   │   │   ├── /generate           # Document generation flow
│   │   │   ├── /pricing            # Pricing tier selection
│   │   │   └── /dashboard
│   │   └── layout.tsx
│   ├── /components
│   │   ├── /onboarding             # NEW: Startup onboarding flow
│   │   ├── /questionnaire          # Guided Q&A engine
│   │   └── /pricing
│   └── package.json
│
├── /docs
│   ├── MVP_STARTUP_LAUNCHPAD.md    # THIS FILE (master blueprint)
│   ├── ARCHITECTURE.md             # Updated architecture
│   ├── ROADMAP.md                  # Weeks 3-8 focused roadmap
│   ├── DATABASE_SCHEMA_V2.md       # Existing schema (retained)
│   ├── QA_CHECKLIST.md             # NEW: Testing plan
│   └── PRICING_STRATEGY.md         # NEW: Pricing logic
│
├── /scripts
│   ├── /seed
│   │   ├── seed-packs.ts           # Populate pack metadata
│   │   ├── seed-jurisdictions.ts   # Baseline 5 jurisdictions
│   │   └── seed-templates.ts       # 14 templates only
│   └── /migration
│
├── package.json
├── turbo.json                      # Monorepo config (if using Turborepo)
└── README.md
```

## 1.2 Key Structural Changes

### ✅ Additions (New in Pack-Focused MVP)
1. `/packs` directory — Segregates Fundraising vs SaaS Operations
2. `/api/src/modules/packs` — Pack management logic
3. `/frontend/app/[locale]/packs` — Pack browsing UI
4. `/docs/PRICING_STRATEGY.md` — Pricing tier documentation
5. `/docs/QA_CHECKLIST.md` — Testing validation plan

### 🔄 Modifications (Pivoted from V2)
1. **Template scope narrowed**: 50+ templates → 14 templates (7 per pack)
2. **Category schema simplified**: 6 categories → 2 packs
3. **CMS collections**: Added `pack`, `access_level`, `pricing_tier` fields
4. **API endpoints**: Changed from `/templates` → `/packs/{pack_id}/templates`

### ❌ Removed (Out of Scope for MVP)
1. Global template library (158 templates)
2. B2B/B2C/P2P categorization
3. Multi-region data residency (start with EU only per ADR-001)
4. Embedded lawyer booking (use external Cal.com per ADR-005)

---

# Section 2: Architecture Summary

## 2.1 System Flow

```
User Journey Flow:
┌─────────────┐
│ 1. Landing  │ → Startup founder visits site
└──────┬──────┘
       ↓
┌─────────────┐
│ 2. Onboard  │ → Answer 4 questions:
└──────┬──────┘     - Business stage? (pre-seed / early revenue / growth)
       ↓             - Target markets? (EU / UK / US)
       ↓             - Business model? (SaaS / service-based)
       ↓             - Primary need? (fundraising / operations)
┌─────────────┐
│ 3. Pack     │ → Recommended pack displayed
│    Select   │    (Fundraising OR SaaS Operations)
└──────┬──────┘
       ↓
┌─────────────┐
│ 4. Template │ → Browse 7 templates in pack
│    Browse   │    (filtered by jurisdiction if needed)
└──────┬──────┘
       ↓
┌─────────────┐
│ 5. Question │ → Guided questionnaire (10-25 questions)
│    Flow     │    - JSONLogic conditional logic
└──────┬──────┘    - Variable validation (Zod schema)
       ↓
┌─────────────┐
│ 6. Preview  │ → See generated document preview
└──────┬──────┘
       ↓
┌─────────────┐
│ 7. Payment  │ → Stripe checkout (if tier insufficient)
│    Wall     │    - Starter: €99 one-time (1 pack)
└──────┬──────┘    - Pro: €49/mo (both packs)
       ↓             - Scale: €149/mo (+ lawyer referral)
┌─────────────┐
│ 8. Export   │ → Download DOCX/PDF
└──────┬──────┘    - Optional: Refer to lawyer
       ↓
┌─────────────┐
│ 9. Lawyer   │ → [Scale tier only]
│   Referral  │    - Match with verified lawyer
└─────────────┘    - Track engagement + revenue share
```

## 2.2 Technical Architecture (Updated)

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Next.js    │  │  Onboarding  │  │   Pricing    │     │
│  │  Pack Pages  │  │     Flow     │  │    Tiers     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (NestJS)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │  Rate Limit  │  │   Versioning │     │
│  │   (Clerk)    │  │   (Redis)    │  │    (/v1/)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION SERVICES                      │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pack Service (NEW)                                  │  │
│  │  - GET /packs → List packs (fundraising, saas)      │  │
│  │  - GET /packs/{id}/templates → List templates       │  │
│  │  - Access control guard (check user tier)           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Template Service                                    │  │
│  │  - Fetch template by ID                              │  │
│  │  - Merge jurisdiction overlay                        │  │
│  │  - Resolve JSONLogic variables                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Generation Service (Python FastAPI)                │  │
│  │  - Async queue (BullMQ)                              │  │
│  │  - Jinja2 templating engine                          │  │
│  │  - DOCX export (docxtemplater)                       │  │
│  │  - PDF conversion (Puppeteer)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Billing Service (Stripe Integration)               │  │
│  │  - Create checkout session                           │  │
│  │  - Webhook handler (subscription events)            │  │
│  │  - Access level validation middleware                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Referral Service                                    │  │
│  │  - Match lawyer (Scale tier only)                    │  │
│  │  - Track engagement                                  │  │
│  │  - Calculate revenue share (20-25%)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Redis     │  │   S3/Spaces  │     │
│  │  (Templates, │  │   (Cache,    │  │  (Generated  │     │
│  │   Users,     │  │   Sessions,  │  │  Documents)  │     │
│  │   Billing)   │  │   Queue)     │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Stripe     │  │  SendGrid    │  │  Cal.com     │     │
│  │  (Payments)  │  │   (Email)    │  │  (Booking)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 2.3 Core Architectural Principles

### Principle 1: Pack-First Design
- **Everything** is scoped to a pack (fundraising or saas)
- Templates, overlays, questionnaires are pack-specific
- User purchases grant access to pack(s), not individual templates

### Principle 2: Pricing Tier Access Control
```typescript
// Middleware: Check user access before template generation
async function checkAccess(user: User, pack: Pack): Promise<boolean> {
  const tier = user.subscription.plan_tier;

  if (tier === 'starter') {
    // Can access ONE pack (whichever they purchased)
    return user.purchased_packs.includes(pack.id);
  }

  if (tier === 'pro' || tier === 'scale') {
    // Can access BOTH packs
    return true;
  }

  return false; // Free tier: no access
}
```

### Principle 3: Overlay Merge Logic
```javascript
// Template resolution flow
function resolveTemplate(baseTemplate, jurisdiction, userAnswers) {
  // 1. Load base template
  let template = loadTemplate(baseTemplate.id);

  // 2. Apply jurisdiction overlay
  const overlay = loadOverlay(baseTemplate.pack, jurisdiction);
  template = mergeOverlay(template, overlay);

  // 3. Evaluate JSONLogic conditional clauses
  template = evaluateConditionals(template, userAnswers);

  // 4. Interpolate variables
  template = interpolateVariables(template, userAnswers);

  return template;
}
```

### Principle 4: Jurisdiction Baseline
- **MVP supports 5 jurisdictions**: UK, US-DE, DE, FR, CZ
- Each template has 5 overlay files (one per jurisdiction)
- Overlays define jurisdiction-specific clauses, terminology, legal references
- Future expansion: Add new jurisdiction = add 14 new overlay files

---

# Section 3: Updated Roadmap (Weeks 3-8)

## Week 3: Overlay API Implementation
**Objective:** Build jurisdiction overlay resolution system

### Tasks
- [ ] Design overlay JSON schema (see Section 5.2)
- [ ] Create overlay merge algorithm
- [ ] Build API endpoint: `GET /overlays/{jurisdiction}/{template_id}`
- [ ] Test overlay application for all 14 templates × 5 jurisdictions = 70 combinations
- [ ] Document overlay authoring guide

**Deliverable:** Overlay system functional for 5 jurisdictions

---

## Week 4: Fundraising Pack Pilot (5 Templates)
**Objective:** Launch subset of Fundraising Pack for alpha testing

### Templates
1. Founders' Agreement
2. SAFE (Post-Money)
3. IP Assignment Agreement
4. Shareholders' Agreement (basic version)
5. Due Diligence Checklist

### Tasks
- [ ] Author template content (Markdown + DOCX structure)
- [ ] Create 5 questionnaires (10-15 questions each)
- [ ] Build 5 × 5 = 25 jurisdiction overlays
- [ ] Implement JSONLogic conditional logic
- [ ] QA testing: Generate 25 sample documents (5 templates × 5 jurisdictions)
- [ ] Alpha test with 10 startup founders

**Deliverable:** 5 templates live in production

---

## Week 5: SaaS Operations Pack (7 Templates)
**Objective:** Complete SaaS pack for revenue-stage startups

### Templates
1. SaaS Subscription Agreement
2. Data Processing Agreement (DPA)
3. Privacy Policy (GDPR baseline)
4. Master Services Agreement (MSA)
5. Terms of Use
6. Service Level Agreement (SLA)
7. Cookie Policy

### Tasks
- [ ] Author 7 template content files
- [ ] Create 7 questionnaires (8-20 questions each)
- [ ] Build 7 × 5 = 35 jurisdiction overlays
- [ ] GDPR compliance review for Privacy Policy + DPA
- [ ] QA testing: Generate 35 sample documents

**Deliverable:** 7 SaaS templates live

---

## Week 6: Onboarding + Payment Flow
**Objective:** Build user acquisition and monetization funnel

### Frontend Components
- [ ] Onboarding questionnaire UI (4 questions)
- [ ] Pack recommendation engine
- [ ] Pricing tier selection page
- [ ] Stripe checkout integration
- [ ] User dashboard (show purchased packs + usage)

### Backend Services
- [ ] Stripe webhook handler (subscription.created, subscription.updated, etc.)
- [ ] Access control middleware (tier-based gating)
- [ ] User profile API (`GET /user/profile`, `PATCH /user/profile`)
- [ ] Purchase tracking (store purchased packs in `users.purchased_packs` JSON field)

### Tasks
- [ ] Design onboarding flow (Figma wireframes)
- [ ] Implement Stripe Checkout (test mode)
- [ ] Create pricing page (3 tiers: Starter, Pro, Scale)
- [ ] Build payment success/failure pages
- [ ] Test subscription lifecycle (create, upgrade, cancel)

**Deliverable:** End-to-end purchase flow functional

---

## Week 7: Pro/Scale Tiers + Lawyer Referral Trigger
**Objective:** Unlock premium features and referral system

### Pro Tier Features
- [ ] Unlimited document generation
- [ ] Access to both packs (Fundraising + SaaS)
- [ ] All 5 jurisdictions unlocked
- [ ] Save drafts (resume questionnaire later)
- [ ] Download history (re-download documents)

### Scale Tier Features (All Pro features +)
- [ ] Lawyer referral matching
- [ ] Quarterly legal review (optional add-on)
- [ ] Priority support (48h email response)
- [ ] Custom jurisdiction request (future feature)

### Lawyer Referral System
- [ ] Create `POST /referrals` endpoint
- [ ] Match algorithm (jurisdiction + specialization)
- [ ] Email notification to lawyer (new referral available)
- [ ] Referral tracking dashboard (for lawyers)
- [ ] Revenue attribution (20% commission to LegalMind)

**Deliverable:** Scale tier functional with lawyer matching

---

## Week 8: QA + Launch Prep
**Objective:** Final testing, SEO, and go-to-market readiness

### Quality Assurance (See Section 6)
- [ ] Run full QA checklist (all 70 template-jurisdiction combinations)
- [ ] Validate Stripe gating (HTTP 403 if tier insufficient)
- [ ] Load testing (100 concurrent users)
- [ ] Security audit (OWASP Top 10 check)
- [ ] GDPR compliance review

### Content & Marketing
- [ ] Write landing page copy (homepage + pack pages)
- [ ] SEO optimization (meta tags, structured data)
- [ ] Create email onboarding sequence (5 emails)
- [ ] Record demo videos (2 min per pack)
- [ ] Prepare Product Hunt launch

### Documentation
- [ ] User guide (how to generate documents)
- [ ] Legal disclaimers (UPL compliance)
- [ ] FAQ page (20 common questions)
- [ ] Blog post: "Launch announcement"

**Deliverable:** Production-ready MVP

---

# Section 4: OpenAPI 3.1 Specification (Example)

```yaml
openapi: 3.1.0
info:
  title: LegalMind Startup Launchpad API
  version: 1.0.0
  description: |
    API for generating legal documents via two commercial packs:
    - Fundraising Pack (7 templates)
    - SaaS Operations Pack (7 templates)

    Pricing tiers: Starter (€99 one-time), Pro (€49/mo), Scale (€149/mo)

servers:
  - url: https://api.legalmind.com/v1
    description: Production
  - url: https://api.staging.legalmind.com/v1
    description: Staging

security:
  - bearerAuth: []

paths:
  /packs:
    get:
      summary: List available packs
      description: Returns Fundraising Pack and SaaS Operations Pack metadata
      tags:
        - Packs
      responses:
        '200':
          description: List of packs
          content:
            application/json:
              schema:
                type: object
                properties:
                  packs:
                    type: array
                    items:
                      $ref: '#/components/schemas/Pack'
              example:
                packs:
                  - id: "fundraising"
                    title: "Fundraising Pack"
                    description: "Everything you need to raise capital"
                    template_count: 7
                    jurisdictions: ["UK", "US-DE", "DE", "FR", "CZ"]
                    access_level: "starter"
                    pricing_tier: ["starter", "pro", "scale"]
                  - id: "saas"
                    title: "SaaS Operations Pack"
                    description: "Launch and scale your SaaS business legally"
                    template_count: 7
                    jurisdictions: ["UK", "US-DE", "DE", "FR", "CZ"]
                    access_level: "starter"
                    pricing_tier: ["starter", "pro", "scale"]

  /packs/{pack_id}/templates:
    get:
      summary: List templates in a pack
      tags:
        - Packs
      parameters:
        - name: pack_id
          in: path
          required: true
          schema:
            type: string
            enum: [fundraising, saas]
        - name: jurisdiction
          in: query
          schema:
            type: string
            enum: [UK, US-DE, DE, FR, CZ]
          description: Filter by jurisdiction
      responses:
        '200':
          description: List of templates
          content:
            application/json:
              schema:
                type: object
                properties:
                  templates:
                    type: array
                    items:
                      $ref: '#/components/schemas/Template'
        '403':
          description: Access denied (insufficient tier)
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              example:
                error: "INSUFFICIENT_TIER"
                message: "Upgrade to Pro to access this pack"
                required_tier: "pro"

  /questionnaire/{pack_id}/{template_id}:
    get:
      summary: Retrieve questionnaire for a template
      tags:
        - Questionnaires
      parameters:
        - name: pack_id
          in: path
          required: true
          schema:
            type: string
        - name: template_id
          in: path
          required: true
          schema:
            type: string
        - name: jurisdiction
          in: query
          required: true
          schema:
            type: string
            enum: [UK, US-DE, DE, FR, CZ]
      responses:
        '200':
          description: Questionnaire definition
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Questionnaire'

  /generate/{pack_id}/{template_id}:
    post:
      summary: Generate document (DOCX/PDF)
      description: |
        Requires valid subscription tier:
        - Starter: 1 pack access
        - Pro: Both packs
        - Scale: Both packs + lawyer referral
      tags:
        - Generation
      parameters:
        - name: pack_id
          in: path
          required: true
          schema:
            type: string
        - name: template_id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                jurisdiction:
                  type: string
                  enum: [UK, US-DE, DE, FR, CZ]
                language:
                  type: string
                  enum: [en, de, fr, cs]
                answers:
                  type: object
                  description: User answers to questionnaire
                  additionalProperties: true
                format:
                  type: string
                  enum: [docx, pdf]
                  default: docx
              required:
                - jurisdiction
                - answers
            example:
              jurisdiction: "UK"
              language: "en"
              answers:
                company_name: "Acme Ltd"
                incorporation_date: "2024-01-15"
                founders: [
                  { name: "Alice Smith", equity: 60 },
                  { name: "Bob Jones", equity: 40 }
                ]
              format: "docx"
      responses:
        '202':
          description: Document generation queued
          content:
            application/json:
              schema:
                type: object
                properties:
                  document_id:
                    type: string
                    format: uuid
                  status:
                    type: string
                    enum: [queued, generating]
                  estimated_time_seconds:
                    type: integer
              example:
                document_id: "550e8400-e29b-41d4-a716-446655440000"
                status: "generating"
                estimated_time_seconds: 8
        '403':
          description: Insufficient tier or quota exceeded
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /documents/{document_id}:
    get:
      summary: Get document status and download URL
      tags:
        - Documents
      parameters:
        - name: document_id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Document ready
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Document'
              example:
                id: "550e8400-e29b-41d4-a716-446655440000"
                status: "completed"
                file_docx_url: "https://cdn.legalmind.com/docs/550e8400.docx"
                file_pdf_url: "https://cdn.legalmind.com/docs/550e8400.pdf"
                expiry_date: "2025-10-29T12:00:00Z"
                created_at: "2025-10-22T10:30:00Z"

  /purchase:
    post:
      summary: Create Stripe Checkout session
      tags:
        - Billing
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                tier:
                  type: string
                  enum: [starter, pro, scale]
                pack_id:
                  type: string
                  enum: [fundraising, saas]
                  description: Required for Starter tier only
                billing_interval:
                  type: string
                  enum: [monthly, annual]
                  description: Required for Pro/Scale tiers
              required:
                - tier
      responses:
        '200':
          description: Checkout session created
          content:
            application/json:
              schema:
                type: object
                properties:
                  checkout_url:
                    type: string
                    format: uri
                  session_id:
                    type: string
              example:
                checkout_url: "https://checkout.stripe.com/pay/cs_test_..."
                session_id: "cs_test_123"

  /referral:
    post:
      summary: Trigger lawyer referral (Scale tier only)
      tags:
        - Referrals
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                document_id:
                  type: string
                  format: uuid
                jurisdiction:
                  type: string
                specialization:
                  type: string
                  enum: [corporate, ip, employment, commercial]
                message:
                  type: string
                  maxLength: 500
              required:
                - document_id
                - jurisdiction
                - specialization
      responses:
        '201':
          description: Referral created
          content:
            application/json:
              schema:
                type: object
                properties:
                  referral_id:
                    type: string
                    format: uuid
                  matched_lawyer:
                    $ref: '#/components/schemas/Lawyer'
        '403':
          description: Feature requires Scale tier
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Pack:
      type: object
      properties:
        id:
          type: string
          enum: [fundraising, saas]
        title:
          type: string
        description:
          type: string
        template_count:
          type: integer
        jurisdictions:
          type: array
          items:
            type: string
        access_level:
          type: string
          enum: [starter, pro, scale]
        pricing_tier:
          type: array
          items:
            type: string

    Template:
      type: object
      properties:
        id:
          type: string
        code:
          type: string
        title:
          type: string
        description:
          type: string
        pack:
          type: string
          enum: [fundraising, saas]
        complexity_score:
          type: integer
          minimum: 1
          maximum: 10
        estimated_time_minutes:
          type: integer
        jurisdictions:
          type: array
          items:
            type: string
        access_level:
          type: string
          enum: [starter, pro, scale]

    Questionnaire:
      type: object
      properties:
        template_id:
          type: string
        jurisdiction:
          type: string
        questions:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              type:
                type: string
                enum: [text, number, date, select, multi_select, boolean]
              label:
                type: string
              help_text:
                type: string
              required:
                type: boolean
              validation:
                type: object
              conditional_logic:
                type: object
                description: JSONLogic expression for show/hide

    Document:
      type: object
      properties:
        id:
          type: string
          format: uuid
        status:
          type: string
          enum: [draft, generating, completed, downloaded, archived]
        template_id:
          type: string
        jurisdiction:
          type: string
        file_docx_url:
          type: string
          format: uri
        file_pdf_url:
          type: string
          format: uri
        expiry_date:
          type: string
          format: date-time
        created_at:
          type: string
          format: date-time

    Lawyer:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
        firm:
          type: string
        jurisdiction:
          type: string
        specialties:
          type: array
          items:
            type: string
        hourly_rate_range:
          type: object
          properties:
            min:
              type: integer
            max:
              type: integer
        rating:
          type: number
          format: float
        calendly_url:
          type: string
          format: uri

    Error:
      type: object
      properties:
        error:
          type: string
        message:
          type: string
        required_tier:
          type: string
          enum: [starter, pro, scale]
```

---

# Section 5: CMS Schema Updates

## 5.1 Updated `collections.json`

```json
{
  "collections": [
    {
      "name": "templates",
      "label": "Legal Templates",
      "folder": "cms/content/templates",
      "create": true,
      "fields": [
        {
          "name": "id",
          "label": "Template ID",
          "widget": "string",
          "pattern": ["^[a-z0-9-]+$", "Lowercase alphanumeric with hyphens only"]
        },
        {
          "name": "pack",
          "label": "Pack",
          "widget": "select",
          "options": ["fundraising", "saas"],
          "required": true
        },
        {
          "name": "title",
          "label": "Template Title",
          "widget": "string",
          "required": true
        },
        {
          "name": "description",
          "label": "Description",
          "widget": "text",
          "required": true
        },
        {
          "name": "access_level",
          "label": "Access Level",
          "widget": "select",
          "options": ["starter", "pro", "scale"],
          "default": "starter",
          "required": true,
          "hint": "Minimum tier required to access this template"
        },
        {
          "name": "pricing_tier",
          "label": "Available in Tiers",
          "widget": "select",
          "multiple": true,
          "options": ["starter", "pro", "scale"],
          "default": ["starter", "pro", "scale"],
          "required": true
        },
        {
          "name": "jurisdictions",
          "label": "Supported Jurisdictions",
          "widget": "select",
          "multiple": true,
          "options": [
            { "label": "United Kingdom", "value": "UK" },
            { "label": "United States (Delaware)", "value": "US-DE" },
            { "label": "Germany", "value": "DE" },
            { "label": "France", "value": "FR" },
            { "label": "Czech Republic", "value": "CZ" }
          ],
          "default": ["UK", "US-DE", "DE", "FR", "CZ"],
          "required": true
        },
        {
          "name": "complexity_score",
          "label": "Complexity (1-10)",
          "widget": "number",
          "min": 1,
          "max": 10,
          "default": 5
        },
        {
          "name": "estimated_time_minutes",
          "label": "Est. Completion Time (min)",
          "widget": "number",
          "min": 5,
          "max": 120,
          "default": 15
        },
        {
          "name": "is_active",
          "label": "Active",
          "widget": "boolean",
          "default": true,
          "hint": "Uncheck to hide from users"
        },
        {
          "name": "content_markdown",
          "label": "Template Content (Markdown)",
          "widget": "markdown",
          "required": true,
          "hint": "Use {{variable_name}} for placeholders"
        },
        {
          "name": "variable_schema",
          "label": "Variable Schema (JSON)",
          "widget": "code",
          "default_language": "json",
          "required": true,
          "hint": "Define all template variables and validation rules"
        },
        {
          "name": "clause_rules",
          "label": "Conditional Logic (JSONLogic)",
          "widget": "code",
          "default_language": "json",
          "required": false,
          "hint": "JSONLogic expressions for conditional clauses"
        }
      ]
    },
    {
      "name": "overlays",
      "label": "Jurisdiction Overlays",
      "folder": "cms/content/overlays",
      "create": true,
      "fields": [
        {
          "name": "template_id",
          "label": "Template ID",
          "widget": "string",
          "required": true
        },
        {
          "name": "jurisdiction_code",
          "label": "Jurisdiction",
          "widget": "select",
          "options": ["UK", "US-DE", "DE", "FR", "CZ"],
          "required": true
        },
        {
          "name": "overlay_rules",
          "label": "Overlay Rules (JSON)",
          "widget": "code",
          "default_language": "json",
          "required": true,
          "hint": "Define jurisdiction-specific clause replacements"
        },
        {
          "name": "legal_notes",
          "label": "Legal Notes",
          "widget": "text",
          "required": false,
          "hint": "Jurisdiction-specific legal guidance"
        }
      ]
    },
    {
      "name": "questionnaires",
      "label": "Questionnaires",
      "folder": "cms/content/questionnaires",
      "create": true,
      "fields": [
        {
          "name": "template_id",
          "label": "Template ID",
          "widget": "string",
          "required": true
        },
        {
          "name": "questions",
          "label": "Questions",
          "widget": "list",
          "fields": [
            {
              "name": "id",
              "label": "Question ID",
              "widget": "string",
              "required": true
            },
            {
              "name": "type",
              "label": "Input Type",
              "widget": "select",
              "options": ["text", "number", "date", "select", "multi_select", "boolean"],
              "required": true
            },
            {
              "name": "label",
              "label": "Question Label",
              "widget": "string",
              "required": true
            },
            {
              "name": "help_text",
              "label": "Help Text",
              "widget": "text"
            },
            {
              "name": "required",
              "label": "Required",
              "widget": "boolean",
              "default": true
            },
            {
              "name": "validation",
              "label": "Validation Rules (JSON)",
              "widget": "code",
              "default_language": "json"
            },
            {
              "name": "conditional_logic",
              "label": "Show/Hide Logic (JSONLogic)",
              "widget": "code",
              "default_language": "json",
              "hint": "E.g., {\"==\": [{\"var\": \"business_type\"}, \"saas\"]}"
            }
          ]
        }
      ]
    }
  ]
}
```

## 5.2 Overlay JSON Schema Example

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Jurisdiction Overlay Schema",
  "type": "object",
  "properties": {
    "template_id": {
      "type": "string",
      "description": "Template identifier"
    },
    "jurisdiction_code": {
      "type": "string",
      "enum": ["UK", "US-DE", "DE", "FR", "CZ"]
    },
    "overlay_rules": {
      "type": "object",
      "properties": {
        "terminology": {
          "type": "object",
          "description": "Jurisdiction-specific term replacements",
          "example": {
            "company": "société",
            "shareholder": "actionnaire",
            "board_of_directors": "conseil d'administration"
          }
        },
        "clauses": {
          "type": "array",
          "description": "Clause replacements or additions",
          "items": {
            "type": "object",
            "properties": {
              "clause_id": {
                "type": "string"
              },
              "action": {
                "type": "string",
                "enum": ["replace", "append", "remove"]
              },
              "content": {
                "type": "string",
                "description": "Markdown content for the clause"
              }
            }
          }
        },
        "legal_references": {
          "type": "object",
          "description": "Jurisdiction-specific legal citations",
          "example": {
            "data_protection_act": "GDPR Article 6(1)(b)",
            "company_law": "UK Companies Act 2006"
          }
        },
        "formatting": {
          "type": "object",
          "properties": {
            "date_format": {
              "type": "string",
              "example": "DD/MM/YYYY"
            },
            "currency": {
              "type": "string",
              "example": "GBP"
            }
          }
        }
      }
    }
  }
}
```

### Example Overlay File (UK Founders' Agreement)

```json
{
  "template_id": "founders-agreement",
  "jurisdiction_code": "UK",
  "overlay_rules": {
    "terminology": {
      "company": "company",
      "shareholder": "shareholder",
      "equity": "ordinary shares"
    },
    "clauses": [
      {
        "clause_id": "governing_law",
        "action": "replace",
        "content": "This Agreement shall be governed by and construed in accordance with the laws of England and Wales."
      },
      {
        "clause_id": "dispute_resolution",
        "action": "replace",
        "content": "Any disputes arising out of or in connection with this Agreement shall be subject to the exclusive jurisdiction of the courts of England and Wales."
      },
      {
        "clause_id": "vesting_schedule",
        "action": "append",
        "content": "**Tax Considerations (UK):** Founders should consider the Entrepreneurs' Relief provisions under the Taxation of Chargeable Gains Act 1992 when structuring vesting schedules."
      }
    ],
    "legal_references": {
      "data_protection": "UK GDPR",
      "company_law": "Companies Act 2006",
      "employment_law": "Employment Rights Act 1996"
    },
    "formatting": {
      "date_format": "DD/MM/YYYY",
      "currency": "GBP"
    }
  },
  "legal_notes": "This template complies with UK company law. Founders should seek independent legal advice before execution."
}
```

---

# Section 6: QA Checklist

## 6.1 Functional Testing

### Template-to-Questionnaire Link Validation
- [ ] **Test:** Load each of 14 templates → verify linked questionnaire exists
- [ ] **Expected:** Questionnaire returns 200 OK with valid JSON schema
- [ ] **Failure scenario:** Return HTTP 404 if questionnaire missing

**Test cases:**
```bash
# Test all templates in Fundraising Pack
curl GET /questionnaire/fundraising/founders-agreement?jurisdiction=UK
curl GET /questionnaire/fundraising/shareholders-agreement?jurisdiction=UK
curl GET /questionnaire/fundraising/safe-post-money?jurisdiction=UK
curl GET /questionnaire/fundraising/convertible-note?jurisdiction=UK
curl GET /questionnaire/fundraising/seed-term-sheet?jurisdiction=UK
curl GET /questionnaire/fundraising/ip-assignment?jurisdiction=UK
curl GET /questionnaire/fundraising/due-diligence-checklist?jurisdiction=UK

# Test all templates in SaaS Pack
curl GET /questionnaire/saas/saas-subscription-agreement?jurisdiction=UK
curl GET /questionnaire/saas/master-services-agreement?jurisdiction=UK
curl GET /questionnaire/saas/data-processing-agreement?jurisdiction=UK
curl GET /questionnaire/saas/privacy-policy?jurisdiction=UK
curl GET /questionnaire/saas/terms-of-use?jurisdiction=UK
curl GET /questionnaire/saas/service-level-agreement?jurisdiction=UK
curl GET /questionnaire/saas/cookie-policy?jurisdiction=UK
```

---

### Overlay Merge Correctness
- [ ] **Test:** Generate document for template X in jurisdiction Y → verify overlay applied
- [ ] **Expected:** Jurisdiction-specific clauses present in output
- [ ] **Failure scenario:** Overlay not applied = base template returned unchanged

**Test matrix (14 templates × 5 jurisdictions = 70 combinations):**

| Template | UK | US-DE | DE | FR | CZ |
|----------|-------|-------|-------|-------|-------|
| Founders' Agreement | ✓ | ✓ | ✓ | ✓ | ✓ |
| Shareholders' Agreement | ✓ | ✓ | ✓ | ✓ | ✓ |
| SAFE | ✓ | ✓ | ✓ | ✓ | ✓ |
| Convertible Note | ✓ | ✓ | ✓ | ✓ | ✓ |
| Seed Term Sheet | ✓ | ✓ | ✓ | ✓ | ✓ |
| IP Assignment | ✓ | ✓ | ✓ | ✓ | ✓ |
| Due Diligence Checklist | ✓ | ✓ | ✓ | ✓ | ✓ |
| SaaS Subscription | ✓ | ✓ | ✓ | ✓ | ✓ |
| MSA | ✓ | ✓ | ✓ | ✓ | ✓ |
| DPA | ✓ | ✓ | ✓ | ✓ | ✓ |
| Privacy Policy | ✓ | ✓ | ✓ | ✓ | ✓ |
| Terms of Use | ✓ | ✓ | ✓ | ✓ | ✓ |
| SLA | ✓ | ✓ | ✓ | ✓ | ✓ |
| Cookie Policy | ✓ | ✓ | ✓ | ✓ | ✓ |

**Validation method:**
```bash
# Generate document
curl -X POST /generate/fundraising/founders-agreement \
  -d '{"jurisdiction": "UK", "answers": {...}}'

# Check output contains UK-specific clause
grep "governed by the laws of England and Wales" output.docx
```

---

### Stripe Pricing Tier Gating
- [ ] **Test:** User with Starter (Fundraising) tier attempts to access SaaS pack
- [ ] **Expected:** HTTP 403 with error message `"Upgrade to Pro to access this pack"`
- [ ] **Failure scenario:** User gains unauthorized access

**Test cases:**
```javascript
// Test 1: Starter (Fundraising) → Fundraising Pack (ALLOWED)
const user = { tier: 'starter', purchased_packs: ['fundraising'] };
const response = await fetch('/packs/fundraising/templates', {
  headers: { Authorization: `Bearer ${user.token}` }
});
assert(response.status === 200);

// Test 2: Starter (Fundraising) → SaaS Pack (DENIED)
const response2 = await fetch('/packs/saas/templates', {
  headers: { Authorization: `Bearer ${user.token}` }
});
assert(response2.status === 403);
assert(response2.body.error === 'INSUFFICIENT_TIER');

// Test 3: Pro tier → Both packs (ALLOWED)
const proUser = { tier: 'pro' };
const response3a = await fetch('/packs/fundraising/templates', {
  headers: { Authorization: `Bearer ${proUser.token}` }
});
const response3b = await fetch('/packs/saas/templates', {
  headers: { Authorization: `Bearer ${proUser.token}` }
});
assert(response3a.status === 200);
assert(response3b.status === 200);

// Test 4: Free tier → Any pack (DENIED)
const freeUser = { tier: 'free' };
const response4 = await fetch('/packs/fundraising/templates', {
  headers: { Authorization: `Bearer ${freeUser.token}` }
});
assert(response4.status === 403);
```

---

### Document Generation Output Validation
- [ ] **Test:** Generate DOCX/PDF for each template
- [ ] **Expected:** Non-empty file, correct metadata, no rendering errors
- [ ] **Failure scenario:** Empty file, corrupted DOCX, missing variables

**Validation checklist per document:**
1. File size > 10 KB
2. MIME type correct (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
3. All variables interpolated (no `{{variable_name}}` placeholders left)
4. Clause count matches expected (from template definition)
5. Metadata populated (document_id, user_id, created_at, jurisdiction)

**Automated test:**
```python
def test_document_generation():
    response = generate_document(
        template_id='founders-agreement',
        jurisdiction='UK',
        answers=SAMPLE_ANSWERS
    )

    assert response.status_code == 202
    document_id = response.json()['document_id']

    # Wait for generation
    time.sleep(5)

    # Fetch document
    doc = get_document(document_id)

    # Validations
    assert doc.status == 'completed'
    assert doc.file_size_bytes > 10000
    assert doc.file_docx_url is not None
    assert '{{' not in extract_docx_text(doc.file_docx_url)  # No unfilled variables
```

---

## 6.2 Integration Testing

### Stripe Webhook Handling
- [ ] **Test:** Send `checkout.session.completed` webhook
- [ ] **Expected:** User subscription created, tier upgraded, access granted
- [ ] **Failure scenario:** Webhook ignored, subscription not created

**Test scenario:**
```bash
# Simulate Stripe webhook (test mode)
curl -X POST http://localhost:3000/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "Stripe-Signature: whsec_test_..." \
  -d '{
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_123",
        "customer": "cus_test_456",
        "metadata": {
          "user_id": "550e8400-e29b-41d4-a716-446655440000",
          "tier": "pro",
          "billing_interval": "monthly"
        }
      }
    }
  }'

# Verify subscription created
SELECT * FROM subscriptions WHERE stripe_subscription_id = 'cs_test_123';
# Expected: status = 'active', plan_tier = 'pro'
```

---

### Lawyer Referral Flow
- [ ] **Test:** Scale tier user creates referral
- [ ] **Expected:** Lawyer matched, email sent, referral tracked
- [ ] **Failure scenario:** No lawyer matched, user not notified

**Test steps:**
1. User generates document (e.g., Founders' Agreement)
2. User clicks "Refer to Lawyer" (Scale tier only)
3. System matches lawyer based on jurisdiction + specialization
4. Email sent to lawyer with referral details
5. Lawyer views referral in dashboard
6. Engagement tracked in `referrals` table

---

## 6.3 Performance Testing

### Load Testing (100 Concurrent Users)
- [ ] **Tool:** k6 or Apache JMeter
- [ ] **Scenario:** 100 users generating documents simultaneously
- [ ] **Expected:** <200ms API response time (p95), no errors

**k6 script:**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 100, // 100 virtual users
  duration: '30s',
};

export default function () {
  const response = http.post('https://api.legalmind.com/v1/generate/fundraising/safe', {
    jurisdiction: 'UK',
    answers: { /* ... */ }
  });

  check(response, {
    'status is 202': (r) => r.status === 202,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
}
```

---

### Document Generation Speed
- [ ] **Test:** Measure generation time for simple vs complex templates
- [ ] **Expected:** <5s for simple (e.g., IP Assignment), <15s for complex (e.g., Shareholders' Agreement)

**Benchmarks:**
| Template | Complexity | Target Time | Actual Time |
|----------|------------|-------------|-------------|
| IP Assignment | Low (3/10) | <5s | ⏱️ TBD |
| Due Diligence Checklist | Low (4/10) | <5s | ⏱️ TBD |
| SAFE | Medium (5/10) | <8s | ⏱️ TBD |
| Privacy Policy | Medium (6/10) | <10s | ⏱️ TBD |
| Shareholders' Agreement | High (8/10) | <15s | ⏱️ TBD |

---

## 6.4 Security Testing

### OWASP Top 10 Check
- [ ] **Injection:** Test SQL injection in questionnaire answers
- [ ] **Broken Auth:** Test JWT token validation
- [ ] **XSS:** Test script injection in template variables
- [ ] **IDOR:** Test document access (user A cannot access user B's docs)
- [ ] **Security Misconfiguration:** Check CORS, CSP headers

**Example tests:**
```bash
# Test IDOR vulnerability
curl GET /documents/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <USER_B_TOKEN>"
# Expected: HTTP 403 (not authorized)

# Test SQL injection
curl POST /generate/fundraising/founders-agreement \
  -d '{"answers": {"company_name": "Acme'; DROP TABLE users;--"}}'
# Expected: Escaped/sanitized, no DB damage

# Test XSS
curl POST /generate/fundraising/founders-agreement \
  -d '{"answers": {"company_name": "<script>alert(1)</script>"}}'
# Expected: Escaped in output document
```

---

### GDPR Compliance Audit
- [ ] **Right to Erasure:** Test user deletion endpoint
- [ ] **Data Portability:** Test data export endpoint
- [ ] **Consent Management:** Verify GDPR consent banner
- [ ] **Audit Logs:** Check all document access logged with IP + timestamp

**Test:**
```bash
# Request data export
curl POST /user/export-data
# Expected: ZIP file with all user documents + audit logs

# Request account deletion
curl DELETE /user/account
# Expected: User + documents soft-deleted, hard-deleted after 30 days
```

---

## 6.5 Content Validation

### Template Legal Accuracy
- [ ] **Review:** All 14 templates reviewed by qualified lawyer
- [ ] **Checklist per template:**
  - [ ] No legal advice disclaimers present
  - [ ] Jurisdiction-specific clauses accurate
  - [ ] No outdated legal references
  - [ ] Plain language (readability score > 60)

**Reviewers:**
- UK templates: UK-qualified solicitor
- US templates: US attorney (preferably DE Bar)
- EU templates: EU lawyer with GDPR expertise

---

### Questionnaire Usability Testing
- [ ] **Test:** 5 users complete each questionnaire
- [ ] **Metrics:**
  - Completion rate > 90%
  - Average time < estimated time
  - Error rate < 5% (validation failures)
  - Clarity score > 4/5 (user survey)

---

## 6.6 Launch Readiness

### Pre-Launch Checklist
- [ ] All 70 template-jurisdiction combinations tested
- [ ] Stripe integration in production mode (not test mode)
- [ ] Legal disclaimers added to all pages
- [ ] Privacy Policy + Terms of Service published
- [ ] Email onboarding sequence configured
- [ ] Monitoring dashboards active (DataDog/Sentry)
- [ ] Backup/restore tested successfully
- [ ] DNS configured (api.legalmind.com, www.legalmind.com)
- [ ] SSL certificates installed
- [ ] Load balancer configured
- [ ] CDN cache purged

---

## 6.7 Post-Launch Monitoring

### Week 1 Metrics
- [ ] Monitor error rate (target: <1%)
- [ ] Track API response times (p50, p95, p99)
- [ ] Check document generation success rate (target: >98%)
- [ ] Monitor Stripe webhook failures
- [ ] Track user drop-off points in onboarding

### KPIs to Track
| Metric | Target (Week 1) | Target (Month 1) |
|--------|-----------------|------------------|
| Signups | 50 | 500 |
| Documents Generated | 100 | 2,000 |
| Conversion Rate (Free → Paid) | 5% | 10% |
| Avg. Document Generation Time | <10s | <8s |
| API Uptime | 99.5% | 99.9% |
| Customer Satisfaction (NPS) | 40 | 50 |

---

# Conclusion

This document provides the complete pivot blueprint for **LegalMind MVP: Startup Legal Launchpad**. All technical foundations from prior design (database schema, architecture, tech stack) are retained, while product scope narrows to two high-value commercial packs.

## Next Immediate Actions

1. **Review & Approve** this master blueprint with stakeholders
2. **Assign ownership** for Weeks 3-8 deliverables
3. **Begin Week 3** (Overlay API implementation)
4. **Populate CMS** with initial 14 templates
5. **Set up Stripe** account + webhooks in test mode

---

**Document Owner:** Product & Engineering
**Review Cycle:** Weekly (during Weeks 3-8)
**Version Control:** Git-tracked
**Status:** Ready for Implementation
