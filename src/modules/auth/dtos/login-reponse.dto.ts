import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { User } from '../entities/user.entity';

export class LoginResponseDTO {
  @ApiProperty({
    description: 'User',
    type: User,
  })
  user: User;

  @ApiProperty({
    description: 'Access token',
    type: String,
    example: 100,
  })
  @IsString()
  access_token: string;
}
