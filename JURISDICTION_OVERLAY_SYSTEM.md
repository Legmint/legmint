# Jurisdiction Overlay System — Technical Design
## Multi-Jurisdiction Template Architecture for LegalMind MVP

**Document Version:** 1.0
**Last Updated:** 2025-10-20
**Status:** Ready for Implementation
**Implementation Window:** Week 3-4 of 90-Day Launch Plan

---

## Executive Summary

This document provides a **complete technical specification** for LegalMind's jurisdiction overlay system — the core architecture that enables a single template to generate legally-compliant documents across 20 jurisdictions.

**Problem Statement:**
- Legal documents have jurisdiction-specific requirements (e.g., UK Companies Act 2006 vs. US Delaware DGCL)
- Maintaining 20 separate versions of 50 templates = 1,000 documents (unmaintainable)
- Need a system that allows: **1 base template + 20 jurisdiction overlays = 20 localized documents**

**Solution:**
A **layered inheritance model** where:
1. **Base Template** (universal clauses, structure)
2. **Jurisdiction Overlay** (legal requirements, local citations)
3. **Language Translation** (localized text)

**Benefits:**
- ✅ **90% code reuse** across jurisdictions (maintain base template once)
- ✅ **Legal compliance** (local lawyers validate overlays, not entire template)
- ✅ **Fast expansion** (add new jurisdiction = add overlay, not rebuild template)
- ✅ **Consistent UX** (same questionnaire across jurisdictions)

---

## Architecture Overview

### Layered Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Generated Document                        │
│  (e.g., Founders' Agreement - Germany - German language)    │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │  Rendering Engine           │
         │  (Jinja2 + JSONLogic)       │
         └─────────────┬───────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌────────┐      ┌────────────┐     ┌──────────┐
│ Layer 1│      │  Layer 2   │     │ Layer 3  │
│  Base  │  +   │Jurisdiction│  +  │Translation│
│Template│      │  Overlay   │     │   (i18n) │
└────────┘      └────────────┘     └──────────┘
    │                 │                  │
    │                 │                  │
    ▼                 ▼                  ▼
Universal         UK/US/DE/FR       en-UK, en-US
Clauses          Specific Rules     de-DE, fr-FR
Structure        Legal Citations    es-ES, etc.
Variables        Jurisd. Logic
```

### Data Flow

```mermaid
graph TD
    A[User Selects Template] --> B[User Selects Jurisdiction]
    B --> C[Load Base Template]
    C --> D[Load Jurisdiction Overlay]
    D --> E[Merge Base + Overlay]
    E --> F[User Completes Questionnaire]
    F --> G[Apply JSONLogic Rules]
    G --> H[Load Language Translation]
    H --> I[Render Document]
    I --> J[Generate DOCX/PDF]
```

---

## Layer 1: Base Template

The **base template** contains:
- Universal clauses applicable across all jurisdictions
- Document structure (sections, numbering)
- Variable definitions
- Conditional logic (JSONLogic) for universal rules

### Example: Founders' Agreement Base Template

```typescript
// database: templates table
{
  id: 'uuid-1',
  code: 'founders-agreement-v1',
  title: 'Founders\' Agreement',
  category: 'Founding',
  base_template: true, // This is the base, not a jurisdiction-specific version
  jurisdiction_set: ['UK', 'US-DE', 'DE', 'FR', 'ES'], // Supported jurisdictions
  template_content: {
    sections: [
      {
        id: 'recitals',
        title: 'Recitals',
        order: 1,
        clauses: [
          {
            id: 'recital_1',
            text: 'The Founders wish to enter into this agreement to govern their relationship and set forth their respective rights, obligations, and equity ownership in the Company.',
            universal: true // Applies to all jurisdictions
          }
        ]
      },
      {
        id: 'definitions',
        title: 'Definitions',
        order: 2,
        clauses: [
          {
            id: 'def_company',
            text: '"Company" means {{ company_name }}, a company incorporated under the laws of {{ jurisdiction }}.',
            universal: true
          },
          {
            id: 'def_equity',
            text: '"Equity" means {{ equity_type }}.', // equity_type varies by jurisdiction
            universal: false, // Will be overridden by jurisdiction overlay
            jurisdictionDependent: true
          }
        ]
      },
      {
        id: 'equity_allocation',
        title: 'Equity Allocation',
        order: 3,
        clauses: [
          {
            id: 'equity_split',
            text: 'The Founders\' equity shall be allocated as follows:\n{% for founder in founders %}\n- {{ founder.name }}: {{ founder.equity_percentage }}% {{ equity_type }}\n{% endfor %}',
            universal: true
          },
          {
            id: 'vesting_schedule',
            text: 'All Founder {{ equity_type }} shall be subject to vesting over a {{ vesting_period }}-year period with a {{ cliff_period }}-year cliff.',
            universal: true,
            conditionalDisplay: {
              '==': [{'var': 'vesting_enabled'}, true]
            }
          }
        ]
      },
      {
        id: 'governance',
        title: 'Governance',
        order: 4,
        clauses: [
          {
            id: 'board_composition',
            text: 'The Company shall be managed by a Board of {{ board_type }}.', // "Directors" (UK/US) vs. "Geschäftsführer" (DE)
            universal: false,
            jurisdictionDependent: true
          },
          {
            id: 'unanimous_decisions',
            text: 'The following decisions require unanimous Founder consent: {{ unanimous_matters }}.',
            universal: true
          }
        ]
      },
      {
        id: 'ip_assignment',
        title: 'Intellectual Property',
        order: 5,
        clauses: [
          {
            id: 'ip_assignment_clause',
            text: 'Each Founder hereby assigns to the Company all right, title, and interest in any and all intellectual property created in connection with the Company\'s business.',
            universal: true
          }
        ]
      },
      {
        id: 'termination',
        title: 'Termination and Exit',
        order: 6,
        clauses: [
          {
            id: 'good_leaver_bad_leaver',
            text: 'Upon termination of a Founder\'s involvement, their unvested {{ equity_type }} shall be forfeited. Treatment of vested {{ equity_type }} depends on whether the Founder is a Good Leaver or Bad Leaver as defined in Schedule A.',
            universal: true
          }
        ]
      },
      {
        id: 'governing_law',
        title: 'Governing Law',
        order: 7,
        clauses: [
          {
            id: 'governing_law_clause',
            text: 'This Agreement shall be governed by and construed in accordance with the laws of {{ governing_law_jurisdiction }}.', // Will be filled by jurisdiction overlay
            universal: false,
            jurisdictionDependent: true
          }
        ]
      }
    ],
    variables: [
      { id: 'company_name', type: 'text', label: 'Company Name', required: true },
      { id: 'jurisdiction', type: 'select', label: 'Jurisdiction', options: ['UK', 'US-DE', 'DE', 'FR', 'ES'], required: true },
      { id: 'founders', type: 'array', label: 'Founders', minItems: 2, maxItems: 5 },
      { id: 'vesting_enabled', type: 'boolean', label: 'Enable Vesting?', default: true },
      { id: 'vesting_period', type: 'number', label: 'Vesting Period (years)', default: 4, conditionalDisplay: {'==': [{'var': 'vesting_enabled'}, true]} },
      { id: 'cliff_period', type: 'number', label: 'Cliff Period (years)', default: 1, conditionalDisplay: {'==': [{'var': 'vesting_enabled'}, true]} },
      { id: 'unanimous_matters', type: 'multiselect', label: 'Unanimous Consent Matters', options: ['Sale of company', 'Equity issuance', 'Debt > £100K', 'Change of business'] }
    ]
  }
}
```

**Key Principles:**
- Clauses marked `universal: true` appear in all jurisdictions
- Clauses marked `jurisdictionDependent: true` will be overridden/extended by overlays
- Variables defined at base level (questionnaire is same across jurisdictions)
- Conditional logic applies universally unless overridden

---

## Layer 2: Jurisdiction Overlay

The **jurisdiction overlay** contains:
- Legal citations specific to the jurisdiction (e.g., "Companies Act 2006 Section 33")
- Jurisdiction-specific clauses (e.g., UK "Shares" vs. German "Geschäftsanteile")
- Overrides for base template clauses
- Additional required clauses not in base template

### Database Schema for Overlays

```sql
-- New table: template_jurisdiction_overlays
CREATE TABLE template_jurisdiction_overlays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  jurisdiction_code VARCHAR(10) NOT NULL, -- 'UK', 'US-DE', 'DE', 'FR', 'ES', etc.
  version VARCHAR(20) NOT NULL DEFAULT '1.0',

  -- Overlay content (JSONB)
  overlay_content JSONB NOT NULL,

  -- Legal validation
  validated_by UUID REFERENCES lawyers(id), -- Lawyer who validated this overlay
  validation_date TIMESTAMPTZ,
  legal_citations TEXT[], -- Array of legal references (e.g., ["Companies Act 2006 s.33", "DGCL § 141(a)"])

  -- Metadata
  notes TEXT, -- Internal notes from lawyer reviewer
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_until DATE, -- NULL = current version
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(template_id, jurisdiction_code, version)
);

