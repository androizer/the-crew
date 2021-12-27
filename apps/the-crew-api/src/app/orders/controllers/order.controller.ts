import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { Order } from '@the-crew/common';

import { JwtAuthGuard } from '../../auth/guards';
import { OrderEntity } from '../models/entities';
import { OrderService } from '../services';

@Crud({
  model: {
    type: OrderEntity,
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
      subOrders: {
        eager: false,
      },
      consumer: {
        eager: false,
      },
      'subOrders.service': {
        eager: false,
      },
      'subOrders.rating': { eager: false },
      'subOrders.service.provider': { eager: false, alias: 'serviceProvider' },
    },
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrderController implements CrudController<Order> {
  constructor(public readonly service: OrderService) {}
}
