// Professional Network Types and Mock Data

export interface Lawyer {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
    title: string;
    firm_name?: string;
    profile_image?: string;
    bio: string;
    years_experience: number;
  };
  verification: {
    bar_admissions: BarAdmission[];
    verification_status: 'verified' | 'pending' | 'suspended';
    verification_date: string;
    next_review_date: string;
  };
  specializations: Specialization[];
  jurisdictions: {
    licensed: string[];
    collaboration: string[];
  };
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    next_available: string;
    timezone: string;
    working_hours: {
      start: string;
      end: string;
    };
  };
  pricing: {
    review_rate: number;
    modification_rate: number;
    hourly_rate: number;
    currency: string;
  };
  performance: {
    rating: number;
    total_reviews: number;
    completion_rate: number;
    average_turnaround_hours: number;
    response_time_minutes: number;
  };
  languages: string[];
  created_at: string;
  updated_at: string;
}

export interface BarAdmission {
  jurisdiction: string;
  bar_number: string;
  admission_date: string;
  status: 'active' | 'suspended' | 'inactive';
  verified_date: string;
}

export interface Specialization {
  area: string;
  sub_areas: string[];
  experience_years: number;
  certification?: string;
}

export interface LawyerService {
  id: string;
  lawyer_id: string;
  service_type: 'review' | 'modification' | 'full_service' | 'ongoing_support';
  template_categories: string[];
  pricing: {
    fixed_price?: number;
    hourly_rate?: number;
    minimum_fee?: number;
    currency: string;
  };
  turnaround: {
    min_hours: number;
    max_hours: number;
    rush_available: boolean;
    rush_multiplier?: number;
  };
  description: string;
  is_active: boolean;
}

export interface ServiceRequest {
  id: string;
  user_id: string;
  template_id: string;
  service_type: 'review' | 'modification' | 'full_service' | 'ongoing_support';
  status: 'pending' | 'matched' | 'in_progress' | 'completed' | 'cancelled';
  budget_range: {
    min: number;
    max: number;
    currency: string;
  };
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  requirements: string;
  jurisdiction_preference?: string;
  language_preference?: string;
  matched_lawyer_id?: string;
  created_at: string;
  updated_at: string;
}

