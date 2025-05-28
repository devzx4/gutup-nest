import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserCountry1708679916457 implements MigrationInterface {
  name = 'UserCountry1708679916457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "country" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
  }
}
