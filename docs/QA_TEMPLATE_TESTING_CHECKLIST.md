# LegalMind Template Testing Checklist

## Pre-Deployment QA (20-Point Checklist)

### 1. Template Structure Validation ✅

- [ ] **1.1** All base templates have valid JSON syntax
- [ ] **1.2** All templates include required fields:
  - `template_code`, `name`, `pack`, `version`, `jurisdiction`, `access_level`
- [ ] **1.3** Template codes follow naming convention: `{NAME}_{VERSION}` (e.g., `NDA_MUTUAL_V1`)
- [ ] **1.4** All clauses have unique `id` and sequential `order`
- [ ] **1.5** Variables referenced in clauses exist in `variables_schema`

### 2. Questionnaire Validation ✅

- [ ] **2.1** All questionnaires are valid JSON Schema draft-2020-12
- [ ] **2.2** Required fields marked in `required` array
- [ ] **2.3** UI schema provides user-friendly labels and help text
- [ ] **2.4** Validation rules (min/max, patterns) are sensible
- [ ] **2.5** Conditional fields (dependencies) work correctly

### 3. Jurisdiction Overlay Testing ✅

- [ ] **3.1** All 5 jurisdiction overlays created for priority templates:
  - UK, US-DE, DE, FR, CZ
- [ ] **3.2** Overlays properly override base template phrases/clauses
- [ ] **3.3** Compliance notes include relevant statutes/case law
- [ ] **3.4** Statutory references are accurate and current
- [ ] **3.5** Bilingual templates (DE, FR, CZ) include native language headings

### 4. JSONLogic Rules Testing ✅

- [ ] **4.1** Computed variables evaluate correctly
- [ ] **4.2** Clause conditions toggle visibility as expected
- [ ] **4.3** Validations trigger appropriate errors/warnings
- [ ] **4.4** Jurisdiction-specific warnings display for relevant overlays
- [ ] **4.5** Cross-field dependencies work (e.g., non_solicit enables non_solicit_period_months)

### 5. Rendering & Output Testing ✅

- [ ] **5.1** Base template renders correctly to HTML
- [ ] **5.2** Jurisdiction overlay merges correctly (no double clauses)
- [ ] **5.3** Variable substitution works ({{variable}} → value)
- [ ] **5.4** Conditional clauses appear/hide based on variables
- [ ] **5.5** PDF generation produces clean, readable output

### 6. Access Control & Gating ✅

- [ ] **6.1** Anonymous users cannot access /questionnaire
- [ ] **6.2** Starter plan users blocked from Pro templates → 403 error with upgrade message
- [ ] **6.3** Pro plan users can access all Starter + Pro templates
- [ ] **6.4** GET /packs correctly flags `access_granted` based on user plan
- [ ] **6.5** Preview rate limiting enforced (Starter: 10/day, Pro: 50/day)

### 7. API Endpoint Testing ✅

- [ ] **7.1** `GET /api/packs` returns all packs with correct `access_granted` flags
- [ ] **7.2** `GET /api/templates?pack=saas` filters correctly
- [ ] **7.3** `GET /api/questionnaire/{code}` returns valid JSON Schema
- [ ] **7.4** `POST /api/preview` validates input and returns HTML
- [ ] **7.5** `POST /api/generate` creates documents and returns signed URLs (valid for 30 min)

### 8. Edge Cases & Error Handling ✅

- [ ] **8.1** Invalid template code → 404 error
- [ ] **8.2** Missing required variables → 400 with field-specific errors
- [ ] **8.3** Unsupported jurisdiction → 400 error
- [ ] **8.4** Expired subscription → 403 error with clear message
- [ ] **8.5** S3/storage failure → graceful 500 with retry mechanism

---

## Priority Template Smoke Tests

### NDA_MUTUAL_V1
- [ ] Generate with `include_residuals_clause: true` → Residuals clause appears
- [ ] Generate with `include_non_solicit: false` → Section 5 skipped, numbering adjusted
- [ ] UK overlay: "made" instead of "entered into", Companies Act reference
- [ ] DE overlay: Bilingual headers present, Art. 12 GG warning
- [ ] FR overlay: French translations, Code civil references
- [ ] CZ overlay: Czech translations, Listina references

