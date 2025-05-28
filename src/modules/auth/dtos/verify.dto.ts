import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyDto {
  @ApiProperty({
    description: 'Email to verify',
    type: String,
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Code',
    type: String,
    example: 'be32ff84-f02c-4300-96bf-149e1277ed9c',
  })
  @IsNotEmpty()
  @IsUUID()
  code: string;
}
