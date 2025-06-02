import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'male', description: 'User gender', required: false })
  @Expose()
  gender: string;

  @ApiProperty({ example: '1990-01-01', description: 'User birth date', required: false })
  @Expose()
  birth_date: Date;

  @ApiProperty({ example: '2023-01-01', description: 'User creation date' })
  @Expose()
  created_at: Date;

  @ApiProperty({ example: 'vegetarian', description: 'User diet preference' })
  @Expose()
  current_diet: string;

  @ApiProperty({ example: 'active', description: 'User rhythm of life' })
  @Expose()
  rhythm_of_life: string;

  @ApiProperty({ example: 85, description: 'User daily score' })
  @Expose()
  daily_score: number;

  @ApiProperty({ example: 'customer', description: 'User role' })
  @Expose()
  user_role: string;

  @ApiProperty({ example: true, description: 'Whether user has completed survey data', required: false })
  @Expose()
  survey_data?: boolean;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}

export class AdminUserResponseDto extends UserResponseDto {
  @Exclude()
  survey_data?: boolean;

  constructor(partial: Partial<UserResponseDto>) {
    super(partial);
    delete this.survey_data;
  }
}
