import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    this.logger.log(`JWT Strategy initialized with secret: ${process.env.JWT_SECRET ? '******' : 'undefined'}`);
  }

  async validate(payload: any) {
    this.logger.log(`JWT Payload received: ${JSON.stringify(payload, null, 2)}`);
    const userId = payload.sub;

    if (payload.sub && payload.email && payload.user_role) {
      this.logger.log(`User auth validated for user ID: ${userId}`);
      return { userId: payload.sub, email: payload.email, role: payload.user_role };
    } else {
      this.logger.warn(`Incomplete token payload, attempting to fetch user data`);
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user) {
        this.logger.log(`Found user in database: ${user.email}`);
        return { userId: user.id, email: user.email, role: user.user_role };
      }
      this.logger.error(`User with ID ${userId} not found`);
      return null;
    }
  }
}
