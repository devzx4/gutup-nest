import { ApiProperty } from '@nestjs/swagger';

export class ShalomReadResponseDto {
  @ApiProperty({
    description: 'Key',
    type: String,
    example: 'version',
  })
  key: string;

  @ApiProperty({
    description: 'Value',
    type: String,
    example: '102',
  })
  value: string;
}
