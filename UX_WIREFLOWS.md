# LegalMind UX Wireflows & Copy

## 1. Template Discovery Flow

```
[Landing Page] → [Search/Filter] → [Template Details] → [Start Questionnaire]
```

### Landing Page
```
┌─────────────────────────────────────────────────────────────┐
│ 🏛️ LegalMind                                [Login] [Sign Up] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    Generate Legal Documents                                 │
│    Tailored to Your Jurisdiction                           │
│                                                             │
│    [Search templates...]                     🔍             │
│                                                             │
│    Popular Categories:                                      │
│    [📋 Business] [🏪 Consumer] [🤝 Personal]                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Featured Templates:                                         │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│ │ NDA         │ │ Service     │ │ Terms of    │            │
│ │ (Mutual)    │ │ Agreement   │ │ Sale        │            │
│ │ UK/US/EU    │ │ B2B         │ │ Consumer    │            │
│ │ ⭐⭐⭐⭐⭐      │ │ ⭐⭐⭐⭐       │ │ ⭐⭐⭐⭐⭐      │            │
│ │ [Generate]  │ │ [Generate]  │ │ [Generate]  │            │
│ └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

### Search & Filter Interface
```
┌─────────────────────────────────────────────────────────────┐
│ [🔙] Search Results                        [Account] [Help] │
├─────────────────────────────────────────────────────────────┤
│ Filters:                     │ Results (24)               │
│ ┌─────────────────────────┐  │                            │
│ │ Category                │  │ 📋 NDA - Mutual           │
│ │ ☑ B2B  ☐ B2C  ☐ P2P   │  │ UK, US-DE, EU             │
│ │                         │  │ ⏱️ 15 min   🔒 Medium     │
│ │ Jurisdiction            │  │ ⭐⭐⭐⭐⭐ (342 uses)        │
│ │ ☑ UK  ☑ US  ☐ EU       │  │ [View Details] [Generate]  │
│ │ ☐ DE  ☐ CZ  ☐ FR       │  │ ─────────────────────────── │
│ │                         │  │                            │
│ │ Language                │  │ 📋 Service Agreement       │
│ │ ☑ English  ☐ German     │  │ US-DE, UK                 │
│ │ ☐ Czech    ☐ French     │  │ ⏱️ 25 min   🔒 High       │
│ │                         │  │ ⭐⭐⭐⭐ (89 uses)          │
│ │ Complexity              │  │ [View Details] [Generate]  │
│ │ ●────●────○ (1-7)       │  │ ─────────────────────────── │
│ │                         │  │                            │
│ │ Risk Level              │  │ 🏪 Terms of Sale          │
│ │ ☑ Low  ☑ Medium  ☐ High│  │ EU, UK                    │
│ │                         │  │ ⏱️ 12 min   🔒 Low        │
│ │ [Clear Filters]         │  │ ⭐⭐⭐⭐⭐ (156 uses)        │
│ └─────────────────────────┘  │ [View Details] [Generate]  │
└─────────────────────────────────────────────────────────────┘
```

### Template Details Page
```
┌─────────────────────────────────────────────────────────────┐
│ [🔙] NDA - Mutual                          [Account] [Help] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────┐  📋 Non-Disclosure Agreement   │
│ │ Template Preview        │     (Mutual)                   │
│ │                         │                                │
│ │ 1. Definitions          │  ⏱️ ~15 minutes                │
│ │ 2. Confidential Info    │  🔒 Medium Risk                │
│ │ 3. Obligations          │  🌍 UK, US-DE, EU             │
│ │ 4. Exceptions          │  🗣️ English, German, Czech     │
│ │ 5. Term & Termination  │  ⭐⭐⭐⭐⭐ 342 generations      │
│ │ 6. Governing Law       │                                │
│ │                         │  What you'll need:             │
│ │ [Full Preview]          │  • Company details (both)     │
│ └─────────────────────────┘  • Contact information        │
│                              • Confidentiality period     │
│ Use Cases:                   • Governing law choice       │
│ • Partnership discussions                                  │
│ • Vendor evaluations        [🚀 Start Questionnaire]     │
│ • Joint venture planning                                   │
│                                                            │
│ ⚠️ This generates a legal document. Please review with    │
│    qualified legal counsel before signing.                │
└─────────────────────────────────────────────────────────────┘
```

## 2. Questionnaire Flow

### Mode Selection
```
┌─────────────────────────────────────────────────────────────┐
│ [🔙] NDA - Mutual Questionnaire           [Save] [Help]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│         Choose Your Experience Level                       │
│                                                             │
│    ┌─────────────────────┐   ┌─────────────────────┐      │
│    │ 🎯 Guided Mode      │   │ ⚙️ Professional Mode │      │
│    │                     │   │                     │      │
│    │ Plain language      │   │ Legal terminology   │      │
│    │ questions with      │   │ with grouped        │      │
│    │ explanations        │   │ sections            │      │
│    │                     │   │                     │      │
│    │ Best for: Business  │   │ Best for: Legal     │      │
│    │ owners, freelancers │   │ professionals       │      │
│    │                     │   │                     │      │
│    │ [Select Guided]     │   │ [Select Pro]        │      │
│    └─────────────────────┘   └─────────────────────┘      │
│                                                             │
│    Jurisdiction & Language                                 │
│    Jurisdiction: [🇬🇧 United Kingdom ▼]                   │
│    Language: [🇬🇧 English (UK) ▼]                         │
│                                                             │
│    [Continue →]                                            │
└─────────────────────────────────────────────────────────────┘
```

### Guided Mode - Step 1
```
┌─────────────────────────────────────────────────────────────┐
│ [🔙] NDA Questionnaire          Step 1 of 6  [Save] [Help] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 👥 Who are the parties to this agreement?                  │
│                                                             │
│ First Party (Your Organization)                            │
│ Company Name: [_________________________]                  │
│ Legal Entity Type: [Limited Company ▼]                     │
│ Registration Number: [_________________________]            │
│ Address: [_________________________________________]        │
│         [_________________________________________]        │
│ Contact Person: [_________________________]                │
│ Email: [_________________________]                         │
│                                                             │
│ Second Party (Other Organization)                          │
│ Company Name: [_________________________]                  │
│ Legal Entity Type: [Limited Company ▼]                     │
│ Registration Number: [_________________________]            │
│ Address: [_________________________________________]        │
│         [_________________________________________]        │
│ Contact Person: [_________________________]                │
│ Email: [_________________________]                         │
│                                                             │
│ ❓ Why do we need this? Both parties need to be clearly    │
│    identified for the agreement to be legally binding.     │
│                                                             │
│ [← Previous] [Save & Continue →]                           │
└─────────────────────────────────────────────────────────────┘
```

### Guided Mode - Step 3 (Conditional)
```
┌─────────────────────────────────────────────────────────────┐
│ [🔙] NDA Questionnaire          Step 3 of 6  [Save] [Help] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🔒 What type of information will be shared?                │
│                                                             │
│ ☑ Business plans and strategies                            │
│ ☑ Financial information                                    │
│ ☑ Technical specifications                                 │
│ ☑ Customer lists and data                                  │
│ ☐ Personal data (GDPR implications)                        │
│ ☐ Intellectual property                                    │
│ ☐ Trade secrets                                            │
│ ☐ Other: [________________________]                       │
│                                                             │
│ 🕐 How long should the confidentiality last?              │
│ ○ 2 years   ○ 3 years   ● 5 years   ○ Indefinite         │
│                                                             │
│ 📊 Personal Data Handling                                  │
│ Since you selected "Customer lists and data":              │
│                                                             │
│ Will personal data be shared? ● Yes  ○ No                 │
│                                                             │
│ ⚠️ Personal data sharing requires additional GDPR          │
│    compliant clauses. This will be automatically added.   │
│                                                             │
│ Data Controller: ○ First Party  ○ Second Party  ● Joint   │
│                                                             │
│ [← Previous] [Save & Continue →]                           │
└─────────────────────────────────────────────────────────────┘
```

### Professional Mode Overview
```
┌─────────────────────────────────────────────────────────────┐
│ [🔙] NDA Questionnaire (Pro)           [Save] [Preview] [?] │
├─────────────────────────────────────────────────────────────┤
│ Sections: [Parties] [Definition] [Obligations] [Exceptions] │
│          [Term] [Governing Law] [Miscellaneous]             │
│                                                             │
│ ┌─ Parties ────────────────────────────────────────────────┐│
│ │ disclosing_party_name     [_________________________]   ││
│ │ disclosing_party_type     [Limited Company ▼]          ││
│ │ disclosing_party_regno    [_________________________]   ││
│ │ receiving_party_name      [_________________________]   ││
│ │ receiving_party_type      [Limited Company ▼]          ││
│ │ mutual_disclosure         ● Yes  ○ No                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─ Definition ─────────────────────────────────────────────┐│
│ │ confidential_info_types   [☑] Technical ☑ Financial    ││
│ │                          [☑] Commercial ☐ Personal     ││
│ │ marking_requirement       ● Required  ○ Not Required   ││
│ │ oral_info_protection      ● Yes  ○ No                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ ┌─ Obligations ────────────────────────────────────────────┐│
│ │ permitted_use            [☑] Evaluation purposes only   ││
│ │ standard_of_care         [Same degree as own info ▼]   ││
│ │ return_requirement       ● Upon request  ○ At term end ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Validation: ✅ All required fields complete                │
│ [Generate Preview]                                          │
└─────────────────────────────────────────────────────────────┘
```

## 3. Pre-Generation Disclaimer Flow

### Disclaimer Modal (Blocking)
```
┌─────────────────────────────────────────────────────────────┐
│                    ⚖️ Important Legal Notice                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Before we generate your document, please understand:       │
│                                                             │
│ ✓ This is NOT legal advice                                │
│ ✓ This document is a starting point, not a final solution  │
│ ✓ You should review with qualified legal counsel           │
│ ✓ Laws vary by jurisdiction and change over time           │
│ ✓ Your specific situation may require modifications        │
│                                                             │
│ Generated documents are provided "as is" without warranty  │
│ of any kind. LegalMind assumes no liability for use of     │
│ these documents.                                            │
│                                                             │
│ ☐ I understand this is not legal advice and will consult   │
│   with qualified legal counsel before using this document  │
│                                                             │
│ ☐ I agree to the Terms of Service and Privacy Policy       │
│                                                             │
│ [View Full Disclaimer] [Cancel] [I Understand - Continue]  │
│                                                             │
│ 🔒 Secure: We don't store your personal information        │
└─────────────────────────────────────────────────────────────┘
```

## 4. Document Preview Flow

### Live Preview Interface
```
┌─────────────────────────────────────────────────────────────┐
│ [🔙] Document Preview                  [Edit] [Download] [?] │
├─────────────────────────────────────────────────────────────┤
│ ┌─Document─────────────────────┐ ┌─Summary──────────────────┐│
│ │                              │ │ Template: NDA (Mutual)   ││
│ │ NON-DISCLOSURE AGREEMENT     │ │ Jurisdiction: UK         ││
│ │                              │ │ Language: English (UK)   ││
│ │ This Agreement is made       │ │ Generated: 21 Sep 2025   ││
│ │ between Acme Corp Ltd        │ │ Version: 1.2.0           ││
│ │ (the "First Party") and      │ │                          ││
│ │ Beta Solutions Ltd           │ │ 📊 Your Choices:         ││
│ │ (the "Second Party").        │ │ • Mutual disclosure      ││
│ │                              │ │ • 5-year term           ││
│ │ 1. DEFINITIONS               │ │ • GDPR addendum         ││
│ │                              │ │ • UK governing law      ││
│ │ "Confidential Information"   │ │                          ││
│ │ means any technical,         │ │ 🔍 Clause Breakdown:    ││
│ │ financial, or commercial     │ │ • Required: 8           ││
│ │ information disclosed...     │ │ • Optional: 3           ││
│ │                              │ │ • GDPR-specific: 2      ││
│ │ [Highlighted variables and   │ │                          ││
│ │  conditional clauses shown   │ │ ⚠️ Risk Assessment:     ││
│ │  with colored background]    │ │ Medium - review with    ││
│ │                              │ │ legal counsel           ││
│ │ [Scroll to see full doc...]  │ │                          ││
│ └──────────────────────────────┘ └──────────────────────────┘│
│                                                             │
│ Options:                                                    │
│ 🔍 [Show Highlights] 📝 [Show Comments] 📋 [Show Sources]   │
│                                                             │
│ Export Format: ● DOCX  ○ PDF  ○ HTML                       │
│ [📥 Download Document]                                      │
└─────────────────────────────────────────────────────────────┘
```

### Preview with Explanations
```
┌─────────────────────────────────────────────────────────────┐
│ Document Preview - Explanations Mode                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 2. CONFIDENTIALITY OBLIGATIONS                             │
│                                                             │
│ Each party agrees to:                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ (a) hold all Confidential Information in strict        │ │
│ │     confidence and not disclose it to any third party  │ │
│ │     without prior written consent;                     │ │
│ │                                            💡 This clause │ │
│ │ (b) use the same degree of care to protect the        │ │
│ │     Confidential Information as it uses to protect    │ │
│ │     its own confidential information, but in no case  │ │
│ │     less than reasonable care;                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ 💡 Standard of Care Explanation:                          │
│ This "same degree of care" standard is widely accepted    │
│ and provides flexibility while ensuring reasonable        │
│ protection. UK courts generally enforce this standard.    │
│                                                             │
│ ⚠️ Consider: If your information is highly sensitive,     │
│ you may want to specify "highest degree of care" instead. │
│                                                             │
│ [Hide Explanations] [Next Section →]                      │
└─────────────────────────────────────────────────────────────┘
```

## 5. Finalization & Export Flow

### Export Options
```
┌─────────────────────────────────────────────────────────────┐
│ 📥 Download Your Document                  [🔙] [Help] [×]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Choose your preferred format:                              │
│                                                             │
│ ● 📄 Microsoft Word (.docx)                               │
│   Editable format for making changes                       │
│   Compatible with Word, Google Docs, etc.                  │
│   File size: ~45 KB                                       │
│                                                             │
│ ○ 📑 PDF Document (.pdf)                                   │
│   Read-only format for sharing and printing                │
│   Universal compatibility                                   │
│   File size: ~120 KB                                       │
│                                                             │
│ ○ 🌐 Web Page (.html)                                      │
│   For web viewing and copying text                         │
│   Includes styling and formatting                          │
│   File size: ~25 KB                                        │
│                                                             │
│ Options:                                                    │
│ ☑ Include generation summary and metadata                  │
│ ☑ Add watermark: "Generated by LegalMind - Review Required"│
│ ☐ Save my answers for future use (30 days)                 │
│                                                             │
│ 🔒 Privacy: Downloads are generated on-demand and not      │
│     stored on our servers after 24 hours.                 │
│                                                             │
│ [📥 Download Document] [📧 Email Link]                     │
└─────────────────────────────────────────────────────────────┘
```

### Download Success
```
┌─────────────────────────────────────────────────────────────┐
│ ✅ Document Generated Successfully                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 🎉 Your NDA is ready!                                     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📄 NDA-Mutual-AcmeCorp-BetaSolutions-20250921.docx     │ │
│ │ 📥 Downloaded to your device                           │ │
│ │ 📅 Generated: 21 September 2025, 14:30 GMT             │ │
│ │ 🔗 Download link valid for 7 days                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Next Steps:                                                │
│ 1. ⚖️ Review with qualified legal counsel                 │
│ 2. ✏️ Make any necessary modifications                     │
│ 3. 📝 Have both parties sign the agreement                │
│                                                             │
│ Need help finding a lawyer?                                │
│ [🔍 Find Legal Counsel] (Coming in Step 2)                │
│                                                             │
│ Rate your experience:                                      │
│ ⭐⭐⭐⭐⭐ [Leave Feedback]                                   │
│                                                             │
│ [📧 Email Receipt] [🔄 Generate Another] [🏠 Home]         │
└─────────────────────────────────────────────────────────────┘
```

## 6. Error Handling

### Validation Errors
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Please Fix the Following Issues                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Company Information:                                        │
│ ❌ Company registration number is required for UK entities │
│ ❌ Email address format is invalid                         │
│                                                             │
│ Agreement Terms:                                            │
│ ⚠️ 10-year confidentiality period exceeds recommended       │
│    maximum (5 years) for this agreement type              │
│                                                             │
│ [Go to Company Information] [Fix Email] [Review Terms]     │
└─────────────────────────────────────────────────────────────┘
```

