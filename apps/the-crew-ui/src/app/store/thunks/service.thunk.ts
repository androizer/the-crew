import { CreateQueryParams } from '@nestjsx/crud-request';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uuid } from '@the-crew/common';
import { batch } from 'react-redux';

import { serviceApi } from '../../services';
import { serviceActions } from '../slices';

const getServices = createAsyncThunk(
  'services/GetMany',
  async (query: CreateQueryParams = {}, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(serviceActions.setLoading(true));
      const response = await serviceApi.getMany(query);
      batch(() => {
        dispatch(serviceActions.addServices(response.data.data));
        dispatch(serviceActions.setLoading(false));
      });
      return fulfillWithValue(response.data.data as any);
    } catch (error) {
      dispatch(serviceActions.setLoading(false));
      throw rejectWithValue(error);
    }
  },
);

const getService = createAsyncThunk(
  'services/GetOne',
  async (args: { id: uuid; query?: CreateQueryParams }, { dispatch }) => {
    const { id, query = {} } = args;
    const response = await serviceApi.getOne(id, query);
    dispatch(serviceActions.addService(response.data));
  },
);

export { getServices, getService };

export const serviceThunks = {
  getServices,
  getService,
};
