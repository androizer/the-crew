import {
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConflictResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  CrudRequestInterceptor,
  ParsedRequest,
} from '@nestjsx/crud';
import { UserAddress, uuid } from '@the-crew/common';

import { AnonymousGuard, JwtAuthGuard } from '../../auth/guards';
import { UserAddressEntity } from '../models/entities';
import { UserAddressService } from '../services';

@Crud({
  model: {
    type: UserAddressEntity,
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
    join: { user: { eager: false } },
  },
  routes: {
    exclude: ['createManyBase'],
    createOneBase: {
      decorators: [UseGuards(AnonymousGuard)],
    },
    getManyBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
    getOneBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
    updateOneBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
    replaceOneBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
    deleteOneBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
  },
})
@ApiTags('User Addresses')
@Controller('user-addresses')
export class UserAddressController implements CrudController<UserAddress> {
  constructor(public readonly service: UserAddressService) {}

  @ApiNotFoundResponse()
  @ApiConflictResponse()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(CrudRequestInterceptor)
  @Patch('update-default/:id')
  setDefaultAddress(
    @ParsedRequest() req: CrudRequest,
    @Param('id', ParseUUIDPipe) id: uuid,
  ): Promise<UserAddress> {
    return this.service.updateDefaultAddress(req, id);
  }
}
