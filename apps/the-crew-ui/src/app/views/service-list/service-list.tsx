import { Box, Container, Drawer, Grid, styled, Typography } from '@mui/material';
import { ServiceRequest } from '@the-crew/common';
import { Role, ServiceLocation, ServiceRequestType } from '@the-crew/common/enums';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { searchRecords } from '../../../assets/images/generic';
import { ServiceCard, ServiceDetail } from '../../components';
import { useAppDispatch, useAppSelector } from '../../store';
import { authSelector, cartSelectors, genericActions, serviceSelectors } from '../../store/slices';
import { serviceThunks } from '../../store/thunks';
import { CheckOut } from '../checkout';
import style from './service-list.module.scss';

const drawerWidth = 600;

interface IServiceList {
  location?: ServiceLocation | string;
  professionType?: ServiceRequestType;
}

const ServiceList: React.FC<IServiceList> = props => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [selectedService, setSelectedService] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const isLoading = useAppSelector(state => state.services.loading);
  const services = useAppSelector(state => serviceSelectors.selectAll(state.services));
  const { isInitialLoaded } = useAppSelector(state => state.services);
  const cartItems = useAppSelector(state => cartSelectors.selectAll(state.cart));
  const { user: currentUser } = useAppSelector(authSelector);

  useEffect(() => {
    if (currentUser?.role.includes(Role.PROFESSIONAL)) {
      if (!isInitialLoaded) {
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
    } else
      dispatch(
        serviceThunks.getServices({
          join: [{ field: 'provider' }, { field: 'reviews' }],
          filter: [
            {
              field: 'type',
              operator: '$in',
              value: `{${props.professionType}}`,
            },
          ],
        }),
      );
  }, [dispatch, history, currentUser, props.location, props.professionType]);

  useEffect(() => {
    dispatch(genericActions.setLoading({ isLoading }));
  }, [isLoading, dispatch]);

  return (
    <div className={style.service_list_container}>
      <Main open={showDetail}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          {!isLoading ? (
            services.length ? (
              services.map((service: ServiceRequest, index: number) => {
                return (
                  <Grid item key={index}>
                    <ServiceCard
                      service={service}
                      toggleViewDetails={() => {
                        setShowDetail(!showDetail);
                        setSelectedService(service);
                      }}
                    />
                  </Grid>
                );
              })
            ) : (
              <Grid container className={style['not-found-container']}>
                <img src={searchRecords} alt="not-found.svg" height="500px" width="auto" />
                <Typography variant="h5">Oops..! Services not found!</Typography>
                <Typography variant="subtitle1" color="gray">
                  Try another service type.
                </Typography>
              </Grid>
            )
          ) : null}
        </Grid>
        {/* Checkout Bar */}
        {!!cartItems.length && (
          <Box className={style['checkout-container']}>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              flexWrap="nowrap"
              paddingX="16px"
              className={style['checkout-bar']}
              onClick={() => {
                setShowCheckout(true);
              }}
            >
              <Grid
                item
                container
                display="inline-flex"
                justifyContent="start"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Typography
                    variant="h6"
                    component="div"
                    textAlign="center"
                    style={{ width: '32px', border: '1px solid' }}
                  >
                    {cartItems.reduce((acc, item) => {
                      acc = acc + (item.quantity ?? 1);
                      return acc;
                    }, 0)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="h6">
                    {cartItems.reduce((acc, item) => {
                      const total = (item.quantity ?? 1) * item.price;
                      acc = acc + total;
                      return acc;
                    }, 0)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="h6">Continue</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
          // AppBar having 100, Main having 99
          zIndex: 98,
        }}
        variant="persistent"
        anchor="right"
        open={showDetail}
      >
        <Container sx={{ padding: '16px', width: '100%', marginTop: '64px' }}>
          <ServiceDetail
            data={selectedService}
            toggleDrawer={() => {
              setShowDetail(!showDetail);
              setSelectedService(null);
            }}
          />
        </Container>
      </Drawer>
      {showCheckout && (
        <CheckOut
          professionType={props.professionType}
          open={showCheckout}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
};

const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flex: 1,
  zIndex: 99,
  padding: theme.spacing(2),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

export default ServiceList;
