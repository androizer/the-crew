import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmpty,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { NotificationType } from '../enums';
import type { AnyObject, INotification, uuid } from '../types';

export class Notification implements INotification {
  @IsUUID()
  id: uuid;

  @IsString()
  @IsDefined()
  subject: string;

  @IsString()
  @IsDefined()
  body: string;

  @IsArray()
  @IsString({ each: true })
  receivers: uuid[];

  @IsEnum(NotificationType)
  type: number;

  @IsOptional()
  @IsBoolean()
  isRead: boolean;

  @IsObject()
  meta: AnyObject;

  @IsDate()
  createdOn: Date;

  @IsDate()
  modifiedOn: Date;

  @IsDate()
  @IsOptional()
  deletedOn: Date;
}
