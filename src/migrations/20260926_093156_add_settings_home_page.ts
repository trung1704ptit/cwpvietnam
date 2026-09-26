import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" ADD COLUMN "home_page_id" integer;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_home_page_id_pages_id_fk" FOREIGN KEY ("home_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "settings_home_page_idx" ON "settings" USING btree ("home_page_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" DROP CONSTRAINT "settings_home_page_id_pages_id_fk";
  
  DROP INDEX "settings_home_page_idx";
  ALTER TABLE "settings" DROP COLUMN "home_page_id";`)
}
