# LegalMind Database Schema & ERD

## Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Template      │    │   Jurisdiction  │    │   Language      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ code (PK)       │
│ code (UK)       │    │ code (UK)       │    │ name            │
│ title           │    │ name            │    │ rtl             │
│ category        │    │ region          │    │ plural_rules    │
│ jurisdiction_set│◄───┤ language_default│    │ date_format     │
│ default_language│◄───┤ date_format     │    │ number_format   │
│ min_risk_level  │    │ currency        │    └─────────────────┘
│ status          │    │ numbering_style │
│ license         │    └─────────────────┘
│ version         │
│ effective_from  │
│ deprecated_on   │
│ created_by      │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐    ┌─────────────────┐
│     Clause      │    │    Variable     │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │
│ template_id (FK)│    │ template_id (FK)│
│ clause_code     │    │ var_code        │
│ canonical_text  │    │ type            │
│ precedence      │    │ validation_json │
│ tags            │    │ ui_hint         │
│ applicability_  │    │ help_text_key   │
│   rule_id (FK)  │    │ default_value   │
│ is_required     │    │ dependencies    │
│ created_at      │    │ is_required     │
│ updated_at      │    │ created_at      │
└─────────────────┘    │ updated_at      │
         │              └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Rule/Logic    │    │   Translation   │
├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │
│ template_id (FK)│    │ entity_type     │
│ rule_code       │    │ entity_id       │
│ rule_engine     │    │ lang_code (FK)  │
│ rule_json       │    │ text            │
│ description     │    │ source_lang     │
│ triggered_      │    │ status          │
│   elements      │    │ translated_by   │
│ is_active       │    │ reviewed_by     │
│ created_at      │    │ created_at      │
│ updated_at      │    │ updated_at      │
└─────────────────┘    └─────────────────┘
                                │
                                │
                                ▼
                       ┌─────────────────┐
                       │   Audit_Log     │
                       ├─────────────────┤
                       │ id (PK)         │
                       │ entity_type     │
                       │ entity_id       │
                       │ action          │
                       │ old_values      │
                       │ new_values      │
                       │ changed_by      │
                       │ change_reason   │
                       │ timestamp       │
                       │ ip_address      │
                       │ user_agent      │
                       └─────────────────┘

                       ┌─────────────────┐
                       │ Consent_Log     │
                       ├─────────────────┤
                       │ id (PK)         │
                       │ session_id      │
                       │ template_id (FK)│
                       │ user_id         │
                       │ disclaimer_ver  │
                       │ jurisdiction    │
                       │ language        │
                       │ ip_address      │
                       │ user_agent      │
                       │ timestamp       │
                       └─────────────────┘

                       ┌─────────────────┐
                       │  Generation_Log │
                       ├─────────────────┤
                       │ id (PK)         │
                       │ session_id      │
                       │ template_id (FK)│
                       │ template_version│
                       │ user_inputs     │
                       │ generated_doc   │
                       │ export_format   │
                       │ generation_time │
                       │ file_size       │
                       │ download_count  │
                       │ retention_until │
                       │ created_at      │
                       └─────────────────┘
