import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_feature_block" ADD COLUMN "max_width" numeric;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD COLUMN "max_width" numeric;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_feature_block" DROP COLUMN "max_width";
  ALTER TABLE "_pages_v_blocks_feature_block" DROP COLUMN "max_width";`)
}
