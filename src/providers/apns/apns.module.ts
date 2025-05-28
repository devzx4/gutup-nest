import { Module } from '@nestjs/common';

import { ApnsService } from './apns.service';

@Module({
  imports: [],
  providers: [ApnsService],
  exports: [ApnsService],
})
export class ApnsModule {}
