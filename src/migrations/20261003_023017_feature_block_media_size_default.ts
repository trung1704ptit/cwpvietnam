import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "media_size" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "media_size" SET DEFAULT 'full'::text;
  DROP TYPE "public"."enum_pages_blocks_feature_block_items_media_size";
  CREATE TYPE "public"."enum_pages_blocks_feature_block_items_media_size" AS ENUM('full', 'custom');
  ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "media_size" SET DEFAULT 'full'::"public"."enum_pages_blocks_feature_block_items_media_size";
  ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "media_size" SET DATA TYPE "public"."enum_pages_blocks_feature_block_items_media_size" USING "media_size"::"public"."enum_pages_blocks_feature_block_items_media_size";
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "media_size" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "media_size" SET DEFAULT 'full'::text;
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_items_media_size";
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_items_media_size" AS ENUM('full', 'custom');
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "media_size" SET DEFAULT 'full'::"public"."enum__pages_v_blocks_feature_block_items_media_size";
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "media_size" SET DATA TYPE "public"."enum__pages_v_blocks_feature_block_items_media_size" USING "media_size"::"public"."enum__pages_v_blocks_feature_block_items_media_size";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "media_size" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "media_size" SET DEFAULT 'custom'::text;
  DROP TYPE "public"."enum_pages_blocks_feature_block_items_media_size";
  CREATE TYPE "public"."enum_pages_blocks_feature_block_items_media_size" AS ENUM('custom', 'full');
  ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "media_size" SET DEFAULT 'custom'::"public"."enum_pages_blocks_feature_block_items_media_size";
  ALTER TABLE "pages_blocks_feature_block_items" ALTER COLUMN "media_size" SET DATA TYPE "public"."enum_pages_blocks_feature_block_items_media_size" USING "media_size"::"public"."enum_pages_blocks_feature_block_items_media_size";
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "media_size" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "media_size" SET DEFAULT 'custom'::text;
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_items_media_size";
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_items_media_size" AS ENUM('custom', 'full');
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "media_size" SET DEFAULT 'custom'::"public"."enum__pages_v_blocks_feature_block_items_media_size";
  ALTER TABLE "_pages_v_blocks_feature_block_items" ALTER COLUMN "media_size" SET DATA TYPE "public"."enum__pages_v_blocks_feature_block_items_media_size" USING "media_size"::"public"."enum__pages_v_blocks_feature_block_items_media_size";`)
}
