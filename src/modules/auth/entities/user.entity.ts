import { Column, Entity } from 'typeorm';
import { NltBaseEntity } from '@lib/abstracts/NltBaseEntity';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from '@lib/types/user.types';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends NltBaseEntity {
  @ApiProperty({
    description: 'If user is activated',
    type: Boolean,
    example: false,
  })
  @Column()
  activated: boolean;

  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'user@example.com',
  })
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @ApiProperty({
    description: 'fullname',
    type: String,
    example: 'John Doe',
  })
  @Column()
  fullname: string;

  @ApiProperty({
    description: 'User role',
    enumName: 'Roles',
    enum: Roles,
    example: Roles.Admin,
  })
  @Column({ nullable: true })
  role: string;

  @ApiProperty({
    description: 'country code',
    type: String,
    example: 'LK',
  })
  @Column({ nullable: true })
  country: string;

  @ApiProperty({
    description: 'password last updated',
    type: Date,
  })
  @Column({ nullable: true, default: null })
  passwordUpdatedAt: Date;

  @ApiProperty({
    description: 'iOS device push token',
    type: String,
  })
  @Column({ nullable: true, default: null })
  iosDeviceToken: string;
}
