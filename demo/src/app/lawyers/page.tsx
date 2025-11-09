'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { mockLawyers, serviceTiers, mockServiceRequests } from '@/lib/professionalNetwork';
import { StarIcon, MapPinIcon, ClockIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

export default function LawyersPage() {
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string | null>(null);

  const filteredLawyers = mockLawyers.filter(lawyer => {
    if (selectedJurisdiction && !lawyer.jurisdictions.licensed.includes(selectedJurisdiction) &&
        !lawyer.jurisdictions.collaboration.includes(selectedJurisdiction)) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              Professional Legal Network
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Connect with verified lawyers for document review, customization, and full legal services.
              All professionals are bar-verified and rated by clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center text-primary-100">
                <CheckBadgeIcon className="w-5 h-5 mr-2" />
                <span>Bar verified lawyers</span>
              </div>
              <div className="flex items-center text-primary-100">
                <StarIcon className="w-5 h-5 mr-2" />
                <span>Client-rated services</span>
              </div>
              <div className="flex items-center text-primary-100">
                <ClockIcon className="w-5 h-5 mr-2" />
                <span>Fast turnaround times</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Referral Fee Disclosure */}
        <section className="mb-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Important Disclosure: Referral Fee Arrangements
                </h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p>
                    <strong>Legmint receives a referral fee when you engage a legal professional through our platform.</strong> Legal professionals listed here pay Legmint a commission (typically 10-15% of their fees) when you hire them through our referral service.
                  </p>
                  <p>
                    <strong>No additional cost to you:</strong> This referral fee does not increase what you pay. Any discounts shown are provided by the legal professional and reduce your cost.
                  </p>
                  <p>
                    <strong>Independent matching:</strong> The referral fee amount does not influence our matching algorithm. Professionals are matched based solely on jurisdiction, practice area specialization, client ratings, and availability.
                  </p>
                  <p className="mt-3">
                    <a href="/terms#section-9" className="text-blue-700 hover:text-blue-900 underline font-medium">
                      Learn more about our referral arrangements →
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Tiers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceTiers.map((tier) => (
              <div
                key={tier.id}
                className={`card p-6 cursor-pointer transition-all duration-200 ${
                  selectedServiceType === tier.id
                    ? 'ring-2 ring-primary-500 bg-primary-50'
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedServiceType(selectedServiceType === tier.id ? null : tier.id)}
              >
                <div className="text-3xl mb-3">{tier.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{tier.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="text-sm font-medium text-primary-600">{tier.price_range}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Turnaround:</span>
                    <span className="text-sm font-medium">{tier.turnaround}</span>
                  </div>
                </div>
                <ul className="mt-4 space-y-1">
                  {tier.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-center">
                      <span className="text-green-500 mr-1">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Lawyers</h3>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jurisdiction</label>
                <select
                  className="form-select rounded-md border-gray-300 text-sm"
                  value={selectedJurisdiction || ''}
                  onChange={(e) => setSelectedJurisdiction(e.target.value || null)}
                >
                  <option value="">All Jurisdictions</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US-DE">Delaware, US</option>
                  <option value="US-NY">New York, US</option>
                  <option value="DE">Germany</option>
                  <option value="EU-BASE">European Union</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  className="btn-secondary text-sm"
                  onClick={() => {
                    setSelectedJurisdiction(null);
                    setSelectedServiceType(null);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Lawyers List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Lawyers</h2>
            <div className="text-sm text-gray-500">
              {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''} available
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div key={lawyer.id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-lg">
                        {lawyer.profile.first_name[0]}{lawyer.profile.last_name[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {lawyer.profile.first_name} {lawyer.profile.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{lawyer.profile.title}</p>
                      {lawyer.profile.firm_name && (
                        <p className="text-sm text-gray-500">{lawyer.profile.firm_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CheckBadgeIcon className="w-5 h-5 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Verified</span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-2">{lawyer.profile.bio}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="font-medium">{lawyer.performance.rating}</span>
                      <span className="ml-1">({lawyer.performance.total_reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      <span>{lawyer.performance.average_turnaround_hours}h avg turnaround</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{lawyer.jurisdictions.licensed.join(', ')}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span>{lawyer.profile.years_experience} years experience</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-600">Review from </span>
                      <span className="font-medium text-primary-600">
                        {lawyer.pricing.currency === 'GBP' ? '£' : lawyer.pricing.currency === 'USD' ? '$' : '€'}
                        {lawyer.pricing.review_rate}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lawyer.availability.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : lawyer.availability.status === 'busy'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {lawyer.availability.status === 'available' ? 'Available' :
                         lawyer.availability.status === 'busy' ? 'Busy' : 'Unavailable'}
                      </span>
                      <button className="btn-primary text-sm">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specializations</h4>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs font-medium"
                      >
                        {spec.area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Service Requests */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Service Requests</h2>
          <div className="space-y-4">
            {mockServiceRequests.map((request) => (
              <div key={request.id} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {request.service_type === 'review' ? 'Document Review' :
                       request.service_type === 'modification' ? 'Template Customization' :
                       request.service_type === 'full_service' ? 'Full Legal Service' :
                       'Ongoing Support'} Request
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{request.requirements}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Budget: {request.budget_range.currency} {request.budget_range.min}-{request.budget_range.max}</span>
                      <span>Urgency: {request.urgency}</span>
                      <span>Jurisdiction: {request.jurisdiction_preference}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                      request.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Legal Help?</h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Connect with our verified lawyers for professional document review, customization, or full legal services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                Request Service
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}