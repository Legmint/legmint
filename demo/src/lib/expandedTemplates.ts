import { Template } from './types';

export const expandedTemplates: Template[] = [
  // B2B - Commercial Contracts (12 templates)
  {
    id: '1',
    code: 'msa-v1',
    title: 'Master Service Agreement',
    description: 'Comprehensive framework agreement for ongoing business relationships with flexible terms and governance.',
    category: 'B2B',
    jurisdiction_set: ['UK', 'US-DE', 'EU-BASE', 'AU', 'CA'],
    supported_languages: ['en-UK', 'en-US', 'de-DE', 'cs-CZ'],
    min_risk_level: 'HIGH',
    complexity_score: 8,
    estimated_time_minutes: 35,
    version: '1.0.0',
    tags: ['msa', 'framework', 'ongoing-relationship', 'governance'],
    usage_count: 1234,
    rating: 4.8,
    updated_at: '2025-09-15T10:30:00Z',
    use_cases: [
      'IT services and consulting relationships',
      'Multi-project vendor arrangements',
      'Long-term professional services',
      'Complex outsourcing agreements'
    ],
    related_templates: ['2', '3', '6']
  },
  {
    id: '2',
    code: 'saas-agreement-v1',
    title: 'Software as a Service (SaaS) Agreement',
    description: 'Cloud-based software licensing with subscription terms, data protection, and service level agreements.',
    category: 'B2B',
    jurisdiction_set: ['UK', 'US-DE', 'EU-BASE'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'HIGH',
    complexity_score: 7,
    estimated_time_minutes: 30,
    version: '1.0.0',
    tags: ['saas', 'cloud', 'subscription', 'sla'],
    usage_count: 892,
    rating: 4.7,
    updated_at: '2025-09-14T14:20:00Z',
    use_cases: [
      'Enterprise software licensing',
      'Cloud platform services',
      'API service agreements',
      'Multi-tenant SaaS platforms'
    ],
    related_templates: ['1', '4', '45']
  },
  {
    id: '3',
    code: 'professional-services-v1',
    title: 'Professional Services Agreement',
    description: 'Tailored agreement for consulting, advisory, and professional service engagements.',
    category: 'B2B',
    jurisdiction_set: ['UK', 'US-DE', 'EU-BASE', 'AU', 'CA'],
    supported_languages: ['en-UK', 'en-US', 'de-DE', 'cs-CZ'],
    min_risk_level: 'MEDIUM',
    complexity_score: 6,
    estimated_time_minutes: 25,
    version: '1.0.0',
    tags: ['consulting', 'professional', 'advisory', 'expertise'],
    usage_count: 567,
    rating: 4.6,
    updated_at: '2025-09-13T11:15:00Z',
    use_cases: [
      'Management consulting projects',
      'Legal and financial advisory',
      'Technical consulting services',
      'Strategy and transformation'
    ],
    related_templates: ['1', '6', '123']
  },
  {
    id: '4',
    code: 'distribution-agreement-v1',
    title: 'Distribution Agreement',
    description: 'Channel partnership for product distribution with territory rights and performance obligations.',
    category: 'B2B',
    jurisdiction_set: ['UK', 'US-DE', 'EU-BASE'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'HIGH',
    complexity_score: 8,
    estimated_time_minutes: 40,
    version: '1.0.0',
    tags: ['distribution', 'channel', 'territory', 'reseller'],
    usage_count: 345,
    rating: 4.5,
    updated_at: '2025-09-12T16:45:00Z',
    use_cases: [
      'Product distribution networks',
      'Regional sales partnerships',
      'Channel partner agreements',
      'International market expansion'
    ],
    related_templates: ['5', '8', '14']
  },
  {
    id: '5',
    code: 'reseller-agreement-v1',
    title: 'Reseller Agreement',
    description: 'Authorized reseller terms with pricing, support obligations, and brand guidelines.',
    category: 'B2B',
    jurisdiction_set: ['UK', 'US-DE', 'EU-BASE', 'AU'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'MEDIUM',
    complexity_score: 6,
    estimated_time_minutes: 22,
    version: '1.0.0',
    tags: ['reseller', 'authorized', 'pricing', 'brand'],
    usage_count: 234,
    rating: 4.4,
    updated_at: '2025-09-11T09:30:00Z',
    use_cases: [
      'Technology reseller programs',
      'Product retail partnerships',
      'Value-added reseller (VAR) agreements',
      'Brand authorization contracts'
    ],
    related_templates: ['4', '8', '15']
  },

  // B2C - Sales & Services (8 templates)
  {
    id: '25',
    code: 'terms-sale-goods-v1',
    title: 'Terms of Sale (Goods)',
    description: 'Consumer-friendly terms for online and retail sales with clear rights and obligations.',
    category: 'B2C',
    jurisdiction_set: ['UK', 'EU-BASE', 'AU'],
    supported_languages: ['en-UK', 'de-DE', 'cs-CZ'],
    min_risk_level: 'LOW',
    complexity_score: 3,
    estimated_time_minutes: 12,
    version: '1.0.0',
    tags: ['consumer', 'retail', 'e-commerce', 'goods'],
    usage_count: 1567,
    rating: 4.6,
    updated_at: '2025-09-16T15:20:00Z',
    use_cases: [
      'Online retail stores',
      'E-commerce platforms',
      'Physical goods marketplaces',
      'Consumer product sales'
    ],
    related_templates: ['26', '27', '30']
  },
  {
    id: '26',
    code: 'terms-sale-services-v1',
    title: 'Terms of Sale (Services)',
    description: 'Service provider terms with performance standards and consumer protection compliance.',
    category: 'B2C',
    jurisdiction_set: ['UK', 'EU-BASE', 'US-DE'],
    supported_languages: ['en-UK', 'en-US', 'de-DE'],
    min_risk_level: 'LOW',
    complexity_score: 4,
    estimated_time_minutes: 15,
    version: '1.0.0',
    tags: ['services', 'consumer', 'performance', 'protection'],
    usage_count: 987,
    rating: 4.5,
    updated_at: '2025-09-15T12:10:00Z',
    use_cases: [
      'Professional services to consumers',
      'Home services and maintenance',
      'Personal training and coaching',
      'Educational and training services'
    ],
    related_templates: ['25', '28', '50']
  },

  // P2P - Personal Finance (5 templates)
  {
    id: '43',
    code: 'loan-simple-p2p-v1',
    title: 'Simple Loan Agreement (Personal)',
    description: 'Straightforward personal loan terms between individuals with flexible repayment options.',
    category: 'P2P',
    jurisdiction_set: ['UK', 'US-DE', 'AU'],
    supported_languages: ['en-UK', 'en-US'],
    min_risk_level: 'MEDIUM',
    complexity_score: 4,
    estimated_time_minutes: 12,
    version: '1.0.0',
    tags: ['loan', 'personal', 'repayment', 'individuals'],
    usage_count: 456,
    rating: 4.3,
    updated_at: '2025-09-14T08:45:00Z',
    use_cases: [
      'Family financial assistance',
      'Personal loans between friends',
      'Small business startup funding',
      'Emergency financial support'
    ],
    related_templates: ['44', '45', '47']
  },

  // Employment & HR (20 templates)
  {
    id: '63',
    code: 'employment-contract-standard-v1',
    title: 'Standard Employment Contract',
    description: 'Comprehensive employment agreement with all statutory requirements and benefits.',
    category: 'Employment',
    jurisdiction_set: ['UK', 'EU-BASE', 'AU'],
    supported_languages: ['en-UK', 'de-DE', 'cs-CZ'],
    min_risk_level: 'MEDIUM',
    complexity_score: 6,
    estimated_time_minutes: 25,
    version: '1.0.0',
    tags: ['employment', 'contract', 'statutory', 'benefits'],
    usage_count: 1890,
    rating: 4.7,
    updated_at: '2025-09-16T10:15:00Z',
    use_cases: [
      'Full-time employee onboarding',
      'Management position contracts',
      'Professional role agreements',
      'Statutory compliant hiring'
    ],
    related_templates: ['64', '65', '70']
  },

  // Additional key templates to showcase variety
  {
    id: '99',
    code: 'franchise-agreement-v1',
    title: 'Franchise Agreement',
    description: 'Complete franchising framework with territory rights, brand standards, and operational requirements.',
    category: 'Industry-Specific',
    jurisdiction_set: ['UK', 'US-DE', 'AU'],
    supported_languages: ['en-UK', 'en-US'],
    min_risk_level: 'HIGH',
    complexity_score: 9,
    estimated_time_minutes: 45,
    version: '1.0.0',
    tags: ['franchise', 'territory', 'brand', 'operations'],
    usage_count: 123,
    rating: 4.8,
    updated_at: '2025-09-10T14:30:00Z',
    use_cases: [
      'Restaurant franchise operations',
      'Retail franchise networks',
      'Service franchise systems',
      'Brand licensing arrangements'
    ],
    related_templates: ['100', '15', '4']
  },
  {
    id: '120',
    code: 'gdpr-dpa-v1',
    title: 'GDPR Data Processing Agreement',
    description: 'EU General Data Protection Regulation compliant data processing terms with audit rights.',
    category: 'Compliance',
    jurisdiction_set: ['EU-BASE', 'UK'],
    supported_languages: ['en-UK', 'de-DE', 'cs-CZ'],
    min_risk_level: 'HIGH',
    complexity_score: 7,
    estimated_time_minutes: 30,
    version: '1.0.0',
    tags: ['gdpr', 'data-protection', 'privacy', 'compliance'],
    usage_count: 678,
    rating: 4.9,
    updated_at: '2025-09-15T16:20:00Z',
    use_cases: [
      'Third-party data processing services',
      'Cloud service provider agreements',
      'Marketing service data handling',
      'HR outsourcing data protection'
    ],
    related_templates: ['121', '122', '2']
  },
  {
    id: '140',
    code: 'settlement-agreement-v1',
    title: 'Settlement Agreement',
    description: 'Dispute resolution through negotiated settlement with mutual release and confidentiality.',
    category: 'Dispute Resolution',
    jurisdiction_set: ['UK', 'US-DE', 'AU'],
    supported_languages: ['en-UK', 'en-US'],
    min_risk_level: 'HIGH',
    complexity_score: 7,
    estimated_time_minutes: 35,
    version: '1.0.0',
    tags: ['settlement', 'dispute', 'release', 'confidentiality'],
    usage_count: 234,
    rating: 4.6,
    updated_at: '2025-09-12T11:45:00Z',
    use_cases: [
      'Commercial dispute resolution',
      'Employment dispute settlements',
      'Contract breach resolutions',
      'Intellectual property disputes'
    ],
    related_templates: ['141', '142', '63']
  }
];

// Template categories for better organization
export const templateCategories = [
  {
    id: 'B2B',
    name: 'Business-to-Business',
    description: 'Commercial contracts and business relationships',
    icon: '🏢',
    count: 45,
    subcategories: [
      'Commercial Contracts',
      'Procurement & Supply Chain',
      'Intellectual Property',
      'Partnerships & Joint Ventures',
      'Corporate Governance',
      'Finance & Investment'
    ]
  },
  {
    id: 'B2C',
    name: 'Business-to-Consumer',
    description: 'Consumer-facing terms and sales agreements',
    icon: '🛒',
    count: 25,
    subcategories: [
      'Sales & Services',
      'Digital Products & Platforms',
      'Consumer Rights & Protection',
      'Warranties & Returns',
      'Subscription & Membership'
    ]
  },
  {
    id: 'P2P',
    name: 'Person-to-Person',
    description: 'Individual agreements and personal contracts',
    icon: '🤝',
    count: 18,
    subcategories: [
      'Personal Finance',
      'Property & Asset Sharing',
      'Cohabitation & Family',
      'Personal Services',
      'Creative Collaborations'
    ]
  },
  {
    id: 'Employment',
    name: 'Employment & HR',
    description: 'Workplace contracts and HR policies',
    icon: '👥',
    count: 20,
    subcategories: [
      'Employment Contracts',
      'Consultancy & Freelance',
      'Policies & Procedures',
      'Termination & Separation'
    ]
  },
  {
    id: 'Real Estate',
    name: 'Real Estate & Construction',
    description: 'Property transactions and construction contracts',
    icon: '🏠',
    count: 15,
    subcategories: [
      'Residential Leases',
      'Commercial Property',
      'Purchase & Sale',
      'Construction & Development'
    ]
  },
  {
    id: 'Compliance',
    name: 'Compliance & Regulatory',
    description: 'Regulatory compliance and data protection',
    icon: '⚖️',
    count: 12,
    subcategories: [
      'Data Protection',
      'Financial Compliance',
      'Industry-Specific Compliance'
    ]
  },
  {
    id: 'Dispute Resolution',
    name: 'Dispute Resolution',
    description: 'Settlement and arbitration agreements',
    icon: '🤲',
    count: 8,
    subcategories: [
      'Settlement Agreements',
      'Mediation & Arbitration',
      'Enforcement Actions'
    ]
  },
  {
    id: 'Industry-Specific',
    name: 'Industry-Specific',
    description: 'Specialized industry contracts',
    icon: '🏭',
    count: 15,
    subcategories: [
      'Technology & Software',
      'Creative & Media',
      'Healthcare & Life Sciences',
      'Franchise & Licensing'
    ]
  }
];