```

## Core Tables

### Templates
**Purpose**: Master registry of all legal document templates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Human-readable code (e.g., 'nda-mutual-uk') |
| title | VARCHAR(200) | NOT NULL | Display title |
| category | ENUM | NOT NULL | B2B, B2C, P2P |
| jurisdiction_set | JSONB | NOT NULL | Array of applicable jurisdiction codes |
| default_language | VARCHAR(10) | NOT NULL | IETF BCP 47 language code |
| min_risk_level | ENUM | NOT NULL | LOW, MEDIUM, HIGH |
| status | ENUM | NOT NULL | DRAFT, REVIEW, PUBLISHED, DEPRECATED |
| license | VARCHAR(50) | NOT NULL | License type (CC-BY-NC-ND, PROPRIETARY, etc.) |
| version | VARCHAR(20) | NOT NULL | Semantic version (1.0.0) |
| effective_from | TIMESTAMP | NOT NULL | When this version becomes active |
| deprecated_on | TIMESTAMP | NULL | When this version becomes obsolete |
| metadata | JSONB | NULL | Additional flexible metadata |
| created_by | UUID | NOT NULL | User ID of creator |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last modification timestamp |

**Indexes**:
- `idx_template_code_version` ON (code, version)
- `idx_template_status` ON (status)
- `idx_template_category` ON (category)
- `idx_template_jurisdiction` GIN ON (jurisdiction_set)

### Clauses
**Purpose**: Reusable text blocks that form templates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| template_id | UUID | NOT NULL, FK | Parent template |
| clause_code | VARCHAR(50) | NOT NULL | Code within template (e.g., 'confidentiality-mutual') |
| canonical_text | TEXT | NOT NULL | Base text in default language |
| precedence | INTEGER | NOT NULL | Display order within template |
| tags | VARCHAR[] | NULL | Searchable tags (liability, IP, etc.) |
| applicability_rule_id | UUID | NULL, FK | Rule determining when clause applies |
| is_required | BOOLEAN | DEFAULT false | Whether clause is mandatory |
| metadata | JSONB | NULL | Additional clause metadata |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last modification timestamp |

**Indexes**:
- `idx_clause_template` ON (template_id)
- `idx_clause_code` ON (clause_code)
- `idx_clause_tags` GIN ON (tags)
- `idx_clause_text` GIN ON to_tsvector('english', canonical_text) -- Full-text search

### Variables
**Purpose**: Dynamic input fields for templates

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| template_id | UUID | NOT NULL, FK | Parent template |
| var_code | VARCHAR(50) | NOT NULL | Variable name (snake_case) |
| type | ENUM | NOT NULL | string, integer, money, date, enum, party, address, etc. |
| validation_json | JSONB | NULL | JSON Schema validation rules |
| ui_hint | ENUM | NOT NULL | input, select, textarea, date_picker, etc. |
| help_text_key | VARCHAR(100) | NULL | i18n key for help text |
| default_value | TEXT | NULL | Default value if any |
| dependencies | JSONB | NULL | Other variables this depends on |
| is_required | BOOLEAN | DEFAULT true | Whether field is mandatory |
| display_order | INTEGER | NOT NULL | Order in questionnaire |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last modification timestamp |

**Indexes**:
- `idx_variable_template` ON (template_id)
- `idx_variable_code` ON (var_code)
- `idx_variable_type` ON (type)

### Rules (Logic Engine)
**Purpose**: Conditional logic for template assembly

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| template_id | UUID | NOT NULL, FK | Parent template |
| rule_code | VARCHAR(50) | NOT NULL | Human-readable rule identifier |
| rule_engine | VARCHAR(20) | NOT NULL | Engine type (jsonlogic, jinja2, etc.) |
| rule_json | JSONB | NOT NULL | Rule definition in engine format |
| description | TEXT | NULL | Human-readable description |
| triggered_elements | JSONB | NULL | Array of clause/variable IDs affected |
| is_active | BOOLEAN | DEFAULT true | Whether rule is enabled |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last modification timestamp |

### Jurisdictions
**Purpose**: Legal jurisdiction metadata

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| code | VARCHAR(10) | UNIQUE, NOT NULL | ISO or internal code (UK, US-DE, EU-BASE) |
| name | VARCHAR(100) | NOT NULL | Display name |
| region | VARCHAR(50) | NULL | Broader regional grouping |
| language_default | VARCHAR(10) | NOT NULL | Default language code |
| date_format | VARCHAR(20) | NOT NULL | Date format pattern |
| currency | VARCHAR(3) | NOT NULL | ISO currency code |
| numbering_style | VARCHAR(20) | NOT NULL | Number formatting style |
| legal_system | ENUM | NOT NULL | COMMON_LAW, CIVIL_LAW, MIXED |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last modification timestamp |

### Languages
**Purpose**: Supported languages and localization settings

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| code | VARCHAR(10) | PRIMARY KEY | IETF BCP 47 code (en-GB, en-US, de-DE, cs-CZ) |
| name | VARCHAR(50) | NOT NULL | Display name |
| native_name | VARCHAR(50) | NOT NULL | Name in native script |
| rtl | BOOLEAN | DEFAULT false | Right-to-left reading direction |
| plural_rules | JSONB | NOT NULL | CLDR plural rule mappings |
| date_format | VARCHAR(20) | NOT NULL | Localized date format |
| number_format | JSONB | NOT NULL | Number/currency formatting rules |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last modification timestamp |

### Translations
**Purpose**: Multilingual content storage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| entity_type | ENUM | NOT NULL | template, clause, variable, help_text, ui_text |
| entity_id | UUID | NOT NULL | ID of translated entity |
| lang_code | VARCHAR(10) | NOT NULL, FK | Target language |
| text | TEXT | NOT NULL | Translated content |
| source_lang | VARCHAR(10) | NOT NULL | Source language |
| status | ENUM | NOT NULL | DRAFT, REVIEWED, VALIDATED |
| translated_by | UUID | NULL | Translator user ID |
| reviewed_by | UUID | NULL | Reviewer user ID |
| translation_memory_id | UUID | NULL | Reference to TM entry |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last modification timestamp |

**Indexes**:
- `idx_translation_entity` ON (entity_type, entity_id, lang_code) -- Composite unique
- `idx_translation_status` ON (status)
- `idx_translation_lang` ON (lang_code)

## Audit & Compliance Tables

### Audit_Log
**Purpose**: Complete audit trail of all changes

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| entity_type | VARCHAR(50) | NOT NULL | Table/entity being audited |
| entity_id | UUID | NOT NULL | ID of affected record |
| action | ENUM | NOT NULL | CREATE, UPDATE, DELETE, PUBLISH |
| old_values | JSONB | NULL | Previous state (for updates) |
| new_values | JSONB | NULL | New state |
| changed_by | UUID | NOT NULL | User ID making change |
| change_reason | TEXT | NULL | Optional reason for change |
| timestamp | TIMESTAMP | NOT NULL | When change occurred |
| ip_address | INET | NULL | Source IP address |
| user_agent | TEXT | NULL | Browser/client info |

### Consent_Log
**Purpose**: GDPR compliance - user consent tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| session_id | VARCHAR(100) | NOT NULL | Anonymous session identifier |
| template_id | UUID | NOT NULL, FK | Template being used |
| user_id | UUID | NULL | Registered user ID (if applicable) |
| disclaimer_version | VARCHAR(20) | NOT NULL | Version of disclaimer shown |
| jurisdiction | VARCHAR(10) | NOT NULL | Jurisdiction selected |
| language | VARCHAR(10) | NOT NULL | Language used |
| consent_given | BOOLEAN | NOT NULL | Whether consent was given |
| ip_address | INET | NOT NULL | Source IP address |
| user_agent | TEXT | NOT NULL | Browser/client info |
| timestamp | TIMESTAMP | NOT NULL | When consent was given/refused |

### Generation_Log
**Purpose**: Document generation audit and analytics

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| session_id | VARCHAR(100) | NOT NULL | Anonymous session identifier |
| template_id | UUID | NOT NULL, FK | Template used |
| template_version | VARCHAR(20) | NOT NULL | Version of template |
| user_inputs | JSONB | NOT NULL | Sanitized user input data |
| generated_clauses | JSONB | NOT NULL | Which clauses were included |
| export_format | ENUM | NOT NULL | HTML, DOCX, PDF |
| generation_time_ms | INTEGER | NOT NULL | Processing time |
| file_size_bytes | INTEGER | NULL | Size of generated file |
| download_count | INTEGER | DEFAULT 0 | How many times downloaded |
| retention_until | TIMESTAMP | NOT NULL | When to delete (GDPR) |
| created_at | TIMESTAMP | NOT NULL | Generation timestamp |

**Data Retention**: Automatically purge Generation_Log records after retention_until date.