import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_contact_block_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"icon" varchar DEFAULT 'fa6/FaFacebookF'
  );
  
  CREATE TABLE "pages_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"max_width" numeric,
  	"address_icon" varchar DEFAULT 'lu/LuMapPin',
  	"phone_icon" varchar DEFAULT 'lu/LuPhone',
  	"phone_content" varchar,
  	"email_icon" varchar DEFAULT 'lu/LuMail',
  	"email_email" varchar,
  	"social_icon" varchar DEFAULT 'lu/LuShare2',
  	"map" varchar,
  	"map_height" numeric DEFAULT 450,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_block_locales" (
  	"address_title" varchar,
  	"address_content" varchar,
  	"phone_title" varchar,
  	"email_title" varchar,
  	"social_title" varchar,
  	"social_content" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_contact_block_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"icon" varchar DEFAULT 'fa6/FaFacebookF',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"max_width" numeric,
  	"address_icon" varchar DEFAULT 'lu/LuMapPin',
  	"phone_icon" varchar DEFAULT 'lu/LuPhone',
  	"phone_content" varchar,
  	"email_icon" varchar DEFAULT 'lu/LuMail',
  	"email_email" varchar,
  	"social_icon" varchar DEFAULT 'lu/LuShare2',
  	"map" varchar,
  	"map_height" numeric DEFAULT 450,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_block_locales" (
  	"address_title" varchar,
  	"address_content" varchar,
  	"phone_title" varchar,
  	"email_title" varchar,
  	"social_title" varchar,
  	"social_content" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_contact_block_social_links" ADD CONSTRAINT "pages_blocks_contact_block_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_block" ADD CONSTRAINT "pages_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_block_locales" ADD CONSTRAINT "pages_blocks_contact_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_block_social_links" ADD CONSTRAINT "_pages_v_blocks_contact_block_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_block" ADD CONSTRAINT "_pages_v_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_block_locales" ADD CONSTRAINT "_pages_v_blocks_contact_block_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_block"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_contact_block_social_links_order_idx" ON "pages_blocks_contact_block_social_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_block_social_links_parent_id_idx" ON "pages_blocks_contact_block_social_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_block_order_idx" ON "pages_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_block_parent_id_idx" ON "pages_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_block_path_idx" ON "pages_blocks_contact_block" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_contact_block_locales_locale_parent_id_unique" ON "pages_blocks_contact_block_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_block_social_links_order_idx" ON "_pages_v_blocks_contact_block_social_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_block_social_links_parent_id_idx" ON "_pages_v_blocks_contact_block_social_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_block_order_idx" ON "_pages_v_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_block_parent_id_idx" ON "_pages_v_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_block_path_idx" ON "_pages_v_blocks_contact_block" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_contact_block_locales_locale_parent_id_uniqu" ON "_pages_v_blocks_contact_block_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_contact_block_social_links" CASCADE;
  DROP TABLE "pages_blocks_contact_block" CASCADE;
  DROP TABLE "pages_blocks_contact_block_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_block_social_links" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_block" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_block_locales" CASCADE;`)
}
