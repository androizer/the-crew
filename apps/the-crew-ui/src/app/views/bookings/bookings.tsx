import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
import { OrderStatus, Role } from '@the-crew/common/enums';
import { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { searchRecords } from '../../../assets/images/generic';
import { BookingCard } from '../../components';
import {
  CartSessionService,
  generateSubOrdersToBeSaved,
  PaymentApi,
  PaymentSessionService,
  subOrderApi,
} from '../../services';
import { useAppDispatch, useAppSelector } from '../../store';
import { genericActions, subOrderSelector } from '../../store/slices';
import { orderThunks, subOrderThunks } from '../../store/thunks';
import style from './bookings.module.scss';

import type { PaymentSession } from '@the-crew/common';

export default function MyBookings() {
  const history = useHistory();
  const { search } = useLocation();
  const dispatch = useAppDispatch();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const subOrders = useAppSelector(state => subOrderSelector.selectAll(state.subOrders));
  const isLoaded = useAppSelector(state => state.subOrders.isLoaded);
  const isLoading = useAppSelector(state => state.subOrders.loading);
  const currentUser = useAppSelector(state => state.auth.user);
  const [onGoing, setOnGoing] = useState(true);

  const handleOnClicks = () => {
    setOnGoing(!onGoing);
  };

  useEffect(() => {
    const sessionRef = query.get('sRef');
    if (sessionRef) {
      const sessionId = PaymentSessionService.getPaymentSession(query.get('sRef'));
      if (sessionId !== null) {
        const paymentSession: PaymentSession = {
          sessionId,
        };
        PaymentApi.getPaymentSession(paymentSession).then(res => {
          if (res.payment_status === 'paid') {
            dispatch(orderThunks.createOrder({ payload: { consumerId: currentUser.id } }))
              .unwrap()
              .then(currentOrder => {
                const cartItems = CartSessionService.getCartItems();
                subOrderApi
                  .createMany(generateSubOrdersToBeSaved(cartItems, currentOrder))
                  .then(() => {
                    CartSessionService.removeCartItems();
                    PaymentSessionService.removePaymentSession(sessionRef);
                    getBookings();
                    history.push('/bookings');
                  });
              });
          }
        });
      }
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    // get all sub-orders
    if (!isLoaded) {
      getBookings();
    }
  }, []);

  useEffect(() => {
    dispatch(genericActions.setLoading({ isLoading }));
  }, [isLoading, dispatch]);

  const getBookings = () => {
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
        sort: {field: 'modifiedOn', order: 'DESC'},
        search: {
          ...(currentUser.role.includes(Role.PROFESSIONAL)
            ? { 'service.providerId': currentUser.id }
            : { 'order.consumerId': currentUser.id }),
        },
      }),
    );
  };

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
      <Grid container flex={1} flexDirection="column">
        {!isLoading ? (
          subOrders.length ? (
            <Grid container spacing={2} justifyContent="center" alignItems="start">
              {onGoing
                ? subOrders
                    .filter(_subOrder => [OrderStatus.SCHEDULED].includes(_subOrder.status))
                    .map((_subOrder, index) => {
                      return (
                        <Grid item key={index}>
                          <BookingCard subOrder={_subOrder} />
                        </Grid>
                      );
                    })
                : subOrders
                    .filter(_subOrder =>
                      [OrderStatus.CANCELLED, OrderStatus.COMPLETED].includes(_subOrder.status),
                    )
                    .map((_subOrder, index) => {
                      return (
                        <Grid item key={index}>
                          <BookingCard subOrder={_subOrder} />
                        </Grid>
                      );
                    })}
            </Grid>
          ) : (
            <Grid
              container
              flex={1}
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              <img src={searchRecords} alt="recent-bookings.svg" height="500px" width="auto" />
              <Typography variant="h5">Oops..! Bookings not found!</Typography>
            </Grid>
          )
        ) : null}
      </Grid>
    </div>
  );
}
