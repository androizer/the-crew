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
                  subOrderThunks.saveSubOrders({
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
    if (currentUser.role.includes(Role.PROFESSIONAL)) {
      dispatch(
        subOrderThunks.getSubOrders({
          join: [
            { field: 'service' },
            { field: 'rating' },
            { field: 'order' },
            { field: 'order.consumer' },
          ],
          search: {
            'service.providerId': currentUser.id,
          },
        }),
      );
    } else if (currentUser.role.includes(Role.USER)) {
      dispatch(
        orderThunks.getOrders({
          join: [{ field: 'consumer' }, { field: 'subOrders' }],
          search: {
            consumerId: currentUser.id,
          },
        }),
      );
    }
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
              .filter(_subOrder => _subOrder.status === OrderStatus.SCHEDULED)
              .map((_subOrder, index) => {
                return (
                  <Grid item key={index}>
                    <BookingCard subOrder={_subOrder} />
                  </Grid>
                );
              })
          ) : (
            subOrders
              .filter(_subOrder => _subOrder.status !== OrderStatus.SCHEDULED)
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
