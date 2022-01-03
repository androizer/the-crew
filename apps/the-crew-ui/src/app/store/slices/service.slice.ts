import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServiceRequest } from '@the-crew/common';

const serviceAdapter = createEntityAdapter<ServiceRequest>();

const serviceSlice = createSlice({
  name: 'services',
  initialState: serviceAdapter.getInitialState({
    loading: false,
    isInitialLoaded: false,
  }),
  reducers: {
    addServices: serviceAdapter.setAll,
    clearServices: serviceAdapter.removeAll,
    addService: serviceAdapter.addOne,
    updateService: serviceAdapter.updateOne,
    replaceService: serviceAdapter.setOne,
    removeService: serviceAdapter.removeOne,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setInitialLoaded: state => {
      state.isInitialLoaded = true;
    },
  },
});

export const { reducer: serviceReducer, actions: serviceActions } = serviceSlice;

export const serviceSelectors = serviceAdapter.getSelectors();
