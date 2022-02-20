import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import type { INotification } from '@the-crew/common';

const adapter = createEntityAdapter<INotification>();

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: adapter.getInitialState(),
  reducers: {
    setNotifications: adapter.setAll,
    addNotifications: adapter.upsertMany,
    addNotification: adapter.upsertOne,
    clearNotifications: adapter.removeAll,
    updateNotification: adapter.updateOne,
    deleteNotification: adapter.removeOne,
  },
});

export const { reducer: notificationReducer, actions: notificationActions } = notificationSlice;

export const notificationSelectors = adapter.getSelectors();
