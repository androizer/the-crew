import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceRequest } from '@the-crew/common';

const serviceAdapter = createEntityAdapter<ServiceRequest>();

const serviceSlice = createSlice({
  name: 'services',
  initialState: serviceAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    addServices: serviceAdapter.setMany,
    clearServices: serviceAdapter.removeAll,
    addService: serviceAdapter.addOne,
    updateService: serviceAdapter.updateOne,
    replaceService: serviceAdapter.setOne,
    removeService: serviceAdapter.removeOne,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { reducer: serviceReducer, actions: serviceActions } = serviceSlice;

export const serviceSelectors = serviceAdapter.getSelectors();