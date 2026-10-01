import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_home_partners_image_aspect" ADD VALUE 'wide' BEFORE 'square';
  ALTER TYPE "public"."enum_pages_blocks_home_partners_image_aspect" ADD VALUE 'auto';
  ALTER TYPE "public"."enum__pages_v_blocks_home_partners_image_aspect" ADD VALUE 'wide' BEFORE 'square';
  ALTER TYPE "public"."enum__pages_v_blocks_home_partners_image_aspect" ADD VALUE 'auto';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_home_partners" ALTER COLUMN "image_aspect" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_home_partners" ALTER COLUMN "image_aspect" SET DEFAULT 'landscape'::text;
  DROP TYPE "public"."enum_pages_blocks_home_partners_image_aspect";
  CREATE TYPE "public"."enum_pages_blocks_home_partners_image_aspect" AS ENUM('landscape', 'square', 'portrait');
  ALTER TABLE "pages_blocks_home_partners" ALTER COLUMN "image_aspect" SET DEFAULT 'landscape'::"public"."enum_pages_blocks_home_partners_image_aspect";
  ALTER TABLE "pages_blocks_home_partners" ALTER COLUMN "image_aspect" SET DATA TYPE "public"."enum_pages_blocks_home_partners_image_aspect" USING "image_aspect"::"public"."enum_pages_blocks_home_partners_image_aspect";
  ALTER TABLE "_pages_v_blocks_home_partners" ALTER COLUMN "image_aspect" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_home_partners" ALTER COLUMN "image_aspect" SET DEFAULT 'landscape'::text;
  DROP TYPE "public"."enum__pages_v_blocks_home_partners_image_aspect";
  CREATE TYPE "public"."enum__pages_v_blocks_home_partners_image_aspect" AS ENUM('landscape', 'square', 'portrait');
  ALTER TABLE "_pages_v_blocks_home_partners" ALTER COLUMN "image_aspect" SET DEFAULT 'landscape'::"public"."enum__pages_v_blocks_home_partners_image_aspect";
  ALTER TABLE "_pages_v_blocks_home_partners" ALTER COLUMN "image_aspect" SET DATA TYPE "public"."enum__pages_v_blocks_home_partners_image_aspect" USING "image_aspect"::"public"."enum__pages_v_blocks_home_partners_image_aspect";`)
}
