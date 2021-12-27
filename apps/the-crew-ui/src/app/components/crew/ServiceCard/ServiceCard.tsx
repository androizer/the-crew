import { StarRate } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Slide,
  Typography,
} from '@mui/material';
import { ServiceRequest } from '@the-crew/common';
import { Role } from '@the-crew/common/enums';
import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { authSelector, cartActions, cartSelectors } from '../../../store/slices';
import { AddButton } from '../../generic';
import style from './serviceCard.module.scss';

interface IServiceCard {
  service: ServiceRequest;
  /**
   * Callback to view service details
   */
  toggleViewDetails: () => void;
}

export const ServiceCard: React.FC<IServiceCard> = props => {
  const dispatch = useAppDispatch();
  const cartItem = useAppSelector(state => cartSelectors.selectById(state.cart, props.service.id));
  const authState = useAppSelector(authSelector);

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
        <Grid className={style.cardActionGrid} container spacing={2}>
          <Grid item xs={4}>
            <CardMedia
              className={style.media}
              image="https://res.cloudinary.com/urbanclap/image/upload/t_medium_res_template,q_30/images/supply/customer-app-supply/1634118672958-fb2d33.png"
              title={props.service.title}
            />
          </Grid>
          <Grid item xs={8}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography variant="h6">{props.service.title}</Typography>
                <Grid
                  container
                  item
                  justifyContent="start"
                  alignItems="center"
                  spacing={0.5}
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
                <Typography variant="body2" color="textSecondary" component="p">
                  {props.service.reviewIds.length} ratings
                </Typography>
                <Typography variant="subtitle1">₹ {props.service.price}</Typography>
              </Grid>
              {authState.user ? (
                authState.user.role.includes(Role.PROFESSIONAL) ? null : (
                  <Grid
                    item
                    xs={6}
                    justifyContent="center"
                    alignItems="flex-start"
                    style={{ display: 'flex' }}
                  >
                    <AddButton
                      count={cartItem?.quantity ?? 0}
                      onAdd={onServiceAdd}
                      onRemove={onServiceRemove}
                    />
                  </Grid>
                )
              ) : (
                <Grid
                  item
                  xs={6}
                  justifyContent="center"
                  alignItems="flex-start"
                  style={{ display: 'flex' }}
                >
                  <AddButton
                    count={cartItem?.quantity ?? 0}
                    onAdd={onServiceAdd}
                    onRemove={onServiceRemove}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <CardContent style={{ padding: 0 }}>
          <Divider />
          <ul>
            {props.service.description.split(/[\r\n]+/g).map((point, index) => {
              return (
                <li key={index}>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {point}
                  </Typography>
                </li>
              );
            })}
          </ul>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={() => props.toggleViewDetails()}>
            View Details {'>'}
          </Button>
        </CardActions>
      </Card>
    </Slide>
  );
};

export default ServiceCard;
