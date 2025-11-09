'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import SearchFilters from '@/components/SearchFilters';
import TemplateCard from '@/components/TemplateCard';
import Testimonials from '@/components/Testimonials';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import CostOfMistakes from '@/components/CostOfMistakes';
import TrustSignals from '@/components/TrustSignals';
import SocialProofNotifications from '@/components/SocialProofNotifications';
import BehindTheScenes from '@/components/BehindTheScenes';
import EnhancedPricing from '@/components/EnhancedPricing';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import { useAppStore } from '@/lib/store';
import { expandedTemplates, templateCategories } from '@/lib/expandedTemplates';
import { serviceTiers } from '@/lib/professionalNetwork';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// Use expandedTemplates as the main template source (20+ templates)
const allTemplates = expandedTemplates;

export default function HomePage() {
  const {
    selectedCategory,
    selectedJurisdictions,
    selectedLanguage,
    searchQuery,
    filteredTemplates,
    setFilteredTemplates
  } = useAppStore();

  // Filter templates based on current filters
  useEffect(() => {
    let filtered = [...allTemplates];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Jurisdiction filter
    if (selectedJurisdictions.length > 0) {
      filtered = filtered.filter(template =>
        template.jurisdiction_set.some(j => selectedJurisdictions.includes(j))
      );
    }

    // Language filter
    if (selectedLanguage) {
      filtered = filtered.filter(template =>
        template.supported_languages.includes(selectedLanguage)
      );
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query)) ||
        template.use_cases.some(useCase => useCase.toLowerCase().includes(query))
      );
    }

    // Sort by usage count (popularity) by default
    filtered.sort((a, b) => b.usage_count - a.usage_count);

    setFilteredTemplates(filtered);
  }, [selectedCategory, selectedJurisdictions, selectedLanguage, searchQuery, setFilteredTemplates]);

  // Featured startup templates (most popular)
  const featuredTemplates = allTemplates
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, 3);

  // Startup-focused categories
  const startupCategories = [
    { id: 'Founding', name: 'Founding & Structure', icon: '🏗️', color: 'from-blue-500 to-blue-600', description: 'Founders agreements, equity, incorporation' },
    { id: 'Fundraising', name: 'Fundraising & Investment', icon: '💰', color: 'from-green-500 to-green-600', description: 'SAFE, convertible notes, term sheets' },
    { id: 'Employment', name: 'Employment & HR', icon: '👥', color: 'from-purple-500 to-purple-600', description: 'Employment contracts, advisors, equity' },
    { id: 'IP', name: 'IP & Confidentiality', icon: '🔒', color: 'from-orange-500 to-orange-600', description: 'IP assignment, NDAs, trademarks' },
    { id: 'Commercial', name: 'Commercial & SaaS', icon: '💼', color: 'from-teal-500 to-teal-600', description: 'SaaS agreements, MSAs, customer contracts' },
    { id: 'Compliance', name: 'Compliance & Privacy', icon: '⚖️', color: 'from-red-500 to-red-600', description: 'GDPR, data processing, policies' },
  ];

  const categories = startupCategories.map(cat => ({
    ...cat,
    count: allTemplates.filter(t => t.category === cat.id).length
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SocialProofNotifications />
      <ExitIntentPopup />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-navy-500 via-navy-600 to-slate-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg border border-mint-400/30">
              <span className="text-white/90">"Saved us €15K on our SAFE" - Sarah Chen, TechFlow (YC W23)</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-md leading-tight">
              Don't lose your startup to a bad legal document
            </h1>
            <p className="text-xl md:text-2xl text-mint-400 mb-4 max-w-3xl mx-auto leading-relaxed font-bold drop-shadow-sm">
              Protect your equity, IP, and future with lawyer-reviewed docs in 15 minutes
            </p>
            <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
              Incorporate, raise, hire, and scale — all through interactive legal templates designed for founders. From idea to Series A.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <div className="flex items-center text-white font-medium">
                <span className="mr-2 text-2xl">⚡</span>
                <span><strong className="font-bold">15 minutes</strong> vs 2-3 weeks</span>
              </div>
              <div className="flex items-center text-white font-medium">
                <span className="mr-2 text-2xl">💰</span>
                <span><strong className="font-bold">€99</strong> vs €2,000-€5,000</span>
              </div>
              <div className="flex items-center text-white font-medium">
                <span className="mr-2 text-2xl">🎯</span>
                <span><strong className="font-bold">500+ YC</strong> companies trust us</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a href="#templates" className="bg-mint-400 text-navy-500 hover:bg-mint-300 px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                Get My First Document Free →
              </a>
              <a href="#templates" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy-500 px-8 py-4 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                See How It Works
              </a>
            </div>
            <div className="text-center text-white/80 text-sm">
              <span className="inline-flex items-center">
                🟢 <span className="ml-2">47 founders generated docs in the last 24 hours</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show featured templates if no filters applied */}
        {!selectedCategory && !selectedJurisdictions.length && !selectedLanguage && !searchQuery && (
          <>
            {/* Cost of Mistakes - High Impact Section */}
            <CostOfMistakes />

            {/* Testimonials - Social Proof Above Fold */}
            <Testimonials />

            {/* Trust Signals */}
            <TrustSignals />

            {/* How It Works */}
            <HowItWorks />

            {/* Featured Templates */}
            <section className="mb-12" id="templates">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Most Popular Startup Documents</h2>
              <p className="text-gray-600 mb-6">Get started with these essential templates — used by 500+ YC-backed founders</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </section>

            {/* Enhanced Pricing */}
            <EnhancedPricing />

            {/* Behind the Scenes - Trust & Transparency */}
            <BehindTheScenes />

            {/* Categories */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Startup Stage</h2>
              <p className="text-gray-600 mb-6">Find the right legal documents for your startup's current stage</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="card p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => useAppStore.getState().setCategory(category.id)}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl mb-4`}>
                      {category.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-xs text-gray-600 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{category.count} templates</span>
                      <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <FAQ />
          </>
        )}

        {/* Template Results */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {(selectedCategory || selectedJurisdictions.length || selectedLanguage || searchQuery)
                ? 'Search Results'
                : 'All Templates'}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <button
                onClick={() => useAppStore.getState().resetFilters()}
                className="bg-mint-400 text-navy-500 hover:bg-mint-300 px-6 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                View All Templates
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Logo size={32} />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Legal docs, minted for startups · Backed by legal experts
            </p>
            <div className="text-xs text-gray-500">
              <p className="mb-2">
                <strong>Important:</strong> This is NOT legal advice. All generated documents should be reviewed by qualified legal counsel before use.
              </p>
              <p>
                © 2025 Global Legal Consulting Ltd. All rights reserved. |
                <Link href="/privacy" className="text-mint-400 hover:text-mint-500 ml-1">Privacy Policy</Link> |
                <Link href="/terms" className="text-mint-400 hover:text-mint-500 ml-1">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}