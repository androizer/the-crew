import { createAsyncThunk } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { userAddressApi } from '../../services';
import { userAddressActions } from '../slices';

import type { CreateQueryParams } from '@nestjsx/crud-request';
import type { UserAddress } from '@the-crew/common';

const getUserAddresses = createAsyncThunk(
  'user-addresses/GetMany',
  async (query: CreateQueryParams = {}, { dispatch, fulfillWithValue, rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      dispatch(userAddressActions.setLoading(true));
      userAddressApi
        .getMany(query)
        .then(({ data: { data } }) => {
          batch(() => {
            dispatch(userAddressActions.setLoading(false));
            dispatch(userAddressActions.addUserAddresses(data));
          });
          resolve(fulfillWithValue(data) as any);
        })
        .catch(error => {
          if (error.isAxiosError) {
            error = { ...error.response.data, status: error.response.status };
          }
          reject(rejectWithValue(error));
        })
        .finally(() => {
          dispatch(userAddressActions.setLoading(false));
        });
    });
  },
);

const createUserAddress = createAsyncThunk(
  'user-addresses/CreateOne',
  async (
    args: { payload: Partial<UserAddress>; query?: CreateQueryParams },
    { dispatch, fulfillWithValue, rejectWithValue },
  ) => {
    return new Promise<UserAddress>((resolve, reject) => {
      const { payload, query } = args;
      dispatch(userAddressActions.setLoading(true));
      userAddressApi
        .createOne(payload, query)
        .then(({ data }) => {
          batch(() => {
            dispatch(userAddressActions.setLoading(false));
            dispatch(userAddressActions.addUserAddress(data));
          });
          resolve(fulfillWithValue(data) as any);
        })
        .catch(error => {
          if (error.isAxiosError) {
            error = { ...error.response.data, status: error.response.status };
          }
          reject(rejectWithValue(error));
        })
        .finally(() => {
          dispatch(userAddressActions.setLoading(false));
        });
    });
  },
);

export { getUserAddresses, createUserAddress };

export const userAddressThunks = {
  getUserAddresses,
  createUserAddress,
};
