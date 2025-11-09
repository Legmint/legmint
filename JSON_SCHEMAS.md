# LegalMind JSON Schemas

## Template Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://legalmind.com/schemas/template.json",
  "title": "Legal Template",
  "type": "object",
  "required": ["code", "title", "category", "jurisdiction_set", "default_language", "version"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Unique template identifier"
    },
    "code": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "maxLength": 50,
      "description": "URL-safe template code (e.g., 'nda-mutual-uk')",
      "examples": ["nda-mutual-uk", "msa-saas-us", "terms-sale-eu"]
    },
    "title": {
      "type": "string",
      "maxLength": 200,
      "description": "Human-readable template title"
    },
    "description": {
      "type": "string",
      "maxLength": 1000,
      "description": "Template description and use cases"
    },
    "category": {
      "type": "string",
      "enum": ["B2B", "B2C", "P2P"],
      "description": "Business model category"
    },
    "jurisdiction_set": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[A-Z]{2}(-[A-Z]{2})?$"
      },
      "minItems": 1,
      "description": "Applicable jurisdictions (ISO codes or custom)",
      "examples": [["UK"], ["US-DE"], ["EU-BASE", "DE", "FR"]]
    },
    "default_language": {
      "type": "string",
      "pattern": "^[a-z]{2}(-[A-Z]{2})?$",
      "description": "IETF BCP 47 language code",
      "examples": ["en-GB", "en-US", "de-DE", "cs-CZ"]
    },
    "supported_languages": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-z]{2}(-[A-Z]{2})?$"
      },
      "description": "All available language translations"
    },
    "min_risk_level": {
      "type": "string",
      "enum": ["LOW", "MEDIUM", "HIGH"],
      "description": "Minimum risk assessment for usage"
    },
    "complexity_score": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10,
      "description": "Template complexity (1=simple, 10=expert)"
    },
    "estimated_time_minutes": {
      "type": "integer",
      "minimum": 1,
      "description": "Estimated completion time"
    },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "LEGAL_REVIEW", "LOCALIZATION", "QA_SIGNOFF", "PUBLISHED", "DEPRECATED"],
      "description": "Publication workflow status"
    },
    "license": {
      "type": "string",
      "enum": ["CC-BY-NC-ND", "CC-BY-SA", "PROPRIETARY", "MIT"],
      "description": "Content license type"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$",
      "description": "Semantic version number"
    },
    "effective_from": {
      "type": "string",
      "format": "date-time",
      "description": "When this version becomes active"
    },
    "deprecated_on": {
      "type": "string",
      "format": "date-time",
      "description": "When this version becomes obsolete"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 50
      },
      "description": "Searchable tags",
      "examples": [["confidentiality", "intellectual-property", "liability"]]
    },
    "use_cases": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 200
      },
      "description": "Common use case scenarios"
    },
    "related_templates": {
      "type": "array",
      "items": {
        "type": "string",
        "format": "uuid"
      },
      "description": "IDs of related templates"
    },
    "metadata": {
      "type": "object",
      "description": "Flexible additional properties",
      "additionalProperties": true
    }
  }
}
```

## Variable Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://legalmind.com/schemas/variable.json",
  "title": "Template Variable",
  "type": "object",
  "required": ["template_id", "var_code", "type", "ui_hint"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "template_id": {
      "type": "string",
      "format": "uuid"
    },
    "var_code": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9_]*$",
      "maxLength": 50,
      "description": "Snake_case variable identifier",
      "examples": ["company_name", "governing_law", "effective_date"]
    },
    "type": {
      "type": "string",
      "enum": [
        "string", "text", "integer", "decimal", "money", "percentage",
        "date", "datetime", "duration", "email", "phone", "url",
        "enum", "multi_enum", "boolean",
        "party", "address", "signature",
        "governing_law", "jurisdiction"
      ],
      "description": "Data type for validation and UI rendering"
    },
    "validation": {
      "type": "object",
      "properties": {
        "required": {
          "type": "boolean",
          "default": true
        },
        "min_length": {
          "type": "integer",
          "minimum": 0
        },
        "max_length": {
          "type": "integer",
          "minimum": 1
        },
        "pattern": {
          "type": "string",
          "description": "Regex pattern for validation"
        },
        "minimum": {
          "type": "number"
        },
        "maximum": {
          "type": "number"
        },
        "enum_values": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "value": {
                "type": "string"
              },
              "label_key": {
                "type": "string",
                "description": "i18n key for display label"
              },
              "jurisdiction_specific": {
                "type": "boolean",
                "default": false
              }
            },
            "required": ["value", "label_key"]
          }
        },
        "date_constraints": {
          "type": "object",
          "properties": {
            "min_date": {
              "type": "string",
              "description": "ISO date or relative (e.g., 'today', '+30d')"
            },
            "max_date": {
              "type": "string"
            },
            "exclude_weekends": {
              "type": "boolean"
            },
            "business_days_only": {
              "type": "boolean"
            }
          }
        }
      }
    },
    "ui_hint": {
      "type": "string",
      "enum": [
        "input", "textarea", "select", "multi_select", "radio", "checkbox",
        "date_picker", "datetime_picker", "duration_picker",
        "money_input", "percentage_input",
        "party_selector", "address_input", "signature_pad",
        "jurisdiction_selector", "governing_law_selector"
      ],
      "description": "UI component to render"
    },
    "display_name_key": {
      "type": "string",
      "description": "i18n key for field label"
    },
    "help_text_key": {
      "type": "string",
      "description": "i18n key for help text"
    },
    "placeholder_key": {
      "type": "string",
      "description": "i18n key for placeholder text"
    },
    "default_value": {
      "description": "Default value (type depends on variable type)"
    },
    "display_order": {
      "type": "integer",
      "minimum": 0,
      "description": "Order in questionnaire"
    },
    "group": {
      "type": "string",
      "description": "Logical grouping for questionnaire sections",
      "examples": ["parties", "terms", "confidentiality", "liability"]
    },
    "dependencies": {
      "type": "object",
      "properties": {
        "show_if": {
          "$ref": "#/$defs/condition"
        },
        "required_if": {
          "$ref": "#/$defs/condition"
        },
        "calculate_from": {
          "type": "string",
          "description": "JSONLogic expression to calculate value"
        }
      }
    },
    "jurisdiction_overrides": {
      "type": "object",
      "patternProperties": {
        "^[A-Z]{2}(-[A-Z]{2})?$": {
          "type": "object",
          "description": "Jurisdiction-specific overrides",
          "properties": {
            "validation": {
              "$ref": "#/properties/validation"
            },
            "default_value": {},
            "enum_values": {
              "type": "array"
            }
          }
        }
      }
    }
  },
  "$defs": {
    "condition": {
      "type": "object",
      "description": "JSONLogic condition",
      "additionalProperties": true
    }
  }
}
```

