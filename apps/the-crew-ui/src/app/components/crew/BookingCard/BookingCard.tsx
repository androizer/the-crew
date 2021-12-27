import { Close, StarRate } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  OutlinedInput,
  Tooltip,
  Typography,
} from '@mui/material';
import { SubOrder } from '@the-crew/common';
import { OrderStatus, OrderStatusColour, Role } from '@the-crew/common/enums';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import Flippy, { BackSide, FrontSide } from 'react-flippy';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../../store';
import { orderSelectors } from '../../../store/slices';
import { reviewThunks, subOrderThunks } from '../../../store/thunks';
import HoverRating from '../RatingBar/RatingBar';
import style from './BookingCard.module.scss';

interface IBookingCardProps {
  subOrder?: SubOrder;
}

export const BookingCard: React.FC<IBookingCardProps> = ({ subOrder }) => {
  const dispatch = useDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  const orders = useAppSelector(state => orderSelectors.selectAll(state.order));
  const [isFlipped, setFlipped] = useState(false);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (currentUser.role.includes(Role.PROFESSIONAL)) {
      const { order } = subOrder;
      if (order) {
        setCustomer(order.consumer);
      }
    } else if (currentUser.role.includes(Role.USER)) {
      const order = orders.find(order => order.subOrderIds.includes(subOrder.id));
      if (order) {
        setCustomer(order.consumer);
      }
    }
  }, []);

  return (
    <Flippy flipOnClick={false} isFlipped={isFlipped} className={style.bookingServiceCard}>
      <FrontSide>
        <div className={style.bookingSummary}>
          <div className={style.serviceNameAndStatus}>
            <Typography variant="subtitle1" className={style.serviceName}>
              {subOrder.service?.title}
            </Typography>
            <BookingStatus status={subOrder.status} message={'Request ' + subOrder.status} />
          </div>
          <Typography>
            {new Date(subOrder.createdOn).toJSON().slice(0, 10).replace(/-/g, '/')}
          </Typography>
        </div>
        <Divider />
        <div className={style.bookingDetails}>
          <div className={style.bookingAvatar}>
            <Avatar
              variant="circular"
              sx={{ height: '120px', width: '120px' }}
              alt=""
              src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGhhbmR5bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
            />
          </div>
          <div className={style.bookingReviewDetails}>
            <Typography variant="subtitle1" color="textPrimary">
              Name:{' '}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {customer?.fullName}
            </Typography>
          </div>
          {currentUser.role.includes(Role.PROFESSIONAL) && (
            <>
              <div className={style.bookingReviewDetails}>
                <Typography variant="subtitle1" color="textPrimary">
                  You rated:{' '}
                </Typography>
                <Typography variant="body2" style={{ color: 'green', fontWeight: 600 }}>
                  <StarRate
                    fontSize="medium"
                    style={{
                      display: 'inline-block',
                      position: 'relative',
                      marginRight: '1px',
                      color: 'green',
                    }}
                  />
                  {subOrder.rating?.rating}
                </Typography>
              </div>
              <div className={style.bookingReviewDetails}>
                <Typography variant="subtitle1" color="textPrimary">
                  Comments:
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {subOrder.rating?.comment}
                </Typography>
              </div>
            </>
          )}
        </div>
        <div className={style.rateNow}>
          {currentUser.role.includes(Role.PROFESSIONAL) ? (
            <Button
              variant="contained"
              color="primary"
              disabled={subOrder.status === OrderStatus.COMPLETED}
              onClick={() => {
                //let temp = new SubOrder();
                const temp = { ...subOrder };
                temp.status = OrderStatus.COMPLETED;
                dispatch(
                  subOrderThunks.saveSubOrders({
                    payload: { bulk: [temp] },
                  }),
                );
              }}
            >
              Changes status to completed
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={subOrder.status !== OrderStatus.COMPLETED}
              onClick={() => {
                setFlipped(!isFlipped);
              }}
            >
              Rate Now
            </Button>
          )}
        </div>
      </FrontSide>
      <BackSide className={style.bookingServiceCard}>
        <Grid container flexDirection="column" style={{ height: '100%' }}>
          <Grid item alignSelf="flex-end">
            <Tooltip title="Close">
              <IconButton onClick={() => setFlipped(!isFlipped)}>
                <Close fontSize="medium" />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item flex={1}>
            <Formik
              initialValues={{
                rating: subOrder?.rating?.rating,
                comment: subOrder?.rating?.comment,
              }}
              onSubmit={values => {
                dispatch(
                  reviewThunks.createReview({
                    payload: {
                      comment: values.comment,
                      rating: values.rating,
                      reviewerId: currentUser?.id,
                      serviceId: subOrder.serviceId,
                    },
                  }),
                );
                setFlipped(!isFlipped);
              }}
            >
              {({ values, handleChange, handleBlur, handleSubmit }) => (
                <form
                  className={style.rating}
                  noValidate
                  onSubmit={evt => {
                    evt.preventDefault();
                    handleSubmit();
                  }}
                >
                  <HoverRating
                    name="rating"
                    onChange={(val: number) => {
                      values.rating = val;
                    }}
                  />
                  <OutlinedInput
                    fullWidth
                    multiline
                    rows={5}
                    maxRows={5}
                    name="comment"
                    placeholder="Add a comment"
                    autoFocus={true}
                    type="text"
                    value={values.comment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Button variant="contained" type="submit" color="primary">
                    Save
                  </Button>
                </form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </BackSide>
    </Flippy>
  );
};

interface StatusSummary {
  status: string;
  message: string;
}

export function BookingStatus(props: StatusSummary) {
  return (
    <div>
      <Typography
        className={style.statusMessage}
        style={{ backgroundColor: OrderStatusColour[props.status] }}
        variant="subtitle2"
      >
        {props.message}
      </Typography>
    </div>
  );
}

export default BookingCard;
