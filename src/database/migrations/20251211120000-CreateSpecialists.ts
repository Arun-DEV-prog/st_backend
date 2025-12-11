import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSpecialists20251211120000 implements MigrationInterface {
  name = 'CreateSpecialists20251211120000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure the uuid generation function exists in Postgres (extension may be required)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`CREATE TYPE "specialists_verification_status_enum" AS ENUM('pending','approved','rejected')`);

    await queryRunner.query(`CREATE TABLE "specialists" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "average_rating" numeric(3,2),
      "is_draft" boolean NOT NULL DEFAULT true,
      "total_number_of_ratings" integer NOT NULL DEFAULT 0,
      "title" character varying(255) NOT NULL,
      "slug" character varying(255) NOT NULL,
      "description" text,
      "base_price" numeric(10,2) NOT NULL,
      "platform_fee" numeric(10,2) NOT NULL,
      "final_price" numeric(10,2) NOT NULL,
      "verification_status" "specialists_verification_status_enum" NOT NULL DEFAULT 'pending',
      "is_verified" boolean NOT NULL DEFAULT false,
      "duration_days" integer,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      "deleted_at" TIMESTAMP,
      CONSTRAINT "PK_specialists_id" PRIMARY KEY ("id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "specialists"`);
    await queryRunner.query(`DROP TYPE "specialists_verification_status_enum"`);
  }
}
