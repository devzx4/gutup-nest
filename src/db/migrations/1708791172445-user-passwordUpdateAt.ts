import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPasswordUpdateAt1708791172445 implements MigrationInterface {
  name = 'UserPasswordUpdateAt1708791172445';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "passwordUpdatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordUpdatedAt"`);
  }
}
