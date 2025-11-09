'use client';

import Link from 'next/link';
import { Template } from '@/lib/types';
import { ClockIcon, StarIcon, TagIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'risk-badge risk-low';
      case 'MEDIUM':
        return 'risk-badge risk-medium';
      case 'HIGH':
        return 'risk-badge risk-high';
      default:
        return 'risk-badge risk-low';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'B2B':
        return 'bg-blue-100 text-blue-800';
      case 'B2C':
        return 'bg-green-100 text-green-800';
      case 'P2P':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
            {template.category}
          </span>
          <span className={getRiskBadgeClass(template.min_risk_level)}>
            {template.min_risk_level}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <StarIcon className="w-4 h-4 mr-1" />
          {template.rating}
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {template.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
        {template.description}
      </p>

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <ClockIcon className="w-4 h-4 mr-1" />
          ~{template.estimated_time_minutes} minutes
          <span className="mx-2">•</span>
          <span>Complexity: {template.complexity_score}/10</span>
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <GlobeAltIcon className="w-4 h-4 mr-1" />
          {template.jurisdiction_set.join(', ')}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <TagIcon className="w-4 h-4 mr-1" />
          <span className="truncate">{template.tags.slice(0, 2).join(', ')}</span>
          {template.tags.length > 2 && (
            <span className="text-gray-400 ml-1">+{template.tags.length - 2}</span>
          )}
        </div>
      </div>

      {/* Usage count */}
      <div className="text-xs text-gray-500 mb-4">
        Generated {template.usage_count} times
      </div>

      {/* Actions */}
      <div className="flex space-x-2 mt-auto">
        <Link
          href={`/templates/${template.id}`}
          className="btn-secondary flex-1 text-center text-sm"
        >
          View Details
        </Link>
        <Link
          href={`/templates/${template.id}/generate`}
          className="btn-primary flex-1 text-center text-sm"
        >
          Generate
        </Link>
      </div>
    </div>
  );
}