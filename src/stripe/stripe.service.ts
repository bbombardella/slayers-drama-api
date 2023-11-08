import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../api-config/api-config.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly _defaultCheckoutConfig: Partial<Stripe.Checkout.SessionCreateParams>;

  constructor(private readonly apiConfigService: ApiConfigService) {
    this.stripe = new Stripe(this.apiConfigService.stripe.apiKey, {
      apiVersion: '2023-10-16',
      protocol: 'https',
    });

    this._defaultCheckoutConfig = {
      mode: 'payment',
      payment_intent_data: {
        capture_method: 'manual',
      },
      payment_method_types: ['card', 'paypal'],
      success_url: this.apiConfigService.stripe.redirectUrl,
      cancel_url: this.apiConfigService.stripe.redirectUrl,
    };
  }

  private get defaultCheckoutConfig() {
    return {
      ...this._defaultCheckoutConfig,
      expires_at: Math.floor((new Date().getTime() + 30 * 60 * 1000) / 1000),
    };
  }

  async create(
    items: Stripe.Checkout.SessionCreateParams.LineItem[],
    customerEmail: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return this.stripe.checkout.sessions.create({
      ...this.defaultCheckoutConfig,
      line_items: items,
      customer_email: customerEmail,
    });
  }

  async handleCallbackPayment(
    sessionId: string,
    shouldPay: boolean,
  ): Promise<boolean> {
    const checkout = await this.retrieve(sessionId);

    if (!shouldPay) {
      return !(await this.cancelPayment(checkout.payment_intent));
    }

    if (this.isCheckoutPaid(checkout)) {
      return true;
    }

    if (!(await this.isCaptureNeeded(checkout.payment_intent))) {
      return true;
    }

    return this.capture(checkout.payment_intent);
  }

  private async retrieve(
    sessionId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  private async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  private async capture(
    paymentIntent: Stripe.PaymentIntent | string,
  ): Promise<boolean> {
    if (typeof paymentIntent !== 'string') {
      paymentIntent = paymentIntent.id;
    }

    return (
      (await this.stripe.paymentIntents.capture(paymentIntent))?.status ===
      'succeeded'
    );
  }

  private async cancelPayment(
    paymentIntent: Stripe.PaymentIntent | string,
  ): Promise<boolean> {
    if (typeof paymentIntent !== 'string') {
      paymentIntent = paymentIntent.id;
    }

    return (
      (await this.stripe.paymentIntents.cancel(paymentIntent))?.status ===
      'canceled'
    );
  }

  private isCheckoutPaid(checkoutSession: Stripe.Checkout.Session): boolean {
    return checkoutSession?.payment_status === 'paid';
  }

  private async isCaptureNeeded(
    paymentIntent: Stripe.PaymentIntent | string,
  ): Promise<boolean> {
    if (typeof paymentIntent === 'string') {
      paymentIntent = await this.retrievePaymentIntent(paymentIntent);
    }

    return paymentIntent?.status === 'requires_capture';
  }
}
