import ListIcon from '@mui/icons-material/List';
import { Box, Button, Grid, Typography } from '@mui/material';
import { OrderStatus } from '@the-crew/common/enums';
import { useEffect } from 'react';
import Carousel, { Responsive } from 'react-alice-carousel';
import { useNavigate } from 'react-router-dom';

import { BookingCard, ServiceCard } from '../../components';
import { useAppDispatch, useAppSelector } from '../../store';
import { serviceSelectors, subOrderSelector } from '../../store/slices';
import { serviceThunks, subOrderThunks } from '../../store/thunks';
import style from './dashboard.module.scss';

const minServices = 5;
const minBookings = 5;

const aliceResponsive: Record<string, Responsive> = {
  services: {
    1920: {
      items: 5,
    },
    1024: {
      items: 4,
    },
    600: {
      items: 2,
    },
    0: {
      items: 1,
    },
  },
  bookings: {
    1920: {
      items: 4,
    },
    1024: {
      items: 3,
    },
    600: {
      items: 2,
    },
    0: {
      items: 1,
    },
  },
};

const Dashboard = props => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const services = useAppSelector(state => serviceSelectors.selectAll(state.services));
  const bookings = useAppSelector(state => subOrderSelector.selectAll(state.subOrders));
  const { isInitialLoaded: areServicesInitialLoaded } = useAppSelector(state => state.services);
  const { isLoaded: areBookingsInitialLoaded } = useAppSelector(state => state.subOrders);
  const { user: currentUser } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (!areServicesInitialLoaded) {
      dispatch(
        serviceThunks.getServices({
          join: [
            {
              field: 'provider',
            },
            {
              field: 'reviews',
            },
          ],
          sort: { field: 'modifiedOn', order: 'DESC' },
          search: {
            providerId: currentUser.id,
          },
        }),
      );
    }
    if (!areBookingsInitialLoaded) {
      dispatch(
        subOrderThunks.getSubOrders({
          join: [
            { field: 'service' },
            { field: 'rating' },
            { field: 'order' },
            { field: 'order.consumer' },
          ],
          sort: { field: 'modifiedOn', order: 'DESC' },
          search: {
            $and: [{ 'service.providerId': currentUser.id }],
          },
        }),
      );
    }
  }, []);

  return (
    <Grid container flex={1} flexDirection="column" padding={4}>
      {/* Recent Services */}
      <Grid container flexDirection="column" rowSpacing={4}>
        <Grid item container justifyContent="space-between" alignItems="baseline" columnSpacing={2}>
          <Grid item>
            <Typography variant="h6">Recent {minServices} Services</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ListIcon />}
              onClick={() => {
                navigate('/services');
              }}
            >
              Show All
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          container
          justifyContent="start"
          alignItems="center"
          spacing={2}
          className={style['services-carousel']}
        >
          {services.length ? (
            <Carousel
              autoHeight={false}
              responsive={aliceResponsive.services}
              mouseTracking
              controlsStrategy="default,responsive"
              paddingLeft={32}
              paddingRight={32}
            >
              {services.reduce((acc, service, index) => {
                if (minServices > index) {
                  acc.push(
                    <Box key={index}>
                      <ServiceCard
                        service={service}
                        disableAddButton
                        toggleViewDetails={() => {
                          console.log(service);
                        }}
                      />
                    </Box>,
                  );
                }
                return acc;
              }, [])}
            </Carousel>
          ) : null}
        </Grid>
      </Grid>
      {/* Recent Bookings */}
      <Grid container flexDirection="column" rowSpacing={4}>
        <Grid item container justifyContent="space-between" alignItems="baseline" columnSpacing={2}>
          <Grid item>
            <Typography variant="h6">Recent {minBookings} Scheduled Bookings</Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ListIcon />}
              onClick={() => {
                navigate('/bookings');
              }}
            >
              Show All
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          container
          justifyContent="start"
          alignItems="center"
          spacing={2}
          className={style['bookings-carousel']}
        >
          {bookings.length ? (
            <Carousel
              responsive={aliceResponsive.bookings}
              mouseTracking
              controlsStrategy="default,responsive"
              paddingLeft={32}
              paddingRight={32}
            >
              {bookings.reduce((acc, _subOrder, index) => {
                if (_subOrder.status === OrderStatus.SCHEDULED) {
                  if (acc.length < minBookings) {
                    acc.push(
                      <Box key={index} width="auto">
                        <BookingCard subOrder={_subOrder} />
                      </Box>,
                    );
                  }
                }
                return acc;
              }, [])}
            </Carousel>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
