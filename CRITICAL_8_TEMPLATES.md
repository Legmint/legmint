# LegalMind — Critical 8 Missing Templates
## Deployment Blocker Templates (Add These First)

**Version:** 2.0
**Priority:** CRITICAL for MVP deployment
**Last Updated:** 2025-10-14

---

## Executive Summary

These 8 templates are **deployment blockers** — startups cannot operate legally without them. They must be added before launching to real customers.

**Current Status:** 10 templates live (only 1 with questionnaire)
**Target:** 18 templates (10 existing + 8 critical)
**Timeline:** Add within Weeks 7-8 of 90-day plan

---

## Template 11: Shareholders' Agreement

### Basic Information
**Code:** `shareholders-agreement-v1`
**Category:** Founding
**Jurisdictions:** UK, US-DE, DE, FR
**Languages:** en-UK, en-US, de-DE, fr-FR
**Complexity:** 8/10
**Estimated Time:** 35 minutes
**Premium:** Yes (High-value template)

### Description
Post-incorporation agreement governing shareholder rights, share transfer restrictions, drag-along/tag-along rights, anti-dilution protection, and board composition. Essential for any startup with investors or multiple founders post-incorporation.

### Key Variables (20 total)

#### Group 1: Company & Shareholders
1. **company_name** (string, required) — Legal company name
2. **company_number** (string, required) — Registration number
3. **jurisdiction** (enum, required) — UK/US-DE/DE/FR
4. **shareholder_count** (integer, 2-10, required) — Number of shareholders
5. **shareholder_1_name** (string, required) — Shareholder full name
6. **shareholder_1_shares** (integer, required) — Number of shares held
7. **shareholder_1_class** (enum, required) — Ordinary/Preferred/A/B
8. *(Repeat for each shareholder)*

#### Group 2: Share Transfer Restrictions
9. **rofr_applies** (boolean, required, default: true) — Right of First Refusal on share transfers
10. **rofo_applies** (boolean, required, default: false) — Right of First Offer
11. **transfer_approval_threshold** (integer, 50-100, default: 75) — % approval needed for transfers
12. **permitted_transfers** (multi_enum, required) — Family trusts, estate planning, affiliated entities

#### Group 3: Drag-Along / Tag-Along
13. **drag_along_threshold** (integer, 50-100, default: 75) — % needed to force sale
14. **tag_along_applies** (boolean, required, default: true) — Minority shareholders can join sale
15. **tag_along_threshold** (integer, 1-50, default: 10) — Minimum % shareholding for tag-along

#### Group 4: Board & Governance
16. **board_size** (integer, 1-9, default: 3) — Number of directors
17. **founder_board_seats** (integer, 1-5, default: 2) — Founder-appointed seats
18. **investor_board_seats** (integer, 0-4, default: 1) — Investor-appointed seats
19. **independent_board_seats** (integer, 0-2, default: 0) — Independent directors

#### Group 5: Reserved Matters
20. **reserved_matters** (multi_enum, required) — List of actions requiring special approval:
    - Issuing new shares
    - Changing Articles/Bylaws
    - Selling the company
    - Taking on debt >€100K
    - Hiring C-level executives
    - Declaring dividends

### Conditional Logic (JSONLogic)
```json
{
  "if": [
    {"==": [{"var": "investor_present"}, true]},
    {
      "show": ["anti_dilution_protection", "liquidation_preference", "investor_board_seats"]
    },
    {
      "hide": ["anti_dilution_protection", "liquidation_preference"]
    }
  ]
}
```

### Jurisdiction Overlays

**UK Overlay:**
- Reference: Companies Act 2006
- Share classes: Ordinary shares standard
- Pre-emption rights: Statutory pre-emption unless disapplied
- Drag-along: Common at 75% threshold

**US-DE Overlay:**
- Reference: Delaware General Corporation Law (DGCL)
- Share classes: Common + Preferred standard
- Drag-along: Typically 75-80% of share class
- Board: Classified board common

**DE (Germany) Overlay:**
- Reference: GmbH-Gesetz
- Share classes: Geschäftsanteile (not shares)
- Approval: Notarization required for transfers
- Board: Geschäftsführer (managing directors), optional Beirat (advisory board)

**FR (France) Overlay:**
- Reference: Code de commerce
- Share classes: Actions (SA) or Parts sociales (SAS/SARL)
- Approval: Agrément clause common in SAS
- Board: Conseil d'administration (SA) or Président (SAS)

### Related Documents
- A01: Founders' Agreement (pre-incorporation)
- E03: Term Sheet (investment terms)
- E04: Investor Rights Agreement
- A05: Board Resolution Template

### Use Cases
1. Post-seed funding shareholder alignment
2. Investor onboarding and rights documentation
3. Founder protection (drag-along, tag-along)
4. Exit planning (M&A scenarios)
5. Governance structure formalization

---

## Template 12: Articles of Association / Certificate of Incorporation

### Basic Information
**Code:** `articles-incorporation-v1`
**Category:** Founding
**Jurisdictions:** UK, US-DE, DE, FR (HIGHLY jurisdiction-specific)
**Languages:** en-UK, en-US, de-DE, fr-FR
**Complexity:** 6/10
**Estimated Time:** 25 minutes
**Premium:** No (Essential for all)

### Description
Company constitution defining share capital, director powers, shareholder meetings, and amendment procedures. Required legal document for incorporation in all jurisdictions. **CRITICAL: Each jurisdiction has completely different structure and legal requirements.**

### Key Variables (15 total)

#### Group 1: Company Details
1. **company_name** (string, required) — Exact legal name
2. **jurisdiction** (enum, required) — UK/US-DE/DE/FR
3. **registered_office** (string, required) — Full address
4. **company_type** (enum, required, jurisdiction-dependent):
   - UK: Private Limited Company (Ltd), Public Limited Company (PLC)
   - US-DE: Corporation (Inc), Limited Liability Company (LLC)
   - DE: Gesellschaft mit beschränkter Haftung (GmbH)
   - FR: Société par Actions Simplifiée (SAS), Société à Responsabilité Limitée (SARL)

