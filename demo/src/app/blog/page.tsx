'use client';

import Header from '@/components/Header';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Complete Legal Checklist for Pre-Seed Startups (2025)',
    excerpt: 'Essential legal documents every founder needs before raising their first dollar. From founders agreements to SAFE notes, this comprehensive guide covers everything you need to be legally operational.',
    date: '2025-01-15',
    readTime: '8 min',
    category: 'Fundraising',
    slug: 'legal-checklist-pre-seed-startups'
  },
  {
    id: '2',
    title: 'Founders Agreement Template: What to Include in 2025',
    excerpt: 'A founders agreement protects all co-founders by clearly defining equity split, vesting schedules, and roles. Learn what must be in your agreement to prevent costly disputes.',
    date: '2025-01-10',
    readTime: '10 min',
    category: 'Founding',
    slug: 'founders-agreement-template-guide'
  },
  {
    id: '3',
    title: 'SAFE vs Convertible Note: What\'s Best for Your Startup?',
    excerpt: 'Deciding between a SAFE and convertible note for pre-seed fundraising? We break down the differences, pros/cons, and when to use each instrument.',
    date: '2025-01-05',
    readTime: '7 min',
    category: 'Fundraising',
    slug: 'safe-vs-convertible-note'
  },
  {
    id: '4',
    title: 'How Much Do Startup Lawyers Cost? (2025 Price Comparison)',
    excerpt: 'Traditional startup law firms charge €15K-50K annual retainers. Learn the real costs of legal services and how to save 95% with modern alternatives.',
    date: '2024-12-20',
    readTime: '6 min',
    category: 'Cost Comparison',
    slug: 'startup-lawyers-cost-comparison'
  },
  {
    id: '5',
    title: '5 Legal Mistakes That Kill Pre-Seed Funding Rounds',
    excerpt: 'Investors walk away from deals with legal red flags. Avoid these 5 common mistakes that prevent founders from closing their pre-seed rounds.',
    date: '2024-12-15',
    readTime: '9 min',
    category: 'Fundraising',
    slug: 'legal-mistakes-pre-seed-funding'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Startup Legal Guides & Resources
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Learn everything about legal documents, fundraising, and startup compliance from experienced founders and lawyers.
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="card bg-white p-8 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                  {post.category}
                </span>
                <span className="text-sm text-gray-500">{post.date}</span>
                <span className="text-sm text-gray-500">• {post.readTime} read</span>
              </div>
              
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors cursor-pointer">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {post.excerpt}
              </p>
              
              <Link
                href={`/blog/${post.slug}`}
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
              >
                Read full article →
              </Link>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="card bg-gradient-to-br from-primary-50 to-white border border-primary-100 p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Get Legal Updates for Founders
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Weekly insights on startup legal, fundraising, and compliance. Join 5,000+ founders.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="btn-primary px-6 py-3">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">⚖️</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Legmint</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              The default legal stack for early-stage startups
            </p>
            <div className="text-xs text-gray-500">
              <p>
                © 2025 Global Legal Consulting Ltd. All rights reserved. |
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 ml-1">Privacy Policy</Link> |
                <Link href="/terms" className="text-primary-600 hover:text-primary-700 ml-1">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

