import { AnyObject, EventType } from '@the-crew/common';

export abstract class AbstractBaseEvent<T = AnyObject> implements Pick<MessageEvent, 'data'> {
  abstract type: string | EventType;
  data: T;

  constructor(data: T) {
    this.data = data;
  }
}
