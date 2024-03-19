import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

export class StripeService {
  private stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      configService.get('STRIPE_SECRET_KEY', { infer: true }) ?? '',
      {
        apiVersion: '2023-10-16',
      },
    );
  }

  async createCustomer(email: string): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.create({
      email,
    });

    return customer;
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
    });

    return paymentIntent;
  }

  // Add more methods for handling subscriptions, charges, etc.
}

export default StripeService;
