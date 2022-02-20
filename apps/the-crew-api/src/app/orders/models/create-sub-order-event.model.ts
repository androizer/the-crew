import { EventType, ISubOrder } from '@the-crew/common';

import { AbstractBaseEvent } from '../../shared/models';

export class SubOrderCreatedEvent extends AbstractBaseEvent<ISubOrder> {
  type = EventType.SUB_ORDER_CREATED;

  constructor(data: ISubOrder) {
    super(data);
  }
}
