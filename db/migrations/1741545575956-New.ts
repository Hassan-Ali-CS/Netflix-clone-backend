import { MigrationInterface, QueryRunner } from "typeorm";

export class New1741545575956 implements MigrationInterface {
    name = 'New1741545575956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subscription" ("id" SERIAL NOT NULL, "plan" character varying NOT NULL, "price" double precision NOT NULL, "duration" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, CONSTRAINT "PK_8c3e00ebd02103caa1174cd5d9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "movie" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "releaseDate" character varying NOT NULL, "rating" double precision NOT NULL, "duration" integer NOT NULL, "imageUrl" character varying, "videoUrl" character varying, CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "resetToken" character varying, "tokenExpiry" TIMESTAMP, "verficationCode" character varying, "role" character varying NOT NULL DEFAULT 'customer', "subscriptionsId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_favourite_movies_movie" ("userId" integer NOT NULL, "movieId" integer NOT NULL, CONSTRAINT "PK_658503dfc495f2aacd7a0832042" PRIMARY KEY ("userId", "movieId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3b9ecdda6eb13b0305cdcf9d7d" ON "user_favourite_movies_movie" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d01bdc99359687ac01f7a85e39" ON "user_favourite_movies_movie" ("movieId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_cd080a167c47eed84fb15bdbe1f" FOREIGN KEY ("subscriptionsId") REFERENCES "subscription"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_favourite_movies_movie" ADD CONSTRAINT "FK_3b9ecdda6eb13b0305cdcf9d7dc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favourite_movies_movie" ADD CONSTRAINT "FK_d01bdc99359687ac01f7a85e39d" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favourite_movies_movie" DROP CONSTRAINT "FK_d01bdc99359687ac01f7a85e39d"`);
        await queryRunner.query(`ALTER TABLE "user_favourite_movies_movie" DROP CONSTRAINT "FK_3b9ecdda6eb13b0305cdcf9d7dc"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_cd080a167c47eed84fb15bdbe1f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d01bdc99359687ac01f7a85e39"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b9ecdda6eb13b0305cdcf9d7d"`);
        await queryRunner.query(`DROP TABLE "user_favourite_movies_movie"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "movie"`);
        await queryRunner.query(`DROP TABLE "subscription"`);
    }

}
