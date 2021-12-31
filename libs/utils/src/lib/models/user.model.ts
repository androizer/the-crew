import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';

import { Review, ServiceRequest, UserAddress } from '.';
import { Role } from '../enums';

import type { IUser, UserMeta, uuid } from '../types';

export class User implements IUser {
  @IsUUID()
  id: uuid;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 16)
  password: string;

  @IsPhoneNumber()
  phone: string | null;

  @IsArray()
  @IsEnum(Role, { each: true })
  role: Role[];

  @IsDate()
  createdOn: Date;

  @IsDate()
  deletedOn: Date;

  @IsDate()
  modifiedOn: Date;

  @IsArray()
  @ValidateNested()
  @Type(() => UserAddress)
  addresses: UserAddress[];

  @IsArray()
  @ValidateNested()
  @Type(() => ServiceRequest)
  services: ServiceRequest[];

  @IsArray()
  @ValidateNested()
  @Type(() => Review)
  ratings: Review[];

  @IsNotEmptyObject()
  @IsObject()
  meta: UserMeta;
}