CREATE INDEX idx_overlays_template_jurisdiction ON template_jurisdiction_overlays(template_id, jurisdiction_code);
CREATE INDEX idx_overlays_effective ON template_jurisdiction_overlays(effective_from, effective_until);
```

### Example: UK Overlay for Founders' Agreement

```typescript
// template_jurisdiction_overlays table
{
  id: 'uuid-overlay-uk-1',
  template_id: 'uuid-1', // Founders' Agreement base template
  jurisdiction_code: 'UK',
  version: '1.0',
  overlay_content: {
    // Override jurisdiction-dependent variables
    variable_overrides: {
      equity_type: {
        default: 'Ordinary Shares',
        options: ['Ordinary Shares', 'Alphabet Shares', 'Preference Shares'],
        helpText: 'UK companies typically issue Ordinary Shares to founders. Alphabet Shares (Class A, B, C) allow different voting/dividend rights.'
      },
      board_type: {
        default: 'Directors',
        locked: true // Cannot be changed in UK
      },
      governing_law_jurisdiction: {
        default: 'England and Wales',
        options: ['England and Wales', 'Scotland', 'Northern Ireland']
      }
    },

    // Override/extend clauses
    clause_overrides: {
      'def_equity': {
        text: '"Equity" means Ordinary Shares with a nominal value of £{{ nominal_value }} each, issued in accordance with the Company\'s Articles of Association and the Companies Act 2006.',
        legal_citation: 'Companies Act 2006, Section 542 (Nominal value of shares)'
      },
      'board_composition': {
        text: 'The Company shall be managed by a Board of Directors in accordance with the Articles of Association and the Companies Act 2006. The Board shall consist of {{ board_size }} Directors, with each Founder entitled to appoint {{ founder_director_seats }} Director(s).',
        legal_citation: 'Companies Act 2006, Section 154 (Companies required to have directors)'
      },
      'governing_law_clause': {
        text: 'This Agreement shall be governed by and construed in accordance with the laws of England and Wales. The parties irrevocably submit to the exclusive jurisdiction of the courts of England and Wales.',
        legal_citation: 'Standard governing law clause for English contracts'
      }
    },

    // Add new clauses specific to UK
    additional_clauses: [
      {
        section_id: 'equity_allocation', // Insert into this section
        clause_id: 'uk_share_certificates',
        order: 3.5, // Insert after equity_split, before vesting_schedule
        text: 'Share certificates shall be issued in accordance with the Companies Act 2006, Section 769.',
        legal_citation: 'Companies Act 2006, Section 769 (Duty of company as to issue of certificates)',
        required: true
      },
      {
        section_id: 'governance',
        clause_id: 'uk_articles_reference',
        order: 4.1,
        text: 'The governance of the Company shall be subject to the provisions of the Company\'s Articles of Association, as amended from time to time, and the Companies Act 2006.',
        legal_citation: 'Companies Act 2006, Section 33 (Effect of company\'s constitution)',
        required: true
      },
      {
        section_id: 'termination',
        clause_id: 'uk_bad_leaver_definition',
        order: 6.5,
        text: 'A "Bad Leaver" includes termination for cause, breach of fiduciary duties under the Companies Act 2006, or voluntary resignation without Board approval.',
        legal_citation: 'Companies Act 2006, Sections 170-177 (General duties of directors)',
        required: true
      }
    ],

    // Additional variables required for UK only
    additional_variables: [
      {
        id: 'nominal_value',
        type: 'number',
        label: 'Nominal Value per Share (£)',
        default: 0.01,
        helpText: 'Typical nominal value is £0.01 or £1. This is different from actual share value.',
        validation: { min: 0.0001, max: 100 }
      },
      {
        id: 'share_class',
        type: 'select',
        label: 'Share Class',
        options: ['Ordinary', 'Alphabet (Class A)', 'Alphabet (Class B)'],
        default: 'Ordinary',
        helpText: 'Alphabet shares allow different voting rights per founder. Requires specific Articles of Association.'
      }
    ],

    // Conditional logic specific to UK
    conditional_logic: [
      {
        // If Alphabet shares selected, require lawyer review
        rule: {
          'if': [
            {'!=': [{'var': 'share_class'}, 'Ordinary']},
            {'set': {'require_lawyer_review': true}},
            {'set': {'require_lawyer_review': false}}
          ]
        },
        message: 'Alphabet shares require bespoke Articles of Association. We recommend lawyer review.'
      },
      {
        // Warn if nominal value is unusual
        rule: {
          'if': [
            {
              'and': [
                {'<': [{'var': 'nominal_value'}, 0.01]},
                {'>': [{'var': 'nominal_value'}, 1]}
              ]
            },
            {'warn': 'Nominal value is typically £0.01 or £1. Confirm this is correct.'}
          ]
        }
      }
    ]
  },
  legal_citations: [
    'Companies Act 2006, Section 33 (Effect of company\'s constitution)',
    'Companies Act 2006, Section 154 (Companies required to have directors)',
    'Companies Act 2006, Section 542 (Nominal value of shares)',
    'Companies Act 2006, Section 769 (Duty of company as to issue of certificates)',
    'Companies Act 2006, Sections 170-177 (General duties of directors)'
  ],
  validated_by: 'uuid-lawyer-uk-1',
  validation_date: '2025-10-15',
  notes: 'Validated by Sarah Thompson, Solicitor (England & Wales). Nominal value and Alphabet shares logic added per reviewer feedback.',
  effective_from: '2025-10-15'
}
```

### Example: Germany Overlay for Founders' Agreement

```typescript
{
  id: 'uuid-overlay-de-1',
  template_id: 'uuid-1',
  jurisdiction_code: 'DE',
  version: '1.0',
  overlay_content: {
    variable_overrides: {
      equity_type: {
        default: 'Geschäftsanteile', // Not "Shares" in Germany (GmbH has "business shares")
        locked: true,
        helpText: 'In Deutschland haben GmbH-Gesellschafter Geschäftsanteile, keine Aktien. Eine Aktiengesellschaft (AG) ist für Startups unüblich.'
      },
      board_type: {
        default: 'Geschäftsführer', // "Managing Director", not "Board of Directors"
        locked: true
      },
      governing_law_jurisdiction: {
        default: 'Germany',
        locked: true
      }
    },

    clause_overrides: {
      'def_equity': {
        text: '"Geschäftsanteile" bedeutet die Gesellschaftsanteile an der {{ company_name }} GmbH gemäß § 14 GmbHG, mit einem Stammkapital von insgesamt {{ share_capital }} €, aufgeteilt wie folgt:\n{% for founder in founders %}\n- {{ founder.name }}: {{ founder.equity_percentage }}% ({{ founder.equity_percentage * share_capital / 100 }} €)\n{% endfor %}',
        legal_citation: 'GmbHG § 14 (Geschäftsanteil; Geschäftsanteile mehrerer Personen)'
      },
      'board_composition': {
        text: 'Die Gesellschaft wird durch {{ managing_directors_count }} Geschäftsführer vertreten, die gemäß § 35 GmbHG bestellt werden. Jeder Gründer hat das Recht, {{ founder_managing_director_seats }} Geschäftsführer zu ernennen.',
        legal_citation: 'GmbHG § 35 (Bestellung und Abberufung der Geschäftsführer)'
      },
      'governing_law_clause': {
        text: 'Dieser Vertrag unterliegt deutschem Recht. Ausschließlicher Gerichtsstand ist {{ court_location }}.',
        legal_citation: 'Standard governing law clause for German contracts'
      },
      'vesting_schedule': {
        text: 'Die Geschäftsanteile der Gründer unterliegen einem Vesting-Plan über {{ vesting_period }} Jahre mit einer Cliff-Periode von {{ cliff_period }} Jahr(en). Unvested Anteile werden durch eine separate Treuhandvereinbarung geregelt, da deutsches Recht kein automatisches Vesting vorsieht.',
        legal_citation: 'German vesting is typically implemented via trust agreement (Treuhandvertrag) as GmbH shares cannot be "unvested" under GmbHG',
        helpText: 'Im deutschen Recht gibt es kein gesetzliches Vesting. Dies wird durch einen Treuhandvertrag umgesetzt, bei dem ein Treuhänder die Anteile hält, bis sie "vesten".'
      }
    },

    additional_clauses: [
      {
        section_id: 'equity_allocation',
        clause_id: 'de_share_capital',
        order: 3.1,
        text: 'Das Stammkapital der Gesellschaft beträgt {{ share_capital }} € und ist wie folgt aufgeteilt (§ 5 Abs. 2 GmbHG):\n{% for founder in founders %}\n- {{ founder.name }}: {{ founder.equity_percentage * share_capital / 100 }} € ({{ founder.equity_percentage }}%)\n{% endfor %}',
        legal_citation: 'GmbHG § 5 Abs. 2 (Mindestinhalt des Gesellschaftsvertrags: Stammkapital)',
        required: true
      },
      {
        section_id: 'equity_allocation',
        clause_id: 'de_notarization_requirement',
        order: 3.2,
        text: 'Die Übertragung von Geschäftsanteilen bedarf gemäß § 15 Abs. 3 GmbHG der notariellen Beurkundung.',
        legal_citation: 'GmbHG § 15 Abs. 3 (Form der Anteilsübertragung)',
        required: true
      },
      {
        section_id: 'governance',
        clause_id: 'de_shareholder_meeting',
        order: 4.2,
        text: 'Beschlüsse der Gesellschafterversammlung werden gemäß § 47 GmbHG mit einfacher Mehrheit gefasst, sofern nicht der Gesellschaftsvertrag oder das GmbHG eine höhere Mehrheit vorsehen.',
        legal_citation: 'GmbHG § 47 (Beschlussfassung der Gesellschafter)',
        required: true
      },
      {
        section_id: 'termination',
        clause_id: 'de_bad_leaver_vesting_trust',
        order: 6.6,
        text: 'Die Rückabwicklung unvested Geschäftsanteile erfolgt durch den Treuhänder gemäß der separaten Treuhandvereinbarung. Ein "Bad Leaver" verliert alle unvested Anteile ohne Entschädigung.',
        legal_citation: 'Trust agreement (Treuhandvertrag) required for German vesting implementation',
        required: true
      }
    ],

    additional_variables: [
      {
        id: 'share_capital',
        type: 'number',
        label: 'Stammkapital (€)',
        default: 25000,
        helpText: 'Mindeststammkapital für eine GmbH: €25.000 (§ 5 Abs. 1 GmbHG). Bei Gründung müssen mindestens €12.500 eingezahlt werden.',
        validation: { min: 25000 },
        legal_citation: 'GmbHG § 5 Abs. 1 (Stammkapital)'
      },
      {
        id: 'managing_directors_count',
        type: 'number',
        label: 'Anzahl Geschäftsführer',
        default: 2,
        validation: { min: 1 }
      },
      {
        id: 'court_location',
        type: 'text',
        label: 'Gerichtsstand',
        default: 'Berlin',
        helpText: 'Typischerweise der Sitz der Gesellschaft.'
      },
      {
        id: 'notary_required',
        type: 'boolean',
        label: 'Notarielle Beurkundung erforderlich?',
        default: true,
        locked: true, // Always required for GmbH founder agreements
        helpText: 'Gesellschaftsverträge und Anteilsübertragungen müssen in Deutschland notariell beurkundet werden (§ 2 GmbHG, § 15 Abs. 3 GmbHG).'
      }
    ],

    conditional_logic: [
      {
        // Warn if share capital < 25000
        rule: {
          'if': [
            {'<': [{'var': 'share_capital'}, 25000]},
            {'error': 'Mindeststammkapital für eine GmbH ist €25.000 (§ 5 Abs. 1 GmbHG). Für Stammkapital < €25.000 kann eine UG (haftungsbeschränkt) gegründet werden.'}
          ]
        }
      },
      {
        // Always require notarization notice
        rule: {
          'set': {'require_notary_notice': true},
          'message': 'WICHTIG: Dieser Vertrag muss notariell beurkundet werden (§ 2 GmbHG). Drucken Sie das Dokument aus und vereinbaren Sie einen Notartermin.'
        }
      }
    ]
  },
  legal_citations: [
    'GmbHG § 2 (Form des Gesellschaftsvertrags)',
    'GmbHG § 5 (Mindestinhalt des Gesellschaftsvertrags)',
    'GmbHG § 14 (Geschäftsanteil)',
    'GmbHG § 15 Abs. 3 (Form der Anteilsübertragung)',
    'GmbHG § 35 (Bestellung und Abberufung der Geschäftsführer)',
    'GmbHG § 47 (Beschlussfassung der Gesellschafter)'
  ],
  validated_by: 'uuid-lawyer-de-1',
  validation_date: '2025-10-16',
  notes: 'Validated by Klaus Müller, Rechtsanwalt (Fachanwalt für Gesellschaftsrecht). Added trust agreement requirement for vesting implementation and notarization warnings.',
  effective_from: '2025-10-16'
}
```

**Key Differences UK vs. Germany:**

| Concept | UK | Germany |
|---------|-----|---------|
| **Equity Type** | Shares (Ordinary, Preference, Alphabet) | Geschäftsanteile (business shares, not stock) |
| **Legal Entity** | Ltd (Private Limited Company) | GmbH (Gesellschaft mit beschränkter Haftung) |
| **Management** | Board of Directors | Geschäftsführer (Managing Directors) |
| **Minimum Capital** | £1 (effectively none) | €25,000 (€12,500 paid-up at incorporation) |
| **Vesting** | Can be implemented via Articles + Shareholders' Agreement | Requires separate Trust Agreement (Treuhandvertrag) |
| **Notarization** | Not required for Founders' Agreement | Required by law (§ 2 GmbHG) |
| **Legal Citations** | Companies Act 2006 | GmbHG (GmbH-Gesetz) |

---

## Layer 3: Language Translation

The **translation layer** handles:
- UI text (labels, help text, warnings)
- Legal boilerplate text
- Variable names (displayed to user)

### Translation Memory (TMX) Architecture

```sql
-- New table: template_translations
CREATE TABLE template_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id) ON DELETE CASCADE,
  jurisdiction_code VARCHAR(10), -- NULL = applies to all jurisdictions
  language_code VARCHAR(10) NOT NULL, -- 'en-UK', 'en-US', 'de-DE', 'fr-FR', 'es-ES', etc.

  -- Translation content (JSONB)
  translations JSONB NOT NULL,

  -- Translation metadata
  translated_by VARCHAR(255), -- Translator name/agency
  translation_date DATE,
  translation_status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'reviewed', 'approved'

  -- Quality
  native_speaker_reviewed BOOLEAN DEFAULT FALSE,
  lawyer_reviewed BOOLEAN DEFAULT FALSE, -- Legal accuracy validation

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(template_id, jurisdiction_code, language_code)
);

