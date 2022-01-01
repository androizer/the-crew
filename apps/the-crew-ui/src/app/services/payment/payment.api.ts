import { axiosInstance } from '../../core/services';
import { PaymentSessionService } from './session.service';

import type Stripe from 'stripe';
import type { CreateCheckoutSessionDTO, PaymentSession } from '@the-crew/common';

const basePath = 'payment';
const instance = axiosInstance;

type CreateSessionResponse = {
  session: Stripe.Checkout.Session;
  sessionRef: string;
};

function createPaymentSession(dto: CreateCheckoutSessionDTO) {
  return new Promise<Stripe.Checkout.Session>((resolve, reject) => {
    const url = `${basePath}/create-session`;
    instance
      .post<CreateSessionResponse>(url, dto)
      .then(({ data: { session, sessionRef } }) => {
        PaymentSessionService.setPaymentSession({
          key: sessionRef,
          value: session.id,
        });
        resolve(session);
      })
      .catch(err => reject(err));
  });
}

function getPaymentSession(payload: PaymentSession) {
  return new Promise<Stripe.Checkout.Session>((resolve, reject) => {
    const url = `${basePath}/retrieve-session`;
    instance
      .post<Stripe.Checkout.Session>(url, payload)
      .then(({ data }) => {
        resolve(data);
      })
      .catch(err => reject(err));
  });
}

export const PaymentApi = {
  createPaymentSession,
  getPaymentSession,
};
