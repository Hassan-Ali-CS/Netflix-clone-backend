import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFavouriteMovieRelation1739266126710 implements MigrationInterface {
    name = 'UserFavouriteMovieRelation1739266126710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favourite_movies_movie" ("userId" integer NOT NULL, "movieId" integer NOT NULL, CONSTRAINT "PK_658503dfc495f2aacd7a0832042" PRIMARY KEY ("userId", "movieId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b9ecdda6eb13b0305cdcf9d7d" ON "user_favourite_movies_movie" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d01bdc99359687ac01f7a85e39" ON "user_favourite_movies_movie" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "user_favourite_movies_movie" ADD CONSTRAINT "FK_3b9ecdda6eb13b0305cdcf9d7dc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favourite_movies_movie" ADD CONSTRAINT "FK_d01bdc99359687ac01f7a85e39d" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favourite_movies_movie" DROP CONSTRAINT "FK_d01bdc99359687ac01f7a85e39d"`);
        await queryRunner.query(`ALTER TABLE "user_favourite_movies_movie" DROP CONSTRAINT "FK_3b9ecdda6eb13b0305cdcf9d7dc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d01bdc99359687ac01f7a85e39"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b9ecdda6eb13b0305cdcf9d7d"`);
        await queryRunner.query(`DROP TABLE "user_favourite_movies_movie"`);
    }

}
