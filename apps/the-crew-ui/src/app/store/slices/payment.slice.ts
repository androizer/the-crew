import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Stripe from 'stripe';
import { RootState } from '../store';
import { PaymentThunks } from '../thunks';

type PaymentState = {
  payment: Stripe.PaymentIntent;
  isLoading: boolean;
};

const initialState: PaymentState = {
  payment: null,
  isLoading: false,
};
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(PaymentThunks.CreatePaymentSession.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        PaymentThunks.CreatePaymentSession.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.payment = action.payload;
          state.isLoading = false;
        },
      ),
});

export const paymentReducer = paymentSlice.reducer;

export const paymentSelectors = (state: RootState) => state.payment;
