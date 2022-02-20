import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { INotification } from '@the-crew/common';
import { Repository } from 'typeorm';

import { NotificationEntity } from '../models';

export class NotificationService extends TypeOrmCrudService<INotification> {
  constructor(@InjectRepository(NotificationEntity) readonly repo: Repository<INotification>) {
    super(repo);
  }
}
