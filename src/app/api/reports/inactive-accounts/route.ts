// Inactive accounts report API for staff
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware, staffOnly } from '@/middleware/auth';
import { handleAPIError } from '@/middleware/errorHandler';
import { accountService } from '@/services/accountService';

export async function GET(request: NextRequest) {
  try {
    // Authenticate and authorize staff
    const user = await authMiddleware(request);
    staffOnly(user);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const years = parseInt(searchParams.get('years') || '7');

    // Get inactive accounts
    const inactiveAccounts = await accountService.getInactiveAccounts(years);

    // Calculate statistics
    const totalInactive = inactiveAccounts.length;
    const neverAccessed = inactiveAccounts.filter(p => !p.lastAccessDate).length;
    const oldestAccount = inactiveAccounts[0]; // Already sorted by lastAccessDate ASC

    return NextResponse.json({
      accounts: inactiveAccounts,
      statistics: {
        totalInactive,
        neverAccessed,
        oldestAccount: oldestAccount ? {
          email: oldestAccount.email,
          name: `${oldestAccount.firstName} ${oldestAccount.lastName}`,
          lastAccess: oldestAccount.lastAccessDate,
        } : null,
      },
      criteria: {
        minimumYears: years,
        cutoffDate: new Date(Date.now() - years * 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
