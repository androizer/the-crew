import { StarRate, Check } from '@mui/icons-material';
import { Avatar, Button, Divider, Grid, OutlinedInput, Tooltip, Typography } from '@mui/material';
import { Review, SubOrder, User } from '@the-crew/common';
import { OrderStatus, OrderStatusColour, Role } from '@the-crew/common/enums';
import { isObject } from 'class-validator';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import Flippy, { BackSide, FrontSide } from 'react-flippy';
import { number, object, string } from 'yup';

import { useAppDispatch, useAppSelector } from '../../../store';
import { reviewThunks, subOrderThunks } from '../../../store/thunks';
import HoverRating from '../RatingBar/RatingBar';
import style from './BookingCard.module.scss';

const avatarUrl =
  'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fGhhbmR5bWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60';

interface IBookingCardProps {
  subOrder?: SubOrder;
}

export const BookingCard: React.FC<IBookingCardProps> = ({ subOrder }) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.user);
  const [isFlipped, setFlipped] = useState(false);
  const [user, setUser] = useState<User>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const { order, service } = subOrder;
    if (currentUser.role.includes(Role.PROFESSIONAL)) {
      if (order) {
        setUser(order.consumer);
      }
    } else {
      if (service) {
        setUser(service.provider);
      }
    }
  }, []);

  return (
    <Flippy flipOnClick={false} isFlipped={isFlipped} className={style.bookingServiceCard}>
      <FrontSide>
        <div className={style.bookingSummary}>
          <div className={style.serviceNameAndStatus}>
            <Tooltip title={subOrder.service.title}>
              <Typography variant="subtitle1" className={style.serviceName}>
                {subOrder.service.title}
              </Typography>
            </Tooltip>
            <BookingStatus status={subOrder.status} message={`Request ${subOrder.status}`} />
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
              alt="user-avatar"
              src={avatarUrl}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
              }}
            >
              <div className={style.bookingReviewDetails}>
                <Typography variant="subtitle1" color="textPrimary">
                  Name:
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user?.fullName}
                </Typography>
              </div>
              <div className={style.bookingReviewDetails}>
                <Typography variant="subtitle1" color="textPrimary">
                  Phone:
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {user?.phone}
                </Typography>
              </div>
              {subOrder.rating && (
                <div className={style.bookingReviewDetails}>
                  <Typography variant="subtitle1" color="textPrimary">
                    {currentUser.role.includes(Role.PROFESSIONAL) ? 'Your rating:' : 'You rated:'}
                  </Typography>
                  <span className={style.ratingWrapper}>
                    <StarRate fontSize="medium" />
                    <Typography variant="body1">{subOrder.rating?.rating}</Typography>
                  </span>
                </div>
              )}
            </div>
          </div>
          {subOrder.rating && (
            <div className={style.bookingReviewDetails}>
              <Typography variant="subtitle1" color="textSecondary" className={style.reviewComment}>
                {subOrder.rating?.comment}
              </Typography>
            </div>
          )}
        </div>
        <div className={style['action-controls']}>
          {currentUser.role.includes(Role.PROFESSIONAL) ? (
            subOrder.status === OrderStatus.SCHEDULED && (
              <>
                <Button variant="contained" color="warning" disabled>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<Check />}
                  onClick={() => {
                    dispatch(
                      subOrderThunks.updateSubOrder({
                        payload: {
                          id: subOrder.id,
                          changes: {
                            status: OrderStatus.COMPLETED,
                          },
                        },
                      }),
                    )
                      .unwrap()
                      .then(() =>
                        enqueueSnackbar('Order marked as Completed', { variant: 'success' }),
                      )
                      .catch(error =>
                        enqueueSnackbar(error.message ?? 'Something went wrong!', {
                          variant: 'error',
                        }),
                      );
                  }}
                >
                  Done
                </Button>
              </>
            )
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={isObject(subOrder.rating) || subOrder.status !== OrderStatus.COMPLETED}
              onClick={() => {
                setFlipped(!isFlipped);
              }}
            >
              Rate Now
            </Button>
          )}
        </div>
      </FrontSide>
      <BackSide>
        <Grid container flexDirection="column" flexWrap="nowrap" style={{ height: '100%' }}>
          <Grid item flex={1}>
            <Formik
              initialValues={{
                rating: 1,
                comment: '',
              }}
              validationSchema={reviewSchema}
              onSubmit={values => {
                dispatch(
                  reviewThunks.createReview({
                    payload: {
                      rating: values.rating,
                      comment: values.comment,
                      reviewerId: currentUser.id,
                      serviceId: subOrder.serviceId,
                    },
                  }),
                )
                  .unwrap()
                  .then((review: Review) => {
                    dispatch(
                      subOrderThunks.updateSubOrder({
                        payload: {
                          id: subOrder.id,
                          changes: {
                            rating: review,
                          },
                        },
                        query: {
                          join: [{ field: 'rating' }],
                        },
                      }),
                    )
                      .unwrap()
                      .catch(error => {
                        enqueueSnackbar(error.message ?? 'Something went wrong!', {
                          variant: 'error',
                        });
                      });
                  });
                setFlipped(!isFlipped);
              }}
            >
              {({ values, handleChange, handleBlur, handleSubmit, resetForm }) => (
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
                    value={values.rating}
                    onChange={(val: number) => {
                      values.rating = val;
                    }}
                  />
                  <OutlinedInput
                    fullWidth
                    multiline
                    rows={3}
                    name="comment"
                    placeholder="Add a comment"
                    autoFocus={true}
                    type="text"
                    value={values.comment}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Grid container justifyContent="center" gap={2}>
                    <Button
                      type="button"
                      variant="contained"
                      color="warning"
                      onClick={() => {
                        resetForm();
                        setFlipped(!isFlipped);
                      }}
                    >
                      Discard
                    </Button>
                    <Button variant="contained" type="submit" color="primary">
                      Save
                    </Button>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </BackSide>
    </Flippy>
  );
};

const reviewSchema = object().shape({
  rating: number().required(),
  comment: string(),
});

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
