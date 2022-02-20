import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiTags } from '@nestjs/swagger';
import { CreateManyDto, Crud, CrudController, CrudRequest, Override } from '@nestjsx/crud';
import { SubOrder } from '@the-crew/common';

import { JwtAuthGuard } from '../../auth/guards';
import { SubOrderCreatedEvent } from '../models';
import { SubOrderEntity } from '../models/entities';
import { SubOrderService } from '../services';

@Crud({
  model: {
    type: SubOrderEntity,
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      service: { eager: false },
      order: { eager: false },
      rating: { eager: false },
      'service.provider': { eager: false },
      'order.consumer': { eager: false },
    },
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Sub Orders')
@Controller('sub-orders')
export class SubOrderController implements CrudController<SubOrder> {
  constructor(
    public readonly service: SubOrderService,
    private readonly eventEmitter2: EventEmitter2,
  ) {}

  @Override()
  async createMany(req: CrudRequest, dto: CreateManyDto<SubOrder>): Promise<SubOrder[]> {
    const subOrders = await this.service.createMany(req, dto);
    subOrders.forEach(subOrder => {
      this.eventEmitter2.emit('subOrder.created', new SubOrderCreatedEvent(subOrder));
    });
    return subOrders;
  }
}
