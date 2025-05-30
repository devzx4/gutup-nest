import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'unspecified', description: 'User gender', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'User creation date', required: false })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ example: 'unspecified', description: 'User diet preference', required: false })
  @IsOptional()
  @IsString()
  current_diet?: string;

  @ApiProperty({ example: 'unspecified', description: 'User rhythm of life', required: false })
  @IsOptional()
  @IsString()
  rhythm_of_life?: string;

  @ApiProperty({ example: 0, description: 'User daily score', required: false })
  @IsOptional()
  daily_score?: number;

  @ApiProperty({ example: 'trainee', description: 'User role', required: false })
  @IsOptional()
  @IsString()
  user_role?: string;
}
