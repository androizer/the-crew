import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
import { PaymentSession } from '@the-crew/common/models/session.model';
import { OrderStatus, Role } from '@the-crew/common/enums';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { searchRecords } from '../../../assets/images/generic';
import { BookingCard, OverlayLoading } from '../../components';
import {
  CartSessionService,
  generateSubOrdersToBeSaved,
  PaymentSessionService,
} from '../../services';
import { useAppDispatch, useAppSelector } from '../../store';
import { orderActions, subOrderSelector } from '../../store/slices';
import { orderThunks, PaymentThunks, subOrderThunks } from '../../store/thunks';
import style from './bookings.module.scss';

export default function MyBookings() {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const paymentSession = useMemo(() => new PaymentSession(), []);
  const subOrders = useAppSelector(state => subOrderSelector.selectAll(state.subOrders));
  const isLoading = useAppSelector(state => state.subOrders.loading);
  const currentUser = useAppSelector(state => state.auth.user);
  const [onGoing, setOnGoing] = useState(true);

  const handleOnClicks = () => {
    setOnGoing(!onGoing);
  };

  useEffect(() => {
    if (currentUser) {
      const sessionId = PaymentSessionService.getPaymentSession();
      if (sessionId !== null) {
        paymentSession.sessionId = sessionId;
        dispatch(PaymentThunks.getPaymentSession(paymentSession)).then(res => {
          if (res.payload.payment_status === 'paid') {
            dispatch(orderThunks.createOrder({ payload: { consumerId: currentUser.id } }))
              .unwrap()
              .then(currentOrder => {
                const cartItems = JSON.parse(CartSessionService.getCartItems());
                dispatch(
                  subOrderThunks.createManySubOrders({
                    payload: generateSubOrdersToBeSaved(cartItems, currentOrder),
                  }),
                ).then(() => {
                  orderActions.clearOrders();
                  CartSessionService.removeCartItems();
                });
              });
          }
          PaymentSessionService.removePaymentSession();
        });
      }
    } else {
      history.push('/');
    }
  }, [dispatch, paymentSession, currentUser]);

  useEffect(() => {
    // get all sub-orders
    dispatch(
      subOrderThunks.getSubOrders({
        join: [
          { field: 'service' },
          { field: 'rating' },
          { field: 'order' },
          {
            ...(currentUser.role.includes(Role.PROFESSIONAL)
              ? { field: 'order.consumer' }
              : { field: 'service.provider' }),
          },
        ],
        search: {
          ...(currentUser.role.includes(Role.PROFESSIONAL)
            ? { 'service.providerId': currentUser.id }
            : { 'order.consumerId': currentUser.id }),
        },
      }),
    );
  }, []);

  return (
    <div className={style.bookingRoot}>
      <Typography variant="h5" textAlign="center">
        My Bookings
      </Typography>
      <div style={{ textAlign: 'center' }}>
        <ButtonGroup variant="outlined" color="primary">
          <Button
            variant={onGoing ? 'contained' : 'outlined'}
            onClick={() => {
              if (!onGoing) {
                handleOnClicks();
              }
            }}
          >
            Ongoing
          </Button>
          <Button
            variant={!onGoing ? 'contained' : 'outlined'}
            onClick={() => {
              if (onGoing) {
                handleOnClicks();
              }
            }}
          >
            History
          </Button>
        </ButtonGroup>
      </div>
      <Grid container flex={1} spacing={2} justifyContent="center" alignItems="center">
        {isLoading ? (
          <OverlayLoading open={isLoading} />
        ) : subOrders.length ? (
          onGoing ? (
            subOrders
              .filter(_subOrder => [OrderStatus.SCHEDULED].includes(_subOrder.status))
              .map((_subOrder, index) => {
                return (
                  <Grid item key={index}>
                    <BookingCard subOrder={_subOrder} />
                  </Grid>
                );
              })
          ) : (
            subOrders
              .filter(_subOrder =>
                [OrderStatus.CANCELLED, OrderStatus.COMPLETED].includes(_subOrder.status),
              )
              .map((_subOrder, index) => {
                return (
                  <Grid item key={index}>
                    <BookingCard subOrder={_subOrder} />
                  </Grid>
                );
              })
          )
        ) : (
          <Grid
            container
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <img src={searchRecords} alt="recent-bookings.svg" height="500px" width="auto" />
            <Typography variant="h5">Oops..! Bookings not found!</Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
}
