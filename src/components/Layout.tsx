// Responsive layout component with navigation
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
  userType?: 'provider' | 'patient' | 'staff' | null;
}

export default function Layout({ children, userType }: LayoutProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                UPM
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              {!userType && (
                <></>
              )}

              {userType === 'provider' && (
                <>
                  <Link
                    href="/provider/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/provider/dashboard')
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/provider/patients"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      pathname.startsWith('/provider/patients')
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Patients
                  </Link>
                </>
              )}

              {userType === 'patient' && (
                <>
                  <Link
                    href="/patient/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/patient/dashboard')
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {userType === 'staff' && (
                <>
                  <Link
                    href="/staff/dashboard"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      isActive('/staff/dashboard')
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/staff/reports"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                      pathname.startsWith('/staff/reports')
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Reports
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = '/staff/login';
                    }}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Unified Patient Manager. HIPAA Compliant. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
