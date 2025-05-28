import { validateOrReject } from 'class-validator';
import { Entity, BeforeInsert, BeforeUpdate, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

import { BaseEntity } from './BaseEntity';

// INFO: abstract class for all entities in the app
@Entity()
export abstract class NltBaseEntity extends BaseEntity {
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamptz',
  })
  public deletedAt: Date;

  // INFO: validation hook
  @BeforeInsert()
  @BeforeUpdate()
  private validate(): Promise<void> {
    return validateOrReject(this);
  }
}
