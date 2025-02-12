import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationUpdateCategoryMovie1737979108387 implements MigrationInterface {
    name = 'RelationUpdateCategoryMovie1737979108387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie" DROP CONSTRAINT "FK_1b247d952755f8dd46e2ebe9663"`);
        await queryRunner.query(`CREATE TABLE "movie_categories_category" ("movieId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_5966afcbb854aef6e0f4d2ae40c" PRIMARY KEY ("movieId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0d43cf9426be5b4db28f207179" ON "movie_categories_category" ("movieId") `);
        await queryRunner.query(`CREATE INDEX "IDX_32d9eb1bb6f1e2bee2411b7226" ON "movie_categories_category" ("categoryId") `);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "genre"`);
        await queryRunner.query(`ALTER TABLE "movie" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "movie_categories_category" ADD CONSTRAINT "FK_0d43cf9426be5b4db28f2071794" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "movie_categories_category" ADD CONSTRAINT "FK_32d9eb1bb6f1e2bee2411b7226c" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "movie_categories_category" DROP CONSTRAINT "FK_32d9eb1bb6f1e2bee2411b7226c"`);
        await queryRunner.query(`ALTER TABLE "movie_categories_category" DROP CONSTRAINT "FK_0d43cf9426be5b4db28f2071794"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "categoryId" integer`);
        await queryRunner.query(`ALTER TABLE "movie" ADD "genre" character varying NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_32d9eb1bb6f1e2bee2411b7226"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d43cf9426be5b4db28f207179"`);
        await queryRunner.query(`DROP TABLE "movie_categories_category"`);
        await queryRunner.query(`ALTER TABLE "movie" ADD CONSTRAINT "FK_1b247d952755f8dd46e2ebe9663" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
