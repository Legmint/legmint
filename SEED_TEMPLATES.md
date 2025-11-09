# LegalMind Seed Templates - Complete Specifications

## Template Set Overview

| Template | Category | Jurisdictions | Languages | Risk Level | Complexity |
|----------|----------|---------------|-----------|------------|------------|
| 1. NDA (Mutual) | B2B | UK, US-DE, EU-BASE | EN-UK, EN-US, DE-DE, CS-CZ | MEDIUM | 4/10 |
| 2. NDA (Unilateral) | B2B | UK, US-DE, EU-BASE | EN-UK, EN-US, DE-DE, CS-CZ | MEDIUM | 3/10 |
| 3. Master Service Agreement | B2B | UK, US-DE | EN-UK, EN-US, DE-DE | HIGH | 8/10 |
| 4. SaaS Subscription Agreement | B2B | UK, US-DE, EU-BASE | EN-UK, EN-US, DE-DE | HIGH | 7/10 |
| 5. Data Processing Agreement | B2B | EU-BASE, UK | EN-UK, DE-DE, CS-CZ | HIGH | 6/10 |
| 6. Statement of Work | B2B | UK, US-DE | EN-UK, EN-US | MEDIUM | 5/10 |
| 7. Terms of Sale (Goods) | B2C | UK, EU-BASE | EN-UK, DE-DE, CS-CZ | LOW | 3/10 |
| 8. Website Terms of Use | B2C | UK, US-DE, EU-BASE | EN-UK, EN-US, DE-DE | LOW | 2/10 |
| 9. Simple Loan Agreement | P2P | UK, US-DE | EN-UK, EN-US | MEDIUM | 4/10 |
| 10. Freelance Engagement | P2P | UK, EU-BASE | EN-UK, DE-DE, CS-CZ | LOW | 3/10 |

---

## 1. NDA (Mutual) - Template Specification

### Metadata
```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "code": "nda-mutual-v1",
  "title": "Non-Disclosure Agreement (Mutual)",
  "description": "Bilateral confidentiality agreement for protecting sensitive information shared between two parties during business discussions, partnerships, or collaborations.",
  "category": "B2B",
  "jurisdiction_set": ["UK", "US-DE", "EU-BASE"],
  "default_language": "en-UK",
  "supported_languages": ["en-UK", "en-US", "de-DE", "cs-CZ"],
  "min_risk_level": "MEDIUM",
  "complexity_score": 4,
  "estimated_time_minutes": 15,
  "version": "1.0.0",
  "use_cases": [
    "Partnership discussions and due diligence",
    "Vendor selection and evaluation processes",
    "Joint venture negotiations",
    "Technology sharing arrangements",
    "Merger and acquisition discussions"
  ],
  "tags": ["confidentiality", "bilateral", "business-development", "due-diligence"]
}
```

