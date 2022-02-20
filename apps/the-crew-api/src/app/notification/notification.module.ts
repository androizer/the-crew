import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServiceRequestEntity } from '../service-request/models/entities';
import { NotificationController } from './controllers';
import { NotificationEntity } from './models';
import { NotificationEventService, NotificationService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity, ServiceRequestEntity])],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationEventService],
})
export class NotificationModule {}
