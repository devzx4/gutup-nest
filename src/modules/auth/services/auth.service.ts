import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';

import { ConfigService } from '@nestjs/config';

import { UserService } from '@modules/user/user.service';
import { User } from '../../user/entities/user.entity';
import { UserAuth } from '../entities/userAuth.entity';

import { LoginResponseDTO } from '../dtos/login-reponse.dto';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

interface GoogleUserData {
  email: string;
  name: string;
  googleId?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private oauthClient: OAuth2Client;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(UserAuth) private userAuthRepo: Repository<UserAuth>,
  ) {
    this.oauthClient = new OAuth2Client({
      clientId: this.configService.get<string>('GAUTH_CLIENT_ID'),
      clientSecret: this.configService.get<string>('GAUTH_SECRET'),
    });
  }

  async sayHello() {
    return 'hello';
  }

  async validateUser(email: string) {
    const user = await this.repo.findOne({ where: { email } });
    // Only check if user exists, since passwordUpdatedAt and password do not exist
    if (user) {
      return user;
    }
    return null;
  }

  async login(user: User, isNewUser = false): Promise<LoginResponseDTO> {
    this.logger.log(`Creating JWT token for user ${user.email}`);
    const payload = { sub: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    return { user, isNewUser, access_token };
  }

  async gauth(idToken: string): Promise<LoginResponseDTO> {
    // INFO: adapted from https://wanago.io/2021/07/26/api-nestjs-google-authentication/
    try {
      this.logger.log('Verifying Google ID token');
      const ticket = await this.oauthClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GAUTH_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      let user = await this.repo.findOne({ where: { email: payload.email } });
      if (user) {
        // existing user
        this.logger.log(`Existing user found for email: ${payload.email}`);
        // Check if user_auth record exists for this user
        const userAuth = await this.userAuthRepo.findOne({ where: { user_id: user.id, auth_type: 'google' } });
        // If no user_auth record but we have Google ID, create one
        if (!userAuth && payload.sub) {
          this.logger.log(`Creating user_auth record for existing user: ${user.id}`);
          await this.createUserAuthRecord(user.id, 'google', payload.sub);
        }
        return await this.login(user, false); // continue with login flow
      } else {
        // new user
        this.logger.log(`Creating new user for email: ${payload.email}`);
        if (payload.email && payload.name) {
          const newUserDto: CreateUserDto = {
            email: payload.email,
            name: payload.name,
            gender: 'unspecified',
            created_at: new Date(),
            user_role: 'trainee',
            current_diet: 'unspecified',
            rhythm_of_life: 'unspecified',
            daily_score: 0,
          };
          user = await this.userService.create(newUserDto);
          // Create auth record for the new user
          if (payload.sub) {
            this.logger.log(`Creating user_auth record for new user: ${user.id}`);
            await this.createUserAuthRecord(user.id, 'google', payload.sub);
          }
          return await this.login(user, true);
        } else {
          throw new BadRequestException('Faulty payload');
        }
      }
    } catch (err) {
      this.logger.error(`Error during gauth: ${err.message}`);
      throw new BadRequestException('Error during gauth');
    }
  }

  async handleGoogleUser(userData: GoogleUserData): Promise<LoginResponseDTO> {
    try {
      this.logger.log(`Processing Google user: ${userData.email}`);

      // Check if user exists
      let user = await this.repo.findOne({ where: { email: userData.email } });
      let isNewUser = false;

      if (user) {
        this.logger.log(`Existing user found: ${userData.email}`);
        // User exists, continue with login flow

        // Check if user_auth record exists for this user
        const userAuth = await this.userAuthRepo.findOne({
          where: { user_id: user.id, auth_type: 'google' },
        });

        // If no user_auth record but we have Google ID, create one
        if (!userAuth && userData.googleId) {
          this.logger.log(`Creating user_auth record for existing user: ${user.id}`);
          await this.createUserAuthRecord(user.id, 'google', userData.googleId);
        }
      } else {
        this.logger.log(`Creating new user from Google auth: ${userData.email}`);
        // Create new user
        const newUserDto: CreateUserDto = {
          email: userData.email,
          name: userData.name,
          gender: 'unspecified', // Add default gender value here
          created_at: new Date(),
          user_role: 'trainee',
          current_diet: 'unspecified',
          rhythm_of_life: 'unspecified',
          daily_score: 0,
        };

        user = await this.userService.create(newUserDto);
        isNewUser = true;

        // Create auth record for the new user
        if (userData.googleId) {
          this.logger.log(`Creating user_auth record for new user: ${user.id}`);
          await this.createUserAuthRecord(user.id, 'google', userData.googleId);
        }
      }

      // Create JWT token and return login response
      return this.login(user, isNewUser);
    } catch (error) {
      this.logger.error(`Error processing Google user: ${error.message}`);
      throw new BadRequestException('Failed to process Google authentication');
    }
  }

  /**
   * Creates a user_auth record for a user
   */
  private async createUserAuthRecord(userId: number, authType: string, providerId: string): Promise<UserAuth> {
    try {
      const userAuth = this.userAuthRepo.create({
        user_id: userId,
        auth_type: authType,
        google_id: providerId,
        password_hash: '', // Empty for OAuth users
      });

      return await this.userAuthRepo.save(userAuth);
    } catch (error) {
      this.logger.error(`Failed to create user_auth record: ${error.message}`);
      throw error;
    }
  }
}
