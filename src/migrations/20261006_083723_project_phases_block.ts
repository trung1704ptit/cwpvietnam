import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_project_phases_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "pages_blocks_project_phases_phases_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_project_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"background_color" varchar DEFAULT '#fff5f7',
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_project_phases_locales" (
  	"title" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_project_phases_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_phases_phases_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_project_phases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"background_color" varchar DEFAULT '#fff5f7',
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_phases_locales" (
  	"title" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_project_phases_phases" ADD CONSTRAINT "pages_blocks_project_phases_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_phases_phases_locales" ADD CONSTRAINT "pages_blocks_project_phases_phases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_phases_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_phases" ADD CONSTRAINT "pages_blocks_project_phases_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_phases" ADD CONSTRAINT "pages_blocks_project_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_phases_locales" ADD CONSTRAINT "pages_blocks_project_phases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_project_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_phases_phases" ADD CONSTRAINT "_pages_v_blocks_project_phases_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_phases_phases_locales" ADD CONSTRAINT "_pages_v_blocks_project_phases_phases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_phases_phases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_phases" ADD CONSTRAINT "_pages_v_blocks_project_phases_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_phases" ADD CONSTRAINT "_pages_v_blocks_project_phases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_phases_locales" ADD CONSTRAINT "_pages_v_blocks_project_phases_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_project_phases"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_project_phases_phases_order_idx" ON "pages_blocks_project_phases_phases" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_phases_phases_parent_id_idx" ON "pages_blocks_project_phases_phases" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_project_phases_phases_locales_locale_parent_id_" ON "pages_blocks_project_phases_phases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_project_phases_order_idx" ON "pages_blocks_project_phases" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_phases_parent_id_idx" ON "pages_blocks_project_phases" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_phases_path_idx" ON "pages_blocks_project_phases" USING btree ("_path");
  CREATE INDEX "pages_blocks_project_phases_background_image_idx" ON "pages_blocks_project_phases" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "pages_blocks_project_phases_locales_locale_parent_id_unique" ON "pages_blocks_project_phases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_project_phases_phases_order_idx" ON "_pages_v_blocks_project_phases_phases" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_phases_phases_parent_id_idx" ON "_pages_v_blocks_project_phases_phases" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_project_phases_phases_locales_locale_parent_" ON "_pages_v_blocks_project_phases_phases_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_project_phases_order_idx" ON "_pages_v_blocks_project_phases" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_phases_parent_id_idx" ON "_pages_v_blocks_project_phases" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_phases_path_idx" ON "_pages_v_blocks_project_phases" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_project_phases_background_image_idx" ON "_pages_v_blocks_project_phases" USING btree ("background_image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_project_phases_locales_locale_parent_id_uniq" ON "_pages_v_blocks_project_phases_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_project_phases_phases" CASCADE;
  DROP TABLE "pages_blocks_project_phases_phases_locales" CASCADE;
  DROP TABLE "pages_blocks_project_phases" CASCADE;
  DROP TABLE "pages_blocks_project_phases_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_project_phases_phases" CASCADE;
  DROP TABLE "_pages_v_blocks_project_phases_phases_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_project_phases" CASCADE;
  DROP TABLE "_pages_v_blocks_project_phases_locales" CASCADE;`)
}
