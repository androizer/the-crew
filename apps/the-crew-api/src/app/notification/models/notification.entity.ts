import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { OwnerTimestampEntity } from '../../core/models/entities';

import type { AnyObject, INotification, NotificationType, uuid } from '@the-crew/common';

@Entity({ name: 'notifications' })
export class NotificationEntity extends OwnerTimestampEntity implements INotification {
  @PrimaryGeneratedColumn('uuid')
  id: uuid;

  @Column()
  subject: string;

  @Column()
  body: string;

  @Column({
    array: true,
    type: 'uuid',
  })
  receivers: uuid[];

  @Column({ type: 'numeric' })
  type: NotificationType;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'json', default: {} })
  meta: AnyObject;
}
