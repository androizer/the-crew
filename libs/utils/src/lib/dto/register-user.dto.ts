import { PickType } from '@nestjs/swagger';
import { ArrayNotContains } from 'class-validator';
import { Role } from '../enums';

import { User } from '../models';

export class RegisterUserDTO extends PickType(User, [
  'email',
  'password',
  'firstName',
  'lastName',
  'phone',
  'role',
]) {
  @ArrayNotContains([Role.ADMIN])
  role: Role[];
}
