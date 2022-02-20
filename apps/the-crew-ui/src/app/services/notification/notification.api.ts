import type { INotification } from '@the-crew/common';
import { axiosInstance, BaseHttpAPI } from '../../core/services';

const instance = axiosInstance;

const basePath = '/notifications';

export class NotificationHttpApi extends BaseHttpAPI<INotification> {
  constructor() {
    super({
      basePath,
      instance,
    });
  }
}

export const notificationApi = new NotificationHttpApi();
