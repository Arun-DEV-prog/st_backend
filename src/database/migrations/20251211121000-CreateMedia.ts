import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMedia20251211121000 implements MigrationInterface {
  name = 'CreateMedia20251211121000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`CREATE TYPE "media_mime_type_enum" AS ENUM('jpeg','png','webp','mp4')`);
    await queryRunner.query(`CREATE TYPE "media_media_type_enum" AS ENUM('image','video')`);

    await queryRunner.query(`CREATE TABLE "media" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "specialists" uuid NOT NULL,
      "file_name" character varying(255) NOT NULL,
      "file_size" integer NOT NULL,
      "display_order" integer NOT NULL,
      "mime_type" "media_mime_type_enum",
      "media_type" "media_media_type_enum",
      "uploaded_at" TIMESTAMP,
      "deleted_at" TIMESTAMP,
      "created_at" TIMESTAMP NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_media_id" PRIMARY KEY ("id")
    )`);

    await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_media_specialists" FOREIGN KEY ("specialists") REFERENCES "specialists"("id") ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_media_specialists"`);
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TYPE "media_media_type_enum"`);
    await queryRunner.query(`DROP TYPE "media_mime_type_enum"`);
  }
}