CREATE INDEX idx_translations_template_lang ON template_translations(template_id, language_code);
```

### Example: German Translation for Founders' Agreement

```typescript
{
  id: 'uuid-translation-de-1',
  template_id: 'uuid-1', // Founders' Agreement
  jurisdiction_code: 'DE', // Germany-specific translation
  language_code: 'de-DE',
  translations: {
    // Template title and description
    meta: {
      title: 'Gesellschaftervereinbarung für Gründer',
      description: 'Umfassende Vereinbarung zur Regelung der Gründerbeziehungen, Geschäftsanteile, Vesting, Rollen, IP-Zuweisung und Ausstiegsszenarien für Startups.'
    },

    // Section titles
    sections: {
      'recitals': 'Präambel',
      'definitions': 'Definitionen',
      'equity_allocation': 'Verteilung der Geschäftsanteile',
      'governance': 'Unternehmensführung',
      'ip_assignment': 'Geistiges Eigentum',
      'termination': 'Beendigung und Ausstieg',
      'governing_law': 'Anwendbares Recht'
    },

    // Variable labels and help text
    variables: {
      'company_name': {
        label: 'Name der Gesellschaft',
        helpText: 'Vollständiger Name der GmbH (z.B. "Startup GmbH")',
        placeholder: 'z.B. Startup GmbH'
      },
      'jurisdiction': {
        label: 'Rechtsordnung',
        helpText: 'Das Land, dessen Gesetze für diesen Vertrag gelten'
      },
      'founders': {
        label: 'Gründer',
        helpText: 'Liste aller Gründer mit Namen, E-Mail und prozentualer Beteiligung'
      },
      'vesting_enabled': {
        label: 'Vesting aktivieren?',
        helpText: 'Vesting bedeutet, dass Geschäftsanteile über einen Zeitraum "verdient" werden. Verhindert, dass ein Gründer, der früh ausscheidet, voll beteiligt bleibt.'
      },
      'vesting_period': {
        label: 'Vesting-Zeitraum (Jahre)',
        helpText: 'Typischerweise 4 Jahre für Startups'
      },
      'cliff_period': {
        label: 'Cliff-Periode (Jahre)',
        helpText: 'Mindestdauer, bevor Anteile zu vesten beginnen. Typischerweise 1 Jahr.'
      },
      'share_capital': {
        label: 'Stammkapital (€)',
        helpText: 'Mindeststammkapital für eine GmbH: €25.000 (§ 5 Abs. 1 GmbHG)'
      }
    },

    // Clause text translations (only if different from jurisdiction overlay)
    clauses: {
      'recital_1': 'Die Gründer beabsichtigen, diese Vereinbarung abzuschließen, um ihre Beziehung zu regeln und ihre jeweiligen Rechte, Pflichten und Beteiligungen an der Gesellschaft festzulegen.',
      'ip_assignment_clause': 'Jeder Gründer überträgt hiermit der Gesellschaft alle Rechte, Titel und Interessen an sämtlichen geistigen Eigentum, das im Zusammenhang mit dem Geschäft der Gesellschaft geschaffen wurde.'
    },

    // Warnings and notifications
    warnings: {
      'require_notary_notice': '⚠️ WICHTIG: Dieser Vertrag muss notariell beurkundet werden (§ 2 GmbHG). Bitte vereinbaren Sie einen Notartermin.',
      'require_lawyer_review': 'Wir empfehlen, diesen Vertrag von einem auf Gesellschaftsrecht spezialisierten Rechtsanwalt überprüfen zu lassen.',
      'alphabet_shares_warning': 'Alphabet-Anteile (Klasse A, B, C) erfordern eine maßgeschneiderte Satzung. Wir empfehlen eine anwaltliche Prüfung.'
    },

    // Button labels and UI text
    ui: {
      'generate_button': 'Dokument generieren',
      'preview_button': 'Vorschau',
      'download_docx': 'DOCX herunterladen',
      'download_pdf': 'PDF herunterladen',
      'save_draft': 'Entwurf speichern',
      'find_lawyer': 'Rechtsanwalt finden',
      'progress_step': 'Schritt {{ current }} von {{ total }}',
      'form_validation_error': 'Bitte füllen Sie alle erforderlichen Felder aus.',
      'generation_success': 'Ihr Dokument wurde erfolgreich erstellt!',
      'generation_error': 'Fehler beim Generieren des Dokuments. Bitte versuchen Sie es erneut.'
    }
  },
  translated_by: 'ProTranslate GmbH',
  translation_date: '2025-10-17',
  translation_status: 'approved',
  native_speaker_reviewed: true,
  lawyer_reviewed: true // Reviewed by Klaus Müller, Rechtsanwalt
}
```

---

## Rendering Engine: Merging Layers

### Algorithm for Document Generation

When a user requests to generate a document:

```typescript
async function generateDocument(
  templateId: string,
  jurisdiction: string,
  language: string,
  userAnswers: Record<string, any>
): Promise<Document> {

  // Step 1: Load base template
  const baseTemplate = await db.templates.findOne({ id: templateId });

  // Step 2: Load jurisdiction overlay
  const jurisdictionOverlay = await db.template_jurisdiction_overlays.findOne({
    template_id: templateId,
    jurisdiction_code: jurisdiction,
    effective_until: null // Current version
  });

  // Step 3: Merge base + overlay
  const mergedTemplate = mergeTemplateWithOverlay(baseTemplate, jurisdictionOverlay);

  // Step 4: Load language translation
  const translation = await db.template_translations.findOne({
    template_id: templateId,
    jurisdiction_code: jurisdiction, // Jurisdiction-specific translation
    language_code: language
  });

  // Step 5: Apply translations
  const localizedTemplate = applyTranslations(mergedTemplate, translation);

  // Step 6: Evaluate conditional logic
  const conditionalContext = evaluateConditionalLogic(localizedTemplate, userAnswers);

  // Step 7: Render document (Jinja2)
  const renderedContent = await renderTemplate(localizedTemplate, {
    ...userAnswers,
    ...conditionalContext
  });

  // Step 8: Generate DOCX/PDF
  const docxBuffer = await generateDOCX(renderedContent);
  const pdfBuffer = await generatePDF(renderedContent);

  // Step 9: Save to database
  const document = await db.documents.create({
    user_id: getCurrentUserId(),
    template_id: templateId,
    jurisdiction,
    language,
    user_data: userAnswers,
    generated_content: renderedContent,
    file_path_docx: await uploadToS3(docxBuffer, 'docx'),
    file_path_pdf: await uploadToS3(pdfBuffer, 'pdf'),
    status: 'completed'
  });

  return document;
}
```

### Merge Algorithm (Base + Overlay)

```typescript
function mergeTemplateWithOverlay(
  base: Template,
  overlay: JurisdictionOverlay
): MergedTemplate {
  const merged = _.cloneDeep(base); // Deep clone base template

  if (!overlay) return merged; // No overlay, return base as-is

  // 1. Apply variable overrides
  if (overlay.overlay_content.variable_overrides) {
    merged.template_content.variables = merged.template_content.variables.map(variable => {
      const override = overlay.overlay_content.variable_overrides[variable.id];
      if (override) {
        return { ...variable, ...override };
      }
      return variable;
    });
  }

  // 2. Add additional variables
  if (overlay.overlay_content.additional_variables) {
    merged.template_content.variables.push(...overlay.overlay_content.additional_variables);
  }

  // 3. Apply clause overrides
  if (overlay.overlay_content.clause_overrides) {
    merged.template_content.sections.forEach(section => {
      section.clauses = section.clauses.map(clause => {
        const override = overlay.overlay_content.clause_overrides[clause.id];
        if (override) {
          return {
            ...clause,
            ...override,
            overridden: true, // Mark as overridden for audit trail
            original_text: clause.text // Preserve original
          };
        }
        return clause;
      });
    });
  }

  // 4. Add additional clauses (sorted by order)
  if (overlay.overlay_content.additional_clauses) {
    overlay.overlay_content.additional_clauses.forEach(additionalClause => {
      const section = merged.template_content.sections.find(s => s.id === additionalClause.section_id);
      if (section) {
        section.clauses.push({
          ...additionalClause,
          jurisdiction_specific: true // Mark for transparency
        });

        // Re-sort clauses by order
        section.clauses.sort((a, b) => (a.order || 999) - (b.order || 999));
      }
    });
  }

  // 5. Merge conditional logic
  if (overlay.overlay_content.conditional_logic) {
    merged.template_content.conditional_logic = [
      ...(merged.template_content.conditional_logic || []),
      ...overlay.overlay_content.conditional_logic
    ];
  }

  // 6. Add legal citations metadata
  merged.legal_citations = overlay.legal_citations || [];
  merged.validated_by = overlay.validated_by;
  merged.validation_date = overlay.validation_date;

  return merged;
}
```

### Translation Application

```typescript
function applyTranslations(
  template: MergedTemplate,
  translation: Translation
): LocalizedTemplate {
  const localized = _.cloneDeep(template);

  if (!translation) return localized; // No translation, return as-is (default language)

  const t = translation.translations;

  // 1. Translate metadata
  if (t.meta) {
    localized.title = t.meta.title || localized.title;
    localized.description = t.meta.description || localized.description;
  }

  // 2. Translate sections
  if (t.sections) {
    localized.template_content.sections.forEach(section => {
      section.title = t.sections[section.id] || section.title;
    });
  }

  // 3. Translate variables (labels, help text, placeholders)
  if (t.variables) {
    localized.template_content.variables.forEach(variable => {
      const varTranslation = t.variables[variable.id];
      if (varTranslation) {
        variable.label = varTranslation.label || variable.label;
        variable.helpText = varTranslation.helpText || variable.helpText;
        variable.placeholder = varTranslation.placeholder || variable.placeholder;
      }
    });
  }

  // 4. Translate clauses
  if (t.clauses) {
    localized.template_content.sections.forEach(section => {
      section.clauses.forEach(clause => {
        clause.text = t.clauses[clause.id] || clause.text;
      });
    });
  }

  // 5. Add translated warnings/notifications
  localized.warnings = t.warnings || {};
  localized.ui = t.ui || {};

  return localized;
}
```

---

## API Design

### Endpoint: GET /api/templates/:templateId/jurisdictions

Returns list of supported jurisdictions for a template.

```typescript
// GET /api/templates/founders-agreement-v1/jurisdictions
{
  "template_id": "founders-agreement-v1",
  "template_title": "Founders' Agreement",
  "supported_jurisdictions": [
    {
      "code": "UK",
      "name": "United Kingdom",
      "flag": "🇬🇧",
      "languages": ["en-UK"],
      "overlay_version": "1.0",
      "validated_by": "Sarah Thompson, Solicitor",
      "validation_date": "2025-10-15",
      "legal_citations_count": 5,
      "status": "active"
    },
    {
      "code": "US-DE",
      "name": "United States (Delaware)",
      "flag": "🇺🇸",
      "languages": ["en-US"],
      "overlay_version": "1.0",
      "validated_by": "John Davis, Attorney at Law",
      "validation_date": "2025-10-14",
      "legal_citations_count": 7,
      "status": "active"
    },
    {
      "code": "DE",
      "name": "Germany",
      "flag": "🇩🇪",
      "languages": ["de-DE", "en-US"],
      "overlay_version": "1.0",
      "validated_by": "Klaus Müller, Rechtsanwalt",
      "validation_date": "2025-10-16",
      "legal_citations_count": 6,
      "status": "active",
      "warnings": ["Notarization required"]
    },
    {
      "code": "FR",
      "name": "France",
      "flag": "🇫🇷",
      "languages": ["fr-FR", "en-US"],
      "overlay_version": "1.0",
      "validated_by": "Marie Dubois, Avocat",
      "validation_date": "2025-10-17",
      "legal_citations_count": 5,
      "status": "active"
    },
    {
      "code": "ES",
      "name": "Spain",
      "flag": "🇪🇸",
      "languages": ["es-ES", "en-US"],
      "overlay_version": "0.9",
      "validated_by": null,
      "validation_date": null,
      "legal_citations_count": 0,
      "status": "beta" // Not yet validated, beta release
    }
  ]
}
```

### Endpoint: GET /api/templates/:templateId/questionnaire

Returns questionnaire with jurisdiction and language applied.

```typescript
// GET /api/templates/founders-agreement-v1/questionnaire?jurisdiction=DE&language=de-DE
{
  "template_id": "founders-agreement-v1",
  "jurisdiction": "DE",
  "language": "de-DE",
  "questionnaire": {
    "groups": [
      {
        "id": "founder_info",
        "title": "Gründerinformationen", // Translated
        "description": "Geben Sie die Details für alle Gründer ein",
        "order": 1
      },
      {
        "id": "equity_vesting",
        "title": "Geschäftsanteile & Vesting",
        "description": "Definieren Sie die Verteilung der Anteile und Vesting-Bedingungen",
        "order": 2
      },
      {
        "id": "company_details",
        "title": "Gesellschaftsdetails",
        "description": "Informationen über die Gesellschaft und Unternehmensführung",
        "order": 3
      }
    ],
    "questions": [
      {
        "id": "company_name",
        "type": "text",
        "label": "Name der Gesellschaft", // Translated
        "helpText": "Vollständiger Name der GmbH (z.B. \"Startup GmbH\")", // Translated
        "placeholder": "z.B. Startup GmbH",
        "required": true,
        "groupId": "company_details"
      },
      {
        "id": "share_capital", // Germany-specific variable
        "type": "number",
        "label": "Stammkapital (€)",
        "helpText": "Mindeststammkapital für eine GmbH: €25.000 (§ 5 Abs. 1 GmbHG)",
        "default": 25000,
        "required": true,
        "validation": {
          "min": 25000,
          "customRule": "share_capital_validation"
        },
        "groupId": "equity_vesting"
      },
      {
        "id": "vesting_enabled",
        "type": "boolean",
        "label": "Vesting aktivieren?",
        "helpText": "Vesting bedeutet, dass Geschäftsanteile über einen Zeitraum \"verdient\" werden.",
        "default": true,
        "groupId": "equity_vesting"
      },
      {
        "id": "vesting_period",
        "type": "number",
        "label": "Vesting-Zeitraum (Jahre)",
        "helpText": "Typischerweise 4 Jahre für Startups",
        "default": 4,
        "required": true,
        "conditionalDisplay": {
          "==": [{"var": "vesting_enabled"}, true]
        },
        "groupId": "equity_vesting"
      }
      // ... more questions
    ],
    "warnings": {
      "require_notary_notice": "⚠️ WICHTIG: Dieser Vertrag muss notariell beurkundet werden (§ 2 GmbHG).",
      "share_capital_low": "Mindeststammkapital für eine GmbH ist €25.000. Für niedrigere Beträge kann eine UG (haftungsbeschränkt) gegründet werden."
    }
  },
  "legal_info": {
    "validated_by": "Klaus Müller, Rechtsanwalt",
    "validation_date": "2025-10-16",
    "legal_citations": [
      "GmbHG § 2 (Form des Gesellschaftsvertrags)",
      "GmbHG § 5 (Mindestinhalt des Gesellschaftsvertrags)",
      "GmbHG § 14 (Geschäftsanteil)"
    ],
    "requires_notarization": true,
    "estimated_notary_cost": "€300-600"
  }
}
```

### Endpoint: POST /api/documents/generate

Generates document using merged template.

```typescript
// POST /api/documents/generate
{
  "template_id": "founders-agreement-v1",
  "jurisdiction": "DE",
  "language": "de-DE",
  "answers": {
    "company_name": "AI Startup GmbH",
    "share_capital": 25000,
    "founders": [
      { "name": "Anna Schmidt", "email": "anna@example.com", "equity_percentage": 50 },
      { "name": "Boris Weber", "email": "boris@example.com", "equity_percentage": 50 }
    ],
    "vesting_enabled": true,
    "vesting_period": 4,
    "cliff_period": 1,
    "managing_directors_count": 2,
    "court_location": "Berlin"
  }
}

