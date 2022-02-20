import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationTable1645111440886 implements MigrationInterface {
  name = 'CreateNotificationTable1645111440886';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" ("created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "modified_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_on" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subject" character varying NOT NULL, "body" character varying NOT NULL, "receivers" uuid array NOT NULL, "type" numeric NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "meta" json NOT NULL DEFAULT '{}', CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
