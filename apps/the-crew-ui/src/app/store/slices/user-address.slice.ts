import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAddress } from '@the-crew/common';

const userAddressAdapter = createEntityAdapter<UserAddress>();

const userAddressSlice = createSlice({
  name: 'userAddresses',
  initialState: userAddressAdapter.getInitialState({
    loading: false,
  }),
  reducers: {
    addUserAddresses: userAddressAdapter.setAll,
    clearUserAddresses: userAddressAdapter.removeAll,
    addUserAddress: userAddressAdapter.addOne,
    updateUserAddress: userAddressAdapter.updateOne,
    replaceUserAddress: userAddressAdapter.setOne,
    removeUserAddress: userAddressAdapter.removeOne,
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { reducer: userAddressReducer, actions: userAddressActions } = userAddressSlice;

export const userAddressSelectors = userAddressAdapter.getSelectors();
