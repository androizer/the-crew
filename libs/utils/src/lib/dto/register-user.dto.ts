import { PickType } from '@nestjs/swagger';

import { User } from '../models';

export class RegisterUserDTO extends PickType(User, [
  'email',
  'password',
  'firstName',
  'lastName',
  'phone',
  'role',
]) {}
