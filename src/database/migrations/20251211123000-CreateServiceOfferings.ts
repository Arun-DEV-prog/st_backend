import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceOfferings20251211123000 implements MigrationInterface {
  name = 'CreateServiceOfferings20251211123000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`CREATE TABLE "service_offerings" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "specialists" uuid NOT NULL,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_service_offerings_id" PRIMARY KEY ("id")
    )`);

    await queryRunner.query(`ALTER TABLE "service_offerings" ADD CONSTRAINT "FK_service_offerings_specialists" FOREIGN KEY ("specialists") REFERENCES "specialists"("id") ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "service_offerings" DROP CONSTRAINT "FK_service_offerings_specialists"`);
    await queryRunner.query(`DROP TABLE "service_offerings"`);
  }
}
