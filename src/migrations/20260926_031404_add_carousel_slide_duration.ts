import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_carousel_slides" ADD COLUMN "duration" numeric;
  ALTER TABLE "_pages_v_blocks_carousel_slides" ADD COLUMN "duration" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_carousel_slides" DROP COLUMN "duration";
  ALTER TABLE "_pages_v_blocks_carousel_slides" DROP COLUMN "duration";`)
}
