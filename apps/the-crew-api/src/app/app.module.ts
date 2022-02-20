import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  AuthConfig,
  DBConfig,
  envValidator as validate,
  PaymentConfig,
  TypeOrmConfigService,
} from '../configs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notification/notification.module';
import { OrderModule } from './orders/order.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './rating/review.module';
import { ServiceRequestModule } from './service-request/service-request.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
      load: [DBConfig, AuthConfig, PaymentConfig],
    }),
    TypeOrmModule.forRootAsync({
      name: 'default',
      useClass: TypeOrmConfigService,
    }),
    EventEmitterModule.forRoot(),
    SharedModule,
    AuthModule,
    UserModule,
    ServiceRequestModule,
    ReviewModule,
    OrderModule,
    PaymentModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
