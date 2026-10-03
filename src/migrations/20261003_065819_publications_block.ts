import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_publications_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_publications_publications_locales" (
  	"title" varchar,
  	"authors" jsonb,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_publications_locales" (
  	"intro_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_publications_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_publications_publications_locales" (
  	"title" varchar,
  	"authors" jsonb,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_publications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_publications_locales" (
  	"intro_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_publications_publications" ADD CONSTRAINT "pages_blocks_publications_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_publications_publications_locales" ADD CONSTRAINT "pages_blocks_publications_publications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_publications_publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_publications" ADD CONSTRAINT "pages_blocks_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_publications_locales" ADD CONSTRAINT "pages_blocks_publications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_publications_publications" ADD CONSTRAINT "_pages_v_blocks_publications_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_publications_publications_locales" ADD CONSTRAINT "_pages_v_blocks_publications_publications_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_publications_publications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_publications" ADD CONSTRAINT "_pages_v_blocks_publications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_publications_locales" ADD CONSTRAINT "_pages_v_blocks_publications_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_publications"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_publications_publications_order_idx" ON "pages_blocks_publications_publications" USING btree ("_order");
  CREATE INDEX "pages_blocks_publications_publications_parent_id_idx" ON "pages_blocks_publications_publications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_publications_publications_locales_locale_parent" ON "pages_blocks_publications_publications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_publications_order_idx" ON "pages_blocks_publications" USING btree ("_order");
  CREATE INDEX "pages_blocks_publications_parent_id_idx" ON "pages_blocks_publications" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_publications_path_idx" ON "pages_blocks_publications" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_publications_locales_locale_parent_id_unique" ON "pages_blocks_publications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_publications_publications_order_idx" ON "_pages_v_blocks_publications_publications" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_publications_publications_parent_id_idx" ON "_pages_v_blocks_publications_publications" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_publications_publications_locales_locale_par" ON "_pages_v_blocks_publications_publications_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_publications_order_idx" ON "_pages_v_blocks_publications" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_publications_parent_id_idx" ON "_pages_v_blocks_publications" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_publications_path_idx" ON "_pages_v_blocks_publications" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_publications_locales_locale_parent_id_unique" ON "_pages_v_blocks_publications_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_publications_publications" CASCADE;
  DROP TABLE "pages_blocks_publications_publications_locales" CASCADE;
  DROP TABLE "pages_blocks_publications" CASCADE;
  DROP TABLE "pages_blocks_publications_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_publications_publications" CASCADE;
  DROP TABLE "_pages_v_blocks_publications_publications_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_publications" CASCADE;
  DROP TABLE "_pages_v_blocks_publications_locales" CASCADE;`)
}