### Variables JSON Schema
```json
{
  "variables": [
    {
      "var_code": "first_party_name",
      "type": "string",
      "validation": {
        "required": true,
        "min_length": 2,
        "max_length": 200,
        "pattern": "^[A-Za-z0-9\\s\\.,\\-&'()]+$"
      },
      "ui_hint": "input",
      "display_name_key": "first_party_name.label",
      "help_text_key": "first_party_name.help",
      "group": "parties",
      "display_order": 1
    },
    {
      "var_code": "first_party_type",
      "type": "enum",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "limited_company", "label_key": "entity_type.limited_company"},
          {"value": "llc", "label_key": "entity_type.llc", "jurisdiction_specific": true},
          {"value": "corporation", "label_key": "entity_type.corporation", "jurisdiction_specific": true},
          {"value": "partnership", "label_key": "entity_type.partnership"},
          {"value": "sole_trader", "label_key": "entity_type.sole_trader"}
        ]
      },
      "ui_hint": "select",
      "display_name_key": "first_party_type.label",
      "help_text_key": "first_party_type.help",
      "group": "parties",
      "display_order": 2,
      "jurisdiction_overrides": {
        "US-DE": {
          "default_value": "llc"
        }
      }
    },
    {
      "var_code": "first_party_registration",
      "type": "string",
      "validation": {
        "required": true,
        "min_length": 5,
        "max_length": 50
      },
      "ui_hint": "input",
      "display_name_key": "first_party_registration.label",
      "help_text_key": "first_party_registration.help",
      "group": "parties",
      "display_order": 3,
      "dependencies": {
        "required_if": {
          "in": [{"var": "first_party_type"}, ["limited_company", "llc", "corporation"]]
        }
      }
    },
    {
      "var_code": "second_party_name",
      "type": "string",
      "validation": {
        "required": true,
        "min_length": 2,
        "max_length": 200,
        "pattern": "^[A-Za-z0-9\\s\\.,\\-&'()]+$"
      },
      "ui_hint": "input",
      "display_name_key": "second_party_name.label",
      "help_text_key": "second_party_name.help",
      "group": "parties",
      "display_order": 4
    },
    {
      "var_code": "confidentiality_period_years",
      "type": "integer",
      "validation": {
        "required": true,
        "minimum": 1,
        "maximum": 10
      },
      "ui_hint": "select",
      "display_name_key": "confidentiality_period.label",
      "help_text_key": "confidentiality_period.help",
      "default_value": 5,
      "group": "terms",
      "display_order": 5
    },
    {
      "var_code": "confidential_info_types",
      "type": "multi_enum",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "technical", "label_key": "info_types.technical"},
          {"value": "financial", "label_key": "info_types.financial"},
          {"value": "commercial", "label_key": "info_types.commercial"},
          {"value": "customer_data", "label_key": "info_types.customer_data"},
          {"value": "personal_data", "label_key": "info_types.personal_data"},
          {"value": "intellectual_property", "label_key": "info_types.intellectual_property"}
        ]
      },
      "ui_hint": "checkbox",
      "display_name_key": "confidential_info_types.label",
      "help_text_key": "confidential_info_types.help",
      "group": "terms",
      "display_order": 6
    },
    {
      "var_code": "includes_personal_data",
      "type": "boolean",
      "validation": {
        "required": true
      },
      "ui_hint": "radio",
      "display_name_key": "includes_personal_data.label",
      "help_text_key": "includes_personal_data.help",
      "default_value": false,
      "group": "terms",
      "display_order": 7,
      "dependencies": {
        "calculate_from": {
          "in": ["personal_data", {"var": "confidential_info_types"}]
        }
      }
    },
    {
      "var_code": "governing_law",
      "type": "governing_law",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "england_wales", "label_key": "governing_law.england_wales"},
          {"value": "delaware", "label_key": "governing_law.delaware"},
          {"value": "german", "label_key": "governing_law.german"},
          {"value": "czech", "label_key": "governing_law.czech"}
        ]
      },
      "ui_hint": "governing_law_selector",
      "display_name_key": "governing_law.label",
      "help_text_key": "governing_law.help",
      "group": "legal",
      "display_order": 8,
      "jurisdiction_overrides": {
        "UK": {"default_value": "england_wales"},
        "US-DE": {"default_value": "delaware"},
        "EU-BASE": {"default_value": "german"}
      }
    },
    {
      "var_code": "dispute_resolution",
      "type": "enum",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "courts", "label_key": "dispute_resolution.courts"},
          {"value": "arbitration", "label_key": "dispute_resolution.arbitration"},
          {"value": "mediation_then_arbitration", "label_key": "dispute_resolution.mediation_arbitration"}
        ]
      },
      "ui_hint": "radio",
      "display_name_key": "dispute_resolution.label",
      "help_text_key": "dispute_resolution.help",
      "default_value": "courts",
      "group": "legal",
      "display_order": 9
    },
    {
      "var_code": "effective_date",
      "type": "date",
      "validation": {
        "required": true,
        "date_constraints": {
          "min_date": "today",
          "max_date": "+90d"
        }
      },
      "ui_hint": "date_picker",
      "display_name_key": "effective_date.label",
      "help_text_key": "effective_date.help",
      "default_value": "today",
      "group": "terms",
      "display_order": 10
    }
  ]
}
```

