import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@the-crew/common';

import { LoginResponse, RefreshTokenResponse } from '../../types';
import { RootState } from '../store';
import { AuthThunks } from '../thunks';

type AuthState = {
  user: User;
  accessToken: string;
  refreshToken: string;
  isLoading: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // used to store tokens from local-storage on app startup
    loadTokensAtStartup: (state, action: PayloadAction<LoginResponse>) => {
      const { payload } = action;
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(AuthThunks.loginAndFetchTokens.pending, state => {
        state.isLoading = true;
      })
      .addCase(
        AuthThunks.loginAndFetchTokens.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          const { payload } = action;
          state.accessToken = payload.accessToken;
          state.refreshToken = payload.refreshToken;
          state.isLoading = false;
        },
      )
      .addCase(AuthThunks.loginAndFetchTokens.rejected, state => {
        state.isLoading = false;
      })
      .addCase(
        AuthThunks.refetchTokens.fulfilled,
        (state, action: PayloadAction<RefreshTokenResponse>) => {
          const { payload } = action;
          state.accessToken = payload.accessToken;
          state.refreshToken = payload.refreshToken;
          state.isLoading = false;
        },
      )
      .addCase(AuthThunks.whoAmI.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
      }),
});

export const authReducer = authSlice.reducer;

export const authSelector = (state: RootState) => state.auth;

export const { loadTokensAtStartup } = authSlice.actions;
