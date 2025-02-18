import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailVerificationCode1739877205443 implements MigrationInterface {
    name = 'EmailVerificationCode1739877205443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "verficationCode" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "verficationCode"`);
    }

}
