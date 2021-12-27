import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ServiceRequest } from '@the-crew/common';
import Stripe from 'stripe';

import { PaymentConfig } from '../../../configs';
import { ServiceRequestService } from '../../service-request/services';

@Injectable()
export class PaymentService {
  stripe: Stripe;
  constructor(
    private readonly serviceRequestService: ServiceRequestService,
    @Inject(PaymentConfig.KEY) private readonly paymentConfig: ConfigType<typeof PaymentConfig>,
  ) {
    this.stripe = new Stripe(paymentConfig.stripeSecretKey, {
      apiVersion: '2020-08-27',
    });
  }

  public async RetrieveSessionBySessionId(id: string) {
    return await this.stripe.checkout.sessions.retrieve(id);
  }

  public async CreateCheckOutSession(services: ServiceRequest[]) {
    const availableServices = await this.serviceRequestService.find();
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: services.map(item => {
        const service = availableServices.find(x => x.id === item.id);
        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: service.title,
            },
            unit_amount: service.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.NX_CORS_ORIGINS}/bookings`,
      cancel_url: `${process.env.NX_CORS_ORIGINS}`,
    });
    return session;
  }
}
