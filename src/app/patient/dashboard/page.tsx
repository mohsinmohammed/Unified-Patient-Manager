'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import BillPayment from '@/components/BillPayment';

interface Bill {
  id: string;
  amount: number;
  status: string;
  description: string | null;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const user = localStorage.getItem('userInfo');

    if (!token || role !== 'patient') {
      router.push('/patient/login');
      return;
    }

    if (user) {
      setUserInfo(JSON.parse(user));
    }

    fetchBills();
  }, [router, filterStatus]);

  const fetchBills = async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const url = filterStatus === 'all' 
        ? '/api/bills' 
        : `/api/bills?status=${filterStatus}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear();
          router.push('/patient/login');
          return;
        }
        throw new Error('Failed to fetch bills');
      }

      const data = await response.json();
      setBills(data.bills);
      setOutstandingBalance(data.outstandingBalance);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (billId: string) => {
    setSelectedBill(null);
    fetchBills(); // Refresh bills list
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      failed: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.failed}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/patient/login');
  };

  if (isLoading) {
    return (
      <Layout userType="patient">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your bills...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userType="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {userInfo?.firstName || 'Patient'}
            </h1>
            <p className="text-gray-600 mt-1">Manage your bills and payments</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Outstanding Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-lg font-medium mb-2">Outstanding Balance</h2>
          <p className="text-4xl font-bold">{formatCurrency(outstandingBalance)}</p>
          <p className="text-blue-100 mt-2">
            {bills.filter(b => b.status === 'pending' || b.status === 'overdue').length} pending bill(s)
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 font-medium ${filterStatus === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            All Bills
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 font-medium ${filterStatus === 'pending' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-4 py-2 font-medium ${filterStatus === 'paid' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Paid
          </button>
        </div>

        {/* Bills List */}
        {bills.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No bills found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bill.description || `Bill #${bill.id.substring(0, 8)}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(bill.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(bill.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(bill.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {bill.status === 'pending' || bill.status === 'overdue' || bill.status === 'failed' ? (
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {bill.status === 'failed' ? 'Retry Payment' : 'Pay Now'}
                        </button>
                      ) : bill.status === 'paid' ? (
                        <span className="text-gray-500">
                          Paid on {formatDate(bill.paidAt)}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Payment Modal */}
        {selectedBill && (
          <BillPayment
            bill={selectedBill}
            onSuccess={() => handlePaymentSuccess(selectedBill.id)}
            onCancel={() => setSelectedBill(null)}
          />
        )}
      </div>
    </Layout>
  );
}
