'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppStore } from '@/lib/store';
import { mockJurisdictions, mockLanguages } from '@/lib/mockData';

export default function SearchFilters() {
  const {
    selectedCategory,
    selectedJurisdictions,
    selectedLanguage,
    searchQuery,
    setCategory,
    setJurisdictions,
    setLanguage,
    setSearchQuery,
    resetFilters
  } = useAppStore();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const categories = [
    { value: 'B2B', label: 'Business to Business', icon: '🏢' },
    { value: 'B2C', label: 'Business to Consumer', icon: '🛒' },
    { value: 'P2P', label: 'Person to Person', icon: '🤝' }
  ];

  const riskLevels = [
    { value: 'LOW', label: 'Low Risk', color: 'text-green-600' },
    { value: 'MEDIUM', label: 'Medium Risk', color: 'text-yellow-600' },
    { value: 'HIGH', label: 'High Risk', color: 'text-red-600' }
  ];

  const handleJurisdictionChange = (jurisdiction: string, checked: boolean) => {
    if (checked) {
      setJurisdictions([...selectedJurisdictions, jurisdiction]);
    } else {
      setJurisdictions(selectedJurisdictions.filter(j => j !== jurisdiction));
    }
  };

  const hasActiveFilters = selectedCategory || selectedJurisdictions.length > 0 || selectedLanguage || searchQuery;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search templates by name, description, or use case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          {/* Category Pills */}
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setCategory(selectedCategory === category.value ? null : category.value)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-primary-100 text-primary-800 border border-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
              showAdvancedFilters
                ? 'bg-primary-100 text-primary-800 border border-primary-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <FunnelIcon className="w-4 h-4 mr-1" />
            Advanced Filters
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-300 hover:border-gray-400 transition-colors duration-200"
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Jurisdictions */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Jurisdictions</h4>
                <div className="space-y-2">
                  {mockJurisdictions.map((jurisdiction) => (
                    <label key={jurisdiction.code} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        checked={selectedJurisdictions.includes(jurisdiction.code)}
                        onChange={(e) => handleJurisdictionChange(jurisdiction.code, e.target.checked)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{jurisdiction.short_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Languages</h4>
                <select
                  className="input-field text-sm"
                  value={selectedLanguage || ''}
                  onChange={(e) => setLanguage(e.target.value || null)}
                >
                  <option value="">All Languages</option>
                  {mockLanguages.map((language) => (
                    <option key={language.code} value={language.code}>
                      {language.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Risk Level */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Maximum Risk Level</h4>
                <div className="space-y-2">
                  {riskLevels.map((risk) => (
                    <label key={risk.value} className="flex items-center">
                      <input
                        type="radio"
                        name="risk"
                        className="border-gray-300 text-primary-600 focus:ring-primary-500"
                        value={risk.value}
                      />
                      <span className={`ml-2 text-sm ${risk.color}`}>{risk.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 text-sm text-gray-600">
            <span className="font-medium">Active filters:</span>
            {selectedCategory && <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-100 text-primary-800">{selectedCategory}</span>}
            {selectedJurisdictions.map(j => (
              <span key={j} className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">{j}</span>
            ))}
            {selectedLanguage && <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800">{mockLanguages.find(l => l.code === selectedLanguage)?.name}</span>}
          </div>
        )}
      </div>
    </div>
  );
}