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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-indigo-600">Legmint</h1>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                Dashboard
              </span>
            </div>
            <UserButton afterSignOutUrl="/" />
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
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                  <svg
                    className="h-6 w-6 text-indigo-600"
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
                    Templates Generated
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
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
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    Free
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Credits Remaining
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    3
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">
            Your Legal Templates
          </h3>
          <p className="mt-2 text-gray-600">
            You haven&apos;t generated any templates yet. Start by browsing our template
            library.
          </p>
          <div className="mt-6 flex space-x-4">
            <Link href="/pricing" className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:bg-indigo-700 transition-colors inline-block">
              Browse Templates
            </Link>
            <Link href="/pricing" className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition-colors inline-block">
              Upgrade Plan
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/pricing" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 text-left hover:border-indigo-500 hover:shadow-md transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                <svg
                  className="h-5 w-5 text-indigo-600"
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
              <div>
                <p className="font-medium text-gray-900">SAFE Agreement</p>
                <p className="text-sm text-gray-500">Fundraising</p>
              </div>
            </Link>

            <Link href="/pricing" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 text-left hover:border-indigo-500 hover:shadow-md transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Employment Contract</p>
                <p className="text-sm text-gray-500">Hiring</p>
              </div>
            </Link>

            <Link href="/pricing" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 text-left hover:border-indigo-500 hover:shadow-md transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <svg
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">NDA</p>
                <p className="text-sm text-gray-500">Legal</p>
              </div>
            </Link>

            <Link href="/pricing" className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-4 text-left hover:border-indigo-500 hover:shadow-md transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                <svg
                  className="h-5 w-5 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">SaaS Terms</p>
                <p className="text-sm text-gray-500">Legal</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
