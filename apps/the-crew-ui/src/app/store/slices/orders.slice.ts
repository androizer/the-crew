import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '@the-crew/common';

const orderAdapter = createEntityAdapter<Order>();

const orderSlice = createSlice({
  name: 'orders',
  initialState: orderAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    createOrder: orderAdapter.addOne,
    createOrders: orderAdapter.setAll,
    clearOrders: orderAdapter.removeAll,
    updateOrder: orderAdapter.updateOne,
    replaceOrder: orderAdapter.setOne,
    removeOrder: orderAdapter.removeOne,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { reducer: orderReducer, actions: orderActions } = orderSlice;

export const orderSelectors = orderAdapter.getSelectors();
