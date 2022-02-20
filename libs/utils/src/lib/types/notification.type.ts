import type { AnyObject, IOwnerTimestamp, uuid } from '.';

export interface INotification extends IOwnerTimestamp {
  id: uuid;
  subject: string;
  body: string;
  receivers: uuid[];
  type: number;
  isRead: boolean;
  meta: AnyObject;
}