#### Group 2: Share Capital
5. **authorized_share_capital** (integer, required) — Total authorized shares
6. **share_classes** (multi_enum, required) — Ordinary, Preferred A, Preferred B, etc.
7. **ordinary_shares_par_value** (decimal, jurisdiction-dependent):
   - UK: £0.01, £0.10, £1.00 common
   - US-DE: $0.0001, $0.001 common
   - DE: €1.00 minimum
   - FR: No par value (valeur nominale optional)
8. **initial_share_issuance** (integer, required) — Shares issued at incorporation

#### Group 3: Directors
9. **director_count** (integer, 1-9, default: 1) — Number of initial directors
10. **director_1_name** (string, required) — Full legal name
11. **director_1_address** (string, required) — Residential address
12. **director_appointment_method** (enum, required) — Ordinary resolution, board decision
13. **director_removal_method** (enum, required) — Ordinary resolution, special resolution

#### Group 4: Shareholders
14. **quorum_percentage** (integer, 25-100, default: 50) — Minimum % for valid meeting
15. **special_resolution_threshold** (integer, 66-100, jurisdiction-dependent):
    - UK: 75% (Companies Act 2006)
    - US-DE: 66.67% (DGCL default)
    - DE: 75% (GmbH-Gesetz)
    - FR: 66.67% or 75% (depends on statuts)

### Conditional Logic
```json
{
  "if": [
    {"==": [{"var": "jurisdiction"}, "UK"]},
    {
      "require": ["company_number_reserve", "model_articles_adoption"],
      "show": ["statutory_preemption_disapply"]
    }
  ],
  "if": [
    {"==": [{"var": "jurisdiction"}, "US-DE"]},
    {
      "require": ["registered_agent", "delaware_franchise_tax"],
      "show": ["bylaws_adoption", "indemnification_clause"]
    }
  ]
}
```

### Jurisdiction Overlays (CRITICAL DIFFERENCES)

#### UK: Articles of Association
**Structure:**
1. Company name and registered office
2. Share capital and rights attached to shares
3. Variation of class rights
4. Share certificates
5. Directors' powers and responsibilities
6. Decision-making by directors
7. Appointment and removal of directors
8. Shareholders' meetings and resolutions
9. Dividends and distributions
10. Indemnity provisions

**Key Clauses:**
- **Model Articles:** Can adopt Companies (Model Articles) Regulations 2008 by reference
- **Pre-emption Rights:** Statutory pre-emption unless disapplied (s.561 CA 2006)
- **Objects Clause:** No longer required post-CA 2006
- **Weighted Voting:** Permitted (Bushell v Faith clauses)

**Filing:** Submit with Form IN01 to Companies House (£12 online, £40 postal)

---

#### US-DE: Certificate of Incorporation + Bylaws
**Structure (Certificate of Incorporation):**
1. Company name (must end with Inc., Corporation, Company, or abbreviation)
2. Registered office address in Delaware
3. Registered agent name and address
4. Purpose (usually "any lawful act")
5. Total authorized shares (number and par value)
6. Incorporator name and address
7. Optional: Director/officer exculpation (DGCL §102(b)(7))

**Structure (Bylaws — separate document):**
1. Shareholders' meetings (notice, quorum, voting)
2. Board of directors (number, election, removal, committees)
3. Officers (titles, duties, appointment)
4. Stock certificates and transfers
5. Indemnification
6. Amendment procedures

**Key Clauses:**
- **Exculpation Clause:** Limits director liability for breach of duty of care
- **Indemnification:** Officers/directors indemnified to fullest extent of law
- **Staggered Board:** Optional classified board (3-year terms)
- **Forum Selection:** Delaware Court of Chancery exclusive jurisdiction

**Filing:** Submit to Delaware Division of Corporations ($89 filing fee + $50 county fee)

---

