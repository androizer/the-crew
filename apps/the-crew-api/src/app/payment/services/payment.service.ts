import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { randomBytes } from 'crypto';
import Stripe from 'stripe';
import { In } from 'typeorm';

import { PaymentConfig } from '../../../configs';
import { ServiceRequestService } from '../../service-request/services';

import type { CartDTO, uuid } from '@the-crew/common';
@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private feeItem;
  constructor(
    private readonly serviceRequestService: ServiceRequestService,
    @Inject(PaymentConfig.KEY) private readonly paymentConfig: ConfigType<typeof PaymentConfig>,
  ) {
    this.stripe = new Stripe(paymentConfig.stripeSecretKey, {
      apiVersion: '2020-08-27',
    });
    this.feeItem = {
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Convenience Fee',
        },
        unit_amount: this.paymentConfig.convenienceFee * 100,
      },
      quantity: 1,
    };
  }

  async retrieveSessionBySessionId(id: string) {
    return this.stripe.checkout.sessions.retrieve(id);
  }

  async expireSession(id: string) {
    return this.stripe.checkout.sessions.expire(id);
  }

  async createCheckOutSession(cartItems: CartDTO[]) {
    const serviceIds = cartItems.map(({ serviceId }) => serviceId);
    const services = await this.serviceRequestService.find({
      where: { id: In(serviceIds) },
    });
    let sessionRef = randomBytes(32).toString('base64');
    // replace every + from the string
    sessionRef = sessionRef.replace(new RegExp(/[+]/, 'g'), '');
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: services
        .map(service => {
          const cartItem = cartItems.find(cart => cart.serviceId === service.id);
          return {
            price_data: {
              currency: 'inr',
              product_data: {
                name: service.title,
              },
              unit_amount: service.price * 100,
            },
            quantity: cartItem.quantity,
          };
        })
        .concat([this.feeItem]),
      success_url: `${process.env.NX_CORS_ORIGINS}/bookings?sRef=${sessionRef}`,
      cancel_url: `${process.env.NX_CORS_ORIGINS}`,
      // TODO: add the expires_at
    });
    return { session, sessionRef };
  }
}
