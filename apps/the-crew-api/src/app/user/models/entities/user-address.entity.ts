import { IUserAddress, User, uuid } from '@the-crew/common';
import { isString } from 'class-validator';
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { OwnerTimestampEntity } from '../../../core/models/entities';
import { UserEntity } from './user.entity';

@Entity({
  name: 'user_addresses',
})
export class UserAddressEntity extends OwnerTimestampEntity implements IUserAddress {
  @PrimaryGeneratedColumn('uuid')
  id: uuid;

  @Column()
  flat: string;

  @Column()
  street: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  city: string;

  @Column({
    type: 'integer',
  })
  pinCode: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDefault: boolean;

  @ManyToOne(() => UserEntity, user => user.addresses)
  user: User;

  @Column({ type: 'uuid' })
  userId: uuid;

  @BeforeInsert()
  performPrerequisite() {
    if (isString(this.pinCode)) {
      this.pinCode = parseInt(this.pinCode);
    }
  }
}
