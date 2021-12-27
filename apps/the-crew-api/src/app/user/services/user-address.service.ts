import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserAddress, uuid } from '@the-crew/common';
import { Repository } from 'typeorm';

import { UserAddressEntity } from '../models/entities';

@Injectable()
export class UserAddressService extends TypeOrmCrudService<UserAddress> {
  constructor(
    @InjectRepository(UserAddressEntity) private readonly addressRepo: Repository<UserAddress>,
  ) {
    super(addressRepo);
  }

  /**
   * Set the address of addressId as default and mark all
   * other address of the associated user as non-default.
   * @param req CrudRequest
   * @param addressId Address ID
   */
  async updateDefaultAddress(req: CrudRequest, addressId: uuid) {
    // find the address details
    const address = await this.addressRepo.findOne(addressId, {
      relations: ['user', 'user.addresses'],
    });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    // set isDefault as false for all other addresses that doesn't match the current addressId
    const userAddresses = address.user?.addresses.reduce((acc, address) => {
      if (address.id !== addressId) {
        address.isDefault = false;
        acc.push(address);
      }
      return acc;
    }, [] as UserAddress[]);
    if (userAddresses.length) {
      this.addressRepo.upsert(userAddresses, { conflictPaths: ['id'] });
      return this.updateOne(req, { isDefault: true });
    }
    throw new ConflictException('Address is already set as default');
  }
}
