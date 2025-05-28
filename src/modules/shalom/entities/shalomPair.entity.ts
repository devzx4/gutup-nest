import { Column, Entity } from 'typeorm';
import { NltBaseEntity } from '@lib/abstracts/NltBaseEntity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ShalomPair extends NltBaseEntity {
  @ApiProperty({
    description: 'Key',
    type: String,
    example: 'version',
  })
  @Column()
  key: string;

  @ApiProperty({
    description: 'Website type',
    type: String,
    example: '102',
  })
  @Column()
  value: string;
}
