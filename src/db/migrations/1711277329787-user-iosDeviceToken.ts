import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserIosDeviceToken1711277329787 implements MigrationInterface {
  name = 'UserIosDeviceToken1711277329787';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "iosDeviceToken" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "iosDeviceToken"`);
  }
}
