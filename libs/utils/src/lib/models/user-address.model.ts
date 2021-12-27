import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { User } from '.';

import type { IUserAddress, uuid } from '../types';

export class UserAddress implements IUserAddress {
  @IsUUID()
  @IsOptional()
  id: uuid;

  @IsString()
  @IsNotEmpty()
  flat: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  pinCode: number;

  @IsBoolean()
  isDefault: boolean;

  @ValidateNested()
  @Type(() => User)
  user?: User;

  @IsUUID()
  userId: uuid;

  @IsDate()
  createdOn: Date;

  @IsDate()
  modifiedOn: Date;

  @IsDate()
  deletedOn: Date;
}
