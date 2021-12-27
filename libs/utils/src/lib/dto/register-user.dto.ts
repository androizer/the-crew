import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

import { Role } from '../enums';

export class RegisterUserDTO {
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
  phone: string;

  @IsArray()
  @IsEnum(Role, { each: true })
  role: Role[];
}
