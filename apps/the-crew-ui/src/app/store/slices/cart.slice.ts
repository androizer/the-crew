import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { Cart } from '@the-crew/common';

const adapter = createEntityAdapter<Cart>();

const cartSlice = createSlice({
  name: 'cart',
  initialState: adapter.getInitialState(),
  reducers: {
    addItems: adapter.setMany,
    addItem: adapter.addOne,
    removeItem: adapter.removeOne,
    addQuantity: adapter.updateOne,
    removeQuantity: adapter.updateOne,
    removeAll: adapter.removeAll,
  },
});

export const { reducer: cartReducer, actions: cartActions } = cartSlice;

export const cartSelectors = adapter.getSelectors();
