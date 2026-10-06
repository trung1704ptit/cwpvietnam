import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_backups_source" AS ENUM('manual', 'pre-restore', 'upload');
  CREATE TABLE "backups_restore_history" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"restored_at" timestamp(3) with time zone,
  	"restored_by" varchar,
  	"safety_backup_version" numeric
  );
  
  CREATE TABLE "backups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"note" varchar,
  	"version" numeric,
  	"source" "enum_backups_source",
  	"created_by" varchar,
  	"schema_version" varchar,
  	"table_count" numeric,
  	"total_rows" numeric,
  	"media_count" numeric,
  	"backup_created_at" timestamp(3) with time zone,
  	"migrations" jsonb,
  	"prefix" varchar DEFAULT 'backups',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "backups_id" integer;
  ALTER TABLE "backups_restore_history" ADD CONSTRAINT "backups_restore_history_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."backups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "backups_restore_history_order_idx" ON "backups_restore_history" USING btree ("_order");
  CREATE INDEX "backups_restore_history_parent_id_idx" ON "backups_restore_history" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "backups_version_idx" ON "backups" USING btree ("version");
  CREATE INDEX "backups_updated_at_idx" ON "backups" USING btree ("updated_at");
  CREATE INDEX "backups_created_at_idx" ON "backups" USING btree ("created_at");
  CREATE UNIQUE INDEX "backups_filename_idx" ON "backups" USING btree ("filename");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_backups_fk" FOREIGN KEY ("backups_id") REFERENCES "public"."backups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_backups_id_idx" ON "payload_locked_documents_rels" USING btree ("backups_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "backups_restore_history" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "backups" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "backups_restore_history" CASCADE;
  DROP TABLE "backups" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_backups_fk";
  
  DROP INDEX "payload_locked_documents_rels_backups_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "backups_id";
  DROP TYPE "public"."enum_backups_source";`)
}
