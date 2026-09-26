import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_carousel_slides" ADD COLUMN "background_video_id" integer;
  ALTER TABLE "_pages_v_blocks_carousel_slides" ADD COLUMN "background_video_id" integer;
  ALTER TABLE "pages_blocks_carousel_slides" ADD CONSTRAINT "pages_blocks_carousel_slides_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_slides" ADD CONSTRAINT "_pages_v_blocks_carousel_slides_background_video_id_media_id_fk" FOREIGN KEY ("background_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_carousel_slides_background_video_idx" ON "pages_blocks_carousel_slides" USING btree ("background_video_id");
  CREATE INDEX "_pages_v_blocks_carousel_slides_background_video_idx" ON "_pages_v_blocks_carousel_slides" USING btree ("background_video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_carousel_slides" DROP CONSTRAINT "pages_blocks_carousel_slides_background_video_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_carousel_slides" DROP CONSTRAINT "_pages_v_blocks_carousel_slides_background_video_id_media_id_fk";
  
  DROP INDEX "pages_blocks_carousel_slides_background_video_idx";
  DROP INDEX "_pages_v_blocks_carousel_slides_background_video_idx";
  ALTER TABLE "pages_blocks_carousel_slides" DROP COLUMN "background_video_id";
  ALTER TABLE "_pages_v_blocks_carousel_slides" DROP COLUMN "background_video_id";`)
}
