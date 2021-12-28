import { CreateQueryParams } from '@nestjsx/crud-request';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uuid } from '@the-crew/common';
import { batch } from 'react-redux';

import { reviewApi } from '../../services';
import { reviewActions } from '../slices';

const getReview = createAsyncThunk(
  'reviews/GetOne',
  async (args: { id: uuid; query?: CreateQueryParams }, { dispatch }) => {
    const { id, query } = args;
    const response = await reviewApi.getOne(id, query);
    dispatch(reviewActions.addReview(response.data));
  },
);

const createReview = createAsyncThunk(
  'reviews/CreateOne',
  async (
    args: { payload; query?: CreateQueryParams },
    { dispatch, fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const { payload, query } = args;
      dispatch(reviewActions.setLoading(true));
      const { data } = await reviewApi.createOne(payload, query);
      batch(() => {
        dispatch(reviewActions.addReview(data));
        dispatch(reviewActions.setLoading(false));
      });
      return fulfillWithValue(data as any);
    } catch (error) {
      dispatch(reviewActions.setLoading(false));
      throw rejectWithValue(error);
    }
  },
);

export { getReview, createReview };

export const reviewThunks = {
  getReview,
  createReview,
};
