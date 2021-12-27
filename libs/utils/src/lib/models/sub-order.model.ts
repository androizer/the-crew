import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { Order, Review, ServiceRequest } from '.';
import { OrderStatus } from '../enums';
import type { ISubOrder, uuid } from '../types';

export class SubOrder implements ISubOrder {
  @IsUUID()
  id: uuid;

  @ValidateNested()
  @Type(() => ServiceRequest)
  @IsOptional()
  service?: ServiceRequest;

  @IsUUID()
  serviceId: uuid;

  @ValidateNested()
  @Type(() => Review)
  @IsOptional()
  rating?: Review;

  @IsUUID()
  ratingId: uuid;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @ValidateNested()
  @Type(() => Order)
  @IsOptional()
  order?: Order;

  @IsUUID()
  orderId: uuid;

  @IsDate()
  createdOn: Date;

  @IsDate()
  modifiedOn: Date;

  @IsDate()
  deletedOn: Date;
}
