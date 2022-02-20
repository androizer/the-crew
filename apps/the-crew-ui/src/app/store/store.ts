import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  authReducer,
  cartReducer,
  genericReducer,
  notificationReducer,
  orderReducer,
  serviceReducer,
  subOrderReducer,
  userAddressReducer,
  userReducer,
} from './slices';

const combineReducer = combineReducers({
  generic: genericReducer,
  auth: authReducer,
  services: serviceReducer,
  cart: cartReducer,
  subOrders: subOrderReducer,
  order: orderReducer,
  userAddresses: userAddressReducer,
  user: userReducer,
  notifications: notificationReducer,
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
