import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID, ValidateNested } from 'class-validator';

import { User } from '.';
import type { IOrder, uuid } from '../types';
import { SubOrder } from './sub-order.model';

export class Order implements IOrder {
  @IsUUID()
  id: uuid;

  @ValidateNested()
  @Type(() => User)
  @IsOptional()
  consumer?: User;

  @IsUUID('all', { each: true })
  subOrderIds: uuid[];

  @ValidateNested()
  @Type(() => SubOrder)
  @IsOptional()
  subOrders?: SubOrder[];

  @IsUUID()
  consumerId: uuid;

  @IsDate()
  createdOn: Date;

  @IsDate()
  modifiedOn: Date;

  @IsDate()
  deletedOn: Date;
}
