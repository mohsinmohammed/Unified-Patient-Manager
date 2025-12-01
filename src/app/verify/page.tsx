'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await fetch(`/api/auth/verify/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setStatus('success');
      setMessage(data.message || 'Email verified successfully');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Verification failed');
    }
  };

  return (
    <Layout userType={null}>
      <div className="max-w-md mx-auto mt-12">
        {status === 'verifying' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Email...
            </h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-green-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Email Verified!
            </h2>
            <p className="text-green-700 mb-6">{message}</p>
            <button
              onClick={() => router.push('/patient/login')}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              Go to Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-red-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-red-900 mb-2">
              Verification Failed
            </h2>
            <p className="text-red-700 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/patient/register')}
                className="block w-full px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Register New Account
              </button>
              <button
                onClick={() => router.push('/patient/login')}
                className="block w-full px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <Layout userType={null}>
        <div className="max-w-md mx-auto mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          </div>
        </div>
      </Layout>
    }>
      <VerifyContent />
    </Suspense>
  );
}