## Clause Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://legalmind.com/schemas/clause.json",
  "title": "Template Clause",
  "type": "object",
  "required": ["template_id", "clause_code", "canonical_text"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "template_id": {
      "type": "string",
      "format": "uuid"
    },
    "clause_code": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9_-]*$",
      "maxLength": 50,
      "description": "Unique identifier within template",
      "examples": ["confidentiality_mutual", "liability_limitation", "governing_law"]
    },
    "canonical_text": {
      "type": "string",
      "description": "Base clause text with template variables",
      "examples": [
        "The {{disclosing_party}} hereby discloses to {{receiving_party}} certain confidential information..."
      ]
    },
    "clause_type": {
      "type": "string",
      "enum": ["BOILERPLATE", "VARIABLE", "OPTIONAL", "JURISDICTION_SPECIFIC"],
      "description": "Classification of clause behavior"
    },
    "precedence": {
      "type": "integer",
      "minimum": 0,
      "description": "Display order within template"
    },
    "section": {
      "type": "string",
      "description": "Logical section grouping",
      "examples": ["definitions", "obligations", "liability", "termination", "general"]
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 50
      },
      "description": "Categorization tags",
      "examples": [["liability", "intellectual-property", "confidentiality"]]
    },
    "is_required": {
      "type": "boolean",
      "default": false,
      "description": "Whether clause must always be included"
    },
    "applicability_rule": {
      "$ref": "#/$defs/rule",
      "description": "JSONLogic rule determining when clause applies"
    },
    "risk_level": {
      "type": "string",
      "enum": ["LOW", "MEDIUM", "HIGH"],
      "description": "Risk assessment for this clause"
    },
    "alternatives": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "condition": {
            "$ref": "#/$defs/rule"
          },
          "text": {
            "type": "string"
          },
          "risk_level": {
            "type": "string",
            "enum": ["LOW", "MEDIUM", "HIGH"]
          }
        },
        "required": ["condition", "text"]
      },
      "description": "Alternative clause text based on conditions"
    },
    "inline_conditions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "marker": {
            "type": "string",
            "description": "Placeholder in text (e.g., {{?mutual_nda}})"
          },
          "condition": {
            "$ref": "#/$defs/rule"
          },
          "true_text": {
            "type": "string"
          },
          "false_text": {
            "type": "string"
          }
        },
        "required": ["marker", "condition"]
      },
      "description": "Conditional text within the clause"
    },
    "jurisdiction_variations": {
      "type": "object",
      "patternProperties": {
        "^[A-Z]{2}(-[A-Z]{2})?$": {
          "type": "object",
          "properties": {
            "text_override": {
              "type": "string",
              "description": "Jurisdiction-specific clause text"
            },
            "additional_clauses": {
              "type": "array",
              "items": {
                "type": "string"
              },
              "description": "Additional clauses required by jurisdiction"
            },
            "risk_level_override": {
              "type": "string",
              "enum": ["LOW", "MEDIUM", "HIGH"]
            }
          }
        }
      }
    },
    "metadata": {
      "type": "object",
      "properties": {
        "source": {
          "type": "string",
          "description": "Legal source or precedent"
        },
        "last_reviewed": {
          "type": "string",
          "format": "date"
        },
        "reviewer": {
          "type": "string",
          "format": "uuid"
        },
        "notes": {
          "type": "string"
        }
      }
    }
  },
  "$defs": {
    "rule": {
      "type": "object",
      "description": "JSONLogic rule object",
      "additionalProperties": true
    }
  }
}
```

## Rule Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://legalmind.com/schemas/rule.json",
  "title": "Template Rule",
  "type": "object",
  "required": ["template_id", "rule_code", "rule_engine", "rule_definition"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "template_id": {
      "type": "string",
      "format": "uuid"
    },
    "rule_code": {
      "type": "string",
      "pattern": "^[a-z][a-z0-9_]*$",
      "maxLength": 50,
      "description": "Human-readable rule identifier",
      "examples": ["show_mutual_clauses", "require_gdpr_addendum", "liability_cap_applies"]
    },
    "rule_engine": {
      "type": "string",
      "enum": ["jsonlogic", "jinja2", "javascript"],
      "description": "Rule evaluation engine"
    },
    "rule_definition": {
      "description": "Rule logic in engine-specific format"
    },
    "description": {
      "type": "string",
      "maxLength": 500,
      "description": "Human-readable rule description"
    },
    "triggered_elements": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "element_type": {
            "type": "string",
            "enum": ["clause", "variable", "section"]
          },
          "element_id": {
            "type": "string",
            "format": "uuid"
          },
          "element_code": {
            "type": "string"
          },
          "action": {
            "type": "string",
            "enum": ["include", "exclude", "require", "hide", "modify"]
          }
        },
        "required": ["element_type", "action"]
      },
      "description": "Elements affected when rule triggers"
    },
    "priority": {
      "type": "integer",
      "minimum": 0,
      "default": 100,
      "description": "Rule execution priority (lower = earlier)"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Whether rule is enabled"
    },
    "test_cases": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "input_variables": {
            "type": "object"
          },
          "expected_result": {
            "type": "boolean"
          },
          "description": {
            "type": "string"
          }
        },
        "required": ["name", "input_variables", "expected_result"]
      },
      "description": "Test cases for rule validation"
    }
  }
}
```

