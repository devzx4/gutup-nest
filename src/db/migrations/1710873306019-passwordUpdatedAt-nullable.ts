import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordUpdatedAtNullable1710873306019 implements MigrationInterface {
  name = 'PasswordUpdatedAtNullable1710873306019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordUpdatedAt" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordUpdatedAt" DROP DEFAULT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordUpdatedAt" SET DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordUpdatedAt" SET NOT NULL`);
  }
}