// Response
{
  "document_id": "uuid-doc-1",
  "status": "completed",
  "template": {
    "title": "Gesellschaftervereinbarung für Gründer",
    "jurisdiction": "Germany",
    "language": "de-DE"
  },
  "files": {
    "docx": "https://s3.eu-central-1.amazonaws.com/legalmind/documents/uuid-doc-1.docx",
    "pdf": "https://s3.eu-central-1.amazonaws.com/legalmind/documents/uuid-doc-1.pdf",
    "preview_html": "https://legalmind.app/documents/uuid-doc-1/preview"
  },
  "metadata": {
    "generated_at": "2025-10-20T14:35:22Z",
    "page_count": 12,
    "word_count": 3421,
    "legal_citations": 6,
    "lawyer_review_recommended": true,
    "notarization_required": true
  },
  "warnings": [
    "⚠️ WICHTIG: Dieser Vertrag muss notariell beurkundet werden (§ 2 GmbHG).",
    "Wir empfehlen, diesen Vertrag von einem Rechtsanwalt überprüfen zu lassen."
  ],
  "next_steps": [
    "Dokument herunterladen und prüfen",
    "Optional: Rechtsanwalt konsultieren",
    "Notartermin vereinbaren (erforderlich)",
    "Vertrag mit allen Gründern unterzeichnen (notariell)"
  ]
}
```

---

## Backend Implementation

### NestJS Service Layer

```typescript
// templates/templates.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template, JurisdictionOverlay, Translation } from './entities';
import * as _ from 'lodash';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private templatesRepo: Repository<Template>,
    @InjectRepository(JurisdictionOverlay)
    private overlaysRepo: Repository<JurisdictionOverlay>,
    @InjectRepository(Translation)
    private translationsRepo: Repository<Translation>,
  ) {}

  async getTemplateWithJurisdiction(
    templateCode: string,
    jurisdiction: string,
    language: string
  ): Promise<MergedTemplate> {
    // 1. Load base template
    const baseTemplate = await this.templatesRepo.findOne({
      where: { code: templateCode, base_template: true }
    });

    if (!baseTemplate) {
      throw new NotFoundException(`Template ${templateCode} not found`);
    }

    // 2. Load jurisdiction overlay
    const overlay = await this.overlaysRepo.findOne({
      where: {
        template_id: baseTemplate.id,
        jurisdiction_code: jurisdiction,
        effective_until: null // Current version
      },
      relations: ['validated_by'] // Include lawyer info
    });

    // 3. Merge base + overlay
    const mergedTemplate = this.mergeTemplateWithOverlay(baseTemplate, overlay);

    // 4. Load translation
    const translation = await this.translationsRepo.findOne({
      where: {
        template_id: baseTemplate.id,
        jurisdiction_code: jurisdiction,
        language_code: language
      }
    });

    // 5. Apply translations
    const localizedTemplate = this.applyTranslations(mergedTemplate, translation);

    return localizedTemplate;
  }

  private mergeTemplateWithOverlay(
    base: Template,
    overlay: JurisdictionOverlay | null
  ): MergedTemplate {
    // Implementation from algorithm above
    // ...
  }

  private applyTranslations(
    template: MergedTemplate,
    translation: Translation | null
  ): LocalizedTemplate {
    // Implementation from algorithm above
    // ...
  }

  async getSupportedJurisdictions(templateCode: string): Promise<JurisdictionInfo[]> {
    const template = await this.templatesRepo.findOne({
      where: { code: templateCode, base_template: true }
    });

    const overlays = await this.overlaysRepo.find({
      where: { template_id: template.id, effective_until: null },
      relations: ['validated_by']
    });

    return overlays.map(overlay => ({
      code: overlay.jurisdiction_code,
      name: this.getJurisdictionName(overlay.jurisdiction_code),
      flag: this.getJurisdictionFlag(overlay.jurisdiction_code),
      languages: this.getAvailableLanguages(template.id, overlay.jurisdiction_code),
      overlay_version: overlay.version,
      validated_by: overlay.validated_by?.full_name,
      validation_date: overlay.validation_date,
      legal_citations_count: overlay.legal_citations?.length || 0,
      status: overlay.validated_by ? 'active' : 'beta'
    }));
  }
}
```

### Document Generation Service

```typescript
// documents/documents.service.ts
import { Injectable } from '@nestjs/common';
import { TemplatesService } from '../templates/templates.service';
import { DocumentEngineService } from './document-engine.service'; // Python FastAPI client
import { S3Service } from '../storage/s3.service';

