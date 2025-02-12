import { MigrationInterface, QueryRunner } from "typeorm";

export class VideoMovie1739142771962 implements MigrationInterface {
    name = 'VideoMovie1739142771962'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "videoUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "videoUrl"`);
    }

}
