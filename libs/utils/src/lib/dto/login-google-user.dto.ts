import { PickType } from '@nestjs/swagger';
import { ArrayNotContains } from 'class-validator';

import { Role } from '../enums';
import { User } from '../models/user.model';

export class LoginGoogleUserDTO extends PickType(User, [
  'email',
  'firstName',
  'lastName',
  'meta',
  'role',
]) {
  @ArrayNotContains([Role.ADMIN], { message: `Role can't be Admin` })
  role: Role[];
}