## Translation Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://legalmind.com/schemas/translation.json",
  "title": "Content Translation",
  "type": "object",
  "required": ["entity_type", "entity_id", "lang_code", "text", "source_lang"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "entity_type": {
      "type": "string",
      "enum": ["template", "clause", "variable", "help_text", "ui_text", "disclaimer"],
      "description": "Type of entity being translated"
    },
    "entity_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of the entity being translated"
    },
    "field_name": {
      "type": "string",
      "description": "Specific field being translated (e.g., 'title', 'canonical_text')"
    },
    "lang_code": {
      "type": "string",
      "pattern": "^[a-z]{2}(-[A-Z]{2})?$",
      "description": "Target language (IETF BCP 47)"
    },
    "text": {
      "type": "string",
      "description": "Translated content"
    },
    "source_lang": {
      "type": "string",
      "pattern": "^[a-z]{2}(-[A-Z]{2})?$",
      "description": "Source language"
    },
    "status": {
      "type": "string",
      "enum": ["DRAFT", "REVIEWED", "VALIDATED", "REJECTED"],
      "description": "Translation quality status"
    },
    "translation_method": {
      "type": "string",
      "enum": ["HUMAN", "MACHINE", "HYBRID"],
      "description": "How translation was created"
    },
    "translator_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of translator (if human)"
    },
    "reviewer_id": {
      "type": "string",
      "format": "uuid",
      "description": "ID of reviewer"
    },
    "quality_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Automated quality assessment (0-1)"
    },
    "revision_number": {
      "type": "integer",
      "minimum": 1,
      "default": 1,
      "description": "Translation revision number"
    },
    "translation_memory_matches": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "tm_id": {
            "type": "string",
            "format": "uuid"
          },
          "match_percentage": {
            "type": "number",
            "minimum": 0,
            "maximum": 100
          },
          "source_text": {
            "type": "string"
          },
          "target_text": {
            "type": "string"
          }
        }
      },
      "description": "Translation memory matches used"
    },
    "notes": {
      "type": "string",
      "maxLength": 1000,
      "description": "Translator/reviewer notes"
    },
    "metadata": {
      "type": "object",
      "properties": {
        "word_count": {
          "type": "integer",
          "minimum": 0
        },
        "character_count": {
          "type": "integer",
          "minimum": 0
        },
        "complexity_score": {
          "type": "number",
          "minimum": 0,
          "maximum": 10
        },
        "legal_terminology_count": {
          "type": "integer",
          "minimum": 0
        }
      }
    }
  }
}
```

## Jurisdiction Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://legalmind.com/schemas/jurisdiction.json",
  "title": "Legal Jurisdiction",
  "type": "object",
  "required": ["code", "name", "legal_system", "default_language"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "code": {
      "type": "string",
      "pattern": "^[A-Z]{2}(-[A-Z]{2})?$",
      "maxLength": 10,
      "description": "ISO or custom jurisdiction code",
      "examples": ["UK", "US-DE", "EU-BASE", "DE", "CZ"]
    },
    "name": {
      "type": "string",
      "maxLength": 100,
      "description": "Full jurisdiction name"
    },
    "short_name": {
      "type": "string",
      "maxLength": 50,
      "description": "Abbreviated name"
    },
    "region": {
      "type": "string",
      "enum": ["EUROPE", "NORTH_AMERICA", "ASIA_PACIFIC", "LATIN_AMERICA", "AFRICA", "MIDDLE_EAST"],
      "description": "Broader regional grouping"
    },
    "legal_system": {
      "type": "string",
      "enum": ["COMMON_LAW", "CIVIL_LAW", "MIXED", "RELIGIOUS", "CUSTOMARY"],
      "description": "Legal tradition"
    },
    "default_language": {
      "type": "string",
      "pattern": "^[a-z]{2}(-[A-Z]{2})?$",
      "description": "Primary legal language"
    },
    "supported_languages": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-z]{2}(-[A-Z]{2})?$"
      },
      "description": "All supported languages"
    },
    "currency": {
      "type": "string",
      "pattern": "^[A-Z]{3}$",
      "description": "ISO 4217 currency code"
    },
    "date_format": {
      "type": "string",
      "description": "Preferred date format pattern",
      "examples": ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]
    },
    "number_format": {
      "type": "object",
      "properties": {
        "decimal_separator": {
          "type": "string",
          "maxLength": 1,
          "examples": [".", ","]
        },
        "thousands_separator": {
          "type": "string",
          "maxLength": 1,
          "examples": [",", ".", " "]
        },
        "currency_symbol_position": {
          "type": "string",
          "enum": ["BEFORE", "AFTER"]
        }
      }
    },
    "contract_law_specifics": {
      "type": "object",
      "properties": {
        "governing_law_clauses_required": {
          "type": "boolean"
        },
        "jurisdiction_clauses_required": {
          "type": "boolean"
        },
        "signature_requirements": {
          "type": "object",
          "properties": {
            "electronic_signatures_valid": {
              "type": "boolean"
            },
            "witness_required": {
              "type": "boolean"
            },
            "notarization_required": {
              "type": "boolean"
            }
          }
        },
        "mandatory_clauses": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Clauses required by law"
        },
        "prohibited_clauses": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Clauses not enforceable"
        }
      }
    },
    "data_protection_regime": {
      "type": "string",
      "enum": ["GDPR", "CCPA", "PIPEDA", "LGPD", "PDPA", "OTHER", "NONE"],
      "description": "Applicable data protection law"
    },
    "parent_jurisdiction": {
      "type": "string",
      "description": "Parent jurisdiction code (e.g., DE → EU-BASE)"
    },
    "inheritance_rules": {
      "type": "object",
      "properties": {
        "inherit_clauses": {
          "type": "boolean",
          "default": true
        },
        "inherit_variables": {
          "type": "boolean",
          "default": true
        },
        "override_precedence": {
          "type": "string",
          "enum": ["LOCAL_FIRST", "PARENT_FIRST"],
          "default": "LOCAL_FIRST"
        }
      },
      "description": "How to inherit from parent jurisdiction"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Whether jurisdiction is available for new templates"
    }
  }
}
```

These JSON schemas provide comprehensive validation and documentation for all core entities in the LegalMind system. They include proper validation rules, examples, and extensibility through metadata fields while maintaining strict typing where needed for legal compliance and data integrity.