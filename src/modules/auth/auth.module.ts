import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtAsyncConfig } from '@config/jwt.config';

import { MailModule } from '@providers/mailer';
import { ApnsModule } from '@providers/apns/apns.module';
import { AppleAuthModule } from '@/providers/appleAuth';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { Registration } from './entities/registration.entity';
import { LocalStrategy } from './lib/local.strategy';
import { JwtStrategy } from './lib/jwt.strategy';
import { RegisterService } from './services/register.service';
import { RegisterController } from './controllers/register.controller';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { StrapiApiClientService } from './services/strapi.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Registration]),
    PassportModule,
    JwtModule.registerAsync(jwtAsyncConfig),
    MailModule,
    ApnsModule,
    AppleAuthModule,
  ],
  controllers: [AuthController, RegisterController, UserController],
  providers: [AuthService, RegisterService, LocalStrategy, JwtStrategy, UserService, StrapiApiClientService],
  exports: [AuthService, RegisterService],
})
export class AuthModule {}
