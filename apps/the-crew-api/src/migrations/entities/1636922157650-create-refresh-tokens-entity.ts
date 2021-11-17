import { MigrationInterface, QueryRunner } from 'typeorm';

export class createRefreshTokensEntity1636922157650 implements MigrationInterface {
  name = 'createRefreshTokensEntity1636922157650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "modified_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_on" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "is_revoked" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_3ddc983c5f7bcf132fd8732c3f" UNIQUE ("user_id"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
