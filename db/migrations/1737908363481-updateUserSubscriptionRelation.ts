import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserSubscriptionRelation1737908363481 implements MigrationInterface {
    name = 'UpdateUserSubscriptionRelation1737908363481'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscription" DROP CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0"`);
        await queryRunner.query(`ALTER TABLE "subscription" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "subscriptionsId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_cd080a167c47eed84fb15bdbe1f" FOREIGN KEY ("subscriptionsId") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cd080a167c47eed84fb15bdbe1f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "subscriptionsId"`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "subscription" ADD CONSTRAINT "FK_cc906b4bc892b048f1b654d2aa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
