'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  plan_type: string;
  company_name: string;
  country: string;
  industry: string;
  company_size: string;
  contact_name: string;
  contact_email: string;
  use_cases: string[];
  jurisdictions: string[];
  status: string;
  created_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  clarification: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  clarification_needed: 'bg-orange-100 text-orange-800',
};

export default function EnterpriseAdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, clarification: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [clarificationMessage, setClarificationMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/enterprise/admin/applications${params}`
      );
      if (!res.ok) throw new Error('Failed to load applications');
      const data = await res.json();
      setApplications(data.applications);
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const handleReview = async (id: string, status: 'approved' | 'rejected' | 'clarification_needed') => {
    if (status === 'clarification_needed' && !clarificationMessage.trim()) {
      alert('Please provide a clarification message');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/enterprise/admin/applications/${id}/review`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status,
            reviewerNotes: reviewNotes,
            clarificationRequest: status === 'clarification_needed' ? clarificationMessage : undefined,
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to update application');

      alert(`Application ${status === 'approved' ? 'approved and invoice sent' : status}`);
      setSelectedApp(null);
      setReviewNotes('');
      setClarificationMessage('');
      fetchApplications();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enterprise Applications</h1>
              <p className="text-gray-600">Review and approve enterprise subscription requests</p>
            </div>
            <Link href="/admin/lawyers" className="text-emerald-600 hover:underline">
              Lawyer Admin →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-3xl font-bold text-orange-600">{stats.clarification}</div>
            <div className="text-sm text-gray-600">Awaiting Clarification</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['', 'pending', 'approved', 'rejected', 'clarification_needed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border'
              }`}
            >
              {status === '' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No applications found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Use Cases</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{app.company_name}</div>
                      <div className="text-sm text-gray-500">{app.country} • {app.industry}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        app.plan_type === 'enterprise-ultra'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.plan_type === 'enterprise-ultra' ? 'Ultra' : 'Enterprise'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{app.contact_name}</div>
                      <div className="text-sm text-gray-500">{app.contact_email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {app.use_cases?.slice(0, 2).map((uc) => (
                          <span key={uc} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {uc}
                          </span>
                        ))}
                        {app.use_cases?.length > 2 && (
                          <span className="text-xs text-gray-400">+{app.use_cases.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${STATUS_COLORS[app.status]}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedApp.company_name}</h2>
                  <p className="text-gray-500">
                    {selectedApp.plan_type === 'enterprise-ultra' ? 'Enterprise Ultra' : 'Enterprise'} Application
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Company Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Country:</span>
                  <span className="ml-2 font-medium">{selectedApp.country}</span>
                </div>
                <div>
                  <span className="text-gray-500">Industry:</span>
                  <span className="ml-2 font-medium">{selectedApp.industry}</span>
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>
                  <span className="ml-2 font-medium">{selectedApp.company_size} employees</span>
                </div>
                <div>
                  <span className="text-gray-500">Contact:</span>
                  <span className="ml-2 font-medium">{selectedApp.contact_name}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Email:</span>
                  <span className="ml-2 font-medium">{selectedApp.contact_email}</span>
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Use Cases</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.use_cases?.map((uc) => (
                    <span key={uc} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">
                      {uc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Jurisdictions */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Jurisdictions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.jurisdictions?.map((j) => (
                    <span key={j} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {j}
                    </span>
                  ))}
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="Add internal review notes..."
                />
              </div>

              {/* Clarification Message (only shown when needed) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clarification Request Message
                </label>
                <textarea
                  value={clarificationMessage}
                  onChange={(e) => setClarificationMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  placeholder="If requesting clarification, describe what information is needed..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-between">
              <button
                onClick={() => handleReview(selectedApp.id, 'rejected')}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleReview(selectedApp.id, 'clarification_needed')}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
                >
                  Request Clarification
                </button>
                <button
                  onClick={() => handleReview(selectedApp.id, 'approved')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Processing...' : 'Approve & Send Invoice'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
