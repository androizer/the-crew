import { createAsyncThunk } from '@reduxjs/toolkit';
import { Cart, User } from '@the-crew/common/models';

import { PaymentService } from '../../services';

/**
 * Create payment intent
 */
const CreatePaymentSession = createAsyncThunk(
  'payment/create-payment-intent',
  async (args: { services: Cart[]; user: User }, { rejectWithValue }) => {
    try {
      const response = await PaymentService.CreatePaymentIntent(args);
      //PaymentSessionService.setPaymentSession(response.data.id);
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        throw rejectWithValue({ ...error.response.data, status: error.response.status });
      }
      throw rejectWithValue(error);
    }
  },
);

export { CreatePaymentSession };

export const PaymentThunks = {
  CreatePaymentSession,
};
