import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubOrder } from '@the-crew/common';

const subOrderAdapter = createEntityAdapter<SubOrder>();

const subOrderSlice = createSlice({
  name: 'subOrders',
  initialState: subOrderAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    addSubOrder: subOrderAdapter.addOne,
    addSubOrders: subOrderAdapter.setAll,
    clearSubOrders: subOrderAdapter.removeAll,
    updateSubOrder: subOrderAdapter.updateOne,
    replaceSubOrder: subOrderAdapter.setOne,
    removeSubOrder: subOrderAdapter.removeOne,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { reducer: subOrderReducer, actions: subOrderActions } = subOrderSlice;

export const subOrderSelector = subOrderAdapter.getSelectors();
