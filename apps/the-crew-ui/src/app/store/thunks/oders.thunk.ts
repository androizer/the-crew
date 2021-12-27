import { CreateQueryParams } from '@nestjsx/crud-request';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uuid } from '@the-crew/common';
import { batch } from 'react-redux';

import { OrderApi } from '../../services';
import { orderActions, subOrderActions } from '../slices';

const getOrders = createAsyncThunk(
  'orders/GetMany',
  async (query: CreateQueryParams = {}, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      batch(() => {
        dispatch(orderActions.setLoading(true));
        dispatch(subOrderActions.setLoading(true));
      });
      const {
        data: { data },
      } = await OrderApi.getMany(query);
      const allSuborders = data.reduce((acc, order) => {
        if (Array.isArray(order.subOrders)) {
          return acc.concat(order.subOrders);
        }
        return acc;
      }, []);
      batch(() => {
        dispatch(orderActions.createOrders(data));
        dispatch(subOrderActions.addSubOrders(allSuborders));
        dispatch(orderActions.setLoading(false));
        dispatch(subOrderActions.setLoading(false));
      });
      return fulfillWithValue(data as any);
    } catch (error) {
      dispatch(orderActions.setLoading(false));
      dispatch(subOrderActions.setLoading(false));
      throw rejectWithValue(error);
    }
  },
);

const getOrder = createAsyncThunk(
  'orders/GetOne',
  async (args: { id: uuid; query?: CreateQueryParams }, { dispatch }) => {
    const { id, query = {} } = args;
    const response = await OrderApi.getOne(id, query);
    dispatch(orderActions.createOrder(response.data));
  },
);

const createOrder = createAsyncThunk(
  'orders/CreateOne',
  async (args: { payload; query?: CreateQueryParams }, { dispatch, fulfillWithValue }) => {
    const { payload, query } = args;
    const response = await OrderApi.createOne(payload, query);
    dispatch(orderActions.createOrder(response.data));
    return fulfillWithValue(response.data as any);
  },
);

export { getOrders, getOrder, createOrder };

export const orderThunks = {
  getOrders,
  getOrder,
  createOrder,
};