#### DE (Germany): Gesellschaftsvertrag
**Structure:**
1. Firma (company name — must end with GmbH)
2. Sitz (registered seat/city)
3. Gegenstand des Unternehmens (business purpose)
4. Stammkapital (share capital — minimum €25,000)
5. Geschäftsanteile (shares/quotas) — nominal value each
6. Geschäftsführer (managing directors) — minimum 1
7. Vertretung (representation rules)
8. Gesellschafterversammlung (shareholders' meeting rules)
9. Gewinnverteilung (profit distribution)
10. Übertragung von Geschäftsanteilen (share transfer restrictions)

**Key Clauses:**
- **Stammkapital:** €25,000 minimum (€12,500 paid-up at incorporation)
- **Geschäftsanteile:** Not shares — quotas with nominal value (e.g., €1,000 each)
- **Notarization:** MANDATORY — entire Gesellschaftsvertrag must be notarized
- **Handelsregister:** File with Commercial Register (Handelsregister)

**Filing:** Notarized document + Form GmbH-1 to Handelsregister (€150-300 fees)

---

#### FR (France): Statuts (SAS)
**Structure:**
1. Dénomination sociale (company name)
2. Forme juridique (legal form: SAS, SARL, SA)
3. Siège social (registered office)
4. Objet social (business purpose)
5. Durée (duration — max 99 years)
6. Capital social (share capital — minimum €1 for SAS)
7. Apports (contributions — cash, in-kind)
8. Actions (shares — number, type, par value optional)
9. Organes de direction (management — Président mandatory for SAS)
10. Décisions collectives (shareholder decisions)
11. Agrément (approval clause for share transfers)

**Key Clauses:**
- **Capital Social:** No minimum for SAS (€1 symbolic capital common)
- **Président:** Mandatory for SAS (can be individual or legal entity)
- **Agrément Clause:** Share transfer approval common
- **Pacte d'actionnaires:** Separate shareholders' agreement common

**Filing:** Submit to Greffe du Tribunal de Commerce (€37.45 online)

---

### Template Output Structure
Due to radical differences, this must be **4 separate templates with shared variables:**

1. **articles-incorporation-uk-v1** — UK Articles of Association
2. **certificate-incorporation-us-de-v1** — US-DE Certificate + Bylaws
3. **gesellschaftsvertrag-de-v1** — German Gesellschaftsvertrag
4. **statuts-sas-fr-v1** — French Statuts (SAS)

**Recommendation:** Treat as 4 distinct templates with jurisdiction selector in questionnaire.

---

## Template 13: Contractor Agreement (Independent)

### Basic Information
**Code:** `contractor-independent-v1`
**Category:** Employment
**Jurisdictions:** UK, US-DE, DE, FR, ES
**Languages:** en-UK, en-US, de-DE, fr-FR, es-ES
**Complexity:** 5/10
**Estimated Time:** 18 minutes
**Premium:** No

### Description
Independent contractor agreement for freelancers and part-time specialists, with IP assignment, IR35/misclassification safeguards, deliverables, and payment terms. Critical for startups hiring contractors before full-time employees.

### Key Variables (18 total)

#### Group 1: Parties & Engagement
1. **company_name** (string, required) — Hiring company
2. **contractor_name** (string, required) — Contractor full name
3. **contractor_is_company** (boolean, required) — Is contractor a company/sole trader?
4. **contractor_company_name** (string, conditional on #3) — If company, trading name
5. **contractor_tax_id** (string, required) — VAT/EIN/Steuer-ID/SIRET
6. **engagement_start_date** (date, required) — Start date
7. **engagement_type** (enum, required) — Project-based, ongoing retainer, hourly

#### Group 2: Services & Deliverables
8. **services_description** (text, required) — Scope of work
9. **deliverables** (text, required) — Specific outputs expected
10. **delivery_schedule** (text, optional) — Milestones/timeline

#### Group 3: Compensation
11. **payment_type** (enum, required) — Fixed fee, hourly rate, milestone-based
12. **payment_amount** (integer, required) — Amount in local currency
13. **payment_currency** (enum, required) — GBP, USD, EUR
14. **payment_frequency** (enum, required) — Upon completion, monthly, bi-weekly
15. **expenses_reimbursable** (boolean, default: false) — Reimburse expenses?

#### Group 4: IP & Confidentiality
16. **ip_ownership** (enum, required, default: "company") — Company, contractor, shared
17. **confidentiality_period_years** (integer, 1-5, default: 3) — How long after termination
18. **non_solicitation_period_months** (integer, 0-12, default: 6) — Non-solicit clients/employees

### Conditional Logic
```json
{
  "if": [
    {"==": [{"var": "jurisdiction"}, "UK"]},
    {
      "show": ["ir35_status_determination", "substitution_clause", "control_clause"],
      "require": ["ir35_assessment"]
    }
  ],
  "if": [
    {"==": [{"var": "jurisdiction"}, "US-DE"]},
    {
      "show": ["1099_classification", "worker_control_test"],
      "require": ["abc_test_compliance"]
    }
  ]
}
```

### Jurisdiction Overlays

**UK Overlay (IR35 Compliance):**
- **IR35 Status:** Must assess employment status (HMRC CEST tool)
- **Substitution:** Right to send substitute worker (proves not employee)
- **Control:** Client does NOT control how/when/where work done
- **Mutuality of Obligation:** No obligation to offer/accept work
- **Key Clause:** "The Contractor is engaged as an independent contractor and is solely responsible for all tax, National Insurance, and VAT obligations."

**US-DE Overlay (IRS Classification):**
- **IRS 20-Factor Test / ABC Test:**
  - Behavioral control: How work is done
  - Financial control: Payment method, expenses, tools
  - Relationship: Written contracts, benefits, permanency
- **1099 vs W-2:** Contractor receives 1099-NEC, not W-2
- **Key Clause:** "Contractor is not entitled to employee benefits including health insurance, retirement plans, or paid time off."

**DE (Germany) Overlay (Scheinselbständigkeit):**
- **Fake Self-Employment Test:** German social security checks for disguised employment
- **Indicators of Independence:**
  - Works for multiple clients
  - Own business infrastructure
  - Own liability insurance
  - Sets own hours/location
- **Key Clause:** "Der Auftragnehmer ist selbständig tätig und nicht in die Arbeitsorganisation des Auftraggebers eingegliedert."

**FR (France) Overlay:**
- **Requalification Risk:** French courts aggressive in reclassifying contractors as employees
- **Auto-entrepreneur:** Many French contractors use micro-entreprise status
- **Key Clause:** "Le prestataire exerce son activité de manière indépendante et n'est soumis à aucun lien de subordination."

### Related Documents
- C01: Employment Contract (Full-time) — if converting contractor to FTE
- B02: Employee Invention Assignment — if contractor creates IP
- C03: Advisor Agreement — similar structure but equity compensation

### Use Cases
1. Hiring freelance developers/designers pre-funding
2. Part-time specialists (marketing, legal, finance)
3. Project-based work (website build, logo design)
4. Ongoing retainers (bookkeeping, HR support)
5. International contractors (no local entity)

---

## Template 14: Stock Option Grant Letter

### Basic Information
**Code:** `stock-option-grant-v1`
**Category:** Employment
**Jurisdictions:** UK (EMI), US-DE (ISO/NSO), DE (Virtual), FR
**Languages:** en-UK, en-US, de-DE, fr-FR
**Complexity:** 6/10
**Estimated Time:** 20 minutes
**Premium:** Yes (High-value, tax-sensitive)

### Description
Employee stock option grant with vesting schedule, exercise price, tax treatment, and expiration terms. **CRITICAL: Tax implications vary dramatically by jurisdiction — wrong type = 40%+ tax instead of 10%.**

### Key Variables (16 total)

#### Group 1: Grant Details
1. **jurisdiction** (enum, required) — UK/US-DE/DE/FR (determines option type)
2. **option_type** (enum, required, jurisdiction-dependent):
   - UK: EMI (Enterprise Management Incentive), Unapproved
   - US: ISO (Incentive Stock Option), NSO (Non-Qualified Stock Option)
   - DE: VSOP (Virtual Stock Option Plan), Real Options
   - FR: Stock Options, Free Shares (Actions Gratuites)
3. **employee_name** (string, required) — Full legal name
4. **grant_date** (date, required) — Date of grant
5. **number_of_options** (integer, required) — Options granted
6. **exercise_price** (decimal, required) — Price per share (must be FMV for tax purposes)

#### Group 2: Vesting
7. **vesting_period_years** (integer, 2-5, default: 4) — Total vesting period
8. **cliff_period_months** (integer, 0-24, default: 12) — Cliff before vesting starts
9. **vesting_frequency** (enum, default: "monthly") — Monthly, quarterly, annual
10. **acceleration_single_trigger** (boolean, default: false) — Accelerate on acquisition?
11. **acceleration_double_trigger** (boolean, default: false) — Accelerate on acquisition + termination?

#### Group 3: Exercise & Expiration
12. **exercise_period_years** (integer, jurisdiction-dependent):
    - UK EMI: 10 years standard
    - US ISO: 10 years (but ISOs expire 90 days post-termination)
    - DE VSOP: N/A (virtual, no exercise)
13. **post_termination_exercise_days** (integer, 30-90, default: 90) — Exercise window after leaving
14. **expiration_date** (date, calculated) — grant_date + exercise_period_years

#### Group 4: Tax & Compliance
15. **tax_treatment** (text, auto-populated based on option_type) — Explanation of tax implications
16. **409a_valuation_date** (date, US only) — Date of 409A valuation (proves FMV)

### Conditional Logic
```json
{
  "if": [
    {"==": [{"var": "jurisdiction"}, "UK"]},
    {
      "if": [
        {"==": [{"var": "option_type"}, "EMI"]},
        {
          "require": ["company_qualifies_emi", "employee_working_hours_25"],
          "show": ["emi_valuation_hmrc", "disqualifying_events"]
        }
      ]
    }
  ],
  "if": [
    {"==": [{"var": "jurisdiction"}, "US-DE"]},
    {
      "if": [
        {"==": [{"var": "option_type"}, "ISO"]},
        {
          "require": ["409a_valuation", "aggregate_iso_limit_100k"],
          "show": ["iso_holding_period", "amt_warning"]
        }
      ]
    }
  ]
}
```

### Jurisdiction Overlays

#### UK: EMI (Enterprise Management Incentive)
**Tax Advantages:**
- **Grant:** No tax
- **Exercise:** No income tax if exercise price = FMV at grant
- **Sale:** Capital Gains Tax at 10% (Business Asset Disposal Relief, formerly Entrepreneurs' Relief)

**Conditions:**
- Company < £30M gross assets, < 250 FTEs
- Employee works ≥25 hours/week or 75% of working time
- Maximum £250K EMI options per employee (at grant FMV)
- UK company, trading activities
- Exercise price ≥ FMV at grant (HMRC valuation)

**Key Clauses:**
- "This grant is made under the Company's Enterprise Management Incentive Scheme, approved by HMRC under Schedule 5 of the Income Tax (Earnings and Pensions) Act 2003."
- "Disqualifying Events: If a disqualifying event occurs, these options will cease to qualify for EMI tax treatment."

**Disqualifying Events:**
- Company exceeds £30M assets or 250 employees
- Employee works <25 hours/week
- Company sells >50% of business

---

#### US: ISO (Incentive Stock Option)
**Tax Advantages:**
- **Grant:** No tax
- **Exercise:** No ordinary income tax (but AMT potential)
- **Sale:** Long-term capital gains (15-20%) if held 2 years from grant + 1 year from exercise

**Conditions:**
- US employees only (not contractors)
- Exercise price ≥ FMV at grant (409A valuation)
- Maximum $100K worth vesting per year (aggregate ISO rule)
- 10-year expiration
- 90-day post-termination exercise window (or becomes NSO)

**Key Clauses:**
- "This option is intended to qualify as an Incentive Stock Option under Section 422 of the Internal Revenue Code."
- "409A Valuation: The exercise price is based on the fair market value determined by an independent 409A valuation dated [DATE]."
- "AMT Warning: Exercise of this option may trigger Alternative Minimum Tax. Consult a tax advisor."

**ISO vs NSO Decision Tree:**
- **Use ISO for:** US employees, ≤$100K/year vesting, FMV exercise price
- **Use NSO for:** Contractors, non-US employees, >$100K/year, below-FMV grants

---

#### US: NSO (Non-Qualified Stock Option)
**Tax Treatment:**
- **Grant:** No tax
- **Exercise:** Ordinary income tax on spread (FMV - exercise price) — withholding required
- **Sale:** Capital gains on appreciation from exercise price

**Advantages over ISO:**
- No $100K annual limit
- Can grant to contractors, advisors, non-US employees
- Can have below-FMV exercise price (but 409A issues)
- No 90-day post-termination limit

**Key Clauses:**
- "This option does not qualify as an Incentive Stock Option under Section 422 of the Internal Revenue Code."
- "Upon exercise, you will owe ordinary income tax on the difference between the exercise price and the fair market value. The Company will withhold applicable taxes."

---

#### DE (Germany): VSOP (Virtual Stock Option Plan)
**Why Virtual:** German real stock options have unfavorable tax treatment (taxed at grant even if worthless)

**Tax Treatment (VSOP):**
- **Grant:** No tax (virtual, no actual shares)
- **Exit Event:** Cash payment taxed as ordinary income (42% top rate)
- **No Shares Issued:** Employee receives cash equivalent to value appreciation

**Structure:**
- "Phantom equity" — tracks share price but doesn't grant actual shares
- Exit-only: Only pays out on acquisition or IPO
- No dilution: Company pays cash, doesn't issue shares

**Key Clauses:**
- "Diese virtuelle Beteiligung gewährt keinen Anspruch auf tatsächliche Anteile an der Gesellschaft."
- "Auszahlung erfolgt nur bei einem Exit-Event (Unternehmensverkauf oder Börsengang)."

---

#### FR (France): Stock Options vs Free Shares
**Stock Options (Stock-Options):**
- Tax at exercise: Social charges ~17% + income tax
- Tax at sale: Capital gains tax 30% flat (Prélèvement Forfaitaire Unique)
- Holding period: 3-4 years for favorable tax treatment

**Free Shares (Actions Gratuites):**
- More popular than stock options in France
- 2-year vesting minimum by law
- Tax at vesting: Social charges ~17%
- Tax at sale: Capital gains tax 30%

**Key Clauses:**
- "Les présentes stock-options sont soumises au régime fiscal des articles 80 bis et 163 bis C du Code général des impôts."

---

### Template Output Structure
Due to tax complexity, create **5 variants:**
1. **stock-option-uk-emi-v1** — UK EMI
2. **stock-option-us-iso-v1** — US ISO
3. **stock-option-us-nso-v1** — US NSO
4. **stock-option-de-vsop-v1** — German VSOP
5. **stock-option-fr-v1** — French Stock Options

---

## Template 15: Privacy Policy

### Basic Information
**Code:** `privacy-policy-v1`
**Category:** Compliance
**Jurisdictions:** UK (GDPR/UK DPA), EU (GDPR), US (CCPA), Global
**Languages:** en-UK, en-US, de-DE, fr-FR
**Complexity:** 5/10
**Estimated Time:** 20 minutes
**Premium:** No (Essential for all)

### Description
GDPR-compliant privacy policy detailing data collection, processing, retention, user rights, and third-party sharing. **LEGALLY MANDATORY** for any website/app collecting personal data. €20M fines for non-compliance.

### Key Variables (22 total)

#### Group 1: Company Details
1. **company_name** (string, required) — Legal entity name
2. **website_url** (string, required) — e.g., legalmind.com
3. **contact_email** (email, required) — Privacy contact
4. **data_controller_address** (string, required) — Registered office
5. **has_dpo** (boolean, required) — Data Protection Officer appointed?
6. **dpo_email** (email, conditional on #5) — DPO contact

#### Group 2: Data Collection
7. **collects_personal_data** (boolean, required) — Collect name, email, etc.?
8. **personal_data_types** (multi_enum, required):
   - Name, email, phone
   - Address, payment info
   - IP address, device info, cookies
   - Usage data, analytics
   - Special category data (health, biometric)
9. **collects_children_data** (boolean, required) — Users under 16?
10. **data_collection_methods** (multi_enum, required):
    - User registration
    - Contact forms
    - Cookies and tracking
    - Third-party sources

#### Group 3: Data Processing
11. **processing_purposes** (multi_enum, required):
    - Provide services
    - Marketing communications
    - Analytics and improvements
    - Legal compliance
    - Security and fraud prevention
12. **legal_basis** (multi_enum, required, GDPR):
    - Consent (Article 6(1)(a))
    - Contract performance (Article 6(1)(b))
    - Legal obligation (Article 6(1)(c))
    - Legitimate interests (Article 6(1)(f))

#### Group 4: Data Sharing
13. **shares_with_third_parties** (boolean, required) — Share with vendors, partners?
14. **third_party_categories** (multi_enum, conditional on #13):
    - Payment processors (Stripe)
    - Analytics (Google Analytics, Mixpanel)
    - Email providers (SendGrid, Mailchimp)
    - Cloud hosting (AWS, GCP)
    - CRM (HubSpot, Salesforce)
15. **international_transfers** (boolean, required) — Transfer data outside EU/UK?
16. **transfer_mechanism** (enum, conditional on #15):
    - Standard Contractual Clauses (SCCs)
    - Adequacy Decision (e.g., EU-US Data Privacy Framework)
    - Binding Corporate Rules

#### Group 5: Data Retention
17. **retention_period** (text, required) — How long data is kept
18. **deletion_policy** (text, required) — When/how data is deleted

#### Group 6: User Rights (GDPR)
19. **user_rights_gdpr** (auto-populated) — Right to access, erasure, portability, object
20. **cookie_banner** (boolean, required) — Cookie consent banner implemented?

#### Group 7: Regional Compliance
21. **ccpa_applies** (boolean) — California users?
22. **ccpa_do_not_sell** (boolean, conditional on #21) — "Do Not Sell My Personal Information" link

### Conditional Logic
```json
{
  "if": [
    {"==": [{"var": "jurisdiction"}, "EU"]},
    {
      "require": ["legal_basis_gdpr", "user_rights_section", "dpa_if_processing"],
      "show": ["gdpr_representative_eu27"]
    }
  ],
  "if": [
    {"==": [{"var": "ccpa_applies"}, true]},
    {
      "require": ["categories_personal_info", "right_to_know", "right_to_delete", "do_not_sell_link"]
    }
  ]
}
```

### Jurisdiction Overlays

**EU/UK: GDPR Compliance**
**Required Sections:**
1. **Identity of Controller** (Article 13(1)(a))
2. **Contact Details** including DPO if appointed (Article 13(1)(b))
3. **Purposes of Processing** (Article 13(1)(c))
4. **Legal Basis** (Article 13(1)(c))
5. **Legitimate Interests** if applicable (Article 13(1)(d))
6. **Recipients of Data** (Article 13(1)(e))
7. **International Transfers** and safeguards (Article 13(1)(f))
8. **Retention Period** (Article 13(2)(a))
9. **User Rights** (Article 13(2)(b)):
   - Right to access (Article 15)
   - Right to rectification (Article 16)
   - Right to erasure (Article 17)
   - Right to restrict processing (Article 18)
   - Right to data portability (Article 20)
   - Right to object (Article 21)
10. **Right to Withdraw Consent** (Article 13(2)(c))
11. **Right to Lodge Complaint** with supervisory authority (Article 13(2)(d))
12. **Automated Decision-Making** disclosure (Article 13(2)(f))

**Key Legal References:**
- GDPR (Regulation (EU) 2016/679)
- UK DPA 2018 (post-Brexit UK version)
- ePrivacy Directive 2002/58/EC (cookies)

---

**US: CCPA Compliance (California)**
**Required Disclosures:**
1. **Categories of Personal Information Collected**
2. **Sources of Personal Information**
3. **Business/Commercial Purposes for Collection**
4. **Categories of Third Parties** data shared with
5. **Sale of Personal Information** (Yes/No + "Do Not Sell" link)
6. **Consumer Rights:**
   - Right to Know (what data collected)
   - Right to Delete
   - Right to Opt-Out of Sale
   - Right to Non-Discrimination

**Trigger:** >$25M revenue OR >50K California consumers OR >50% revenue from selling personal info

**Key Legal Reference:** California Consumer Privacy Act (CCPA) + CPRA 2020

---

### Sample Structure (GDPR)
```markdown
# Privacy Policy

**Last Updated:** [DATE]

## 1. Who We Are
[Company Name] ("we", "us", "our") is the data controller...
Registered office: [Address]
Contact: [Email]
Data Protection Officer: [DPO Email]

## 2. What Data We Collect
- **Account Information:** Name, email, password
- **Payment Information:** Credit card details (processed by Stripe)
- **Usage Data:** IP address, browser type, pages visited
- **Cookies:** See our Cookie Policy

## 3. Why We Collect Data (Legal Basis)
- **Contract Performance:** To provide our services (GDPR Article 6(1)(b))
- **Legitimate Interests:** To improve our platform (GDPR Article 6(1)(f))
- **Consent:** For marketing emails (GDPR Article 6(1)(a))

## 4. Who We Share Data With
- **Payment Processors:** Stripe (USA — Standard Contractual Clauses)
- **Analytics:** Google Analytics (USA — Consent-based)
- **Hosting:** AWS (EU region)

## 5. How Long We Keep Data
- Active accounts: Duration of account + 2 years
- Marketing data: Until consent withdrawn
- Legal obligations: 7 years (tax/audit)

## 6. Your Rights (GDPR)
You have the right to:
- **Access** your personal data
- **Rectify** inaccurate data
- **Erase** your data ("right to be forgotten")
- **Restrict** processing
- **Data portability** (receive your data in machine-readable format)
- **Object** to processing
- **Withdraw consent** at any time

To exercise these rights, email: [Email]

## 7. Cookies
We use cookies for [purposes]. See our Cookie Policy.

## 8. International Transfers
We transfer data to the USA using Standard Contractual Clauses approved by the European Commission.

## 9. Complaints
You have the right to lodge a complaint with your local data protection authority:
- UK: Information Commissioner's Office (ICO) — ico.org.uk
- DE: Bundesbeauftragter für den Datenschutz
- FR: CNIL

## 10. Changes to This Policy
We will notify you of material changes via email.
```

### Related Documents
- F03: Cookie Policy (separate document)
- D05: Data Processing Agreement (B2B customers)
- Terms of Service (user agreement)

---

## Template 16: Website Terms of Service

### Basic Information
**Code:** `website-terms-v1`
**Category:** Compliance
**Jurisdictions:** UK, US, EU, Global
**Languages:** en-UK, en-US, de-DE, fr-FR
**Complexity:** 4/10
**Estimated Time:** 15 minutes
**Premium:** No

### Description
Website/platform terms and conditions covering user obligations, IP rights, disclaimers, limitation of liability, and dispute resolution. **Essential for limiting liability** and establishing legal relationship with users.

### Key Variables (15 total)

#### Group 1: Platform Details
1. **platform_name** (string, required) — Product/website name
2. **platform_url** (string, required) — Website URL
3. **company_name** (string, required) — Legal entity
4. **platform_type** (enum, required) — SaaS, marketplace, content platform, e-commerce
5. **user_accounts** (boolean, required) — User registration required?

#### Group 2: Acceptable Use
6. **prohibited_activities** (multi_enum, required):
   - Illegal activities
   - Spam or phishing
   - Malware or hacking
   - Harassment or hate speech
   - Copyright infringement
   - Unauthorized scraping
7. **minimum_age** (integer, 13-18, default: 16) — GDPR default is 16
8. **geographic_restrictions** (multi_enum, optional) — Countries where service NOT available

#### Group 3: IP & Content
9. **user_generated_content** (boolean, required) — Users post content?
10. **ugc_license_grant** (enum, conditional on #9):
    - Non-exclusive license to platform
    - Exclusive license to platform
    - User retains all rights
11. **platform_owns_ip** (boolean, required) — Platform owns IP in product/content?

#### Group 4: Liability & Disclaimers
12. **service_warranty** (enum, required):
    - "As is" (no warranty)
    - Limited warranty (specific uptime/functionality)
13. **liability_cap** (enum, required):
    - Unlimited liability
    - Limited to fees paid (12 months)
    - Limited to specific amount (e.g., $100)
14. **indemnification_users** (boolean, required) — Users indemnify company for misuse?

#### Group 5: Termination & Disputes
15. **governing_law** (enum, required) — England & Wales, Delaware, Germany, etc.
16. **dispute_resolution** (enum, required):
    - Court litigation
    - Binding arbitration
    - Mediation then arbitration

### Conditional Logic
```json
{
  "if": [
    {"==": [{"var": "user_generated_content"}, true]},
    {
      "require": ["dmca_takedown_procedure", "content_moderation_policy"],
      "show": ["user_content_license"]
    }
  ],
  "if": [
    {"==": [{"var": "platform_type"}, "e-commerce"]},
    {
      "require": ["returns_policy", "delivery_terms", "consumer_rights_uk"]
    }
  ]
}
```

### Jurisdiction Overlays

**UK Overlay:**
- **Consumer Rights Act 2015:** Cannot exclude liability for death/personal injury
- **Unfair Contract Terms Act 1977:** "Reasonable" limitation clauses only
- **Standard Clauses:**
  - "These Terms are governed by the laws of England and Wales."
  - "Nothing in these Terms excludes liability for death or personal injury caused by negligence, fraud, or fraudulent misrepresentation."

**US Overlay:**
- **DMCA Safe Harbor:** If user-generated content, include DMCA takedown procedure
- **Arbitration Clause:** Enforceable in US (Federal Arbitration Act)
- **Class Action Waiver:** Common but controversial
- **Standard Clauses:**
  - "These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles."
  - "You agree to binding arbitration administered by the American Arbitration Association."

**EU Overlay:**
- **Unfair Terms Directive (93/13/EEC):** Unfair terms in consumer contracts are void
- **Platform-to-Business Regulation (P2B):** If marketplace, must have transparent ranking/suspension terms
- **DSA (Digital Services Act 2024):** If >45M EU users, additional content moderation obligations

### Sample Structure
```markdown
# Terms of Service

**Last Updated:** [DATE]

## 1. Acceptance of Terms
By accessing [Platform], you agree to these Terms of Service.

## 2. Eligibility
You must be at least [16] years old to use this service.

## 3. User Accounts
- You are responsible for account security
- One account per person
- Accurate registration information required

## 4. Acceptable Use
You agree NOT to:
- Violate any laws
- Infringe intellectual property
- Harass other users
- Upload malware or viruses
- Scrape or automate access without permission

## 5. Intellectual Property
- Platform content is owned by [Company]
- User content: You grant us a non-exclusive license to host/display your content
- Copyright infringement: DMCA takedown procedure at [Email]

## 6. Disclaimers
- Service provided "AS IS" without warranties
- We do not guarantee uptime, accuracy, or fitness for purpose
- This is not legal advice (for LegalMind specifically)

## 7. Limitation of Liability
- Our liability is limited to fees paid in the last 12 months
- We are not liable for indirect, consequential, or punitive damages
- Exception: We do not limit liability for death/injury caused by negligence (UK law)

## 8. Indemnification
You agree to indemnify us for claims arising from your misuse of the platform.

## 9. Termination
- We may suspend/terminate accounts for Terms violations
- You may close your account anytime
- Upon termination, your data will be deleted per Privacy Policy

## 10. Governing Law & Disputes
- Governed by laws of [England & Wales / Delaware]
- Disputes resolved by [courts of England & Wales / binding arbitration]

## 11. Changes to Terms
We may update these Terms. Material changes notified via email.

## 12. Contact
Questions: [Email]
```

### Related Documents
- F02: Privacy Policy (data handling)
- F03: Cookie Policy (tracking)
- Returns/Refund Policy (if e-commerce)

---

## Template 17: Board Resolution Template

### Basic Information
**Code:** `board-resolution-v1`
**Category:** Founding
**Jurisdictions:** UK, US-DE, DE, FR (all)
**Languages:** en-UK, en-US, de-DE, fr-FR
**Complexity:** 3/10
**Estimated Time:** 8 minutes
**Premium:** No

### Description
Standard board resolution template for common corporate actions (share issuance, director appointments, contract approvals, bank account opening). **Required for ALL material corporate decisions** in every jurisdiction.

### Key Variables (10 total)

#### Group 1: Meeting Details
1. **resolution_type** (enum, required):
   - Written resolution (no meeting)
   - Board meeting minutes
2. **resolution_date** (date, required) — Date passed
3. **company_name** (string, required) — Legal entity name
4. **directors_present** (multi_select, required) — Which directors voted

#### Group 2: Resolution Subject
5. **action_type** (enum, required):
   - Share issuance
   - Director appointment/removal
   - Officer appointment
   - Contract approval (>threshold)
   - Bank account opening/signatory changes
   - Registered office change
   - Dividend declaration
   - Loan approval
   - Option grant
   - Other (specify)

#### Group 3: Action-Specific Details
6. **shares_to_issue** (integer, conditional) — If share issuance
7. **share_class** (enum, conditional) — Ordinary, Preferred, etc.
8. **allottee_name** (string, conditional) — Who receives shares
9. **consideration_amount** (integer, conditional) — Payment for shares
10. **contract_party** (string, conditional) — If contract approval, counterparty name

### Conditional Logic
```json
{
  "if": [
    {"==": [{"var": "action_type"}, "share_issuance"]},
    {
      "require": ["shares_to_issue", "share_class", "allottee_name", "consideration_amount"]
    }
  ],
  "if": [
    {"==": [{"var": "action_type"}, "director_appointment"]},
    {
      "require": ["appointee_name", "appointee_address", "effective_date"]
    }
  ]
}
```

### Jurisdiction Overlays

**UK Overlay:**
- **Written Resolutions:** Directors can pass written resolutions without meeting (CA 2006 s.248)
- **Quorum:** Check Articles (usually majority of directors)
- **Signature:** All directors sign written resolution OR meeting minutes signed by Chair

**US-DE Overlay:**
- **Unanimous Consent:** Delaware allows unanimous written consent in lieu of meeting (DGCL §141(f))
- **Minutes:** If meeting held, minutes required
- **Secretary Certification:** Corporate secretary certifies resolution

**DE (Germany) Overlay:**
- **Geschäftsführerbeschluss:** Managing directors' resolution
- **Gesellschafterbeschluss:** Shareholders' resolution (different document)
- **Form:** Written minutes or circulated written resolution

**FR (France) Overlay:**
- **Décision du Président:** For SAS, President can make certain decisions alone
- **Procès-verbal du Conseil:** If board meeting, formal minutes (procès-verbal)

### Sample Output
```markdown
# BOARD RESOLUTION

**Company:** [Company Name]
**Date:** [Date]
**Resolution Type:** Written Resolution

## Resolutions Passed

The Directors of [Company Name] hereby resolve:

### 1. SHARE ISSUANCE
**RESOLVED THAT:**
- The Company allots [Number] [Class] shares to [Allottee Name]
- Issue price: [Currency][Amount] per share
- Total consideration: [Currency][Total]
- The shares shall rank pari passu with existing [Class] shares
- The Directors are authorized to execute all necessary documents

### Signatures
[Director 1 Name]
Signature: ________________ Date: __________

[Director 2 Name]
Signature: ________________ Date: __________
```

### Related Documents
- A06: Share Issuance Form (detailed share allotment)
- A02: Shareholders' Agreement (if investor)
- Articles of Association (governs director powers)

---

## Template 18: Offer Letter

### Basic Information
**Code:** `offer-letter-v1`
**Category:** Employment
**Jurisdictions:** UK, US-DE, DE, FR, ES (all)
**Languages:** en-UK, en-US, de-DE, fr-FR, es-ES
**Complexity:** 2/10
**Estimated Time:** 8 minutes
**Premium:** No

### Description
Job offer letter with role, compensation, start date, and contingencies (background check, references). **Standard step** before full employment contract. In US, often binding; in UK, usually "subject to contract."

### Key Variables (12 total)

#### Group 1: Position Details
1. **candidate_name** (string, required) — Full name
2. **job_title** (string, required) — e.g., Senior Software Engineer
3. **department** (string, required) — Engineering, Sales, etc.
4. **reports_to** (string, required) — Manager name/title
5. **start_date** (date, required) — First day of work

#### Group 2: Compensation
6. **salary_amount** (integer, required) — Annual salary
7. **salary_currency** (enum, required) — GBP, USD, EUR
8. **salary_frequency** (enum, required) — Annual, monthly
9. **bonus_eligible** (boolean, default: false) — Performance bonus?
10. **equity_grant** (boolean, default: false) — Stock options?

#### Group 3: Conditions
11. **contingencies** (multi_enum, required):
    - Background check
    - Reference checks
    - Right to work verification
    - Signing employment contract
12. **offer_expiry_date** (date, required) — Acceptance deadline

### Conditional Logic
```json
{
  "if": [
    {"==": [{"var": "equity_grant"}, true]},
    {
      "show": ["equity_details", "vesting_schedule_summary"]
    }
  ]
}
```

### Jurisdiction Overlays

**UK Overlay:**
- **Subject to Contract:** Offer letters in UK are usually NOT binding until employment contract signed
- **Standard Wording:** "This offer is subject to satisfactory references, right to work checks, and signing a contract of employment."
- **Notice:** Must include whether offer is "subject to contract" or binding

**US Overlay:**
- **At-Will Employment:** Must state "employment at-will" (can terminate anytime)
- **Binding:** US offer letters are often legally binding contracts
- **Standard Wording:** "This is an at-will employment relationship. Either party may terminate at any time, with or without cause."

**DE (Germany) Overlay:**
- **Arbeitsvertrag:** Offer letter + employment contract often combined in Germany
- **Probation:** Probezeit (probation period, typically 6 months) stated upfront
- **Works Council:** If company has Betriebsrat, may need consultation

**FR (France) Overlay:**
- **Promesse d'embauche:** Offer letter is binding in France once accepted
- **Period of Trial:** Période d'essai stated (2-4 months for cadres)

### Sample Output
```markdown
# OFFER OF EMPLOYMENT

**Date:** [Date]

**Dear [Candidate Name],**

We are pleased to offer you the position of **[Job Title]** at [Company Name].

## Position Details
- **Title:** [Job Title]
- **Department:** [Department]
- **Reports To:** [Manager]
- **Start Date:** [Start Date]
- **Location:** [Office Location / Remote]

## Compensation
- **Base Salary:** [Currency][Amount] per annum
- **Payment:** Paid monthly in arrears
- **Bonus:** [If applicable: Eligible for annual performance bonus up to X%]
- **Equity:** [If applicable: Subject to board approval, you will be granted X stock options with a 4-year vesting schedule]

## Benefits
- [List: health insurance, pension, vacation days, etc.]

## Conditions
This offer is conditional upon:
- Satisfactory background and reference checks
- Proof of right to work in [Country]
- Signing our standard employment contract

## At-Will Employment (US) / Subject to Contract (UK)
[US: This is an at-will employment relationship. Either party may terminate employment at any time, with or without cause.]
[UK: This offer is subject to contract. A formal employment contract will be provided for your signature.]

## Acceptance
Please sign and return this letter by [Expiry Date] to confirm your acceptance.

We look forward to welcoming you to the team!

**Sincerely,**
[Hiring Manager Name]
[Title]

---

**ACCEPTANCE**

I, [Candidate Name], accept this offer of employment on the terms outlined above.

Signature: ________________
Date: __________
```

### Related Documents
- C01: Employment Contract (Full-time) — follows offer acceptance
- C12: Stock Option Grant Letter — if equity offered
- Background Check Authorization Form

---

## Summary Table: Critical 8 Templates

| # | Template | Category | Complexity | Time | Jurisdictions | Priority |
|---|----------|----------|------------|------|---------------|----------|
| 11 | Shareholders' Agreement | Founding | 8/10 | 35min | UK, US-DE, DE, FR | 🔴 CRITICAL |
| 12 | Articles/Certificate | Founding | 6/10 | 25min | UK, US-DE, DE, FR (4 variants) | 🔴 CRITICAL |
| 13 | Contractor Agreement | Employment | 5/10 | 18min | UK, US-DE, DE, FR, ES | 🔴 CRITICAL |
| 14 | Stock Option Grant | Employment | 6/10 | 20min | UK(EMI), US(ISO/NSO), DE(VSOP), FR | 🔴 CRITICAL |
| 15 | Privacy Policy | Compliance | 5/10 | 20min | UK, EU, US (CCPA) | 🔴 CRITICAL |
| 16 | Website Terms | Compliance | 4/10 | 15min | UK, US, EU (global) | 🔴 CRITICAL |
| 17 | Board Resolution | Founding | 3/10 | 8min | All | 🔴 CRITICAL |
| 18 | Offer Letter | Employment | 2/10 | 8min | All | 🔴 CRITICAL |

**Total Development Time:** ~2.5 hours of questionnaires + 40 hours of legal drafting/review

---

## Implementation Priority (Weeks 7-8)

### Week 7: Quick Wins (Low Complexity)
**Day 1-2:** Template 18 (Offer Letter) — Simplest, 2/10 complexity
**Day 2-3:** Template 17 (Board Resolution) — Simple, 3/10 complexity
**Day 4-5:** Template 16 (Website Terms) — Moderate, 4/10 complexity

### Week 8: High-Value Templates
**Day 1-2:** Template 15 (Privacy Policy) — GDPR-heavy but standard structure
**Day 3-4:** Template 13 (Contractor Agreement) — IR35/1099 complexity
**Day 4-5:** Template 11 (Shareholders' Agreement) — Complex but reusable structure

### Post-Week 8: Specialized Templates
**Weeks 9-10:** Template 14 (Stock Options) — Tax-sensitive, create 5 variants
**Weeks 10-11:** Template 12 (Articles/Certificate) — Create 4 jurisdiction variants

---

## Next Steps

1. **Lawyer Recruitment:** Recruit 8-10 lawyers (2 per key jurisdiction) to draft these templates
2. **Prioritization Decision:** Do you want to proceed with all 8 or focus on top 5 first?
3. **Questionnaire Development:** After specs approved, build questionnaires for each

**Shall I now proceed to:**
- **Part 2:** Prioritize existing 10 templates for questionnaire implementation?
- **Part 3:** Design jurisdiction overlay system?
