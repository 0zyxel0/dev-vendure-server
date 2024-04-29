import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOrderSchedulePickupCustomField1714350451540 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_73a78d7df09541ac5eba620d18"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_729b3eea7ce540930dbb706949"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_124456e637cca7a415897dce65"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_order" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL DEFAULT ('Regular'), "code" varchar NOT NULL, "state" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (1), "orderPlacedAt" datetime, "couponCodes" text NOT NULL, "shippingAddress" text NOT NULL, "billingAddress" text NOT NULL, "currencyCode" varchar NOT NULL, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "aggregateOrderId" integer, "customerId" integer, "taxZoneId" integer, "subTotal" integer NOT NULL, "subTotalWithTax" integer NOT NULL, "shipping" integer NOT NULL DEFAULT (0), "shippingWithTax" integer NOT NULL DEFAULT (0), "customFieldsOrdernotes" varchar(255), "customFieldsOrderschedulecollection" datetime(6), CONSTRAINT "FK_73a78d7df09541ac5eba620d181" FOREIGN KEY ("aggregateOrderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_order"("createdAt", "updatedAt", "type", "code", "state", "active", "orderPlacedAt", "couponCodes", "shippingAddress", "billingAddress", "currencyCode", "id", "aggregateOrderId", "customerId", "taxZoneId", "subTotal", "subTotalWithTax", "shipping", "shippingWithTax", "customFieldsOrdernotes") SELECT "createdAt", "updatedAt", "type", "code", "state", "active", "orderPlacedAt", "couponCodes", "shippingAddress", "billingAddress", "currencyCode", "id", "aggregateOrderId", "customerId", "taxZoneId", "subTotal", "subTotalWithTax", "shipping", "shippingWithTax", "customFieldsOrdernotes" FROM "order"`, undefined);
        await queryRunner.query(`DROP TABLE "order"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_73a78d7df09541ac5eba620d18" ON "order" ("aggregateOrderId") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_729b3eea7ce540930dbb706949" ON "order" ("code") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_124456e637cca7a415897dce65" ON "order" ("customerId") `, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_124456e637cca7a415897dce65"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_729b3eea7ce540930dbb706949"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_73a78d7df09541ac5eba620d18"`, undefined);
        await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`, undefined);
        await queryRunner.query(`CREATE TABLE "order" ("createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "type" varchar NOT NULL DEFAULT ('Regular'), "code" varchar NOT NULL, "state" varchar NOT NULL, "active" boolean NOT NULL DEFAULT (1), "orderPlacedAt" datetime, "couponCodes" text NOT NULL, "shippingAddress" text NOT NULL, "billingAddress" text NOT NULL, "currencyCode" varchar NOT NULL, "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "aggregateOrderId" integer, "customerId" integer, "taxZoneId" integer, "subTotal" integer NOT NULL, "subTotalWithTax" integer NOT NULL, "shipping" integer NOT NULL DEFAULT (0), "shippingWithTax" integer NOT NULL DEFAULT (0), "customFieldsOrdernotes" varchar(255), CONSTRAINT "FK_73a78d7df09541ac5eba620d181" FOREIGN KEY ("aggregateOrderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "order"("createdAt", "updatedAt", "type", "code", "state", "active", "orderPlacedAt", "couponCodes", "shippingAddress", "billingAddress", "currencyCode", "id", "aggregateOrderId", "customerId", "taxZoneId", "subTotal", "subTotalWithTax", "shipping", "shippingWithTax", "customFieldsOrdernotes") SELECT "createdAt", "updatedAt", "type", "code", "state", "active", "orderPlacedAt", "couponCodes", "shippingAddress", "billingAddress", "currencyCode", "id", "aggregateOrderId", "customerId", "taxZoneId", "subTotal", "subTotalWithTax", "shipping", "shippingWithTax", "customFieldsOrdernotes" FROM "temporary_order"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_order"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_124456e637cca7a415897dce65" ON "order" ("customerId") `, undefined);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_729b3eea7ce540930dbb706949" ON "order" ("code") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_73a78d7df09541ac5eba620d18" ON "order" ("aggregateOrderId") `, undefined);
   }

}
