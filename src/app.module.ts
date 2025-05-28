import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ShalomModule } from '@modules/shalom/shalom.module';
import { AuthModule } from '@modules/auth/auth.module';
import { typeOrmAsyncConfig } from '@config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    ShalomModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
