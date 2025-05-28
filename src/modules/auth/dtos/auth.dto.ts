import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'Email',
    type: String,
    example: 'john@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: 'sampleHash32$!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
