import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_carousel_mobile_height" AS ENUM('aspect', '480', '640', '70vh', '85vh', '100vh');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_mobile_height" AS ENUM('aspect', '480', '640', '70vh', '85vh', '100vh');
  ALTER TABLE "pages_blocks_carousel" ADD COLUMN "mobile_height" "enum_pages_blocks_carousel_mobile_height" DEFAULT '70vh';
  ALTER TABLE "_pages_v_blocks_carousel" ADD COLUMN "mobile_height" "enum__pages_v_blocks_carousel_mobile_height" DEFAULT '70vh';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_carousel" DROP COLUMN "mobile_height";
  ALTER TABLE "_pages_v_blocks_carousel" DROP COLUMN "mobile_height";
  DROP TYPE "public"."enum_pages_blocks_carousel_mobile_height";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_mobile_height";`)
}
