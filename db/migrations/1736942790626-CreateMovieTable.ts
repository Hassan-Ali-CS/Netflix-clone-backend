import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMovieTable1736942790626 implements MigrationInterface {
    name = 'CreateMovieTable1736942790626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "releaseDate" character varying NOT NULL, "genre" character varying NOT NULL, "rating" double precision NOT NULL, "duration" integer NOT NULL, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "movie"`);
    }

}
