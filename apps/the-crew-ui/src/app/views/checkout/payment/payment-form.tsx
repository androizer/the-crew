import { Button, DialogActions } from '@mui/material';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

import { CartSessionService, generateSubOrdersToBeSaved } from '../../../services';
import { useAppDispatch, useAppSelector } from '../../../store';
import { authSelector, orderActions } from '../../../store/slices';
import { orderThunks, subOrderThunks } from '../../../store/thunks';

interface IPaymentProps {
  clientSecret: string;
  onClose: (e) => void;
}

const PaymentForm: React.FC<IPaymentProps> = props => {
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(authSelector);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await stripe
      .confirmPayment({ elements, redirect: 'if_required' })
      .then(res => {
        console.log(res.paymentIntent);
        const paymentStatus = res.paymentIntent.status === 'succeeded';
        if (paymentStatus) {
          enqueueSnackbar('Payment Successfull', {
            variant: 'success',
          });
          dispatch(orderThunks.createOrder({ payload: { consumerId: authState.user.id } }))
            .unwrap()
            .then(currentOrder => {
              const cartItems = CartSessionService.getCartItems();
              dispatch(
                subOrderThunks.createManySubOrders({
                  payload: generateSubOrdersToBeSaved(cartItems, currentOrder),
                }),
              ).then(() => {
                orderActions.clearOrders();
                CartSessionService.removeCartItems();
                props.onClose(paymentStatus);
              });
            });
        } else {
          enqueueSnackbar('Payment failed', {
            variant: 'error',
          });
          props.onClose(paymentStatus);
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={e => {
            console.log(e);
          }}
        >
          Pay
        </Button>
      </DialogActions>
    </form>
  );
};

export default PaymentForm;
