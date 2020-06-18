import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1592487596134 implements MigrationInterface {
  name = 'InitSchema1592487596134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "price" real NOT NULL, "unit" text NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
