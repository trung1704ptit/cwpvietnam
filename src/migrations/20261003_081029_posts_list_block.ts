import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_posts_list_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_blocks_posts_list_columns" AS ENUM('1', '2', '3');
  CREATE TABLE "pages_blocks_posts_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_posts_list_columns" DEFAULT '2',
  	"posts_per_page" numeric DEFAULT 6,
  	"show_author" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_posts_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_posts_list_columns" DEFAULT '2',
  	"posts_per_page" numeric DEFAULT 6,
  	"show_author" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_posts_list" ADD CONSTRAINT "pages_blocks_posts_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_posts_list" ADD CONSTRAINT "_pages_v_blocks_posts_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_posts_list_order_idx" ON "pages_blocks_posts_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_posts_list_parent_id_idx" ON "pages_blocks_posts_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_posts_list_path_idx" ON "pages_blocks_posts_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_posts_list_order_idx" ON "_pages_v_blocks_posts_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_posts_list_parent_id_idx" ON "_pages_v_blocks_posts_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_posts_list_path_idx" ON "_pages_v_blocks_posts_list" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_posts_list" CASCADE;
  DROP TABLE "_pages_v_blocks_posts_list" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_posts_list_columns";
  DROP TYPE "public"."enum__pages_v_blocks_posts_list_columns";`)
}
