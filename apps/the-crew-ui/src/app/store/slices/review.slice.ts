import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Review } from '@the-crew/common';

const reviewAdapter = createEntityAdapter<Review>();

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: reviewAdapter.getInitialState(),
  reducers: {
    addReviews: reviewAdapter.setAll,
    clearReviews: reviewAdapter.removeAll,
    addReview: reviewAdapter.addOne,
    updateReview: reviewAdapter.updateOne,
    replaceReview: reviewAdapter.setOne,
    removeReview: reviewAdapter.removeOne,
  },
});

export const { reducer: reviewReducer, actions: reviewActions } = reviewSlice;

export const reviewSelectors = reviewAdapter.getSelectors();
