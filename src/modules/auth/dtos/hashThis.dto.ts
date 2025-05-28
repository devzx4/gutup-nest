import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class HashThisDto {
  @ApiProperty({
    description: 'Password to hash',
    type: String,
    example: 'hasThis123$',
  })
  @IsNotEmpty()
  password: string;
}
