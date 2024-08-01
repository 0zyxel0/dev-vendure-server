import {MigrationInterface, QueryRunner} from "typeorm";

export class AddWebhookTable1722548115279 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "webhook" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "channelId" varchar NOT NULL, "url" varchar NOT NULL, "event" varchar NOT NULL, "transformerName" varchar, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "webhook"`, undefined);
   }

}