### Clause Structure
```json
{
  "clauses": [
    {
      "clause_code": "preamble",
      "canonical_text": "This MUTUAL NON-DISCLOSURE AGREEMENT (this \"Agreement\") is made on {{effective_date}} between {{first_party_name}}, a {{first_party_type}} {{#if first_party_registration}}registered under number {{first_party_registration}}{{/if}} (\"First Party\") and {{second_party_name}}, a {{second_party_type}} {{#if second_party_registration}}registered under number {{second_party_registration}}{{/if}} (\"Second Party\").",
      "precedence": 1,
      "section": "introduction",
      "is_required": true,
      "risk_level": "LOW"
    },
    {
      "clause_code": "definitions",
      "canonical_text": "For the purposes of this Agreement:\n\n\"Confidential Information\" means {{#each confidential_info_types}}{{#switch this}}{{#case 'technical'}}technical data, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances{{/case}}{{#case 'financial'}}financial information, revenue data, cost structures, pricing strategies, business plans{{/case}}{{#case 'commercial'}}commercial information, business strategies, market analysis, competitive intelligence{{/case}}{{#case 'customer_data'}}customer information, client lists, customer preferences and requirements{{/case}}{{#case 'personal_data'}}personal data as defined under applicable data protection laws{{/case}}{{#case 'intellectual_property'}}intellectual property, patents, trademarks, copyrights, trade secrets{{/case}}{{/switch}}{{#unless @last}}, {{/unless}}{{/each}} or other business information disclosed by either party.",
      "precedence": 2,
      "section": "definitions",
      "is_required": true,
      "risk_level": "MEDIUM"
    },
    {
      "clause_code": "confidentiality_obligations",
      "canonical_text": "Each party agrees to:\n(a) hold all Confidential Information in strict confidence and not disclose it to any third party without prior written consent;\n(b) use the same degree of care to protect the Confidential Information as it uses to protect its own confidential information, but in no case less than reasonable care;\n(c) use the Confidential Information solely for the purpose of evaluating potential business opportunities between the parties.",
      "precedence": 3,
      "section": "obligations",
      "is_required": true,
      "risk_level": "HIGH"
    },
    {
      "clause_code": "gdpr_addendum",
      "canonical_text": "Where Confidential Information includes personal data as defined under the General Data Protection Regulation (EU) 2016/679 (\"GDPR\"), the parties acknowledge that they will process such personal data in accordance with applicable data protection laws. Each party warrants that it has lawful basis for any disclosure of personal data and will ensure appropriate technical and organisational measures are in place to protect such data.",
      "precedence": 4,
      "section": "obligations",
      "is_required": false,
      "risk_level": "HIGH",
      "applicability_rule": {
        "==": [{"var": "includes_personal_data"}, true]
      }
    },
    {
      "clause_code": "exceptions",
      "canonical_text": "The obligations of confidentiality shall not apply to information that:\n(a) is or becomes publicly available through no breach of this Agreement;\n(b) was rightfully known by the receiving party prior to disclosure;\n(c) is rightfully received from a third party without breach of any confidentiality obligation;\n(d) is independently developed without use of or reference to the Confidential Information;\n(e) is required to be disclosed by law or court order, provided that the receiving party gives reasonable advance notice to enable the disclosing party to seek protective measures.",
      "precedence": 5,
      "section": "exceptions",
      "is_required": true,
      "risk_level": "MEDIUM"
    },
    {
      "clause_code": "term_and_termination",
      "canonical_text": "This Agreement shall remain in effect for a period of {{confidentiality_period_years}} years from the date first written above, unless terminated earlier by mutual written consent. The obligations of confidentiality shall survive termination of this Agreement and continue for the full confidentiality period.",
      "precedence": 6,
      "section": "termination",
      "is_required": true,
      "risk_level": "MEDIUM"
    },
    {
      "clause_code": "governing_law_clause",
      "canonical_text": "{{#switch governing_law}}{{#case 'england_wales'}}This Agreement shall be governed by and construed in accordance with the laws of England and Wales.{{/case}}{{#case 'delaware'}}This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles.{{/case}}{{#case 'german'}}This Agreement shall be governed by and construed in accordance with the laws of Germany.{{/case}}{{#case 'czech'}}This Agreement shall be governed by and construed in accordance with the laws of the Czech Republic.{{/case}}{{/switch}}",
      "precedence": 7,
      "section": "general",
      "is_required": true,
      "risk_level": "MEDIUM"
    },
    {
      "clause_code": "dispute_resolution_clause",
      "canonical_text": "{{#switch dispute_resolution}}{{#case 'courts'}}Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of {{#switch governing_law}}{{#case 'england_wales'}}England and Wales{{/case}}{{#case 'delaware'}}Delaware{{/case}}{{#case 'german'}}Germany{{/case}}{{#case 'czech'}}the Czech Republic{{/case}}{{/switch}}.{{/case}}{{#case 'arbitration'}}Any disputes arising under this Agreement shall be resolved by binding arbitration in accordance with the rules of {{#switch governing_law}}{{#case 'england_wales'}}the London Court of International Arbitration{{/case}}{{#case 'delaware'}}the American Arbitration Association{{/case}}{{#case 'german'}}the German Arbitration Institute{{/case}}{{#case 'czech'}}the Arbitration Court attached to the Czech Chamber of Commerce{{/case}}{{/switch}}.{{/case}}{{#case 'mediation_then_arbitration'}}Any disputes shall first be subject to mediation, and if unsuccessful, then to binding arbitration as set forth above.{{/case}}{{/switch}}",
      "precedence": 8,
      "section": "general",
      "is_required": true,
      "risk_level": "MEDIUM"
    }
  ]
}
```

