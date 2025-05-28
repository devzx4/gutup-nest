import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Full name',
    type: String,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({
    description: 'Country code',
    type: String,
    example: 'LK',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'iOS device token',
    type: String,
    example: 'aegdb-12-as',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  iosDeviceToken: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: 'sampleHash32$!',
  })
  @IsStrongPassword()
  @IsOptional()
  // @ValidateIf((body: UpdateUserDto) => isNotEmpty(body.currentPassword))
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'Password',
    type: String,
    example: 'sampleHash32$!',
  })
  @IsOptional()
  @IsNotEmpty()
  currentPassword: string;
}
