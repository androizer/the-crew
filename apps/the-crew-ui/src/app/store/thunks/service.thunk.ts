import { CreateQueryParams } from '@nestjsx/crud-request';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uuid } from '@the-crew/common';
import { batch } from 'react-redux';

import { serviceApi } from '../../services';
import { serviceActions } from '../slices';

const getServices = createAsyncThunk(
  'services/GetMany',
  async (query: CreateQueryParams = {}, { dispatch, fulfillWithValue, rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      dispatch(serviceActions.setLoading(true));
      serviceApi
        .getMany(query)
        .then(({ data: { data } }) => {
          dispatch(serviceActions.addServices(data));
          resolve(fulfillWithValue(data) as any);
        })
        .catch(err => {
          let error = err;
          if (error.isAxiosError) {
            error = { ...error.response.data, status: error.response.status };
          }
          reject(rejectWithValue(error));
        })
        .finally(() => {
          batch(() => {
            dispatch(serviceActions.setLoading(false));
            dispatch(serviceActions.setInitialLoaded());
          })
        });
    });
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
