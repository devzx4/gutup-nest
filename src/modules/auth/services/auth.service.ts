import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';

import { Password } from '@utils/password';
import { Roles } from '@lib/types/user.types';
import { ConfigService } from '@nestjs/config';
import { AppleAuthService } from '@/providers/appleAuth';

import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { LoginResponseDTO } from '../dtos/login-reponse.dto';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private oauthClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private appleAuthService: AppleAuthService,
    private userService: UserService,
    @InjectRepository(User) private repo: Repository<User>,
  ) {
    this.oauthClient = new OAuth2Client({
      clientId: this.configService.get<string>('GAUTH_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GAUTH_SECRET'), // TODO: loophole where even without the secret, the idToken can be decoded. Check how to fix
    });
  }

  async sayHello() {
    return 'hello';
  }

  async hashThis(password: string) {
    return Password.toHash(password);
  }

  async validateUser(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    // TODO: add hash verfication
    if (user && user.passwordUpdatedAt && (await Password.compare(user.password, password))) {
      return user;
    }
    return null;
  }

  async login(user: User, isNewUser = false) {
    return { ...(await this.userService.login(user)), isNewUser };
  }

  async gauth(idToken: string): Promise<LoginResponseDTO> {
    // INFO: adapted from https://wanago.io/2021/07/26/api-nestjs-google-authentication/
    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GAUTH_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      const user = await this.repo.findOne({ where: { email: payload.email } });
      if (user) {
        // existing user
        return await this.login(user, false); // continue with login flow
      } else {
        // new user
        if (payload.email && payload.name) {
          const newUser = await this.userService.register({
            email: payload.email,
            fullname: payload.name,
            role: Roles.Trainee, // INFO: only trainee accounts will be created during gauth
          });
          return await this.login(newUser, true); // continue with login flow
        } else {
          throw new BadRequestException('Faulty payload');
        }
      }
    } catch (err) {
      throw new BadRequestException('Error during gauth');
    }
  }

  async appleAuth(authorizationCode: string, fullname: string): Promise<LoginResponseDTO> {
    try {
      const payload = await this.appleAuthService.validateToken(authorizationCode);

      const user = await this.repo.findOne({ where: { email: payload.email } });
      if (user) {
        // existing user
        return await this.login(user, false); // continue with login flow
      } else {
        // new user
        const newUser = await this.userService.register({
          email: payload.email,
          fullname,
          role: Roles.Trainee, // INFO: only trainee accounts will be created during gauth
        });
        return await this.login(newUser, true); // continue with login flow
      }
    } catch (err) {
      throw new BadRequestException('Error during Apple auth');
    }
  }
}
