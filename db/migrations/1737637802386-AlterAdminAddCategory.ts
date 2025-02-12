import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAdminAddCategory1737637802386 implements MigrationInterface {
    name = 'AlterAdminAddCategory1737637802386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "admin" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admin" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "admin" ADD "role" character varying NOT NULL DEFAULT 'admin'`);
        await queryRunner.query(`ALTER TABLE "admin" ADD "username" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "category" ADD "description" character varying`);
    }

}
