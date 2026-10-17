import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  ALTER TABLE "posts" ADD COLUMN "deleted_at" timestamp(3) with time zone;
  ALTER TABLE "_posts_v" ADD COLUMN "version_deleted_at" timestamp(3) with time zone;
  CREATE INDEX "pages_deleted_at_idx" ON "pages" USING btree ("deleted_at");
  CREATE INDEX "_pages_v_version_version_deleted_at_idx" ON "_pages_v" USING btree ("version_deleted_at");
  CREATE INDEX "posts_deleted_at_idx" ON "posts" USING btree ("deleted_at");
  CREATE INDEX "_posts_v_version_version_deleted_at_idx" ON "_posts_v" USING btree ("version_deleted_at");
  UPDATE "pages_locales" SET "meta_description" = 'Cancer Wellness Program supports people living with and beyond cancer.' WHERE "meta_description" ILIKE '%payload%';
  UPDATE "pages_locales" SET "meta_title" = 'Cancer Wellness Program' WHERE "meta_title" ILIKE '%payload%';
  UPDATE "_pages_v_locales" SET "version_meta_description" = 'Cancer Wellness Program supports people living with and beyond cancer.' WHERE "version_meta_description" ILIKE '%payload%';
  UPDATE "_pages_v_locales" SET "version_meta_title" = 'Cancer Wellness Program' WHERE "version_meta_title" ILIKE '%payload%';
  UPDATE "posts_locales" SET "meta_description" = 'Cancer Wellness Program supports people living with and beyond cancer.' WHERE "meta_description" ILIKE '%payload%';
  UPDATE "posts_locales" SET "meta_title" = 'Cancer Wellness Program' WHERE "meta_title" ILIKE '%payload%';
  UPDATE "_posts_v_locales" SET "version_meta_description" = 'Cancer Wellness Program supports people living with and beyond cancer.' WHERE "version_meta_description" ILIKE '%payload%';
  UPDATE "_posts_v_locales" SET "version_meta_title" = 'Cancer Wellness Program' WHERE "version_meta_title" ILIKE '%payload%';
  UPDATE "search" SET "meta_description" = 'Cancer Wellness Program supports people living with and beyond cancer.' WHERE "meta_description" ILIKE '%payload%';
  UPDATE "search" SET "meta_title" = 'Cancer Wellness Program' WHERE "meta_title" ILIKE '%payload%';`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "pages_deleted_at_idx";
  DROP INDEX "_pages_v_version_version_deleted_at_idx";
  DROP INDEX "posts_deleted_at_idx";
  DROP INDEX "_posts_v_version_version_deleted_at_idx";
  ALTER TABLE "pages" DROP COLUMN "deleted_at";
  ALTER TABLE "_pages_v" DROP COLUMN "version_deleted_at";
  ALTER TABLE "posts" DROP COLUMN "deleted_at";
  ALTER TABLE "_posts_v" DROP COLUMN "version_deleted_at";`)
}
