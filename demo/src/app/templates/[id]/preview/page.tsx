'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/Header';
import { mockTemplates } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import {
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const template = mockTemplates.find(t => t.id === params.id);
  const { sessionAnswers } = useAppStore();

  const [showHighlights, setShowHighlights] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'docx' | 'pdf' | 'html'>('docx');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h1>
            <Link href="/" className="btn-primary">Back to Templates</Link>
          </div>
        </div>
      </div>
    );
  }

  // Mock generated document based on answers
  const generateDocumentContent = () => {
    const answers = sessionAnswers;
    const effectiveDate = answers.effective_date || new Date().toLocaleDateString();
    const firstParty = answers.first_party_name || '[FIRST PARTY NAME]';
    const secondParty = answers.second_party_name || '[SECOND PARTY NAME]';
    const firstPartyType = answers.first_party_type || 'limited company';
    const firstPartyReg = answers.first_party_registration || '[REGISTRATION NUMBER]';
    const confidentialityPeriod = answers.confidentiality_period_years || '5';

    return `
# MUTUAL NON-DISCLOSURE AGREEMENT

This MUTUAL NON-DISCLOSURE AGREEMENT (this "Agreement") is made on ${effectiveDate} between ${firstParty}, a ${firstPartyType} registered under number ${firstPartyReg} ("First Party") and ${secondParty}, a limited company ("Second Party").

## 1. DEFINITIONS

For the purposes of this Agreement:

"Confidential Information" means ${answers.confidential_info_types?.includes('technical') ? 'technical data, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances' : ''}${answers.confidential_info_types?.includes('financial') ? ', financial information, revenue data, cost structures, pricing strategies, business plans' : ''}${answers.confidential_info_types?.includes('commercial') ? ', commercial information, business strategies, market analysis, competitive intelligence' : ''}${answers.confidential_info_types?.includes('customer_data') ? ', customer information, client lists, customer preferences and requirements' : ''}${answers.confidential_info_types?.includes('personal_data') ? ', personal data as defined under applicable data protection laws' : ''}${answers.confidential_info_types?.includes('intellectual_property') ? ', intellectual property, patents, trademarks, copyrights, trade secrets' : ''} or other business information disclosed by either party.

## 2. CONFIDENTIALITY OBLIGATIONS

Each party agrees to:
(a) hold all Confidential Information in strict confidence and not disclose it to any third party without prior written consent;
(b) use the same degree of care to protect the Confidential Information as it uses to protect its own confidential information, but in no case less than reasonable care;
(c) use the Confidential Information solely for the purpose of evaluating potential business opportunities between the parties.

${answers.includes_personal_data ? `
## 3. DATA PROTECTION COMPLIANCE

Where Confidential Information includes personal data as defined under the General Data Protection Regulation (EU) 2016/679 ("GDPR"), the parties acknowledge that they will process such personal data in accordance with applicable data protection laws. Each party warrants that it has lawful basis for any disclosure of personal data and will ensure appropriate technical and organisational measures are in place to protect such data.
` : ''}

## ${answers.includes_personal_data ? '4' : '3'}. EXCEPTIONS

The obligations of confidentiality shall not apply to information that:
(a) is or becomes publicly available through no breach of this Agreement;
(b) was rightfully known by the receiving party prior to disclosure;
(c) is rightfully received from a third party without breach of any confidentiality obligation;
(d) is independently developed without use of or reference to the Confidential Information;
(e) is required to be disclosed by law or court order, provided that the receiving party gives reasonable advance notice to enable the disclosing party to seek protective measures.

## ${answers.includes_personal_data ? '5' : '4'}. TERM AND TERMINATION

This Agreement shall remain in effect for a period of ${confidentialityPeriod} years from the date first written above, unless terminated earlier by mutual written consent. The obligations of confidentiality shall survive termination of this Agreement and continue for the full confidentiality period.

## ${answers.includes_personal_data ? '6' : '5'}. GOVERNING LAW

${answers.governing_law === 'england_wales' ? 'This Agreement shall be governed by and construed in accordance with the laws of England and Wales.' : answers.governing_law === 'delaware' ? 'This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws principles.' : answers.governing_law === 'german' ? 'This Agreement shall be governed by and construed in accordance with the laws of Germany.' : 'This Agreement shall be governed by and construed in accordance with applicable law.'}

## ${answers.includes_personal_data ? '7' : '6'}. DISPUTE RESOLUTION

${answers.dispute_resolution === 'courts' ? `Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts of ${answers.governing_law === 'england_wales' ? 'England and Wales' : answers.governing_law === 'delaware' ? 'Delaware' : answers.governing_law === 'german' ? 'Germany' : 'the applicable jurisdiction'}.` : answers.dispute_resolution === 'arbitration' ? `Any disputes arising under this Agreement shall be resolved by binding arbitration in accordance with the rules of ${answers.governing_law === 'england_wales' ? 'the London Court of International Arbitration' : answers.governing_law === 'delaware' ? 'the American Arbitration Association' : 'the applicable arbitration institution'}.` : 'Any disputes shall first be subject to mediation, and if unsuccessful, then to binding arbitration as set forth above.'}

## IN WITNESS WHEREOF

The parties have executed this Agreement on the date first written above.

**FIRST PARTY:**                    **SECOND PARTY:**

_________________________          _________________________
${firstParty}                       ${secondParty}

By: _____________________          By: _____________________
Name:                              Name:
Title:                             Title:
Date:                              Date:
    `.trim();
  };

  const documentContent = generateDocumentContent();

  const handleDownload = async () => {
    setIsGenerating(true);

    // Simulate document generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create a blob with the document content
    const blob = new Blob([documentContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.code}-${new Date().toISOString().split('T')[0]}.${selectedFormat === 'html' ? 'html' : selectedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  const summary = {
    clauses_included: sessionAnswers.includes_personal_data ? 7 : 6,
    clauses_optional: sessionAnswers.includes_personal_data ? 1 : 0,
    variables_resolved: Object.keys(sessionAnswers).length,
    risk_assessment: template.min_risk_level as 'LOW' | 'MEDIUM' | 'HIGH'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href={`/templates/${template.id}/generate`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Questionnaire
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Preview</h1>
          <p className="text-gray-600">Review your document before downloading</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Document Preview */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              {/* Preview Controls */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowHighlights(!showHighlights)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      showHighlights
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <EyeIcon className="w-3 h-3 mr-1" />
                    Show Highlights
                  </button>
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                      showComments
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                    Show Comments
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  Generated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </div>
              </div>

              {/* Document Content */}
              <div className="prose max-w-none">
                <div className="bg-white border border-gray-200 rounded-lg p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {documentContent}
                </div>
              </div>

              {showComments && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800 mb-2">Legal Review Recommended</h4>
                      <p className="text-xs text-blue-700">
                        This document includes {sessionAnswers.includes_personal_data ? 'GDPR compliance clauses' : 'standard confidentiality provisions'}.
                        Consider having a qualified legal professional review the terms before execution,
                        particularly the governing law and dispute resolution clauses.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Summary */}
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Summary</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Template</div>
                  <div className="text-sm text-gray-900">{template.title}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Version</div>
                  <div className="text-sm text-gray-900">{template.version}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Your Choices</div>
                  <div className="text-sm text-gray-900 space-y-1">
                    <div>• {sessionAnswers.first_party_name ? 'Mutual disclosure' : 'Standard'} agreement</div>
                    <div>• {sessionAnswers.confidentiality_period_years || '5'}-year term</div>
                    {sessionAnswers.includes_personal_data && <div>• GDPR compliance included</div>}
                    <div>• {sessionAnswers.governing_law === 'england_wales' ? 'UK' : sessionAnswers.governing_law === 'delaware' ? 'Delaware' : 'German'} governing law</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Clause Breakdown</div>
                  <div className="text-sm text-gray-900 space-y-1">
                    <div>• Required: {summary.clauses_included}</div>
                    <div>• Optional: {summary.clauses_optional}</div>
                    {sessionAnswers.includes_personal_data && <div>• GDPR-specific: 1</div>}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Risk Assessment</div>
                  <div className={`text-sm font-medium ${
                    summary.risk_assessment === 'LOW' ? 'text-green-600' :
                    summary.risk_assessment === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {summary.risk_assessment} - Review with legal counsel
                  </div>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Document</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Choose Format</div>
                  <div className="space-y-2">
                    {[
                      { value: 'docx', label: 'Microsoft Word (.docx)', desc: 'Editable format' },
                      { value: 'pdf', label: 'PDF Document (.pdf)', desc: 'Print-ready format' },
                      { value: 'html', label: 'Web Page (.html)', desc: 'Web viewing' }
                    ].map((format) => (
                      <label key={format.value} className="flex items-start cursor-pointer">
                        <input
                          type="radio"
                          name="format"
                          value={format.value}
                          checked={selectedFormat === format.value}
                          onChange={(e) => setSelectedFormat(e.target.value as any)}
                          className="mt-1 border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{format.label}</div>
                          <div className="text-xs text-gray-500">{format.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include generation metadata</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Add "Review Required" watermark</span>
                  </label>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                      Download Document
                    </>
                  )}
                </button>

                <div className="text-xs text-gray-500 text-center">
                  🔒 Downloads expire after 7 days
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="text-amber-600 mr-2">1.</span>
                  <span className="text-gray-700">Review with qualified legal counsel</span>
                </div>
                <div className="flex items-start">
                  <span className="text-amber-600 mr-2">2.</span>
                  <span className="text-gray-700">Make any necessary modifications</span>
                </div>
                <div className="flex items-start">
                  <span className="text-amber-600 mr-2">3.</span>
                  <span className="text-gray-700">Have both parties sign the agreement</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rate your experience:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="text-gray-300 hover:text-yellow-400">
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}