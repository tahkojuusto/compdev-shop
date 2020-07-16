import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1593512559357 implements MigrationInterface {
    name = 'Init1593512559357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products"."product" ("productid" integer NOT NULL, "name" character varying NOT NULL, "description" character varying, "unit" text NOT NULL, CONSTRAINT "PK_9234fa5b1b5b8b1397c85accddf" PRIMARY KEY ("productid"))`);
        await queryRunner.query(`CREATE TABLE "products"."product_price" ("productpriceid" integer NOT NULL, "effective_ts" TIMESTAMP NOT NULL, "price" real NOT NULL, "productid" integer, CONSTRAINT "PK_0e7858914cee86e12659694c513" PRIMARY KEY ("productpriceid"))`);
        await queryRunner.query(`ALTER TABLE "products"."product_price" ADD CONSTRAINT "FK_d5453824252a594a942b2369323" FOREIGN KEY ("productid") REFERENCES "products"."product"("productid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products"."product_price" DROP CONSTRAINT "FK_d5453824252a594a942b2369323"`);
        await queryRunner.query(`DROP TABLE "products"."product_price"`);
        await queryRunner.query(`DROP TABLE "products"."product"`);
    }

}
