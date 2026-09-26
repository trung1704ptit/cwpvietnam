import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const tables = ['pages_blocks_carousel_slides_locales', '_pages_v_blocks_carousel_slides_locales']

// Converts existing plain text into Lexical JSON, one paragraph per line.
const toLexical = (table: string) => `
  ALTER TABLE "${table}" ADD COLUMN "text_rich" jsonb;
  UPDATE "${table}" SET "text_rich" = jsonb_build_object('root', jsonb_build_object(
    'type', 'root', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
    'children', (
      SELECT jsonb_agg(jsonb_build_object(
        'type', 'paragraph', 'format', '', 'indent', 0, 'version', 1, 'direction', 'ltr',
        'textFormat', 0, 'textStyle', '',
        'children', CASE WHEN line = '' THEN '[]'::jsonb ELSE jsonb_build_array(jsonb_build_object(
          'type', 'text', 'text', line, 'format', 0, 'style', '', 'mode', 'normal', 'detail', 0, 'version', 1
        )) END
      ) ORDER BY ord)
      FROM regexp_split_to_table("text", E'\\r?\\n') WITH ORDINALITY AS lines(line, ord)
    )
  ))
  WHERE "text" IS NOT NULL AND btrim("text") <> '';
  ALTER TABLE "${table}" DROP COLUMN "text";
  ALTER TABLE "${table}" RENAME COLUMN "text_rich" TO "text";
`

const toPlainText = (table: string) => `
  ALTER TABLE "${table}" ADD COLUMN "text_plain" varchar;
  UPDATE "${table}" SET "text_plain" = (
    SELECT string_agg(COALESCE((
      SELECT string_agg(child->>'text', '') FROM jsonb_array_elements(paragraph->'children') AS child
    ), ''), E'\\n')
    FROM jsonb_array_elements("text"->'root'->'children') AS paragraph
  )
  WHERE "text" IS NOT NULL;
  ALTER TABLE "${table}" DROP COLUMN "text";
  ALTER TABLE "${table}" RENAME COLUMN "text_plain" TO "text";
`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(tables.map(toLexical).join('\n')))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql.raw(tables.map(toPlainText).join('\n')))
}
