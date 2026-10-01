import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_home_partners_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_home_partners_image_aspect" AS ENUM('landscape', 'square', 'portrait');
  CREATE TYPE "public"."enum_pages_blocks_home_partners_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_home_partners_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_items_media_size" AS ENUM('custom', 'full');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_items_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_columns" AS ENUM('2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_feature_block_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_home_partners_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_home_partners_image_aspect" AS ENUM('landscape', 'square', 'portrait');
  CREATE TYPE "public"."enum__pages_v_blocks_home_partners_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_home_partners_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_items_media_size" AS ENUM('custom', 'full');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_items_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_items_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_columns" AS ENUM('2', '3', '4', '5', '6');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_align" AS ENUM('left', 'center');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_block_link_appearance" AS ENUM('default', 'outline');
  CREATE TABLE "pages_blocks_home_partners_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_home_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_position" "enum_pages_blocks_home_partners_image_position" DEFAULT 'left',
  	"image_aspect" "enum_pages_blocks_home_partners_image_aspect" DEFAULT 'landscape',
  	"gap" numeric DEFAULT 16,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_home_partners_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum_pages_blocks_home_partners_link_appearance" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_home_partners_locales" (
  	"title" jsonb,
  	"description" jsonb,
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"media_size" "enum_pages_blocks_feature_block_items_media_size" DEFAULT 'custom',
  	"media_width" numeric DEFAULT 64,
  	"media_height" numeric,
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_feature_block_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum_pages_blocks_feature_block_items_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_feature_block_items_locales" (
  	"title" jsonb,
  	"description" jsonb,
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_feature_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"columns" "enum_pages_blocks_feature_block_columns" DEFAULT '4',
  	"align" "enum_pages_blocks_feature_block_align" DEFAULT 'left',
  	"enable_link" boolean,
  	"link_type" "enum_pages_blocks_feature_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum_pages_blocks_feature_block_link_appearance" DEFAULT 'default',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_feature_block_locales" (
  	"title" jsonb,
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_home_partners_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_position" "enum__pages_v_blocks_home_partners_image_position" DEFAULT 'left',
  	"image_aspect" "enum__pages_v_blocks_home_partners_image_aspect" DEFAULT 'landscape',
  	"gap" numeric DEFAULT 16,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_home_partners_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum__pages_v_blocks_home_partners_link_appearance" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_home_partners_locales" (
  	"title" jsonb,
  	"description" jsonb,
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"media_size" "enum__pages_v_blocks_feature_block_items_media_size" DEFAULT 'custom',
  	"media_width" numeric DEFAULT 64,
  	"media_height" numeric,
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_feature_block_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum__pages_v_blocks_feature_block_items_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_block_items_locales" (
  	"title" jsonb,
  	"description" jsonb,
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_feature_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"columns" "enum__pages_v_blocks_feature_block_columns" DEFAULT '4',
  	"align" "enum__pages_v_blocks_feature_block_align" DEFAULT 'left',
  	"enable_link" boolean,
  	"link_type" "enum__pages_v_blocks_feature_block_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum__pages_v_blocks_feature_block_link_appearance" DEFAULT 'default',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature_block_locales" (
  	"title" jsonb,
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_home_partners_images" ADD CONSTRAINT "pages_blocks_home_partners_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_partners_images" ADD CONSTRAINT "pages_blocks_home_partners_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_partners" ADD CONSTRAINT "pages_blocks_home_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_home_partners_locales" ADD CONSTRAINT "pages_blocks_home_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_home_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block_items" ADD CONSTRAINT "pages_blocks_feature_block_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block_items" ADD CONSTRAINT "pages_blocks_feature_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block_items_locales" ADD CONSTRAINT "pages_blocks_feature_block_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_block_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block" ADD CONSTRAINT "pages_blocks_feature_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature_block_locales" ADD CONSTRAINT "pages_blocks_feature_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_feature_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_partners_images" ADD CONSTRAINT "_pages_v_blocks_home_partners_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_partners_images" ADD CONSTRAINT "_pages_v_blocks_home_partners_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_partners" ADD CONSTRAINT "_pages_v_blocks_home_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_home_partners_locales" ADD CONSTRAINT "_pages_v_blocks_home_partners_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_home_partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ADD CONSTRAINT "_pages_v_blocks_feature_block_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block_items" ADD CONSTRAINT "_pages_v_blocks_feature_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block_items_locales" ADD CONSTRAINT "_pages_v_blocks_feature_block_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_block_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block" ADD CONSTRAINT "_pages_v_blocks_feature_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature_block_locales" ADD CONSTRAINT "_pages_v_blocks_feature_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_feature_block"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_home_partners_images_order_idx" ON "pages_blocks_home_partners_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_partners_images_parent_id_idx" ON "pages_blocks_home_partners_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_partners_images_image_idx" ON "pages_blocks_home_partners_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_home_partners_order_idx" ON "pages_blocks_home_partners" USING btree ("_order");
  CREATE INDEX "pages_blocks_home_partners_parent_id_idx" ON "pages_blocks_home_partners" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_home_partners_path_idx" ON "pages_blocks_home_partners" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_home_partners_locales_locale_parent_id_unique" ON "pages_blocks_home_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_block_items_order_idx" ON "pages_blocks_feature_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_block_items_parent_id_idx" ON "pages_blocks_feature_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_block_items_media_idx" ON "pages_blocks_feature_block_items" USING btree ("media_id");
  CREATE UNIQUE INDEX "pages_blocks_feature_block_items_locales_locale_parent_id_un" ON "pages_blocks_feature_block_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_feature_block_order_idx" ON "pages_blocks_feature_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_block_parent_id_idx" ON "pages_blocks_feature_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_block_path_idx" ON "pages_blocks_feature_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_feature_block_locales_locale_parent_id_unique" ON "pages_blocks_feature_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_home_partners_images_order_idx" ON "_pages_v_blocks_home_partners_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_partners_images_parent_id_idx" ON "_pages_v_blocks_home_partners_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_partners_images_image_idx" ON "_pages_v_blocks_home_partners_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_home_partners_order_idx" ON "_pages_v_blocks_home_partners" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_home_partners_parent_id_idx" ON "_pages_v_blocks_home_partners" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_home_partners_path_idx" ON "_pages_v_blocks_home_partners" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_home_partners_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_home_partners_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_block_items_order_idx" ON "_pages_v_blocks_feature_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_block_items_parent_id_idx" ON "_pages_v_blocks_feature_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_block_items_media_idx" ON "_pages_v_blocks_feature_block_items" USING btree ("media_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_block_items_locales_locale_parent_id" ON "_pages_v_blocks_feature_block_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_block_order_idx" ON "_pages_v_blocks_feature_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_block_parent_id_idx" ON "_pages_v_blocks_feature_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_block_path_idx" ON "_pages_v_blocks_feature_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_feature_block_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_feature_block_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_home_partners_images" CASCADE;
  DROP TABLE "pages_blocks_home_partners" CASCADE;
  DROP TABLE "pages_blocks_home_partners_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_block_items" CASCADE;
  DROP TABLE "pages_blocks_feature_block_items_locales" CASCADE;
  DROP TABLE "pages_blocks_feature_block" CASCADE;
  DROP TABLE "pages_blocks_feature_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_home_partners_images" CASCADE;
  DROP TABLE "_pages_v_blocks_home_partners" CASCADE;
  DROP TABLE "_pages_v_blocks_home_partners_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_block_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_block" CASCADE;
  DROP TABLE "_pages_v_blocks_feature_block_locales" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_home_partners_image_position";
  DROP TYPE "public"."enum_pages_blocks_home_partners_image_aspect";
  DROP TYPE "public"."enum_pages_blocks_home_partners_link_type";
  DROP TYPE "public"."enum_pages_blocks_home_partners_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_feature_block_items_media_size";
  DROP TYPE "public"."enum_pages_blocks_feature_block_items_link_type";
  DROP TYPE "public"."enum_pages_blocks_feature_block_items_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_feature_block_columns";
  DROP TYPE "public"."enum_pages_blocks_feature_block_align";
  DROP TYPE "public"."enum_pages_blocks_feature_block_link_type";
  DROP TYPE "public"."enum_pages_blocks_feature_block_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_home_partners_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_home_partners_image_aspect";
  DROP TYPE "public"."enum__pages_v_blocks_home_partners_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_home_partners_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_items_media_size";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_items_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_items_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_columns";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_align";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_feature_block_link_appearance";`)
}
