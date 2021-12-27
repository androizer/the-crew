import { CreateQueryParams } from '@nestjsx/crud-request';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { UserAddress } from '@the-crew/common';
import { batch } from 'react-redux';

import { userAddressApi } from '../../services';
import { userAddressActions } from '../slices';

const getUserAddresses = createAsyncThunk(
  'user-addresses/GetMany',
  async (query: CreateQueryParams = {}, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(userAddressActions.setLoading(true));
      const response = await userAddressApi.getMany(query);
      batch(() => {
        dispatch(userAddressActions.setLoading(false));
        dispatch(userAddressActions.addUserAddresses(response.data.data));
      });
      return fulfillWithValue(response.data as any);
    } catch (error) {
      dispatch(userAddressActions.setLoading(false));
      throw rejectWithValue(error);
    }
  },
);

const createUserAddress = createAsyncThunk(
  'user-addresses/CreateOne',
  async (
    args: { payload: Partial<UserAddress>; query?: CreateQueryParams },
    { dispatch, fulfillWithValue, rejectWithValue },
  ) => {
    const { payload, query } = args;
    dispatch(userAddressActions.setLoading(true));
    try {
      const response = await userAddressApi.createOne(payload, query);
      batch(() => {
        dispatch(userAddressActions.addUserAddress(response.data));
        dispatch(userAddressActions.setLoading(true));
      });
      return fulfillWithValue(response.data as any);
    } catch (error) {
      dispatch(userAddressActions.setLoading(false));
      throw rejectWithValue(error);
    }
  },
);

export { getUserAddresses, createUserAddress };

export const userAddressThunks = {
  getUserAddresses,
  createUserAddress,
};
