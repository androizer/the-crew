import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { LoaderOptions } from '../../components/generic/OverlayLoading';

interface GenericState {
  loader: {
    isLoading: boolean;
    ops?: Partial<LoaderOptions>;
  };
}

const initialState: GenericState = {
  loader: {
    isLoading: false,
    ops: {},
  },
};

const slice = createSlice({
  name: 'generic',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<GenericState['loader']>) => {
      state.loader.isLoading = action.payload.isLoading;
      state.loader.ops = action.payload.ops ?? {};
    },
  },
});

export const { reducer: genericReducer, actions: genericActions } = slice;
