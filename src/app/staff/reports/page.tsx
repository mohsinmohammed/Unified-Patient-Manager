'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StaffReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to inactive accounts report
    router.push('/staff/reports/inactive-accounts');
  }, [router]);

  return null;
}
