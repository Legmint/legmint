export interface Template {
  id: string;
  code: string;
  title: string;
  description: string;
  category: 'B2B' | 'B2C' | 'P2P' | 'Employment' | 'Real Estate' | 'Compliance' | 'Dispute Resolution' | 'Industry-Specific' | 'Founding' | 'Fundraising' | 'IP' | 'Commercial';
  jurisdiction_set: string[];
  supported_languages: string[];
  min_risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  complexity_score: number;
  estimated_time_minutes: number;
  version: string;
  tags: string[];
  usage_count: number;
  rating: number;
  updated_at: string;
  use_cases: string[];
  related_templates: string[];
}

export interface Variable {
  var_code: string;
  type: string;
  display_name: string;
  help_text: string;
  placeholder?: string;
  validation: {
    required: boolean;
    min_length?: number;
    max_length?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    enum_values?: Array<{
      value: string;
      label: string;
    }>;
  };
  ui_hint: string;
  default_value?: any;
  group: string;
  display_order: number;
  dependencies?: any;
}

export interface QuestionGroup {
  code: string;
  name: string;
  description: string;
  order: number;
  variables: Variable[];
}

export interface Questionnaire {
  template_id: string;
  jurisdiction: string;
  language: string;
  mode: 'guided' | 'professional';
  groups: QuestionGroup[];
  total_questions: number;
  estimated_time_minutes: number;
}

export interface Session {
  id: string;
  template_id: string;
  jurisdiction: string;
  language: string;
  status: 'active' | 'completed' | 'expired';
  answers: Record<string, any>;
  validation_errors: ValidationError[];
  progress: {
    completed_variables: number;
    total_variables: number;
    percentage: number;
  };
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
  details?: any;
}

export interface DocumentPreview {
  session_id: string;
  content: string;
  summary: {
    clauses_included: number;
    clauses_optional: number;
    variables_resolved: number;
    risk_assessment: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  metadata: {
    generated_at: string;
    word_count: number;
    page_count: number;
  };
}

export interface GeneratedDocument {
  id: string;
  session_id: string;
  format: 'docx' | 'pdf' | 'html';
  filename: string;
  size_bytes: number;
  download_url: string;
  expires_at: string;
  generated_at: string;
}

export interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  short_name: string;
  region: string;
  legal_system: string;
  default_language: string;
  supported_languages: string[];
  currency: string;
  date_format: string;
  is_active: boolean;
}

export interface Language {
  code: string;
  name: string;
  native_name: string;
  rtl: boolean;
  date_format: string;
}