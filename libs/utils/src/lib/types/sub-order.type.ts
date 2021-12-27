import { OrderStatus } from '../enums';

import type { IOrder, IReview, IServiceRequest, IOwnerTimestamp, uuid } from '../types';

export interface ISubOrder extends IOwnerTimestamp {
  id: uuid;
  serviceId: uuid;
  service?: IServiceRequest;
  ratingId: uuid;
  rating?: IReview;
  status: OrderStatus;
  quantity: number;
  orderId: uuid;
  order?: IOrder;
  price: number;
}
