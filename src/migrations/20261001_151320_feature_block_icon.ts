import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_feature_block_items_media_type" AS ENUM('image', 'icon');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_items_media_type" AS ENUM('image', 'icon');
  ALTER TABLE "pages_blocks_feature_block_items" ADD COLUMN "media_type" "enum_pages_blocks_feature_block_items_media_type" DEFAULT 'image';
  ALTER TABLE "pages_blocks_feature_block_items" ADD COLUMN "icon" varchar;
  ALTER TABLE "pages_blocks_feature_block_items" ADD COLUMN "icon_color" varchar;
  ALTER TABLE "pages_blocks_feature_block_items" ADD COLUMN "icon_size" numeric DEFAULT 48;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ADD COLUMN "media_type" "enum__pages_v_blocks_feature_block_items_media_type" DEFAULT 'image';
  ALTER TABLE "_pages_v_blocks_feature_block_items" ADD COLUMN "icon" varchar;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ADD COLUMN "icon_color" varchar;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ADD COLUMN "icon_size" numeric DEFAULT 48;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_feature_block_items" DROP COLUMN "media_type";
  ALTER TABLE "pages_blocks_feature_block_items" DROP COLUMN "icon";
  ALTER TABLE "pages_blocks_feature_block_items" DROP COLUMN "icon_color";
  ALTER TABLE "pages_blocks_feature_block_items" DROP COLUMN "icon_size";
  ALTER TABLE "_pages_v_blocks_feature_block_items" DROP COLUMN "media_type";
  ALTER TABLE "_pages_v_blocks_feature_block_items" DROP COLUMN "icon";
  ALTER TABLE "_pages_v_blocks_feature_block_items" DROP COLUMN "icon_color";
  ALTER TABLE "_pages_v_blocks_feature_block_items" DROP COLUMN "icon_size";
  DROP TYPE "public"."enum_pages_blocks_feature_block_items_media_type";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_items_media_type";`)
}
