'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import QuestionnaireForm from '@/components/QuestionnaireForm';
import DisclaimerModal from '@/components/DisclaimerModal';
import { mockTemplates, mockNDAQuestionnaire, mockJurisdictions, mockLanguages } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  LanguageIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function GeneratePage() {
  const params = useParams();
  const router = useRouter();
  const template = mockTemplates.find(t => t.id === params.id);

  const {
    showDisclaimer,
    disclaimerAccepted,
    setShowDisclaimer,
    setDisclaimerAccepted,
    resetSession,
    sessionAnswers
  } = useAppStore();

  const [selectedJurisdiction, setSelectedJurisdiction] = useState('UK');
  const [selectedLanguage, setSelectedLanguage] = useState('en-UK');
  const [mode, setMode] = useState<'guided' | 'professional'>('guided');
  const [step, setStep] = useState<'setup' | 'questionnaire' | 'preview'>('setup');

  useEffect(() => {
    // Reset session when component mounts
    resetSession();
  }, [resetSession]);

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

  const handleStartQuestionnaire = () => {
    if (!disclaimerAccepted) {
      setShowDisclaimer(true);
    } else {
      setStep('questionnaire');
    }
  };

  const handleDisclaimerAccept = () => {
    setDisclaimerAccepted(true);
    setShowDisclaimer(false);
    setStep('questionnaire');
  };

  const handleQuestionnaireComplete = (answers: Record<string, any>) => {
    // In a real app, this would call the API to generate the document
    console.log('Questionnaire completed with answers:', answers);
    router.push(`/templates/${template.id}/preview`);
  };

  const availableJurisdictions = mockJurisdictions.filter(j =>
    template.jurisdiction_set.includes(j.code)
  );

  const availableLanguages = mockLanguages.filter(l =>
    template.supported_languages.includes(l.code)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href={`/templates/${template.id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Template Details
          </Link>
        </div>

        {step === 'setup' && (
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Generate Your Document</h1>
              <p className="text-lg text-gray-600">
                {template.title}
              </p>
            </div>

            {/* Setup Form */}
            <div className="card p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Setup Your Document</h2>

              <div className="space-y-6">
                {/* Experience Level */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Your Experience Level</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                        mode === 'guided'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setMode('guided')}
                    >
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="mode"
                          checked={mode === 'guided'}
                          onChange={() => setMode('guided')}
                          className="border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 font-medium text-gray-900">🎯 Guided Mode</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Plain language questions with explanations. Best for business owners and non-lawyers.
                      </p>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                        mode === 'professional'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => setMode('professional')}
                    >
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          name="mode"
                          checked={mode === 'professional'}
                          onChange={() => setMode('professional')}
                          className="border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 font-medium text-gray-900">⚙️ Professional Mode</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">
                        Legal terminology with grouped sections. Best for legal professionals.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Jurisdiction Selection */}
                <div>
                  <label className="label flex items-center">
                    <GlobeAltIcon className="w-4 h-4 mr-1" />
                    Jurisdiction
                  </label>
                  <select
                    value={selectedJurisdiction}
                    onChange={(e) => setSelectedJurisdiction(e.target.value)}
                    className="input-field"
                  >
                    {availableJurisdictions.map((jurisdiction) => (
                      <option key={jurisdiction.code} value={jurisdiction.code}>
                        {jurisdiction.name}
                      </option>
                    ))}
                  </select>
                  <p className="help-text">
                    Choose the legal jurisdiction that will govern this agreement
                  </p>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="label flex items-center">
                    <LanguageIcon className="w-4 h-4 mr-1" />
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="input-field"
                  >
                    {availableLanguages.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                  <p className="help-text">
                    Select the language for your document and questionnaire
                  </p>
                </div>

                {/* Estimated Time */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center text-blue-800">
                    <ClockIcon className="w-5 h-5 mr-2" />
                    <span className="font-medium">Estimated completion time: {template.estimated_time_minutes} minutes</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Have your company information and agreement preferences ready
                  </p>
                </div>

                {/* Legal Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <ShieldCheckIcon className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-amber-800 mb-1">Legal Notice</h4>
                      <p className="text-xs text-amber-700">
                        This tool generates legal documents for informational purposes only.
                        Review with qualified legal counsel before use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleStartQuestionnaire}
                  className="btn-primary w-full"
                >
                  Start Questionnaire
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'questionnaire' && (
          <div>
            {/* Questionnaire Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {template.title} - {mode === 'guided' ? 'Guided' : 'Professional'} Mode
              </h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <GlobeAltIcon className="w-4 h-4 mr-1" />
                  {availableJurisdictions.find(j => j.code === selectedJurisdiction)?.name}
                </span>
                <span className="flex items-center">
                  <LanguageIcon className="w-4 h-4 mr-1" />
                  {availableLanguages.find(l => l.code === selectedLanguage)?.name}
                </span>
              </div>
            </div>

            {/* Questionnaire Form */}
            <QuestionnaireForm
              groups={mockNDAQuestionnaire.groups}
              onComplete={handleQuestionnaireComplete}
            />
          </div>
        )}
      </div>

      {/* Disclaimer Modal */}
      <DisclaimerModal
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAccept={handleDisclaimerAccept}
      />
    </div>
  );
}