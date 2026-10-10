import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * `fullName` and `name` become localized. Existing names are copied into every locale, so both
 * languages start from the current name and can then be edited separately.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX "team_members_name_idx";
  ALTER TABLE "team_members_locales" ADD COLUMN "full_name" jsonb;
  ALTER TABLE "team_members_locales" ADD COLUMN "name" varchar;

  INSERT INTO "team_members_locales" ("_locale", "_parent_id", "full_name", "name")
  SELECT locale.code::"_locales", member."id", member."full_name", member."name"
  FROM "team_members" member
  CROSS JOIN (VALUES ('vi'), ('en')) AS locale(code)
  ON CONFLICT ("_locale", "_parent_id") DO UPDATE
  SET "full_name" = EXCLUDED."full_name", "name" = EXCLUDED."name";

  ALTER TABLE "team_members_locales" ALTER COLUMN "full_name" SET NOT NULL;
  CREATE INDEX "team_members_name_idx" ON "team_members_locales" USING btree ("name","_locale");
  ALTER TABLE "team_members" DROP COLUMN "full_name";
  ALTER TABLE "team_members" DROP COLUMN "name";`)
}

/** Keeps the English name (the default locale), falling back to Vietnamese. */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP INDEX "team_members_name_idx";
  ALTER TABLE "team_members" ADD COLUMN "full_name" jsonb;
  ALTER TABLE "team_members" ADD COLUMN "name" varchar;

  UPDATE "team_members" member
  SET "full_name" = localized."full_name", "name" = localized."name"
  FROM (
    SELECT DISTINCT ON ("_parent_id") "_parent_id", "full_name", "name"
    FROM "team_members_locales"
    WHERE "full_name" IS NOT NULL
    ORDER BY "_parent_id", ("_locale" = 'en') DESC
  ) localized
  WHERE localized."_parent_id" = member."id";

  ALTER TABLE "team_members" ALTER COLUMN "full_name" SET NOT NULL;
  CREATE INDEX "team_members_name_idx" ON "team_members" USING btree ("name");
  ALTER TABLE "team_members_locales" DROP COLUMN "full_name";
  ALTER TABLE "team_members_locales" DROP COLUMN "name";`)
}
