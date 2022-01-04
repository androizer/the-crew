import { StarRate } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  Grid,
  Slide,
  Typography,
} from '@mui/material';
import { ServiceRequest } from '@the-crew/common';
import { useCallback } from 'react';

import { AddButton } from '../..';
import { useAppDispatch, useAppSelector } from '../../../store';
import { cartActions, cartSelectors } from '../../../store/slices';
import style from './serviceCard.module.scss';

const avatarUrl =
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGhhbmR5bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60';

interface IServiceCard {
  service: ServiceRequest;
  /**
   * Callback to view service details
   */
  toggleViewDetails?: () => void;
  disableAddButton?: boolean;
}

export const ServiceCard: React.FC<IServiceCard> = props => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(state => cartSelectors.selectById(state.cart, props.service.id));

  const onServiceAdd = (count: number) => {
    if (count) {
      if (count === 1) {
        dispatch(cartActions.addItem({ ...props.service, quantity: 1 }));
      } else {
        dispatch(cartActions.addQuantity({ id: props.service.id, changes: { quantity: count } }));
      }
    }
  };

  const onServiceRemove = (count: number) => {
    if (!count) {
      dispatch(cartActions.removeItem(props.service.id));
    } else {
      dispatch(cartActions.removeQuantity({ id: props.service.id, changes: { quantity: count } }));
    }
  };

  const getRatings = useCallback(() => {
    if (props.service.reviewIds.length) {
      return (
        props.service?.reviews.reduce((acc, item) => {
          acc += item.rating;
          return acc;
        }, 0) / props.service.reviewIds.length
      );
    }
    return 0;
  }, [props.service]);

  return (
    <Slide direction="up" in={true} timeout={1000}>
      <Card className={style.cardRoot} elevation={6}>
        <Grid container flexDirection="column" flexWrap="nowrap" height="100%" width="100%">
          <Box height="250px" width="100%" className={style['img-container']}>
            <Avatar
              variant="circular"
              alt="user-avatar"
              src={avatarUrl}
              className={style['avatar-wrapper']}
            />
          </Box>
          <Grid container flex={1} flexDirection="column" rowSpacing={1} padding={2}>
            <Typography variant="h6">{props.service.title}</Typography>
            <Grid container item justifyContent="space-between" alignItems="center">
              <Grid
                item
                display="inline-flex"
                justifyContent="start"
                alignItems="center"
                columnSpacing={0.5}
                style={{
                  color: 'green',
                  fontWeight: 600,
                }}
              >
                <Grid item>
                  <StarRate fontSize="medium" />
                </Grid>
                <Grid item>
                  <span>{getRatings()}</span>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="GrayText" component="p">
                  {props.service.reviewIds.length} ratings
                </Typography>
              </Grid>
            </Grid>
            <Grid item container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="subtitle1">₹ {props.service.price}</Typography>
              </Grid>
              <Grid item>
                <AddButton
                  count={cartItem?.quantity ?? 0}
                  onAdd={onServiceAdd}
                  onRemove={onServiceRemove}
                />
              </Grid>
            </Grid>
            <Grid item flex={1} overflow="auto">
              <Typography variant="body2" whiteSpace="pre-line" className={style['svc-desc']}>
                {props.service.description}
              </Typography>
            </Grid>
          </Grid>
          {props.toggleViewDetails && (
            <>
              <Divider />
              <CardActions>
                <Button size="small" color="primary" onClick={() => props.toggleViewDetails()}>
                  View Details {'>'}
                </Button>
              </CardActions>
            </>
          )}
        </Grid>
      </Card>
    </Slide>
  );
};

ServiceCard.defaultProps = {
  disableAddButton: false,
};

export default ServiceCard;