### SAAS_SUB_V1
- [ ] Service tier affects SLA uptime commitments
- [ ] Auto-renewal toggle adds/removes clause
- [ ] UK overlay: Consumer Rights Act 2015 mention if B2C
- [ ] DE overlay: AGB rules (§ 305 BGB) compliance note
- [ ] Payment terms validation (NET-30, NET-60)

### MSA_V1
- [ ] IP ownership toggle affects ownership clause
- [ ] Liability cap calculation correct (e.g., 2× fees)
- [ ] SOW reference language present
- [ ] Hourly vs Fixed Fee vs Retainer calculations
- [ ] Change order process clause appears

### DPA_V1 (Enhance Existing)
- [ ] GDPR Art. 28 compliance verified
- [ ] Standard Contractual Clauses references
- [ ] Processor vs Sub-processor toggles
- [ ] FR overlay: RGPD compliance, CNIL guidance
- [ ] CZ overlay: Zákon č. 110/2019 Sb. references

### PRIVACY_GDPR_V1
- [ ] All GDPR Art. 13-14 required information present
- [ ] Data subject rights (Art. 15-22) clearly described
- [ ] Cookie categories (Essential/Analytics/Marketing) conditional
- [ ] Cross-border transfer mechanism selection works
- [ ] Children's data toggle (under 16) adds appropriate notices

### SLA_V1
- [ ] Uptime % correlates with service tier
- [ ] Service credit calculation accurate
- [ ] Support response times by priority level correct
- [ ] Exclusions clause comprehensive
- [ ] Maximum service credits cap enforced

### FOUNDERS_AGREEMENT_V1 (Enhance Existing)
- [ ] Vesting schedule calculations (4yr/1yr cliff)
- [ ] UK overlay: EMI scheme references
- [ ] US-DE overlay: 83(b) election guidance, QSBS
- [ ] Equity split percentages sum to 100%
- [ ] Drag-along/tag-along thresholds

### SHAREHOLDERS_AGREEMENT_V1 (Enhance Existing)
- [ ] Pre-emption rights trigger correctly
- [ ] Drag-along threshold enforced
- [ ] UK overlay: Companies Act 2006 s.561 references
- [ ] DE overlay: GmbHG compliance, Vinkulierung
- [ ] Transfer restrictions clauses

### SAFE_PM_V1 (Already Complete ✅)
- [ ] Post-money valuation cap calculation
- [ ] MFN clause conditional on `mfn_provision`
- [ ] Pro-rata rights conditional on `pro_rata_right`
- [ ] All 5 overlays present and accurate
- [ ] Conversion mechanics clear

### CONVERTIBLE_NOTE_V1
- [ ] Interest accrual calculation (simple vs compound)
- [ ] Conversion price calculation with discount
- [ ] Valuation cap vs discount (whichever favorable)
- [ ] Maturity date validation (future date required)
- [ ] Security interest clause conditional
- [ ] Subordination clause conditional

---

## CMS Import Verification

- [ ] Dry run completes without errors: `node cms/import_templates.mjs --dry-run`
- [ ] Live import creates all templates in CMS
- [ ] Templates searchable by code
- [ ] Overlays linked to parent templates
- [ ] Re-running import is idempotent (no duplicates)
- [ ] Import stats report accurate (created vs updated)

---

## Performance Testing

- [ ] Preview generation < 2 seconds for simple templates (< 20 variables)
- [ ] Preview generation < 5 seconds for complex templates (50+ variables)
- [ ] PDF generation < 5 seconds for any template
- [ ] DOCX generation < 7 seconds for any template
- [ ] Concurrent preview requests (10 users) handled gracefully
- [ ] S3 signed URL generation < 500ms
- [ ] CMS query response time < 1 second

---

## Security Checks

- [ ] No raw template text exposed in API responses (only rendered output)
- [ ] Signed URLs expire after exactly 30 minutes
- [ ] JWT validation on all gated endpoints (`/questionnaire`, `/preview`, `/generate`)
- [ ] User can only download their own generated documents
- [ ] SQL injection prevention in template code queries
- [ ] XSS protection in variable substitution (escaped in HTML)
- [ ] CSRF tokens on POST endpoints
- [ ] Rate limiting prevents abuse (100 req/min per user)

