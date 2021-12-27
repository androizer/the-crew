import { ClassSerializerInterceptor, Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController } from '@nestjsx/crud';
import { SubOrder } from '@the-crew/common';

import { JwtAuthGuard } from '../../auth/guards';
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
  routes: {
    exclude: ['createManyBase'],
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('Sub Orders')
@Controller('sub-orders')
export class SubOrderController implements CrudController<SubOrder> {
  constructor(public readonly service: SubOrderService) {}
}
