import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { ServiceRequest, User } from '.';
import type { IReview, uuid } from '../types';

export class Review implements IReview {
  @IsUUID()
  id: uuid;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @IsPositive()
  rating: number;

  @ValidateNested()
  @Type(() => User)
  @IsOptional()
  reviewer?: User;

  @IsUUID()
  reviewerId: uuid;

  @ValidateNested()
  @Type(() => ServiceRequest)
  @IsOptional()
  service?: ServiceRequest;

  @IsUUID()
  serviceId: uuid;

  @IsDate()
  createdOn: Date;

  @IsDate()
  modifiedOn: Date;

  @IsDate()
  deletedOn: Date;
}
