import { PickType } from '@nestjs/swagger';
import { Role, User } from '@the-crew/common';
import { ArrayNotContains } from 'class-validator';

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
