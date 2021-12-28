import { CreateQueryParams } from '@nestjsx/crud-request';
import { createAsyncThunk, Update } from '@reduxjs/toolkit';
import { SubOrder, uuid } from '@the-crew/common';
import { batch } from 'react-redux';

import { subOrderApi } from '../../services';
import { subOrderActions } from '../slices';

const getSubOrders = createAsyncThunk(
  'sub-orders/GetMany',
  async (query: CreateQueryParams = {}, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(subOrderActions.setLoading(true));
      const {
        data: { data },
      } = await subOrderApi.getMany(query);
      batch(() => {
        dispatch(subOrderActions.addSubOrders(data));
        dispatch(subOrderActions.setLoading(false));
      });
      return fulfillWithValue(data as any);
    } catch (error) {
      dispatch(subOrderActions.setLoading(false));
      if (error.isAxiosError) {
        throw rejectWithValue({ ...error.response.data, status: error.response.status });
      }
      throw rejectWithValue(error);
    }
  },
);

const getSubOrder = createAsyncThunk(
  'sub-orders/GetOne',
  async (args: { id: uuid; query?: CreateQueryParams }, { dispatch }) => {
    const { id, query = {} } = args;
    const response = await subOrderApi.getOne(id, query);
    dispatch(subOrderActions.addSubOrder(response.data));
  },
);

const createManySubOrders = createAsyncThunk(
  'sub-orders/CreateMany',
  async (args: { payload; query?: CreateQueryParams }, { dispatch }) => {
    const { payload, query } = args;
    const response = await subOrderApi.createMany(payload, query);
    dispatch(subOrderActions.addSubOrders(response.data.data));
  },
);

const updateSubOrder = createAsyncThunk(
  'sub-orders/UpdateOne',
  async (
    args: { payload: Update<SubOrder>; query?: CreateQueryParams },
    { dispatch, fulfillWithValue, rejectWithValue },
  ) => {
    try {
      const { payload, query } = args;
      dispatch(subOrderActions.setLoading(true));
      const { data } = await subOrderApi.updateOne(payload.id, payload.changes, query);
      batch(() => {
        dispatch(subOrderActions.updateSubOrder({ id: payload.id, changes: data }));
        dispatch(subOrderActions.setLoading(false));
      });
      return fulfillWithValue(data as any);
    } catch (error) {
      dispatch(subOrderActions.setLoading(false));
      if (error.isAxiosError) {
        throw rejectWithValue({ ...error.response.data, status: error.response.status });
      }
      throw rejectWithValue(error);
    }
  },
);

export { getSubOrders, getSubOrder, createManySubOrders as saveSubOrders };

export const subOrderThunks = {
  getSubOrders,
  getSubOrder,
  createManySubOrders,
  updateSubOrder,
};
