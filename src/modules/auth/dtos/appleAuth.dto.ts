import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AppleAuthDto {
  @ApiProperty({
    description: 'Apple Authorization code',
    type: String,
    example: 'token-1231',
  })
  @IsString()
  @IsNotEmpty()
  authorizationCode: string;

  @ApiProperty({
    description: 'Full name of the user',
    type: String,
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullname: string;
}
