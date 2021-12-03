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
  },
})
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@ApiTags('subOrders')
@Controller('subOrders')
export class SubOrderController implements CrudController<SubOrder> {
  constructor(public readonly service: SubOrderService) {}
}
