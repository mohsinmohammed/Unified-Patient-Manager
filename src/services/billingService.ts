// Billing service for patient bill management and payment processing
import prisma from '@/utils/prisma';
import { stripeService } from './stripeService';

export class BillingService {
  /**
   * Get all bills for a patient
   */
  async getPatientBills(patientId: string) {
    return await prisma.bill.findMany({
      where: {
        patientId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get a specific bill by ID
   */
  async getBillById(billId: string, patientId?: string) {
    const where: any = { id: billId };
    if (patientId) {
      where.patientId = patientId;
    }

    return await prisma.bill.findUnique({
      where,
    });
  }

  /**
   * Get pending bills for a patient
   */
  async getPendingBills(patientId: string) {
    return await prisma.bill.findMany({
      where: {
        patientId,
        status: 'pending',
      },
      orderBy: {
        dueDate: 'asc',
      },
    });
  }

  /**
   * Process payment for a bill using Stripe
   */
  async processPayment(
    billId: string,
    patientId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; error?: string; bill?: any }> {
    try {
      // Get the bill
      const bill = await prisma.bill.findUnique({
        where: {
          id: billId,
          patientId,
        },
      });

      if (!bill) {
        return { success: false, error: 'Bill not found' };
      }

      if (bill.status === 'paid') {
        return { success: false, error: 'Bill already paid' };
      }

      // Process payment with Stripe
      const amountInCents = Math.round(bill.amount * 100);
      const paymentResult = await stripeService.processPayment(
        amountInCents,
        paymentMethodId,
        {
          billId: bill.id,
          patientId,
          description: bill.description || `Bill payment #${bill.id.substring(0, 8)}`,
        }
      );

      if (!paymentResult.success) {
        // Update bill status to failed
        await prisma.bill.update({
          where: { id: billId },
          data: {
            status: 'failed',
            updatedAt: new Date(),
          },
        });

        return {
          success: false,
          error: paymentResult.error || 'Payment processing failed',
        };
      }

      // Update bill status to paid
      const updatedBill = await prisma.bill.update({
        where: { id: billId },
        data: {
          status: 'paid',
          paymentMethod: 'credit_card',
          paidAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { success: true, bill: updatedBill };
    } catch (error: any) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error.message || 'An error occurred during payment processing',
      };
    }
  }

  /**
   * Create a new bill for a patient
   */
  async createBill(data: {
    patientId: string;
    amount: number;
    description?: string;
    dueDate?: Date;
  }) {
    return await prisma.bill.create({
      data: {
        patientId: data.patientId,
        amount: data.amount,
        status: 'pending',
        description: data.description,
        dueDate: data.dueDate,
      },
    });
  }

  /**
   * Mark overdue bills as overdue status
   */
  async updateOverdueBills() {
    const now = new Date();
    return await prisma.bill.updateMany({
      where: {
        status: 'pending',
        dueDate: {
          lt: now,
        },
      },
      data: {
        status: 'overdue',
        updatedAt: now,
      },
    });
  }

  /**
   * Get bill payment history for a patient
   */
  async getPaymentHistory(patientId: string) {
    return await prisma.bill.findMany({
      where: {
        patientId,
        status: 'paid',
      },
      orderBy: {
        paidAt: 'desc',
      },
    });
  }

  /**
   * Get total outstanding balance for a patient
   */
  async getOutstandingBalance(patientId: string): Promise<number> {
    const pendingBills = await prisma.bill.findMany({
      where: {
        patientId,
        status: {
          in: ['pending', 'overdue'],
        },
      },
    });

    return pendingBills.reduce((total, bill) => total + bill.amount, 0);
  }
}

export const billingService = new BillingService();
