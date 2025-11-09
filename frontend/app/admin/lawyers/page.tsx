'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Lawyer {
  id: string;
  fullName: string;
  email: string;
  jurisdiction: string;
  status: string;
  stripeStatus: string;
  stripeAccountId: string;
  specializations: string[];
  languages: string[];
  createdAt: string;
  stats?: {
    totalReferrals: number;
    completedReferrals: number;
  };
}

export default function AdminLawyersPage() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLawyers();
  }, [filter]);

  const loadLawyers = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/lawyers${params}`,
      );

      if (!res.ok) {
        throw new Error('Failed to load lawyers');
      }

      const data = await res.json();
      setLawyers(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load lawyers');
    } finally {
      setLoading(false);
    }
  };

  const verifyLawyer = async (lawyerId: string) => {
    if (!confirm('Approve and verify this lawyer?')) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/lawyers/${lawyerId}/verify`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminId: 'admin-user-id' }), // TODO: Get from auth
        },
      );

      if (!res.ok) throw new Error('Failed to verify lawyer');

      alert('Lawyer verified successfully!');
      loadLawyers();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const suspendLawyer = async (lawyerId: string) => {
    if (!confirm('Suspend this lawyer? They will not be able to receive new referrals.')) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/admin/lawyers/${lawyerId}/suspend`,
        {
          method: 'PATCH',
        },
      );

      if (!res.ok) throw new Error('Failed to suspend lawyer');

      alert('Lawyer suspended successfully.');
      loadLawyers();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-indigo-100 text-indigo-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getStripeBadge = (stripeStatus: string) => {
    if (stripeStatus === 'charges_enabled') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lawyer Management</h1>
              <p className="text-gray-600">Review applications and manage lawyer accounts</p>
            </div>
            <Link
              href="/"
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              ← Back to Home
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-gray-900">{lawyers.length}</div>
              <div className="text-sm text-gray-600">Total Lawyers</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {lawyers.filter((l) => l.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-green-600">
                {lawyers.filter((l) => l.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-2xl font-bold text-indigo-600">
                {lawyers.reduce((sum, l) => sum + (l.stats?.totalReferrals || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Referrals</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {['all', 'pending', 'verified', 'active', 'suspended', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-sm">
                  ({lawyers.filter((l) => l.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Lawyers Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-600">Loading lawyers...</div>
          </div>
        ) : lawyers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-600">No lawyers found</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-b from-indigo-50 to-white border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lawyer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jurisdiction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stripe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referrals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {lawyers.map((lawyer) => (
                  <tr key={lawyer.id} className="hover:bg-gradient-to-b from-indigo-50 to-white">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">{lawyer.fullName}</div>
                        <div className="text-sm text-gray-500">{lawyer.email}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {lawyer.specializations.slice(0, 2).join(', ')}
                          {lawyer.specializations.length > 2 && ' +more'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{lawyer.jurisdiction}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(lawyer.status)}`}
                      >
                        {lawyer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStripeBadge(lawyer.stripeStatus)}`}
                      >
                        {lawyer.stripeStatus === 'charges_enabled' ? 'Connected' : 'Not Connected'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        {lawyer.stats?.completedReferrals || 0} /{' '}
                        {lawyer.stats?.totalReferrals || 0}
                      </div>
                      <div className="text-xs text-gray-500">completed / total</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lawyer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                      {lawyer.status === 'pending' && (
                        <button
                          onClick={() => verifyLawyer(lawyer.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Verify
                        </button>
                      )}
                      {lawyer.status === 'active' && (
                        <button
                          onClick={() => suspendLawyer(lawyer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Suspend
                        </button>
                      )}
                      <Link
                        href={`/admin/lawyers/${lawyer.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Additional Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <Link
            href="/admin/revenue"
            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gradient-to-b from-indigo-50 to-white transition"
          >
            View Revenue Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
