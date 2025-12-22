import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await currentUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-white to-white">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Legmint
              </Link>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/templates"
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Templates
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Pricing
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'there'}!
          </h2>
          <p className="mt-2 text-gray-600">
            Logged in as: {user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-6 hover:border-emerald-200 hover:shadow-lg transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <svg
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Documents Generated
                  </dt>
                  <dd className="mt-1 text-3xl font-bold text-gray-900">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-6 hover:border-emerald-200 hover:shadow-lg transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <svg
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Active Plan
                  </dt>
                  <dd className="mt-1 text-3xl font-bold text-gray-900">
                    Free
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-6 hover:border-emerald-200 hover:shadow-lg transition-all">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                  <svg
                    className="h-6 w-6 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Credits Remaining
                  </dt>
                  <dd className="mt-1 text-3xl font-bold text-gray-900">
                    3
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 p-6 hover:shadow-lg transition-all">
          <h3 className="text-xl font-bold text-gray-900">
            Your Legal Documents
          </h3>
          <p className="mt-2 text-gray-600">
            You haven&apos;t generated any documents yet. Start by browsing our template library.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/templates"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all inline-block"
            >
              Browse Templates →
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border-2 border-emerald-600 bg-white px-6 py-3 text-emerald-600 font-semibold hover:bg-emerald-50 transition-all inline-block"
            >
              Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Popular Templates
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/templates/safe-agreement"
              className="flex items-center space-x-3 rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-4 text-left hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                <span className="text-xl">📄</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">SAFE Agreement</p>
                <p className="text-sm text-gray-500">Fundraising</p>
              </div>
            </Link>

            <Link
              href="/templates/employment-contract"
              className="flex items-center space-x-3 rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-4 text-left hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                <span className="text-xl">👥</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Employment Contract</p>
                <p className="text-sm text-gray-500">Hiring</p>
              </div>
            </Link>

            <Link
              href="/templates/nda-mutual"
              className="flex items-center space-x-3 rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-4 text-left hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Mutual NDA</p>
                <p className="text-sm text-gray-500">Confidentiality</p>
              </div>
            </Link>

            <Link
              href="/templates/terms-of-service"
              className="flex items-center space-x-3 rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50/50 p-4 text-left hover:border-emerald-300 hover:shadow-lg transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">Terms of Service</p>
                <p className="text-sm text-gray-500">Website Legal</p>
              </div>
            </Link>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 text-white text-center shadow-xl">
          <h3 className="text-2xl font-bold mb-2">Unlock All 100+ Templates</h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Subscribe to Pro for unlimited document generation across all jurisdictions with priority support.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all shadow-md"
          >
            View Pricing Plans
          </Link>
        </div>
      </main>
    </div>
  );
}
