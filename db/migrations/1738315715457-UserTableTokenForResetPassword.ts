import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTableTokenForResetPassword1738315715457 implements MigrationInterface {
    name = 'UserTableTokenForResetPassword1738315715457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "resetToken" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "tokenExpiry" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tokenExpiry"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "resetToken"`);
    }

}
