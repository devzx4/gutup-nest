import { Column, Entity } from 'typeorm';
import { NltBaseEntity } from '@lib/abstracts/NltBaseEntity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Registration extends NltBaseEntity {
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'user@example.com',
  })
  @Column()
  email: string;

  @ApiProperty({
    description: 'The code that will be sent in the email',
    type: String,
    example: 'jCoDe12431',
  })
  @Column()
  code: string;
}
