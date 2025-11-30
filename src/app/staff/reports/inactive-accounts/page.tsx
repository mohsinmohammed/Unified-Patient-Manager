'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

interface InactiveAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  lastAccessDate: string | null;
  createdAt: string;
  isActive: boolean;
}

interface Statistics {
  totalInactive: number;
  neverAccessed: number;
  oldestAccount: {
    email: string;
    name: string;
    lastAccess: string | null;
  } | null;
}

export default function InactiveAccountsReportPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<InactiveAccount[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [years, setYears] = useState(7);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (!token || role !== 'staff') {
      router.push('/staff/login');
      return;
    }

    fetchReport();
  }, [router, years]);

  const fetchReport = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/reports/inactive-accounts?years=${years}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          router.push('/staff/login');
          return;
        }
        throw new Error('Failed to fetch report');
      }

      const data = await response.json();
      setAccounts(data.accounts);
      setStatistics(data.statistics);
    } catch (err: any) {
      setError(err.message || 'Failed to load report');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateInactiveDuration = (lastAccessDate: string | null, createdAt: string) => {
    const referenceDate = lastAccessDate ? new Date(lastAccessDate) : new Date(createdAt);
    const now = new Date();
    const diffYears = (now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    return diffYears.toFixed(1);
  };

  if (isLoading) {
    return (
      <Layout userType="staff">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading report...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="staff">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Inactive Accounts Report
              </h1>
              <p className="text-gray-600 mt-1">
                Patient accounts not accessed for {years}+ years
              </p>
            </div>
            <button
              onClick={() => router.push('/staff/dashboard')}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Dashboard
            </button>
          </div>

          {/* Year Filter */}
          <div className="mt-4 flex items-center gap-3">
            <label htmlFor="years" className="text-sm font-medium text-gray-700">
              Inactive for at least:
            </label>
            <select
              id="years"
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="5">5 years</option>
              <option value="7">7 years</option>
              <option value="10">10 years</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Total Inactive</div>
              <div className="text-3xl font-bold text-gray-900">
                {statistics.totalInactive}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Never Accessed</div>
              <div className="text-3xl font-bold text-orange-600">
                {statistics.neverAccessed}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm text-gray-600 mb-1">Oldest Inactive</div>
              <div className="text-sm font-medium text-gray-900">
                {statistics.oldestAccount ? (
                  <>
                    {statistics.oldestAccount.name}
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(statistics.oldestAccount.lastAccess)}
                    </div>
                  </>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accounts Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Inactive Accounts
              {accounts.length > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({accounts.length} total)
                </span>
              )}
            </h2>
          </div>

          {accounts.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No inactive accounts found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                All patient accounts have been accessed within the last {years} years.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Access
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inactive Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {account.firstName} {account.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {account.id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{account.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            account.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(account.lastAccessDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(account.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                          {calculateInactiveDuration(account.lastAccessDate, account.createdAt)} years
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
