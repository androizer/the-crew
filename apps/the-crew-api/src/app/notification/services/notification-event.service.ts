import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { IServiceRequest, NotificationType } from '@the-crew/common';
import { Repository } from 'typeorm';

import { SubOrderCreatedEvent } from '../../orders/models';
import { ServiceRequestEntity } from '../../service-request/models/entities';
import { EventService } from '../../shared/services';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationEventService {
  constructor(
    private readonly notifService: NotificationService,
    private readonly eventService: EventService,
    @InjectRepository(ServiceRequestEntity)
    private readonly serviceRepo: Repository<IServiceRequest>,
  ) {}

  @OnEvent('subOrder.created')
  async handleSubOrderCreatedEvent(evt: SubOrderCreatedEvent) {
    const { serviceId, id: subOrderId } = evt.data;
    const { providerId } = await this.serviceRepo.findOne(serviceId, {
      select: ['providerId'],
    });
    const obj = this.notifService.repo.create({
      type: NotificationType.WEB,
      subject: 'New Order',
      body: `You have received a new order`,
      receivers: [providerId],
      meta: { serviceId, subOrderId },
    });
    const data = await this.notifService.repo.save(obj);
    this.eventService.enqueueEvent({ type: evt.type, data });
  }
}