### Logic Rules (JSONLogic)
```json
{
  "rules": [
    {
      "rule_code": "show_gdpr_clause",
      "rule_engine": "jsonlogic",
      "rule_definition": {
        "==": [{"var": "includes_personal_data"}, true]
      },
      "description": "Include GDPR compliance clause when personal data is involved",
      "triggered_elements": [
        {
          "element_type": "clause",
          "element_code": "gdpr_addendum",
          "action": "include"
        }
      ]
    },
    {
      "rule_code": "auto_detect_personal_data",
      "rule_engine": "jsonlogic",
      "rule_definition": {
        "in": ["personal_data", {"var": "confidential_info_types"}]
      },
      "description": "Automatically set includes_personal_data if personal_data type selected",
      "triggered_elements": [
        {
          "element_type": "variable",
          "element_code": "includes_personal_data",
          "action": "modify"
        }
      ]
    },
    {
      "rule_code": "jurisdiction_validation",
      "rule_engine": "jsonlogic",
      "rule_definition": {
        "and": [
          {"in": [{"var": "governing_law"}, ["england_wales"]]},
          {"in": [{"var": "jurisdiction"}, ["UK"]]}
        ]
      },
      "description": "Validate governing law matches jurisdiction",
      "triggered_elements": []
    }
  ]
}
```

### Sample Output (English UK)
```markdown
# MUTUAL NON-DISCLOSURE AGREEMENT

This MUTUAL NON-DISCLOSURE AGREEMENT (this "Agreement") is made on 21 September 2025 between Acme Corporation Ltd, a limited company registered under number 12345678 ("First Party") and Beta Solutions Ltd, a limited company registered under number 87654321 ("Second Party").

## 1. DEFINITIONS

For the purposes of this Agreement:

"Confidential Information" means technical data, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, financial information, revenue data, cost structures, pricing strategies, business plans, commercial information, business strategies, market analysis, competitive intelligence or other business information disclosed by either party.

## 2. CONFIDENTIALITY OBLIGATIONS

Each party agrees to:
(a) hold all Confidential Information in strict confidence and not disclose it to any third party without prior written consent;
(b) use the same degree of care to protect the Confidential Information as it uses to protect its own confidential information, but in no case less than reasonable care;
(c) use the Confidential Information solely for the purpose of evaluating potential business opportunities between the parties.

## 3. EXCEPTIONS

The obligations of confidentiality shall not apply to information that:
(a) is or becomes publicly available through no breach of this Agreement;
(b) was rightfully known by the receiving party prior to disclosure;
(c) is rightfully received from a third party without breach of any confidentiality obligation;
(d) is independently developed without use of or reference to the Confidential Information;
(e) is required to be disclosed by law or court order, provided that the receiving party gives reasonable advance notice to enable the disclosing party to seek protective measures.

## 4. TERM AND TERMINATION

This Agreement shall remain in effect for a period of 5 years from the date first written above, unless terminated earlier by mutual written consent. The obligations of confidentiality shall survive termination of this Agreement and continue for the full confidentiality period.

## 5. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of England and Wales.

## 6. DISPUTE RESOLUTION

Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of England and Wales.

## IN WITNESS WHEREOF

The parties have executed this Agreement on the date first written above.

**FIRST PARTY:**                    **SECOND PARTY:**

_________________________          _________________________
Acme Corporation Ltd                Beta Solutions Ltd

By: _____________________          By: _____________________
Name:                              Name:
Title:                             Title:
Date:                              Date:
```

