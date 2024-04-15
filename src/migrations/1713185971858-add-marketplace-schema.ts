import {MigrationInterface, QueryRunner} from "typeorm";

export class AddMarketplaceSchema1713185971858 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_seller" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "name" varchar NOT NULL, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "customFieldsConnectedaccountid" varchar(255))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_seller"("createdAt", "updatedAt", "deletedAt", "name", "id") SELECT "createdAt", "updatedAt", "deletedAt", "name", "id" FROM "seller"`, undefined);
        await queryRunner.query(`DROP TABLE "seller"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_seller" RENAME TO "seller"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "seller" RENAME TO "temporary_seller"`, undefined);
        await queryRunner.query(`CREATE TABLE "seller" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "deletedAt" datetime, "name" varchar NOT NULL, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "seller"("createdAt", "updatedAt", "deletedAt", "name", "id") SELECT "createdAt", "updatedAt", "deletedAt", "name", "id" FROM "temporary_seller"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_seller"`, undefined);
   }

}
