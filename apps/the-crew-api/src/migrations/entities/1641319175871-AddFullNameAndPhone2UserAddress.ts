import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFullNameAndPhone2UserAddress1641319175871 implements MigrationInterface {
  name = 'AddFullNameAndPhone2UserAddress1641319175871';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_addresses" ADD "full_name" text SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "user_addresses" ADD "phone" text SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_addresses" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "user_addresses" DROP COLUMN "full_name"`);
  }
}