---

## 2. Website Terms of Use - Template Specification

### Metadata
```json
{
  "id": "00000000-0000-0000-0000-000000000008",
  "code": "website-terms-v1",
  "title": "Website Terms of Use",
  "description": "Standard terms and conditions for website usage, covering user obligations, content policies, and liability limitations for business websites.",
  "category": "B2C",
  "jurisdiction_set": ["UK", "US-DE", "EU-BASE"],
  "default_language": "en-UK",
  "supported_languages": ["en-UK", "en-US", "de-DE"],
  "min_risk_level": "LOW",
  "complexity_score": 2,
  "estimated_time_minutes": 10,
  "version": "1.0.0",
  "use_cases": [
    "Business websites and blogs",
    "E-commerce platforms",
    "SaaS application websites",
    "Content and media sites",
    "Community platforms"
  ],
  "tags": ["website", "terms-of-use", "consumer", "online-business"]
}
```

### Variables JSON Schema
```json
{
  "variables": [
    {
      "var_code": "company_name",
      "type": "string",
      "validation": {
        "required": true,
        "min_length": 2,
        "max_length": 100
      },
      "ui_hint": "input",
      "display_name_key": "company_name.label",
      "help_text_key": "company_name.help",
      "group": "business_info",
      "display_order": 1
    },
    {
      "var_code": "website_url",
      "type": "url",
      "validation": {
        "required": true,
        "pattern": "^https?://[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}(/.*)?$"
      },
      "ui_hint": "input",
      "display_name_key": "website_url.label",
      "help_text_key": "website_url.help",
      "placeholder_key": "website_url.placeholder",
      "group": "business_info",
      "display_order": 2
    },
    {
      "var_code": "contact_email",
      "type": "email",
      "validation": {
        "required": true
      },
      "ui_hint": "input",
      "display_name_key": "contact_email.label",
      "help_text_key": "contact_email.help",
      "group": "business_info",
      "display_order": 3
    },
    {
      "var_code": "business_address",
      "type": "address",
      "validation": {
        "required": true
      },
      "ui_hint": "address_input",
      "display_name_key": "business_address.label",
      "help_text_key": "business_address.help",
      "group": "business_info",
      "display_order": 4
    },
    {
      "var_code": "website_type",
      "type": "enum",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "informational", "label_key": "website_type.informational"},
          {"value": "ecommerce", "label_key": "website_type.ecommerce"},
          {"value": "saas", "label_key": "website_type.saas"},
          {"value": "content_media", "label_key": "website_type.content_media"},
          {"value": "community", "label_key": "website_type.community"}
        ]
      },
      "ui_hint": "radio",
      "display_name_key": "website_type.label",
      "help_text_key": "website_type.help",
      "group": "website_features",
      "display_order": 5
    },
    {
      "var_code": "user_accounts",
      "type": "boolean",
      "validation": {
        "required": true
      },
      "ui_hint": "radio",
      "display_name_key": "user_accounts.label",
      "help_text_key": "user_accounts.help",
      "group": "website_features",
      "display_order": 6
    },
    {
      "var_code": "user_content",
      "type": "boolean",
      "validation": {
        "required": true
      },
      "ui_hint": "radio",
      "display_name_key": "user_content.label",
      "help_text_key": "user_content.help",
      "group": "website_features",
      "display_order": 7
    },
    {
      "var_code": "age_restriction",
      "type": "enum",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "none", "label_key": "age_restriction.none"},
          {"value": "13_plus", "label_key": "age_restriction.13_plus"},
          {"value": "16_plus", "label_key": "age_restriction.16_plus"},
          {"value": "18_plus", "label_key": "age_restriction.18_plus"}
        ]
      },
      "ui_hint": "select",
      "display_name_key": "age_restriction.label",
      "help_text_key": "age_restriction.help",
      "default_value": "13_plus",
      "group": "policies",
      "display_order": 8
    },
    {
      "var_code": "governing_law_jurisdiction",
      "type": "governing_law",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "england_wales", "label_key": "governing_law.england_wales"},
          {"value": "delaware", "label_key": "governing_law.delaware"},
          {"value": "german", "label_key": "governing_law.german"}
        ]
      },
      "ui_hint": "governing_law_selector",
      "display_name_key": "governing_law.label",
      "help_text_key": "governing_law.help",
      "group": "legal",
      "display_order": 9,
      "jurisdiction_overrides": {
        "UK": {"default_value": "england_wales"},
        "US-DE": {"default_value": "delaware"},
        "EU-BASE": {"default_value": "german"}
      }
    },
    {
      "var_code": "effective_date",
      "type": "date",
      "validation": {
        "required": true,
        "date_constraints": {
          "min_date": "today",
          "max_date": "+30d"
        }
      },
      "ui_hint": "date_picker",
      "display_name_key": "effective_date.label",
      "help_text_key": "effective_date.help",
      "default_value": "today",
      "group": "legal",
      "display_order": 10
    }
  ]
}
```