### Jurisdiction Not Supported
```
┌─────────────────────────────────────────────────────────────┐
│ 🌍 Jurisdiction Not Yet Supported                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ This template is not yet available for:                   │
│ 🇫🇷 France                                                │
│                                                             │
│ Available alternatives:                                     │
│ • 🇪🇺 EU Baseline (with French addendum notes)             │
│ • 🇬🇧 UK version (review required for French law)         │
│ • 🇩🇪 German version (similar civil law system)           │
│                                                             │
│ We're working on full French support. Get notified:       │
│ [📧 Email me when available]                               │
│                                                             │
│ [Try EU Baseline] [Contact Support] [🔙 Back]              │
└─────────────────────────────────────────────────────────────┘
```

## Disclaimer Copy

### Short Disclaimer (Modal)
```
This is NOT legal advice. LegalMind provides document templates for informational purposes only. Generated documents should be reviewed by qualified legal counsel before use. Laws vary by jurisdiction and change over time. Your specific situation may require modifications not covered by our templates. LegalMind assumes no liability for the use of generated documents.
```

### Full Disclaimer (Policy Page)
```
LEGAL DISCLAIMER AND TERMS OF USE

IMPORTANT: READ CAREFULLY BEFORE USING LEGALMIND SERVICES

1. NOT LEGAL ADVICE
LegalMind is a document generation platform that provides legal document templates for informational and educational purposes only. The templates, documents, and information provided through our service do not constitute legal advice and should not be relied upon as a substitute for consultation with qualified legal professionals.

2. NO ATTORNEY-CLIENT RELATIONSHIP
Use of LegalMind does not create an attorney-client relationship between you and LegalMind, its employees, contractors, or affiliates. We are not a law firm and do not provide legal services.

3. PROFESSIONAL REVIEW REQUIRED
All generated documents should be reviewed by qualified legal counsel before use. Laws vary significantly by jurisdiction and change frequently. What may be appropriate in one jurisdiction may be inadequate or unenforceable in another.

4. TEMPLATE LIMITATIONS
Our templates are designed for common situations and may not address the specific legal requirements of your particular circumstances. Complex transactions or unique situations may require customized legal documents that our templates cannot provide.

5. NO WARRANTIES
Documents and information are provided "as is" without warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.

6. LIMITATION OF LIABILITY
LegalMind shall not be liable for any damages arising from the use or inability to use our service or generated documents, including but not limited to direct, indirect, incidental, punitive, and consequential damages.

7. JURISDICTION-SPECIFIC DISCLAIMERS
- UK: Our templates are not intended to replace solicitor advice and should be reviewed by a qualified solicitor before use.
- US: Legal requirements vary by state. Consult with an attorney licensed in your state.
- EU: Data protection and consumer law requirements may apply. Seek legal counsel familiar with applicable member state laws.

8. UPDATES AND CHANGES
Legal requirements change over time. We recommend periodically checking for template updates and re-consulting with legal counsel as needed.

By using LegalMind, you acknowledge that you have read, understood, and agree to be bound by this disclaimer and our Terms of Service.

Last updated: September 2025
```

This UX design prioritizes clarity, legal compliance, and user safety while maintaining an efficient workflow for document generation.