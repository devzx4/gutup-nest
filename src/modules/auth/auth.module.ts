import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtAsyncConfig } from '@config/jwt.config';

import { User } from '@modules/user/entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { ApnsModule } from '@providers/apns/apns.module';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './lib/jwt.strategy';
import { LocalStrategy } from './lib/local.strategy';
import { AuthService } from './services/auth.service';
import { StrapiApiClientService } from './services/strapi.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    //PassportModule,
    JwtModule.registerAsync(jwtAsyncConfig),
    ApnsModule,
    UserModule, // Import UserModule to provide UserService
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, StrapiApiClientService],
  exports: [AuthService],
})
export class AuthModule {}
