import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentSession } from '@the-crew/common/models/session.model';

import { PaymentService, PaymentSessionService } from '../../services';
import { Cart } from '../../types';

/**
 * Create checkout session
 */
const createCheckoutSession = createAsyncThunk(
  'payment/create-checkout-session',
  async (services: Cart[], { rejectWithValue }) => {
    try {
      const response = await PaymentService.createCheckoutSession(services);
      PaymentSessionService.setPaymentSession(response.data.id);
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        throw rejectWithValue({ ...error.response.data, status: error.response.status });
      }
      throw rejectWithValue(error);
    }
  },
);

const getPaymentSession = createAsyncThunk(
  'payment/retrieve-payment-session',
  async (session: PaymentSession) => {
    console.log(session.sessionId);
    const response = await PaymentService.retrievePaymentSession(session);
    return response.data;
  },
);

export { createCheckoutSession, getPaymentSession };

export const PaymentThunks = {
  createCheckoutSession,
  getPaymentSession,
};
