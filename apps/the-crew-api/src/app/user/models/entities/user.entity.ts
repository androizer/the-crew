import { Role, ServiceRequest, User, UserAddress } from '@the-crew/common';
import { hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { OwnerTimestampEntity } from '../../../core/models/entities';
import { ServiceRequestEntity } from '../../../service-request/models/entities/';
import { UserAddressEntity } from './user-address.entity';

import type { UserMeta, uuid, IUser } from '@the-crew/common';
@Entity({
  name: 'users',
})
export class UserEntity extends OwnerTimestampEntity implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: uuid;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  @Exclude()
  password: string | null;

  @Column({
    unique: true,
    nullable: true,
  })
  phone: string | null;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
  })
  role: Role[];

  @Column({
    type: 'json',
    nullable: true,
    default: {},
  })
  meta: UserMeta;

  @OneToMany(() => UserAddressEntity, address => address.user)
  addresses: UserAddress[];

  @RelationId((user: User) => user.addresses)
  addressIds: uuid[];

  @OneToMany(() => ServiceRequestEntity, services => services.provider)
  services: ServiceRequest[];

  @RelationId((user: User) => user.services)
  servicesIds: uuid[];

  @BeforeInsert()
  performPrerequisite() {
    this.fullName = `${this.firstName} ${this.lastName}`;
    if (this.password) {
      this.password = hashSync(this.password, 10);
    }
  }
}