---

## 3. Simple Loan Agreement (P2P) - Template Specification

### Metadata
```json
{
  "id": "00000000-0000-0000-0000-000000000009",
  "code": "loan-simple-p2p-v1",
  "title": "Simple Loan Agreement (Personal)",
  "description": "Basic loan agreement between individuals for personal loans, family loans, or small business lending between private parties.",
  "category": "P2P",
  "jurisdiction_set": ["UK", "US-DE"],
  "default_language": "en-UK",
  "supported_languages": ["en-UK", "en-US"],
  "min_risk_level": "MEDIUM",
  "complexity_score": 4,
  "estimated_time_minutes": 12,
  "version": "1.0.0",
  "use_cases": [
    "Family loans and financial assistance",
    "Personal loans between friends",
    "Small business startup funding",
    "Emergency financial assistance",
    "Educational loan assistance"
  ],
  "tags": ["loan", "personal", "money", "repayment", "individuals"]
}
```

### Variables JSON Schema
```json
{
  "variables": [
    {
      "var_code": "lender_name",
      "type": "string",
      "validation": {
        "required": true,
        "min_length": 2,
        "max_length": 100,
        "pattern": "^[A-Za-z\\s\\-']+$"
      },
      "ui_hint": "input",
      "display_name_key": "lender_name.label",
      "help_text_key": "lender_name.help",
      "group": "parties",
      "display_order": 1
    },
    {
      "var_code": "borrower_name",
      "type": "string",
      "validation": {
        "required": true,
        "min_length": 2,
        "max_length": 100,
        "pattern": "^[A-Za-z\\s\\-']+$"
      },
      "ui_hint": "input",
      "display_name_key": "borrower_name.label",
      "help_text_key": "borrower_name.help",
      "group": "parties",
      "display_order": 2
    },
    {
      "var_code": "loan_amount",
      "type": "money",
      "validation": {
        "required": true,
        "minimum": 100,
        "maximum": 50000
      },
      "ui_hint": "money_input",
      "display_name_key": "loan_amount.label",
      "help_text_key": "loan_amount.help",
      "group": "loan_terms",
      "display_order": 3,
      "jurisdiction_overrides": {
        "UK": {"validation": {"maximum": 25000}},
        "US-DE": {"validation": {"maximum": 50000}}
      }
    },
    {
      "var_code": "interest_rate",
      "type": "percentage",
      "validation": {
        "required": true,
        "minimum": 0,
        "maximum": 15
      },
      "ui_hint": "percentage_input",
      "display_name_key": "interest_rate.label",
      "help_text_key": "interest_rate.help",
      "default_value": 5.0,
      "group": "loan_terms",
      "display_order": 4
    },
    {
      "var_code": "loan_term_months",
      "type": "integer",
      "validation": {
        "required": true,
        "minimum": 1,
        "maximum": 60
      },
      "ui_hint": "select",
      "display_name_key": "loan_term.label",
      "help_text_key": "loan_term.help",
      "group": "loan_terms",
      "display_order": 5
    },
    {
      "var_code": "repayment_frequency",
      "type": "enum",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "monthly", "label_key": "repayment_frequency.monthly"},
          {"value": "quarterly", "label_key": "repayment_frequency.quarterly"},
          {"value": "lump_sum", "label_key": "repayment_frequency.lump_sum"}
        ]
      },
      "ui_hint": "radio",
      "display_name_key": "repayment_frequency.label",
      "help_text_key": "repayment_frequency.help",
      "default_value": "monthly",
      "group": "loan_terms",
      "display_order": 6
    },
    {
      "var_code": "loan_purpose",
      "type": "enum",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "personal", "label_key": "loan_purpose.personal"},
          {"value": "education", "label_key": "loan_purpose.education"},
          {"value": "business", "label_key": "loan_purpose.business"},
          {"value": "home_improvement", "label_key": "loan_purpose.home_improvement"},
          {"value": "emergency", "label_key": "loan_purpose.emergency"},
          {"value": "other", "label_key": "loan_purpose.other"}
        ]
      },
      "ui_hint": "select",
      "display_name_key": "loan_purpose.label",
      "help_text_key": "loan_purpose.help",
      "group": "loan_terms",
      "display_order": 7
    },
    {
      "var_code": "default_penalty_rate",
      "type": "percentage",
      "validation": {
        "required": true,
        "minimum": 0,
        "maximum": 25
      },
      "ui_hint": "percentage_input",
      "display_name_key": "default_penalty_rate.label",
      "help_text_key": "default_penalty_rate.help",
      "default_value": 2.0,
      "group": "default_terms",
      "display_order": 8
    },
    {
      "var_code": "governing_law_jurisdiction",
      "type": "governing_law",
      "validation": {
        "required": true,
        "enum_values": [
          {"value": "england_wales", "label_key": "governing_law.england_wales"},
          {"value": "delaware", "label_key": "governing_law.delaware"}
        ]
      },
      "ui_hint": "governing_law_selector",
      "display_name_key": "governing_law.label",
      "help_text_key": "governing_law.help",
      "group": "legal",
      "display_order": 9
    }
  ]
}
```

