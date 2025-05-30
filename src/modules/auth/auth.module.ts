import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtAsyncConfig } from '@config/jwt.config';

import { User } from '@modules/user/entities/user.entity';
import { UserModule } from '@modules/user/user.module';
import { ApnsModule } from '@providers/apns/apns.module';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './lib/jwt.strategy';
import { LocalStrategy } from './lib/local.strategy';
import { GoogleStrategy } from './lib/google.strategy';
import { AuthService } from './services/auth.service';
//import { StrapiApiClientService } from './services/strapi.service';
import { UserAuth } from './entities/userAuth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAuth]),
    PassportModule,
    JwtModule.registerAsync(jwtAsyncConfig),
    ApnsModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    //StrapiApiClientService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
