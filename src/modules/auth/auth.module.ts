import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtAsyncConfig } from '@config/jwt.config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { LocalStrategy } from './lib/local.strategy';
import { JwtStrategy } from './lib/jwt.strategy';
import { GoogleStrategy } from './lib/google.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PassportModule, JwtModule.registerAsync(jwtAsyncConfig)],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
