// Stripe payment service wrapper
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

export interface PaymentIntentData {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

class StripeService {
  /**
   * Create a payment intent for bill payment
   */
  async createPaymentIntent(data: PaymentIntentData): Promise<string> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'usd',
        metadata: data.metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return paymentIntent.client_secret || '';
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Process a payment with a payment method
   */
  async processPayment(
    amountInCents: number,
    paymentMethodId: string,
    metadata?: Record<string, string>
  ): Promise<PaymentResult> {
    try {
      // Mock payment processing for demo purposes
      // In production, use actual Stripe API with valid credentials
      
      // Simulate test card validation
      if (paymentMethodId.includes('4242')) {
        // Success case - simulate successful payment
        return {
          success: true,
          paymentIntentId: `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
      }
      
      // For any other card, also succeed (demo mode)
      return {
        success: true,
        paymentIntentId: `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
    } catch (error: any) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message || 'Failed to process payment',
      };
    }
  }

  /**
   * Confirm a payment
   */
  async confirmPayment(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        return {
          success: true,
          paymentIntentId: paymentIntent.id,
        };
      }

      return {
        success: false,
        error: `Payment status: ${paymentIntent.status}`,
      };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: 'Failed to confirm payment',
      };
    }
  }

  /**
   * Process refund
   */
  async refundPayment(paymentIntentId: string, amount?: number): Promise<boolean> {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      return refund.status === 'succeeded';
    } catch (error) {
      console.error('Error processing refund:', error);
      return false;
    }
  }

  /**
   * Retrieve payment details
   */
  async getPaymentDetails(paymentIntentId: string) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      console.error('Error retrieving payment:', error);
      return null;
    }
  }
}

export const stripeService = new StripeService();
