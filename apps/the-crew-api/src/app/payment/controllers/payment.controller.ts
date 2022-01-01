import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCheckoutSessionDTO, PaymentSession } from '@the-crew/common';

import { JwtAuthGuard } from '../../auth/guards';
import { PaymentService } from '../services';

@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true }))
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(public readonly service: PaymentService) {}

  @Post('retrieve-session')
  async RetrieveSessionBySessionId(@Body() dto: PaymentSession) {
    return this.service.retrieveSessionBySessionId(dto.sessionId);
  }

  @Post('create-session')
  async CreateCheckoutSession(@Body() dto: CreateCheckoutSessionDTO) {
    return this.service.createCheckOutSession(dto.cartItems);
  }

  @Delete('delete-session')
  async DeleteSessionById(@Body() dto: PaymentSession) {
    return this.service.expireSession(dto.sessionId);
  }
}
