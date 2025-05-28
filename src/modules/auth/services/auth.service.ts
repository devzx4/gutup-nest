import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { Password } from '@utils/password';

import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService, @InjectRepository(User) private repo: Repository<User>) {}

  async sayHello() {
    return 'hello';
  }

  async hashThis(password: string) {
    return Password.toHash(password);
  }

  async validateUser(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    // TODO: add hash verfication
    if (user && (await Password.compare(user.password, password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return user;
    }
    return null;
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
}
