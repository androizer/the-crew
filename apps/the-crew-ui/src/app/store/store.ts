import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  authReducer,
  cartReducer,
  serviceReducer,
  subOrderReducer,
  paymentReducer,
  userAddressReducer,
  orderReducer,
  userReducer,
} from './slices';

const combineReducer = combineReducers({
  auth: authReducer,
  services: serviceReducer,
  cart: cartReducer,
  subOrders: subOrderReducer,
  order: orderReducer,
  payment: paymentReducer,
  userAddresses: userAddressReducer,
  user: userReducer,
});

const rootReducer = (state: RootState, action: AnyAction) => {
  if (['auth/logout/fulfilled', 'auth/logout/rejected'].includes(action.type)) {
    state = undefined;
  }
  return combineReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof combineReducer>;

export type RootDispatch = typeof store.dispatch;

export default store;
