import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Email to register',
    type: String,
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
