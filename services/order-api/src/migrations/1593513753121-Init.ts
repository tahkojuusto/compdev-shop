import {MigrationInterface, QueryRunner} from "typeorm";

export class Init1593513753121 implements MigrationInterface {
    name = 'Init1593513753121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders"."order" ("orderid" SERIAL NOT NULL, "created_ts" TIMESTAMP NOT NULL DEFAULT now(), "updated_ts" TIMESTAMP NOT NULL DEFAULT now(), "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "streetaddress" character varying NOT NULL, "postalcode" character varying NOT NULL, "email" character varying NOT NULL, "phonenumber" character varying NOT NULL, CONSTRAINT "PK_b45899ee611fd0e46277114cb88" PRIMARY KEY ("orderid"))`);
        await queryRunner.query(`CREATE TABLE "orders"."product" ("productid" integer NOT NULL, "name" character varying NOT NULL, "price" real NOT NULL, "quantity" integer NOT NULL DEFAULT 1, "orderid" integer NOT NULL, CONSTRAINT "PK_b8fc83ff0157d23b173949e86c8" PRIMARY KEY ("productid"))`);
        await queryRunner.query(`ALTER TABLE "orders"."product" ADD CONSTRAINT "FK_097dc844e1a7a4ec33e6e06481e" FOREIGN KEY ("orderid") REFERENCES "orders"."order"("orderid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders"."product" DROP CONSTRAINT "FK_097dc844e1a7a4ec33e6e06481e"`);
        await queryRunner.query(`DROP TABLE "orders"."product"`);
        await queryRunner.query(`DROP TABLE "orders"."order"`);
    }

}
