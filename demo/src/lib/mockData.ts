import { Template, Questionnaire, Jurisdiction, Language } from './types';

export const mockTemplates: Template[] = [
  {
    id: '1',
    code: 'founders-agreement-v1',
    title: 'Founders\' Agreement',
    description: 'Comprehensive agreement defining founder relationships, equity split, vesting schedules, roles, IP assignment, and exit scenarios for early-stage startups.',
    category: 'Founding',
    jurisdiction_set: ['UK', 'US-DE', 'DE', 'FR', 'ES'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'HIGH',
    complexity_score: 7,
    estimated_time_minutes: 30,
    version: '1.0.0',
    tags: ['founders', 'equity', 'vesting', 'startup', 'formation'],
    usage_count: 1842,
    rating: 4.9,
    updated_at: '2025-10-14T10:30:00Z',
    use_cases: [
      'Pre-incorporation founder alignment',
      'Equity split documentation',
      'Vesting agreement formalization',
      'Co-founder onboarding'
    ],
    related_templates: ['2', '3']
  },
  {
    id: '2',
    code: 'safe-yc-v1',
    title: 'SAFE Agreement (YC Standard)',
    description: 'Y Combinator Simple Agreement for Future Equity with valuation cap, discount, and pro-rata rights for pre-seed and seed funding.',
    category: 'Fundraising',
    jurisdiction_set: ['US-DE', 'UK', 'EU-BASE'],
    supported_languages: ['en-US', 'en-UK'],
    min_risk_level: 'HIGH',
    complexity_score: 7,
    estimated_time_minutes: 25,
    version: '1.0.0',
    tags: ['safe', 'fundraising', 'seed', 'investment', 'yc'],
    usage_count: 2156,
    rating: 4.8,
    updated_at: '2025-10-14T10:15:00Z',
    use_cases: [
      'Pre-seed funding rounds',
      'Angel investor agreements',
      'Fast fundraising without valuation',
      'Startup accelerator investments'
    ],
    related_templates: ['1', '6', '7']
  },
  {
    id: '3',
    code: 'employment-fulltime-v1',
    title: 'Employment Contract (Full-time)',
    description: 'Comprehensive employment agreement covering role, compensation, benefits, IP assignment, confidentiality, and termination for startup employees.',
    category: 'Employment',
    jurisdiction_set: ['UK', 'US-DE', 'DE', 'FR', 'ES'],
    supported_languages: ['en-UK', 'en-US', 'de-DE', 'fr-FR'],
    min_risk_level: 'MEDIUM',
    complexity_score: 6,
    estimated_time_minutes: 25,
    version: '1.0.0',
    tags: ['employment', 'hiring', 'hr', 'compensation', 'equity'],
    usage_count: 3421,
    rating: 4.7,
    updated_at: '2025-10-14T09:45:00Z',
    use_cases: [
      'Hiring first employees',
      'Formalizing employment relationships',
      'Investor due diligence prep',
      'HR compliance documentation'
    ],
    related_templates: ['4', '8']
  },
  {
    id: '4',
    code: 'ip-assignment-founder-v1',
    title: 'IP Assignment Agreement (Founder)',
    description: 'Founder IP assignment ensuring all pre-existing and future intellectual property is assigned to the company.',
    category: 'IP',
    jurisdiction_set: ['UK', 'US-DE', 'DE', 'FR', 'ES'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'HIGH',
    complexity_score: 5,
    estimated_time_minutes: 15,
    version: '1.0.0',
    tags: ['ip', 'intellectual-property', 'assignment', 'founders'],
    usage_count: 1567,
    rating: 4.8,
    updated_at: '2025-10-14T09:30:00Z',
    use_cases: [
      'Incorporation IP cleanup',
      'Investor due diligence prep',
      'Founder onboarding',
      'Pre-existing IP documentation'
    ],
    related_templates: ['1', '3', '5']
  },
  {
    id: '5',
    code: 'nda-mutual-v1',
    title: 'NDA (Mutual)',
    description: 'Bilateral confidentiality agreement for protecting sensitive information during investor discussions, partnerships, and due diligence.',
    category: 'IP',
    jurisdiction_set: ['UK', 'US-DE', 'DE', 'FR', 'ES', 'SG', 'AU'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'LOW',
    complexity_score: 3,
    estimated_time_minutes: 10,
    version: '1.0.0',
    tags: ['nda', 'confidentiality', 'due-diligence', 'partnership'],
    usage_count: 4892,
    rating: 4.6,
    updated_at: '2025-10-14T09:00:00Z',
    use_cases: [
      'Investor discussions and due diligence',
      'Partnership negotiations',
      'Vendor evaluations',
      'M&A discussions'
    ],
    related_templates: ['2', '6']
  },
  {
    id: '6',
    code: 'convertible-note-v1',
    title: 'Convertible Note',
    description: 'Debt instrument converting to equity on qualifying financing with interest rate, maturity date, and conversion mechanics.',
    category: 'Fundraising',
    jurisdiction_set: ['US-DE', 'UK', 'DE'],
    supported_languages: ['en-US', 'en-UK', 'de-DE'],
    min_risk_level: 'HIGH',
    complexity_score: 8,
    estimated_time_minutes: 30,
    version: '1.0.0',
    tags: ['convertible', 'note', 'fundraising', 'debt', 'seed'],
    usage_count: 892,
    rating: 4.7,
    updated_at: '2025-10-14T08:45:00Z',
    use_cases: [
      'Seed funding rounds',
      'Bridge financing',
      'Angel investor rounds',
      'Pre-Series A capital'
    ],
    related_templates: ['2', '7']
  },
  {
    id: '7',
    code: 'term-sheet-seed-v1',
    title: 'Term Sheet (Seed/Series A)',
    description: 'Non-binding term sheet outlining key investment terms including valuation, liquidation preferences, board composition, and voting rights.',
    category: 'Fundraising',
    jurisdiction_set: ['UK', 'US-DE', 'DE', 'FR'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'HIGH',
    complexity_score: 9,
    estimated_time_minutes: 40,
    version: '1.0.0',
    tags: ['term-sheet', 'series-a', 'seed', 'vc', 'investment'],
    usage_count: 567,
    rating: 4.9,
    updated_at: '2025-10-14T08:30:00Z',
    use_cases: [
      'Seed round negotiations',
      'Series A fundraising',
      'VC investment discussions',
      'Equity investment frameworks'
    ],
    related_templates: ['2', '6']
  },
  {
    id: '8',
    code: 'advisor-agreement-v1',
    title: 'Advisor Agreement',
    description: 'Startup advisor agreement with equity compensation, time commitment, confidentiality, and advisory service expectations.',
    category: 'Employment',
    jurisdiction_set: ['UK', 'US-DE', 'DE', 'FR', 'ES'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'MEDIUM',
    complexity_score: 4,
    estimated_time_minutes: 15,
    version: '1.0.0',
    tags: ['advisor', 'equity', 'vesting', 'mentorship'],
    usage_count: 1234,
    rating: 4.5,
    updated_at: '2025-10-14T08:15:00Z',
    use_cases: [
      'Onboarding startup advisors',
      'Equity-for-advice arrangements',
      'Board observer roles',
      'Strategic advisor engagements'
    ],
    related_templates: ['1', '3']
  },
  {
    id: '9',
    code: 'dpa-gdpr-v1',
    title: 'Data Processing Agreement (GDPR)',
    description: 'GDPR Article 28 compliant DPA for processor-controller relationships with security measures, sub-processors, and data breach obligations.',
    category: 'Compliance',
    jurisdiction_set: ['EU-BASE', 'UK', 'DE', 'FR', 'ES'],
    supported_languages: ['en-UK', 'de-DE', 'fr-FR'],
    min_risk_level: 'HIGH',
    complexity_score: 7,
    estimated_time_minutes: 25,
    version: '1.0.0',
    tags: ['gdpr', 'data-protection', 'privacy', 'compliance', 'dpa'],
    usage_count: 1876,
    rating: 4.8,
    updated_at: '2025-10-14T08:00:00Z',
    use_cases: [
      'SaaS vendor data processing',
      'Third-party processor agreements',
      'Marketing service data handling',
      'Cloud service compliance'
    ],
    related_templates: ['10']
  },
  {
    id: '10',
    code: 'saas-subscription-v1',
    title: 'SaaS Subscription Agreement',
    description: 'Software-as-a-Service agreement with subscription terms, usage limits, SLA commitments, data protection, and customer terms.',
    category: 'Commercial',
    jurisdiction_set: ['UK', 'US-DE', 'DE', 'FR', 'EU-BASE'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'HIGH',
    complexity_score: 7,
    estimated_time_minutes: 30,
    version: '1.0.0',
    tags: ['saas', 'subscription', 'b2b', 'cloud', 'software'],
    usage_count: 2341,
    rating: 4.7,
    updated_at: '2025-10-14T07:45:00Z',
    use_cases: [
      'SaaS product customer agreements',
      'Platform subscription terms',
      'Enterprise software licensing',
      'B2B SaaS contracts'
    ],
    related_templates: ['9']
  }
];

export const mockJurisdictions: Jurisdiction[] = [
  {
    id: '1',
    code: 'UK',
    name: 'United Kingdom',
    short_name: 'UK',
    region: 'EUROPE',
    legal_system: 'COMMON_LAW',
    default_language: 'en-UK',
    supported_languages: ['en-UK'],
    currency: 'GBP',
    date_format: 'DD/MM/YYYY',
    is_active: true
  },
  {
    id: '2',
    code: 'US-DE',
    name: 'Delaware, United States',
    short_name: 'Delaware',
    region: 'NORTH_AMERICA',
    legal_system: 'COMMON_LAW',
    default_language: 'en-US',
    supported_languages: ['en-US'],
    currency: 'USD',
    date_format: 'MM/DD/YYYY',
    is_active: true
  },
  {
    id: '3',
    code: 'EU-BASE',
    name: 'European Union (Baseline)',
    short_name: 'EU',
    region: 'EUROPE',
    legal_system: 'CIVIL_LAW',
    default_language: 'en-UK',
    supported_languages: ['en-UK', 'de-DE', 'fr-FR', 'es-ES'],
    currency: 'EUR',
    date_format: 'DD/MM/YYYY',
    is_active: true
  },
  {
    id: '4',
    code: 'DE',
    name: 'Germany',
    short_name: 'Germany',
    region: 'EUROPE',
    legal_system: 'CIVIL_LAW',
    default_language: 'de-DE',
    supported_languages: ['de-DE', 'en-UK'],
    currency: 'EUR',
    date_format: 'DD.MM.YYYY',
    is_active: true
  },
  {
    id: '5',
    code: 'FR',
    name: 'France',
    short_name: 'France',
    region: 'EUROPE',
    legal_system: 'CIVIL_LAW',
    default_language: 'fr-FR',
    supported_languages: ['fr-FR', 'en-UK'],
    currency: 'EUR',
    date_format: 'DD/MM/YYYY',
    is_active: true
  },
  {
    id: '6',
    code: 'ES',
    name: 'Spain',
    short_name: 'Spain',
    region: 'EUROPE',
    legal_system: 'CIVIL_LAW',
    default_language: 'es-ES',
    supported_languages: ['es-ES', 'en-UK'],
    currency: 'EUR',
    date_format: 'DD/MM/YYYY',
    is_active: true
  },
  {
    id: '7',
    code: 'SG',
    name: 'Singapore',
    short_name: 'Singapore',
    region: 'APAC',
    legal_system: 'COMMON_LAW',
    default_language: 'en-US',
    supported_languages: ['en-US'],
    currency: 'SGD',
    date_format: 'DD/MM/YYYY',
    is_active: true
  },
  {
    id: '8',
    code: 'AU',
    name: 'Australia',
    short_name: 'Australia',
    region: 'APAC',
    legal_system: 'COMMON_LAW',
    default_language: 'en-UK',
    supported_languages: ['en-UK'],
    currency: 'AUD',
    date_format: 'DD/MM/YYYY',
    is_active: true
  }
];

export const mockLanguages: Language[] = [
  {
    code: 'en-UK',
    name: 'English (UK)',
    native_name: 'English (United Kingdom)',
    rtl: false,
    date_format: 'DD/MM/YYYY'
  },
  {
    code: 'en-US',
    name: 'English (US)',
    native_name: 'English (United States)',
    rtl: false,
    date_format: 'MM/DD/YYYY'
  },
  {
    code: 'de-DE',
    name: 'German',
    native_name: 'Deutsch',
    rtl: false,
    date_format: 'DD.MM.YYYY'
  },
  {
    code: 'fr-FR',
    name: 'French',
    native_name: 'Français',
    rtl: false,
    date_format: 'DD/MM/YYYY'
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    native_name: 'Español',
    rtl: false,
    date_format: 'DD/MM/YYYY'
  }
];

// Founders' Agreement Questionnaire (Template ID: 1)
export const mockFoundersQuestionnaire: Questionnaire = {
  template_id: '1',
  jurisdiction: 'UK',
  language: 'en-UK',
  mode: 'guided',
  total_questions: 12,
  estimated_time_minutes: 30,
  groups: [
    {
      code: 'founders',
      name: 'Founder Information',
      description: 'Details about each founder and their roles',
      order: 1,
      variables: [
        {
          var_code: 'founder_count',
          type: 'integer',
          display_name: 'Number of Founders',
          help_text: 'How many founders are part of this agreement?',
          validation: {
            required: true,
            minimum: 2,
            maximum: 5
          },
          ui_hint: 'select',
          default_value: 2,
          group: 'founders',
          display_order: 1
        },
        {
          var_code: 'founder_1_name',
          type: 'string',
          display_name: 'Founder 1 Full Name',
          help_text: 'Legal full name of the first founder',
          validation: {
            required: true,
            min_length: 2,
            max_length: 200
          },
          ui_hint: 'input',
          group: 'founders',
          display_order: 2
        },
        {
          var_code: 'founder_1_role',
          type: 'string',
          display_name: 'Founder 1 Role',
          help_text: 'Primary role or title (e.g., CEO, CTO)',
          validation: {
            required: true,
            min_length: 2,
            max_length: 100
          },
          ui_hint: 'input',
          group: 'founders',
          display_order: 3
        },
        {
          var_code: 'founder_2_name',
          type: 'string',
          display_name: 'Founder 2 Full Name',
          help_text: 'Legal full name of the second founder',
          validation: {
            required: true,
            min_length: 2,
            max_length: 200
          },
          ui_hint: 'input',
          group: 'founders',
          display_order: 4
        },
        {
          var_code: 'founder_2_role',
          type: 'string',
          display_name: 'Founder 2 Role',
          help_text: 'Primary role or title (e.g., CEO, CTO)',
          validation: {
            required: true,
            min_length: 2,
            max_length: 100
          },
          ui_hint: 'input',
          group: 'founders',
          display_order: 5
        }
      ]
    },
    {
      code: 'equity',
      name: 'Equity & Vesting',
      description: 'Equity distribution and vesting terms',
      order: 2,
      variables: [
        {
          var_code: 'founder_1_equity',
          type: 'integer',
          display_name: 'Founder 1 Equity Percentage',
          help_text: 'Percentage of equity allocated to Founder 1 (must total 100% across all founders)',
          validation: {
            required: true,
            minimum: 1,
            maximum: 99
          },
          ui_hint: 'input',
          group: 'equity',
          display_order: 6
        },
        {
          var_code: 'founder_2_equity',
          type: 'integer',
          display_name: 'Founder 2 Equity Percentage',
          help_text: 'Percentage of equity allocated to Founder 2',
          validation: {
            required: true,
            minimum: 1,
            maximum: 99
          },
          ui_hint: 'input',
          group: 'equity',
          display_order: 7
        },
        {
          var_code: 'vesting_period_years',
          type: 'integer',
          display_name: 'Vesting Period (Years)',
          help_text: 'Standard is 4 years for founder vesting',
          validation: {
            required: true,
            minimum: 2,
            maximum: 5
          },
          ui_hint: 'select',
          default_value: 4,
          group: 'equity',
          display_order: 8
        },
        {
          var_code: 'cliff_period_months',
          type: 'integer',
          display_name: 'Cliff Period (Months)',
          help_text: 'Period before vesting begins. Standard is 12 months (1 year cliff).',
          validation: {
            required: true,
            minimum: 0,
            maximum: 24
          },
          ui_hint: 'select',
          default_value: 12,
          group: 'equity',
          display_order: 9
        },
        {
          var_code: 'acceleration_on_exit',
          type: 'boolean',
          display_name: 'Single-Trigger Acceleration on Exit?',
          help_text: 'Should unvested equity accelerate if the company is acquired?',
          validation: {
            required: true
          },
          ui_hint: 'radio',
          default_value: false,
          group: 'equity',
          display_order: 10
        }
      ]
    },
    {
      code: 'company',
      name: 'Company Details',
      description: 'Basic company information',
      order: 3,
      variables: [
        {
          var_code: 'company_name',
          type: 'string',
          display_name: 'Company Name',
          help_text: 'Full legal name of the company (or intended company name)',
          validation: {
            required: true,
            min_length: 2,
            max_length: 200
          },
          ui_hint: 'input',
          group: 'company',
          display_order: 11
        },
        {
          var_code: 'effective_date',
          type: 'date',
          display_name: 'Effective Date',
          help_text: 'When should this agreement come into effect?',
          validation: {
            required: true
          },
          ui_hint: 'date_picker',
          default_value: 'today',
          group: 'company',
          display_order: 12
        }
      ]
    }
  ]
};

// Legacy NDA questionnaire for backward compatibility
export const mockNDAQuestionnaire = mockFoundersQuestionnaire;