---

## Functional Scenarios

### Scenario 1: Starter User Journey
1. [ ] User signs up for Starter plan (selects SaaS pack)
2. [ ] User browses `/catalog` and sees SaaS templates with "Start" button
3. [ ] User clicks "Start" on NDA_MUTUAL_V1 (fundraising pack) → **403 error** "Upgrade to Pro required"
4. [ ] User clicks "Start" on SAAS_SUB_V1 → Questionnaire loads
5. [ ] User fills form, clicks "Preview" → HTML preview displays
6. [ ] User clicks "Generate PDF" → Download link appears, PDF downloads successfully
7. [ ] User tries to preview 11th document today → **429 rate limit** "Daily preview limit reached"

### Scenario 2: Pro User Journey
1. [ ] User with Pro plan browses `/catalog`
2. [ ] All templates in both SaaS and Fundraising packs show "Start" button
3. [ ] User generates SHAREHOLDERS_AGREEMENT_V1 with UK jurisdiction
4. [ ] Output includes UK-specific clauses (Companies Act 2006 references)
5. [ ] User can preview 50 documents in one day without hitting limit

### Scenario 3: Multi-Jurisdiction Testing
1. [ ] User selects PRIVACY_GDPR_V1 template
2. [ ] Questionnaire asks "Select jurisdiction"
3. [ ] User selects "Germany" (DE)
4. [ ] Generated document has bilingual headings (German + English)
5. [ ] Compliance notes reference DSGVO and BDSG
6. [ ] User switches jurisdiction to "France" (FR) and regenerates
7. [ ] Output now references RGPD and Code civil

### Scenario 4: Conditional Clause Testing
1. [ ] User starts NDA_MUTUAL_V1 questionnaire
2. [ ] User toggles "Include Non-Solicitation Clause" to **ON**
3. [ ] Additional field appears: "Non-Solicitation Period (Months)"
4. [ ] User enters 18 months
5. [ ] Preview shows Section 4 "Non-Solicitation" with 18-month term
6. [ ] Section numbering adjusts correctly (5 → 6, etc.)
7. [ ] User toggles non-solicitation to **OFF**, regenerates
8. [ ] Section 4 disappears, numbering reflows

### Scenario 5: Error Handling
1. [ ] User submits questionnaire with missing required field → **400 error** with field name
2. [ ] User enters `term_years: 20` → **Warning** "Terms > 5 years may be unreasonable"
3. [ ] User selects unsupported jurisdiction → **400 error**
4. [ ] Backend PDF generation fails → **500 error** with friendly message + retry option
5. [ ] User's subscription expires during document generation → **403 error** "Please renew"

---

## Accessibility & UX Checks

- [ ] Questionnaires have clear labels and help text for all fields
- [ ] Error messages are specific and actionable
- [ ] Loading states shown during preview/generate operations
- [ ] Keyboard navigation works through questionnaire forms
- [ ] Screen reader compatibility (ARIA labels on inputs)
- [ ] Mobile-responsive questionnaire forms
- [ ] PDF downloads work on mobile browsers

---

## Documentation Verification

- [ ] All template codes documented in catalog
- [ ] Jurisdiction notes accurate for each template
- [ ] API endpoints documented in OpenAPI spec
- [ ] README includes setup instructions for CMS import
- [ ] Environment variables documented (.env.example)
- [ ] Deployment guide includes S3 bucket configuration

---

## Sign-Off

**Tested By:** ___________________
**Date:** ___________________
**Environment:** [ ] Local  [ ] Staging  [ ] Production
**All Critical Tests Passed:** [ ] Yes  [ ] No

**Critical Issues Found:**
_____________________________________________________
_____________________________________________________

**Minor Issues Found:**
_____________________________________________________
_____________________________________________________

**Notes:**
_____________________________________________________
_____________________________________________________

---

## Regression Testing (After Updates)

When adding new templates or updating existing ones:

1. [ ] Run full CMS import script to verify no breakage
2. [ ] Test 3 existing templates from different packs
3. [ ] Verify gating still works (Starter vs Pro)
4. [ ] Check audit log for accurate tracking
5. [ ] Monitor error rates in production logs for 48 hours

---

*End of QA Checklist*
