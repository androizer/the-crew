import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
import { OrderStatus } from '@the-crew/common/enums';
import { useEffect, useMemo, useState } from 'react';

import { BookingCard } from '../../components';
import { useAppDispatch, useAppSelector } from '../../store';
import { authSelector, orderSelectors, subOrderSelector } from '../../store/slices';
import { subOrderThunks } from '../../store/thunks';
import style from './bookings.module.scss';

export default function MyBookings() {
  const [onGoing, setOnGoing] = useState(true);
  const dispatch = useAppDispatch();
  const subOrders = useAppSelector(state => subOrderSelector.selectAll(state.subOrders));
  const orders = useAppSelector(state => orderSelectors.selectAll(state.order));
  const authState = useAppSelector(authSelector);
  const handleOnClicks = () => {
    setOnGoing(!onGoing);
  };

  useEffect(() => {
    if (authState.user) {
      dispatch(
        subOrderThunks.getSubOrders({
          join: [{ field: 'service' }, { field: 'order' }, { field: 'rating' }],
        }),
      );
    }
  }, [authState.user, dispatch, orders]);
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
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        {onGoing &&
          subOrders
            .filter(x => x.status === OrderStatus.SCHEDULED)
            .map((_subOrder, index) => {
              return (
                <Grid item key={index}>
                  <BookingCard subOrder={_subOrder} />
                </Grid>
              );
            })}
        {!onGoing &&
          subOrders
            .filter(x => x.status !== OrderStatus.SCHEDULED)
            .map((_subOrder, index) => {
              return (
                <Grid item key={index}>
                  <BookingCard subOrder={_subOrder} />
                </Grid>
              );
            })}
      </Grid>
    </div>
  );
}
