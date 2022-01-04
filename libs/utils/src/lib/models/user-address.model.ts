import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { User } from './user.model';

import type { IUserAddress, uuid } from '../types';

export class UserAddress implements IUserAddress {
  @IsUUID()
  @IsOptional()
  id: uuid;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsPhoneNumber()
  phone: string;

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
  @IsOptional()
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
