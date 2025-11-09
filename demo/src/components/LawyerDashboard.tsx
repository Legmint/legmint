'use client';

import { useState, useEffect } from 'react';

interface Partner {
  id: string;
  fullName: string;
  email: string;
  jurisdiction: string;
  specializations: string[];
  languages: string[];
  bio: string;
  rating: number;
  reviewCount: number;
  status: 'pending' | 'verified' | 'active' | 'suspended';
  stripeAccountId: string | null;
}

interface Referral {
  id: string;
  templateCode: string;
  jurisdiction: string;
  status: 'created' | 'clicked' | 'booked' | 'expired';
  discountPercentage: number;
  bookingValue: number | null;
  commissionAmount: number | null;
  createdAt: string;
  clickedAt: string | null;
  bookedAt: string | null;
  user: {
    email: string;
  };
}

interface PayoutSummary {
  balance: {
    available: Array<{ amount: number; currency: string }>;
    pending: Array<{ amount: number; currency: string }>;
  };
  recentPayouts: Array<{
    id: string;
    amount: number;
    currency: string;
    arrival_date: number;
    status: string;
  }>;
  referralStats: {
    totalCommission: string;
    totalReferrals: string;
    bookedReferrals: string;
  };
}

export default function LawyerDashboard({ partnerId }: { partnerId: string }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'payments' | 'profile'>(
    'overview'
  );
  const [partner, setPartner] = useState<Partner | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [payouts, setPayouts] = useState<PayoutSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [partnerId]);

  const loadDashboardData = async () => {
    try {
      const [profileRes, referralsRes, payoutsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/lawyers/${partnerId}/profile`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/lawyers/${partnerId}/referrals?limit=20`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/lawyers/${partnerId}/payouts`),
      ]);

      const [profileData, referralsData, payoutsData] = await Promise.all([
        profileRes.json(),
        referralsRes.json(),
        payoutsRes.json(),
      ]);

      setPartner(profileData);
      setReferrals(referralsData.referrals);
      setPayouts(payoutsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !partner) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      created: 'bg-gray-100 text-gray-800',
      clicked: 'bg-blue-100 text-blue-800',
      booked: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          colors[status as keyof typeof colors]
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{partner.fullName}</h1>
            <p className="text-gray-600">
              {partner.jurisdiction} • {partner.specializations.join(', ')}
            </p>
          </div>
          <div className="text-right">
            {getStatusBadge(partner.status)}
            {partner.status === 'active' && (
              <p className="text-sm text-green-600 mt-1">✓ Accepting referrals</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {partner.status === 'verified' && !partner.stripeAccountId && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Action Required</h3>
          <p className="text-sm text-yellow-700 mb-3">
            Your application is verified, but you need to connect your Stripe account to receive
            payments and accept referrals.
          </p>
          <button className="bg-[#635BFF] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5147E5]">
            Connect Stripe Account
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'referrals', label: 'Referrals' },
            { id: 'payments', label: 'Payments' },
            { id: 'profile', label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 font-semibold ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && payouts && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-semibold mb-1">Total Referrals</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {payouts.referralStats.totalReferrals}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-semibold mb-1">Booked</p>
                  <p className="text-3xl font-bold text-green-900">
                    {payouts.referralStats.bookedReferrals}
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {formatCurrency(parseFloat(payouts.referralStats.totalCommission), 'EUR')}
                  </p>
                </div>
              </div>

              {/* Available Balance */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Available Balance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Available Now</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {payouts.balance.available[0]
                        ? formatCurrency(
                            payouts.balance.available[0].amount,
                            payouts.balance.available[0].currency
                          )
                        : '€0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {payouts.balance.pending[0]
                        ? formatCurrency(
                            payouts.balance.pending[0].amount,
                            payouts.balance.pending[0].currency
                          )
                        : '€0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Referrals */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Recent Referrals</h3>
                <div className="space-y-3">
                  {referrals.slice(0, 5).map((ref) => (
                    <div
                      key={ref.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{ref.templateCode}</p>
                          <p className="text-sm text-gray-600">
                            {ref.jurisdiction} • {formatDate(ref.createdAt)}
                          </p>
                        </div>
                        {getStatusBadge(ref.status)}
                      </div>
                      {ref.bookingValue && (
                        <p className="text-sm text-green-600 mt-2">
                          Commission: {formatCurrency(ref.commissionAmount || 0, 'EUR')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">All Referrals</h3>
                <select className="border border-gray-300 rounded-lg px-4 py-2">
                  <option value="">All Statuses</option>
                  <option value="created">Created</option>
                  <option value="clicked">Clicked</option>
                  <option value="booked">Booked</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Template
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                        Commission
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((ref) => (
                      <tr key={ref.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <span className="font-medium text-gray-900">{ref.templateCode}</span>
                          <br />
                          <span className="text-gray-500">{ref.jurisdiction}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{ref.user.email}</td>
                        <td className="px-4 py-3">{getStatusBadge(ref.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatDate(ref.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {ref.commissionAmount
                            ? formatCurrency(ref.commissionAmount, 'EUR')
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && payouts && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">How Payments Work</h3>
                <p className="text-sm text-gray-700">
                  Legmint automatically transfers 85% of each completed payment to your Stripe
                  account. Payouts typically arrive 2-7 business days after the client payment.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Recent Payouts</h3>
                {payouts.recentPayouts.length > 0 ? (
                  <div className="space-y-3">
                    {payouts.recentPayouts.map((payout) => (
                      <div
                        key={payout.id}
                        className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(payout.amount, payout.currency)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Arriving{' '}
                            {new Date(payout.arrival_date * 1000).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        {getStatusBadge(payout.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No payouts yet</p>
                )}
              </div>

              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#635BFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5147E5]"
              >
                View Full Details in Stripe →
              </a>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={partner.fullName}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={partner.email}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specializations
                </label>
                <div className="flex flex-wrap gap-2">
                  {partner.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {partner.languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={partner.bio}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows={6}
                  readOnly
                />
              </div>

              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
