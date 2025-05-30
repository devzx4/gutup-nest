import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserAuth } from '@modules/auth/entities/userAuth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAuth])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export UserService for use in other modules
})
export class UserModule {}
