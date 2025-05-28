import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity as TypeOrmBaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class BaseEntity extends TypeOrmBaseEntity {
  @ApiProperty({
    description: 'Entity id',
    type: Number,
    example: 1,
  })
  @PrimaryGeneratedColumn({
    type: 'integer',
  })
  id: number;
}
