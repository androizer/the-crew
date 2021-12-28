import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Review } from '@the-crew/common';

import type { PayloadAction } from '@reduxjs/toolkit';

const reviewAdapter = createEntityAdapter<Review>();

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: reviewAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    addReviews: reviewAdapter.setAll,
    clearReviews: reviewAdapter.removeAll,
    addReview: reviewAdapter.addOne,
    updateReview: reviewAdapter.updateOne,
    replaceReview: reviewAdapter.setOne,
    removeReview: reviewAdapter.removeOne,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { reducer: reviewReducer, actions: reviewActions } = reviewSlice;

export const reviewSelectors = reviewAdapter.getSelectors();
