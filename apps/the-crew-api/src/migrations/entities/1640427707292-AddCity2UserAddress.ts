import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCity2UserAddress1640427707292 implements MigrationInterface {
  name = 'AddCity2UserAddress1640427707292';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_addresses" ADD "city" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_addresses" DROP COLUMN "city"`);
  }
}
