import { createAsyncThunk, Update } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { subOrderApi } from '../../services';
import { subOrderActions } from '../slices';

import type { CreateQueryParams } from '@nestjsx/crud-request';
import type { SubOrder, uuid } from '@the-crew/common';
import type { CreateManyDTO } from '../../core/services';
const getSubOrders = createAsyncThunk(
  'sub-orders/GetMany',
  async (query: CreateQueryParams = {}, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      dispatch(subOrderActions.setLoading(true));
      const {
        data: { data },
      } = await subOrderApi.getMany(query);
      batch(() => {
        dispatch(subOrderActions.setLoaded());
        dispatch(subOrderActions.setSubOrders(data));
      });
      return fulfillWithValue(data as any);
    } catch (err) {
      let error = err;
      if (error.isAxiosError) {
        error = { ...error.response.data, status: error.response.status };
      }
      throw rejectWithValue(error);
    } finally {
      dispatch(subOrderActions.setLoading(false));
    }
  },
);

const getSubOrder = createAsyncThunk(
  'sub-orders/GetOne',
  async (
    args: { id: uuid; query?: CreateQueryParams },
    { dispatch, fulfillWithValue, rejectWithValue },
  ) => {
    try {
      dispatch(subOrderActions.setLoading(true));
      const { id, query = {} } = args;
      const { data } = await subOrderApi.getOne(id, query);
      dispatch(subOrderActions.addSubOrder(data));
      return fulfillWithValue(data as any);
    } catch (err) {
      let error = err;
      if (error.isAxiosError) {
        error = { ...error.response.data, status: error.response.status };
      }
      throw rejectWithValue(error);
    } finally {
      dispatch(subOrderActions.setLoading(false));
    }
  },
);

const createManySubOrders = createAsyncThunk(
  'sub-orders/CreateMany',
  async (
    args: { payload: CreateManyDTO<SubOrder>; query?: CreateQueryParams },
    { dispatch, fulfillWithValue, rejectWithValue },
  ) => {
    return new Promise<SubOrder[]>((resolve, reject) => {
      const { payload, query } = args;
      dispatch(subOrderActions.setLoading(true));
      subOrderApi
        .createMany(payload, query)
        .then(({ data }) => {
          dispatch(subOrderActions.addSubOrders(data));
          resolve(fulfillWithValue(data) as any);
        })
        .catch(error => {
          if (error.isAxiosError) {
            error = { ...error.response.data, status: error.response.status };
          }
          reject(rejectWithValue(error));
        })
        .finally(() => {
          dispatch(subOrderActions.setLoading(false));
        });
    });
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
      dispatch(subOrderActions.updateSubOrder({ id: payload.id, changes: data }));
      return fulfillWithValue(data as any);
    } catch (err) {
      let error = err;
      if (error.isAxiosError) {
        error = { ...error.response.data, status: error.response.status };
      }
      throw rejectWithValue(error);
    } finally {
      dispatch(subOrderActions.setLoading(false));
    }
  },
);

export { getSubOrders, getSubOrder, createManySubOrders, updateSubOrder };

export const subOrderThunks = {
  getSubOrders,
  getSubOrder,
  createManySubOrders,
  updateSubOrder,
};
