import { Module } from '@nestjs/common';

import { AppleAuthService } from './appleAuth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [AppleAuthService],
  exports: [AppleAuthService],
})
export class AppleAuthModule {}