// Mock Data
export const mockLawyers: Lawyer[] = [
  {
    id: 'lawyer-1',
    profile: {
      first_name: 'Sarah',
      last_name: 'Thompson',
      title: 'Senior Partner',
      firm_name: 'Thompson & Associates',
      profile_image: '/api/placeholder/64/64',
      bio: 'Specializing in commercial law and technology contracts with 15+ years experience in cross-border transactions.',
      years_experience: 15
    },
    verification: {
      bar_admissions: [
        {
          jurisdiction: 'UK',
          bar_number: 'SOL12345',
          admission_date: '2009-06-15',
          status: 'active',
          verified_date: '2025-01-15'
        },
        {
          jurisdiction: 'US-NY',
          bar_number: 'NY789123',
          admission_date: '2010-09-20',
          status: 'active',
          verified_date: '2025-01-15'
        }
      ],
      verification_status: 'verified',
      verification_date: '2025-01-15',
      next_review_date: '2026-01-15'
    },
    specializations: [
      {
        area: 'Commercial Law',
        sub_areas: ['Contract Law', 'Corporate Transactions', 'M&A'],
        experience_years: 15,
        certification: 'Chartered Legal Executive'
      },
      {
        area: 'Technology Law',
        sub_areas: ['SaaS Agreements', 'Data Protection', 'IP Licensing'],
        experience_years: 10
      }
    ],
    jurisdictions: {
      licensed: ['UK', 'US-NY'],
      collaboration: ['EU-BASE', 'US-DE', 'CA']
    },
    availability: {
      status: 'available',
      next_available: '2025-09-24T09:00:00Z',
      timezone: 'Europe/London',
      working_hours: {
        start: '09:00',
        end: '17:30'
      }
    },
    pricing: {
      review_rate: 250,
      modification_rate: 350,
      hourly_rate: 450,
      currency: 'GBP'
    },
    performance: {
      rating: 4.9,
      total_reviews: 187,
      completion_rate: 98.5,
      average_turnaround_hours: 8,
      response_time_minutes: 15
    },
    languages: ['en-UK', 'de-DE'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2025-09-20T14:30:00Z'
  },
  {
    id: 'lawyer-2',
    profile: {
      first_name: 'Michael',
      last_name: 'Rodriguez',
      title: 'Employment Law Specialist',
      firm_name: 'Rodriguez Legal Services',
      bio: 'Dedicated employment lawyer helping businesses navigate complex HR legal requirements and employee relations.',
      years_experience: 12
    },
    verification: {
      bar_admissions: [
        {
          jurisdiction: 'US-DE',
          bar_number: 'DE456789',
          admission_date: '2012-05-10',
          status: 'active',
          verified_date: '2025-02-01'
        }
      ],
      verification_status: 'verified',
      verification_date: '2025-02-01',
      next_review_date: '2026-02-01'
    },
    specializations: [
      {
        area: 'Employment Law',
        sub_areas: ['Employment Contracts', 'Workplace Policies', 'Termination'],
        experience_years: 12,
        certification: 'Employment Law Specialist'
      },
      {
        area: 'HR Compliance',
        sub_areas: ['FMLA', 'ADA Compliance', 'Wage & Hour'],
        experience_years: 8
      }
    ],
    jurisdictions: {
      licensed: ['US-DE'],
      collaboration: ['US-NY', 'US-CA', 'UK']
    },
    availability: {
      status: 'available',
      next_available: '2025-09-25T14:00:00Z',
      timezone: 'America/New_York',
      working_hours: {
        start: '08:30',
        end: '17:00'
      }
    },
    pricing: {
      review_rate: 200,
      modification_rate: 275,
      hourly_rate: 385,
      currency: 'USD'
    },
    performance: {
      rating: 4.7,
      total_reviews: 143,
      completion_rate: 96.8,
      average_turnaround_hours: 12,
      response_time_minutes: 25
    },
    languages: ['en-US', 'es-ES'],
    created_at: '2024-03-20T08:00:00Z',
    updated_at: '2025-09-18T16:45:00Z'
  },
  {
    id: 'lawyer-3',
    profile: {
      first_name: 'Elena',
      last_name: 'Müller',
      title: 'Data Protection Officer & Legal Counsel',
      firm_name: 'Müller Privacy Law',
      bio: 'GDPR and data protection specialist with extensive experience in EU compliance and cross-border data transfers.',
      years_experience: 8
    },
    verification: {
      bar_admissions: [
        {
          jurisdiction: 'DE',
          bar_number: 'DE987654',
          admission_date: '2016-09-01',
          status: 'active',
          verified_date: '2025-03-10'
        }
      ],
      verification_status: 'verified',
      verification_date: '2025-03-10',
      next_review_date: '2026-03-10'
    },
    specializations: [
      {
        area: 'Data Protection',
        sub_areas: ['GDPR Compliance', 'Privacy Policies', 'Data Processing Agreements'],
        experience_years: 8,
        certification: 'Certified Data Protection Officer'
      },
      {
        area: 'Technology Law',
        sub_areas: ['Cloud Computing', 'AI Governance', 'Cybersecurity'],
        experience_years: 6
      }
    ],
    jurisdictions: {
      licensed: ['DE'],
      collaboration: ['EU-BASE', 'UK', 'CH']
    },
    availability: {
      status: 'busy',
      next_available: '2025-09-26T10:00:00Z',
      timezone: 'Europe/Berlin',
      working_hours: {
        start: '09:00',
        end: '18:00'
      }
    },
    pricing: {
      review_rate: 180,
      modification_rate: 240,
      hourly_rate: 320,
      currency: 'EUR'
    },
    performance: {
      rating: 4.8,
      total_reviews: 95,
      completion_rate: 99.2,
      average_turnaround_hours: 6,
      response_time_minutes: 12
    },
    languages: ['de-DE', 'en-UK', 'cs-CZ'],
    created_at: '2024-06-01T12:00:00Z',
    updated_at: '2025-09-22T11:20:00Z'
  }
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'req-1',
    user_id: 'user-123',
    template_id: '2',
    service_type: 'review',
    status: 'pending',
    budget_range: {
      min: 200,
      max: 400,
      currency: 'GBP'
    },
    urgency: 'medium',
    requirements: 'Need review of SaaS agreement for EU GDPR compliance and UK jurisdiction.',
    jurisdiction_preference: 'UK',
    language_preference: 'en-UK',
    created_at: '2025-09-23T10:30:00Z',
    updated_at: '2025-09-23T10:30:00Z'
  },
  {
    id: 'req-2',
    user_id: 'user-456',
    template_id: '63',
    service_type: 'modification',
    status: 'matched',
    budget_range: {
      min: 300,
      max: 500,
      currency: 'USD'
    },
    urgency: 'high',
    requirements: 'Customize employment contract for senior executive with stock options and international assignments.',
    jurisdiction_preference: 'US-DE',
    language_preference: 'en-US',
    matched_lawyer_id: 'lawyer-2',
    created_at: '2025-09-22T14:15:00Z',
    updated_at: '2025-09-23T08:45:00Z'
  }
];

// Service tiers for the professional network
export const serviceTiers = [
  {
    id: 'review',
    name: 'Document Review',
    description: 'Legal accuracy verification and compliance checking',
    icon: '🔍',
    price_range: '£150 - £800',
    turnaround: '6-48 hours',
    features: [
      'Legal accuracy verification',
      'Jurisdiction compliance checking',
      'Risk assessment and mitigation',
      'Written recommendations',
      'Email support'
    ]
  },
  {
    id: 'modification',
    name: 'Custom Modifications',
    description: 'Template customization for specific business needs',
    icon: '✏️',
    price_range: '£200 - £1,500',
    turnaround: '1-5 business days',
    features: [
      'Template customization',
      'Jurisdiction-specific adaptations',
      'Industry-specific modifications',
      'Multiple revision rounds',
      'Phone consultation included'
    ]
  },
  {
    id: 'full_service',
    name: 'Full Legal Services',
    description: 'Complete legal representation and ongoing counsel',
    icon: '⚖️',
    price_range: '£200 - £600/hour',
    turnaround: 'Project-based',
    features: [
      'Complete legal representation',
      'Negotiation support and strategy',
      'Ongoing counsel and compliance',
      'Dispute resolution support',
      'Dedicated lawyer assignment'
    ]
  },
  {
    id: 'ongoing_support',
    name: 'Ongoing Support',
    description: 'Subscription-based legal monitoring and assistance',
    icon: '🤝',
    price_range: '£500 - £5,000/month',
    turnaround: 'Ongoing',
    features: [
      'Subscription-based legal monitoring',
      'Regular compliance reviews',
      'Priority support and emergency assistance',
      'Template library access with updates',
      'Quarterly legal health checks'
    ]
  }
];