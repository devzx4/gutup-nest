import { MigrationInterface, QueryRunner } from 'typeorm';

export class Shalom1702399233608 implements MigrationInterface {
  name = 'Shalom1702399233608';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "shalom_pair" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "key" character varying NOT NULL, "value" character varying NOT NULL, CONSTRAINT "PK_fb6ee44e05a342a3a3e6a29625f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "shalom_pair"`);
  }
}
