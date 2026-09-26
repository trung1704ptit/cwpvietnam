import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_carousel_slides_buttons_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_carousel_slides_buttons_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_blocks_carousel_slides_background_type" AS ENUM('image', 'video');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_slides_buttons_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_slides_buttons_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_slides_background_type" AS ENUM('image', 'video');
  CREATE TABLE "pages_blocks_carousel_slides_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_carousel_slides_buttons_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum_pages_blocks_carousel_slides_buttons_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_carousel_slides_buttons_locales" (
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_type" "enum_pages_blocks_carousel_slides_background_type" DEFAULT 'image',
  	"background_image_id" integer,
  	"video_u_r_l" varchar,
  	"overlay_opacity" numeric DEFAULT 40
  );
  
  CREATE TABLE "pages_blocks_carousel_slides_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"interval" numeric DEFAULT 5,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_slides_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_carousel_slides_buttons_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_appearance" "enum__pages_v_blocks_carousel_slides_buttons_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_slides_buttons_locales" (
  	"link_url" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_type" "enum__pages_v_blocks_carousel_slides_background_type" DEFAULT 'image',
  	"background_image_id" integer,
  	"video_u_r_l" varchar,
  	"overlay_opacity" numeric DEFAULT 40,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_slides_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"autoplay" boolean DEFAULT true,
  	"interval" numeric DEFAULT 5,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_carousel_slides_buttons" ADD CONSTRAINT "pages_blocks_carousel_slides_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slides_buttons_locales" ADD CONSTRAINT "pages_blocks_carousel_slides_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel_slides_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slides" ADD CONSTRAINT "pages_blocks_carousel_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slides" ADD CONSTRAINT "pages_blocks_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_slides_locales" ADD CONSTRAINT "pages_blocks_carousel_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel" ADD CONSTRAINT "pages_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slides_buttons" ADD CONSTRAINT "_pages_v_blocks_carousel_slides_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slides_buttons_locales" ADD CONSTRAINT "_pages_v_blocks_carousel_slides_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel_slides_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slides" ADD CONSTRAINT "_pages_v_blocks_carousel_slides_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slides" ADD CONSTRAINT "_pages_v_blocks_carousel_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slides_locales" ADD CONSTRAINT "_pages_v_blocks_carousel_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel" ADD CONSTRAINT "_pages_v_blocks_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_carousel_slides_buttons_order_idx" ON "pages_blocks_carousel_slides_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_slides_buttons_parent_id_idx" ON "pages_blocks_carousel_slides_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_carousel_slides_buttons_locales_locale_parent_i" ON "pages_blocks_carousel_slides_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_carousel_slides_order_idx" ON "pages_blocks_carousel_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_slides_parent_id_idx" ON "pages_blocks_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_slides_background_image_idx" ON "pages_blocks_carousel_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "pages_blocks_carousel_slides_locales_locale_parent_id_unique" ON "pages_blocks_carousel_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_carousel_order_idx" ON "pages_blocks_carousel" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_parent_id_idx" ON "pages_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_path_idx" ON "pages_blocks_carousel" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_carousel_slides_buttons_order_idx" ON "_pages_v_blocks_carousel_slides_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_slides_buttons_parent_id_idx" ON "_pages_v_blocks_carousel_slides_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_carousel_slides_buttons_locales_locale_paren" ON "_pages_v_blocks_carousel_slides_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_slides_order_idx" ON "_pages_v_blocks_carousel_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_slides_parent_id_idx" ON "_pages_v_blocks_carousel_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_slides_background_image_idx" ON "_pages_v_blocks_carousel_slides" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_carousel_slides_locales_locale_parent_id_uni" ON "_pages_v_blocks_carousel_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_order_idx" ON "_pages_v_blocks_carousel" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_parent_id_idx" ON "_pages_v_blocks_carousel" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_path_idx" ON "_pages_v_blocks_carousel" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_carousel_slides_buttons" CASCADE;
  DROP TABLE "pages_blocks_carousel_slides_buttons_locales" CASCADE;
  DROP TABLE "pages_blocks_carousel_slides" CASCADE;
  DROP TABLE "pages_blocks_carousel_slides_locales" CASCADE;
  DROP TABLE "pages_blocks_carousel" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_slides_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_slides_buttons_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_slides_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_carousel_slides_buttons_link_type";
  DROP TYPE "public"."enum_pages_blocks_carousel_slides_buttons_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_carousel_slides_background_type";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_slides_buttons_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_slides_buttons_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_slides_background_type";`)
}
