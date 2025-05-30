import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';

import { ShalomModule } from '@modules/shalom/shalom.module';
import { AuthModule } from '@modules/auth/auth.module';
import { typeOrmAsyncConfig } from '@config/typeorm.config';
import { JwtAuthGuard } from '@lib/guards/jwt-auth.guard';
import featureConfig from '@config/feature.config';

import { ApnsModule } from './providers/apns/apns.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [featureConfig] }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    HttpModule,
    ShalomModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    ApnsModule,
  ],
})
export class AppModule {}
