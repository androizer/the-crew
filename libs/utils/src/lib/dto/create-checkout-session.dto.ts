import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDefined, IsUUID, ValidateNested } from 'class-validator';

import { Cart } from '../models';

import type { uuid } from '../types';

export class CartDTO extends PickType(Cart, ['quantity']) {
  @IsUUID('all')
  @IsDefined()
  serviceId: uuid;
}

export class CreateCheckoutSessionDTO {
  @Type(() => CartDTO)
  @IsArray()
  @ValidateNested({ each: true })
  cartItems: CartDTO[];
}
