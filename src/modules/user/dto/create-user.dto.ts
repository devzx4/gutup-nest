import { IsEmail, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '', description: 'User gender', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ description: 'User birth date (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  birth_date?: Date;

  @ApiProperty({ description: 'User creation date', required: false })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({ example: '', description: 'User diet preference', required: false })
  @IsOptional()
  @IsString()
  current_diet?: string;

  @ApiProperty({ example: '', description: 'User rhythm of life', required: false })
  @IsOptional()
  @IsString()
  rhythm_of_life?: string;

  @ApiProperty({ example: 0, description: 'User daily score', required: false })
  @IsOptional()
  daily_score?: number;

  @ApiProperty({ example: 'customer', description: 'User role', required: false })
  @IsOptional()
  @IsString()
  user_role?: string;

  @ApiProperty({ example: 'password123', description: 'User password', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: false, description: 'Whether user has completed survey data', required: false })
  @IsOptional()
  @IsBoolean()
  survey_data?: boolean;
}