@Injectable()
export class DocumentsService {
  constructor(
    private templatesService: TemplatesService,
    private documentEngine: DocumentEngineService,
    private s3: S3Service
  ) {}

  async generateDocument(
    templateCode: string,
    jurisdiction: string,
    language: string,
    userAnswers: Record<string, any>,
    userId: string
  ): Promise<GeneratedDocument> {

    // 1. Get merged and localized template
    const template = await this.templatesService.getTemplateWithJurisdiction(
      templateCode,
      jurisdiction,
      language
    );

    // 2. Validate user answers against questionnaire schema
    const validationResult = this.validateAnswers(template, userAnswers);
    if (!validationResult.valid) {
      throw new BadRequestException(validationResult.errors);
    }

    // 3. Evaluate conditional logic (JSONLogic)
    const context = this.evaluateConditionalLogic(template, userAnswers);

    // 4. Call Python document engine to render
    const renderedContent = await this.documentEngine.render({
      template: template.template_content,
      data: { ...userAnswers, ...context },
      language
    });

    // 5. Generate DOCX and PDF
    const docxBuffer = await this.documentEngine.generateDOCX(renderedContent);
    const pdfBuffer = await this.documentEngine.generatePDF(renderedContent);

    // 6. Upload to S3
    const docxUrl = await this.s3.upload(docxBuffer, `documents/${userId}/${Date.now()}.docx`);
    const pdfUrl = await this.s3.upload(pdfBuffer, `documents/${userId}/${Date.now()}.pdf`);

    // 7. Save to database
    const document = await this.documentsRepo.create({
      user_id: userId,
      template_id: template.id,
      jurisdiction,
      language,
      user_data: userAnswers,
      generated_content: renderedContent,
      file_path_docx: docxUrl,
      file_path_pdf: pdfUrl,
      status: 'completed',
      metadata: {
        page_count: this.countPages(pdfBuffer),
        word_count: this.countWords(renderedContent),
        legal_citations: template.legal_citations?.length || 0,
        lawyer_review_recommended: context.require_lawyer_review || false,
        notarization_required: context.require_notary_notice || false
      }
    });

    await this.documentsRepo.save(document);

    return document;
  }