---

## Translation Keys (i18n) Sample

### English (UK) - en-UK
```json
{
  "first_party_name.label": "First Party Company Name",
  "first_party_name.help": "Enter the full legal name of your organisation as it appears on official documents",
  "entity_type.limited_company": "Limited Company",
  "entity_type.llc": "Limited Liability Company (LLC)",
  "entity_type.corporation": "Corporation",
  "governing_law.england_wales": "England and Wales",
  "governing_law.delaware": "Delaware, United States",
  "governing_law.german": "Germany",
  "governing_law.czech": "Czech Republic",
  "confidentiality_period.label": "Confidentiality Period",
  "confidentiality_period.help": "How long should confidential information remain protected? Typical periods are 3-5 years.",
  "info_types.technical": "Technical information (designs, specifications, know-how)",
  "info_types.financial": "Financial information (revenue, costs, pricing)",
  "info_types.commercial": "Commercial information (business plans, strategies)",
  "info_types.customer_data": "Customer data and lists",
  "info_types.personal_data": "Personal data (triggers GDPR compliance)",
  "info_types.intellectual_property": "Intellectual property and trade secrets"
}
```

### German - de-DE
```json
{
  "first_party_name.label": "Name der ersten Partei",
  "first_party_name.help": "Geben Sie den vollständigen rechtlichen Namen Ihrer Organisation ein, wie er in offiziellen Dokumenten erscheint",
  "entity_type.limited_company": "Gesellschaft mit beschränkter Haftung (GmbH)",
  "entity_type.corporation": "Aktiengesellschaft (AG)",
  "governing_law.german": "Deutschland",
  "governing_law.england_wales": "England und Wales",
  "confidentiality_period.label": "Vertraulichkeitsdauer",
  "confidentiality_period.help": "Wie lange sollen vertrauliche Informationen geschützt bleiben? Typische Zeiträume sind 3-5 Jahre.",
  "info_types.technical": "Technische Informationen (Designs, Spezifikationen, Know-how)",
  "info_types.financial": "Finanzinformationen (Umsatz, Kosten, Preisgestaltung)",
  "info_types.commercial": "Geschäftsinformationen (Geschäftspläne, Strategien)",
  "info_types.personal_data": "Personenbezogene Daten (löst DSGVO-Compliance aus)"
}
```

