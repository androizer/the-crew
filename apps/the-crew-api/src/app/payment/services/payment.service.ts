import { Injectable } from '@nestjs/common';
import { Cart, User } from '@the-crew/common';
import Stripe from 'stripe';

import { ServiceRequestService } from '../../service-request/services';

@Injectable()
export class PaymentService {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}
  stripe = new Stripe(process.env.NX_STRIPE_PRIVATE_KEY, {
    apiVersion: '2020-08-27',
  });
  public async CreatePaymentIntent(services: Cart[], customer: User) {
    let amountToBePaid = 0;
    services.forEach(x => (amountToBePaid += x.price * x.quantity));
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountToBePaid,
      currency: 'inr',
      payment_method_types: ['card'],
      receipt_email: 'bsvskrishna.98@gmail.com',
    });
    return paymentIntent;
  }
}
