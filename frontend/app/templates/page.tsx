/**
 * Templates Index Page
 *
 * Browse all available legal document templates
 */

'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

// Use API_BASE_URL (without /v1) to avoid double path
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface Template {
  code: string;
  title: string;
  description: string;
  category: string;
  jurisdictions: string[];
  is_featured?: boolean;
}

export default function TemplatesPage() {
  const { isSignedIn } = useUser();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/templates`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter(t => t.category === selectedCategory);
  const featuredTemplates = templates.filter(t => t.is_featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Legal Document Templates</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Professional legal templates for startups and businesses. Generate customized documents in minutes.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading templates...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg">
            <p className="font-semibold">Failed to load templates</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchTemplates}
              className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    cat === selectedCategory
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        )}

        {!loading && !error && featuredTemplates.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Templates</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredTemplates.slice(0, 6).map((template) => (
                <Link
                  key={template.code}
                  href={`/templates/${template.code}`}
                  className="bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                            {template.category}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                            {template.jurisdictions.join(', ')}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition">
                          {template.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm font-semibold text-indigo-600">Pro Plan Required</span>
                      </div>
                      <span className="text-indigo-600 font-semibold text-sm group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
                <span className="ml-3 text-base font-normal text-gray-500">
                  ({filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'})
                </span>
              </h2>
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-600">No templates found in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <Link
                    key={template.code}
                    href={`/templates/${template.code}`}
                    className="bg-white rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow-lg transition-all overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                              {template.category}
                            </span>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                              {template.jurisdictions.join(', ')}
                            </span>
                            {template.is_featured && (
                              <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition">
                            {template.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {template.description}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-sm font-semibold text-indigo-600">Pro Plan Required</span>
                        </div>
                        <span className="text-indigo-600 font-semibold text-sm group-hover:underline">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-indigo-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Unlimited Access?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Subscribe to Pro for €99/month and generate all templates unlimited times with full customization.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
          >
            View Pricing Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