  private evaluateConditionalLogic(
    template: LocalizedTemplate,
    userAnswers: Record<string, any>
  ): Record<string, any> {
    const context: Record<string, any> = {};

    template.template_content.conditional_logic?.forEach(rule => {
      const result = jsonLogic.apply(rule.rule, userAnswers);

      // Extract context variables set by rules
      if (rule.rule.set) {
        Object.assign(context, rule.rule.set);
      }

      // Collect warnings
      if (result === true && rule.message) {
        context.warnings = context.warnings || [];
        context.warnings.push(rule.message);
      }
    });

    return context;
  }
}
```

---

## Admin CMS: Managing Overlays

Lawyers and legal editors need a UI to create and manage jurisdiction overlays.

### CMS Features

1. **Overlay Creation Wizard**
   - Select base template
   - Select jurisdiction
   - Guided form to add:
     - Variable overrides (dropdowns, defaults, validation)
     - Clause overrides (rich text editor with legal citation fields)
     - Additional clauses (section selector, order, text)
     - Conditional logic builder (visual JSONLogic editor)
     - Legal citations (autocomplete from legal database)

2. **Diff Viewer**
   - Show base template vs. overlay (side-by-side comparison)
   - Highlight overridden clauses in yellow
   - Show new clauses in green
   - Flag removed clauses in red (if any)

3. **Preview & Test**
   - Live preview: fill out questionnaire, see rendered document
   - Test cases: save example answer sets for regression testing
   - Version comparison: diff between overlay versions

4. **Translation Management**
   - Upload TMX files from translation agencies
   - In-browser editor for minor corrections
   - Translation memory suggestions (reuse common phrases)
   - Lawyer review workflow (mark as "approved" after legal QA)

5. **Validation Workflow**
   - Overlay status: Draft → In Review → Validated → Published
   - Lawyer assignment: assign overlay to qualified lawyer for review
   - Comments & feedback: threaded comments on specific clauses
   - Approval: only validated overlays appear to users

---

## Testing Strategy

### Unit Tests

```typescript
// templates.service.spec.ts
describe('TemplatesService', () => {
  describe('mergeTemplateWithOverlay', () => {
    it('should merge base template with UK overlay', () => {
      const base = { /* base template */ };
      const overlay = { /* UK overlay */ };

      const merged = service.mergeTemplateWithOverlay(base, overlay);

      expect(merged.template_content.variables.find(v => v.id === 'equity_type').default).toBe('Ordinary Shares');
      expect(merged.template_content.variables.find(v => v.id === 'nominal_value')).toBeDefined(); // UK-specific
      expect(merged.template_content.sections.find(s => s.id === 'equity_allocation').clauses).toHaveLength(4); // 3 base + 1 additional
    });

    it('should handle missing overlay gracefully', () => {
      const base = { /* base template */ };
      const overlay = null;

      const merged = service.mergeTemplateWithOverlay(base, overlay);

      expect(merged).toEqual(base); // Should return base as-is
    });
  });

  describe('applyTranslations', () => {
    it('should translate variable labels to German', () => {
      const template = { /* template */ };
      const translation = { /* German translation */ };

      const localized = service.applyTranslations(template, translation);

      expect(localized.template_content.variables.find(v => v.id === 'company_name').label).toBe('Name der Gesellschaft');
    });
  });
});
```

### Integration Tests

```typescript
// documents.e2e-spec.ts
describe('Document Generation (e2e)', () => {
  it('should generate German Founders Agreement with correct clauses', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/documents/generate')
      .send({
        template_id: 'founders-agreement-v1',
        jurisdiction: 'DE',
        language: 'de-DE',
        answers: {
          company_name: 'Test GmbH',
          share_capital: 25000,
          founders: [
            { name: 'Anna', equity_percentage: 50 },
            { name: 'Boris', equity_percentage: 50 }
          ],
          vesting_enabled: true
        }
      })
      .expect(201);

    expect(response.body.metadata.notarization_required).toBe(true);
    expect(response.body.warnings).toContain(expect.stringContaining('notariell beurkundet'));

    // Download and verify DOCX contains German text
    const docxUrl = response.body.files.docx;
    const docxContent = await downloadAndExtractText(docxUrl);
    expect(docxContent).toContain('Geschäftsanteile');
    expect(docxContent).toContain('GmbHG § 5');
  });

  it('should handle jurisdiction without overlay', async () => {
    await request(app.getHttpServer())
      .post('/api/documents/generate')
      .send({
        template_id: 'founders-agreement-v1',
        jurisdiction: 'XX', // Invalid jurisdiction
        language: 'en-US',
        answers: { /* ... */ }
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toContain('Jurisdiction XX not supported');
      });
  });
});
```

### Lawyer Validation Tests

For each jurisdiction overlay, create a **test checklist**:

- [ ] All required legal citations present
- [ ] Clauses comply with local law (verified by lawyer)
- [ ] Notarization requirements flagged (if applicable)
- [ ] No UPL violations (disclaimers present)
- [ ] Conditional logic correct (test edge cases)
- [ ] Generated document reviewed by qualified lawyer
- [ ] Translation accuracy confirmed by native speaker + lawyer

---

## Deployment & Rollout

### Phase 1: Core 5 Jurisdictions (Week 3-4)

1. **Week 3:**
   - Implement overlay system (database schema, merging algorithm, API endpoints)
   - Build CMS overlay editor
   - Recruit 5 lawyers (UK, US-DE, DE, FR, ES)

2. **Week 4:**
   - Lawyers create overlays for Founders' Agreement (pilot template)
   - QA: generate documents, review output
   - Deploy to staging, internal testing

### Phase 2: Scale to 10 Templates (Week 5-8)

- Each week: add overlays for 2-3 templates
- Parallel work: 5 lawyers working on different templates
- Estimate: 3-5 hours per overlay (experienced lawyer)

### Phase 3: Add 7 Jurisdictions (Month 4-7)

- Recruit lawyers in NL, IT, CZ, PL, SE, CA, AU
- Each jurisdiction: 4 weeks to create 20 overlays
- Parallelization: work on 3 jurisdictions simultaneously

---

## Monitoring & Optimization

### Metrics to Track

| Metric | Target | Action if Below Target |
|--------|--------|------------------------|
| **Overlay Completion Rate** | 100% of templates | Identify blockers, hire more lawyers |
| **Lawyer Validation Time** | < 5 hours per overlay | Simplify CMS, provide better guidance |
| **Document Generation Success Rate** | > 99% | Fix template bugs, improve merging logic |
| **User Jurisdiction Selection** | Balanced distribution | Adjust marketing by region |
| **Translation Coverage** | 100% of UI strings | Fill gaps in translation files |

### A/B Testing Opportunities

- **Default jurisdiction:** Does showing user's IP-detected jurisdiction as default increase conversion?
- **Language selector placement:** Top of questionnaire vs. bottom?
- **Lawyer review CTA:** "Find a lawyer" vs. "Get expert review" — which converts better?

---

## Conclusion

The **jurisdiction overlay system** is the **core technical innovation** of LegalMind. It enables:

✅ **90% code reuse** (1 base template → 20 jurisdictions)
✅ **Fast expansion** (add jurisdiction = add overlay, not rebuild template)
✅ **Legal compliance** (local lawyers validate overlays)
✅ **Consistent UX** (same questionnaire across jurisdictions)
✅ **Easy maintenance** (fix base template once, all jurisdictions updated)

**Implementation Timeline:**
- **Week 3:** Build overlay system (backend + CMS)
- **Week 4:** Pilot with Founders' Agreement (5 jurisdictions)
- **Week 5-8:** Scale to 10 templates
- **Month 4-7:** Add 7 jurisdictions (total 12)
- **Month 8-18:** Add 8 more jurisdictions (total 20)

**Next Steps:**
1. ✅ Review this technical specification
2. ✅ Adjust if needed (data structure, algorithm, API design)
3. ✅ Implement database schema (Week 3, Day 1)
4. ✅ Build merging algorithm (Week 3, Days 2-3)
5. ✅ Create CMS overlay editor (Week 3, Days 4-5)
6. ✅ Recruit 5 lawyers (Week 3)
7. ✅ Pilot with 1 template (Week 4)
8. ✅ Scale to 10 templates (Week 5-8)

---

**All 3 tasks completed:**

1. ✅ **CRITICAL_8_TEMPLATES.md** — Detailed specs for 8 missing deployment blocker templates
2. ✅ **QUESTIONNAIRE_IMPLEMENTATION_PRIORITY.md** — Prioritized roadmap for implementing questionnaires for existing 10 templates
3. ✅ **JURISDICTION_OVERLAY_SYSTEM.md** — Complete technical design for multi-jurisdiction template architecture

**Total Documentation:**
- Part 1: 50 KB (8 templates)
- Part 2: 28 KB (questionnaire prioritization)
- Part 3: 35 KB (overlay system design)
- **Total: 113 KB of execution-ready specifications**

**Ready for implementation Week 3-8 of 90-Day Launch Plan.**

---

**Document Owner:** Technical Lead / CTO
**Reviewers:** Legal Content Manager, Backend Engineers
**Implementation Window:** Week 3-8 of 90-Day Launch Plan
**Success Criteria:** 10 templates × 5 jurisdictions = 50 functional document variants by Week 8