### Czech - cs-CZ
```json
{
  "first_party_name.label": "Název první strany",
  "first_party_name.help": "Zadejte úplný právní název vaší organizace, jak se objevuje v oficiálních dokumentech",
  "entity_type.limited_company": "Společnost s ručením omezeným (s.r.o.)",
  "entity_type.corporation": "Akciová společnost (a.s.)",
  "governing_law.czech": "Česká republika",
  "governing_law.german": "Německo",
  "confidentiality_period.label": "Doba důvěrnosti",
  "confidentiality_period.help": "Jak dlouho mají zůstat důvěrné informace chráněné? Typická období jsou 3-5 let.",
  "info_types.technical": "Technické informace (návrhy, specifikace, know-how)",
  "info_types.financial": "Finanční informace (příjmy, náklady, cenová politika)",
  "info_types.personal_data": "Osobní údaje (spouští compliance s GDPR)"
}
```

---

## Logic Engine Examples

### JSONLogic Rule for GDPR Compliance
```json
{
  "rule_code": "gdpr_requirements",
  "rule_engine": "jsonlogic",
  "rule_definition": {
    "and": [
      {"==": [{"var": "includes_personal_data"}, true]},
      {"in": [{"var": "jurisdiction"}, ["UK", "EU-BASE", "DE", "FR", "CZ"]]}
    ]
  },
  "description": "Trigger GDPR compliance requirements for EU jurisdictions handling personal data",
  "triggered_elements": [
    {"element_type": "clause", "element_code": "gdpr_addendum", "action": "include"},
    {"element_type": "clause", "element_code": "data_subject_rights", "action": "include"},
    {"element_type": "variable", "element_code": "data_retention_period", "action": "require"}
  ]
}
```

### Jinja2 Template Logic for Address Formatting
```jinja2
{% if jurisdiction == "UK" %}
{{business_address.line1}}
{% if business_address.line2 %}{{business_address.line2}}{% endif %}
{{business_address.city}}, {{business_address.postcode}}
{{business_address.country}}
{% elif jurisdiction == "US-DE" %}
{{business_address.line1}}
{% if business_address.line2 %}{{business_address.line2}}{% endif %}
{{business_address.city}}, {{business_address.state}} {{business_address.zip}}
{{business_address.country}}
{% endif %}
```

### Jurisdiction-Specific Clause Variations
```json
{
  "clause_code": "liability_limitation",
  "jurisdiction_variations": {
    "UK": {
      "text_override": "Nothing in this Agreement shall exclude or limit liability for death or personal injury caused by negligence, fraud, or fraudulent misrepresentation, or any other liability that cannot be excluded or limited under applicable law.",
      "risk_level_override": "MEDIUM"
    },
    "US-DE": {
      "text_override": "IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, INCURRED BY EITHER PARTY OR ANY THIRD PARTY.",
      "risk_level_override": "HIGH"
    },
    "EU-BASE": {
      "additional_clauses": [
        "This limitation of liability is subject to applicable consumer protection laws.",
        "Where the recipient is a consumer, this clause does not affect their statutory rights."
      ]
    }
  }
}
```

This comprehensive seed template specification provides the foundation for LegalMind's template system, with detailed JSON schemas, multi-language support, conditional logic, and jurisdiction-specific variations that demonstrate the platform's capability to handle complex legal document automation requirements.