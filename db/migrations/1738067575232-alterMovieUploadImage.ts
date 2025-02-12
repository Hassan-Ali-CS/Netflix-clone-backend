import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterMovieUploadImage1738067575232 implements MigrationInterface {
    name = 'AlterMovieUploadImage1738067575232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" ADD "imageUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "imageUrl"`);
    }

}
