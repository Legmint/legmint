'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LawyerApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    jurisdiction: '',
    licenseNumber: '',
    specializations: [] as string[],
    languages: [] as string[],
    bio: '',
    website: '',
    phone: '',
    termsAccepted: false,
  });

  const [files, setFiles] = useState<{
    license: File | null;
    insurance: File | null;
    identification: File | null;
  }>({
    license: null,
    insurance: null,
    identification: null,
  });

  const jurisdictions = [
    { code: 'UK', name: 'United Kingdom' },
    { code: 'US-DE', name: 'Delaware, USA' },
    { code: 'US-CA', name: 'California, USA' },
    { code: 'US-NY', name: 'New York, USA' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'CZ', name: 'Czech Republic' },
  ];

  const specializationOptions = [
    'Corporate Law',
    'Contract Law',
    'Fundraising',
    'Employment Law',
    'Intellectual Property',
    'SaaS Agreements',
    'Data Protection',
  ];

  const languageOptions = ['English', 'German', 'French', 'Czech', 'Spanish', 'Italian'];

  const toggleSpecialization = (spec: string) => {
    setFormData((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(spec)
        ? prev.specializations.filter((s) => s !== spec)
        : [...prev.specializations, spec],
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.jurisdiction) {
        setError('Please fill in all required fields');
        return false;
      }
    } else if (step === 2) {
      if (!formData.licenseNumber || !formData.bio || formData.specializations.length === 0) {
        setError('Please fill in all required fields and select at least one specialization');
        return false;
      }
    } else if (step === 3) {
      if (!files.license || !files.insurance || !files.identification) {
        setError('Please upload all required documents');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      setError('You must accept the terms to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Submit application
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/lawyers/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Application submission failed');
      }

      // Upload documents
      for (const [docType, file] of Object.entries(files)) {
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('documentType', docType);

          await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/lawyers/applications/${data.applicationId}/documents`,
            {
              method: 'POST',
              body: formData,
            },
          );
        }
      }

      // Success - redirect to success page
      router.push('/lawyers/apply/success');
    } catch (err: any) {
      setError(err.message || 'Application failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-indigo-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join Legmint Lawyer Network</h1>
          <p className="text-gray-600">
            Connect with startup founders and get paid for document reviews
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex justify-between mb-2">
            {['Profile', 'Credentials', 'Documents', 'Terms'].map((label, idx) => (
              <div key={idx} className="flex-1 text-center">
                <div
                  className={`text-sm font-medium ${step > idx + 1 ? 'text-green-600' : step === idx + 1 ? 'text-indigo-600' : 'text-gray-400'}`}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}`}
              />
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Step 1: Profile */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Email *
                  </label>
                  <input
                    type="email"
                    placeholder="jane@lawfirm.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Jurisdiction *
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.jurisdiction}
                    onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  >
                    <option value="">Select Jurisdiction</option>
                    {jurisdictions.map((j) => (
                      <option key={j.code} value={j.code}>
                        {j.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+44 20 1234 5678"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourfirm.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Credentials */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Credentials & Expertise</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bar License Number *
                  </label>
                  <input
                    type="text"
                    placeholder="SRA123456 or State Bar #12345"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Bio * (500 characters max)
                  </label>
                  <textarea
                    placeholder="Experienced corporate lawyer with 10+ years advising startups on fundraising, contracts, and compliance..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={4}
                    maxLength={500}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                  <div className="text-sm text-gray-500 text-right mt-1">
                    {formData.bio.length}/500
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations * (Select at least one)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {specializationOptions.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialization(spec)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          formData.specializations.includes(spec)
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          formData.languages.includes(lang)
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Upload Documents</h2>
              <p className="text-gray-600 mb-6">
                Please upload the following documents for verification. Accepted formats: PDF, JPG,
                PNG (max 5MB each)
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bar License / Certificate *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFiles({ ...files, license: e.target.files?.[0] || null })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {files.license && (
                    <p className="text-sm text-green-600 mt-1">✓ {files.license.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Liability Insurance *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFiles({ ...files, insurance: e.target.files?.[0] || null })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {files.insurance && (
                    <p className="text-sm text-green-600 mt-1">✓ {files.insurance.name}</p>
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
                      setFiles({ ...files, identification: e.target.files?.[0] || null })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  {files.identification && (
                    <p className="text-sm text-green-600 mt-1">✓ {files.identification.name}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Terms */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Terms & Conditions</h2>

              <div className="bg-gradient-to-b from-indigo-50 to-white rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-lg mb-4">Platform Fee Structure</h3>
                <ul className="list-disc ml-6 mb-6 space-y-2">
                  <li>
                    <strong>€30 fixed fee</strong> per initial document review referral
                  </li>
                  <li>
                    <strong>15% fee</strong> on any additional work billed through the platform
                  </li>
                  <li>Payments processed via Stripe Connect with instant transfers</li>
                  <li>You set your own base review rates (recommended: €200-300)</li>
                </ul>

                <h3 className="font-semibold text-lg mb-4">Your Responsibilities</h3>
                <ul className="list-disc ml-6 mb-6 space-y-2">
                  <li>Maintain active bar membership and professional liability insurance</li>
                  <li>Complete document reviews within 3-5 business days</li>
                  <li>Provide high-quality legal analysis with redlines and comments</li>
                  <li>Comply with your jurisdiction's rules on referral fees</li>
                  <li>Maintain client confidentiality and professional standards</li>
                </ul>

                <h3 className="font-semibold text-lg mb-4">Client Relationship</h3>
                <p className="mb-4 text-gray-700">
                  You maintain the attorney-client relationship with referred clients. Legmint acts
                  only as a referral service and does not provide legal services or establish
                  attorney-client relationships.
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  Full terms available at:{' '}
                  <a href="/legal/terms-lawyers" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms for Lawyers
                  </a>
                </p>
              </div>

              <label className="flex items-start mb-6">
                <input
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) =>
                    setFormData({ ...formData, termsAccepted: e.target.checked })
                  }
                  className="mt-1 mr-3 h-5 w-5"
                />
                <span className="text-sm text-gray-700">
                  I have read and accept the{' '}
                  <a href="/legal/terms-lawyers" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    Terms for Lawyers
                  </a>{' '}
                  and confirm that I am authorized to practice law in my jurisdiction with valid
                  professional liability insurance.
                </span>
              </label>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!formData.termsAccepted || loading}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-900 mb-2">What happens next?</h4>
          <ol className="text-sm text-indigo-800 space-y-1 ml-4 list-decimal">
            <li>We review your application and credentials (2-3 business days)</li>
            <li>You'll receive an email with your approval status</li>
            <li>Once approved, connect your Stripe account to receive payments</li>
            <li>Start receiving document review requests from verified users</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
