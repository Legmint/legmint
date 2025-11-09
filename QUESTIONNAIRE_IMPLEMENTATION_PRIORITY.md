# Questionnaire Implementation Priority Matrix
## Existing 10 Templates — Week 5-6 Execution Plan

**Document Version:** 1.0
**Last Updated:** 2025-10-20
**Status:** Ready for Implementation
**Execution Window:** Week 5-6 of 90-Day Launch Plan

---

## Executive Summary

This document provides a **data-driven prioritization framework** for implementing questionnaires for the 10 existing startup templates currently in the LegalMind demo.

**Current Status:**
- ✅ 1/10 templates have working questionnaires (Founders' Agreement)
- ⚠️ 9/10 templates will fail at generation due to missing questionnaires
- 🎯 Target: All 10 questionnaires implemented by end of Week 6

**Resource Allocation:**
- **Week 5:** Templates 1-5 (highest priority)
- **Week 6:** Templates 6-10 (medium priority)
- **Estimated Effort:** 40-50 hours total (1 developer + 1 legal reviewer)

---

## Prioritization Methodology

Templates are scored across 5 dimensions (1-10 scale):

| Dimension | Weight | Description |
|-----------|--------|-------------|
| **Deployment Criticality** | 30% | Cannot launch without this template |
| **User Demand** | 25% | Expected frequency of use (based on startup lifecycle) |
| **Implementation Complexity** | 20% | Number of questions, conditional logic, validation rules |
| **Revenue Impact** | 15% | Drives subscriptions or lawyer referrals |
| **Dependencies** | 10% | Other templates depend on this one |

**Scoring Formula:**
```
Priority Score = (Criticality × 0.30) + (Demand × 0.25) + (10 - Complexity) × 0.20 + (Revenue × 0.15) + (Dependencies × 0.10)
```

Higher scores = implement first.

---

## Priority Ranking (1-10)

### 🔥 Tier 1: Critical Path (Week 5, Days 1-3)

#### **Rank 1: Template #1 — Founders' Agreement**
**Status:** ✅ Questionnaire already implemented (`mockFoundersQuestionnaire`)
**Priority Score:** 9.3/10
**Effort Remaining:** 0 hours (already done)

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 10/10 | First document any startup needs. Deployment blocker. |
| Demand | 9/10 | 100% of multi-founder startups need this (80% of startups) |
| Complexity | 7/10 | 12 questions, 3 groups, vesting calculations |
| Revenue | 9/10 | High-value template (€49-99 plan), drives lawyer referrals |
| Dependencies | 8/10 | Feeds into Shareholders' Agreement, Stock Options |

**Action Required:** None. Already complete.

---

#### **Rank 2: Template #5 — NDA (Mutual)**
**Priority Score:** 8.7/10
**Estimated Effort:** 3 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 9/10 | Needed for investor meetings, partnerships, hiring discussions |
| Demand | 10/10 | Most frequently used startup document (2-5x per month) |
| Complexity | 2/10 | 6-8 simple questions, minimal logic |
| Revenue | 7/10 | Free tier suitable, but high volume drives awareness |
| Dependencies | 6/10 | Often precedes fundraising, M&A discussions |

**Questionnaire Specification:**
- **Questions:** 8
- **Groups:** 2 (Parties, Terms)
- **Conditional Logic:** 1 rule (if mutual → require both parties' info)
- **Validation:** Email format, date range checks

**Sample Questions:**
1. Party A: Company Name
2. Party A: Registered Address
3. Party A: Signatory Name & Title
4. Party B: Company/Individual Name
5. Party B: Address
6. Party B: Signatory Name & Title
7. Purpose of Disclosure (free text)
8. Agreement Duration (dropdown: 1 year, 2 years, 3 years, 5 years)

**Implementation Notes:**
- Simplest questionnaire after Founders' Agreement
- Reuse validation rules from Founders' Agreement (company name, email, address patterns)
- Create reusable "Party Info" component for questions 1-6

---

#### **Rank 3: Template #3 — Employment Contract (UK/US/DE)**
**Priority Score:** 8.5/10
**Estimated Effort:** 6 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 9/10 | First hire = legal requirement. Deployment blocker. |
| Demand | 9/10 | Needed immediately after incorporation (Month 1-3) |
| Complexity | 6/10 | 18-22 questions, jurisdiction-specific clauses |
| Revenue | 8/10 | Mid-tier template, often bundled with Stock Options |
| Dependencies | 7/10 | Pairs with Stock Options, IP Assignment |

**Questionnaire Specification:**
- **Questions:** 22
- **Groups:** 4 (Employee Info, Role & Compensation, Benefits, Terms)
- **Conditional Logic:** 8 rules (jurisdiction-specific clauses)
- **Validation:** Salary range checks, probation period limits

**Key Conditional Logic:**
```json
{
  "if": [
    {"==": [{"var": "jurisdiction"}, "UK"]},
    {"show": ["pension_contribution", "holiday_entitlement"]},
    {"show": ["vacation_days", "401k_match"]}
  ]
}
```

**Jurisdiction-Specific Questions:**
- **UK:** Pension contribution %, Holiday entitlement (statutory 28 days)
- **US:** Vacation days (no statutory minimum), 401(k) match %
- **DE:** Kündigungsfrist (notice period), Probezeit (probation max 6 months)

**Implementation Notes:**
- Create jurisdiction selector as first question
- Load jurisdiction-specific question sets dynamically
- Validate salary ranges per jurisdiction (e.g., UK National Minimum Wage)

---

### ⚡ Tier 2: High Priority (Week 5, Days 4-5)

#### **Rank 4: Template #2 — SAFE (Simple Agreement for Future Equity)**
**Priority Score:** 8.2/10
**Estimated Effort:** 5 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 8/10 | Essential for pre-seed fundraising (50% of seed rounds use SAFE) |
| Demand | 8/10 | Every startup raising pre-seed/seed capital needs this |
| Complexity | 6/10 | 15-18 questions, financial calculations (valuation cap, discount) |
| Revenue | 9/10 | High-value template, strong lawyer referral driver |
| Dependencies | 7/10 | Feeds into Cap Table, Convertible Note alternatives |

**Questionnaire Specification:**
- **Questions:** 18
- **Groups:** 4 (Company Info, Investor Info, Investment Terms, Special Provisions)
- **Conditional Logic:** 5 rules (valuation cap vs. discount, MFN clause)
- **Validation:** Financial amounts, percentages (0-100%), date logic

**Critical Questions:**
1. Company Name & Jurisdiction
2. Investor Name (Individual or Entity)
3. Purchase Amount ($)
4. SAFE Type (dropdown: Valuation Cap, Discount, Cap + Discount, MFN)
5. **If Cap:** Valuation Cap Amount ($)
6. **If Discount:** Discount Rate (%, typically 10-25%)
7. Pro Rata Rights? (Yes/No)
8. Most Favored Nation? (Yes/No)
9. Expected Trigger Event Date (optional)

**Validation Rules:**
- Purchase amount ≥ $1,000 (YC standard minimum)
- Valuation cap ≥ Purchase amount × 10 (sanity check)
- Discount rate: 10-30% (flag if outside)
- If both Cap + Discount selected, show warning about investor-friendly terms

**Implementation Notes:**
- Add financial calculator widget to preview conversion scenarios
- Link to YC SAFE post-money vs. pre-money explainer
- Strong lawyer referral CTA: "Have a lawyer review before signing"

---

#### **Rank 5: Template #4 — IP Assignment Agreement**
**Priority Score:** 7.9/10
**Estimated Effort:** 4 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 8/10 | Must have from Day 1. Investors check this in DD. |
| Demand | 7/10 | Every founder, employee, contractor needs to sign |
| Complexity | 4/10 | 12-14 questions, mostly straightforward |
| Revenue | 7/10 | Mid-tier, but critical for fundraising readiness |
| Dependencies | 8/10 | Referenced in Employment, Contractor, Advisor agreements |

**Questionnaire Specification:**
- **Questions:** 14
- **Groups:** 3 (Assignor Info, Company Info, IP Scope)
- **Conditional Logic:** 3 rules (employee vs. contractor, prior inventions)
- **Validation:** Email, date ranges, checkbox confirmations

**Key Questions:**
1. Assignor Type (dropdown: Founder, Employee, Contractor, Advisor)
2. Assignor Full Name
3. Assignor Email
4. **If Employee/Contractor:** Employment/Contract Start Date
5. Company Name
6. IP Scope (checkboxes: Software, Hardware, Business Methods, Trade Secrets, Trademarks)
7. Prior Inventions? (Yes/No)
8. **If Yes:** List Prior Inventions (textarea with 500 char limit)
9. Assignment Effective Date
10. Governing Law (auto-filled from company jurisdiction)

**Conditional Logic Example:**
```json
{
  "if": [
    {"==": [{"var": "assignor_type"}, "Contractor"]},
    {"show": "work_made_for_hire_clause"},
    {"show": "employee_invention_clause"}
  ]
}
```

**Implementation Notes:**
- Clear explanation: "This ensures the company owns all IP created"
- Warning if prior inventions listed: "Have a lawyer review to ensure no conflicts"
- Auto-populate company info if user is logged in

---

#### **Rank 6: Template #8 — Advisor Agreement**
**Priority Score:** 7.5/10
**Estimated Effort:** 4.5 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 6/10 | Nice to have, but not blocking MVP launch |
| Demand | 7/10 | 60% of startups have advisors within first 12 months |
| Complexity | 5/10 | 16 questions, equity calculations (FAST framework) |
| Revenue | 8/10 | Often paired with Stock Options, lawyer referral opportunity |
| Dependencies | 5/10 | Related to Stock Options, Vesting schedules |

**Questionnaire Specification:**
- **Questions:** 16
- **Groups:** 4 (Advisor Info, Advisory Terms, Compensation, Vesting)
- **Conditional Logic:** 4 rules (equity vs. cash, vesting schedule, IP assignment)
- **Validation:** Equity percentage limits, time commitments

**Key Questions:**
1. Advisor Full Name
2. Advisor Email & LinkedIn
3. Advisory Role/Focus Area (dropdown: Technical, Business Dev, Fundraising, Product, Go-to-Market, Domain Expert)
4. Engagement Type (dropdown: Ongoing, Project-Based, One-time)
5. Expected Monthly Time Commitment (hours: 2-10)
6. Compensation Type (dropdown: Equity Only, Cash + Equity, Cash Only)
7. **If Equity:** Equity Percentage (%, typically 0.1-1.0%)
8. **If Equity:** Vesting Schedule (dropdown: 2yr/monthly, 2yr/quarterly, 4yr/1yr cliff)
9. Advisory Period (months: 12, 24, 36)
10. IP Assignment Included? (Yes/No - default Yes)
11. Confidentiality Required? (Yes/No - default Yes)

**FAST Framework Guidance:**
- Show calculator: Time commitment × Stage × Added value = Suggested equity %
- Typical ranges: Pre-seed (0.25-0.5%), Seed (0.1-0.25%), Series A+ (0.05-0.1%)
- Warning if equity > 1%: "This is unusually high. Typical advisor equity is 0.1-0.5%."

**Implementation Notes:**
- Integrate FAST framework equity calculator (Founder Institute standard)
- Link to resources: "How much equity should advisors get?"
- Lawyer referral CTA if equity > 0.5%

---

### 🔧 Tier 3: Medium Priority (Week 6, Days 1-3)

#### **Rank 7: Template #9 — Data Processing Agreement (DPA)**
**Priority Score:** 7.2/10
**Estimated Effort:** 5 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 7/10 | Required for GDPR compliance if handling EU data |
| Demand | 6/10 | Needed when signing first B2B customer (Month 3-6) |
| Complexity | 6/10 | 20 questions, GDPR-specific terminology, SCCs |
| Revenue | 7/10 | Often bundled with SaaS Agreement (€49-99 plan) |
| Dependencies | 6/10 | Pairs with SaaS Agreement, Privacy Policy |

**Questionnaire Specification:**
- **Questions:** 20
- **Groups:** 5 (Parties, Data Details, Processing Activities, Security, Sub-processors)
- **Conditional Logic:** 6 rules (international transfers, SCCs, retention periods)
- **Validation:** GDPR-compliant categories, legal basis validation

**Key Questions:**
1. Controller Name (the customer)
2. Processor Name (your startup - auto-filled)
3. Data Subject Categories (checkboxes: Customers, Employees, Website Visitors, Children)
4. Personal Data Categories (checkboxes: Contact Info, Financial, Location, Behavioral, Special Categories Art. 9)
5. **If Special Categories:** Legal Basis (dropdown: Explicit consent, Legal obligation, Vital interests)
6. Processing Purpose (free text, 200 char max)
7. Processing Duration (dropdown: Duration of contract, Until consent withdrawn, Custom period)
8. Data Location/Storage (checkboxes: EU, UK, US, Other)
9. **If US:** Transfer Mechanism (dropdown: Standard Contractual Clauses 2021, Adequacy Decision, Other)
10. Retention Period After Contract (dropdown: Immediate deletion, 30 days, 90 days, 1 year, Legal requirement)
11. Sub-processors Used? (Yes/No)
12. **If Yes:** List Sub-processors (textarea: Name, Service, Location)
13. Security Measures (checkboxes: Encryption at rest, Encryption in transit, Access controls, Audit logs, Penetration testing)

**Conditional Logic for International Transfers:**
```json
{
  "if": [
    {
      "in": ["US", {"var": "data_locations"}],
      "and": [{"in": ["EU", {"var": "data_locations"}]}]
    },
    {"require": "transfer_mechanism"},
    {"show": "scc_module_4_clause"}
  ]
}
```

**Implementation Notes:**
- Auto-detect if EU data is involved (based on customer jurisdiction)
- Pre-populate common sub-processors (AWS, Google Cloud, Stripe, SendGrid)
- Link to ICO/CNIL guidance on DPAs
- Strong lawyer referral if Special Categories or international transfers

---

#### **Rank 8: Template #10 — SaaS Agreement (B2B)**
**Priority Score:** 6.9/10
**Estimated Effort:** 6 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 6/10 | Needed for first paying customer, but can use interim ToS |
| Demand | 7/10 | Every B2B SaaS startup needs this (Month 3-9) |
| Complexity | 7/10 | 24 questions, pricing tiers, SLAs, liability caps |
| Revenue | 8/10 | High-value template, lawyer referral for enterprise deals |
| Dependencies | 5/10 | Pairs with DPA, MSA (for enterprise) |

**Questionnaire Specification:**
- **Questions:** 24
- **Groups:** 6 (Parties, Service Description, Pricing, SLA, Liability, Data & IP)
- **Conditional Logic:** 8 rules (pricing model, SLA tiers, liability caps, auto-renewal)
- **Validation:** Financial amounts, percentage validations, commitment periods

**Key Questions:**
1. Customer Type (dropdown: SMB, Mid-Market, Enterprise)
2. Service Name/Description
3. Pricing Model (dropdown: Per User, Per Feature, Tiered, Usage-Based, Flat Fee)
4. **If Per User:** Price Per User/Month ($)
5. **If Tiered:** Tier Name, Features, Price (repeatable group)
6. Billing Frequency (dropdown: Monthly, Quarterly, Annual)
7. Contract Term (months: 1, 3, 6, 12, 24, 36)
8. Auto-Renewal? (Yes/No)
9. **If Auto-renewal:** Notice Period (days: 30, 60, 90)
10. Free Trial? (Yes/No)
11. **If Trial:** Trial Duration (days: 7, 14, 30)
12. SLA Uptime Commitment (dropdown: None, 99%, 99.5%, 99.9%, 99.95%)
13. **If SLA:** Credit for Downtime (% of monthly fee per hour down)
14. Liability Cap (dropdown: 1x monthly fees, 3x monthly fees, 12x monthly fees, Unlimited)
15. Customer Data Ownership (always "Customer" - locked field)
16. Data Retention After Termination (dropdown: Immediate deletion, 30 days, 90 days)
17. IP Ownership (always "Startup retains all IP" - locked field)
18. Governing Law & Jurisdiction

**Conditional Logic for Enterprise Features:**
```json
{
  "if": [
    {"==": [{"var": "customer_type"}, "Enterprise"]},
    {
      "show": ["sla_required", "liability_cap_negotiable", "custom_terms_addendum"]
    },
    {
      "default": ["sla_99", "liability_cap_12mo", "no_custom_terms"]
    }
  ]
}
```

**Implementation Notes:**
- Pre-populate common SaaS pricing models (Stripe, Salesforce, HubSpot examples)
- Warn if liability cap < 12x monthly fees: "This may be too low for enterprise customers"
- Suggest lawyer review if contract term > 12 months or customer type = Enterprise
- Link to SaaS agreement best practices (Y Combinator, Cooley)

---

### 📊 Tier 4: Lower Priority (Week 6, Days 4-5)

#### **Rank 9: Template #6 — Convertible Note**
**Priority Score:** 6.5/10
**Estimated Effort:** 5 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 5/10 | Alternative to SAFE, less common for pre-seed (30% of seed rounds) |
| Demand | 6/10 | Regional preference (more common in Europe, Asia) |
| Complexity | 7/10 | 20 questions, financial calculations, interest accrual |
| Revenue | 8/10 | High-value, always requires lawyer review (strong referral) |
| Dependencies | 6/10 | Alternative to SAFE, feeds into Cap Table |

**Questionnaire Specification:**
- **Questions:** 20
- **Groups:** 5 (Parties, Investment Terms, Conversion Terms, Interest & Maturity, Special Rights)
- **Conditional Logic:** 7 rules (interest calculations, conversion triggers, maturity date scenarios)
- **Validation:** Financial amounts, interest rates, date validations

**Key Questions:**
1. Company Name & Jurisdiction
2. Investor Name
3. Principal Amount ($)
4. Interest Rate (% per annum, typically 2-8%)
5. Interest Accrual Method (dropdown: Simple, Compounding Annually, Compounding Quarterly)
6. Maturity Date (date picker, typically 18-36 months from issuance)
7. Conversion Trigger (checkboxes: Qualified Financing, Change of Control, Maturity Date, Voluntary)
8. Qualified Financing Threshold ($ raised in single round, typically $1M+)
9. Valuation Cap ($)
10. Discount Rate (%, typically 15-25%)
11. Conversion Discount Priority (dropdown: Cap or Discount, whichever is better for investor - standard; Cap only; Discount only)
12. Repayment at Maturity? (Yes/No - default Yes)
13. **If Repayment:** Repayment Terms (dropdown: Principal + Interest in cash, At investor's option, Automatic conversion at cap)
14. Pro Rata Rights? (Yes/No)
15. Information Rights? (Yes/No)
16. Most Favored Nation? (Yes/No)

**Financial Calculation Examples:**
```javascript
// Simple Interest Calculation
totalOwed = principal × (1 + (rate × years))

// Conversion with Cap and Discount
conversionPrice = min(
  valuationCap / fullyDilutedShares,
  qualifiedFinancingPPS × (1 - discountRate)
)

// Shares Received
sharesReceived = (principal + accruedInterest) / conversionPrice
```

**Implementation Notes:**
- Add financial calculator showing conversion scenarios
- Warning: "Convertible notes are debt. SAFE may be simpler and more founder-friendly."
- Link to comparison chart: SAFE vs. Convertible Note
- Mandatory lawyer review CTA (this is complex financial instrument)

---

#### **Rank 10: Template #7 — Term Sheet (Seed/Series A)**
**Priority Score:** 6.2/10
**Estimated Effort:** 7 hours

| Metric | Score | Justification |
|--------|-------|---------------|
| Criticality | 5/10 | Needed for Series A, but most founders use investor's template |
| Demand | 5/10 | Only 10-20% of startups reach Series A in first 2 years |
| Complexity | 9/10 | 35+ questions, complex terms (liquidation preference, anti-dilution, board composition) |
| Revenue | 9/10 | Highest lawyer referral potential (always needs legal review) |
| Dependencies | 4/10 | Final step in fundraising, builds on SAFE/Convertible Note |

**Questionnaire Specification:**
- **Questions:** 38
- **Groups:** 8 (Parties, Deal Structure, Valuation, Equity Terms, Governance, Investor Rights, Founder Terms, Conditions)
- **Conditional Logic:** 12+ rules (participation rights, anti-dilution formulas, board composition)
- **Validation:** Complex financial validations, percentage calculations, ownership percentages

**Key Question Categories:**

**1. Deal Structure (5 questions)**
- Investment Amount ($)
- Security Type (dropdown: Preferred Stock - Series A, Convertible Preferred, Common Stock)
- Pre-Money Valuation ($)
- Post-Money Valuation (calculated: pre-money + investment)
- Investor Ownership % (calculated: investment / post-money)

**2. Liquidation Preference (4 questions)**
- Liquidation Preference Multiple (dropdown: 1x, 1.5x, 2x - warn if >1x)
- Participation (dropdown: Non-participating, Participating, Participating with cap)
- **If Participating:** Participation Cap (dropdown: 2x, 3x, Uncapped)

**3. Anti-Dilution (3 questions)**
- Anti-Dilution Protection (dropdown: None, Broad-Based Weighted Average, Narrow-Based, Full Ratchet - warn if Full Ratchet)
- Carve-Out for Employee Pool? (Yes/No - default Yes)

**4. Board Composition (4 questions)**
- Total Board Seats (number: 3, 5, 7)
- Investor Board Seats (number, must be < total/2)
- Founder Board Seats (number)
- Independent Board Seats (calculated: total - investor - founder)

**5. Investor Rights (8 questions)**
- Pro Rata Rights? (Yes/No)
- Information Rights? (Yes/No - default Yes)
- Right of First Refusal (ROFR)? (Yes/No)
- Co-Sale Rights (Tag-Along)? (Yes/No)
- Drag-Along Rights? (Yes/No)
- Redemption Rights? (Yes/No - warn if Yes: "Rare and founder-unfriendly")
- Protective Provisions (checkboxes: Sale of company, New equity issuance, Board/bylaws changes, Liquidation/dissolution, Debt > $X, Change of control)

**6. Founder Vesting (4 questions)**
- Founder Shares Subject to Vesting? (Yes/No)
- **If Yes:** Vesting Schedule (dropdown: 4yr/1yr cliff, 4yr/no cliff, Custom)
- **If Yes:** Acceleration on Acquisition? (dropdown: None, Single-Trigger, Double-Trigger - recommend Double)

**7. Employee Stock Option Pool (3 questions)**
- Employee Pool Size (% of post-money, typically 10-20%)
- Pool Created Pre-Money or Post-Money? (dropdown: Pre-money - investor preference; Post-money - founder preference)
- (Show dilution impact visualization)

**8. Conditions Precedent (7 questions)**
- Legal Due Diligence Required? (Yes/No - default Yes)
- Financial Due Diligence? (Yes/No)
- Investor Approval Required? (Yes/No - if VC fund, default Yes)
- Key Hires Required? (Yes/No)
- **If Key Hires:** Specify Roles (CTO, VP Sales, etc.)
- Exclusivity Period (days: 30, 45, 60, 90)
- Binding vs. Non-Binding (default: Non-binding except Exclusivity, Confidentiality, Expenses)

**Validation Warnings:**
```javascript
// Warn if terms are investor-unfriendly
if (liquidationMultiple > 1) {
  warn("1.5x or 2x liquidation preference is investor-unfriendly. Standard is 1x.");
}

if (antiDilution === "Full Ratchet") {
  warn("Full ratchet is extremely founder-unfriendly. Almost never used in practice.");
}

if (founderVesting === "No" && stage === "Series A") {
  warn("Investors typically require founder vesting at Series A.");
}

if (employeePoolPrePost === "Pre-money") {
  warn("Pre-money pool dilutes founders only. Post-money pool dilutes everyone proportionally.");
}

// Calculate and display ownership waterfall
postMoneyOwnership = {
  founders: (founderShares / totalPostMoneyShares) * 100,
  investors: (investorShares / totalPostMoneyShares) * 100,
  employeePool: (poolShares / totalPostMoneyShares) * 100
};
```

**Implementation Notes:**
- This is the most complex questionnaire (38 questions, 12+ conditional logic rules)
- Build interactive ownership calculator showing pre-money vs. post-money dilution
- Strong warnings for founder-unfriendly terms (participation, full ratchet, redemption rights)
- **Mandatory lawyer review:** Display prominent banner: "Term sheets are complex. Always have a lawyer review before signing."
- Link to NVCA model documents, Y Combinator term sheet guidance
- Consider building a "Term Sheet Analyzer" that flags unfavorable terms

---

## Implementation Roadmap

### Week 5 (Templates 1-6)

**Monday-Tuesday (Days 1-2):**
- ✅ Template #1: Founders' Agreement — Already complete (0 hours)
- ✅ Template #5: NDA (Mutual) — 3 hours
- ✅ Template #3: Employment Contract — 6 hours
- **Total:** 9 hours (1 developer)

**Wednesday-Thursday (Days 3-4):**
- ✅ Template #2: SAFE — 5 hours
- ✅ Template #4: IP Assignment — 4 hours
- **Total:** 9 hours (1 developer)

**Friday (Day 5):**
- ✅ Template #6: Advisor Agreement — 4.5 hours
- **Buffer:** 3.5 hours for testing, bug fixes

---

### Week 6 (Templates 7-10)

**Monday-Tuesday (Days 1-2):**
- ✅ Template #9: Data Processing Agreement (DPA) — 5 hours
- ✅ Template #10: SaaS Agreement — 6 hours
- **Total:** 11 hours (1 developer)

**Wednesday-Thursday (Days 3-4):**
- ✅ Template #6: Convertible Note — 5 hours
- ✅ Template #7: Term Sheet — 7 hours (most complex)
- **Total:** 12 hours (1 developer)

**Friday (Day 5):**
- **Integration Testing:** All 10 questionnaires end-to-end (4 hours)
- **Lawyer Review:** QA session with legal reviewer (4 hours)
- **Bug Fixes & Polish:** Final adjustments (2 hours)

---

## Resource Allocation

### Team Requirements

**Developer (Frontend + Forms):**
- **Skills:** React Hook Form, Zod validation, TypeScript, JSONLogic
- **Effort:** 40 hours (Week 5-6, full-time)
- **Tasks:**
  - Build questionnaire forms (UI components)
  - Implement conditional logic (JSONLogic rules)
  - Add validation rules (Zod schemas)
  - Connect to document generation API

**Legal Reviewer (Startup Lawyer):**
- **Skills:** Startup legal, multi-jurisdiction, contract drafting
- **Effort:** 12 hours (Week 5-6, part-time review)
- **Tasks:**
  - Review questions for legal accuracy
  - Validate default values and guidance text
  - QA generated documents for completeness
  - Flag any UPL risks in questionnaire wording

**Optional: UX Designer:**
- **Skills:** Form UX, complex workflows, progressive disclosure
- **Effort:** 8 hours (Week 5, part-time)
- **Tasks:**
  - Design multi-step form UI
  - Create progress indicators
  - Design conditional logic visual feedback
  - Build financial calculators (SAFE, Term Sheet)

---

## Technical Implementation Guide

### 1. Questionnaire Data Structure

Each questionnaire should follow this schema (stored in `/demo/src/lib/questionnaires/`):

```typescript
// questionnaires/foundersAgreement.ts (example)
export interface QuestionnaireQuestion {
  id: string;
  type: 'text' | 'email' | 'number' | 'select' | 'multiselect' | 'date' | 'textarea' | 'checkbox' | 'radio';
  label: string;
  helpText?: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customRule?: string; // Zod rule name
  };
  options?: { value: string; label: string }[]; // For select/radio
  defaultValue?: any;
  conditionalDisplay?: JSONLogicRule; // Show this question only if rule evaluates to true
  groupId: string; // Which group this question belongs to
}

export interface QuestionnaireGroup {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  order: number;
}

export interface Questionnaire {
  templateId: string;
  templateCode: string;
  version: string;
  groups: QuestionnaireGroup[];
  questions: QuestionnaireQuestion[];
  conditionalLogic: JSONLogicRule[]; // Global rules that affect multiple questions
}
```

### 2. File Organization

```
/demo/src/lib/questionnaires/
├── index.ts                      # Export all questionnaires
├── foundersAgreement.ts          # ✅ Already exists
├── nda.ts                        # Rank 2 (3 hours)
├── employmentContract.ts         # Rank 3 (6 hours)
├── safe.ts                       # Rank 4 (5 hours)
├── ipAssignment.ts               # Rank 5 (4 hours)
├── advisorAgreement.ts           # Rank 6 (4.5 hours)
├── dpa.ts                        # Rank 7 (5 hours)
├── saasAgreement.ts              # Rank 8 (6 hours)
├── convertibleNote.ts            # Rank 9 (5 hours)
├── termSheet.ts                  # Rank 10 (7 hours)
└── shared/                       # Reusable question sets
    ├── partyInfo.ts              # Company name, address, signatory (reused in 8+ templates)
    ├── jurisdictionSelector.ts   # Jurisdiction picker with flag icons
    ├── vestingSchedule.ts        # Standard vesting patterns (4yr/1yr cliff, etc.)
    └── financialInputs.ts        # Currency formatters, amount validators
```

### 3. Conditional Logic Engine

Use **JSONLogic** for all conditional display rules:

```typescript
// Example: Show "valuation_cap" question only if SAFE type includes "Cap"
{
  "conditionalDisplay": {
    "or": [
      {"==": [{"var": "safe_type"}, "Valuation Cap"]},
      {"==": [{"var": "safe_type"}, "Cap + Discount"]}
    ]
  }
}

// Example: Show UK-specific questions only if jurisdiction is UK
{
  "conditionalDisplay": {
    "==": [{"var": "jurisdiction"}, "UK"]
  }
}

// Example: Require lawyer review if equity > 0.5%
{
  "if": [
    {">": [{"var": "equity_percentage"}, 0.5]},
    {"show_lawyer_warning": true}
  ]
}
```

### 4. Validation with Zod

```typescript
import { z } from 'zod';

// Reusable validators
const emailSchema = z.string().email("Invalid email format");
const ukPostcodeSchema = z.string().regex(/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, "Invalid UK postcode");
const equityPercentageSchema = z.number().min(0).max(100).refine(
  (val) => val <= 10,
  { message: "Equity percentage > 10% is unusual. Please review." }
);

// Template-specific schema
export const safeQuestionnaireSchema = z.object({
  company_name: z.string().min(2, "Company name required"),
  investor_name: z.string().min(2, "Investor name required"),
  purchase_amount: z.number().min(1000, "Minimum $1,000 investment (YC standard)"),
  safe_type: z.enum(["Valuation Cap", "Discount", "Cap + Discount", "MFN"]),
  valuation_cap: z.number().optional().refine(
    (val, ctx) => {
      const purchaseAmount = ctx.parent.purchase_amount;
      return !val || val >= purchaseAmount * 10;
    },
    { message: "Valuation cap should be at least 10x purchase amount" }
  ),
  discount_rate: z.number().min(10).max(30).optional(),
  // ... more fields
}).refine(
  (data) => {
    // Cross-field validation: If Cap + Discount, both must be provided
    if (data.safe_type === "Cap + Discount") {
      return data.valuation_cap && data.discount_rate;
    }
    return true;
  },
  { message: "Cap + Discount requires both valuation cap and discount rate" }
);
```

### 5. Progress Tracking & UX

```typescript
// Multi-step form with progress indicator
const QuestionnaireForm = ({ questionnaire }: { questionnaire: Questionnaire }) => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const totalGroups = questionnaire.groups.length;
  const progress = ((currentGroupIndex + 1) / totalGroups) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Step {currentGroupIndex + 1} of {totalGroups}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current group questions */}
      <FormGroup group={questionnaire.groups[currentGroupIndex]} />

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setCurrentGroupIndex(prev => prev - 1)}
          disabled={currentGroupIndex === 0}
        >
          Previous
        </button>
        {currentGroupIndex < totalGroups - 1 ? (
          <button onClick={() => setCurrentGroupIndex(prev => prev + 1)}>
            Next
          </button>
        ) : (
          <button type="submit">Generate Document</button>
        )}
      </div>
    </div>
  );
};
```

---

## Quality Assurance Checklist

Before marking each questionnaire as "complete," verify:

### Functional Requirements
- [ ] All questions render correctly
- [ ] Conditional logic works (questions show/hide based on prior answers)
- [ ] Validation rules fire appropriately (required fields, format checks)
- [ ] Form submission sends data to document generation API
- [ ] Error handling for failed validations
- [ ] Multi-step navigation works (Next/Previous buttons)
- [ ] Progress indicator updates correctly

### Legal Accuracy
- [ ] Questions capture all required template variables
- [ ] Guidance text is accurate and UPL-safe ("This is not legal advice")
- [ ] Default values are reasonable (e.g., standard vesting = 4yr/1yr cliff)
- [ ] Warnings displayed for unusual inputs (e.g., equity > 1% for advisors)
- [ ] Lawyer referral CTAs shown for high-risk templates

### User Experience
- [ ] Clear, jargon-free question labels
- [ ] Help text explains legal terms (hover tooltips or info icons)
- [ ] Logical question order (don't ask for vesting schedule before asking if there is vesting)
- [ ] Mobile-responsive (test on iPhone, Android)
- [ ] Accessibility: keyboard navigation, screen reader support
- [ ] Auto-save draft answers (localStorage or backend)

### Performance
- [ ] Form renders in < 200ms
- [ ] No jank when showing/hiding conditional questions
- [ ] Large forms (30+ questions) remain performant

---

## Post-Implementation: Analytics & Optimization

After Week 6, track these metrics to prioritize future improvements:

| Metric | Target | Action if Below Target |
|--------|--------|------------------------|
| **Questionnaire Completion Rate** | >80% | Identify drop-off points, simplify questions |
| **Time to Complete** | < 10 min (avg) | Reduce questions, improve UX |
| **Validation Error Rate** | <5% | Improve help text, add examples |
| **Lawyer Referral Click Rate** | >15% (for complex templates) | Improve CTA placement, messaging |
| **Document Generation Success Rate** | >99% | Fix template rendering bugs |

---

## Conclusion

By following this priority matrix, you will have:

✅ **All 10 templates functional** by end of Week 6
✅ **Data-driven prioritization** (deploy high-value templates first)
✅ **Reusable components** (party info, vesting schedules, financial inputs)
✅ **Clear quality standards** (QA checklist for each template)
✅ **Realistic timelines** (40-50 hours total, 1 developer + 1 legal reviewer)

**Next Steps:**
1. Review this prioritization plan
2. Adjust if needed (e.g., swap Convertible Note and DPA if targeting European market)
3. Proceed to **Part 3: Jurisdiction Overlay System Design**

---

**Document Owner:** Technical Lead / CTO
**Reviewers:** Legal Content Manager, Product Manager
**Implementation Window:** Week 5-6 of 90-Day Launch Plan
**Success Criteria:** 10/10 questionnaires functional, >80% completion rate, <5% error rate
