import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentIntentPayload } from '@the-crew/common';

import { JwtAuthGuard } from '../../auth/guards';
import { PaymentService } from '../services';

@UseGuards(JwtAuthGuard)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(public readonly service: PaymentService) {}
  @Post('create-payment-intent')
  public async CreatePaymentIntent(@Body() paymentPayload: PaymentIntentPayload) {
    return this.service.CreatePaymentIntent(paymentPayload.services, paymentPayload.user);
  }
}
