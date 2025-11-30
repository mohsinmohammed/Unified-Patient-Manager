import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Unified Patient Manager
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive healthcare management system for providers, patients, and staff
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Provider Portal */}
          <Link href="/provider/login" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Provider Portal</h2>
              <p className="text-gray-600 text-center mb-6">
                Access and manage patient medical records, update diagnoses, and track treatments
              </p>
              <div className="text-center">
                <span className="text-blue-600 font-medium group-hover:underline">
                  Sign In →
                </span>
              </div>
            </div>
          </Link>

          {/* Patient Portal */}
          <Link href="/patient/login" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6 mx-auto group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Patient Portal</h2>
              <p className="text-gray-600 text-center mb-6">
                View your medical bills, make payments, and manage your healthcare account
              </p>
              <div className="text-center">
                <span className="text-green-600 font-medium group-hover:underline">
                  Sign In →
                </span>
              </div>
            </div>
          </Link>

          {/* Staff Portal */}
          <Link href="/staff/login" className="group">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6 mx-auto group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Staff Portal</h2>
              <p className="text-gray-600 text-center mb-6">
                Manage patient accounts, generate reports, and perform administrative tasks
              </p>
              <div className="text-center">
                <span className="text-purple-600 font-medium group-hover:underline">
                  Sign In →
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* New Patient Registration */}
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            New patient?{' '}
            <Link href="/patient/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure & HIPAA Compliant</h4>
              <p className="text-sm text-gray-600">Encrypted data and comprehensive audit logging</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Online Payments</h4>
              <p className="text-sm text-gray-600">Easy bill payment with Stripe integration</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Complete Records</h4>
              <p className="text-sm text-gray-600">Comprehensive medical history and treatment tracking</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4 mx-auto">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Analytics & Reports</h4>
              <p className="text-sm text-gray-600">Detailed reporting and account management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
