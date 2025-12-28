'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const INDUSTRIES = [
  'Technology / SaaS',
  'Financial Services',
  'Healthcare',
  'E-commerce / Retail',
  'Manufacturing',
  'Professional Services',
  'Real Estate',
  'Media / Entertainment',
  'Education',
  'Non-profit',
  'Other',
];

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];

const USE_CASES = [
  'Document Generation',
  'Contract Review',
  'Compliance & GDPR',
  'HR & Employment',
  'Corporate Governance',
  'Fundraising & Investment',
  'Other',
];

const JURISDICTIONS = [
  { code: 'UK', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'US-DE', name: 'United States (Delaware)' },
  { code: 'US-CA', name: 'United States (California)' },
  { code: 'EU', name: 'European Union (General)' },
];

const TIMEZONES = [
  'Europe/London (GMT)',
  'Europe/Berlin (CET)',
  'Europe/Prague (CET)',
  'America/New_York (EST)',
  'America/Los_Angeles (PST)',
  'Asia/Singapore (SGT)',
];

export default function EnterpriseApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan') === 'ultra' ? 'enterprise-ultra' : 'enterprise';
  const isUltra = planType === 'enterprise-ultra';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    planType,
    // Company
    companyName: '',
    country: '',
    registrationNumber: '',
    website: '',
    industry: '',
    companySize: '',
    // Contact
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    // Use Case
    useCases: [] as string[],
    estimatedMonthlyDocuments: '',
    jurisdictions: [] as string[],
    useCaseDescription: '',
    // Fast Track
    linkedinUrl: '',
    referralSource: '',
    hasLegalCounsel: false,
    isPubliclyListed: false,
    // Ultra specific
    accountManagerTimezone: '',
    whiteLabelRequired: false,
    whiteLabelDescription: '',
    integrationRequirements: '',
    expectedUserCount: '',
    // Declarations
    authorizedSignatory: false,
    notSanctioned: false,
    understandsAiDisclaimer: false,
    agreesToTerms: false,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: 'useCases' | 'jurisdictions', value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return !!(formData.companyName && formData.country && formData.industry && formData.companySize);
      case 2:
        return !!(formData.contactName && formData.contactTitle && formData.contactEmail);
      case 3:
        return formData.useCases.length > 0 && formData.jurisdictions.length > 0;
      case 4:
        return formData.authorizedSignatory && formData.notSanctioned && formData.understandsAiDisclaimer && formData.agreesToTerms;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      setError('');
    } else {
      setError('Please complete all required fields before continuing.');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      setError('Please accept all declarations to submit your application.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/enterprise/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expectedUserCount: formData.expectedUserCount ? parseInt(formData.expectedUserCount) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit application');
      }

      router.push('/enterprise/apply/success');
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm mb-4 inline-block">
            ← Back to Pricing
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Apply for {isUltra ? 'Enterprise Ultra' : 'Enterprise'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isUltra ? '€6,500/month • Unlimited legal consultations • White-label solution' : '€3,500/month • 10 hours legal consultation • Priority support'}
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Most applications are reviewed within 24 hours.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {['Company', 'Contact', 'Use Case', 'Review'].map((label, idx) => (
            <div key={label} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step > idx + 1
                    ? 'bg-emerald-600 text-white'
                    : step === idx + 1
                    ? isUltra ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className={`ml-2 text-sm ${step === idx + 1 ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                {label}
              </span>
              {idx < 3 && <div className="w-12 lg:w-24 h-0.5 mx-4 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Legal Name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Acme Corporation Ltd"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country of Incorporation *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select country</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="United States">United States</option>
                    <option value="France">France</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Other EU">Other EU Country</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => updateField('registrationNumber', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g., 12345678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size *</label>
                  <select
                    value={formData.companySize}
                    onChange={(e) => updateField('companySize', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select size</option>
                    {COMPANY_SIZES.map((size) => (
                      <option key={size} value={size}>{size} employees</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Primary Contact</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateField('contactName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={formData.contactTitle}
                    onChange={(e) => updateField('contactTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    placeholder="Head of Legal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="john@company.com"
                />
                <p className="text-xs text-gray-500 mt-1">Please use your company email address</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="+44 20 1234 5678"
                />
              </div>

              {/* Fast Track Options */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Fast-Track Verification (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">LinkedIn Company Page</label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) => updateField('linkedinUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.hasLegalCounsel}
                        onChange={(e) => updateField('hasLegalCounsel', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">We have existing legal counsel</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPubliclyListed}
                        onChange={(e) => updateField('isPubliclyListed', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700">Publicly listed company</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Use Case */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">How will you use Legmint?</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Primary Use Cases *</label>
                <div className="flex flex-wrap gap-2">
                  {USE_CASES.map((useCase) => (
                    <button
                      key={useCase}
                      type="button"
                      onClick={() => toggleArrayField('useCases', useCase)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        formData.useCases.includes(useCase)
                          ? isUltra ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {useCase}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Jurisdictions Needed *</label>
                <div className="flex flex-wrap gap-2">
                  {JURISDICTIONS.map((jur) => (
                    <button
                      key={jur.code}
                      type="button"
                      onClick={() => toggleArrayField('jurisdictions', jur.code)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        formData.jurisdictions.includes(jur.code)
                          ? isUltra ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {jur.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Monthly Documents</label>
                <select
                  value={formData.estimatedMonthlyDocuments}
                  onChange={(e) => updateField('estimatedMonthlyDocuments', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select volume</option>
                  <option value="<50">Less than 50</option>
                  <option value="50-200">50 - 200</option>
                  <option value="200-500">200 - 500</option>
                  <option value="500+">500+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tell us more about your needs
                  <span className="text-gray-400 font-normal ml-1">(optional, max 300 characters)</span>
                </label>
                <textarea
                  value={formData.useCaseDescription}
                  onChange={(e) => updateField('useCaseDescription', e.target.value.slice(0, 300))}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Describe how your team plans to use Legmint..."
                />
                <p className="text-xs text-gray-500 mt-1">{formData.useCaseDescription.length}/300</p>
              </div>

              {/* Enterprise Ultra specific fields */}
              {isUltra && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium text-purple-900 mb-4">Enterprise Ultra Options</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Account Manager Timezone</label>
                      <select
                        value={formData.accountManagerTimezone}
                        onChange={(e) => updateField('accountManagerTimezone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select timezone</option>
                        {TIMEZONES.map((tz) => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.whiteLabelRequired}
                          onChange={(e) => updateField('whiteLabelRequired', e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">I'm interested in white-label solution</span>
                      </label>
                      {formData.whiteLabelRequired && (
                        <textarea
                          value={formData.whiteLabelDescription}
                          onChange={(e) => updateField('whiteLabelDescription', e.target.value)}
                          rows={2}
                          className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="Describe your white-label requirements..."
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Integration Requirements</label>
                      <textarea
                        value={formData.integrationRequirements}
                        onChange={(e) => updateField('integrationRequirements', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="API, SSO, HRIS connections..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Number of Users</label>
                      <input
                        type="number"
                        value={formData.expectedUserCount}
                        onChange={(e) => updateField('expectedUserCount', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., 25"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Declarations */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review & Submit</h2>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Plan:</span>
                    <span className="ml-2 font-medium">{isUltra ? 'Enterprise Ultra' : 'Enterprise'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Company:</span>
                    <span className="ml-2 font-medium">{formData.companyName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Contact:</span>
                    <span className="ml-2 font-medium">{formData.contactName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium">{formData.contactEmail}</span>
                  </div>
                </div>
              </div>

              {/* Declarations */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Required Declarations</h3>

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.authorizedSignatory}
                    onChange={(e) => updateField('authorizedSignatory', e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm I am authorized to enter agreements on behalf of this company
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.notSanctioned}
                    onChange={(e) => updateField('notSanctioned', e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm this company is not subject to sanctions or export restrictions
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.understandsAiDisclaimer}
                    onChange={(e) => updateField('understandsAiDisclaimer', e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    I understand Legmint provides AI-assisted legal tools, not regulated legal advice
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.agreesToTerms}
                    onChange={(e) => updateField('agreesToTerms', e.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/legal/terms" className="text-emerald-600 hover:underline" target="_blank">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/legal/privacy" className="text-emerald-600 hover:underline" target="_blank">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Referral Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                <select
                  value={formData.referralSource}
                  onChange={(e) => updateField('referralSource', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select option</option>
                  <option value="Google Search">Google Search</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral from colleague</option>
                  <option value="Conference/Event">Conference or Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
                  isUltra
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50 ${
                  isUltra
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>

        {/* Trust Message */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your information is secure. We review all applications personally.
        </p>
      </div>
    </div>
  );
}
