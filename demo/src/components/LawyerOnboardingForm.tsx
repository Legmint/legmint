'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  fullName: string;
  email: string;
  jurisdiction: string;
  licenseNumber: string;
  specializations: string[];
  languages: string[];
  bio: string;
  website?: string;
  phone?: string;
  termsAccepted: boolean;
}

interface DocumentUploads {
  license: File | null;
  insurance: File | null;
  identification: File | null;
}

const JURISDICTIONS = [
  { code: 'UK', name: 'United Kingdom' },
  { code: 'US-DE', name: 'United States - Delaware' },
  { code: 'US-CA', name: 'United States - California' },
  { code: 'US-NY', name: 'United States - New York' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'CZ', name: 'Czech Republic' },
];

const SPECIALIZATIONS = [
  'Corporate Law',
  'Contract Law',
  'Fundraising & Investment',
  'Employment Law',
  'Intellectual Property',
  'Privacy & Data Protection',
  'SaaS & Technology',
  'Real Estate',
  'Tax Law',
  'Compliance',
];

const LANGUAGES = [
  'English',
  'French',
  'German',
  'Spanish',
  'Czech',
  'Dutch',
  'Italian',
  'Polish',
];

export default function LawyerOnboardingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    jurisdiction: '',
    licenseNumber: '',
    specializations: [],
    languages: [],
    bio: '',
    website: '',
    phone: '',
    termsAccepted: false,
  });

  const [documents, setDocuments] = useState<DocumentUploads>({
    license: null,
    insurance: null,
    identification: null,
  });

  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [partnerId, setPartnerId] = useState<string | null>(null);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'specializations' | 'languages', item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleFileUpload = (type: keyof DocumentUploads, file: File) => {
    setDocuments((prev) => ({ ...prev, [type]: file }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.fullName &&
          formData.email &&
          formData.jurisdiction &&
          formData.licenseNumber
        );
      case 2:
        return !!(
          formData.specializations.length > 0 &&
          formData.languages.length > 0 &&
          formData.bio.length >= 50
        );
      case 3:
        return !!(documents.license && documents.insurance && documents.identification);
      case 4:
        return formData.termsAccepted;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    } else {
      setError('Please complete all required fields before continuing.');
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  const submitApplication = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Submit application
      const appResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/lawyers/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!appResponse.ok) {
        const errorData = await appResponse.json();
        throw new Error(errorData.message || 'Failed to submit application');
      }

      const appData = await appResponse.json();
      setApplicationId(appData.applicationId);
      setPartnerId(appData.partnerId);

      // Step 2: Upload documents
      const uploadPromises = Object.entries(documents).map(async ([type, file]) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', type);

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/lawyers/applications/${appData.applicationId}/documents`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${type} document`);
        }
      });

      await Promise.all(uploadPromises);

      // Success! Move to Stripe Connect step
      setCurrentStep(5);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStripeConnect = async () => {
    if (!partnerId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/lawyers/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId,
          returnUrl: `${window.location.origin}/lawyers/connect/success`,
          refreshUrl: `${window.location.origin}/lawyers/connect/refresh`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Stripe Connect link');
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {['Personal Info', 'Expertise', 'Documents', 'Terms', 'Connect'].map((label, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div
                className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                  currentStep > idx + 1
                    ? 'bg-green-500 text-white'
                    : currentStep === idx + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {currentStep > idx + 1 ? '✓' : idx + 1}
              </div>
              <p className="text-xs text-gray-600">{label}</p>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateFormData('fullName', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="Jane Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="jane.smith@lawfirm.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Jurisdiction *
              </label>
              <select
                value={formData.jurisdiction}
                onChange={(e) => updateFormData('jurisdiction', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">Select jurisdiction...</option>
                {JURISDICTIONS.map((j) => (
                  <option key={j.code} value={j.code}>
                    {j.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bar License Number *
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="SRA123456 or BAR-NY-12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="+44 20 1234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                placeholder="https://yourfirm.com"
              />
            </div>
          </div>

          <button
            onClick={handleNext}
            className="mt-6 w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Next: Expertise
          </button>
        </div>
      )}

      {/* Step 2: Expertise */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Your Expertise</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Specialization * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALIZATIONS.map((spec) => (
                  <label key={spec} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specializations.includes(spec)}
                      onChange={() => toggleArrayItem('specializations', spec)}
                      className="mr-2"
                    />
                    <span className="text-sm">{spec}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={() => toggleArrayItem('languages', lang)}
                      className="mr-2"
                    />
                    <span className="text-sm">{lang}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Bio * (Min. 50 characters)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => updateFormData('bio', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                rows={6}
                placeholder="Tell potential clients about your experience, specializations, and what makes you unique..."
              />
              <p className="text-sm text-gray-500 mt-1">{formData.bio.length} characters</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
              Next: Documents
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Document Uploads */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Supporting Documents</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bar License / Proof of Admission *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFileUpload('license', e.target.files[0])}
                className="w-full"
              />
              {documents.license && (
                <p className="text-sm text-green-600 mt-1">✓ {documents.license.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Liability Insurance *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFileUpload('insurance', e.target.files[0])}
                className="w-full"
              />
              {documents.insurance && (
                <p className="text-sm text-green-600 mt-1">✓ {documents.insurance.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Government-Issued ID *
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  e.target.files && handleFileUpload('identification', e.target.files[0])
                }
                className="w-full"
              />
              {documents.identification && (
                <p className="text-sm text-green-600 mt-1">✓ {documents.identification.name}</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                📄 All documents will be encrypted and stored securely. We only use them to verify
                your credentials.
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
            >
              Next: Terms
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Terms Acceptance */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Terms & Conditions</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-h-96 overflow-y-auto mb-6">
            <h3 className="font-semibold mb-2">Legmint Lawyer Partner Program Terms</h3>
            <p className="text-sm text-gray-700 mb-4">
              Please read these terms carefully before accepting.
            </p>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>1. Independent Contractor:</strong> You are an independent legal professional.
                This is not an employment relationship.
              </p>
              <p>
                <strong>2. Platform Fee:</strong> Legmint retains 15% of each completed client payment
                via Stripe Connect. You receive 85%.
              </p>
              <p>
                <strong>3. Professional Responsibility:</strong> You maintain full responsibility for
                your legal work and client relationships.
              </p>
              <p>
                <strong>4. Compliance:</strong> You must comply with all bar rules and professional
                conduct standards in your jurisdiction.
              </p>
              <p>
                <strong>5. Insurance:</strong> You must maintain professional liability insurance at
                all times.
              </p>
            </div>

            <a
              href="/lawyers/terms"
              target="_blank"
              className="text-blue-500 underline text-sm mt-4 inline-block"
            >
              Read full Terms for Lawyers →
            </a>
          </div>

          <label className="flex items-start">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
              className="mt-1 mr-3"
            />
            <span className="text-sm text-gray-700">
              I have read and agree to the{' '}
              <a href="/lawyers/terms" target="_blank" className="text-blue-500 underline">
                Terms for Lawyers
              </a>
              . I confirm that I am authorized to practice law in my jurisdiction and will comply
              with all professional conduct rules.
            </span>
          </label>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={submitApplication}
              disabled={isLoading || !formData.termsAccepted}
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Stripe Connect */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-3xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-gray-600">
              We've received your application and will review it within 2-3 business days.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Next Step: Connect Your Stripe Account</h3>
            <p className="text-sm text-gray-700 mb-4">
              To receive payments, you need to connect a Stripe account. This takes about 5 minutes
              and is required before you can accept clients.
            </p>
            <button
              onClick={handleStripeConnect}
              disabled={isLoading}
              className="bg-[#635BFF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#5147E5] disabled:bg-gray-400"
            >
              {isLoading ? 'Connecting...' : 'Connect Stripe Account'}
            </button>
          </div>

          <p className="text-sm text-gray-500">
            You'll receive an email once your application is approved. If you have questions, contact{' '}
            <a href="mailto:lawyers@legmint.com" className="text-blue-500 underline">
              lawyers@legmint.com
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
