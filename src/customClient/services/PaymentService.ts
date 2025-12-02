/* Custom service - not auto-generated */
/* istanbul ignore file */
/* tslint:disable */
 

import type {
  CreatePaymentIntentRequest,
  CreatePaymentIntentResponse,
  PricingPlan,
} from '../models/PaymentTypes';

// Mock pricing plans - will be replaced with API call when backend is ready
const MOCK_PLANS: PricingPlan[] = [
  {
    id: 'plan_starter',
    name: 'Starter',
    description: 'Perfect for individuals and small teams getting started',
    price: 9,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 5 users',
      'Basic time tracking',
      'Weekly reports',
      'Email support',
    ],
  },
  {
    id: 'plan_professional',
    name: 'Professional',
    description: 'For growing teams that need more power',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      'Up to 25 users',
      'Advanced time tracking',
      'Custom reports',
      'Priority support',
      'API access',
      'Integrations',
    ],
    recommended: true,
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: 99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited users',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
      'Custom training',
    ],
  },
];

export class PaymentService {
  /**
   * Get available pricing plans
   * @returns PricingPlan[] List of available plans
   */
  public static async getPlans(): Promise<PricingPlan[]> {
    // TODO: Replace with actual API call when backend is ready
    // return await __request(OpenAPI, { method: 'GET', url: '/api/plans' });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_PLANS;
  }

  /**
   * Create a payment intent for Stripe
   * @param request Payment intent request with plan ID
   * @returns CreatePaymentIntentResponse with client secret
   */
  public static async createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<CreatePaymentIntentResponse> {
    // TODO: Replace with actual API call when backend is ready
    // return await __request(OpenAPI, {
    //   method: 'POST',
    //   url: '/api/payments/create-intent',
    //   body: request,
    // });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find the selected plan
    const plan = MOCK_PLANS.find((p) => p.id === request.planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    // Generate a mock client secret
    // In production, this comes from Stripe via your backend
    // Format: pi_xxx_secret_xxx
    const mockPaymentIntentId = `pi_mock_${Date.now()}`;
    const mockClientSecret = `${mockPaymentIntentId}_secret_${Math.random().toString(36).substring(7)}`;

    return {
      clientSecret: mockClientSecret,
      paymentIntentId: mockPaymentIntentId,
      amount: plan.price * 100, // Stripe uses cents
      currency: request.currency || plan.currency,
    };
  }

  /**
   * Confirm payment was successful (webhook simulation)
   * @param paymentIntentId The payment intent ID to confirm
   * @returns boolean indicating success
   */
  public static async confirmPayment(paymentIntentId: string): Promise<boolean> {
    // TODO: Replace with actual API call when backend is ready
    // In production, this is typically handled by Stripe webhooks

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock success
    console.log(`[Mock] Payment confirmed: ${paymentIntentId}`);
    return true;
  }
}
