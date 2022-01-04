import { PartialType, PickType } from '@nestjs/swagger';
import { UserAddress } from '../models';

export class CreateUserAddressDTO extends PickType(UserAddress, [
  'fullName',
  'phone',
  'flat',
  'street',
  'city',
  'pinCode',
  'userId',
]) {}

export class UpdateUserAddressDTO extends PartialType(CreateUserAddressDTO) {}
