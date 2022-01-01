import { IsNumber, IsPositive, Min } from 'class-validator';

import { ServiceRequest } from './service-request.model';

import type { ICart } from '../types';

export class Cart extends ServiceRequest implements ICart {
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
