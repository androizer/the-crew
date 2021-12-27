import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@the-crew/common';

import SnackbarUtils from '../../core/services/snackbar-config.service';
import { authApi, TokenService } from '../../services';
import { AuthCreds } from '../../types';
import { userAddressThunks } from './user-address.thunk';

/**
 * Login Request
 */
const loginAndFetchTokens = createAsyncThunk(
  'auth/fetchTokens',
  async (creds: AuthCreds, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.login(creds);
      TokenService.setAccessToken(response.data.accessToken);
      TokenService.setRefreshToken(response.data.refreshToken);
      TokenService.setExpireTimestamp(response.data.expiresAt);
      setTimeout(() => {
        dispatch(whoAmI())
          .unwrap()
          .then((user: User) => {
            SnackbarUtils.success(`Welcome ${user.fullName}`);
          });
      }, 10);
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        throw rejectWithValue({ ...error.response.data, status: error.response.status });
      }
      throw rejectWithValue(error);
    }
  },
);

/**
 * Refresh Token Request
 */
const refetchTokens = createAsyncThunk(
  'auth/refetchTokens',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      const response = await authApi.refreshToken(refreshToken);
      TokenService.setAccessToken(response.data.accessToken);
      TokenService.setRefreshToken(response.data.refreshToken);
      TokenService.setExpireTimestamp(response.data.expiresAt);
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        throw rejectWithValue({ ...error.response.data, status: error.response.status });
      }
      throw rejectWithValue(error);
    }
  },
);

/**
 * Logout Request
 */
const logout = createAsyncThunk('auth/logout', async (_, { fulfillWithValue }) => {
  try {
    await authApi.logout();
    localStorage.clear();
    return fulfillWithValue({});
  } catch (error) {
    return fulfillWithValue({});
  }
});

const whoAmI = createAsyncThunk(
  'auth/whoAmI',
  async (_, { dispatch, rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await authApi.whoAmI();
      dispatch(userAddressThunks.getUserAddresses({ search: { userId: response.data.id } }));
      return fulfillWithValue(response.data as any);
    } catch (error) {
      if (error.isAxiosError) {
        throw rejectWithValue({ ...error.response.data, status: error.response.status });
      }
      throw rejectWithValue(error);
    }
  },
);

export { loginAndFetchTokens, refetchTokens, logout, whoAmI };

export const AuthThunks = {
  loginAndFetchTokens,
  refetchTokens,
  logout,
  whoAmI,
};
