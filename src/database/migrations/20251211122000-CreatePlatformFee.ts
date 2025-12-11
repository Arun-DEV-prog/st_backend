import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlatformFee20251211122000 implements MigrationInterface {
  name = 'CreatePlatformFee20251211122000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`CREATE TYPE "platform_fee_tier_name_enum" AS ENUM('basic','standard','premium')`);

    await queryRunner.query(`CREATE TABLE "platform_fee" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "tier_name" "platform_fee_tier_name_enum" NOT NULL,
      "min_value" integer NOT NULL,
      "max_value" integer NOT NULL,
      "platform_fee_percentage" numeric(5,2) NOT NULL,
      "specialists" uuid NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_platform_fee_id" PRIMARY KEY ("id")
    )`);

    await queryRunner.query(`ALTER TABLE "platform_fee" ADD CONSTRAINT "FK_platform_fee_specialists" FOREIGN KEY ("specialists") REFERENCES "specialists"("id") ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "platform_fee" DROP CONSTRAINT "FK_platform_fee_specialists"`);
    await queryRunner.query(`DROP TABLE "platform_fee"`);
    await queryRunner.query(`DROP TYPE "platform_fee_tier_name_enum"`);
  }
}
