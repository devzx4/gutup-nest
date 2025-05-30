import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Password } from '@utils/password';
import { Roles } from '@lib/types/user.types';
import { StrapiApiClient } from '@lib/api/strapi/StrapiApiClient';

import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { StrapiApiClientService } from './strapi.service';
import { SendTestNotificationDto } from '../dtos/send-test-notification';
import { ApnsService } from '@/providers/apns/apns.service';
import { ApiException } from '@/lib/customErrors/ApiExceptionError';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private strapiApi: StrapiApiClient | undefined = null;
  private strapiEnabled = false;

  constructor(
    private jwtService: JwtService,
    private readonly strapiApiService: StrapiApiClientService,
    private configService: ConfigService,
    private apnsService: ApnsService,
    @InjectRepository(User) private repo: Repository<User>,
  ) {
    this.strapiApi = this.strapiApiService.getApiClient();
    if (this.configService.get<boolean>('strapiEnabled')) {
      this.strapiEnabled = true;
    }
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register({
    email,
    fullname,
    role,
    password,
    activated = false,
  }: {
    email: string;
    password?: string;
    fullname: string;
    role: Roles;
    activated?: boolean;
  }) {
    this.logger.log(`registerUser start`);
    this.logger.log(`params :: ${fullname} , ${email} , ${role}`);
    const newUser = this.repo.create({
      email,
      fullname,
      password: await Password.toHash(password ?? Password.create()),
      role,
      activated,
    });
    if (this.strapiEnabled) {
      await this.strapiApi.createUser({
        email,
        username: email,
        password: await Password.toHash(Password.create()),
        role: parseInt(this.configService.get('STRAPI_REGISTER_ROLE_ID')),
      });
    }
    return this.repo.save(newUser);
  }

  async updateUserApi(modifiedProperties: UpdateUserDto, user: User): Promise<User> {
    for (const userProp of Object.keys(modifiedProperties)) {
      switch (userProp) {
        case 'newPassword': {
          // INFO: check if currentPassword validates
          if (!user.passwordUpdatedAt) {
            user.password = await Password.toHash(modifiedProperties.newPassword);
            user.activated = true; // INFO: a user is considered activated when they first set the password
          } else if (
            modifiedProperties.currentPassword &&
            (await Password.compare(user.password, modifiedProperties.currentPassword))
          ) {
            user.password = await Password.toHash(modifiedProperties.newPassword);
          } else {
            throw new BadRequestException('Current password is invalid');
          }
          break;
        }
        case 'currentPassword': {
          // INFO: skip these props (probably processed in another way)
          break;
        }
        default: {
          user[userProp] = modifiedProperties[userProp];
        }
      }
    }

    await user.save();

    return user;
  }

  async sendTestNotificationApi({ email, body }: SendTestNotificationDto): Promise<void> {
    const user = await this.repo.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('A user with that email could not be found');
    } else if (!user.iosDeviceToken) {
      throw new BadRequestException('No device token');
    }

    try {
      await this.apnsService.sendNotification(user.iosDeviceToken, {
        alert: body,
      });
    } catch (err) {
      throw new ApiException(err.toString());
    }
  }
}
