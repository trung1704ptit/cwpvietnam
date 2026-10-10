import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_team" DROP COLUMN "columns";
  ALTER TABLE "team_members" DROP COLUMN "active";
  DROP TYPE "public"."enum_pages_blocks_team_columns";
  DROP TYPE "public"."enum__pages_v_blocks_team_columns";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_team_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_team_columns" AS ENUM('2', '3', '4');
  ALTER TABLE "pages_blocks_team" ADD COLUMN "columns" "enum_pages_blocks_team_columns" DEFAULT '3';
  ALTER TABLE "_pages_v_blocks_team" ADD COLUMN "columns" "enum__pages_v_blocks_team_columns" DEFAULT '3';
  ALTER TABLE "team_members" ADD COLUMN "active" boolean DEFAULT true;`)
}
