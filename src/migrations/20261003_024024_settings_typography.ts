import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_settings_font_family" AS ENUM('lato', 'beVietnamPro', 'inter', 'roboto', 'openSans', 'montserrat', 'nunito', 'notoSans');
  ALTER TABLE "settings" ADD COLUMN "font_family" "enum_settings_font_family" DEFAULT 'lato' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "base_font_size" numeric DEFAULT 18 NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings" DROP COLUMN "font_family";
  ALTER TABLE "settings" DROP COLUMN "base_font_size";
  DROP TYPE "public"."enum_settings_font_family";`)
}
