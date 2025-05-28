import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GAuthDto {
  @ApiProperty({
    description: 'Google Auth token (idToken)',
    type: String,
    example: 'token-1231',
  })
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
