'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { mockTemplates } from '@/lib/mockData';
import {
  ClockIcon,
  StarIcon,
  TagIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function TemplateDetailsPage() {
  const params = useParams();
  const template = mockTemplates.find(t => t.id === params.id);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
            <p className="text-gray-600 mb-8">The requested template could not be found.</p>
            <Link href="/" className="btn-primary">
              Back to Templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'risk-badge risk-low';
      case 'MEDIUM':
        return 'risk-badge risk-medium';
      case 'HIGH':
        return 'risk-badge risk-high';
      default:
        return 'risk-badge risk-low';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'B2B':
        return 'bg-blue-100 text-blue-800';
      case 'B2C':
        return 'bg-green-100 text-green-800';
      case 'P2P':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sampleContent = `
# ${template.title}

This MUTUAL NON-DISCLOSURE AGREEMENT (this "Agreement") is made on [DATE] between [FIRST PARTY], a [ENTITY TYPE] registered under number [REGISTRATION] ("First Party") and [SECOND PARTY], a [ENTITY TYPE] registered under number [REGISTRATION] ("Second Party").

## 1. DEFINITIONS

For the purposes of this Agreement:

"Confidential Information" means technical data, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances or other business information disclosed by either party.

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

[Variables and conditional clauses will be populated based on your answers]
  `.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Templates
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Template Header */}
            <div className="card p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </span>
                  <span className={getRiskBadgeClass(template.min_risk_level)}>
                    {template.min_risk_level} Risk
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <StarIcon className="w-4 h-4 mr-1" />
                  {template.rating} ({template.usage_count} uses)
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{template.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{template.description}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <ClockIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">~{template.estimated_time_minutes} min</div>
                  <div className="text-xs text-gray-500">Est. Time</div>
                </div>
                <div className="text-center">
                  <ShieldCheckIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{template.complexity_score}/10</div>
                  <div className="text-xs text-gray-500">Complexity</div>
                </div>
                <div className="text-center">
                  <GlobeAltIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{template.jurisdiction_set.length}</div>
                  <div className="text-xs text-gray-500">Jurisdictions</div>
                </div>
                <div className="text-center">
                  <UsersIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{template.usage_count}</div>
                  <div className="text-xs text-gray-500">Generated</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Link
                  href={`/templates/${template.id}/generate`}
                  className="btn-primary flex-1 text-center"
                >
                  Start Questionnaire
                </Link>
                <button className="btn-secondary">
                  Preview Sample
                </button>
              </div>
            </div>

            {/* Use Cases */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Use Cases</h2>
              <ul className="space-y-2">
                {template.use_cases.map((useCase, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span className="text-gray-700">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Template Preview */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Template Preview</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {sampleContent}
                </pre>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <strong>Note:</strong> This is a sample preview. Variables and conditional clauses will be populated based on your specific answers during the questionnaire.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Template Info */}
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Information</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Supported Jurisdictions</div>
                  <div className="flex flex-wrap gap-2">
                    {template.jurisdiction_set.map((jurisdiction) => (
                      <span key={jurisdiction} className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        {jurisdiction}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Available Languages</div>
                  <div className="flex flex-wrap gap-2">
                    {template.supported_languages.map((language) => (
                      <span key={language} className="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Version</div>
                  <div className="text-sm text-gray-900">{template.version}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Last Updated</div>
                  <div className="text-sm text-gray-900">
                    {new Date(template.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div className="card p-6 mb-6 bg-amber-50 border-amber-200">
              <div className="flex items-start">
                <ShieldCheckIcon className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-800 mb-2">Important Legal Notice</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    This template generates legal documents for informational purposes only.
                    It does not constitute legal advice. All generated documents should be
                    reviewed by qualified legal counsel before use.
                  </p>
                </div>
              </div>
            </div>

            {/* What You'll Need */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Need</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Company details for all parties
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Contact information and addresses
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Agreement terms preferences
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Governing law choice
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  10-15 minutes of your time
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}