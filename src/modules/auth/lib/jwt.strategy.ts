import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { isAfter } from 'date-fns/isAfter';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../entities/user.entity';

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

    const user = await this.userRepo.findOne({ where: { id: userId } });
    const issuedAt = new Date(payload.iat * 1000);

    if ((user && !user.passwordUpdatedAt) || (user && isAfter(issuedAt, user.passwordUpdatedAt))) {
      return { userId, username: payload.username };
    } else {
      return null;
    }
  }
}
