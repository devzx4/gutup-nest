import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { subHours } from 'date-fns/subHours';
import { isAfter } from 'date-fns/isAfter';
import { randomUUID } from 'crypto';

import { Roles } from '@lib/types/user.types';

import { User } from '../entities/user.entity';
import { Registration } from '../entities/registration.entity';
import { UserService } from './user.service';
import { LoginResponseDTO } from '../dtos/login-reponse.dto';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  private verificationValidityPeriod = 24; // INFO: validity of verification link in hours

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Registration) private registrationRepo: Repository<Registration>,
  ) {}

  async verifyEmail(email: string, code: string): Promise<LoginResponseDTO> {
    const user = await this.repo.findOne({ where: { email: email, activated: false } });

    if (user) {
      const registration = await this.registrationRepo.findOne({ where: { code } });
      if (registration && registration.email === email) {
        if (isAfter(registration.createdAt, subHours(new Date(), this.verificationValidityPeriod))) {
          // INFO: link was created not more than 24 hours ago so still valid
          user.activated = false;
          user.save();
          await this.registrationRepo.softDelete({ email });
          return { isNewUser: true, ...(await this.userService.login(user)) };
        } else {
          await this.registrationRepo.softDelete({ email });
          throw new BadRequestException('Link has expired');
        }
      } else {
        throw new BadRequestException('Invalid registration link');
      }
    } else {
      throw new BadRequestException('An inactive user with that email does not exist');
    }
  }

  async registerEmail(email: string) {
    const user = await this.repo.findOne({ where: { email: email } });

    if (user && user.activated) {
      // INFO: a user exists for this email
      throw new BadRequestException('Email already registered');
    } else {
      // INFO: a new email

      const registration = await this.registrationRepo.findOne({
        where: { email },
      });

      if (registration) {
        // INFO: registration already exists
        if (isAfter(registration.createdAt, subHours(new Date(), this.verificationValidityPeriod))) {
          // INFO: link was created not more than 24 hours ago so still valid
          throw new BadRequestException('An active link has already been mailed');
        } else {
          await this.registrationRepo.softDelete({ email });
        }
      }

      if (!user) {
        // INFO: create a user IF, a user record does not exist
        await this.userService.register({ email, fullname: '', role: Roles.Trainee, activated: false });
      }
      // TODO: check if best way is to hash random UUID before storing it on the DB and the raw version is not stored but only sent in the email link
      const code = randomUUID();
      await this.registrationRepo.insert({ email, code });
    }
  }
}
