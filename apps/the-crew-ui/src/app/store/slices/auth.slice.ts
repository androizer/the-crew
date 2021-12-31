import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';
import { AuthThunks } from '../thunks';

import type { User } from '@the-crew/common';

type AuthState = {
  user: User;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: builder =>
    builder.addCase(AuthThunks.whoAmI.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }),
});

export const authReducer = authSlice.reducer;

export const authSelector = (state: RootState) => state.auth;

export const authActions = authSlice.actions;
