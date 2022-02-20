import { CreateQueryParams } from '@nestjsx/crud-request';
import { createAsyncThunk, Update } from '@reduxjs/toolkit';
import { INotification, uuid } from '@the-crew/common';
import { notificationApi } from '../../services/notification';
import { notificationActions } from '../slices';

const getNotifications = createAsyncThunk(
  'notifications/getAll',
  (query: CreateQueryParams = {}, { dispatch, fulfillWithValue, rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      notificationApi
        .getMany(query)
        .then(({ data: { data } }) => {
          dispatch(notificationActions.setNotifications(data));
          resolve(fulfillWithValue(data) as any);
        })
        .catch(err => {
          let error = err;
          if (error.isAxiosError) {
            error = { ...error.response.data, status: error.response.status };
          }
          reject(rejectWithValue(error));
        });
    });
  },
);

const updateReadStatus = createAsyncThunk(
  'notification/updateReadStatus',
  (notif: Update<INotification>, { dispatch, fulfillWithValue, rejectWithValue }) => {
    return new Promise((resolve, reject) => {
      notificationApi
        .updateOne(notif.id, notif.changes)
        .then(() => {
          dispatch(notificationActions.updateNotification(notif));
          resolve(fulfillWithValue(notif.changes) as any);
        })
        .catch(err => {
          let error = err;
          if (error.isAxiosError) {
            error = { ...error.response.data, status: error.response.status };
          }
          reject(rejectWithValue(error));
        });
    });
  },
);

const deleteNotification = createAsyncThunk(
  'notification/deleteOne',
  (id: uuid, { dispatch, rejectWithValue, fulfillWithValue }) => {
    return new Promise((resolve, reject) => {
      notificationApi
        .deleteOne(id)
        .then(() => {
          dispatch(notificationActions.deleteNotification(id));
          resolve(fulfillWithValue(id) as any);
        })
        .catch(err => {
          let error = err;
          if (error.isAxiosError) {
            error = { ...error.response.data, status: error.response.status };
          }
          reject(rejectWithValue(error));
        });
    });
  },
);

export { getNotifications, updateReadStatus, deleteNotification };

export const notificationThunk = {
  getNotifications,
  updateReadStatus,
  deleteNotification,
};
