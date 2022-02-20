import { Controller, Param, ParseUUIDPipe, Sse, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { INotification, User, uuid } from '@the-crew/common';
import { Observable } from 'rxjs';
import { UpdateResult } from 'typeorm';

import { JwtAuthGuard } from '../../auth/guards';
import { CurrentUser } from '../../core/decorators';
import { AbstractBaseEvent } from '../../shared/models';
import { EventService } from '../../shared/services';
import { NotificationEntity } from '../models';
import { NotificationService } from '../services';

@Crud({
  model: {
    type: NotificationEntity,
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
    sort: [
      {
        field: 'createdOn',
        order: 'DESC',
      },
    ],
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'updateOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
    getOneBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
    updateOneBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
    deleteOneBase: {
      decorators: [UseGuards(JwtAuthGuard)],
    },
  },
})
@Controller('notifications')
@ApiTags('Notifications')
export class NotificationController implements CrudController<INotification> {
  constructor(
    public readonly service: NotificationService,
    private readonly eventService: EventService,
  ) {}

  @Override()
  getMany(
    @ParsedRequest() req: CrudRequest,
    @CurrentUser() user: User,
  ): Promise<GetManyDefaultResponse<INotification> | INotification[]> {
    const receiverFilter = req.parsed.filter.find(cond => cond.field === 'receivers');
    if (!receiverFilter) {
      req.parsed.filter.push({
        field: 'receivers',
        operator: '$in',
        value: `{${user.id}}`,
      });
    }
    return this.service.getMany(req);
  }

  @Override()
  deleteOne(@Param('id', new ParseUUIDPipe()) id: uuid): Promise<UpdateResult> {
    return this.service.repo.softDelete(id);
  }

  @Sse('sse')
  sse(): Observable<AbstractBaseEvent> {
    return this.eventService.serverSentEvent;
  }
}
