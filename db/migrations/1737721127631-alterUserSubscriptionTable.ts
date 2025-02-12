import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUserSubscriptionTable1737721127631 implements MigrationInterface {
    name = 'AlterUserSubscriptionTable1737721127631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "plan" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "price" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "duration" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "plan"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "id"`);
    }

}
