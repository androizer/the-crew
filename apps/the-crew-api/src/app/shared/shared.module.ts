import { Global, Module } from '@nestjs/common';

import { EventService } from './services';

@Global()
@Module({
  providers: [EventService],
  exports: [EventService],
})
export class SharedModule {}
