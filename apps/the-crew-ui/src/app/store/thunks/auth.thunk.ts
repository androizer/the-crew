import { createAsyncThunk } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import SnackbarUtils from '../../core/services/snackbar-config.service';
import { authApi, TokenService } from '../../services';
import { authActions } from '../slices';
import { userAddressThunks } from './user-address.thunk';

import type { AuthCreds, LoginResponse } from '../../types';
import type { AnyObject, LoginGoogleUserDTO, User } from '@the-crew/common';

/**
 * Login Request
 */
const login = createAsyncThunk(
  'auth/login',
  async (creds: AuthCreds, { dispatch, fulfillWithValue, rejectWithValue }) => {
    return new Promise<LoginResponse>((resolve, reject) => {
      dispatch(authActions.setLoading(true));
      authApi
        .login(creds)
        .then(({ data }) => {
          TokenService.setTokenPayload(data);
          batch(() => {
            dispatch(authActions.setLoading(false));
            dispatch(whoAmI())
              .unwrap()
              .then((user: User) => {
                resolve(fulfillWithValue(data) as any);
                SnackbarUtils.success(`Welcome ${user.fullName}`);
              });
          });
        })
        .catch(error => {
          if (error.isAxiosError) {
            reject(rejectWithValue({ ...error.response.data, status: error.response.status }));
          }
          reject(rejectWithValue(error));
        })
        .finally(() => dispatch(authActions.setLoading(false)));
    });
  },
);

const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (payload: LoginGoogleUserDTO, { dispatch, fulfillWithValue, rejectWithValue }) => {
    return new Promise<LoginResponse>((resolve, reject) => {
      dispatch(authActions.setLoading(true));
      authApi
        .loginViaGoogle(payload)
        .then(({ data }) => {
          TokenService.setTokenPayload(data);
          dispatch(whoAmI())
            .unwrap()
            .then((user: User) => {
              resolve(fulfillWithValue(data) as any);
              SnackbarUtils.success(`Welcome ${user.fullName}`);
            });
        })
        .catch(error => {
          if (error.isAxiosError) {
            reject(rejectWithValue({ ...error.response.data, status: error.response.status }));
          }
          reject(rejectWithValue(error));
        })
        .finally(() => {
          dispatch(authActions.setLoading(false));
        });
    });
  },
);

/**
 * Refresh Token Request
 */
const refetchTokens = createAsyncThunk(
  'auth/refetchTokens',
  async (refreshToken: string, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await authApi.refreshToken(refreshToken);
      TokenService.setTokenPayload(data);
      return fulfillWithValue(data as AnyObject);
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
      const { data } = await authApi.whoAmI();
      dispatch(userAddressThunks.getUserAddresses({ search: { userId: data.id } }));
      return fulfillWithValue(data as any);
    } catch (error) {
      if (error.isAxiosError) {
        throw rejectWithValue({ ...error.response.data, status: error.response.status });
      }
      throw rejectWithValue(error);
    }
  },
);

export { login, googleLogin, refetchTokens, logout, whoAmI };

export const AuthThunks = {
  login,
  googleLogin,
  refetchTokens,
  logout,
  whoAmI,
};
