import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;

    // It's good practice to re-fetch the user to ensure they still exist and are active,
    // though for just returning payload data, this is also common.
    // const user = await this.userRepo.findOne({ where: { id: userId } });
    // if (!user) return null;

    // Assuming payload now contains sub, email, and user_role
    if (payload.sub && payload.email && payload.user_role) {
      return { userId: payload.sub, email: payload.email, role: payload.user_role };
    } else {
      // Handle cases where the token might be from an older version without the role
      // Or simply return null if the expected payload structure isn't met.
      // For simplicity, if you expect all tokens to have these fields:
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (user) {
        // Fallback or ensure all necessary fields are present
        return { userId: user.id, email: user.email, role: user.user_role };
      }
      return null;
    }
  }
}
